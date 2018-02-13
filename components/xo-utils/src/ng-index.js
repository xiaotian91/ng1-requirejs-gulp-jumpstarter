'use strict';
(function(root, module_name, factory) {
  if (typeof define === 'function' && define.amd) { // Angular-based AMD Support
    define(['./ng-factories', './ng-directives', './ng-filters'], factory);
  } else { // Browser Support
    if (!root[module_name]) {
      root[module_name] = factory();
    }
  }
}(this, 'xoUtils', function() {
  var app = angular.module('xo.utils', ['xo.factories', 'xo.directives', 'xo.filters']);
}));