var dataUrl = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenc" +
	"eData/master/global-temperature.json";

d3.json(dataUrl, function(error,json){
	if(error){return console.warn(error);}
	var formatMonth = d3.time.format("%B");
	var baseTemp = json.baseTemperature
	var data = json.monthlyVariance.map(function(e){
		return {year:e.year,
				month:formatMonth(new Date("2000-" + e.month + "-15")),
				variance: e.variance};
	});

	createChart(data,baseTemp);
})

var h = 500;
var w = 1100;

var margin = {
	left: 	30,
	right: 	30,
	top: 	30,
	bottom: 30
}

var height = h - margin.top - margin.bottom;
var width = w - margin.left - margin.right;

function createChart(data,baseTemp){

	var colors = ["#0000CC","#0F5BFF","#7CBBFF","#D2FFFF","#FFFD7C","#FFE51E",
					"#FFD20F","#FFBF00","#FF803E","#ff4300","#b70707"];

	var toolTip = d3.select("body")
	            .append("div")
	            .classed("tooltip",true);

	var x = d3.scale.linear()
				.domain([d3.min(data,function(d){return d.year;}),
					d3.max(data,function(d){return d.year;})])
				.range([0,width]);

	var y = d3.scale.ordinal()
				.domain(data.map(function(e){return e.month;}))
				.rangeBands([0,height]);

	var xAxis = d3.svg.axis()
					.scale(x)
					.orient("bottom")
					.ticks(20)
					.tickFormat(d3.format("d"));

	var yAxis = d3.svg.axis()
					.scale(y)
					.orient("left");

	var z = d3.scale.quantile()
				.domain([d3.min(data,function(d){
					return baseTemp + d.variance;
				}),d3.max(data,function(d){
					return baseTemp + d.variance;
				})])
				.range(colors);

	var chart = d3.select("body")
					.append("svg")
					.classed("chart",true)
					.attr("height", height + margin.right + margin.left)
					.attr("width",width + margin.top + margin.bottom)
					.append("g")
						.attr("transform", "translate(" +  margin.left+"," +
							 margin.top+")");

				chart.selectAll("rect")
					.data(data)
					.enter()
					.append("rect")
					.attr("x",function(d){return x(d.year);})
					.attr("y",function(d){return y(d.month);})
					.attr("width", 4)
					.attr("height",y.rangeBand())
					.style("fill",function(d){
						return z(baseTemp + d.variance)})
					.on("mouseover",function(d,i){
						toolTip.style("left",d3.event.pageX + "px")
						toolTip.style("top",d3.event.pageY + "px")
						toolTip.style("visibility","visible")
						toolTip.html(d.month + " " + d.year + "<br>Temperature: " 
							+ (baseTemp + d.variance).toFixed(2) + "&#8451;" + 
							"<br>Variance: " + d.variance + "&#8451;")
					})
					.on("mouseout",function(d,i){
						toolTip.style("visibility","hidden");
					});

				//Draw x axis
				chart.append("g")
					.classed("x axes",true)
					.attr("transform","translate(0,"+ height + ")")
					.call(xAxis);

				//Draw y axis
				chart.append("g")
					.classed("y axes",true)
					.attr("transform","translate(0,0)")
					.call(yAxis);


				//Draw x axis label
				chart.select(".x.axes")
						.append("text")
						.classed("axis-label",true)
						.attr("x",width/2)
						.attr("y",70)
						.style("text-anchor","middle")
						.text("Year");

				//Draw y axis label
				chart.select(".y.axes")
						.append("text")
						.classed("axis-label",true)
						.attr("x",0)
						.attr("y",0)
	                  	.attr("transform","translate(-80, " + (height/2)
                    		+ ") rotate(-90)")
						.style("text-anchor","middle")
						.text("Month");


				//Create title
				chart.append("text")
					.attr("text-anchor","middle")
					.attr("x",width/2)
					.attr("y",-30)
					.classed("title",true)
					.text("Global Temperature Data Heat Map");

	var legend = chart.selectAll(".legend")
					.data([0].concat(z.quantiles()),function(d){return d;})
					.enter()
					.append("g");

	var legendEntryWidth = 30;

				//Create legend color blocks
				legend.append("rect")
					.classed("legend",true)
					.attr("x",function(d,i){return width-legendEntryWidth * 
						colors.length + legendEntryWidth * i})
					.attr("y", height+50)
					.attr("height",15)
					.attr("width",legendEntryWidth)
					.style("fill",function(d,i){return colors[i]});

					//Append legend text to color blocks
	var legendText = legend.append("text")
						.classed("legend-text",true)
						.text(function(d){return d.toFixed(2);})
						.attr("x",function(d,i){return width-legendEntryWidth
							* colors.length + legendEntryWidth * i+5})
						.attr("y",height+50+30);

}