(function(a, b) {
    function cy(a) {
        return f.isWindow(a) ? a : a.nodeType === 9 ? a.defaultView || a.parentWindow : !1
    }

    function cv(a) {
        if (!ck[a]) {
            var b = c.body,
                d = f("<" + a + ">").appendTo(b),
                e = d.css("display");
            d.remove();
            if (e === "none" || e === "") {
                cl || (cl = c.createElement("iframe"), cl.frameBorder = cl.width = cl.height = 0), b.appendChild(cl);
                if (!cm || !cl.createElement) cm = (cl.contentWindow || cl.contentDocument).document, cm.write((c.compatMode === "CSS1Compat" ? "<!doctype html>" : "") + "<html><body>"), cm.close();
                d = cm.createElement(a), cm.body.appendChild(d), e = f.css(d, "display"), b.removeChild(cl)
            }
            ck[a] = e
        }
        return ck[a]
    }

    function cu(a, b) {
        var c = {};
        f.each(cq.concat.apply([], cq.slice(0, b)), function() {
            c[this] = a
        });
        return c
    }

    function ct() {
        cr = b
    }

    function cs() {
        setTimeout(ct, 0);
        return cr = f.now()
    }

    function cj() {
        try {
            return new a.ActiveXObject("Microsoft.XMLHTTP")
        } catch (b) {}
    }

    function ci() {
        try {
            return new a.XMLHttpRequest
        } catch (b) {}
    }

    function cc(a, c) {
        a.dataFilter && (c = a.dataFilter(c, a.dataType));
        var d = a.dataTypes,
            e = {},
            g, h, i = d.length,
            j, k = d[0],
            l, m, n, o, p;
        for (g = 1; g < i; g++) {
            if (g === 1)
                for (h in a.converters) typeof h == "string" && (e[h.toLowerCase()] = a.converters[h]);
            l = k, k = d[g];
            if (k === "*") k = l;
            else if (l !== "*" && l !== k) {
                m = l + " " + k, n = e[m] || e["* " + k];
                if (!n) {
                    p = b;
                    for (o in e) {
                        j = o.split(" ");
                        if (j[0] === l || j[0] === "*") {
                            p = e[j[1] + " " + k];
                            if (p) {
                                o = e[o], o === !0 ? n = p : p === !0 && (n = o);
                                break
                            }
                        }
                    }
                }!n && !p && f.error("No conversion from " + m.replace(" ", " to ")), n !== !0 && (c = n ? n(c) : p(o(c)))
            }
        }
        return c
    }

    function cb(a, c, d) {
        var e = a.contents,
            f = a.dataTypes,
            g = a.responseFields,
            h, i, j, k;
        for (i in g) i in d && (c[g[i]] = d[i]);
        while (f[0] === "*") f.shift(), h === b && (h = a.mimeType || c.getResponseHeader("content-type"));
        if (h)
            for (i in e)
                if (e[i] && e[i].test(h)) {
                    f.unshift(i);
                    break
                } if (f[0] in d) j = f[0];
        else {
            for (i in d) {
                if (!f[0] || a.converters[i + " " + f[0]]) {
                    j = i;
                    break
                }
                k || (k = i)
            }
            j = j || k
        }
        if (j) {
            j !== f[0] && f.unshift(j);
            return d[j]
        }
    }

    function ca(a, b, c, d) {
        if (f.isArray(b)) f.each(b, function(b, e) {
            c || bE.test(a) ? d(a, e) : ca(a + "[" + (typeof e == "object" || f.isArray(e) ? b : "") + "]", e, c, d)
        });
        else if (!c && b != null && typeof b == "object")
            for (var e in b) ca(a + "[" + e + "]", b[e], c, d);
        else d(a, b)
    }

    function b_(a, c) {
        var d, e, g = f.ajaxSettings.flatOptions || {};
        for (d in c) c[d] !== b && ((g[d] ? a : e || (e = {}))[d] = c[d]);
        e && f.extend(!0, a, e)
    }

    function b$(a, c, d, e, f, g) {
        f = f || c.dataTypes[0], g = g || {}, g[f] = !0;
        var h = a[f],
            i = 0,
            j = h ? h.length : 0,
            k = a === bT,
            l;
        for (; i < j && (k || !l); i++) l = h[i](c, d, e), typeof l == "string" && (!k || g[l] ? l = b : (c.dataTypes.unshift(l), l = b$(a, c, d, e, l, g)));
        (k || !l) && !g["*"] && (l = b$(a, c, d, e, "*", g));
        return l
    }

    function bZ(a) {
        return function(b, c) {
            typeof b != "string" && (c = b, b = "*");
            if (f.isFunction(c)) {
                var d = b.toLowerCase().split(bP),
                    e = 0,
                    g = d.length,
                    h, i, j;
                for (; e < g; e++) h = d[e], j = /^\+/.test(h), j && (h = h.substr(1) || "*"), i = a[h] = a[h] || [], i[j ? "unshift" : "push"](c)
            }
        }
    }

    function bC(a, b, c) {
        var d = b === "width" ? a.offsetWidth : a.offsetHeight,
            e = b === "width" ? bx : by,
            g = 0,
            h = e.length;
        if (d > 0) {
            if (c !== "border")
                for (; g < h; g++) c || (d -= parseFloat(f.css(a, "padding" + e[g])) || 0), c === "margin" ? d += parseFloat(f.css(a, c + e[g])) || 0 : d -= parseFloat(f.css(a, "border" + e[g] + "Width")) || 0;
            return d + "px"
        }
        d = bz(a, b, b);
        if (d < 0 || d == null) d = a.style[b] || 0;
        d = parseFloat(d) || 0;
        if (c)
            for (; g < h; g++) d += parseFloat(f.css(a, "padding" + e[g])) || 0, c !== "padding" && (d += parseFloat(f.css(a, "border" + e[g] + "Width")) || 0), c === "margin" && (d += parseFloat(f.css(a, c + e[g])) || 0);
        return d + "px"
    }

    function bp(a, b) {
        b.src ? f.ajax({
            url: b.src,
            async: !1,
            dataType: "script"
        }) : f.globalEval((b.text || b.textContent || b.innerHTML || "").replace(bf, "/*$0*/")), b.parentNode && b.parentNode.removeChild(b)
    }

    function bo(a) {
        var b = c.createElement("div");
        bh.appendChild(b), b.innerHTML = a.outerHTML;
        return b.firstChild
    }

    function bn(a) {
        var b = (a.nodeName || "").toLowerCase();
        b === "input" ? bm(a) : b !== "script" && typeof a.getElementsByTagName != "undefined" && f.grep(a.getElementsByTagName("input"), bm)
    }

    function bm(a) {
        if (a.type === "checkbox" || a.type === "radio") a.defaultChecked = a.checked
    }

    function bl(a) {
        return typeof a.getElementsByTagName != "undefined" ? a.getElementsByTagName("*") : typeof a.querySelectorAll != "undefined" ? a.querySelectorAll("*") : []
    }

    function bk(a, b) {
        var c;
        if (b.nodeType === 1) {
            b.clearAttributes && b.clearAttributes(), b.mergeAttributes && b.mergeAttributes(a), c = b.nodeName.toLowerCase();
            if (c === "object") b.outerHTML = a.outerHTML;
            else if (c !== "input" || a.type !== "checkbox" && a.type !== "radio") {
                if (c === "option") b.selected = a.defaultSelected;
                else if (c === "input" || c === "textarea") b.defaultValue = a.defaultValue
            } else a.checked && (b.defaultChecked = b.checked = a.checked), b.value !== a.value && (b.value = a.value);
            b.removeAttribute(f.expando)
        }
    }

    function bj(a, b) {
        if (b.nodeType === 1 && !!f.hasData(a)) {
            var c, d, e, g = f._data(a),
                h = f._data(b, g),
                i = g.events;
            if (i) {
                delete h.handle, h.events = {};
                for (c in i)
                    for (d = 0, e = i[c].length; d < e; d++) f.event.add(b, c + (i[c][d].namespace ? "." : "") + i[c][d].namespace, i[c][d], i[c][d].data)
            }
            h.data && (h.data = f.extend({}, h.data))
        }
    }

    function bi(a, b) {
        return f.nodeName(a, "table") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a
    }

    function U(a) {
        var b = V.split("|"),
            c = a.createDocumentFragment();
        if (c.createElement)
            while (b.length) c.createElement(b.pop());
        return c
    }

    function T(a, b, c) {
        b = b || 0;
        if (f.isFunction(b)) return f.grep(a, function(a, d) {
            var e = !!b.call(a, d, a);
            return e === c
        });
        if (b.nodeType) return f.grep(a, function(a, d) {
            return a === b === c
        });
        if (typeof b == "string") {
            var d = f.grep(a, function(a) {
                return a.nodeType === 1
            });
            if (O.test(b)) return f.filter(b, d, !c);
            b = f.filter(b, d)
        }
        return f.grep(a, function(a, d) {
            return f.inArray(a, b) >= 0 === c
        })
    }

    function S(a) {
        return !a || !a.parentNode || a.parentNode.nodeType === 11
    }

    function K() {
        return !0
    }

    function J() {
        return !1
    }

    function n(a, b, c) {
        var d = b + "defer",
            e = b + "queue",
            g = b + "mark",
            h = f._data(a, d);
        h && (c === "queue" || !f._data(a, e)) && (c === "mark" || !f._data(a, g)) && setTimeout(function() {
            !f._data(a, e) && !f._data(a, g) && (f.removeData(a, d, !0), h.fire())
        }, 0)
    }

    function m(a) {
        for (var b in a) {
            if (b === "data" && f.isEmptyObject(a[b])) continue;
            if (b !== "toJSON") return !1
        }
        return !0
    }

    function l(a, c, d) {
        if (d === b && a.nodeType === 1) {
            var e = "data-" + c.replace(k, "-$1").toLowerCase();
            d = a.getAttribute(e);
            if (typeof d == "string") {
                try {
                    d = d === "true" ? !0 : d === "false" ? !1 : d === "null" ? null : f.isNumeric(d) ? parseFloat(d) : j.test(d) ? f.parseJSON(d) : d
                } catch (g) {}
                f.data(a, c, d)
            } else d = b
        }
        return d
    }

    function h(a) {
        var b = g[a] = {},
            c, d;
        a = a.split(/\s+/);
        for (c = 0, d = a.length; c < d; c++) b[a[c]] = !0;
        return b
    }
    var c = a.document,
        d = a.navigator,
        e = a.location,
        f = function() {
            function J() {
                if (!e.isReady) {
                    try {
                        c.documentElement.doScroll("left")
                    } catch (a) {
                        setTimeout(J, 1);
                        return
                    }
                    e.ready()
                }
            }
            var e = function(a, b) {
                    return new e.fn.init(a, b, h)
                },
                f = a.jQuery,
                g = a.$,
                h, i = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,
                j = /\S/,
                k = /^\s+/,
                l = /\s+$/,
                m = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,
                n = /^[\],:{}\s]*$/,
                o = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
                p = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                q = /(?:^|:|,)(?:\s*\[)+/g,
                r = /(webkit)[ \/]([\w.]+)/,
                s = /(opera)(?:.*version)?[ \/]([\w.]+)/,
                t = /(msie) ([\w.]+)/,
                u = /(mozilla)(?:.*? rv:([\w.]+))?/,
                v = /-([a-z]|[0-9])/ig,
                w = /^-ms-/,
                x = function(a, b) {
                    return (b + "").toUpperCase()
                },
                y = d.userAgent,
                z, A, B, C = Object.prototype.toString,
                D = Object.prototype.hasOwnProperty,
                E = Array.prototype.push,
                F = Array.prototype.slice,
                G = String.prototype.trim,
                H = Array.prototype.indexOf,
                I = {};
            e.fn = e.prototype = {
                constructor: e,
                init: function(a, d, f) {
                    var g, h, j, k;
                    if (!a) return this;
                    if (a.nodeType) {
                        this.context = this[0] = a, this.length = 1;
                        return this
                    }
                    if (a === "body" && !d && c.body) {
                        this.context = c, this[0] = c.body, this.selector = a, this.length = 1;
                        return this
                    }
                    if (typeof a == "string") {
                        a.charAt(0) !== "<" || a.charAt(a.length - 1) !== ">" || a.length < 3 ? g = i.exec(a) : g = [null, a, null];
                        if (g && (g[1] || !d)) {
                            if (g[1]) {
                                d = d instanceof e ? d[0] : d, k = d ? d.ownerDocument || d : c, j = m.exec(a), j ? e.isPlainObject(d) ? (a = [c.createElement(j[1])], e.fn.attr.call(a, d, !0)) : a = [k.createElement(j[1])] : (j = e.buildFragment([g[1]], [k]), a = (j.cacheable ? e.clone(j.fragment) : j.fragment).childNodes);
                                return e.merge(this, a)
                            }
                            h = c.getElementById(g[2]);
                            if (h && h.parentNode) {
                                if (h.id !== g[2]) return f.find(a);
                                this.length = 1, this[0] = h
                            }
                            this.context = c, this.selector = a;
                            return this
                        }
                        return !d || d.jquery ? (d || f).find(a) : this.constructor(d).find(a)
                    }
                    if (e.isFunction(a)) return f.ready(a);
                    a.selector !== b && (this.selector = a.selector, this.context = a.context);
                    return e.makeArray(a, this)
                },
                selector: "",
                jquery: "1.7.1",
                length: 0,
                size: function() {
                    return this.length
                },
                toArray: function() {
                    return F.call(this, 0)
                },
                get: function(a) {
                    return a == null ? this.toArray() : a < 0 ? this[this.length + a] : this[a]
                },
                pushStack: function(a, b, c) {
                    var d = this.constructor();
                    e.isArray(a) ? E.apply(d, a) : e.merge(d, a), d.prevObject = this, d.context = this.context, b === "find" ? d.selector = this.selector + (this.selector ? " " : "") + c : b && (d.selector = this.selector + "." + b + "(" + c + ")");
                    return d
                },
                each: function(a, b) {
                    return e.each(this, a, b)
                },
                ready: function(a) {
                    e.bindReady(), A.add(a);
                    return this
                },
                eq: function(a) {
                    a = +a;
                    return a === -1 ? this.slice(a) : this.slice(a, a + 1)
                },
                first: function() {
                    return this.eq(0)
                },
                last: function() {
                    return this.eq(-1)
                },
                slice: function() {
                    return this.pushStack(F.apply(this, arguments), "slice", F.call(arguments).join(","))
                },
                map: function(a) {
                    return this.pushStack(e.map(this, function(b, c) {
                        return a.call(b, c, b)
                    }))
                },
                end: function() {
                    return this.prevObject || this.constructor(null)
                },
                push: E,
                sort: [].sort,
                splice: [].splice
            }, e.fn.init.prototype = e.fn, e.extend = e.fn.extend = function() {
                var a, c, d, f, g, h, i = arguments[0] || {},
                    j = 1,
                    k = arguments.length,
                    l = !1;
                typeof i == "boolean" && (l = i, i = arguments[1] || {}, j = 2), typeof i != "object" && !e.isFunction(i) && (i = {}), k === j && (i = this, --j);
                for (; j < k; j++)
                    if ((a = arguments[j]) != null)
                        for (c in a) {
                            d = i[c], f = a[c];
                            if (i === f) continue;
                            l && f && (e.isPlainObject(f) || (g = e.isArray(f))) ? (g ? (g = !1, h = d && e.isArray(d) ? d : []) : h = d && e.isPlainObject(d) ? d : {}, i[c] = e.extend(l, h, f)) : f !== b && (i[c] = f)
                        }
                return i
            }, e.extend({
                noConflict: function(b) {
                    a.$ === e && (a.$ = g), b && a.jQuery === e && (a.jQuery = f);
                    return e
                },
                isReady: !1,
                readyWait: 1,
                holdReady: function(a) {
                    a ? e.readyWait++ : e.ready(!0)
                },
                ready: function(a) {
                    if (a === !0 && !--e.readyWait || a !== !0 && !e.isReady) {
                        if (!c.body) return setTimeout(e.ready, 1);
                        e.isReady = !0;
                        if (a !== !0 && --e.readyWait > 0) return;
                        A.fireWith(c, [e]), e.fn.trigger && e(c).trigger("ready").off("ready")
                    }
                },
                bindReady: function() {
                    if (!A) {
                        A = e.Callbacks("once memory");
                        if (c.readyState === "complete") return setTimeout(e.ready, 1);
                        if (c.addEventListener) c.addEventListener("DOMContentLoaded", B, !1), a.addEventListener("load", e.ready, !1);
                        else if (c.attachEvent) {
                            c.attachEvent("onreadystatechange", B), a.attachEvent("onload", e.ready);
                            var b = !1;
                            try {
                                b = a.frameElement == null
                            } catch (d) {}
                            c.documentElement.doScroll && b && J()
                        }
                    }
                },
                isFunction: function(a) {
                    return e.type(a) === "function"
                },
                isArray: Array.isArray || function(a) {
                    return e.type(a) === "array"
                },
                isWindow: function(a) {
                    return a && typeof a == "object" && "setInterval" in a
                },
                isNumeric: function(a) {
                    return !isNaN(parseFloat(a)) && isFinite(a)
                },
                type: function(a) {
                    return a == null ? String(a) : I[C.call(a)] || "object"
                },
                isPlainObject: function(a) {
                    if (!a || e.type(a) !== "object" || a.nodeType || e.isWindow(a)) return !1;
                    try {
                        if (a.constructor && !D.call(a, "constructor") && !D.call(a.constructor.prototype, "isPrototypeOf")) return !1
                    } catch (c) {
                        return !1
                    }
                    var d;
                    for (d in a);
                    return d === b || D.call(a, d)
                },
                isEmptyObject: function(a) {
                    for (var b in a) return !1;
                    return !0
                },
                error: function(a) {
                    throw new Error(a)
                },
                parseJSON: function(b) {
                    if (typeof b != "string" || !b) return null;
                    b = e.trim(b);
                    if (a.JSON && a.JSON.parse) return a.JSON.parse(b);
                    if (n.test(b.replace(o, "@").replace(p, "]").replace(q, ""))) return (new Function("return " + b))();
                    e.error("Invalid JSON: " + b)
                },
                parseXML: function(c) {
                    var d, f;
                    try {
                        a.DOMParser ? (f = new DOMParser, d = f.parseFromString(c, "text/xml")) : (d = new ActiveXObject("Microsoft.XMLDOM"), d.async = "false", d.loadXML(c))
                    } catch (g) {
                        d = b
                    }(!d || !d.documentElement || d.getElementsByTagName("parsererror").length) && e.error("Invalid XML: " + c);
                    return d
                },
                noop: function() {},
                globalEval: function(b) {
                    b && j.test(b) && (a.execScript || function(b) {
                        a.eval.call(a, b)
                    })(b)
                },
                camelCase: function(a) {
                    return a.replace(w, "ms-").replace(v, x)
                },
                nodeName: function(a, b) {
                    return a.nodeName && a.nodeName.toUpperCase() === b.toUpperCase()
                },
                each: function(a, c, d) {
                    var f, g = 0,
                        h = a.length,
                        i = h === b || e.isFunction(a);
                    if (d) {
                        if (i) {
                            for (f in a)
                                if (c.apply(a[f], d) === !1) break
                        } else
                            for (; g < h;)
                                if (c.apply(a[g++], d) === !1) break
                    } else if (i) {
                        for (f in a)
                            if (c.call(a[f], f, a[f]) === !1) break
                    } else
                        for (; g < h;)
                            if (c.call(a[g], g, a[g++]) === !1) break;
                    return a
                },
                trim: G ? function(a) {
                    return a == null ? "" : G.call(a)
                } : function(a) {
                    return a == null ? "" : (a + "").replace(k, "").replace(l, "")
                },
                makeArray: function(a, b) {
                    var c = b || [];
                    if (a != null) {
                        var d = e.type(a);
                        a.length == null || d === "string" || d === "function" || d === "regexp" || e.isWindow(a) ? E.call(c, a) : e.merge(c, a)
                    }
                    return c
                },
                inArray: function(a, b, c) {
                    var d;
                    if (b) {
                        if (H) return H.call(b, a, c);
                        d = b.length, c = c ? c < 0 ? Math.max(0, d + c) : c : 0;
                        for (; c < d; c++)
                            if (c in b && b[c] === a) return c
                    }
                    return -1
                },
                merge: function(a, c) {
                    var d = a.length,
                        e = 0;
                    if (typeof c.length == "number")
                        for (var f = c.length; e < f; e++) a[d++] = c[e];
                    else
                        while (c[e] !== b) a[d++] = c[e++];
                    a.length = d;
                    return a
                },
                grep: function(a, b, c) {
                    var d = [],
                        e;
                    c = !!c;
                    for (var f = 0, g = a.length; f < g; f++) e = !!b(a[f], f), c !== e && d.push(a[f]);
                    return d
                },
                map: function(a, c, d) {
                    var f, g, h = [],
                        i = 0,
                        j = a.length,
                        k = a instanceof e || j !== b && typeof j == "number" && (j > 0 && a[0] && a[j - 1] || j === 0 || e.isArray(a));
                    if (k)
                        for (; i < j; i++) f = c(a[i], i, d), f != null && (h[h.length] = f);
                    else
                        for (g in a) f = c(a[g], g, d), f != null && (h[h.length] = f);
                    return h.concat.apply([], h)
                },
                guid: 1,
                proxy: function(a, c) {
                    if (typeof c == "string") {
                        var d = a[c];
                        c = a, a = d
                    }
                    if (!e.isFunction(a)) return b;
                    var f = F.call(arguments, 2),
                        g = function() {
                            return a.apply(c, f.concat(F.call(arguments)))
                        };
                    g.guid = a.guid = a.guid || g.guid || e.guid++;
                    return g
                },
                access: function(a, c, d, f, g, h) {
                    var i = a.length;
                    if (typeof c == "object") {
                        for (var j in c) e.access(a, j, c[j], f, g, d);
                        return a
                    }
                    if (d !== b) {
                        f = !h && f && e.isFunction(d);
                        for (var k = 0; k < i; k++) g(a[k], c, f ? d.call(a[k], k, g(a[k], c)) : d, h);
                        return a
                    }
                    return i ? g(a[0], c) : b
                },
                now: function() {
                    return (new Date).getTime()
                },
                uaMatch: function(a) {
                    a = a.toLowerCase();
                    var b = r.exec(a) || s.exec(a) || t.exec(a) || a.indexOf("compatible") < 0 && u.exec(a) || [];
                    return {
                        browser: b[1] || "",
                        version: b[2] || "0"
                    }
                },
                sub: function() {
                    function a(b, c) {
                        return new a.fn.init(b, c)
                    }
                    e.extend(!0, a, this), a.superclass = this, a.fn = a.prototype = this(), a.fn.constructor = a, a.sub = this.sub, a.fn.init = function(d, f) {
                        f && f instanceof e && !(f instanceof a) && (f = a(f));
                        return e.fn.init.call(this, d, f, b)
                    }, a.fn.init.prototype = a.fn;
                    var b = a(c);
                    return a
                },
                browser: {}
            }), e.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(a, b) {
                I["[object " + b + "]"] = b.toLowerCase()
            }), z = e.uaMatch(y), z.browser && (e.browser[z.browser] = !0, e.browser.version = z.version), e.browser.webkit && (e.browser.safari = !0), j.test(" ") && (k = /^[\s\xA0]+/, l = /[\s\xA0]+$/), h = e(c), c.addEventListener ? B = function() {
                c.removeEventListener("DOMContentLoaded", B, !1), e.ready()
            } : c.attachEvent && (B = function() {
                c.readyState === "complete" && (c.detachEvent("onreadystatechange", B), e.ready())
            });
            return e
        }(),
        g = {};
    f.Callbacks = function(a) {
        a = a ? g[a] || h(a) : {};
        var c = [],
            d = [],
            e, i, j, k, l, m = function(b) {
                var d, e, g, h, i;
                for (d = 0, e = b.length; d < e; d++) g = b[d], h = f.type(g), h === "array" ? m(g) : h === "function" && (!a.unique || !o.has(g)) && c.push(g)
            },
            n = function(b, f) {
                f = f || [], e = !a.memory || [b, f], i = !0, l = j || 0, j = 0, k = c.length;
                for (; c && l < k; l++)
                    if (c[l].apply(b, f) === !1 && a.stopOnFalse) {
                        e = !0;
                        break
                    } i = !1, c && (a.once ? e === !0 ? o.disable() : c = [] : d && d.length && (e = d.shift(), o.fireWith(e[0], e[1])))
            },
            o = {
                add: function() {
                    if (c) {
                        var a = c.length;
                        m(arguments), i ? k = c.length : e && e !== !0 && (j = a, n(e[0], e[1]))
                    }
                    return this
                },
                remove: function() {
                    if (c) {
                        var b = arguments,
                            d = 0,
                            e = b.length;
                        for (; d < e; d++)
                            for (var f = 0; f < c.length; f++)
                                if (b[d] === c[f]) {
                                    i && f <= k && (k--, f <= l && l--), c.splice(f--, 1);
                                    if (a.unique) break
                                }
                    }
                    return this
                },
                has: function(a) {
                    if (c) {
                        var b = 0,
                            d = c.length;
                        for (; b < d; b++)
                            if (a === c[b]) return !0
                    }
                    return !1
                },
                empty: function() {
                    c = [];
                    return this
                },
                disable: function() {
                    c = d = e = b;
                    return this
                },
                disabled: function() {
                    return !c
                },
                lock: function() {
                    d = b, (!e || e === !0) && o.disable();
                    return this
                },
                locked: function() {
                    return !d
                },
                fireWith: function(b, c) {
                    d && (i ? a.once || d.push([b, c]) : (!a.once || !e) && n(b, c));
                    return this
                },
                fire: function() {
                    o.fireWith(this, arguments);
                    return this
                },
                fired: function() {
                    return !!e
                }
            };
        return o
    };
    var i = [].slice;
    f.extend({
        Deferred: function(a) {
            var b = f.Callbacks("once memory"),
                c = f.Callbacks("once memory"),
                d = f.Callbacks("memory"),
                e = "pending",
                g = {
                    resolve: b,
                    reject: c,
                    notify: d
                },
                h = {
                    done: b.add,
                    fail: c.add,
                    progress: d.add,
                    state: function() {
                        return e
                    },
                    isResolved: b.fired,
                    isRejected: c.fired,
                    then: function(a, b, c) {
                        i.done(a).fail(b).progress(c);
                        return this
                    },
                    always: function() {
                        i.done.apply(i, arguments).fail.apply(i, arguments);
                        return this
                    },
                    pipe: function(a, b, c) {
                        return f.Deferred(function(d) {
                            f.each({
                                done: [a, "resolve"],
                                fail: [b, "reject"],
                                progress: [c, "notify"]
                            }, function(a, b) {
                                var c = b[0],
                                    e = b[1],
                                    g;
                                f.isFunction(c) ? i[a](function() {
                                    g = c.apply(this, arguments), g && f.isFunction(g.promise) ? g.promise().then(d.resolve, d.reject, d.notify) : d[e + "With"](this === i ? d : this, [g])
                                }) : i[a](d[e])
                            })
                        }).promise()
                    },
                    promise: function(a) {
                        if (a == null) a = h;
                        else
                            for (var b in h) a[b] = h[b];
                        return a
                    }
                },
                i = h.promise({}),
                j;
            for (j in g) i[j] = g[j].fire, i[j + "With"] = g[j].fireWith;
            i.done(function() {
                e = "resolved"
            }, c.disable, d.lock).fail(function() {
                e = "rejected"
            }, b.disable, d.lock), a && a.call(i, i);
            return i
        },
        when: function(a) {
            function m(a) {
                return function(b) {
                    e[a] = arguments.length > 1 ? i.call(arguments, 0) : b, j.notifyWith(k, e)
                }
            }

            function l(a) {
                return function(c) {
                    b[a] = arguments.length > 1 ? i.call(arguments, 0) : c, --g || j.resolveWith(j, b)
                }
            }
            var b = i.call(arguments, 0),
                c = 0,
                d = b.length,
                e = Array(d),
                g = d,
                h = d,
                j = d <= 1 && a && f.isFunction(a.promise) ? a : f.Deferred(),
                k = j.promise();
            if (d > 1) {
                for (; c < d; c++) b[c] && b[c].promise && f.isFunction(b[c].promise) ? b[c].promise().then(l(c), j.reject, m(c)) : --g;
                g || j.resolveWith(j, b)
            } else j !== a && j.resolveWith(j, d ? [a] : []);
            return k
        }
    }), f.support = function() {
        var b, d, e, g, h, i, j, k, l, m, n, o, p, q = c.createElement("div"),
            r = c.documentElement;
        q.setAttribute("className", "t"), q.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>", d = q.getElementsByTagName("*"), e = q.getElementsByTagName("a")[0];
        if (!d || !d.length || !e) return {};
        g = c.createElement("select"), h = g.appendChild(c.createElement("option")), i = q.getElementsByTagName("input")[0], b = {
            leadingWhitespace: q.firstChild.nodeType === 3,
            tbody: !q.getElementsByTagName("tbody").length,
            htmlSerialize: !!q.getElementsByTagName("link").length,
            style: /top/.test(e.getAttribute("style")),
            hrefNormalized: e.getAttribute("href") === "/a",
            opacity: /^0.55/.test(e.style.opacity),
            cssFloat: !!e.style.cssFloat,
            checkOn: i.value === "on",
            optSelected: h.selected,
            getSetAttribute: q.className !== "t",
            enctype: !!c.createElement("form").enctype,
            html5Clone: c.createElement("nav").cloneNode(!0).outerHTML !== "<:nav></:nav>",
            submitBubbles: !0,
            changeBubbles: !0,
            focusinBubbles: !1,
            deleteExpando: !0,
            noCloneEvent: !0,
            inlineBlockNeedsLayout: !1,
            shrinkWrapBlocks: !1,
            reliableMarginRight: !0
        }, i.checked = !0, b.noCloneChecked = i.cloneNode(!0).checked, g.disabled = !0, b.optDisabled = !h.disabled;
        try {
            delete q.test
        } catch (s) {
            b.deleteExpando = !1
        }!q.addEventListener && q.attachEvent && q.fireEvent && (q.attachEvent("onclick", function() {
            b.noCloneEvent = !1
        }), q.cloneNode(!0).fireEvent("onclick")), i = c.createElement("input"), i.value = "t", i.setAttribute("type", "radio"), b.radioValue = i.value === "t", i.setAttribute("checked", "checked"), q.appendChild(i), k = c.createDocumentFragment(), k.appendChild(q.lastChild), b.checkClone = k.cloneNode(!0).cloneNode(!0).lastChild.checked, b.appendChecked = i.checked, k.removeChild(i), k.appendChild(q), q.innerHTML = "", a.getComputedStyle && (j = c.createElement("div"), j.style.width = "0", j.style.marginRight = "0", q.style.width = "2px", q.appendChild(j), b.reliableMarginRight = (parseInt((a.getComputedStyle(j, null) || {
            marginRight: 0
        }).marginRight, 10) || 0) === 0);
        if (q.attachEvent)
            for (o in {
                    submit: 1,
                    change: 1,
                    focusin: 1
                }) n = "on" + o, p = n in q, p || (q.setAttribute(n, "return;"), p = typeof q[n] == "function"), b[o + "Bubbles"] = p;
        k.removeChild(q), k = g = h = j = q = i = null, f(function() {
            var a, d, e, g, h, i, j, k, m, n, o, r = c.getElementsByTagName("body")[0];
            !r || (j = 1, k = "position:absolute;top:0;left:0;width:1px;height:1px;margin:0;", m = "visibility:hidden;border:0;", n = "style='" + k + "border:5px solid #000;padding:0;'", o = "<div " + n + "><div></div></div>" + "<table " + n + " cellpadding='0' cellspacing='0'>" + "<tr><td></td></tr></table>", a = c.createElement("div"), a.style.cssText = m + "width:0;height:0;position:static;top:0;margin-top:" + j + "px", r.insertBefore(a, r.firstChild), q = c.createElement("div"), a.appendChild(q), q.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>", l = q.getElementsByTagName("td"), p = l[0].offsetHeight === 0, l[0].style.display = "", l[1].style.display = "none", b.reliableHiddenOffsets = p && l[0].offsetHeight === 0, q.innerHTML = "", q.style.width = q.style.paddingLeft = "1px", f.boxModel = b.boxModel = q.offsetWidth === 2, typeof q.style.zoom != "undefined" && (q.style.display = "inline", q.style.zoom = 1, b.inlineBlockNeedsLayout = q.offsetWidth === 2, q.style.display = "", q.innerHTML = "<div style='width:4px;'></div>", b.shrinkWrapBlocks = q.offsetWidth !== 2), q.style.cssText = k + m, q.innerHTML = o, d = q.firstChild, e = d.firstChild, h = d.nextSibling.firstChild.firstChild, i = {
                doesNotAddBorder: e.offsetTop !== 5,
                doesAddBorderForTableAndCells: h.offsetTop === 5
            }, e.style.position = "fixed", e.style.top = "20px", i.fixedPosition = e.offsetTop === 20 || e.offsetTop === 15, e.style.position = e.style.top = "", d.style.overflow = "hidden", d.style.position = "relative", i.subtractsBorderForOverflowNotVisible = e.offsetTop === -5, i.doesNotIncludeMarginInBodyOffset = r.offsetTop !== j, r.removeChild(a), q = a = null, f.extend(b, i))
        });
        return b
    }();
    var j = /^(?:\{.*\}|\[.*\])$/,
        k = /([A-Z])/g;
    f.extend({
        cache: {},
        uuid: 0,
        expando: "jQuery" + (f.fn.jquery + Math.random()).replace(/\D/g, ""),
        noData: {
            embed: !0,
            object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
            applet: !0
        },
        hasData: function(a) {
            a = a.nodeType ? f.cache[a[f.expando]] : a[f.expando];
            return !!a && !m(a)
        },
        data: function(a, c, d, e) {
            if (!!f.acceptData(a)) {
                var g, h, i, j = f.expando,
                    k = typeof c == "string",
                    l = a.nodeType,
                    m = l ? f.cache : a,
                    n = l ? a[j] : a[j] && j,
                    o = c === "events";
                if ((!n || !m[n] || !o && !e && !m[n].data) && k && d === b) return;
                n || (l ? a[j] = n = ++f.uuid : n = j), m[n] || (m[n] = {}, l || (m[n].toJSON = f.noop));
                if (typeof c == "object" || typeof c == "function") e ? m[n] = f.extend(m[n], c) : m[n].data = f.extend(m[n].data, c);
                g = h = m[n], e || (h.data || (h.data = {}), h = h.data), d !== b && (h[f.camelCase(c)] = d);
                if (o && !h[c]) return g.events;
                k ? (i = h[c], i == null && (i = h[f.camelCase(c)])) : i = h;
                return i
            }
        },
        removeData: function(a, b, c) {
            if (!!f.acceptData(a)) {
                var d, e, g, h = f.expando,
                    i = a.nodeType,
                    j = i ? f.cache : a,
                    k = i ? a[h] : h;
                if (!j[k]) return;
                if (b) {
                    d = c ? j[k] : j[k].data;
                    if (d) {
                        f.isArray(b) || (b in d ? b = [b] : (b = f.camelCase(b), b in d ? b = [b] : b = b.split(" ")));
                        for (e = 0, g = b.length; e < g; e++) delete d[b[e]];
                        if (!(c ? m : f.isEmptyObject)(d)) return
                    }
                }
                if (!c) {
                    delete j[k].data;
                    if (!m(j[k])) return
                }
                f.support.deleteExpando || !j.setInterval ? delete j[k] : j[k] = null, i && (f.support.deleteExpando ? delete a[h] : a.removeAttribute ? a.removeAttribute(h) : a[h] = null)
            }
        },
        _data: function(a, b, c) {
            return f.data(a, b, c, !0)
        },
        acceptData: function(a) {
            if (a.nodeName) {
                var b = f.noData[a.nodeName.toLowerCase()];
                if (b) return b !== !0 && a.getAttribute("classid") === b
            }
            return !0
        }
    }), f.fn.extend({
        data: function(a, c) {
            var d, e, g, h = null;
            if (typeof a == "undefined") {
                if (this.length) {
                    h = f.data(this[0]);
                    if (this[0].nodeType === 1 && !f._data(this[0], "parsedAttrs")) {
                        e = this[0].attributes;
                        for (var i = 0, j = e.length; i < j; i++) g = e[i].name, g.indexOf("data-") === 0 && (g = f.camelCase(g.substring(5)), l(this[0], g, h[g]));
                        f._data(this[0], "parsedAttrs", !0)
                    }
                }
                return h
            }
            if (typeof a == "object") return this.each(function() {
                f.data(this, a)
            });
            d = a.split("."), d[1] = d[1] ? "." + d[1] : "";
            if (c === b) {
                h = this.triggerHandler("getData" + d[1] + "!", [d[0]]), h === b && this.length && (h = f.data(this[0], a), h = l(this[0], a, h));
                return h === b && d[1] ? this.data(d[0]) : h
            }
            return this.each(function() {
                var b = f(this),
                    e = [d[0], c];
                b.triggerHandler("setData" + d[1] + "!", e), f.data(this, a, c), b.triggerHandler("changeData" + d[1] + "!", e)
            })
        },
        removeData: function(a) {
            return this.each(function() {
                f.removeData(this, a)
            })
        }
    }), f.extend({
        _mark: function(a, b) {
            a && (b = (b || "fx") + "mark", f._data(a, b, (f._data(a, b) || 0) + 1))
        },
        _unmark: function(a, b, c) {
            a !== !0 && (c = b, b = a, a = !1);
            if (b) {
                c = c || "fx";
                var d = c + "mark",
                    e = a ? 0 : (f._data(b, d) || 1) - 1;
                e ? f._data(b, d, e) : (f.removeData(b, d, !0), n(b, c, "mark"))
            }
        },
        queue: function(a, b, c) {
            var d;
            if (a) {
                b = (b || "fx") + "queue", d = f._data(a, b), c && (!d || f.isArray(c) ? d = f._data(a, b, f.makeArray(c)) : d.push(c));
                return d || []
            }
        },
        dequeue: function(a, b) {
            b = b || "fx";
            var c = f.queue(a, b),
                d = c.shift(),
                e = {};
            d === "inprogress" && (d = c.shift()), d && (b === "fx" && c.unshift("inprogress"), f._data(a, b + ".run", e), d.call(a, function() {
                f.dequeue(a, b)
            }, e)), c.length || (f.removeData(a, b + "queue " + b + ".run", !0), n(a, b, "queue"))
        }
    }), f.fn.extend({
        queue: function(a, c) {
            typeof a != "string" && (c = a, a = "fx");
            if (c === b) return f.queue(this[0], a);
            return this.each(function() {
                var b = f.queue(this, a, c);
                a === "fx" && b[0] !== "inprogress" && f.dequeue(this, a)
            })
        },
        dequeue: function(a) {
            return this.each(function() {
                f.dequeue(this, a)
            })
        },
        delay: function(a, b) {
            a = f.fx ? f.fx.speeds[a] || a : a, b = b || "fx";
            return this.queue(b, function(b, c) {
                var d = setTimeout(b, a);
                c.stop = function() {
                    clearTimeout(d)
                }
            })
        },
        clearQueue: function(a) {
            return this.queue(a || "fx", [])
        },
        promise: function(a, c) {
            function m() {
                --h || d.resolveWith(e, [e])
            }
            typeof a != "string" && (c = a, a = b), a = a || "fx";
            var d = f.Deferred(),
                e = this,
                g = e.length,
                h = 1,
                i = a + "defer",
                j = a + "queue",
                k = a + "mark",
                l;
            while (g--)
                if (l = f.data(e[g], i, b, !0) || (f.data(e[g], j, b, !0) || f.data(e[g], k, b, !0)) && f.data(e[g], i, f.Callbacks("once memory"), !0)) h++, l.add(m);
            m();
            return d.promise()
        }
    });
    var o = /[\n\t\r]/g,
        p = /\s+/,
        q = /\r/g,
        r = /^(?:button|input)$/i,
        s = /^(?:button|input|object|select|textarea)$/i,
        t = /^a(?:rea)?$/i,
        u = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
        v = f.support.getSetAttribute,
        w, x, y;
    f.fn.extend({
        attr: function(a, b) {
            return f.access(this, a, b, !0, f.attr)
        },
        removeAttr: function(a) {
            return this.each(function() {
                f.removeAttr(this, a)
            })
        },
        prop: function(a, b) {
            return f.access(this, a, b, !0, f.prop)
        },
        removeProp: function(a) {
            a = f.propFix[a] || a;
            return this.each(function() {
                try {
                    this[a] = b, delete this[a]
                } catch (c) {}
            })
        },
        addClass: function(a) {
            var b, c, d, e, g, h, i;
            if (f.isFunction(a)) return this.each(function(b) {
                f(this).addClass(a.call(this, b, this.className))
            });
            if (a && typeof a == "string") {
                b = a.split(p);
                for (c = 0, d = this.length; c < d; c++) {
                    e = this[c];
                    if (e.nodeType === 1)
                        if (!e.className && b.length === 1) e.className = a;
                        else {
                            g = " " + e.className + " ";
                            for (h = 0, i = b.length; h < i; h++) ~g.indexOf(" " + b[h] + " ") || (g += b[h] + " ");
                            e.className = f.trim(g)
                        }
                }
            }
            return this
        },
        removeClass: function(a) {
            var c, d, e, g, h, i, j;
            if (f.isFunction(a)) return this.each(function(b) {
                f(this).removeClass(a.call(this, b, this.className))
            });
            if (a && typeof a == "string" || a === b) {
                c = (a || "").split(p);
                for (d = 0, e = this.length; d < e; d++) {
                    g = this[d];
                    if (g.nodeType === 1 && g.className)
                        if (a) {
                            h = (" " + g.className + " ").replace(o, " ");
                            for (i = 0, j = c.length; i < j; i++) h = h.replace(" " + c[i] + " ", " ");
                            g.className = f.trim(h)
                        } else g.className = ""
                }
            }
            return this
        },
        toggleClass: function(a, b) {
            var c = typeof a,
                d = typeof b == "boolean";
            if (f.isFunction(a)) return this.each(function(c) {
                f(this).toggleClass(a.call(this, c, this.className, b), b)
            });
            return this.each(function() {
                if (c === "string") {
                    var e, g = 0,
                        h = f(this),
                        i = b,
                        j = a.split(p);
                    while (e = j[g++]) i = d ? i : !h.hasClass(e), h[i ? "addClass" : "removeClass"](e)
                } else if (c === "undefined" || c === "boolean") this.className && f._data(this, "__className__", this.className), this.className = this.className || a === !1 ? "" : f._data(this, "__className__") || ""
            })
        },
        hasClass: function(a) {
            var b = " " + a + " ",
                c = 0,
                d = this.length;
            for (; c < d; c++)
                if (this[c].nodeType === 1 && (" " + this[c].className + " ").replace(o, " ").indexOf(b) > -1) return !0;
            return !1
        },
        val: function(a) {
            var c, d, e, g = this[0]; {
                if (!!arguments.length) {
                    e = f.isFunction(a);
                    return this.each(function(d) {
                        var g = f(this),
                            h;
                        if (this.nodeType === 1) {
                            e ? h = a.call(this, d, g.val()) : h = a, h == null ? h = "" : typeof h == "number" ? h += "" : f.isArray(h) && (h = f.map(h, function(a) {
                                return a == null ? "" : a + ""
                            })), c = f.valHooks[this.nodeName.toLowerCase()] || f.valHooks[this.type];
                            if (!c || !("set" in c) || c.set(this, h, "value") === b) this.value = h
                        }
                    })
                }
                if (g) {
                    c = f.valHooks[g.nodeName.toLowerCase()] || f.valHooks[g.type];
                    if (c && "get" in c && (d = c.get(g, "value")) !== b) return d;
                    d = g.value;
                    return typeof d == "string" ? d.replace(q, "") : d == null ? "" : d
                }
            }
        }
    }), f.extend({
        valHooks: {
            option: {
                get: function(a) {
                    var b = a.attributes.value;
                    return !b || b.specified ? a.value : a.text
                }
            },
            select: {
                get: function(a) {
                    var b, c, d, e, g = a.selectedIndex,
                        h = [],
                        i = a.options,
                        j = a.type === "select-one";
                    if (g < 0) return null;
                    c = j ? g : 0, d = j ? g + 1 : i.length;
                    for (; c < d; c++) {
                        e = i[c];
                        if (e.selected && (f.support.optDisabled ? !e.disabled : e.getAttribute("disabled") === null) && (!e.parentNode.disabled || !f.nodeName(e.parentNode, "optgroup"))) {
                            b = f(e).val();
                            if (j) return b;
                            h.push(b)
                        }
                    }
                    if (j && !h.length && i.length) return f(i[g]).val();
                    return h
                },
                set: function(a, b) {
                    var c = f.makeArray(b);
                    f(a).find("option").each(function() {
                        this.selected = f.inArray(f(this).val(), c) >= 0
                    }), c.length || (a.selectedIndex = -1);
                    return c
                }
            }
        },
        attrFn: {
            val: !0,
            css: !0,
            html: !0,
            text: !0,
            data: !0,
            width: !0,
            height: !0,
            offset: !0
        },
        attr: function(a, c, d, e) {
            var g, h, i, j = a.nodeType;
            if (!!a && j !== 3 && j !== 8 && j !== 2) {
                if (e && c in f.attrFn) return f(a)[c](d);
                if (typeof a.getAttribute == "undefined") return f.prop(a, c, d);
                i = j !== 1 || !f.isXMLDoc(a), i && (c = c.toLowerCase(), h = f.attrHooks[c] || (u.test(c) ? x : w));
                if (d !== b) {
                    if (d === null) {
                        f.removeAttr(a, c);
                        return
                    }
                    if (h && "set" in h && i && (g = h.set(a, d, c)) !== b) return g;
                    a.setAttribute(c, "" + d);
                    return d
                }
                if (h && "get" in h && i && (g = h.get(a, c)) !== null) return g;
                g = a.getAttribute(c);
                return g === null ? b : g
            }
        },
        removeAttr: function(a, b) {
            var c, d, e, g, h = 0;
            if (b && a.nodeType === 1) {
                d = b.toLowerCase().split(p), g = d.length;
                for (; h < g; h++) e = d[h], e && (c = f.propFix[e] || e, f.attr(a, e, ""), a.removeAttribute(v ? e : c), u.test(e) && c in a && (a[c] = !1))
            }
        },
        attrHooks: {
            type: {
                set: function(a, b) {
                    if (r.test(a.nodeName) && a.parentNode) f.error("type property can't be changed");
                    else if (!f.support.radioValue && b === "radio" && f.nodeName(a, "input")) {
                        var c = a.value;
                        a.setAttribute("type", b), c && (a.value = c);
                        return b
                    }
                }
            },
            value: {
                get: function(a, b) {
                    if (w && f.nodeName(a, "button")) return w.get(a, b);
                    return b in a ? a.value : null
                },
                set: function(a, b, c) {
                    if (w && f.nodeName(a, "button")) return w.set(a, b, c);
                    a.value = b
                }
            }
        },
        propFix: {
            tabindex: "tabIndex",
            readonly: "readOnly",
            "for": "htmlFor",
            "class": "className",
            maxlength: "maxLength",
            cellspacing: "cellSpacing",
            cellpadding: "cellPadding",
            rowspan: "rowSpan",
            colspan: "colSpan",
            usemap: "useMap",
            frameborder: "frameBorder",
            contenteditable: "contentEditable"
        },
        prop: function(a, c, d) {
            var e, g, h, i = a.nodeType;
            if (!!a && i !== 3 && i !== 8 && i !== 2) {
                h = i !== 1 || !f.isXMLDoc(a), h && (c = f.propFix[c] || c, g = f.propHooks[c]);
                return d !== b ? g && "set" in g && (e = g.set(a, d, c)) !== b ? e : a[c] = d : g && "get" in g && (e = g.get(a, c)) !== null ? e : a[c]
            }
        },
        propHooks: {
            tabIndex: {
                get: function(a) {
                    var c = a.getAttributeNode("tabindex");
                    return c && c.specified ? parseInt(c.value, 10) : s.test(a.nodeName) || t.test(a.nodeName) && a.href ? 0 : b
                }
            }
        }
    }), f.attrHooks.tabindex = f.propHooks.tabIndex, x = {
        get: function(a, c) {
            var d, e = f.prop(a, c);
            return e === !0 || typeof e != "boolean" && (d = a.getAttributeNode(c)) && d.nodeValue !== !1 ? c.toLowerCase() : b
        },
        set: function(a, b, c) {
            var d;
            b === !1 ? f.removeAttr(a, c) : (d = f.propFix[c] || c, d in a && (a[d] = !0), a.setAttribute(c, c.toLowerCase()));
            return c
        }
    }, v || (y = {
        name: !0,
        id: !0
    }, w = f.valHooks.button = {
        get: function(a, c) {
            var d;
            d = a.getAttributeNode(c);
            return d && (y[c] ? d.nodeValue !== "" : d.specified) ? d.nodeValue : b
        },
        set: function(a, b, d) {
            var e = a.getAttributeNode(d);
            e || (e = c.createAttribute(d), a.setAttributeNode(e));
            return e.nodeValue = b + ""
        }
    }, f.attrHooks.tabindex.set = w.set, f.each(["width", "height"], function(a, b) {
        f.attrHooks[b] = f.extend(f.attrHooks[b], {
            set: function(a, c) {
                if (c === "") {
                    a.setAttribute(b, "auto");
                    return c
                }
            }
        })
    }), f.attrHooks.contenteditable = {
        get: w.get,
        set: function(a, b, c) {
            b === "" && (b = "false"), w.set(a, b, c)
        }
    }), f.support.hrefNormalized || f.each(["href", "src", "width", "height"], function(a, c) {
        f.attrHooks[c] = f.extend(f.attrHooks[c], {
            get: function(a) {
                var d = a.getAttribute(c, 2);
                return d === null ? b : d
            }
        })
    }), f.support.style || (f.attrHooks.style = {
        get: function(a) {
            return a.style.cssText.toLowerCase() || b
        },
        set: function(a, b) {
            return a.style.cssText = "" + b
        }
    }), f.support.optSelected || (f.propHooks.selected = f.extend(f.propHooks.selected, {
        get: function(a) {
            var b = a.parentNode;
            b && (b.selectedIndex, b.parentNode && b.parentNode.selectedIndex);
            return null
        }
    })), f.support.enctype || (f.propFix.enctype = "encoding"), f.support.checkOn || f.each(["radio", "checkbox"], function() {
        f.valHooks[this] = {
            get: function(a) {
                return a.getAttribute("value") === null ? "on" : a.value
            }
        }
    }), f.each(["radio", "checkbox"], function() {
        f.valHooks[this] = f.extend(f.valHooks[this], {
            set: function(a, b) {
                if (f.isArray(b)) return a.checked = f.inArray(f(a).val(), b) >= 0
            }
        })
    });
    var z = /^(?:textarea|input|select)$/i,
        A = /^([^\.]*)?(?:\.(.+))?$/,
        B = /\bhover(\.\S+)?\b/,
        C = /^key/,
        D = /^(?:mouse|contextmenu)|click/,
        E = /^(?:focusinfocus|focusoutblur)$/,
        F = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
        G = function(a) {
            var b = F.exec(a);
            b && (b[1] = (b[1] || "").toLowerCase(), b[3] = b[3] && new RegExp("(?:^|\\s)" + b[3] + "(?:\\s|$)"));
            return b
        },
        H = function(a, b) {
            var c = a.attributes || {};
            return (!b[1] || a.nodeName.toLowerCase() === b[1]) && (!b[2] || (c.id || {}).value === b[2]) && (!b[3] || b[3].test((c["class"] || {}).value))
        },
        I = function(a) {
            return f.event.special.hover ? a : a.replace(B, "mouseenter$1 mouseleave$1")
        };
    f.event = {
            add: function(a, c, d, e, g) {
                var h, i, j, k, l, m, n, o, p, q, r, s;
                if (!(a.nodeType === 3 || a.nodeType === 8 || !c || !d || !(h = f._data(a)))) {
                    d.handler && (p = d, d = p.handler), d.guid || (d.guid = f.guid++), j = h.events, j || (h.events = j = {}), i = h.handle, i || (h.handle = i = function(a) {
                        return typeof f != "undefined" && (!a || f.event.triggered !== a.type) ? f.event.dispatch.apply(i.elem, arguments) : b
                    }, i.elem = a), c = f.trim(I(c)).split(" ");
                    for (k = 0; k < c.length; k++) {
                        l = A.exec(c[k]) || [], m = l[1], n = (l[2] || "").split(".").sort(), s = f.event.special[m] || {}, m = (g ? s.delegateType : s.bindType) || m, s = f.event.special[m] || {}, o = f.extend({
                            type: m,
                            origType: l[1],
                            data: e,
                            handler: d,
                            guid: d.guid,
                            selector: g,
                            quick: G(g),
                            namespace: n.join(".")
                        }, p), r = j[m];
                        if (!r) {
                            r = j[m] = [], r.delegateCount = 0;
                            if (!s.setup || s.setup.call(a, e, n, i) === !1) a.addEventListener ? a.addEventListener(m, i, !1) : a.attachEvent && a.attachEvent("on" + m, i)
                        }
                        s.add && (s.add.call(a, o), o.handler.guid || (o.handler.guid = d.guid)), g ? r.splice(r.delegateCount++, 0, o) : r.push(o), f.event.global[m] = !0
                    }
                    a = null
                }
            },
            global: {},
            remove: function(a, b, c, d, e) {
                var g = f.hasData(a) && f._data(a),
                    h, i, j, k, l, m, n, o, p, q, r, s;
                if (!!g && !!(o = g.events)) {
                    b = f.trim(I(b || "")).split(" ");
                    for (h = 0; h < b.length; h++) {
                        i = A.exec(b[h]) || [], j = k = i[1], l = i[2];
                        if (!j) {
                            for (j in o) f.event.remove(a, j + b[h], c, d, !0);
                            continue
                        }
                        p = f.event.special[j] || {}, j = (d ? p.delegateType : p.bindType) || j, r = o[j] || [], m = r.length, l = l ? new RegExp("(^|\\.)" + l.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
                        for (n = 0; n < r.length; n++) s = r[n], (e || k === s.origType) && (!c || c.guid === s.guid) && (!l || l.test(s.namespace)) && (!d || d === s.selector || d === "**" && s.selector) && (r.splice(n--, 1), s.selector && r.delegateCount--, p.remove && p.remove.call(a, s));
                        r.length === 0 && m !== r.length && ((!p.teardown || p.teardown.call(a, l) === !1) && f.removeEvent(a, j, g.handle), delete o[j])
                    }
                    f.isEmptyObject(o) && (q = g.handle, q && (q.elem = null), f.removeData(a, ["events", "handle"], !0))
                }
            },
            customEvent: {
                getData: !0,
                setData: !0,
                changeData: !0
            },
            trigger: function(c, d, e, g) {
                if (!e || e.nodeType !== 3 && e.nodeType !== 8) {
                    var h = c.type || c,
                        i = [],
                        j, k, l, m, n, o, p, q, r, s;
                    if (E.test(h + f.event.triggered)) return;
                    h.indexOf("!") >= 0 && (h = h.slice(0, -1), k = !0), h.indexOf(".") >= 0 && (i = h.split("."), h = i.shift(), i.sort());
                    if ((!e || f.event.customEvent[h]) && !f.event.global[h]) return;
                    c = typeof c == "object" ? c[f.expando] ? c : new f.Event(h, c) : new f.Event(h), c.type = h, c.isTrigger = !0, c.exclusive = k, c.namespace = i.join("."), c.namespace_re = c.namespace ? new RegExp("(^|\\.)" + i.join("\\.(?:.*\\.)?") + "(\\.|$)") : null, o = h.indexOf(":") < 0 ? "on" + h : "";
                    if (!e) {
                        j = f.cache;
                        for (l in j) j[l].events && j[l].events[h] && f.event.trigger(c, d, j[l].handle.elem, !0);
                        return
                    }
                    c.result = b, c.target || (c.target = e), d = d != null ? f.makeArray(d) : [], d.unshift(c), p = f.event.special[h] || {};
                    if (p.trigger && p.trigger.apply(e, d) === !1) return;
                    r = [
                        [e, p.bindType || h]
                    ];
                    if (!g && !p.noBubble && !f.isWindow(e)) {
                        s = p.delegateType || h, m = E.test(s + h) ? e : e.parentNode, n = null;
                        for (; m; m = m.parentNode) r.push([m, s]), n = m;
                        n && n === e.ownerDocument && r.push([n.defaultView || n.parentWindow || a, s])
                    }
                    for (l = 0; l < r.length && !c.isPropagationStopped(); l++) m = r[l][0], c.type = r[l][1], q = (f._data(m, "events") || {})[c.type] && f._data(m, "handle"), q && q.apply(m, d), q = o && m[o], q && f.acceptData(m) && q.apply(m, d) === !1 && c.preventDefault();
                    c.type = h, !g && !c.isDefaultPrevented() && (!p._default || p._default.apply(e.ownerDocument, d) === !1) && (h !== "click" || !f.nodeName(e, "a")) && f.acceptData(e) && o && e[h] && (h !== "focus" && h !== "blur" || c.target.offsetWidth !== 0) && !f.isWindow(e) && (n = e[o], n && (e[o] = null), f.event.triggered = h, e[h](), f.event.triggered = b, n && (e[o] = n));
                    return c.result
                }
            },
            dispatch: function(c) {
                c = f.event.fix(c || a.event);
                var d = (f._data(this, "events") || {})[c.type] || [],
                    e = d.delegateCount,
                    g = [].slice.call(arguments, 0),
                    h = !c.exclusive && !c.namespace,
                    i = [],
                    j, k, l, m, n, o, p, q, r, s, t;
                g[0] = c, c.delegateTarget = this;
                if (e && !c.target.disabled && (!c.button || c.type !== "click")) {
                    m = f(this), m.context = this.ownerDocument || this;
                    for (l = c.target; l != this; l = l.parentNode || this) {
                        o = {}, q = [], m[0] = l;
                        for (j = 0; j < e; j++) r = d[j], s = r.selector, o[s] === b && (o[s] = r.quick ? H(l, r.quick) : m.is(s)), o[s] && q.push(r);
                        q.length && i.push({
                            elem: l,
                            matches: q
                        })
                    }
                }
                d.length > e && i.push({
                    elem: this,
                    matches: d.slice(e)
                });
                for (j = 0; j < i.length && !c.isPropagationStopped(); j++) {
                    p = i[j], c.currentTarget = p.elem;
                    for (k = 0; k < p.matches.length && !c.isImmediatePropagationStopped(); k++) {
                        r = p.matches[k];
                        if (h || !c.namespace && !r.namespace || c.namespace_re && c.namespace_re.test(r.namespace)) c.data = r.data, c.handleObj = r, n = ((f.event.special[r.origType] || {}).handle || r.handler).apply(p.elem, g), n !== b && (c.result = n, n === !1 && (c.preventDefault(), c.stopPropagation()))
                    }
                }
                return c.result
            },
            props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
            fixHooks: {},
            keyHooks: {
                props: "char charCode key keyCode".split(" "),
                filter: function(a, b) {
                    a.which == null && (a.which = b.charCode != null ? b.charCode : b.keyCode);
                    return a
                }
            },
            mouseHooks: {
                props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
                filter: function(a, d) {
                    var e, f, g, h = d.button,
                        i = d.fromElement;
                    a.pageX == null && d.clientX != null && (e = a.target.ownerDocument || c, f = e.documentElement, g = e.body, a.pageX = d.clientX + (f && f.scrollLeft || g && g.scrollLeft || 0) - (f && f.clientLeft || g && g.clientLeft || 0), a.pageY = d.clientY + (f && f.scrollTop || g && g.scrollTop || 0) - (f && f.clientTop || g && g.clientTop || 0)), !a.relatedTarget && i && (a.relatedTarget = i === a.target ? d.toElement : i), !a.which && h !== b && (a.which = h & 1 ? 1 : h & 2 ? 3 : h & 4 ? 2 : 0);
                    return a
                }
            },
            fix: function(a) {
                if (a[f.expando]) return a;
                var d, e, g = a,
                    h = f.event.fixHooks[a.type] || {},
                    i = h.props ? this.props.concat(h.props) : this.props;
                a = f.Event(g);
                for (d = i.length; d;) e = i[--d], a[e] = g[e];
                a.target || (a.target = g.srcElement || c), a.target.nodeType === 3 && (a.target = a.target.parentNode), a.metaKey === b && (a.metaKey = a.ctrlKey);
                return h.filter ? h.filter(a, g) : a
            },
            special: {
                ready: {
                    setup: f.bindReady
                },
                load: {
                    noBubble: !0
                },
                focus: {
                    delegateType: "focusin"
                },
                blur: {
                    delegateType: "focusout"
                },
                beforeunload: {
                    setup: function(a, b, c) {
                        f.isWindow(this) && (this.onbeforeunload = c)
                    },
                    teardown: function(a, b) {
                        this.onbeforeunload === b && (this.onbeforeunload = null)
                    }
                }
            },
            simulate: function(a, b, c, d) {
                var e = f.extend(new f.Event, c, {
                    type: a,
                    isSimulated: !0,
                    originalEvent: {}
                });
                d ? f.event.trigger(e, null, b) : f.event.dispatch.call(b, e), e.isDefaultPrevented() && c.preventDefault()
            }
        }, f.event.handle = f.event.dispatch, f.removeEvent = c.removeEventListener ? function(a, b, c) {
            a.removeEventListener && a.removeEventListener(b, c, !1)
        } : function(a, b, c) {
            a.detachEvent && a.detachEvent("on" + b, c)
        }, f.Event = function(a, b) {
            if (!(this instanceof f.Event)) return new f.Event(a, b);
            a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || a.returnValue === !1 || a.getPreventDefault && a.getPreventDefault() ? K : J) : this.type = a, b && f.extend(this, b), this.timeStamp = a && a.timeStamp || f.now(), this[f.expando] = !0
        }, f.Event.prototype = {
            preventDefault: function() {
                this.isDefaultPrevented = K;
                var a = this.originalEvent;
                !a || (a.preventDefault ? a.preventDefault() : a.returnValue = !1)
            },
            stopPropagation: function() {
                this.isPropagationStopped = K;
                var a = this.originalEvent;
                !a || (a.stopPropagation && a.stopPropagation(), a.cancelBubble = !0)
            },
            stopImmediatePropagation: function() {
                this.isImmediatePropagationStopped = K, this.stopPropagation()
            },
            isDefaultPrevented: J,
            isPropagationStopped: J,
            isImmediatePropagationStopped: J
        }, f.each({
            mouseenter: "mouseover",
            mouseleave: "mouseout"
        }, function(a, b) {
            f.event.special[a] = {
                delegateType: b,
                bindType: b,
                handle: function(a) {
                    var c = this,
                        d = a.relatedTarget,
                        e = a.handleObj,
                        g = e.selector,
                        h;
                    if (!d || d !== c && !f.contains(c, d)) a.type = e.origType, h = e.handler.apply(this, arguments), a.type = b;
                    return h
                }
            }
        }), f.support.submitBubbles || (f.event.special.submit = {
            setup: function() {
                if (f.nodeName(this, "form")) return !1;
                f.event.add(this, "click._submit keypress._submit", function(a) {
                    var c = a.target,
                        d = f.nodeName(c, "input") || f.nodeName(c, "button") ? c.form : b;
                    d && !d._submit_attached && (f.event.add(d, "submit._submit", function(a) {
                        this.parentNode && !a.isTrigger && f.event.simulate("submit", this.parentNode, a, !0)
                    }), d._submit_attached = !0)
                })
            },
            teardown: function() {
                if (f.nodeName(this, "form")) return !1;
                f.event.remove(this, "._submit")
            }
        }), f.support.changeBubbles || (f.event.special.change = {
            setup: function() {
                if (z.test(this.nodeName)) {
                    if (this.type === "checkbox" || this.type === "radio") f.event.add(this, "propertychange._change", function(a) {
                        a.originalEvent.propertyName === "checked" && (this._just_changed = !0)
                    }), f.event.add(this, "click._change", function(a) {
                        this._just_changed && !a.isTrigger && (this._just_changed = !1, f.event.simulate("change", this, a, !0))
                    });
                    return !1
                }
                f.event.add(this, "beforeactivate._change", function(a) {
                    var b = a.target;
                    z.test(b.nodeName) && !b._change_attached && (f.event.add(b, "change._change", function(a) {
                        this.parentNode && !a.isSimulated && !a.isTrigger && f.event.simulate("change", this.parentNode, a, !0)
                    }), b._change_attached = !0)
                })
            },
            handle: function(a) {
                var b = a.target;
                if (this !== b || a.isSimulated || a.isTrigger || b.type !== "radio" && b.type !== "checkbox") return a.handleObj.handler.apply(this, arguments)
            },
            teardown: function() {
                f.event.remove(this, "._change");
                return z.test(this.nodeName)
            }
        }), f.support.focusinBubbles || f.each({
            focus: "focusin",
            blur: "focusout"
        }, function(a, b) {
            var d = 0,
                e = function(a) {
                    f.event.simulate(b, a.target, f.event.fix(a), !0)
                };
            f.event.special[b] = {
                setup: function() {
                    d++ === 0 && c.addEventListener(a, e, !0)
                },
                teardown: function() {
                    --d === 0 && c.removeEventListener(a, e, !0)
                }
            }
        }), f.fn.extend({
            on: function(a, c, d, e, g) {
                var h, i;
                if (typeof a == "object") {
                    typeof c != "string" && (d = c, c = b);
                    for (i in a) this.on(i, c, d, a[i], g);
                    return this
                }
                d == null && e == null ? (e = c, d = c = b) : e == null && (typeof c == "string" ? (e = d, d = b) : (e = d, d = c, c = b));
                if (e === !1) e = J;
                else if (!e) return this;
                g === 1 && (h = e, e = function(a) {
                    f().off(a);
                    return h.apply(this, arguments)
                }, e.guid = h.guid || (h.guid = f.guid++));
                return this.each(function() {
                    f.event.add(this, a, e, d, c)
                })
            },
            one: function(a, b, c, d) {
                return this.on.call(this, a, b, c, d, 1)
            },
            off: function(a, c, d) {
                if (a && a.preventDefault && a.handleObj) {
                    var e = a.handleObj;
                    f(a.delegateTarget).off(e.namespace ? e.type + "." + e.namespace : e.type, e.selector, e.handler);
                    return this
                }
                if (typeof a == "object") {
                    for (var g in a) this.off(g, c, a[g]);
                    return this
                }
                if (c === !1 || typeof c == "function") d = c, c = b;
                d === !1 && (d = J);
                return this.each(function() {
                    f.event.remove(this, a, d, c)
                })
            },
            bind: function(a, b, c) {
                return this.on(a, null, b, c)
            },
            unbind: function(a, b) {
                return this.off(a, null, b)
            },
            live: function(a, b, c) {
                f(this.context).on(a, this.selector, b, c);
                return this
            },
            die: function(a, b) {
                f(this.context).off(a, this.selector || "**", b);
                return this
            },
            delegate: function(a, b, c, d) {
                return this.on(b, a, c, d)
            },
            undelegate: function(a, b, c) {
                return arguments.length == 1 ? this.off(a, "**") : this.off(b, a, c)
            },
            trigger: function(a, b) {
                return this.each(function() {
                    f.event.trigger(a, b, this)
                })
            },
            triggerHandler: function(a, b) {
                if (this[0]) return f.event.trigger(a, b, this[0], !0)
            },
            toggle: function(a) {
                var b = arguments,
                    c = a.guid || f.guid++,
                    d = 0,
                    e = function(c) {
                        var e = (f._data(this, "lastToggle" + a.guid) || 0) % d;
                        f._data(this, "lastToggle" + a.guid, e + 1), c.preventDefault();
                        return b[e].apply(this, arguments) || !1
                    };
                e.guid = c;
                while (d < b.length) b[d++].guid = c;
                return this.click(e)
            },
            hover: function(a, b) {
                return this.mouseenter(a).mouseleave(b || a)
            }
        }), f.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(a, b) {
            f.fn[b] = function(a, c) {
                c == null && (c = a, a = null);
                return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b)
            }, f.attrFn && (f.attrFn[b] = !0), C.test(b) && (f.event.fixHooks[b] = f.event.keyHooks), D.test(b) && (f.event.fixHooks[b] = f.event.mouseHooks)
        }),
        function() {
            function x(a, b, c, e, f, g) {
                for (var h = 0, i = e.length; h < i; h++) {
                    var j = e[h];
                    if (j) {
                        var k = !1;
                        j = j[a];
                        while (j) {
                            if (j[d] === c) {
                                k = e[j.sizset];
                                break
                            }
                            if (j.nodeType === 1) {
                                g || (j[d] = c, j.sizset = h);
                                if (typeof b != "string") {
                                    if (j === b) {
                                        k = !0;
                                        break
                                    }
                                } else if (m.filter(b, [j]).length > 0) {
                                    k = j;
                                    break
                                }
                            }
                            j = j[a]
                        }
                        e[h] = k
                    }
                }
            }

            function w(a, b, c, e, f, g) {
                for (var h = 0, i = e.length; h < i; h++) {
                    var j = e[h];
                    if (j) {
                        var k = !1;
                        j = j[a];
                        while (j) {
                            if (j[d] === c) {
                                k = e[j.sizset];
                                break
                            }
                            j.nodeType === 1 && !g && (j[d] = c, j.sizset = h);
                            if (j.nodeName.toLowerCase() === b) {
                                k = j;
                                break
                            }
                            j = j[a]
                        }
                        e[h] = k
                    }
                }
            }
            var a = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
                d = "sizcache" + (Math.random() + "").replace(".", ""),
                e = 0,
                g = Object.prototype.toString,
                h = !1,
                i = !0,
                j = /\\/g,
                k = /\r\n/g,
                l = /\W/;
            [0, 0].sort(function() {
                i = !1;
                return 0
            });
            var m = function(b, d, e, f) {
                e = e || [], d = d || c;
                var h = d;
                if (d.nodeType !== 1 && d.nodeType !== 9) return [];
                if (!b || typeof b != "string") return e;
                var i, j, k, l, n, q, r, t, u = !0,
                    v = m.isXML(d),
                    w = [],
                    x = b;
                do {
                    a.exec(""), i = a.exec(x);
                    if (i) {
                        x = i[3], w.push(i[1]);
                        if (i[2]) {
                            l = i[3];
                            break
                        }
                    }
                } while (i);
                if (w.length > 1 && p.exec(b))
                    if (w.length === 2 && o.relative[w[0]]) j = y(w[0] + w[1], d, f);
                    else {
                        j = o.relative[w[0]] ? [d] : m(w.shift(), d);
                        while (w.length) b = w.shift(), o.relative[b] && (b += w.shift()), j = y(b, j, f)
                    }
                else {
                    !f && w.length > 1 && d.nodeType === 9 && !v && o.match.ID.test(w[0]) && !o.match.ID.test(w[w.length - 1]) && (n = m.find(w.shift(), d, v), d = n.expr ? m.filter(n.expr, n.set)[0] : n.set[0]);
                    if (d) {
                        n = f ? {
                            expr: w.pop(),
                            set: s(f)
                        } : m.find(w.pop(), w.length === 1 && (w[0] === "~" || w[0] === "+") && d.parentNode ? d.parentNode : d, v), j = n.expr ? m.filter(n.expr, n.set) : n.set, w.length > 0 ? k = s(j) : u = !1;
                        while (w.length) q = w.pop(), r = q, o.relative[q] ? r = w.pop() : q = "", r == null && (r = d), o.relative[q](k, r, v)
                    } else k = w = []
                }
                k || (k = j), k || m.error(q || b);
                if (g.call(k) === "[object Array]")
                    if (!u) e.push.apply(e, k);
                    else if (d && d.nodeType === 1)
                    for (t = 0; k[t] != null; t++) k[t] && (k[t] === !0 || k[t].nodeType === 1 && m.contains(d, k[t])) && e.push(j[t]);
                else
                    for (t = 0; k[t] != null; t++) k[t] && k[t].nodeType === 1 && e.push(j[t]);
                else s(k, e);
                l && (m(l, h, e, f), m.uniqueSort(e));
                return e
            };
            m.uniqueSort = function(a) {
                if (u) {
                    h = i, a.sort(u);
                    if (h)
                        for (var b = 1; b < a.length; b++) a[b] === a[b - 1] && a.splice(b--, 1)
                }
                return a
            }, m.matches = function(a, b) {
                return m(a, null, null, b)
            }, m.matchesSelector = function(a, b) {
                return m(b, null, null, [a]).length > 0
            }, m.find = function(a, b, c) {
                var d, e, f, g, h, i;
                if (!a) return [];
                for (e = 0, f = o.order.length; e < f; e++) {
                    h = o.order[e];
                    if (g = o.leftMatch[h].exec(a)) {
                        i = g[1], g.splice(1, 1);
                        if (i.substr(i.length - 1) !== "\\") {
                            g[1] = (g[1] || "").replace(j, ""), d = o.find[h](g, b, c);
                            if (d != null) {
                                a = a.replace(o.match[h], "");
                                break
                            }
                        }
                    }
                }
                d || (d = typeof b.getElementsByTagName != "undefined" ? b.getElementsByTagName("*") : []);
                return {
                    set: d,
                    expr: a
                }
            }, m.filter = function(a, c, d, e) {
                var f, g, h, i, j, k, l, n, p, q = a,
                    r = [],
                    s = c,
                    t = c && c[0] && m.isXML(c[0]);
                while (a && c.length) {
                    for (h in o.filter)
                        if ((f = o.leftMatch[h].exec(a)) != null && f[2]) {
                            k = o.filter[h], l = f[1], g = !1, f.splice(1, 1);
                            if (l.substr(l.length - 1) === "\\") continue;
                            s === r && (r = []);
                            if (o.preFilter[h]) {
                                f = o.preFilter[h](f, s, d, r, e, t);
                                if (!f) g = i = !0;
                                else if (f === !0) continue
                            }
                            if (f)
                                for (n = 0;
                                    (j = s[n]) != null; n++) j && (i = k(j, f, n, s), p = e ^ i, d && i != null ? p ? g = !0 : s[n] = !1 : p && (r.push(j), g = !0));
                            if (i !== b) {
                                d || (s = r), a = a.replace(o.match[h], "");
                                if (!g) return [];
                                break
                            }
                        } if (a === q)
                        if (g == null) m.error(a);
                        else break;
                    q = a
                }
                return s
            }, m.error = function(a) {
                throw new Error("Syntax error, unrecognized expression: " + a)
            };
            var n = m.getText = function(a) {
                    var b, c, d = a.nodeType,
                        e = "";
                    if (d) {
                        if (d === 1 || d === 9) {
                            if (typeof a.textContent == "string") return a.textContent;
                            if (typeof a.innerText == "string") return a.innerText.replace(k, "");
                            for (a = a.firstChild; a; a = a.nextSibling) e += n(a)
                        } else if (d === 3 || d === 4) return a.nodeValue
                    } else
                        for (b = 0; c = a[b]; b++) c.nodeType !== 8 && (e += n(c));
                    return e
                },
                o = m.selectors = {
                    order: ["ID", "NAME", "TAG"],
                    match: {
                        ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                        CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                        NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
                        ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
                        TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
                        CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
                        POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
                        PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
                    },
                    leftMatch: {},
                    attrMap: {
                        "class": "className",
                        "for": "htmlFor"
                    },
                    attrHandle: {
                        href: function(a) {
                            return a.getAttribute("href")
                        },
                        type: function(a) {
                            return a.getAttribute("type")
                        }
                    },
                    relative: {
                        "+": function(a, b) {
                            var c = typeof b == "string",
                                d = c && !l.test(b),
                                e = c && !d;
                            d && (b = b.toLowerCase());
                            for (var f = 0, g = a.length, h; f < g; f++)
                                if (h = a[f]) {
                                    while ((h = h.previousSibling) && h.nodeType !== 1);
                                    a[f] = e || h && h.nodeName.toLowerCase() === b ? h || !1 : h === b
                                } e && m.filter(b, a, !0)
                        },
                        ">": function(a, b) {
                            var c, d = typeof b == "string",
                                e = 0,
                                f = a.length;
                            if (d && !l.test(b)) {
                                b = b.toLowerCase();
                                for (; e < f; e++) {
                                    c = a[e];
                                    if (c) {
                                        var g = c.parentNode;
                                        a[e] = g.nodeName.toLowerCase() === b ? g : !1
                                    }
                                }
                            } else {
                                for (; e < f; e++) c = a[e], c && (a[e] = d ? c.parentNode : c.parentNode === b);
                                d && m.filter(b, a, !0)
                            }
                        },
                        "": function(a, b, c) {
                            var d, f = e++,
                                g = x;
                            typeof b == "string" && !l.test(b) && (b = b.toLowerCase(), d = b, g = w), g("parentNode", b, f, a, d, c)
                        },
                        "~": function(a, b, c) {
                            var d, f = e++,
                                g = x;
                            typeof b == "string" && !l.test(b) && (b = b.toLowerCase(), d = b, g = w), g("previousSibling", b, f, a, d, c)
                        }
                    },
                    find: {
                        ID: function(a, b, c) {
                            if (typeof b.getElementById != "undefined" && !c) {
                                var d = b.getElementById(a[1]);
                                return d && d.parentNode ? [d] : []
                            }
                        },
                        NAME: function(a, b) {
                            if (typeof b.getElementsByName != "undefined") {
                                var c = [],
                                    d = b.getElementsByName(a[1]);
                                for (var e = 0, f = d.length; e < f; e++) d[e].getAttribute("name") === a[1] && c.push(d[e]);
                                return c.length === 0 ? null : c
                            }
                        },
                        TAG: function(a, b) {
                            if (typeof b.getElementsByTagName != "undefined") return b.getElementsByTagName(a[1])
                        }
                    },
                    preFilter: {
                        CLASS: function(a, b, c, d, e, f) {
                            a = " " + a[1].replace(j, "") + " ";
                            if (f) return a;
                            for (var g = 0, h;
                                (h = b[g]) != null; g++) h && (e ^ (h.className && (" " + h.className + " ").replace(/[\t\n\r]/g, " ").indexOf(a) >= 0) ? c || d.push(h) : c && (b[g] = !1));
                            return !1
                        },
                        ID: function(a) {
                            return a[1].replace(j, "")
                        },
                        TAG: function(a, b) {
                            return a[1].replace(j, "").toLowerCase()
                        },
                        CHILD: function(a) {
                            if (a[1] === "nth") {
                                a[2] || m.error(a[0]), a[2] = a[2].replace(/^\+|\s*/g, "");
                                var b = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(a[2] === "even" && "2n" || a[2] === "odd" && "2n+1" || !/\D/.test(a[2]) && "0n+" + a[2] || a[2]);
                                a[2] = b[1] + (b[2] || 1) - 0, a[3] = b[3] - 0
                            } else a[2] && m.error(a[0]);
                            a[0] = e++;
                            return a
                        },
                        ATTR: function(a, b, c, d, e, f) {
                            var g = a[1] = a[1].replace(j, "");
                            !f && o.attrMap[g] && (a[1] = o.attrMap[g]), a[4] = (a[4] || a[5] || "").replace(j, ""), a[2] === "~=" && (a[4] = " " + a[4] + " ");
                            return a
                        },
                        PSEUDO: function(b, c, d, e, f) {
                            if (b[1] === "not")
                                if ((a.exec(b[3]) || "").length > 1 || /^\w/.test(b[3])) b[3] = m(b[3], null, null, c);
                                else {
                                    var g = m.filter(b[3], c, d, !0 ^ f);
                                    d || e.push.apply(e, g);
                                    return !1
                                }
                            else if (o.match.POS.test(b[0]) || o.match.CHILD.test(b[0])) return !0;
                            return b
                        },
                        POS: function(a) {
                            a.unshift(!0);
                            return a
                        }
                    },
                    filters: {
                        enabled: function(a) {
                            return a.disabled === !1 && a.type !== "hidden"
                        },
                        disabled: function(a) {
                            return a.disabled === !0
                        },
                        checked: function(a) {
                            return a.checked === !0
                        },
                        selected: function(a) {
                            a.parentNode && a.parentNode.selectedIndex;
                            return a.selected === !0
                        },
                        parent: function(a) {
                            return !!a.firstChild
                        },
                        empty: function(a) {
                            return !a.firstChild
                        },
                        has: function(a, b, c) {
                            return !!m(c[3], a).length
                        },
                        header: function(a) {
                            return /h\d/i.test(a.nodeName)
                        },
                        text: function(a) {
                            var b = a.getAttribute("type"),
                                c = a.type;
                            return a.nodeName.toLowerCase() === "input" && "text" === c && (b === c || b === null)
                        },
                        radio: function(a) {
                            return a.nodeName.toLowerCase() === "input" && "radio" === a.type
                        },
                        checkbox: function(a) {
                            return a.nodeName.toLowerCase() === "input" && "checkbox" === a.type
                        },
                        file: function(a) {
                            return a.nodeName.toLowerCase() === "input" && "file" === a.type
                        },
                        password: function(a) {
                            return a.nodeName.toLowerCase() === "input" && "password" === a.type
                        },
                        submit: function(a) {
                            var b = a.nodeName.toLowerCase();
                            return (b === "input" || b === "button") && "submit" === a.type
                        },
                        image: function(a) {
                            return a.nodeName.toLowerCase() === "input" && "image" === a.type
                        },
                        reset: function(a) {
                            var b = a.nodeName.toLowerCase();
                            return (b === "input" || b === "button") && "reset" === a.type
                        },
                        button: function(a) {
                            var b = a.nodeName.toLowerCase();
                            return b === "input" && "button" === a.type || b === "button"
                        },
                        input: function(a) {
                            return /input|select|textarea|button/i.test(a.nodeName)
                        },
                        focus: function(a) {
                            return a === a.ownerDocument.activeElement
                        }
                    },
                    setFilters: {
                        first: function(a, b) {
                            return b === 0
                        },
                        last: function(a, b, c, d) {
                            return b === d.length - 1
                        },
                        even: function(a, b) {
                            return b % 2 === 0
                        },
                        odd: function(a, b) {
                            return b % 2 === 1
                        },
                        lt: function(a, b, c) {
                            return b < c[3] - 0
                        },
                        gt: function(a, b, c) {
                            return b > c[3] - 0
                        },
                        nth: function(a, b, c) {
                            return c[3] - 0 === b
                        },
                        eq: function(a, b, c) {
                            return c[3] - 0 === b
                        }
                    },
                    filter: {
                        PSEUDO: function(a, b, c, d) {
                            var e = b[1],
                                f = o.filters[e];
                            if (f) return f(a, c, b, d);
                            if (e === "contains") return (a.textContent || a.innerText || n([a]) || "").indexOf(b[3]) >= 0;
                            if (e === "not") {
                                var g = b[3];
                                for (var h = 0, i = g.length; h < i; h++)
                                    if (g[h] === a) return !1;
                                return !0
                            }
                            m.error(e)
                        },
                        CHILD: function(a, b) {
                            var c, e, f, g, h, i, j, k = b[1],
                                l = a;
                            switch (k) {
                                case "only":
                                case "first":
                                    while (l = l.previousSibling)
                                        if (l.nodeType === 1) return !1;
                                    if (k === "first") return !0;
                                    l = a;
                                case "last":
                                    while (l = l.nextSibling)
                                        if (l.nodeType === 1) return !1;
                                    return !0;
                                case "nth":
                                    c = b[2], e = b[3];
                                    if (c === 1 && e === 0) return !0;
                                    f = b[0], g = a.parentNode;
                                    if (g && (g[d] !== f || !a.nodeIndex)) {
                                        i = 0;
                                        for (l = g.firstChild; l; l = l.nextSibling) l.nodeType === 1 && (l.nodeIndex = ++i);
                                        g[d] = f
                                    }
                                    j = a.nodeIndex - e;
                                    return c === 0 ? j === 0 : j % c === 0 && j / c >= 0
                            }
                        },
                        ID: function(a, b) {
                            return a.nodeType === 1 && a.getAttribute("id") === b
                        },
                        TAG: function(a, b) {
                            return b === "*" && a.nodeType === 1 || !!a.nodeName && a.nodeName.toLowerCase() === b
                        },
                        CLASS: function(a, b) {
                            return (" " + (a.className || a.getAttribute("class")) + " ").indexOf(b) > -1
                        },
                        ATTR: function(a, b) {
                            var c = b[1],
                                d = m.attr ? m.attr(a, c) : o.attrHandle[c] ? o.attrHandle[c](a) : a[c] != null ? a[c] : a.getAttribute(c),
                                e = d + "",
                                f = b[2],
                                g = b[4];
                            return d == null ? f === "!=" : !f && m.attr ? d != null : f === "=" ? e === g : f === "*=" ? e.indexOf(g) >= 0 : f === "~=" ? (" " + e + " ").indexOf(g) >= 0 : g ? f === "!=" ? e !== g : f === "^=" ? e.indexOf(g) === 0 : f === "$=" ? e.substr(e.length - g.length) === g : f === "|=" ? e === g || e.substr(0, g.length + 1) === g + "-" : !1 : e && d !== !1
                        },
                        POS: function(a, b, c, d) {
                            var e = b[2],
                                f = o.setFilters[e];
                            if (f) return f(a, c, b, d)
                        }
                    }
                },
                p = o.match.POS,
                q = function(a, b) {
                    return "\\" + (b - 0 + 1)
                };
            for (var r in o.match) o.match[r] = new RegExp(o.match[r].source + /(?![^\[]*\])(?![^\(]*\))/.source), o.leftMatch[r] = new RegExp(/(^(?:.|\r|\n)*?)/.source + o.match[r].source.replace(/\\(\d+)/g, q));
            var s = function(a, b) {
                a = Array.prototype.slice.call(a, 0);
                if (b) {
                    b.push.apply(b, a);
                    return b
                }
                return a
            };
            try {
                Array.prototype.slice.call(c.documentElement.childNodes, 0)[0].nodeType
            } catch (t) {
                s = function(a, b) {
                    var c = 0,
                        d = b || [];
                    if (g.call(a) === "[object Array]") Array.prototype.push.apply(d, a);
                    else if (typeof a.length == "number")
                        for (var e = a.length; c < e; c++) d.push(a[c]);
                    else
                        for (; a[c]; c++) d.push(a[c]);
                    return d
                }
            }
            var u, v;
            c.documentElement.compareDocumentPosition ? u = function(a, b) {
                    if (a === b) {
                        h = !0;
                        return 0
                    }
                    if (!a.compareDocumentPosition || !b.compareDocumentPosition) return a.compareDocumentPosition ? -1 : 1;
                    return a.compareDocumentPosition(b) & 4 ? -1 : 1
                } : (u = function(a, b) {
                    if (a === b) {
                        h = !0;
                        return 0
                    }
                    if (a.sourceIndex && b.sourceIndex) return a.sourceIndex - b.sourceIndex;
                    var c, d, e = [],
                        f = [],
                        g = a.parentNode,
                        i = b.parentNode,
                        j = g;
                    if (g === i) return v(a, b);
                    if (!g) return -1;
                    if (!i) return 1;
                    while (j) e.unshift(j), j = j.parentNode;
                    j = i;
                    while (j) f.unshift(j), j = j.parentNode;
                    c = e.length, d = f.length;
                    for (var k = 0; k < c && k < d; k++)
                        if (e[k] !== f[k]) return v(e[k], f[k]);
                    return k === c ? v(a, f[k], -1) : v(e[k], b, 1)
                }, v = function(a, b, c) {
                    if (a === b) return c;
                    var d = a.nextSibling;
                    while (d) {
                        if (d === b) return -1;
                        d = d.nextSibling
                    }
                    return 1
                }),
                function() {
                    var a = c.createElement("div"),
                        d = "script" + (new Date).getTime(),
                        e = c.documentElement;
                    a.innerHTML = "<a name='" + d + "'/>", e.insertBefore(a, e.firstChild), c.getElementById(d) && (o.find.ID = function(a, c, d) {
                        if (typeof c.getElementById != "undefined" && !d) {
                            var e = c.getElementById(a[1]);
                            return e ? e.id === a[1] || typeof e.getAttributeNode != "undefined" && e.getAttributeNode("id").nodeValue === a[1] ? [e] : b : []
                        }
                    }, o.filter.ID = function(a, b) {
                        var c = typeof a.getAttributeNode != "undefined" && a.getAttributeNode("id");
                        return a.nodeType === 1 && c && c.nodeValue === b
                    }), e.removeChild(a), e = a = null
                }(),
                function() {
                    var a = c.createElement("div");
                    a.appendChild(c.createComment("")), a.getElementsByTagName("*").length > 0 && (o.find.TAG = function(a, b) {
                        var c = b.getElementsByTagName(a[1]);
                        if (a[1] === "*") {
                            var d = [];
                            for (var e = 0; c[e]; e++) c[e].nodeType === 1 && d.push(c[e]);
                            c = d
                        }
                        return c
                    }), a.innerHTML = "<a href='#'></a>", a.firstChild && typeof a.firstChild.getAttribute != "undefined" && a.firstChild.getAttribute("href") !== "#" && (o.attrHandle.href = function(a) {
                        return a.getAttribute("href", 2)
                    }), a = null
                }(), c.querySelectorAll && function() {
                    var a = m,
                        b = c.createElement("div"),
                        d = "__sizzle__";
                    b.innerHTML = "<p class='TEST'></p>";
                    if (!b.querySelectorAll || b.querySelectorAll(".TEST").length !== 0) {
                        m = function(b, e, f, g) {
                            e = e || c;
                            if (!g && !m.isXML(e)) {
                                var h = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b);
                                if (h && (e.nodeType === 1 || e.nodeType === 9)) {
                                    if (h[1]) return s(e.getElementsByTagName(b), f);
                                    if (h[2] && o.find.CLASS && e.getElementsByClassName) return s(e.getElementsByClassName(h[2]), f)
                                }
                                if (e.nodeType === 9) {
                                    if (b === "body" && e.body) return s([e.body], f);
                                    if (h && h[3]) {
                                        var i = e.getElementById(h[3]);
                                        if (!i || !i.parentNode) return s([], f);
                                        if (i.id === h[3]) return s([i], f)
                                    }
                                    try {
                                        return s(e.querySelectorAll(b), f)
                                    } catch (j) {}
                                } else if (e.nodeType === 1 && e.nodeName.toLowerCase() !== "object") {
                                    var k = e,
                                        l = e.getAttribute("id"),
                                        n = l || d,
                                        p = e.parentNode,
                                        q = /^\s*[+~]/.test(b);
                                    l ? n = n.replace(/'/g, "\\$&") : e.setAttribute("id", n), q && p && (e = e.parentNode);
                                    try {
                                        if (!q || p) return s(e.querySelectorAll("[id='" + n + "'] " + b), f)
                                    } catch (r) {} finally {
                                        l || k.removeAttribute("id")
                                    }
                                }
                            }
                            return a(b, e, f, g)
                        };
                        for (var e in a) m[e] = a[e];
                        b = null
                    }
                }(),
                function() {
                    var a = c.documentElement,
                        b = a.matchesSelector || a.mozMatchesSelector || a.webkitMatchesSelector || a.msMatchesSelector;
                    if (b) {
                        var d = !b.call(c.createElement("div"), "div"),
                            e = !1;
                        try {
                            b.call(c.documentElement, "[test!='']:sizzle")
                        } catch (f) {
                            e = !0
                        }
                        m.matchesSelector = function(a, c) {
                            c = c.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");
                            if (!m.isXML(a)) try {
                                if (e || !o.match.PSEUDO.test(c) && !/!=/.test(c)) {
                                    var f = b.call(a, c);
                                    if (f || !d || a.document && a.document.nodeType !== 11) return f
                                }
                            } catch (g) {}
                            return m(c, null, null, [a]).length > 0
                        }
                    }
                }(),
                function() {
                    var a = c.createElement("div");
                    a.innerHTML = "<div class='test e'></div><div class='test'></div>";
                    if (!!a.getElementsByClassName && a.getElementsByClassName("e").length !== 0) {
                        a.lastChild.className = "e";
                        if (a.getElementsByClassName("e").length === 1) return;
                        o.order.splice(1, 0, "CLASS"), o.find.CLASS = function(a, b, c) {
                            if (typeof b.getElementsByClassName != "undefined" && !c) return b.getElementsByClassName(a[1])
                        }, a = null
                    }
                }(), c.documentElement.contains ? m.contains = function(a, b) {
                    return a !== b && (a.contains ? a.contains(b) : !0)
                } : c.documentElement.compareDocumentPosition ? m.contains = function(a, b) {
                    return !!(a.compareDocumentPosition(b) & 16)
                } : m.contains = function() {
                    return !1
                }, m.isXML = function(a) {
                    var b = (a ? a.ownerDocument || a : 0).documentElement;
                    return b ? b.nodeName !== "HTML" : !1
                };
            var y = function(a, b, c) {
                var d, e = [],
                    f = "",
                    g = b.nodeType ? [b] : b;
                while (d = o.match.PSEUDO.exec(a)) f += d[0], a = a.replace(o.match.PSEUDO, "");
                a = o.relative[a] ? a + "*" : a;
                for (var h = 0, i = g.length; h < i; h++) m(a, g[h], e, c);
                return m.filter(f, e)
            };
            m.attr = f.attr, m.selectors.attrMap = {}, f.find = m, f.expr = m.selectors, f.expr[":"] = f.expr.filters, f.unique = m.uniqueSort, f.text = m.getText, f.isXMLDoc = m.isXML, f.contains = m.contains
        }();
    var L = /Until$/,
        M = /^(?:parents|prevUntil|prevAll)/,
        N = /,/,
        O = /^.[^:#\[\.,]*$/,
        P = Array.prototype.slice,
        Q = f.expr.match.POS,
        R = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        };
    f.fn.extend({
        find: function(a) {
            var b = this,
                c, d;
            if (typeof a != "string") return f(a).filter(function() {
                for (c = 0, d = b.length; c < d; c++)
                    if (f.contains(b[c], this)) return !0
            });
            var e = this.pushStack("", "find", a),
                g, h, i;
            for (c = 0, d = this.length; c < d; c++) {
                g = e.length, f.find(a, this[c], e);
                if (c > 0)
                    for (h = g; h < e.length; h++)
                        for (i = 0; i < g; i++)
                            if (e[i] === e[h]) {
                                e.splice(h--, 1);
                                break
                            }
            }
            return e
        },
        has: function(a) {
            var b = f(a);
            return this.filter(function() {
                for (var a = 0, c = b.length; a < c; a++)
                    if (f.contains(this, b[a])) return !0
            })
        },
        not: function(a) {
            return this.pushStack(T(this, a, !1), "not", a)
        },
        filter: function(a) {
            return this.pushStack(T(this, a, !0), "filter", a)
        },
        is: function(a) {
            return !!a && (typeof a == "string" ? Q.test(a) ? f(a, this.context).index(this[0]) >= 0 : f.filter(a, this).length > 0 : this.filter(a).length > 0)
        },
        closest: function(a, b) {
            var c = [],
                d, e, g = this[0];
            if (f.isArray(a)) {
                var h = 1;
                while (g && g.ownerDocument && g !== b) {
                    for (d = 0; d < a.length; d++) f(g).is(a[d]) && c.push({
                        selector: a[d],
                        elem: g,
                        level: h
                    });
                    g = g.parentNode, h++
                }
                return c
            }
            var i = Q.test(a) || typeof a != "string" ? f(a, b || this.context) : 0;
            for (d = 0, e = this.length; d < e; d++) {
                g = this[d];
                while (g) {
                    if (i ? i.index(g) > -1 : f.find.matchesSelector(g, a)) {
                        c.push(g);
                        break
                    }
                    g = g.parentNode;
                    if (!g || !g.ownerDocument || g === b || g.nodeType === 11) break
                }
            }
            c = c.length > 1 ? f.unique(c) : c;
            return this.pushStack(c, "closest", a)
        },
        index: function(a) {
            if (!a) return this[0] && this[0].parentNode ? this.prevAll().length : -1;
            if (typeof a == "string") return f.inArray(this[0], f(a));
            return f.inArray(a.jquery ? a[0] : a, this)
        },
        add: function(a, b) {
            var c = typeof a == "string" ? f(a, b) : f.makeArray(a && a.nodeType ? [a] : a),
                d = f.merge(this.get(), c);
            return this.pushStack(S(c[0]) || S(d[0]) ? d : f.unique(d))
        },
        andSelf: function() {
            return this.add(this.prevObject)
        }
    }), f.each({
        parent: function(a) {
            var b = a.parentNode;
            return b && b.nodeType !== 11 ? b : null
        },
        parents: function(a) {
            return f.dir(a, "parentNode")
        },
        parentsUntil: function(a, b, c) {
            return f.dir(a, "parentNode", c)
        },
        next: function(a) {
            return f.nth(a, 2, "nextSibling")
        },
        prev: function(a) {
            return f.nth(a, 2, "previousSibling")
        },
        nextAll: function(a) {
            return f.dir(a, "nextSibling")
        },
        prevAll: function(a) {
            return f.dir(a, "previousSibling")
        },
        nextUntil: function(a, b, c) {
            return f.dir(a, "nextSibling", c)
        },
        prevUntil: function(a, b, c) {
            return f.dir(a, "previousSibling", c)
        },
        siblings: function(a) {
            return f.sibling(a.parentNode.firstChild, a)
        },
        children: function(a) {
            return f.sibling(a.firstChild)
        },
        contents: function(a) {
            return f.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : f.makeArray(a.childNodes)
        }
    }, function(a, b) {
        f.fn[a] = function(c, d) {
            var e = f.map(this, b, c);
            L.test(a) || (d = c), d && typeof d == "string" && (e = f.filter(d, e)), e = this.length > 1 && !R[a] ? f.unique(e) : e, (this.length > 1 || N.test(d)) && M.test(a) && (e = e.reverse());
            return this.pushStack(e, a, P.call(arguments).join(","))
        }
    }), f.extend({
        filter: function(a, b, c) {
            c && (a = ":not(" + a + ")");
            return b.length === 1 ? f.find.matchesSelector(b[0], a) ? [b[0]] : [] : f.find.matches(a, b)
        },
        dir: function(a, c, d) {
            var e = [],
                g = a[c];
            while (g && g.nodeType !== 9 && (d === b || g.nodeType !== 1 || !f(g).is(d))) g.nodeType === 1 && e.push(g), g = g[c];
            return e
        },
        nth: function(a, b, c, d) {
            b = b || 1;
            var e = 0;
            for (; a; a = a[c])
                if (a.nodeType === 1 && ++e === b) break;
            return a
        },
        sibling: function(a, b) {
            var c = [];
            for (; a; a = a.nextSibling) a.nodeType === 1 && a !== b && c.push(a);
            return c
        }
    });
    var V = "abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
        W = / jQuery\d+="(?:\d+|null)"/g,
        X = /^\s+/,
        Y = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
        Z = /<([\w:]+)/,
        $ = /<tbody/i,
        _ = /<|&#?\w+;/,
        ba = /<(?:script|style)/i,
        bb = /<(?:script|object|embed|option|style)/i,
        bc = new RegExp("<(?:" + V + ")", "i"),
        bd = /checked\s*(?:[^=]|=\s*.checked.)/i,
        be = /\/(java|ecma)script/i,
        bf = /^\s*<!(?:\[CDATA\[|\-\-)/,
        bg = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            legend: [1, "<fieldset>", "</fieldset>"],
            thead: [1, "<table>", "</table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
            area: [1, "<map>", "</map>"],
            _default: [0, "", ""]
        },
        bh = U(c);
    bg.optgroup = bg.option, bg.tbody = bg.tfoot = bg.colgroup = bg.caption = bg.thead, bg.th = bg.td, f.support.htmlSerialize || (bg._default = [1, "div<div>", "</div>"]), f.fn.extend({
        text: function(a) {
            if (f.isFunction(a)) return this.each(function(b) {
                var c = f(this);
                c.text(a.call(this, b, c.text()))
            });
            if (typeof a != "object" && a !== b) return this.empty().append((this[0] && this[0].ownerDocument || c).createTextNode(a));
            return f.text(this)
        },
        wrapAll: function(a) {
            if (f.isFunction(a)) return this.each(function(b) {
                f(this).wrapAll(a.call(this, b))
            });
            if (this[0]) {
                var b = f(a, this[0].ownerDocument).eq(0).clone(!0);
                this[0].parentNode && b.insertBefore(this[0]), b.map(function() {
                    var a = this;
                    while (a.firstChild && a.firstChild.nodeType === 1) a = a.firstChild;
                    return a
                }).append(this)
            }
            return this
        },
        wrapInner: function(a) {
            if (f.isFunction(a)) return this.each(function(b) {
                f(this).wrapInner(a.call(this, b))
            });
            return this.each(function() {
                var b = f(this),
                    c = b.contents();
                c.length ? c.wrapAll(a) : b.append(a)
            })
        },
        wrap: function(a) {
            var b = f.isFunction(a);
            return this.each(function(c) {
                f(this).wrapAll(b ? a.call(this, c) : a)
            })
        },
        unwrap: function() {
            return this.parent().each(function() {
                f.nodeName(this, "body") || f(this).replaceWith(this.childNodes)
            }).end()
        },
        append: function() {
            return this.domManip(arguments, !0, function(a) {
                this.nodeType === 1 && this.appendChild(a)
            })
        },
        prepend: function() {
            return this.domManip(arguments, !0, function(a) {
                this.nodeType === 1 && this.insertBefore(a, this.firstChild)
            })
        },
        before: function() {
            if (this[0] && this[0].parentNode) return this.domManip(arguments, !1, function(a) {
                this.parentNode.insertBefore(a, this)
            });
            if (arguments.length) {
                var a = f.clean(arguments);
                a.push.apply(a, this.toArray());
                return this.pushStack(a, "before", arguments)
            }
        },
        after: function() {
            if (this[0] && this[0].parentNode) return this.domManip(arguments, !1, function(a) {
                this.parentNode.insertBefore(a, this.nextSibling)
            });
            if (arguments.length) {
                var a = this.pushStack(this, "after", arguments);
                a.push.apply(a, f.clean(arguments));
                return a
            }
        },
        remove: function(a, b) {
            for (var c = 0, d;
                (d = this[c]) != null; c++)
                if (!a || f.filter(a, [d]).length) !b && d.nodeType === 1 && (f.cleanData(d.getElementsByTagName("*")), f.cleanData([d])), d.parentNode && d.parentNode.removeChild(d);
            return this
        },
        empty: function() {
            for (var a = 0, b;
                (b = this[a]) != null; a++) {
                b.nodeType === 1 && f.cleanData(b.getElementsByTagName("*"));
                while (b.firstChild) b.removeChild(b.firstChild)
            }
            return this
        },
        clone: function(a, b) {
            a = a == null ? !1 : a, b = b == null ? a : b;
            return this.map(function() {
                return f.clone(this, a, b)
            })
        },
        html: function(a) {
            if (a === b) return this[0] && this[0].nodeType === 1 ? this[0].innerHTML.replace(W, "") : null;
            if (typeof a == "string" && !ba.test(a) && (f.support.leadingWhitespace || !X.test(a)) && !bg[(Z.exec(a) || ["", ""])[1].toLowerCase()]) {
                a = a.replace(Y, "<$1></$2>");
                try {
                    for (var c = 0, d = this.length; c < d; c++) this[c].nodeType === 1 && (f.cleanData(this[c].getElementsByTagName("*")), this[c].innerHTML = a)
                } catch (e) {
                    this.empty().append(a)
                }
            } else f.isFunction(a) ? this.each(function(b) {
                var c = f(this);
                c.html(a.call(this, b, c.html()))
            }) : this.empty().append(a);
            return this
        },
        replaceWith: function(a) {
            if (this[0] && this[0].parentNode) {
                if (f.isFunction(a)) return this.each(function(b) {
                    var c = f(this),
                        d = c.html();
                    c.replaceWith(a.call(this, b, d))
                });
                typeof a != "string" && (a = f(a).detach());
                return this.each(function() {
                    var b = this.nextSibling,
                        c = this.parentNode;
                    f(this).remove(), b ? f(b).before(a) : f(c).append(a)
                })
            }
            return this.length ? this.pushStack(f(f.isFunction(a) ? a() : a), "replaceWith", a) : this
        },
        detach: function(a) {
            return this.remove(a, !0)
        },
        domManip: function(a, c, d) {
            var e, g, h, i, j = a[0],
                k = [];
            if (!f.support.checkClone && arguments.length === 3 && typeof j == "string" && bd.test(j)) return this.each(function() {
                f(this).domManip(a, c, d, !0)
            });
            if (f.isFunction(j)) return this.each(function(e) {
                var g = f(this);
                a[0] = j.call(this, e, c ? g.html() : b), g.domManip(a, c, d)
            });
            if (this[0]) {
                i = j && j.parentNode, f.support.parentNode && i && i.nodeType === 11 && i.childNodes.length === this.length ? e = {
                    fragment: i
                } : e = f.buildFragment(a, this, k), h = e.fragment, h.childNodes.length === 1 ? g = h = h.firstChild : g = h.firstChild;
                if (g) {
                    c = c && f.nodeName(g, "tr");
                    for (var l = 0, m = this.length, n = m - 1; l < m; l++) d.call(c ? bi(this[l], g) : this[l], e.cacheable || m > 1 && l < n ? f.clone(h, !0, !0) : h)
                }
                k.length && f.each(k, bp)
            }
            return this
        }
    }), f.buildFragment = function(a, b, d) {
        var e, g, h, i, j = a[0];
        b && b[0] && (i = b[0].ownerDocument || b[0]), i.createDocumentFragment || (i = c), a.length === 1 && typeof j == "string" && j.length < 512 && i === c && j.charAt(0) === "<" && !bb.test(j) && (f.support.checkClone || !bd.test(j)) && (f.support.html5Clone || !bc.test(j)) && (g = !0, h = f.fragments[j], h && h !== 1 && (e = h)), e || (e = i.createDocumentFragment(), f.clean(a, i, e, d)), g && (f.fragments[j] = h ? e : 1);
        return {
            fragment: e,
            cacheable: g
        }
    }, f.fragments = {}, f.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(a, b) {
        f.fn[a] = function(c) {
            var d = [],
                e = f(c),
                g = this.length === 1 && this[0].parentNode;
            if (g && g.nodeType === 11 && g.childNodes.length === 1 && e.length === 1) {
                e[b](this[0]);
                return this
            }
            for (var h = 0, i = e.length; h < i; h++) {
                var j = (h > 0 ? this.clone(!0) : this).get();
                f(e[h])[b](j), d = d.concat(j)
            }
            return this.pushStack(d, a, e.selector)
        }
    }), f.extend({
        clone: function(a, b, c) {
            var d, e, g, h = f.support.html5Clone || !bc.test("<" + a.nodeName) ? a.cloneNode(!0) : bo(a);
            if ((!f.support.noCloneEvent || !f.support.noCloneChecked) && (a.nodeType === 1 || a.nodeType === 11) && !f.isXMLDoc(a)) {
                bk(a, h), d = bl(a), e = bl(h);
                for (g = 0; d[g]; ++g) e[g] && bk(d[g], e[g])
            }
            if (b) {
                bj(a, h);
                if (c) {
                    d = bl(a), e = bl(h);
                    for (g = 0; d[g]; ++g) bj(d[g], e[g])
                }
            }
            d = e = null;
            return h
        },
        clean: function(a, b, d, e) {
            var g;
            b = b || c, typeof b.createElement == "undefined" && (b = b.ownerDocument || b[0] && b[0].ownerDocument || c);
            var h = [],
                i;
            for (var j = 0, k;
                (k = a[j]) != null; j++) {
                typeof k == "number" && (k += "");
                if (!k) continue;
                if (typeof k == "string")
                    if (!_.test(k)) k = b.createTextNode(k);
                    else {
                        k = k.replace(Y, "<$1></$2>");
                        var l = (Z.exec(k) || ["", ""])[1].toLowerCase(),
                            m = bg[l] || bg._default,
                            n = m[0],
                            o = b.createElement("div");
                        b === c ? bh.appendChild(o) : U(b).appendChild(o), o.innerHTML = m[1] + k + m[2];
                        while (n--) o = o.lastChild;
                        if (!f.support.tbody) {
                            var p = $.test(k),
                                q = l === "table" && !p ? o.firstChild && o.firstChild.childNodes : m[1] === "<table>" && !p ? o.childNodes : [];
                            for (i = q.length - 1; i >= 0; --i) f.nodeName(q[i], "tbody") && !q[i].childNodes.length && q[i].parentNode.removeChild(q[i])
                        }!f.support.leadingWhitespace && X.test(k) && o.insertBefore(b.createTextNode(X.exec(k)[0]), o.firstChild), k = o.childNodes
                    } var r;
                if (!f.support.appendChecked)
                    if (k[0] && typeof(r = k.length) == "number")
                        for (i = 0; i < r; i++) bn(k[i]);
                    else bn(k);
                k.nodeType ? h.push(k) : h = f.merge(h, k)
            }
            if (d) {
                g = function(a) {
                    return !a.type || be.test(a.type)
                };
                for (j = 0; h[j]; j++)
                    if (e && f.nodeName(h[j], "script") && (!h[j].type || h[j].type.toLowerCase() === "text/javascript")) e.push(h[j].parentNode ? h[j].parentNode.removeChild(h[j]) : h[j]);
                    else {
                        if (h[j].nodeType === 1) {
                            var s = f.grep(h[j].getElementsByTagName("script"), g);
                            h.splice.apply(h, [j + 1, 0].concat(s))
                        }
                        d.appendChild(h[j])
                    }
            }
            return h
        },
        cleanData: function(a) {
            var b, c, d = f.cache,
                e = f.event.special,
                g = f.support.deleteExpando;
            for (var h = 0, i;
                (i = a[h]) != null; h++) {
                if (i.nodeName && f.noData[i.nodeName.toLowerCase()]) continue;
                c = i[f.expando];
                if (c) {
                    b = d[c];
                    if (b && b.events) {
                        for (var j in b.events) e[j] ? f.event.remove(i, j) : f.removeEvent(i, j, b.handle);
                        b.handle && (b.handle.elem = null)
                    }
                    g ? delete i[f.expando] : i.removeAttribute && i.removeAttribute(f.expando), delete d[c]
                }
            }
        }
    });
    var bq = /alpha\([^)]*\)/i,
        br = /opacity=([^)]*)/,
        bs = /([A-Z]|^ms)/g,
        bt = /^-?\d+(?:px)?$/i,
        bu = /^-?\d/,
        bv = /^([\-+])=([\-+.\de]+)/,
        bw = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        },
        bx = ["Left", "Right"],
        by = ["Top", "Bottom"],
        bz, bA, bB;
    f.fn.css = function(a, c) {
        if (arguments.length === 2 && c === b) return this;
        return f.access(this, a, c, !0, function(a, c, d) {
            return d !== b ? f.style(a, c, d) : f.css(a, c)
        })
    }, f.extend({
        cssHooks: {
            opacity: {
                get: function(a, b) {
                    if (b) {
                        var c = bz(a, "opacity", "opacity");
                        return c === "" ? "1" : c
                    }
                    return a.style.opacity
                }
            }
        },
        cssNumber: {
            fillOpacity: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            "float": f.support.cssFloat ? "cssFloat" : "styleFloat"
        },
        style: function(a, c, d, e) {
            if (!!a && a.nodeType !== 3 && a.nodeType !== 8 && !!a.style) {
                var g, h, i = f.camelCase(c),
                    j = a.style,
                    k = f.cssHooks[i];
                c = f.cssProps[i] || i;
                if (d === b) {
                    if (k && "get" in k && (g = k.get(a, !1, e)) !== b) return g;
                    return j[c]
                }
                h = typeof d, h === "string" && (g = bv.exec(d)) && (d = +(g[1] + 1) * +g[2] + parseFloat(f.css(a, c)), h = "number");
                if (d == null || h === "number" && isNaN(d)) return;
                h === "number" && !f.cssNumber[i] && (d += "px");
                if (!k || !("set" in k) || (d = k.set(a, d)) !== b) try {
                    j[c] = d
                } catch (l) {}
            }
        },
        css: function(a, c, d) {
            var e, g;
            c = f.camelCase(c), g = f.cssHooks[c], c = f.cssProps[c] || c, c === "cssFloat" && (c = "float");
            if (g && "get" in g && (e = g.get(a, !0, d)) !== b) return e;
            if (bz) return bz(a, c)
        },
        swap: function(a, b, c) {
            var d = {};
            for (var e in b) d[e] = a.style[e], a.style[e] = b[e];
            c.call(a);
            for (e in b) a.style[e] = d[e]
        }
    }), f.curCSS = f.css, f.each(["height", "width"], function(a, b) {
        f.cssHooks[b] = {
            get: function(a, c, d) {
                var e;
                if (c) {
                    if (a.offsetWidth !== 0) return bC(a, b, d);
                    f.swap(a, bw, function() {
                        e = bC(a, b, d)
                    });
                    return e
                }
            },
            set: function(a, b) {
                if (!bt.test(b)) return b;
                b = parseFloat(b);
                if (b >= 0) return b + "px"
            }
        }
    }), f.support.opacity || (f.cssHooks.opacity = {
        get: function(a, b) {
            return br.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? parseFloat(RegExp.$1) / 100 + "" : b ? "1" : ""
        },
        set: function(a, b) {
            var c = a.style,
                d = a.currentStyle,
                e = f.isNumeric(b) ? "alpha(opacity=" + b * 100 + ")" : "",
                g = d && d.filter || c.filter || "";
            c.zoom = 1;
            if (b >= 1 && f.trim(g.replace(bq, "")) === "") {
                c.removeAttribute("filter");
                if (d && !d.filter) return
            }
            c.filter = bq.test(g) ? g.replace(bq, e) : g + " " + e
        }
    }), f(function() {
        f.support.reliableMarginRight || (f.cssHooks.marginRight = {
            get: function(a, b) {
                var c;
                f.swap(a, {
                    display: "inline-block"
                }, function() {
                    b ? c = bz(a, "margin-right", "marginRight") : c = a.style.marginRight
                });
                return c
            }
        })
    }), c.defaultView && c.defaultView.getComputedStyle && (bA = function(a, b) {
        var c, d, e;
        b = b.replace(bs, "-$1").toLowerCase(), (d = a.ownerDocument.defaultView) && (e = d.getComputedStyle(a, null)) && (c = e.getPropertyValue(b), c === "" && !f.contains(a.ownerDocument.documentElement, a) && (c = f.style(a, b)));
        return c
    }), c.documentElement.currentStyle && (bB = function(a, b) {
        var c, d, e, f = a.currentStyle && a.currentStyle[b],
            g = a.style;
        f === null && g && (e = g[b]) && (f = e), !bt.test(f) && bu.test(f) && (c = g.left, d = a.runtimeStyle && a.runtimeStyle.left, d && (a.runtimeStyle.left = a.currentStyle.left), g.left = b === "fontSize" ? "1em" : f || 0, f = g.pixelLeft + "px", g.left = c, d && (a.runtimeStyle.left = d));
        return f === "" ? "auto" : f
    }), bz = bA || bB, f.expr && f.expr.filters && (f.expr.filters.hidden = function(a) {
        var b = a.offsetWidth,
            c = a.offsetHeight;
        return b === 0 && c === 0 || !f.support.reliableHiddenOffsets && (a.style && a.style.display || f.css(a, "display")) === "none"
    }, f.expr.filters.visible = function(a) {
        return !f.expr.filters.hidden(a)
    });
    var bD = /%20/g,
        bE = /\[\]$/,
        bF = /\r?\n/g,
        bG = /#.*$/,
        bH = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg,
        bI = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
        bJ = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
        bK = /^(?:GET|HEAD)$/,
        bL = /^\/\//,
        bM = /\?/,
        bN = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        bO = /^(?:select|textarea)/i,
        bP = /\s+/,
        bQ = /([?&])_=[^&]*/,
        bR = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,
        bS = f.fn.load,
        bT = {},
        bU = {},
        bV, bW, bX = ["*/"] + ["*"];
    try {
        bV = e.href
    } catch (bY) {
        bV = c.createElement("a"), bV.href = "", bV = bV.href
    }
    bW = bR.exec(bV.toLowerCase()) || [], f.fn.extend({
        load: function(a, c, d) {
            if (typeof a != "string" && bS) return bS.apply(this, arguments);
            if (!this.length) return this;
            var e = a.indexOf(" ");
            if (e >= 0) {
                var g = a.slice(e, a.length);
                a = a.slice(0, e)
            }
            var h = "GET";
            c && (f.isFunction(c) ? (d = c, c = b) : typeof c == "object" && (c = f.param(c, f.ajaxSettings.traditional), h = "POST"));
            var i = this;
            f.ajax({
                url: a,
                type: h,
                dataType: "html",
                data: c,
                complete: function(a, b, c) {
                    c = a.responseText, a.isResolved() && (a.done(function(a) {
                        c = a
                    }), i.html(g ? f("<div>").append(c.replace(bN, "")).find(g) : c)), d && i.each(d, [c, b, a])
                }
            });
            return this
        },
        serialize: function() {
            return f.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                return this.elements ? f.makeArray(this.elements) : this
            }).filter(function() {
                return this.name && !this.disabled && (this.checked || bO.test(this.nodeName) || bI.test(this.type))
            }).map(function(a, b) {
                var c = f(this).val();
                return c == null ? null : f.isArray(c) ? f.map(c, function(a, c) {
                    return {
                        name: b.name,
                        value: a.replace(bF, "\r\n")
                    }
                }) : {
                    name: b.name,
                    value: c.replace(bF, "\r\n")
                }
            }).get()
        }
    }), f.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function(a, b) {
        f.fn[b] = function(a) {
            return this.on(b, a)
        }
    }), f.each(["get", "post"], function(a, c) {
        f[c] = function(a, d, e, g) {
            f.isFunction(d) && (g = g || e, e = d, d = b);
            return f.ajax({
                type: c,
                url: a,
                data: d,
                success: e,
                dataType: g
            })
        }
    }), f.extend({
        getScript: function(a, c) {
            return f.get(a, b, c, "script")
        },
        getJSON: function(a, b, c) {
            return f.get(a, b, c, "json")
        },
        ajaxSetup: function(a, b) {
            b ? b_(a, f.ajaxSettings) : (b = a, a = f.ajaxSettings), b_(a, b);
            return a
        },
        ajaxSettings: {
            url: bV,
            isLocal: bJ.test(bW[1]),
            global: !0,
            type: "GET",
            contentType: "application/x-www-form-urlencoded",
            processData: !0,
            async: !0,
            accepts: {
                xml: "application/xml, text/xml",
                html: "text/html",
                text: "text/plain",
                json: "application/json, text/javascript",
                "*": bX
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText"
            },
            converters: {
                "* text": a.String,
                "text html": !0,
                "text json": f.parseJSON,
                "text xml": f.parseXML
            },
            flatOptions: {
                context: !0,
                url: !0
            }
        },
        ajaxPrefilter: bZ(bT),
        ajaxTransport: bZ(bU),
        ajax: function(a, c) {
            function w(a, c, l, m) {
                if (s !== 2) {
                    s = 2, q && clearTimeout(q), p = b, n = m || "", v.readyState = a > 0 ? 4 : 0;
                    var o, r, u, w = c,
                        x = l ? cb(d, v, l) : b,
                        y, z;
                    if (a >= 200 && a < 300 || a === 304) {
                        if (d.ifModified) {
                            if (y = v.getResponseHeader("Last-Modified")) f.lastModified[k] = y;
                            if (z = v.getResponseHeader("Etag")) f.etag[k] = z
                        }
                        if (a === 304) w = "notmodified", o = !0;
                        else try {
                            r = cc(d, x), w = "success", o = !0
                        } catch (A) {
                            w = "parsererror", u = A
                        }
                    } else {
                        u = w;
                        if (!w || a) w = "error", a < 0 && (a = 0)
                    }
                    v.status = a, v.statusText = "" + (c || w), o ? h.resolveWith(e, [r, w, v]) : h.rejectWith(e, [v, w, u]), v.statusCode(j), j = b, t && g.trigger("ajax" + (o ? "Success" : "Error"), [v, d, o ? r : u]), i.fireWith(e, [v, w]), t && (g.trigger("ajaxComplete", [v, d]), --f.active || f.event.trigger("ajaxStop"))
                }
            }
            typeof a == "object" && (c = a, a = b), c = c || {};
            var d = f.ajaxSetup({}, c),
                e = d.context || d,
                g = e !== d && (e.nodeType || e instanceof f) ? f(e) : f.event,
                h = f.Deferred(),
                i = f.Callbacks("once memory"),
                j = d.statusCode || {},
                k, l = {},
                m = {},
                n, o, p, q, r, s = 0,
                t, u, v = {
                    readyState: 0,
                    setRequestHeader: function(a, b) {
                        if (!s) {
                            var c = a.toLowerCase();
                            a = m[c] = m[c] || a, l[a] = b
                        }
                        return this
                    },
                    getAllResponseHeaders: function() {
                        return s === 2 ? n : null
                    },
                    getResponseHeader: function(a) {
                        var c;
                        if (s === 2) {
                            if (!o) {
                                o = {};
                                while (c = bH.exec(n)) o[c[1].toLowerCase()] = c[2]
                            }
                            c = o[a.toLowerCase()]
                        }
                        return c === b ? null : c
                    },
                    overrideMimeType: function(a) {
                        s || (d.mimeType = a);
                        return this
                    },
                    abort: function(a) {
                        a = a || "abort", p && p.abort(a), w(0, a);
                        return this
                    }
                };
            h.promise(v), v.success = v.done, v.error = v.fail, v.complete = i.add, v.statusCode = function(a) {
                if (a) {
                    var b;
                    if (s < 2)
                        for (b in a) j[b] = [j[b], a[b]];
                    else b = a[v.status], v.then(b, b)
                }
                return this
            }, d.url = ((a || d.url) + "").replace(bG, "").replace(bL, bW[1] + "//"), d.dataTypes = f.trim(d.dataType || "*").toLowerCase().split(bP), d.crossDomain == null && (r = bR.exec(d.url.toLowerCase()), d.crossDomain = !(!r || r[1] == bW[1] && r[2] == bW[2] && (r[3] || (r[1] === "http:" ? 80 : 443)) == (bW[3] || (bW[1] === "http:" ? 80 : 443)))), d.data && d.processData && typeof d.data != "string" && (d.data = f.param(d.data, d.traditional)), b$(bT, d, c, v);
            if (s === 2) return !1;
            t = d.global, d.type = d.type.toUpperCase(), d.hasContent = !bK.test(d.type), t && f.active++ === 0 && f.event.trigger("ajaxStart");
            if (!d.hasContent) {
                d.data && (d.url += (bM.test(d.url) ? "&" : "?") + d.data, delete d.data), k = d.url;
                if (d.cache === !1) {
                    var x = f.now(),
                        y = d.url.replace(bQ, "$1_=" + x);
                    d.url = y + (y === d.url ? (bM.test(d.url) ? "&" : "?") + "_=" + x : "")
                }
            }(d.data && d.hasContent && d.contentType !== !1 || c.contentType) && v.setRequestHeader("Content-Type", d.contentType), d.ifModified && (k = k || d.url, f.lastModified[k] && v.setRequestHeader("If-Modified-Since", f.lastModified[k]), f.etag[k] && v.setRequestHeader("If-None-Match", f.etag[k])), v.setRequestHeader("Accept", d.dataTypes[0] && d.accepts[d.dataTypes[0]] ? d.accepts[d.dataTypes[0]] + (d.dataTypes[0] !== "*" ? ", " + bX + "; q=0.01" : "") : d.accepts["*"]);
            for (u in d.headers) v.setRequestHeader(u, d.headers[u]);
            if (d.beforeSend && (d.beforeSend.call(e, v, d) === !1 || s === 2)) {
                v.abort();
                return !1
            }
            for (u in {
                    success: 1,
                    error: 1,
                    complete: 1
                }) v[u](d[u]);
            p = b$(bU, d, c, v);
            if (!p) w(-1, "No Transport");
            else {
                v.readyState = 1, t && g.trigger("ajaxSend", [v, d]), d.async && d.timeout > 0 && (q = setTimeout(function() {
                    v.abort("timeout")
                }, d.timeout));
                try {
                    s = 1, p.send(l, w)
                } catch (z) {
                    if (s < 2) w(-1, z);
                    else throw z
                }
            }
            return v
        },
        param: function(a, c) {
            var d = [],
                e = function(a, b) {
                    b = f.isFunction(b) ? b() : b, d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b)
                };
            c === b && (c = f.ajaxSettings.traditional);
            if (f.isArray(a) || a.jquery && !f.isPlainObject(a)) f.each(a, function() {
                e(this.name, this.value)
            });
            else
                for (var g in a) ca(g, a[g], c, e);
            return d.join("&").replace(bD, "+")
        }
    }), f.extend({
        active: 0,
        lastModified: {},
        etag: {}
    });
    var cd = f.now(),
        ce = /(\=)\?(&|$)|\?\?/i;
    f.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            return f.expando + "_" + cd++
        }
    }), f.ajaxPrefilter("json jsonp", function(b, c, d) {
        var e = b.contentType === "application/x-www-form-urlencoded" && typeof b.data == "string";
        if (b.dataTypes[0] === "jsonp" || b.jsonp !== !1 && (ce.test(b.url) || e && ce.test(b.data))) {
            var g, h = b.jsonpCallback = f.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback,
                i = a[h],
                j = b.url,
                k = b.data,
                l = "$1" + h + "$2";
            b.jsonp !== !1 && (j = j.replace(ce, l), b.url === j && (e && (k = k.replace(ce, l)), b.data === k && (j += (/\?/.test(j) ? "&" : "?") + b.jsonp + "=" + h))), b.url = j, b.data = k, a[h] = function(a) {
                g = [a]
            }, d.always(function() {
                a[h] = i, g && f.isFunction(i) && a[h](g[0])
            }), b.converters["script json"] = function() {
                g || f.error(h + " was not called");
                return g[0]
            }, b.dataTypes[0] = "json";
            return "script"
        }
    }), f.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /javascript|ecmascript/
        },
        converters: {
            "text script": function(a) {
                f.globalEval(a);
                return a
            }
        }
    }), f.ajaxPrefilter("script", function(a) {
        a.cache === b && (a.cache = !1), a.crossDomain && (a.type = "GET", a.global = !1)
    }), f.ajaxTransport("script", function(a) {
        if (a.crossDomain) {
            var d, e = c.head || c.getElementsByTagName("head")[0] || c.documentElement;
            return {
                send: function(f, g) {
                    d = c.createElement("script"), d.async = "async", a.scriptCharset && (d.charset = a.scriptCharset), d.src = a.url, d.onload = d.onreadystatechange = function(a, c) {
                        if (c || !d.readyState || /loaded|complete/.test(d.readyState)) d.onload = d.onreadystatechange = null, e && d.parentNode && e.removeChild(d), d = b, c || g(200, "success")
                    }, e.insertBefore(d, e.firstChild)
                },
                abort: function() {
                    d && d.onload(0, 1)
                }
            }
        }
    });
    var cf = a.ActiveXObject ? function() {
            for (var a in ch) ch[a](0, 1)
        } : !1,
        cg = 0,
        ch;
    f.ajaxSettings.xhr = a.ActiveXObject ? function() {
            return !this.isLocal && ci() || cj()
        } : ci,
        function(a) {
            f.extend(f.support, {
                ajax: !!a,
                cors: !!a && "withCredentials" in a
            })
        }(f.ajaxSettings.xhr()), f.support.ajax && f.ajaxTransport(function(c) {
            if (!c.crossDomain || f.support.cors) {
                var d;
                return {
                    send: function(e, g) {
                        var h = c.xhr(),
                            i, j;
                        c.username ? h.open(c.type, c.url, c.async, c.username, c.password) : h.open(c.type, c.url, c.async);
                        if (c.xhrFields)
                            for (j in c.xhrFields) h[j] = c.xhrFields[j];
                        c.mimeType && h.overrideMimeType && h.overrideMimeType(c.mimeType), !c.crossDomain && !e["X-Requested-With"] && (e["X-Requested-With"] = "XMLHttpRequest");
                        try {
                            for (j in e) h.setRequestHeader(j, e[j])
                        } catch (k) {}
                        h.send(c.hasContent && c.data || null), d = function(a, e) {
                            var j, k, l, m, n;
                            try {
                                if (d && (e || h.readyState === 4)) {
                                    d = b, i && (h.onreadystatechange = f.noop, cf && delete ch[i]);
                                    if (e) h.readyState !== 4 && h.abort();
                                    else {
                                        j = h.status, l = h.getAllResponseHeaders(), m = {}, n = h.responseXML, n && n.documentElement && (m.xml = n), m.text = h.responseText;
                                        try {
                                            k = h.statusText
                                        } catch (o) {
                                            k = ""
                                        }!j && c.isLocal && !c.crossDomain ? j = m.text ? 200 : 404 : j === 1223 && (j = 204)
                                    }
                                }
                            } catch (p) {
                                e || g(-1, p)
                            }
                            m && g(j, k, m, l)
                        }, !c.async || h.readyState === 4 ? d() : (i = ++cg, cf && (ch || (ch = {}, f(a).unload(cf)), ch[i] = d), h.onreadystatechange = d)
                    },
                    abort: function() {
                        d && d(0, 1)
                    }
                }
            }
        });
    var ck = {},
        cl, cm, cn = /^(?:toggle|show|hide)$/,
        co = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
        cp, cq = [
            ["height", "marginTop", "marginBottom", "paddingTop", "paddingBottom"],
            ["width", "marginLeft", "marginRight", "paddingLeft", "paddingRight"],
            ["opacity"]
        ],
        cr;
    f.fn.extend({
        show: function(a, b, c) {
            var d, e;
            if (a || a === 0) return this.animate(cu("show", 3), a, b, c);
            for (var g = 0, h = this.length; g < h; g++) d = this[g], d.style && (e = d.style.display, !f._data(d, "olddisplay") && e === "none" && (e = d.style.display = ""), e === "" && f.css(d, "display") === "none" && f._data(d, "olddisplay", cv(d.nodeName)));
            for (g = 0; g < h; g++) {
                d = this[g];
                if (d.style) {
                    e = d.style.display;
                    if (e === "" || e === "none") d.style.display = f._data(d, "olddisplay") || ""
                }
            }
            return this
        },
        hide: function(a, b, c) {
            if (a || a === 0) return this.animate(cu("hide", 3), a, b, c);
            var d, e, g = 0,
                h = this.length;
            for (; g < h; g++) d = this[g], d.style && (e = f.css(d, "display"), e !== "none" && !f._data(d, "olddisplay") && f._data(d, "olddisplay", e));
            for (g = 0; g < h; g++) this[g].style && (this[g].style.display = "none");
            return this
        },
        _toggle: f.fn.toggle,
        toggle: function(a, b, c) {
            var d = typeof a == "boolean";
            f.isFunction(a) && f.isFunction(b) ? this._toggle.apply(this, arguments) : a == null || d ? this.each(function() {
                var b = d ? a : f(this).is(":hidden");
                f(this)[b ? "show" : "hide"]()
            }) : this.animate(cu("toggle", 3), a, b, c);
            return this
        },
        fadeTo: function(a, b, c, d) {
            return this.filter(":hidden").css("opacity", 0).show().end().animate({
                opacity: b
            }, a, c, d)
        },
        animate: function(a, b, c, d) {
            function g() {
                e.queue === !1 && f._mark(this);
                var b = f.extend({}, e),
                    c = this.nodeType === 1,
                    d = c && f(this).is(":hidden"),
                    g, h, i, j, k, l, m, n, o;
                b.animatedProperties = {};
                for (i in a) {
                    g = f.camelCase(i), i !== g && (a[g] = a[i], delete a[i]), h = a[g], f.isArray(h) ? (b.animatedProperties[g] = h[1], h = a[g] = h[0]) : b.animatedProperties[g] = b.specialEasing && b.specialEasing[g] || b.easing || "swing";
                    if (h === "hide" && d || h === "show" && !d) return b.complete.call(this);
                    c && (g === "height" || g === "width") && (b.overflow = [this.style.overflow, this.style.overflowX, this.style.overflowY], f.css(this, "display") === "inline" && f.css(this, "float") === "none" && (!f.support.inlineBlockNeedsLayout || cv(this.nodeName) === "inline" ? this.style.display = "inline-block" : this.style.zoom = 1))
                }
                b.overflow != null && (this.style.overflow = "hidden");
                for (i in a) j = new f.fx(this, b, i), h = a[i], cn.test(h) ? (o = f._data(this, "toggle" + i) || (h === "toggle" ? d ? "show" : "hide" : 0), o ? (f._data(this, "toggle" + i, o === "show" ? "hide" : "show"), j[o]()) : j[h]()) : (k = co.exec(h), l = j.cur(), k ? (m = parseFloat(k[2]), n = k[3] || (f.cssNumber[i] ? "" : "px"), n !== "px" && (f.style(this, i, (m || 1) + n), l = (m || 1) / j.cur() * l, f.style(this, i, l + n)), k[1] && (m = (k[1] === "-=" ? -1 : 1) * m + l), j.custom(l, m, n)) : j.custom(l, h, ""));
                return !0
            }
            var e = f.speed(b, c, d);
            if (f.isEmptyObject(a)) return this.each(e.complete, [!1]);
            a = f.extend({}, a);
            return e.queue === !1 ? this.each(g) : this.queue(e.queue, g)
        },
        stop: function(a, c, d) {
            typeof a != "string" && (d = c, c = a, a = b), c && a !== !1 && this.queue(a || "fx", []);
            return this.each(function() {
                function h(a, b, c) {
                    var e = b[c];
                    f.removeData(a, c, !0), e.stop(d)
                }
                var b, c = !1,
                    e = f.timers,
                    g = f._data(this);
                d || f._unmark(!0, this);
                if (a == null)
                    for (b in g) g[b] && g[b].stop && b.indexOf(".run") === b.length - 4 && h(this, g, b);
                else g[b = a + ".run"] && g[b].stop && h(this, g, b);
                for (b = e.length; b--;) e[b].elem === this && (a == null || e[b].queue === a) && (d ? e[b](!0) : e[b].saveState(), c = !0, e.splice(b, 1));
                (!d || !c) && f.dequeue(this, a)
            })
        }
    }), f.each({
        slideDown: cu("show", 1),
        slideUp: cu("hide", 1),
        slideToggle: cu("toggle", 1),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(a, b) {
        f.fn[a] = function(a, c, d) {
            return this.animate(b, a, c, d)
        }
    }), f.extend({
        speed: function(a, b, c) {
            var d = a && typeof a == "object" ? f.extend({}, a) : {
                complete: c || !c && b || f.isFunction(a) && a,
                duration: a,
                easing: c && b || b && !f.isFunction(b) && b
            };
            d.duration = f.fx.off ? 0 : typeof d.duration == "number" ? d.duration : d.duration in f.fx.speeds ? f.fx.speeds[d.duration] : f.fx.speeds._default;
            if (d.queue == null || d.queue === !0) d.queue = "fx";
            d.old = d.complete, d.complete = function(a) {
                f.isFunction(d.old) && d.old.call(this), d.queue ? f.dequeue(this, d.queue) : a !== !1 && f._unmark(this)
            };
            return d
        },
        easing: {
            linear: function(a, b, c, d) {
                return c + d * a
            },
            swing: function(a, b, c, d) {
                return (-Math.cos(a * Math.PI) / 2 + .5) * d + c
            }
        },
        timers: [],
        fx: function(a, b, c) {
            this.options = b, this.elem = a, this.prop = c, b.orig = b.orig || {}
        }
    }), f.fx.prototype = {
        update: function() {
            this.options.step && this.options.step.call(this.elem, this.now, this), (f.fx.step[this.prop] || f.fx.step._default)(this)
        },
        cur: function() {
            if (this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null)) return this.elem[this.prop];
            var a, b = f.css(this.elem, this.prop);
            return isNaN(a = parseFloat(b)) ? !b || b === "auto" ? 0 : b : a
        },
        custom: function(a, c, d) {
            function h(a) {
                return e.step(a)
            }
            var e = this,
                g = f.fx;
            this.startTime = cr || cs(), this.end = c, this.now = this.start = a, this.pos = this.state = 0, this.unit = d || this.unit || (f.cssNumber[this.prop] ? "" : "px"), h.queue = this.options.queue, h.elem = this.elem, h.saveState = function() {
                e.options.hide && f._data(e.elem, "fxshow" + e.prop) === b && f._data(e.elem, "fxshow" + e.prop, e.start)
            }, h() && f.timers.push(h) && !cp && (cp = setInterval(g.tick, g.interval))
        },
        show: function() {
            var a = f._data(this.elem, "fxshow" + this.prop);
            this.options.orig[this.prop] = a || f.style(this.elem, this.prop), this.options.show = !0, a !== b ? this.custom(this.cur(), a) : this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur()), f(this.elem).show()
        },
        hide: function() {
            this.options.orig[this.prop] = f._data(this.elem, "fxshow" + this.prop) || f.style(this.elem, this.prop), this.options.hide = !0, this.custom(this.cur(), 0)
        },
        step: function(a) {
            var b, c, d, e = cr || cs(),
                g = !0,
                h = this.elem,
                i = this.options;
            if (a || e >= i.duration + this.startTime) {
                this.now = this.end, this.pos = this.state = 1, this.update(), i.animatedProperties[this.prop] = !0;
                for (b in i.animatedProperties) i.animatedProperties[b] !== !0 && (g = !1);
                if (g) {
                    i.overflow != null && !f.support.shrinkWrapBlocks && f.each(["", "X", "Y"], function(a, b) {
                        h.style["overflow" + b] = i.overflow[a]
                    }), i.hide && f(h).hide();
                    if (i.hide || i.show)
                        for (b in i.animatedProperties) f.style(h, b, i.orig[b]), f.removeData(h, "fxshow" + b, !0), f.removeData(h, "toggle" + b, !0);
                    d = i.complete, d && (i.complete = !1, d.call(h))
                }
                return !1
            }
            i.duration == Infinity ? this.now = e : (c = e - this.startTime, this.state = c / i.duration, this.pos = f.easing[i.animatedProperties[this.prop]](this.state, c, 0, 1, i.duration), this.now = this.start + (this.end - this.start) * this.pos), this.update();
            return !0
        }
    }, f.extend(f.fx, {
        tick: function() {
            var a, b = f.timers,
                c = 0;
            for (; c < b.length; c++) a = b[c], !a() && b[c] === a && b.splice(c--, 1);
            b.length || f.fx.stop()
        },
        interval: 13,
        stop: function() {
            clearInterval(cp), cp = null
        },
        speeds: {
            slow: 600,
            fast: 200,
            _default: 400
        },
        step: {
            opacity: function(a) {
                f.style(a.elem, "opacity", a.now)
            },
            _default: function(a) {
                a.elem.style && a.elem.style[a.prop] != null ? a.elem.style[a.prop] = a.now + a.unit : a.elem[a.prop] = a.now
            }
        }
    }), f.each(["width", "height"], function(a, b) {
        f.fx.step[b] = function(a) {
            f.style(a.elem, b, Math.max(0, a.now) + a.unit)
        }
    }), f.expr && f.expr.filters && (f.expr.filters.animated = function(a) {
        return f.grep(f.timers, function(b) {
            return a === b.elem
        }).length
    });
    var cw = /^t(?:able|d|h)$/i,
        cx = /^(?:body|html)$/i;
    "getBoundingClientRect" in c.documentElement ? f.fn.offset = function(a) {
        var b = this[0],
            c;
        if (a) return this.each(function(b) {
            f.offset.setOffset(this, a, b)
        });
        if (!b || !b.ownerDocument) return null;
        if (b === b.ownerDocument.body) return f.offset.bodyOffset(b);
        try {
            c = b.getBoundingClientRect()
        } catch (d) {}
        var e = b.ownerDocument,
            g = e.documentElement;
        if (!c || !f.contains(g, b)) return c ? {
            top: c.top,
            left: c.left
        } : {
            top: 0,
            left: 0
        };
        var h = e.body,
            i = cy(e),
            j = g.clientTop || h.clientTop || 0,
            k = g.clientLeft || h.clientLeft || 0,
            l = i.pageYOffset || f.support.boxModel && g.scrollTop || h.scrollTop,
            m = i.pageXOffset || f.support.boxModel && g.scrollLeft || h.scrollLeft,
            n = c.top + l - j,
            o = c.left + m - k;
        return {
            top: n,
            left: o
        }
    } : f.fn.offset = function(a) {
        var b = this[0];
        if (a) return this.each(function(b) {
            f.offset.setOffset(this, a, b)
        });
        if (!b || !b.ownerDocument) return null;
        if (b === b.ownerDocument.body) return f.offset.bodyOffset(b);
        var c, d = b.offsetParent,
            e = b,
            g = b.ownerDocument,
            h = g.documentElement,
            i = g.body,
            j = g.defaultView,
            k = j ? j.getComputedStyle(b, null) : b.currentStyle,
            l = b.offsetTop,
            m = b.offsetLeft;
        while ((b = b.parentNode) && b !== i && b !== h) {
            if (f.support.fixedPosition && k.position === "fixed") break;
            c = j ? j.getComputedStyle(b, null) : b.currentStyle, l -= b.scrollTop, m -= b.scrollLeft, b === d && (l += b.offsetTop, m += b.offsetLeft, f.support.doesNotAddBorder && (!f.support.doesAddBorderForTableAndCells || !cw.test(b.nodeName)) && (l += parseFloat(c.borderTopWidth) || 0, m += parseFloat(c.borderLeftWidth) || 0), e = d, d = b.offsetParent), f.support.subtractsBorderForOverflowNotVisible && c.overflow !== "visible" && (l += parseFloat(c.borderTopWidth) || 0, m += parseFloat(c.borderLeftWidth) || 0), k = c
        }
        if (k.position === "relative" || k.position === "static") l += i.offsetTop, m += i.offsetLeft;
        f.support.fixedPosition && k.position === "fixed" && (l += Math.max(h.scrollTop, i.scrollTop), m += Math.max(h.scrollLeft, i.scrollLeft));
        return {
            top: l,
            left: m
        }
    }, f.offset = {
        bodyOffset: function(a) {
            var b = a.offsetTop,
                c = a.offsetLeft;
            f.support.doesNotIncludeMarginInBodyOffset && (b += parseFloat(f.css(a, "marginTop")) || 0, c += parseFloat(f.css(a, "marginLeft")) || 0);
            return {
                top: b,
                left: c
            }
        },
        setOffset: function(a, b, c) {
            var d = f.css(a, "position");
            d === "static" && (a.style.position = "relative");
            var e = f(a),
                g = e.offset(),
                h = f.css(a, "top"),
                i = f.css(a, "left"),
                j = (d === "absolute" || d === "fixed") && f.inArray("auto", [h, i]) > -1,
                k = {},
                l = {},
                m, n;
            j ? (l = e.position(), m = l.top, n = l.left) : (m = parseFloat(h) || 0, n = parseFloat(i) || 0), f.isFunction(b) && (b = b.call(a, c, g)), b.top != null && (k.top = b.top - g.top + m), b.left != null && (k.left = b.left - g.left + n), "using" in b ? b.using.call(a, k) : e.css(k)
        }
    }, f.fn.extend({
        position: function() {
            if (!this[0]) return null;
            var a = this[0],
                b = this.offsetParent(),
                c = this.offset(),
                d = cx.test(b[0].nodeName) ? {
                    top: 0,
                    left: 0
                } : b.offset();
            c.top -= parseFloat(f.css(a, "marginTop")) || 0, c.left -= parseFloat(f.css(a, "marginLeft")) || 0, d.top += parseFloat(f.css(b[0], "borderTopWidth")) || 0, d.left += parseFloat(f.css(b[0], "borderLeftWidth")) || 0;
            return {
                top: c.top - d.top,
                left: c.left - d.left
            }
        },
        offsetParent: function() {
            return this.map(function() {
                var a = this.offsetParent || c.body;
                while (a && !cx.test(a.nodeName) && f.css(a, "position") === "static") a = a.offsetParent;
                return a
            })
        }
    }), f.each(["Left", "Top"], function(a, c) {
        var d = "scroll" + c;
        f.fn[d] = function(c) {
            var e, g;
            if (c === b) {
                e = this[0];
                if (!e) return null;
                g = cy(e);
                return g ? "pageXOffset" in g ? g[a ? "pageYOffset" : "pageXOffset"] : f.support.boxModel && g.document.documentElement[d] || g.document.body[d] : e[d]
            }
            return this.each(function() {
                g = cy(this), g ? g.scrollTo(a ? f(g).scrollLeft() : c, a ? c : f(g).scrollTop()) : this[d] = c
            })
        }
    }), f.each(["Height", "Width"], function(a, c) {
        var d = c.toLowerCase();
        f.fn["inner" + c] = function() {
            var a = this[0];
            return a ? a.style ? parseFloat(f.css(a, d, "padding")) : this[d]() : null
        }, f.fn["outer" + c] = function(a) {
            var b = this[0];
            return b ? b.style ? parseFloat(f.css(b, d, a ? "margin" : "border")) : this[d]() : null
        }, f.fn[d] = function(a) {
            var e = this[0];
            if (!e) return a == null ? null : this;
            if (f.isFunction(a)) return this.each(function(b) {
                var c = f(this);
                c[d](a.call(this, b, c[d]()))
            });
            if (f.isWindow(e)) {
                var g = e.document.documentElement["client" + c],
                    h = e.document.body;
                return e.document.compatMode === "CSS1Compat" && g || h && h["client" + c] || g
            }
            if (e.nodeType === 9) return Math.max(e.documentElement["client" + c], e.body["scroll" + c], e.documentElement["scroll" + c], e.body["offset" + c], e.documentElement["offset" + c]);
            if (a === b) {
                var i = f.css(e, d),
                    j = parseFloat(i);
                return f.isNumeric(j) ? j : i
            }
            return this.css(d, typeof a == "string" ? a : a + "px")
        }
    }), a.jQuery = a.$ = f, typeof define == "function" && define.amd && define.amd.jQuery && define("jquery", [], function() {
        return f
    })
})(window);
(function(e, t) {
    function i(t, n) {
        var r, i, o, u = t.nodeName.toLowerCase();
        return "area" === u ? (r = t.parentNode, i = r.name, !t.href || !i || r.nodeName.toLowerCase() !== "map" ? !1 : (o = e("img[usemap=#" + i + "]")[0], !!o && s(o))) : (/input|select|textarea|button|object/.test(u) ? !t.disabled : "a" === u ? t.href || n : n) && s(t)
    }

    function s(t) {
        return e.expr.filters.visible(t) && !e(t).parents().andSelf().filter(function() {
            return e.css(this, "visibility") === "hidden"
        }).length
    }
    var n = 0,
        r = /^ui-id-\d+$/;
    e.ui = e.ui || {};
    if (e.ui.version) return;
    e.extend(e.ui, {
            version: "1.9.2",
            keyCode: {
                BACKSPACE: 8,
                COMMA: 188,
                DELETE: 46,
                DOWN: 40,
                END: 35,
                ENTER: 13,
                ESCAPE: 27,
                HOME: 36,
                LEFT: 37,
                NUMPAD_ADD: 107,
                NUMPAD_DECIMAL: 110,
                NUMPAD_DIVIDE: 111,
                NUMPAD_ENTER: 108,
                NUMPAD_MULTIPLY: 106,
                NUMPAD_SUBTRACT: 109,
                PAGE_DOWN: 34,
                PAGE_UP: 33,
                PERIOD: 190,
                RIGHT: 39,
                SPACE: 32,
                TAB: 9,
                UP: 38
            }
        }), e.fn.extend({
            _focus: e.fn.focus,
            focus: function(t, n) {
                return typeof t == "number" ? this.each(function() {
                    var r = this;
                    setTimeout(function() {
                        e(r).focus(), n && n.call(r)
                    }, t)
                }) : this._focus.apply(this, arguments)
            },
            scrollParent: function() {
                var t;
                return e.ui.ie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position")) ? t = this.parents().filter(function() {
                    return /(relative|absolute|fixed)/.test(e.css(this, "position")) && /(auto|scroll)/.test(e.css(this, "overflow") + e.css(this, "overflow-y") + e.css(this, "overflow-x"))
                }).eq(0) : t = this.parents().filter(function() {
                    return /(auto|scroll)/.test(e.css(this, "overflow") + e.css(this, "overflow-y") + e.css(this, "overflow-x"))
                }).eq(0), /fixed/.test(this.css("position")) || !t.length ? e(document) : t
            },
            zIndex: function(n) {
                if (n !== t) return this.css("zIndex", n);
                if (this.length) {
                    var r = e(this[0]),
                        i, s;
                    while (r.length && r[0] !== document) {
                        i = r.css("position");
                        if (i === "absolute" || i === "relative" || i === "fixed") {
                            s = parseInt(r.css("zIndex"), 10);
                            if (!isNaN(s) && s !== 0) return s
                        }
                        r = r.parent()
                    }
                }
                return 0
            },
            uniqueId: function() {
                return this.each(function() {
                    this.id || (this.id = "ui-id-" + ++n)
                })
            },
            removeUniqueId: function() {
                return this.each(function() {
                    r.test(this.id) && e(this).removeAttr("id")
                })
            }
        }), e.extend(e.expr[":"], {
            data: e.expr.createPseudo ? e.expr.createPseudo(function(t) {
                return function(n) {
                    return !!e.data(n, t)
                }
            }) : function(t, n, r) {
                return !!e.data(t, r[3])
            },
            focusable: function(t) {
                return i(t, !isNaN(e.attr(t, "tabindex")))
            },
            tabbable: function(t) {
                var n = e.attr(t, "tabindex"),
                    r = isNaN(n);
                return (r || n >= 0) && i(t, !r)
            }
        }), e(function() {
            var t = document.body,
                n = t.appendChild(n = document.createElement("div"));
            n.offsetHeight, e.extend(n.style, {
                minHeight: "100px",
                height: "auto",
                padding: 0,
                borderWidth: 0
            }), e.support.minHeight = n.offsetHeight === 100, e.support.selectstart = "onselectstart" in n, t.removeChild(n).style.display = "none"
        }), e("<a>").outerWidth(1).jquery || e.each(["Width", "Height"], function(n, r) {
            function u(t, n, r, s) {
                return e.each(i, function() {
                    n -= parseFloat(e.css(t, "padding" + this)) || 0, r && (n -= parseFloat(e.css(t, "border" + this + "Width")) || 0), s && (n -= parseFloat(e.css(t, "margin" + this)) || 0)
                }), n
            }
            var i = r === "Width" ? ["Left", "Right"] : ["Top", "Bottom"],
                s = r.toLowerCase(),
                o = {
                    innerWidth: e.fn.innerWidth,
                    innerHeight: e.fn.innerHeight,
                    outerWidth: e.fn.outerWidth,
                    outerHeight: e.fn.outerHeight
                };
            e.fn["inner" + r] = function(n) {
                return n === t ? o["inner" + r].call(this) : this.each(function() {
                    e(this).css(s, u(this, n) + "px")
                })
            }, e.fn["outer" + r] = function(t, n) {
                return typeof t != "number" ? o["outer" + r].call(this, t) : this.each(function() {
                    e(this).css(s, u(this, t, !0, n) + "px")
                })
            }
        }), e("<a>").data("a-b", "a").removeData("a-b").data("a-b") && (e.fn.removeData = function(t) {
            return function(n) {
                return arguments.length ? t.call(this, e.camelCase(n)) : t.call(this)
            }
        }(e.fn.removeData)),
        function() {
            var t = /msie ([\w.]+)/.exec(navigator.userAgent.toLowerCase()) || [];
            e.ui.ie = t.length ? !0 : !1, e.ui.ie6 = parseFloat(t[1], 10) === 6
        }(), e.fn.extend({
            disableSelection: function() {
                return this.bind((e.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function(e) {
                    e.preventDefault()
                })
            },
            enableSelection: function() {
                return this.unbind(".ui-disableSelection")
            }
        }), e.extend(e.ui, {
            plugin: {
                add: function(t, n, r) {
                    var i, s = e.ui[t].prototype;
                    for (i in r) s.plugins[i] = s.plugins[i] || [], s.plugins[i].push([n, r[i]])
                },
                call: function(e, t, n) {
                    var r, i = e.plugins[t];
                    if (!i || !e.element[0].parentNode || e.element[0].parentNode.nodeType === 11) return;
                    for (r = 0; r < i.length; r++) e.options[i[r][0]] && i[r][1].apply(e.element, n)
                }
            },
            contains: e.contains,
            hasScroll: function(t, n) {
                if (e(t).css("overflow") === "hidden") return !1;
                var r = n && n === "left" ? "scrollLeft" : "scrollTop",
                    i = !1;
                return t[r] > 0 ? !0 : (t[r] = 1, i = t[r] > 0, t[r] = 0, i)
            },
            isOverAxis: function(e, t, n) {
                return e > t && e < t + n
            },
            isOver: function(t, n, r, i, s, o) {
                return e.ui.isOverAxis(t, r, s) && e.ui.isOverAxis(n, i, o)
            }
        })
})(jQuery);
(function(e, t) {
    var n = 0,
        r = Array.prototype.slice,
        i = e.cleanData;
    e.cleanData = function(t) {
        for (var n = 0, r;
            (r = t[n]) != null; n++) try {
            e(r).triggerHandler("remove")
        } catch (s) {}
        i(t)
    }, e.widget = function(t, n, r) {
        var i, s, o, u, a = t.split(".")[0];
        t = t.split(".")[1], i = a + "-" + t, r || (r = n, n = e.Widget), e.expr[":"][i.toLowerCase()] = function(t) {
            return !!e.data(t, i)
        }, e[a] = e[a] || {}, s = e[a][t], o = e[a][t] = function(e, t) {
            if (!this._createWidget) return new o(e, t);
            arguments.length && this._createWidget(e, t)
        }, e.extend(o, s, {
            version: r.version,
            _proto: e.extend({}, r),
            _childConstructors: []
        }), u = new n, u.options = e.widget.extend({}, u.options), e.each(r, function(t, i) {
            e.isFunction(i) && (r[t] = function() {
                var e = function() {
                        return n.prototype[t].apply(this, arguments)
                    },
                    r = function(e) {
                        return n.prototype[t].apply(this, e)
                    };
                return function() {
                    var t = this._super,
                        n = this._superApply,
                        s;
                    return this._super = e, this._superApply = r, s = i.apply(this, arguments), this._super = t, this._superApply = n, s
                }
            }())
        }), o.prototype = e.widget.extend(u, {
            widgetEventPrefix: s ? u.widgetEventPrefix : t
        }, r, {
            constructor: o,
            namespace: a,
            widgetName: t,
            widgetBaseClass: i,
            widgetFullName: i
        }), s ? (e.each(s._childConstructors, function(t, n) {
            var r = n.prototype;
            e.widget(r.namespace + "." + r.widgetName, o, n._proto)
        }), delete s._childConstructors) : n._childConstructors.push(o), e.widget.bridge(t, o)
    }, e.widget.extend = function(n) {
        var i = r.call(arguments, 1),
            s = 0,
            o = i.length,
            u, a;
        for (; s < o; s++)
            for (u in i[s]) a = i[s][u], i[s].hasOwnProperty(u) && a !== t && (e.isPlainObject(a) ? n[u] = e.isPlainObject(n[u]) ? e.widget.extend({}, n[u], a) : e.widget.extend({}, a) : n[u] = a);
        return n
    }, e.widget.bridge = function(n, i) {
        var s = i.prototype.widgetFullName || n;
        e.fn[n] = function(o) {
            var u = typeof o == "string",
                a = r.call(arguments, 1),
                f = this;
            return o = !u && a.length ? e.widget.extend.apply(null, [o].concat(a)) : o, u ? this.each(function() {
                var r, i = e.data(this, s);
                if (!i) return e.error("cannot call methods on " + n + " prior to initialization; " + "attempted to call method '" + o + "'");
                if (!e.isFunction(i[o]) || o.charAt(0) === "_") return e.error("no such method '" + o + "' for " + n + " widget instance");
                r = i[o].apply(i, a);
                if (r !== i && r !== t) return f = r && r.jquery ? f.pushStack(r.get()) : r, !1
            }) : this.each(function() {
                var t = e.data(this, s);
                t ? t.option(o || {})._init() : e.data(this, s, new i(o, this))
            }), f
        }
    }, e.Widget = function() {}, e.Widget._childConstructors = [], e.Widget.prototype = {
        widgetName: "widget",
        widgetEventPrefix: "",
        defaultElement: "<div>",
        options: {
            disabled: !1,
            create: null
        },
        _createWidget: function(t, r) {
            r = e(r || this.defaultElement || this)[0], this.element = e(r), this.uuid = n++, this.eventNamespace = "." + this.widgetName + this.uuid, this.options = e.widget.extend({}, this.options, this._getCreateOptions(), t), this.bindings = e(), this.hoverable = e(), this.focusable = e(), r !== this && (e.data(r, this.widgetName, this), e.data(r, this.widgetFullName, this), this._on(!0, this.element, {
                remove: function(e) {
                    e.target === r && this.destroy()
                }
            }), this.document = e(r.style ? r.ownerDocument : r.document || r), this.window = e(this.document[0].defaultView || this.document[0].parentWindow)), this._create(), this._trigger("create", null, this._getCreateEventData()), this._init()
        },
        _getCreateOptions: e.noop,
        _getCreateEventData: e.noop,
        _create: e.noop,
        _init: e.noop,
        destroy: function() {
            this._destroy(), this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(e.camelCase(this.widgetFullName)), this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled " + "ui-state-disabled"), this.bindings.unbind(this.eventNamespace), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus")
        },
        _destroy: e.noop,
        widget: function() {
            return this.element
        },
        option: function(n, r) {
            var i = n,
                s, o, u;
            if (arguments.length === 0) return e.widget.extend({}, this.options);
            if (typeof n == "string") {
                i = {}, s = n.split("."), n = s.shift();
                if (s.length) {
                    o = i[n] = e.widget.extend({}, this.options[n]);
                    for (u = 0; u < s.length - 1; u++) o[s[u]] = o[s[u]] || {}, o = o[s[u]];
                    n = s.pop();
                    if (r === t) return o[n] === t ? null : o[n];
                    o[n] = r
                } else {
                    if (r === t) return this.options[n] === t ? null : this.options[n];
                    i[n] = r
                }
            }
            return this._setOptions(i), this
        },
        _setOptions: function(e) {
            var t;
            for (t in e) this._setOption(t, e[t]);
            return this
        },
        _setOption: function(e, t) {
            return this.options[e] = t, e === "disabled" && (this.widget().toggleClass(this.widgetFullName + "-disabled ui-state-disabled", !!t).attr("aria-disabled", t), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus")), this
        },
        enable: function() {
            return this._setOption("disabled", !1)
        },
        disable: function() {
            return this._setOption("disabled", !0)
        },
        _on: function(t, n, r) {
            var i, s = this;
            typeof t != "boolean" && (r = n, n = t, t = !1), r ? (n = i = e(n), this.bindings = this.bindings.add(n)) : (r = n, n = this.element, i = this.widget()), e.each(r, function(r, o) {
                function u() {
                    if (!t && (s.options.disabled === !0 || e(this).hasClass("ui-state-disabled"))) return;
                    return (typeof o == "string" ? s[o] : o).apply(s, arguments)
                }
                typeof o != "string" && (u.guid = o.guid = o.guid || u.guid || e.guid++);
                var a = r.match(/^(\w+)\s*(.*)$/),
                    f = a[1] + s.eventNamespace,
                    l = a[2];
                l ? i.delegate(l, f, u) : n.bind(f, u)
            })
        },
        _off: function(e, t) {
            t = (t || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace, e.unbind(t).undelegate(t)
        },
        _delay: function(e, t) {
            function n() {
                return (typeof e == "string" ? r[e] : e).apply(r, arguments)
            }
            var r = this;
            return setTimeout(n, t || 0)
        },
        _hoverable: function(t) {
            this.hoverable = this.hoverable.add(t), this._on(t, {
                mouseenter: function(t) {
                    e(t.currentTarget).addClass("ui-state-hover")
                },
                mouseleave: function(t) {
                    e(t.currentTarget).removeClass("ui-state-hover")
                }
            })
        },
        _focusable: function(t) {
            this.focusable = this.focusable.add(t), this._on(t, {
                focusin: function(t) {
                    e(t.currentTarget).addClass("ui-state-focus")
                },
                focusout: function(t) {
                    e(t.currentTarget).removeClass("ui-state-focus")
                }
            })
        },
        _trigger: function(t, n, r) {
            var i, s, o = this.options[t];
            r = r || {}, n = e.Event(n), n.type = (t === this.widgetEventPrefix ? t : this.widgetEventPrefix + t).toLowerCase(), n.target = this.element[0], s = n.originalEvent;
            if (s)
                for (i in s) i in n || (n[i] = s[i]);
            return this.element.trigger(n, r), !(e.isFunction(o) && o.apply(this.element[0], [n].concat(r)) === !1 || n.isDefaultPrevented())
        }
    }, e.each({
        show: "fadeIn",
        hide: "fadeOut"
    }, function(t, n) {
        e.Widget.prototype["_" + t] = function(r, i, s) {
            typeof i == "string" && (i = {
                effect: i
            });
            var o, u = i ? i === !0 || typeof i == "number" ? n : i.effect || n : t;
            i = i || {}, typeof i == "number" && (i = {
                duration: i
            }), o = !e.isEmptyObject(i), i.complete = s, i.delay && r.delay(i.delay), o && e.effects && (e.effects.effect[u] || e.uiBackCompat !== !1 && e.effects[u]) ? r[t](i) : u !== t && r[u] ? r[u](i.duration, i.easing, s) : r.queue(function(n) {
                e(this)[t](), s && s.call(r[0]), n()
            })
        }
    }), e.uiBackCompat !== !1 && (e.Widget.prototype._getCreateOptions = function() {
        return e.metadata && e.metadata.get(this.element[0])[this.widgetName]
    })
})(jQuery);
(function(e, t) {
    var n = !1;
    e(document).mouseup(function(e) {
        n = !1
    }), e.widget("ui.mouse", {
        version: "1.9.2",
        options: {
            cancel: "input,textarea,button,select,option",
            distance: 1,
            delay: 0
        },
        _mouseInit: function() {
            var t = this;
            this.element.bind("mousedown." + this.widgetName, function(e) {
                return t._mouseDown(e)
            }).bind("click." + this.widgetName, function(n) {
                if (!0 === e.data(n.target, t.widgetName + ".preventClickEvent")) return e.removeData(n.target, t.widgetName + ".preventClickEvent"), n.stopImmediatePropagation(), !1
            }), this.started = !1
        },
        _mouseDestroy: function() {
            this.element.unbind("." + this.widgetName), this._mouseMoveDelegate && e(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate)
        },
        _mouseDown: function(t) {
            if (n) return;
            this._mouseStarted && this._mouseUp(t), this._mouseDownEvent = t;
            var r = this,
                i = t.which === 1,
                s = typeof this.options.cancel == "string" && t.target.nodeName ? e(t.target).closest(this.options.cancel).length : !1;
            if (!i || s || !this._mouseCapture(t)) return !0;
            this.mouseDelayMet = !this.options.delay, this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function() {
                r.mouseDelayMet = !0
            }, this.options.delay));
            if (this._mouseDistanceMet(t) && this._mouseDelayMet(t)) {
                this._mouseStarted = this._mouseStart(t) !== !1;
                if (!this._mouseStarted) return t.preventDefault(), !0
            }
            return !0 === e.data(t.target, this.widgetName + ".preventClickEvent") && e.removeData(t.target, this.widgetName + ".preventClickEvent"), this._mouseMoveDelegate = function(e) {
                return r._mouseMove(e)
            }, this._mouseUpDelegate = function(e) {
                return r._mouseUp(e)
            }, e(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate), t.preventDefault(), n = !0, !0
        },
        _mouseMove: function(t) {
            return !e.ui.ie || document.documentMode >= 9 || !!t.button ? this._mouseStarted ? (this._mouseDrag(t), t.preventDefault()) : (this._mouseDistanceMet(t) && this._mouseDelayMet(t) && (this._mouseStarted = this._mouseStart(this._mouseDownEvent, t) !== !1, this._mouseStarted ? this._mouseDrag(t) : this._mouseUp(t)), !this._mouseStarted) : this._mouseUp(t)
        },
        _mouseUp: function(t) {
            return e(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate), this._mouseStarted && (this._mouseStarted = !1, t.target === this._mouseDownEvent.target && e.data(t.target, this.widgetName + ".preventClickEvent", !0), this._mouseStop(t)), !1
        },
        _mouseDistanceMet: function(e) {
            return Math.max(Math.abs(this._mouseDownEvent.pageX - e.pageX), Math.abs(this._mouseDownEvent.pageY - e.pageY)) >= this.options.distance
        },
        _mouseDelayMet: function(e) {
            return this.mouseDelayMet
        },
        _mouseStart: function(e) {},
        _mouseDrag: function(e) {},
        _mouseStop: function(e) {},
        _mouseCapture: function(e) {
            return !0
        }
    })
})(jQuery);
(function(e, t) {
    function h(e, t, n) {
        return [parseInt(e[0], 10) * (l.test(e[0]) ? t / 100 : 1), parseInt(e[1], 10) * (l.test(e[1]) ? n / 100 : 1)]
    }

    function p(t, n) {
        return parseInt(e.css(t, n), 10) || 0
    }
    e.ui = e.ui || {};
    var n, r = Math.max,
        i = Math.abs,
        s = Math.round,
        o = /left|center|right/,
        u = /top|center|bottom/,
        a = /[\+\-]\d+%?/,
        f = /^\w+/,
        l = /%$/,
        c = e.fn.position;
    e.position = {
            scrollbarWidth: function() {
                if (n !== t) return n;
                var r, i, s = e("<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),
                    o = s.children()[0];
                return e("body").append(s), r = o.offsetWidth, s.css("overflow", "scroll"), i = o.offsetWidth, r === i && (i = s[0].clientWidth), s.remove(), n = r - i
            },
            getScrollInfo: function(t) {
                var n = t.isWindow ? "" : t.element.css("overflow-x"),
                    r = t.isWindow ? "" : t.element.css("overflow-y"),
                    i = n === "scroll" || n === "auto" && t.width < t.element[0].scrollWidth,
                    s = r === "scroll" || r === "auto" && t.height < t.element[0].scrollHeight;
                return {
                    width: i ? e.position.scrollbarWidth() : 0,
                    height: s ? e.position.scrollbarWidth() : 0
                }
            },
            getWithinInfo: function(t) {
                var n = e(t || window),
                    r = e.isWindow(n[0]);
                return {
                    element: n,
                    isWindow: r,
                    offset: n.offset() || {
                        left: 0,
                        top: 0
                    },
                    scrollLeft: n.scrollLeft(),
                    scrollTop: n.scrollTop(),
                    width: r ? n.width() : n.outerWidth(),
                    height: r ? n.height() : n.outerHeight()
                }
            }
        }, e.fn.position = function(t) {
            if (!t || !t.of) return c.apply(this, arguments);
            t = e.extend({}, t);
            var n, l, d, v, m, g = e(t.of),
                y = e.position.getWithinInfo(t.within),
                b = e.position.getScrollInfo(y),
                w = g[0],
                E = (t.collision || "flip").split(" "),
                S = {};
            return w.nodeType === 9 ? (l = g.width(), d = g.height(), v = {
                top: 0,
                left: 0
            }) : e.isWindow(w) ? (l = g.width(), d = g.height(), v = {
                top: g.scrollTop(),
                left: g.scrollLeft()
            }) : w.preventDefault ? (t.at = "left top", l = d = 0, v = {
                top: w.pageY,
                left: w.pageX
            }) : (l = g.outerWidth(), d = g.outerHeight(), v = g.offset()), m = e.extend({}, v), e.each(["my", "at"], function() {
                var e = (t[this] || "").split(" "),
                    n, r;
                e.length === 1 && (e = o.test(e[0]) ? e.concat(["center"]) : u.test(e[0]) ? ["center"].concat(e) : ["center", "center"]), e[0] = o.test(e[0]) ? e[0] : "center", e[1] = u.test(e[1]) ? e[1] : "center", n = a.exec(e[0]), r = a.exec(e[1]), S[this] = [n ? n[0] : 0, r ? r[0] : 0], t[this] = [f.exec(e[0])[0], f.exec(e[1])[0]]
            }), E.length === 1 && (E[1] = E[0]), t.at[0] === "right" ? m.left += l : t.at[0] === "center" && (m.left += l / 2), t.at[1] === "bottom" ? m.top += d : t.at[1] === "center" && (m.top += d / 2), n = h(S.at, l, d), m.left += n[0], m.top += n[1], this.each(function() {
                var o, u, a = e(this),
                    f = a.outerWidth(),
                    c = a.outerHeight(),
                    w = p(this, "marginLeft"),
                    x = p(this, "marginTop"),
                    T = f + w + p(this, "marginRight") + b.width,
                    N = c + x + p(this, "marginBottom") + b.height,
                    C = e.extend({}, m),
                    k = h(S.my, a.outerWidth(), a.outerHeight());
                t.my[0] === "right" ? C.left -= f : t.my[0] === "center" && (C.left -= f / 2), t.my[1] === "bottom" ? C.top -= c : t.my[1] === "center" && (C.top -= c / 2), C.left += k[0], C.top += k[1], e.support.offsetFractions || (C.left = s(C.left), C.top = s(C.top)), o = {
                    marginLeft: w,
                    marginTop: x
                }, e.each(["left", "top"], function(r, i) {
                    e.ui.position[E[r]] && e.ui.position[E[r]][i](C, {
                        targetWidth: l,
                        targetHeight: d,
                        elemWidth: f,
                        elemHeight: c,
                        collisionPosition: o,
                        collisionWidth: T,
                        collisionHeight: N,
                        offset: [n[0] + k[0], n[1] + k[1]],
                        my: t.my,
                        at: t.at,
                        within: y,
                        elem: a
                    })
                }), e.fn.bgiframe && a.bgiframe(), t.using && (u = function(e) {
                    var n = v.left - C.left,
                        s = n + l - f,
                        o = v.top - C.top,
                        u = o + d - c,
                        h = {
                            target: {
                                element: g,
                                left: v.left,
                                top: v.top,
                                width: l,
                                height: d
                            },
                            element: {
                                element: a,
                                left: C.left,
                                top: C.top,
                                width: f,
                                height: c
                            },
                            horizontal: s < 0 ? "left" : n > 0 ? "right" : "center",
                            vertical: u < 0 ? "top" : o > 0 ? "bottom" : "middle"
                        };
                    l < f && i(n + s) < l && (h.horizontal = "center"), d < c && i(o + u) < d && (h.vertical = "middle"), r(i(n), i(s)) > r(i(o), i(u)) ? h.important = "horizontal" : h.important = "vertical", t.using.call(this, e, h)
                }), a.offset(e.extend(C, {
                    using: u
                }))
            })
        }, e.ui.position = {
            fit: {
                left: function(e, t) {
                    var n = t.within,
                        i = n.isWindow ? n.scrollLeft : n.offset.left,
                        s = n.width,
                        o = e.left - t.collisionPosition.marginLeft,
                        u = i - o,
                        a = o + t.collisionWidth - s - i,
                        f;
                    t.collisionWidth > s ? u > 0 && a <= 0 ? (f = e.left + u + t.collisionWidth - s - i, e.left += u - f) : a > 0 && u <= 0 ? e.left = i : u > a ? e.left = i + s - t.collisionWidth : e.left = i : u > 0 ? e.left += u : a > 0 ? e.left -= a : e.left = r(e.left - o, e.left)
                },
                top: function(e, t) {
                    var n = t.within,
                        i = n.isWindow ? n.scrollTop : n.offset.top,
                        s = t.within.height,
                        o = e.top - t.collisionPosition.marginTop,
                        u = i - o,
                        a = o + t.collisionHeight - s - i,
                        f;
                    t.collisionHeight > s ? u > 0 && a <= 0 ? (f = e.top + u + t.collisionHeight - s - i, e.top += u - f) : a > 0 && u <= 0 ? e.top = i : u > a ? e.top = i + s - t.collisionHeight : e.top = i : u > 0 ? e.top += u : a > 0 ? e.top -= a : e.top = r(e.top - o, e.top)
                }
            },
            flip: {
                left: function(e, t) {
                    var n = t.within,
                        r = n.offset.left + n.scrollLeft,
                        s = n.width,
                        o = n.isWindow ? n.scrollLeft : n.offset.left,
                        u = e.left - t.collisionPosition.marginLeft,
                        a = u - o,
                        f = u + t.collisionWidth - s - o,
                        l = t.my[0] === "left" ? -t.elemWidth : t.my[0] === "right" ? t.elemWidth : 0,
                        c = t.at[0] === "left" ? t.targetWidth : t.at[0] === "right" ? -t.targetWidth : 0,
                        h = -2 * t.offset[0],
                        p, d;
                    if (a < 0) {
                        p = e.left + l + c + h + t.collisionWidth - s - r;
                        if (p < 0 || p < i(a)) e.left += l + c + h
                    } else if (f > 0) {
                        d = e.left - t.collisionPosition.marginLeft + l + c + h - o;
                        if (d > 0 || i(d) < f) e.left += l + c + h
                    }
                },
                top: function(e, t) {
                    var n = t.within,
                        r = n.offset.top + n.scrollTop,
                        s = n.height,
                        o = n.isWindow ? n.scrollTop : n.offset.top,
                        u = e.top - t.collisionPosition.marginTop,
                        a = u - o,
                        f = u + t.collisionHeight - s - o,
                        l = t.my[1] === "top",
                        c = l ? -t.elemHeight : t.my[1] === "bottom" ? t.elemHeight : 0,
                        h = t.at[1] === "top" ? t.targetHeight : t.at[1] === "bottom" ? -t.targetHeight : 0,
                        p = -2 * t.offset[1],
                        d, v;
                    a < 0 ? (v = e.top + c + h + p + t.collisionHeight - s - r, e.top + c + h + p > a && (v < 0 || v < i(a)) && (e.top += c + h + p)) : f > 0 && (d = e.top - t.collisionPosition.marginTop + c + h + p - o, e.top + c + h + p > f && (d > 0 || i(d) < f) && (e.top += c + h + p))
                }
            },
            flipfit: {
                left: function() {
                    e.ui.position.flip.left.apply(this, arguments), e.ui.position.fit.left.apply(this, arguments)
                },
                top: function() {
                    e.ui.position.flip.top.apply(this, arguments), e.ui.position.fit.top.apply(this, arguments)
                }
            }
        },
        function() {
            var t, n, r, i, s, o = document.getElementsByTagName("body")[0],
                u = document.createElement("div");
            t = document.createElement(o ? "div" : "body"), r = {
                visibility: "hidden",
                width: 0,
                height: 0,
                border: 0,
                margin: 0,
                background: "none"
            }, o && e.extend(r, {
                position: "absolute",
                left: "-1000px",
                top: "-1000px"
            });
            for (s in r) t.style[s] = r[s];
            t.appendChild(u), n = o || document.documentElement, n.insertBefore(t, n.firstChild), u.style.cssText = "position: absolute; left: 10.7432222px;", i = e(u).offset().left, e.support.offsetFractions = i > 10 && i < 11, t.innerHTML = "", n.removeChild(t)
        }(), e.uiBackCompat !== !1 && function(e) {
            var n = e.fn.position;
            e.fn.position = function(r) {
                if (!r || !r.offset) return n.call(this, r);
                var i = r.offset.split(" "),
                    s = r.at.split(" ");
                return i.length === 1 && (i[1] = i[0]), /^\d/.test(i[0]) && (i[0] = "+" + i[0]), /^\d/.test(i[1]) && (i[1] = "+" + i[1]), s.length === 1 && (/left|center|right/.test(s[0]) ? s[1] = "center" : (s[1] = s[0], s[0] = "center")), n.call(this, e.extend(r, {
                    at: s[0] + i[0] + " " + s[1] + i[1],
                    offset: t
                }))
            }
        }(jQuery)
})(jQuery);
(function(e, t) {
    e.widget("ui.draggable", e.ui.mouse, {
        version: "1.9.2",
        widgetEventPrefix: "drag",
        options: {
            addClasses: !0,
            appendTo: "parent",
            axis: !1,
            connectToSortable: !1,
            containment: !1,
            cursor: "auto",
            cursorAt: !1,
            grid: !1,
            handle: !1,
            helper: "original",
            iframeFix: !1,
            opacity: !1,
            refreshPositions: !1,
            revert: !1,
            revertDuration: 500,
            scope: "default",
            scroll: !0,
            scrollSensitivity: 20,
            scrollSpeed: 20,
            snap: !1,
            snapMode: "both",
            snapTolerance: 20,
            stack: !1,
            zIndex: !1
        },
        _create: function() {
            this.options.helper == "original" && !/^(?:r|a|f)/.test(this.element.css("position")) && (this.element[0].style.position = "relative"), this.options.addClasses && this.element.addClass("ui-draggable"), this.options.disabled && this.element.addClass("ui-draggable-disabled"), this._mouseInit()
        },
        _destroy: function() {
            this.element.removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled"), this._mouseDestroy()
        },
        _mouseCapture: function(t) {
            var n = this.options;
            return this.helper || n.disabled || e(t.target).is(".ui-resizable-handle") ? !1 : (this.handle = this._getHandle(t), this.handle ? (e(n.iframeFix === !0 ? "iframe" : n.iframeFix).each(function() {
                e('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>').css({
                    width: this.offsetWidth + "px",
                    height: this.offsetHeight + "px",
                    position: "absolute",
                    opacity: "0.001",
                    zIndex: 1e3
                }).css(e(this).offset()).appendTo("body")
            }), !0) : !1)
        },
        _mouseStart: function(t) {
            var n = this.options;
            return this.helper = this._createHelper(t), this.helper.addClass("ui-draggable-dragging"), this._cacheHelperProportions(), e.ui.ddmanager && (e.ui.ddmanager.current = this), this._cacheMargins(), this.cssPosition = this.helper.css("position"), this.scrollParent = this.helper.scrollParent(), this.offset = this.positionAbs = this.element.offset(), this.offset = {
                top: this.offset.top - this.margins.top,
                left: this.offset.left - this.margins.left
            }, e.extend(this.offset, {
                click: {
                    left: t.pageX - this.offset.left,
                    top: t.pageY - this.offset.top
                },
                parent: this._getParentOffset(),
                relative: this._getRelativeOffset()
            }), this.originalPosition = this.position = this._generatePosition(t), this.originalPageX = t.pageX, this.originalPageY = t.pageY, n.cursorAt && this._adjustOffsetFromHelper(n.cursorAt), n.containment && this._setContainment(), this._trigger("start", t) === !1 ? (this._clear(), !1) : (this._cacheHelperProportions(), e.ui.ddmanager && !n.dropBehaviour && e.ui.ddmanager.prepareOffsets(this, t), this._mouseDrag(t, !0), e.ui.ddmanager && e.ui.ddmanager.dragStart(this, t), !0)
        },
        _mouseDrag: function(t, n) {
            this.position = this._generatePosition(t), this.positionAbs = this._convertPositionTo("absolute");
            if (!n) {
                var r = this._uiHash();
                if (this._trigger("drag", t, r) === !1) return this._mouseUp({}), !1;
                this.position = r.position
            }
            if (!this.options.axis || this.options.axis != "y") this.helper[0].style.left = this.position.left + "px";
            if (!this.options.axis || this.options.axis != "x") this.helper[0].style.top = this.position.top + "px";
            return e.ui.ddmanager && e.ui.ddmanager.drag(this, t), !1
        },
        _mouseStop: function(t) {
            var n = !1;
            e.ui.ddmanager && !this.options.dropBehaviour && (n = e.ui.ddmanager.drop(this, t)), this.dropped && (n = this.dropped, this.dropped = !1);
            var r = this.element[0],
                i = !1;
            while (r && (r = r.parentNode)) r == document && (i = !0);
            if (!i && this.options.helper === "original") return !1;
            if (this.options.revert == "invalid" && !n || this.options.revert == "valid" && n || this.options.revert === !0 || e.isFunction(this.options.revert) && this.options.revert.call(this.element, n)) {
                var s = this;
                e(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function() {
                    s._trigger("stop", t) !== !1 && s._clear()
                })
            } else this._trigger("stop", t) !== !1 && this._clear();
            return !1
        },
        _mouseUp: function(t) {
            return e("div.ui-draggable-iframeFix").each(function() {
                this.parentNode.removeChild(this)
            }), e.ui.ddmanager && e.ui.ddmanager.dragStop(this, t), e.ui.mouse.prototype._mouseUp.call(this, t)
        },
        cancel: function() {
            return this.helper.is(".ui-draggable-dragging") ? this._mouseUp({}) : this._clear(), this
        },
        _getHandle: function(t) {
            var n = !this.options.handle || !e(this.options.handle, this.element).length ? !0 : !1;
            return e(this.options.handle, this.element).find("*").andSelf().each(function() {
                this == t.target && (n = !0)
            }), n
        },
        _createHelper: function(t) {
            var n = this.options,
                r = e.isFunction(n.helper) ? e(n.helper.apply(this.element[0], [t])) : n.helper == "clone" ? this.element.clone().removeAttr("id") : this.element;
            return r.parents("body").length || r.appendTo(n.appendTo == "parent" ? this.element[0].parentNode : n.appendTo), r[0] != this.element[0] && !/(fixed|absolute)/.test(r.css("position")) && r.css("position", "absolute"), r
        },
        _adjustOffsetFromHelper: function(t) {
            typeof t == "string" && (t = t.split(" ")), e.isArray(t) && (t = {
                left: +t[0],
                top: +t[1] || 0
            }), "left" in t && (this.offset.click.left = t.left + this.margins.left), "right" in t && (this.offset.click.left = this.helperProportions.width - t.right + this.margins.left), "top" in t && (this.offset.click.top = t.top + this.margins.top), "bottom" in t && (this.offset.click.top = this.helperProportions.height - t.bottom + this.margins.top)
        },
        _getParentOffset: function() {
            this.offsetParent = this.helper.offsetParent();
            var t = this.offsetParent.offset();
            this.cssPosition == "absolute" && this.scrollParent[0] != document && e.contains(this.scrollParent[0], this.offsetParent[0]) && (t.left += this.scrollParent.scrollLeft(), t.top += this.scrollParent.scrollTop());
            if (this.offsetParent[0] == document.body || this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == "html" && e.ui.ie) t = {
                top: 0,
                left: 0
            };
            return {
                top: t.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
                left: t.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
            }
        },
        _getRelativeOffset: function() {
            if (this.cssPosition == "relative") {
                var e = this.element.position();
                return {
                    top: e.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
                    left: e.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()
                }
            }
            return {
                top: 0,
                left: 0
            }
        },
        _cacheMargins: function() {
            this.margins = {
                left: parseInt(this.element.css("marginLeft"), 10) || 0,
                top: parseInt(this.element.css("marginTop"), 10) || 0,
                right: parseInt(this.element.css("marginRight"), 10) || 0,
                bottom: parseInt(this.element.css("marginBottom"), 10) || 0
            }
        },
        _cacheHelperProportions: function() {
            this.helperProportions = {
                width: this.helper.outerWidth(),
                height: this.helper.outerHeight()
            }
        },
        _setContainment: function() {
            var t = this.options;
            t.containment == "parent" && (t.containment = this.helper[0].parentNode);
            if (t.containment == "document" || t.containment == "window") this.containment = [t.containment == "document" ? 0 : e(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left, t.containment == "document" ? 0 : e(window).scrollTop() - this.offset.relative.top - this.offset.parent.top, (t.containment == "document" ? 0 : e(window).scrollLeft()) + e(t.containment == "document" ? document : window).width() - this.helperProportions.width - this.margins.left, (t.containment == "document" ? 0 : e(window).scrollTop()) + (e(t.containment == "document" ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top];
            if (!/^(document|window|parent)$/.test(t.containment) && t.containment.constructor != Array) {
                var n = e(t.containment),
                    r = n[0];
                if (!r) return;
                var i = n.offset(),
                    s = e(r).css("overflow") != "hidden";
                this.containment = [(parseInt(e(r).css("borderLeftWidth"), 10) || 0) + (parseInt(e(r).css("paddingLeft"), 10) || 0), (parseInt(e(r).css("borderTopWidth"), 10) || 0) + (parseInt(e(r).css("paddingTop"), 10) || 0), (s ? Math.max(r.scrollWidth, r.offsetWidth) : r.offsetWidth) - (parseInt(e(r).css("borderLeftWidth"), 10) || 0) - (parseInt(e(r).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right, (s ? Math.max(r.scrollHeight, r.offsetHeight) : r.offsetHeight) - (parseInt(e(r).css("borderTopWidth"), 10) || 0) - (parseInt(e(r).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top - this.margins.bottom], this.relative_container = n
            } else t.containment.constructor == Array && (this.containment = t.containment)
        },
        _convertPositionTo: function(t, n) {
            n || (n = this.position);
            var r = t == "absolute" ? 1 : -1,
                i = this.options,
                s = this.cssPosition != "absolute" || this.scrollParent[0] != document && !!e.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent,
                o = /(html|body)/i.test(s[0].tagName);
            return {
                top: n.top + this.offset.relative.top * r + this.offset.parent.top * r - (this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : o ? 0 : s.scrollTop()) * r,
                left: n.left + this.offset.relative.left * r + this.offset.parent.left * r - (this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : o ? 0 : s.scrollLeft()) * r
            }
        },
        _generatePosition: function(t) {
            var n = this.options,
                r = this.cssPosition != "absolute" || this.scrollParent[0] != document && !!e.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent,
                i = /(html|body)/i.test(r[0].tagName),
                s = t.pageX,
                o = t.pageY;
            if (this.originalPosition) {
                var u;
                if (this.containment) {
                    if (this.relative_container) {
                        var a = this.relative_container.offset();
                        u = [this.containment[0] + a.left, this.containment[1] + a.top, this.containment[2] + a.left, this.containment[3] + a.top]
                    } else u = this.containment;
                    t.pageX - this.offset.click.left < u[0] && (s = u[0] + this.offset.click.left), t.pageY - this.offset.click.top < u[1] && (o = u[1] + this.offset.click.top), t.pageX - this.offset.click.left > u[2] && (s = u[2] + this.offset.click.left), t.pageY - this.offset.click.top > u[3] && (o = u[3] + this.offset.click.top)
                }
                if (n.grid) {
                    var f = n.grid[1] ? this.originalPageY + Math.round((o - this.originalPageY) / n.grid[1]) * n.grid[1] : this.originalPageY;
                    o = u ? f - this.offset.click.top < u[1] || f - this.offset.click.top > u[3] ? f - this.offset.click.top < u[1] ? f + n.grid[1] : f - n.grid[1] : f : f;
                    var l = n.grid[0] ? this.originalPageX + Math.round((s - this.originalPageX) / n.grid[0]) * n.grid[0] : this.originalPageX;
                    s = u ? l - this.offset.click.left < u[0] || l - this.offset.click.left > u[2] ? l - this.offset.click.left < u[0] ? l + n.grid[0] : l - n.grid[0] : l : l
                }
            }
            return {
                top: o - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + (this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : i ? 0 : r.scrollTop()),
                left: s - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + (this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : i ? 0 : r.scrollLeft())
            }
        },
        _clear: function() {
            this.helper.removeClass("ui-draggable-dragging"), this.helper[0] != this.element[0] && !this.cancelHelperRemoval && this.helper.remove(), this.helper = null, this.cancelHelperRemoval = !1
        },
        _trigger: function(t, n, r) {
            return r = r || this._uiHash(), e.ui.plugin.call(this, t, [n, r]), t == "drag" && (this.positionAbs = this._convertPositionTo("absolute")), e.Widget.prototype._trigger.call(this, t, n, r)
        },
        plugins: {},
        _uiHash: function(e) {
            return {
                helper: this.helper,
                position: this.position,
                originalPosition: this.originalPosition,
                offset: this.positionAbs
            }
        }
    }), e.ui.plugin.add("draggable", "connectToSortable", {
        start: function(t, n) {
            var r = e(this).data("draggable"),
                i = r.options,
                s = e.extend({}, n, {
                    item: r.element
                });
            r.sortables = [], e(i.connectToSortable).each(function() {
                var n = e.data(this, "sortable");
                n && !n.options.disabled && (r.sortables.push({
                    instance: n,
                    shouldRevert: n.options.revert
                }), n.refreshPositions(), n._trigger("activate", t, s))
            })
        },
        stop: function(t, n) {
            var r = e(this).data("draggable"),
                i = e.extend({}, n, {
                    item: r.element
                });
            e.each(r.sortables, function() {
                this.instance.isOver ? (this.instance.isOver = 0, r.cancelHelperRemoval = !0, this.instance.cancelHelperRemoval = !1, this.shouldRevert && (this.instance.options.revert = !0), this.instance._mouseStop(t), this.instance.options.helper = this.instance.options._helper, r.options.helper == "original" && this.instance.currentItem.css({
                    top: "auto",
                    left: "auto"
                })) : (this.instance.cancelHelperRemoval = !1, this.instance._trigger("deactivate", t, i))
            })
        },
        drag: function(t, n) {
            var r = e(this).data("draggable"),
                i = this,
                s = function(t) {
                    var n = this.offset.click.top,
                        r = this.offset.click.left,
                        i = this.positionAbs.top,
                        s = this.positionAbs.left,
                        o = t.height,
                        u = t.width,
                        a = t.top,
                        f = t.left;
                    return e.ui.isOver(i + n, s + r, a, f, o, u)
                };
            e.each(r.sortables, function(s) {
                var o = !1,
                    u = this;
                this.instance.positionAbs = r.positionAbs, this.instance.helperProportions = r.helperProportions, this.instance.offset.click = r.offset.click, this.instance._intersectsWith(this.instance.containerCache) && (o = !0, e.each(r.sortables, function() {
                    return this.instance.positionAbs = r.positionAbs, this.instance.helperProportions = r.helperProportions, this.instance.offset.click = r.offset.click, this != u && this.instance._intersectsWith(this.instance.containerCache) && e.ui.contains(u.instance.element[0], this.instance.element[0]) && (o = !1), o
                })), o ? (this.instance.isOver || (this.instance.isOver = 1, this.instance.currentItem = e(i).clone().removeAttr("id").appendTo(this.instance.element).data("sortable-item", !0), this.instance.options._helper = this.instance.options.helper, this.instance.options.helper = function() {
                    return n.helper[0]
                }, t.target = this.instance.currentItem[0], this.instance._mouseCapture(t, !0), this.instance._mouseStart(t, !0, !0), this.instance.offset.click.top = r.offset.click.top, this.instance.offset.click.left = r.offset.click.left, this.instance.offset.parent.left -= r.offset.parent.left - this.instance.offset.parent.left, this.instance.offset.parent.top -= r.offset.parent.top - this.instance.offset.parent.top, r._trigger("toSortable", t), r.dropped = this.instance.element, r.currentItem = r.element, this.instance.fromOutside = r), this.instance.currentItem && this.instance._mouseDrag(t)) : this.instance.isOver && (this.instance.isOver = 0, this.instance.cancelHelperRemoval = !0, this.instance.options.revert = !1, this.instance._trigger("out", t, this.instance._uiHash(this.instance)), this.instance._mouseStop(t, !0), this.instance.options.helper = this.instance.options._helper, this.instance.currentItem.remove(), this.instance.placeholder && this.instance.placeholder.remove(), r._trigger("fromSortable", t), r.dropped = !1)
            })
        }
    }), e.ui.plugin.add("draggable", "cursor", {
        start: function(t, n) {
            var r = e("body"),
                i = e(this).data("draggable").options;
            r.css("cursor") && (i._cursor = r.css("cursor")), r.css("cursor", i.cursor)
        },
        stop: function(t, n) {
            var r = e(this).data("draggable").options;
            r._cursor && e("body").css("cursor", r._cursor)
        }
    }), e.ui.plugin.add("draggable", "opacity", {
        start: function(t, n) {
            var r = e(n.helper),
                i = e(this).data("draggable").options;
            r.css("opacity") && (i._opacity = r.css("opacity")), r.css("opacity", i.opacity)
        },
        stop: function(t, n) {
            var r = e(this).data("draggable").options;
            r._opacity && e(n.helper).css("opacity", r._opacity)
        }
    }), e.ui.plugin.add("draggable", "scroll", {
        start: function(t, n) {
            var r = e(this).data("draggable");
            r.scrollParent[0] != document && r.scrollParent[0].tagName != "HTML" && (r.overflowOffset = r.scrollParent.offset())
        },
        drag: function(t, n) {
            var r = e(this).data("draggable"),
                i = r.options,
                s = !1;
            if (r.scrollParent[0] != document && r.scrollParent[0].tagName != "HTML") {
                if (!i.axis || i.axis != "x") r.overflowOffset.top + r.scrollParent[0].offsetHeight - t.pageY < i.scrollSensitivity ? r.scrollParent[0].scrollTop = s = r.scrollParent[0].scrollTop + i.scrollSpeed : t.pageY - r.overflowOffset.top < i.scrollSensitivity && (r.scrollParent[0].scrollTop = s = r.scrollParent[0].scrollTop - i.scrollSpeed);
                if (!i.axis || i.axis != "y") r.overflowOffset.left + r.scrollParent[0].offsetWidth - t.pageX < i.scrollSensitivity ? r.scrollParent[0].scrollLeft = s = r.scrollParent[0].scrollLeft + i.scrollSpeed : t.pageX - r.overflowOffset.left < i.scrollSensitivity && (r.scrollParent[0].scrollLeft = s = r.scrollParent[0].scrollLeft - i.scrollSpeed)
            } else {
                if (!i.axis || i.axis != "x") t.pageY - e(document).scrollTop() < i.scrollSensitivity ? s = e(document).scrollTop(e(document).scrollTop() - i.scrollSpeed) : e(window).height() - (t.pageY - e(document).scrollTop()) < i.scrollSensitivity && (s = e(document).scrollTop(e(document).scrollTop() + i.scrollSpeed));
                if (!i.axis || i.axis != "y") t.pageX - e(document).scrollLeft() < i.scrollSensitivity ? s = e(document).scrollLeft(e(document).scrollLeft() - i.scrollSpeed) : e(window).width() - (t.pageX - e(document).scrollLeft()) < i.scrollSensitivity && (s = e(document).scrollLeft(e(document).scrollLeft() + i.scrollSpeed))
            }
            s !== !1 && e.ui.ddmanager && !i.dropBehaviour && e.ui.ddmanager.prepareOffsets(r, t)
        }
    }), e.ui.plugin.add("draggable", "snap", {
        start: function(t, n) {
            var r = e(this).data("draggable"),
                i = r.options;
            r.snapElements = [], e(i.snap.constructor != String ? i.snap.items || ":data(draggable)" : i.snap).each(function() {
                var t = e(this),
                    n = t.offset();
                this != r.element[0] && r.snapElements.push({
                    item: this,
                    width: t.outerWidth(),
                    height: t.outerHeight(),
                    top: n.top,
                    left: n.left
                })
            })
        },
        drag: function(t, n) {
            var r = e(this).data("draggable"),
                i = r.options,
                s = i.snapTolerance,
                o = n.offset.left,
                u = o + r.helperProportions.width,
                a = n.offset.top,
                f = a + r.helperProportions.height;
            for (var l = r.snapElements.length - 1; l >= 0; l--) {
                var c = r.snapElements[l].left,
                    h = c + r.snapElements[l].width,
                    p = r.snapElements[l].top,
                    d = p + r.snapElements[l].height;
                if (!(c - s < o && o < h + s && p - s < a && a < d + s || c - s < o && o < h + s && p - s < f && f < d + s || c - s < u && u < h + s && p - s < a && a < d + s || c - s < u && u < h + s && p - s < f && f < d + s)) {
                    r.snapElements[l].snapping && r.options.snap.release && r.options.snap.release.call(r.element, t, e.extend(r._uiHash(), {
                        snapItem: r.snapElements[l].item
                    })), r.snapElements[l].snapping = !1;
                    continue
                }
                if (i.snapMode != "inner") {
                    var v = Math.abs(p - f) <= s,
                        m = Math.abs(d - a) <= s,
                        g = Math.abs(c - u) <= s,
                        y = Math.abs(h - o) <= s;
                    v && (n.position.top = r._convertPositionTo("relative", {
                        top: p - r.helperProportions.height,
                        left: 0
                    }).top - r.margins.top), m && (n.position.top = r._convertPositionTo("relative", {
                        top: d,
                        left: 0
                    }).top - r.margins.top), g && (n.position.left = r._convertPositionTo("relative", {
                        top: 0,
                        left: c - r.helperProportions.width
                    }).left - r.margins.left), y && (n.position.left = r._convertPositionTo("relative", {
                        top: 0,
                        left: h
                    }).left - r.margins.left)
                }
                var b = v || m || g || y;
                if (i.snapMode != "outer") {
                    var v = Math.abs(p - a) <= s,
                        m = Math.abs(d - f) <= s,
                        g = Math.abs(c - o) <= s,
                        y = Math.abs(h - u) <= s;
                    v && (n.position.top = r._convertPositionTo("relative", {
                        top: p,
                        left: 0
                    }).top - r.margins.top), m && (n.position.top = r._convertPositionTo("relative", {
                        top: d - r.helperProportions.height,
                        left: 0
                    }).top - r.margins.top), g && (n.position.left = r._convertPositionTo("relative", {
                        top: 0,
                        left: c
                    }).left - r.margins.left), y && (n.position.left = r._convertPositionTo("relative", {
                        top: 0,
                        left: h - r.helperProportions.width
                    }).left - r.margins.left)
                }!r.snapElements[l].snapping && (v || m || g || y || b) && r.options.snap.snap && r.options.snap.snap.call(r.element, t, e.extend(r._uiHash(), {
                    snapItem: r.snapElements[l].item
                })), r.snapElements[l].snapping = v || m || g || y || b
            }
        }
    }), e.ui.plugin.add("draggable", "stack", {
        start: function(t, n) {
            var r = e(this).data("draggable").options,
                i = e.makeArray(e(r.stack)).sort(function(t, n) {
                    return (parseInt(e(t).css("zIndex"), 10) || 0) - (parseInt(e(n).css("zIndex"), 10) || 0)
                });
            if (!i.length) return;
            var s = parseInt(i[0].style.zIndex) || 0;
            e(i).each(function(e) {
                this.style.zIndex = s + e
            }), this[0].style.zIndex = s + i.length
        }
    }), e.ui.plugin.add("draggable", "zIndex", {
        start: function(t, n) {
            var r = e(n.helper),
                i = e(this).data("draggable").options;
            r.css("zIndex") && (i._zIndex = r.css("zIndex")), r.css("zIndex", i.zIndex)
        },
        stop: function(t, n) {
            var r = e(this).data("draggable").options;
            r._zIndex && e(n.helper).css("zIndex", r._zIndex)
        }
    })
})(jQuery);
(function(e, t) {
    e.widget("ui.resizable", e.ui.mouse, {
        version: "1.9.2",
        widgetEventPrefix: "resize",
        options: {
            alsoResize: !1,
            animate: !1,
            animateDuration: "slow",
            animateEasing: "swing",
            aspectRatio: !1,
            autoHide: !1,
            containment: !1,
            ghost: !1,
            grid: !1,
            handles: "e,s,se",
            helper: !1,
            maxHeight: null,
            maxWidth: null,
            minHeight: 10,
            minWidth: 10,
            zIndex: 1e3
        },
        _create: function() {
            var t = this,
                n = this.options;
            this.element.addClass("ui-resizable"), e.extend(this, {
                _aspectRatio: !!n.aspectRatio,
                aspectRatio: n.aspectRatio,
                originalElement: this.element,
                _proportionallyResizeElements: [],
                _helper: n.helper || n.ghost || n.animate ? n.helper || "ui-resizable-helper" : null
            }), this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i) && (this.element.wrap(e('<div class="ui-wrapper" style="overflow: hidden;"></div>').css({
                position: this.element.css("position"),
                width: this.element.outerWidth(),
                height: this.element.outerHeight(),
                top: this.element.css("top"),
                left: this.element.css("left")
            })), this.element = this.element.parent().data("resizable", this.element.data("resizable")), this.elementIsWrapper = !0, this.element.css({
                marginLeft: this.originalElement.css("marginLeft"),
                marginTop: this.originalElement.css("marginTop"),
                marginRight: this.originalElement.css("marginRight"),
                marginBottom: this.originalElement.css("marginBottom")
            }), this.originalElement.css({
                marginLeft: 0,
                marginTop: 0,
                marginRight: 0,
                marginBottom: 0
            }), this.originalResizeStyle = this.originalElement.css("resize"), this.originalElement.css("resize", "none"), this._proportionallyResizeElements.push(this.originalElement.css({
                position: "static",
                zoom: 1,
                display: "block"
            })), this.originalElement.css({
                margin: this.originalElement.css("margin")
            }), this._proportionallyResize()), this.handles = n.handles || (e(".ui-resizable-handle", this.element).length ? {
                n: ".ui-resizable-n",
                e: ".ui-resizable-e",
                s: ".ui-resizable-s",
                w: ".ui-resizable-w",
                se: ".ui-resizable-se",
                sw: ".ui-resizable-sw",
                ne: ".ui-resizable-ne",
                nw: ".ui-resizable-nw"
            } : "e,s,se");
            if (this.handles.constructor == String) {
                this.handles == "all" && (this.handles = "n,e,s,w,se,sw,ne,nw");
                var r = this.handles.split(",");
                this.handles = {};
                for (var i = 0; i < r.length; i++) {
                    var s = e.trim(r[i]),
                        o = "ui-resizable-" + s,
                        u = e('<div class="ui-resizable-handle ' + o + '"></div>');
                    u.css({
                        zIndex: n.zIndex
                    }), "se" == s && u.addClass("ui-icon ui-icon-gripsmall-diagonal-se"), this.handles[s] = ".ui-resizable-" + s, this.element.append(u)
                }
            }
            this._renderAxis = function(t) {
                t = t || this.element;
                for (var n in this.handles) {
                    this.handles[n].constructor == String && (this.handles[n] = e(this.handles[n], this.element).show());
                    if (this.elementIsWrapper && this.originalElement[0].nodeName.match(/textarea|input|select|button/i)) {
                        var r = e(this.handles[n], this.element),
                            i = 0;
                        i = /sw|ne|nw|se|n|s/.test(n) ? r.outerHeight() : r.outerWidth();
                        var s = ["padding", /ne|nw|n/.test(n) ? "Top" : /se|sw|s/.test(n) ? "Bottom" : /^e$/.test(n) ? "Right" : "Left"].join("");
                        t.css(s, i), this._proportionallyResize()
                    }
                    if (!e(this.handles[n]).length) continue
                }
            }, this._renderAxis(this.element), this._handles = e(".ui-resizable-handle", this.element).disableSelection(), this._handles.mouseover(function() {
                if (!t.resizing) {
                    if (this.className) var e = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);
                    t.axis = e && e[1] ? e[1] : "se"
                }
            }), n.autoHide && (this._handles.hide(), e(this.element).addClass("ui-resizable-autohide").mouseenter(function() {
                if (n.disabled) return;
                e(this).removeClass("ui-resizable-autohide"), t._handles.show()
            }).mouseleave(function() {
                if (n.disabled) return;
                t.resizing || (e(this).addClass("ui-resizable-autohide"), t._handles.hide())
            })), this._mouseInit()
        },
        _destroy: function() {
            this._mouseDestroy();
            var t = function(t) {
                e(t).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing").removeData("resizable").removeData("ui-resizable").unbind(".resizable").find(".ui-resizable-handle").remove()
            };
            if (this.elementIsWrapper) {
                t(this.element);
                var n = this.element;
                this.originalElement.css({
                    position: n.css("position"),
                    width: n.outerWidth(),
                    height: n.outerHeight(),
                    top: n.css("top"),
                    left: n.css("left")
                }).insertAfter(n), n.remove()
            }
            return this.originalElement.css("resize", this.originalResizeStyle), t(this.originalElement), this
        },
        _mouseCapture: function(t) {
            var n = !1;
            for (var r in this.handles) e(this.handles[r])[0] == t.target && (n = !0);
            return !this.options.disabled && n
        },
        _mouseStart: function(t) {
            var r = this.options,
                i = this.element.position(),
                s = this.element;
            this.resizing = !0, this.documentScroll = {
                top: e(document).scrollTop(),
                left: e(document).scrollLeft()
            }, (s.is(".ui-draggable") || /absolute/.test(s.css("position"))) && s.css({
                position: "absolute",
                top: i.top,
                left: i.left
            }), this._renderProxy();
            var o = n(this.helper.css("left")),
                u = n(this.helper.css("top"));
            r.containment && (o += e(r.containment).scrollLeft() || 0, u += e(r.containment).scrollTop() || 0), this.offset = this.helper.offset(), this.position = {
                left: o,
                top: u
            }, this.size = this._helper ? {
                width: s.outerWidth(),
                height: s.outerHeight()
            } : {
                width: s.width(),
                height: s.height()
            }, this.originalSize = this._helper ? {
                width: s.outerWidth(),
                height: s.outerHeight()
            } : {
                width: s.width(),
                height: s.height()
            }, this.originalPosition = {
                left: o,
                top: u
            }, this.sizeDiff = {
                width: s.outerWidth() - s.width(),
                height: s.outerHeight() - s.height()
            }, this.originalMousePosition = {
                left: t.pageX,
                top: t.pageY
            }, this.aspectRatio = typeof r.aspectRatio == "number" ? r.aspectRatio : this.originalSize.width / this.originalSize.height || 1;
            var a = e(".ui-resizable-" + this.axis).css("cursor");
            return e("body").css("cursor", a == "auto" ? this.axis + "-resize" : a), s.addClass("ui-resizable-resizing"), this._propagate("start", t), !0
        },
        _mouseDrag: function(e) {
            var t = this.helper,
                n = this.options,
                r = {},
                i = this,
                s = this.originalMousePosition,
                o = this.axis,
                u = e.pageX - s.left || 0,
                a = e.pageY - s.top || 0,
                f = this._change[o];
            if (!f) return !1;
            var l = f.apply(this, [e, u, a]);
            this._updateVirtualBoundaries(e.shiftKey);
            if (this._aspectRatio || e.shiftKey) l = this._updateRatio(l, e);
            return l = this._respectSize(l, e), this._propagate("resize", e), t.css({
                top: this.position.top + "px",
                left: this.position.left + "px",
                width: this.size.width + "px",
                height: this.size.height + "px"
            }), !this._helper && this._proportionallyResizeElements.length && this._proportionallyResize(), this._updateCache(l), this._trigger("resize", e, this.ui()), !1
        },
        _mouseStop: function(t) {
            this.resizing = !1;
            var n = this.options,
                r = this;
            if (this._helper) {
                var i = this._proportionallyResizeElements,
                    s = i.length && /textarea/i.test(i[0].nodeName),
                    o = s && e.ui.hasScroll(i[0], "left") ? 0 : r.sizeDiff.height,
                    u = s ? 0 : r.sizeDiff.width,
                    a = {
                        width: r.helper.width() - u,
                        height: r.helper.height() - o
                    },
                    f = parseInt(r.element.css("left"), 10) + (r.position.left - r.originalPosition.left) || null,
                    l = parseInt(r.element.css("top"), 10) + (r.position.top - r.originalPosition.top) || null;
                n.animate || this.element.css(e.extend(a, {
                    top: l,
                    left: f
                })), r.helper.height(r.size.height), r.helper.width(r.size.width), this._helper && !n.animate && this._proportionallyResize()
            }
            return e("body").css("cursor", "auto"), this.element.removeClass("ui-resizable-resizing"), this._propagate("stop", t), this._helper && this.helper.remove(), !1
        },
        _updateVirtualBoundaries: function(e) {
            var t = this.options,
                n, i, s, o, u;
            u = {
                minWidth: r(t.minWidth) ? t.minWidth : 0,
                maxWidth: r(t.maxWidth) ? t.maxWidth : Infinity,
                minHeight: r(t.minHeight) ? t.minHeight : 0,
                maxHeight: r(t.maxHeight) ? t.maxHeight : Infinity
            };
            if (this._aspectRatio || e) n = u.minHeight * this.aspectRatio, s = u.minWidth / this.aspectRatio, i = u.maxHeight * this.aspectRatio, o = u.maxWidth / this.aspectRatio, n > u.minWidth && (u.minWidth = n), s > u.minHeight && (u.minHeight = s), i < u.maxWidth && (u.maxWidth = i), o < u.maxHeight && (u.maxHeight = o);
            this._vBoundaries = u
        },
        _updateCache: function(e) {
            var t = this.options;
            this.offset = this.helper.offset(), r(e.left) && (this.position.left = e.left), r(e.top) && (this.position.top = e.top), r(e.height) && (this.size.height = e.height), r(e.width) && (this.size.width = e.width)
        },
        _updateRatio: function(e, t) {
            var n = this.options,
                i = this.position,
                s = this.size,
                o = this.axis;
            return r(e.height) ? e.width = e.height * this.aspectRatio : r(e.width) && (e.height = e.width / this.aspectRatio), o == "sw" && (e.left = i.left + (s.width - e.width), e.top = null), o == "nw" && (e.top = i.top + (s.height - e.height), e.left = i.left + (s.width - e.width)), e
        },
        _respectSize: function(e, t) {
            var n = this.helper,
                i = this._vBoundaries,
                s = this._aspectRatio || t.shiftKey,
                o = this.axis,
                u = r(e.width) && i.maxWidth && i.maxWidth < e.width,
                a = r(e.height) && i.maxHeight && i.maxHeight < e.height,
                f = r(e.width) && i.minWidth && i.minWidth > e.width,
                l = r(e.height) && i.minHeight && i.minHeight > e.height;
            f && (e.width = i.minWidth), l && (e.height = i.minHeight), u && (e.width = i.maxWidth), a && (e.height = i.maxHeight);
            var c = this.originalPosition.left + this.originalSize.width,
                h = this.position.top + this.size.height,
                p = /sw|nw|w/.test(o),
                d = /nw|ne|n/.test(o);
            f && p && (e.left = c - i.minWidth), u && p && (e.left = c - i.maxWidth), l && d && (e.top = h - i.minHeight), a && d && (e.top = h - i.maxHeight);
            var v = !e.width && !e.height;
            return v && !e.left && e.top ? e.top = null : v && !e.top && e.left && (e.left = null), e
        },
        _proportionallyResize: function() {
            var t = this.options;
            if (!this._proportionallyResizeElements.length) return;
            var n = this.helper || this.element;
            for (var r = 0; r < this._proportionallyResizeElements.length; r++) {
                var i = this._proportionallyResizeElements[r];
                if (!this.borderDif) {
                    var s = [i.css("borderTopWidth"), i.css("borderRightWidth"), i.css("borderBottomWidth"), i.css("borderLeftWidth")],
                        o = [i.css("paddingTop"), i.css("paddingRight"), i.css("paddingBottom"), i.css("paddingLeft")];
                    this.borderDif = e.map(s, function(e, t) {
                        var n = parseInt(e, 10) || 0,
                            r = parseInt(o[t], 10) || 0;
                        return n + r
                    })
                }
                i.css({
                    height: n.height() - this.borderDif[0] - this.borderDif[2] || 0,
                    width: n.width() - this.borderDif[1] - this.borderDif[3] || 0
                })
            }
        },
        _renderProxy: function() {
            var t = this.element,
                n = this.options;
            this.elementOffset = t.offset();
            if (this._helper) {
                this.helper = this.helper || e('<div style="overflow:hidden;"></div>');
                var r = e.ui.ie6 ? 1 : 0,
                    i = e.ui.ie6 ? 2 : -1;
                this.helper.addClass(this._helper).css({
                    width: this.element.outerWidth() + i,
                    height: this.element.outerHeight() + i,
                    position: "absolute",
                    left: this.elementOffset.left - r + "px",
                    top: this.elementOffset.top - r + "px",
                    zIndex: ++n.zIndex
                }), this.helper.appendTo("body").disableSelection()
            } else this.helper = this.element
        },
        _change: {
            e: function(e, t, n) {
                return {
                    width: this.originalSize.width + t
                }
            },
            w: function(e, t, n) {
                var r = this.options,
                    i = this.originalSize,
                    s = this.originalPosition;
                return {
                    left: s.left + t,
                    width: i.width - t
                }
            },
            n: function(e, t, n) {
                var r = this.options,
                    i = this.originalSize,
                    s = this.originalPosition;
                return {
                    top: s.top + n,
                    height: i.height - n
                }
            },
            s: function(e, t, n) {
                return {
                    height: this.originalSize.height + n
                }
            },
            se: function(t, n, r) {
                return e.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [t, n, r]))
            },
            sw: function(t, n, r) {
                return e.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [t, n, r]))
            },
            ne: function(t, n, r) {
                return e.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [t, n, r]))
            },
            nw: function(t, n, r) {
                return e.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [t, n, r]))
            }
        },
        _propagate: function(t, n) {
            e.ui.plugin.call(this, t, [n, this.ui()]), t != "resize" && this._trigger(t, n, this.ui())
        },
        plugins: {},
        ui: function() {
            return {
                originalElement: this.originalElement,
                element: this.element,
                helper: this.helper,
                position: this.position,
                size: this.size,
                originalSize: this.originalSize,
                originalPosition: this.originalPosition
            }
        }
    }), e.ui.plugin.add("resizable", "alsoResize", {
        start: function(t, n) {
            var r = e(this).data("resizable"),
                i = r.options,
                s = function(t) {
                    e(t).each(function() {
                        var t = e(this);
                        t.data("resizable-alsoresize", {
                            width: parseInt(t.width(), 10),
                            height: parseInt(t.height(), 10),
                            left: parseInt(t.css("left"), 10),
                            top: parseInt(t.css("top"), 10)
                        })
                    })
                };
            typeof i.alsoResize == "object" && !i.alsoResize.parentNode ? i.alsoResize.length ? (i.alsoResize = i.alsoResize[0], s(i.alsoResize)) : e.each(i.alsoResize, function(e) {
                s(e)
            }) : s(i.alsoResize)
        },
        resize: function(t, n) {
            var r = e(this).data("resizable"),
                i = r.options,
                s = r.originalSize,
                o = r.originalPosition,
                u = {
                    height: r.size.height - s.height || 0,
                    width: r.size.width - s.width || 0,
                    top: r.position.top - o.top || 0,
                    left: r.position.left - o.left || 0
                },
                a = function(t, r) {
                    e(t).each(function() {
                        var t = e(this),
                            i = e(this).data("resizable-alsoresize"),
                            s = {},
                            o = r && r.length ? r : t.parents(n.originalElement[0]).length ? ["width", "height"] : ["width", "height", "top", "left"];
                        e.each(o, function(e, t) {
                            var n = (i[t] || 0) + (u[t] || 0);
                            n && n >= 0 && (s[t] = n || null)
                        }), t.css(s)
                    })
                };
            typeof i.alsoResize == "object" && !i.alsoResize.nodeType ? e.each(i.alsoResize, function(e, t) {
                a(e, t)
            }) : a(i.alsoResize)
        },
        stop: function(t, n) {
            e(this).removeData("resizable-alsoresize")
        }
    }), e.ui.plugin.add("resizable", "animate", {
        stop: function(t, n) {
            var r = e(this).data("resizable"),
                i = r.options,
                s = r._proportionallyResizeElements,
                o = s.length && /textarea/i.test(s[0].nodeName),
                u = o && e.ui.hasScroll(s[0], "left") ? 0 : r.sizeDiff.height,
                a = o ? 0 : r.sizeDiff.width,
                f = {
                    width: r.size.width - a,
                    height: r.size.height - u
                },
                l = parseInt(r.element.css("left"), 10) + (r.position.left - r.originalPosition.left) || null,
                c = parseInt(r.element.css("top"), 10) + (r.position.top - r.originalPosition.top) || null;
            r.element.animate(e.extend(f, c && l ? {
                top: c,
                left: l
            } : {}), {
                duration: i.animateDuration,
                easing: i.animateEasing,
                step: function() {
                    var n = {
                        width: parseInt(r.element.css("width"), 10),
                        height: parseInt(r.element.css("height"), 10),
                        top: parseInt(r.element.css("top"), 10),
                        left: parseInt(r.element.css("left"), 10)
                    };
                    s && s.length && e(s[0]).css({
                        width: n.width,
                        height: n.height
                    }), r._updateCache(n), r._propagate("resize", t)
                }
            })
        }
    }), e.ui.plugin.add("resizable", "containment", {
        start: function(t, r) {
            var i = e(this).data("resizable"),
                s = i.options,
                o = i.element,
                u = s.containment,
                a = u instanceof e ? u.get(0) : /parent/.test(u) ? o.parent().get(0) : u;
            if (!a) return;
            i.containerElement = e(a);
            if (/document/.test(u) || u == document) i.containerOffset = {
                left: 0,
                top: 0
            }, i.containerPosition = {
                left: 0,
                top: 0
            }, i.parentData = {
                element: e(document),
                left: 0,
                top: 0,
                width: e(document).width(),
                height: e(document).height() || document.body.parentNode.scrollHeight
            };
            else {
                var f = e(a),
                    l = [];
                e(["Top", "Right", "Left", "Bottom"]).each(function(e, t) {
                    l[e] = n(f.css("padding" + t))
                }), i.containerOffset = f.offset(), i.containerPosition = f.position(), i.containerSize = {
                    height: f.innerHeight() - l[3],
                    width: f.innerWidth() - l[1]
                };
                var c = i.containerOffset,
                    h = i.containerSize.height,
                    p = i.containerSize.width,
                    d = e.ui.hasScroll(a, "left") ? a.scrollWidth : p,
                    v = e.ui.hasScroll(a) ? a.scrollHeight : h;
                i.parentData = {
                    element: a,
                    left: c.left,
                    top: c.top,
                    width: d,
                    height: v
                }
            }
        },
        resize: function(t, n) {
            var r = e(this).data("resizable"),
                i = r.options,
                s = r.containerSize,
                o = r.containerOffset,
                u = r.size,
                a = r.position,
                f = r._aspectRatio || t.shiftKey,
                l = {
                    top: 0,
                    left: 0
                },
                c = r.containerElement;
            c[0] != document && /static/.test(c.css("position")) && (l = o), a.left < (r._helper ? o.left : 0) && (r.size.width = r.size.width + (r._helper ? r.position.left - o.left : r.position.left - l.left), f && (r.size.height = r.size.width / r.aspectRatio), r.position.left = i.helper ? o.left : 0), a.top < (r._helper ? o.top : 0) && (r.size.height = r.size.height + (r._helper ? r.position.top - o.top : r.position.top), f && (r.size.width = r.size.height * r.aspectRatio), r.position.top = r._helper ? o.top : 0), r.offset.left = r.parentData.left + r.position.left, r.offset.top = r.parentData.top + r.position.top;
            var h = Math.abs((r._helper ? r.offset.left - l.left : r.offset.left - l.left) + r.sizeDiff.width),
                p = Math.abs((r._helper ? r.offset.top - l.top : r.offset.top - o.top) + r.sizeDiff.height),
                d = r.containerElement.get(0) == r.element.parent().get(0),
                v = /relative|absolute/.test(r.containerElement.css("position"));
            d && v && (h -= r.parentData.left), h + r.size.width >= r.parentData.width && (r.size.width = r.parentData.width - h, f && (r.size.height = r.size.width / r.aspectRatio)), p + r.size.height >= r.parentData.height && (r.size.height = r.parentData.height - p, f && (r.size.width = r.size.height * r.aspectRatio))
        },
        stop: function(t, n) {
            var r = e(this).data("resizable"),
                i = r.options,
                s = r.position,
                o = r.containerOffset,
                u = r.containerPosition,
                a = r.containerElement,
                f = e(r.helper),
                l = f.offset(),
                c = f.outerWidth() - r.sizeDiff.width,
                h = f.outerHeight() - r.sizeDiff.height;
            r._helper && !i.animate && /relative/.test(a.css("position")) && e(this).css({
                left: l.left - u.left - o.left,
                width: c,
                height: h
            }), r._helper && !i.animate && /static/.test(a.css("position")) && e(this).css({
                left: l.left - u.left - o.left,
                width: c,
                height: h
            })
        }
    }), e.ui.plugin.add("resizable", "ghost", {
        start: function(t, n) {
            var r = e(this).data("resizable"),
                i = r.options,
                s = r.size;
            r.ghost = r.originalElement.clone(), r.ghost.css({
                opacity: .25,
                display: "block",
                position: "relative",
                height: s.height,
                width: s.width,
                margin: 0,
                left: 0,
                top: 0
            }).addClass("ui-resizable-ghost").addClass(typeof i.ghost == "string" ? i.ghost : ""), r.ghost.appendTo(r.helper)
        },
        resize: function(t, n) {
            var r = e(this).data("resizable"),
                i = r.options;
            r.ghost && r.ghost.css({
                position: "relative",
                height: r.size.height,
                width: r.size.width
            })
        },
        stop: function(t, n) {
            var r = e(this).data("resizable"),
                i = r.options;
            r.ghost && r.helper && r.helper.get(0).removeChild(r.ghost.get(0))
        }
    }), e.ui.plugin.add("resizable", "grid", {
        resize: function(t, n) {
            var r = e(this).data("resizable"),
                i = r.options,
                s = r.size,
                o = r.originalSize,
                u = r.originalPosition,
                a = r.axis,
                f = i._aspectRatio || t.shiftKey;
            i.grid = typeof i.grid == "number" ? [i.grid, i.grid] : i.grid;
            var l = Math.round((s.width - o.width) / (i.grid[0] || 1)) * (i.grid[0] || 1),
                c = Math.round((s.height - o.height) / (i.grid[1] || 1)) * (i.grid[1] || 1);
            /^(se|s|e)$/.test(a) ? (r.size.width = o.width + l, r.size.height = o.height + c) : /^(ne)$/.test(a) ? (r.size.width = o.width + l, r.size.height = o.height + c, r.position.top = u.top - c) : /^(sw)$/.test(a) ? (r.size.width = o.width + l, r.size.height = o.height + c, r.position.left = u.left - l) : (r.size.width = o.width + l, r.size.height = o.height + c, r.position.top = u.top - c, r.position.left = u.left - l)
        }
    });
    var n = function(e) {
            return parseInt(e, 10) || 0
        },
        r = function(e) {
            return !isNaN(parseInt(e, 10))
        }
})(jQuery);
(function(e, t) {
    var n = 0;
    e.widget("ui.autocomplete", {
        version: "1.9.2",
        defaultElement: "<input>",
        options: {
            appendTo: "body",
            autoFocus: !1,
            delay: 300,
            minLength: 1,
            position: {
                my: "left top",
                at: "left bottom",
                collision: "none"
            },
            source: null,
            change: null,
            close: null,
            focus: null,
            open: null,
            response: null,
            search: null,
            select: null
        },
        pending: 0,
        _create: function() {
            var t, n, r;
            this.isMultiLine = this._isMultiLine(), this.valueMethod = this.element[this.element.is("input,textarea") ? "val" : "text"], this.isNewMenu = !0, this.element.addClass("ui-autocomplete-input").attr("autocomplete", "off"), this._on(this.element, {
                keydown: function(i) {
                    if (this.element.prop("readOnly")) {
                        t = !0, r = !0, n = !0;
                        return
                    }
                    t = !1, r = !1, n = !1;
                    var s = e.ui.keyCode;
                    switch (i.keyCode) {
                        case s.PAGE_UP:
                            t = !0, this._move("previousPage", i);
                            break;
                        case s.PAGE_DOWN:
                            t = !0, this._move("nextPage", i);
                            break;
                        case s.UP:
                            t = !0, this._keyEvent("previous", i);
                            break;
                        case s.DOWN:
                            t = !0, this._keyEvent("next", i);
                            break;
                        case s.ENTER:
                        case s.NUMPAD_ENTER:
                            this.menu.active && (t = !0, i.preventDefault(), this.menu.select(i));
                            break;
                        case s.TAB:
                            this.menu.active && this.menu.select(i);
                            break;
                        case s.ESCAPE:
                            this.menu.element.is(":visible") && (this._value(this.term), this.close(i), i.preventDefault());
                            break;
                        default:
                            n = !0, this._searchTimeout(i)
                    }
                },
                keypress: function(r) {
                    if (t) {
                        t = !1, r.preventDefault();
                        return
                    }
                    if (n) return;
                    var i = e.ui.keyCode;
                    switch (r.keyCode) {
                        case i.PAGE_UP:
                            this._move("previousPage", r);
                            break;
                        case i.PAGE_DOWN:
                            this._move("nextPage", r);
                            break;
                        case i.UP:
                            this._keyEvent("previous", r);
                            break;
                        case i.DOWN:
                            this._keyEvent("next", r)
                    }
                },
                input: function(e) {
                    if (r) {
                        r = !1, e.preventDefault();
                        return
                    }
                    this._searchTimeout(e)
                },
                focus: function() {
                    this.selectedItem = null, this.previous = this._value()
                },
                blur: function(e) {
                    if (this.cancelBlur) {
                        delete this.cancelBlur;
                        return
                    }
                    clearTimeout(this.searching), this.close(e), this._change(e)
                }
            }), this._initSource(), this.menu = e("<ul>").addClass("ui-autocomplete").appendTo(this.document.find(this.options.appendTo || "body")[0]).menu({
                input: e(),
                role: null
            }).zIndex(this.element.zIndex() + 1).hide().data("menu"), this._on(this.menu.element, {
                mousedown: function(t) {
                    t.preventDefault(), this.cancelBlur = !0, this._delay(function() {
                        delete this.cancelBlur
                    });
                    var n = this.menu.element[0];
                    e(t.target).closest(".ui-menu-item").length || this._delay(function() {
                        var t = this;
                        this.document.one("mousedown", function(r) {
                            r.target !== t.element[0] && r.target !== n && !e.contains(n, r.target) && t.close()
                        })
                    })
                },
                menufocus: function(t, n) {
                    if (this.isNewMenu) {
                        this.isNewMenu = !1;
                        if (t.originalEvent && /^mouse/.test(t.originalEvent.type)) {
                            this.menu.blur(), this.document.one("mousemove", function() {
                                e(t.target).trigger(t.originalEvent)
                            });
                            return
                        }
                    }
                    var r = n.item.data("ui-autocomplete-item") || n.item.data("item.autocomplete");
                    !1 !== this._trigger("focus", t, {
                        item: r
                    }) ? t.originalEvent && /^key/.test(t.originalEvent.type) && this._value(r.value) : this.liveRegion.text(r.value)
                },
                menuselect: function(e, t) {
                    var n = t.item.data("ui-autocomplete-item") || t.item.data("item.autocomplete"),
                        r = this.previous;
                    this.element[0] !== this.document[0].activeElement && (this.element.focus(), this.previous = r, this._delay(function() {
                        this.previous = r, this.selectedItem = n
                    })), !1 !== this._trigger("select", e, {
                        item: n
                    }) && this._value(n.value), this.term = this._value(), this.close(e), this.selectedItem = n
                }
            }), this.liveRegion = e("<span>", {
                role: "status",
                "aria-live": "polite"
            }).addClass("ui-helper-hidden-accessible").insertAfter(this.element), e.fn.bgiframe && this.menu.element.bgiframe(), this._on(this.window, {
                beforeunload: function() {
                    this.element.removeAttr("autocomplete")
                }
            })
        },
        _destroy: function() {
            clearTimeout(this.searching), this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete"), this.menu.element.remove(), this.liveRegion.remove()
        },
        _setOption: function(e, t) {
            this._super(e, t), e === "source" && this._initSource(), e === "appendTo" && this.menu.element.appendTo(this.document.find(t || "body")[0]), e === "disabled" && t && this.xhr && this.xhr.abort()
        },
        _isMultiLine: function() {
            return this.element.is("textarea") ? !0 : this.element.is("input") ? !1 : this.element.prop("isContentEditable")
        },
        _initSource: function() {
            var t, n, r = this;
            e.isArray(this.options.source) ? (t = this.options.source, this.source = function(n, r) {
                r(e.ui.autocomplete.filter(t, n.term))
            }) : typeof this.options.source == "string" ? (n = this.options.source, this.source = function(t, i) {
                r.xhr && r.xhr.abort(), r.xhr = e.ajax({
                    url: n,
                    data: t,
                    dataType: "json",
                    success: function(e) {
                        i(e)
                    },
                    error: function() {
                        i([])
                    }
                })
            }) : this.source = this.options.source
        },
        _searchTimeout: function(e) {
            clearTimeout(this.searching), this.searching = this._delay(function() {
                this.term !== this._value() && (this.selectedItem = null, this.search(null, e))
            }, this.options.delay)
        },
        search: function(e, t) {
            e = e != null ? e : this._value(), this.term = this._value();
            if (e.length < this.options.minLength) return this.close(t);
            if (this._trigger("search", t) === !1) return;
            return this._search(e)
        },
        _search: function(e) {
            this.pending++, this.element.addClass("ui-autocomplete-loading"), this.cancelSearch = !1, this.source({
                term: e
            }, this._response())
        },
        _response: function() {
            var e = this,
                t = ++n;
            return function(r) {
                t === n && e.__response(r), e.pending--, e.pending || e.element.removeClass("ui-autocomplete-loading")
            }
        },
        __response: function(e) {
            e && (e = this._normalize(e)), this._trigger("response", null, {
                content: e
            }), !this.options.disabled && e && e.length && !this.cancelSearch ? (this._suggest(e), this._trigger("open")) : this._close()
        },
        close: function(e) {
            this.cancelSearch = !0, this._close(e)
        },
        _close: function(e) {
            this.menu.element.is(":visible") && (this.menu.element.hide(), this.menu.blur(), this.isNewMenu = !0, this._trigger("close", e))
        },
        _change: function(e) {
            this.previous !== this._value() && this._trigger("change", e, {
                item: this.selectedItem
            })
        },
        _normalize: function(t) {
            return t.length && t[0].label && t[0].value ? t : e.map(t, function(t) {
                return typeof t == "string" ? {
                    label: t,
                    value: t
                } : e.extend({
                    label: t.label || t.value,
                    value: t.value || t.label
                }, t)
            })
        },
        _suggest: function(t) {
            var n = this.menu.element.empty().zIndex(this.element.zIndex() + 1);
            this._renderMenu(n, t), this.menu.refresh(), n.show(), this._resizeMenu(), n.position(e.extend({
                of: this.element
            }, this.options.position)), this.options.autoFocus && this.menu.next()
        },
        _resizeMenu: function() {
            var e = this.menu.element;
            e.outerWidth(Math.max(e.width("").outerWidth() + 1, this.element.outerWidth()))
        },
        _renderMenu: function(t, n) {
            var r = this;
            e.each(n, function(e, n) {
                r._renderItemData(t, n)
            })
        },
        _renderItemData: function(e, t) {
            return this._renderItem(e, t).data("ui-autocomplete-item", t)
        },
        _renderItem: function(t, n) {
            return e("<li>").append(e("<a>").text(n.label)).appendTo(t)
        },
        _move: function(e, t) {
            if (!this.menu.element.is(":visible")) {
                this.search(null, t);
                return
            }
            if (this.menu.isFirstItem() && /^previous/.test(e) || this.menu.isLastItem() && /^next/.test(e)) {
                this._value(this.term), this.menu.blur();
                return
            }
            this.menu[e](t)
        },
        widget: function() {
            return this.menu.element
        },
        _value: function() {
            return this.valueMethod.apply(this.element, arguments)
        },
        _keyEvent: function(e, t) {
            if (!this.isMultiLine || this.menu.element.is(":visible")) this._move(e, t), t.preventDefault()
        }
    }), e.extend(e.ui.autocomplete, {
        escapeRegex: function(e) {
            return e.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&")
        },
        filter: function(t, n) {
            var r = new RegExp(e.ui.autocomplete.escapeRegex(n), "i");
            return e.grep(t, function(e) {
                return r.test(e.label || e.value || e)
            })
        }
    }), e.widget("ui.autocomplete", e.ui.autocomplete, {
        options: {
            messages: {
                noResults: "No search results.",
                results: function(e) {
                    return e + (e > 1 ? " results are" : " result is") + " available, use up and down arrow keys to navigate."
                }
            }
        },
        __response: function(e) {
            var t;
            this._superApply(arguments);
            if (this.options.disabled || this.cancelSearch) return;
            e && e.length ? t = this.options.messages.results(e.length) : t = this.options.messages.noResults, this.liveRegion.text(t)
        }
    })
})(jQuery);
(function(e, t) {
    var n, r, i, s, o = "ui-button ui-widget ui-state-default ui-corner-all",
        u = "ui-state-hover ui-state-active ",
        a = "ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only",
        f = function() {
            var t = e(this).find(":ui-button");
            setTimeout(function() {
                t.button("refresh")
            }, 1)
        },
        l = function(t) {
            var n = t.name,
                r = t.form,
                i = e([]);
            return n && (r ? i = e(r).find("[name='" + n + "']") : i = e("[name='" + n + "']", t.ownerDocument).filter(function() {
                return !this.form
            })), i
        };
    e.widget("ui.button", {
        version: "1.9.2",
        defaultElement: "<button>",
        options: {
            disabled: null,
            text: !0,
            label: null,
            icons: {
                primary: null,
                secondary: null
            }
        },
        _create: function() {
            this.element.closest("form").unbind("reset" + this.eventNamespace).bind("reset" + this.eventNamespace, f), typeof this.options.disabled != "boolean" ? this.options.disabled = !!this.element.prop("disabled") : this.element.prop("disabled", this.options.disabled), this._determineButtonType(), this.hasTitle = !!this.buttonElement.attr("title");
            var t = this,
                u = this.options,
                a = this.type === "checkbox" || this.type === "radio",
                c = a ? "" : "ui-state-active",
                h = "ui-state-focus";
            u.label === null && (u.label = this.type === "input" ? this.buttonElement.val() : this.buttonElement.html()), this._hoverable(this.buttonElement), this.buttonElement.addClass(o).attr("role", "button").bind("mouseenter" + this.eventNamespace, function() {
                if (u.disabled) return;
                this === n && e(this).addClass("ui-state-active")
            }).bind("mouseleave" + this.eventNamespace, function() {
                if (u.disabled) return;
                e(this).removeClass(c)
            }).bind("click" + this.eventNamespace, function(e) {
                u.disabled && (e.preventDefault(), e.stopImmediatePropagation())
            }), this.element.bind("focus" + this.eventNamespace, function() {
                t.buttonElement.addClass(h)
            }).bind("blur" + this.eventNamespace, function() {
                t.buttonElement.removeClass(h)
            }), a && (this.element.bind("change" + this.eventNamespace, function() {
                if (s) return;
                t.refresh()
            }), this.buttonElement.bind("mousedown" + this.eventNamespace, function(e) {
                if (u.disabled) return;
                s = !1, r = e.pageX, i = e.pageY
            }).bind("mouseup" + this.eventNamespace, function(e) {
                if (u.disabled) return;
                if (r !== e.pageX || i !== e.pageY) s = !0
            })), this.type === "checkbox" ? this.buttonElement.bind("click" + this.eventNamespace, function() {
                if (u.disabled || s) return !1;
                e(this).toggleClass("ui-state-active"), t.buttonElement.attr("aria-pressed", t.element[0].checked)
            }) : this.type === "radio" ? this.buttonElement.bind("click" + this.eventNamespace, function() {
                if (u.disabled || s) return !1;
                e(this).addClass("ui-state-active"), t.buttonElement.attr("aria-pressed", "true");
                var n = t.element[0];
                l(n).not(n).map(function() {
                    return e(this).button("widget")[0]
                }).removeClass("ui-state-active").attr("aria-pressed", "false")
            }) : (this.buttonElement.bind("mousedown" + this.eventNamespace, function() {
                if (u.disabled) return !1;
                e(this).addClass("ui-state-active"), n = this, t.document.one("mouseup", function() {
                    n = null
                })
            }).bind("mouseup" + this.eventNamespace, function() {
                if (u.disabled) return !1;
                e(this).removeClass("ui-state-active")
            }).bind("keydown" + this.eventNamespace, function(t) {
                if (u.disabled) return !1;
                (t.keyCode === e.ui.keyCode.SPACE || t.keyCode === e.ui.keyCode.ENTER) && e(this).addClass("ui-state-active")
            }).bind("keyup" + this.eventNamespace, function() {
                e(this).removeClass("ui-state-active")
            }), this.buttonElement.is("a") && this.buttonElement.keyup(function(t) {
                t.keyCode === e.ui.keyCode.SPACE && e(this).click()
            })), this._setOption("disabled", u.disabled), this._resetButton()
        },
        _determineButtonType: function() {
            var e, t, n;
            this.element.is("[type=checkbox]") ? this.type = "checkbox" : this.element.is("[type=radio]") ? this.type = "radio" : this.element.is("input") ? this.type = "input" : this.type = "button", this.type === "checkbox" || this.type === "radio" ? (e = this.element.parents().last(), t = "label[for='" + this.element.attr("id") + "']", this.buttonElement = e.find(t), this.buttonElement.length || (e = e.length ? e.siblings() : this.element.siblings(), this.buttonElement = e.filter(t), this.buttonElement.length || (this.buttonElement = e.find(t))), this.element.addClass("ui-helper-hidden-accessible"), n = this.element.is(":checked"), n && this.buttonElement.addClass("ui-state-active"), this.buttonElement.prop("aria-pressed", n)) : this.buttonElement = this.element
        },
        widget: function() {
            return this.buttonElement
        },
        _destroy: function() {
            this.element.removeClass("ui-helper-hidden-accessible"), this.buttonElement.removeClass(o + " " + u + " " + a).removeAttr("role").removeAttr("aria-pressed").html(this.buttonElement.find(".ui-button-text").html()), this.hasTitle || this.buttonElement.removeAttr("title")
        },
        _setOption: function(e, t) {
            this._super(e, t);
            if (e === "disabled") {
                t ? this.element.prop("disabled", !0) : this.element.prop("disabled", !1);
                return
            }
            this._resetButton()
        },
        refresh: function() {
            var t = this.element.is("input, button") ? this.element.is(":disabled") : this.element.hasClass("ui-button-disabled");
            t !== this.options.disabled && this._setOption("disabled", t), this.type === "radio" ? l(this.element[0]).each(function() {
                e(this).is(":checked") ? e(this).button("widget").addClass("ui-state-active").attr("aria-pressed", "true") : e(this).button("widget").removeClass("ui-state-active").attr("aria-pressed", "false")
            }) : this.type === "checkbox" && (this.element.is(":checked") ? this.buttonElement.addClass("ui-state-active").attr("aria-pressed", "true") : this.buttonElement.removeClass("ui-state-active").attr("aria-pressed", "false"))
        },
        _resetButton: function() {
            if (this.type === "input") {
                this.options.label && this.element.val(this.options.label);
                return
            }
            var t = this.buttonElement.removeClass(a),
                n = e("<span></span>", this.document[0]).addClass("ui-button-text").html(this.options.label).appendTo(t.empty()).text(),
                r = this.options.icons,
                i = r.primary && r.secondary,
                s = [];
            r.primary || r.secondary ? (this.options.text && s.push("ui-button-text-icon" + (i ? "s" : r.primary ? "-primary" : "-secondary")), r.primary && t.prepend("<span class='ui-button-icon-primary ui-icon " + r.primary + "'></span>"), r.secondary && t.append("<span class='ui-button-icon-secondary ui-icon " + r.secondary + "'></span>"), this.options.text || (s.push(i ? "ui-button-icons-only" : "ui-button-icon-only"), this.hasTitle || t.attr("title", e.trim(n)))) : s.push("ui-button-text-only"), t.addClass(s.join(" "))
        }
    }), e.widget("ui.buttonset", {
        version: "1.9.2",
        options: {
            items: "button, input[type=button], input[type=submit], input[type=reset], input[type=checkbox], input[type=radio], a, :data(button)"
        },
        _create: function() {
            this.element.addClass("ui-buttonset")
        },
        _init: function() {
            this.refresh()
        },
        _setOption: function(e, t) {
            e === "disabled" && this.buttons.button("option", e, t), this._super(e, t)
        },
        refresh: function() {
            var t = this.element.css("direction") === "rtl";
            this.buttons = this.element.find(this.options.items).filter(":ui-button").button("refresh").end().not(":ui-button").button().end().map(function() {
                return e(this).button("widget")[0]
            }).removeClass("ui-corner-all ui-corner-left ui-corner-right").filter(":first").addClass(t ? "ui-corner-right" : "ui-corner-left").end().filter(":last").addClass(t ? "ui-corner-left" : "ui-corner-right").end().end()
        },
        _destroy: function() {
            this.element.removeClass("ui-buttonset"), this.buttons.map(function() {
                return e(this).button("widget")[0]
            }).removeClass("ui-corner-left ui-corner-right").end().button("destroy")
        }
    })
})(jQuery);
(function($, undefined) {
    function Datepicker() {
        this.debug = !1, this._curInst = null, this._keyEvent = !1, this._disabledInputs = [], this._datepickerShowing = !1, this._inDialog = !1, this._mainDivId = "ui-datepicker-div", this._inlineClass = "ui-datepicker-inline", this._appendClass = "ui-datepicker-append", this._triggerClass = "ui-datepicker-trigger", this._dialogClass = "ui-datepicker-dialog", this._disableClass = "ui-datepicker-disabled", this._unselectableClass = "ui-datepicker-unselectable", this._currentClass = "ui-datepicker-current-day", this._dayOverClass = "ui-datepicker-days-cell-over", this.regional = [], this.regional[""] = {
            closeText: "Done",
            prevText: "Prev",
            nextText: "Next",
            currentText: "Today",
            monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
            weekHeader: "Wk",
            dateFormat: "mm/dd/yy",
            firstDay: 0,
            isRTL: !1,
            showMonthAfterYear: !1,
            yearSuffix: ""
        }, this._defaults = {
            showOn: "focus",
            showAnim: "fadeIn",
            showOptions: {},
            defaultDate: null,
            appendText: "",
            buttonText: "...",
            buttonImage: "",
            buttonImageOnly: !1,
            hideIfNoPrevNext: !1,
            navigationAsDateFormat: !1,
            gotoCurrent: !1,
            changeMonth: !1,
            changeYear: !1,
            yearRange: "c-10:c+10",
            showOtherMonths: !1,
            selectOtherMonths: !1,
            showWeek: !1,
            calculateWeek: this.iso8601Week,
            shortYearCutoff: "+10",
            minDate: null,
            maxDate: null,
            duration: "fast",
            beforeShowDay: null,
            beforeShow: null,
            onSelect: null,
            onChangeMonthYear: null,
            onClose: null,
            numberOfMonths: 1,
            showCurrentAtPos: 0,
            stepMonths: 1,
            stepBigMonths: 12,
            altField: "",
            altFormat: "",
            constrainInput: !0,
            showButtonPanel: !1,
            autoSize: !1,
            disabled: !1
        }, $.extend(this._defaults, this.regional[""]), this.dpDiv = bindHover($('<div id="' + this._mainDivId + '" class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>'))
    }

    function bindHover(e) {
        var t = "button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";
        return e.delegate(t, "mouseout", function() {
            $(this).removeClass("ui-state-hover"), this.className.indexOf("ui-datepicker-prev") != -1 && $(this).removeClass("ui-datepicker-prev-hover"), this.className.indexOf("ui-datepicker-next") != -1 && $(this).removeClass("ui-datepicker-next-hover")
        }).delegate(t, "mouseover", function() {
            $.datepicker._isDisabledDatepicker(instActive.inline ? e.parent()[0] : instActive.input[0]) || ($(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover"), $(this).addClass("ui-state-hover"), this.className.indexOf("ui-datepicker-prev") != -1 && $(this).addClass("ui-datepicker-prev-hover"), this.className.indexOf("ui-datepicker-next") != -1 && $(this).addClass("ui-datepicker-next-hover"))
        })
    }

    function extendRemove(e, t) {
        $.extend(e, t);
        for (var n in t)
            if (t[n] == null || t[n] == undefined) e[n] = t[n];
        return e
    }
    $.extend($.ui, {
        datepicker: {
            version: "1.9.2"
        }
    });
    var PROP_NAME = "datepicker",
        dpuuid = (new Date).getTime(),
        instActive;
    $.extend(Datepicker.prototype, {
        markerClassName: "hasDatepicker",
        maxRows: 4,
        log: function() {
            this.debug && console.log.apply("", arguments)
        },
        _widgetDatepicker: function() {
            return this.dpDiv
        },
        setDefaults: function(e) {
            return extendRemove(this._defaults, e || {}), this
        },
        _attachDatepicker: function(target, settings) {
            var inlineSettings = null;
            for (var attrName in this._defaults) {
                var attrValue = target.getAttribute("date:" + attrName);
                if (attrValue) {
                    inlineSettings = inlineSettings || {};
                    try {
                        inlineSettings[attrName] = eval(attrValue)
                    } catch (err) {
                        inlineSettings[attrName] = attrValue
                    }
                }
            }
            var nodeName = target.nodeName.toLowerCase(),
                inline = nodeName == "div" || nodeName == "span";
            target.id || (this.uuid += 1, target.id = "dp" + this.uuid);
            var inst = this._newInst($(target), inline);
            inst.settings = $.extend({}, settings || {}, inlineSettings || {}), nodeName == "input" ? this._connectDatepicker(target, inst) : inline && this._inlineDatepicker(target, inst)
        },
        _newInst: function(e, t) {
            var n = e[0].id.replace(/([^A-Za-z0-9_-])/g, "\\\\$1");
            return {
                id: n,
                input: e,
                selectedDay: 0,
                selectedMonth: 0,
                selectedYear: 0,
                drawMonth: 0,
                drawYear: 0,
                inline: t,
                dpDiv: t ? bindHover($('<div class="' + this._inlineClass + ' ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>')) : this.dpDiv
            }
        },
        _connectDatepicker: function(e, t) {
            var n = $(e);
            t.append = $([]), t.trigger = $([]);
            if (n.hasClass(this.markerClassName)) return;
            this._attachments(n, t), n.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp).bind("setData.datepicker", function(e, n, r) {
                t.settings[n] = r
            }).bind("getData.datepicker", function(e, n) {
                return this._get(t, n)
            }), this._autoSize(t), $.data(e, PROP_NAME, t), t.settings.disabled && this._disableDatepicker(e)
        },
        _attachments: function(e, t) {
            var n = this._get(t, "appendText"),
                r = this._get(t, "isRTL");
            t.append && t.append.remove(), n && (t.append = $('<span class="' + this._appendClass + '">' + n + "</span>"), e[r ? "before" : "after"](t.append)), e.unbind("focus", this._showDatepicker), t.trigger && t.trigger.remove();
            var i = this._get(t, "showOn");
            (i == "focus" || i == "both") && e.focus(this._showDatepicker);
            if (i == "button" || i == "both") {
                var s = this._get(t, "buttonText"),
                    o = this._get(t, "buttonImage");
                t.trigger = $(this._get(t, "buttonImageOnly") ? $("<img/>").addClass(this._triggerClass).attr({
                    src: o,
                    alt: s,
                    title: s
                }) : $('<button type="button"></button>').addClass(this._triggerClass).html(o == "" ? s : $("<img/>").attr({
                    src: o,
                    alt: s,
                    title: s
                }))), e[r ? "before" : "after"](t.trigger), t.trigger.click(function() {
                    return $.datepicker._datepickerShowing && $.datepicker._lastInput == e[0] ? $.datepicker._hideDatepicker() : $.datepicker._datepickerShowing && $.datepicker._lastInput != e[0] ? ($.datepicker._hideDatepicker(), $.datepicker._showDatepicker(e[0])) : $.datepicker._showDatepicker(e[0]), !1
                })
            }
        },
        _autoSize: function(e) {
            if (this._get(e, "autoSize") && !e.inline) {
                var t = new Date(2009, 11, 20),
                    n = this._get(e, "dateFormat");
                if (n.match(/[DM]/)) {
                    var r = function(e) {
                        var t = 0,
                            n = 0;
                        for (var r = 0; r < e.length; r++) e[r].length > t && (t = e[r].length, n = r);
                        return n
                    };
                    t.setMonth(r(this._get(e, n.match(/MM/) ? "monthNames" : "monthNamesShort"))), t.setDate(r(this._get(e, n.match(/DD/) ? "dayNames" : "dayNamesShort")) + 20 - t.getDay())
                }
                e.input.attr("size", this._formatDate(e, t).length)
            }
        },
        _inlineDatepicker: function(e, t) {
            var n = $(e);
            if (n.hasClass(this.markerClassName)) return;
            n.addClass(this.markerClassName).append(t.dpDiv).bind("setData.datepicker", function(e, n, r) {
                t.settings[n] = r
            }).bind("getData.datepicker", function(e, n) {
                return this._get(t, n)
            }), $.data(e, PROP_NAME, t), this._setDate(t, this._getDefaultDate(t), !0), this._updateDatepicker(t), this._updateAlternate(t), t.settings.disabled && this._disableDatepicker(e), t.dpDiv.css("display", "block")
        },
        _dialogDatepicker: function(e, t, n, r, i) {
            var s = this._dialogInst;
            if (!s) {
                this.uuid += 1;
                var o = "dp" + this.uuid;
                this._dialogInput = $('<input type="text" id="' + o + '" style="position: absolute; top: -100px; width: 0px;"/>'), this._dialogInput.keydown(this._doKeyDown), $("body").append(this._dialogInput), s = this._dialogInst = this._newInst(this._dialogInput, !1), s.settings = {}, $.data(this._dialogInput[0], PROP_NAME, s)
            }
            extendRemove(s.settings, r || {}), t = t && t.constructor == Date ? this._formatDate(s, t) : t, this._dialogInput.val(t), this._pos = i ? i.length ? i : [i.pageX, i.pageY] : null;
            if (!this._pos) {
                var u = document.documentElement.clientWidth,
                    a = document.documentElement.clientHeight,
                    f = document.documentElement.scrollLeft || document.body.scrollLeft,
                    l = document.documentElement.scrollTop || document.body.scrollTop;
                this._pos = [u / 2 - 100 + f, a / 2 - 150 + l]
            }
            return this._dialogInput.css("left", this._pos[0] + 20 + "px").css("top", this._pos[1] + "px"), s.settings.onSelect = n, this._inDialog = !0, this.dpDiv.addClass(this._dialogClass), this._showDatepicker(this._dialogInput[0]), $.blockUI && $.blockUI(this.dpDiv), $.data(this._dialogInput[0], PROP_NAME, s), this
        },
        _destroyDatepicker: function(e) {
            var t = $(e),
                n = $.data(e, PROP_NAME);
            if (!t.hasClass(this.markerClassName)) return;
            var r = e.nodeName.toLowerCase();
            $.removeData(e, PROP_NAME), r == "input" ? (n.append.remove(), n.trigger.remove(), t.removeClass(this.markerClassName).unbind("focus", this._showDatepicker).unbind("keydown", this._doKeyDown).unbind("keypress", this._doKeyPress).unbind("keyup", this._doKeyUp)) : (r == "div" || r == "span") && t.removeClass(this.markerClassName).empty()
        },
        _enableDatepicker: function(e) {
            var t = $(e),
                n = $.data(e, PROP_NAME);
            if (!t.hasClass(this.markerClassName)) return;
            var r = e.nodeName.toLowerCase();
            if (r == "input") e.disabled = !1, n.trigger.filter("button").each(function() {
                this.disabled = !1
            }).end().filter("img").css({
                opacity: "1.0",
                cursor: ""
            });
            else if (r == "div" || r == "span") {
                var i = t.children("." + this._inlineClass);
                i.children().removeClass("ui-state-disabled"), i.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled", !1)
            }
            this._disabledInputs = $.map(this._disabledInputs, function(t) {
                return t == e ? null : t
            })
        },
        _disableDatepicker: function(e) {
            var t = $(e),
                n = $.data(e, PROP_NAME);
            if (!t.hasClass(this.markerClassName)) return;
            var r = e.nodeName.toLowerCase();
            if (r == "input") e.disabled = !0, n.trigger.filter("button").each(function() {
                this.disabled = !0
            }).end().filter("img").css({
                opacity: "0.5",
                cursor: "default"
            });
            else if (r == "div" || r == "span") {
                var i = t.children("." + this._inlineClass);
                i.children().addClass("ui-state-disabled"), i.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled", !0)
            }
            this._disabledInputs = $.map(this._disabledInputs, function(t) {
                return t == e ? null : t
            }), this._disabledInputs[this._disabledInputs.length] = e
        },
        _isDisabledDatepicker: function(e) {
            if (!e) return !1;
            for (var t = 0; t < this._disabledInputs.length; t++)
                if (this._disabledInputs[t] == e) return !0;
            return !1
        },
        _getInst: function(e) {
            try {
                return $.data(e, PROP_NAME)
            } catch (t) {
                throw "Missing instance data for this datepicker"
            }
        },
        _optionDatepicker: function(e, t, n) {
            var r = this._getInst(e);
            if (arguments.length == 2 && typeof t == "string") return t == "defaults" ? $.extend({}, $.datepicker._defaults) : r ? t == "all" ? $.extend({}, r.settings) : this._get(r, t) : null;
            var i = t || {};
            typeof t == "string" && (i = {}, i[t] = n);
            if (r) {
                this._curInst == r && this._hideDatepicker();
                var s = this._getDateDatepicker(e, !0),
                    o = this._getMinMaxDate(r, "min"),
                    u = this._getMinMaxDate(r, "max");
                extendRemove(r.settings, i), o !== null && i.dateFormat !== undefined && i.minDate === undefined && (r.settings.minDate = this._formatDate(r, o)), u !== null && i.dateFormat !== undefined && i.maxDate === undefined && (r.settings.maxDate = this._formatDate(r, u)), this._attachments($(e), r), this._autoSize(r), this._setDate(r, s), this._updateAlternate(r), this._updateDatepicker(r)
            }
        },
        _changeDatepicker: function(e, t, n) {
            this._optionDatepicker(e, t, n)
        },
        _refreshDatepicker: function(e) {
            var t = this._getInst(e);
            t && this._updateDatepicker(t)
        },
        _setDateDatepicker: function(e, t) {
            var n = this._getInst(e);
            n && (this._setDate(n, t), this._updateDatepicker(n), this._updateAlternate(n))
        },
        _getDateDatepicker: function(e, t) {
            var n = this._getInst(e);
            return n && !n.inline && this._setDateFromField(n, t), n ? this._getDate(n) : null
        },
        _doKeyDown: function(e) {
            var t = $.datepicker._getInst(e.target),
                n = !0,
                r = t.dpDiv.is(".ui-datepicker-rtl");
            t._keyEvent = !0;
            if ($.datepicker._datepickerShowing) switch (e.keyCode) {
                case 9:
                    $.datepicker._hideDatepicker(), n = !1;
                    break;
                case 13:
                    var i = $("td." + $.datepicker._dayOverClass + ":not(." + $.datepicker._currentClass + ")", t.dpDiv);
                    i[0] && $.datepicker._selectDay(e.target, t.selectedMonth, t.selectedYear, i[0]);
                    var s = $.datepicker._get(t, "onSelect");
                    if (s) {
                        var o = $.datepicker._formatDate(t);
                        s.apply(t.input ? t.input[0] : null, [o, t])
                    } else $.datepicker._hideDatepicker();
                    return !1;
                case 27:
                    $.datepicker._hideDatepicker();
                    break;
                case 33:
                    $.datepicker._adjustDate(e.target, e.ctrlKey ? -$.datepicker._get(t, "stepBigMonths") : -$.datepicker._get(t, "stepMonths"), "M");
                    break;
                case 34:
                    $.datepicker._adjustDate(e.target, e.ctrlKey ? +$.datepicker._get(t, "stepBigMonths") : +$.datepicker._get(t, "stepMonths"), "M");
                    break;
                case 35:
                    (e.ctrlKey || e.metaKey) && $.datepicker._clearDate(e.target), n = e.ctrlKey || e.metaKey;
                    break;
                case 36:
                    (e.ctrlKey || e.metaKey) && $.datepicker._gotoToday(e.target), n = e.ctrlKey || e.metaKey;
                    break;
                case 37:
                    (e.ctrlKey || e.metaKey) && $.datepicker._adjustDate(e.target, r ? 1 : -1, "D"), n = e.ctrlKey || e.metaKey, e.originalEvent.altKey && $.datepicker._adjustDate(e.target, e.ctrlKey ? -$.datepicker._get(t, "stepBigMonths") : -$.datepicker._get(t, "stepMonths"), "M");
                    break;
                case 38:
                    (e.ctrlKey || e.metaKey) && $.datepicker._adjustDate(e.target, -7, "D"), n = e.ctrlKey || e.metaKey;
                    break;
                case 39:
                    (e.ctrlKey || e.metaKey) && $.datepicker._adjustDate(e.target, r ? -1 : 1, "D"), n = e.ctrlKey || e.metaKey, e.originalEvent.altKey && $.datepicker._adjustDate(e.target, e.ctrlKey ? +$.datepicker._get(t, "stepBigMonths") : +$.datepicker._get(t, "stepMonths"), "M");
                    break;
                case 40:
                    (e.ctrlKey || e.metaKey) && $.datepicker._adjustDate(e.target, 7, "D"), n = e.ctrlKey || e.metaKey;
                    break;
                default:
                    n = !1
            } else e.keyCode == 36 && e.ctrlKey ? $.datepicker._showDatepicker(this) : n = !1;
            n && (e.preventDefault(), e.stopPropagation())
        },
        _doKeyPress: function(e) {
            var t = $.datepicker._getInst(e.target);
            if ($.datepicker._get(t, "constrainInput")) {
                var n = $.datepicker._possibleChars($.datepicker._get(t, "dateFormat")),
                    r = String.fromCharCode(e.charCode == undefined ? e.keyCode : e.charCode);
                return e.ctrlKey || e.metaKey || r < " " || !n || n.indexOf(r) > -1
            }
        },
        _doKeyUp: function(e) {
            var t = $.datepicker._getInst(e.target);
            if (t.input.val() != t.lastVal) try {
                var n = $.datepicker.parseDate($.datepicker._get(t, "dateFormat"), t.input ? t.input.val() : null, $.datepicker._getFormatConfig(t));
                n && ($.datepicker._setDateFromField(t), $.datepicker._updateAlternate(t), $.datepicker._updateDatepicker(t))
            } catch (r) {
                $.datepicker.log(r)
            }
            return !0
        },
        _showDatepicker: function(e) {
            e = e.target || e, e.nodeName.toLowerCase() != "input" && (e = $("input", e.parentNode)[0]);
            if ($.datepicker._isDisabledDatepicker(e) || $.datepicker._lastInput == e) return;
            var t = $.datepicker._getInst(e);
            $.datepicker._curInst && $.datepicker._curInst != t && ($.datepicker._curInst.dpDiv.stop(!0, !0), t && $.datepicker._datepickerShowing && $.datepicker._hideDatepicker($.datepicker._curInst.input[0]));
            var n = $.datepicker._get(t, "beforeShow"),
                r = n ? n.apply(e, [e, t]) : {};
            if (r === !1) return;
            extendRemove(t.settings, r), t.lastVal = null, $.datepicker._lastInput = e, $.datepicker._setDateFromField(t), $.datepicker._inDialog && (e.value = ""), $.datepicker._pos || ($.datepicker._pos = $.datepicker._findPos(e), $.datepicker._pos[1] += e.offsetHeight);
            var i = !1;
            $(e).parents().each(function() {
                return i |= $(this).css("position") == "fixed", !i
            });
            var s = {
                left: $.datepicker._pos[0],
                top: $.datepicker._pos[1]
            };
            $.datepicker._pos = null, t.dpDiv.empty(), t.dpDiv.css({
                position: "absolute",
                display: "block",
                top: "-1000px"
            }), $.datepicker._updateDatepicker(t), s = $.datepicker._checkOffset(t, s, i), t.dpDiv.css({
                position: $.datepicker._inDialog && $.blockUI ? "static" : i ? "fixed" : "absolute",
                display: "none",
                left: s.left + "px",
                top: s.top + "px"
            });
            if (!t.inline) {
                var o = $.datepicker._get(t, "showAnim"),
                    u = $.datepicker._get(t, "duration"),
                    a = function() {
                        var e = t.dpDiv.find("iframe.ui-datepicker-cover");
                        if (!!e.length) {
                            var n = $.datepicker._getBorders(t.dpDiv);
                            e.css({
                                left: -n[0],
                                top: -n[1],
                                width: t.dpDiv.outerWidth(),
                                height: t.dpDiv.outerHeight()
                            })
                        }
                    };
                t.dpDiv.zIndex($(e).zIndex() + 1), $.datepicker._datepickerShowing = !0, $.effects && ($.effects.effect[o] || $.effects[o]) ? t.dpDiv.show(o, $.datepicker._get(t, "showOptions"), u, a) : t.dpDiv[o || "show"](o ? u : null, a), (!o || !u) && a(), t.input.is(":visible") && !t.input.is(":disabled") && t.input.focus(), $.datepicker._curInst = t
            }
        },
        _updateDatepicker: function(e) {
            this.maxRows = 4;
            var t = $.datepicker._getBorders(e.dpDiv);
            instActive = e, e.dpDiv.empty().append(this._generateHTML(e)), this._attachHandlers(e);
            var n = e.dpDiv.find("iframe.ui-datepicker-cover");
            !n.length || n.css({
                left: -t[0],
                top: -t[1],
                width: e.dpDiv.outerWidth(),
                height: e.dpDiv.outerHeight()
            }), e.dpDiv.find("." + this._dayOverClass + " a").mouseover();
            var r = this._getNumberOfMonths(e),
                i = r[1],
                s = 17;
            e.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width(""), i > 1 && e.dpDiv.addClass("ui-datepicker-multi-" + i).css("width", s * i + "em"), e.dpDiv[(r[0] != 1 || r[1] != 1 ? "add" : "remove") + "Class"]("ui-datepicker-multi"), e.dpDiv[(this._get(e, "isRTL") ? "add" : "remove") + "Class"]("ui-datepicker-rtl"), e == $.datepicker._curInst && $.datepicker._datepickerShowing && e.input && e.input.is(":visible") && !e.input.is(":disabled") && e.input[0] != document.activeElement && e.input.focus();
            if (e.yearshtml) {
                var o = e.yearshtml;
                setTimeout(function() {
                    o === e.yearshtml && e.yearshtml && e.dpDiv.find("select.ui-datepicker-year:first").replaceWith(e.yearshtml), o = e.yearshtml = null
                }, 0)
            }
        },
        _getBorders: function(e) {
            var t = function(e) {
                return {
                    thin: 1,
                    medium: 2,
                    thick: 3
                } [e] || e
            };
            return [parseFloat(t(e.css("border-left-width"))), parseFloat(t(e.css("border-top-width")))]
        },
        _checkOffset: function(e, t, n) {
            var r = e.dpDiv.outerWidth(),
                i = e.dpDiv.outerHeight(),
                s = e.input ? e.input.outerWidth() : 0,
                o = e.input ? e.input.outerHeight() : 0,
                u = document.documentElement.clientWidth + (n ? 0 : $(document).scrollLeft()),
                a = document.documentElement.clientHeight + (n ? 0 : $(document).scrollTop());
            return t.left -= this._get(e, "isRTL") ? r - s : 0, t.left -= n && t.left == e.input.offset().left ? $(document).scrollLeft() : 0, t.top -= n && t.top == e.input.offset().top + o ? $(document).scrollTop() : 0, t.left -= Math.min(t.left, t.left + r > u && u > r ? Math.abs(t.left + r - u) : 0), t.top -= Math.min(t.top, t.top + i > a && a > i ? Math.abs(i + o) : 0), t
        },
        _findPos: function(e) {
            var t = this._getInst(e),
                n = this._get(t, "isRTL");
            while (e && (e.type == "hidden" || e.nodeType != 1 || $.expr.filters.hidden(e))) e = e[n ? "previousSibling" : "nextSibling"];
            var r = $(e).offset();
            return [r.left, r.top]
        },
        _hideDatepicker: function(e) {
            var t = this._curInst;
            if (!t || e && t != $.data(e, PROP_NAME)) return;
            if (this._datepickerShowing) {
                var n = this._get(t, "showAnim"),
                    r = this._get(t, "duration"),
                    i = function() {
                        $.datepicker._tidyDialog(t)
                    };
                $.effects && ($.effects.effect[n] || $.effects[n]) ? t.dpDiv.hide(n, $.datepicker._get(t, "showOptions"), r, i) : t.dpDiv[n == "slideDown" ? "slideUp" : n == "fadeIn" ? "fadeOut" : "hide"](n ? r : null, i), n || i(), this._datepickerShowing = !1;
                var s = this._get(t, "onClose");
                s && s.apply(t.input ? t.input[0] : null, [t.input ? t.input.val() : "", t]), this._lastInput = null, this._inDialog && (this._dialogInput.css({
                    position: "absolute",
                    left: "0",
                    top: "-100px"
                }), $.blockUI && ($.unblockUI(), $("body").append(this.dpDiv))), this._inDialog = !1
            }
        },
        _tidyDialog: function(e) {
            e.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar")
        },
        _checkExternalClick: function(e) {
            if (!$.datepicker._curInst) return;
            var t = $(e.target),
                n = $.datepicker._getInst(t[0]);
            (t[0].id != $.datepicker._mainDivId && t.parents("#" + $.datepicker._mainDivId).length == 0 && !t.hasClass($.datepicker.markerClassName) && !t.closest("." + $.datepicker._triggerClass).length && $.datepicker._datepickerShowing && (!$.datepicker._inDialog || !$.blockUI) || t.hasClass($.datepicker.markerClassName) && $.datepicker._curInst != n) && $.datepicker._hideDatepicker()
        },
        _adjustDate: function(e, t, n) {
            var r = $(e),
                i = this._getInst(r[0]);
            if (this._isDisabledDatepicker(r[0])) return;
            this._adjustInstDate(i, t + (n == "M" ? this._get(i, "showCurrentAtPos") : 0), n), this._updateDatepicker(i)
        },
        _gotoToday: function(e) {
            var t = $(e),
                n = this._getInst(t[0]);
            if (this._get(n, "gotoCurrent") && n.currentDay) n.selectedDay = n.currentDay, n.drawMonth = n.selectedMonth = n.currentMonth, n.drawYear = n.selectedYear = n.currentYear;
            else {
                var r = new Date;
                n.selectedDay = r.getDate(), n.drawMonth = n.selectedMonth = r.getMonth(), n.drawYear = n.selectedYear = r.getFullYear()
            }
            this._notifyChange(n), this._adjustDate(t)
        },
        _selectMonthYear: function(e, t, n) {
            var r = $(e),
                i = this._getInst(r[0]);
            i["selected" + (n == "M" ? "Month" : "Year")] = i["draw" + (n == "M" ? "Month" : "Year")] = parseInt(t.options[t.selectedIndex].value, 10), this._notifyChange(i), this._adjustDate(r)
        },
        _selectDay: function(e, t, n, r) {
            var i = $(e);
            if ($(r).hasClass(this._unselectableClass) || this._isDisabledDatepicker(i[0])) return;
            var s = this._getInst(i[0]);
            s.selectedDay = s.currentDay = $("a", r).html(), s.selectedMonth = s.currentMonth = t, s.selectedYear = s.currentYear = n, this._selectDate(e, this._formatDate(s, s.currentDay, s.currentMonth, s.currentYear))
        },
        _clearDate: function(e) {
            var t = $(e),
                n = this._getInst(t[0]);
            this._selectDate(t, "")
        },
        _selectDate: function(e, t) {
            var n = $(e),
                r = this._getInst(n[0]);
            t = t != null ? t : this._formatDate(r), r.input && r.input.val(t), this._updateAlternate(r);
            var i = this._get(r, "onSelect");
            i ? i.apply(r.input ? r.input[0] : null, [t, r]) : r.input && r.input.trigger("change"), r.inline ? this._updateDatepicker(r) : (this._hideDatepicker(), this._lastInput = r.input[0], typeof r.input[0] != "object" && r.input.focus(), this._lastInput = null)
        },
        _updateAlternate: function(e) {
            var t = this._get(e, "altField");
            if (t) {
                var n = this._get(e, "altFormat") || this._get(e, "dateFormat"),
                    r = this._getDate(e),
                    i = this.formatDate(n, r, this._getFormatConfig(e));
                $(t).each(function() {
                    $(this).val(i)
                })
            }
        },
        noWeekends: function(e) {
            var t = e.getDay();
            return [t > 0 && t < 6, ""]
        },
        iso8601Week: function(e) {
            var t = new Date(e.getTime());
            t.setDate(t.getDate() + 4 - (t.getDay() || 7));
            var n = t.getTime();
            return t.setMonth(0), t.setDate(1), Math.floor(Math.round((n - t) / 864e5) / 7) + 1
        },
        parseDate: function(e, t, n) {
            if (e == null || t == null) throw "Invalid arguments";
            t = typeof t == "object" ? t.toString() : t + "";
            if (t == "") return null;
            var r = (n ? n.shortYearCutoff : null) || this._defaults.shortYearCutoff;
            r = typeof r != "string" ? r : (new Date).getFullYear() % 100 + parseInt(r, 10);
            var i = (n ? n.dayNamesShort : null) || this._defaults.dayNamesShort,
                s = (n ? n.dayNames : null) || this._defaults.dayNames,
                o = (n ? n.monthNamesShort : null) || this._defaults.monthNamesShort,
                u = (n ? n.monthNames : null) || this._defaults.monthNames,
                a = -1,
                f = -1,
                l = -1,
                c = -1,
                h = !1,
                p = function(t) {
                    var n = y + 1 < e.length && e.charAt(y + 1) == t;
                    return n && y++, n
                },
                d = function(e) {
                    var n = p(e),
                        r = e == "@" ? 14 : e == "!" ? 20 : e == "y" && n ? 4 : e == "o" ? 3 : 2,
                        i = new RegExp("^\\d{1," + r + "}"),
                        s = t.substring(g).match(i);
                    if (!s) throw "Missing number at position " + g;
                    return g += s[0].length, parseInt(s[0], 10)
                },
                v = function(e, n, r) {
                    var i = $.map(p(e) ? r : n, function(e, t) {
                            return [
                                [t, e]
                            ]
                        }).sort(function(e, t) {
                            return -(e[1].length - t[1].length)
                        }),
                        s = -1;
                    $.each(i, function(e, n) {
                        var r = n[1];
                        if (t.substr(g, r.length).toLowerCase() == r.toLowerCase()) return s = n[0], g += r.length, !1
                    });
                    if (s != -1) return s + 1;
                    throw "Unknown name at position " + g
                },
                m = function() {
                    if (t.charAt(g) != e.charAt(y)) throw "Unexpected literal at position " + g;
                    g++
                },
                g = 0;
            for (var y = 0; y < e.length; y++)
                if (h) e.charAt(y) == "'" && !p("'") ? h = !1 : m();
                else switch (e.charAt(y)) {
                    case "d":
                        l = d("d");
                        break;
                    case "D":
                        v("D", i, s);
                        break;
                    case "o":
                        c = d("o");
                        break;
                    case "m":
                        f = d("m");
                        break;
                    case "M":
                        f = v("M", o, u);
                        break;
                    case "y":
                        a = d("y");
                        break;
                    case "@":
                        var b = new Date(d("@"));
                        a = b.getFullYear(), f = b.getMonth() + 1, l = b.getDate();
                        break;
                    case "!":
                        var b = new Date((d("!") - this._ticksTo1970) / 1e4);
                        a = b.getFullYear(), f = b.getMonth() + 1, l = b.getDate();
                        break;
                    case "'":
                        p("'") ? m() : h = !0;
                        break;
                    default:
                        m()
                }
            if (g < t.length) {
                var w = t.substr(g);
                if (!/^\s+/.test(w)) throw "Extra/unparsed characters found in date: " + w
            }
            a == -1 ? a = (new Date).getFullYear() : a < 100 && (a += (new Date).getFullYear() - (new Date).getFullYear() % 100 + (a <= r ? 0 : -100));
            if (c > -1) {
                f = 1, l = c;
                do {
                    var E = this._getDaysInMonth(a, f - 1);
                    if (l <= E) break;
                    f++, l -= E
                } while (!0)
            }
            var b = this._daylightSavingAdjust(new Date(a, f - 1, l));
            if (b.getFullYear() != a || b.getMonth() + 1 != f || b.getDate() != l) throw "Invalid date";
            return b
        },
        ATOM: "yy-mm-dd",
        COOKIE: "D, dd M yy",
        ISO_8601: "yy-mm-dd",
        RFC_822: "D, d M y",
        RFC_850: "DD, dd-M-y",
        RFC_1036: "D, d M y",
        RFC_1123: "D, d M yy",
        RFC_2822: "D, d M yy",
        RSS: "D, d M y",
        TICKS: "!",
        TIMESTAMP: "@",
        W3C: "yy-mm-dd",
        _ticksTo1970: (718685 + Math.floor(492.5) - Math.floor(19.7) + Math.floor(4.925)) * 24 * 60 * 60 * 1e7,
        formatDate: function(e, t, n) {
            if (!t) return "";
            var r = (n ? n.dayNamesShort : null) || this._defaults.dayNamesShort,
                i = (n ? n.dayNames : null) || this._defaults.dayNames,
                s = (n ? n.monthNamesShort : null) || this._defaults.monthNamesShort,
                o = (n ? n.monthNames : null) || this._defaults.monthNames,
                u = function(t) {
                    var n = h + 1 < e.length && e.charAt(h + 1) == t;
                    return n && h++, n
                },
                a = function(e, t, n) {
                    var r = "" + t;
                    if (u(e))
                        while (r.length < n) r = "0" + r;
                    return r
                },
                f = function(e, t, n, r) {
                    return u(e) ? r[t] : n[t]
                },
                l = "",
                c = !1;
            if (t)
                for (var h = 0; h < e.length; h++)
                    if (c) e.charAt(h) == "'" && !u("'") ? c = !1 : l += e.charAt(h);
                    else switch (e.charAt(h)) {
                        case "d":
                            l += a("d", t.getDate(), 2);
                            break;
                        case "D":
                            l += f("D", t.getDay(), r, i);
                            break;
                        case "o":
                            l += a("o", Math.round(((new Date(t.getFullYear(), t.getMonth(), t.getDate())).getTime() - (new Date(t.getFullYear(), 0, 0)).getTime()) / 864e5), 3);
                            break;
                        case "m":
                            l += a("m", t.getMonth() + 1, 2);
                            break;
                        case "M":
                            l += f("M", t.getMonth(), s, o);
                            break;
                        case "y":
                            l += u("y") ? t.getFullYear() : (t.getYear() % 100 < 10 ? "0" : "") + t.getYear() % 100;
                            break;
                        case "@":
                            l += t.getTime();
                            break;
                        case "!":
                            l += t.getTime() * 1e4 + this._ticksTo1970;
                            break;
                        case "'":
                            u("'") ? l += "'" : c = !0;
                            break;
                        default:
                            l += e.charAt(h)
                    }
            return l
        },
        _possibleChars: function(e) {
            var t = "",
                n = !1,
                r = function(t) {
                    var n = i + 1 < e.length && e.charAt(i + 1) == t;
                    return n && i++, n
                };
            for (var i = 0; i < e.length; i++)
                if (n) e.charAt(i) == "'" && !r("'") ? n = !1 : t += e.charAt(i);
                else switch (e.charAt(i)) {
                    case "d":
                    case "m":
                    case "y":
                    case "@":
                        t += "0123456789";
                        break;
                    case "D":
                    case "M":
                        return null;
                    case "'":
                        r("'") ? t += "'" : n = !0;
                        break;
                    default:
                        t += e.charAt(i)
                }
            return t
        },
        _get: function(e, t) {
            return e.settings[t] !== undefined ? e.settings[t] : this._defaults[t]
        },
        _setDateFromField: function(e, t) {
            if (e.input.val() == e.lastVal) return;
            var n = this._get(e, "dateFormat"),
                r = e.lastVal = e.input ? e.input.val() : null,
                i, s;
            i = s = this._getDefaultDate(e);
            var o = this._getFormatConfig(e);
            try {
                i = this.parseDate(n, r, o) || s
            } catch (u) {
                this.log(u), r = t ? "" : r
            }
            e.selectedDay = i.getDate(), e.drawMonth = e.selectedMonth = i.getMonth(), e.drawYear = e.selectedYear = i.getFullYear(), e.currentDay = r ? i.getDate() : 0, e.currentMonth = r ? i.getMonth() : 0, e.currentYear = r ? i.getFullYear() : 0, this._adjustInstDate(e)
        },
        _getDefaultDate: function(e) {
            return this._restrictMinMax(e, this._determineDate(e, this._get(e, "defaultDate"), new Date))
        },
        _determineDate: function(e, t, n) {
            var r = function(e) {
                    var t = new Date;
                    return t.setDate(t.getDate() + e), t
                },
                i = function(t) {
                    try {
                        return $.datepicker.parseDate($.datepicker._get(e, "dateFormat"), t, $.datepicker._getFormatConfig(e))
                    } catch (n) {}
                    var r = (t.toLowerCase().match(/^c/) ? $.datepicker._getDate(e) : null) || new Date,
                        i = r.getFullYear(),
                        s = r.getMonth(),
                        o = r.getDate(),
                        u = /([+-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,
                        a = u.exec(t);
                    while (a) {
                        switch (a[2] || "d") {
                            case "d":
                            case "D":
                                o += parseInt(a[1], 10);
                                break;
                            case "w":
                            case "W":
                                o += parseInt(a[1], 10) * 7;
                                break;
                            case "m":
                            case "M":
                                s += parseInt(a[1], 10), o = Math.min(o, $.datepicker._getDaysInMonth(i, s));
                                break;
                            case "y":
                            case "Y":
                                i += parseInt(a[1], 10), o = Math.min(o, $.datepicker._getDaysInMonth(i, s))
                        }
                        a = u.exec(t)
                    }
                    return new Date(i, s, o)
                },
                s = t == null || t === "" ? n : typeof t == "string" ? i(t) : typeof t == "number" ? isNaN(t) ? n : r(t) : new Date(t.getTime());
            return s = s && s.toString() == "Invalid Date" ? n : s, s && (s.setHours(0), s.setMinutes(0), s.setSeconds(0), s.setMilliseconds(0)), this._daylightSavingAdjust(s)
        },
        _daylightSavingAdjust: function(e) {
            return e ? (e.setHours(e.getHours() > 12 ? e.getHours() + 2 : 0), e) : null
        },
        _setDate: function(e, t, n) {
            var r = !t,
                i = e.selectedMonth,
                s = e.selectedYear,
                o = this._restrictMinMax(e, this._determineDate(e, t, new Date));
            e.selectedDay = e.currentDay = o.getDate(), e.drawMonth = e.selectedMonth = e.currentMonth = o.getMonth(), e.drawYear = e.selectedYear = e.currentYear = o.getFullYear(), (i != e.selectedMonth || s != e.selectedYear) && !n && this._notifyChange(e), this._adjustInstDate(e), e.input && e.input.val(r ? "" : this._formatDate(e))
        },
        _getDate: function(e) {
            var t = !e.currentYear || e.input && e.input.val() == "" ? null : this._daylightSavingAdjust(new Date(e.currentYear, e.currentMonth, e.currentDay));
            return t
        },
        _attachHandlers: function(e) {
            var t = this._get(e, "stepMonths"),
                n = "#" + e.id.replace(/\\\\/g, "\\");
            e.dpDiv.find("[data-handler]").map(function() {
                var e = {
                    prev: function() {
                        window["DP_jQuery_" + dpuuid].datepicker._adjustDate(n, -t, "M")
                    },
                    next: function() {
                        window["DP_jQuery_" + dpuuid].datepicker._adjustDate(n, +t, "M")
                    },
                    hide: function() {
                        window["DP_jQuery_" + dpuuid].datepicker._hideDatepicker()
                    },
                    today: function() {
                        window["DP_jQuery_" + dpuuid].datepicker._gotoToday(n)
                    },
                    selectDay: function() {
                        return window["DP_jQuery_" + dpuuid].datepicker._selectDay(n, +this.getAttribute("data-month"), +this.getAttribute("data-year"), this), !1
                    },
                    selectMonth: function() {
                        return window["DP_jQuery_" + dpuuid].datepicker._selectMonthYear(n, this, "M"), !1
                    },
                    selectYear: function() {
                        return window["DP_jQuery_" + dpuuid].datepicker._selectMonthYear(n, this, "Y"), !1
                    }
                };
                $(this).bind(this.getAttribute("data-event"), e[this.getAttribute("data-handler")])
            })
        },
        _generateHTML: function(e) {
            var t = new Date;
            t = this._daylightSavingAdjust(new Date(t.getFullYear(), t.getMonth(), t.getDate()));
            var n = this._get(e, "isRTL"),
                r = this._get(e, "showButtonPanel"),
                i = this._get(e, "hideIfNoPrevNext"),
                s = this._get(e, "navigationAsDateFormat"),
                o = this._getNumberOfMonths(e),
                u = this._get(e, "showCurrentAtPos"),
                a = this._get(e, "stepMonths"),
                f = o[0] != 1 || o[1] != 1,
                l = this._daylightSavingAdjust(e.currentDay ? new Date(e.currentYear, e.currentMonth, e.currentDay) : new Date(9999, 9, 9)),
                c = this._getMinMaxDate(e, "min"),
                h = this._getMinMaxDate(e, "max"),
                p = e.drawMonth - u,
                d = e.drawYear;
            p < 0 && (p += 12, d--);
            if (h) {
                var v = this._daylightSavingAdjust(new Date(h.getFullYear(), h.getMonth() - o[0] * o[1] + 1, h.getDate()));
                v = c && v < c ? c : v;
                while (this._daylightSavingAdjust(new Date(d, p, 1)) > v) p--, p < 0 && (p = 11, d--)
            }
            e.drawMonth = p, e.drawYear = d;
            var m = this._get(e, "prevText");
            m = s ? this.formatDate(m, this._daylightSavingAdjust(new Date(d, p - a, 1)), this._getFormatConfig(e)) : m;
            var g = this._canAdjustMonth(e, -1, d, p) ? '<a class="ui-datepicker-prev ui-corner-all" data-handler="prev" data-event="click" title="' + m + '"><span class="ui-icon ui-icon-circle-triangle-' + (n ? "e" : "w") + '">' + m + "</span></a>" : i ? "" : '<a class="ui-datepicker-prev ui-corner-all ui-state-disabled" title="' + m + '"><span class="ui-icon ui-icon-circle-triangle-' + (n ? "e" : "w") + '">' + m + "</span></a>",
                y = this._get(e, "nextText");
            y = s ? this.formatDate(y, this._daylightSavingAdjust(new Date(d, p + a, 1)), this._getFormatConfig(e)) : y;
            var b = this._canAdjustMonth(e, 1, d, p) ? '<a class="ui-datepicker-next ui-corner-all" data-handler="next" data-event="click" title="' + y + '"><span class="ui-icon ui-icon-circle-triangle-' + (n ? "w" : "e") + '">' + y + "</span></a>" : i ? "" : '<a class="ui-datepicker-next ui-corner-all ui-state-disabled" title="' + y + '"><span class="ui-icon ui-icon-circle-triangle-' + (n ? "w" : "e") + '">' + y + "</span></a>",
                w = this._get(e, "currentText"),
                E = this._get(e, "gotoCurrent") && e.currentDay ? l : t;
            w = s ? this.formatDate(w, E, this._getFormatConfig(e)) : w;
            var S = e.inline ? "" : '<button type="button" class="ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all" data-handler="hide" data-event="click">' + this._get(e, "closeText") + "</button>",
                x = r ? '<div class="ui-datepicker-buttonpane ui-widget-content">' + (n ? S : "") + (this._isInRange(e, E) ? '<button type="button" class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all" data-handler="today" data-event="click">' + w + "</button>" : "") + (n ? "" : S) + "</div>" : "",
                T = parseInt(this._get(e, "firstDay"), 10);
            T = isNaN(T) ? 0 : T;
            var N = this._get(e, "showWeek"),
                C = this._get(e, "dayNames"),
                k = this._get(e, "dayNamesShort"),
                L = this._get(e, "dayNamesMin"),
                A = this._get(e, "monthNames"),
                O = this._get(e, "monthNamesShort"),
                M = this._get(e, "beforeShowDay"),
                _ = this._get(e, "showOtherMonths"),
                D = this._get(e, "selectOtherMonths"),
                P = this._get(e, "calculateWeek") || this.iso8601Week,
                H = this._getDefaultDate(e),
                B = "";
            for (var j = 0; j < o[0]; j++) {
                var F = "";
                this.maxRows = 4;
                for (var I = 0; I < o[1]; I++) {
                    var q = this._daylightSavingAdjust(new Date(d, p, e.selectedDay)),
                        R = " ui-corner-all",
                        U = "";
                    if (f) {
                        U += '<div class="ui-datepicker-group';
                        if (o[1] > 1) switch (I) {
                            case 0:
                                U += " ui-datepicker-group-first", R = " ui-corner-" + (n ? "right" : "left");
                                break;
                            case o[1] - 1:
                                U += " ui-datepicker-group-last", R = " ui-corner-" + (n ? "left" : "right");
                                break;
                            default:
                                U += " ui-datepicker-group-middle", R = ""
                        }
                        U += '">'
                    }
                    U += '<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix' + R + '">' + (/all|left/.test(R) && j == 0 ? n ? b : g : "") + (/all|right/.test(R) && j == 0 ? n ? g : b : "") + this._generateMonthYearHeader(e, p, d, c, h, j > 0 || I > 0, A, O) + '</div><table class="ui-datepicker-calendar"><thead>' + "<tr>";
                    var z = N ? '<th class="ui-datepicker-week-col">' + this._get(e, "weekHeader") + "</th>" : "";
                    for (var W = 0; W < 7; W++) {
                        var X = (W + T) % 7;
                        z += "<th" + ((W + T + 6) % 7 >= 5 ? ' class="ui-datepicker-week-end"' : "") + ">" + '<span title="' + C[X] + '">' + L[X] + "</span></th>"
                    }
                    U += z + "</tr></thead><tbody>";
                    var V = this._getDaysInMonth(d, p);
                    d == e.selectedYear && p == e.selectedMonth && (e.selectedDay = Math.min(e.selectedDay, V));
                    var J = (this._getFirstDayOfMonth(d, p) - T + 7) % 7,
                        K = Math.ceil((J + V) / 7),
                        Q = f ? this.maxRows > K ? this.maxRows : K : K;
                    this.maxRows = Q;
                    var G = this._daylightSavingAdjust(new Date(d, p, 1 - J));
                    for (var Y = 0; Y < Q; Y++) {
                        U += "<tr>";
                        var Z = N ? '<td class="ui-datepicker-week-col">' + this._get(e, "calculateWeek")(G) + "</td>" : "";
                        for (var W = 0; W < 7; W++) {
                            var et = M ? M.apply(e.input ? e.input[0] : null, [G]) : [!0, ""],
                                tt = G.getMonth() != p,
                                nt = tt && !D || !et[0] || c && G < c || h && G > h;
                            Z += '<td class="' + ((W + T + 6) % 7 >= 5 ? " ui-datepicker-week-end" : "") + (tt ? " ui-datepicker-other-month" : "") + (G.getTime() == q.getTime() && p == e.selectedMonth && e._keyEvent || H.getTime() == G.getTime() && H.getTime() == q.getTime() ? " " + this._dayOverClass : "") + (nt ? " " + this._unselectableClass + " ui-state-disabled" : "") + (tt && !_ ? "" : " " + et[1] + (G.getTime() == l.getTime() ? " " + this._currentClass : "") + (G.getTime() == t.getTime() ? " ui-datepicker-today" : "")) + '"' + ((!tt || _) && et[2] ? ' title="' + et[2] + '"' : "") + (nt ? "" : ' data-handler="selectDay" data-event="click" data-month="' + G.getMonth() + '" data-year="' + G.getFullYear() + '"') + ">" + (tt && !_ ? "&#xa0;" : nt ? '<span class="ui-state-default">' + G.getDate() + "</span>" : '<a class="ui-state-default' + (G.getTime() == t.getTime() ? " ui-state-highlight" : "") + (G.getTime() == l.getTime() ? " ui-state-active" : "") + (tt ? " ui-priority-secondary" : "") + '" href="#">' + G.getDate() + "</a>") + "</td>", G.setDate(G.getDate() + 1), G = this._daylightSavingAdjust(G)
                        }
                        U += Z + "</tr>"
                    }
                    p++, p > 11 && (p = 0, d++), U += "</tbody></table>" + (f ? "</div>" + (o[0] > 0 && I == o[1] - 1 ? '<div class="ui-datepicker-row-break"></div>' : "") : ""), F += U
                }
                B += F
            }
            return B += x + ($.ui.ie6 && !e.inline ? '<iframe src="javascript:false;" class="ui-datepicker-cover" frameborder="0"></iframe>' : ""), e._keyEvent = !1, B
        },
        _generateMonthYearHeader: function(e, t, n, r, i, s, o, u) {
            var a = this._get(e, "changeMonth"),
                f = this._get(e, "changeYear"),
                l = this._get(e, "showMonthAfterYear"),
                c = '<div class="ui-datepicker-title">',
                h = "";
            if (s || !a) h += '<span class="ui-datepicker-month">' + o[t] + "</span>";
            else {
                var p = r && r.getFullYear() == n,
                    d = i && i.getFullYear() == n;
                h += '<select class="ui-datepicker-month" data-handler="selectMonth" data-event="change">';
                for (var v = 0; v < 12; v++)(!p || v >= r.getMonth()) && (!d || v <= i.getMonth()) && (h += '<option value="' + v + '"' + (v == t ? ' selected="selected"' : "") + ">" + u[v] + "</option>");
                h += "</select>"
            }
            l || (c += h + (s || !a || !f ? "&#xa0;" : ""));
            if (!e.yearshtml) {
                e.yearshtml = "";
                if (s || !f) c += '<span class="ui-datepicker-year">' + n + "</span>";
                else {
                    var m = this._get(e, "yearRange").split(":"),
                        g = (new Date).getFullYear(),
                        y = function(e) {
                            var t = e.match(/c[+-].*/) ? n + parseInt(e.substring(1), 10) : e.match(/[+-].*/) ? g + parseInt(e, 10) : parseInt(e, 10);
                            return isNaN(t) ? g : t
                        },
                        b = y(m[0]),
                        w = Math.max(b, y(m[1] || ""));
                    b = r ? Math.max(b, r.getFullYear()) : b, w = i ? Math.min(w, i.getFullYear()) : w, e.yearshtml += '<select class="ui-datepicker-year" data-handler="selectYear" data-event="change">';
                    for (; b <= w; b++) e.yearshtml += '<option value="' + b + '"' + (b == n ? ' selected="selected"' : "") + ">" + b + "</option>";
                    e.yearshtml += "</select>", c += e.yearshtml, e.yearshtml = null
                }
            }
            return c += this._get(e, "yearSuffix"), l && (c += (s || !a || !f ? "&#xa0;" : "") + h), c += "</div>", c
        },
        _adjustInstDate: function(e, t, n) {
            var r = e.drawYear + (n == "Y" ? t : 0),
                i = e.drawMonth + (n == "M" ? t : 0),
                s = Math.min(e.selectedDay, this._getDaysInMonth(r, i)) + (n == "D" ? t : 0),
                o = this._restrictMinMax(e, this._daylightSavingAdjust(new Date(r, i, s)));
            e.selectedDay = o.getDate(), e.drawMonth = e.selectedMonth = o.getMonth(), e.drawYear = e.selectedYear = o.getFullYear(), (n == "M" || n == "Y") && this._notifyChange(e)
        },
        _restrictMinMax: function(e, t) {
            var n = this._getMinMaxDate(e, "min"),
                r = this._getMinMaxDate(e, "max"),
                i = n && t < n ? n : t;
            return i = r && i > r ? r : i, i
        },
        _notifyChange: function(e) {
            var t = this._get(e, "onChangeMonthYear");
            t && t.apply(e.input ? e.input[0] : null, [e.selectedYear, e.selectedMonth + 1, e])
        },
        _getNumberOfMonths: function(e) {
            var t = this._get(e, "numberOfMonths");
            return t == null ? [1, 1] : typeof t == "number" ? [1, t] : t
        },
        _getMinMaxDate: function(e, t) {
            return this._determineDate(e, this._get(e, t + "Date"), null)
        },
        _getDaysInMonth: function(e, t) {
            return 32 - this._daylightSavingAdjust(new Date(e, t, 32)).getDate()
        },
        _getFirstDayOfMonth: function(e, t) {
            return (new Date(e, t, 1)).getDay()
        },
        _canAdjustMonth: function(e, t, n, r) {
            var i = this._getNumberOfMonths(e),
                s = this._daylightSavingAdjust(new Date(n, r + (t < 0 ? t : i[0] * i[1]), 1));
            return t < 0 && s.setDate(this._getDaysInMonth(s.getFullYear(), s.getMonth())), this._isInRange(e, s)
        },
        _isInRange: function(e, t) {
            var n = this._getMinMaxDate(e, "min"),
                r = this._getMinMaxDate(e, "max");
            return (!n || t.getTime() >= n.getTime()) && (!r || t.getTime() <= r.getTime())
        },
        _getFormatConfig: function(e) {
            var t = this._get(e, "shortYearCutoff");
            return t = typeof t != "string" ? t : (new Date).getFullYear() % 100 + parseInt(t, 10), {
                shortYearCutoff: t,
                dayNamesShort: this._get(e, "dayNamesShort"),
                dayNames: this._get(e, "dayNames"),
                monthNamesShort: this._get(e, "monthNamesShort"),
                monthNames: this._get(e, "monthNames")
            }
        },
        _formatDate: function(e, t, n, r) {
            t || (e.currentDay = e.selectedDay, e.currentMonth = e.selectedMonth, e.currentYear = e.selectedYear);
            var i = t ? typeof t == "object" ? t : this._daylightSavingAdjust(new Date(r, n, t)) : this._daylightSavingAdjust(new Date(e.currentYear, e.currentMonth, e.currentDay));
            return this.formatDate(this._get(e, "dateFormat"), i, this._getFormatConfig(e))
        }
    }), $.fn.datepicker = function(e) {
        if (!this.length) return this;
        $.datepicker.initialized || ($(document).mousedown($.datepicker._checkExternalClick).find(document.body).append($.datepicker.dpDiv), $.datepicker.initialized = !0);
        var t = Array.prototype.slice.call(arguments, 1);
        return typeof e != "string" || e != "isDisabled" && e != "getDate" && e != "widget" ? e == "option" && arguments.length == 2 && typeof arguments[1] == "string" ? $.datepicker["_" + e + "Datepicker"].apply($.datepicker, [this[0]].concat(t)) : this.each(function() {
            typeof e == "string" ? $.datepicker["_" + e + "Datepicker"].apply($.datepicker, [this].concat(t)) : $.datepicker._attachDatepicker(this, e)
        }) : $.datepicker["_" + e + "Datepicker"].apply($.datepicker, [this[0]].concat(t))
    }, $.datepicker = new Datepicker, $.datepicker.initialized = !1, $.datepicker.uuid = (new Date).getTime(), $.datepicker.version = "1.9.2", window["DP_jQuery_" + dpuuid] = $
})(jQuery);
(function(e, t) {
    var n = "ui-dialog ui-widget ui-widget-content ui-corner-all ",
        r = {
            buttons: !0,
            height: !0,
            maxHeight: !0,
            maxWidth: !0,
            minHeight: !0,
            minWidth: !0,
            width: !0
        },
        i = {
            maxHeight: !0,
            maxWidth: !0,
            minHeight: !0,
            minWidth: !0
        };
    e.widget("ui.dialog", {
        version: "1.9.2",
        options: {
            autoOpen: !0,
            buttons: {},
            closeOnEscape: !0,
            closeText: "close",
            dialogClass: "",
            draggable: !0,
            hide: null,
            height: "auto",
            maxHeight: !1,
            maxWidth: !1,
            minHeight: 150,
            minWidth: 150,
            modal: !1,
            position: {
                my: "center",
                at: "center",
                of: window,
                collision: "fit",
                using: function(t) {
                    var n = e(this).css(t).offset().top;
                    n < 0 && e(this).css("top", t.top - n)
                }
            },
            resizable: !0,
            show: null,
            stack: !0,
            title: "",
            width: 300,
            zIndex: 1e3
        },
        _create: function() {
            this.originalTitle = this.element.attr("title"), typeof this.originalTitle != "string" && (this.originalTitle = ""), this.oldPosition = {
                parent: this.element.parent(),
                index: this.element.parent().children().index(this.element)
            }, this.options.title = this.options.title || this.originalTitle;
            var t = this,
                r = this.options,
                i = r.title || "&#160;",
                s, o, u, a, f;
            s = (this.uiDialog = e("<div>")).addClass(n + r.dialogClass).css({
                display: "none",
                outline: 0,
                zIndex: r.zIndex
            }).attr("tabIndex", -1).keydown(function(n) {
                r.closeOnEscape && !n.isDefaultPrevented() && n.keyCode && n.keyCode === e.ui.keyCode.ESCAPE && (t.close(n), n.preventDefault())
            }).mousedown(function(e) {
                t.moveToTop(!1, e)
            }).appendTo("body"), this.element.show().removeAttr("title").addClass("ui-dialog-content ui-widget-content").appendTo(s), o = (this.uiDialogTitlebar = e("<div>")).addClass("ui-dialog-titlebar  ui-widget-header  ui-corner-all  ui-helper-clearfix").bind("mousedown", function() {
                s.focus()
            }).prependTo(s), u = e("<a href='#'></a>").addClass("ui-dialog-titlebar-close  ui-corner-all").attr("role", "button").click(function(e) {
                e.preventDefault(), t.close(e)
            }).appendTo(o), (this.uiDialogTitlebarCloseText = e("<span>")).addClass("ui-icon ui-icon-closethick").text(r.closeText).appendTo(u), a = e("<span>").uniqueId().addClass("ui-dialog-title").html(i).prependTo(o), f = (this.uiDialogButtonPane = e("<div>")).addClass("ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"), (this.uiButtonSet = e("<div>")).addClass("ui-dialog-buttonset").appendTo(f), s.attr({
                role: "dialog",
                "aria-labelledby": a.attr("id")
            }), o.find("*").add(o).disableSelection(), this._hoverable(u), this._focusable(u), r.draggable && e.fn.draggable && this._makeDraggable(), r.resizable && e.fn.resizable && this._makeResizable(), this._createButtons(r.buttons), this._isOpen = !1, e.fn.bgiframe && s.bgiframe(), this._on(s, {
                keydown: function(t) {
                    if (!r.modal || t.keyCode !== e.ui.keyCode.TAB) return;
                    var n = e(":tabbable", s),
                        i = n.filter(":first"),
                        o = n.filter(":last");
                    if (t.target === o[0] && !t.shiftKey) return i.focus(1), !1;
                    if (t.target === i[0] && t.shiftKey) return o.focus(1), !1
                }
            })
        },
        _init: function() {
            this.options.autoOpen && this.open()
        },
        _destroy: function() {
            var e, t = this.oldPosition;
            this.overlay && this.overlay.destroy(), this.uiDialog.hide(), this.element.removeClass("ui-dialog-content ui-widget-content").hide().appendTo("body"), this.uiDialog.remove(), this.originalTitle && this.element.attr("title", this.originalTitle), e = t.parent.children().eq(t.index), e.length && e[0] !== this.element[0] ? e.before(this.element) : t.parent.append(this.element)
        },
        widget: function() {
            return this.uiDialog
        },
        close: function(t) {
            var n = this,
                r, i;
            if (!this._isOpen) return;
            if (!1 === this._trigger("beforeClose", t)) return;
            return this._isOpen = !1, this.overlay && this.overlay.destroy(), this.options.hide ? this._hide(this.uiDialog, this.options.hide, function() {
                n._trigger("close", t)
            }) : (this.uiDialog.hide(), this._trigger("close", t)), e.ui.dialog.overlay.resize(), this.options.modal && (r = 0, e(".ui-dialog").each(function() {
                this !== n.uiDialog[0] && (i = e(this).css("z-index"), isNaN(i) || (r = Math.max(r, i)))
            }), e.ui.dialog.maxZ = r), this
        },
        isOpen: function() {
            return this._isOpen
        },
        moveToTop: function(t, n) {
            var r = this.options,
                i;
            return r.modal && !t || !r.stack && !r.modal ? this._trigger("focus", n) : (r.zIndex > e.ui.dialog.maxZ && (e.ui.dialog.maxZ = r.zIndex), this.overlay && (e.ui.dialog.maxZ += 1, e.ui.dialog.overlay.maxZ = e.ui.dialog.maxZ, this.overlay.$el.css("z-index", e.ui.dialog.overlay.maxZ)), i = {
                scrollTop: this.element.scrollTop(),
                scrollLeft: this.element.scrollLeft()
            }, e.ui.dialog.maxZ += 1, this.uiDialog.css("z-index", e.ui.dialog.maxZ), this.element.attr(i), this._trigger("focus", n), this)
        },
        open: function() {
            if (this._isOpen) return;
            var t, n = this.options,
                r = this.uiDialog;
            return this._size(), this._position(n.position), r.show(n.show), this.overlay = n.modal ? new e.ui.dialog.overlay(this) : null, this.moveToTop(!0), t = this.element.find(":tabbable"), t.length || (t = this.uiDialogButtonPane.find(":tabbable"), t.length || (t = r)), t.eq(0).focus(), this._isOpen = !0, this._trigger("open"), this
        },
        _createButtons: function(t) {
            var n = this,
                r = !1;
            this.uiDialogButtonPane.remove(), this.uiButtonSet.empty(), typeof t == "object" && t !== null && e.each(t, function() {
                return !(r = !0)
            }), r ? (e.each(t, function(t, r) {
                var i, s;
                r = e.isFunction(r) ? {
                    click: r,
                    text: t
                } : r, r = e.extend({
                    type: "button"
                }, r), s = r.click, r.click = function() {
                    s.apply(n.element[0], arguments)
                }, i = e("<button></button>", r).appendTo(n.uiButtonSet), e.fn.button && i.button()
            }), this.uiDialog.addClass("ui-dialog-buttons"), this.uiDialogButtonPane.appendTo(this.uiDialog)) : this.uiDialog.removeClass("ui-dialog-buttons")
        },
        _makeDraggable: function() {
            function r(e) {
                return {
                    position: e.position,
                    offset: e.offset
                }
            }
            var t = this,
                n = this.options;
            this.uiDialog.draggable({
                cancel: ".ui-dialog-content, .ui-dialog-titlebar-close",
                handle: ".ui-dialog-titlebar",
                containment: "document",
                start: function(n, i) {
                    e(this).addClass("ui-dialog-dragging"), t._trigger("dragStart", n, r(i))
                },
                drag: function(e, n) {
                    t._trigger("drag", e, r(n))
                },
                stop: function(i, s) {
                    n.position = [s.position.left - t.document.scrollLeft(), s.position.top - t.document.scrollTop()], e(this).removeClass("ui-dialog-dragging"), t._trigger("dragStop", i, r(s)), e.ui.dialog.overlay.resize()
                }
            })
        },
        _makeResizable: function(n) {
            function u(e) {
                return {
                    originalPosition: e.originalPosition,
                    originalSize: e.originalSize,
                    position: e.position,
                    size: e.size
                }
            }
            n = n === t ? this.options.resizable : n;
            var r = this,
                i = this.options,
                s = this.uiDialog.css("position"),
                o = typeof n == "string" ? n : "n,e,s,w,se,sw,ne,nw";
            this.uiDialog.resizable({
                cancel: ".ui-dialog-content",
                containment: "document",
                alsoResize: this.element,
                maxWidth: i.maxWidth,
                maxHeight: i.maxHeight,
                minWidth: i.minWidth,
                minHeight: this._minHeight(),
                handles: o,
                start: function(t, n) {
                    e(this).addClass("ui-dialog-resizing"), r._trigger("resizeStart", t, u(n))
                },
                resize: function(e, t) {
                    r._trigger("resize", e, u(t))
                },
                stop: function(t, n) {
                    e(this).removeClass("ui-dialog-resizing"), i.height = e(this).height(), i.width = e(this).width(), r._trigger("resizeStop", t, u(n)), e.ui.dialog.overlay.resize()
                }
            }).css("position", s).find(".ui-resizable-se").addClass("ui-icon ui-icon-grip-diagonal-se")
        },
        _minHeight: function() {
            var e = this.options;
            return e.height === "auto" ? e.minHeight : Math.min(e.minHeight, e.height)
        },
        _position: function(t) {
            var n = [],
                r = [0, 0],
                i;
            if (t) {
                if (typeof t == "string" || typeof t == "object" && "0" in t) n = t.split ? t.split(" ") : [t[0], t[1]], n.length === 1 && (n[1] = n[0]), e.each(["left", "top"], function(e, t) {
                    +n[e] === n[e] && (r[e] = n[e], n[e] = t)
                }), t = {
                    my: n[0] + (r[0] < 0 ? r[0] : "+" + r[0]) + " " + n[1] + (r[1] < 0 ? r[1] : "+" + r[1]),
                    at: n.join(" ")
                };
                t = e.extend({}, e.ui.dialog.prototype.options.position, t)
            } else t = e.ui.dialog.prototype.options.position;
            i = this.uiDialog.is(":visible"), i || this.uiDialog.show(), this.uiDialog.position(t), i || this.uiDialog.hide()
        },
        _setOptions: function(t) {
            var n = this,
                s = {},
                o = !1;
            e.each(t, function(e, t) {
                n._setOption(e, t), e in r && (o = !0), e in i && (s[e] = t)
            }), o && this._size(), this.uiDialog.is(":data(resizable)") && this.uiDialog.resizable("option", s)
        },
        _setOption: function(t, r) {
            var i, s, o = this.uiDialog;
            switch (t) {
                case "buttons":
                    this._createButtons(r);
                    break;
                case "closeText":
                    this.uiDialogTitlebarCloseText.text("" + r);
                    break;
                case "dialogClass":
                    o.removeClass(this.options.dialogClass).addClass(n + r);
                    break;
                case "disabled":
                    r ? o.addClass("ui-dialog-disabled") : o.removeClass("ui-dialog-disabled");
                    break;
                case "draggable":
                    i = o.is(":data(draggable)"), i && !r && o.draggable("destroy"), !i && r && this._makeDraggable();
                    break;
                case "position":
                    this._position(r);
                    break;
                case "resizable":
                    s = o.is(":data(resizable)"), s && !r && o.resizable("destroy"), s && typeof r == "string" && o.resizable("option", "handles", r), !s && r !== !1 && this._makeResizable(r);
                    break;
                case "title":
                    e(".ui-dialog-title", this.uiDialogTitlebar).html("" + (r || "&#160;"))
            }
            this._super(t, r)
        },
        _size: function() {
            var t, n, r, i = this.options,
                s = this.uiDialog.is(":visible");
            this.element.show().css({
                width: "auto",
                minHeight: 0,
                height: 0
            }), i.minWidth > i.width && (i.width = i.minWidth), t = this.uiDialog.css({
                height: "auto",
                width: i.width
            }).outerHeight(), n = Math.max(0, i.minHeight - t), i.height === "auto" ? e.support.minHeight ? this.element.css({
                minHeight: n,
                height: "auto"
            }) : (this.uiDialog.show(), r = this.element.css("height", "auto").height(), s || this.uiDialog.hide(), this.element.height(Math.max(r, n))) : this.element.height(Math.max(i.height - t, 0)), this.uiDialog.is(":data(resizable)") && this.uiDialog.resizable("option", "minHeight", this._minHeight())
        }
    }), e.extend(e.ui.dialog, {
        uuid: 0,
        maxZ: 0,
        getTitleId: function(e) {
            var t = e.attr("id");
            return t || (this.uuid += 1, t = this.uuid), "ui-dialog-title-" + t
        },
        overlay: function(t) {
            this.$el = e.ui.dialog.overlay.create(t)
        }
    }), e.extend(e.ui.dialog.overlay, {
        instances: [],
        oldInstances: [],
        maxZ: 0,
        events: e.map("focus,mousedown,mouseup,keydown,keypress,click".split(","), function(e) {
            return e + ".dialog-overlay"
        }).join(" "),
        create: function(t) {
            this.instances.length === 0 && (setTimeout(function() {
                e.ui.dialog.overlay.instances.length && e(document).bind(e.ui.dialog.overlay.events, function(t) {
                    if (e(t.target).zIndex() < e.ui.dialog.overlay.maxZ) return !1
                })
            }, 1), e(window).bind("resize.dialog-overlay", e.ui.dialog.overlay.resize));
            var n = this.oldInstances.pop() || e("<div>").addClass("ui-widget-overlay");
            return e(document).bind("keydown.dialog-overlay", function(r) {
                var i = e.ui.dialog.overlay.instances;
                i.length !== 0 && i[i.length - 1] === n && t.options.closeOnEscape && !r.isDefaultPrevented() && r.keyCode && r.keyCode === e.ui.keyCode.ESCAPE && (t.close(r), r.preventDefault())
            }), n.appendTo(document.body).css({
                width: this.width(),
                height: this.height()
            }), e.fn.bgiframe && n.bgiframe(), this.instances.push(n), n
        },
        destroy: function(t) {
            var n = e.inArray(t, this.instances),
                r = 0;
            n !== -1 && this.oldInstances.push(this.instances.splice(n, 1)[0]), this.instances.length === 0 && e([document, window]).unbind(".dialog-overlay"), t.height(0).width(0).remove(), e.each(this.instances, function() {
                r = Math.max(r, this.css("z-index"))
            }), this.maxZ = r
        },
        height: function() {
            var t, n;
            return e.ui.ie ? (t = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight), n = Math.max(document.documentElement.offsetHeight, document.body.offsetHeight), t < n ? e(window).height() + "px" : t + "px") : e(document).height() + "px"
        },
        width: function() {
            var t, n;
            return e.ui.ie ? (t = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth), n = Math.max(document.documentElement.offsetWidth, document.body.offsetWidth), t < n ? e(window).width() + "px" : t + "px") : e(document).width() + "px"
        },
        resize: function() {
            var t = e([]);
            e.each(e.ui.dialog.overlay.instances, function() {
                t = t.add(this)
            }), t.css({
                width: 0,
                height: 0
            }).css({
                width: e.ui.dialog.overlay.width(),
                height: e.ui.dialog.overlay.height()
            })
        }
    }), e.extend(e.ui.dialog.overlay.prototype, {
        destroy: function() {
            e.ui.dialog.overlay.destroy(this.$el)
        }
    })
})(jQuery);
(function(e, t) {
    var n = !1;
    e.widget("ui.menu", {
        version: "1.9.2",
        defaultElement: "<ul>",
        delay: 300,
        options: {
            icons: {
                submenu: "ui-icon-carat-1-e"
            },
            menus: "ul",
            position: {
                my: "left top",
                at: "right top"
            },
            role: "menu",
            blur: null,
            focus: null,
            select: null
        },
        _create: function() {
            this.activeMenu = this.element, this.element.uniqueId().addClass("ui-menu ui-widget ui-widget-content ui-corner-all").toggleClass("ui-menu-icons", !!this.element.find(".ui-icon").length).attr({
                role: this.options.role,
                tabIndex: 0
            }).bind("click" + this.eventNamespace, e.proxy(function(e) {
                this.options.disabled && e.preventDefault()
            }, this)), this.options.disabled && this.element.addClass("ui-state-disabled").attr("aria-disabled", "true"), this._on({
                "mousedown .ui-menu-item > a": function(e) {
                    e.preventDefault()
                },
                "click .ui-state-disabled > a": function(e) {
                    e.preventDefault()
                },
                "click .ui-menu-item:has(a)": function(t) {
                    var r = e(t.target).closest(".ui-menu-item");
                    !n && r.not(".ui-state-disabled").length && (n = !0, this.select(t), r.has(".ui-menu").length ? this.expand(t) : this.element.is(":focus") || (this.element.trigger("focus", [!0]), this.active && this.active.parents(".ui-menu").length === 1 && clearTimeout(this.timer)))
                },
                "mouseenter .ui-menu-item": function(t) {
                    var n = e(t.currentTarget);
                    n.siblings().children(".ui-state-active").removeClass("ui-state-active"), this.focus(t, n)
                },
                mouseleave: "collapseAll",
                "mouseleave .ui-menu": "collapseAll",
                focus: function(e, t) {
                    var n = this.active || this.element.children(".ui-menu-item").eq(0);
                    t || this.focus(e, n)
                },
                blur: function(t) {
                    this._delay(function() {
                        e.contains(this.element[0], this.document[0].activeElement) || this.collapseAll(t)
                    })
                },
                keydown: "_keydown"
            }), this.refresh(), this._on(this.document, {
                click: function(t) {
                    e(t.target).closest(".ui-menu").length || this.collapseAll(t), n = !1
                }
            })
        },
        _destroy: function() {
            this.element.removeAttr("aria-activedescendant").find(".ui-menu").andSelf().removeClass("ui-menu ui-widget ui-widget-content ui-corner-all ui-menu-icons").removeAttr("role").removeAttr("tabIndex").removeAttr("aria-labelledby").removeAttr("aria-expanded").removeAttr("aria-hidden").removeAttr("aria-disabled").removeUniqueId().show(), this.element.find(".ui-menu-item").removeClass("ui-menu-item").removeAttr("role").removeAttr("aria-disabled").children("a").removeUniqueId().removeClass("ui-corner-all ui-state-hover").removeAttr("tabIndex").removeAttr("role").removeAttr("aria-haspopup").children().each(function() {
                var t = e(this);
                t.data("ui-menu-submenu-carat") && t.remove()
            }), this.element.find(".ui-menu-divider").removeClass("ui-menu-divider ui-widget-content")
        },
        _keydown: function(t) {
            function a(e) {
                return e.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&")
            }
            var n, r, i, s, o, u = !0;
            switch (t.keyCode) {
                case e.ui.keyCode.PAGE_UP:
                    this.previousPage(t);
                    break;
                case e.ui.keyCode.PAGE_DOWN:
                    this.nextPage(t);
                    break;
                case e.ui.keyCode.HOME:
                    this._move("first", "first", t);
                    break;
                case e.ui.keyCode.END:
                    this._move("last", "last", t);
                    break;
                case e.ui.keyCode.UP:
                    this.previous(t);
                    break;
                case e.ui.keyCode.DOWN:
                    this.next(t);
                    break;
                case e.ui.keyCode.LEFT:
                    this.collapse(t);
                    break;
                case e.ui.keyCode.RIGHT:
                    this.active && !this.active.is(".ui-state-disabled") && this.expand(t);
                    break;
                case e.ui.keyCode.ENTER:
                case e.ui.keyCode.SPACE:
                    this._activate(t);
                    break;
                case e.ui.keyCode.ESCAPE:
                    this.collapse(t);
                    break;
                default:
                    u = !1, r = this.previousFilter || "", i = String.fromCharCode(t.keyCode), s = !1, clearTimeout(this.filterTimer), i === r ? s = !0 : i = r + i, o = new RegExp("^" + a(i), "i"), n = this.activeMenu.children(".ui-menu-item").filter(function() {
                        return o.test(e(this).children("a").text())
                    }), n = s && n.index(this.active.next()) !== -1 ? this.active.nextAll(".ui-menu-item") : n, n.length || (i = String.fromCharCode(t.keyCode), o = new RegExp("^" + a(i), "i"), n = this.activeMenu.children(".ui-menu-item").filter(function() {
                        return o.test(e(this).children("a").text())
                    })), n.length ? (this.focus(t, n), n.length > 1 ? (this.previousFilter = i, this.filterTimer = this._delay(function() {
                        delete this.previousFilter
                    }, 1e3)) : delete this.previousFilter) : delete this.previousFilter
            }
            u && t.preventDefault()
        },
        _activate: function(e) {
            this.active.is(".ui-state-disabled") || (this.active.children("a[aria-haspopup='true']").length ? this.expand(e) : this.select(e))
        },
        refresh: function() {
            var t, n = this.options.icons.submenu,
                r = this.element.find(this.options.menus);
            r.filter(":not(.ui-menu)").addClass("ui-menu ui-widget ui-widget-content ui-corner-all").hide().attr({
                role: this.options.role,
                "aria-hidden": "true",
                "aria-expanded": "false"
            }).each(function() {
                var t = e(this),
                    r = t.prev("a"),
                    i = e("<span>").addClass("ui-menu-icon ui-icon " + n).data("ui-menu-submenu-carat", !0);
                r.attr("aria-haspopup", "true").prepend(i), t.attr("aria-labelledby", r.attr("id"))
            }), t = r.add(this.element), t.children(":not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role", "presentation").children("a").uniqueId().addClass("ui-corner-all").attr({
                tabIndex: -1,
                role: this._itemRole()
            }), t.children(":not(.ui-menu-item)").each(function() {
                var t = e(this);
                /[^\-—–\s]/.test(t.text()) || t.addClass("ui-widget-content ui-menu-divider")
            }), t.children(".ui-state-disabled").attr("aria-disabled", "true"), this.active && !e.contains(this.element[0], this.active[0]) && this.blur()
        },
        _itemRole: function() {
            return {
                menu: "menuitem",
                listbox: "option"
            } [this.options.role]
        },
        focus: function(e, t) {
            var n, r;
            this.blur(e, e && e.type === "focus"), this._scrollIntoView(t), this.active = t.first(), r = this.active.children("a").addClass("ui-state-focus"), this.options.role && this.element.attr("aria-activedescendant", r.attr("id")), this.active.parent().closest(".ui-menu-item").children("a:first").addClass("ui-state-active"), e && e.type === "keydown" ? this._close() : this.timer = this._delay(function() {
                this._close()
            }, this.delay), n = t.children(".ui-menu"), n.length && /^mouse/.test(e.type) && this._startOpening(n), this.activeMenu = t.parent(), this._trigger("focus", e, {
                item: t
            })
        },
        _scrollIntoView: function(t) {
            var n, r, i, s, o, u;
            this._hasScroll() && (n = parseFloat(e.css(this.activeMenu[0], "borderTopWidth")) || 0, r = parseFloat(e.css(this.activeMenu[0], "paddingTop")) || 0, i = t.offset().top - this.activeMenu.offset().top - n - r, s = this.activeMenu.scrollTop(), o = this.activeMenu.height(), u = t.height(), i < 0 ? this.activeMenu.scrollTop(s + i) : i + u > o && this.activeMenu.scrollTop(s + i - o + u))
        },
        blur: function(e, t) {
            t || clearTimeout(this.timer);
            if (!this.active) return;
            this.active.children("a").removeClass("ui-state-focus"), this.active = null, this._trigger("blur", e, {
                item: this.active
            })
        },
        _startOpening: function(e) {
            clearTimeout(this.timer);
            if (e.attr("aria-hidden") !== "true") return;
            this.timer = this._delay(function() {
                this._close(), this._open(e)
            }, this.delay)
        },
        _open: function(t) {
            var n = e.extend({
                of: this.active
            }, this.options.position);
            clearTimeout(this.timer), this.element.find(".ui-menu").not(t.parents(".ui-menu")).hide().attr("aria-hidden", "true"), t.show().removeAttr("aria-hidden").attr("aria-expanded", "true").position(n)
        },
        collapseAll: function(t, n) {
            clearTimeout(this.timer), this.timer = this._delay(function() {
                var r = n ? this.element : e(t && t.target).closest(this.element.find(".ui-menu"));
                r.length || (r = this.element), this._close(r), this.blur(t), this.activeMenu = r
            }, this.delay)
        },
        _close: function(e) {
            e || (e = this.active ? this.active.parent() : this.element), e.find(".ui-menu").hide().attr("aria-hidden", "true").attr("aria-expanded", "false").end().find("a.ui-state-active").removeClass("ui-state-active")
        },
        collapse: function(e) {
            var t = this.active && this.active.parent().closest(".ui-menu-item", this.element);
            t && t.length && (this._close(), this.focus(e, t))
        },
        expand: function(e) {
            var t = this.active && this.active.children(".ui-menu ").children(".ui-menu-item").first();
            t && t.length && (this._open(t.parent()), this._delay(function() {
                this.focus(e, t)
            }))
        },
        next: function(e) {
            this._move("next", "first", e)
        },
        previous: function(e) {
            this._move("prev", "last", e)
        },
        isFirstItem: function() {
            return this.active && !this.active.prevAll(".ui-menu-item").length
        },
        isLastItem: function() {
            return this.active && !this.active.nextAll(".ui-menu-item").length
        },
        _move: function(e, t, n) {
            var r;
            this.active && (e === "first" || e === "last" ? r = this.active[e === "first" ? "prevAll" : "nextAll"](".ui-menu-item").eq(-1) : r = this.active[e + "All"](".ui-menu-item").eq(0));
            if (!r || !r.length || !this.active) r = this.activeMenu.children(".ui-menu-item")[t]();
            this.focus(n, r)
        },
        nextPage: function(t) {
            var n, r, i;
            if (!this.active) {
                this.next(t);
                return
            }
            if (this.isLastItem()) return;
            this._hasScroll() ? (r = this.active.offset().top, i = this.element.height(), this.active.nextAll(".ui-menu-item").each(function() {
                return n = e(this), n.offset().top - r - i < 0
            }), this.focus(t, n)) : this.focus(t, this.activeMenu.children(".ui-menu-item")[this.active ? "last" : "first"]())
        },
        previousPage: function(t) {
            var n, r, i;
            if (!this.active) {
                this.next(t);
                return
            }
            if (this.isFirstItem()) return;
            this._hasScroll() ? (r = this.active.offset().top, i = this.element.height(), this.active.prevAll(".ui-menu-item").each(function() {
                return n = e(this), n.offset().top - r + i > 0
            }), this.focus(t, n)) : this.focus(t, this.activeMenu.children(".ui-menu-item").first())
        },
        _hasScroll: function() {
            return this.element.outerHeight() < this.element.prop("scrollHeight")
        },
        select: function(t) {
            this.active = this.active || e(t.target).closest(".ui-menu-item");
            var n = {
                item: this.active
            };
            this.active.has(".ui-menu").length || this.collapseAll(t, !0), this._trigger("select", t, n)
        }
    })
})(jQuery);
(function(e, t) {
    e.widget("ui.progressbar", {
        version: "1.9.2",
        options: {
            value: 0,
            max: 100
        },
        min: 0,
        _create: function() {
            this.element.addClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").attr({
                role: "progressbar",
                "aria-valuemin": this.min,
                "aria-valuemax": this.options.max,
                "aria-valuenow": this._value()
            }), this.valueDiv = e("<div class='ui-progressbar-value ui-widget-header ui-corner-left'></div>").appendTo(this.element), this.oldValue = this._value(), this._refreshValue()
        },
        _destroy: function() {
            this.element.removeClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow"), this.valueDiv.remove()
        },
        value: function(e) {
            return e === t ? this._value() : (this._setOption("value", e), this)
        },
        _setOption: function(e, t) {
            e === "value" && (this.options.value = t, this._refreshValue(), this._value() === this.options.max && this._trigger("complete")), this._super(e, t)
        },
        _value: function() {
            var e = this.options.value;
            return typeof e != "number" && (e = 0), Math.min(this.options.max, Math.max(this.min, e))
        },
        _percentage: function() {
            return 100 * this._value() / this.options.max
        },
        _refreshValue: function() {
            var e = this.value(),
                t = this._percentage();
            this.oldValue !== e && (this.oldValue = e, this._trigger("change")), this.valueDiv.toggle(e > this.min).toggleClass("ui-corner-right", e === this.options.max).width(t.toFixed(0) + "%"), this.element.attr("aria-valuenow", e)
        }
    })
})(jQuery);
(function(e, t) {
    function i() {
        return ++n
    }

    function s(e) {
        return e.hash.length > 1 && e.href.replace(r, "") === location.href.replace(r, "").replace(/\s/g, "%20")
    }
    var n = 0,
        r = /#.*$/;
    e.widget("ui.tabs", {
        version: "1.9.2",
        delay: 300,
        options: {
            active: null,
            collapsible: !1,
            event: "click",
            heightStyle: "content",
            hide: null,
            show: null,
            activate: null,
            beforeActivate: null,
            beforeLoad: null,
            load: null
        },
        _create: function() {
            var t = this,
                n = this.options,
                r = n.active,
                i = location.hash.substring(1);
            this.running = !1, this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all").toggleClass("ui-tabs-collapsible", n.collapsible).delegate(".ui-tabs-nav > li", "mousedown" + this.eventNamespace, function(t) {
                e(this).is(".ui-state-disabled") && t.preventDefault()
            }).delegate(".ui-tabs-anchor", "focus" + this.eventNamespace, function() {
                e(this).closest("li").is(".ui-state-disabled") && this.blur()
            }), this._processTabs();
            if (r === null) {
                i && this.tabs.each(function(t, n) {
                    if (e(n).attr("aria-controls") === i) return r = t, !1
                }), r === null && (r = this.tabs.index(this.tabs.filter(".ui-tabs-active")));
                if (r === null || r === -1) r = this.tabs.length ? 0 : !1
            }
            r !== !1 && (r = this.tabs.index(this.tabs.eq(r)), r === -1 && (r = n.collapsible ? !1 : 0)), n.active = r, !n.collapsible && n.active === !1 && this.anchors.length && (n.active = 0), e.isArray(n.disabled) && (n.disabled = e.unique(n.disabled.concat(e.map(this.tabs.filter(".ui-state-disabled"), function(e) {
                return t.tabs.index(e)
            }))).sort()), this.options.active !== !1 && this.anchors.length ? this.active = this._findActive(this.options.active) : this.active = e(), this._refresh(), this.active.length && this.load(n.active)
        },
        _getCreateEventData: function() {
            return {
                tab: this.active,
                panel: this.active.length ? this._getPanelForTab(this.active) : e()
            }
        },
        _tabKeydown: function(t) {
            var n = e(this.document[0].activeElement).closest("li"),
                r = this.tabs.index(n),
                i = !0;
            if (this._handlePageNav(t)) return;
            switch (t.keyCode) {
                case e.ui.keyCode.RIGHT:
                case e.ui.keyCode.DOWN:
                    r++;
                    break;
                case e.ui.keyCode.UP:
                case e.ui.keyCode.LEFT:
                    i = !1, r--;
                    break;
                case e.ui.keyCode.END:
                    r = this.anchors.length - 1;
                    break;
                case e.ui.keyCode.HOME:
                    r = 0;
                    break;
                case e.ui.keyCode.SPACE:
                    t.preventDefault(), clearTimeout(this.activating), this._activate(r);
                    return;
                case e.ui.keyCode.ENTER:
                    t.preventDefault(), clearTimeout(this.activating), this._activate(r === this.options.active ? !1 : r);
                    return;
                default:
                    return
            }
            t.preventDefault(), clearTimeout(this.activating), r = this._focusNextTab(r, i), t.ctrlKey || (n.attr("aria-selected", "false"), this.tabs.eq(r).attr("aria-selected", "true"), this.activating = this._delay(function() {
                this.option("active", r)
            }, this.delay))
        },
        _panelKeydown: function(t) {
            if (this._handlePageNav(t)) return;
            t.ctrlKey && t.keyCode === e.ui.keyCode.UP && (t.preventDefault(), this.active.focus())
        },
        _handlePageNav: function(t) {
            if (t.altKey && t.keyCode === e.ui.keyCode.PAGE_UP) return this._activate(this._focusNextTab(this.options.active - 1, !1)), !0;
            if (t.altKey && t.keyCode === e.ui.keyCode.PAGE_DOWN) return this._activate(this._focusNextTab(this.options.active + 1, !0)), !0
        },
        _findNextTab: function(t, n) {
            function i() {
                return t > r && (t = 0), t < 0 && (t = r), t
            }
            var r = this.tabs.length - 1;
            while (e.inArray(i(), this.options.disabled) !== -1) t = n ? t + 1 : t - 1;
            return t
        },
        _focusNextTab: function(e, t) {
            return e = this._findNextTab(e, t), this.tabs.eq(e).focus(), e
        },
        _setOption: function(e, t) {
            if (e === "active") {
                this._activate(t);
                return
            }
            if (e === "disabled") {
                this._setupDisabled(t);
                return
            }
            this._super(e, t), e === "collapsible" && (this.element.toggleClass("ui-tabs-collapsible", t), !t && this.options.active === !1 && this._activate(0)), e === "event" && this._setupEvents(t), e === "heightStyle" && this._setupHeightStyle(t)
        },
        _tabId: function(e) {
            return e.attr("aria-controls") || "ui-tabs-" + i()
        },
        _sanitizeSelector: function(e) {
            return e ? e.replace(/[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g, "\\$&") : ""
        },
        refresh: function() {
            var t = this.options,
                n = this.tablist.children(":has(a[href])");
            t.disabled = e.map(n.filter(".ui-state-disabled"), function(e) {
                return n.index(e)
            }), this._processTabs(), t.active === !1 || !this.anchors.length ? (t.active = !1, this.active = e()) : this.active.length && !e.contains(this.tablist[0], this.active[0]) ? this.tabs.length === t.disabled.length ? (t.active = !1, this.active = e()) : this._activate(this._findNextTab(Math.max(0, t.active - 1), !1)) : t.active = this.tabs.index(this.active), this._refresh()
        },
        _refresh: function() {
            this._setupDisabled(this.options.disabled), this._setupEvents(this.options.event), this._setupHeightStyle(this.options.heightStyle), this.tabs.not(this.active).attr({
                "aria-selected": "false",
                tabIndex: -1
            }), this.panels.not(this._getPanelForTab(this.active)).hide().attr({
                "aria-expanded": "false",
                "aria-hidden": "true"
            }), this.active.length ? (this.active.addClass("ui-tabs-active ui-state-active").attr({
                "aria-selected": "true",
                tabIndex: 0
            }), this._getPanelForTab(this.active).show().attr({
                "aria-expanded": "true",
                "aria-hidden": "false"
            })) : this.tabs.eq(0).attr("tabIndex", 0)
        },
        _processTabs: function() {
            var t = this;
            this.tablist = this._getList().addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").attr("role", "tablist"), this.tabs = this.tablist.find("> li:has(a[href])").addClass("ui-state-default ui-corner-top").attr({
                role: "tab",
                tabIndex: -1
            }), this.anchors = this.tabs.map(function() {
                return e("a", this)[0]
            }).addClass("ui-tabs-anchor").attr({
                role: "presentation",
                tabIndex: -1
            }), this.panels = e(), this.anchors.each(function(n, r) {
                var i, o, u, a = e(r).uniqueId().attr("id"),
                    f = e(r).closest("li"),
                    l = f.attr("aria-controls");
                s(r) ? (i = r.hash, o = t.element.find(t._sanitizeSelector(i))) : (u = t._tabId(f), i = "#" + u, o = t.element.find(i), o.length || (o = t._createPanel(u), o.insertAfter(t.panels[n - 1] || t.tablist)), o.attr("aria-live", "polite")), o.length && (t.panels = t.panels.add(o)), l && f.data("ui-tabs-aria-controls", l), f.attr({
                    "aria-controls": i.substring(1),
                    "aria-labelledby": a
                }), o.attr("aria-labelledby", a)
            }), this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").attr("role", "tabpanel")
        },
        _getList: function() {
            return this.element.find("ol,ul").eq(0)
        },
        _createPanel: function(t) {
            return e("<div>").attr("id", t).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").data("ui-tabs-destroy", !0)
        },
        _setupDisabled: function(t) {
            e.isArray(t) && (t.length ? t.length === this.anchors.length && (t = !0) : t = !1);
            for (var n = 0, r; r = this.tabs[n]; n++) t === !0 || e.inArray(n, t) !== -1 ? e(r).addClass("ui-state-disabled").attr("aria-disabled", "true") : e(r).removeClass("ui-state-disabled").removeAttr("aria-disabled");
            this.options.disabled = t
        },
        _setupEvents: function(t) {
            var n = {
                click: function(e) {
                    e.preventDefault()
                }
            };
            t && e.each(t.split(" "), function(e, t) {
                n[t] = "_eventHandler"
            }), this._off(this.anchors.add(this.tabs).add(this.panels)), this._on(this.anchors, n), this._on(this.tabs, {
                keydown: "_tabKeydown"
            }), this._on(this.panels, {
                keydown: "_panelKeydown"
            }), this._focusable(this.tabs), this._hoverable(this.tabs)
        },
        _setupHeightStyle: function(t) {
            var n, r, i = this.element.parent();
            t === "fill" ? (e.support.minHeight || (r = i.css("overflow"), i.css("overflow", "hidden")), n = i.height(), this.element.siblings(":visible").each(function() {
                var t = e(this),
                    r = t.css("position");
                if (r === "absolute" || r === "fixed") return;
                n -= t.outerHeight(!0)
            }), r && i.css("overflow", r), this.element.children().not(this.panels).each(function() {
                n -= e(this).outerHeight(!0)
            }), this.panels.each(function() {
                e(this).height(Math.max(0, n - e(this).innerHeight() + e(this).height()))
            }).css("overflow", "auto")) : t === "auto" && (n = 0, this.panels.each(function() {
                n = Math.max(n, e(this).height("").height())
            }).height(n))
        },
        _eventHandler: function(t) {
            var n = this.options,
                r = this.active,
                i = e(t.currentTarget),
                s = i.closest("li"),
                o = s[0] === r[0],
                u = o && n.collapsible,
                a = u ? e() : this._getPanelForTab(s),
                f = r.length ? this._getPanelForTab(r) : e(),
                l = {
                    oldTab: r,
                    oldPanel: f,
                    newTab: u ? e() : s,
                    newPanel: a
                };
            t.preventDefault();
            if (s.hasClass("ui-state-disabled") || s.hasClass("ui-tabs-loading") || this.running || o && !n.collapsible || this._trigger("beforeActivate", t, l) === !1) return;
            n.active = u ? !1 : this.tabs.index(s), this.active = o ? e() : s, this.xhr && this.xhr.abort(), !f.length && !a.length && e.error("jQuery UI Tabs: Mismatching fragment identifier."), a.length && this.load(this.tabs.index(s), t), this._toggle(t, l)
        },
        _toggle: function(t, n) {
            function o() {
                r.running = !1, r._trigger("activate", t, n)
            }

            function u() {
                n.newTab.closest("li").addClass("ui-tabs-active ui-state-active"), i.length && r.options.show ? r._show(i, r.options.show, o) : (i.show(), o())
            }
            var r = this,
                i = n.newPanel,
                s = n.oldPanel;
            this.running = !0, s.length && this.options.hide ? this._hide(s, this.options.hide, function() {
                n.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"), u()
            }) : (n.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"), s.hide(), u()), s.attr({
                "aria-expanded": "false",
                "aria-hidden": "true"
            }), n.oldTab.attr("aria-selected", "false"), i.length && s.length ? n.oldTab.attr("tabIndex", -1) : i.length && this.tabs.filter(function() {
                return e(this).attr("tabIndex") === 0
            }).attr("tabIndex", -1), i.attr({
                "aria-expanded": "true",
                "aria-hidden": "false"
            }), n.newTab.attr({
                "aria-selected": "true",
                tabIndex: 0
            })
        },
        _activate: function(t) {
            var n, r = this._findActive(t);
            if (r[0] === this.active[0]) return;
            r.length || (r = this.active), n = r.find(".ui-tabs-anchor")[0], this._eventHandler({
                target: n,
                currentTarget: n,
                preventDefault: e.noop
            })
        },
        _findActive: function(t) {
            return t === !1 ? e() : this.tabs.eq(t)
        },
        _getIndex: function(e) {
            return typeof e == "string" && (e = this.anchors.index(this.anchors.filter("[href$='" + e + "']"))), e
        },
        _destroy: function() {
            this.xhr && this.xhr.abort(), this.element.removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible"), this.tablist.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").removeAttr("role"), this.anchors.removeClass("ui-tabs-anchor").removeAttr("role").removeAttr("tabIndex").removeData("href.tabs").removeData("load.tabs").removeUniqueId(), this.tabs.add(this.panels).each(function() {
                e.data(this, "ui-tabs-destroy") ? e(this).remove() : e(this).removeClass("ui-state-default ui-state-active ui-state-disabled ui-corner-top ui-corner-bottom ui-widget-content ui-tabs-active ui-tabs-panel").removeAttr("tabIndex").removeAttr("aria-live").removeAttr("aria-busy").removeAttr("aria-selected").removeAttr("aria-labelledby").removeAttr("aria-hidden").removeAttr("aria-expanded").removeAttr("role")
            }), this.tabs.each(function() {
                var t = e(this),
                    n = t.data("ui-tabs-aria-controls");
                n ? t.attr("aria-controls", n) : t.removeAttr("aria-controls")
            }), this.panels.show(), this.options.heightStyle !== "content" && this.panels.css("height", "")
        },
        enable: function(n) {
            var r = this.options.disabled;
            if (r === !1) return;
            n === t ? r = !1 : (n = this._getIndex(n), e.isArray(r) ? r = e.map(r, function(e) {
                return e !== n ? e : null
            }) : r = e.map(this.tabs, function(e, t) {
                return t !== n ? t : null
            })), this._setupDisabled(r)
        },
        disable: function(n) {
            var r = this.options.disabled;
            if (r === !0) return;
            if (n === t) r = !0;
            else {
                n = this._getIndex(n);
                if (e.inArray(n, r) !== -1) return;
                e.isArray(r) ? r = e.merge([n], r).sort() : r = [n]
            }
            this._setupDisabled(r)
        },
        load: function(t, n) {
            t = this._getIndex(t);
            var r = this,
                i = this.tabs.eq(t),
                o = i.find(".ui-tabs-anchor"),
                u = this._getPanelForTab(i),
                a = {
                    tab: i,
                    panel: u
                };
            if (s(o[0])) return;
            this.xhr = e.ajax(this._ajaxSettings(o, n, a)), this.xhr && this.xhr.statusText !== "canceled" && (i.addClass("ui-tabs-loading"), u.attr("aria-busy", "true"), this.xhr.success(function(e) {
                setTimeout(function() {
                    u.html(e), r._trigger("load", n, a)
                }, 1)
            }).complete(function(e, t) {
                setTimeout(function() {
                    t === "abort" && r.panels.stop(!1, !0), i.removeClass("ui-tabs-loading"), u.removeAttr("aria-busy"), e === r.xhr && delete r.xhr
                }, 1)
            }))
        },
        _ajaxSettings: function(t, n, r) {
            var i = this;
            return {
                url: t.attr("href"),
                beforeSend: function(t, s) {
                    return i._trigger("beforeLoad", n, e.extend({
                        jqXHR: t,
                        ajaxSettings: s
                    }, r))
                }
            }
        },
        _getPanelForTab: function(t) {
            var n = e(t).attr("aria-controls");
            return this.element.find(this._sanitizeSelector("#" + n))
        }
    }), e.uiBackCompat !== !1 && (e.ui.tabs.prototype._ui = function(e, t) {
        return {
            tab: e,
            panel: t,
            index: this.anchors.index(e)
        }
    }, e.widget("ui.tabs", e.ui.tabs, {
        url: function(e, t) {
            this.anchors.eq(e).attr("href", t)
        }
    }), e.widget("ui.tabs", e.ui.tabs, {
        options: {
            ajaxOptions: null,
            cache: !1
        },
        _create: function() {
            this._super();
            var t = this;
            this._on({
                tabsbeforeload: function(n, r) {
                    if (e.data(r.tab[0], "cache.tabs")) {
                        n.preventDefault();
                        return
                    }
                    r.jqXHR.success(function() {
                        t.options.cache && e.data(r.tab[0], "cache.tabs", !0)
                    })
                }
            })
        },
        _ajaxSettings: function(t, n, r) {
            var i = this.options.ajaxOptions;
            return e.extend({}, i, {
                error: function(e, t) {
                    try {
                        i.error(e, t, r.tab.closest("li").index(), r.tab[0])
                    } catch (n) {}
                }
            }, this._superApply(arguments))
        },
        _setOption: function(e, t) {
            e === "cache" && t === !1 && this.anchors.removeData("cache.tabs"), this._super(e, t)
        },
        _destroy: function() {
            this.anchors.removeData("cache.tabs"), this._super()
        },
        url: function(e) {
            this.anchors.eq(e).removeData("cache.tabs"), this._superApply(arguments)
        }
    }), e.widget("ui.tabs", e.ui.tabs, {
        abort: function() {
            this.xhr && this.xhr.abort()
        }
    }), e.widget("ui.tabs", e.ui.tabs, {
        options: {
            spinner: "<em>Loading&#8230;</em>"
        },
        _create: function() {
            this._super(), this._on({
                tabsbeforeload: function(e, t) {
                    if (e.target !== this.element[0] || !this.options.spinner) return;
                    var n = t.tab.find("span"),
                        r = n.html();
                    n.html(this.options.spinner), t.jqXHR.complete(function() {
                        n.html(r)
                    })
                }
            })
        }
    }), e.widget("ui.tabs", e.ui.tabs, {
        options: {
            enable: null,
            disable: null
        },
        enable: function(t) {
            var n = this.options,
                r;
            if (t && n.disabled === !0 || e.isArray(n.disabled) && e.inArray(t, n.disabled) !== -1) r = !0;
            this._superApply(arguments), r && this._trigger("enable", null, this._ui(this.anchors[t], this.panels[t]))
        },
        disable: function(t) {
            var n = this.options,
                r;
            if (t && n.disabled === !1 || e.isArray(n.disabled) && e.inArray(t, n.disabled) === -1) r = !0;
            this._superApply(arguments), r && this._trigger("disable", null, this._ui(this.anchors[t], this.panels[t]))
        }
    }), e.widget("ui.tabs", e.ui.tabs, {
        options: {
            add: null,
            remove: null,
            tabTemplate: "<li><a href='#{href}'><span>#{label}</span></a></li>"
        },
        add: function(n, r, i) {
            i === t && (i = this.anchors.length);
            var s, o, u = this.options,
                a = e(u.tabTemplate.replace(/#\{href\}/g, n).replace(/#\{label\}/g, r)),
                f = n.indexOf("#") ? this._tabId(a) : n.replace("#", "");
            return a.addClass("ui-state-default ui-corner-top").data("ui-tabs-destroy", !0), a.attr("aria-controls", f), s = i >= this.tabs.length, o = this.element.find("#" + f), o.length || (o = this._createPanel(f), s ? i > 0 ? o.insertAfter(this.panels.eq(-1)) : o.appendTo(this.element) : o.insertBefore(this.panels[i])), o.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").hide(), s ? a.appendTo(this.tablist) : a.insertBefore(this.tabs[i]), u.disabled = e.map(u.disabled, function(e) {
                return e >= i ? ++e : e
            }), this.refresh(), this.tabs.length === 1 && u.active === !1 && this.option("active", 0), this._trigger("add", null, this._ui(this.anchors[i], this.panels[i])), this
        },
        remove: function(t) {
            t = this._getIndex(t);
            var n = this.options,
                r = this.tabs.eq(t).remove(),
                i = this._getPanelForTab(r).remove();
            return r.hasClass("ui-tabs-active") && this.anchors.length > 2 && this._activate(t + (t + 1 < this.anchors.length ? 1 : -1)), n.disabled = e.map(e.grep(n.disabled, function(e) {
                return e !== t
            }), function(e) {
                return e >= t ? --e : e
            }), this.refresh(), this._trigger("remove", null, this._ui(r.find("a")[0], i[0])), this
        }
    }), e.widget("ui.tabs", e.ui.tabs, {
        length: function() {
            return this.anchors.length
        }
    }), e.widget("ui.tabs", e.ui.tabs, {
        options: {
            idPrefix: "ui-tabs-"
        },
        _tabId: function(t) {
            var n = t.is("li") ? t.find("a[href]") : t;
            return n = n[0], e(n).closest("li").attr("aria-controls") || n.title && n.title.replace(/\s/g, "_").replace(/[^\w\u00c0-\uFFFF\-]/g, "") || this.options.idPrefix + i()
        }
    }), e.widget("ui.tabs", e.ui.tabs, {
        options: {
            panelTemplate: "<div></div>"
        },
        _createPanel: function(t) {
            return e(this.options.panelTemplate).attr("id", t).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").data("ui-tabs-destroy", !0)
        }
    }), e.widget("ui.tabs", e.ui.tabs, {
        _create: function() {
            var e = this.options;
            e.active === null && e.selected !== t && (e.active = e.selected === -1 ? !1 : e.selected), this._super(), e.selected = e.active, e.selected === !1 && (e.selected = -1)
        },
        _setOption: function(e, t) {
            if (e !== "selected") return this._super(e, t);
            var n = this.options;
            this._super("active", t === -1 ? !1 : t), n.selected = n.active, n.selected === !1 && (n.selected = -1)
        },
        _eventHandler: function() {
            this._superApply(arguments), this.options.selected = this.options.active, this.options.selected === !1 && (this.options.selected = -1)
        }
    }), e.widget("ui.tabs", e.ui.tabs, {
        options: {
            show: null,
            select: null
        },
        _create: function() {
            this._super(), this.options.active !== !1 && this._trigger("show", null, this._ui(this.active.find(".ui-tabs-anchor")[0], this._getPanelForTab(this.active)[0]))
        },
        _trigger: function(e, t, n) {
            var r, i, s = this._superApply(arguments);
            return s ? (e === "beforeActivate" ? (r = n.newTab.length ? n.newTab : n.oldTab, i = n.newPanel.length ? n.newPanel : n.oldPanel, s = this._super("select", t, {
                tab: r.find(".ui-tabs-anchor")[0],
                panel: i[0],
                index: r.closest("li").index()
            })) : e === "activate" && n.newTab.length && (s = this._super("show", t, {
                tab: n.newTab.find(".ui-tabs-anchor")[0],
                panel: n.newPanel[0],
                index: n.newTab.closest("li").index()
            })), s) : !1
        }
    }), e.widget("ui.tabs", e.ui.tabs, {
        select: function(e) {
            e = this._getIndex(e);
            if (e === -1) {
                if (!this.options.collapsible || this.options.selected === -1) return;
                e = this.options.selected
            }
            this.anchors.eq(e).trigger(this.options.event + this.eventNamespace)
        }
    }), function() {
        var t = 0;
        e.widget("ui.tabs", e.ui.tabs, {
            options: {
                cookie: null
            },
            _create: function() {
                var e = this.options,
                    t;
                e.active == null && e.cookie && (t = parseInt(this._cookie(), 10), t === -1 && (t = !1), e.active = t), this._super()
            },
            _cookie: function(n) {
                var r = [this.cookie || (this.cookie = this.options.cookie.name || "ui-tabs-" + ++t)];
                return arguments.length && (r.push(n === !1 ? -1 : n), r.push(this.options.cookie)), e.cookie.apply(null, r)
            },
            _refresh: function() {
                this._super(), this.options.cookie && this._cookie(this.options.active, this.options.cookie)
            },
            _eventHandler: function() {
                this._superApply(arguments), this.options.cookie && this._cookie(this.options.active, this.options.cookie)
            },
            _destroy: function() {
                this._super(), this.options.cookie && this._cookie(null, this.options.cookie)
            }
        })
    }(), e.widget("ui.tabs", e.ui.tabs, {
        _trigger: function(t, n, r) {
            var i = e.extend({}, r);
            return t === "load" && (i.panel = i.panel[0], i.tab = i.tab.find(".ui-tabs-anchor")[0]), this._super(t, n, i)
        }
    }), e.widget("ui.tabs", e.ui.tabs, {
        options: {
            fx: null
        },
        _getFx: function() {
            var t, n, r = this.options.fx;
            return r && (e.isArray(r) ? (t = r[0], n = r[1]) : t = n = r), r ? {
                show: n,
                hide: t
            } : null
        },
        _toggle: function(e, t) {
            function o() {
                n.running = !1, n._trigger("activate", e, t)
            }

            function u() {
                t.newTab.closest("li").addClass("ui-tabs-active ui-state-active"), r.length && s.show ? r.animate(s.show, s.show.duration, function() {
                    o()
                }) : (r.show(), o())
            }
            var n = this,
                r = t.newPanel,
                i = t.oldPanel,
                s = this._getFx();
            if (!s) return this._super(e, t);
            n.running = !0, i.length && s.hide ? i.animate(s.hide, s.hide.duration, function() {
                t.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"), u()
            }) : (t.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"), i.hide(), u())
        }
    }))
})(jQuery);
(function(e) {
    function n(t, n) {
        var r = (t.attr("aria-describedby") || "").split(/\s+/);
        r.push(n), t.data("ui-tooltip-id", n).attr("aria-describedby", e.trim(r.join(" ")))
    }

    function r(t) {
        var n = t.data("ui-tooltip-id"),
            r = (t.attr("aria-describedby") || "").split(/\s+/),
            i = e.inArray(n, r);
        i !== -1 && r.splice(i, 1), t.removeData("ui-tooltip-id"), r = e.trim(r.join(" ")), r ? t.attr("aria-describedby", r) : t.removeAttr("aria-describedby")
    }
    var t = 0;
    e.widget("ui.tooltip", {
        version: "1.9.2",
        options: {
            content: function() {
                return e(this).attr("title")
            },
            hide: !0,
            items: "[title]:not([disabled])",
            position: {
                my: "left top+15",
                at: "left bottom",
                collision: "flipfit flip"
            },
            show: !0,
            tooltipClass: null,
            track: !1,
            close: null,
            open: null
        },
        _create: function() {
            this._on({
                mouseover: "open",
                focusin: "open"
            }), this.tooltips = {}, this.parents = {}, this.options.disabled && this._disable()
        },
        _setOption: function(t, n) {
            var r = this;
            if (t === "disabled") {
                this[n ? "_disable" : "_enable"](), this.options[t] = n;
                return
            }
            this._super(t, n), t === "content" && e.each(this.tooltips, function(e, t) {
                r._updateContent(t)
            })
        },
        _disable: function() {
            var t = this;
            e.each(this.tooltips, function(n, r) {
                var i = e.Event("blur");
                i.target = i.currentTarget = r[0], t.close(i, !0)
            }), this.element.find(this.options.items).andSelf().each(function() {
                var t = e(this);
                t.is("[title]") && t.data("ui-tooltip-title", t.attr("title")).attr("title", "")
            })
        },
        _enable: function() {
            this.element.find(this.options.items).andSelf().each(function() {
                var t = e(this);
                t.data("ui-tooltip-title") && t.attr("title", t.data("ui-tooltip-title"))
            })
        },
        open: function(t) {
            var n = this,
                r = e(t ? t.target : this.element).closest(this.options.items);
            if (!r.length || r.data("ui-tooltip-id")) return;
            r.attr("title") && r.data("ui-tooltip-title", r.attr("title")), r.data("ui-tooltip-open", !0), t && t.type === "mouseover" && r.parents().each(function() {
                var t = e(this),
                    r;
                t.data("ui-tooltip-open") && (r = e.Event("blur"), r.target = r.currentTarget = this, n.close(r, !0)), t.attr("title") && (t.uniqueId(), n.parents[this.id] = {
                    element: this,
                    title: t.attr("title")
                }, t.attr("title", ""))
            }), this._updateContent(r, t)
        },
        _updateContent: function(e, t) {
            var n, r = this.options.content,
                i = this,
                s = t ? t.type : null;
            if (typeof r == "string") return this._open(t, e, r);
            n = r.call(e[0], function(n) {
                if (!e.data("ui-tooltip-open")) return;
                i._delay(function() {
                    t && (t.type = s), this._open(t, e, n)
                })
            }), n && this._open(t, e, n)
        },
        _open: function(t, r, i) {
            function f(e) {
                a.of = e;
                if (s.is(":hidden")) return;
                s.position(a)
            }
            var s, o, u, a = e.extend({}, this.options.position);
            if (!i) return;
            s = this._find(r);
            if (s.length) {
                s.find(".ui-tooltip-content").html(i);
                return
            }
            r.is("[title]") && (t && t.type === "mouseover" ? r.attr("title", "") : r.removeAttr("title")), s = this._tooltip(r), n(r, s.attr("id")), s.find(".ui-tooltip-content").html(i), this.options.track && t && /^mouse/.test(t.type) ? (this._on(this.document, {
                mousemove: f
            }), f(t)) : s.position(e.extend({
                of: r
            }, this.options.position)), s.hide(), this._show(s, this.options.show), this.options.show && this.options.show.delay && (u = setInterval(function() {
                s.is(":visible") && (f(a.of), clearInterval(u))
            }, e.fx.interval)), this._trigger("open", t, {
                tooltip: s
            }), o = {
                keyup: function(t) {
                    if (t.keyCode === e.ui.keyCode.ESCAPE) {
                        var n = e.Event(t);
                        n.currentTarget = r[0], this.close(n, !0)
                    }
                },
                remove: function() {
                    this._removeTooltip(s)
                }
            };
            if (!t || t.type === "mouseover") o.mouseleave = "close";
            if (!t || t.type === "focusin") o.focusout = "close";
            this._on(!0, r, o)
        },
        close: function(t) {
            var n = this,
                i = e(t ? t.currentTarget : this.element),
                s = this._find(i);
            if (this.closing) return;
            i.data("ui-tooltip-title") && i.attr("title", i.data("ui-tooltip-title")), r(i), s.stop(!0), this._hide(s, this.options.hide, function() {
                n._removeTooltip(e(this))
            }), i.removeData("ui-tooltip-open"), this._off(i, "mouseleave focusout keyup"), i[0] !== this.element[0] && this._off(i, "remove"), this._off(this.document, "mousemove"), t && t.type === "mouseleave" && e.each(this.parents, function(t, r) {
                e(r.element).attr("title", r.title), delete n.parents[t]
            }), this.closing = !0, this._trigger("close", t, {
                tooltip: s
            }), this.closing = !1
        },
        _tooltip: function(n) {
            var r = "ui-tooltip-" + t++,
                i = e("<div>").attr({
                    id: r,
                    role: "tooltip"
                }).addClass("ui-tooltip ui-widget ui-corner-all ui-widget-content " + (this.options.tooltipClass || ""));
            return e("<div>").addClass("ui-tooltip-content").appendTo(i), i.appendTo(this.document[0].body), e.fn.bgiframe && i.bgiframe(), this.tooltips[r] = n, i
        },
        _find: function(t) {
            var n = t.data("ui-tooltip-id");
            return n ? e("#" + n) : e()
        },
        _removeTooltip: function(e) {
            e.remove(), delete this.tooltips[e.attr("id")]
        },
        _destroy: function() {
            var t = this;
            e.each(this.tooltips, function(n, r) {
                var i = e.Event("blur");
                i.target = i.currentTarget = r[0], t.close(i, !0), e("#" + n).remove(), r.data("ui-tooltip-title") && (r.attr("title", r.data("ui-tooltip-title")), r.removeData("ui-tooltip-title"))
            })
        }
    })
})(jQuery);
jQuery.effects || function(e, t) {
    var n = e.uiBackCompat !== !1,
        r = "ui-effects-";
    e.effects = {
            effect: {}
        },
        function(t, n) {
            function p(e, t, n) {
                var r = a[t.type] || {};
                return e == null ? n || !t.def ? null : t.def : (e = r.floor ? ~~e : parseFloat(e), isNaN(e) ? t.def : r.mod ? (e + r.mod) % r.mod : 0 > e ? 0 : r.max < e ? r.max : e)
            }

            function d(e) {
                var n = o(),
                    r = n._rgba = [];
                return e = e.toLowerCase(), h(s, function(t, i) {
                    var s, o = i.re.exec(e),
                        a = o && i.parse(o),
                        f = i.space || "rgba";
                    if (a) return s = n[f](a), n[u[f].cache] = s[u[f].cache], r = n._rgba = s._rgba, !1
                }), r.length ? (r.join() === "0,0,0,0" && t.extend(r, c.transparent), n) : c[e]
            }

            function v(e, t, n) {
                return n = (n + 1) % 1, n * 6 < 1 ? e + (t - e) * n * 6 : n * 2 < 1 ? t : n * 3 < 2 ? e + (t - e) * (2 / 3 - n) * 6 : e
            }
            var r = "backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor".split(" "),
                i = /^([\-+])=\s*(\d+\.?\d*)/,
                s = [{
                    re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
                    parse: function(e) {
                        return [e[1], e[2], e[3], e[4]]
                    }
                }, {
                    re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
                    parse: function(e) {
                        return [e[1] * 2.55, e[2] * 2.55, e[3] * 2.55, e[4]]
                    }
                }, {
                    re: /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,
                    parse: function(e) {
                        return [parseInt(e[1], 16), parseInt(e[2], 16), parseInt(e[3], 16)]
                    }
                }, {
                    re: /#([a-f0-9])([a-f0-9])([a-f0-9])/,
                    parse: function(e) {
                        return [parseInt(e[1] + e[1], 16), parseInt(e[2] + e[2], 16), parseInt(e[3] + e[3], 16)]
                    }
                }, {
                    re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
                    space: "hsla",
                    parse: function(e) {
                        return [e[1], e[2] / 100, e[3] / 100, e[4]]
                    }
                }],
                o = t.Color = function(e, n, r, i) {
                    return new t.Color.fn.parse(e, n, r, i)
                },
                u = {
                    rgba: {
                        props: {
                            red: {
                                idx: 0,
                                type: "byte"
                            },
                            green: {
                                idx: 1,
                                type: "byte"
                            },
                            blue: {
                                idx: 2,
                                type: "byte"
                            }
                        }
                    },
                    hsla: {
                        props: {
                            hue: {
                                idx: 0,
                                type: "degrees"
                            },
                            saturation: {
                                idx: 1,
                                type: "percent"
                            },
                            lightness: {
                                idx: 2,
                                type: "percent"
                            }
                        }
                    }
                },
                a = {
                    "byte": {
                        floor: !0,
                        max: 255
                    },
                    percent: {
                        max: 1
                    },
                    degrees: {
                        mod: 360,
                        floor: !0
                    }
                },
                f = o.support = {},
                l = t("<p>")[0],
                c, h = t.each;
            l.style.cssText = "background-color:rgba(1,1,1,.5)", f.rgba = l.style.backgroundColor.indexOf("rgba") > -1, h(u, function(e, t) {
                t.cache = "_" + e, t.props.alpha = {
                    idx: 3,
                    type: "percent",
                    def: 1
                }
            }), o.fn = t.extend(o.prototype, {
                parse: function(r, i, s, a) {
                    if (r === n) return this._rgba = [null, null, null, null], this;
                    if (r.jquery || r.nodeType) r = t(r).css(i), i = n;
                    var f = this,
                        l = t.type(r),
                        v = this._rgba = [];
                    i !== n && (r = [r, i, s, a], l = "array");
                    if (l === "string") return this.parse(d(r) || c._default);
                    if (l === "array") return h(u.rgba.props, function(e, t) {
                        v[t.idx] = p(r[t.idx], t)
                    }), this;
                    if (l === "object") return r instanceof o ? h(u, function(e, t) {
                        r[t.cache] && (f[t.cache] = r[t.cache].slice())
                    }) : h(u, function(t, n) {
                        var i = n.cache;
                        h(n.props, function(e, t) {
                            if (!f[i] && n.to) {
                                if (e === "alpha" || r[e] == null) return;
                                f[i] = n.to(f._rgba)
                            }
                            f[i][t.idx] = p(r[e], t, !0)
                        }), f[i] && e.inArray(null, f[i].slice(0, 3)) < 0 && (f[i][3] = 1, n.from && (f._rgba = n.from(f[i])))
                    }), this
                },
                is: function(e) {
                    var t = o(e),
                        n = !0,
                        r = this;
                    return h(u, function(e, i) {
                        var s, o = t[i.cache];
                        return o && (s = r[i.cache] || i.to && i.to(r._rgba) || [], h(i.props, function(e, t) {
                            if (o[t.idx] != null) return n = o[t.idx] === s[t.idx], n
                        })), n
                    }), n
                },
                _space: function() {
                    var e = [],
                        t = this;
                    return h(u, function(n, r) {
                        t[r.cache] && e.push(n)
                    }), e.pop()
                },
                transition: function(e, t) {
                    var n = o(e),
                        r = n._space(),
                        i = u[r],
                        s = this.alpha() === 0 ? o("transparent") : this,
                        f = s[i.cache] || i.to(s._rgba),
                        l = f.slice();
                    return n = n[i.cache], h(i.props, function(e, r) {
                        var i = r.idx,
                            s = f[i],
                            o = n[i],
                            u = a[r.type] || {};
                        if (o === null) return;
                        s === null ? l[i] = o : (u.mod && (o - s > u.mod / 2 ? s += u.mod : s - o > u.mod / 2 && (s -= u.mod)), l[i] = p((o - s) * t + s, r))
                    }), this[r](l)
                },
                blend: function(e) {
                    if (this._rgba[3] === 1) return this;
                    var n = this._rgba.slice(),
                        r = n.pop(),
                        i = o(e)._rgba;
                    return o(t.map(n, function(e, t) {
                        return (1 - r) * i[t] + r * e
                    }))
                },
                toRgbaString: function() {
                    var e = "rgba(",
                        n = t.map(this._rgba, function(e, t) {
                            return e == null ? t > 2 ? 1 : 0 : e
                        });
                    return n[3] === 1 && (n.pop(), e = "rgb("), e + n.join() + ")"
                },
                toHslaString: function() {
                    var e = "hsla(",
                        n = t.map(this.hsla(), function(e, t) {
                            return e == null && (e = t > 2 ? 1 : 0), t && t < 3 && (e = Math.round(e * 100) + "%"), e
                        });
                    return n[3] === 1 && (n.pop(), e = "hsl("), e + n.join() + ")"
                },
                toHexString: function(e) {
                    var n = this._rgba.slice(),
                        r = n.pop();
                    return e && n.push(~~(r * 255)), "#" + t.map(n, function(e) {
                        return e = (e || 0).toString(16), e.length === 1 ? "0" + e : e
                    }).join("")
                },
                toString: function() {
                    return this._rgba[3] === 0 ? "transparent" : this.toRgbaString()
                }
            }), o.fn.parse.prototype = o.fn, u.hsla.to = function(e) {
                if (e[0] == null || e[1] == null || e[2] == null) return [null, null, null, e[3]];
                var t = e[0] / 255,
                    n = e[1] / 255,
                    r = e[2] / 255,
                    i = e[3],
                    s = Math.max(t, n, r),
                    o = Math.min(t, n, r),
                    u = s - o,
                    a = s + o,
                    f = a * .5,
                    l, c;
                return o === s ? l = 0 : t === s ? l = 60 * (n - r) / u + 360 : n === s ? l = 60 * (r - t) / u + 120 : l = 60 * (t - n) / u + 240, f === 0 || f === 1 ? c = f : f <= .5 ? c = u / a : c = u / (2 - a), [Math.round(l) % 360, c, f, i == null ? 1 : i]
            }, u.hsla.from = function(e) {
                if (e[0] == null || e[1] == null || e[2] == null) return [null, null, null, e[3]];
                var t = e[0] / 360,
                    n = e[1],
                    r = e[2],
                    i = e[3],
                    s = r <= .5 ? r * (1 + n) : r + n - r * n,
                    o = 2 * r - s;
                return [Math.round(v(o, s, t + 1 / 3) * 255), Math.round(v(o, s, t) * 255), Math.round(v(o, s, t - 1 / 3) * 255), i]
            }, h(u, function(e, r) {
                var s = r.props,
                    u = r.cache,
                    a = r.to,
                    f = r.from;
                o.fn[e] = function(e) {
                    a && !this[u] && (this[u] = a(this._rgba));
                    if (e === n) return this[u].slice();
                    var r, i = t.type(e),
                        l = i === "array" || i === "object" ? e : arguments,
                        c = this[u].slice();
                    return h(s, function(e, t) {
                        var n = l[i === "object" ? e : t.idx];
                        n == null && (n = c[t.idx]), c[t.idx] = p(n, t)
                    }), f ? (r = o(f(c)), r[u] = c, r) : o(c)
                }, h(s, function(n, r) {
                    if (o.fn[n]) return;
                    o.fn[n] = function(s) {
                        var o = t.type(s),
                            u = n === "alpha" ? this._hsla ? "hsla" : "rgba" : e,
                            a = this[u](),
                            f = a[r.idx],
                            l;
                        return o === "undefined" ? f : (o === "function" && (s = s.call(this, f), o = t.type(s)), s == null && r.empty ? this : (o === "string" && (l = i.exec(s), l && (s = f + parseFloat(l[2]) * (l[1] === "+" ? 1 : -1))), a[r.idx] = s, this[u](a)))
                    }
                })
            }), h(r, function(e, n) {
                t.cssHooks[n] = {
                    set: function(e, r) {
                        var i, s, u = "";
                        if (t.type(r) !== "string" || (i = d(r))) {
                            r = o(i || r);
                            if (!f.rgba && r._rgba[3] !== 1) {
                                s = n === "backgroundColor" ? e.parentNode : e;
                                while ((u === "" || u === "transparent") && s && s.style) try {
                                    u = t.css(s, "backgroundColor"), s = s.parentNode
                                } catch (a) {}
                                r = r.blend(u && u !== "transparent" ? u : "_default")
                            }
                            r = r.toRgbaString()
                        }
                        try {
                            e.style[n] = r
                        } catch (l) {}
                    }
                }, t.fx.step[n] = function(e) {
                    e.colorInit || (e.start = o(e.elem, n), e.end = o(e.end), e.colorInit = !0), t.cssHooks[n].set(e.elem, e.start.transition(e.end, e.pos))
                }
            }), t.cssHooks.borderColor = {
                expand: function(e) {
                    var t = {};
                    return h(["Top", "Right", "Bottom", "Left"], function(n, r) {
                        t["border" + r + "Color"] = e
                    }), t
                }
            }, c = t.Color.names = {
                aqua: "#00ffff",
                black: "#000000",
                blue: "#0000ff",
                fuchsia: "#ff00ff",
                gray: "#808080",
                green: "#008000",
                lime: "#00ff00",
                maroon: "#800000",
                navy: "#000080",
                olive: "#808000",
                purple: "#800080",
                red: "#ff0000",
                silver: "#c0c0c0",
                teal: "#008080",
                white: "#ffffff",
                yellow: "#ffff00",
                transparent: [null, null, null, 0],
                _default: "#ffffff"
            }
        }(jQuery),
        function() {
            function i() {
                var t = this.ownerDocument.defaultView ? this.ownerDocument.defaultView.getComputedStyle(this, null) : this.currentStyle,
                    n = {},
                    r, i;
                if (t && t.length && t[0] && t[t[0]]) {
                    i = t.length;
                    while (i--) r = t[i], typeof t[r] == "string" && (n[e.camelCase(r)] = t[r])
                } else
                    for (r in t) typeof t[r] == "string" && (n[r] = t[r]);
                return n
            }

            function s(t, n) {
                var i = {},
                    s, o;
                for (s in n) o = n[s], t[s] !== o && !r[s] && (e.fx.step[s] || !isNaN(parseFloat(o))) && (i[s] = o);
                return i
            }
            var n = ["add", "remove", "toggle"],
                r = {
                    border: 1,
                    borderBottom: 1,
                    borderColor: 1,
                    borderLeft: 1,
                    borderRight: 1,
                    borderTop: 1,
                    borderWidth: 1,
                    margin: 1,
                    padding: 1
                };
            e.each(["borderLeftStyle", "borderRightStyle", "borderBottomStyle", "borderTopStyle"], function(t, n) {
                e.fx.step[n] = function(e) {
                    if (e.end !== "none" && !e.setAttr || e.pos === 1 && !e.setAttr) jQuery.style(e.elem, n, e.end), e.setAttr = !0
                }
            }), e.effects.animateClass = function(t, r, o, u) {
                var a = e.speed(r, o, u);
                return this.queue(function() {
                    var r = e(this),
                        o = r.attr("class") || "",
                        u, f = a.children ? r.find("*").andSelf() : r;
                    f = f.map(function() {
                        var t = e(this);
                        return {
                            el: t,
                            start: i.call(this)
                        }
                    }), u = function() {
                        e.each(n, function(e, n) {
                            t[n] && r[n + "Class"](t[n])
                        })
                    }, u(), f = f.map(function() {
                        return this.end = i.call(this.el[0]), this.diff = s(this.start, this.end), this
                    }), r.attr("class", o), f = f.map(function() {
                        var t = this,
                            n = e.Deferred(),
                            r = jQuery.extend({}, a, {
                                queue: !1,
                                complete: function() {
                                    n.resolve(t)
                                }
                            });
                        return this.el.animate(this.diff, r), n.promise()
                    }), e.when.apply(e, f.get()).done(function() {
                        u(), e.each(arguments, function() {
                            var t = this.el;
                            e.each(this.diff, function(e) {
                                t.css(e, "")
                            })
                        }), a.complete.call(r[0])
                    })
                })
            }, e.fn.extend({
                _addClass: e.fn.addClass,
                addClass: function(t, n, r, i) {
                    return n ? e.effects.animateClass.call(this, {
                        add: t
                    }, n, r, i) : this._addClass(t)
                },
                _removeClass: e.fn.removeClass,
                removeClass: function(t, n, r, i) {
                    return n ? e.effects.animateClass.call(this, {
                        remove: t
                    }, n, r, i) : this._removeClass(t)
                },
                _toggleClass: e.fn.toggleClass,
                toggleClass: function(n, r, i, s, o) {
                    return typeof r == "boolean" || r === t ? i ? e.effects.animateClass.call(this, r ? {
                        add: n
                    } : {
                        remove: n
                    }, i, s, o) : this._toggleClass(n, r) : e.effects.animateClass.call(this, {
                        toggle: n
                    }, r, i, s)
                },
                switchClass: function(t, n, r, i, s) {
                    return e.effects.animateClass.call(this, {
                        add: n,
                        remove: t
                    }, r, i, s)
                }
            })
        }(),
        function() {
            function i(t, n, r, i) {
                e.isPlainObject(t) && (n = t, t = t.effect), t = {
                    effect: t
                }, n == null && (n = {}), e.isFunction(n) && (i = n, r = null, n = {});
                if (typeof n == "number" || e.fx.speeds[n]) i = r, r = n, n = {};
                return e.isFunction(r) && (i = r, r = null), n && e.extend(t, n), r = r || n.duration, t.duration = e.fx.off ? 0 : typeof r == "number" ? r : r in e.fx.speeds ? e.fx.speeds[r] : e.fx.speeds._default, t.complete = i || n.complete, t
            }

            function s(t) {
                return !t || typeof t == "number" || e.fx.speeds[t] ? !0 : typeof t == "string" && !e.effects.effect[t] ? n && e.effects[t] ? !1 : !0 : !1
            }
            e.extend(e.effects, {
                version: "1.9.2",
                save: function(e, t) {
                    for (var n = 0; n < t.length; n++) t[n] !== null && e.data(r + t[n], e[0].style[t[n]])
                },
                restore: function(e, n) {
                    var i, s;
                    for (s = 0; s < n.length; s++) n[s] !== null && (i = e.data(r + n[s]), i === t && (i = ""), e.css(n[s], i))
                },
                setMode: function(e, t) {
                    return t === "toggle" && (t = e.is(":hidden") ? "show" : "hide"), t
                },
                getBaseline: function(e, t) {
                    var n, r;
                    switch (e[0]) {
                        case "top":
                            n = 0;
                            break;
                        case "middle":
                            n = .5;
                            break;
                        case "bottom":
                            n = 1;
                            break;
                        default:
                            n = e[0] / t.height
                    }
                    switch (e[1]) {
                        case "left":
                            r = 0;
                            break;
                        case "center":
                            r = .5;
                            break;
                        case "right":
                            r = 1;
                            break;
                        default:
                            r = e[1] / t.width
                    }
                    return {
                        x: r,
                        y: n
                    }
                },
                createWrapper: function(t) {
                    if (t.parent().is(".ui-effects-wrapper")) return t.parent();
                    var n = {
                            width: t.outerWidth(!0),
                            height: t.outerHeight(!0),
                            "float": t.css("float")
                        },
                        r = e("<div></div>").addClass("ui-effects-wrapper").css({
                            fontSize: "100%",
                            background: "transparent",
                            border: "none",
                            margin: 0,
                            padding: 0
                        }),
                        i = {
                            width: t.width(),
                            height: t.height()
                        },
                        s = document.activeElement;
                    try {
                        s.id
                    } catch (o) {
                        s = document.body
                    }
                    return t.wrap(r), (t[0] === s || e.contains(t[0], s)) && e(s).focus(), r = t.parent(), t.css("position") === "static" ? (r.css({
                        position: "relative"
                    }), t.css({
                        position: "relative"
                    })) : (e.extend(n, {
                        position: t.css("position"),
                        zIndex: t.css("z-index")
                    }), e.each(["top", "left", "bottom", "right"], function(e, r) {
                        n[r] = t.css(r), isNaN(parseInt(n[r], 10)) && (n[r] = "auto")
                    }), t.css({
                        position: "relative",
                        top: 0,
                        left: 0,
                        right: "auto",
                        bottom: "auto"
                    })), t.css(i), r.css(n).show()
                },
                removeWrapper: function(t) {
                    var n = document.activeElement;
                    return t.parent().is(".ui-effects-wrapper") && (t.parent().replaceWith(t), (t[0] === n || e.contains(t[0], n)) && e(n).focus()), t
                },
                setTransition: function(t, n, r, i) {
                    return i = i || {}, e.each(n, function(e, n) {
                        var s = t.cssUnit(n);
                        s[0] > 0 && (i[n] = s[0] * r + s[1])
                    }), i
                }
            }), e.fn.extend({
                effect: function() {
                    function a(n) {
                        function u() {
                            e.isFunction(i) && i.call(r[0]), e.isFunction(n) && n()
                        }
                        var r = e(this),
                            i = t.complete,
                            s = t.mode;
                        (r.is(":hidden") ? s === "hide" : s === "show") ? u(): o.call(r[0], t, u)
                    }
                    var t = i.apply(this, arguments),
                        r = t.mode,
                        s = t.queue,
                        o = e.effects.effect[t.effect],
                        u = !o && n && e.effects[t.effect];
                    return e.fx.off || !o && !u ? r ? this[r](t.duration, t.complete) : this.each(function() {
                        t.complete && t.complete.call(this)
                    }) : o ? s === !1 ? this.each(a) : this.queue(s || "fx", a) : u.call(this, {
                        options: t,
                        duration: t.duration,
                        callback: t.complete,
                        mode: t.mode
                    })
                },
                _show: e.fn.show,
                show: function(e) {
                    if (s(e)) return this._show.apply(this, arguments);
                    var t = i.apply(this, arguments);
                    return t.mode = "show", this.effect.call(this, t)
                },
                _hide: e.fn.hide,
                hide: function(e) {
                    if (s(e)) return this._hide.apply(this, arguments);
                    var t = i.apply(this, arguments);
                    return t.mode = "hide", this.effect.call(this, t)
                },
                __toggle: e.fn.toggle,
                toggle: function(t) {
                    if (s(t) || typeof t == "boolean" || e.isFunction(t)) return this.__toggle.apply(this, arguments);
                    var n = i.apply(this, arguments);
                    return n.mode = "toggle", this.effect.call(this, n)
                },
                cssUnit: function(t) {
                    var n = this.css(t),
                        r = [];
                    return e.each(["em", "px", "%", "pt"], function(e, t) {
                        n.indexOf(t) > 0 && (r = [parseFloat(n), t])
                    }), r
                }
            })
        }(),
        function() {
            var t = {};
            e.each(["Quad", "Cubic", "Quart", "Quint", "Expo"], function(e, n) {
                t[n] = function(t) {
                    return Math.pow(t, e + 2)
                }
            }), e.extend(t, {
                Sine: function(e) {
                    return 1 - Math.cos(e * Math.PI / 2)
                },
                Circ: function(e) {
                    return 1 - Math.sqrt(1 - e * e)
                },
                Elastic: function(e) {
                    return e === 0 || e === 1 ? e : -Math.pow(2, 8 * (e - 1)) * Math.sin(((e - 1) * 80 - 7.5) * Math.PI / 15)
                },
                Back: function(e) {
                    return e * e * (3 * e - 2)
                },
                Bounce: function(e) {
                    var t, n = 4;
                    while (e < ((t = Math.pow(2, --n)) - 1) / 11);
                    return 1 / Math.pow(4, 3 - n) - 7.5625 * Math.pow((t * 3 - 2) / 22 - e, 2)
                }
            }), e.each(t, function(t, n) {
                e.easing["easeIn" + t] = n, e.easing["easeOut" + t] = function(e) {
                    return 1 - n(1 - e)
                }, e.easing["easeInOut" + t] = function(e) {
                    return e < .5 ? n(e * 2) / 2 : 1 - n(e * -2 + 2) / 2
                }
            })
        }()
}(jQuery);
(function(e, t) {
    e.effects.effect.fade = function(t, n) {
        var r = e(this),
            i = e.effects.setMode(r, t.mode || "toggle");
        r.animate({
            opacity: i
        }, {
            queue: !1,
            duration: t.duration,
            easing: t.easing,
            complete: n
        })
    }
})(jQuery);
$.ui.dialog.prototype._originalCreate = $.ui.dialog.prototype._create;
$.ui.dialog.prototype.originalOpen = $.ui.dialog.prototype.open;
$.ui.dialog.prototype.options.recisioVersion = 1;
$.ui.dialog.prototype.options.showClosebutton = true;
$.ui.dialog.prototype.options.closeOnOverlayClick = true;
$.ui.dialog.prototype.options.openAfterCssLoaded = true;
$.ui.dialog.prototype.options.draggable = false;
$.ui.dialog.prototype.options.width = "auto";
$.ui.dialog.prototype.options.height = "auto";
$.ui.dialog.prototype._create = function() {
    this._originalCreate.apply(this, arguments);
    if (this.options.recisioVersion === 2) {
        this.uiDialog.addClass("v2");
        this.uiDialogTitlebar.find(".ui-dialog-titlebar-close").html("&nbsp;");
    }
    if (this.uiDialogTitlebar.find(".ui-dialog-title").html() === "&nbsp;") {
        this.uiDialogTitlebar.find(".ui-dialog-title").hide();
    }
    if (!this.options.showClosebutton) {
        this.uiDialogTitlebar.find(".ui-dialog-titlebar-close").hide();
    }
    if (this.options.closeOnOverlayClick) {
        var $this = this;
        $("body").on('click', ".ui-widget-overlay", function() {
            $this.close();
        });
    }
};
$.ui.dialog.prototype.open = function() {
    if (this.options.title.length === 0) {
        if (this.element.find("h1").length === 1) {
            var title = this.element.find("h1").html();
            this.element.find("h1").remove();
            this.uiDialogTitlebar.find(".ui-dialog-title").html(title).show();
        } else {
            this.uiDialogTitlebar.find(".ui-dialog-title").html("&nbsp;").hide();
        }
    }
    var toLoad = this.element.find('link[type="text/css"]').length;
    if (this.options.recisioVersion === 2 && this.options.openAfterCssLoaded && toLoad > 0) {
        var that = this;
        that.element.find('link[type="text/css"]').each(function() {
            $(this).one("load", function() {
                toLoad--;
                if (toLoad === 0) {
                    that.originalOpen.apply(that, arguments);
                }
            }).appendTo("head");
            var version = parseInt($.browser.version.substring(0, $.browser.version.indexOf(".")));
            if ($.browser.webkit && version && version <= 534) {
                $(this).load();
            }
        });
    } else {
        this.originalOpen.apply(this, arguments);
    }
};
var Utils = {
    require: function(libraryName) {
        try {
            document.write('<script type="text/javascript" src="' + libraryName + '"><\/script>');
        } catch (e) {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = libraryName;
            document.getElementsByTagName('head')[0].appendChild(script);
        }
    },
    getCookie: function(name) {
        var search = name + '=';
        var defcook = '';
        if (document.cookie.length > 0) {
            offset = document.cookie.indexOf(search);
            if (offset != -1) {
                offset += search.length;
                end = document.cookie.indexOf(';', offset);
                if (end == -1) {
                    end = document.cookie.length;
                }
                defcook = unescape(document.cookie.substring(offset, end));
                if (defcook != '') {
                    return defcook;
                }
            }
        }
    },
    setCookie: function(document, name, value, expire) {
        document.cookie = name + '=' + escape(value) + '; path=/;' + ((expire == null) ? '' : ('; expires=' + expire.toGMTString()));
    },
    userLogged: function() {
        if (Utils.getCookie('app_credentials')) {
            return true;
        } else {
            return false;
        }
    }
};
sprintfWrapper = {
    init: function() {
        if (typeof arguments == 'undefined') {
            return null;
        }
        if (arguments.length < 1) {
            return null;
        }
        if (typeof arguments[0] != 'string') {
            return null;
        }
        if (typeof RegExp == 'undefined') {
            return null;
        }
        var string = arguments[0];
        var exp = new RegExp(/(%([%]|(\-)?(\+|\x20)?(0)?(\d+)?(\.(\d)?)?([bcdfosxX])))/g);
        var matches = new Array();
        var strings = new Array();
        var convCount = 0;
        var stringPosStart = 0;
        var stringPosEnd = 0;
        var matchPosEnd = 0;
        var newString = '';
        var match = null;
        while (match = exp.exec(string)) {
            if (match[9]) {
                convCount += 1;
            }
            stringPosStart = matchPosEnd;
            stringPosEnd = exp.lastIndex - match[0].length;
            strings[strings.length] = string.substring(stringPosStart, stringPosEnd);
            matchPosEnd = exp.lastIndex;
            matches[matches.length] = {
                match: match[0],
                left: match[3] ? true : false,
                sign: match[4] || '',
                pad: match[5] || ' ',
                min: match[6] || 0,
                precision: match[8],
                code: match[9] || '%',
                negative: parseInt(arguments[convCount]) < 0 ? true : false,
                argument: String(arguments[convCount])
            };
        }
        strings[strings.length] = string.substring(matchPosEnd);
        if (matches.length == 0) {
            return string;
        }
        if ((arguments.length - 1) < convCount) {
            return null;
        }
        var code = null;
        var match = null;
        var i = null;
        for (i = 0; i < matches.length; i++) {
            if (matches[i].code == '%') {
                substitution = '%'
            } else if (matches[i].code == 'b') {
                matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(2));
                substitution = sprintfWrapper.convert(matches[i], true);
            } else if (matches[i].code == 'c') {
                matches[i].argument = String(String.fromCharCode(parseInt(Math.abs(parseInt(matches[i].argument)))));
                substitution = sprintfWrapper.convert(matches[i], true);
            } else if (matches[i].code == 'd') {
                matches[i].argument = String(Math.abs(parseInt(matches[i].argument)));
                substitution = sprintfWrapper.convert(matches[i]);
            } else if (matches[i].code == 'f') {
                matches[i].argument = String(Math.abs(parseFloat(matches[i].argument)).toFixed(matches[i].precision ? matches[i].precision : 6));
                substitution = sprintfWrapper.convert(matches[i]);
            } else if (matches[i].code == 'o') {
                matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(8));
                substitution = sprintfWrapper.convert(matches[i]);
            } else if (matches[i].code == 's') {
                matches[i].argument = matches[i].argument.substring(0, matches[i].precision ? matches[i].precision : matches[i].argument.length)
                substitution = sprintfWrapper.convert(matches[i], true);
            } else if (matches[i].code == 'x') {
                matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(16));
                substitution = sprintfWrapper.convert(matches[i]);
            } else if (matches[i].code == 'X') {
                matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(16));
                substitution = sprintfWrapper.convert(matches[i]).toUpperCase();
            } else {
                substitution = matches[i].match;
            }
            newString += strings[i];
            newString += substitution;
        }
        newString += strings[i];
        return newString;
    },
    convert: function(match, nosign) {
        if (nosign) {
            match.sign = '';
        } else {
            match.sign = match.negative ? '-' : match.sign;
        }
        var l = match.min - match.argument.length + 1 - match.sign.length;
        var pad = new Array(l < 0 ? 0 : l).join(match.pad);
        if (!match.left) {
            if (match.pad == '0' || nosign) {
                return match.sign + pad + match.argument;
            } else {
                return pad + match.sign + match.argument;
            }
        } else {
            if (match.pad == '0' || nosign) {
                return match.sign + match.argument + pad.replace(/0/g, ' ');
            } else {
                return match.sign + match.argument + pad;
            }
        }
    }
};
sprintf = sprintfWrapper.init;
(function(f, h, i) {
    function k(a, c) {
        var b = (a[0] || 0) - (c[0] || 0);
        return b > 0 || !b && a.length > 0 && k(a.slice(1), c.slice(1))
    }

    function l(a) {
        if (typeof a != g) return a;
        var c = [],
            b = "";
        for (var d in a) {
            b = typeof a[d] == g ? l(a[d]) : [d, m ? encodeURI(a[d]) : a[d]].join("=");
            c.push(b)
        }
        return c.join("&")
    }

    function n(a) {
        var c = [];
        for (var b in a) a[b] && c.push([b, '="', a[b], '"'].join(""));
        return c.join(" ")
    }

    function o(a) {
        var c = [];
        for (var b in a) c.push(['<param name="', b, '" value="', l(a[b]), '" />'].join(""));
        return c.join("")
    }
    var g = "object",
        m = true;
    try {
        var j = i.description || function() {
            return (new i("ShockwaveFlash.ShockwaveFlash")).GetVariable("$version")
        }()
    } catch (p) {
        j = "Unavailable"
    }
    var e = j.match(/\d+/g) || [0];
    f[h] = {
        available: e[0] > 0,
        activeX: i && !i.name,
        version: {
            original: j,
            array: e,
            string: e.join("."),
            major: parseInt(e[0], 10) || 0,
            minor: parseInt(e[1], 10) || 0,
            release: parseInt(e[2], 10) || 0
        },
        hasVersion: function(a) {
            a = /string|number/.test(typeof a) ? a.toString().split(".") : /object/.test(typeof a) ? [a.major, a.minor] : a || [0, 0];
            return k(e, a)
        },
        encodeParams: true,
        expressInstall: "expressInstall.swf",
        expressInstallIsActive: false,
        create: function(a) {
            if (!a.swf || this.expressInstallIsActive || !this.available && !a.hasVersionFail) return false;
            if (!this.hasVersion(a.hasVersion || 1)) {
                this.expressInstallIsActive = true;
                if (typeof a.hasVersionFail == "function")
                    if (!a.hasVersionFail.apply(a)) return false;
                a = {
                    swf: a.expressInstall || this.expressInstall,
                    height: 137,
                    width: 214,
                    flashvars: {
                        MMredirectURL: location.href,
                        MMplayerType: this.activeX ? "ActiveX" : "PlugIn",
                        MMdoctitle: document.title.slice(0, 47) + " - Flash Player Installation"
                    }
                }
            }
            attrs = {
                data: a.swf,
                type: "application/x-shockwave-flash",
                id: a.id || "flash_" + Math.floor(Math.random() * 999999999),
                width: a.width || 320,
                height: a.height || 180,
                style: a.style || ""
            };
            m = typeof a.useEncode !== "undefined" ? a.useEncode : this.encodeParams;
            a.movie = a.swf;
            a.wmode = a.wmode || "opaque";
            delete a.fallback;
            delete a.hasVersion;
            delete a.hasVersionFail;
            delete a.height;
            delete a.id;
            delete a.swf;
            delete a.useEncode;
            delete a.width;
            var c = document.createElement("div");
            c.innerHTML = ["<object ", n(attrs), ">", o(a), "</object>"].join("");
            return c.firstChild
        }
    };
    f.fn[h] = function(a) {
        var c = this.find(g).andSelf().filter(g);
        /string|object/.test(typeof a) && this.each(function() {
            var b = f(this),
                d;
            a = typeof a == g ? a : {
                swf: a
            };
            a.fallback = this;
            if (d = f[h].create(a)) {
                b.children().remove();
                b.html(d)
            }
        });
        typeof a == "function" && c.each(function() {
            var b = this;
            b.jsInteractionTimeoutMs = b.jsInteractionTimeoutMs || 0;
            if (b.jsInteractionTimeoutMs < 660) b.clientWidth || b.clientHeight ? a.call(b) : setTimeout(function() {
                f(b)[h](a)
            }, b.jsInteractionTimeoutMs + 66)
        });
        return c
    }
})(jQuery, "flash", navigator.plugins["Shockwave Flash"] || window.ActiveXObject);
CustomManager = function() {
    this.rsid;
    this.pitch = 0;
    this.precount = 0;
    this.pan = 0;
    this.playMultiAfterProduce = false;
    this.p = {
        method: "ajax",
        famid: 5
    };
    this.r_uri = "";
    this.player_trs = new Object();
    this.mixplayer = null;
    this.getMixCallback = $.noop();
    this.editMixCallback = $.noop();
    this.afterReady = $.noop();
}
CustomManager.prototype = {
    mixStateHandler: function(state) {
        var iconLayer = $('#mixer_play_btn');
        if (state === true) {
            iconLayer.html("<span></span>" + this.player_trs.stop);
            $(iconLayer).removeClass('play');
            $(iconLayer).addClass('pause');
            iconLayer.attr('ena', 0);
        } else {
            iconLayer.html("<span></span>" + this.player_trs.play)
            $(iconLayer).removeClass('pause');
            $(iconLayer).addClass('play');
            iconLayer.attr('ena', 1);
        }
    },
    setPrecount: function(value) {
        this.precount = value;
        $.extend(this.p, {
            precount: this.precount
        });
    },
    changePitch: function(value) {
        if (!this.mixplayer)
            return false;
        var curvalue = parseInt($('#pitchvalue').html());
        if (value < 0)
            curvalue--;
        else
            curvalue++;
        if (curvalue > 2)
            curvalue = 2;
        if (curvalue < -2)
            curvalue = -2;
        this.pitch = curvalue;
        this.updatePitch();
    },
    updatePitch: function() {
        var curvalue = 0;
        if (this.pitch != 0)
            curvalue = (this.pitch < 0) ? '-' + Math.abs(this.pitch) : '+' + Math.abs(this.pitch);
        $('#pitchvalue').html(curvalue);
    },
    updatePrecount: function() {
        if ($('#precount').length) {
            if (this.precount) {
                $('#precount').attr("checked", "checked");
            } else {
                $('#precount').removeAttr("checked");
            }
        }
    },
    mixerReady: function() {
        this.mixplayer = $('#flashcontent1');
        if ($('#link_addcart_' + this.rsid).length) {
            $('#link_addcart_' + this.rsid).css('opacity', 1);
        }
        $('#mbtn_getmix[data-cangetmix=1], .opacity-on-player-ready').css('opacity', 1);
        this.afterReady();
    },
    playMix: function(obj) {
        var state = !!parseInt($(obj).attr('ena'));
        if (this.mixplayer)
            this.mixplayer.flash(function() {
                this.start(state)
            });
    },
    resetMix: function() {
        if (this.mixplayer != undefined)
            this.mixplayer.flash(function() {
                this.refresh();
            });
    },
    getMix: function() {
        if (!this.mixplayer)
            return false;
        this.p.trackslevels = this.getLevels();
        if (typeof this.getMixCallback == 'function') {
            this.getMixCallback();
        }
        this.editMix();
    },
    editMix: function() {
        var query_uri = "/basket.php";
        $.extend(this.p, {
            pitch: this.pitch
        });
        $('#mixprod_loader').toggle();
        $.ajax({
            url: query_uri,
            type: "GET",
            data: this.p,
            success: $.proxy(function() {
                if (this.r_uri) {
                    if (typeof this.editMixCallback == 'function')
                        this.editMixCallback();
                }
            }, this)
        });
    },
    getLevels: function() {
        this.mixplayer.flash(function() {
            levels = this.getLevels()
        });
        return levels;
    }
}
AudioPlayer = function() {
    this.playingElement = null;
    this.modal = null;
    this.animateId = null;
    this.previewStart = null;
    try {
        this.player = new Audio();
        this.player.loop = false;
        var that = this;
        this.player.onended = function() {
            that.updateTimer($(".audio__player--playing").data("previewstart"));
            that.reset(true);
        };
        this.player.ontimeupdate = function() {
            percent = this.currentTime / this.duration;
            elt = $(".audio__player--playing");
            width = elt.width();
            elt.children(".audio__player__overlay").css("left", -(width) + ((width * percent)));
            that.updateTimer(parseInt(that.previewStart) + this.currentTime);
        };
    } catch (e) {
        this.player = null;
    }
}
AudioPlayer.prototype = {
    canPlay: function() {
        if (!this.player) {
            return false;
        }
        return !!(this.player.canPlayType && this.player.canPlayType('audio/mpeg;').replace(/no/, ''));
    },
    init: function() {
        var that = this;
        $("html").on("click", ".audio__player", function() {
            if ($(this).data('extended') == "1") {
                that.playExtended(this);
            } else {
                that.play(this);
            }
        });
    },
    initRedirect: function() {
        $("html").on("click", ".audio__player", function() {
            if ($(this).data('extended') == "1") {
                var modal = $("#versong_" + $(this).data('id'));
                if (modal.is(":visible")) {
                    modal.hide();
                } else {
                    $(".modal--visible").removeClass("modal--visible").hide();
                    modal.show();
                    modal.addClass("modal--visible");
                }
            } else {
                window.location = $(this).data("source");
            }
        });
    },
    reset: function(resetOverlay) {
        if (resetOverlay) {
            $(".audio__player--playing").children(".audio__player__overlay").css("left", -$(".audio__player--playing").width());
        }
        $(".audio__player__state").removeClass("audio__player__state--playing").addClass("audio__player__state--paused");
        $(".audio__player").removeClass("audio__player--playing");
    },
    play: function(element) {
        var elt = $(element);
        this.player.pause();
        if (elt.children(".audio__player__state").hasClass("audio__player__state--paused")) {
            resetOverlay = false;
            if (this.player.src.indexOf(elt.data("source")) === -1) {
                this.player.src = elt.data("source");
                this.previewStart = elt.data("previewstart");
                resetOverlay = true;
            }
            this.reset(resetOverlay);
            this.player.play();
        }
        elt.addClass("audio__player--playing");
        elt.children(".audio__player__state").toggleClass("audio__player__state--playing audio__player__state--paused");
    },
    playExtended: function(element) {
        var modal = $("#versong_" + $(element).data('id'));
        if (modal.is(":visible")) {
            this.player.pause();
            modal.hide();
        } else {
            $(".modal--visible").removeClass("modal--visible").hide();
            modal.show();
            modal.addClass("modal--visible");
            modal.find(".audio__player:first").trigger("click");
        }
    },
    updateTimer: function(time) {
        if ($('#preview_time_elapsed').length) {
            $('#preview_time_elapsed').html(sprintf("%02d:%02d", Math.floor(time / 60), time % 60));
        }
    }
}

function pitchMulti(e, ajax_mode) {
    var elt = $(e);
    $("#key-block").css("opacity", "0.5");
    $(".pitch_button").removeAttr("onclick");
    $(".pitch-text").hide();
    $("#pitch-link").hide();
    $(".progress-bar span").html("<div class='dib vam'>" + kv_globals.str_loading + "</div><img class='dib vam' style='position:relative;top:3px;left:5px;' src='/i/gen/ajax-loader-blue.gif'>");
    var req = new XMLHttpRequest();
    var url = elt.attr("href");
    url += "&layout=ajax";
    req.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            d = this.responseText.split("|");
            if (ajax_mode) {
                link = "<a href='" + d[d.length - 1] + "'></a>";
                EditCustomPopup(link);
            } else {
                window.location = d[d.length - 1];
            }
        }
        if (this.readyState > 2) {
            d = this.responseText.split("|");
            percent = d[d.length - 1];
            if (parseInt(percent)) {
                $(".progress-bar-overlay").css("width", percent + "%");
            }
        }
    }
    req.open("GET", url, true);
    req.send();
    return false;
}

function pitchTooltip(song_id) {
    var pitch = $("#pitchvalue").html();
    var bubble = $("#pitch").find(".bubble");
    bubble.hide();
    reloadLink = "/multi-pitch.html?id=" + song_id + "&pitch=" + encodeURIComponent(pitch);
    reloadLink += "&levels=" + custom_manager.getLevels() + "&precount=" + custom_manager.precount;
    $("#pitch-link").attr("href", reloadLink);
    text = $(".pitch-text").html();
    res = text.replace(/(\{PITCH\})|((\+|\-)?[0-2])/gi, pitch);
    $(".pitch-text").html(res);
    bubbleText = bubble.html();
    bubble.html(bubbleText);
    bubble.show();
    pitchMultiKey(song_id, pitch);
}

function pitchMultiKey(song_id, pitch) {
    $.ajax({
        url: '/misc/chordkey.html',
        async: false,
        data: {
            "song_id": song_id,
            "value": pitch
        },
        success: function(response) {
            $("#key").html(response);
        }
    });
}

function popup(elt, w, h) {
    e = $(elt);
    if (!w) {
        w = 400;
    }
    if (!h) {
        h = 250;
    }
    window.open(e.attr("href"), '', 'width=400,height=250,scrollbars=yes,resizable=yes');
    return false;
}

function GetURIParams(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null) {
        return ""
    } else {
        results[1] = results[1].replace(/\+/g, ' ');
        return decodeURIComponent(results[1]);
    }
}

function getUrlVars(url) {
    var vars = [],
        hash;
    var hashes = url.slice(url.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
var custom_manager = new CustomManager();
var intersCheckMulti = new Array();
var loadersCheckMulti = new Array();
var modal;
var newModal;

function checkMultiAvailable(obj) {
    var fid = parseInt(obj.data('file'));
    if (intersCheckMulti[fid] > 0) {
        return false;
    }
    loadersCheckMulti[fid] = $("<img>");
    loadersCheckMulti[fid].attr("src", '/i/gen/ajaxl_16.gif');
    loadersCheckMulti[fid].attr('id', 'multi_ajaxl' + fid);
    loadersCheckMulti[fid].attr('align', 'absmiddle');
    loadersCheckMulti[fid].attr('style', 'position:relative;');
    obj.hide();
    obj.parent().prepend(loadersCheckMulti[fid]);
    intersCheckMulti[fid] = setInterval(function() {
        checkMultiAvailableHandler(obj, fid);
    }, 10000);
    event.stopPropagation();
}

function checkMultiAvailableHandler(obj, fid) {
    $.ajax({
        url: '/my/download.html',
        type: "get",
        data: {
            m: "a",
            file_id: fid,
            waitformulti: null
        },
        success: function(data) {
            data = $.parseJSON(data);
            switch (data.status) {
                case 0:
                    if (loadersCheckMulti[fid].length) {
                        loadersCheckMulti[fid].remove();
                    }
                    obj.show();
                    obj.data("source", data.filehref);
                    clearInterval(intersCheckMulti[fid]);
                    obj.removeAttr("onclick");
                    obj.trigger("click");
                    break;
            }
        }
    });
    return false;
}
var currentURI = document.location.href;
var searchboxes = new Array();

function initSearchBox() {
    $("#search_input, #myfiles_search_input, #sugg_search_input").each(function() {
        if ($(this).val().length === 0 && $(this).attr("default-value")) {
            $(this).val($(this).attr("default-value"));
        }
    });
    $("#search_input, #myfiles_search_input, #sugg_search_input").on("focus", function() {
        if (searchboxes[$(this).attr("id")] == undefined) {
            searchboxes[$(this).attr("id")] = new Array();
            if ($(this).val() == $(this).attr("default-value")) {
                searchboxes[$(this).attr("id")]["default"] = $(this).val();
                $(this).val("");
            } else {
                searchboxes[$(this).attr("id")]["change"] = true;
            }
        }
    }).on("paste", function() {
        searchboxes[$(this).attr("id")]["change"] = true;
    }).on("keyup", function() {
        searchboxes[$(this).attr("id")]["change"] = true;
    }).on("blur", function() {
        if (!searchboxes[$(this).attr("id")]["change"] || $(this).val().length == 0) {
            $(this).val(searchboxes[$(this).attr("id")]["default"]);
            delete searchboxes[$(this).attr("id")];
        }
    });
}

function initModalContentBehavior(request) {
    initCommentModule();
    if (request.getResponseHeader('x-file-href')) {
        setTimeout(function() {
            window.location = request.getResponseHeader('x-file-href');
        }, 200);
    }
    if (request.getResponseHeader('x-mutli-building')) {
        kv_globals.MultiPeriodicCheck = setTimeout(function() {
            $.ajax({
                url: request.getResponseHeader('x-mutli-building'),
                success: function(data, textStatus, request) {
                    newModal.setContent(data);
                    newModal.open();
                    initModalContentBehavior(request);
                }
            });
        }, 10000);
    } else {}
}

function toggleChangeFormat(link) {
    $.ajax({
        url: $(link).attr("href"),
        type: "get",
        data: {
            "method": "ajax"
        },
        success: function(response, textStatus, request) {
            newModal.setContent(response);
            newModal.open();
            initModalContentBehavior(request);
        }
    });
    return false;
}

function showBounceDialog(form, referer) {
    var data;
    if (form) {
        data = $(form).serialize();
    }
    $.ajax({
        url: "/my/bounce.html",
        type: "post",
        data: data,
        success: function(response) {
            form = $(response).find("form");
            if (form.length) {
                newModal.setContent(response);
                newModal.open();
            } else {
                newModal.close();
                if (referer) {
                    window.location = referer;
                }
            }
        }
    });
    return false;
}

function _ApplyKARFormat(p, c) {
    c = (c == undefined) ? new Object() : c;
    c.success = (c.success == undefined) ? $.noop() : c.success;
    c.loading = (c.loading == undefined) ? $.noop() : c.loading;
    if (p.method == undefined) {
        p.method = 'ajax';
    }
    $.ajax({
        url: '/my/changeformat.html',
        type: "get",
        data: p,
        success: c.success
    });
}

function DownKarFormat(p) {
    if (p == undefined)
        return false;
    var callback = {
        success: function(t, j) {
            if (!j.old_fileid || !j.new_fileid)
                return false;
            $('#link_addcart_' + j.old_fileid).attr('href', j.dl_url);
            $('#link_addcart_' + j.old_fileid).click(function() {
                beginDownload(this);
                return false;
            });
            $('#link_addcart_' + j.old_fileid).attr('id', 'link_addcart_' + j.new_fileid);
        }
    };
    _ApplyKARFormat(p, callback);
}

function ApplyKARFormat() {
    var videoModal = newModal;
    if (!videoModal.isOpen()) {
        return false;
    }
    var frm = $(videoModal.elem).find("form").get(0);
    if (!$(frm).length) {
        return false;
    }
    var values = $(frm).serializeArray();
    var p = {};
    for (var i = 0; i < values.length; i++) {
        d = values[i];
        p[d.name] = d.value;
    }
    p["hash"] = true;
    if (!p)
        return false;
    var callback = {
        success: function(data, textStatus, request) {
            if (!p.dl) {
                newModal.close();
            }
            if (typeof getPageContent == 'function') {
                getPageContent();
            }
            if (data.length > 0) {
                newModal.setContent(data);
                newModal.open();
                initModalContentBehavior(request);
            }
        }
    }
    _ApplyKARFormat(p, callback);
}
var song_previewstart = 0;

function initTimeControl(previewstart) {
    song_previewstart = previewstart;
    UpdateSongPreviewTime(previewstart);
}

function UpdateSongPreviewTime(time, playing) {
    is_playing = playing || false;
    if ($('#preview_time_elapsed').length) {
        if (is_playing) {
            time += song_previewstart;
        }
        $('#preview_time_elapsed').html(sprintf("%02d:%02d", Math.floor(time / 60), time % 60));
    }
}

function beginDownload(lnk) {
    if (!$(lnk).length)
        return false;
    $.ajax({
        url: $(lnk).attr("href"),
        type: "get",
        data: {
            "method": "ajax",
            "lg": kv_globals.session_c
        },
        success: function(response, textStatus, request) {
            newModal.setContent(response);
            newModal.open();
            initModalContentBehavior(request);
        }
    });
    return false;
}

function ApplyAjaxLoader(relative_container, lwidth, lheight) {
    if (!relative_container.length)
        return false;
    if ($('#ajaxl').length) {
        $('#ajaxl').show();
        return false;
    }
    lwidth = (lwidth == undefined) ? 64 : lwidth;
    lheight = (lheight == undefined) ? lwidth : lheight;
    var dim = {};
    dim.width = relative_container.width();
    dim.width -= 2;
    dim.height = relative_container.height();
    if (dim.height <= lheight) {
        dim.height = lheight;
    }
    var div = document.createElement('DIV');
    div.setAttribute('id', 'ajaxl');
    $(div).css({
        "width": dim.width + "px",
        "height": dim.height + "px",
        "background": "white url(/i/gen/ajaxl_" + lwidth + ".gif) 50% 50% no-repeat",
        "position": "absolute",
        "top": "0px",
        "left": "0px",
        "opacity": 0.6
    });
    relative_container.append(div);
}

function RemoveAjaxLoader() {
    if ($('#ajaxl').length) {
        $('#ajaxl').hide();
    }
}

function GetFamIDFromPitch(value) {
    switch (value) {
        case 5:
            return 20;
            break;
        case 4:
            return 19;
            break;
        case 3:
            return 18;
            break;
        case 2:
            return 17;
            break;
        case 1:
            return 16;
            break;
        case -1:
            return 14;
            break;
        case -2:
            return 13;
            break;
        case -3:
            return 12;
            break;
        case -4:
            return 11;
            break;
        case -5:
            return 10;
            break;
        default:
            return 2;
            break;
    }
}

function closeCurrentPopup() {
    modal.dialog("close");
}

function displayTooltip(obj) {
    txtLength = obj.html().length;
    obj.fadeIn(150).delay(3000 + (txtLength * 20)).fadeOut(150);
}

function removeChar(input) {
    var output = "";
    for (var i = 0; i < input.length; i++) {
        if ((input.charCodeAt(i) == 13) || (input.charCodeAt(i + 1) == 10)) {
            i++;
            output += " ";
        } else {
            output += input.charAt(i);
        }
    }
    return output;
}

function previewKaraoke(link, autostart_id) {
    $.ajax({
        url: link,
        type: "get",
        data: {
            "method": "ajax",
            "lg": kv_globals.session_c
        },
        success: function(response) {
            modal.dialog("option", "width", 650);
            modal.html(response);
            modal.dialog("open");
        }
    });
}

function EditCustomPopup(link) {
    $.ajax({
        url: $(link).attr("href"),
        type: "get",
        data: {
            "method": "ajax",
            "lg": kv_globals.session_c
        },
        success: function(response) {
            modal.dialog("option", "width", 970);
            modal.on("dialogclose", function() {
                mixer.pause();
                modal.off("dialogclose");
            });
            modal.html(response);
            modal.dialog("open");
        }
    });
}

function showCustomVideo() {
    $("#video-tuto").dialog("open");
    _V_("playback_video").play();
}

function displayCustomVideo() {
    if (document.querySelector('.modal #video-tuto-responsive') === null) {
        newModal.setContent(document.querySelector('#video-tuto-responsive').outerHTML);
    }
    newModal.open();
    document.querySelector('.modal video').play()
}
$("document").ready(function() {
    initSearchBox();
    modal = $('<div></div>').dialog({
        recisioVersion: 2,
        autoOpen: false,
        width: "auto",
        height: "auto",
        modal: true,
        show: "fade",
        close: function() {
            modal.html("");
            modal.dialog("option", "width", "auto");
        }
    });
    newModal = new Modal(document.querySelector('.modal__overlay'));
    $(window).on('resize', function() {
        var pos = modal.dialog('option', 'position');
        modal.dialog({
            position: pos
        });
    });
    $('a.pricebox:not(.lock)').hover(function() {
        src = $(this).children("img").attr("src");
        var reg = new RegExp("(.+)-(.+)-(.+).png");
        var m = reg.exec(src);
        src = m[1] + "-" + m[2] + "_hover-" + m[3] + ".png";
        $(this).children("img").attr("src", src);
    }, function() {
        src = $(this).children("img").attr("src");
        src = src.replace("_hover", "");
        $(this).children("img").attr("src", src);
    });
    $("#search_input").autocomplete({
        source: function(request, response) {
            $.ajax({
                url: "/search_a.php",
                dataType: "json",
                data: {
                    maxres: 10,
                    s: $.trim($("#search_input").val())
                },
                success: function(data) {
                    if (data.song == undefined) {
                        $("#search").children("img").hide();
                        return;
                    }
                    response($.map(data.song, function(item) {
                        return {
                            id: item.id,
                            label: item.song_name,
                            value: item.strip_name,
                            artist: item.artist_name,
                            fullsongurl: item.fullsongurl,
                            fullartisturl: item.fullartisturl
                        }
                    }));
                    $("a.song_name, a.artist_name").click(function() {
                        window.location.href = $(this).attr("href");
                    });
                }
            });
        },
        select: function(event, ui) {
            if (event.keyCode == 13)
                window.location.href = ui.item.fullsongurl;
        },
        focus: function(event, ui) {
            id = ui.item.id;
            $(".ui-menu-item").removeClass("highlight");
            $("#item-" + id).addClass("highlight");
        },
        search: function(event, ui) {
            $("#search").children("img").show();
        },
        open: function(event, ui) {
            $("#search").children("img").hide();
        }
    }).data("autocomplete")._renderItem = function(ul, item) {
        return $("<li id=\"item-" + item.id + "\"></li>").data("item.autocomplete", item).append("<a class=\"song_name\" href=\"" + item.fullsongurl + "\">" + item.label + "</a><a class=\"artist_name\" href=\"" + item.fullartisturl + "\">" + item.artist + "</a>").appendTo(ul);
    };
    document.addEventListener('modalClose', function() {
        ;
        document.querySelector('.modal #playback_video').pause()
    });
    $("#video-tuto").dialog({
        recisioVersion: 2,
        autoOpen: false,
        show: "fade",
        width: "auto",
        height: "auto",
        modal: true,
        close: function(event, ui) {
            _V_("playback_video").pause();
        }
    });
    $("#basketbox").hover(function() {
        $("#basket-ajax").show();
    }, function() {
        $("#basket-ajax").hide();
    });
    audioPlayer = new AudioPlayer();
    if (audioPlayer.canPlay()) {
        audioPlayer.init();
    } else {
        audioPlayer.initRedirect();
    }
});

function preview(elt) {
    link = elt;
    $.ajax({
        url: link.attr("href"),
        type: "get",
        success: function(response) {
            modal.html(response);
            modal.dialog({
                width: 660,
                close: function() {
                    modal.html("");
                }
            });
            modal.dialog("open");
        }
    });
}

function showMoreStyle(elt, more, less) {
    e = $(elt);
    p = e.parent("ul");
    if (e.hasClass("open")) {
        p.find(".filters__list-item--hide").css("display", "none");
        e.removeClass("open");
        e.find("span.label").html(more);
        e.find("span.less").removeClass("less").addClass("more");
    } else {
        p.find(".filters__list-item--hide").css("display", "block");
        e.addClass("open");
        e.find("span.label").html(less);
        e.find("span.more").removeClass("more").addClass("less");
    }
}
$(document).ready(function() {
    $(".preview-karaoke").click(function(e) {
        preview($(this));
        return false;
    });
    $(".checkbox-list").click(function() {
        p = $(this).parent();
        window.location = p.attr("href");
    });
    $(".play-button .playerbutton").click(function() {
        id = $(this).attr("id");
        vals = id.split("-");
        link_player = $("#linkplayer-" + vals[2]);
        link_player.addClass("active");
        link_player.prev("span").css("font-weight", "bold");
    });
});

function Modal(elem) {
    this.elem = elem;
    this.modal = elem.querySelector('.modal');
    this.buttonsClose = null;
    this.overlay = this.elem;
    this.open = function() {
        this.overlay.classList.add('is-open');
        this.addCloseEvent();
    }.bind(this);
    this.close = function() {
        var closeEvent = this.createCustomEvent('modalClose');
        document.dispatchEvent(closeEvent);
        this.overlay.classList.remove('is-open');
    }.bind(this);
    this.setContent = function(htmlContent) {
        this.modal.querySelector('.modal__content').innerHTML = htmlContent;
    }.bind(this);
    this.addCloseEvent = function() {
        this.buttonsClose = this.modal.querySelectorAll('.js-modal-close');
        this.overlay.addEventListener('click', this.overlayClose, {
            passive: true
        });
        [].forEach.call(this.buttonsClose, function(button) {
            button.addEventListener('click', this.close, {
                passive: true
            });
        }.bind(this));
    }.bind(this);
    this.isOpen = function() {
        return this.overlay.classList.contains('is-open');
    }
    this.createCustomEvent = function(eventType) {
        if (window.CustomEvent) {
            try {
                return new CustomEvent(eventType);
            } catch (e) {}
        }
        var event = document.createEvent('CustomEvent');
        event.initCustomEvent(eventType, true, true);
        return event;
    }
    this.overlayClose = function(event) {
        if (event.target !== this.overlay) return;
        this.close();
    }.bind(this);
}
var intab = '';
var cell = Object;
var xhr = new XMLHttpRequest();

function ActiveAlertAJAX(e, action) {
    var link = e.currentTarget;
    e.preventDefault();
    if (intab != '')
        return false;
    if (!xhr)
        return true;
    var chart_vote = getChartVote(link.href);
    if (chart_vote === null) {
        return false;
    }
    var chart_id = getChartId(link.href);
    if (chart_id === null) {
        return false;
    }
    charts_params = {
        method: 'ajax',
        id: chart_id,
        vote: chart_vote
    };
    cell = document.getElementById('SP' + chart_id);
    intab = cell.innerHTML;
    voteAjax(charts_params, function(response, error) {});
    if (action === 'alert') {
        var sameActivate = document.getElementById('VO'.concat('DW', 'A', chart_id)).getAttribute('data-activate') === "true";
        if (sameActivate) {
            changeVoteImage(chart_id, action);
        }
        changeEmailAlert(null, chart_id, '');
    } else {
        changeVoteImage(chart_id, action);
    }
    intab = '';
}

function changeVoteImage(chartId, action) {
    if (action === "voteup" || action === 'alert') {
        voteType = 'UP';
    } else if (action === "votedown") {
        voteType = 'DW';
    }
    var link = document.getElementById('VO'.concat(voteType, 'A', chartId));
    var dataActivate = link.getAttribute('data-activate');
    var linkActivate = (dataActivate === 'true');
    var img = document.getElementById('VO'.concat(voteType, 'IMG', chartId));
    var img_src = null;
    if (voteType == "UP") {
        img_src = !linkActivate ? "/i/misc/voteyess.png" : "/i/misc/voteyes.png";
        if (!linkActivate) {
            if (img) {
                document.getElementById('VO'.concat('DW', 'IMG', chartId)).src = "/i/misc/voteno.png";
            }
            document.getElementById('VO'.concat('DW', 'A', chartId)).setAttribute('data-activate', false);
        } else {
            if (action === 'voteup') {
                changeEmailAlert(null, chartId, '', 'disable')
            }
        }
    } else if (voteType == "DW") {
        img_src = !linkActivate ? "/i/misc/votenos.png" : "/i/misc/voteno.png";
        if (!linkActivate) {
            if (img) {
                document.getElementById('VO'.concat('UP', 'IMG', chartId)).src = "/i/misc/voteyes.png";
            }
            document.getElementById('VO'.concat('UP', 'A', chartId)).setAttribute('data-activate', false);
            changeEmailAlert(null, chartId, '', 'disable')
        }
    }
    if (img) {
        img.src = img_src;
    }
    link.classList.add('animate');
    setTimeout(function() {
        link.classList.remove('animate');
    }, 1000);
    link.setAttribute('data-activate', (dataActivate === 'false'));
}

function voteAjax(params, callback) {
    xhr.open("GET", "/chartsvote.html?" + uriParams(params), true);
    xhr.send(null);
    xhr.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {
                callback(this.responseText, null);
            } else {
                callback(null, this.statusText);
            }
        }
    };
}

function uriParams(params) {
    return Object.keys(params).map(function(key) {
        return key + '=' + params[key];
    }).join('&');
}

function chartsAlert(event, cid) {
    event.preventDefault();
    var cid = cid || 'undefined';
    var chart_link = event.currentTarget;
    if (!chart_link) {
        return false;
    }
    if (chart_link.id === 'e_sugg') {
        return false;
    }
    var chart_type = getChartType(chart_link.href);
    var chart_vote = getChartVote(chart_link.href);
    if (chart_vote === null) {
        return false;
    }
    var chart_id = getChartId(chart_link.href);
    if (chart_id === null) {
        return false;
    }
    charts_params = {
        layout: 'ajax',
        id: chart_id,
        type: chart_type,
        vote: chart_vote
    };
    if (cid !== 'undefined') {
        charts_params.cat_id = cid;
    }
    voteAjax(charts_params, function(response, error) {
        if (error) {
            console.log(error);
        }
    });
    changeEmailAlert(chart_link, chart_id, chart_type);
}

function changeEmailAlert(chart, chart_id, chart_type, status) {
    status = status === '' ? '' : status;
    if (chart === null) {
        var chart = document.getElementById('chart-'.concat(chart_id));
    }
    var chart_link_text = chart.querySelector('[id="' + chart_id + '_text"]');
    var chart_caption = kv_globals[chart_type + "_" + chart_id + "_0_str"];
    var chart_caption_ok = kv_globals[chart_type + "_" + chart_id + "_1_str"];
    if (!chart_caption) {
        chart_caption = kv_globals["artalert0_str"];
    }
    if (!chart_caption_ok) {
        chart_caption_ok = kv_globals["artalert1_str"];
    }
    if (status === 'disable' || chart.getAttribute('data-activate') === "true") {
        chart.classList.remove("chartsalert--activate");
        chart.setAttribute('data-activate', false);
        if (chart_link_text) {
            chart_link_text.innerHTML = chart_caption;
        }
        if ($(".chart-tooltip-remove").length) {
            $(".chart-tooltip-remove").stop(true, true).hide(0, function() {
                displayTooltip($(".chart-tooltip-add"));
            });
        }
    } else if (status === 'enable' || chart.getAttribute('data-activate') !== "true") {
        chart.classList.add("chartsalert--activate");
        chart.setAttribute('data-activate', true);
        if (chart_link_text) {
            chart_link_text.innerHTML = chart_caption_ok;
        }
        if ($(".chart-tooltip-add").length) {
            $(".chart-tooltip-add").stop(true, true).hide(0, function() {
                displayTooltip($(".chart-tooltip-remove"));
            });
        }
    }
}

function getChartType(url) {
    if (url.search(new RegExp('type=')) > -1) {
        return url.match(new RegExp('type=(.[^&]*)'))[1];
    }
    return '';
}

function getChartVote(url) {
    if (url.search(new RegExp('vote=')) > -1) {
        return url.match(new RegExp('vote=(.[^&]*)'))[1];
    }
    return null;
}

function getChartId(url) {
    if (url.search(new RegExp('id=(.[^&]*)')) > -1) {
        return url.match(new RegExp('id=(.[^&]*)'))[1];
    }
    return null;
}
$('document').ready(function() {
    $('.tooltip__toggle').mouseenter(function() {
        $(this).parents('.tooltip').find('.tooltip__content').addClass('tooltip__content--visible');
    }).click(function() {
        $(this).parents('.tooltip').find('.tooltip__content').addClass('tooltip__content--visible');
    }).mouseleave(function() {
        $(this).parents('.tooltip').find('.tooltip__content').removeClass('tooltip__content--visible');
    });
    $('.tooltip__content').mouseleave(function() {
        $(this).parents('.tooltip').find('.tooltip__content').removeClass('tooltip__content--visible');
    });

    function positionTooltip() {}
});
var fConnectScript = "/misc/facebook/connect_a.php";
var fRegisterUrl = '/my/register.html?next=' + encodeURIComponent(window.location);
var fInprogress = false;
var fLoginbackurl = '';
var fExtendedPermission = new Array("email");
var fSession = 'undefined';
var fAppId = undefined;
var fAppLocale = undefined;

function fInit(app_id, app_locale) {
    if (typeof FB != 'undefined') {
        return true;
    }
    window.fbAsyncInit = function() {
        FB.init({
            appId: app_id,
            autoLogAppEvents: true,
            xfbml: true,
            version: 'v2.9'
        });
    };
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = "https://connect.facebook.net/" + app_locale + "/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
}

function fLogin(backurl) {
    if (fInprogress) {
        return false;
    }
    fLoginbackurl = backurl;
    var lburl = Utils.getCookie("login_backurl");
    if (lburl)
        fLoginbackurl = lburl;
    fInprogress = true;
    fShowLoader();
    FB.login(function(response) {
        fHideLoader();
        if (response.authResponse) {
            fGetPermission(response);
        }
    }, {
        auth_type: "rerequest",
        scope: fExtendedPermission.join(","),
        return_scopes: true
    });
    fInprogress = false;
}

function fGetPermission(response) {
    if (response.status == "connected") {
        fSession = response.authResponse;
        FB.api("/" + fSession.userID + "/permissions", function(result) {
            var perm = result.data;
            var found = 0;
            perm.forEach(function(p) {
                if ($.inArray(p.permission, fExtendedPermission) != -1 && p.status == "granted") {
                    found++
                }
            });
            if (found == fExtendedPermission.length) {
                fSaveSession(response);
            } else {
                FB.login(function(response) {
                    fSaveSession(response);
                }, {
                    auth_type: "rerequest",
                    scope: fExtendedPermission.join(",")
                });
            }
        });
    } else {
        return;
    }
}

function fSaveSession(response) {
    if (response.status == "connected") {
        FB.api("/" + response.authResponse.userID + "?fields=id,email,last_name,first_name,birthday", function(user) {
            if (user && !user.error) {
                if (user.email.match("@proxymail.facebook.com") != null)
                    window.location = fRegisterUrl;
                $.ajax({
                    url: fConnectScript,
                    type: "get",
                    data: user,
                    success: function() {
                        if (fLoginbackurl) {
                            window.location = fLoginbackurl;
                        } else {
                            window.location.reload();
                        }
                    }
                });
            } else {
                FB.api({
                    method: "Auth.revokeAuthorization"
                }, function() {});
                fBreakSession();
            }
        })
    }
}

function fShowLoader() {
    if ($('#fbloader')) {
        $("a.facebook").hide();
        $('#fbloader').css('display', 'block');
    }
}

function fHideLoader() {
    if ($('#fbloader')) {
        $('#fbloader').hide();
        $("a.facebook").show();
    }
}

function fBreakSession() {
    fHideLoader();
    FB.logout(function() {});
    return false;
}
/*! Video.js v4.3.0 Copyright 2013 Brightcove, Inc. https://github.com/videojs/video.js/blob/master/LICENSE */
(function() {
    var b = void 0,
        f = !0,
        h = null,
        l = !1;

    function m() {
        return function() {}
    }

    function p(a) {
        return function() {
            return this[a]
        }
    }

    function s(a) {
        return function() {
            return a
        }
    }
    var t;
    document.createElement("video");
    document.createElement("audio");
    document.createElement("track");

    function u(a, c, d) {
        if ("string" === typeof a) {
            0 === a.indexOf("#") && (a = a.slice(1));
            if (u.xa[a]) return u.xa[a];
            a = u.w(a)
        }
        if (!a || !a.nodeName) throw new TypeError("The element or ID supplied is not valid. (videojs)");
        return a.player || new u.s(a, c, d)
    }
    var v = u;
    window.Td = window.Ud = u;
    u.Tb = "4.3";
    u.Fc = "https:" == document.location.protocol ? "https://" : "http://";
    u.options = {
        techOrder: ["html5", "flash"],
        html5: {},
        flash: {},
        width: 300,
        height: 150,
        defaultVolume: 0,
        children: {
            mediaLoader: {},
            posterImage: {},
            textTrackDisplay: {},
            loadingSpinner: {},
            bigPlayButton: {},
            controlBar: {}
        },
        notSupportedMessage: 'Sorry, no compatible source and playback technology were found for this video. Try using another browser like <a href="http://bit.ly/ccMUEC">Chrome</a> or download the latest <a href="http://adobe.ly/mwfN1">Adobe Flash Player</a>.'
    };
    "GENERATED_CDN_VSN" !== u.Tb && (v.options.flash.swf = u.Fc + "vjs.zencdn.net/" + u.Tb + "/video-js.swf");
    u.xa = {};
    u.la = u.CoreObject = m();
    u.la.extend = function(a) {
        var c, d;
        a = a || {};
        c = a.init || a.i || this.prototype.init || this.prototype.i || m();
        d = function() {
            c.apply(this, arguments)
        };
        d.prototype = u.k.create(this.prototype);
        d.prototype.constructor = d;
        d.extend = u.la.extend;
        d.create = u.la.create;
        for (var e in a) a.hasOwnProperty(e) && (d.prototype[e] = a[e]);
        return d
    };
    u.la.create = function() {
        var a = u.k.create(this.prototype);
        this.apply(a, arguments);
        return a
    };
    u.d = function(a, c, d) {
        var e = u.getData(a);
        e.z || (e.z = {});
        e.z[c] || (e.z[c] = []);
        d.t || (d.t = u.t++);
        e.z[c].push(d);
        e.W || (e.disabled = l, e.W = function(c) {
            if (!e.disabled) {
                c = u.kc(c);
                var d = e.z[c.type];
                if (d)
                    for (var d = d.slice(0), k = 0, q = d.length; k < q && !c.pc(); k++) d[k].call(a, c)
            }
        });
        1 == e.z[c].length && (document.addEventListener ? a.addEventListener(c, e.W, l) : document.attachEvent && a.attachEvent("on" + c, e.W))
    };
    u.o = function(a, c, d) {
        if (u.oc(a)) {
            var e = u.getData(a);
            if (e.z)
                if (c) {
                    var g = e.z[c];
                    if (g) {
                        if (d) {
                            if (d.t)
                                for (e = 0; e < g.length; e++) g[e].t === d.t && g.splice(e--, 1)
                        } else e.z[c] = [];
                        u.gc(a, c)
                    }
                } else
                    for (g in e.z) c = g, e.z[c] = [], u.gc(a, c)
        }
    };
    u.gc = function(a, c) {
        var d = u.getData(a);
        0 === d.z[c].length && (delete d.z[c], document.removeEventListener ? a.removeEventListener(c, d.W, l) : document.detachEvent && a.detachEvent("on" + c, d.W));
        u.Bb(d.z) && (delete d.z, delete d.W, delete d.disabled);
        u.Bb(d) && u.vc(a)
    };
    u.kc = function(a) {
        function c() {
            return f
        }

        function d() {
            return l
        }
        if (!a || !a.Cb) {
            var e = a || window.event;
            a = {};
            for (var g in e) "layerX" !== g && "layerY" !== g && (a[g] = e[g]);
            a.target || (a.target = a.srcElement || document);
            a.relatedTarget = a.fromElement === a.target ? a.toElement : a.fromElement;
            a.preventDefault = function() {
                e.preventDefault && e.preventDefault();
                a.returnValue = l;
                a.Ab = c
            };
            a.Ab = d;
            a.stopPropagation = function() {
                e.stopPropagation && e.stopPropagation();
                a.cancelBubble = f;
                a.Cb = c
            };
            a.Cb = d;
            a.stopImmediatePropagation = function() {
                e.stopImmediatePropagation &&
                    e.stopImmediatePropagation();
                a.pc = c;
                a.stopPropagation()
            };
            a.pc = d;
            if (a.clientX != h) {
                g = document.documentElement;
                var j = document.body;
                a.pageX = a.clientX + (g && g.scrollLeft || j && j.scrollLeft || 0) - (g && g.clientLeft || j && j.clientLeft || 0);
                a.pageY = a.clientY + (g && g.scrollTop || j && j.scrollTop || 0) - (g && g.clientTop || j && j.clientTop || 0)
            }
            a.which = a.charCode || a.keyCode;
            a.button != h && (a.button = a.button & 1 ? 0 : a.button & 4 ? 1 : a.button & 2 ? 2 : 0)
        }
        return a
    };
    u.j = function(a, c) {
        var d = u.oc(a) ? u.getData(a) : {},
            e = a.parentNode || a.ownerDocument;
        "string" === typeof c && (c = {
            type: c,
            target: a
        });
        c = u.kc(c);
        d.W && d.W.call(a, c);
        if (e && !c.Cb() && c.bubbles !== l) u.j(e, c);
        else if (!e && !c.Ab() && (d = u.getData(c.target), c.target[c.type])) {
            d.disabled = f;
            if ("function" === typeof c.target[c.type]) c.target[c.type]();
            d.disabled = l
        }
        return !c.Ab()
    };
    u.U = function(a, c, d) {
        function e() {
            u.o(a, c, e);
            d.apply(this, arguments)
        }
        e.t = d.t = d.t || u.t++;
        u.d(a, c, e)
    };
    var w = Object.prototype.hasOwnProperty;
    u.e = function(a, c) {
        var d, e;
        d = document.createElement(a || "div");
        for (e in c) w.call(c, e) && (-1 !== e.indexOf("aria-") || "role" == e ? d.setAttribute(e, c[e]) : d[e] = c[e]);
        return d
    };
    u.$ = function(a) {
        return a.charAt(0).toUpperCase() + a.slice(1)
    };
    u.k = {};
    u.k.create = Object.create || function(a) {
        function c() {}
        c.prototype = a;
        return new c
    };
    u.k.ua = function(a, c, d) {
        for (var e in a) w.call(a, e) && c.call(d || this, e, a[e])
    };
    u.k.B = function(a, c) {
        if (!c) return a;
        for (var d in c) w.call(c, d) && (a[d] = c[d]);
        return a
    };
    u.k.ic = function(a, c) {
        var d, e, g;
        a = u.k.copy(a);
        for (d in c) w.call(c, d) && (e = a[d], g = c[d], a[d] = u.k.qc(e) && u.k.qc(g) ? u.k.ic(e, g) : c[d]);
        return a
    };
    u.k.copy = function(a) {
        return u.k.B({}, a)
    };
    u.k.qc = function(a) {
        return !!a && "object" === typeof a && "[object Object]" === a.toString() && a.constructor === Object
    };
    u.bind = function(a, c, d) {
        function e() {
            return c.apply(a, arguments)
        }
        c.t || (c.t = u.t++);
        e.t = d ? d + "_" + c.t : c.t;
        return e
    };
    u.ra = {};
    u.t = 1;
    u.expando = "vdata" + (new Date).getTime();
    u.getData = function(a) {
        var c = a[u.expando];
        c || (c = a[u.expando] = u.t++, u.ra[c] = {});
        return u.ra[c]
    };
    u.oc = function(a) {
        a = a[u.expando];
        return !(!a || u.Bb(u.ra[a]))
    };
    u.vc = function(a) {
        var c = a[u.expando];
        if (c) {
            delete u.ra[c];
            try {
                delete a[u.expando]
            } catch (d) {
                a.removeAttribute ? a.removeAttribute(u.expando) : a[u.expando] = h
            }
        }
    };
    u.Bb = function(a) {
        for (var c in a)
            if (a[c] !== h) return l;
        return f
    };
    u.n = function(a, c) {
        -1 == (" " + a.className + " ").indexOf(" " + c + " ") && (a.className = "" === a.className ? c : a.className + " " + c)
    };
    u.u = function(a, c) {
        var d, e;
        if (-1 != a.className.indexOf(c)) {
            d = a.className.split(" ");
            for (e = d.length - 1; 0 <= e; e--) d[e] === c && d.splice(e, 1);
            a.className = d.join(" ")
        }
    };
    u.na = u.e("video");
    u.F = navigator.userAgent;
    u.Mc = /iPhone/i.test(u.F);
    u.Lc = /iPad/i.test(u.F);
    u.Nc = /iPod/i.test(u.F);
    u.Kc = u.Mc || u.Lc || u.Nc;
    var aa = u,
        x;
    var y = u.F.match(/OS (\d+)_/i);
    x = y && y[1] ? y[1] : b;
    aa.Fd = x;
    u.Ic = /Android/i.test(u.F);
    var ba = u,
        z;
    var A = u.F.match(/Android (\d+)(?:\.(\d+))?(?:\.(\d+))*/i),
        B, C;
    A ? (B = A[1] && parseFloat(A[1]), C = A[2] && parseFloat(A[2]), z = B && C ? parseFloat(A[1] + "." + A[2]) : B ? B : h) : z = h;
    ba.Gc = z;
    u.Oc = u.Ic && /webkit/i.test(u.F) && 2.3 > u.Gc;
    u.Jc = /Firefox/i.test(u.F);
    u.Gd = /Chrome/i.test(u.F);
    u.ac = !!("ontouchstart" in window || window.Hc && document instanceof window.Hc);
    u.xb = function(a) {
        var c, d, e, g;
        c = {};
        if (a && a.attributes && 0 < a.attributes.length) {
            d = a.attributes;
            for (var j = d.length - 1; 0 <= j; j--) {
                e = d[j].name;
                g = d[j].value;
                if ("boolean" === typeof a[e] || -1 !== ",autoplay,controls,loop,muted,default,".indexOf("," + e + ",")) g = g !== h ? f : l;
                c[e] = g
            }
        }
        return c
    };
    u.Kd = function(a, c) {
        var d = "";
        document.defaultView && document.defaultView.getComputedStyle ? d = document.defaultView.getComputedStyle(a, "").getPropertyValue(c) : a.currentStyle && (d = a["client" + c.substr(0, 1).toUpperCase() + c.substr(1)] + "px");
        return d
    };
    u.zb = function(a, c) {
        c.firstChild ? c.insertBefore(a, c.firstChild) : c.appendChild(a)
    };
    u.Pb = {};
    u.w = function(a) {
        0 === a.indexOf("#") && (a = a.slice(1));
        return document.getElementById(a)
    };
    u.La = function(a, c) {
        c = c || a;
        var d = Math.floor(a % 60),
            e = Math.floor(a / 60 % 60),
            g = Math.floor(a / 3600),
            j = Math.floor(c / 60 % 60),
            k = Math.floor(c / 3600);
        if (isNaN(a) || Infinity === a) g = e = d = "-";
        g = 0 < g || 0 < k ? g + ":" : "";
        return g + (((g || 10 <= j) && 10 > e ? "0" + e : e) + ":") + (10 > d ? "0" + d : d)
    };
    u.Tc = function() {
        document.body.focus();
        document.onselectstart = s(l)
    };
    u.Bd = function() {
        document.onselectstart = s(f)
    };
    u.trim = function(a) {
        return (a + "").replace(/^\s+|\s+$/g, "")
    };
    u.round = function(a, c) {
        c || (c = 0);
        return Math.round(a * Math.pow(10, c)) / Math.pow(10, c)
    };
    u.tb = function(a, c) {
        return {
            length: 1,
            start: function() {
                return a
            },
            end: function() {
                return c
            }
        }
    };
    u.get = function(a, c, d) {
        var e, g;
        "undefined" === typeof XMLHttpRequest && (window.XMLHttpRequest = function() {
            try {
                return new window.ActiveXObject("Msxml2.XMLHTTP.6.0")
            } catch (a) {}
            try {
                return new window.ActiveXObject("Msxml2.XMLHTTP.3.0")
            } catch (c) {}
            try {
                return new window.ActiveXObject("Msxml2.XMLHTTP")
            } catch (d) {}
            throw Error("This browser does not support XMLHttpRequest.");
        });
        g = new XMLHttpRequest;
        try {
            g.open("GET", a)
        } catch (j) {
            d(j)
        }
        e = 0 === a.indexOf("file:") || 0 === window.location.href.indexOf("file:") && -1 === a.indexOf("http");
        g.onreadystatechange = function() {
            4 === g.readyState && (200 === g.status || e && 0 === g.status ? c(g.responseText) : d && d())
        };
        try {
            g.send()
        } catch (k) {
            d && d(k)
        }
    };
    u.td = function(a) {
        try {
            var c = window.localStorage || l;
            c && (c.volume = a)
        } catch (d) {
            22 == d.code || 1014 == d.code ? u.log("LocalStorage Full (VideoJS)", d) : 18 == d.code ? u.log("LocalStorage not allowed (VideoJS)", d) : u.log("LocalStorage Error (VideoJS)", d)
        }
    };
    u.mc = function(a) {
        a.match(/^https?:\/\//) || (a = u.e("div", {
            innerHTML: '<a href="' + a + '">x</a>'
        }).firstChild.href);
        return a
    };
    u.log = function() {
        u.log.history = u.log.history || [];
        u.log.history.push(arguments);
        window.console && window.console.log(Array.prototype.slice.call(arguments))
    };
    u.ad = function(a) {
        var c, d;
        a.getBoundingClientRect && a.parentNode && (c = a.getBoundingClientRect());
        if (!c) return {
            left: 0,
            top: 0
        };
        a = document.documentElement;
        d = document.body;
        return {
            left: c.left + (window.pageXOffset || d.scrollLeft) - (a.clientLeft || d.clientLeft || 0),
            top: c.top + (window.pageYOffset || d.scrollTop) - (a.clientTop || d.clientTop || 0)
        }
    };
    u.c = u.la.extend({
        i: function(a, c, d) {
            this.b = a;
            this.g = u.k.copy(this.g);
            c = this.options(c);
            this.Q = c.id || (c.el && c.el.id ? c.el.id : a.id() + "_component_" + u.t++);
            this.gd = c.name || h;
            this.a = c.el || this.e();
            this.G = [];
            this.qb = {};
            this.V = {};
            if ((a = this.g) && a.children) {
                var e = this;
                u.k.ua(a.children, function(a, c) {
                    c !== l && !c.loadEvent && (e[a] = e.Z(a, c))
                })
            }
            this.L(d)
        }
    });
    t = u.c.prototype;
    t.D = function() {
        this.j("dispose");
        if (this.G)
            for (var a = this.G.length - 1; 0 <= a; a--) this.G[a].D && this.G[a].D();
        this.V = this.qb = this.G = h;
        this.o();
        this.a.parentNode && this.a.parentNode.removeChild(this.a);
        u.vc(this.a);
        this.a = h
    };
    t.b = f;
    t.K = p("b");
    t.options = function(a) {
        return a === b ? this.g : this.g = u.k.ic(this.g, a)
    };
    t.e = function(a, c) {
        return u.e(a, c)
    };
    t.w = p("a");
    t.id = p("Q");
    t.name = p("gd");
    t.children = p("G");
    t.Z = function(a, c) {
        var d, e;
        "string" === typeof a ? (e = a, c = c || {}, d = c.componentClass || u.$(e), c.name = e, d = new window.videojs[d](this.b || this, c)) : d = a;
        this.G.push(d);
        "function" === typeof d.id && (this.qb[d.id()] = d);
        (e = e || d.name && d.name()) && (this.V[e] = d);
        "function" === typeof d.el && d.el() && (this.sa || this.a).appendChild(d.el());
        return d
    };
    t.removeChild = function(a) {
        "string" === typeof a && (a = this.V[a]);
        if (a && this.G) {
            for (var c = l, d = this.G.length - 1; 0 <= d; d--)
                if (this.G[d] === a) {
                    c = f;
                    this.G.splice(d, 1);
                    break
                } c && (this.qb[a.id] = h, this.V[a.name] = h, (c = a.w()) && c.parentNode === (this.sa || this.a) && (this.sa || this.a).removeChild(a.w()))
        }
    };
    t.T = s("");
    t.d = function(a, c) {
        u.d(this.a, a, u.bind(this, c));
        return this
    };
    t.o = function(a, c) {
        u.o(this.a, a, c);
        return this
    };
    t.U = function(a, c) {
        u.U(this.a, a, u.bind(this, c));
        return this
    };
    t.j = function(a, c) {
        u.j(this.a, a, c);
        return this
    };
    t.L = function(a) {
        a && (this.aa ? a.call(this) : (this.Sa === b && (this.Sa = []), this.Sa.push(a)));
        return this
    };
    t.Ua = function() {
        this.aa = f;
        var a = this.Sa;
        if (a && 0 < a.length) {
            for (var c = 0, d = a.length; c < d; c++) a[c].call(this);
            this.Sa = [];
            this.j("ready")
        }
    };
    t.n = function(a) {
        u.n(this.a, a);
        return this
    };
    t.u = function(a) {
        u.u(this.a, a);
        return this
    };
    t.show = function() {
        this.a.style.display = "block";
        return this
    };
    t.C = function() {
        this.a.style.display = "none";
        return this
    };

    function D(a) {
        a.u("vjs-lock-showing")
    }
    t.disable = function() {
        this.C();
        this.show = m()
    };
    t.width = function(a, c) {
        return E(this, "width", a, c)
    };
    t.height = function(a, c) {
        return E(this, "height", a, c)
    };
    t.Xc = function(a, c) {
        return this.width(a, f).height(c)
    };

    function E(a, c, d, e) {
        if (d !== b) return a.a.style[c] = -1 !== ("" + d).indexOf("%") || -1 !== ("" + d).indexOf("px") ? d : "auto" === d ? "" : d + "px", e || a.j("resize"), a;
        if (!a.a) return 0;
        d = a.a.style[c];
        e = d.indexOf("px");
        return -1 !== e ? parseInt(d.slice(0, e), 10) : parseInt(a.a["offset" + u.$(c)], 10)
    }
    u.q = u.c.extend({
        i: function(a, c) {
            u.c.call(this, a, c);
            var d = l;
            this.d("touchstart", function(a) {
                a.preventDefault();
                d = f
            });
            this.d("touchmove", function() {
                d = l
            });
            var e = this;
            this.d("touchend", function(a) {
                d && e.p(a);
                a.preventDefault()
            });
            this.d("click", this.p);
            this.d("focus", this.Oa);
            this.d("blur", this.Na)
        }
    });
    t = u.q.prototype;
    t.e = function(a, c) {
        c = u.k.B({
            className: this.T(),
            innerHTML: '<div class="vjs-control-content"><span class="vjs-control-text">' + (this.qa || "Need Text") + "</span></div>",
            qd: "button",
            "aria-live": "polite",
            tabIndex: 0
        }, c);
        return u.c.prototype.e.call(this, a, c)
    };
    t.T = function() {
        return "vjs-control " + u.c.prototype.T.call(this)
    };
    t.p = m();
    t.Oa = function() {
        u.d(document, "keyup", u.bind(this, this.ba))
    };
    t.ba = function(a) {
        if (32 == a.which || 13 == a.which) a.preventDefault(), this.p()
    };
    t.Na = function() {
        u.o(document, "keyup", u.bind(this, this.ba))
    };
    u.O = u.c.extend({
        i: function(a, c) {
            u.c.call(this, a, c);
            this.Sc = this.V[this.g.barName];
            this.handle = this.V[this.g.handleName];
            a.d(this.tc, u.bind(this, this.update));
            this.d("mousedown", this.Pa);
            this.d("touchstart", this.Pa);
            this.d("focus", this.Oa);
            this.d("blur", this.Na);
            this.d("click", this.p);
            this.b.d("controlsvisible", u.bind(this, this.update));
            a.L(u.bind(this, this.update));
            this.P = {}
        }
    });
    t = u.O.prototype;
    t.e = function(a, c) {
        c = c || {};
        c.className += " vjs-slider";
        c = u.k.B({
            qd: "slider",
            "aria-valuenow": 0,
            "aria-valuemin": 0,
            "aria-valuemax": 100,
            tabIndex: 0
        }, c);
        return u.c.prototype.e.call(this, a, c)
    };
    t.Pa = function(a) {
        a.preventDefault();
        u.Tc();
        this.P.move = u.bind(this, this.Hb);
        this.P.end = u.bind(this, this.Ib);
        u.d(document, "mousemove", this.P.move);
        u.d(document, "mouseup", this.P.end);
        u.d(document, "touchmove", this.P.move);
        u.d(document, "touchend", this.P.end);
        this.Hb(a)
    };
    t.Ib = function() {
        u.Bd();
        u.o(document, "mousemove", this.P.move, l);
        u.o(document, "mouseup", this.P.end, l);
        u.o(document, "touchmove", this.P.move, l);
        u.o(document, "touchend", this.P.end, l);
        this.update()
    };
    t.update = function() {
        if (this.a) {
            var a, c = this.yb(),
                d = this.handle,
                e = this.Sc;
            isNaN(c) && (c = 0);
            a = c;
            if (d) {
                a = this.a.offsetWidth;
                var g = d.w().offsetWidth;
                a = g ? g / a : 0;
                c *= 1 - a;
                a = c + a / 2;
                d.w().style.left = u.round(100 * c, 2) + "%"
            }
            e.w().style.width = u.round(100 * a, 2) + "%"
        }
    };

    function F(a, c) {
        var d, e, g, j;
        d = a.a;
        e = u.ad(d);
        j = g = d.offsetWidth;
        d = a.handle;
        if (a.g.Cd) return j = e.top, e = c.changedTouches ? c.changedTouches[0].pageY : c.pageY, d && (d = d.w().offsetHeight, j += d / 2, g -= d), Math.max(0, Math.min(1, (j - e + g) / g));
        g = e.left;
        e = c.changedTouches ? c.changedTouches[0].pageX : c.pageX;
        d && (d = d.w().offsetWidth, g += d / 2, j -= d);
        return Math.max(0, Math.min(1, (e - g) / j))
    }
    t.Oa = function() {
        u.d(document, "keyup", u.bind(this, this.ba))
    };
    t.ba = function(a) {
        37 == a.which ? (a.preventDefault(), this.yc()) : 39 == a.which && (a.preventDefault(), this.zc())
    };
    t.Na = function() {
        u.o(document, "keyup", u.bind(this, this.ba))
    };
    t.p = function(a) {
        a.stopImmediatePropagation();
        a.preventDefault()
    };
    u.ea = u.c.extend();
    u.ea.prototype.defaultValue = 0;
    u.ea.prototype.e = function(a, c) {
        c = c || {};
        c.className += " vjs-slider-handle";
        c = u.k.B({
            innerHTML: '<span class="vjs-control-text">' + this.defaultValue + "</span>"
        }, c);
        return u.c.prototype.e.call(this, "div", c)
    };
    u.ma = u.c.extend();

    function ca(a, c) {
        a.Z(c);
        c.d("click", u.bind(a, function() {
            D(this)
        }))
    }
    u.ma.prototype.e = function() {
        var a = this.options().Vc || "ul";
        this.sa = u.e(a, {
            className: "vjs-menu-content"
        });
        a = u.c.prototype.e.call(this, "div", {
            append: this.sa,
            className: "vjs-menu"
        });
        a.appendChild(this.sa);
        u.d(a, "click", function(a) {
            a.preventDefault();
            a.stopImmediatePropagation()
        });
        return a
    };
    u.N = u.q.extend({
        i: function(a, c) {
            u.q.call(this, a, c);
            this.selected(c.selected)
        }
    });
    u.N.prototype.e = function(a, c) {
        return u.q.prototype.e.call(this, "li", u.k.B({
            className: "vjs-menu-item",
            innerHTML: this.g.label
        }, c))
    };
    u.N.prototype.p = function() {
        this.selected(f)
    };
    u.N.prototype.selected = function(a) {
        a ? (this.n("vjs-selected"), this.a.setAttribute("aria-selected", f)) : (this.u("vjs-selected"), this.a.setAttribute("aria-selected", l))
    };
    u.R = u.q.extend({
        i: function(a, c) {
            u.q.call(this, a, c);
            this.wa = this.Ka();
            this.Z(this.wa);
            this.I && 0 === this.I.length && this.C();
            this.d("keyup", this.ba);
            this.a.setAttribute("aria-haspopup", f);
            this.a.setAttribute("role", "button")
        }
    });
    t = u.R.prototype;
    t.pa = l;
    t.Ka = function() {
        var a = new u.ma(this.b);
        this.options().title && a.w().appendChild(u.e("li", {
            className: "vjs-menu-title",
            innerHTML: u.$(this.A),
            zd: -1
        }));
        if (this.I = this.createItems())
            for (var c = 0; c < this.I.length; c++) ca(a, this.I[c]);
        return a
    };
    t.ta = m();
    t.T = function() {
        return this.className + " vjs-menu-button " + u.q.prototype.T.call(this)
    };
    t.Oa = m();
    t.Na = m();
    t.p = function() {
        this.U("mouseout", u.bind(this, function() {
            D(this.wa);
            this.a.blur()
        }));
        this.pa ? G(this) : H(this)
    };
    t.ba = function(a) {
        a.preventDefault();
        32 == a.which || 13 == a.which ? this.pa ? G(this) : H(this) : 27 == a.which && this.pa && G(this)
    };

    function H(a) {
        a.pa = f;
        a.wa.n("vjs-lock-showing");
        a.a.setAttribute("aria-pressed", f);
        a.I && 0 < a.I.length && a.I[0].w().focus()
    }

    function G(a) {
        a.pa = l;
        D(a.wa);
        a.a.setAttribute("aria-pressed", l)
    }
    u.s = u.c.extend({
        i: function(a, c, d) {
            this.M = a;
            c = u.k.B(da(a), c);
            this.v = {};
            this.uc = c.poster;
            this.sb = c.controls;
            a.controls = l;
            u.c.call(this, this, c, d);
            this.controls() ? this.n("vjs-controls-enabled") : this.n("vjs-controls-disabled");
            this.U("play", function(a) {
                u.j(this.a, {
                    type: "firstplay",
                    target: this.a
                }) || (a.preventDefault(), a.stopPropagation(), a.stopImmediatePropagation())
            });
            this.d("ended", this.hd);
            this.d("play", this.Kb);
            this.d("firstplay", this.jd);
            this.d("pause", this.Jb);
            this.d("progress", this.ld);
            this.d("durationchange",
                this.sc);
            this.d("error", this.Gb);
            this.d("fullscreenchange", this.kd);
            u.xa[this.Q] = this;
            c.plugins && u.k.ua(c.plugins, function(a, c) {
                this[a](c)
            }, this);
            var e, g, j, k;
            e = this.Mb;
            a = function() {
                e();
                clearInterval(g);
                g = setInterval(u.bind(this, e), 250)
            };
            c = function() {
                e();
                clearInterval(g)
            };
            this.d("mousedown", a);
            this.d("mousemove", e);
            this.d("mouseup", c);
            this.d("keydown", e);
            this.d("keyup", e);
            this.d("touchstart", a);
            this.d("touchmove", e);
            this.d("touchend", c);
            this.d("touchcancel", c);
            j = setInterval(u.bind(this, function() {
                this.ka &&
                    (this.ka = l, this.ja(f), clearTimeout(k), k = setTimeout(u.bind(this, function() {
                        this.ka || this.ja(l)
                    }), 2E3))
            }), 250);
            this.d("dispose", function() {
                clearInterval(j);
                clearTimeout(k)
            })
        }
    });
    t = u.s.prototype;
    t.g = u.options;
    t.D = function() {
        this.j("dispose");
        this.o("dispose");
        u.xa[this.Q] = h;
        this.M && this.M.player && (this.M.player = h);
        this.a && this.a.player && (this.a.player = h);
        clearInterval(this.Ra);
        this.za();
        this.h && this.h.D();
        u.c.prototype.D.call(this)
    };

    function da(a) {
        var c = {
            sources: [],
            tracks: []
        };
        u.k.B(c, u.xb(a));
        if (a.hasChildNodes()) {
            var d, e, g, j;
            a = a.childNodes;
            g = 0;
            for (j = a.length; g < j; g++) d = a[g], e = d.nodeName.toLowerCase(), "source" === e ? c.sources.push(u.xb(d)) : "track" === e && c.tracks.push(u.xb(d))
        }
        return c
    }
    t.e = function() {
        var a = this.a = u.c.prototype.e.call(this, "div"),
            c = this.M;
        c.removeAttribute("width");
        c.removeAttribute("height");
        if (c.hasChildNodes()) {
            var d, e, g, j, k;
            d = c.childNodes;
            e = d.length;
            for (k = []; e--;) g = d[e], j = g.nodeName.toLowerCase(), "track" === j && k.push(g);
            for (d = 0; d < k.length; d++) c.removeChild(k[d])
        }
        c.id = c.id || "vjs_video_" + u.t++;
        a.id = c.id;
        a.className = c.className;
        c.id += "_html5_api";
        c.className = "vjs-tech";
        c.player = a.player = this;
        this.n("vjs-paused");
        this.width(this.g.width, f);
        this.height(this.g.height,
            f);
        c.parentNode && c.parentNode.insertBefore(a, c);
        u.zb(c, a);
        return a
    };

    function I(a, c, d) {
        a.h ? (a.aa = l, a.h.D(), a.Eb && (a.Eb = l, clearInterval(a.Ra)), a.Fb && J(a), a.h = l) : "Html5" !== c && a.M && (u.l.jc(a.M), a.M = h);
        a.ia = c;
        a.aa = l;
        var e = u.k.B({
            source: d,
            parentEl: a.a
        }, a.g[c.toLowerCase()]);
        d && (d.src == a.v.src && 0 < a.v.currentTime && (e.startTime = a.v.currentTime), a.v.src = d.src);
        a.h = new window.videojs[c](a, e);
        a.h.L(function() {
            this.b.Ua();
            if (!this.m.progressEvents) {
                var a = this.b;
                a.Eb = f;
                a.Ra = setInterval(u.bind(a, function() {
                    this.v.lb < this.buffered().end(0) ? this.j("progress") : 1 == this.Ja() && (clearInterval(this.Ra),
                        this.j("progress"))
                }), 500);
                a.h.U("progress", function() {
                    this.m.progressEvents = f;
                    var a = this.b;
                    a.Eb = l;
                    clearInterval(a.Ra)
                })
            }
            this.m.timeupdateEvents || (a = this.b, a.Fb = f, a.d("play", a.Cc), a.d("pause", a.za), a.h.U("timeupdate", function() {
                this.m.timeupdateEvents = f;
                J(this.b)
            }))
        })
    }

    function J(a) {
        a.Fb = l;
        a.za();
        a.o("play", a.Cc);
        a.o("pause", a.za)
    }
    t.Cc = function() {
        this.hc && this.za();
        this.hc = setInterval(u.bind(this, function() {
            this.j("timeupdate")
        }), 250)
    };
    t.za = function() {
        clearInterval(this.hc)
    };
    t.Kb = function() {
        u.u(this.a, "vjs-paused");
        u.n(this.a, "vjs-playing")
    };
    t.jd = function() {
        this.g.starttime && this.currentTime(this.g.starttime);
        this.n("vjs-has-started")
    };
    t.Jb = function() {
        u.u(this.a, "vjs-playing");
        u.n(this.a, "vjs-paused")
    };
    t.ld = function() {
        1 == this.Ja() && this.j("loadedalldata")
    };
    t.hd = function() {
        this.g.loop && (this.currentTime(0), this.play())
    };
    t.sc = function() {
        this.duration(K(this, "duration"))
    };
    t.kd = function() {
        this.H ? this.n("vjs-fullscreen") : this.u("vjs-fullscreen")
    };
    t.Gb = function(a) {
        u.log("Video Error", a)
    };

    function L(a, c, d) {
        if (a.h && !a.h.aa) a.h.L(function() {
            this[c](d)
        });
        else try {
            a.h[c](d)
        } catch (e) {
            throw u.log(e), e;
        }
    }

    function K(a, c) {
        if (a.h && a.h.aa) try {
            return a.h[c]()
        } catch (d) {
            throw a.h[c] === b ? u.log("Video.js: " + c + " method not defined for " + a.ia + " playback technology.", d) : "TypeError" == d.name ? (u.log("Video.js: " + c + " unavailable on " + a.ia + " playback technology element.", d), a.h.aa = l) : u.log(d), d;
        }
    }
    t.play = function() {
        L(this, "play");
        return this
    };
    t.pause = function() {
        L(this, "pause");
        return this
    };
    t.paused = function() {
        return K(this, "paused") === l ? l : f
    };
    t.currentTime = function(a) {
        return a !== b ? (this.v.rc = a, L(this, "setCurrentTime", a), this.Fb && this.j("timeupdate"), this) : this.v.currentTime = K(this, "currentTime") || 0
    };
    t.duration = function(a) {
        if (a !== b) return this.v.duration = parseFloat(a), this;
        this.v.duration === b && this.sc();
        return this.v.duration
    };
    t.buffered = function() {
        var a = K(this, "buffered"),
            c = a.length - 1,
            d = this.v.lb = this.v.lb || 0;
        a && (0 <= c && a.end(c) !== d) && (d = a.end(c), this.v.lb = d);
        return u.tb(0, d)
    };
    t.Ja = function() {
        return this.duration() ? this.buffered().end(0) / this.duration() : 0
    };
    t.volume = function(a) {
        if (a !== b) return a = Math.max(0, Math.min(1, parseFloat(a))), this.v.volume = a, L(this, "setVolume", a), u.td(a), this;
        a = parseFloat(K(this, "volume"));
        return isNaN(a) ? 1 : a
    };
    t.muted = function(a) {
        return a !== b ? (L(this, "setMuted", a), this) : K(this, "muted") || l
    };
    t.Ta = function() {
        return K(this, "supportsFullScreen") || l
    };
    t.ya = function() {
        var a = u.Pb.ya;
        this.H = f;
        a ? (u.d(document, a.vb, u.bind(this, function(c) {
            this.H = document[a.H];
            this.H === l && u.o(document, a.vb, arguments.callee);
            this.j("fullscreenchange")
        })), this.a[a.wc]()) : this.h.Ta() ? L(this, "enterFullScreen") : (this.cd = f, this.Yc = document.documentElement.style.overflow, u.d(document, "keydown", u.bind(this, this.lc)), document.documentElement.style.overflow = "hidden", u.n(document.body, "vjs-full-window"), this.j("enterFullWindow"), this.j("fullscreenchange"));
        return this
    };
    t.ob = function() {
        var a = u.Pb.ya;
        this.H = l;
        if (a) document[a.nb]();
        else this.h.Ta() ? L(this, "exitFullScreen") : (M(this), this.j("fullscreenchange"));
        return this
    };
    t.lc = function(a) {
        27 === a.keyCode && (this.H === f ? this.ob() : M(this))
    };

    function M(a) {
        a.cd = l;
        u.o(document, "keydown", a.lc);
        document.documentElement.style.overflow = a.Yc;
        u.u(document.body, "vjs-full-window");
        a.j("exitFullWindow")
    }
    t.src = function(a) {
        if (a instanceof Array) {
            var c;
            a: {
                c = a;
                for (var d = 0, e = this.g.techOrder; d < e.length; d++) {
                    var g = u.$(e[d]),
                        j = window.videojs[g];
                    if (j.isSupported())
                        for (var k = 0, q = c; k < q.length; k++) {
                            var n = q[k];
                            if (j.canPlaySource(n)) {
                                c = {
                                    source: n,
                                    h: g
                                };
                                break a
                            }
                        }
                }
                c = l
            }
            c ? (a = c.source, c = c.h, c == this.ia ? this.src(a) : I(this, c, a)) : this.a.appendChild(u.e("p", {
                innerHTML: this.options().notSupportedMessage
            }))
        } else a instanceof Object ? window.videojs[this.ia].canPlaySource(a) ? this.src(a.src) : this.src([a]) : (this.v.src = a, this.aa ?
            (L(this, "src", a), "auto" == this.g.preload && this.load(), this.g.autoplay && this.play()) : this.L(function() {
                this.src(a)
            }));
        return this
    };
    t.load = function() {
        L(this, "load");
        return this
    };
    t.currentSrc = function() {
        return K(this, "currentSrc") || this.v.src || ""
    };
    t.Qa = function(a) {
        return a !== b ? (L(this, "setPreload", a), this.g.preload = a, this) : K(this, "preload")
    };
    t.autoplay = function(a) {
        return a !== b ? (L(this, "setAutoplay", a), this.g.autoplay = a, this) : K(this, "autoplay")
    };
    t.loop = function(a) {
        return a !== b ? (L(this, "setLoop", a), this.g.loop = a, this) : K(this, "loop")
    };
    t.poster = function(a) {
        return a !== b ? (this.uc = a, this) : this.uc
    };
    t.controls = function(a) {
        return a !== b ? (a = !!a, this.sb !== a && ((this.sb = a) ? (this.u("vjs-controls-disabled"), this.n("vjs-controls-enabled"), this.j("controlsenabled")) : (this.u("vjs-controls-enabled"), this.n("vjs-controls-disabled"), this.j("controlsdisabled"))), this) : this.sb
    };
    u.s.prototype.Sb;
    t = u.s.prototype;
    t.Rb = function(a) {
        return a !== b ? (a = !!a, this.Sb !== a && ((this.Sb = a) ? (this.n("vjs-using-native-controls"), this.j("usingnativecontrols")) : (this.u("vjs-using-native-controls"), this.j("usingcustomcontrols"))), this) : this.Sb
    };
    t.error = function() {
        return K(this, "error")
    };
    t.seeking = function() {
        return K(this, "seeking")
    };
    t.ka = f;
    t.Mb = function() {
        this.ka = f
    };
    t.Qb = f;
    t.ja = function(a) {
        return a !== b ? (a = !!a, a !== this.Qb && ((this.Qb = a) ? (this.ka = f, this.u("vjs-user-inactive"), this.n("vjs-user-active"), this.j("useractive")) : (this.ka = l, this.h.U("mousemove", function(a) {
            a.stopPropagation();
            a.preventDefault()
        }), this.u("vjs-user-active"), this.n("vjs-user-inactive"), this.j("userinactive"))), this) : this.Qb
    };
    var N, O, P;
    P = document.createElement("div");
    O = {};
    P.Hd !== b ? (O.wc = "requestFullscreen", O.nb = "exitFullscreen", O.vb = "fullscreenchange", O.H = "fullScreen") : (document.mozCancelFullScreen ? (N = "moz", O.H = N + "FullScreen") : (N = "webkit", O.H = N + "IsFullScreen"), P[N + "RequestFullScreen"] && (O.wc = N + "RequestFullScreen", O.nb = N + "CancelFullScreen"), O.vb = N + "fullscreenchange");
    document[O.nb] && (u.Pb.ya = O);
    u.Fa = u.c.extend();
    u.Fa.prototype.g = {
        Md: "play",
        children: {
            playToggle: {},
            currentTimeDisplay: {},
            timeDivider: {},
            durationDisplay: {},
            remainingTimeDisplay: {},
            progressControl: {},
            fullscreenToggle: {},
            volumeControl: {},
            muteToggle: {}
        }
    };
    u.Fa.prototype.e = function() {
        return u.e("div", {
            className: "vjs-control-bar"
        })
    };
    u.Yb = u.q.extend({
        i: function(a, c) {
            u.q.call(this, a, c);
            a.d("play", u.bind(this, this.Kb));
            a.d("pause", u.bind(this, this.Jb))
        }
    });
    t = u.Yb.prototype;
    t.qa = "Play";
    t.T = function() {
        return "vjs-play-control " + u.q.prototype.T.call(this)
    };
    t.p = function() {
        this.b.paused() ? this.b.play() : this.b.pause()
    };
    t.Kb = function() {
        u.u(this.a, "vjs-paused");
        u.n(this.a, "vjs-playing");
        this.a.children[0].children[0].innerHTML = "Pause"
    };
    t.Jb = function() {
        u.u(this.a, "vjs-playing");
        u.n(this.a, "vjs-paused");
        this.a.children[0].children[0].innerHTML = "Play"
    };
    u.Ya = u.c.extend({
        i: function(a, c) {
            u.c.call(this, a, c);
            a.d("timeupdate", u.bind(this, this.Ca))
        }
    });
    u.Ya.prototype.e = function() {
        var a = u.c.prototype.e.call(this, "div", {
            className: "vjs-current-time vjs-time-controls vjs-control"
        });
        this.content = u.e("div", {
            className: "vjs-current-time-display",
            innerHTML: '<span class="vjs-control-text">Current Time </span>0:00',
            "aria-live": "off"
        });
        a.appendChild(u.e("div").appendChild(this.content));
        return a
    };
    u.Ya.prototype.Ca = function() {
        var a = this.b.Nb ? this.b.v.currentTime : this.b.currentTime();
        this.content.innerHTML = '<span class="vjs-control-text">Current Time </span>' + u.La(a, this.b.duration())
    };
    u.Za = u.c.extend({
        i: function(a, c) {
            u.c.call(this, a, c);
            a.d("timeupdate", u.bind(this, this.Ca))
        }
    });
    u.Za.prototype.e = function() {
        var a = u.c.prototype.e.call(this, "div", {
            className: "vjs-duration vjs-time-controls vjs-control"
        });
        this.content = u.e("div", {
            className: "vjs-duration-display",
            innerHTML: '<span class="vjs-control-text">Duration Time </span>0:00',
            "aria-live": "off"
        });
        a.appendChild(u.e("div").appendChild(this.content));
        return a
    };
    u.Za.prototype.Ca = function() {
        var a = this.b.duration();
        a && (this.content.innerHTML = '<span class="vjs-control-text">Duration Time </span>' + u.La(a))
    };
    u.cc = u.c.extend({
        i: function(a, c) {
            u.c.call(this, a, c)
        }
    });
    u.cc.prototype.e = function() {
        return u.c.prototype.e.call(this, "div", {
            className: "vjs-time-divider",
            innerHTML: "<div><span>/</span></div>"
        })
    };
    u.fb = u.c.extend({
        i: function(a, c) {
            u.c.call(this, a, c);
            a.d("timeupdate", u.bind(this, this.Ca))
        }
    });
    u.fb.prototype.e = function() {
        var a = u.c.prototype.e.call(this, "div", {
            className: "vjs-remaining-time vjs-time-controls vjs-control"
        });
        this.content = u.e("div", {
            className: "vjs-remaining-time-display",
            innerHTML: '<span class="vjs-control-text">Remaining Time </span>-0:00',
            "aria-live": "off"
        });
        a.appendChild(u.e("div").appendChild(this.content));
        return a
    };
    u.fb.prototype.Ca = function() {
        this.b.duration() && (this.content.innerHTML = '<span class="vjs-control-text">Remaining Time </span>-' + u.La(this.b.duration() - this.b.currentTime()))
    };
    u.Ga = u.q.extend({
        i: function(a, c) {
            u.q.call(this, a, c)
        }
    });
    u.Ga.prototype.qa = "Fullscreen";
    u.Ga.prototype.T = function() {
        return "vjs-fullscreen-control " + u.q.prototype.T.call(this)
    };
    u.Ga.prototype.p = function() {
        this.b.H ? (this.b.ob(), this.a.children[0].children[0].innerHTML = "Fullscreen") : (this.b.ya(), this.a.children[0].children[0].innerHTML = "Non-Fullscreen")
    };
    u.eb = u.c.extend({
        i: function(a, c) {
            u.c.call(this, a, c)
        }
    });
    u.eb.prototype.g = {
        children: {
            seekBar: {}
        }
    };
    u.eb.prototype.e = function() {
        return u.c.prototype.e.call(this, "div", {
            className: "vjs-progress-control vjs-control"
        })
    };
    u.Zb = u.O.extend({
        i: function(a, c) {
            u.O.call(this, a, c);
            a.d("timeupdate", u.bind(this, this.Ba));
            a.L(u.bind(this, this.Ba))
        }
    });
    t = u.Zb.prototype;
    t.g = {
        children: {
            loadProgressBar: {},
            playProgressBar: {},
            seekHandle: {}
        },
        barName: "playProgressBar",
        handleName: "seekHandle"
    };
    t.tc = "timeupdate";
    t.e = function() {
        return u.O.prototype.e.call(this, "div", {
            className: "vjs-progress-holder",
            "aria-label": "video progress bar"
        })
    };
    t.Ba = function() {
        var a = this.b.Nb ? this.b.v.currentTime : this.b.currentTime();
        this.a.setAttribute("aria-valuenow", u.round(100 * this.yb(), 2));
        this.a.setAttribute("aria-valuetext", u.La(a, this.b.duration()))
    };
    t.yb = function() {
        var a;
        "Flash" === this.b.ia && this.b.seeking() ? (a = this.b.v, a = a.rc ? a.rc : this.b.currentTime()) : a = this.b.currentTime();
        return a / this.b.duration()
    };
    t.Pa = function(a) {
        u.O.prototype.Pa.call(this, a);
        this.b.Nb = f;
        this.Dd = !this.b.paused();
        this.b.pause()
    };
    t.Hb = function(a) {
        a = F(this, a) * this.b.duration();
        a == this.b.duration() && (a -= 0.1);
        this.b.currentTime(a)
    };
    t.Ib = function(a) {
        u.O.prototype.Ib.call(this, a);
        this.b.Nb = l;
        this.Dd && this.b.play()
    };
    t.zc = function() {
        this.b.currentTime(this.b.currentTime() + 5)
    };
    t.yc = function() {
        this.b.currentTime(this.b.currentTime() - 5)
    };
    u.ab = u.c.extend({
        i: function(a, c) {
            u.c.call(this, a, c);
            a.d("progress", u.bind(this, this.update))
        }
    });
    u.ab.prototype.e = function() {
        return u.c.prototype.e.call(this, "div", {
            className: "vjs-load-progress",
            innerHTML: '<span class="vjs-control-text">Loaded: 0%</span>'
        })
    };
    u.ab.prototype.update = function() {
        this.a.style && (this.a.style.width = u.round(100 * this.b.Ja(), 2) + "%")
    };
    u.Xb = u.c.extend({
        i: function(a, c) {
            u.c.call(this, a, c)
        }
    });
    u.Xb.prototype.e = function() {
        return u.c.prototype.e.call(this, "div", {
            className: "vjs-play-progress",
            innerHTML: '<span class="vjs-control-text">Progress: 0%</span>'
        })
    };
    u.gb = u.ea.extend();
    u.gb.prototype.defaultValue = "00:00";
    u.gb.prototype.e = function() {
        return u.ea.prototype.e.call(this, "div", {
            className: "vjs-seek-handle"
        })
    };
    u.ib = u.c.extend({
        i: function(a, c) {
            u.c.call(this, a, c);
            a.h && (a.h.m && a.h.m.volumeControl === l) && this.n("vjs-hidden");
            a.d("loadstart", u.bind(this, function() {
                a.h.m && a.h.m.volumeControl === l ? this.n("vjs-hidden") : this.u("vjs-hidden")
            }))
        }
    });
    u.ib.prototype.g = {
        children: {
            volumeBar: {}
        }
    };
    u.ib.prototype.e = function() {
        return u.c.prototype.e.call(this, "div", {
            className: "vjs-volume-control vjs-control"
        })
    };
    u.hb = u.O.extend({
        i: function(a, c) {
            u.O.call(this, a, c);
            a.d("volumechange", u.bind(this, this.Ba));
            a.L(u.bind(this, this.Ba));
            setTimeout(u.bind(this, this.update), 0)
        }
    });
    t = u.hb.prototype;
    t.Ba = function() {
        this.a.setAttribute("aria-valuenow", u.round(100 * this.b.volume(), 2));
        this.a.setAttribute("aria-valuetext", u.round(100 * this.b.volume(), 2) + "%")
    };
    t.g = {
        children: {
            volumeLevel: {},
            volumeHandle: {}
        },
        barName: "volumeLevel",
        handleName: "volumeHandle"
    };
    t.tc = "volumechange";
    t.e = function() {
        return u.O.prototype.e.call(this, "div", {
            className: "vjs-volume-bar",
            "aria-label": "volume level"
        })
    };
    t.Hb = function(a) {
        this.b.muted() && this.b.muted(l);
        this.b.volume(F(this, a))
    };
    t.yb = function() {
        return this.b.muted() ? 0 : this.b.volume()
    };
    t.zc = function() {
        this.b.volume(this.b.volume() + 0.1)
    };
    t.yc = function() {
        this.b.volume(this.b.volume() - 0.1)
    };
    u.dc = u.c.extend({
        i: function(a, c) {
            u.c.call(this, a, c)
        }
    });
    u.dc.prototype.e = function() {
        return u.c.prototype.e.call(this, "div", {
            className: "vjs-volume-level",
            innerHTML: '<span class="vjs-control-text"></span>'
        })
    };
    u.jb = u.ea.extend();
    u.jb.prototype.defaultValue = "00:00";
    u.jb.prototype.e = function() {
        return u.ea.prototype.e.call(this, "div", {
            className: "vjs-volume-handle"
        })
    };
    u.da = u.q.extend({
        i: function(a, c) {
            u.q.call(this, a, c);
            a.d("volumechange", u.bind(this, this.update));
            a.h && (a.h.m && a.h.m.volumeControl === l) && this.n("vjs-hidden");
            a.d("loadstart", u.bind(this, function() {
                a.h.m && a.h.m.volumeControl === l ? this.n("vjs-hidden") : this.u("vjs-hidden")
            }))
        }
    });
    u.da.prototype.e = function() {
        return u.q.prototype.e.call(this, "div", {
            className: "vjs-mute-control vjs-control",
            innerHTML: '<div><span class="vjs-control-text">Mute</span></div>'
        })
    };
    u.da.prototype.p = function() {
        this.b.muted(this.b.muted() ? l : f)
    };
    u.da.prototype.update = function() {
        var a = this.b.volume(),
            c = 3;
        0 === a || this.b.muted() ? c = 0 : 0.33 > a ? c = 1 : 0.67 > a && (c = 2);
        this.b.muted() ? "Unmute" != this.a.children[0].children[0].innerHTML && (this.a.children[0].children[0].innerHTML = "Unmute") : "Mute" != this.a.children[0].children[0].innerHTML && (this.a.children[0].children[0].innerHTML = "Mute");
        for (a = 0; 4 > a; a++) u.u(this.a, "vjs-vol-" + a);
        u.n(this.a, "vjs-vol-" + c)
    };
    u.oa = u.R.extend({
        i: function(a, c) {
            u.R.call(this, a, c);
            a.d("volumechange", u.bind(this, this.update));
            a.h && (a.h.m && a.h.m.Dc === l) && this.n("vjs-hidden");
            a.d("loadstart", u.bind(this, function() {
                a.h.m && a.h.m.Dc === l ? this.n("vjs-hidden") : this.u("vjs-hidden")
            }));
            this.n("vjs-menu-button")
        }
    });
    u.oa.prototype.Ka = function() {
        var a = new u.ma(this.b, {
                Vc: "div"
            }),
            c = new u.hb(this.b, u.k.B({
                Cd: f
            }, this.g.Vd));
        a.Z(c);
        return a
    };
    u.oa.prototype.p = function() {
        u.da.prototype.p.call(this);
        u.R.prototype.p.call(this)
    };
    u.oa.prototype.e = function() {
        return u.q.prototype.e.call(this, "div", {
            className: "vjs-volume-menu-button vjs-menu-button vjs-control",
            innerHTML: '<div><span class="vjs-control-text">Mute</span></div>'
        })
    };
    u.oa.prototype.update = u.da.prototype.update;
    u.cb = u.q.extend({
        i: function(a, c) {
            u.q.call(this, a, c);
            (!a.poster() || !a.controls()) && this.C();
            a.d("play", u.bind(this, this.C))
        }
    });
    u.cb.prototype.e = function() {
        var a = u.e("div", {
                className: "vjs-poster",
                tabIndex: -1
            }),
            c = this.b.poster();
        c && ("backgroundSize" in a.style ? a.style.backgroundImage = 'url("' + c + '")' : a.appendChild(u.e("img", {
            src: c
        })));
        return a
    };
    u.cb.prototype.p = function() {
        this.K().controls() && this.b.play()
    };
    u.Wb = u.c.extend({
        i: function(a, c) {
            u.c.call(this, a, c);
            a.d("canplay", u.bind(this, this.C));
            a.d("canplaythrough", u.bind(this, this.C));
            a.d("playing", u.bind(this, this.C));
            a.d("seeked", u.bind(this, this.C));
            a.d("seeking", u.bind(this, this.show));
            a.d("seeked", u.bind(this, this.C));
            a.d("error", u.bind(this, this.show));
            a.d("waiting", u.bind(this, this.show))
        }
    });
    u.Wb.prototype.e = function() {
        return u.c.prototype.e.call(this, "div", {
            className: "vjs-loading-spinner"
        })
    };
    u.Wa = u.q.extend();
    u.Wa.prototype.e = function() {
        return u.q.prototype.e.call(this, "div", {
            className: "vjs-big-play-button",
            innerHTML: '<span aria-hidden="true"></span>',
            "aria-label": "play video"
        })
    };
    u.Wa.prototype.p = function() {
        this.b.play()
    };
    u.r = u.c.extend({
        i: function(a, c, d) {
            u.c.call(this, a, c, d);
            var e, g;
            g = this;
            e = this.K();
            a = function() {
                if (e.controls() && !e.Rb()) {
                    var a, c;
                    g.d("mousedown", g.p);
                    g.d("touchstart", function(a) {
                        a.preventDefault();
                        a.stopPropagation();
                        c = this.b.ja()
                    });
                    a = function(a) {
                        a.stopPropagation();
                        c && this.b.Mb()
                    };
                    g.d("touchmove", a);
                    g.d("touchleave", a);
                    g.d("touchcancel", a);
                    g.d("touchend", a);
                    var d, n, r;
                    d = 0;
                    g.d("touchstart", function() {
                        d = (new Date).getTime();
                        r = f
                    });
                    a = function() {
                        r = l
                    };
                    g.d("touchmove", a);
                    g.d("touchleave", a);
                    g.d("touchcancel",
                        a);
                    g.d("touchend", function() {
                        r === f && (n = (new Date).getTime() - d, 250 > n && this.j("tap"))
                    });
                    g.d("tap", g.md)
                }
            };
            c = u.bind(g, g.pd);
            this.L(a);
            e.d("controlsenabled", a);
            e.d("controlsdisabled", c)
        }
    });
    u.r.prototype.pd = function() {
        this.o("tap");
        this.o("touchstart");
        this.o("touchmove");
        this.o("touchleave");
        this.o("touchcancel");
        this.o("touchend");
        this.o("click");
        this.o("mousedown")
    };
    u.r.prototype.p = function(a) {
        0 === a.button && this.K().controls() && (this.K().paused() ? this.K().play() : this.K().pause())
    };
    u.r.prototype.md = function() {
        this.K().ja(!this.K().ja())
    };
    u.r.prototype.m = {
        volumeControl: f,
        fullscreenResize: l,
        progressEvents: l,
        timeupdateEvents: l
    };
    u.media = {};
    u.media.Va = "play pause paused currentTime setCurrentTime duration buffered volume setVolume muted setMuted width height supportsFullScreen enterFullScreen src load currentSrc preload setPreload autoplay setAutoplay loop setLoop error networkState readyState seeking initialTime startOffsetTime played seekable ended videoTracks audioTracks videoWidth videoHeight textTracks defaultPlaybackRate playbackRate mediaGroup controller controls defaultMuted".split(" ");

    function ea() {
        var a = u.media.Va[i];
        return function() {
            throw Error('The "' + a + "\" method is not available on the playback technology's API");
        }
    }
    for (var i = u.media.Va.length - 1; 0 <= i; i--) u.r.prototype[u.media.Va[i]] = ea();
    u.l = u.r.extend({
        i: function(a, c, d) {
            this.m.volumeControl = u.l.Uc();
            this.m.movingMediaElementInDOM = !u.Kc;
            this.m.fullscreenResize = f;
            u.r.call(this, a, c, d);
            (c = c.source) && this.a.currentSrc === c.src && 0 < this.a.networkState ? a.j("loadstart") : c && (this.a.src = c.src);
            if (u.ac && a.options().nativeControlsForTouch !== l) {
                var e, g, j, k;
                e = this;
                g = this.K();
                c = g.controls();
                e.a.controls = !!c;
                j = function() {
                    e.a.controls = f
                };
                k = function() {
                    e.a.controls = l
                };
                g.d("controlsenabled", j);
                g.d("controlsdisabled", k);
                c = function() {
                    g.o("controlsenabled",
                        j);
                    g.o("controlsdisabled", k)
                };
                e.d("dispose", c);
                g.d("usingcustomcontrols", c);
                g.Rb(f)
            }
            a.L(function() {
                this.M && (this.g.autoplay && this.paused()) && (delete this.M.poster, this.play())
            });
            for (a = u.l.$a.length - 1; 0 <= a; a--) u.d(this.a, u.l.$a[a], u.bind(this.b, this.$c));
            this.Ua()
        }
    });
    t = u.l.prototype;
    t.D = function() {
        u.r.prototype.D.call(this)
    };
    t.e = function() {
        var a = this.b,
            c = a.M,
            d;
        if (!c || this.m.movingMediaElementInDOM === l) c ? (d = c.cloneNode(l), u.l.jc(c), c = d, a.M = h) : c = u.e("video", {
            id: a.id() + "_html5_api",
            className: "vjs-tech"
        }), c.player = a, u.zb(c, a.w());
        d = ["autoplay", "preload", "loop", "muted"];
        for (var e = d.length - 1; 0 <= e; e--) {
            var g = d[e];
            a.g[g] !== h && (c[g] = a.g[g])
        }
        return c
    };
    t.$c = function(a) {
        this.j(a);
        a.stopPropagation()
    };
    t.play = function() {
        this.a.play()
    };
    t.pause = function() {
        this.a.pause()
    };
    t.paused = function() {
        return this.a.paused
    };
    t.currentTime = function() {
        return this.a.currentTime
    };
    t.sd = function(a) {
        try {
            this.a.currentTime = a
        } catch (c) {
            u.log(c, "Video is not ready. (Video.js)")
        }
    };
    t.duration = function() {
        return this.a.duration || 0
    };
    t.buffered = function() {
        return this.a.buffered
    };
    t.volume = function() {
        return this.a.volume
    };
    t.xd = function(a) {
        this.a.volume = a
    };
    t.muted = function() {
        return this.a.muted
    };
    t.vd = function(a) {
        this.a.muted = a
    };
    t.width = function() {
        return this.a.offsetWidth
    };
    t.height = function() {
        return this.a.offsetHeight
    };
    t.Ta = function() {
        return "function" == typeof this.a.webkitEnterFullScreen && (/Android/.test(u.F) || !/Chrome|Mac OS X 10.5/.test(u.F)) ? f : l
    };
    t.src = function(a) {
        this.a.src = a
    };
    t.load = function() {
        this.a.load()
    };
    t.currentSrc = function() {
        return this.a.currentSrc
    };
    t.Qa = function() {
        return this.a.Qa
    };
    t.wd = function(a) {
        this.a.Qa = a
    };
    t.autoplay = function() {
        return this.a.autoplay
    };
    t.rd = function(a) {
        this.a.autoplay = a
    };
    t.controls = function() {
        return this.a.controls
    };
    t.loop = function() {
        return this.a.loop
    };
    t.ud = function(a) {
        this.a.loop = a
    };
    t.error = function() {
        return this.a.error
    };
    t.seeking = function() {
        return this.a.seeking
    };
    u.l.isSupported = function() {
        return !!u.na.canPlayType
    };
    u.l.mb = function(a) {
        try {
            return !!u.na.canPlayType(a.type)
        } catch (c) {
            return ""
        }
    };
    u.l.Uc = function() {
        var a = u.na.volume;
        u.na.volume = a / 2 + 0.1;
        return a !== u.na.volume
    };
    u.l.$a = "loadstart suspend abort error emptied stalled loadedmetadata loadeddata canplay canplaythrough playing waiting seeking seeked ended durationchange timeupdate progress play pause ratechange volumechange".split(" ");
    u.l.jc = function(a) {
        if (a) {
            a.player = h;
            for (a.parentNode && a.parentNode.removeChild(a); a.hasChildNodes();) a.removeChild(a.firstChild);
            a.removeAttribute("src");
            "function" === typeof a.load && a.load()
        }
    };
    u.Oc && (document.createElement("video").constructor.prototype.canPlayType = function(a) {
        return a && -1 != a.toLowerCase().indexOf("video/mp4") ? "maybe" : ""
    });
    u.f = u.r.extend({
        i: function(a, c, d) {
            u.r.call(this, a, c, d);
            var e = c.source;
            d = c.parentEl;
            var g = this.a = u.e("div", {
                    id: a.id() + "_temp_flash"
                }),
                j = a.id() + "_flash_api";
            a = a.g;
            var k = u.k.B({
                    readyFunction: "videojs.Flash.onReady",
                    eventProxyFunction: "videojs.Flash.onEvent",
                    errorEventProxyFunction: "videojs.Flash.onError",
                    autoplay: a.autoplay,
                    preload: a.Qa,
                    loop: a.loop,
                    muted: a.muted
                }, c.flashVars),
                q = u.k.B({
                    wmode: "opaque",
                    bgcolor: "#000000"
                }, c.params),
                n = u.k.B({
                    id: j,
                    name: j,
                    "class": "vjs-tech"
                }, c.attributes);
            e && (e.type && u.f.ed(e.type) ?
                (a = u.f.Ac(e.src), k.rtmpConnection = encodeURIComponent(a.rb), k.rtmpStream = encodeURIComponent(a.Ob)) : k.src = encodeURIComponent(u.mc(e.src)));
            u.zb(g, d);
            c.startTime && this.L(function() {
                this.load();
                this.play();
                this.currentTime(c.startTime)
            });
            if (c.iFrameMode === f && !u.Jc) {
                var r = u.e("iframe", {
                    id: j + "_iframe",
                    name: j + "_iframe",
                    className: "vjs-tech",
                    scrolling: "no",
                    marginWidth: 0,
                    marginHeight: 0,
                    frameBorder: 0
                });
                k.readyFunction = "ready";
                k.eventProxyFunction = "events";
                k.errorEventProxyFunction = "errors";
                u.d(r, "load", u.bind(this,
                    function() {
                        var a, d = r.contentWindow;
                        a = r.contentDocument ? r.contentDocument : r.contentWindow.document;
                        a.write(u.f.nc(c.swf, k, q, n));
                        d.player = this.b;
                        d.ready = u.bind(this.b, function(c) {
                            var d = this.h;
                            d.a = a.getElementById(c);
                            u.f.pb(d)
                        });
                        d.events = u.bind(this.b, function(a, c) {
                            this && "flash" === this.ia && this.j(c)
                        });
                        d.errors = u.bind(this.b, function(a, c) {
                            u.log("Flash Error", c)
                        })
                    }));
                g.parentNode.replaceChild(r, g)
            } else u.f.Zc(c.swf, g, k, q, n)
        }
    });
    t = u.f.prototype;
    t.D = function() {
        u.r.prototype.D.call(this)
    };
    t.play = function() {
        this.a.vjs_play()
    };
    t.pause = function() {
        this.a.vjs_pause()
    };
    t.src = function(a) {
        u.f.dd(a) ? (a = u.f.Ac(a), this.Qd(a.rb), this.Rd(a.Ob)) : (a = u.mc(a), this.a.vjs_src(a));
        if (this.b.autoplay()) {
            var c = this;
            setTimeout(function() {
                c.play()
            }, 0)
        }
    };
    t.currentSrc = function() {
        var a = this.a.vjs_getProperty("currentSrc");
        if (a == h) {
            var c = this.Od(),
                d = this.Pd();
            c && d && (a = u.f.yd(c, d))
        }
        return a
    };
    t.load = function() {
        this.a.vjs_load()
    };
    t.poster = function() {
        this.a.vjs_getProperty("poster")
    };
    t.buffered = function() {
        return u.tb(0, this.a.vjs_getProperty("buffered"))
    };
    t.Ta = s(l);
    var Q = u.f.prototype,
        R = "rtmpConnection rtmpStream preload currentTime defaultPlaybackRate playbackRate autoplay loop mediaGroup controller controls volume muted defaultMuted".split(" "),
        S = "error currentSrc networkState readyState seeking initialTime duration startOffsetTime paused played seekable ended videoTracks audioTracks videoWidth videoHeight textTracks".split(" ");

    function fa() {
        var a = R[T],
            c = a.charAt(0).toUpperCase() + a.slice(1);
        Q["set" + c] = function(c) {
            return this.a.vjs_setProperty(a, c)
        }
    }

    function U(a) {
        Q[a] = function() {
            return this.a.vjs_getProperty(a)
        }
    }
    var T;
    for (T = 0; T < R.length; T++) U(R[T]), fa();
    for (T = 0; T < S.length; T++) U(S[T]);
    u.f.isSupported = function() {
        return 10 <= u.f.version()[0]
    };
    u.f.mb = function(a) {
        if (!a.type) return "";
        a = a.type.replace(/;.*/, "").toLowerCase();
        if (a in u.f.bd || a in u.f.Bc) return "maybe"
    };
    u.f.bd = {
        "video/flv": "FLV",
        "video/x-flv": "FLV",
        "video/mp4": "MP4",
        "video/m4v": "MP4"
    };
    u.f.Bc = {
        "rtmp/mp4": "MP4",
        "rtmp/flv": "FLV"
    };
    u.f.onReady = function(a) {
        a = u.w(a);
        var c = a.player || a.parentNode.player,
            d = c.h;
        a.player = c;
        d.a = a;
        u.f.pb(d)
    };
    u.f.pb = function(a) {
        a.w().vjs_getProperty ? a.Ua() : setTimeout(function() {
            u.f.pb(a)
        }, 50)
    };
    u.f.onEvent = function(a, c) {
        u.w(a).player.j(c)
    };
    u.f.onError = function(a, c) {
        u.w(a).player.j("error");
        u.log("Flash Error", c, a)
    };
    u.f.version = function() {
        var a = "0,0,0";
        try {
            a = (new window.ActiveXObject("ShockwaveFlash.ShockwaveFlash")).GetVariable("$version").replace(/\D+/g, ",").match(/^,?(.+),?$/)[1]
        } catch (c) {
            try {
                navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin && (a = (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]).description.replace(/\D+/g, ",").match(/^,?(.+),?$/)[1])
            } catch (d) {}
        }
        return a.split(",")
    };
    u.f.Zc = function(a, c, d, e, g) {
        a = u.f.nc(a, d, e, g);
        a = u.e("div", {
            innerHTML: a
        }).childNodes[0];
        d = c.parentNode;
        c.parentNode.replaceChild(a, c);
        var j = d.childNodes[0];
        setTimeout(function() {
            j.style.display = "block"
        }, 1E3)
    };
    u.f.nc = function(a, c, d, e) {
        var g = "",
            j = "",
            k = "";
        c && u.k.ua(c, function(a, c) {
            g += a + "=" + c + "&amp;"
        });
        d = u.k.B({
            movie: a,
            flashvars: g,
            allowScriptAccess: "always",
            allowNetworking: "all"
        }, d);
        u.k.ua(d, function(a, c) {
            j += '<param name="' + a + '" value="' + c + '" />'
        });
        e = u.k.B({
            data: a,
            width: "100%",
            height: "100%"
        }, e);
        u.k.ua(e, function(a, c) {
            k += a + '="' + c + '" '
        });
        return '<object type="application/x-shockwave-flash"' + k + ">" + j + "</object>"
    };
    u.f.yd = function(a, c) {
        return a + "&" + c
    };
    u.f.Ac = function(a) {
        var c = {
            rb: "",
            Ob: ""
        };
        if (!a) return c;
        var d = a.indexOf("&"),
            e; - 1 !== d ? e = d + 1 : (d = e = a.lastIndexOf("/") + 1, 0 === d && (d = e = a.length));
        c.rb = a.substring(0, d);
        c.Ob = a.substring(e, a.length);
        return c
    };
    u.f.ed = function(a) {
        return a in u.f.Bc
    };
    u.f.Qc = /^rtmp[set]?:\/\//i;
    u.f.dd = function(a) {
        return u.f.Qc.test(a)
    };
    u.Pc = u.c.extend({
        i: function(a, c, d) {
            u.c.call(this, a, c, d);
            if (!a.g.sources || 0 === a.g.sources.length) {
                c = 0;
                for (d = a.g.techOrder; c < d.length; c++) {
                    var e = u.$(d[c]),
                        g = window.videojs[e];
                    if (g && g.isSupported()) {
                        I(a, e);
                        break
                    }
                }
            } else a.src(a.g.sources)
        }
    });

    function V(a) {
        a.Aa = a.Aa || [];
        return a.Aa
    }

    function W(a, c, d) {
        for (var e = a.Aa, g = 0, j = e.length, k, q; g < j; g++) k = e[g], k.id() === c ? (k.show(), q = k) : d && (k.J() == d && 0 < k.mode()) && k.disable();
        (c = q ? q.J() : d ? d : l) && a.j(c + "trackchange")
    }
    u.X = u.c.extend({
        i: function(a, c) {
            u.c.call(this, a, c);
            this.Q = c.id || "vjs_" + c.kind + "_" + c.language + "_" + u.t++;
            this.xc = c.src;
            this.Wc = c["default"] || c.dflt;
            this.Ad = c.title;
            this.Ld = c.srclang;
            this.fd = c.label;
            this.fa = [];
            this.ec = [];
            this.ga = this.ha = 0;
            this.b.d("fullscreenchange", u.bind(this, this.Rc))
        }
    });
    t = u.X.prototype;
    t.J = p("A");
    t.src = p("xc");
    t.ub = p("Wc");
    t.title = p("Ad");
    t.label = p("fd");
    t.readyState = p("ha");
    t.mode = p("ga");
    t.Rc = function() {
        this.a.style.fontSize = this.b.H ? 140 * (screen.width / this.b.width()) + "%" : ""
    };
    t.e = function() {
        return u.c.prototype.e.call(this, "div", {
            className: "vjs-" + this.A + " vjs-text-track"
        })
    };
    t.show = function() {
        X(this);
        this.ga = 2;
        u.c.prototype.show.call(this)
    };
    t.C = function() {
        X(this);
        this.ga = 1;
        u.c.prototype.C.call(this)
    };
    t.disable = function() {
        2 == this.ga && this.C();
        this.b.o("timeupdate", u.bind(this, this.update, this.Q));
        this.b.o("ended", u.bind(this, this.reset, this.Q));
        this.reset();
        this.b.V.textTrackDisplay.removeChild(this);
        this.ga = 0
    };

    function X(a) {
        0 === a.ha && a.load();
        0 === a.ga && (a.b.d("timeupdate", u.bind(a, a.update, a.Q)), a.b.d("ended", u.bind(a, a.reset, a.Q)), ("captions" === a.A || "subtitles" === a.A) && a.b.V.textTrackDisplay.Z(a))
    }
    t.load = function() {
        0 === this.ha && (this.ha = 1, u.get(this.xc, u.bind(this, this.nd), u.bind(this, this.Gb)))
    };
    t.Gb = function(a) {
        this.error = a;
        this.ha = 3;
        this.j("error")
    };
    t.nd = function(a) {
        var c, d;
        a = a.split("\n");
        for (var e = "", g = 1, j = a.length; g < j; g++)
            if (e = u.trim(a[g])) {
                -1 == e.indexOf("--\x3e") ? (c = e, e = u.trim(a[++g])) : c = this.fa.length;
                c = {
                    id: c,
                    index: this.fa.length
                };
                d = e.split(" --\x3e ");
                c.startTime = Y(d[0]);
                c.va = Y(d[1]);
                for (d = []; a[++g] && (e = u.trim(a[g]));) d.push(e);
                c.text = d.join("<br/>");
                this.fa.push(c)
            } this.ha = 2;
        this.j("loaded")
    };

    function Y(a) {
        var c = a.split(":");
        a = 0;
        var d, e, g;
        3 == c.length ? (d = c[0], e = c[1], c = c[2]) : (d = 0, e = c[0], c = c[1]);
        c = c.split(/\s+/);
        c = c.splice(0, 1)[0];
        c = c.split(/\.|,/);
        g = parseFloat(c[1]);
        c = c[0];
        a += 3600 * parseFloat(d);
        a += 60 * parseFloat(e);
        a += parseFloat(c);
        g && (a += g / 1E3);
        return a
    }
    t.update = function() {
        if (0 < this.fa.length) {
            var a = this.b.currentTime();
            if (this.Lb === b || a < this.Lb || this.Ma <= a) {
                var c = this.fa,
                    d = this.b.duration(),
                    e = 0,
                    g = l,
                    j = [],
                    k, q, n, r;
                a >= this.Ma || this.Ma === b ? r = this.wb !== b ? this.wb : 0 : (g = f, r = this.Db !== b ? this.Db : c.length - 1);
                for (;;) {
                    n = c[r];
                    if (n.va <= a) e = Math.max(e, n.va), n.Ia && (n.Ia = l);
                    else if (a < n.startTime) {
                        if (d = Math.min(d, n.startTime), n.Ia && (n.Ia = l), !g) break
                    } else g ? (j.splice(0, 0, n), q === b && (q = r), k = r) : (j.push(n), k === b && (k = r), q = r), d = Math.min(d, n.va), e = Math.max(e, n.startTime),
                        n.Ia = f;
                    if (g)
                        if (0 === r) break;
                        else r--;
                    else if (r === c.length - 1) break;
                    else r++
                }
                this.ec = j;
                this.Ma = d;
                this.Lb = e;
                this.wb = k;
                this.Db = q;
                a = this.ec;
                c = "";
                d = 0;
                for (e = a.length; d < e; d++) c += '<span class="vjs-tt-cue">' + a[d].text + "</span>";
                this.a.innerHTML = c;
                this.j("cuechange")
            }
        }
    };
    t.reset = function() {
        this.Ma = 0;
        this.Lb = this.b.duration();
        this.Db = this.wb = 0
    };
    u.Ub = u.X.extend();
    u.Ub.prototype.A = "captions";
    u.$b = u.X.extend();
    u.$b.prototype.A = "subtitles";
    u.Vb = u.X.extend();
    u.Vb.prototype.A = "chapters";
    u.bc = u.c.extend({
        i: function(a, c, d) {
            u.c.call(this, a, c, d);
            if (a.g.tracks && 0 < a.g.tracks.length) {
                c = this.b;
                a = a.g.tracks;
                var e;
                for (d = 0; d < a.length; d++) {
                    e = a[d];
                    var g = c,
                        j = e.kind,
                        k = e.label,
                        q = e.language,
                        n = e;
                    e = g.Aa = g.Aa || [];
                    n = n || {};
                    n.kind = j;
                    n.label = k;
                    n.language = q;
                    j = u.$(j || "subtitles");
                    g = new window.videojs[j + "Track"](g, n);
                    e.push(g)
                }
            }
        }
    });
    u.bc.prototype.e = function() {
        return u.c.prototype.e.call(this, "div", {
            className: "vjs-text-track-display"
        })
    };
    u.Y = u.N.extend({
        i: function(a, c) {
            var d = this.ca = c.track;
            c.label = d.label();
            c.selected = d.ub();
            u.N.call(this, a, c);
            this.b.d(d.J() + "trackchange", u.bind(this, this.update))
        }
    });
    u.Y.prototype.p = function() {
        u.N.prototype.p.call(this);
        W(this.b, this.ca.Q, this.ca.J())
    };
    u.Y.prototype.update = function() {
        this.selected(2 == this.ca.mode())
    };
    u.bb = u.Y.extend({
        i: function(a, c) {
            c.track = {
                J: function() {
                    return c.kind
                },
                K: a,
                label: function() {
                    return c.kind + " off"
                },
                ub: s(l),
                mode: s(l)
            };
            u.Y.call(this, a, c);
            this.selected(f)
        }
    });
    u.bb.prototype.p = function() {
        u.Y.prototype.p.call(this);
        W(this.b, this.ca.Q, this.ca.J())
    };
    u.bb.prototype.update = function() {
        for (var a = V(this.b), c = 0, d = a.length, e, g = f; c < d; c++) e = a[c], e.J() == this.ca.J() && 2 == e.mode() && (g = l);
        this.selected(g)
    };
    u.S = u.R.extend({
        i: function(a, c) {
            u.R.call(this, a, c);
            1 >= this.I.length && this.C()
        }
    });
    u.S.prototype.ta = function() {
        var a = [],
            c;
        a.push(new u.bb(this.b, {
            kind: this.A
        }));
        for (var d = 0; d < V(this.b).length; d++) c = V(this.b)[d], c.J() === this.A && a.push(new u.Y(this.b, {
            track: c
        }));
        return a
    };
    u.Da = u.S.extend({
        i: function(a, c, d) {
            u.S.call(this, a, c, d);
            this.a.setAttribute("aria-label", "Captions Menu")
        }
    });
    u.Da.prototype.A = "captions";
    u.Da.prototype.qa = "Captions";
    u.Da.prototype.className = "vjs-captions-button";
    u.Ha = u.S.extend({
        i: function(a, c, d) {
            u.S.call(this, a, c, d);
            this.a.setAttribute("aria-label", "Subtitles Menu")
        }
    });
    u.Ha.prototype.A = "subtitles";
    u.Ha.prototype.qa = "Subtitles";
    u.Ha.prototype.className = "vjs-subtitles-button";
    u.Ea = u.S.extend({
        i: function(a, c, d) {
            u.S.call(this, a, c, d);
            this.a.setAttribute("aria-label", "Chapters Menu")
        }
    });
    t = u.Ea.prototype;
    t.A = "chapters";
    t.qa = "Chapters";
    t.className = "vjs-chapters-button";
    t.ta = function() {
        for (var a = [], c, d = 0; d < V(this.b).length; d++) c = V(this.b)[d], c.J() === this.A && a.push(new u.Y(this.b, {
            track: c
        }));
        return a
    };
    t.Ka = function() {
        for (var a = V(this.b), c = 0, d = a.length, e, g, j = this.I = []; c < d; c++)
            if (e = a[c], e.J() == this.A && e.ub()) {
                if (2 > e.readyState()) {
                    this.Id = e;
                    e.d("loaded", u.bind(this, this.Ka));
                    return
                }
                g = e;
                break
            } a = this.wa = new u.ma(this.b);
        a.a.appendChild(u.e("li", {
            className: "vjs-menu-title",
            innerHTML: u.$(this.A),
            zd: -1
        }));
        if (g) {
            e = g.fa;
            for (var k, c = 0, d = e.length; c < d; c++) k = e[c], k = new u.Xa(this.b, {
                track: g,
                cue: k
            }), j.push(k), a.Z(k)
        }
        0 < this.I.length && this.show();
        return a
    };
    u.Xa = u.N.extend({
        i: function(a, c) {
            var d = this.ca = c.track,
                e = this.cue = c.cue,
                g = a.currentTime();
            c.label = e.text;
            c.selected = e.startTime <= g && g < e.va;
            u.N.call(this, a, c);
            d.d("cuechange", u.bind(this, this.update))
        }
    });
    u.Xa.prototype.p = function() {
        u.N.prototype.p.call(this);
        this.b.currentTime(this.cue.startTime);
        this.update(this.cue.startTime)
    };
    u.Xa.prototype.update = function() {
        var a = this.cue,
            c = this.b.currentTime();
        this.selected(a.startTime <= c && c < a.va)
    };
    u.k.B(u.Fa.prototype.g.children, {
        subtitlesButton: {},
        captionsButton: {},
        chaptersButton: {}
    });
    if ("undefined" !== typeof window.JSON && "function" === window.JSON.parse) u.JSON = window.JSON;
    else {
        u.JSON = {};
        var Z = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        u.JSON.parse = function(a, c) {
            function d(a, e) {
                var k, q, n = a[e];
                if (n && "object" === typeof n)
                    for (k in n) Object.prototype.hasOwnProperty.call(n, k) && (q = d(n, k), q !== b ? n[k] = q : delete n[k]);
                return c.call(a, e, n)
            }
            var e;
            a = String(a);
            Z.lastIndex = 0;
            Z.test(a) && (a = a.replace(Z, function(a) {
                return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
            }));
            if (/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return e = eval("(" + a + ")"), "function" === typeof c ? d({
                "": e
            }, "") : e;
            throw new SyntaxError("JSON.parse(): invalid or malformed JSON data");
        }
    }
    u.fc = function() {
        var a, c, d = document.getElementsByTagName("video");
        if (d && 0 < d.length)
            for (var e = 0, g = d.length; e < g; e++)
                if ((c = d[e]) && c.getAttribute) c.player === b && (a = c.getAttribute("data-setup"), a !== h && (a = u.JSON.parse(a || "{}"), v(c, a)));
                else {
                    u.kb();
                    break
                }
        else u.Ec || u.kb()
    };
    u.kb = function() {
        setTimeout(u.fc, 1)
    };
    "complete" === document.readyState ? u.Ec = f : u.U(window, "load", function() {
        u.Ec = f
    });
    u.kb();
    u.od = function(a, c) {
        u.s.prototype[a] = c
    };
    var ga = this;
    ga.Ed = f;

    function $(a, c) {
        var d = a.split("."),
            e = ga;
        !(d[0] in e) && e.execScript && e.execScript("var " + d[0]);
        for (var g; d.length && (g = d.shift());) !d.length && c !== b ? e[g] = c : e = e[g] ? e[g] : e[g] = {}
    };
    $("videojs", u);
    $("_V_", u);
    $("videojs.options", u.options);
    $("videojs.players", u.xa);
    $("videojs.TOUCH_ENABLED", u.ac);
    $("videojs.cache", u.ra);
    $("videojs.Component", u.c);
    u.c.prototype.player = u.c.prototype.K;
    u.c.prototype.dispose = u.c.prototype.D;
    u.c.prototype.createEl = u.c.prototype.e;
    u.c.prototype.el = u.c.prototype.w;
    u.c.prototype.addChild = u.c.prototype.Z;
    u.c.prototype.children = u.c.prototype.children;
    u.c.prototype.on = u.c.prototype.d;
    u.c.prototype.off = u.c.prototype.o;
    u.c.prototype.one = u.c.prototype.U;
    u.c.prototype.trigger = u.c.prototype.j;
    u.c.prototype.triggerReady = u.c.prototype.Ua;
    u.c.prototype.show = u.c.prototype.show;
    u.c.prototype.hide = u.c.prototype.C;
    u.c.prototype.width = u.c.prototype.width;
    u.c.prototype.height = u.c.prototype.height;
    u.c.prototype.dimensions = u.c.prototype.Xc;
    u.c.prototype.ready = u.c.prototype.L;
    u.c.prototype.addClass = u.c.prototype.n;
    u.c.prototype.removeClass = u.c.prototype.u;
    $("videojs.Player", u.s);
    u.s.prototype.dispose = u.s.prototype.D;
    u.s.prototype.requestFullScreen = u.s.prototype.ya;
    u.s.prototype.cancelFullScreen = u.s.prototype.ob;
    u.s.prototype.bufferedPercent = u.s.prototype.Ja;
    u.s.prototype.usingNativeControls = u.s.prototype.Rb;
    u.s.prototype.reportUserActivity = u.s.prototype.Mb;
    u.s.prototype.userActive = u.s.prototype.ja;
    $("videojs.MediaLoader", u.Pc);
    $("videojs.TextTrackDisplay", u.bc);
    $("videojs.ControlBar", u.Fa);
    $("videojs.Button", u.q);
    $("videojs.PlayToggle", u.Yb);
    $("videojs.FullscreenToggle", u.Ga);
    $("videojs.BigPlayButton", u.Wa);
    $("videojs.LoadingSpinner", u.Wb);
    $("videojs.CurrentTimeDisplay", u.Ya);
    $("videojs.DurationDisplay", u.Za);
    $("videojs.TimeDivider", u.cc);
    $("videojs.RemainingTimeDisplay", u.fb);
    $("videojs.Slider", u.O);
    $("videojs.ProgressControl", u.eb);
    $("videojs.SeekBar", u.Zb);
    $("videojs.LoadProgressBar", u.ab);
    $("videojs.PlayProgressBar", u.Xb);
    $("videojs.SeekHandle", u.gb);
    $("videojs.VolumeControl", u.ib);
    $("videojs.VolumeBar", u.hb);
    $("videojs.VolumeLevel", u.dc);
    $("videojs.VolumeMenuButton", u.oa);
    $("videojs.VolumeHandle", u.jb);
    $("videojs.MuteToggle", u.da);
    $("videojs.PosterImage", u.cb);
    $("videojs.Menu", u.ma);
    $("videojs.MenuItem", u.N);
    $("videojs.MenuButton", u.R);
    u.R.prototype.createItems = u.R.prototype.ta;
    u.S.prototype.createItems = u.S.prototype.ta;
    u.Ea.prototype.createItems = u.Ea.prototype.ta;
    $("videojs.SubtitlesButton", u.Ha);
    $("videojs.CaptionsButton", u.Da);
    $("videojs.ChaptersButton", u.Ea);
    $("videojs.MediaTechController", u.r);
    u.r.prototype.features = u.r.prototype.m;
    u.r.prototype.m.volumeControl = u.r.prototype.m.Dc;
    u.r.prototype.m.fullscreenResize = u.r.prototype.m.Jd;
    u.r.prototype.m.progressEvents = u.r.prototype.m.Nd;
    u.r.prototype.m.timeupdateEvents = u.r.prototype.m.Sd;
    $("videojs.Html5", u.l);
    u.l.Events = u.l.$a;
    u.l.isSupported = u.l.isSupported;
    u.l.canPlaySource = u.l.mb;
    u.l.prototype.setCurrentTime = u.l.prototype.sd;
    u.l.prototype.setVolume = u.l.prototype.xd;
    u.l.prototype.setMuted = u.l.prototype.vd;
    u.l.prototype.setPreload = u.l.prototype.wd;
    u.l.prototype.setAutoplay = u.l.prototype.rd;
    u.l.prototype.setLoop = u.l.prototype.ud;
    $("videojs.Flash", u.f);
    u.f.isSupported = u.f.isSupported;
    u.f.canPlaySource = u.f.mb;
    u.f.onReady = u.f.onReady;
    $("videojs.TextTrack", u.X);
    u.X.prototype.label = u.X.prototype.label;
    $("videojs.CaptionsTrack", u.Ub);
    $("videojs.SubtitlesTrack", u.$b);
    $("videojs.ChaptersTrack", u.Vb);
    $("videojs.autoSetup", u.fc);
    $("videojs.plugin", u.od);
    $("videojs.createTimeRange", u.tb);
})();
var enabled_button = false;

function showMoreComments(bool) {
    var comments_list_height;
    if (!bool) {
        comments_list_height = parseInt($("#all_comments").offset().top) - parseInt($("#comments_list").parent().offset().top) + $("#all_comments").height();
        $('#comments_list').css({
            overflow: 'hidden',
            height: comments_list_height + 'px'
        });
    } else {
        $("#all_comments").remove();
        $('#comments_list').css({
            overflow: 'visible',
            height: 'auto'
        });
    }
}

function disableCommentExtraActions(id) {
    if ($('#extra_actions_' + id).length) {
        $('#extra_actions_' + id).addClass('off');
    }
    $('#comment_actions_' + id).hide();
}

function enableCommentExtraActions(id) {
    if ($('#extra_actions_' + id).length) {
        $('#extra_actions_' + id).removeClass('off');
    }
    $('#comment_actions_' + id).show();
}

function doCommentAction(event) {
    var link = event.target;
    var action, id, value;
    var obj = undefined;
    if ($(link).length) {
        id = $(link).attr('data-cmtid');
        value = $(link).attr('data-value');
        action = $(link).attr('data-action');
    }
    if (!action) {
        return false;
    }
    $.post('/comment_v.php?' + action, {
        cmtid: id,
        value: value
    }, function(response) {
        var reg = new RegExp("^\{", "i");
        if (!response.match(reg)) {
            if (action === 'vote') {
                switch (value) {
                    case 'like':
                        disableCommentExtraActions(id);
                        $('#dislike_link_' + id).show();
                        break;
                }
            } else if (action === 'delete') {
                var li = $(link).parents('li.comment');
                $(li).fadeOut(1000, function() {
                    $(this).remove();
                });
            }
        } else {
            try {
                obj = $.parseJSON(response);
            } catch (exception) {}
            displayMessage(obj.error);
        }
    });
}

function displayMessage(message) {
    if (!$("#comment_alert").length) {
        $("#song_comments").prepend("<div id=\"comment_alert\">" + message + "</div>");
    } else {
        $("#comment_alert").html(message);
    }
    $("#comment_alert").fadeOut(5000, function() {
        $(this).remove();
    });
}

function commentAreaFocusHandler(event) {
    var commentBlock = event.data.commentBlock;
    var _ta = $(event.target);
    _ta.addClass('initialized');
    $(commentBlock).find('.js-comment_form_button').show();
}

function commentAreaPressHandler(event) {
    var commentBlock = event.data.commentBlock;
    var max = 500;
    var min = 100;
    var nbChar = $(event.target).val().length;
    var remaining = (max - nbChar);
    if (remaining <= min) {
        $(commentBlock).find('.js-charleft').show();
    } else {
        $(commentBlock).find('.js-charleft').hide();
    }
    if (remaining < 0) {
        disableSendButton(commentBlock);
        remaining = 0;
        enabled_button = false;
    } else {
        enableSendButton(commentBlock);
        enabled_button = true;
    }
    if (!nbChar) {
        if (remaining < 0) {
            remaining = '<span style="color:red;font-weight:bold">' + remaining + '</span>';
        }
    }
    $(commentBlock).find('.js-countchar').html(remaining);
}

function sendCommentForm(event) {
    var commentBlock = event.data.commentBlock;
    disableSendButton(commentBlock);
    var action = $(commentBlock).attr("action");
    var comment = $(commentBlock).find(".js-comment_area").val();
    var parent_id = $(commentBlock).find(".js-parent_id").val();
    var parent_type = $(commentBlock).find(".js-parent_type").val();
    var noview = $(commentBlock).find(".js-noview").val();
    if (parent_type === "blog") {
        if ($("#ticket_comments").length) {
            noview = 0;
        }
    } else {
        if ($("#song_comments").length) {
            noview = 0;
        }
    }
    $.post(action, {
        "comment_text": comment,
        "parent_id": parent_id,
        "parent_type": parent_type,
        "noview": noview
    }, function(data) {
        var reg = new RegExp("^\{", "i");
        if (!data.match(reg)) {
            $(commentBlock).find(".js-comment_area").val("");
            if (parent_type === "blog") {
                $("#ticket_comments").html(data);
            } else {
                p = $(commentBlock).parents(".comment-block");
                p.replaceWith(data);
            }
            if ($(commentBlock).parent().hasClass('rating__comment')) {
                $(".rating__comment .js-comment-form").hide();
                $(".js-rating-download > p").hide();
                $(".js-rating-download > p.thanks-comment").show();
            }
            initCommentModule();
        }
    });
    return false;
}

function enableSendButton(commentBlock) {
    $(commentBlock).find('.js-button_subcmt').css({
        opacity: 1
    });
    $(commentBlock).find('.js-button_subcmt').off("click", sendCommentForm).on("click", {
        commentBlock: commentBlock
    }, sendCommentForm);
}

function disableSendButton(commentBlock) {
    $(commentBlock).find('.js-button_subcmt').css({
        opacity: 0.5
    });
    $(commentBlock).find('.js-button_subcmt').off('click', sendCommentForm);
}

function initCommentModule() {
    disableSendButton();
    $(".js-comment-form").each(function(index, commentBlock) {
        $(commentBlock).on("focus", ".js-comment_area", {
            commentBlock: commentBlock
        }, commentAreaFocusHandler);
        $(commentBlock).on("keyup", ".js-comment_area", {
            commentBlock: commentBlock
        }, commentAreaPressHandler);
        $(commentBlock).on("click", ".js-comment_textarea_label", function() {
            $(commentBlock).find(".js-comment_area").focus();
        });
        $(commentBlock).on("submit", function(event) {
            event.preventDefault();
        });
    });
    $(".comment_content").on("click", ".comment .comment_action", doCommentAction);
}
$(document).ready(function() {
    initCommentModule();
});
var currentVoteLabel = null;

function requestVote(elt, songId, vote, caption) {
    $.ajax({
        url: '/sng/song_rating.php',
        type: 'get',
        data: {
            "method": 'ajax',
            "s": songId,
            "v": vote
        },
        dataType: "json",
        success: function(json) {
            if (json) {
                if (!json.errno) {
                    $('#rating').attr("data-rating", vote);
                    $('#rating_title').html(caption);
                    currentVoteLabel = $(elt).attr("title");
                    $('#rating__desc').html(currentVoteLabel);
                    $("span[itemprop='ratingValue']").html(json.avg);
                    $("span[itemprop='ratingCount']").html(json.totalvote)
                }
            }
        }
    });
    return false;
}

function showComment(elt) {
    elt = $(elt);
    className = elt.attr("class");
    elt.removeAttr("href");
    elt.removeAttr("onclick");
    elt.siblings().remove();
    $(".js-rating-download > p").hide();
    $(".js-rating-download > p.thanks-vote").show();
    $(".js-rating-review").show();
}

function initRatingHover() {
    $("#rating a").hover(function() {
        if (currentVoteLabel == null) {
            currentVoteLabel = $("#rating__desc").html();
        }
        $("#rating__desc").html($(this).attr("title"));
    }, function() {
        $("#rating__desc").html(currentVoteLabel);
    });
}
$(document).ready(function() {
    initRatingHover();
});
Mixer = function(container) {
    this.container = container;
    this.tracks = new Array();
    this.sources = new Array();
    this.previewStart = null;
    this.previewEnd = null;
    this.previewDuration = null;
    this.duration = 0;
    this.mixer = null;
    this.loaded = 0;
    this.context = null;
    this.playing = false;
    this.startPlayingAt = 0;
    this.currentPosition = 0;
    this.progressWidth = 0;
    this.seekArea = null;
    this.progress = null;
    this.timer = null;
    this.levels = new Array();
    this.pannings = new Array();
    this.strings = null;
    this.descriptions = null;
    this.lastPlaying = null;
    this.precount = 0;
    this.pitch = 0;
    this.uri = "";
    this.lastVolumes = new Array();
    this.parameters = {
        method: "ajax",
        famid: 5
    };
    try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.context = new AudioContext();
    } catch (e) {
        Mixer.noCompatible();
        return;
    }
    var that = this;
    document.addEventListener("soundloaded", function() {
        that.loaded++;
        if (that.loaded === that.tracks.length) {
            $(".play").removeAttr("disabled");
            $(".reset").removeAttr("disabled");
            that.initSoloTrack();
            if (that.context.state == "running") {
                that.play();
            }
        }
    });
    $("body").on("click", ".play", function() {
        if ($(this).attr("disabled") === undefined) {
            that.play();
        }
    });
    $("body").on("click", ".pause", function() {
        that.pause();
    });
    $("body").on("click", ".reset", function() {
        if ($(this).attr("disabled") === undefined) {
            that.reset();
        }
    });
    $(".mixer").on("click", ".track__wave", function(event) {
        clicposition = event.clientX - $(this).offset().left;
        if (clicposition >= that.seekArea.start && clicposition <= that.seekArea.end) {
            that.seek(clicposition);
        }
    });
}
Mixer.prototype = {
    init: function(url, duration) {
        this.createDom(this.container);
        this.duration = duration * 1000;
        this.loadSong(url);
    },
    createDom: function(container) {
        $(container).find('.mixer__baseline').after("<a class='mixer-btn play mixer__play' id='mixer_play_btn' disabled='disabled'><span title='" + this.strings.pause + "'></span></a");
        $(container).find('.mixer__baseline').after("<a class='mixer-btn reset mixer__reset' id='mixer-refresh_btn' disabled='disabled'><span title='" + this.strings.reset + "'></span></a>");
    },
    loadSong: function(url) {
        if (this.pitch !== 0) {
            exp = url.split("/");
            exp[4] = this.pitch > 0 ? "p" + this.pitch : "m" + Math.abs(this.pitch);
            url = exp.join("/");
        }
        var that = this;
        $.ajax({
            dataType: "json",
            url: url,
            success: function(data) {
                that.previewStart = data.previewStart;
                that.previewEnd = data.previewEnd;
                that.previewDuration = (data.previewEnd - data.previewStart) / 1000;
                data.tracks.forEach(function(t, index) {
                    t.volume = t.mute ? 0 : 100;
                    if (that.levels[index]) {
                        t.volume = that.levels[index];
                        t.panning = that.pannings[index];
                    } else {
                        that.levels[index] = t.volume;
                        that.pannings[index] = 0;
                    }
                    t.description = that.descriptions[index];
                    t.index = index;
                    track = new Track(t, that);
                    that.tracks.push(track);
                });
                that.tracks.forEach(function(t) {
                    t.load();
                });
                that.drawHidingCalc();
                that.drawProgressLine();
            }
        });
        return this;
    },
    play: function() {
        if (this.currentPosition !== 0) {
            this.tracks.forEach(function(t) {
                t.createAudioSource();
            });
        }
        var that = this;
        requestAnimationFrame(function() {
            that.moveProgressBar()
        });
        var minDuration = null;
        this.tracks.forEach(function(t) {
            var d = t.getDuration();
            if (minDuration === null || d < minDuration) {
                minDuration = d;
            }
        });
        this.tracks.forEach(function(t) {
            t.setLoopEnd(minDuration);
            t.source.start(0, that.currentPosition);
        });
        this.startPlayingAt = this.context.currentTime;
        this.playing = true;
        $(".play").html("<span title='" + this.strings.pause + "'></span>");
        $(".play").removeClass("play").addClass("pause");
    },
    pause: function() {
        this.tracks.forEach(function(t) {
            t.source.stop(0);
        });
        this.currentPosition += this.context.currentTime - this.startPlayingAt;
        this.playing = false;
        $(".pause").html("<span title='" + this.strings.play + "'></span>");
        $(".pause").removeClass("pause").addClass("play");
    },
    seek: function(position) {
        pixelTime = this.previewDuration / this.progressWidth;
        seekTo = (position - this.seekArea.start) * pixelTime;
        if (this.playing) {
            this.pause();
        }
        this.currentPosition = seekTo;
        this.play();
    },
    loopStart: function() {
        this.currentPosition = 0;
        this.startPlayingAt = this.context.currentTime;
    },
    getFormattedTime: function(timeInSeconds) {
        minuts = parseInt(timeInSeconds / 60);
        seconds = timeInSeconds % 60
        return ("0" + minuts).slice(-2) + ":" + ("0" + seconds).slice(-2);
    },
    drawHidingCalc: function() {
        fwidth = this.previewStart / this.duration * Track.width;
        container = $(".track__wave");
        firstCalc = $("<div></div>");
        firstCalc.addClass("waves__hiding");
        firstCalc.css("width", fwidth);
        container.append(firstCalc);
        lastCalc = firstCalc.clone();
        lwidth = (this.duration - this.previewEnd) / this.duration * Track.width;
        if (this.duration < this.previewEnd) {
            lwidth = 0;
        }
        lastCalc.css("width", lwidth);
        lastCalc.css("right", 0);
        container.append(lastCalc);
        this.seekArea = {
            "start": fwidth,
            "end": Track.width - lwidth
        };
        this.progressWidth = Track.width - lwidth - fwidth;
    },
    drawProgressLine: function() {
        var that = this;
        this.progress = document.querySelector('.progressbar');
        this.progress.style.left = Math.ceil(this.previewStart / this.duration * Track.width) + 'px';
        this.timer = this.progress.querySelector('.progressbar__timer');
        this.timer.innerHTML = this.getFormattedTime(this.previewStart / 1000);
    },
    moveProgressBar: function() {
        if (this.playing) {
            var that = this;
            played = this.currentPosition + (this.context.currentTime - this.startPlayingAt);
            if (played >= this.previewDuration) {
                position = this.previewStart / this.duration * Track.width;
                this.loopStart();
            } else {
                position = (this.previewStart / this.duration * Track.width) + (played / this.previewDuration * this.progressWidth);
            }
            time = parseInt((this.previewStart + (played * 1000)) / 1000);
            this.timer.innerHTML = this.getFormattedTime(time);
            this.progress.style.left = Math.ceil(position) + 'px';
            requestAnimationFrame(function() {
                that.moveProgressBar();
            });
        }
    },
    setLevels: function(levels) {
        if (levels.length) {
            var group = levels.split(".");
            for (i = 0; i < group.length; i++) {
                volume = group[i].split(",");
                this.levels.push(new Array(volume[1]));
            }
        }
    },
    getLevels: function() {
        var levels = new Array();
        this.tracks.forEach(function(t, index) {
            levels.push((index + 1) + "," + t.controls.getVolume());
        });
        return levels.join(".");
    },
    setPannings: function(pannings) {
        if (pannings.length) {
            var group = pannings.split(".");
            for (i = 0; i < group.length; i++) {
                panning = group[i].split(",");
                this.pannings.push(new Array(panning[1]));
            }
        }
    },
    getPannings: function() {
        var panning = new Array();
        this.tracks.forEach(function(t, index) {
            panning.push((index + 1) + "," + t.controls.getPanning());
        });
        return panning.join(".");
    },
    changeLevels: function(levels) {
        var group = levels.split(".");
        for (i = 0; i < group.length; i++) {
            volume = group[i].split(",");
            this.tracks[i].changeVolume(volume[1]);
        }
    },
    changePitch: function(song_id, value) {
        $(".bubble").hide();
        html = 0;
        if (parseInt(value) < 0) {
            this.pitch = this.pitch <= -2 ? this.pitch : this.pitch - 1;
        } else {
            this.pitch = this.pitch >= 2 ? this.pitch : this.pitch + 1;
        }
        if (this.pitch !== 0) {
            html = this.pitch > 0 ? "+" : "-";
            html += Math.abs(this.pitch);
        }
        $.ajax({
            url: '/misc/chordkey.html',
            async: false,
            data: {
                "song_id": song_id,
                "value": html
            },
            success: function(response) {
                $(".pitch__caption").html(response);
            }
        });
        reloadLink = "/multi-pitch.html?id=" + song_id + "&pitch=" + encodeURIComponent(html);
        reloadLink += "&levels=" + this.getLevels() + "&precount=" + this.precount + "&pannings=" + this.getPannings();
        $("#pitch-link").attr("href", reloadLink);
        text = $(".pitch-text").html();
        $(".pitch-text").html(text.replace(/(\{PITCH\})|((\+|\-)?[0-2])/gi, html));
        $(".bubble").show();
        $(".pitch__value").html(html);
    },
    reset: function() {
        this.tracks.forEach(function(t) {
            t.unsetSolo();
            if (t.description.indexOf("Clic") > -1 || t.description.indexOf("Mixed Track") > -1) {
                t.changeVolume(0);
            } else {
                t.changeVolume(100);
            }
            t.changePan(0);
        });
    },
    setStrings: function(strings) {
        this.strings = strings;
    },
    setTracksDescription: function(descriptions) {
        this.descriptions = descriptions;
    },
    setPrecount: function(precount) {
        this.precount = parseInt(precount);
        this.parameters.precount = this.precount;
    },
    setPitch: function(pitch) {
        this.pitch = parseInt(pitch);
        if (this.pitch !== 0) {
            curvalue = (this.pitch < 0) ? '-' + Math.abs(this.pitch) : '+' + Math.abs(this.pitch);
            $(".pitch__value").html(curvalue);
        }
    },
    getMix: function() {
        this.parameters.trackslevels = this.getLevels();
        this.parameters.pannings = this.getPannings();
        if (typeof this.getMixCallback === 'function') {
            this.getMixCallback();
        }
        this.editMix();
    },
    editMix: function() {
        query = "/basket.php";
        this.parameters.pitch = this.pitch;
        $.ajax({
            url: query,
            type: "GET",
            data: this.parameters,
            success: $.proxy(function() {
                if (this.uri && typeof this.editMixCallback === 'function') {
                    this.editMixCallback();
                }
            }, this)
        });
    },
    initSoloTrack: function() {
        playing = 0;
        var that = this;
        var solo;
        this.tracks.forEach(function(t) {
            if (!t.isMuted()) {
                solo = t;
                playing++;
            }
        });
        if (playing == 1) {
            solo.setSolo();
            that.lastPlaying = solo.index;
        }
    },
    soloTrack: function(track) {
        playing = 0;
        var that = this;
        this.tracks.forEach(function(t) {
            if (!t.isMuted()) {
                playing++;
            }
        });
        if (playing === 1) {
            this.tracks.forEach(function(t) {
                var vol = that.lastVolumes[t.index] !== undefined ? that.lastVolumes[t.index] : 100;
                t.changeVolume(vol);
                t.unsetSolo();
            });
            if (this.lastPlaying === track.index) {
                return;
            }
        }
        track.setSolo();
        this.lastPlaying = track.index;
        this.tracks.forEach(function(t) {
            that.lastVolumes[t.index] = t.isMixed() ? 0 : t.controls.getVolume();
            if (track.index !== t.index) {
                t.changeVolume(0);
            }
        });
    },
    resetSolo: function() {
        playing = 0;
        this.tracks.forEach(function(t) {
            if (!t.isMuted()) {
                playing++;
            }
        });
        if (playing > 1) {
            this.tracks.forEach(function(t) {
                t.unsetSolo();
            });
        }
    }
}
Mixer.noCompatible = function() {
    $(".browser-ncompatible").show();
    $("#html-mixer").remove();
}
Mixer.isClientCompatible = function() {
    try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        var audio = document.createElement("audio");
        if (typeof audio.canPlayType === "function" && audio.canPlayType("audio/mpeg") !== "") {
            return true;
        }
    } catch (e) {}
    return false;
}
Controls = function(track) {
    this.panner = document.querySelector(".track[data-index='" + track.index + "'] .panner");
    this.volume = document.querySelector(".track[data-index='" + track.index + "'] .volume");
    this.volume.value = track.volume;
    this.mute = document.querySelector(".track[data-index='" + track.index + "'] .track__mute");
    this.solo = document.querySelector(".track[data-index='" + track.index + "'] .track__solo");
    this.track = track;
    this.drawPaning();
}
Controls.prototype = {
    moveLayerVolume: function(volume) {
        layer = document.querySelector(".track[data-index='" + this.track.index + "'] .track__volume-layer-mask");
        width = 100 - volume;
        layer.style.width = width + 'px';
    },
    changeVolumeCaption: function(volume) {
        document.querySelector(".track[data-index='" + this.track.index + "'] .track__volume-caption").innerHTML = volume + "%";
    },
    drawPaning: function() {
        this.panner.value = this.track.panning;
    },
    changeMuteColor: function(volume) {
        if (volume == 0) {
            this.mute.classList.add("is-active");
        } else {
            this.mute.classList.remove("is-active");
        }
    },
    setVolume: function(volume) {
        this.volume.value = volume;
        this.moveLayerVolume(volume);
        this.changeMuteColor(volume);
        this.changeVolumeCaption(volume);
    },
    setPanning: function(panning) {
        this.panner.value = panning;
    },
    getVolume: function() {
        return parseInt(this.volume.value);
    },
    getPanning: function() {
        return parseInt(this.panner.value) || 0;
    }
}
Track = function(track, mixer) {
    this.index = track.index;
    this.element = document.querySelector('.track[data-index="' + this.index + '"]');
    this.preview = track.preview;
    this.icon = track.icon;
    this.url = track.url;
    this.color = track.color;
    this.waveForm = new WaveForm(track);
    this.controls = new Controls(track);
    this.description = track.description;
    this.mixer = mixer;
    this.context = mixer.context;
    this.buffer = null;
    this.source = null;
    this.gain = null;
    this.panner = null;
    this.useStereoPanner = false;
    this.setIcon();
    this.element.style.color = this.color;
    var that = this;
    this.controls.volume.addEventListener("input", function(elt) {
        that.changeVolume(this.value);
    });
    this.controls.volume.addEventListener("mousewheel", function(e) {
        var evt = window.event || e;
        var delta = evt.detail ? evt.detail * (-120) : evt.wheelDelta;
        evt.preventDefault();
        if (delta > 0) {
            volume = parseInt($(this).val()) + 10;
        } else {
            volume = parseInt($(this).val()) - 10;
        }
        that.changeVolume(volume);
    });
    this.controls.panner.addEventListener("input", function() {
        that.changePan($(this).val());
    });
    this.controls.panner.addEventListener("mousewheel", function(e) {
        var evt = window.event || e;
        var delta = evt.detail ? evt.detail * (-120) : evt.wheelDelta
        evt.preventDefault();
        if (delta > 0) {
            panning = parseInt($(this).val()) + 100;
        } else {
            panning = parseInt($(this).val()) - 100;
        }
        that.changePan(panning);
    });
    this.controls.mute.addEventListener("click", function() {
        that.changeVolume(that.isMuted() ? 100 : 0);
        that.mixer.resetSolo();
    });
    this.controls.solo.addEventListener("click", function() {
        that.mixer.soloTrack(that);
    });
};
Track.prototype = {
    load: function() {
        var request = new XMLHttpRequest();
        request.open("GET", this.url, true);
        request.responseType = "arraybuffer";
        var that = this;
        request.onload = function() {
            that.context.decodeAudioData(request.response, function(buffer) {
                if (!buffer) {
                    alert('error decoding file data: ' + that.url);
                    return;
                }
                that.buffer = buffer;
                that.createAudioSource();
            }, function() {
                Mixer.noCompatible();
            });
        }
        request.onprogress = function(evt) {
            that.waveForm.drawProgress(evt.loaded, evt.total);
            if (evt.loaded === evt.total) {
                that.waveForm.draw(that.mixer.duration / 100, (Track.height));
                that.waveForm.scale(that.controls.getVolume());
            }
        }
        request.onerror = (evt) => {
            console.log("An error " + evt.target.status + " has occured when loading " + this.url);
        }
        request.send();
    },
    changeVolume: function(volume) {
        if (volume > 100) {
            volume = 100;
        }
        if (volume < 0) {
            volume = 0;
        }
        this.gain.gain.value = volume / 100;
        this.controls.setVolume(volume);
        this.waveForm.scale(volume);
    },
    changePan: function(pan) {
        if (this.useStereoPanner) {
            this.panner.pan.value = pan / 100;
        } else {
            this.panner.setPosition((pan / 100), 0, 0);
        }
        this.controls.setPanning(pan);
    },
    createAudioSource: function() {
        this.source = this.context.createBufferSource();
        this.source.loop = true;
        this.source.buffer = this.buffer;
        this.gain = this.context.createGain();
        this.source.connect(this.gain);
        try {
            this.panner = this.context.createStereoPanner();
            this.useStereoPanner = true;
        } catch (e) {
            this.panner = this.context.createPanner();
            this.panner.panningModel = "equalpower";
        }
        this.gain.connect(this.panner);
        this.panner.connect(this.context.destination);
        this.changePan(this.controls.getPanning());
        this.changeVolume(this.controls.getVolume());
        var event = new Event("soundloaded");
        document.dispatchEvent(event);
    },
    setIcon: function() {
        if (!this.icon) {
            return;
        }
        this.element.querySelector('.track__icon img').src = this.icon;
        this.element.querySelector('.track__icon img').alt = this.description;
        this.element.querySelector('.track__icon').style.background = this.color;
    },
    isMuted: function() {
        return parseInt(this.controls.getVolume()) === 0;
    },
    isMixed: function() {
        return this.description.indexOf("Mixed") > -1;
    },
    setSolo: function() {
        this.controls.solo.classList.add('is-active');
        if (this.isMuted()) {
            this.changeVolume(100);
        }
    },
    unsetSolo: function() {
        this.controls.solo.classList.remove('is-active');
    },
    getDuration: function() {
        return this.source.buffer.duration;
    },
    setLoopEnd: function(loopEnd) {
        this.source.loopEnd = loopEnd;
    }
}
Track.width = 520;
Track.height = 23;
WaveForm = function(track) {
    this.bytes = [];
    this.points = [];
    this.decodePreview(track.preview);
    this.decodeGraph(track.graphs);
    this.color = track.color;
    this.canvas = document.querySelector(".track[data-index='" + track.index + "'] .track__canvas");
    this.canvas.width = parseInt(window.getComputedStyle(this.canvas).width);
    this.canvas.height = parseInt(window.getComputedStyle(this.canvas).height);
}
WaveForm.prototype = {
    decodeGraph: function(g) {
        var that = this;
        g.forEach(function(element) {
            that.points.push(element);
        });
    },
    decodePreview: function(preview) {
        var str = atob(preview);
        for (var i = 0; i < str.length; ++i) {
            waveValue = 100 * (parseInt(str.charCodeAt(i)) / 255);
            if (waveValue) {
                this.bytes[i] = 100 * (parseInt(str.charCodeAt(i)) / 255);
            }
        }
    },
    draw: function(maxEndPoint, height) {
        var context = this.canvas.getContext('2d');
        context.beginPath();
        context.rect(0, 0, this.canvas.width, this.canvas.height);
        context.fillStyle = "#EAEAEA";
        context.fill();
        var that = this;
        this.points.forEach(function(p) {
            var begin = (p[0] * that.canvas.width) / maxEndPoint;
            var end = (p[1] * that.canvas.width) / maxEndPoint;
            context.beginPath();
            context.rect(begin, (Track.height - height) / 2, end - begin, height);
            context.fillStyle = that.color;
            context.fill();
            firstP = parseInt(p[0]);
            nextP = parseInt(p[1]);
            for (i = firstP; i <= nextP; i++) {
                if (that.bytes[i]) {
                    begin = (i * that.canvas.width) / maxEndPoint;
                    end = ((i + 1) * that.canvas.width) / maxEndPoint;
                    nHeight = (that.bytes[i] / 100) * height;
                    position = (Track.height / 2) - (nHeight / 2);
                    context.beginPath();
                    context.fillStyle = "#fff";
                    context.rect(begin, position, end - begin, nHeight);
                    context.fill();
                }
            }
        });
    },
    drawProgress: function(loaded, total) {
        var context = this.canvas.getContext('2d');
        context.beginPath();
        context.rect(0, 0, loaded / total * this.canvas.width, this.canvas.height);
        context.fillStyle = this.color;
        context.fill();
    },
    scale: function(volume) {
        scale = volume / 100;
        if (scale <= 0.04) {
            scale = 0.04;
        }
        this.canvas.style.transformOrigin = "left center";
        this.canvas.style.webkitTransformOrigin = "left center";
        this.canvas.style.transform = "scaleY(" + scale + ")";
        this.canvas.style.webkitTransform = "scaleY(" + scale + ")";
    }
}