var mobile_threshold = 600;

var $gantt = $('#gantt');
var gantt_data_url = "data/obtimes.csv";
var gantt_aspect_width = 10;
var gantt_aspect_height = 8.5;

var $overlap = $('#overlap');
var data;
var overlap_aspect_width = 2;
var overlap_aspect_height = 1;

var $linechart = $('#linechart');
var linechart_data_url = "data/totaltime.csv";
var linechart_aspect_width = 10;
var linechart_aspect_height = 7;

var $barcharts = $('#barcharts');
var barcharts_data_url = "data/CharsE1-20.csv";
var barcharts_aspect_width = 5;
var barcharts_aspect_height = 4;




$(window).load(function () {
    if (Modernizr.svg) { // if svg is supported, draw dynamic chart
        
        data = json;
        overlapdraw();
        window.onresize = overlapdraw();

        d3.csv(gantt_data_url, function (error, minutes) {
            data = minutes;

            ganttdraw();
            window.onresize = ganttdraw;
        });

        d3.csv(linechart_data_url, function (error, times) {
            data = times;

            linedraw();
            window.onresize = linedraw;
        });

        d3.csv(barcharts_data_url, function (error, minutes) {
            data = minutes;

            bardraw();
            window.onresize = bardraw;
        });

    }
});