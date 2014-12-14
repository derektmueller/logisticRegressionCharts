//(function () {
//    var lg = logisticRegression;
//    var trainingSet = [
//        [[0], 0],
//        [[.25], 0],
//        [[.5], 0],
//        [[1], 0],
//        [[1.5], 0],
//        [[2], 0],
//        [[3], 0],
//        [[4], 0],
//        [[4.5], 1],
//        [[5], 1],
//        [[7], 1],
//        [[8], 1],
//        [[9], 1],
//        [[20], 1],
//        [[40], 1],
//    ];
//    lg.setTrainingSet (trainingSet);
//    //console.log (logisticRegression.getH ([1, 1]) ([1, -10]));
//    lg.alpha = 0.001;
//    lg.gradientDescent (2070);
//    var h = lg.getH (lg.Theta);
//    var chart$ = $('<div>').attr ('class', 'chart');
//    $('body').append (chart$);
//    var chart = new mlCharts.TrainingSetChart (
//        chart$.get (0), trainingSet);
//    chart.plot ();/*function (X) {
//        return mathjs.number (mathjs.multiply (
//            mathjs.transpose (lg.Theta),
//            [1].concat (X)
//        )) - 0.5;
//    });*/
////    console.log ('est:');
//    //console.log (h (4));
//    //console.log (h (9));
////    console.log (h (-8));
////    console.log (h (-2));
////    console.log (h (-.5));
////    console.log (h (0));
////    console.log ('should be 1');
////    console.log (h (1));
////    console.log (h (4));
////    console.log (h (5));
////    console.log (h (7));
//}) ();


(function () {
    var lg = logisticRegression;
    var trainingSet = [
        [[0, 2], 0],
        [[.25, 3], 0],
        [[.5, 8], 0],
        [[1, 0], 0],
        [[1.5, 1], 0],
        [[4, 5], 1],
        [[5, 4], 1],
        [[6, 4], 1],
    ];
    lg.setTrainingSet (trainingSet);
    //console.log (logisticRegression.getH ([1, 1]) ([1, -10]));
    lg.alpha = 0.1;
    lg.gradientDescent (1000);
    var h = lg.getH (lg.Theta);
    var chart$ = $('<div>').attr ('class', 'chart');
    $('body').append (chart$);
    chart = new mlCharts.TrainingSetChart (
        chart$.get (0), trainingSet, function (x) {
        return ((lg.Theta[0] + lg.Theta[1] * x) / -lg.Theta[2]) - .5;
    });
    chart.plot ();
//    console.log ('est:');

    return;
    [ 
        [5, 8],
        [7, 1],
        [1, 4],
        [2, 4],
        [2, 1],
        [4, 1],
        [4, 8],
        [1.5, 3],
        [4, 4],
    ].forEach (function (a) {
        var guess = h ([1].concat (a));
        chart.addData ([a, guess >= 0.5 ? 2 : 3]);
        chart.plot ();
    });
//    console.log (h (-8));
//    console.log (h (-2));
//    console.log (h (-.5));
//    console.log (h (0));
//    console.log ('should be 1');
//    console.log (h (1));
//    console.log (h (4));
//    console.log (h (5));
//    console.log (h (7));
}) ();

