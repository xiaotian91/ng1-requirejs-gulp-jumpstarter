'use strict';
;(function(root, module_name, factory) {
    if (typeof define === 'function' && define.amd) { // AMD Support
        define([], factory);
    } else { // Browser Support
        if (!root[module_name]) {
            root[module_name] = factory(root);
        }
    }
}(this, 'xoBrowser', function() {
    function BrowserFactory() {

        var factory = {};

        factory.getQueryString = function(name) { // 获取地址栏url
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var reg_rewrite = new RegExp("(^|/)" + name + "/([^/]*)(/|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            var q = window.location.pathname.substr(1).match(reg_rewrite);
            if (r != null) {
                return decodeURIComponent(r[2]);
            } else if (q != null) {
                return decodeURIComponent(q[2]);
            } else {
                return null;
            }
        }

        factory.getBrowserType = function() {
            /* 
             * 描述：判断浏览器信息 
             * 编写：LittleQiang_w 
             * 日期：2016.1.5 
             * 版本：V1.1 
             */


            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串 
            var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器 
            var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器 
            var isEdge = userAgent.indexOf("Windows NT 6.1; Trident/7.0;") > -1 && !isIE; //判断是否IE的Edge浏览器 
            var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器 
            var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器 
            var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1; //判断Chrome浏览器 

            if (isIE) {
                var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
                reIE.test(userAgent);
                var fIEVersion = parseFloat(RegExp["$1"]);
                if (fIEVersion == 7) {
                    return "IE7";
                } else if (fIEVersion == 8) {
                    return "IE8";
                } else if (fIEVersion == 9) {
                    return "IE9";
                } else if (fIEVersion == 10) {
                    return "IE10";
                } else if (fIEVersion == 11) {
                    return "IE11";
                } else {
                    return "0"
                } //IE版本过低 
            } //isIE end 

            if (isFF) {
                return "FF";
            }
            if (isOpera) {
                return "Opera";
            }
            if (isSafari) {
                return "Safari";
            }
            if (isChrome) {
                return "Chrome";
            }
            if (isEdge) {
                return "Edge";
            }

            //判断是否是IE浏览器 
            function isIE() {
                var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串 
                var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器 
                if (isIE) {
                    return "1";
                } else {
                    return "-1";
                }
            }


            //判断是否是IE浏览器，包括Edge浏览器 
            function IEVersion() {
                var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串 
                var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器 
                var isEdge = userAgent.indexOf("Windows NT 6.1; Trident/7.0;") > -1 && !isIE; //判断是否IE的Edge浏览器 
                if (isIE) {
                    var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
                    reIE.test(userAgent);
                    var fIEVersion = parseFloat(RegExp["$1"]);
                    if (fIEVersion == 7) {
                        return "IE7";
                    } else if (fIEVersion == 8) {
                        return "IE8";
                    } else if (fIEVersion == 9) {
                        return "IE9";
                    } else if (fIEVersion == 10) {
                        return "IE10";
                    } else if (fIEVersion == 11) {
                        return "IE11";
                    } else {
                        return "0"
                    } //IE版本过低 
                } else if (isEdge) {
                    return "Edge";
                } else {
                    return "-1"; //非IE 
                }
            }
        }


        return factory;
    }

    return BrowserFactory;
}));