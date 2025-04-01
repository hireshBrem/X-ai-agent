import { createMirror, snapshot } from '../../../rrweb-snapshot/es/rrweb-snapshot.js';
import { initObservers, mutationBuffers } from './observer.js';
import { polyfill, on, getWindowWidth, getWindowHeight, isSerializedIframe, isSerializedStylesheet, hasShadowRoot } from '../utils.js';
import { EventType, IncrementalSource } from '../../../types/dist/types.js';
import { IframeManager } from './iframe-manager.js';
import { ShadowDomManager } from './shadow-dom-manager.js';
import { CanvasManager } from './observers/canvas/canvas-manager.js';
import { StylesheetManager } from './stylesheet-manager.js';

function wrapEvent(e) {
    return Object.assign(Object.assign({}, e), { timestamp: Date.now() });
}
let wrappedEmit;
let takeFullSnapshot;
let canvasManager;
let recording = false;
const mirror = createMirror();
function record(options = {}) {
    const { emit, checkoutEveryNms, checkoutEveryNth, blockClass = 'rr-block', blockSelector = null, ignoreClass = 'rr-ignore', maskTextClass = 'rr-mask', maskTextSelector = null, inlineStylesheet = true, maskAllInputs, maskInputOptions: _maskInputOptions, slimDOMOptions: _slimDOMOptions, maskInputFn, maskTextFn, hooks, packFn, sampling = {}, dataURLOptions = {}, mousemoveWait, recordCanvas = false, recordCrossOriginIframes = false, userTriggeredOnInput = false, collectFonts = false, inlineImages = false, plugins, keepIframeSrcFn = () => false, ignoreCSSAttributes = new Set([]), } = options;
    const inEmittingFrame = recordCrossOriginIframes
        ? window.parent === window
        : true;
    let passEmitsToParent = false;
    if (!inEmittingFrame) {
        try {
            window.parent.document;
            passEmitsToParent = false;
        }
        catch (e) {
            passEmitsToParent = true;
        }
    }
    if (inEmittingFrame && !emit) {
        throw new Error('emit function is required');
    }
    if (mousemoveWait !== undefined && sampling.mousemove === undefined) {
        sampling.mousemove = mousemoveWait;
    }
    mirror.reset();
    const maskInputOptions = maskAllInputs === true
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
            password: true,
        }
        : _maskInputOptions !== undefined
            ? _maskInputOptions
            : { password: true };
    const slimDOMOptions = _slimDOMOptions === true || _slimDOMOptions === 'all'
        ? {
            script: true,
            comment: true,
            headFavicon: true,
            headWhitespace: true,
            headMetaSocial: true,
            headMetaRobots: true,
            headMetaHttpEquiv: true,
            headMetaVerification: true,
            headMetaAuthorship: _slimDOMOptions === 'all',
            headMetaDescKeywords: _slimDOMOptions === 'all',
        }
        : _slimDOMOptions
            ? _slimDOMOptions
            : {};
    polyfill();
    let lastFullSnapshotEvent;
    let incrementalSnapshotCount = 0;
    const eventProcessor = (e) => {
        for (const plugin of plugins || []) {
            if (plugin.eventProcessor) {
                e = plugin.eventProcessor(e);
            }
        }
        if (packFn) {
            e = packFn(e);
        }
        return e;
    };
    wrappedEmit = (e, isCheckout) => {
        var _a;
        if (((_a = mutationBuffers[0]) === null || _a === void 0 ? void 0 : _a.isFrozen()) &&
            e.type !== EventType.FullSnapshot &&
            !(e.type === EventType.IncrementalSnapshot &&
                e.data.source === IncrementalSource.Mutation)) {
            mutationBuffers.forEach((buf) => buf.unfreeze());
        }
        if (inEmittingFrame) {
            emit === null || emit === void 0 ? void 0 : emit(eventProcessor(e), isCheckout);
        }
        else if (passEmitsToParent) {
            const message = {
                type: 'rrweb',
                event: eventProcessor(e),
                isCheckout,
            };
            window.parent.postMessage(message, '*');
        }
        if (e.type === EventType.FullSnapshot) {
            lastFullSnapshotEvent = e;
            incrementalSnapshotCount = 0;
        }
        else if (e.type === EventType.IncrementalSnapshot) {
            if (e.data.source === IncrementalSource.Mutation &&
                e.data.isAttachIframe) {
                return;
            }
            incrementalSnapshotCount++;
            const exceedCount = checkoutEveryNth && incrementalSnapshotCount >= checkoutEveryNth;
            const exceedTime = checkoutEveryNms &&
                e.timestamp - lastFullSnapshotEvent.timestamp > checkoutEveryNms;
            if (exceedCount || exceedTime) {
                takeFullSnapshot(true);
            }
        }
    };
    const wrappedMutationEmit = (m) => {
        wrappedEmit(wrapEvent({
            type: EventType.IncrementalSnapshot,
            data: Object.assign({ source: IncrementalSource.Mutation }, m),
        }));
    };
    const wrappedScrollEmit = (p) => wrappedEmit(wrapEvent({
        type: EventType.IncrementalSnapshot,
        data: Object.assign({ source: IncrementalSource.Scroll }, p),
    }));
    const wrappedCanvasMutationEmit = (p) => wrappedEmit(wrapEvent({
        type: EventType.IncrementalSnapshot,
        data: Object.assign({ source: IncrementalSource.CanvasMutation }, p),
    }));
    const wrappedAdoptedStyleSheetEmit = (a) => wrappedEmit(wrapEvent({
        type: EventType.IncrementalSnapshot,
        data: Object.assign({ source: IncrementalSource.AdoptedStyleSheet }, a),
    }));
    const stylesheetManager = new StylesheetManager({
        mutationCb: wrappedMutationEmit,
        adoptedStyleSheetCb: wrappedAdoptedStyleSheetEmit,
    });
    const iframeManager = new IframeManager({
        mirror,
        mutationCb: wrappedMutationEmit,
        stylesheetManager: stylesheetManager,
        recordCrossOriginIframes,
        wrappedEmit,
    });
    for (const plugin of plugins || []) {
        if (plugin.getMirror)
            plugin.getMirror({
                nodeMirror: mirror,
                crossOriginIframeMirror: iframeManager.crossOriginIframeMirror,
                crossOriginIframeStyleMirror: iframeManager.crossOriginIframeStyleMirror,
            });
    }
    canvasManager = new CanvasManager({
        recordCanvas,
        mutationCb: wrappedCanvasMutationEmit,
        win: window,
        blockClass,
        blockSelector,
        mirror,
        sampling: sampling.canvas,
        dataURLOptions,
    });
    const shadowDomManager = new ShadowDomManager({
        mutationCb: wrappedMutationEmit,
        scrollCb: wrappedScrollEmit,
        bypassOptions: {
            blockClass,
            blockSelector,
            maskTextClass,
            maskTextSelector,
            inlineStylesheet,
            maskInputOptions,
            dataURLOptions,
            maskTextFn,
            maskInputFn,
            recordCanvas,
            inlineImages,
            sampling,
            slimDOMOptions,
            iframeManager,
            stylesheetManager,
            canvasManager,
            keepIframeSrcFn,
        },
        mirror,
    });
    takeFullSnapshot = (isCheckout = false) => {
        var _a, _b, _c, _d, _e, _f;
        wrappedEmit(wrapEvent({
            type: EventType.Meta,
            data: {
                href: window.location.href,
                width: getWindowWidth(),
                height: getWindowHeight(),
            },
        }), isCheckout);
        stylesheetManager.reset();
        mutationBuffers.forEach((buf) => buf.lock());
        const node = snapshot(document, {
            mirror,
            blockClass,
            blockSelector,
            maskTextClass,
            maskTextSelector,
            inlineStylesheet,
            maskAllInputs: maskInputOptions,
            maskTextFn,
            slimDOM: slimDOMOptions,
            dataURLOptions,
            recordCanvas,
            inlineImages,
            onSerialize: (n) => {
                if (isSerializedIframe(n, mirror)) {
                    iframeManager.addIframe(n);
                }
                if (isSerializedStylesheet(n, mirror)) {
                    stylesheetManager.trackLinkElement(n);
                }
                if (hasShadowRoot(n)) {
                    shadowDomManager.addShadowRoot(n.shadowRoot, document);
                }
            },
            onIframeLoad: (iframe, childSn) => {
                iframeManager.attachIframe(iframe, childSn);
                shadowDomManager.observeAttachShadow(iframe);
            },
            onStylesheetLoad: (linkEl, childSn) => {
                stylesheetManager.attachLinkElement(linkEl, childSn);
            },
            keepIframeSrcFn,
        });
        if (!node) {
            return console.warn('Failed to snapshot the document');
        }
        wrappedEmit(wrapEvent({
            type: EventType.FullSnapshot,
            data: {
                node,
                initialOffset: {
                    left: window.pageXOffset !== undefined
                        ? window.pageXOffset
                        : (document === null || document === void 0 ? void 0 : document.documentElement.scrollLeft) ||
                            ((_b = (_a = document === null || document === void 0 ? void 0 : document.body) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.scrollLeft) ||
                            ((_c = document === null || document === void 0 ? void 0 : document.body) === null || _c === void 0 ? void 0 : _c.scrollLeft) ||
                            0,
                    top: window.pageYOffset !== undefined
                        ? window.pageYOffset
                        : (document === null || document === void 0 ? void 0 : document.documentElement.scrollTop) ||
                            ((_e = (_d = document === null || document === void 0 ? void 0 : document.body) === null || _d === void 0 ? void 0 : _d.parentElement) === null || _e === void 0 ? void 0 : _e.scrollTop) ||
                            ((_f = document === null || document === void 0 ? void 0 : document.body) === null || _f === void 0 ? void 0 : _f.scrollTop) ||
                            0,
                },
            },
        }));
        mutationBuffers.forEach((buf) => buf.unlock());
        if (document.adoptedStyleSheets && document.adoptedStyleSheets.length > 0)
            stylesheetManager.adoptStyleSheets(document.adoptedStyleSheets, mirror.getId(document));
    };
    try {
        const handlers = [];
        handlers.push(on('DOMContentLoaded', () => {
            wrappedEmit(wrapEvent({
                type: EventType.DomContentLoaded,
                data: {},
            }));
        }));
        const observe = (doc) => {
            var _a;
            return initObservers({
                mutationCb: wrappedMutationEmit,
                mousemoveCb: (positions, source) => wrappedEmit(wrapEvent({
                    type: EventType.IncrementalSnapshot,
                    data: {
                        source,
                        positions,
                    },
                })),
                mouseInteractionCb: (d) => wrappedEmit(wrapEvent({
                    type: EventType.IncrementalSnapshot,
                    data: Object.assign({ source: IncrementalSource.MouseInteraction }, d),
                })),
                scrollCb: wrappedScrollEmit,
                viewportResizeCb: (d) => wrappedEmit(wrapEvent({
                    type: EventType.IncrementalSnapshot,
                    data: Object.assign({ source: IncrementalSource.ViewportResize }, d),
                })),
                inputCb: (v) => wrappedEmit(wrapEvent({
                    type: EventType.IncrementalSnapshot,
                    data: Object.assign({ source: IncrementalSource.Input }, v),
                })),
                mediaInteractionCb: (p) => wrappedEmit(wrapEvent({
                    type: EventType.IncrementalSnapshot,
                    data: Object.assign({ source: IncrementalSource.MediaInteraction }, p),
                })),
                styleSheetRuleCb: (r) => wrappedEmit(wrapEvent({
                    type: EventType.IncrementalSnapshot,
                    data: Object.assign({ source: IncrementalSource.StyleSheetRule }, r),
                })),
                styleDeclarationCb: (r) => wrappedEmit(wrapEvent({
                    type: EventType.IncrementalSnapshot,
                    data: Object.assign({ source: IncrementalSource.StyleDeclaration }, r),
                })),
                canvasMutationCb: wrappedCanvasMutationEmit,
                fontCb: (p) => wrappedEmit(wrapEvent({
                    type: EventType.IncrementalSnapshot,
                    data: Object.assign({ source: IncrementalSource.Font }, p),
                })),
                selectionCb: (p) => {
                    wrappedEmit(wrapEvent({
                        type: EventType.IncrementalSnapshot,
                        data: Object.assign({ source: IncrementalSource.Selection }, p),
                    }));
                },
                blockClass,
                ignoreClass,
                maskTextClass,
                maskTextSelector,
                maskInputOptions,
                inlineStylesheet,
                sampling,
                recordCanvas,
                inlineImages,
                userTriggeredOnInput,
                collectFonts,
                doc,
                maskInputFn,
                maskTextFn,
                keepIframeSrcFn,
                blockSelector,
                slimDOMOptions,
                dataURLOptions,
                mirror,
                iframeManager,
                stylesheetManager,
                shadowDomManager,
                canvasManager,
                ignoreCSSAttributes,
                plugins: ((_a = plugins === null || plugins === void 0 ? void 0 : plugins.filter((p) => p.observer)) === null || _a === void 0 ? void 0 : _a.map((p) => ({
                    observer: p.observer,
                    options: p.options,
                    callback: (payload) => wrappedEmit(wrapEvent({
                        type: EventType.Plugin,
                        data: {
                            plugin: p.name,
                            payload,
                        },
                    })),
                }))) || [],
            }, hooks);
        };
        iframeManager.addLoadListener((iframeEl) => {
            handlers.push(observe(iframeEl.contentDocument));
        });
        const init = () => {
            takeFullSnapshot();
            handlers.push(observe(document));
            recording = true;
        };
        if (document.readyState === 'interactive' ||
            document.readyState === 'complete') {
            init();
        }
        else {
            handlers.push(on('load', () => {
                wrappedEmit(wrapEvent({
                    type: EventType.Load,
                    data: {},
                }));
                init();
            }, window));
        }
        return () => {
            handlers.forEach((h) => h());
            recording = false;
        };
    }
    catch (error) {
        console.warn(error);
    }
}
record.addCustomEvent = (tag, payload) => {
    if (!recording) {
        throw new Error('please add custom event after start recording');
    }
    wrappedEmit(wrapEvent({
        type: EventType.Custom,
        data: {
            tag,
            payload,
        },
    }));
};
record.freezePage = () => {
    mutationBuffers.forEach((buf) => buf.freeze());
};
record.takeFullSnapshot = (isCheckout) => {
    if (!recording) {
        throw new Error('please take full snapshot after start recording');
    }
    takeFullSnapshot(isCheckout);
};
record.mirror = mirror;

export { record as default };
