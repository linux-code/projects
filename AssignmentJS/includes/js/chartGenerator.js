/**
 * Created by GH316885 on 2/24/2016.
 */
/*Global For All the charts*/
var margin = {top: 40, right: 10, bottom: 200, left: 40},
    width =900 - margin.left - margin.right,
    height =600 - margin.top - margin.bottom,
    x = d3.scale.ordinal().rangeRoundBands([0, width],.35),
    y = d3.scale.linear().range([height, 0]);
/*Global Variable Declaration End*/

function getChart(DivName,jsonFile,colorCode){
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickSize(2),
            yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(15)
            .tickSize(2)
            .tickFormat(d3.format(".2s")),
            svg = d3.select(DivName).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")");


        //read json file
        d3.json(jsonFile, function(error, data) {
            x.domain(data.map(function(d) { return d.x; }));
            y.domain([0, d3.max(data, function(d) { return d.y; })]);

            //code for tooltip
            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                    return "<strong>Production:</strong> <span style='color:#fff22a'>" + d.y +" (Ton mn)"+"</span>";
                });


            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", "-.55em")
                .attr("transform", "rotate(-115)" );

            //call tooltip
            svg.call(tip);

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 2)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Production(Ton mn)")

            svg.selectAll("bar")
                .data(data)
                .enter().append("rect")
                .style("fill", colorCode)
                .attr("x", function(d) { return x(d.x); })
                .attr("width", x.rangeBand())
                .attr("y", function(d) { return y(d.y); })
                .attr("height", function(d) { return height - y(d.y); })
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);


        });
};

function getstackBar(divName,jsonFile){
            var color = d3.scale.ordinal()
                .range(["#FF0000","#358031", "#6CFF7A", "#B46419"]);

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .tickSize(2);

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .tickSize(2)
                .tickFormat(d3.format(".2s"));

            var svg = d3.select(divName).append("svg")
                .attr("width", width + margin.left + margin.right )
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            d3.json(jsonFile, function(error, data) {
                if (error) throw error;

                color.domain(d3.keys(data[0]).filter(function(key) { return key !== "x"; }));

                data.forEach(function(d) {
                    var y0 = 0;
                    d.prod = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
                    d.total = d.prod[d.prod.length - 1].y1;
                });

                x.domain(data.map(function(d) { return d.x; }));
                y.domain([0, d3.max(data, function(d) { return d.total; })]);


                //code for tooltip
               var tip = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0])
                    .html(function(d) {
                        return "<strong>Production:</strong> <span style='color:#fff22a'>" + d.y1 + " (kg/ha)"+"</span>";
                    });

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)
                    .selectAll("text")
                    .style("text-anchor", "end")
                    .attr("dx", "-.8em")
                    .attr("dy", "-.55em")
                    .attr("transform", "rotate(-115)" );

                //call tooltip
                svg.call(tip);

                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Production(kg/ha)");

                var year = svg.selectAll(".year")
                    .data(data)
                    .enter().append("g")
                    .attr("class", "g")
                    .attr("transform", function(d) { return "translate(" + x(d.x) + ",0)"; });

                year.selectAll("rect")
                    .data(function(d) { return d.prod; })
                    .enter().append("rect")
                    .attr("width", x.rangeBand())
                    .attr("y", function(d) { return y(d.y1); })
                    .attr("height", function(d) { return y(d.y0) - y(d.y1); })
                    .style("fill", function(d) { return color(d.name); })
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);

                var legend = svg.selectAll(".legend")
                    .data(color.domain().slice().reverse())
                    .enter().append("g")
                    .attr("class", "legend")
                    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

                legend.append("rect")
                    .attr("x", 150)
                    .attr("y", "0px")
                    .attr("width", 18)
                    .attr("height", 18)
                    .style("fill", color);

                legend.append("text")
                    .attr("x",140)
                    .attr("y", 9)
                    .attr("dy", "0px")
                    .style("text-anchor", "end")
                    .text(function(d) { return d; });

            });
};