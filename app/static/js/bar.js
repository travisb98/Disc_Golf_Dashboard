// This function is called from main.js and updated the bar chart on the page
function updateBar(dataInfo) {

    var data = dataInfo.data;
    // Sort the data in descending order by primary_feature
    data.sort((firstNum, secondNum) => secondNum.primary_feature - firstNum.primary_feature);

    var yParam = dataInfo.primary_label;

    // Grab the state abbreviations for the x values
    var x = data.map(item => item.state_abbr);
   
    // Grab the primary feature to plot
    var y = data.map(item => item.primary_feature);

    // text for the pop-up when hovering over a bar
    var text = data.map(item => item.state_name);
    
    
    var data = [{
        type: 'bar',
        x: x,
        y: y,
        text: text,
        marker: {
            color: '#F2AD0C'
        },
        // width: 1.5
    }];

    var layout = {
        title: yParam + " by State",
        xaxis: {
            title: {
              text: yParam,
            }
        }
    };

    Plotly.react('bar', data, layout);
}