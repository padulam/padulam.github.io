var dataUrl = "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json"

//Retrieves json data from provided url
d3.json(dataUrl,function(error,json){
	if(error) {
		console.warn(error);
	}else{
		generateForce(json);
	}
});

//Creates force-directed graph
function generateForce(data){
	var w = window.innerWidth,
		h = window.innerHeight;

	var svg = d3.select("body")
				.append("svg")
				.attr("height",h)
				.attr("width",w);

	var toolTip = d3.select("body")
					.append("div")
					.classed("tooltip",true);

	var force = d3.layout.force()
					.nodes(data.nodes)
					.links(data.links)
					.size([w,h])
					.linkDistance([50])
					.charge([-100])
					.start();

	var links = svg.selectAll("line")
					.data(data.links) 
					.enter()
					.append("line")
					.attr("stroke","grey")
					.attr("stroke-width",1);


	var flags = d3.select("body")
						.append("div")
						.classed("flags",true);

	var nodes =	flags.selectAll("span")
						.data(data.nodes)
						.enter()
						.append("span")
						.attr("class", function(d){
							return "flag flag-" + d.code;
						})
						.classed("node",true)
						.call(force.drag);

		//Adds tooltip 
		nodes.on("mouseover",function(d,i){
                toolTip.style("left",d3.event.pageX+"px")
                	   .style("top",d3.event.pageY+"px")
                	   .style("visibility","visible")
                	   .style("z-index",1)
                       .html(d.country);
              })
              .on("mouseout",function(d,i){
                toolTip.style("visibility","hidden")
              });

         //Adds listener to handle movement of graph
		force.on("tick",function(){
			links.attr("x1",function(d){return d.source.x})
				 .attr("y1",function(d){return d.source.y})
				 .attr("x2",function(d){return d.target.x})
				 .attr("y2",function(d){return d.target.y});
			
			//Absolute positioning needed as d3 v.3 does not support css3 transforms of html elements
			nodes.style("position","absolute")
				 .style("left", function(d) {return d.x-5+"px";})
				 .style("top",function(d){return d.y-5+"px";})
				 .style("z-index",0);
		});
};