const GEODATA_URL = "custom.geo.json";
const METEOR_DATA_URL = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json";

d3.json(GEODATA_URL, function(err, geoData) {
	if(err){return console.warn(err);}
	
	d3.json(METEOR_DATA_URL, function(err, meteorData) {
	  if(err){return console.warn(err);}
	  generateMap(geoData,meteorData);
	});
});

function generateMap(geoData,meteorData){
	const HEIGHT = window.innerHeight;
	const WIDTH = window.innerWidth;

	var projection = d3.geo.mercator()
							.translate([WIDTH/2,HEIGHT/2])
							.center([10,5])
							.scale([200]);

	var path = d3.geo.path()
						.projection(projection);

	var svg = d3.select("body")
					.append("svg")
					.classed("map",true)
					.attr("height",HEIGHT)
					.attr("width",WIDTH);

	var toolTip = d3.select("body")
					.append("div")
					.classed("tooltip",true);

	var meteorScale = d3.scale.linear()
								.domain([
									d3.min(meteorData.features,function(d){return Number(d.properties.mass)}),
									d3.max(meteorData.features,function(d){return Number(d.properties.mass)})
								])
								.range([3,20]);

	var map = svg.selectAll("path")
					.data(geoData.features)
					.enter()
					.append("path")
					.attr("d",path)
					.style("fill","green")
					.style("stroke","white");

	var meteors = svg.selectAll("circle")
						.data(meteorData.features)
						.enter()
						.append("circle")
						.attr("cx",function(d){
							if(d.geometry!==null){
								return projection(d.geometry.coordinates)[0];
							}
							
						})
						.attr("cy",function(d){
							if(d.geometry!==null){
								return projection(d.geometry.coordinates)[1];
							}
						})
						.attr("r",function(d){
							return meteorScale(d.properties.mass);
						})
						.style("fill","yellow")
						.style("opacity",.75)
						.on("mouseover",function(d){
							toolTip.style("left",d3.event.pageX + "px")
									.style("top",d3.event.pageY + "px")
									.style("visibility","visible")
									.html("<span id = 'toolTipMainText'>Name: " + 
										d.properties.name + "</span><br/>Mass: " +
										d.properties.mass + "<br/>Date: ");
							var d = new Date(d.properties.year)
							toolTip.html(toolTip.html()+ d.toDateString());

							d3.select(this).style("stroke","black")
						})
						.on("mouseout",function(d){
							toolTip.style("visibility","hidden")
							d3.select(this).style("stroke","none");
						});
}