// This function is called from main.js and updated the bar chart on the page
function updateBar(data) {
console.log(data)
    // // Grab the state abbreviations for the labels
    // var x = data.map(item => item.state_abbr);

    // // This grabs the primary parameter that is being plotted ******
    // var parameter=Object.keys(data[0])[2];
    // // console.log(parameter);
   
    // // gets a list of the main feature well be graphing
    // var y = data.map(item => item[primary_label]);
    // // console.log(y);

    // // text for the pop-up when hovering over a state
    // var text = data.map(item => item.state_name);
    // // console.log(text);
    
    
    // var data = [{
    //     type: 'bar',
    //     x: x,
    //     y: y,
    //     text: text,
    // }];

    // var layout = {
    //     title: primary_label + " by State",
    //     xaxis: {
    //         title: {
    //           text: primary_label,
    //         }
    //     }
    // };

    // Plotly.newPlot('bar', data, layout);
}