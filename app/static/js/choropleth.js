
// d3.json("/api/v1/FeatureAggregate?feature=holes&aggregate=mean")
// .header("holes", 19)
// .get(function(error, data) {
//     console.log(data);
// })
//// makes output titlecase
function titleCase(str) {
    return str.toLowerCase().split(' ').map(function(word) {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }


///// function for returning all the variables used in multiple other functions
function unpacker(data){

    /////// i need to create 2 input variables. One for the feature and one for the aggregate function(mean, etc)

    /// makes a list of the state abbreviations that will be used on the pop ups
    var locations = data.data.map(item => item.state_abbr.toUpperCase());
    // console.log(locations);

    ///// text for the pop-up when hovering over a state
    var text = data.data.map(item => titleCase(item.state_name.replace("-"," ")));
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
    
    return [locations, text, primary_label, primary_feature_list, max,min];

}

/////// this function will simply return the data we need for maping. We use it in the initial maping function and the map updating function
function mapDataLayout(data){

    //////// using the unpacker function to delare all the variables we'll need
    var [locations,text,primary_label,primary_feature_list,max,min]=unpacker(data);

    /// simplified green yellow red color scale
    var colorScale = [[0, 'FCEBC2'],[1, 'F2AD0C']];

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
            thickness: 10
        },
        marker: {
            line:{
                color: 'rgb(0,0,0)',
                width: 1
            }
        }
    }];
    //// layout for the choropleth map
    var mapLayout = {
        title: primary_label+' by State',
        dragmode:false,////// turns off scroll zoom and pan
        geo:{
            scope: 'usa',
            scale:5
        }
    };

    // return [mapData, mapLayout];
    return Plotly.react("choropleth", mapData, mapLayout, {showLink: false});
};









