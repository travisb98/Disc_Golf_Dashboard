function updateScatter(dataInfo) {
  // console.log(dataInfo);
  var myselect = d3.select('#scatter');
if (!myselect.empty()) {
     


  var svgWidth = 610;
  var svgHeight = 385;

  var margin = { top: 30, right: 60, bottom: 60, left: 60 };

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;
  var xtitle= dataInfo.secondary_label;
  var ytitle= dataInfo.primary_label;
  // console.log(ytitle);
  
  var svg = d3.select("#scatter")
    .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .attr("class", "graph-svg-component");

  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


        // Add X axis
  var xrange = d3.extent(dataInfo.data.map(function(d){return d.secondary_feature}));

  var x = d3.scaleLinear()
    .domain(xrange)
    .nice()
    .range([ 0, width ]);
  chartGroup.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  var yrange = d3.extent(dataInfo.data.map(function(d){return d.primary_feature}));
    var y = d3.scaleLinear()
    .domain(yrange)
    .nice()
    .range([ height, 0]);
  chartGroup.append("g")
    .call(d3.axisLeft(y));


  var dots =chartGroup.append('g')
    .selectAll()
    .data(dataInfo.data)
    .enter()
    .append('g')
    dots.append("circle")
      .attr("cx", function (d) { return x(d.secondary_feature); } )
      .attr("cy", function (d) {  return y(d.primary_feature); } )
      .attr("r", 12)
      .style("fill", "#69b3a2");


  // Add X axis label:
  svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height + margin.top + 40)
      .text(xtitle);
  // Y axis label:
  svg.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left+80)
      .attr("x", -margin.top)
      .text(ytitle);
    }
  

  };