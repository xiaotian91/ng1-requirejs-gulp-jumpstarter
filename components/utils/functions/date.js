'use strict';;
(function(root, module_name, factory) {
    if (typeof define === 'function' && define.amd) { // AMD Support
        define([], factory);
    } else if (typeof require === 'function' && typeof module !== 'undefined' && typeof exports === 'object') { // CommonJS Support
        module.exports = factory();
    } else { // Browser Support
        if (!root[module_name]) {
            root[module_name] = factory(root);
        }
    }
}(this, 'xoDates', function() {
    function DatesFactory() {

        var factory = {};

        factory.getQuarterStartMonth = function() { // 当前季度的开始月
            var nowMonth = new Date().getMonth(); //当前月
            var quarterStartMonth = 0;
            if (nowMonth < 3) {
                quarterStartMonth = 0;
            }
            if (2 < nowMonth && nowMonth < 6) {
                quarterStartMonth = 3;
            }
            if (5 < nowMonth && nowMonth < 9) {
                quarterStartMonth = 6;
            }
            if (nowMonth > 8) {
                quarterStartMonth = 9;
            }
            return quarterStartMonth;

        };

        return factory;
    }

    return DatesFactory;
}));