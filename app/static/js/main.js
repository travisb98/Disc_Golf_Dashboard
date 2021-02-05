
function getFilters() {
    var filters = {}

    var sidebar = d3.select(".sidebar");

    console.log(sidebar);

    return JSON.stringify(filters);
}

// ///// api that runs on start, creating the choropleth and the info card
d3.json("/api/v1/FeatureAggregate?feat1=holes&feat2=rating")
.header("filters", getFilters())
.get(function(error, data) {
    // console.log("Start up api call");
    // console.log(data);
    //// makes choropleth map
    mapDataLayout(data);

    //// makes bar graph
    updateBar(data);

});//// I should add error handling here



///// defining the filter button. For now Im just using this to update the choropleth color on click
var filter_button = d3.select("#filter-btn");

////// grabs the primary selection
var primaryUserSelection= d3.select("#primarySelection");

///// grabs the secondary selection
var secondaryUserSelection = d3.select('#secondarySelection');

// secondaryUserSelection


///// event listener used when primary feature changes, we'll use this to dynamically modify the second list
primaryUserSelection.on('change',function(){ 
    console.log(this.value);

    var prim_val = this.value;
    // console.log(prim_val);
    // console.log(primaryUserSelection.node());
    var option_to_remove = secondaryUserSelection.Get

    console.log(option_to_remove);
    // console.log(this);
    ///// find the option in the secondary list with the same value as the value of this selection, then remove it
});





filter_button.on('click',function(){
    // console.log("button was clicked")
    ///// need to pass user selected variables to the API call below 
    // var userFeat1; ////// these will be the user selected features
    // var userFeat2;
    ////// also will probably need variables for filtering, grabing elements with d3 

    // ////// grabs the primary selection
    // var primaryUserSelection= d3.select("#primarySelection");


    //// grabs the values from the primary selection
    var primaryUserValue = primaryUserSelection.node().value;
    
    // ///// grabs the secondary selection
    // var secondaryUserSelection = d3.select('#secondarySelection');

    /////// grabs the secondary value from the selection
    var secondaryUserValue = secondaryUserSelection.node().value;



    ////// psuedo
    /////// when the first drop down has a change | selection.on("mouseoff?",fucntion)
    /////// get the value from the first selection,
    //////// remove the option from the second list
    //////// also need to make this recurisive so i don't end up deleting all the options from the second list
    console.log("-------------");
    console.log("-------------");
    console.log('Primary Value:');
    console.log(primaryUserValue);
    console.log("-------------");
    console.log('Secondary Value');
    console.log(secondaryUserValue)
    console.log("-------------");
    console.log("-------------");

    d3.json("/api/v1/FeatureAggregate?feat1=rating&feat2=holes")
    
    .get(function(error, data){
        // console.log("Second API call triggered button")
        // console.log(data);


        ///// fucntion that updates the choropleth map
        mapDataLayout(data);
        
        
    });

});
