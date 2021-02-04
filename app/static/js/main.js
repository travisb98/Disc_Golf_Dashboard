
// function filterData() {
//     d3.event.preventDefault();

//     d3.select("#startDate").property("value")

//     d3.json("/api/v1/FeatureAggregate?feature=holes&aggregate=mean")
//     .header("holes", 19)
//     .get(function(error, data) {
//         console.log(data);
//     })

// }





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
    // var userFeat1; ////// these will be the user selected features
    // var userFeat2;
    ////// also will probably need variables for filtering, grabing elements with d3 



    d3.json("/api/v1/FeatureAggregate?feat1=rating&feat2=holes").get(function(error, data){

        console.log("Second API call triggered button")
        // console.log(data);

        ////////////// need to write a function to update the info pane
        console.log("need to update the info pane here")

        ///// fucntion that updates the choropleth map
        updateChoro(data);
        
    });

});
