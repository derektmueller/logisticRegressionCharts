
var mlCharts = (function () {

var mlCharts = {};

mlCharts.TrainingSetChart = (function () {

function TrainingSetChart (elem, data, db, dimension) {
    this.dimension = typeof dimension === 'undefined' ? 2 : dimension; 
    this.elem = elem;
    this.data = data;
    this.db = db;
    this.svg = d3.select (this.elem).append ('svg');
    this.colors = ['green', 'orange', 'teal'];
};

TrainingSetChart.prototype.addData = function (data) {
    this.data = this.data.concat ([data]);
};

TrainingSetChart.prototype.plot = function () {
    var that = this;
    if (this.dimension === 2) {
        var yScale = this.data[0][0].length > 1 ? 1 : 5;
        var minX = Math.min.apply (null, this.data.map (function (a) {
                return a[0][0];
            })),
            maxX = Math.max.apply (null, this.data.map (function (a) {
                return a[0][0];
            })),
            maxY = Math.max.apply (null, this.data.map (function (a) {
                return a[0].length > 1 ? a[0][1] : yScale;
            }));
        this.svg.attr (
            'viewBox', 
            minX + ' -1 ' + 
            (1 + parseInt (maxX, 10)) + ' ' +
            (2 + maxY)
        );
        if (this.db) {
            if (this.data[0][0].length > 1) {
                var lineFn = d3.svg.line ()
                    .x (function (d, i) {
                        return i;
                    })
                    .y (function (d, i) {
                        return maxY - that.db (i); 
                    })
                    .interpolate ('linear')
                ;
                this.svg.selectAll ('path')
                        .data ([null])
                    .enter ()
                        .append ('path')
                        .attr ('d', lineFn (d3.range (
                            minX, maxX + 1, 1)))
                            //Math.max (
                                //1, Math.floor ((maxX - minX) / 100)))))
                        .attr ('stroke', 'black')
                        .attr ('stroke-width', 0.1)
                        .attr ('fill', 'none')
                ;
            } else {
                var lineFn = d3.svg.line ()
                    .x (function (d, i) {
                        return that.db ();
                    })
                    .y (function (d, i) {
                        return i; 
                    })
                    .interpolate ('linear')
                ;
                this.svg.selectAll ('path')
                        .data ([null])
                    .enter ()
                        .append ('path')
                        .attr ('d', lineFn (d3.range (
                            0, maxY + 1, 1)))
                            //Math.max (
                                //1, Math.floor ((maxX - minX) / 100)))))
                        .attr ('stroke', 'black')
                        .attr ('stroke-width', 0.1)
                        .attr ('fill', 'none')
                ;
            }
        }
        this.svg.selectAll ('circle')
                .data (this.data.filter (function (a) { return a[1]; }))
            .enter ()
                .append ('circle')
                .each (function (d) {
                    var x = d[0][0],
                        y = maxY - (d[0].length > 1 ? 
                            d[0][1] : 
                            yScale);
                    d3.select (this).attr ({
                        cx: x,
                        cy: y,
                        r: .25,
                        fill: d[1] === 1 ? 
                            'blue' : 
                            that.colors[d[1] - 2]
                    })
                })
        ;
        this.svg.selectAll ('rect')
                .data (this.data.filter (function (a) { return !a[1]; }))
            .enter ()
                .append ('rect')
                .each (function (d) {
                    var x = d[0][0],
                        y = maxY - (d[0].length > 1 ? d[0][1] : d[1]);
                    d3.select (this).attr ({
                        x: x,
                        y: y,
                        width: .5,
                        height: .5,
                        fill: 'red',
                    })
                })
        ;
    }
};

return TrainingSetChart;

}) ();

return mlCharts;

}) ();


