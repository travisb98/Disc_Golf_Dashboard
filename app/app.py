from flask import Flask, render_template, redirect, Response, request
from flask_pymongo import PyMongo
from datetime import datetime as dt
import pandas as pd
import json

# Create an instance of Flask
app = Flask(__name__)

app.config.from_object('config.Config')

# Use PyMongo to establish Mongo connection
mongo = PyMongo(app, uri=f"mongodb+srv://{app.config['DB_USERNAME']}:{app.config['DB_PASSWORD']}@{app.config['DB_HOST']}/disc_golf?retryWrites=true&w=majority")

states = {
    "AL": "Alabama",
    "AK": "Alaska",
    "AS": "American Samoa",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "DC": "District Of Columbia",
    "FM": "Federated States Of Micronesia",
    "FL": "Florida",
    "GA": "Georgia",
    "GU": "Guam",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MH": "Marshall Islands",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "MP": "Northern Mariana Islands",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PW": "Palau",
    "PA": "Pennsylvania",
    "PR": "Puerto Rico",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VI": "Virgin Islands",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming"
}

def find_courses(filters = None):

    # Set base filter value in case we pass in no additional filter
    db_filter = [{ "_id" : { "$exists": True } }]

    if (filters is not None):

        if (not all(filters["private"].values())):
            if (filters["private"]['showPublic']):
                db_filter.append({"private": False})
            else:
                db_filter.append({"private": True})

        if (not all(filters["pay"].values())):
            if (filters["pay"]['showFree']):
                db_filter.append({"pay": False})
            else:
                db_filter.append({"pay": True})

        holes = []
        if (not all(filters["holes"].values())):
            if (filters["holes"]['showLessThan9']):
                holes.extend(range(1, 9))
            if (filters["holes"]['show9']):
                holes.append(9)
            if (filters["holes"]['show10To17']):
                holes.extend(range(10, 18))
            if (filters["holes"]['show18']):
                holes.append(18)
            if (filters["holes"]['showMoreThan18']):
                holes.extend(range(19, 101))

            db_filter.append({"holes": {"$in": holes}})

        if (not all(filters["water"].values())):
            if (filters["water"]['showWithWater']):
                db_filter.append({"water": True})
            else:
                db_filter.append({"water": False})

        terrain = []
        if (not all(filters["terrain"].values())):
            if (filters["terrain"]['showLightlyWooded']):
                terrain.append('Lightly Wooded')
            if (filters["terrain"]['showModeratelyWooded']):
                terrain.append('Moderately Wooded')
            if (filters["terrain"]['showHeavilyWooded']):
                terrain.append('Heavily Wooded')
            
            db_filter.append({"terrain": {"$in": terrain}})

        landscape = []
        if (not all(filters["landscape"].values())):
            if (filters["landscape"]['showMostlyFlat']):
                landscape.append('Mostly Flat')
            if (filters["landscape"]['showModeratelyHilly']):
                landscape.append('Moderately Hilly')
            if (filters["landscape"]['showVeryHilly']):
                landscape.append('Very Hilly')
            
            db_filter.append({"landscape": {"$in": landscape}})

    # Get some data
    cursor = mongo.db.courses.find({"$and": db_filter}) 
    
    # Converting cursor to the list of  
    # dictionaries 
    list_cur = list(cursor) 
    
    if (len(list_cur) > 0):
        # Converting to the DataFrame 
        df = pd.DataFrame(list_cur)

        # Pull state out of the location object and update it to the required format
        df['state_name'] = [states[d['state']].replace(' ', '-').lower() for d in df.location]
        df['state_abbr'] = [d['state'] for d in df.location]

        return df.drop(columns=['_id', 'location'])
    else:
        return pd.DataFrame()


@app.route("/")
def home():
    features = list(mongo.db.parameters.find())

    return render_template("index.html", features=features)

@app.route("/api/v1/Courses")
def get_courses():

    df = find_courses()

    # return some data
    return Response(df.to_json(orient="records"), mimetype='application/json')

@app.route("/api/v1/FeatureAggregate")
def get_feature_aggregate():

    filters = json.loads(request.headers["Filters"])

    df = find_courses(filters)

    # here we want to get the value of feature and aggregate (i.e. ?feat1=some-value)
    primary_metric = list(mongo.db.parameters.find({"parameter": request.args.get('feat1')}))[0]
    secondary_metric = list(mongo.db.parameters.find({"parameter": request.args.get('feat2')}))[0]

    data = {}

    data['primary_label'] = primary_metric['pretty_name']
    data['secondary_label'] = secondary_metric['pretty_name']

    if (len(df) > 0):

        df = df.groupby(['state_name', 'state_abbr']).agg({
            primary_metric['parameter']: primary_metric['agg'],
            secondary_metric['parameter']: secondary_metric['agg']
        })

        df = df.reset_index()

        if primary_metric['is_percent']:
            df[primary_metric['parameter']] = [round(x*100, 2) for x in df[primary_metric['parameter']]]
        else:
            df[primary_metric['parameter']] = [round(x, 2) for x in df[primary_metric['parameter']]]

        if secondary_metric['is_percent']:
            df[secondary_metric['parameter']] = [round(x*100, 2)  for x in df[secondary_metric['parameter']]]
        else:
            df[secondary_metric['parameter']] = [round(x, 2) for x in df[secondary_metric['parameter']]]

        df = df.rename({primary_metric['parameter']:"primary_feature",secondary_metric['parameter']:"secondary_feature"}, axis='columns')

        
        data['data'] = df.to_dict('records')
    else:
        data['data'] = df.to_dict()

    json_data = json.dumps(data)

    # return some data
    return Response(json_data, mimetype='application/json')

@app.route("/api/v1/TestData")
def get_test_data():

    df = find_courses()

    primary_feature = 'rating'
    secondary_feature = 'length_ft'

    features = [primary_feature, secondary_feature]

    df = df.groupby(['state_name', 'state_abbr'])[features].agg(['mean'])

    df.columns = df.columns.droplevel(1)

    df = df.rename({primary_feature:"primary_feature",secondary_feature:"secondary_feature"}, axis='columns') 

    df = df.reset_index()

    data = {}

    data['primary_label'] = "Average Rating"
    data['secondary_label'] = "Average Length (ft)"
    data['data'] = df.to_dict('records')

    json_data = json.dumps(data)

    # return some data
    return Response(json_data, mimetype='application/json')

if __name__ == "__main__":
    app.run(debug=True)