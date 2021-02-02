from flask import Flask, render_template, redirect, Response, request
from flask_pymongo import PyMongo
from datetime import datetime as dt
import pandas as pd

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

def find_courses(holes = None):

    # _id will always be true but we may not have any other filter value
    db_filter = [{ "_id" : { "$exists": True } }]   

    if not holes is None:
        db_filter.append({"holes": { "$gte": holes}})

    # print(db_filter)

    # Get some data
    cursor = mongo.db.courses.find({"$and": db_filter}) 
    
    # Converting cursor to the list of  
    # dictionaries 
    list_cur = list(cursor) 
    
    # Converting to the DataFrame 
    df = pd.DataFrame(list_cur)

    df['state_name'] = [states[d['state']].replace(' ', '-').lower() for d in df.location]
    df['state_abbr'] = [d['state'] for d in df.location]

    return df.drop(columns=['_id', 'location'])


@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/v1/Courses")
def get_courses():

    df = find_courses()

    # return some data
    return Response(df.to_json(orient="records"), mimetype='application/json')

@app.route("/api/v1/FeatureAggregate")
def get_feature_aggregate():

    # here we want to get the value of feature and aggregate (i.e. ?feature=some-value)
    feature = request.args.get('feature')
    aggregate = request.args.get('aggregate')

    # holes = int(request.headers['holes'])

    df = find_courses()

    df = df.groupby(['state_name', 'state_abbr']).agg([aggregate])[feature]

    df = df.rename(columns={
        aggregate:feature
    }).reset_index()

    # return some data
    return Response(df.to_json(orient="records"), mimetype='application/json')

@app.route("/api/v1/TestData")
def get_test_data():

    df = find_courses()

    df = df.groupby(['state_name', 'state_abbr'])['rating', 'length_ft'].agg(['mean'])

    df.columns = df.columns.droplevel(1)
    df = df.reset_index()

    # return some data
    return Response(df.to_json(orient="records"), mimetype='application/json')

if __name__ == "__main__":
    app.run(debug=True)