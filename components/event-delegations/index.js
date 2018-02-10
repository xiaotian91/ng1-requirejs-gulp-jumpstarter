/*
 * angular-delegate-event
 * inspired by dolymood's work
 * author: dolymood
 *
 * modified by xiaotian li
 * blog: http://blog.aijc.net/angular-delegate-event/
 */

'use strict'

;
(function(_) {

    var root = document.documentElement;
    var matchesSelector = root.matches ||
        root.matchesSelector ||
        root.webkitMatchesSelector ||
        root.mozMatchesSelector ||
        root.msMatchesSelector ||
        root.oMatchesSelector;
    var mSelector = function(ele, selector) {
        if (typeof jQuery !== 'undefined') {
            return jQuery(ele).is(selector);
        }
        if (matchesSelector) {
            return matchesSelector.call(ele, selector);
        }
        return ele.tagName.toLowerCase() === selector;
    };
    var _getClosest = function(ele, selector, rootE) {
        rootE || (rootE = root);
        while (ele && ele != rootE && (rootE.contains(ele))) {
            if (mSelector(ele, selector)) {
                return ele;
            } else {
                ele = ele.parentNode;
            }
        }
        return null;
    };

    if (!root.contains) {
        Node.prototype.contains = function(arg) {
            return !!(this.compareDocumentPosition(arg) & 16);
        }
    }

    var rtObj = /^\s*?{.+}\s*?$/;


    function eventDelegationsController($parse) {
        return {
            link: function(scope, elem, attrs) {
                var events = attrs.ngxEventDelegations;

                if (attrs.ngxEventDelegations.match(rtObj)) { // 是对象
                    events = scope.$eval(events);
                    //angular.forEach(events, parseFn);
                    _.each(events, function(val, key) {
                        parseFn(val, key);
                    })
                } else {
                    //parseFn(events, eventName);
                }

                function parseFn(events, selector) {
                    var func = $parse(events);
                    elem.on('click', function(e) {
                        var target = e.target;
                        var el;
                        if ((el = _getClosest(target, selector, elem[0]))) {
                            e.delegationTarget = el;
                            func(angular.element(el).scope(), {$event: e, $params: [].slice.call(arguments, 1)});
                            if (!scope.$$phase) {
                                scope.$apply();
                            }
                        }
                    });
                }
            }
        }
    }



    angular.module('DelegateEvents', []).directive('ngxEventDelegations', eventDelegationsController);

})(_)