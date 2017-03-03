# angwperf
AngularJS 1.0 watch performance tool

This tool helps with optimising the performance of Angular JS apps. 

It works by going through the DOM tree finding all the $watches and expressions and sorts them by how often they appear. 
Optimisation is a process of reducing the number of watches used in an app to a minimum. Most watches are actually 
not necessary once their value has been loaded so a good technique for eliminating watches is to replace them 
with one-time bindings.

e.g. in an Angular view you might have {{title}}. This is a binding to the view's scope and the expression "title" will 
be evaluated during every digest cycle. However this property may not change much over the course of the app so there 
isn't really a need to keep checking it. A one-time binding stops watching an expression the moment it stops being undefined. 
In that case it would be rewritten as {{::title}}. There are other optimisations that can be applied to reduce the number of 
watches.

This reason why watches are a problem is that Angular needs to check them on every "digest" cycle 
and this happens very frequently. The more watches there are the longer a digest cycle takes. 
Slowing down the digest cycle has bad effects on all aspects of the running of an AngularJS app. 
That's especially true when it's running on a slower browser such as Internet Explorer. 

By reducing the number of watches an app that is reasonably complex will be noticeably faster on all browsers.

Installation:

Simply link to this file from your AngularJS app index.html file

e.g.

```html
<script src="wperf.js"></script>
```

This utility is run from the console in the browser debugger. Before it can wok, it first must be initilaised:

```js
wperf.init();
```

This puts Angular into debugging mode. 

To get a report:

```js
wperf.report()
```

This will produce a report of a watch expressions and functions and the number of times this expression appears in 
the view. The best performance gains can be acheived by reducing the number of heavily repeated watches.
For apps that use a lot of ng-repeats, for example, this can often mean multiple watches per repeat item(!).
Replace as many of these as possibile with one-time bindings or find other ways of eliminating the repeated watches. 

It's also worth considering the performance difference between using ng-show and ng-hide. ng-show works by 
using CSS to change the element visibility. This is fast but it only masks elements which might still have bindings
in them that are being watched. ng-if is a heavier operation because it adds and removes elements from the DOM 
however in some cases it might be more efficient because it also removes watches from invisible elements. Sometimes
these things are only apparent after trying both ways.

Below is an example of a wperf report from a real app. It is simply a JSON object. The field "digest" gives an 
estimate of the length of time in seconds that a digest cycle takes when there has been no change. The fewer watches 
you have the shorter this figure should be. The field "total" is simply the number of unique watch expressions and the 
field "exps" is an array of strings of the format "<expression>:<number>", the watched expression is on the left 
of the colon and the number of times it occurs is on the right, the array has been sorted with the most repeated watches
first.

```js
{
    "digest": 1.2412999999997556
    "total": 62,
    "exps": [
        "{'md-button-selected': props.route.id == section.id}:50",
        "badgedata.loaded:10",
        "measurelist.length:10",
        "null:5",
        "!badgedata.loaded:5",
        "!measurelist.length:5",
        "item.document.name:4",
        "tab.scope.disabled:4",
        "undefined:4", "style:3",
        "icon:3", "initials:3",
        "key:3",
        "function elementWidth() {\r\n            return element.width()\r\n        }:3",
        "function () {\r\n                return cached.changes + basechanges;\r\n            }:3",
        "isimpersonating():3",
        "canCreateBadge:2",
        "$mdTabsCtrl.shouldPaginate:2",
        "$mdTabsCtrl.hasContent && $mdTabsCtrl.selectedIndex >= 0:2",
        "getSecNavClass(props):2",
        "hasBack():2",
        "notifCount:2",
        "props.route.sidenav != false:2",
        "item.document.reason:1",
        "getBadgeName(item):1",
        "item.document.status == 'expiring':1",
        "item.document.status == 'expired':1",
        "badgedata.loaded && !badgedata.results.length:1",
        "hasMoreBadges():1",
        "fontstyle:1", "elevio:1",
        "message:1", "person:1",
        "getTitle(personAvatar):1",
        "$mdTabsCtrl.selectedIndex:1",
        "{ 'md-center-tabs': $mdTabsCtrl.shouldCenterTabs }:1",
        "{ 'md-paginated': $mdTabsCtrl.shouldPaginate, 'md-center-tabs': $mdTabsCtrl.shouldCenterTabs }:1",
        "hasElevioHelp():1",
        "props.route.sidenav == false:1",
        "isLoading() || isSaving():1",
        "isSaving():1",
        "!primaryNav:1",
        "{'impersonate': isimpersonating()}:1",
        "props.route.toolbar !== false:1",
        "secondaryNav.length > 1:1",
        "props.route.showpersonavatar && personAvatar:1",
        "props.route.showappavatar && props.route.appname && appAvatar(props.route.appname):1",
        "{'bgpanel-on': props.route.bgpanel != false}:1",
        "{plainui: props.route.sidenav == false && props.route.toolbar == false && props.route.bgpanel == false}:1",
        "translate(props.route.title) + ' - xapiapps':1",
        "!props && !isTesServerOffline:1",
        "!props && isTesServerOffline:1",
        "props && props.showui:1",
    ],
}
```

