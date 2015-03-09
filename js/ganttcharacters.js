function ganttcharacters() {

    var margin = {
            top: 45,
            right: 35,
            bottom: 60,
            left: 35
        },
        width = 380 - margin.left - margin.right,
        height = 280 - margin.top - margin.bottom,
        padding = 50;

    var formatMinutes = d3.format('.1f');
    var formatAxis = d3.format('.0f');

    var y = d3.scale.ordinal()
        .rangeRoundBands([0, height], .1);

    var x = d3.scale.linear()
        .domain([0, 40])
        .range([padding, width]);

    var barcolor = d3.scale.ordinal()
        .domain(["Sarah", "Beth", "Katja", "Alison", "Cosima", "Helena", "Rachel", "Tony"])
        .range(["#712164", "#d7dddb", "#ffff99", "#e76278", "#4f8a83", "#fac699", "#3A4900", "#666"]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .tickSize(height)
        .tickFormat(formatXAxis)
        .orient("bottom")
        .ticks(5);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "Episode " + d.episode + "</br>" + d.character + " as " + d.charas;
        })

    // csv loaded asynchronously
    d3.csv("data/obtimes.csv", function (data) {

        //just the 5 main clones
        data = data.filter(function (d) {
            return d.character !== "Beth" && d.character !== "Katja" && d.character !== "Tony";
        });

        var characters = d3.nest()
            .key(function (d) {
                return d.character;
            })
            .entries(data);
        y.domain(data.map(function (d) {
            return d.episode;
        }));

        // Add an SVG element for each character, with the desired dimensions and margin.
        var svg = d3.select("#ganttcharacters").selectAll("svg")
            .data(characters)
            .enter()
            .append("svg:svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var gx = svg.append("g")
            .attr("class", "x axis")
            //.attr("transform", "translate(0," - height + ")")
            .call(xAxis);

        gx.selectAll("g").filter(function (d) {
                return d;
            })
            .classed("minor", true);

        //Season labels for y axis
        svg.append("g")
            .append("text")
            .attr("class", "seasonTitle")
            .attr("x", -5)
            .attr("y", function (d) {
                return y(5) + 8;
            })
            .html(function (d) {
                return "Season 1";
            });
        svg.append("g")
            .append("text")
            .attr("class", "seasonTitle")
            .attr("x", -5)
            .attr("y", function (d) {
                return y(15) + 8;
            })
            .html(function (d) {
                return "Season 2";
            });

        svg.append("g")
            .append("line")
            .attr("class", "labelline")
            .attr("y1", function (d) {
                return y(11);
            })
            .attr("y2", function (d) {
                return y(11);
            })
            .attr("x1", -7)
            .attr("x2", function (d) {
                return x(43);
            });

        //Title for each chart
        svg.append("g")
            .append("text")
            .attr("class", "chartTitle")
            .attr("x", padding + 20)
            .attr("y", -10)
            .text(function (d) {
                return d.key;
            });

        svg.selectAll(".bar")
            .data(function (d) {
                return d.values;
            })
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("y", function (d) {
                return y(d.episode);
            })
            .attr("height", y.rangeBand())
            .attr("x", function (d) {
                return x(d.startmin);
            })
            .attr("width", function (d) {
                return x(d.stopmin) - x(d.startmin);
            })
            //.attr("fill", function (d) {
            //    return barcolor(d.character);
            //})
            .attr("fill", "#1B3536")
            .attr("opacity", 0.5)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

        svg.call(tip);

    });

    function formatXAxis(d) {
        var s = formatAxis(d);
        return d === x.domain()[1] ? s + " minutes" : s;
    }
}
ganttcharacters()