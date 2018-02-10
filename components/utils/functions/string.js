'use strict';
;(function(root, module_name, factory) {
    if (typeof define === 'function' && define.amd) { // AMD Support
        define([], factory);
    } else if (typeof require === 'function' && typeof module !== 'undefined' && typeof exports === 'object') { // CommonJS Support
        module.exports = factory();
    } else { // Browser Support
        if (!root[module_name]) {
            root[module_name] = factory(root);
        }
    }
}(this, 'xoStrings', function() {
    function StringsFactory() {

        var factory = {};
        var _repeat = function(str, times) {
            var result = '';
            for (var i = 0; i < times; i++) {
                result += str;
            }
            return result;
        };

        factory.setUsernamePrivacy = function(str, options) {
            var result;
            options = options || {};
            if (str !== undefined && str.length <= (options.maxLength || 5)) {
                var concealed = _repeat((options.omission || '*'), str.length);
                result = str.replace(str, concealed);
            } else if (str === undefined) {
                result = options.omission || "**";
            } else {
                var infoReg = /^(.).+(.)$/; // 要计算的字符*!/
                var regex = new RegExp(infoReg, 'igm'); // 使用g表示整个字符串都要匹配
                var concealed = _repeat((options.omission || "*"), str.length - 2);
                result = str.replace(regex, "$1" + concealed + "$2");
            }
            return result;

        };

        factory.splitToArray = function(str, separator) {
            return str.split(separator || '');
        };

        return factory;
    }

    return StringsFactory;
}));