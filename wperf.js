// note: this code has a depency on the lodash library
// Put initialisation code inside a self executing function to prevent wasteful 
// declaration global variables. 

(function() {

    // initialise an object to add to the global window object 
    // so that it can be accessed from the browser debugging console.

    window.wperf =  {
        init: init,
        report: report,
        digest: digest,
    };

    //reload the app in debugging mode. This must be called before calling report.

    function init() {
        angular.reloadWithDebugInfo();
    }

    function report(root) {

        if (!root)
            root = angular.element(document.getElementsByTagName('html'));

        //collect all watch expressions in the DOM tree
        //these may be functions or string expressions
        var watches = [];
        gatherWatches(root, watches);

        //use the expression of function as a key and tally how many occurances
        //of this state happen in the view
        var exps = _.values(_.transform(watches, function(acc, item) {
            var exp = item.exp;
            var kexp = String(exp);
            if (acc[kexp] !== undefined) {
                acc[kexp].count++
            } else {
                acc[kexp] = {
                    key: kexp,
                    count: 1
                };
            }
        }, {}));

        //then produce a list of expressions and their tallies in 
        //a convenient format to disaply on the console.
        var exps2 = _.reverse(_.sortBy(exps, 'count'));
        var exps3 = _.map(exps2, function(item) {
            return item.key + ':' + item.count
        });

        var reportObj = {
            total: exps.length,
            gtotal: _.reduce(exps, function(acc, item){
                return acc + item.count;
            }, 0),
            exps: exps3,
        }

        digest(reportObj);
        return reportObj;
    }

    //traverse the DOM from a starting element looking for scopes associated with the element
    //add these scopes to a list and then recursively look inside children elements 
   function gatherWatches(element, watchers) {

        gatherFromScope(element, '$scope', watchers)
        gatherFromScope(element, '$isolateScope', watchers)
        _.forEach(element.children(), function(childElement) {
            gatherWatches(angular.element(childElement), watchers);
        });
    }

    //Angular has two types of scope that can be associated with an element
    function gatherFromScope(element, scopeProperty, watchers) {

        if (element.data() && element.data().hasOwnProperty(scopeProperty)) {
            _.forEach(element.data()[scopeProperty].$$watchers, function(watcher) {
                watchers.push(watcher);
            });
        }
    }

    //measure minimum length of a digest cycle (i.e. where no data has changed)
    function digest(reportObj) {
        angular.element(document.querySelector('[ng-app]')).injector().invoke(['$rootScope', function($rootScope) {
            var i, t = 0;
            var a = performance.now();
            var n = 50;
            for (i = 0; i < n; i++) {
                $rootScope.$apply();
            }
            t = performance.now() - a;
            reportObj.digest = (t / n);
        }
        ]);
    }
})();
