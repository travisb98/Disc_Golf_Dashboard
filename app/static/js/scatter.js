function createScatter(dataInfo) {
  // console.log(dataInfo);



  var svgWidth = 860;
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
  var xmax = d3.max(dataInfo.data.map(function(d){return d.secondary_feature}));
  var xmin = d3.min(dataInfo.data.map(function(d){return d.secondary_feature}));

  // var xrange = d3.extent(dataInfo.data.map(function(d){return d.secondary_feature}));
  var xbuffer = (xmax-xmin)/25;
  var xrange = [xmin-xbuffer,xmax+xbuffer];

  var x = d3.scaleLinear()
    .domain(xrange)
    .nice()
    .range([ 0, width ]);
  chartGroup.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  var ymax = d3.max(dataInfo.data.map(function(d){return d.primary_feature}));
  var ymin = d3.min(dataInfo.data.map(function(d){return d.primary_feature}));

  // var xrange = d3.extent(dataInfo.data.map(function(d){return d.secondary_feature}));
  var ybuffer = (ymax-ymin)/25;
  var yrange = [ymin-ybuffer,ymax+ybuffer];
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
      .style("stroke", "black")
      .style("fill", "#F2AD0C");


  // Add X axis label:
  svg.append("text")
      .attr("transform", `translate(${width / 2}, ${height + 75})`)
      .text(xtitle);
  // Y axis label:
  svg.append("text")
  .attr("text-anchor", "center")
  .attr("transform", `translate(${width - 710}, ${height -5}),rotate(-90)`)
  .text(ytitle);
  
  

  };

function updateScatter(dataInfo) {
    // console.log(dataInfo);
 
  d3.select("#scatter").selectAll("svg").remove();
  
  var svgWidth = 860;
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
  var xmax = d3.max(dataInfo.data.map(function(d){return d.secondary_feature}));
  var xmin = d3.min(dataInfo.data.map(function(d){return d.secondary_feature}));

  // var xrange = d3.extent(dataInfo.data.map(function(d){return d.secondary_feature}));
  var xbuffer = (xmax-xmin)/25;
  var xrange = [xmin-xbuffer,xmax+xbuffer];

  var x = d3.scaleLinear()
    .domain(xrange)
    .nice()
    .range([ 0, width ]);
  chartGroup.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  var ymax = d3.max(dataInfo.data.map(function(d){return d.primary_feature}));
  var ymin = d3.min(dataInfo.data.map(function(d){return d.primary_feature}));

  // var xrange = d3.extent(dataInfo.data.map(function(d){return d.secondary_feature}));
  var ybuffer = (ymax-ymin)/25;
  var yrange = [ymin-ybuffer,ymax+ybuffer];
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
      .style("stroke", "black")
      .style("fill", "#F2AD0C");


  // Add X axis label:
  svg.append("text")
      .attr("transform", `translate(${width / 2}, ${height + 75})`)
      .text(xtitle);
  // Y axis label:
  svg.append("text")
  .attr("text-anchor", "center")
  .attr("transform", `translate(${width - 710}, ${height -5}),rotate(-90)`)
  .text(ytitle);
  

  };
