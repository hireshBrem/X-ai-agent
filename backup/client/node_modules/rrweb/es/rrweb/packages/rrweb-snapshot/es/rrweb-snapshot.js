var NodeType;
(function (NodeType) {
    NodeType[NodeType["Document"] = 0] = "Document";
    NodeType[NodeType["DocumentType"] = 1] = "DocumentType";
    NodeType[NodeType["Element"] = 2] = "Element";
    NodeType[NodeType["Text"] = 3] = "Text";
    NodeType[NodeType["CDATA"] = 4] = "CDATA";
    NodeType[NodeType["Comment"] = 5] = "Comment";
})(NodeType || (NodeType = {}));

function isElement(n) {
    return n.nodeType === n.ELEMENT_NODE;
}
function isShadowRoot(n) {
    var host = n === null || n === void 0 ? void 0 : n.host;
    return Boolean((host === null || host === void 0 ? void 0 : host.shadowRoot) === n);
}
function isNativeShadowDom(shadowRoot) {
    return Object.prototype.toString.call(shadowRoot) === '[object ShadowRoot]';
}
function fixBrowserCompatibilityIssuesInCSS(cssText) {
    if (cssText.includes(' background-clip: text;') &&
        !cssText.includes(' -webkit-background-clip: text;')) {
        cssText = cssText.replace(' background-clip: text;', ' -webkit-background-clip: text; background-clip: text;');
    }
    return cssText;
}
function getCssRulesString(s) {
    try {
        var rules = s.rules || s.cssRules;
        return rules
            ? fixBrowserCompatibilityIssuesInCSS(Array.from(rules).map(getCssRuleString).join(''))
            : null;
    }
    catch (error) {
        return null;
    }
}
function getCssRuleString(rule) {
    var cssStringified = rule.cssText;
    if (isCSSImportRule(rule)) {
        try {
            cssStringified = getCssRulesString(rule.styleSheet) || cssStringified;
        }
        catch (_a) {
        }
    }
    return cssStringified;
}
function isCSSImportRule(rule) {
    return 'styleSheet' in rule;
}
var Mirror = (function () {
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
function createMirror() {
    return new Mirror();
}
function maskInputValue(_a) {
    var maskInputOptions = _a.maskInputOptions, tagName = _a.tagName, type = _a.type, value = _a.value, maskInputFn = _a.maskInputFn;
    var text = value || '';
    if (maskInputOptions[tagName.toLowerCase()] ||
        maskInputOptions[type]) {
        if (maskInputFn) {
            text = maskInputFn(text);
        }
        else {
            text = '*'.repeat(text.length);
        }
    }
    return text;
}
var ORIGINAL_ATTRIBUTE_NAME = '__rrweb_original__';
function is2DCanvasBlank(canvas) {
    var ctx = canvas.getContext('2d');
    if (!ctx)
        return true;
    var chunkSize = 50;
    for (var x = 0; x < canvas.width; x += chunkSize) {
        for (var y = 0; y < canvas.height; y += chunkSize) {
            var getImageData = ctx.getImageData;
            var originalGetImageData = ORIGINAL_ATTRIBUTE_NAME in getImageData
                ? getImageData[ORIGINAL_ATTRIBUTE_NAME]
                : getImageData;
            var pixelBuffer = new Uint32Array(originalGetImageData.call(ctx, x, y, Math.min(chunkSize, canvas.width - x), Math.min(chunkSize, canvas.height - y)).data.buffer);
            if (pixelBuffer.some(function (pixel) { return pixel !== 0; }))
                return false;
        }
    }
    return true;
}

var _id = 1;
var tagNameRegex = new RegExp('[^a-z0-9-_:]');
var IGNORED_NODE = -2;
function genId() {
    return _id++;
}
function getValidTagName(element) {
    if (element instanceof HTMLFormElement) {
        return 'form';
    }
    var processedTagName = element.tagName.toLowerCase().trim();
    if (tagNameRegex.test(processedTagName)) {
        return 'div';
    }
    return processedTagName;
}
function stringifyStyleSheet(sheet) {
    return sheet.cssRules
        ? Array.from(sheet.cssRules)
            .map(function (rule) { return rule.cssText || ''; })
            .join('')
        : '';
}
function extractOrigin(url) {
    var origin = '';
    if (url.indexOf('//') > -1) {
        origin = url.split('/').slice(0, 3).join('/');
    }
    else {
        origin = url.split('/')[0];
    }
    origin = origin.split('?')[0];
    return origin;
}
var canvasService;
var canvasCtx;
var URL_IN_CSS_REF = /url\((?:(')([^']*)'|(")(.*?)"|([^)]*))\)/gm;
var RELATIVE_PATH = /^(?!www\.|(?:http|ftp)s?:\/\/|[A-Za-z]:\\|\/\/|#).*/;
var DATA_URI = /^(data:)([^,]*),(.*)/i;
function absoluteToStylesheet(cssText, href) {
    return (cssText || '').replace(URL_IN_CSS_REF, function (origin, quote1, path1, quote2, path2, path3) {
        var filePath = path1 || path2 || path3;
        var maybeQuote = quote1 || quote2 || '';
        if (!filePath) {
            return origin;
        }
        if (!RELATIVE_PATH.test(filePath)) {
            return "url(".concat(maybeQuote).concat(filePath).concat(maybeQuote, ")");
        }
        if (DATA_URI.test(filePath)) {
            return "url(".concat(maybeQuote).concat(filePath).concat(maybeQuote, ")");
        }
        if (filePath[0] === '/') {
            return "url(".concat(maybeQuote).concat(extractOrigin(href) + filePath).concat(maybeQuote, ")");
        }
        var stack = href.split('/');
        var parts = filePath.split('/');
        stack.pop();
        for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
            var part = parts_1[_i];
            if (part === '.') {
                continue;
            }
            else if (part === '..') {
                stack.pop();
            }
            else {
                stack.push(part);
            }
        }
        return "url(".concat(maybeQuote).concat(stack.join('/')).concat(maybeQuote, ")");
    });
}
var SRCSET_NOT_SPACES = /^[^ \t\n\r\u000c]+/;
var SRCSET_COMMAS_OR_SPACES = /^[, \t\n\r\u000c]+/;
function getAbsoluteSrcsetString(doc, attributeValue) {
    if (attributeValue.trim() === '') {
        return attributeValue;
    }
    var pos = 0;
    function collectCharacters(regEx) {
        var chars;
        var match = regEx.exec(attributeValue.substring(pos));
        if (match) {
            chars = match[0];
            pos += chars.length;
            return chars;
        }
        return '';
    }
    var output = [];
    while (true) {
        collectCharacters(SRCSET_COMMAS_OR_SPACES);
        if (pos >= attributeValue.length) {
            break;
        }
        var url = collectCharacters(SRCSET_NOT_SPACES);
        if (url.slice(-1) === ',') {
            url = absoluteToDoc(doc, url.substring(0, url.length - 1));
            output.push(url);
        }
        else {
            var descriptorsStr = '';
            url = absoluteToDoc(doc, url);
            var inParens = false;
            while (true) {
                var c = attributeValue.charAt(pos);
                if (c === '') {
                    output.push((url + descriptorsStr).trim());
                    break;
                }
                else if (!inParens) {
                    if (c === ',') {
                        pos += 1;
                        output.push((url + descriptorsStr).trim());
                        break;
                    }
                    else if (c === '(') {
                        inParens = true;
                    }
                }
                else {
                    if (c === ')') {
                        inParens = false;
                    }
                }
                descriptorsStr += c;
                pos += 1;
            }
        }
    }
    return output.join(', ');
}
function absoluteToDoc(doc, attributeValue) {
    if (!attributeValue || attributeValue.trim() === '') {
        return attributeValue;
    }
    var a = doc.createElement('a');
    a.href = attributeValue;
    return a.href;
}
function isSVGElement(el) {
    return Boolean(el.tagName === 'svg' || el.ownerSVGElement);
}
function getHref() {
    var a = document.createElement('a');
    a.href = '';
    return a.href;
}
function transformAttribute(doc, tagName, name, value) {
    if (name === 'src' ||
        (name === 'href' && value && !(tagName === 'use' && value[0] === '#'))) {
        return absoluteToDoc(doc, value);
    }
    else if (name === 'xlink:href' && value && value[0] !== '#') {
        return absoluteToDoc(doc, value);
    }
    else if (name === 'background' &&
        value &&
        (tagName === 'table' || tagName === 'td' || tagName === 'th')) {
        return absoluteToDoc(doc, value);
    }
    else if (name === 'srcset' && value) {
        return getAbsoluteSrcsetString(doc, value);
    }
    else if (name === 'style' && value) {
        return absoluteToStylesheet(value, getHref());
    }
    else if (tagName === 'object' && name === 'data' && value) {
        return absoluteToDoc(doc, value);
    }
    else {
        return value;
    }
}
function _isBlockedElement(element, blockClass, blockSelector) {
    if (typeof blockClass === 'string') {
        if (element.classList.contains(blockClass)) {
            return true;
        }
    }
    else {
        for (var eIndex = element.classList.length; eIndex--;) {
            var className = element.classList[eIndex];
            if (blockClass.test(className)) {
                return true;
            }
        }
    }
    if (blockSelector) {
        return element.matches(blockSelector);
    }
    return false;
}
function classMatchesRegex(node, regex, checkAncestors) {
    if (!node)
        return false;
    if (node.nodeType !== node.ELEMENT_NODE) {
        if (!checkAncestors)
            return false;
        return classMatchesRegex(node.parentNode, regex, checkAncestors);
    }
    for (var eIndex = node.classList.length; eIndex--;) {
        var className = node.classList[eIndex];
        if (regex.test(className)) {
            return true;
        }
    }
    if (!checkAncestors)
        return false;
    return classMatchesRegex(node.parentNode, regex, checkAncestors);
}
function needMaskingText(node, maskTextClass, maskTextSelector) {
    var el = node.nodeType === node.ELEMENT_NODE
        ? node
        : node.parentElement;
    if (el === null)
        return false;
    if (typeof maskTextClass === 'string') {
        if (el.classList.contains(maskTextClass))
            return true;
        if (el.closest(".".concat(maskTextClass)))
            return true;
    }
    else {
        if (classMatchesRegex(el, maskTextClass, true))
            return true;
    }
    if (maskTextSelector) {
        if (el.matches(maskTextSelector))
            return true;
        if (el.closest(maskTextSelector))
            return true;
    }
    return false;
}
function onceIframeLoaded(iframeEl, listener, iframeLoadTimeout) {
    var win = iframeEl.contentWindow;
    if (!win) {
        return;
    }
    var fired = false;
    var readyState;
    try {
        readyState = win.document.readyState;
    }
    catch (error) {
        return;
    }
    if (readyState !== 'complete') {
        var timer_1 = setTimeout(function () {
            if (!fired) {
                listener();
                fired = true;
            }
        }, iframeLoadTimeout);
        iframeEl.addEventListener('load', function () {
            clearTimeout(timer_1);
            fired = true;
            listener();
        });
        return;
    }
    var blankUrl = 'about:blank';
    if (win.location.href !== blankUrl ||
        iframeEl.src === blankUrl ||
        iframeEl.src === '') {
        setTimeout(listener, 0);
        return iframeEl.addEventListener('load', listener);
    }
    iframeEl.addEventListener('load', listener);
}
function onceStylesheetLoaded(link, listener, styleSheetLoadTimeout) {
    var fired = false;
    var styleSheetLoaded;
    try {
        styleSheetLoaded = link.sheet;
    }
    catch (error) {
        return;
    }
    if (styleSheetLoaded)
        return;
    var timer = setTimeout(function () {
        if (!fired) {
            listener();
            fired = true;
        }
    }, styleSheetLoadTimeout);
    link.addEventListener('load', function () {
        clearTimeout(timer);
        fired = true;
        listener();
    });
}
function serializeNode(n, options) {
    var doc = options.doc, mirror = options.mirror, blockClass = options.blockClass, blockSelector = options.blockSelector, maskTextClass = options.maskTextClass, maskTextSelector = options.maskTextSelector, inlineStylesheet = options.inlineStylesheet, _a = options.maskInputOptions, maskInputOptions = _a === void 0 ? {} : _a, maskTextFn = options.maskTextFn, maskInputFn = options.maskInputFn, _b = options.dataURLOptions, dataURLOptions = _b === void 0 ? {} : _b, inlineImages = options.inlineImages, recordCanvas = options.recordCanvas, keepIframeSrcFn = options.keepIframeSrcFn, _c = options.newlyAddedElement, newlyAddedElement = _c === void 0 ? false : _c;
    var rootId = getRootId(doc, mirror);
    switch (n.nodeType) {
        case n.DOCUMENT_NODE:
            if (n.compatMode !== 'CSS1Compat') {
                return {
                    type: NodeType.Document,
                    childNodes: [],
                    compatMode: n.compatMode
                };
            }
            else {
                return {
                    type: NodeType.Document,
                    childNodes: []
                };
            }
        case n.DOCUMENT_TYPE_NODE:
            return {
                type: NodeType.DocumentType,
                name: n.name,
                publicId: n.publicId,
                systemId: n.systemId,
                rootId: rootId
            };
        case n.ELEMENT_NODE:
            return serializeElementNode(n, {
                doc: doc,
                blockClass: blockClass,
                blockSelector: blockSelector,
                inlineStylesheet: inlineStylesheet,
                maskInputOptions: maskInputOptions,
                maskInputFn: maskInputFn,
                dataURLOptions: dataURLOptions,
                inlineImages: inlineImages,
                recordCanvas: recordCanvas,
                keepIframeSrcFn: keepIframeSrcFn,
                newlyAddedElement: newlyAddedElement,
                rootId: rootId
            });
        case n.TEXT_NODE:
            return serializeTextNode(n, {
                maskTextClass: maskTextClass,
                maskTextSelector: maskTextSelector,
                maskTextFn: maskTextFn,
                rootId: rootId
            });
        case n.CDATA_SECTION_NODE:
            return {
                type: NodeType.CDATA,
                textContent: '',
                rootId: rootId
            };
        case n.COMMENT_NODE:
            return {
                type: NodeType.Comment,
                textContent: n.textContent || '',
                rootId: rootId
            };
        default:
            return false;
    }
}
function getRootId(doc, mirror) {
    if (!mirror.hasNode(doc))
        return undefined;
    var docId = mirror.getId(doc);
    return docId === 1 ? undefined : docId;
}
function serializeTextNode(n, options) {
    var _a;
    var maskTextClass = options.maskTextClass, maskTextSelector = options.maskTextSelector, maskTextFn = options.maskTextFn, rootId = options.rootId;
    var parentTagName = n.parentNode && n.parentNode.tagName;
    var textContent = n.textContent;
    var isStyle = parentTagName === 'STYLE' ? true : undefined;
    var isScript = parentTagName === 'SCRIPT' ? true : undefined;
    if (isStyle && textContent) {
        try {
            if (n.nextSibling || n.previousSibling) {
            }
            else if ((_a = n.parentNode.sheet) === null || _a === void 0 ? void 0 : _a.cssRules) {
                textContent = stringifyStyleSheet(n.parentNode.sheet);
            }
        }
        catch (err) {
            console.warn("Cannot get CSS styles from text's parentNode. Error: ".concat(err), n);
        }
        textContent = absoluteToStylesheet(textContent, getHref());
    }
    if (isScript) {
        textContent = 'SCRIPT_PLACEHOLDER';
    }
    if (!isStyle &&
        !isScript &&
        textContent &&
        needMaskingText(n, maskTextClass, maskTextSelector)) {
        textContent = maskTextFn
            ? maskTextFn(textContent)
            : textContent.replace(/[\S]/g, '*');
    }
    return {
        type: NodeType.Text,
        textContent: textContent || '',
        isStyle: isStyle,
        rootId: rootId
    };
}
function serializeElementNode(n, options) {
    var doc = options.doc, blockClass = options.blockClass, blockSelector = options.blockSelector, inlineStylesheet = options.inlineStylesheet, _a = options.maskInputOptions, maskInputOptions = _a === void 0 ? {} : _a, maskInputFn = options.maskInputFn, _b = options.dataURLOptions, dataURLOptions = _b === void 0 ? {} : _b, inlineImages = options.inlineImages, recordCanvas = options.recordCanvas, keepIframeSrcFn = options.keepIframeSrcFn, _c = options.newlyAddedElement, newlyAddedElement = _c === void 0 ? false : _c, rootId = options.rootId;
    var needBlock = _isBlockedElement(n, blockClass, blockSelector);
    var tagName = getValidTagName(n);
    var attributes = {};
    var len = n.attributes.length;
    for (var i = 0; i < len; i++) {
        var attr = n.attributes[i];
        attributes[attr.name] = transformAttribute(doc, tagName, attr.name, attr.value);
    }
    if (tagName === 'link' && inlineStylesheet) {
        var stylesheet = Array.from(doc.styleSheets).find(function (s) {
            return s.href === n.href;
        });
        var cssText = null;
        if (stylesheet) {
            cssText = getCssRulesString(stylesheet);
        }
        if (cssText) {
            delete attributes.rel;
            delete attributes.href;
            attributes._cssText = absoluteToStylesheet(cssText, stylesheet.href);
        }
    }
    if (tagName === 'style' &&
        n.sheet &&
        !(n.innerText || n.textContent || '').trim().length) {
        var cssText = getCssRulesString(n.sheet);
        if (cssText) {
            attributes._cssText = absoluteToStylesheet(cssText, getHref());
        }
    }
    if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
        var value = n.value;
        var checked = n.checked;
        if (attributes.type !== 'radio' &&
            attributes.type !== 'checkbox' &&
            attributes.type !== 'submit' &&
            attributes.type !== 'button' &&
            value) {
            attributes.value = maskInputValue({
                type: attributes.type,
                tagName: tagName,
                value: value,
                maskInputOptions: maskInputOptions,
                maskInputFn: maskInputFn
            });
        }
        else if (checked) {
            attributes.checked = checked;
        }
    }
    if (tagName === 'option') {
        if (n.selected && !maskInputOptions['select']) {
            attributes.selected = true;
        }
        else {
            delete attributes.selected;
        }
    }
    if (tagName === 'canvas' && recordCanvas) {
        if (n.__context === '2d') {
            if (!is2DCanvasBlank(n)) {
                attributes.rr_dataURL = n.toDataURL(dataURLOptions.type, dataURLOptions.quality);
            }
        }
        else if (!('__context' in n)) {
            var canvasDataURL = n.toDataURL(dataURLOptions.type, dataURLOptions.quality);
            var blankCanvas = document.createElement('canvas');
            blankCanvas.width = n.width;
            blankCanvas.height = n.height;
            var blankCanvasDataURL = blankCanvas.toDataURL(dataURLOptions.type, dataURLOptions.quality);
            if (canvasDataURL !== blankCanvasDataURL) {
                attributes.rr_dataURL = canvasDataURL;
            }
        }
    }
    if (tagName === 'img' && inlineImages) {
        if (!canvasService) {
            canvasService = doc.createElement('canvas');
            canvasCtx = canvasService.getContext('2d');
        }
        var image_1 = n;
        var oldValue_1 = image_1.crossOrigin;
        image_1.crossOrigin = 'anonymous';
        var recordInlineImage = function () {
            try {
                canvasService.width = image_1.naturalWidth;
                canvasService.height = image_1.naturalHeight;
                canvasCtx.drawImage(image_1, 0, 0);
                attributes.rr_dataURL = canvasService.toDataURL(dataURLOptions.type, dataURLOptions.quality);
            }
            catch (err) {
                console.warn("Cannot inline img src=".concat(image_1.currentSrc, "! Error: ").concat(err));
            }
            oldValue_1
                ? (attributes.crossOrigin = oldValue_1)
                : image_1.removeAttribute('crossorigin');
        };
        if (image_1.complete && image_1.naturalWidth !== 0)
            recordInlineImage();
        else
            image_1.onload = recordInlineImage;
    }
    if (tagName === 'audio' || tagName === 'video') {
        attributes.rr_mediaState = n.paused
            ? 'paused'
            : 'played';
        attributes.rr_mediaCurrentTime = n.currentTime;
    }
    if (!newlyAddedElement) {
        if (n.scrollLeft) {
            attributes.rr_scrollLeft = n.scrollLeft;
        }
        if (n.scrollTop) {
            attributes.rr_scrollTop = n.scrollTop;
        }
    }
    if (needBlock) {
        var _d = n.getBoundingClientRect(), width = _d.width, height = _d.height;
        attributes = {
            "class": attributes["class"],
            rr_width: "".concat(width, "px"),
            rr_height: "".concat(height, "px")
        };
    }
    if (tagName === 'iframe' && !keepIframeSrcFn(attributes.src)) {
        if (!n.contentDocument) {
            attributes.rr_src = attributes.src;
        }
        delete attributes.src;
    }
    return {
        type: NodeType.Element,
        tagName: tagName,
        attributes: attributes,
        childNodes: [],
        isSVG: isSVGElement(n) || undefined,
        needBlock: needBlock,
        rootId: rootId
    };
}
function lowerIfExists(maybeAttr) {
    if (maybeAttr === undefined) {
        return '';
    }
    else {
        return maybeAttr.toLowerCase();
    }
}
function slimDOMExcluded(sn, slimDOMOptions) {
    if (slimDOMOptions.comment && sn.type === NodeType.Comment) {
        return true;
    }
    else if (sn.type === NodeType.Element) {
        if (slimDOMOptions.script &&
            (sn.tagName === 'script' ||
                (sn.tagName === 'link' &&
                    sn.attributes.rel === 'preload' &&
                    sn.attributes.as === 'script') ||
                (sn.tagName === 'link' &&
                    sn.attributes.rel === 'prefetch' &&
                    typeof sn.attributes.href === 'string' &&
                    sn.attributes.href.endsWith('.js')))) {
            return true;
        }
        else if (slimDOMOptions.headFavicon &&
            ((sn.tagName === 'link' && sn.attributes.rel === 'shortcut icon') ||
                (sn.tagName === 'meta' &&
                    (lowerIfExists(sn.attributes.name).match(/^msapplication-tile(image|color)$/) ||
                        lowerIfExists(sn.attributes.name) === 'application-name' ||
                        lowerIfExists(sn.attributes.rel) === 'icon' ||
                        lowerIfExists(sn.attributes.rel) === 'apple-touch-icon' ||
                        lowerIfExists(sn.attributes.rel) === 'shortcut icon')))) {
            return true;
        }
        else if (sn.tagName === 'meta') {
            if (slimDOMOptions.headMetaDescKeywords &&
                lowerIfExists(sn.attributes.name).match(/^description|keywords$/)) {
                return true;
            }
            else if (slimDOMOptions.headMetaSocial &&
                (lowerIfExists(sn.attributes.property).match(/^(og|twitter|fb):/) ||
                    lowerIfExists(sn.attributes.name).match(/^(og|twitter):/) ||
                    lowerIfExists(sn.attributes.name) === 'pinterest')) {
                return true;
            }
            else if (slimDOMOptions.headMetaRobots &&
                (lowerIfExists(sn.attributes.name) === 'robots' ||
                    lowerIfExists(sn.attributes.name) === 'googlebot' ||
                    lowerIfExists(sn.attributes.name) === 'bingbot')) {
                return true;
            }
            else if (slimDOMOptions.headMetaHttpEquiv &&
                sn.attributes['http-equiv'] !== undefined) {
                return true;
            }
            else if (slimDOMOptions.headMetaAuthorship &&
                (lowerIfExists(sn.attributes.name) === 'author' ||
                    lowerIfExists(sn.attributes.name) === 'generator' ||
                    lowerIfExists(sn.attributes.name) === 'framework' ||
                    lowerIfExists(sn.attributes.name) === 'publisher' ||
                    lowerIfExists(sn.attributes.name) === 'progid' ||
                    lowerIfExists(sn.attributes.property).match(/^article:/) ||
                    lowerIfExists(sn.attributes.property).match(/^product:/))) {
                return true;
            }
            else if (slimDOMOptions.headMetaVerification &&
                (lowerIfExists(sn.attributes.name) === 'google-site-verification' ||
                    lowerIfExists(sn.attributes.name) === 'yandex-verification' ||
                    lowerIfExists(sn.attributes.name) === 'csrf-token' ||
                    lowerIfExists(sn.attributes.name) === 'p:domain_verify' ||
                    lowerIfExists(sn.attributes.name) === 'verify-v1' ||
                    lowerIfExists(sn.attributes.name) === 'verification' ||
                    lowerIfExists(sn.attributes.name) === 'shopify-checkout-api-token')) {
                return true;
            }
        }
    }
    return false;
}
function serializeNodeWithId(n, options) {
    var doc = options.doc, mirror = options.mirror, blockClass = options.blockClass, blockSelector = options.blockSelector, maskTextClass = options.maskTextClass, maskTextSelector = options.maskTextSelector, _a = options.skipChild, skipChild = _a === void 0 ? false : _a, _b = options.inlineStylesheet, inlineStylesheet = _b === void 0 ? true : _b, _c = options.maskInputOptions, maskInputOptions = _c === void 0 ? {} : _c, maskTextFn = options.maskTextFn, maskInputFn = options.maskInputFn, slimDOMOptions = options.slimDOMOptions, _d = options.dataURLOptions, dataURLOptions = _d === void 0 ? {} : _d, _e = options.inlineImages, inlineImages = _e === void 0 ? false : _e, _f = options.recordCanvas, recordCanvas = _f === void 0 ? false : _f, onSerialize = options.onSerialize, onIframeLoad = options.onIframeLoad, _g = options.iframeLoadTimeout, iframeLoadTimeout = _g === void 0 ? 5000 : _g, onStylesheetLoad = options.onStylesheetLoad, _h = options.stylesheetLoadTimeout, stylesheetLoadTimeout = _h === void 0 ? 5000 : _h, _j = options.keepIframeSrcFn, keepIframeSrcFn = _j === void 0 ? function () { return false; } : _j, _k = options.newlyAddedElement, newlyAddedElement = _k === void 0 ? false : _k;
    var _l = options.preserveWhiteSpace, preserveWhiteSpace = _l === void 0 ? true : _l;
    var _serializedNode = serializeNode(n, {
        doc: doc,
        mirror: mirror,
        blockClass: blockClass,
        blockSelector: blockSelector,
        maskTextClass: maskTextClass,
        maskTextSelector: maskTextSelector,
        inlineStylesheet: inlineStylesheet,
        maskInputOptions: maskInputOptions,
        maskTextFn: maskTextFn,
        maskInputFn: maskInputFn,
        dataURLOptions: dataURLOptions,
        inlineImages: inlineImages,
        recordCanvas: recordCanvas,
        keepIframeSrcFn: keepIframeSrcFn,
        newlyAddedElement: newlyAddedElement
    });
    if (!_serializedNode) {
        console.warn(n, 'not serialized');
        return null;
    }
    var id;
    if (mirror.hasNode(n)) {
        id = mirror.getId(n);
    }
    else if (slimDOMExcluded(_serializedNode, slimDOMOptions) ||
        (!preserveWhiteSpace &&
            _serializedNode.type === NodeType.Text &&
            !_serializedNode.isStyle &&
            !_serializedNode.textContent.replace(/^\s+|\s+$/gm, '').length)) {
        id = IGNORED_NODE;
    }
    else {
        id = genId();
    }
    var serializedNode = Object.assign(_serializedNode, { id: id });
    mirror.add(n, serializedNode);
    if (id === IGNORED_NODE) {
        return null;
    }
    if (onSerialize) {
        onSerialize(n);
    }
    var recordChild = !skipChild;
    if (serializedNode.type === NodeType.Element) {
        recordChild = recordChild && !serializedNode.needBlock;
        delete serializedNode.needBlock;
        var shadowRoot = n.shadowRoot;
        if (shadowRoot && isNativeShadowDom(shadowRoot))
            serializedNode.isShadowHost = true;
    }
    if ((serializedNode.type === NodeType.Document ||
        serializedNode.type === NodeType.Element) &&
        recordChild) {
        if (slimDOMOptions.headWhitespace &&
            serializedNode.type === NodeType.Element &&
            serializedNode.tagName === 'head') {
            preserveWhiteSpace = false;
        }
        var bypassOptions = {
            doc: doc,
            mirror: mirror,
            blockClass: blockClass,
            blockSelector: blockSelector,
            maskTextClass: maskTextClass,
            maskTextSelector: maskTextSelector,
            skipChild: skipChild,
            inlineStylesheet: inlineStylesheet,
            maskInputOptions: maskInputOptions,
            maskTextFn: maskTextFn,
            maskInputFn: maskInputFn,
            slimDOMOptions: slimDOMOptions,
            dataURLOptions: dataURLOptions,
            inlineImages: inlineImages,
            recordCanvas: recordCanvas,
            preserveWhiteSpace: preserveWhiteSpace,
            onSerialize: onSerialize,
            onIframeLoad: onIframeLoad,
            iframeLoadTimeout: iframeLoadTimeout,
            onStylesheetLoad: onStylesheetLoad,
            stylesheetLoadTimeout: stylesheetLoadTimeout,
            keepIframeSrcFn: keepIframeSrcFn
        };
        for (var _i = 0, _m = Array.from(n.childNodes); _i < _m.length; _i++) {
            var childN = _m[_i];
            var serializedChildNode = serializeNodeWithId(childN, bypassOptions);
            if (serializedChildNode) {
                serializedNode.childNodes.push(serializedChildNode);
            }
        }
        if (isElement(n) && n.shadowRoot) {
            for (var _o = 0, _p = Array.from(n.shadowRoot.childNodes); _o < _p.length; _o++) {
                var childN = _p[_o];
                var serializedChildNode = serializeNodeWithId(childN, bypassOptions);
                if (serializedChildNode) {
                    isNativeShadowDom(n.shadowRoot) &&
                        (serializedChildNode.isShadow = true);
                    serializedNode.childNodes.push(serializedChildNode);
                }
            }
        }
    }
    if (n.parentNode &&
        isShadowRoot(n.parentNode) &&
        isNativeShadowDom(n.parentNode)) {
        serializedNode.isShadow = true;
    }
    if (serializedNode.type === NodeType.Element &&
        serializedNode.tagName === 'iframe') {
        onceIframeLoaded(n, function () {
            var iframeDoc = n.contentDocument;
            if (iframeDoc && onIframeLoad) {
                var serializedIframeNode = serializeNodeWithId(iframeDoc, {
                    doc: iframeDoc,
                    mirror: mirror,
                    blockClass: blockClass,
                    blockSelector: blockSelector,
                    maskTextClass: maskTextClass,
                    maskTextSelector: maskTextSelector,
                    skipChild: false,
                    inlineStylesheet: inlineStylesheet,
                    maskInputOptions: maskInputOptions,
                    maskTextFn: maskTextFn,
                    maskInputFn: maskInputFn,
                    slimDOMOptions: slimDOMOptions,
                    dataURLOptions: dataURLOptions,
                    inlineImages: inlineImages,
                    recordCanvas: recordCanvas,
                    preserveWhiteSpace: preserveWhiteSpace,
                    onSerialize: onSerialize,
                    onIframeLoad: onIframeLoad,
                    iframeLoadTimeout: iframeLoadTimeout,
                    onStylesheetLoad: onStylesheetLoad,
                    stylesheetLoadTimeout: stylesheetLoadTimeout,
                    keepIframeSrcFn: keepIframeSrcFn
                });
                if (serializedIframeNode) {
                    onIframeLoad(n, serializedIframeNode);
                }
            }
        }, iframeLoadTimeout);
    }
    if (serializedNode.type === NodeType.Element &&
        serializedNode.tagName === 'link' &&
        serializedNode.attributes.rel === 'stylesheet') {
        onceStylesheetLoaded(n, function () {
            if (onStylesheetLoad) {
                var serializedLinkNode = serializeNodeWithId(n, {
                    doc: doc,
                    mirror: mirror,
                    blockClass: blockClass,
                    blockSelector: blockSelector,
                    maskTextClass: maskTextClass,
                    maskTextSelector: maskTextSelector,
                    skipChild: false,
                    inlineStylesheet: inlineStylesheet,
                    maskInputOptions: maskInputOptions,
                    maskTextFn: maskTextFn,
                    maskInputFn: maskInputFn,
                    slimDOMOptions: slimDOMOptions,
                    dataURLOptions: dataURLOptions,
                    inlineImages: inlineImages,
                    recordCanvas: recordCanvas,
                    preserveWhiteSpace: preserveWhiteSpace,
                    onSerialize: onSerialize,
                    onIframeLoad: onIframeLoad,
                    iframeLoadTimeout: iframeLoadTimeout,
                    onStylesheetLoad: onStylesheetLoad,
                    stylesheetLoadTimeout: stylesheetLoadTimeout,
                    keepIframeSrcFn: keepIframeSrcFn
                });
                if (serializedLinkNode) {
                    onStylesheetLoad(n, serializedLinkNode);
                }
            }
        }, stylesheetLoadTimeout);
    }
    return serializedNode;
}
function snapshot(n, options) {
    var _a = options || {}, _b = _a.mirror, mirror = _b === void 0 ? new Mirror() : _b, _c = _a.blockClass, blockClass = _c === void 0 ? 'rr-block' : _c, _d = _a.blockSelector, blockSelector = _d === void 0 ? null : _d, _e = _a.maskTextClass, maskTextClass = _e === void 0 ? 'rr-mask' : _e, _f = _a.maskTextSelector, maskTextSelector = _f === void 0 ? null : _f, _g = _a.inlineStylesheet, inlineStylesheet = _g === void 0 ? true : _g, _h = _a.inlineImages, inlineImages = _h === void 0 ? false : _h, _j = _a.recordCanvas, recordCanvas = _j === void 0 ? false : _j, _k = _a.maskAllInputs, maskAllInputs = _k === void 0 ? false : _k, maskTextFn = _a.maskTextFn, maskInputFn = _a.maskInputFn, _l = _a.slimDOM, slimDOM = _l === void 0 ? false : _l, dataURLOptions = _a.dataURLOptions, preserveWhiteSpace = _a.preserveWhiteSpace, onSerialize = _a.onSerialize, onIframeLoad = _a.onIframeLoad, iframeLoadTimeout = _a.iframeLoadTimeout, onStylesheetLoad = _a.onStylesheetLoad, stylesheetLoadTimeout = _a.stylesheetLoadTimeout, _m = _a.keepIframeSrcFn, keepIframeSrcFn = _m === void 0 ? function () { return false; } : _m;
    var maskInputOptions = maskAllInputs === true
        ? {
            color: true,
            date: true,
            'datetime-local': true,
            email: true,
            month: true,
            number: true,
            range: true,
            search: true,
            tel: true,
            text: true,
            time: true,
            url: true,
            week: true,
            textarea: true,
            select: true,
            password: true
        }
        : maskAllInputs === false
            ? {
                password: true
            }
            : maskAllInputs;
    var slimDOMOptions = slimDOM === true || slimDOM === 'all'
        ?
            {
                script: true,
                comment: true,
                headFavicon: true,
                headWhitespace: true,
                headMetaDescKeywords: slimDOM === 'all',
                headMetaSocial: true,
                headMetaRobots: true,
                headMetaHttpEquiv: true,
                headMetaAuthorship: true,
                headMetaVerification: true
            }
        : slimDOM === false
            ? {}
            : slimDOM;
    return serializeNodeWithId(n, {
        doc: n,
        mirror: mirror,
        blockClass: blockClass,
        blockSelector: blockSelector,
        maskTextClass: maskTextClass,
        maskTextSelector: maskTextSelector,
        skipChild: false,
        inlineStylesheet: inlineStylesheet,
        maskInputOptions: maskInputOptions,
        maskTextFn: maskTextFn,
        maskInputFn: maskInputFn,
        slimDOMOptions: slimDOMOptions,
        dataURLOptions: dataURLOptions,
        inlineImages: inlineImages,
        recordCanvas: recordCanvas,
        preserveWhiteSpace: preserveWhiteSpace,
        onSerialize: onSerialize,
        onIframeLoad: onIframeLoad,
        iframeLoadTimeout: iframeLoadTimeout,
        onStylesheetLoad: onStylesheetLoad,
        stylesheetLoadTimeout: stylesheetLoadTimeout,
        keepIframeSrcFn: keepIframeSrcFn,
        newlyAddedElement: false
    });
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
        case NodeType.Document:
            return doc.implementation.createDocument(null, '', null);
        case NodeType.DocumentType:
            return doc.implementation.createDocumentType(n.name || 'html', n.publicId, n.systemId);
        case NodeType.Element: {
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
        case NodeType.Text:
            return doc.createTextNode(n.isStyle && hackCss
                ? addHoverClass(n.textContent, cache)
                : n.textContent);
        case NodeType.CDATA:
            return doc.createCDATASection(n.textContent);
        case NodeType.Comment:
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
    if (n.type === NodeType.Document) {
        doc.close();
        doc.open();
        if (n.compatMode === 'BackCompat' &&
            n.childNodes &&
            n.childNodes[0].type !== NodeType.DocumentType) {
            if (n.childNodes[0].type === NodeType.Element &&
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
    if ((n.type === NodeType.Document || n.type === NodeType.Element) &&
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
    if ((n === null || n === void 0 ? void 0 : n.type) !== NodeType.Element) {
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
    var doc = options.doc, onVisit = options.onVisit, _a = options.hackCss, hackCss = _a === void 0 ? true : _a, afterAppend = options.afterAppend, cache = options.cache, _b = options.mirror, mirror = _b === void 0 ? new Mirror() : _b;
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

export { IGNORED_NODE, Mirror, NodeType, addHoverClass, buildNodeWithSN, classMatchesRegex, createCache, createMirror, genId, getCssRuleString, getCssRulesString, is2DCanvasBlank, isCSSImportRule, isElement, isNativeShadowDom, isShadowRoot, maskInputValue, needMaskingText, rebuild, serializeNodeWithId, snapshot, transformAttribute };
