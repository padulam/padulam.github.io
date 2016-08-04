var dataUrl = "https://raw.githubusercontent.com/FreeCodeCamp/" + 
	"ProjectReferenceData/master/cyclist-data.json"

var formatTime = d3.time.format("%M:%S")
var formatTimeString = d3.time.format("%M:%S").parse

d3.json(dataUrl,function(error,json){
	if(error){return error;}
	//Locate biker with the best time in case data comes out of order
	var bestTime;
	json.forEach(function(e){
		if(e.Place === 1){
			bestTime = e.Seconds;
		}
	})

	var data = json.map(function(e){
		e.BehindLeader = formatTime(new Date((e.Seconds - bestTime)*1000))
		return e;
	})

	createChart(data);
});

var h = 450
var w = 750
var margin = {
  left: 40,
  right: 40,
  bottom: 30,
  top: 30
}

var width = w - margin.right - margin.left;
var height = h - margin.top - margin.bottom;

function createChart(data){
	var toolTip = d3.select("body")
					.append("div")
					.classed("tooltip",true)

	var x = d3.time.scale()
					.domain([d3.max(data,function(d){
						return new Date(formatTimeString(d.BehindLeader));
					}),d3.min(data,function(d){
						return new Date(formatTimeString(d.BehindLeader));
					})])
					.range([0,width]);
					
	var y = d3.scale.linear()
					.domain([d3.max(data,function(d){
						return d.Place; 
					}),1])
					.range([height,0]);

	var xAxis = d3.svg.axis()
					.scale(x)
					.orient("bottom")
					.ticks(5)
					.tickFormat(formatTime)

	var yAxis = d3.svg.axis()
					.scale(y)
					.orient("right")

	//Creates svg chart
	var chart = d3.select("body")
					.append("svg")
					.classed("chart",true)
					.attr("height",height + margin.top + margin.bottom)
					.attr("width", width + margin.right + margin.left)
					.append("g")
    				.attr("transform", "translate(" + margin.right + 
    					"," + margin.bottom + ")");

				//Draws x axis
				chart.append("g")
					.classed("x axes", true)
					.attr("transform","translate(0," + height + ")")
					.call(xAxis);

				//Draws y axis
				chart.append("g")
					.classed("y axes",true)
					.attr("transform","translate(" + width + ",0)")
					.call(yAxis);

				//Draws title
				chart.append("text")
					.attr("x",width/2)
					.attr("y",-50)
					.classed("title",true)
					.attr("text-anchor","middle")
					.text("Record Times Up Alpe d'Huez");

				//Draws x axis label
				chart.select(".x.axes")
					.append("text")
					.attr("text-anchor","middle")
					.attr("x",width/2)
					.attr("y",80)
					.text("Seconds Behind Record Holder");

				//Draws arrow on x axis
				chart.select(".x.axes")
					.append("line")
					.attr("x1",width/2 + 100)
					.attr("y1",60)
					.attr("x2",width/2 - 100)
					.attr("y2",60)
					.attr("stroke","black")
					.attr("marker-end","url(#arrow)");

				//Draws y axis label
				chart.select(".y.axes")
					.append("text")
					.attr("text-anchor","middle")
					.attr("x",0)
					.attr("y",0)
					.attr("transform", "translate(80," + (height/2) + ") " + 
						"rotate(90)")
					.text("Ranking");

	var arrowhead = d3.select("svg")
						.append("svg:defs")
							.append("svg:marker")
								.attr("markerWidth", 10)
								.attr("markerHeight",10)
								.attr("id","arrow")
								.attr("refX","0")
								.attr("refY","3")
								.attr("orient","auto")
								.append("path")
									.attr("d","M0,0 L0,6 L9,3 z")
									.attr("fill","black");

	var circles = chart.selectAll("circle")
						.data(data)
						.enter()
						.append("circle")
						.attr("cx",function(d){
							return x(new Date(formatTimeString(d.BehindLeader)));
						})
						.attr("cy",function(d){
							return y(d.Place);
						})
						.attr("r",5)
						.attr("class", function(d){
							if(d.Doping.length>0){
								return "dope-allegations";
							} else{
								return "no-allegations";
							}
						})
						.on("mouseover",function(d){
							toolTip.style("left",d3.event.pageX + "px")
									.style("top",d3.event.pageY + "px")
									.style("visibility","visible")
									.html("<span id = 'toolTipMainText'>" + 
										d.Name + " (" + d.Nationality + 
										")</span><br> Time: " + d.Time + 
										"<br> Year: " + d.Year)
							if(d.Doping.length>0){
								toolTip.html(toolTip.html() + "<br>" + d.Doping); 
							}

							d3.select(this).style("stroke","black")
						})
						.on("mouseout",function(d){
							toolTip.style("visibility","hidden")
							d3.select(this).style("stroke","none");
						});

				//Draws legend entry for riders w/o doping allegations
				chart.append("circle")
					.attr("cx",width/64)
					.attr("cy",15)
					.attr("r",5)
					.style("fill","e85858")
					.on("mouseover",function(){
						d3.selectAll(".dope-allegations")
							.style("stroke","black")
							.style("stroke-width","1.5");
					})
					.on("mouseout",function(){
						d3.selectAll(".dope-allegations")
							.style("stroke","none");
					});

				chart.append("text")
						.attr("x",width/64 + 10)
						.attr("y",20)
						.text("Riders With Doping Allegations")
						.attr("id","redDot");

				//Draws legend entry for riders w/ doping allegations
				chart.append("circle")
					.attr("cx",width/64)
					.attr("cy",40)
					.attr("r",5)
					.style("fill","grey")
					.on("mouseover",function(){
						d3.selectAll(".no-allegations")
							.style("stroke","black")
							.style("stroke-width","1.5");;
					})
					.on("mouseout",function(){
						d3.selectAll(".no-allegations")
							.style("stroke","none");
					});

				chart.append("text")
						.attr("x",width/64 + 10)
						.attr("y",45)
						.text("Riders Without Doping Allegations")
						.attr("id","blackDot");

}