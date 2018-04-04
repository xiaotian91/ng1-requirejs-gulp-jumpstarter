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

        /*
         * @private
         */
        function _repeat(str, times) {
            return new Array(times + 1).join(str);
        };

        /* Pick A Random String From A Group of items */
        factory.getRandomFrom = function(arr) {
          var len = arr.length;
          return arr[Math.floor(Math.random()*len)];
        };

        /*
         * @public
         * Creates a string from an input string like this `[Test][][Test2]`
         * @param {String} The string to check
         * @param {String} The separator
         * @returns {String} Returns `string`
         */
        factory.getTxtFromContinousBrackets = function(str, separator) {
            separator = separator || '|';
            var regx = /[\[, \(]+(.*?)[\], \)]+/g;
            var arr = str.match(regx);
            var result = '';
            for (var i = 0; i < arr.length; i++) {
                if (/[\[, \(][\], \)]/.test(arr[i])) {
                    result += 'undefined' + separator;
                } else {
                    result += arr[i].substring(1, arr[i].length - 1) + separator;
                }
            };
            return result.substring(0, result.length - 1);
        }

        /*
         * @public
         * Converts a suffix of an url
         * @param {String} [url] The string to convert
         * @params {String} [suffix] The wanted suffix
         * @returns {String} Returns `string`
         */
        factory.convert2UrlFromSuffix = function(url, suffix = 'jpg') {
            var _inputSuffix = url.match(/([a-z0-9\-]+).([a-z\.]+[a-z])$/gi)[0].match(/.([a-z0-9\-]+)$/gi)[0];
            if (String(suffix) && !!/^.([a-z0-9\-]+)/gi.test(suffix)) {
                suffix = '.' + suffix;
            }
            return url.split(_inputSuffix)[0] + suffix;
        }

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