(function () {
    var lg = logisticRegression;
    var trainingSet = [
        [[0], 0],
        [[.25], 0],
        [[.5], 0],
        [[1], 0],
        [[1.5], 0],
        [[2], 0],
        [[3], 1],
        [[4], 1],
        [[4.5], 1],
        [[5], 1],
        [[7], 1],
        [[8], 1],
        [[9], 1],
        [[20], 1],
    ];
    lg.setTrainingSet (trainingSet);
    lg.alpha = 0.1;
    lg.gradientDescent (2000);
    var h = lg.getH (lg.Theta);
    var chart$ = $('<div>').attr ('class', 'chart');
    $('body').append (chart$);
    chart = new mlCharts.TrainingSetChart (
        chart$.get (0), trainingSet, function (x) {

        return (-lg.Theta[0] / lg.Theta[1]);
    });
    chart.plot ();

    return;
    [ 
        [-4.5],
        [-3.5],
        [-2],
        [-1],
        [0],
        [.5],
        [1],
        [1.5],
        [2],
        [4],
        [10],
        [15],
        [25],
    ].forEach (function (a) {
        var guess = h ([1].concat (a));
        chart.addData ([a, guess >= 0.5 ? 3 : 2]);
        chart.plot ();
    });
}) ();


(function () {
    var lg = logisticRegression;
    var trainingSet = [
        [[0, 2], 0],
        [[.25, 3], 0],
        [[.5, 8], 0],
        [[1, 0], 1],
        [[1.5, 1], 1],
        [[4, 5], 1],
        [[5, 4], 1],
        [[6, 4], 1],
    ];
    lg.setTrainingSet (trainingSet);
    lg.alpha = 0.1;
    lg.gradientDescent (1000);
    var h = lg.getH (lg.Theta);
    var chart$ = $('<div>').attr ('class', 'chart');
    $('body').append (chart$);
    chart = new mlCharts.TrainingSetChart (
        chart$.get (0), trainingSet, function (x) {
        return ((lg.Theta[0] + lg.Theta[1] * x) / -lg.Theta[2]);
    });
    chart.plot ();

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

