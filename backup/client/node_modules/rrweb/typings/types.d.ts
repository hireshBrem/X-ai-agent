import type { Mirror, MaskInputOptions, SlimDOMOptions, MaskInputFn, MaskTextFn, DataURLOptions } from 'rrweb-snapshot';
import type { PackFn, UnpackFn } from './packer/base';
import type { IframeManager } from './record/iframe-manager';
import type { ShadowDomManager } from './record/shadow-dom-manager';
import type { Replayer } from './replay';
import type { RRNode } from 'rrdom';
import type { CanvasManager } from './record/observers/canvas/canvas-manager';
import type { StylesheetManager } from './record/stylesheet-manager';
import type { addedNodeMutation, blockClass, canvasMutationCallback, eventWithTime, fontCallback, hooksParam, inputCallback, IWindow, KeepIframeSrcFn, listenerHandler, maskTextClass, mediaInteractionCallback, mouseInteractionCallBack, mousemoveCallBack, mutationCallBack, RecordPlugin, SamplingStrategy, scrollCallback, selectionCallback, styleDeclarationCallback, styleSheetRuleCallback, viewportResizeCallback } from '@rrweb/types';
export declare type recordOptions<T> = {
    emit?: (e: T, isCheckout?: boolean) => void;
    checkoutEveryNth?: number;
    checkoutEveryNms?: number;
    blockClass?: blockClass;
    blockSelector?: string;
    ignoreClass?: string;
    maskTextClass?: maskTextClass;
    maskTextSelector?: string;
    maskAllInputs?: boolean;
    maskInputOptions?: MaskInputOptions;
    maskInputFn?: MaskInputFn;
    maskTextFn?: MaskTextFn;
    slimDOMOptions?: SlimDOMOptions | 'all' | true;
    ignoreCSSAttributes?: Set<string>;
    inlineStylesheet?: boolean;
    hooks?: hooksParam;
    packFn?: PackFn;
    sampling?: SamplingStrategy;
    dataURLOptions?: DataURLOptions;
    recordCanvas?: boolean;
    recordCrossOriginIframes?: boolean;
    userTriggeredOnInput?: boolean;
    collectFonts?: boolean;
    inlineImages?: boolean;
    plugins?: RecordPlugin[];
    mousemoveWait?: number;
    keepIframeSrcFn?: KeepIframeSrcFn;
};
export declare type observerParam = {
    mutationCb: mutationCallBack;
    mousemoveCb: mousemoveCallBack;
    mouseInteractionCb: mouseInteractionCallBack;
    scrollCb: scrollCallback;
    viewportResizeCb: viewportResizeCallback;
    inputCb: inputCallback;
    mediaInteractionCb: mediaInteractionCallback;
    selectionCb: selectionCallback;
    blockClass: blockClass;
    blockSelector: string | null;
    ignoreClass: string;
    maskTextClass: maskTextClass;
    maskTextSelector: string | null;
    maskInputOptions: MaskInputOptions;
    maskInputFn?: MaskInputFn;
    maskTextFn?: MaskTextFn;
    keepIframeSrcFn: KeepIframeSrcFn;
    inlineStylesheet: boolean;
    styleSheetRuleCb: styleSheetRuleCallback;
    styleDeclarationCb: styleDeclarationCallback;
    canvasMutationCb: canvasMutationCallback;
    fontCb: fontCallback;
    sampling: SamplingStrategy;
    recordCanvas: boolean;
    inlineImages: boolean;
    userTriggeredOnInput: boolean;
    collectFonts: boolean;
    slimDOMOptions: SlimDOMOptions;
    dataURLOptions: DataURLOptions;
    doc: Document;
    mirror: Mirror;
    iframeManager: IframeManager;
    stylesheetManager: StylesheetManager;
    shadowDomManager: ShadowDomManager;
    canvasManager: CanvasManager;
    ignoreCSSAttributes: Set<string>;
    plugins: Array<{
        observer: (cb: (...arg: Array<unknown>) => void, win: IWindow, options: unknown) => listenerHandler;
        callback: (...arg: Array<unknown>) => void;
        options: unknown;
    }>;
};
export declare type MutationBufferParam = Pick<observerParam, 'mutationCb' | 'blockClass' | 'blockSelector' | 'maskTextClass' | 'maskTextSelector' | 'inlineStylesheet' | 'maskInputOptions' | 'maskTextFn' | 'maskInputFn' | 'keepIframeSrcFn' | 'recordCanvas' | 'inlineImages' | 'slimDOMOptions' | 'dataURLOptions' | 'doc' | 'mirror' | 'iframeManager' | 'stylesheetManager' | 'shadowDomManager' | 'canvasManager'>;
export declare type ReplayPlugin = {
    handler?: (event: eventWithTime, isSync: boolean, context: {
        replayer: Replayer;
    }) => void;
    onBuild?: (node: Node | RRNode, context: {
        id: number;
        replayer: Replayer;
    }) => void;
    getMirror?: (mirrors: {
        nodeMirror: Mirror;
    }) => void;
};
export declare type playerConfig = {
    speed: number;
    maxSpeed: number;
    root: Element;
    loadTimeout: number;
    skipInactive: boolean;
    showWarning: boolean;
    showDebug: boolean;
    blockClass: string;
    liveMode: boolean;
    insertStyleRules: string[];
    triggerFocus: boolean;
    UNSAFE_replayCanvas: boolean;
    pauseAnimation?: boolean;
    mouseTail: boolean | {
        duration?: number;
        lineCap?: string;
        lineWidth?: number;
        strokeStyle?: string;
    };
    unpackFn?: UnpackFn;
    useVirtualDom: boolean;
    plugins?: ReplayPlugin[];
};
export declare type missingNode = {
    node: Node | RRNode;
    mutation: addedNodeMutation;
};
export declare type missingNodeMap = {
    [id: number]: missingNode;
};
declare global {
    interface Window {
        FontFace: typeof FontFace;
    }
}
export declare type CrossOriginIframeMessageEventContent<T = eventWithTime> = {
    type: 'rrweb';
    event: T;
    isCheckout?: boolean;
};
export declare type CrossOriginIframeMessageEvent = MessageEvent<CrossOriginIframeMessageEventContent>;
