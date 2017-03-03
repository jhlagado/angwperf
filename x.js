(function() {

    var active = false;

    var wperf = {
        init: init,
        report: report,
        digest: digest,
    }

    window.wperf = wperf;

    function init() {
        angular.reloadWithDebugInfo();
    }

    function report(root, onlyexprs) {

        if (!root)
            root = angular.element(document.getElementsByTagName('html'));

        var watchers = [];
        gatherWatches(root, watchers);

        var exps = _.transform(watchers, function(acc, item) {
            var exp = item.exp;
            if (onlyexprs && !_.isString(exp))
                return;
            if (acc[exp] !== undefined) {
                acc[exp].count++
            } else {
                acc[exp] = {
                    key: exp,
                    count: 1
                };
            }
        }, {});

        var exps2 = _.reverse(_.sortBy(_.values(exps), 'count'));
        var exps3 = _.map(exps2, function(item) {
            return item.key + ':' + item.count
        });

        var reportObj = {
            exps: exps3,
        }

        digest(reportObj);
        return reportObj;

    }

    function gatherWatches(element, watchers) {
        _.each(['$scope', '$isolateScope'], function(scopeProperty) {
            if (element.data() && element.data().hasOwnProperty(scopeProperty)) {
                _.each(element.data()[scopeProperty].$$watchers, function(watcher) {
                    watchers.push(watcher);
                });
            }
        });
        _.each(element.children(), function(childElement) {
            gatherWatches(angular.element(childElement), watchers);
        });
    }

    function digest(reportObj) {
        //measures length of digest cycle with no changes
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
