
function getFilters() {
    var filters = {}

    var sidebar = d3.select(".sidebar");

    // console.log(sidebar);

    return JSON.stringify(filters);
}

// ///// api that runs on start, creating the choroplets and graphs
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



///// defining the filter button. 
var filter_button = d3.select("#filter-btn");

////// grabs the primary selection
var primaryUserSelection= d3.select("#primarySelection");

///// grabs the secondary selection
var secondaryUserSelection = d3.select('#secondarySelection');


///// for some reason this works for every single option except for "Average Number of Holes with Water" and i'm not really sure why. super weird
///// this event listener is only on the primary feature dropdown, we'll need to make a similar one on the secondary feature dropdown
///// event listener used when primary feature changes:
primaryUserSelection.on('change',function(){ 

  
    //// removes all options from the secondary dropdown
    secondaryUserSelection.selectAll("*").remove();

    //// looping through the options in the primary feature menu
    //// change this to length
    for (var j = 0; j < this.length; j++) {

    
        ///// grabs the current option tag from the primary user selection
        var current_option = primaryUserSelection._groups[0][0][j];

        //// append an option to the secondaryUserSelection based on the option from the primary dropdown
        secondaryUserSelection.append('option')
        .attr('value',current_option.value)
        .attr('id',current_option.id)
        .html(current_option.text);

    };


    /////// gets the value of the option that was picked in the primary dropdown
    var prim_val = this.value;

    ///// removes the option from secondary list that matches the option selected in the primary dropdown
    //// this works for every option except "Average Number of Holes with Water"
    secondaryUserSelection.select(`#${prim_val}`).remove();


});




///// when the filter button gets clicked....
filter_button.on('click',function(){

    //// grabs the values from the primary selection
    var primaryUserValue = primaryUserSelection.node().value;

    /////// grabs the secondary value from the selection
    var secondaryUserValue = secondaryUserSelection.node().value;

    ///.....api call based on the values the users selected
    d3.json(`/api/v1/FeatureAggregate?feat1=${primaryUserValue}&feat2=${secondaryUserValue}`)
    .get(function(error, data){

        ///// fucntion that updates the choropleth map
        mapDataLayout(data);
        
        
    });

});
