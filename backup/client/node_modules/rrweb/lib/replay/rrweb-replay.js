'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

var NodeType$2;
(function (NodeType) {
    NodeType[NodeType["Document"] = 0] = "Document";
    NodeType[NodeType["DocumentType"] = 1] = "DocumentType";
    NodeType[NodeType["Element"] = 2] = "Element";
    NodeType[NodeType["Text"] = 3] = "Text";
    NodeType[NodeType["CDATA"] = 4] = "CDATA";
    NodeType[NodeType["Comment"] = 5] = "Comment";
})(NodeType$2 || (NodeType$2 = {}));

function isElement(n) {
    return n.nodeType === n.ELEMENT_NODE;
}
var Mirror$2 = (function () {
    function Mirror() {
        this.idNodeMap = new Map();
        this.nodeMetaMap = new WeakMap();
    }
    Mirror.prototype.getId = function (n) {
        var _a;
        if (!n)
            return -1;
        var id = (_a = this.getMeta(n)) === null || _a === void 0 ? void 0 : _a.id;
        return id !== null && id !== void 0 ? id : -1;
    };
    Mirror.prototype.getNode = function (id) {
        return this.idNodeMap.get(id) || null;
    };
    Mirror.prototype.getIds = function () {
        return Array.from(this.idNodeMap.keys());
    };
    Mirror.prototype.getMeta = function (n) {
        return this.nodeMetaMap.get(n) || null;
    };
    Mirror.prototype.removeNodeFromMap = function (n) {
        var _this = this;
        var id = this.getId(n);
        this.idNodeMap["delete"](id);
        if (n.childNodes) {
            n.childNodes.forEach(function (childNode) {
                return _this.removeNodeFromMap(childNode);
            });
        }
    };
    Mirror.prototype.has = function (id) {
        return this.idNodeMap.has(id);
    };
    Mirror.prototype.hasNode = function (node) {
        return this.nodeMetaMap.has(node);
    };
    Mirror.prototype.add = function (n, meta) {
        var id = meta.id;
        this.idNodeMap.set(id, n);
        this.nodeMetaMap.set(n, meta);
    };
    Mirror.prototype.replace = function (id, n) {
        var oldNode = this.getNode(id);
        if (oldNode) {
            var meta = this.nodeMetaMap.get(oldNode);
            if (meta)
                this.nodeMetaMap.set(n, meta);
        }
        this.idNodeMap.set(id, n);
    };
    Mirror.prototype.reset = function () {
        this.idNodeMap = new Map();
        this.nodeMetaMap = new WeakMap();
    };
    return Mirror;
}());
function createMirror$2() {
    return new Mirror$2();
}

var commentre = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;
function parse(css, options) {
    if (options === void 0) { options = {}; }
    var lineno = 1;
    var column = 1;
    function updatePosition(str) {
        var lines = str.match(/\n/g);
        if (lines) {
            lineno += lines.length;
        }
        var i = str.lastIndexOf('\n');
        column = i === -1 ? column + str.length : str.length - i;
    }
    function position() {
        var start = { line: lineno, column: column };
        return function (node) {
            node.position = new Position(start);
            whitespace();
            return node;
        };
    }
    var Position = (function () {
        function Position(start) {
            this.start = start;
            this.end = { line: lineno, column: column };
            this.source = options.source;
        }
        return Position;
    }());
    Position.prototype.content = css;
    var errorsList = [];
    function error(msg) {
        var err = new Error("".concat(options.source || '', ":").concat(lineno, ":").concat(column, ": ").concat(msg));
        err.reason = msg;
        err.filename = options.source;
        err.line = lineno;
        err.column = column;
        err.source = css;
        if (options.silent) {
            errorsList.push(err);
        }
        else {
            throw err;
        }
    }
    function stylesheet() {
        var rulesList = rules();
        return {
            type: 'stylesheet',
            stylesheet: {
                source: options.source,
                rules: rulesList,
                parsingErrors: errorsList
            }
        };
    }
    function open() {
        return match(/^{\s*/);
    }
    function close() {
        return match(/^}/);
    }
    function rules() {
        var node;
        var rules = [];
        whitespace();
        comments(rules);
        while (css.length && css.charAt(0) !== '}' && (node = atrule() || rule())) {
            if (node !== false) {
                rules.push(node);
                comments(rules);
            }
        }
        return rules;
    }
    function match(re) {
        var m = re.exec(css);
        if (!m) {
            return;
        }
        var str = m[0];
        updatePosition(str);
        css = css.slice(str.length);
        return m;
    }
    function whitespace() {
        match(/^\s*/);
    }
    function comments(rules) {
        if (rules === void 0) { rules = []; }
        var c;
        while ((c = comment())) {
            if (c !== false) {
                rules.push(c);
            }
            c = comment();
        }
        return rules;
    }
    function comment() {
        var pos = position();
        if ('/' !== css.charAt(0) || '*' !== css.charAt(1)) {
            return;
        }
        var i = 2;
        while ('' !== css.charAt(i) &&
            ('*' !== css.charAt(i) || '/' !== css.charAt(i + 1))) {
            ++i;
        }
        i += 2;
        if ('' === css.charAt(i - 1)) {
            return error('End of comment missing');
        }
        var str = css.slice(2, i - 2);
        column += 2;
        updatePosition(str);
        css = css.slice(i);
        column += 2;
        return pos({
            type: 'comment',
            comment: str
        });
    }
    function selector() {
        var m = match(/^([^{]+)/);
        if (!m) {
            return;
        }
        return trim(m[0])
            .replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*\/+/g, '')
            .replace(/"(?:\\"|[^"])*"|'(?:\\'|[^'])*'/g, function (m) {
            return m.replace(/,/g, '\u200C');
        })
            .split(/\s*(?![^(]*\)),\s*/)
            .map(function (s) {
            return s.replace(/\u200C/g, ',');
        });
    }
    function declaration() {
        var pos = position();
        var propMatch = match(/^(\*?[-#\/\*\\\w]+(\[[0-9a-z_-]+\])?)\s*/);
        if (!propMatch) {
            return;
        }
        var prop = trim(propMatch[0]);
        if (!match(/^:\s*/)) {
            return error("property missing ':'");
        }
        var val = match(/^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^\)]*?\)|[^};])+)/);
        var ret = pos({
            type: 'declaration',
            property: prop.replace(commentre, ''),
            value: val ? trim(val[0]).replace(commentre, '') : ''
        });
        match(/^[;\s]*/);
        return ret;
    }
    function declarations() {
        var decls = [];
        if (!open()) {
            return error("missing '{'");
        }
        comments(decls);
        var decl;
        while ((decl = declaration())) {
            if (decl !== false) {
                decls.push(decl);
                comments(decls);
            }
            decl = declaration();
        }
        if (!close()) {
            return error("missing '}'");
        }
        return decls;
    }
    function keyframe() {
        var m;
        var vals = [];
        var pos = position();
        while ((m = match(/^((\d+\.\d+|\.\d+|\d+)%?|[a-z]+)\s*/))) {
            vals.push(m[1]);
            match(/^,\s*/);
        }
        if (!vals.length) {
            return;
        }
        return pos({
            type: 'keyframe',
            values: vals,
            declarations: declarations()
        });
    }
    function atkeyframes() {
        var pos = position();
        var m = match(/^@([-\w]+)?keyframes\s*/);
        if (!m) {
            return;
        }
        var vendor = m[1];
        m = match(/^([-\w]+)\s*/);
        if (!m) {
            return error('@keyframes missing name');
        }
        var name = m[1];
        if (!open()) {
            return error("@keyframes missing '{'");
        }
        var frame;
        var frames = comments();
        while ((frame = keyframe())) {
            frames.push(frame);
            frames = frames.concat(comments());
        }
        if (!close()) {
            return error("@keyframes missing '}'");
        }
        return pos({
            type: 'keyframes',
            name: name,
            vendor: vendor,
            keyframes: frames
        });
    }
    function atsupports() {
        var pos = position();
        var m = match(/^@supports *([^{]+)/);
        if (!m) {
            return;
        }
        var supports = trim(m[1]);
        if (!open()) {
            return error("@supports missing '{'");
        }
        var style = comments().concat(rules());
        if (!close()) {
            return error("@supports missing '}'");
        }
        return pos({
            type: 'supports',
            supports: supports,
            rules: style
        });
    }
    function athost() {
        var pos = position();
        var m = match(/^@host\s*/);
        if (!m) {
            return;
        }
        if (!open()) {
            return error("@host missing '{'");
        }
        var style = comments().concat(rules());
        if (!close()) {
            return error("@host missing '}'");
        }
        return pos({
            type: 'host',
            rules: style
        });
    }
    function atmedia() {
        var pos = position();
        var m = match(/^@media *([^{]+)/);
        if (!m) {
            return;
        }
        var media = trim(m[1]);
        if (!open()) {
            return error("@media missing '{'");
        }
        var style = comments().concat(rules());
        if (!close()) {
            return error("@media missing '}'");
        }
        return pos({
            type: 'media',
            media: media,
            rules: style
        });
    }
    function atcustommedia() {
        var pos = position();
        var m = match(/^@custom-media\s+(--[^\s]+)\s*([^{;]+);/);
        if (!m) {
            return;
        }
        return pos({
            type: 'custom-media',
            name: trim(m[1]),
            media: trim(m[2])
        });
    }
    function atpage() {
        var pos = position();
        var m = match(/^@page */);
        if (!m) {
            return;
        }
        var sel = selector() || [];
        if (!open()) {
            return error("@page missing '{'");
        }
        var decls = comments();
        var decl;
        while ((decl = declaration())) {
            decls.push(decl);
            decls = decls.concat(comments());
        }
        if (!close()) {
            return error("@page missing '}'");
        }
        return pos({
            type: 'page',
            selectors: sel,
            declarations: decls
        });
    }
    function atdocument() {
        var pos = position();
        var m = match(/^@([-\w]+)?document *([^{]+)/);
        if (!m) {
            return;
        }
        var vendor = trim(m[1]);
        var doc = trim(m[2]);
        if (!open()) {
            return error("@document missing '{'");
        }
        var style = comments().concat(rules());
        if (!close()) {
            return error("@document missing '}'");
        }
        return pos({
            type: 'document',
            document: doc,
            vendor: vendor,
            rules: style
        });
    }
    function atfontface() {
        var pos = position();
        var m = match(/^@font-face\s*/);
        if (!m) {
            return;
        }
        if (!open()) {
            return error("@font-face missing '{'");
        }
        var decls = comments();
        var decl;
        while ((decl = declaration())) {
            decls.push(decl);
            decls = decls.concat(comments());
        }
        if (!close()) {
            return error("@font-face missing '}'");
        }
        return pos({
            type: 'font-face',
            declarations: decls
        });
    }
    var atimport = _compileAtrule('import');
    var atcharset = _compileAtrule('charset');
    var atnamespace = _compileAtrule('namespace');
    function _compileAtrule(name) {
        var re = new RegExp('^@' + name + '\\s*([^;]+);');
        return function () {
            var pos = position();
            var m = match(re);
            if (!m) {
                return;
            }
            var ret = { type: name };
            ret[name] = m[1].trim();
            return pos(ret);
        };
    }
    function atrule() {
        if (css[0] !== '@') {
            return;
        }
        return (atkeyframes() ||
            atmedia() ||
            atcustommedia() ||
            atsupports() ||
            atimport() ||
            atcharset() ||
            atnamespace() ||
            atdocument() ||
            atpage() ||
            athost() ||
            atfontface());
    }
    function rule() {
        var pos = position();
        var sel = selector();
        if (!sel) {
            return error('selector missing');
        }
        comments();
        return pos({
            type: 'rule',
            selectors: sel,
            declarations: declarations()
        });
    }
    return addParent(stylesheet());
}
function trim(str) {
    return str ? str.replace(/^\s+|\s+$/g, '') : '';
}
function addParent(obj, parent) {
    var isNode = obj && typeof obj.type === 'string';
    var childParent = isNode ? obj : parent;
    for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
        var k = _a[_i];
        var value = obj[k];
        if (Array.isArray(value)) {
            value.forEach(function (v) {
                addParent(v, childParent);
            });
        }
        else if (value && typeof value === 'object') {
            addParent(value, childParent);
        }
    }
    if (isNode) {
        Object.defineProperty(obj, 'parent', {
            configurable: true,
            writable: true,
            enumerable: false,
            value: parent || null
        });
    }
    return obj;
}

var tagMap = {
    script: 'noscript',
    altglyph: 'altGlyph',
    altglyphdef: 'altGlyphDef',
    altglyphitem: 'altGlyphItem',
    animatecolor: 'animateColor',
    animatemotion: 'animateMotion',
    animatetransform: 'animateTransform',
    clippath: 'clipPath',
    feblend: 'feBlend',
    fecolormatrix: 'feColorMatrix',
    fecomponenttransfer: 'feComponentTransfer',
    fecomposite: 'feComposite',
    feconvolvematrix: 'feConvolveMatrix',
    fediffuselighting: 'feDiffuseLighting',
    fedisplacementmap: 'feDisplacementMap',
    fedistantlight: 'feDistantLight',
    fedropshadow: 'feDropShadow',
    feflood: 'feFlood',
    fefunca: 'feFuncA',
    fefuncb: 'feFuncB',
    fefuncg: 'feFuncG',
    fefuncr: 'feFuncR',
    fegaussianblur: 'feGaussianBlur',
    feimage: 'feImage',
    femerge: 'feMerge',
    femergenode: 'feMergeNode',
    femorphology: 'feMorphology',
    feoffset: 'feOffset',
    fepointlight: 'fePointLight',
    fespecularlighting: 'feSpecularLighting',
    fespotlight: 'feSpotLight',
    fetile: 'feTile',
    feturbulence: 'feTurbulence',
    foreignobject: 'foreignObject',
    glyphref: 'glyphRef',
    lineargradient: 'linearGradient',
    radialgradient: 'radialGradient'
};
function getTagName(n) {
    var tagName = tagMap[n.tagName] ? tagMap[n.tagName] : n.tagName;
    if (tagName === 'link' && n.attributes._cssText) {
        tagName = 'style';
    }
    return tagName;
}
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
var HOVER_SELECTOR = /([^\\]):hover/;
var HOVER_SELECTOR_GLOBAL = new RegExp(HOVER_SELECTOR.source, 'g');
function addHoverClass(cssText, cache) {
    var cachedStyle = cache === null || cache === void 0 ? void 0 : cache.stylesWithHoverClass.get(cssText);
    if (cachedStyle)
        return cachedStyle;
    var ast = parse(cssText, {
        silent: true
    });
    if (!ast.stylesheet) {
        return cssText;
    }
    var selectors = [];
    ast.stylesheet.rules.forEach(function (rule) {
        if ('selectors' in rule) {
            (rule.selectors || []).forEach(function (selector) {
                if (HOVER_SELECTOR.test(selector)) {
                    selectors.push(selector);
                }
            });
        }
    });
    if (selectors.length === 0) {
        return cssText;
    }
    var selectorMatcher = new RegExp(selectors
        .filter(function (selector, index) { return selectors.indexOf(selector) === index; })
        .sort(function (a, b) { return b.length - a.length; })
        .map(function (selector) {
        return escapeRegExp(selector);
    })
        .join('|'), 'g');
    var result = cssText.replace(selectorMatcher, function (selector) {
        var newSelector = selector.replace(HOVER_SELECTOR_GLOBAL, '$1.\\:hover');
        return "".concat(selector, ", ").concat(newSelector);
    });
    cache === null || cache === void 0 ? void 0 : cache.stylesWithHoverClass.set(cssText, result);
    return result;
}
function createCache() {
    var stylesWithHoverClass = new Map();
    return {
        stylesWithHoverClass: stylesWithHoverClass
    };
}
function buildNode(n, options) {
    var doc = options.doc, hackCss = options.hackCss, cache = options.cache;
    switch (n.type) {
        case NodeType$2.Document:
            return doc.implementation.createDocument(null, '', null);
        case NodeType$2.DocumentType:
            return doc.implementation.createDocumentType(n.name || 'html', n.publicId, n.systemId);
        case NodeType$2.Element: {
            var tagName = getTagName(n);
            var node_1;
            if (n.isSVG) {
                node_1 = doc.createElementNS('http://www.w3.org/2000/svg', tagName);
            }
            else {
                node_1 = doc.createElement(tagName);
            }
            var specialAttributes = {};
            for (var name_1 in n.attributes) {
                if (!Object.prototype.hasOwnProperty.call(n.attributes, name_1)) {
                    continue;
                }
                var value = n.attributes[name_1];
                if (tagName === 'option' &&
                    name_1 === 'selected' &&
                    value === false) {
                    continue;
                }
                if (value === true)
                    value = '';
                if (name_1.startsWith('rr_')) {
                    specialAttributes[name_1] = value;
                    continue;
                }
                var isTextarea = tagName === 'textarea' && name_1 === 'value';
                var isRemoteOrDynamicCss = tagName === 'style' && name_1 === '_cssText';
                if (isRemoteOrDynamicCss && hackCss && typeof value === 'string') {
                    value = addHoverClass(value, cache);
                }
                if ((isTextarea || isRemoteOrDynamicCss) && typeof value === 'string') {
                    var child = doc.createTextNode(value);
                    for (var _i = 0, _a = Array.from(node_1.childNodes); _i < _a.length; _i++) {
                        var c = _a[_i];
                        if (c.nodeType === node_1.TEXT_NODE) {
                            node_1.removeChild(c);
                        }
                    }
                    node_1.appendChild(child);
                    continue;
                }
                try {
                    if (n.isSVG && name_1 === 'xlink:href') {
                        node_1.setAttributeNS('http://www.w3.org/1999/xlink', name_1, value.toString());
                    }
                    else if (name_1 === 'onload' ||
                        name_1 === 'onclick' ||
                        name_1.substring(0, 7) === 'onmouse') {
                        node_1.setAttribute('_' + name_1, value.toString());
                    }
                    else if (tagName === 'meta' &&
                        n.attributes['http-equiv'] === 'Content-Security-Policy' &&
                        name_1 === 'content') {
                        node_1.setAttribute('csp-content', value.toString());
                        continue;
                    }
                    else if (tagName === 'link' &&
                        n.attributes.rel === 'preload' &&
                        n.attributes.as === 'script') {
                    }
                    else if (tagName === 'link' &&
                        n.attributes.rel === 'prefetch' &&
                        typeof n.attributes.href === 'string' &&
                        n.attributes.href.endsWith('.js')) {
                    }
                    else if (tagName === 'img' &&
                        n.attributes.srcset &&
                        n.attributes.rr_dataURL) {
                        node_1.setAttribute('rrweb-original-srcset', n.attributes.srcset);
                    }
                    else {
                        node_1.setAttribute(name_1, value.toString());
                    }
                }
                catch (error) {
                }
            }
            var _loop_1 = function (name_2) {
                var value = specialAttributes[name_2];
                if (tagName === 'canvas' && name_2 === 'rr_dataURL') {
                    var image_1 = document.createElement('img');
                    image_1.onload = function () {
                        var ctx = node_1.getContext('2d');
                        if (ctx) {
                            ctx.drawImage(image_1, 0, 0, image_1.width, image_1.height);
                        }
                    };
                    image_1.src = value.toString();
                    if (node_1.RRNodeType)
                        node_1.rr_dataURL = value.toString();
                }
                else if (tagName === 'img' && name_2 === 'rr_dataURL') {
                    var image = node_1;
                    if (!image.currentSrc.startsWith('data:')) {
                        image.setAttribute('rrweb-original-src', n.attributes.src);
                        image.src = value.toString();
                    }
                }
                if (name_2 === 'rr_width') {
                    node_1.style.width = value.toString();
                }
                else if (name_2 === 'rr_height') {
                    node_1.style.height = value.toString();
                }
                else if (name_2 === 'rr_mediaCurrentTime' &&
                    typeof value === 'number') {
                    node_1.currentTime = value;
                }
                else if (name_2 === 'rr_mediaState') {
                    switch (value) {
                        case 'played':
                            node_1
                                .play()["catch"](function (e) { return console.warn('media playback error', e); });
                            break;
                        case 'paused':
                            node_1.pause();
                            break;
                    }
                }
            };
            for (var name_2 in specialAttributes) {
                _loop_1(name_2);
            }
            if (n.isShadowHost) {
                if (!node_1.shadowRoot) {
                    node_1.attachShadow({ mode: 'open' });
                }
                else {
                    while (node_1.shadowRoot.firstChild) {
                        node_1.shadowRoot.removeChild(node_1.shadowRoot.firstChild);
                    }
                }
            }
            return node_1;
        }
        case NodeType$2.Text:
            return doc.createTextNode(n.isStyle && hackCss
                ? addHoverClass(n.textContent, cache)
                : n.textContent);
        case NodeType$2.CDATA:
            return doc.createCDATASection(n.textContent);
        case NodeType$2.Comment:
            return doc.createComment(n.textContent);
        default:
            return null;
    }
}
function buildNodeWithSN(n, options) {
    var doc = options.doc, mirror = options.mirror, _a = options.skipChild, skipChild = _a === void 0 ? false : _a, _b = options.hackCss, hackCss = _b === void 0 ? true : _b, afterAppend = options.afterAppend, cache = options.cache;
    var node = buildNode(n, { doc: doc, hackCss: hackCss, cache: cache });
    if (!node) {
        return null;
    }
    if (n.rootId && mirror.getNode(n.rootId) !== doc) {
        mirror.replace(n.rootId, doc);
    }
    if (n.type === NodeType$2.Document) {
        doc.close();
        doc.open();
        if (n.compatMode === 'BackCompat' &&
            n.childNodes &&
            n.childNodes[0].type !== NodeType$2.DocumentType) {
            if (n.childNodes[0].type === NodeType$2.Element &&
                'xmlns' in n.childNodes[0].attributes &&
                n.childNodes[0].attributes.xmlns === 'http://www.w3.org/1999/xhtml') {
                doc.write('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "">');
            }
            else {
                doc.write('<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "">');
            }
        }
        node = doc;
    }
    mirror.add(node, n);
    if ((n.type === NodeType$2.Document || n.type === NodeType$2.Element) &&
        !skipChild) {
        for (var _i = 0, _c = n.childNodes; _i < _c.length; _i++) {
            var childN = _c[_i];
            var childNode = buildNodeWithSN(childN, {
                doc: doc,
                mirror: mirror,
                skipChild: false,
                hackCss: hackCss,
                afterAppend: afterAppend,
                cache: cache
            });
            if (!childNode) {
                console.warn('Failed to rebuild', childN);
                continue;
            }
            if (childN.isShadow && isElement(node) && node.shadowRoot) {
                node.shadowRoot.appendChild(childNode);
            }
            else {
                node.appendChild(childNode);
            }
            if (afterAppend) {
                afterAppend(childNode, childN.id);
            }
        }
    }
    return node;
}
function visit(mirror, onVisit) {
    function walk(node) {
        onVisit(node);
    }
    for (var _i = 0, _a = mirror.getIds(); _i < _a.length; _i++) {
        var id = _a[_i];
        if (mirror.has(id)) {
            walk(mirror.getNode(id));
        }
    }
}
function handleScroll(node, mirror) {
    var n = mirror.getMeta(node);
    if ((n === null || n === void 0 ? void 0 : n.type) !== NodeType$2.Element) {
        return;
    }
    var el = node;
    for (var name_3 in n.attributes) {
        if (!(Object.prototype.hasOwnProperty.call(n.attributes, name_3) &&
            name_3.startsWith('rr_'))) {
            continue;
        }
        var value = n.attributes[name_3];
        if (name_3 === 'rr_scrollLeft') {
            el.scrollLeft = value;
        }
        if (name_3 === 'rr_scrollTop') {
            el.scrollTop = value;
        }
    }
}
function rebuild(n, options) {
    var doc = options.doc, onVisit = options.onVisit, _a = options.hackCss, hackCss = _a === void 0 ? true : _a, afterAppend = options.afterAppend, cache = options.cache, _b = options.mirror, mirror = _b === void 0 ? new Mirror$2() : _b;
    var node = buildNodeWithSN(n, {
        doc: doc,
        mirror: mirror,
        skipChild: false,
        hackCss: hackCss,
        afterAppend: afterAppend,
        cache: cache
    });
    visit(mirror, function (visitedNode) {
        if (onVisit) {
            onVisit(visitedNode);
        }
        handleScroll(visitedNode, mirror);
    });
    return node;
}

var NodeType$1;
(function (NodeType) {
    NodeType[NodeType["Document"] = 0] = "Document";
    NodeType[NodeType["DocumentType"] = 1] = "DocumentType";
    NodeType[NodeType["Element"] = 2] = "Element";
    NodeType[NodeType["Text"] = 3] = "Text";
    NodeType[NodeType["CDATA"] = 4] = "CDATA";
    NodeType[NodeType["Comment"] = 5] = "Comment";
})(NodeType$1 || (NodeType$1 = {}));
var Mirror$1 = (function () {
    function Mirror() {
        this.idNodeMap = new Map();
        this.nodeMetaMap = new WeakMap();
    }
    Mirror.prototype.getId = function (n) {
        var _a;
        if (!n)
            return -1;
        var id = (_a = this.getMeta(n)) === null || _a === void 0 ? void 0 : _a.id;
        return id !== null && id !== void 0 ? id : -1;
    };
    Mirror.prototype.getNode = function (id) {
        return this.idNodeMap.get(id) || null;
    };
    Mirror.prototype.getIds = function () {
        return Array.from(this.idNodeMap.keys());
    };
    Mirror.prototype.getMeta = function (n) {
        return this.nodeMetaMap.get(n) || null;
    };
    Mirror.prototype.removeNodeFromMap = function (n) {
        var _this = this;
        var id = this.getId(n);
        this.idNodeMap["delete"](id);
        if (n.childNodes) {
            n.childNodes.forEach(function (childNode) {
                return _this.removeNodeFromMap(childNode);
            });
        }
    };
    Mirror.prototype.has = function (id) {
        return this.idNodeMap.has(id);
    };
    Mirror.prototype.hasNode = function (node) {
        return this.nodeMetaMap.has(node);
    };
    Mirror.prototype.add = function (n, meta) {
        var id = meta.id;
        this.idNodeMap.set(id, n);
        this.nodeMetaMap.set(n, meta);
    };
    Mirror.prototype.replace = function (id, n) {
        var oldNode = this.getNode(id);
        if (oldNode) {
            var meta = this.nodeMetaMap.get(oldNode);
            if (meta)
                this.nodeMetaMap.set(n, meta);
        }
        this.idNodeMap.set(id, n);
    };
    Mirror.prototype.reset = function () {
        this.idNodeMap = new Map();
        this.nodeMetaMap = new WeakMap();
    };
    return Mirror;
}());
function createMirror$1() {
    return new Mirror$1();
}

function parseCSSText(cssText) {
    const res = {};
    const listDelimiter = /;(?![^(]*\))/g;
    const propertyDelimiter = /:(.+)/;
    const comment = /\/\*.*?\*\//g;
    cssText
        .replace(comment, '')
        .split(listDelimiter)
        .forEach(function (item) {
        if (item) {
            const tmp = item.split(propertyDelimiter);
            tmp.length > 1 && (res[camelize(tmp[0].trim())] = tmp[1].trim());
        }
    });
    return res;
}
function toCSSText(style) {
    const properties = [];
    for (const name in style) {
        const value = style[name];
        if (typeof value !== 'string')
            continue;
        const normalizedName = hyphenate(name);
        properties.push(`${normalizedName}: ${value};`);
    }
    return properties.join(' ');
}
const camelizeRE = /-([a-z])/g;
const CUSTOM_PROPERTY_REGEX = /^--[a-zA-Z0-9-]+$/;
const camelize = (str) => {
    if (CUSTOM_PROPERTY_REGEX.test(str))
        return str;
    return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));
};
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = (str) => {
    return str.replace(hyphenateRE, '-$1').toLowerCase();
};

class BaseRRNode {
    constructor(..._args) {
        this.childNodes = [];
        this.parentElement = null;
        this.parentNode = null;
        this.ELEMENT_NODE = NodeType.ELEMENT_NODE;
        this.TEXT_NODE = NodeType.TEXT_NODE;
    }
    get firstChild() {
        return this.childNodes[0] || null;
    }
    get lastChild() {
        return this.childNodes[this.childNodes.length - 1] || null;
    }
    get nextSibling() {
        const parentNode = this.parentNode;
        if (!parentNode)
            return null;
        const siblings = parentNode.childNodes;
        const index = siblings.indexOf(this);
        return siblings[index + 1] || null;
    }
    contains(node) {
        if (node === this)
            return true;
        for (const child of this.childNodes) {
            if (child.contains(node))
                return true;
        }
        return false;
    }
    appendChild(_newChild) {
        throw new Error(`RRDomException: Failed to execute 'appendChild' on 'RRNode': This RRNode type does not support this method.`);
    }
    insertBefore(_newChild, _refChild) {
        throw new Error(`RRDomException: Failed to execute 'insertBefore' on 'RRNode': This RRNode type does not support this method.`);
    }
    removeChild(_node) {
        throw new Error(`RRDomException: Failed to execute 'removeChild' on 'RRNode': This RRNode type does not support this method.`);
    }
    toString() {
        return 'RRNode';
    }
}
function BaseRRDocumentImpl(RRNodeClass) {
    return class BaseRRDocument extends RRNodeClass {
        constructor() {
            super(...arguments);
            this.nodeType = NodeType.DOCUMENT_NODE;
            this.nodeName = '#document';
            this.compatMode = 'CSS1Compat';
            this.RRNodeType = NodeType$1.Document;
            this.textContent = null;
        }
        get documentElement() {
            return (this.childNodes.find((node) => node.RRNodeType === NodeType$1.Element &&
                node.tagName === 'HTML') || null);
        }
        get body() {
            var _a;
            return (((_a = this.documentElement) === null || _a === void 0 ? void 0 : _a.childNodes.find((node) => node.RRNodeType === NodeType$1.Element &&
                node.tagName === 'BODY')) || null);
        }
        get head() {
            var _a;
            return (((_a = this.documentElement) === null || _a === void 0 ? void 0 : _a.childNodes.find((node) => node.RRNodeType === NodeType$1.Element &&
                node.tagName === 'HEAD')) || null);
        }
        get implementation() {
            return this;
        }
        get firstElementChild() {
            return this.documentElement;
        }
        appendChild(childNode) {
            const nodeType = childNode.RRNodeType;
            if (nodeType === NodeType$1.Element ||
                nodeType === NodeType$1.DocumentType) {
                if (this.childNodes.some((s) => s.RRNodeType === nodeType)) {
                    throw new Error(`RRDomException: Failed to execute 'appendChild' on 'RRNode': Only one ${nodeType === NodeType$1.Element ? 'RRElement' : 'RRDoctype'} on RRDocument allowed.`);
                }
            }
            childNode.parentElement = null;
            childNode.parentNode = this;
            this.childNodes.push(childNode);
            return childNode;
        }
        insertBefore(newChild, refChild) {
            const nodeType = newChild.RRNodeType;
            if (nodeType === NodeType$1.Element ||
                nodeType === NodeType$1.DocumentType) {
                if (this.childNodes.some((s) => s.RRNodeType === nodeType)) {
                    throw new Error(`RRDomException: Failed to execute 'insertBefore' on 'RRNode': Only one ${nodeType === NodeType$1.Element ? 'RRElement' : 'RRDoctype'} on RRDocument allowed.`);
                }
            }
            if (refChild === null)
                return this.appendChild(newChild);
            const childIndex = this.childNodes.indexOf(refChild);
            if (childIndex == -1)
                throw new Error("Failed to execute 'insertBefore' on 'RRNode': The RRNode before which the new node is to be inserted is not a child of this RRNode.");
            this.childNodes.splice(childIndex, 0, newChild);
            newChild.parentElement = null;
            newChild.parentNode = this;
            return newChild;
        }
        removeChild(node) {
            const indexOfChild = this.childNodes.indexOf(node);
            if (indexOfChild === -1)
                throw new Error("Failed to execute 'removeChild' on 'RRDocument': The RRNode to be removed is not a child of this RRNode.");
            this.childNodes.splice(indexOfChild, 1);
            node.parentElement = null;
            node.parentNode = null;
            return node;
        }
        open() {
            this.childNodes = [];
        }
        close() {
        }
        write(content) {
            let publicId;
            if (content ===
                '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "">')
                publicId = '-//W3C//DTD XHTML 1.0 Transitional//EN';
            else if (content ===
                '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "">')
                publicId = '-//W3C//DTD HTML 4.0 Transitional//EN';
            if (publicId) {
                const doctype = this.createDocumentType('html', publicId, '');
                this.open();
                this.appendChild(doctype);
            }
        }
        createDocument(_namespace, _qualifiedName, _doctype) {
            return new BaseRRDocument();
        }
        createDocumentType(qualifiedName, publicId, systemId) {
            const doctype = new (BaseRRDocumentTypeImpl(BaseRRNode))(qualifiedName, publicId, systemId);
            doctype.ownerDocument = this;
            return doctype;
        }
        createElement(tagName) {
            const element = new (BaseRRElementImpl(BaseRRNode))(tagName);
            element.ownerDocument = this;
            return element;
        }
        createElementNS(_namespaceURI, qualifiedName) {
            return this.createElement(qualifiedName);
        }
        createTextNode(data) {
            const text = new (BaseRRTextImpl(BaseRRNode))(data);
            text.ownerDocument = this;
            return text;
        }
        createComment(data) {
            const comment = new (BaseRRCommentImpl(BaseRRNode))(data);
            comment.ownerDocument = this;
            return comment;
        }
        createCDATASection(data) {
            const CDATASection = new (BaseRRCDATASectionImpl(BaseRRNode))(data);
            CDATASection.ownerDocument = this;
            return CDATASection;
        }
        toString() {
            return 'RRDocument';
        }
    };
}
function BaseRRDocumentTypeImpl(RRNodeClass) {
    return class BaseRRDocumentType extends RRNodeClass {
        constructor(qualifiedName, publicId, systemId) {
            super();
            this.nodeType = NodeType.DOCUMENT_TYPE_NODE;
            this.RRNodeType = NodeType$1.DocumentType;
            this.textContent = null;
            this.name = qualifiedName;
            this.publicId = publicId;
            this.systemId = systemId;
            this.nodeName = qualifiedName;
        }
        toString() {
            return 'RRDocumentType';
        }
    };
}
function BaseRRElementImpl(RRNodeClass) {
    return class BaseRRElement extends RRNodeClass {
        constructor(tagName) {
            super();
            this.nodeType = NodeType.ELEMENT_NODE;
            this.RRNodeType = NodeType$1.Element;
            this.attributes = {};
            this.shadowRoot = null;
            this.tagName = tagName.toUpperCase();
            this.nodeName = tagName.toUpperCase();
        }
        get textContent() {
            let result = '';
            this.childNodes.forEach((node) => (result += node.textContent));
            return result;
        }
        set textContent(textContent) {
            this.childNodes = [this.ownerDocument.createTextNode(textContent)];
        }
        get classList() {
            return new ClassList(this.attributes.class, (newClassName) => {
                this.attributes.class = newClassName;
            });
        }
        get id() {
            return this.attributes.id || '';
        }
        get className() {
            return this.attributes.class || '';
        }
        get style() {
            const style = (this.attributes.style
                ? parseCSSText(this.attributes.style)
                : {});
            const hyphenateRE = /\B([A-Z])/g;
            style.setProperty = (name, value, priority) => {
                if (hyphenateRE.test(name))
                    return;
                const normalizedName = camelize(name);
                if (!value)
                    delete style[normalizedName];
                else
                    style[normalizedName] = value;
                if (priority === 'important')
                    style[normalizedName] += ' !important';
                this.attributes.style = toCSSText(style);
            };
            style.removeProperty = (name) => {
                if (hyphenateRE.test(name))
                    return '';
                const normalizedName = camelize(name);
                const value = style[normalizedName] || '';
                delete style[normalizedName];
                this.attributes.style = toCSSText(style);
                return value;
            };
            return style;
        }
        getAttribute(name) {
            return this.attributes[name] || null;
        }
        setAttribute(name, attribute) {
            this.attributes[name] = attribute;
        }
        setAttributeNS(_namespace, qualifiedName, value) {
            this.setAttribute(qualifiedName, value);
        }
        removeAttribute(name) {
            delete this.attributes[name];
        }
        appendChild(newChild) {
            this.childNodes.push(newChild);
            newChild.parentNode = this;
            newChild.parentElement = this;
            return newChild;
        }
        insertBefore(newChild, refChild) {
            if (refChild === null)
                return this.appendChild(newChild);
            const childIndex = this.childNodes.indexOf(refChild);
            if (childIndex == -1)
                throw new Error("Failed to execute 'insertBefore' on 'RRNode': The RRNode before which the new node is to be inserted is not a child of this RRNode.");
            this.childNodes.splice(childIndex, 0, newChild);
            newChild.parentElement = this;
            newChild.parentNode = this;
            return newChild;
        }
        removeChild(node) {
            const indexOfChild = this.childNodes.indexOf(node);
            if (indexOfChild === -1)
                throw new Error("Failed to execute 'removeChild' on 'RRElement': The RRNode to be removed is not a child of this RRNode.");
            this.childNodes.splice(indexOfChild, 1);
            node.parentElement = null;
            node.parentNode = null;
            return node;
        }
        attachShadow(_init) {
            const shadowRoot = this.ownerDocument.createElement('SHADOWROOT');
            this.shadowRoot = shadowRoot;
            return shadowRoot;
        }
        dispatchEvent(_event) {
            return true;
        }
        toString() {
            let attributeString = '';
            for (const attribute in this.attributes) {
                attributeString += `${attribute}="${this.attributes[attribute]}" `;
            }
            return `${this.tagName} ${attributeString}`;
        }
    };
}
function BaseRRMediaElementImpl(RRElementClass) {
    return class BaseRRMediaElement extends RRElementClass {
        attachShadow(_init) {
            throw new Error(`RRDomException: Failed to execute 'attachShadow' on 'RRElement': This RRElement does not support attachShadow`);
        }
        play() {
            this.paused = false;
        }
        pause() {
            this.paused = true;
        }
    };
}
function BaseRRTextImpl(RRNodeClass) {
    return class BaseRRText extends RRNodeClass {
        constructor(data) {
            super();
            this.nodeType = NodeType.TEXT_NODE;
            this.nodeName = '#text';
            this.RRNodeType = NodeType$1.Text;
            this.data = data;
        }
        get textContent() {
            return this.data;
        }
        set textContent(textContent) {
            this.data = textContent;
        }
        toString() {
            return `RRText text=${JSON.stringify(this.data)}`;
        }
    };
}
function BaseRRCommentImpl(RRNodeClass) {
    return class BaseRRComment extends RRNodeClass {
        constructor(data) {
            super();
            this.nodeType = NodeType.COMMENT_NODE;
            this.nodeName = '#comment';
            this.RRNodeType = NodeType$1.Comment;
            this.data = data;
        }
        get textContent() {
            return this.data;
        }
        set textContent(textContent) {
            this.data = textContent;
        }
        toString() {
            return `RRComment text=${JSON.stringify(this.data)}`;
        }
    };
}
function BaseRRCDATASectionImpl(RRNodeClass) {
    return class BaseRRCDATASection extends RRNodeClass {
        constructor(data) {
            super();
            this.nodeName = '#cdata-section';
            this.nodeType = NodeType.CDATA_SECTION_NODE;
            this.RRNodeType = NodeType$1.CDATA;
            this.data = data;
        }
        get textContent() {
            return this.data;
        }
        set textContent(textContent) {
            this.data = textContent;
        }
        toString() {
            return `RRCDATASection data=${JSON.stringify(this.data)}`;
        }
    };
}
class ClassList {
    constructor(classText, onChange) {
        this.classes = [];
        this.add = (...classNames) => {
            for (const item of classNames) {
                const className = String(item);
                if (this.classes.indexOf(className) >= 0)
                    continue;
                this.classes.push(className);
            }
            this.onChange && this.onChange(this.classes.join(' '));
        };
        this.remove = (...classNames) => {
            this.classes = this.classes.filter((item) => classNames.indexOf(item) === -1);
            this.onChange && this.onChange(this.classes.join(' '));
        };
        if (classText) {
            const classes = classText.trim().split(/\s+/);
            this.classes.push(...classes);
        }
        this.onChange = onChange;
    }
}
var NodeType;
(function (NodeType) {
    NodeType[NodeType["PLACEHOLDER"] = 0] = "PLACEHOLDER";
    NodeType[NodeType["ELEMENT_NODE"] = 1] = "ELEMENT_NODE";
    NodeType[NodeType["ATTRIBUTE_NODE"] = 2] = "ATTRIBUTE_NODE";
    NodeType[NodeType["TEXT_NODE"] = 3] = "TEXT_NODE";
    NodeType[NodeType["CDATA_SECTION_NODE"] = 4] = "CDATA_SECTION_NODE";
    NodeType[NodeType["ENTITY_REFERENCE_NODE"] = 5] = "ENTITY_REFERENCE_NODE";
    NodeType[NodeType["ENTITY_NODE"] = 6] = "ENTITY_NODE";
    NodeType[NodeType["PROCESSING_INSTRUCTION_NODE"] = 7] = "PROCESSING_INSTRUCTION_NODE";
    NodeType[NodeType["COMMENT_NODE"] = 8] = "COMMENT_NODE";
    NodeType[NodeType["DOCUMENT_NODE"] = 9] = "DOCUMENT_NODE";
    NodeType[NodeType["DOCUMENT_TYPE_NODE"] = 10] = "DOCUMENT_TYPE_NODE";
    NodeType[NodeType["DOCUMENT_FRAGMENT_NODE"] = 11] = "DOCUMENT_FRAGMENT_NODE";
})(NodeType || (NodeType = {}));

const NAMESPACES = {
    svg: 'http://www.w3.org/2000/svg',
    'xlink:href': 'http://www.w3.org/1999/xlink',
    xmlns: 'http://www.w3.org/2000/xmlns/',
};
const SVGTagMap = {
    altglyph: 'altGlyph',
    altglyphdef: 'altGlyphDef',
    altglyphitem: 'altGlyphItem',
    animatecolor: 'animateColor',
    animatemotion: 'animateMotion',
    animatetransform: 'animateTransform',
    clippath: 'clipPath',
    feblend: 'feBlend',
    fecolormatrix: 'feColorMatrix',
    fecomponenttransfer: 'feComponentTransfer',
    fecomposite: 'feComposite',
    feconvolvematrix: 'feConvolveMatrix',
    fediffuselighting: 'feDiffuseLighting',
    fedisplacementmap: 'feDisplacementMap',
    fedistantlight: 'feDistantLight',
    fedropshadow: 'feDropShadow',
    feflood: 'feFlood',
    fefunca: 'feFuncA',
    fefuncb: 'feFuncB',
    fefuncg: 'feFuncG',
    fefuncr: 'feFuncR',
    fegaussianblur: 'feGaussianBlur',
    feimage: 'feImage',
    femerge: 'feMerge',
    femergenode: 'feMergeNode',
    femorphology: 'feMorphology',
    feoffset: 'feOffset',
    fepointlight: 'fePointLight',
    fespecularlighting: 'feSpecularLighting',
    fespotlight: 'feSpotLight',
    fetile: 'feTile',
    feturbulence: 'feTurbulence',
    foreignobject: 'foreignObject',
    glyphref: 'glyphRef',
    lineargradient: 'linearGradient',
    radialgradient: 'radialGradient',
};
function diff(oldTree, newTree, replayer, rrnodeMirror) {
    const oldChildren = oldTree.childNodes;
    const newChildren = newTree.childNodes;
    rrnodeMirror =
        rrnodeMirror ||
            newTree.mirror ||
            newTree.ownerDocument.mirror;
    if (oldChildren.length > 0 || newChildren.length > 0) {
        diffChildren(Array.from(oldChildren), newChildren, oldTree, replayer, rrnodeMirror);
    }
    let inputDataToApply = null, scrollDataToApply = null;
    switch (newTree.RRNodeType) {
        case NodeType$1.Document: {
            const newRRDocument = newTree;
            scrollDataToApply = newRRDocument.scrollData;
            break;
        }
        case NodeType$1.Element: {
            const oldElement = oldTree;
            const newRRElement = newTree;
            diffProps(oldElement, newRRElement, rrnodeMirror);
            scrollDataToApply = newRRElement.scrollData;
            inputDataToApply = newRRElement.inputData;
            switch (newRRElement.tagName) {
                case 'AUDIO':
                case 'VIDEO': {
                    const oldMediaElement = oldTree;
                    const newMediaRRElement = newRRElement;
                    if (newMediaRRElement.paused !== undefined)
                        newMediaRRElement.paused
                            ? void oldMediaElement.pause()
                            : void oldMediaElement.play();
                    if (newMediaRRElement.muted !== undefined)
                        oldMediaElement.muted = newMediaRRElement.muted;
                    if (newMediaRRElement.volume !== undefined)
                        oldMediaElement.volume = newMediaRRElement.volume;
                    if (newMediaRRElement.currentTime !== undefined)
                        oldMediaElement.currentTime = newMediaRRElement.currentTime;
                    if (newMediaRRElement.playbackRate !== undefined)
                        oldMediaElement.playbackRate = newMediaRRElement.playbackRate;
                    break;
                }
                case 'CANVAS':
                    {
                        const rrCanvasElement = newTree;
                        if (rrCanvasElement.rr_dataURL !== null) {
                            const image = document.createElement('img');
                            image.onload = () => {
                                const ctx = oldElement.getContext('2d');
                                if (ctx) {
                                    ctx.drawImage(image, 0, 0, image.width, image.height);
                                }
                            };
                            image.src = rrCanvasElement.rr_dataURL;
                        }
                        rrCanvasElement.canvasMutations.forEach((canvasMutation) => replayer.applyCanvas(canvasMutation.event, canvasMutation.mutation, oldTree));
                    }
                    break;
                case 'STYLE':
                    {
                        const styleSheet = oldElement.sheet;
                        styleSheet &&
                            newTree.rules.forEach((data) => replayer.applyStyleSheetMutation(data, styleSheet));
                    }
                    break;
            }
            if (newRRElement.shadowRoot) {
                if (!oldElement.shadowRoot)
                    oldElement.attachShadow({ mode: 'open' });
                const oldChildren = oldElement.shadowRoot.childNodes;
                const newChildren = newRRElement.shadowRoot.childNodes;
                if (oldChildren.length > 0 || newChildren.length > 0)
                    diffChildren(Array.from(oldChildren), newChildren, oldElement.shadowRoot, replayer, rrnodeMirror);
            }
            break;
        }
        case NodeType$1.Text:
        case NodeType$1.Comment:
        case NodeType$1.CDATA:
            if (oldTree.textContent !==
                newTree.data)
                oldTree.textContent = newTree.data;
            break;
    }
    scrollDataToApply && replayer.applyScroll(scrollDataToApply, true);
    inputDataToApply && replayer.applyInput(inputDataToApply);
    if (newTree.nodeName === 'IFRAME') {
        const oldContentDocument = oldTree.contentDocument;
        const newIFrameElement = newTree;
        if (oldContentDocument) {
            const sn = rrnodeMirror.getMeta(newIFrameElement.contentDocument);
            if (sn) {
                replayer.mirror.add(oldContentDocument, Object.assign({}, sn));
            }
            diff(oldContentDocument, newIFrameElement.contentDocument, replayer, rrnodeMirror);
        }
    }
}
function diffProps(oldTree, newTree, rrnodeMirror) {
    const oldAttributes = oldTree.attributes;
    const newAttributes = newTree.attributes;
    for (const name in newAttributes) {
        const newValue = newAttributes[name];
        const sn = rrnodeMirror.getMeta(newTree);
        if (sn && 'isSVG' in sn && sn.isSVG && NAMESPACES[name])
            oldTree.setAttributeNS(NAMESPACES[name], name, newValue);
        else if (newTree.tagName === 'CANVAS' && name === 'rr_dataURL') {
            const image = document.createElement('img');
            image.src = newValue;
            image.onload = () => {
                const ctx = oldTree.getContext('2d');
                if (ctx) {
                    ctx.drawImage(image, 0, 0, image.width, image.height);
                }
            };
        }
        else
            oldTree.setAttribute(name, newValue);
    }
    for (const { name } of Array.from(oldAttributes))
        if (!(name in newAttributes))
            oldTree.removeAttribute(name);
    newTree.scrollLeft && (oldTree.scrollLeft = newTree.scrollLeft);
    newTree.scrollTop && (oldTree.scrollTop = newTree.scrollTop);
}
function diffChildren(oldChildren, newChildren, parentNode, replayer, rrnodeMirror) {
    var _a;
    let oldStartIndex = 0, oldEndIndex = oldChildren.length - 1, newStartIndex = 0, newEndIndex = newChildren.length - 1;
    let oldStartNode = oldChildren[oldStartIndex], oldEndNode = oldChildren[oldEndIndex], newStartNode = newChildren[newStartIndex], newEndNode = newChildren[newEndIndex];
    let oldIdToIndex = undefined, indexInOld;
    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        const oldStartId = replayer.mirror.getId(oldStartNode);
        const oldEndId = replayer.mirror.getId(oldEndNode);
        const newStartId = rrnodeMirror.getId(newStartNode);
        const newEndId = rrnodeMirror.getId(newEndNode);
        if (oldStartNode === undefined) {
            oldStartNode = oldChildren[++oldStartIndex];
        }
        else if (oldEndNode === undefined) {
            oldEndNode = oldChildren[--oldEndIndex];
        }
        else if (oldStartId !== -1 &&
            oldStartId === newStartId) {
            diff(oldStartNode, newStartNode, replayer, rrnodeMirror);
            oldStartNode = oldChildren[++oldStartIndex];
            newStartNode = newChildren[++newStartIndex];
        }
        else if (oldEndId !== -1 &&
            oldEndId === newEndId) {
            diff(oldEndNode, newEndNode, replayer, rrnodeMirror);
            oldEndNode = oldChildren[--oldEndIndex];
            newEndNode = newChildren[--newEndIndex];
        }
        else if (oldStartId !== -1 &&
            oldStartId === newEndId) {
            parentNode.insertBefore(oldStartNode, oldEndNode.nextSibling);
            diff(oldStartNode, newEndNode, replayer, rrnodeMirror);
            oldStartNode = oldChildren[++oldStartIndex];
            newEndNode = newChildren[--newEndIndex];
        }
        else if (oldEndId !== -1 &&
            oldEndId === newStartId) {
            parentNode.insertBefore(oldEndNode, oldStartNode);
            diff(oldEndNode, newStartNode, replayer, rrnodeMirror);
            oldEndNode = oldChildren[--oldEndIndex];
            newStartNode = newChildren[++newStartIndex];
        }
        else {
            if (!oldIdToIndex) {
                oldIdToIndex = {};
                for (let i = oldStartIndex; i <= oldEndIndex; i++) {
                    const oldChild = oldChildren[i];
                    if (oldChild && replayer.mirror.hasNode(oldChild))
                        oldIdToIndex[replayer.mirror.getId(oldChild)] = i;
                }
            }
            indexInOld = oldIdToIndex[rrnodeMirror.getId(newStartNode)];
            if (indexInOld) {
                const nodeToMove = oldChildren[indexInOld];
                parentNode.insertBefore(nodeToMove, oldStartNode);
                diff(nodeToMove, newStartNode, replayer, rrnodeMirror);
                oldChildren[indexInOld] = undefined;
            }
            else {
                const newNode = createOrGetNode(newStartNode, replayer.mirror, rrnodeMirror);
                if (parentNode.nodeName === '#document' &&
                    ((_a = replayer.mirror.getMeta(newNode)) === null || _a === void 0 ? void 0 : _a.type) === NodeType$1.Element &&
                    parentNode.documentElement) {
                    parentNode.removeChild(parentNode.documentElement);
                    oldChildren[oldStartIndex] = undefined;
                    oldStartNode = undefined;
                }
                parentNode.insertBefore(newNode, oldStartNode || null);
                diff(newNode, newStartNode, replayer, rrnodeMirror);
            }
            newStartNode = newChildren[++newStartIndex];
        }
    }
    if (oldStartIndex > oldEndIndex) {
        const referenceRRNode = newChildren[newEndIndex + 1];
        let referenceNode = null;
        if (referenceRRNode)
            parentNode.childNodes.forEach((child) => {
                if (replayer.mirror.getId(child) === rrnodeMirror.getId(referenceRRNode))
                    referenceNode = child;
            });
        for (; newStartIndex <= newEndIndex; ++newStartIndex) {
            const newNode = createOrGetNode(newChildren[newStartIndex], replayer.mirror, rrnodeMirror);
            parentNode.insertBefore(newNode, referenceNode);
            diff(newNode, newChildren[newStartIndex], replayer, rrnodeMirror);
        }
    }
    else if (newStartIndex > newEndIndex) {
        for (; oldStartIndex <= oldEndIndex; oldStartIndex++) {
            const node = oldChildren[oldStartIndex];
            if (node) {
                parentNode.removeChild(node);
                replayer.mirror.removeNodeFromMap(node);
            }
        }
    }
}
function createOrGetNode(rrNode, domMirror, rrnodeMirror) {
    const nodeId = rrnodeMirror.getId(rrNode);
    const sn = rrnodeMirror.getMeta(rrNode);
    let node = null;
    if (nodeId > -1)
        node = domMirror.getNode(nodeId);
    if (node !== null)
        return node;
    switch (rrNode.RRNodeType) {
        case NodeType$1.Document:
            node = new Document();
            break;
        case NodeType$1.DocumentType:
            node = document.implementation.createDocumentType(rrNode.name, rrNode.publicId, rrNode.systemId);
            break;
        case NodeType$1.Element: {
            let tagName = rrNode.tagName.toLowerCase();
            tagName = SVGTagMap[tagName] || tagName;
            if (sn && 'isSVG' in sn && (sn === null || sn === void 0 ? void 0 : sn.isSVG)) {
                node = document.createElementNS(NAMESPACES['svg'], tagName);
            }
            else
                node = document.createElement(rrNode.tagName);
            break;
        }
        case NodeType$1.Text:
            node = document.createTextNode(rrNode.data);
            break;
        case NodeType$1.Comment:
            node = document.createComment(rrNode.data);
            break;
        case NodeType$1.CDATA:
            node = document.createCDATASection(rrNode.data);
            break;
    }
    if (sn)
        domMirror.add(node, Object.assign({}, sn));
    return node;
}

class RRDocument extends BaseRRDocumentImpl(BaseRRNode) {
    constructor(mirror) {
        super();
        this.UNSERIALIZED_STARTING_ID = -2;
        this._unserializedId = this.UNSERIALIZED_STARTING_ID;
        this.mirror = createMirror();
        this.scrollData = null;
        if (mirror) {
            this.mirror = mirror;
        }
    }
    get unserializedId() {
        return this._unserializedId--;
    }
    createDocument(_namespace, _qualifiedName, _doctype) {
        return new RRDocument();
    }
    createDocumentType(qualifiedName, publicId, systemId) {
        const documentTypeNode = new RRDocumentType(qualifiedName, publicId, systemId);
        documentTypeNode.ownerDocument = this;
        return documentTypeNode;
    }
    createElement(tagName) {
        const upperTagName = tagName.toUpperCase();
        let element;
        switch (upperTagName) {
            case 'AUDIO':
            case 'VIDEO':
                element = new RRMediaElement(upperTagName);
                break;
            case 'IFRAME':
                element = new RRIFrameElement(upperTagName, this.mirror);
                break;
            case 'CANVAS':
                element = new RRCanvasElement(upperTagName);
                break;
            case 'STYLE':
                element = new RRStyleElement(upperTagName);
                break;
            default:
                element = new RRElement(upperTagName);
                break;
        }
        element.ownerDocument = this;
        return element;
    }
    createComment(data) {
        const commentNode = new RRComment(data);
        commentNode.ownerDocument = this;
        return commentNode;
    }
    createCDATASection(data) {
        const sectionNode = new RRCDATASection(data);
        sectionNode.ownerDocument = this;
        return sectionNode;
    }
    createTextNode(data) {
        const textNode = new RRText(data);
        textNode.ownerDocument = this;
        return textNode;
    }
    destroyTree() {
        this.childNodes = [];
        this.mirror.reset();
    }
    open() {
        super.open();
        this._unserializedId = this.UNSERIALIZED_STARTING_ID;
    }
}
const RRDocumentType = BaseRRDocumentTypeImpl(BaseRRNode);
class RRElement extends BaseRRElementImpl(BaseRRNode) {
    constructor() {
        super(...arguments);
        this.inputData = null;
        this.scrollData = null;
    }
}
class RRMediaElement extends BaseRRMediaElementImpl(RRElement) {
}
class RRCanvasElement extends RRElement {
    constructor() {
        super(...arguments);
        this.rr_dataURL = null;
        this.canvasMutations = [];
    }
    getContext() {
        return null;
    }
}
class RRStyleElement extends RRElement {
    constructor() {
        super(...arguments);
        this.rules = [];
    }
}
class RRIFrameElement extends RRElement {
    constructor(upperTagName, mirror) {
        super(upperTagName);
        this.contentDocument = new RRDocument();
        this.contentDocument.mirror = mirror;
    }
}
const RRText = BaseRRTextImpl(BaseRRNode);
const RRComment = BaseRRCommentImpl(BaseRRNode);
const RRCDATASection = BaseRRCDATASectionImpl(BaseRRNode);
function getValidTagName(element) {
    if (element instanceof HTMLFormElement) {
        return 'FORM';
    }
    return element.tagName.toUpperCase();
}
function buildFromNode(node, rrdom, domMirror, parentRRNode) {
    let rrNode;
    switch (node.nodeType) {
        case NodeType.DOCUMENT_NODE:
            if (parentRRNode && parentRRNode.nodeName === 'IFRAME')
                rrNode = parentRRNode.contentDocument;
            else {
                rrNode = rrdom;
                rrNode.compatMode = node.compatMode;
            }
            break;
        case NodeType.DOCUMENT_TYPE_NODE: {
            const documentType = node;
            rrNode = rrdom.createDocumentType(documentType.name, documentType.publicId, documentType.systemId);
            break;
        }
        case NodeType.ELEMENT_NODE: {
            const elementNode = node;
            const tagName = getValidTagName(elementNode);
            rrNode = rrdom.createElement(tagName);
            const rrElement = rrNode;
            for (const { name, value } of Array.from(elementNode.attributes)) {
                rrElement.attributes[name] = value;
            }
            elementNode.scrollLeft && (rrElement.scrollLeft = elementNode.scrollLeft);
            elementNode.scrollTop && (rrElement.scrollTop = elementNode.scrollTop);
            break;
        }
        case NodeType.TEXT_NODE:
            rrNode = rrdom.createTextNode(node.textContent || '');
            break;
        case NodeType.CDATA_SECTION_NODE:
            rrNode = rrdom.createCDATASection(node.data);
            break;
        case NodeType.COMMENT_NODE:
            rrNode = rrdom.createComment(node.textContent || '');
            break;
        case NodeType.DOCUMENT_FRAGMENT_NODE:
            rrNode = parentRRNode.attachShadow({ mode: 'open' });
            break;
        default:
            return null;
    }
    let sn = domMirror.getMeta(node);
    if (rrdom instanceof RRDocument) {
        if (!sn) {
            sn = getDefaultSN(rrNode, rrdom.unserializedId);
            domMirror.add(node, sn);
        }
        rrdom.mirror.add(rrNode, Object.assign({}, sn));
    }
    return rrNode;
}
function buildFromDom(dom, domMirror = createMirror$1(), rrdom = new RRDocument()) {
    function walk(node, parentRRNode) {
        const rrNode = buildFromNode(node, rrdom, domMirror, parentRRNode);
        if (rrNode === null)
            return;
        if ((parentRRNode === null || parentRRNode === void 0 ? void 0 : parentRRNode.nodeName) !== 'IFRAME' &&
            node.nodeType !== NodeType.DOCUMENT_FRAGMENT_NODE) {
            parentRRNode === null || parentRRNode === void 0 ? void 0 : parentRRNode.appendChild(rrNode);
            rrNode.parentNode = parentRRNode;
            rrNode.parentElement = parentRRNode;
        }
        if (node.nodeName === 'IFRAME') {
            const iframeDoc = node.contentDocument;
            iframeDoc && walk(iframeDoc, rrNode);
        }
        else if (node.nodeType === NodeType.DOCUMENT_NODE ||
            node.nodeType === NodeType.ELEMENT_NODE ||
            node.nodeType === NodeType.DOCUMENT_FRAGMENT_NODE) {
            if (node.nodeType === NodeType.ELEMENT_NODE &&
                node.shadowRoot)
                walk(node.shadowRoot, rrNode);
            node.childNodes.forEach((childNode) => walk(childNode, rrNode));
        }
    }
    walk(dom, null);
    return rrdom;
}
function createMirror() {
    return new Mirror();
}
class Mirror {
    constructor() {
        this.idNodeMap = new Map();
        this.nodeMetaMap = new WeakMap();
    }
    getId(n) {
        var _a;
        if (!n)
            return -1;
        const id = (_a = this.getMeta(n)) === null || _a === void 0 ? void 0 : _a.id;
        return id !== null && id !== void 0 ? id : -1;
    }
    getNode(id) {
        return this.idNodeMap.get(id) || null;
    }
    getIds() {
        return Array.from(this.idNodeMap.keys());
    }
    getMeta(n) {
        return this.nodeMetaMap.get(n) || null;
    }
    removeNodeFromMap(n) {
        const id = this.getId(n);
        this.idNodeMap.delete(id);
        if (n.childNodes) {
            n.childNodes.forEach((childNode) => this.removeNodeFromMap(childNode));
        }
    }
    has(id) {
        return this.idNodeMap.has(id);
    }
    hasNode(node) {
        return this.nodeMetaMap.has(node);
    }
    add(n, meta) {
        const id = meta.id;
        this.idNodeMap.set(id, n);
        this.nodeMetaMap.set(n, meta);
    }
    replace(id, n) {
        const oldNode = this.getNode(id);
        if (oldNode) {
            const meta = this.nodeMetaMap.get(oldNode);
            if (meta)
                this.nodeMetaMap.set(n, meta);
        }
        this.idNodeMap.set(id, n);
    }
    reset() {
        this.idNodeMap = new Map();
        this.nodeMetaMap = new WeakMap();
    }
}
function getDefaultSN(node, id) {
    switch (node.RRNodeType) {
        case NodeType$1.Document:
            return {
                id,
                type: node.RRNodeType,
                childNodes: [],
            };
        case NodeType$1.DocumentType: {
            const doctype = node;
            return {
                id,
                type: node.RRNodeType,
                name: doctype.name,
                publicId: doctype.publicId,
                systemId: doctype.systemId,
            };
        }
        case NodeType$1.Element:
            return {
                id,
                type: node.RRNodeType,
                tagName: node.tagName.toLowerCase(),
                attributes: {},
                childNodes: [],
            };
        case NodeType$1.Text:
            return {
                id,
                type: node.RRNodeType,
                textContent: node.textContent || '',
            };
        case NodeType$1.Comment:
            return {
                id,
                type: node.RRNodeType,
                textContent: node.textContent || '',
            };
        case NodeType$1.CDATA:
            return {
                id,
                type: node.RRNodeType,
                textContent: '',
            };
    }
}

function mitt$1(n){return {all:n=n||new Map,on:function(t,e){var i=n.get(t);i?i.push(e):n.set(t,[e]);},off:function(t,e){var i=n.get(t);i&&(e?i.splice(i.indexOf(e)>>>0,1):n.set(t,[]));},emit:function(t,e){var i=n.get(t);i&&i.slice().map(function(n){n(e);}),(i=n.get("*"))&&i.slice().map(function(n){n(t,e);});}}}

var mittProxy = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': mitt$1
});

function polyfill$1(w = window, d = document) {
    if ('scrollBehavior' in d.documentElement.style &&
        w.__forceSmoothScrollPolyfill__ !== true) {
        return;
    }
    const Element = w.HTMLElement || w.Element;
    const SCROLL_TIME = 468;
    const original = {
        scroll: w.scroll || w.scrollTo,
        scrollBy: w.scrollBy,
        elementScroll: Element.prototype.scroll || scrollElement,
        scrollIntoView: Element.prototype.scrollIntoView,
    };
    const now = w.performance && w.performance.now
        ? w.performance.now.bind(w.performance)
        : Date.now;
    function isMicrosoftBrowser(userAgent) {
        const userAgentPatterns = ['MSIE ', 'Trident/', 'Edge/'];
        return new RegExp(userAgentPatterns.join('|')).test(userAgent);
    }
    const ROUNDING_TOLERANCE = isMicrosoftBrowser(w.navigator.userAgent) ? 1 : 0;
    function scrollElement(x, y) {
        this.scrollLeft = x;
        this.scrollTop = y;
    }
    function ease(k) {
        return 0.5 * (1 - Math.cos(Math.PI * k));
    }
    function shouldBailOut(firstArg) {
        if (firstArg === null ||
            typeof firstArg !== 'object' ||
            firstArg.behavior === undefined ||
            firstArg.behavior === 'auto' ||
            firstArg.behavior === 'instant') {
            return true;
        }
        if (typeof firstArg === 'object' && firstArg.behavior === 'smooth') {
            return false;
        }
        throw new TypeError('behavior member of ScrollOptions ' +
            firstArg.behavior +
            ' is not a valid value for enumeration ScrollBehavior.');
    }
    function hasScrollableSpace(el, axis) {
        if (axis === 'Y') {
            return el.clientHeight + ROUNDING_TOLERANCE < el.scrollHeight;
        }
        if (axis === 'X') {
            return el.clientWidth + ROUNDING_TOLERANCE < el.scrollWidth;
        }
    }
    function canOverflow(el, axis) {
        const overflowValue = w.getComputedStyle(el, null)['overflow' + axis];
        return overflowValue === 'auto' || overflowValue === 'scroll';
    }
    function isScrollable(el) {
        const isScrollableY = hasScrollableSpace(el, 'Y') && canOverflow(el, 'Y');
        const isScrollableX = hasScrollableSpace(el, 'X') && canOverflow(el, 'X');
        return isScrollableY || isScrollableX;
    }
    function findScrollableParent(el) {
        while (el !== d.body && isScrollable(el) === false) {
            el = el.parentNode || el.host;
        }
        return el;
    }
    function step(context) {
        const time = now();
        let value;
        let currentX;
        let currentY;
        let elapsed = (time - context.startTime) / SCROLL_TIME;
        elapsed = elapsed > 1 ? 1 : elapsed;
        value = ease(elapsed);
        currentX = context.startX + (context.x - context.startX) * value;
        currentY = context.startY + (context.y - context.startY) * value;
        context.method.call(context.scrollable, currentX, currentY);
        if (currentX !== context.x || currentY !== context.y) {
            w.requestAnimationFrame(step.bind(w, context));
        }
    }
    function smoothScroll(el, x, y) {
        let scrollable;
        let startX;
        let startY;
        let method;
        const startTime = now();
        if (el === d.body) {
            scrollable = w;
            startX = w.scrollX || w.pageXOffset;
            startY = w.scrollY || w.pageYOffset;
            method = original.scroll;
        }
        else {
            scrollable = el;
            startX = el.scrollLeft;
            startY = el.scrollTop;
            method = scrollElement;
        }
        step({
            scrollable: scrollable,
            method: method,
            startTime: startTime,
            startX: startX,
            startY: startY,
            x: x,
            y: y,
        });
    }
    w.scroll = w.scrollTo = function () {
        if (arguments[0] === undefined) {
            return;
        }
        if (shouldBailOut(arguments[0]) === true) {
            original.scroll.call(w, arguments[0].left !== undefined
                ? arguments[0].left
                : typeof arguments[0] !== 'object'
                    ? arguments[0]
                    : w.scrollX || w.pageXOffset, arguments[0].top !== undefined
                ? arguments[0].top
                : arguments[1] !== undefined
                    ? arguments[1]
                    : w.scrollY || w.pageYOffset);
            return;
        }
        smoothScroll.call(w, d.body, arguments[0].left !== undefined
            ? ~~arguments[0].left
            : w.scrollX || w.pageXOffset, arguments[0].top !== undefined
            ? ~~arguments[0].top
            : w.scrollY || w.pageYOffset);
    };
    w.scrollBy = function () {
        if (arguments[0] === undefined) {
            return;
        }
        if (shouldBailOut(arguments[0])) {
            original.scrollBy.call(w, arguments[0].left !== undefined
                ? arguments[0].left
                : typeof arguments[0] !== 'object'
                    ? arguments[0]
                    : 0, arguments[0].top !== undefined
                ? arguments[0].top
                : arguments[1] !== undefined
                    ? arguments[1]
                    : 0);
            return;
        }
        smoothScroll.call(w, d.body, ~~arguments[0].left + (w.scrollX || w.pageXOffset), ~~arguments[0].top + (w.scrollY || w.pageYOffset));
    };
    Element.prototype.scroll = Element.prototype.scrollTo = function () {
        if (arguments[0] === undefined) {
            return;
        }
        if (shouldBailOut(arguments[0]) === true) {
            if (typeof arguments[0] === 'number' && arguments[1] === undefined) {
                throw new SyntaxError('Value could not be converted');
            }
            original.elementScroll.call(this, arguments[0].left !== undefined
                ? ~~arguments[0].left
                : typeof arguments[0] !== 'object'
                    ? ~~arguments[0]
                    : this.scrollLeft, arguments[0].top !== undefined
                ? ~~arguments[0].top
                : arguments[1] !== undefined
                    ? ~~arguments[1]
                    : this.scrollTop);
            return;
        }
        const left = arguments[0].left;
        const top = arguments[0].top;
        smoothScroll.call(this, this, typeof left === 'undefined' ? this.scrollLeft : ~~left, typeof top === 'undefined' ? this.scrollTop : ~~top);
    };
    Element.prototype.scrollBy = function () {
        if (arguments[0] === undefined) {
            return;
        }
        if (shouldBailOut(arguments[0]) === true) {
            original.elementScroll.call(this, arguments[0].left !== undefined
                ? ~~arguments[0].left + this.scrollLeft
                : ~~arguments[0] + this.scrollLeft, arguments[0].top !== undefined
                ? ~~arguments[0].top + this.scrollTop
                : ~~arguments[1] + this.scrollTop);
            return;
        }
        this.scroll({
            left: ~~arguments[0].left + this.scrollLeft,
            top: ~~arguments[0].top + this.scrollTop,
            behavior: arguments[0].behavior,
        });
    };
    Element.prototype.scrollIntoView = function () {
        if (shouldBailOut(arguments[0]) === true) {
            original.scrollIntoView.call(this, arguments[0] === undefined ? true : arguments[0]);
            return;
        }
        const scrollableParent = findScrollableParent(this);
        const parentRects = scrollableParent.getBoundingClientRect();
        const clientRects = this.getBoundingClientRect();
        if (scrollableParent !== d.body) {
            smoothScroll.call(this, scrollableParent, scrollableParent.scrollLeft + clientRects.left - parentRects.left, scrollableParent.scrollTop + clientRects.top - parentRects.top);
            if (w.getComputedStyle(scrollableParent).position !== 'fixed') {
                w.scrollBy({
                    left: parentRects.left,
                    top: parentRects.top,
                    behavior: 'smooth',
                });
            }
        }
        else {
            w.scrollBy({
                left: clientRects.left,
                top: clientRects.top,
                behavior: 'smooth',
            });
        }
    };
}

var EventType = /* @__PURE__ */ ((EventType2) => {
  EventType2[EventType2["DomContentLoaded"] = 0] = "DomContentLoaded";
  EventType2[EventType2["Load"] = 1] = "Load";
  EventType2[EventType2["FullSnapshot"] = 2] = "FullSnapshot";
  EventType2[EventType2["IncrementalSnapshot"] = 3] = "IncrementalSnapshot";
  EventType2[EventType2["Meta"] = 4] = "Meta";
  EventType2[EventType2["Custom"] = 5] = "Custom";
  EventType2[EventType2["Plugin"] = 6] = "Plugin";
  return EventType2;
})(EventType || {});
var IncrementalSource = /* @__PURE__ */ ((IncrementalSource2) => {
  IncrementalSource2[IncrementalSource2["Mutation"] = 0] = "Mutation";
  IncrementalSource2[IncrementalSource2["MouseMove"] = 1] = "MouseMove";
  IncrementalSource2[IncrementalSource2["MouseInteraction"] = 2] = "MouseInteraction";
  IncrementalSource2[IncrementalSource2["Scroll"] = 3] = "Scroll";
  IncrementalSource2[IncrementalSource2["ViewportResize"] = 4] = "ViewportResize";
  IncrementalSource2[IncrementalSource2["Input"] = 5] = "Input";
  IncrementalSource2[IncrementalSource2["TouchMove"] = 6] = "TouchMove";
  IncrementalSource2[IncrementalSource2["MediaInteraction"] = 7] = "MediaInteraction";
  IncrementalSource2[IncrementalSource2["StyleSheetRule"] = 8] = "StyleSheetRule";
  IncrementalSource2[IncrementalSource2["CanvasMutation"] = 9] = "CanvasMutation";
  IncrementalSource2[IncrementalSource2["Font"] = 10] = "Font";
  IncrementalSource2[IncrementalSource2["Log"] = 11] = "Log";
  IncrementalSource2[IncrementalSource2["Drag"] = 12] = "Drag";
  IncrementalSource2[IncrementalSource2["StyleDeclaration"] = 13] = "StyleDeclaration";
  IncrementalSource2[IncrementalSource2["Selection"] = 14] = "Selection";
  IncrementalSource2[IncrementalSource2["AdoptedStyleSheet"] = 15] = "AdoptedStyleSheet";
  return IncrementalSource2;
})(IncrementalSource || {});
var MouseInteractions = /* @__PURE__ */ ((MouseInteractions2) => {
  MouseInteractions2[MouseInteractions2["MouseUp"] = 0] = "MouseUp";
  MouseInteractions2[MouseInteractions2["MouseDown"] = 1] = "MouseDown";
  MouseInteractions2[MouseInteractions2["Click"] = 2] = "Click";
  MouseInteractions2[MouseInteractions2["ContextMenu"] = 3] = "ContextMenu";
  MouseInteractions2[MouseInteractions2["DblClick"] = 4] = "DblClick";
  MouseInteractions2[MouseInteractions2["Focus"] = 5] = "Focus";
  MouseInteractions2[MouseInteractions2["Blur"] = 6] = "Blur";
  MouseInteractions2[MouseInteractions2["TouchStart"] = 7] = "TouchStart";
  MouseInteractions2[MouseInteractions2["TouchMove_Departed"] = 8] = "TouchMove_Departed";
  MouseInteractions2[MouseInteractions2["TouchEnd"] = 9] = "TouchEnd";
  MouseInteractions2[MouseInteractions2["TouchCancel"] = 10] = "TouchCancel";
  return MouseInteractions2;
})(MouseInteractions || {});
var CanvasContext = /* @__PURE__ */ ((CanvasContext2) => {
  CanvasContext2[CanvasContext2["2D"] = 0] = "2D";
  CanvasContext2[CanvasContext2["WebGL"] = 1] = "WebGL";
  CanvasContext2[CanvasContext2["WebGL2"] = 2] = "WebGL2";
  return CanvasContext2;
})(CanvasContext || {});
var ReplayerEvents = /* @__PURE__ */ ((ReplayerEvents2) => {
  ReplayerEvents2["Start"] = "start";
  ReplayerEvents2["Pause"] = "pause";
  ReplayerEvents2["Resume"] = "resume";
  ReplayerEvents2["Resize"] = "resize";
  ReplayerEvents2["Finish"] = "finish";
  ReplayerEvents2["FullsnapshotRebuilded"] = "fullsnapshot-rebuilded";
  ReplayerEvents2["LoadStylesheetStart"] = "load-stylesheet-start";
  ReplayerEvents2["LoadStylesheetEnd"] = "load-stylesheet-end";
  ReplayerEvents2["SkipStart"] = "skip-start";
  ReplayerEvents2["SkipEnd"] = "skip-end";
  ReplayerEvents2["MouseInteraction"] = "mouse-interaction";
  ReplayerEvents2["EventCast"] = "event-cast";
  ReplayerEvents2["CustomEvent"] = "custom-event";
  ReplayerEvents2["Flush"] = "flush";
  ReplayerEvents2["StateChange"] = "state-change";
  ReplayerEvents2["PlayBack"] = "play-back";
  ReplayerEvents2["Destroy"] = "destroy";
  return ReplayerEvents2;
})(ReplayerEvents || {});

class Timer {
    constructor(actions = [], config) {
        this.timeOffset = 0;
        this.raf = null;
        this.actions = actions;
        this.speed = config.speed;
        this.liveMode = config.liveMode;
    }
    addAction(action) {
        if (!this.actions.length ||
            this.actions[this.actions.length - 1].delay <= action.delay) {
            this.actions.push(action);
            return;
        }
        const index = this.findActionIndex(action);
        this.actions.splice(index, 0, action);
    }
    start() {
        this.timeOffset = 0;
        let lastTimestamp = performance.now();
        const check = () => {
            const time = performance.now();
            this.timeOffset += (time - lastTimestamp) * this.speed;
            lastTimestamp = time;
            while (this.actions.length) {
                const action = this.actions[0];
                if (this.timeOffset >= action.delay) {
                    this.actions.shift();
                    action.doAction();
                }
                else {
                    break;
                }
            }
            if (this.actions.length > 0 || this.liveMode) {
                this.raf = requestAnimationFrame(check);
            }
        };
        this.raf = requestAnimationFrame(check);
    }
    clear() {
        if (this.raf) {
            cancelAnimationFrame(this.raf);
            this.raf = null;
        }
        this.actions.length = 0;
    }
    setSpeed(speed) {
        this.speed = speed;
    }
    toggleLiveMode(mode) {
        this.liveMode = mode;
    }
    isActive() {
        return this.raf !== null;
    }
    findActionIndex(action) {
        let start = 0;
        let end = this.actions.length - 1;
        while (start <= end) {
            const mid = Math.floor((start + end) / 2);
            if (this.actions[mid].delay < action.delay) {
                start = mid + 1;
            }
            else if (this.actions[mid].delay > action.delay) {
                end = mid - 1;
            }
            else {
                return mid + 1;
            }
        }
        return start;
    }
}
function addDelay(event, baselineTime) {
    if (event.type === EventType.IncrementalSnapshot &&
        event.data.source === IncrementalSource.MouseMove &&
        event.data.positions &&
        event.data.positions.length) {
        const firstOffset = event.data.positions[0].timeOffset;
        const firstTimestamp = event.timestamp + firstOffset;
        event.delay = firstTimestamp - baselineTime;
        return firstTimestamp - baselineTime;
    }
    event.delay = event.timestamp - baselineTime;
    return event.delay;
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function t(t,n){var e="function"==typeof Symbol&&t[Symbol.iterator];if(!e)return t;var r,o,i=e.call(t),a=[];try{for(;(void 0===n||n-- >0)&&!(r=i.next()).done;)a.push(r.value);}catch(t){o={error:t};}finally{try{r&&!r.done&&(e=i.return)&&e.call(i);}finally{if(o)throw o.error}}return a}var n;!function(t){t[t.NotStarted=0]="NotStarted",t[t.Running=1]="Running",t[t.Stopped=2]="Stopped";}(n||(n={}));var e={type:"xstate.init"};function r(t){return void 0===t?[]:[].concat(t)}function o(t){return {type:"xstate.assign",assignment:t}}function i$1(t,n){return "string"==typeof(t="string"==typeof t&&n&&n[t]?n[t]:t)?{type:t}:"function"==typeof t?{type:t.name,exec:t}:t}function a(t){return function(n){return t===n}}function u(t){return "string"==typeof t?{type:t}:t}function c(t,n){return {value:t,context:n,actions:[],changed:!1,matches:a(t)}}function f(t,n,e){var r=n,o=!1;return [t.filter((function(t){if("xstate.assign"===t.type){o=!0;var n=Object.assign({},r);return "function"==typeof t.assignment?n=t.assignment(r,e):Object.keys(t.assignment).forEach((function(o){n[o]="function"==typeof t.assignment[o]?t.assignment[o](r,e):t.assignment[o];})),r=n,!1}return !0})),r,o]}function s(n,o){void 0===o&&(o={});var s=t(f(r(n.states[n.initial].entry).map((function(t){return i$1(t,o.actions)})),n.context,e),2),l=s[0],v=s[1],y={config:n,_options:o,initialState:{value:n.initial,actions:l,context:v,matches:a(n.initial)},transition:function(e,o){var s,l,v="string"==typeof e?{value:e,context:n.context}:e,p=v.value,g=v.context,d=u(o),x=n.states[p];if(x.on){var m=r(x.on[d.type]);try{for(var h=function(t){var n="function"==typeof Symbol&&Symbol.iterator,e=n&&t[n],r=0;if(e)return e.call(t);if(t&&"number"==typeof t.length)return {next:function(){return t&&r>=t.length&&(t=void 0),{value:t&&t[r++],done:!t}}};throw new TypeError(n?"Object is not iterable.":"Symbol.iterator is not defined.")}(m),b=h.next();!b.done;b=h.next()){var S=b.value;if(void 0===S)return c(p,g);var w="string"==typeof S?{target:S}:S,j=w.target,E=w.actions,R=void 0===E?[]:E,N=w.cond,O=void 0===N?function(){return !0}:N,_=void 0===j,k=null!=j?j:p,T=n.states[k];if(O(g,d)){var q=t(f((_?r(R):[].concat(x.exit,R,T.entry).filter((function(t){return t}))).map((function(t){return i$1(t,y._options.actions)})),g,d),3),z=q[0],A=q[1],B=q[2],C=null!=j?j:p;return {value:C,context:A,actions:z,changed:j!==p||z.length>0||B,matches:a(C)}}}}catch(t){s={error:t};}finally{try{b&&!b.done&&(l=h.return)&&l.call(h);}finally{if(s)throw s.error}}}return c(p,g)}};return y}var l=function(t,n){return t.actions.forEach((function(e){var r=e.exec;return r&&r(t.context,n)}))};function v(t){var r=t.initialState,o=n.NotStarted,i=new Set,c={_machine:t,send:function(e){o===n.Running&&(r=t.transition(r,e),l(r,u(e)),i.forEach((function(t){return t(r)})));},subscribe:function(t){return i.add(t),t(r),{unsubscribe:function(){return i.delete(t)}}},start:function(i){if(i){var u="object"==typeof i?i:{context:t.config.context,value:i};r={value:u.value,actions:[],context:u.context,matches:a(u.value)};}return o=n.Running,l(r,e),c},stop:function(){return o=n.Stopped,i.clear(),c},get state(){return r},get status(){return o}};return c}

function discardPriorSnapshots(events, baselineTime) {
    for (let idx = events.length - 1; idx >= 0; idx--) {
        const event = events[idx];
        if (event.type === EventType.Meta) {
            if (event.timestamp <= baselineTime) {
                return events.slice(idx);
            }
        }
    }
    return events;
}
function createPlayerService(context, { getCastFn, applyEventsSynchronously, emitter }) {
    const playerMachine = s({
        id: 'player',
        context,
        initial: 'paused',
        states: {
            playing: {
                on: {
                    PAUSE: {
                        target: 'paused',
                        actions: ['pause'],
                    },
                    CAST_EVENT: {
                        target: 'playing',
                        actions: 'castEvent',
                    },
                    END: {
                        target: 'paused',
                        actions: ['resetLastPlayedEvent', 'pause'],
                    },
                    ADD_EVENT: {
                        target: 'playing',
                        actions: ['addEvent'],
                    },
                },
            },
            paused: {
                on: {
                    PLAY: {
                        target: 'playing',
                        actions: ['recordTimeOffset', 'play'],
                    },
                    CAST_EVENT: {
                        target: 'paused',
                        actions: 'castEvent',
                    },
                    TO_LIVE: {
                        target: 'live',
                        actions: ['startLive'],
                    },
                    ADD_EVENT: {
                        target: 'paused',
                        actions: ['addEvent'],
                    },
                },
            },
            live: {
                on: {
                    ADD_EVENT: {
                        target: 'live',
                        actions: ['addEvent'],
                    },
                    CAST_EVENT: {
                        target: 'live',
                        actions: ['castEvent'],
                    },
                },
            },
        },
    }, {
        actions: {
            castEvent: o({
                lastPlayedEvent: (ctx, event) => {
                    if (event.type === 'CAST_EVENT') {
                        return event.payload.event;
                    }
                    return ctx.lastPlayedEvent;
                },
            }),
            recordTimeOffset: o((ctx, event) => {
                let timeOffset = ctx.timeOffset;
                if ('payload' in event && 'timeOffset' in event.payload) {
                    timeOffset = event.payload.timeOffset;
                }
                return Object.assign(Object.assign({}, ctx), { timeOffset, baselineTime: ctx.events[0].timestamp + timeOffset });
            }),
            play(ctx) {
                var _a;
                const { timer, events, baselineTime, lastPlayedEvent } = ctx;
                timer.clear();
                for (const event of events) {
                    addDelay(event, baselineTime);
                }
                const neededEvents = discardPriorSnapshots(events, baselineTime);
                let lastPlayedTimestamp = lastPlayedEvent === null || lastPlayedEvent === void 0 ? void 0 : lastPlayedEvent.timestamp;
                if ((lastPlayedEvent === null || lastPlayedEvent === void 0 ? void 0 : lastPlayedEvent.type) === EventType.IncrementalSnapshot &&
                    lastPlayedEvent.data.source === IncrementalSource.MouseMove) {
                    lastPlayedTimestamp =
                        lastPlayedEvent.timestamp +
                            ((_a = lastPlayedEvent.data.positions[0]) === null || _a === void 0 ? void 0 : _a.timeOffset);
                }
                if (baselineTime < (lastPlayedTimestamp || 0)) {
                    emitter.emit(ReplayerEvents.PlayBack);
                }
                const syncEvents = new Array();
                for (const event of neededEvents) {
                    if (lastPlayedTimestamp &&
                        lastPlayedTimestamp < baselineTime &&
                        (event.timestamp <= lastPlayedTimestamp ||
                            event === lastPlayedEvent)) {
                        continue;
                    }
                    if (event.timestamp < baselineTime) {
                        syncEvents.push(event);
                    }
                    else {
                        const castFn = getCastFn(event, false);
                        timer.addAction({
                            doAction: () => {
                                castFn();
                            },
                            delay: event.delay,
                        });
                    }
                }
                applyEventsSynchronously(syncEvents);
                emitter.emit(ReplayerEvents.Flush);
                timer.start();
            },
            pause(ctx) {
                ctx.timer.clear();
            },
            resetLastPlayedEvent: o((ctx) => {
                return Object.assign(Object.assign({}, ctx), { lastPlayedEvent: null });
            }),
            startLive: o({
                baselineTime: (ctx, event) => {
                    ctx.timer.toggleLiveMode(true);
                    ctx.timer.start();
                    if (event.type === 'TO_LIVE' && event.payload.baselineTime) {
                        return event.payload.baselineTime;
                    }
                    return Date.now();
                },
            }),
            addEvent: o((ctx, machineEvent) => {
                const { baselineTime, timer, events } = ctx;
                if (machineEvent.type === 'ADD_EVENT') {
                    const { event } = machineEvent.payload;
                    addDelay(event, baselineTime);
                    let end = events.length - 1;
                    if (!events[end] || events[end].timestamp <= event.timestamp) {
                        events.push(event);
                    }
                    else {
                        let insertionIndex = -1;
                        let start = 0;
                        while (start <= end) {
                            const mid = Math.floor((start + end) / 2);
                            if (events[mid].timestamp <= event.timestamp) {
                                start = mid + 1;
                            }
                            else {
                                end = mid - 1;
                            }
                        }
                        if (insertionIndex === -1) {
                            insertionIndex = start;
                        }
                        events.splice(insertionIndex, 0, event);
                    }
                    const isSync = event.timestamp < baselineTime;
                    const castFn = getCastFn(event, isSync);
                    if (isSync) {
                        castFn();
                    }
                    else if (timer.isActive()) {
                        timer.addAction({
                            doAction: () => {
                                castFn();
                            },
                            delay: event.delay,
                        });
                    }
                }
                return Object.assign(Object.assign({}, ctx), { events });
            }),
        },
    });
    return v(playerMachine);
}
function createSpeedService(context) {
    const speedMachine = s({
        id: 'speed',
        context,
        initial: 'normal',
        states: {
            normal: {
                on: {
                    FAST_FORWARD: {
                        target: 'skipping',
                        actions: ['recordSpeed', 'setSpeed'],
                    },
                    SET_SPEED: {
                        target: 'normal',
                        actions: ['setSpeed'],
                    },
                },
            },
            skipping: {
                on: {
                    BACK_TO_NORMAL: {
                        target: 'normal',
                        actions: ['restoreSpeed'],
                    },
                    SET_SPEED: {
                        target: 'normal',
                        actions: ['setSpeed'],
                    },
                },
            },
        },
    }, {
        actions: {
            setSpeed: (ctx, event) => {
                if ('payload' in event) {
                    ctx.timer.setSpeed(event.payload.speed);
                }
            },
            recordSpeed: o({
                normalSpeed: (ctx) => ctx.timer.speed,
            }),
            restoreSpeed: (ctx) => {
                ctx.timer.setSpeed(ctx.normalSpeed);
            },
        },
    });
    return v(speedMachine);
}

const DEPARTED_MIRROR_ACCESS_WARNING = 'Please stop import mirror directly. Instead of that,' +
    '\r\n' +
    'now you can use replayer.getMirror() to access the mirror instance of a replayer,' +
    '\r\n' +
    'or you can use record.mirror to access the mirror instance during recording.';
let _mirror = {
    map: {},
    getId() {
        console.error(DEPARTED_MIRROR_ACCESS_WARNING);
        return -1;
    },
    getNode() {
        console.error(DEPARTED_MIRROR_ACCESS_WARNING);
        return null;
    },
    removeNodeFromMap() {
        console.error(DEPARTED_MIRROR_ACCESS_WARNING);
    },
    has() {
        console.error(DEPARTED_MIRROR_ACCESS_WARNING);
        return false;
    },
    reset() {
        console.error(DEPARTED_MIRROR_ACCESS_WARNING);
    },
};
if (typeof window !== 'undefined' && window.Proxy && window.Reflect) {
    _mirror = new Proxy(_mirror, {
        get(target, prop, receiver) {
            if (prop === 'map') {
                console.error(DEPARTED_MIRROR_ACCESS_WARNING);
            }
            return Reflect.get(target, prop, receiver);
        },
    });
}
function polyfill(win = window) {
    if ('NodeList' in win && !win.NodeList.prototype.forEach) {
        win.NodeList.prototype.forEach = Array.prototype
            .forEach;
    }
    if ('DOMTokenList' in win && !win.DOMTokenList.prototype.forEach) {
        win.DOMTokenList.prototype.forEach = Array.prototype
            .forEach;
    }
    if (!Node.prototype.contains) {
        Node.prototype.contains = (...args) => {
            let node = args[0];
            if (!(0 in args)) {
                throw new TypeError('1 argument is required');
            }
            do {
                if (this === node) {
                    return true;
                }
            } while ((node = node && node.parentNode));
            return false;
        };
    }
}
function queueToResolveTrees(queue) {
    const queueNodeMap = {};
    const putIntoMap = (m, parent) => {
        const nodeInTree = {
            value: m,
            parent,
            children: [],
        };
        queueNodeMap[m.node.id] = nodeInTree;
        return nodeInTree;
    };
    const queueNodeTrees = [];
    for (const mutation of queue) {
        const { nextId, parentId } = mutation;
        if (nextId && nextId in queueNodeMap) {
            const nextInTree = queueNodeMap[nextId];
            if (nextInTree.parent) {
                const idx = nextInTree.parent.children.indexOf(nextInTree);
                nextInTree.parent.children.splice(idx, 0, putIntoMap(mutation, nextInTree.parent));
            }
            else {
                const idx = queueNodeTrees.indexOf(nextInTree);
                queueNodeTrees.splice(idx, 0, putIntoMap(mutation, null));
            }
            continue;
        }
        if (parentId in queueNodeMap) {
            const parentInTree = queueNodeMap[parentId];
            parentInTree.children.push(putIntoMap(mutation, parentInTree));
            continue;
        }
        queueNodeTrees.push(putIntoMap(mutation, null));
    }
    return queueNodeTrees;
}
function iterateResolveTree(tree, cb) {
    cb(tree.value);
    for (let i = tree.children.length - 1; i >= 0; i--) {
        iterateResolveTree(tree.children[i], cb);
    }
}
function isSerializedIframe(n, mirror) {
    return Boolean(n.nodeName === 'IFRAME' && mirror.getMeta(n));
}
function getBaseDimension(node, rootIframe) {
    var _a, _b;
    const frameElement = (_b = (_a = node.ownerDocument) === null || _a === void 0 ? void 0 : _a.defaultView) === null || _b === void 0 ? void 0 : _b.frameElement;
    if (!frameElement || frameElement === rootIframe) {
        return {
            x: 0,
            y: 0,
            relativeScale: 1,
            absoluteScale: 1,
        };
    }
    const frameDimension = frameElement.getBoundingClientRect();
    const frameBaseDimension = getBaseDimension(frameElement, rootIframe);
    const relativeScale = frameDimension.height / frameElement.clientHeight;
    return {
        x: frameDimension.x * frameBaseDimension.relativeScale +
            frameBaseDimension.x,
        y: frameDimension.y * frameBaseDimension.relativeScale +
            frameBaseDimension.y,
        relativeScale,
        absoluteScale: frameBaseDimension.absoluteScale * relativeScale,
    };
}
function hasShadowRoot(n) {
    return Boolean(n === null || n === void 0 ? void 0 : n.shadowRoot);
}
function getNestedRule(rules, position) {
    const rule = rules[position[0]];
    if (position.length === 1) {
        return rule;
    }
    else {
        return getNestedRule(rule.cssRules[position[1]].cssRules, position.slice(2));
    }
}
function getPositionsAndIndex(nestedIndex) {
    const positions = [...nestedIndex];
    const index = positions.pop();
    return { positions, index };
}
function uniqueTextMutations(mutations) {
    const idSet = new Set();
    const uniqueMutations = [];
    for (let i = mutations.length; i--;) {
        const mutation = mutations[i];
        if (!idSet.has(mutation.id)) {
            uniqueMutations.push(mutation);
            idSet.add(mutation.id);
        }
    }
    return uniqueMutations;
}
class StyleSheetMirror {
    constructor() {
        this.id = 1;
        this.styleIDMap = new WeakMap();
        this.idStyleMap = new Map();
    }
    getId(stylesheet) {
        var _a;
        return (_a = this.styleIDMap.get(stylesheet)) !== null && _a !== void 0 ? _a : -1;
    }
    has(stylesheet) {
        return this.styleIDMap.has(stylesheet);
    }
    add(stylesheet, id) {
        if (this.has(stylesheet))
            return this.getId(stylesheet);
        let newId;
        if (id === undefined) {
            newId = this.id++;
        }
        else
            newId = id;
        this.styleIDMap.set(stylesheet, newId);
        this.idStyleMap.set(newId, stylesheet);
        return newId;
    }
    getStyle(id) {
        return this.idStyleMap.get(id) || null;
    }
    reset() {
        this.styleIDMap = new WeakMap();
        this.idStyleMap = new Map();
        this.id = 1;
    }
    generateId() {
        return this.id++;
    }
}

const rules = (blockClass) => [
    `.${blockClass} { background: currentColor }`,
    'noscript { display: none !important; }',
];

/*
 * base64-arraybuffer 1.0.1 <https://github.com/niklasvh/base64-arraybuffer>
 * Copyright (c) 2021 Niklas von Hertzen <https://hertzen.com>
 * Released under MIT License
 */
var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
// Use a lookup table to find the index.
var lookup = typeof Uint8Array === 'undefined' ? [] : new Uint8Array(256);
for (var i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
}
var decode = function (base64) {
    var bufferLength = base64.length * 0.75, len = base64.length, i, p = 0, encoded1, encoded2, encoded3, encoded4;
    if (base64[base64.length - 1] === '=') {
        bufferLength--;
        if (base64[base64.length - 2] === '=') {
            bufferLength--;
        }
    }
    var arraybuffer = new ArrayBuffer(bufferLength), bytes = new Uint8Array(arraybuffer);
    for (i = 0; i < len; i += 4) {
        encoded1 = lookup[base64.charCodeAt(i)];
        encoded2 = lookup[base64.charCodeAt(i + 1)];
        encoded3 = lookup[base64.charCodeAt(i + 2)];
        encoded4 = lookup[base64.charCodeAt(i + 3)];
        bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
        bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
        bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }
    return arraybuffer;
};

const webGLVarMap = new Map();
function variableListFor(ctx, ctor) {
    let contextMap = webGLVarMap.get(ctx);
    if (!contextMap) {
        contextMap = new Map();
        webGLVarMap.set(ctx, contextMap);
    }
    if (!contextMap.has(ctor)) {
        contextMap.set(ctor, []);
    }
    return contextMap.get(ctor);
}
function deserializeArg(imageMap, ctx, preload) {
    return (arg) => __awaiter(this, void 0, void 0, function* () {
        if (arg && typeof arg === 'object' && 'rr_type' in arg) {
            if (preload)
                preload.isUnchanged = false;
            if (arg.rr_type === 'ImageBitmap' && 'args' in arg) {
                const args = yield deserializeArg(imageMap, ctx, preload)(arg.args);
                return yield createImageBitmap.apply(null, args);
            }
            else if ('index' in arg) {
                if (preload || ctx === null)
                    return arg;
                const { rr_type: name, index } = arg;
                return variableListFor(ctx, name)[index];
            }
            else if ('args' in arg) {
                const { rr_type: name, args } = arg;
                const ctor = window[name];
                return new ctor(...(yield Promise.all(args.map(deserializeArg(imageMap, ctx, preload)))));
            }
            else if ('base64' in arg) {
                return decode(arg.base64);
            }
            else if ('src' in arg) {
                const image = imageMap.get(arg.src);
                if (image) {
                    return image;
                }
                else {
                    const image = new Image();
                    image.src = arg.src;
                    imageMap.set(arg.src, image);
                    return image;
                }
            }
            else if ('data' in arg && arg.rr_type === 'Blob') {
                const blobContents = yield Promise.all(arg.data.map(deserializeArg(imageMap, ctx, preload)));
                const blob = new Blob(blobContents, {
                    type: arg.type,
                });
                return blob;
            }
        }
        else if (Array.isArray(arg)) {
            const result = yield Promise.all(arg.map(deserializeArg(imageMap, ctx, preload)));
            return result;
        }
        return arg;
    });
}

function getContext(target, type) {
    try {
        if (type === CanvasContext.WebGL) {
            return (target.getContext('webgl') || target.getContext('experimental-webgl'));
        }
        return target.getContext('webgl2');
    }
    catch (e) {
        return null;
    }
}
const WebGLVariableConstructorsNames = [
    'WebGLActiveInfo',
    'WebGLBuffer',
    'WebGLFramebuffer',
    'WebGLProgram',
    'WebGLRenderbuffer',
    'WebGLShader',
    'WebGLShaderPrecisionFormat',
    'WebGLTexture',
    'WebGLUniformLocation',
    'WebGLVertexArrayObject',
];
function saveToWebGLVarMap(ctx, result) {
    if (!(result === null || result === void 0 ? void 0 : result.constructor))
        return;
    const { name } = result.constructor;
    if (!WebGLVariableConstructorsNames.includes(name))
        return;
    const variables = variableListFor(ctx, name);
    if (!variables.includes(result))
        variables.push(result);
}
function webglMutation({ mutation, target, type, imageMap, errorHandler, }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ctx = getContext(target, type);
            if (!ctx)
                return;
            if (mutation.setter) {
                ctx[mutation.property] = mutation.args[0];
                return;
            }
            const original = ctx[mutation.property];
            const args = yield Promise.all(mutation.args.map(deserializeArg(imageMap, ctx)));
            const result = original.apply(ctx, args);
            saveToWebGLVarMap(ctx, result);
            const debugMode = false;
            if (debugMode) ;
        }
        catch (error) {
            errorHandler(mutation, error);
        }
    });
}

function canvasMutation$1({ event, mutation, target, imageMap, errorHandler, }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ctx = target.getContext('2d');
            if (mutation.setter) {
                ctx[mutation.property] =
                    mutation.args[0];
                return;
            }
            const original = ctx[mutation.property];
            if (mutation.property === 'drawImage' &&
                typeof mutation.args[0] === 'string') {
                imageMap.get(event);
                original.apply(ctx, mutation.args);
            }
            else {
                const args = yield Promise.all(mutation.args.map(deserializeArg(imageMap, ctx)));
                original.apply(ctx, args);
            }
        }
        catch (error) {
            errorHandler(mutation, error);
        }
    });
}

function canvasMutation({ event, mutation, target, imageMap, canvasEventMap, errorHandler, }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const precomputedMutation = canvasEventMap.get(event) || mutation;
            const commands = 'commands' in precomputedMutation
                ? precomputedMutation.commands
                : [precomputedMutation];
            if ([CanvasContext.WebGL, CanvasContext.WebGL2].includes(mutation.type)) {
                for (let i = 0; i < commands.length; i++) {
                    const command = commands[i];
                    yield webglMutation({
                        mutation: command,
                        type: mutation.type,
                        target,
                        imageMap,
                        errorHandler,
                    });
                }
                return;
            }
            for (let i = 0; i < commands.length; i++) {
                const command = commands[i];
                yield canvasMutation$1({
                    event,
                    mutation: command,
                    target,
                    imageMap,
                    errorHandler,
                });
            }
        }
        catch (error) {
            errorHandler(mutation, error);
        }
    });
}

const SKIP_TIME_THRESHOLD = 10 * 1000;
const SKIP_TIME_INTERVAL = 5 * 1000;
const mitt = mitt$1 || mittProxy;
const REPLAY_CONSOLE_PREFIX = '[replayer]';
const defaultMouseTailConfig = {
    duration: 500,
    lineCap: 'round',
    lineWidth: 3,
    strokeStyle: 'red',
};
function indicatesTouchDevice(e) {
    return (e.type == EventType.IncrementalSnapshot &&
        (e.data.source == IncrementalSource.TouchMove ||
            (e.data.source == IncrementalSource.MouseInteraction &&
                e.data.type == MouseInteractions.TouchStart)));
}
class Replayer {
    constructor(events, config) {
        this.usingVirtualDom = false;
        this.virtualDom = new RRDocument();
        this.mouseTail = null;
        this.tailPositions = [];
        this.emitter = mitt();
        this.legacy_missingNodeRetryMap = {};
        this.cache = createCache();
        this.imageMap = new Map();
        this.canvasEventMap = new Map();
        this.mirror = createMirror$2();
        this.styleMirror = new StyleSheetMirror();
        this.firstFullSnapshot = null;
        this.newDocumentQueue = [];
        this.mousePos = null;
        this.touchActive = null;
        this.lastSelectionData = null;
        this.constructedStyleMutations = [];
        this.adoptedStyleSheets = [];
        this.handleResize = (dimension) => {
            this.iframe.style.display = 'inherit';
            for (const el of [this.mouseTail, this.iframe]) {
                if (!el) {
                    continue;
                }
                el.setAttribute('width', String(dimension.width));
                el.setAttribute('height', String(dimension.height));
            }
        };
        this.applyEventsSynchronously = (events) => {
            for (const event of events) {
                switch (event.type) {
                    case EventType.DomContentLoaded:
                    case EventType.Load:
                    case EventType.Custom:
                        continue;
                    case EventType.FullSnapshot:
                    case EventType.Meta:
                    case EventType.Plugin:
                    case EventType.IncrementalSnapshot:
                        break;
                }
                const castFn = this.getCastFn(event, true);
                castFn();
            }
            if (this.touchActive === true) {
                this.mouse.classList.add('touch-active');
            }
            else if (this.touchActive === false) {
                this.mouse.classList.remove('touch-active');
            }
            this.touchActive = null;
        };
        this.getCastFn = (event, isSync = false) => {
            let castFn;
            switch (event.type) {
                case EventType.DomContentLoaded:
                case EventType.Load:
                    break;
                case EventType.Custom:
                    castFn = () => {
                        this.emitter.emit(ReplayerEvents.CustomEvent, event);
                    };
                    break;
                case EventType.Meta:
                    castFn = () => this.emitter.emit(ReplayerEvents.Resize, {
                        width: event.data.width,
                        height: event.data.height,
                    });
                    break;
                case EventType.FullSnapshot:
                    castFn = () => {
                        var _a;
                        if (this.firstFullSnapshot) {
                            if (this.firstFullSnapshot === event) {
                                this.firstFullSnapshot = true;
                                return;
                            }
                        }
                        else {
                            this.firstFullSnapshot = true;
                        }
                        this.rebuildFullSnapshot(event, isSync);
                        (_a = this.iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.scrollTo(event.data.initialOffset);
                        this.styleMirror.reset();
                    };
                    break;
                case EventType.IncrementalSnapshot:
                    castFn = () => {
                        this.applyIncremental(event, isSync);
                        if (isSync) {
                            return;
                        }
                        if (event === this.nextUserInteractionEvent) {
                            this.nextUserInteractionEvent = null;
                            this.backToNormal();
                        }
                        if (this.config.skipInactive && !this.nextUserInteractionEvent) {
                            for (const _event of this.service.state.context.events) {
                                if (_event.timestamp <= event.timestamp) {
                                    continue;
                                }
                                if (this.isUserInteraction(_event)) {
                                    if (_event.delay - event.delay >
                                        SKIP_TIME_THRESHOLD *
                                            this.speedService.state.context.timer.speed) {
                                        this.nextUserInteractionEvent = _event;
                                    }
                                    break;
                                }
                            }
                            if (this.nextUserInteractionEvent) {
                                const skipTime = this.nextUserInteractionEvent.delay - event.delay;
                                const payload = {
                                    speed: Math.min(Math.round(skipTime / SKIP_TIME_INTERVAL), this.config.maxSpeed),
                                };
                                this.speedService.send({ type: 'FAST_FORWARD', payload });
                                this.emitter.emit(ReplayerEvents.SkipStart, payload);
                            }
                        }
                    };
                    break;
            }
            const wrappedCastFn = () => {
                if (castFn) {
                    castFn();
                }
                for (const plugin of this.config.plugins || []) {
                    if (plugin.handler)
                        plugin.handler(event, isSync, { replayer: this });
                }
                this.service.send({ type: 'CAST_EVENT', payload: { event } });
                const last_index = this.service.state.context.events.length - 1;
                if (event === this.service.state.context.events[last_index]) {
                    const finish = () => {
                        if (last_index < this.service.state.context.events.length - 1) {
                            return;
                        }
                        this.backToNormal();
                        this.service.send('END');
                        this.emitter.emit(ReplayerEvents.Finish);
                    };
                    if (event.type === EventType.IncrementalSnapshot &&
                        event.data.source === IncrementalSource.MouseMove &&
                        event.data.positions.length) {
                        setTimeout(() => {
                            finish();
                        }, Math.max(0, -event.data.positions[0].timeOffset + 50));
                    }
                    else {
                        finish();
                    }
                }
                this.emitter.emit(ReplayerEvents.EventCast, event);
            };
            return wrappedCastFn;
        };
        if (!(config === null || config === void 0 ? void 0 : config.liveMode) && events.length < 2) {
            throw new Error('Replayer need at least 2 events.');
        }
        const defaultConfig = {
            speed: 1,
            maxSpeed: 360,
            root: document.body,
            loadTimeout: 0,
            skipInactive: false,
            showWarning: true,
            showDebug: false,
            blockClass: 'rr-block',
            liveMode: false,
            insertStyleRules: [],
            triggerFocus: true,
            UNSAFE_replayCanvas: false,
            pauseAnimation: true,
            mouseTail: defaultMouseTailConfig,
            useVirtualDom: true,
        };
        this.config = Object.assign({}, defaultConfig, config);
        this.handleResize = this.handleResize.bind(this);
        this.getCastFn = this.getCastFn.bind(this);
        this.applyEventsSynchronously = this.applyEventsSynchronously.bind(this);
        this.emitter.on(ReplayerEvents.Resize, this.handleResize);
        this.setupDom();
        for (const plugin of this.config.plugins || []) {
            if (plugin.getMirror)
                plugin.getMirror({ nodeMirror: this.mirror });
        }
        this.emitter.on(ReplayerEvents.Flush, () => {
            if (this.usingVirtualDom) {
                const replayerHandler = {
                    mirror: this.mirror,
                    applyCanvas: (canvasEvent, canvasMutationData, target) => {
                        void canvasMutation({
                            event: canvasEvent,
                            mutation: canvasMutationData,
                            target,
                            imageMap: this.imageMap,
                            canvasEventMap: this.canvasEventMap,
                            errorHandler: this.warnCanvasMutationFailed.bind(this),
                        });
                    },
                    applyInput: this.applyInput.bind(this),
                    applyScroll: this.applyScroll.bind(this),
                    applyStyleSheetMutation: (data, styleSheet) => {
                        if (data.source === IncrementalSource.StyleSheetRule)
                            this.applyStyleSheetRule(data, styleSheet);
                        else if (data.source === IncrementalSource.StyleDeclaration)
                            this.applyStyleDeclaration(data, styleSheet);
                    },
                };
                this.iframe.contentDocument &&
                    diff(this.iframe.contentDocument, this.virtualDom, replayerHandler, this.virtualDom.mirror);
                this.virtualDom.destroyTree();
                this.usingVirtualDom = false;
                if (Object.keys(this.legacy_missingNodeRetryMap).length) {
                    for (const key in this.legacy_missingNodeRetryMap) {
                        try {
                            const value = this.legacy_missingNodeRetryMap[key];
                            const realNode = createOrGetNode(value.node, this.mirror, this.virtualDom.mirror);
                            diff(realNode, value.node, replayerHandler, this.virtualDom.mirror);
                            value.node = realNode;
                        }
                        catch (error) {
                            if (this.config.showWarning) {
                                console.warn(error);
                            }
                        }
                    }
                }
                this.constructedStyleMutations.forEach((data) => {
                    this.applyStyleSheetMutation(data);
                });
                this.constructedStyleMutations = [];
                this.adoptedStyleSheets.forEach((data) => {
                    this.applyAdoptedStyleSheet(data);
                });
                this.adoptedStyleSheets = [];
            }
            if (this.mousePos) {
                this.moveAndHover(this.mousePos.x, this.mousePos.y, this.mousePos.id, true, this.mousePos.debugData);
                this.mousePos = null;
            }
            if (this.lastSelectionData) {
                this.applySelection(this.lastSelectionData);
                this.lastSelectionData = null;
            }
        });
        this.emitter.on(ReplayerEvents.PlayBack, () => {
            this.firstFullSnapshot = null;
            this.mirror.reset();
            this.styleMirror.reset();
        });
        const timer = new Timer([], {
            speed: this.config.speed,
            liveMode: this.config.liveMode,
        });
        this.service = createPlayerService({
            events: events
                .map((e) => {
                if (config && config.unpackFn) {
                    return config.unpackFn(e);
                }
                return e;
            })
                .sort((a1, a2) => a1.timestamp - a2.timestamp),
            timer,
            timeOffset: 0,
            baselineTime: 0,
            lastPlayedEvent: null,
        }, {
            getCastFn: this.getCastFn,
            applyEventsSynchronously: this.applyEventsSynchronously,
            emitter: this.emitter,
        });
        this.service.start();
        this.service.subscribe((state) => {
            this.emitter.emit(ReplayerEvents.StateChange, {
                player: state,
            });
        });
        this.speedService = createSpeedService({
            normalSpeed: -1,
            timer,
        });
        this.speedService.start();
        this.speedService.subscribe((state) => {
            this.emitter.emit(ReplayerEvents.StateChange, {
                speed: state,
            });
        });
        const firstMeta = this.service.state.context.events.find((e) => e.type === EventType.Meta);
        const firstFullsnapshot = this.service.state.context.events.find((e) => e.type === EventType.FullSnapshot);
        if (firstMeta) {
            const { width, height } = firstMeta.data;
            setTimeout(() => {
                this.emitter.emit(ReplayerEvents.Resize, {
                    width,
                    height,
                });
            }, 0);
        }
        if (firstFullsnapshot) {
            setTimeout(() => {
                var _a;
                if (this.firstFullSnapshot) {
                    return;
                }
                this.firstFullSnapshot = firstFullsnapshot;
                this.rebuildFullSnapshot(firstFullsnapshot);
                (_a = this.iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.scrollTo(firstFullsnapshot.data.initialOffset);
            }, 1);
        }
        if (this.service.state.context.events.find(indicatesTouchDevice)) {
            this.mouse.classList.add('touch-device');
        }
    }
    get timer() {
        return this.service.state.context.timer;
    }
    on(event, handler) {
        this.emitter.on(event, handler);
        return this;
    }
    off(event, handler) {
        this.emitter.off(event, handler);
        return this;
    }
    setConfig(config) {
        Object.keys(config).forEach((key) => {
            config[key];
            this.config[key] = config[key];
        });
        if (!this.config.skipInactive) {
            this.backToNormal();
        }
        if (typeof config.speed !== 'undefined') {
            this.speedService.send({
                type: 'SET_SPEED',
                payload: {
                    speed: config.speed,
                },
            });
        }
        if (typeof config.mouseTail !== 'undefined') {
            if (config.mouseTail === false) {
                if (this.mouseTail) {
                    this.mouseTail.style.display = 'none';
                }
            }
            else {
                if (!this.mouseTail) {
                    this.mouseTail = document.createElement('canvas');
                    this.mouseTail.width = Number.parseFloat(this.iframe.width);
                    this.mouseTail.height = Number.parseFloat(this.iframe.height);
                    this.mouseTail.classList.add('replayer-mouse-tail');
                    this.wrapper.insertBefore(this.mouseTail, this.iframe);
                }
                this.mouseTail.style.display = 'inherit';
            }
        }
    }
    getMetaData() {
        const firstEvent = this.service.state.context.events[0];
        const lastEvent = this.service.state.context.events[this.service.state.context.events.length - 1];
        return {
            startTime: firstEvent.timestamp,
            endTime: lastEvent.timestamp,
            totalTime: lastEvent.timestamp - firstEvent.timestamp,
        };
    }
    getCurrentTime() {
        return this.timer.timeOffset + this.getTimeOffset();
    }
    getTimeOffset() {
        const { baselineTime, events } = this.service.state.context;
        return baselineTime - events[0].timestamp;
    }
    getMirror() {
        return this.mirror;
    }
    play(timeOffset = 0) {
        var _a, _b;
        if (this.service.state.matches('paused')) {
            this.service.send({ type: 'PLAY', payload: { timeOffset } });
        }
        else {
            this.service.send({ type: 'PAUSE' });
            this.service.send({ type: 'PLAY', payload: { timeOffset } });
        }
        (_b = (_a = this.iframe.contentDocument) === null || _a === void 0 ? void 0 : _a.getElementsByTagName('html')[0]) === null || _b === void 0 ? void 0 : _b.classList.remove('rrweb-paused');
        this.emitter.emit(ReplayerEvents.Start);
    }
    pause(timeOffset) {
        var _a, _b;
        if (timeOffset === undefined && this.service.state.matches('playing')) {
            this.service.send({ type: 'PAUSE' });
        }
        if (typeof timeOffset === 'number') {
            this.play(timeOffset);
            this.service.send({ type: 'PAUSE' });
        }
        (_b = (_a = this.iframe.contentDocument) === null || _a === void 0 ? void 0 : _a.getElementsByTagName('html')[0]) === null || _b === void 0 ? void 0 : _b.classList.add('rrweb-paused');
        this.emitter.emit(ReplayerEvents.Pause);
    }
    resume(timeOffset = 0) {
        console.warn(`The 'resume' was deprecated in 1.0. Please use 'play' method which has the same interface.`);
        this.play(timeOffset);
        this.emitter.emit(ReplayerEvents.Resume);
    }
    destroy() {
        this.pause();
        this.config.root.removeChild(this.wrapper);
        this.emitter.emit(ReplayerEvents.Destroy);
    }
    startLive(baselineTime) {
        this.service.send({ type: 'TO_LIVE', payload: { baselineTime } });
    }
    addEvent(rawEvent) {
        const event = this.config.unpackFn
            ? this.config.unpackFn(rawEvent)
            : rawEvent;
        if (indicatesTouchDevice(event)) {
            this.mouse.classList.add('touch-device');
        }
        void Promise.resolve().then(() => this.service.send({ type: 'ADD_EVENT', payload: { event } }));
    }
    enableInteract() {
        this.iframe.setAttribute('scrolling', 'auto');
        this.iframe.style.pointerEvents = 'auto';
    }
    disableInteract() {
        this.iframe.setAttribute('scrolling', 'no');
        this.iframe.style.pointerEvents = 'none';
    }
    resetCache() {
        this.cache = createCache();
    }
    setupDom() {
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('replayer-wrapper');
        this.config.root.appendChild(this.wrapper);
        this.mouse = document.createElement('div');
        this.mouse.classList.add('replayer-mouse');
        this.wrapper.appendChild(this.mouse);
        if (this.config.mouseTail !== false) {
            this.mouseTail = document.createElement('canvas');
            this.mouseTail.classList.add('replayer-mouse-tail');
            this.mouseTail.style.display = 'inherit';
            this.wrapper.appendChild(this.mouseTail);
        }
        this.iframe = document.createElement('iframe');
        const attributes = ['allow-same-origin'];
        if (this.config.UNSAFE_replayCanvas) {
            attributes.push('allow-scripts');
        }
        this.iframe.style.display = 'none';
        this.iframe.setAttribute('sandbox', attributes.join(' '));
        this.disableInteract();
        this.wrapper.appendChild(this.iframe);
        if (this.iframe.contentWindow && this.iframe.contentDocument) {
            polyfill$1(this.iframe.contentWindow, this.iframe.contentDocument);
            polyfill(this.iframe.contentWindow);
        }
    }
    rebuildFullSnapshot(event, isSync = false) {
        if (!this.iframe.contentDocument) {
            return console.warn('Looks like your replayer has been destroyed.');
        }
        if (Object.keys(this.legacy_missingNodeRetryMap).length) {
            console.warn('Found unresolved missing node map', this.legacy_missingNodeRetryMap);
        }
        this.legacy_missingNodeRetryMap = {};
        const collected = [];
        const afterAppend = (builtNode, id) => {
            this.collectIframeAndAttachDocument(collected, builtNode);
            for (const plugin of this.config.plugins || []) {
                if (plugin.onBuild)
                    plugin.onBuild(builtNode, {
                        id,
                        replayer: this,
                    });
            }
        };
        rebuild(event.data.node, {
            doc: this.iframe.contentDocument,
            afterAppend,
            cache: this.cache,
            mirror: this.mirror,
        });
        afterAppend(this.iframe.contentDocument, event.data.node.id);
        for (const { mutationInQueue, builtNode } of collected) {
            this.attachDocumentToIframe(mutationInQueue, builtNode);
            this.newDocumentQueue = this.newDocumentQueue.filter((m) => m !== mutationInQueue);
        }
        const { documentElement, head } = this.iframe.contentDocument;
        this.insertStyleRules(documentElement, head);
        if (!this.service.state.matches('playing')) {
            this.iframe.contentDocument
                .getElementsByTagName('html')[0]
                .classList.add('rrweb-paused');
        }
        this.emitter.emit(ReplayerEvents.FullsnapshotRebuilded, event);
        if (!isSync) {
            this.waitForStylesheetLoad();
        }
        if (this.config.UNSAFE_replayCanvas) {
            void this.preloadAllImages();
        }
    }
    insertStyleRules(documentElement, head) {
        var _a;
        const injectStylesRules = rules(this.config.blockClass).concat(this.config.insertStyleRules);
        if (this.config.pauseAnimation) {
            injectStylesRules.push('html.rrweb-paused *, html.rrweb-paused *:before, html.rrweb-paused *:after { animation-play-state: paused !important; }');
        }
        if (this.usingVirtualDom) {
            const styleEl = this.virtualDom.createElement('style');
            this.virtualDom.mirror.add(styleEl, getDefaultSN(styleEl, this.virtualDom.unserializedId));
            documentElement.insertBefore(styleEl, head);
            styleEl.rules.push({
                source: IncrementalSource.StyleSheetRule,
                adds: injectStylesRules.map((cssText, index) => ({
                    rule: cssText,
                    index,
                })),
            });
        }
        else {
            const styleEl = document.createElement('style');
            documentElement.insertBefore(styleEl, head);
            for (let idx = 0; idx < injectStylesRules.length; idx++) {
                (_a = styleEl.sheet) === null || _a === void 0 ? void 0 : _a.insertRule(injectStylesRules[idx], idx);
            }
        }
    }
    attachDocumentToIframe(mutation, iframeEl) {
        const mirror = this.usingVirtualDom
            ? this.virtualDom.mirror
            : this.mirror;
        const collected = [];
        const afterAppend = (builtNode, id) => {
            this.collectIframeAndAttachDocument(collected, builtNode);
            const sn = mirror.getMeta(builtNode);
            if ((sn === null || sn === void 0 ? void 0 : sn.type) === NodeType$2.Element &&
                (sn === null || sn === void 0 ? void 0 : sn.tagName.toUpperCase()) === 'HTML') {
                const { documentElement, head } = iframeEl.contentDocument;
                this.insertStyleRules(documentElement, head);
            }
            for (const plugin of this.config.plugins || []) {
                if (plugin.onBuild)
                    plugin.onBuild(builtNode, {
                        id,
                        replayer: this,
                    });
            }
        };
        buildNodeWithSN(mutation.node, {
            doc: iframeEl.contentDocument,
            mirror: mirror,
            hackCss: true,
            skipChild: false,
            afterAppend,
            cache: this.cache,
        });
        afterAppend(iframeEl.contentDocument, mutation.node.id);
        for (const { mutationInQueue, builtNode } of collected) {
            this.attachDocumentToIframe(mutationInQueue, builtNode);
            this.newDocumentQueue = this.newDocumentQueue.filter((m) => m !== mutationInQueue);
        }
    }
    collectIframeAndAttachDocument(collected, builtNode) {
        if (isSerializedIframe(builtNode, this.mirror)) {
            const mutationInQueue = this.newDocumentQueue.find((m) => m.parentId === this.mirror.getId(builtNode));
            if (mutationInQueue) {
                collected.push({
                    mutationInQueue,
                    builtNode: builtNode,
                });
            }
        }
    }
    waitForStylesheetLoad() {
        var _a;
        const head = (_a = this.iframe.contentDocument) === null || _a === void 0 ? void 0 : _a.head;
        if (head) {
            const unloadSheets = new Set();
            let timer;
            let beforeLoadState = this.service.state;
            const stateHandler = () => {
                beforeLoadState = this.service.state;
            };
            this.emitter.on(ReplayerEvents.Start, stateHandler);
            this.emitter.on(ReplayerEvents.Pause, stateHandler);
            const unsubscribe = () => {
                this.emitter.off(ReplayerEvents.Start, stateHandler);
                this.emitter.off(ReplayerEvents.Pause, stateHandler);
            };
            head
                .querySelectorAll('link[rel="stylesheet"]')
                .forEach((css) => {
                if (!css.sheet) {
                    unloadSheets.add(css);
                    css.addEventListener('load', () => {
                        unloadSheets.delete(css);
                        if (unloadSheets.size === 0 && timer !== -1) {
                            if (beforeLoadState.matches('playing')) {
                                this.play(this.getCurrentTime());
                            }
                            this.emitter.emit(ReplayerEvents.LoadStylesheetEnd);
                            if (timer) {
                                clearTimeout(timer);
                            }
                            unsubscribe();
                        }
                    });
                }
            });
            if (unloadSheets.size > 0) {
                this.service.send({ type: 'PAUSE' });
                this.emitter.emit(ReplayerEvents.LoadStylesheetStart);
                timer = setTimeout(() => {
                    if (beforeLoadState.matches('playing')) {
                        this.play(this.getCurrentTime());
                    }
                    timer = -1;
                    unsubscribe();
                }, this.config.loadTimeout);
            }
        }
    }
    preloadAllImages() {
        return __awaiter(this, void 0, void 0, function* () {
            this.service.state;
            const stateHandler = () => {
                this.service.state;
            };
            this.emitter.on(ReplayerEvents.Start, stateHandler);
            this.emitter.on(ReplayerEvents.Pause, stateHandler);
            const promises = [];
            for (const event of this.service.state.context.events) {
                if (event.type === EventType.IncrementalSnapshot &&
                    event.data.source === IncrementalSource.CanvasMutation) {
                    promises.push(this.deserializeAndPreloadCanvasEvents(event.data, event));
                    const commands = 'commands' in event.data ? event.data.commands : [event.data];
                    commands.forEach((c) => {
                        this.preloadImages(c, event);
                    });
                }
            }
            return Promise.all(promises);
        });
    }
    preloadImages(data, event) {
        if (data.property === 'drawImage' &&
            typeof data.args[0] === 'string' &&
            !this.imageMap.has(event)) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const imgd = ctx === null || ctx === void 0 ? void 0 : ctx.createImageData(canvas.width, canvas.height);
            imgd === null || imgd === void 0 ? void 0 : imgd.data;
            JSON.parse(data.args[0]);
            ctx === null || ctx === void 0 ? void 0 : ctx.putImageData(imgd, 0, 0);
        }
    }
    deserializeAndPreloadCanvasEvents(data, event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.canvasEventMap.has(event)) {
                const status = {
                    isUnchanged: true,
                };
                if ('commands' in data) {
                    const commands = yield Promise.all(data.commands.map((c) => __awaiter(this, void 0, void 0, function* () {
                        const args = yield Promise.all(c.args.map(deserializeArg(this.imageMap, null, status)));
                        return Object.assign(Object.assign({}, c), { args });
                    })));
                    if (status.isUnchanged === false)
                        this.canvasEventMap.set(event, Object.assign(Object.assign({}, data), { commands }));
                }
                else {
                    const args = yield Promise.all(data.args.map(deserializeArg(this.imageMap, null, status)));
                    if (status.isUnchanged === false)
                        this.canvasEventMap.set(event, Object.assign(Object.assign({}, data), { args }));
                }
            }
        });
    }
    applyIncremental(e, isSync) {
        var _a, _b, _c;
        const { data: d } = e;
        switch (d.source) {
            case IncrementalSource.Mutation: {
                try {
                    this.applyMutation(d, isSync);
                }
                catch (error) {
                    this.warn(`Exception in mutation ${error.message || error}`, d);
                }
                break;
            }
            case IncrementalSource.Drag:
            case IncrementalSource.TouchMove:
            case IncrementalSource.MouseMove:
                if (isSync) {
                    const lastPosition = d.positions[d.positions.length - 1];
                    this.mousePos = {
                        x: lastPosition.x,
                        y: lastPosition.y,
                        id: lastPosition.id,
                        debugData: d,
                    };
                }
                else {
                    d.positions.forEach((p) => {
                        const action = {
                            doAction: () => {
                                this.moveAndHover(p.x, p.y, p.id, isSync, d);
                            },
                            delay: p.timeOffset +
                                e.timestamp -
                                this.service.state.context.baselineTime,
                        };
                        this.timer.addAction(action);
                    });
                    this.timer.addAction({
                        doAction() {
                        },
                        delay: e.delay - ((_a = d.positions[0]) === null || _a === void 0 ? void 0 : _a.timeOffset),
                    });
                }
                break;
            case IncrementalSource.MouseInteraction: {
                if (d.id === -1 || isSync) {
                    break;
                }
                const event = new Event(MouseInteractions[d.type].toLowerCase());
                const target = this.mirror.getNode(d.id);
                if (!target) {
                    return this.debugNodeNotFound(d, d.id);
                }
                this.emitter.emit(ReplayerEvents.MouseInteraction, {
                    type: d.type,
                    target,
                });
                const { triggerFocus } = this.config;
                switch (d.type) {
                    case MouseInteractions.Blur:
                        if ('blur' in target) {
                            target.blur();
                        }
                        break;
                    case MouseInteractions.Focus:
                        if (triggerFocus && target.focus) {
                            target.focus({
                                preventScroll: true,
                            });
                        }
                        break;
                    case MouseInteractions.Click:
                    case MouseInteractions.TouchStart:
                    case MouseInteractions.TouchEnd:
                        if (isSync) {
                            if (d.type === MouseInteractions.TouchStart) {
                                this.touchActive = true;
                            }
                            else if (d.type === MouseInteractions.TouchEnd) {
                                this.touchActive = false;
                            }
                            this.mousePos = {
                                x: d.x,
                                y: d.y,
                                id: d.id,
                                debugData: d,
                            };
                        }
                        else {
                            if (d.type === MouseInteractions.TouchStart) {
                                this.tailPositions.length = 0;
                            }
                            this.moveAndHover(d.x, d.y, d.id, isSync, d);
                            if (d.type === MouseInteractions.Click) {
                                this.mouse.classList.remove('active');
                                void this.mouse.offsetWidth;
                                this.mouse.classList.add('active');
                            }
                            else if (d.type === MouseInteractions.TouchStart) {
                                void this.mouse.offsetWidth;
                                this.mouse.classList.add('touch-active');
                            }
                            else if (d.type === MouseInteractions.TouchEnd) {
                                this.mouse.classList.remove('touch-active');
                            }
                        }
                        break;
                    case MouseInteractions.TouchCancel:
                        if (isSync) {
                            this.touchActive = false;
                        }
                        else {
                            this.mouse.classList.remove('touch-active');
                        }
                        break;
                    default:
                        target.dispatchEvent(event);
                }
                break;
            }
            case IncrementalSource.Scroll: {
                if (d.id === -1) {
                    break;
                }
                if (this.usingVirtualDom) {
                    const target = this.virtualDom.mirror.getNode(d.id);
                    if (!target) {
                        return this.debugNodeNotFound(d, d.id);
                    }
                    target.scrollData = d;
                    break;
                }
                this.applyScroll(d, isSync);
                break;
            }
            case IncrementalSource.ViewportResize:
                this.emitter.emit(ReplayerEvents.Resize, {
                    width: d.width,
                    height: d.height,
                });
                break;
            case IncrementalSource.Input: {
                if (d.id === -1) {
                    break;
                }
                if (this.usingVirtualDom) {
                    const target = this.virtualDom.mirror.getNode(d.id);
                    if (!target) {
                        return this.debugNodeNotFound(d, d.id);
                    }
                    target.inputData = d;
                    break;
                }
                this.applyInput(d);
                break;
            }
            case IncrementalSource.MediaInteraction: {
                const target = this.usingVirtualDom
                    ? this.virtualDom.mirror.getNode(d.id)
                    : this.mirror.getNode(d.id);
                if (!target) {
                    return this.debugNodeNotFound(d, d.id);
                }
                const mediaEl = target;
                try {
                    if (d.currentTime) {
                        mediaEl.currentTime = d.currentTime;
                    }
                    if (d.volume) {
                        mediaEl.volume = d.volume;
                    }
                    if (d.muted) {
                        mediaEl.muted = d.muted;
                    }
                    if (d.type === 1) {
                        mediaEl.pause();
                    }
                    if (d.type === 0) {
                        void mediaEl.play();
                    }
                    if (d.type === 4) {
                        mediaEl.playbackRate = d.playbackRate;
                    }
                }
                catch (error) {
                    if (this.config.showWarning) {
                        console.warn(`Failed to replay media interactions: ${error.message || error}`);
                    }
                }
                break;
            }
            case IncrementalSource.StyleSheetRule:
            case IncrementalSource.StyleDeclaration: {
                if (this.usingVirtualDom) {
                    if (d.styleId)
                        this.constructedStyleMutations.push(d);
                    else if (d.id)
                        (_b = this.virtualDom.mirror.getNode(d.id)) === null || _b === void 0 ? void 0 : _b.rules.push(d);
                }
                else
                    this.applyStyleSheetMutation(d);
                break;
            }
            case IncrementalSource.CanvasMutation: {
                if (!this.config.UNSAFE_replayCanvas) {
                    return;
                }
                if (this.usingVirtualDom) {
                    const target = this.virtualDom.mirror.getNode(d.id);
                    if (!target) {
                        return this.debugNodeNotFound(d, d.id);
                    }
                    target.canvasMutations.push({
                        event: e,
                        mutation: d,
                    });
                }
                else {
                    const target = this.mirror.getNode(d.id);
                    if (!target) {
                        return this.debugNodeNotFound(d, d.id);
                    }
                    void canvasMutation({
                        event: e,
                        mutation: d,
                        target: target,
                        imageMap: this.imageMap,
                        canvasEventMap: this.canvasEventMap,
                        errorHandler: this.warnCanvasMutationFailed.bind(this),
                    });
                }
                break;
            }
            case IncrementalSource.Font: {
                try {
                    const fontFace = new FontFace(d.family, d.buffer
                        ? new Uint8Array(JSON.parse(d.fontSource))
                        : d.fontSource, d.descriptors);
                    (_c = this.iframe.contentDocument) === null || _c === void 0 ? void 0 : _c.fonts.add(fontFace);
                }
                catch (error) {
                    if (this.config.showWarning) {
                        console.warn(error);
                    }
                }
                break;
            }
            case IncrementalSource.Selection: {
                if (isSync) {
                    this.lastSelectionData = d;
                    break;
                }
                this.applySelection(d);
                break;
            }
            case IncrementalSource.AdoptedStyleSheet: {
                if (this.usingVirtualDom)
                    this.adoptedStyleSheets.push(d);
                else
                    this.applyAdoptedStyleSheet(d);
                break;
            }
        }
    }
    applyMutation(d, isSync) {
        if (this.config.useVirtualDom && !this.usingVirtualDom && isSync) {
            this.usingVirtualDom = true;
            buildFromDom(this.iframe.contentDocument, this.mirror, this.virtualDom);
            if (Object.keys(this.legacy_missingNodeRetryMap).length) {
                for (const key in this.legacy_missingNodeRetryMap) {
                    try {
                        const value = this.legacy_missingNodeRetryMap[key];
                        const virtualNode = buildFromNode(value.node, this.virtualDom, this.mirror);
                        if (virtualNode)
                            value.node = virtualNode;
                    }
                    catch (error) {
                        if (this.config.showWarning) {
                            console.warn(error);
                        }
                    }
                }
            }
        }
        const mirror = this.usingVirtualDom ? this.virtualDom.mirror : this.mirror;
        d.removes.forEach((mutation) => {
            var _a;
            const target = mirror.getNode(mutation.id);
            if (!target) {
                if (d.removes.find((r) => r.id === mutation.parentId)) {
                    return;
                }
                return this.warnNodeNotFound(d, mutation.id);
            }
            let parent = mirror.getNode(mutation.parentId);
            if (!parent) {
                return this.warnNodeNotFound(d, mutation.parentId);
            }
            if (mutation.isShadow && hasShadowRoot(parent)) {
                parent = parent.shadowRoot;
            }
            mirror.removeNodeFromMap(target);
            if (parent)
                try {
                    parent.removeChild(target);
                    if (this.usingVirtualDom &&
                        target.nodeName === '#text' &&
                        parent.nodeName === 'STYLE' &&
                        ((_a = parent.rules) === null || _a === void 0 ? void 0 : _a.length) > 0)
                        parent.rules = [];
                }
                catch (error) {
                    if (error instanceof DOMException) {
                        this.warn('parent could not remove child in mutation', parent, target, d);
                    }
                    else {
                        throw error;
                    }
                }
        });
        const legacy_missingNodeMap = Object.assign({}, this.legacy_missingNodeRetryMap);
        const queue = [];
        const nextNotInDOM = (mutation) => {
            let next = null;
            if (mutation.nextId) {
                next = mirror.getNode(mutation.nextId);
            }
            if (mutation.nextId !== null &&
                mutation.nextId !== undefined &&
                mutation.nextId !== -1 &&
                !next) {
                return true;
            }
            return false;
        };
        const appendNode = (mutation) => {
            var _a;
            if (!this.iframe.contentDocument) {
                return console.warn('Looks like your replayer has been destroyed.');
            }
            let parent = mirror.getNode(mutation.parentId);
            if (!parent) {
                if (mutation.node.type === NodeType$2.Document) {
                    return this.newDocumentQueue.push(mutation);
                }
                return queue.push(mutation);
            }
            if (mutation.node.isShadow) {
                if (!hasShadowRoot(parent)) {
                    parent.attachShadow({ mode: 'open' });
                    parent = parent.shadowRoot;
                }
                else
                    parent = parent.shadowRoot;
            }
            let previous = null;
            let next = null;
            if (mutation.previousId) {
                previous = mirror.getNode(mutation.previousId);
            }
            if (mutation.nextId) {
                next = mirror.getNode(mutation.nextId);
            }
            if (nextNotInDOM(mutation)) {
                return queue.push(mutation);
            }
            if (mutation.node.rootId && !mirror.getNode(mutation.node.rootId)) {
                return;
            }
            const targetDoc = mutation.node.rootId
                ? mirror.getNode(mutation.node.rootId)
                : this.usingVirtualDom
                    ? this.virtualDom
                    : this.iframe.contentDocument;
            if (isSerializedIframe(parent, mirror)) {
                this.attachDocumentToIframe(mutation, parent);
                return;
            }
            const afterAppend = (node, id) => {
                for (const plugin of this.config.plugins || []) {
                    if (plugin.onBuild)
                        plugin.onBuild(node, { id, replayer: this });
                }
            };
            const target = buildNodeWithSN(mutation.node, {
                doc: targetDoc,
                mirror: mirror,
                skipChild: true,
                hackCss: true,
                cache: this.cache,
                afterAppend,
            });
            if (mutation.previousId === -1 || mutation.nextId === -1) {
                legacy_missingNodeMap[mutation.node.id] = {
                    node: target,
                    mutation,
                };
                return;
            }
            const parentSn = mirror.getMeta(parent);
            if (parentSn &&
                parentSn.type === NodeType$2.Element &&
                parentSn.tagName === 'textarea' &&
                mutation.node.type === NodeType$2.Text) {
                const childNodeArray = Array.isArray(parent.childNodes)
                    ? parent.childNodes
                    : Array.from(parent.childNodes);
                for (const c of childNodeArray) {
                    if (c.nodeType === parent.TEXT_NODE) {
                        parent.removeChild(c);
                    }
                }
            }
            if (previous && previous.nextSibling && previous.nextSibling.parentNode) {
                parent.insertBefore(target, previous.nextSibling);
            }
            else if (next && next.parentNode) {
                parent.contains(next)
                    ? parent.insertBefore(target, next)
                    : parent.insertBefore(target, null);
            }
            else {
                if (parent === targetDoc) {
                    while (targetDoc.firstChild) {
                        targetDoc.removeChild(targetDoc.firstChild);
                    }
                }
                parent.appendChild(target);
            }
            afterAppend(target, mutation.node.id);
            if (this.usingVirtualDom &&
                target.nodeName === '#text' &&
                parent.nodeName === 'STYLE' &&
                ((_a = parent.rules) === null || _a === void 0 ? void 0 : _a.length) > 0)
                parent.rules = [];
            if (isSerializedIframe(target, this.mirror)) {
                const targetId = this.mirror.getId(target);
                const mutationInQueue = this.newDocumentQueue.find((m) => m.parentId === targetId);
                if (mutationInQueue) {
                    this.attachDocumentToIframe(mutationInQueue, target);
                    this.newDocumentQueue = this.newDocumentQueue.filter((m) => m !== mutationInQueue);
                }
            }
            if (mutation.previousId || mutation.nextId) {
                this.legacy_resolveMissingNode(legacy_missingNodeMap, parent, target, mutation);
            }
        };
        d.adds.forEach((mutation) => {
            appendNode(mutation);
        });
        const startTime = Date.now();
        while (queue.length) {
            const resolveTrees = queueToResolveTrees(queue);
            queue.length = 0;
            if (Date.now() - startTime > 500) {
                this.warn('Timeout in the loop, please check the resolve tree data:', resolveTrees);
                break;
            }
            for (const tree of resolveTrees) {
                const parent = mirror.getNode(tree.value.parentId);
                if (!parent) {
                    this.debug('Drop resolve tree since there is no parent for the root node.', tree);
                }
                else {
                    iterateResolveTree(tree, (mutation) => {
                        appendNode(mutation);
                    });
                }
            }
        }
        if (Object.keys(legacy_missingNodeMap).length) {
            Object.assign(this.legacy_missingNodeRetryMap, legacy_missingNodeMap);
        }
        uniqueTextMutations(d.texts).forEach((mutation) => {
            var _a;
            const target = mirror.getNode(mutation.id);
            if (!target) {
                if (d.removes.find((r) => r.id === mutation.id)) {
                    return;
                }
                return this.warnNodeNotFound(d, mutation.id);
            }
            target.textContent = mutation.value;
            if (this.usingVirtualDom) {
                const parent = target.parentNode;
                if (((_a = parent === null || parent === void 0 ? void 0 : parent.rules) === null || _a === void 0 ? void 0 : _a.length) > 0)
                    parent.rules = [];
            }
        });
        d.attributes.forEach((mutation) => {
            const target = mirror.getNode(mutation.id);
            if (!target) {
                if (d.removes.find((r) => r.id === mutation.id)) {
                    return;
                }
                return this.warnNodeNotFound(d, mutation.id);
            }
            for (const attributeName in mutation.attributes) {
                if (typeof attributeName === 'string') {
                    const value = mutation.attributes[attributeName];
                    if (value === null) {
                        target.removeAttribute(attributeName);
                    }
                    else if (typeof value === 'string') {
                        try {
                            if (attributeName === '_cssText' &&
                                (target.nodeName === 'LINK' || target.nodeName === 'STYLE')) {
                                try {
                                    const newSn = mirror.getMeta(target);
                                    Object.assign(newSn.attributes, mutation.attributes);
                                    const newNode = buildNodeWithSN(newSn, {
                                        doc: target.ownerDocument,
                                        mirror: mirror,
                                        skipChild: true,
                                        hackCss: true,
                                        cache: this.cache,
                                    });
                                    const siblingNode = target.nextSibling;
                                    const parentNode = target.parentNode;
                                    if (newNode && parentNode) {
                                        parentNode.removeChild(target);
                                        parentNode.insertBefore(newNode, siblingNode);
                                        mirror.replace(mutation.id, newNode);
                                        break;
                                    }
                                }
                                catch (e) {
                                }
                            }
                            target.setAttribute(attributeName, value);
                        }
                        catch (error) {
                            if (this.config.showWarning) {
                                console.warn('An error occurred may due to the checkout feature.', error);
                            }
                        }
                    }
                    else if (attributeName === 'style') {
                        const styleValues = value;
                        const targetEl = target;
                        for (const s in styleValues) {
                            if (styleValues[s] === false) {
                                targetEl.style.removeProperty(s);
                            }
                            else if (styleValues[s] instanceof Array) {
                                const svp = styleValues[s];
                                targetEl.style.setProperty(s, svp[0], svp[1]);
                            }
                            else {
                                const svs = styleValues[s];
                                targetEl.style.setProperty(s, svs);
                            }
                        }
                    }
                }
            }
        });
    }
    applyScroll(d, isSync) {
        var _a, _b;
        const target = this.mirror.getNode(d.id);
        if (!target) {
            return this.debugNodeNotFound(d, d.id);
        }
        const sn = this.mirror.getMeta(target);
        if (target === this.iframe.contentDocument) {
            (_a = this.iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.scrollTo({
                top: d.y,
                left: d.x,
                behavior: isSync ? 'auto' : 'smooth',
            });
        }
        else if ((sn === null || sn === void 0 ? void 0 : sn.type) === NodeType$2.Document) {
            (_b = target.defaultView) === null || _b === void 0 ? void 0 : _b.scrollTo({
                top: d.y,
                left: d.x,
                behavior: isSync ? 'auto' : 'smooth',
            });
        }
        else {
            try {
                target.scrollTo({
                    top: d.y,
                    left: d.x,
                    behavior: isSync ? 'auto' : 'smooth',
                });
            }
            catch (error) {
            }
        }
    }
    applyInput(d) {
        const target = this.mirror.getNode(d.id);
        if (!target) {
            return this.debugNodeNotFound(d, d.id);
        }
        try {
            target.checked = d.isChecked;
            target.value = d.text;
        }
        catch (error) {
        }
    }
    applySelection(d) {
        try {
            const selectionSet = new Set();
            const ranges = d.ranges.map(({ start, startOffset, end, endOffset }) => {
                const startContainer = this.mirror.getNode(start);
                const endContainer = this.mirror.getNode(end);
                if (!startContainer || !endContainer)
                    return;
                const result = new Range();
                result.setStart(startContainer, startOffset);
                result.setEnd(endContainer, endOffset);
                const doc = startContainer.ownerDocument;
                const selection = doc === null || doc === void 0 ? void 0 : doc.getSelection();
                selection && selectionSet.add(selection);
                return {
                    range: result,
                    selection,
                };
            });
            selectionSet.forEach((s) => s.removeAllRanges());
            ranges.forEach((r) => { var _a; return r && ((_a = r.selection) === null || _a === void 0 ? void 0 : _a.addRange(r.range)); });
        }
        catch (error) {
        }
    }
    applyStyleSheetMutation(data) {
        var _a;
        let styleSheet = null;
        if (data.styleId)
            styleSheet = this.styleMirror.getStyle(data.styleId);
        else if (data.id)
            styleSheet =
                ((_a = this.mirror.getNode(data.id)) === null || _a === void 0 ? void 0 : _a.sheet) || null;
        if (!styleSheet)
            return;
        if (data.source === IncrementalSource.StyleSheetRule)
            this.applyStyleSheetRule(data, styleSheet);
        else if (data.source === IncrementalSource.StyleDeclaration)
            this.applyStyleDeclaration(data, styleSheet);
    }
    applyStyleSheetRule(data, styleSheet) {
        var _a, _b, _c, _d;
        (_a = data.adds) === null || _a === void 0 ? void 0 : _a.forEach(({ rule, index: nestedIndex }) => {
            try {
                if (Array.isArray(nestedIndex)) {
                    const { positions, index } = getPositionsAndIndex(nestedIndex);
                    const nestedRule = getNestedRule(styleSheet.cssRules, positions);
                    nestedRule.insertRule(rule, index);
                }
                else {
                    const index = nestedIndex === undefined
                        ? undefined
                        : Math.min(nestedIndex, styleSheet.cssRules.length);
                    styleSheet === null || styleSheet === void 0 ? void 0 : styleSheet.insertRule(rule, index);
                }
            }
            catch (e) {
            }
        });
        (_b = data.removes) === null || _b === void 0 ? void 0 : _b.forEach(({ index: nestedIndex }) => {
            try {
                if (Array.isArray(nestedIndex)) {
                    const { positions, index } = getPositionsAndIndex(nestedIndex);
                    const nestedRule = getNestedRule(styleSheet.cssRules, positions);
                    nestedRule.deleteRule(index || 0);
                }
                else {
                    styleSheet === null || styleSheet === void 0 ? void 0 : styleSheet.deleteRule(nestedIndex);
                }
            }
            catch (e) {
            }
        });
        if (data.replace)
            try {
                void ((_c = styleSheet.replace) === null || _c === void 0 ? void 0 : _c.call(styleSheet, data.replace));
            }
            catch (e) {
            }
        if (data.replaceSync)
            try {
                (_d = styleSheet.replaceSync) === null || _d === void 0 ? void 0 : _d.call(styleSheet, data.replaceSync);
            }
            catch (e) {
            }
    }
    applyStyleDeclaration(data, styleSheet) {
        if (data.set) {
            const rule = getNestedRule(styleSheet.rules, data.index);
            rule.style.setProperty(data.set.property, data.set.value, data.set.priority);
        }
        if (data.remove) {
            const rule = getNestedRule(styleSheet.rules, data.index);
            rule.style.removeProperty(data.remove.property);
        }
    }
    applyAdoptedStyleSheet(data) {
        var _a;
        const targetHost = this.mirror.getNode(data.id);
        if (!targetHost)
            return;
        (_a = data.styles) === null || _a === void 0 ? void 0 : _a.forEach((style) => {
            var _a;
            let newStyleSheet = null;
            let hostWindow = null;
            if (hasShadowRoot(targetHost))
                hostWindow = ((_a = targetHost.ownerDocument) === null || _a === void 0 ? void 0 : _a.defaultView) || null;
            else if (targetHost.nodeName === '#document')
                hostWindow = targetHost.defaultView;
            if (!hostWindow)
                return;
            try {
                newStyleSheet = new hostWindow.CSSStyleSheet();
                this.styleMirror.add(newStyleSheet, style.styleId);
                this.applyStyleSheetRule({
                    source: IncrementalSource.StyleSheetRule,
                    adds: style.rules,
                }, newStyleSheet);
            }
            catch (e) {
            }
        });
        const MAX_RETRY_TIME = 10;
        let count = 0;
        const adoptStyleSheets = (targetHost, styleIds) => {
            const stylesToAdopt = styleIds
                .map((styleId) => this.styleMirror.getStyle(styleId))
                .filter((style) => style !== null);
            if (hasShadowRoot(targetHost))
                targetHost.shadowRoot.adoptedStyleSheets = stylesToAdopt;
            else if (targetHost.nodeName === '#document')
                targetHost.adoptedStyleSheets = stylesToAdopt;
            if (stylesToAdopt.length !== styleIds.length && count < MAX_RETRY_TIME) {
                setTimeout(() => adoptStyleSheets(targetHost, styleIds), 0 + 100 * count);
                count++;
            }
        };
        adoptStyleSheets(targetHost, data.styleIds);
    }
    legacy_resolveMissingNode(map, parent, target, targetMutation) {
        const { previousId, nextId } = targetMutation;
        const previousInMap = previousId && map[previousId];
        const nextInMap = nextId && map[nextId];
        if (previousInMap) {
            const { node, mutation } = previousInMap;
            parent.insertBefore(node, target);
            delete map[mutation.node.id];
            delete this.legacy_missingNodeRetryMap[mutation.node.id];
            if (mutation.previousId || mutation.nextId) {
                this.legacy_resolveMissingNode(map, parent, node, mutation);
            }
        }
        if (nextInMap) {
            const { node, mutation } = nextInMap;
            parent.insertBefore(node, target.nextSibling);
            delete map[mutation.node.id];
            delete this.legacy_missingNodeRetryMap[mutation.node.id];
            if (mutation.previousId || mutation.nextId) {
                this.legacy_resolveMissingNode(map, parent, node, mutation);
            }
        }
    }
    moveAndHover(x, y, id, isSync, debugData) {
        const target = this.mirror.getNode(id);
        if (!target) {
            return this.debugNodeNotFound(debugData, id);
        }
        const base = getBaseDimension(target, this.iframe);
        const _x = x * base.absoluteScale + base.x;
        const _y = y * base.absoluteScale + base.y;
        this.mouse.style.left = `${_x}px`;
        this.mouse.style.top = `${_y}px`;
        if (!isSync) {
            this.drawMouseTail({ x: _x, y: _y });
        }
        this.hoverElements(target);
    }
    drawMouseTail(position) {
        if (!this.mouseTail) {
            return;
        }
        const { lineCap, lineWidth, strokeStyle, duration } = this.config.mouseTail === true
            ? defaultMouseTailConfig
            : Object.assign({}, defaultMouseTailConfig, this.config.mouseTail);
        const draw = () => {
            if (!this.mouseTail) {
                return;
            }
            const ctx = this.mouseTail.getContext('2d');
            if (!ctx || !this.tailPositions.length) {
                return;
            }
            ctx.clearRect(0, 0, this.mouseTail.width, this.mouseTail.height);
            ctx.beginPath();
            ctx.lineWidth = lineWidth;
            ctx.lineCap = lineCap;
            ctx.strokeStyle = strokeStyle;
            ctx.moveTo(this.tailPositions[0].x, this.tailPositions[0].y);
            this.tailPositions.forEach((p) => ctx.lineTo(p.x, p.y));
            ctx.stroke();
        };
        this.tailPositions.push(position);
        draw();
        setTimeout(() => {
            this.tailPositions = this.tailPositions.filter((p) => p !== position);
            draw();
        }, duration / this.speedService.state.context.timer.speed);
    }
    hoverElements(el) {
        var _a;
        (_a = this.iframe.contentDocument) === null || _a === void 0 ? void 0 : _a.querySelectorAll('.\\:hover').forEach((hoveredEl) => {
            hoveredEl.classList.remove(':hover');
        });
        let currentEl = el;
        while (currentEl) {
            if (currentEl.classList) {
                currentEl.classList.add(':hover');
            }
            currentEl = currentEl.parentElement;
        }
    }
    isUserInteraction(event) {
        if (event.type !== EventType.IncrementalSnapshot) {
            return false;
        }
        return (event.data.source > IncrementalSource.Mutation &&
            event.data.source <= IncrementalSource.Input);
    }
    backToNormal() {
        this.nextUserInteractionEvent = null;
        if (this.speedService.state.matches('normal')) {
            return;
        }
        this.speedService.send({ type: 'BACK_TO_NORMAL' });
        this.emitter.emit(ReplayerEvents.SkipEnd, {
            speed: this.speedService.state.context.normalSpeed,
        });
    }
    warnNodeNotFound(d, id) {
        this.warn(`Node with id '${id}' not found. `, d);
    }
    warnCanvasMutationFailed(d, error) {
        this.warn(`Has error on canvas update`, error, 'canvas mutation:', d);
    }
    debugNodeNotFound(d, id) {
        this.debug(REPLAY_CONSOLE_PREFIX, `Node with id '${id}' not found. `, d);
    }
    warn(...args) {
        if (!this.config.showWarning) {
            return;
        }
        console.warn(REPLAY_CONSOLE_PREFIX, ...args);
    }
    debug(...args) {
        if (!this.config.showDebug) {
            return;
        }
        console.log(REPLAY_CONSOLE_PREFIX, ...args);
    }
}

exports.Replayer = Replayer;
