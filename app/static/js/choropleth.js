
// d3.json("/api/v1/FeatureAggregate?feature=holes&aggregate=mean")
// .header("holes", 19)
// .get(function(error, data) {
//     console.log(data);
// })





//// make a basic dictionary that returns a pretty looking title based on the user_var






function makeTheChoro(data){
    /// makes a list of 
    var locations = data.map(item => item.state_abbr);

    var text = data.map(item => item.state_name);

    var primary_feature = data.map(item => item.primary_feature);

    var secondary_feature = data.map(item => item.secondary_feature);

    

    var z_list = secondary_feature;

    var z_max = Math.max.apply(Math,z_list);

    var z_min = Math.min.apply(Math,z_list);





        var mapData = [{
            type: 'choropleth',
            locationmode: 'USA-states',
            locations: locations,
            z: z_list,
            text: text,
            zmin: z_min,
            zmax: z_max,
            colorscale: [
                [0, 'rgb(242,240,247)'], [0.2, 'rgb(218,218,235)'],
                [0.4, 'rgb(188,189,220)'], [0.6, 'rgb(158,154,200)'],
                [0.8, 'rgb(117,107,177)'], [1, 'rgb(84,39,143)']
            ],
            colorbar: {
                title: 'make unit label dynamic',
                thickness: 0.2
            },
            marker: {
                line:{
                    color: 'rgb(255,255,255)',
                    width: 2
                }
            }
        }];

        var mapLayout = {
            title: 'This is a title',
            geo:{
                scope: 'usa'
            }
        };

        Plotly.newPlot("choropleth", mapData, mapLayout, {showLink: false});
    

};



d3.json("/api/v1/TestData")
.get(function(error, data) {
    console.log(data);

    makeTheChoro(data.data);

    //// make a basic dictionary that returns a pretty looking title based on the user_var

    // //// maybe i should bind the data






});
