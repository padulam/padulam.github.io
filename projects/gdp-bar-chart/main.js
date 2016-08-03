var h = 500
var w = 900
var margin = {
  left: 40,
  right: 40,
  bottom: 40,
  top: 40
}

var width = w - margin.right - margin.left;
var height = h - margin.top - margin.bottom;

var dataUrl = "https://raw.githubusercontent.com/FreeCodeCamp/" +
  "ProjectReferenceData/master/GDP-data.json";

//Pulls data from provided url and calls chart function
d3.json(dataUrl, function(error, json) {
  var convertToDate = d3.time.format("%Y-%m-%d").parse;
  var data = json.data.map(function(item) {
    return {
      date: convertToDate(item[0]),
      value: item[1],
    };
  })
  var source = json.source_name;

  createChart(data, source);
})

function createChart(data, source) {
  var yearOnlyFormat = d3.time.format("%Y");
  var formatCurrency = d3.format("$,2f");
  var mdyFormat = d3.time.format("%B %Y")

  var toolTip = d3.select("body")
    .append("div")
    .classed("tooltip", true)

  var x = d3.scale.ordinal()
    .domain(data.map(function(e) {
      return e.date;
    }))
    .rangeBands([0, width]);

  var y = d3.scale.linear()
    .domain([0, d3.max(data, function(d) {
      return d.value;
    })])
    .range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickValues(x.domain().filter(function(d, i) {
      return d.getUTCFullYear() % 5 === 0 && d.getUTCMonth() === 0;
    }))
    .tickFormat(yearOnlyFormat)
    .outerTickSize(0);

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10)
    .outerTickSize(0);;

  var chart = d3.select("body")
    .append("svg")
    .attr("height", height)
    .attr("width", width)
    .classed("chart", true);

  var bars = chart.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function(d) {
      return x(d.date);
    })
    .attr("y", function(d) {
      return y(d.value);
    })
    .attr("height", function(d) {
      return height - y(d.value);
    })
    .attr("width", x.rangeBand())
    .on("mouseover", function(d, i) {
      d3.select(this).style("fill", "red");
      toolTip.style("left", d3.event.pageX + "px")
      toolTip.style("top", d3.event.pageY + "px")
      toolTip.style("visibility", "visible")
      toolTip.html("<span id = 'toolTipAmount'>" +
        formatCurrency(d.value) + " Billion</span><br>" +
        mdyFormat(d.date));

    })
    .on("mouseout", function(d, i) {
      d3.select(this).style("fill", "#5488bc");
      toolTip.style("visibility", "hidden");
    })
    .classed("bar", true);

  //Draws y axis
  chart.append("g")
    .classed("y axes", true)
    .attr("transform", "translate(0,0)")
    .call(yAxis);

  //Draws x axis
  chart.append("g")
    .classed("x axes", true)
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  //Creates chart tile
  chart.append("text")
    .classed("title", true)
    .attr("x", width / 2)
    .attr("y", -50)
    .style("text-anchor", "middle")
    .text("United States Gross Domestic Product " +
      "(1947 to Present)");

  //Creates y axis label
  chart.select(".y.axes")
    .append("text")
    .classed("label", true)
    .style("text-anchor", "middle")
    .attr("x", 0)
    .attr("y", 0)
    .attr("transform", "translate(-80, " + (height / 2) +
      ") rotate(-90)")
    .text("Billions of US Dollars ($)");

  //Creates x axis label
  chart.select(".x.axes")
    .append("text")
    .style("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", 70)
    .text("Date");

  //Creates source label at the bottom of the chart
  chart.select(".x.axes")
    .append("text")
    .style("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", 100)
    .style("font-size", "10px")
    .text("Source: " + source);
}