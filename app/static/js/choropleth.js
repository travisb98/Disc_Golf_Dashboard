
// d3.json("/api/v1/FeatureAggregate?feature=holes&aggregate=mean")
// .header("holes", 19)
// .get(function(error, data) {
//     console.log(data);
// })





//// make a basic dictionary that returns a pretty looking title based on the user_var






function makeTheChoro(data){


    ////// for the sake of simplicity, im going to ignore the secondary dataset for now since we only need one for the choropleth
    //.... heres the code we could use for it though just in case we wanna use the second dataset
    // ///////////////////////////////////////////////////////////////
    // var secondary_label =data.secondary_label; 
    // var secondary_feature = data.data.map(item => item.secondary_feature);
    // ///////////////////////////////////////////////////////////////

    /// makes a list of the state abbreviations that will be used on the pop ups
    var locations = data.data.map(item => item.state_abbr);


    ///// text for the pop-up when hovering over a state
    var text = data.data.map(item => item.state_name);
    // gets the label for the first data point called from the api
    var primary_label=data.primary_label;


    /// gets a list of 
    var primary_feature = data.data.map(item => item.primary_feature);

    
    ///// this would be uncessary if i replace variables
    var z_list = primary_feature;
    //// finding the max in the data set
    var z_max = Math.max.apply(Math,z_list);
    //// finding the min in the data set
    var z_min = Math.min.apply(Math,z_list);

    /// simplified red green blue color scale
    var colorScale = [[0, 'green'], [0.5, 'yellow'],[1, 'red']];



        ///// data for the choropleth map
        var mapData = [{
            type: 'choropleth',
            locationmode: 'USA-states',
            locations: locations,
            z: z_list,
            text: text,
            zmin: z_min,// should i make the min the min of the data or zero???
            zmax: z_max,
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
       
        ////// if the choroPane function doesn't work out, use this block instead of the one below
        ////// use this one instead of the one below if you just want to attach it to the main choropleth div
        // Plotly.newPlot("choropleth", mapData, mapLayout, {showLink: false});

        ///// adds a new sub div so I can add a min and a max pane
        d3.select('#choropleth').append('div').attr('id','choro_sub1');
        Plotly.newPlot("choro_sub1", mapData, mapLayout, {showLink: false});




}

///// in this function Im going to make an info card listing the minimum and maximum states
function choroPane(data){


    ///// i think i could put all these variable delcarations into an unpacking function
    var primary_feature_list = data.data.map(item => item.primary_feature)

    var primary_label=data.primary_label;

    var max = Math.max.apply(Math,primary_feature_list);

    var min = Math.min.apply(Math,primary_feature_list);

    var topStateName = data.data.find(item => item.primary_feature == max).state_name;

    var bottomStateName = data.data.find(item => item.primary_feature == min).state_name;



    // console.log(topStateName);


    d3.select('#choropleth')/// selecting the main choropleth,
        .append('div').attr('id','choro_sub2').classed('card',true)//// adding the card div
        .append('div').classed('card-body',true).html(`
        <h3>Highest ${primary_label}:</h3> ${topStateName.toUpperCase()} at ${max.toPrecision(3)}<br>
        <h3>Lowest ${primary_label}:</h3>${bottomStateName.toUpperCase()} at ${min.toPrecision(3)}`);////appending the card body div . max is shortened  using toPrecision()
};







d3.json("/api/v1/TestData").get(function(error, data) {
    // console.log(data);
    //// this function will make the choropleth map
    makeTheChoro(data);

    ///// make function to update choropleth



    ////// this makes the info pan with the highest and lowest stat
    choroPane(data);
    
});//// I should add error handling here



// d3.json("DiscData.json").get(function(data){
//     console.log(data);
// });


// console.log(d3.select('#choropleth'));

// console.log(d3.select('#choro_sub1'));