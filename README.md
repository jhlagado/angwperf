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
<script src="scripts/fixes/wperf.js"></script>
```

This utility is run from the console in the browser debugger. Before it can wok, it first must be initilaised:

wperf.init();

This puts Angular into debugging mode. 

To get a report:

wperf.report()

This will produce a report of a watch expressions and functions. 

For apps that use a lot of ng-repeats, this can often mean multiple watches per repeat item(!).
