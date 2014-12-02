(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof root === 'undefined' || root !== Object(root)) {
        throw new Error('templatizer: window does not exist or is not an object');
    } else {
        root.templatizer = factory();
    }
}(this, function () {
    var jade=function(){function r(r){return null!=r&&""!==r}function n(e){return Array.isArray(e)?e.map(n).filter(r).join(" "):e}var e={};return e.merge=function t(n,e){if(1===arguments.length){for(var a=n[0],s=1;s<n.length;s++)a=t(a,n[s]);return a}var i=n["class"],l=e["class"];(i||l)&&(i=i||[],l=l||[],Array.isArray(i)||(i=[i]),Array.isArray(l)||(l=[l]),n["class"]=i.concat(l).filter(r));for(var o in e)"class"!=o&&(n[o]=e[o]);return n},e.joinClasses=n,e.cls=function(r,t){for(var a=[],s=0;s<r.length;s++)a.push(t&&t[s]?e.escape(n([r[s]])):n(r[s]));var i=n(a);return i.length?' class="'+i+'"':""},e.attr=function(r,n,t,a){return"boolean"==typeof n||null==n?n?" "+(a?r:r+'="'+r+'"'):"":0==r.indexOf("data")&&"string"!=typeof n?" "+r+"='"+JSON.stringify(n).replace(/'/g,"&apos;")+"'":t?" "+r+'="'+e.escape(n)+'"':" "+r+'="'+n+'"'},e.attrs=function(r,t){var a=[],s=Object.keys(r);if(s.length)for(var i=0;i<s.length;++i){var l=s[i],o=r[l];"class"==l?(o=n(o))&&a.push(" "+l+'="'+o+'"'):a.push(e.attr(l,o,!1,t))}return a.join("")},e.escape=function(r){var n=String(r).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");return n===""+r?r:n},e.rethrow=function a(r,n,e,t){if(!(r instanceof Error))throw r;if(!("undefined"==typeof window&&n||t))throw r.message+=" on line "+e,r;try{t=t||require("fs").readFileSync(n,"utf8")}catch(s){a(r,null,e)}var i=3,l=t.split("\n"),o=Math.max(e-i,0),c=Math.min(l.length,e+i),i=l.slice(o,c).map(function(r,n){var t=n+o+1;return(t==e?"  > ":"    ")+t+"| "+r}).join("\n");throw r.path=n,r.message=(n||"Jade")+":"+e+"\n"+i+"\n\n"+r.message,r},e}();

    var templatizer = {};


    // modal.jade compiled template
    templatizer["modal"] = function tmpl_modal() {
        return '<div id="secondModal" tabindex="-1" role="dialog" aria-labelledby="basicModal" aria-hidden="false" class="modal fade container col-md-12"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" data-dismiss="modal" aria-hidden="true" class="close"></button><h4 id="myModalLabel" class="modal-title">Modal title</h4></div><div class="modal-body"><div id="wrapper"><div id="scroller" class="scroller"><ul id="frames"></ul></div></div><div id="wrapper2"><div id="scroller2" class="scroller"><ul id="frames2"></ul></div></div><form role="form" position:"top=""><div class="form_group"><div class="row"><div id="arrayLengthButton"></div></div></div></form><div class="modal-footer"><div class="btn-group btn-group-justified"><div class="btn-group"><div id="selectbuttondiv"></div></div><div class="btn-group"><button type="button" class="btn btn-default">Reset</button></div><div class="btn-group"><button id="showFirstPage" type="button" class="btn btn-default toggle_screens">Go Back</button></div></div></div></div></div></div></div>';
    };

    // scrollerLi.jade compiled template
    templatizer["scrollerLi"] = function tmpl_scrollerLi(locals) {
        var buf = [];
        var jade_mixins = {};
        var jade_interp;
        var locals_for_with = locals || {};
        (function(i, url) {
            buf.push("<li" + jade.attr("id", "sample_frame" + i, true, false) + "><img" + jade.attr("src", url, true, false) + "/></li>");
        }).call(this, "i" in locals_for_with ? locals_for_with.i : typeof i !== "undefined" ? i : undefined, "url" in locals_for_with ? locals_for_with.url : typeof url !== "undefined" ? url : undefined);
        return buf.join("");
    };

    return templatizer;
}));