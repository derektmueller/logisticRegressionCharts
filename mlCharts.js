
var mlCharts = (function () {

var mlCharts = {};

mlCharts.TrainingSetChart = (function () {

function TrainingSetChart (elem, data, title, dimension) {
    this.dimension = typeof dimension === 'undefined' ? 2 : dimension; 
    this.elem = elem;
    this.data = data;
    this.title = title;
    this.svg = d3.select (this.elem).append ('svg');
    $(this.elem).prepend ($('<div>', {
        html: this.title
    }));
    this.colors = ['red', 'blue', 'green', 'orange', 'teal'];
    this._setUpClickBehavior ();
    this.clickFn = function (x, y) {};
};

TrainingSetChart.prototype._setUpClickBehavior = function () {
    var that = this;
    this.svg.on ('click', function () {
        var x = d3.event.offsetX;
        var y = d3.event.offsetY;
        var viewBox = that.svg.attr ('viewBox').split (' ').
            map (function (a) { return parseInt (a, 10); });
        var width = $(that.svg[0][0]).width ();
        var height = $(that.svg[0][0]).height ();
        console.log ('viewBox = ');
        console.log (viewBox);
        var xCoord = (x / width) * viewBox[2] + viewBox[0];
        var yCoord = viewBox[3] - 
            ((y / height) * viewBox[3]) + viewBox[1];
        that.clickFn (xCoord, yCoord);
    });
};

TrainingSetChart.prototype.addData = function (data) {
    this.data = this.data.concat ([data]);
};

TrainingSetChart.prototype._plotExamples = function (
    us, classNum, guess, data) {

    var retDict = this._getSvgProperties ();
    var yScale = retDict.yScale;
    var minX = retDict.minX;
    var maxX = retDict.maxX;
    var maxY = retDict.maxY;
    guess = typeof guess === 'undefined' ? false : guess; 
    data = typeof data === 'undefined' ? this.data : data; 
    var that = this;
    if (!guess) {
        this.svg.selectAll ('circle.class' + classNum)
                .data (data.filter (function (a) { 
                    return us ? a[1] : !a[1]; 
                }))
            .enter ()
                .append ('circle')
                .attr ('class', 'class' + classNum)
                .each (function (d) {
                    if (us) {
                        var x = d[0][0],
                            y = maxY - (d[0].length > 1 ? 
                                d[0][1] : 
                                yScale);
                    } else {
                        var x = d[0][0],
                            y = maxY - 
                                (d[0].length > 1 ? d[0][1] : d[1]);
                    }
                    d3.select (this).attr ({
                        cx: x,
                        cy: y,
                        r: .25,
                        fill: that.colors[classNum]
                    })
                })
        ;
    } else {
        this.svg.selectAll ('rect.class' + classNum + guess)
                .data (data.filter (function (a) { 
                    return us ? a[1] : !a[1]; 
                }))
            .enter ()
                .append ('rect')
                .attr ('class', 'class' + classNum + guess)
                .each (function (d) {
                    if (us) {
                        var x = d[0][0],
                            y = maxY - (d[0].length > 1 ? 
                                d[0][1] : 
                                yScale);
                    } else {
                        var x = d[0][0],
                            y = maxY - 
                                (d[0].length > 1 ? d[0][1] : d[1]);
                    }
                    d3.select (this).attr ({
                        x: x - .25,
                        y: y - .25,
                        width: .5,
                        height: .5,
                        fill: that.colors[classNum]
                    })
                })
        ;
    }
};

TrainingSetChart.prototype.plotGuess = (function () {
    var guessNum = 0;
    return function (example, classNum, us) {
        us = typeof us === 'undefined' ? false : us; 
        this._plotExamples (us, classNum, ++guessNum, [example]);
    };
}) ();

TrainingSetChart.prototype._getSvgProperties = function () {
    var yScale = this.data[0][0].length > 1 ? 1 : 5;
    var minX = Math.min.apply (null, this.data.map (function (a) {
            return a[0][0];
        })) - 1,
        maxX = Math.max.apply (null, this.data.map (function (a) {
            return a[0][0];
        })) + 1,
        maxY = Math.max.apply (null, this.data.map (function (a) {
            return a[0].length > 1 ? a[0][1] : yScale;
        }));
    return {
        yScale: yScale,
        minX: minX,
        maxX: maxX,
        maxY: maxY,
    }
};

TrainingSetChart.prototype.plotDecisionBoundary = function (
    db, class1, class2) {

    class1 = typeof class1 === 'undefined' ? 0 : class1; 
    class2 = typeof class2 === 'undefined' ? 1 : class2; 
    var retDict = this._getSvgProperties ();
    var yScale = retDict.yScale;
    var minX = retDict.minX;
    var maxX = retDict.maxX;
    var maxY = retDict.maxY;
    var lineClass =  'class' + class1 + 'class' + class2;
    if (this.data[0][0].length > 1) {
        var lineFn = d3.svg.line ()
            .x (function (d, i) {
                return i;
            })
            .y (function (d, i) {
                return maxY - db (i); 
            })
            .interpolate ('linear')
        ;
        this.svg.selectAll ('path.' + lineClass)
                .data ([null])
            .enter ()
                .append ('path')
                .attr ('class', lineClass)
                .attr ('d', lineFn (d3.range (
                    minX, maxX + 1, 1)))
                .attr ('stroke', 'black')
                .attr ('stroke-width', 0.1)
                .attr ('fill', 'none')
        ;
    } else {
        var lineFn = d3.svg.line ()
            .x (function (d, i) {
                return db ();
            })
            .y (function (d, i) {
                return i; 
            })
            .interpolate ('linear')
        ;
        this.svg.selectAll ('path.' + lineClass)
                .data ([null])
            .enter ()
                .append ('path')
                .attr ('class', lineClass)
                .attr ('d', lineFn (d3.range (
                    0, maxY + 1, 1)))
                .attr ('stroke', 'black')
                .attr ('stroke-width', 0.1)
                .attr ('fill', 'none')
        ;
    }
};

TrainingSetChart.prototype.plot = function (class1, class2) {
    class1 = typeof class1 === 'undefined' ? 0 : class1; 
    class2 = typeof class2 === 'undefined' ? 1 : class2; 
    var that = this;
    if (this.dimension === 2) {
        var retDict = this._getSvgProperties ();
        var yScale = retDict.yScale;
        var minX = retDict.minX;
        var maxX = retDict.maxX;
        var maxY = retDict.maxY;
        this.svg.attr (
            'viewBox', 
            minX + ' -1 ' + 
            (1 + parseInt (maxX, 10)) + ' ' +
            (2 + maxY)
        );
        that._plotExamples (false, class1);
        if (class2 !== -1)
            that._plotExamples (true, class2);
    }
};

return TrainingSetChart;

}) ();

return mlCharts;

}) ();


