
// d3.json("/api/v1/FeatureAggregate?feature=holes&aggregate=mean")
// .header("holes", 19)
// .get(function(error, data) {
//     console.log(data);
// })


///// function for returning all the variables used in multiple other functions
function unpacker(data){


    /////// i need to create 2 input variables. One for the feature and one for the aggregate function(mean, etc)

    /// makes a list of the state abbreviations that will be used on the pop ups
    var locations = data.data.map(item => item.state_abbr);
    // console.log(locations);

    ///// text for the pop-up when hovering over a state
    var text = data.data.map(item => item.state_name);
    // console.log(text);

    // gets the label for the first data point called from the api
    var primary_label=data.primary_label;


    /// gets a list of the main feature well be graphing
    ///// remove parsing once api changes
    var primary_feature_list = data.data.map(item => parseFloat(item.primary_feature));
    // console.log(primary_feature_list);

    //// finding the max number in the data set
    var max = Math.max.apply(Math,primary_feature_list);

    //// finding the min number in the data set
    var min = Math.min.apply(Math,primary_feature_list);

    //// finding the state name with the max number in the data set
    var topStateName = data.data.find(item => item.primary_feature === max).state_name;

    // console.log(topStateName);

    ///// finding the state with the min number in the data set
    var bottomStateName = data.data.find(item => item.primary_feature == min).state_name;
    // console.log(bottomStateName);

    return [locations, text, primary_label, primary_feature_list, max,min, topStateName, bottomStateName];

}

/////// this function will simply return the data we need for maping. We use it in the initial maping function and the map updating function
function mapDataLayout(data){

    //////// using the unpacker function to delare all the variables we'll need
    var [locations,text,primary_label,primary_feature_list,max,min,topStateName,bottomStateName]=unpacker(data);

    /// simplified green yellow red color scale
    var colorScale = [[0, 'green'], [0.5, 'yellow'],[1, 'red']];

    /// simplified green yellow red color scale
    var colorScale = [[0, 'white'],[1, 'FF8000']];

    ///// data for the choropleth map
    var mapData = [{
        type: 'choropleth',
        locationmode: 'USA-states',
        locations: locations,
        z: primary_feature_list,
        text: text,
        zmin: min,
        zmax: max,
        colorscale: colorScale,
        colorbar: {
            title: primary_label,
            thickness: 10
        },
        marker: {
            line:{
                color: 'rgb(255,255,255)',
                width: 2
            }
        }
    }];
    //// layout for the choropleth map
    var mapLayout = {
        title: primary_label+' per State',
        dragmode:false,////// turns off scroll zoom and pan
        geo:{
            scope: 'usa'
        }
    };

    // return [mapData, mapLayout];
    return Plotly.react("choro_sub1", mapData, mapLayout, {showLink: false});
};



////// main function for making the choropleth map
function makeTheChoro(data){
    ///// adds a new sub div so I can add a min and a max pane
    d3.select('#choropleth').append('div').attr('id','choro_sub1');

    /////// runs the map react function
    mapDataLayout(data);

}

///// function that creates an info pane about the highest and lowest states
function choroPane(data){

    //////// using the unpacker function to delare all the variables we'll need
    var [locations,text,primary_label,primary_feature_list,max,min,topStateName,bottomStateName]=unpacker(data);

    d3.select('#choropleth')/// selecting the main choropleth,
        .append('div').attr('id','choro_sub2').classed('card',true)//// adding the card div
        .append('div').classed('card-body',true).html(`
        <h3>Highest ${primary_label}:</h3> ${topStateName.toUpperCase()} at ${max.toPrecision(3)}<br>
        <h3>Lowest ${primary_label}:</h3>${bottomStateName.toUpperCase()} at ${min.toPrecision(3)}`);////appending the card body div . max is shortened  using toPrecision()
};

function updatePane(data){
    ///////////// i should make a dfunction to update the pane here

};

//// function to update the chropleth map
function updateChoro(data){

    // alert("update function was triggered");
    console.log("update function was triggered")

    mapDataLayout(data)
    
};


// ///// api that runs on start, creating the choropleth and the info card
d3.json("/api/v1/FeatureAggregate?feat1=holes&feat2=rating").get(function(error, data) {
    console.log("Start up api call")

    // console.log(data);
    // this function will make the choropleth map
    makeTheChoro(data);

    //// this makes the info pan with the highest and lowest stat
    choroPane(data);
    //// here for testing
    // unpacker(data);

});//// I should add error handling here



///// defining the filter button. For now Im just using this to update the choropleth color on click
var filter_button = d3.select("#filter-btn");

filter_button.on('click',function(){
    console.log("button was clicked")
    ///// need to pass user selected variables to the API call below 
    // var user_feature;
    // var user_agg;
    ////// also will probably need variables for filtering



    d3.json("/api/v1/FeatureAggregate?feat1=rating&feat2=holes").get(function(error, data){

        console.log("Second API call triggered button")
        // console.log(data);

        //////////////
        ////////////// need to write a function to update the info pane
        console.log("need to update the info pane here")

        ///// fucntion that updates the choropleth map
        updateChoro(data);
        
    });

});


