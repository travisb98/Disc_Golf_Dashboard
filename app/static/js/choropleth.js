
// d3.json("/api/v1/FeatureAggregate?feature=holes&aggregate=mean")
// .header("holes", 19)
// .get(function(error, data) {
//     console.log(data);
// })


///// make

///// function for returning all the variables used in multiple other functions
function unpacker(data){

    /// makes a list of the state abbreviations that will be used on the pop ups
    var locations = data.data.map(item => item.state_abbr);

    ///// text for the pop-up when hovering over a state
    var text = data.data.map(item => item.state_name);

    // gets the label for the first data point called from the api
    var primary_label=data.primary_label;

    /// gets a list of the main feature well be graphing
    var primary_feature_list = data.data.map(item => item.primary_feature);

    //// finding the max number in the data set
    var max = Math.max.apply(Math,primary_feature_list);

    //// finding the min number in the data set
    var min = Math.min.apply(Math,primary_feature_list);

    //// finding the state name with the max number in the data set
    var topStateName = data.data.find(item => item.primary_feature == max).state_name;

    ///// finding the state with the min number in the data set
    var bottomStateName = data.data.find(item => item.primary_feature == min).state_name;

    return [locations, text, primary_label, primary_feature_list, max,min, topStateName, bottomStateName];

}

function secondaryUnpacker(data){
    /// makes a list of the state abbreviations that will be used on the pop ups
    var locations = data.data.map(item => item.state_abbr);

    ///// text for the pop-up when hovering over a state
    var text = data.data.map(item => item.state_name);

    // gets the label for the first data point called from the api
    var secondary_label=data.secondary_Label;

    /// gets a list of the main feature well be graphing
    var secondary_feature_list = data.data.map(item => item.secondary_feature);

    

    //// finding the max number in the data set
    var max = Math.max.apply(Math,secondary_feature_list);
    // console.log(max);
    //// finding the min number in the data set
    var min = Math.min.apply(Math,secondary_feature_list);

    // console.log(min);

    //// finding the state name with the max number in the data set
    var topStateName = data.data.find(item => item.secondary_feature == max).state_name;

    ///// finding the state with the min number in the data set
    var bottomStateName = data.data.find(item => item.secondary_feature== min).state_name;

    return [locations, text, secondary_label, secondary_feature_list, max,min, topStateName, bottomStateName];

};






////// main function for making the choropleth map
function makeTheChoro(data){

    //////// using the unpacker function to delare all the variables we'll need
    var [locations,text,primary_label,primary_feature_list,max,min,topStateName,bottomStateName]=unpacker(data);

    /// simplified green yellow red color scale
    var colorScale = [[0, 'green'], [0.5, 'yellow'],[1, 'red']];

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
       
        ////// if the choroPane function doesn't work out, use this block instead of the one below
        ////// use this one instead of the one below if you just want to attach it to the main choropleth div
        // Plotly.newPlot("choropleth", mapData, mapLayout, {showLink: false});

        ///// adds a new sub div so I can add a min and a max pane
        d3.select('#choropleth').append('div').attr('id','choro_sub1');
        Plotly.newPlot("choro_sub1", mapData, mapLayout, {showLink: false});

}

///// in this function Im going to make an info card listing the minimum and maximum states
function choroPane(data){

    //////// using the unpacker function to delare all the variables we'll need
    var [locations,text,primary_label,primary_feature_list,max,min,topStateName,bottomStateName]=unpacker(data);

    d3.select('#c')/// selecting the main choropleth,
        .append('div').attr('id','choro_sub2').classed('card',true)//// adding the card div
        .append('div').classed('card-body',true).html(`
        <h3>Highest ${primary_label}:</h3> ${topStateName.toUpperCase()} at ${max.toPrecision(3)}<br>
        <h3>Lowest ${primary_label}:</h3>${bottomStateName.toUpperCase()} at ${min.toPrecision(3)}`);////appending the card body div . max is shortened  using toPrecision()
};







function updateChoro(data){

    // //////// using the unpacker function to delare all the variables we'll need
    // var [locations,text,primary_label,primary_feature_list,max,min,topStateName,bottomStateName]=unpacker(data);

    var [locations, text, secondary_label, secondary_feature_list, max,min, topStateName, bottomStateName]=secondaryUnpacker(data);




            ///// data for the choropleth map
            var data_update = [{
                locations: locations,
                z: secondary_feature_list,
                text: text,
                zmin: min,
                zmax: max,
                colorbar: {
                    title: secondary_label,
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
            var layout_update = {title: secondary_label+' per State'};





    Plotly.restyle('choropleth',data_update);

    Plotly.relayout('choropleth',layout_update);



};





d3.json("/api/v1/TestData").get(function(error, data) {
    // console.log(data);


    // this function will make the choropleth map
    makeTheChoro(data);

    //// this makes the info pan with the highest and lowest stat
    choroPane(data);

    //to update choropleth
    d3.select("filter-btn").on('click',updateChoro(data));
    
    // secondaryUnpacker(data);




    
});//// I should add error handling here



// d3.json("DiscData.json").get(function(data){
//     console.log(data);
// });


// console.log(d3.select('#choropleth'));

// console.log(d3.select('#choro_sub1'));