function AppInfo(){var e={appname:"unknown",version:0},o=window.navigator.userAgent.toLowerCase();return-1!=o.indexOf("edge")?e.appname="edge":/(msie|firefox|opera|chrome)\D+(\d[\d.]*)/.test(o)?(e.appname=RegExp.$1,e.version=RegExp.$2):/version\D+(\d[\d.]*).*safari/.test(o)&&(e.appname="safari",e.version=RegExp.$1),console.log(e.appname),console.log(e.version),e}function SelfAdaption(e){var o=(document.body.offsetHeight+document.body.offsetWidth)/2500;o>1&&(o=1),e.style.WebkitTransform="scale("+o+")",e.style.msTransform="scale("+o+")",e.style.transform="scale("+o+")"}function JqueryUnsupportedAnimation(){}JqueryUnsupportedAnimation.prototype={rotate:function(e,o,n,t,a){var r=!0;if(r){if(r=!1,e.length>0||console.log("参数(1)错误:获取dom对象失败"),n===o)console.log("参数(2,3)错误:起始值与结束值相同");else var s=(n-o)/(t/10);t>10||console.log("参数(4)错误:动画时间不能小于10");var i=setInterval(function(){o+=s,Math.abs(n-o)<1&&(r=!0,o=n,clearInterval(i),$.isFunction(a)&&a()),e.css({transform:"rotate("+o+"deg)"})},10)}},rotateY:function(e,o,n,t,a){var r=!0;if(r){if(r=!1,e.length>0||console.log("参数(1)错误:获取dom对象失败"),n===o)console.log("参数(2,3)错误:起始值与结束值相同");else var s=(n-o)/(t/10);t>10||console.log("参数(4)错误:动画时间不能小于10");var i=setInterval(function(){o+=s,Math.abs(n-o)<1&&(r=!0,o=n,clearInterval(i),$.isFunction(a)&&a()),e.css({transform:"rotateY("+o+"deg)"})},10)}}};var jua=new JqueryUnsupportedAnimation;