function barcharts() {
    var margin = {
            top: 45,
            right: 30,
            bottom: 40,
            left: 30
        },
        width = 350 - margin.left - margin.right,
        height = 220 - margin.top - margin.bottom,
        padding = -30;

    var formatMinutes = d3.format('.1f');
    var formatAxis = d3.format('.0f');

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .domain([0, 50])
        .range([height, 0]);

    var barcolor = d3.scale.threshold()
        .domain([10.5])
        //.range(["#4d1530", "#947383"]);
        .range(["#712164", "#4f8a83"]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .tickFormat('')
        .orient("bottom")
        .innerTickSize(0);

    var yAxis = d3.svg.axis()
        .scale(y)
        .tickSize(width - padding)
        .tickFormat(formatYAxis)
        .orient("right")
        .ticks(4);

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return d.character + "<br/>Episode " + d.episode + "<br/>" + formatMinutes(d.minutes) + " minutes";
        })

    // csv loaded asynchronously
    d3.csv("data/CharsE1-20.csv", type, function (data) {

        //just want the main five
        data = data.filter(function (d) {
            return d.character!== "Beth, Katja, and Tony";
        });

        var characters = d3.nest()
            .key(function (d) {
                return d.character;
            })
            .entries(data);
        x.domain(data.map(function (d) {
            return d.episode;
        }));

        // Add an SVG element for each character, with the desired dimensions and margin.
        var svg = d3.select("#barcharts").selectAll("svg")
            .data(characters)
            .enter()
            .append("svg:svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        var gy = svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + padding + ",0)")
            .call(yAxis);

        gy.selectAll("g").filter(function (d) {
                return d;
            })
            .classed("minor", true);

        gy.selectAll("text")
            .attr("x", 0)
            .attr("dy", -4);

        //Season labels for x axis
        svg.append("g")
            .append("text")
            .attr("class", "seasonTitle")
            .attr("x", 0.17 * width)
            .attr("y", height - padding - 10)
            .html(function (d) {
                return "Season 1";
            })
        svg.append("g")
            .append("text")
            .attr("class", "seasonTitle")
            .attr("x", 0.63 * width)
            .attr("y", height - padding - 10)
            .html(function (d) {
                return "Season 2";
            })
        
        //Title for each chart
        svg.append("g")
            .append("text")
            .attr("class", "chartTitle")
            .attr("x", 0)
            .attr("y", -25)
            .text(function (d) {
                return d.key
            });

        // Accessing nested data: https://groups.google.com/forum/#!topic/d3-js/kummm9mS4EA
        // data(function(d) {return d.values;}) 
        // this will dereference the values for nested data for each group
        svg.selectAll(".bar")
            .data(function (d) {
                return d.values;
            })
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function (d) {
                return x(d.episode);
            })
            .attr("width", x.rangeBand())
            .attr("y", function (d) {
                return y(d.minutes);
            })
            .attr("height", function (d) {
                return height - y(d.minutes);
            })
            .attr("fill", function (d) {
                return barcolor(d.episode);
            })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)

        svg.call(tip);

    });

    function type(d) {
        d.minutes = +d.minutes;
        return d;
    }

    function formatYAxis(d) {
        var s = formatAxis(d);
        return d === y.domain()[1] ? s + " minutes" : s;
    }
}

barcharts()