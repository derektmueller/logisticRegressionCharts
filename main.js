
// univariate 
(function () {
    var lg = new LogisticRegression;
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
    var chart = new mlCharts.TrainingSetChart (
        chart$.get (0), trainingSet, 'Univariate Logistic Regression');
    chart.plotDecisionBoundary (function (x) {
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
        var guessedClass = guess >= 0.5 ? 1 : 0;
        chart.plotGuess (
            [a, guessedClass], guessedClass, guessedClass);
    });
}) ();

// multivariate
(function () {
    var lg = new LogisticRegression;
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
    var chart = new mlCharts.TrainingSetChart (
        chart$.get (0), trainingSet, 'Multivariate Logistic Regression');
    chart.plot ();
    chart.plotDecisionBoundary (function (x) {
        return ((lg.Theta[0] + lg.Theta[1] * x) / -lg.Theta[2]);
    });

    return;
    [ 
        [5, 8],
        //[7, 1],
        [1, 4],
        [2, 4],
        [2, 1],
        [4, 1],
        [4, 8],
        [1.5, 3],
        [4, 4],
    ].forEach (function (a) {
        var guess = h ([1].concat (a));
        chart.plotGuess ([a, 0], guess >= 0.5 ? 1 : 0);
    });
}) ();

// multivariate 1 vs. all
(function () {
    var lg = new LogisticRegression;
    var trainingSet = [
        [[0, 2], 0],
        [[.25, 3], 0],
        [[.5, 8], 0],
        [[1, 0], 1],
        [[1.5, 1], 1],
        [[4, 2], 1],
        [[5, 2], 1],
        [[6, 2], 1],
        [[6, 7], 2],
        [[8, 5], 2],
        [[8, 8], 2],
    ];
    lg.alpha = 0.1;
    var classifiers = [];
    var chart$ = $('<div>').attr ('class', 'chart');
    $('body').append (chart$);
    var chart = new mlCharts.TrainingSetChart (
        chart$.get (0), [],
        'Multivariate Logistic Regression (1 v all)');
    var oneVsAllTrainingSet;
    [0, 1, 2].every (function (a) {
        oneVsAllTrainingSet = $.extend (true, [], trainingSet).
            map (function (b) {
                b[1] = b[1] === a ? 0 : 1;
                return b;
            });
        lg.setTrainingSet (oneVsAllTrainingSet);
        lg.gradientDescent (1000);
        classifiers.push (lg.getH (lg.Theta));
        chart.data = oneVsAllTrainingSet;
        chart.plot (a, -1);
        chart.plotDecisionBoundary (function (x) {
            return ((lg.Theta[0] + lg.Theta[1] * x) / -lg.Theta[2]);
        }, a, -1);
        return true; 
    });

    chart.clickFn = function (x, y) {
        var a = [x, y];
        var guess;
        var guessedClass = null;
        var min = Infinity;
        for (var i in classifiers) {
            if ((guess = classifiers[i] ([1].concat (a))) < min) {
                min = guess;
                guessedClass = i;
            }
        }
        chart.plotGuess ([a, 0], guessedClass);
    };
    
    [ 
//        [5, 8],
        //[7, 1],
//        [1, 4],
//        [2, 4],
//        [2, 1],
//        [4, 1],
//        [4, 8],
//        [1.5, 5],
        //[4, 4],
    ].forEach (function (a) {
        var guess;
        var guessedClass = null;
        var min = Infinity;
        for (var i in classifiers) {
            if ((guess = classifiers[i] ([1].concat (a))) < min) {
                min = guess;
                guessedClass = i;
            }
        }
        chart.plotGuess ([a, 0], guessedClass);
    });
}) ();
