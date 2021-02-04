var svgWidth = 800;
var svgHeight = 600;

var margin = { top: 20, right: 100, bottom: 60, left: 60 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


  // Import data from flask app
  d3.json("/api/v1/TestData")
  .get(function(error, data) {
      console.log(data);


      // Add X axis
  var xrange = d3.extent(data.map(function(d){return d.length_ft}));

var x = d3.scaleLinear()
.domain(xrange)
.nice()
.range([ 0, width ]);
chartGroup.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

var yrange = d3.extent(data.map(function(d){return d.rating}));
  var y = d3.scaleLinear()
  .domain(yrange)
  .nice()
  .range([ height, 0]);
  chartGroup.append("g")
  .call(d3.axisLeft(y));


  var dots =chartGroup.append('g')
  .selectAll()
  .data(data)
  .enter()
  .append('g')
  dots.append("circle")
    .attr("cx", function (d) { return x(d.length_ft); } )
    .attr("cy", function (d) {  return y(d.rating); } )
    .attr("r", 12)
    .style("fill", "#69b3a2");


// Add X axis label:
svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + margin.top + 40)
    .text("Length (ft)");
// Y axis label:
svg.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left+80)
    .attr("x", -margin.top)
    .text("Rating");
});