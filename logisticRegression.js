//#!/usr/bin/node

var mathjs = require ('mathjs');

var LogisticRegression = (function () {

function get (i) {
    return function (a) {
        return a[i];
    }
}

function LogisticRegression () {
    this.alpha = 0.1;
    this.trainingSet = [];
    this.Theta = [1, 1];
};

LogisticRegression.prototype.cost = function (Theta) {
    var m = this.trainingSet.length,
        h = this.getH (Theta);
    return -(1 / m) * mathjs.multiply (
        mathjs.ones (1, m),
        mathjs.add (
            mathjs.dotMultiply (
                this.trainingSet.map (get (1)),
                this.trainingSet.map (function (a) {
                    return mathjs.log (h (a[0]));
                }).map (function (a) {
                    if (a === -Infinity) return Number.MIN_VALUE;
                    if (a === Infinity) return Number.MAX_VALUE;
                    return a;
                })
            ),
            mathjs.dotMultiply (
                mathjs.subtract (
                    mathjs.ones (m, 1),
                    this.trainingSet.map (get (1))
                ),
                this.trainingSet.map (function (a) {
                    return mathjs.log (1 - h (a[0]));
                }).map (function (a) {
                    if (a === -Infinity) return Number.MIN_VALUE;
                    if (a === Infinity) return Number.MAX_VALUE;
                    return a;
                })
            )
        )
    );
};

LogisticRegression.prototype.getH = function (Theta) {
    return function (X) {
        var ret = mathjs.divide (
            1,
            mathjs.add (
                1,
                mathjs.pow (
                    Math.E, 
                    mathjs.multiply (
                        -1,
                        mathjs.number (
                            mathjs.multiply (
                                mathjs.transpose (Theta), 
                                X
                            )
                        )
                    )
                )
            )
        );
        return ret;
    }
};

LogisticRegression.prototype.setTrainingSet = function (set) {
    this.trainingSet = JSON.parse (JSON.stringify (set));
    this.trainingSet.forEach (function (a) {
        a[0] = [1].concat (a[0]);
    });
};

LogisticRegression.prototype.gradientDescent = function (iterations) {
    var Theta = [], 
        h,
        J,
        m = this.trainingSet.length;
    for (var i = 0; i < this.trainingSet[0][0].length; i++) {
        Theta.push (1);
    }
    for (var i = 0; i < iterations; i++) {
        h = this.getH (Theta);
        Theta = mathjs.subtract (
            Theta, 
            mathjs.dotMultiply (
                this.alpha / m,
                mathjs.multiply (
                    mathjs.transpose (mathjs.dotMultiply (
                        mathjs.subtract (
                            this.trainingSet.map (function (a) {
                                return h (a[0]);
                            }),
                            this.trainingSet.map (get (1))
                        ),
                        this.trainingSet.map (get (0))
                    )),
                    mathjs.ones (m, 1)
                )
            )
        );
        console.log (this.cost (Theta));
    }
    this.Theta = Theta.valueOf ().map (function (a) { return a[0]; });
};

return LogisticRegression;

}) ();

if (typeof module !== 'undefined') module.exports = LogisticRegression;

//GLOBAL.test = function () {
//    var lg = logisticRegression;
//    lg.trainingSet = [
//        [[-20], 0],
//        [[-9], 0],
//        [[-1], 0],
//        [[0], 0],
//        [[-.25], 0],
//        [[-.5], 0],
//        [[.5], 0],
//        [[2], 1],
//        [[4], 1],
//        [[5], 1],
//        [[7], 1]
//    ];
//    //console.log (logisticRegression.getH ([1, 1]) ([1, -10]));
//    lg.alpha = 0.001;
//    lg.gradientDescent (2070);
//    var h = lg.getH (lg.Theta);
//    console.log ('est:');
//    console.log (h (-9));
//    console.log (h (-8));
//    console.log (h (-2));
//    console.log (h (-.5));
//    console.log (h (0));
//    console.log ('should be 1');
//    console.log (h (1));
//    console.log (h (4));
//    console.log (h (5));
//    console.log (h (7));
//};


