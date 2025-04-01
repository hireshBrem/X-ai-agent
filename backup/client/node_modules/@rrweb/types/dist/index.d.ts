export declare type actionWithDelay = {
    doAction: () => void;
    delay: number;
};

export declare type addedNodeMutation = {
    parentId: number;
    previousId?: number | null;
    nextId: number | null;
    node: serializedNodeWithId;
};

export declare type adoptedStyleSheetCallback = (a: adoptedStyleSheetParam) => void;

export declare type adoptedStyleSheetData = {
    source: IncrementalSource.AdoptedStyleSheet;
} & adoptedStyleSheetParam;

export declare type adoptedStyleSheetParam = {
    id: number;
    styles?: {
        styleId: number;
        rules: styleSheetAddRule[];
    }[];
    styleIds: number[];
};

export declare type Arguments<T> = T extends (...payload: infer U) => unknown ? U : unknown;

export declare type attributeCursor = {
    node: Node;
    attributes: {
        [key: string]: string | styleOMValue | null;
    };
    styleDiff: styleOMValue;
    _unchangedStyles: styleOMValue;
};

export declare type attributeMutation = {
    id: number;
    attributes: {
        [key: string]: string | styleOMValue | null;
    };
};

export declare type attributes = cssTextKeyAttr & {
    [key: string]: string | number | true | null;
};

export declare type blockClass = string | RegExp;

export declare type CanvasArg = SerializedCanvasArg | string | number | boolean | null | CanvasArg[];

export declare enum CanvasContext {
    '2D' = 0,
    WebGL = 1,
    WebGL2 = 2
}

export declare type canvasEventWithTime = eventWithTime & {
    type: EventType.IncrementalSnapshot;
    data: canvasMutationData;
};

export declare type canvasManagerMutationCallback = (target: HTMLCanvasElement, p: canvasMutationWithType) => void;

export declare type canvasMutationCallback = (p: canvasMutationParam) => void;

export declare type canvasMutationCommand = {
    property: string;
    args: Array<unknown>;
    setter?: true;
};

export declare type canvasMutationData = {
    source: IncrementalSource.CanvasMutation;
} & canvasMutationParam;

export declare type canvasMutationParam = {
    id: number;
    type: CanvasContext;
    commands: canvasMutationCommand[];
} | ({
    id: number;
    type: CanvasContext;
} & canvasMutationCommand);

export declare type canvasMutationWithType = {
    type: CanvasContext;
} & canvasMutationCommand;

export declare type cdataNode = {
    type: NodeType.CDATA;
    textContent: '';
};

export declare type commentNode = {
    type: NodeType.Comment;
    textContent: string;
};

declare type cssTextKeyAttr = {
    _cssText?: string;
};

export declare type customElementCallback = (c: customElementParam) => void;

export declare type customElementData = {
    source: IncrementalSource.CustomElement;
} & customElementParam;

export declare type customElementParam = {
    define?: {
        name: string;
    };
};

export declare type customEvent<T = unknown> = {
    type: EventType.Custom;
    data: {
        tag: string;
        payload: T;
    };
};

export declare type DataURLOptions = Partial<{
    type: string;
    quality: number;
}>;

export declare type DeprecatedMirror = {
    map: {
        [key: number]: INode;
    };
    getId: (n: Node) => number;
    getNode: (id: number) => INode | null;
    removeNodeFromMap: (n: Node) => void;
    has: (id: number) => boolean;
    reset: () => void;
};

export declare type DocumentDimension = {
    x: number;
    y: number;
    relativeScale: number;
    absoluteScale: number;
};

export declare type documentNode = {
    type: NodeType.Document;
    childNodes: serializedNodeWithId[];
    compatMode?: string;
};

export declare type documentTypeNode = {
    type: NodeType.DocumentType;
    name: string;
    publicId: string;
    systemId: string;
};

export declare type domContentLoadedEvent = {
    type: EventType.DomContentLoaded;
    data: unknown;
};

export declare type elementNode = {
    type: NodeType.Element;
    tagName: string;
    attributes: attributes;
    childNodes: serializedNodeWithId[];
    isSVG?: true;
    needBlock?: boolean;
    isCustom?: true;
};

export declare type Emitter = {
    on(type: string, handler: Handler): void;
    emit(type: string, event?: unknown): void;
    off(type: string, handler: Handler): void;
};

declare type event_2 = eventWithoutTime;
export { event_2 as event }

export declare enum EventType {
    DomContentLoaded = 0,
    Load = 1,
    FullSnapshot = 2,
    IncrementalSnapshot = 3,
    Meta = 4,
    Custom = 5,
    Plugin = 6
}

export declare type eventWithoutTime = domContentLoadedEvent | loadedEvent | fullSnapshotEvent | incrementalSnapshotEvent | metaEvent | customEvent | pluginEvent;

export declare type eventWithTime = eventWithoutTime & {
    timestamp: number;
    delay?: number;
};

export declare type fontCallback = (p: fontParam) => void;

export declare type fontData = {
    source: IncrementalSource.Font;
} & fontParam;

export declare type fontParam = {
    family: string;
    fontSource: string;
    buffer: boolean;
    descriptors?: FontFaceDescriptors;
};

export declare type fullSnapshotEvent = {
    type: EventType.FullSnapshot;
    data: {
        node: serializedNodeWithId;
        initialOffset: {
            top: number;
            left: number;
        };
    };
};

export declare type GetTypedKeys<Obj extends object, ValueType> = TakeTypeHelper<Obj, ValueType>[keyof TakeTypeHelper<Obj, ValueType>];

export declare type Handler = (event?: unknown) => void;

export declare type hookResetter = () => void;

export declare type hooksParam = {
    mutation?: mutationCallBack;
    mousemove?: mousemoveCallBack;
    mouseInteraction?: mouseInteractionCallBack;
    scroll?: scrollCallback;
    viewportResize?: viewportResizeCallback;
    input?: inputCallback;
    mediaInteaction?: mediaInteractionCallback;
    styleSheetRule?: styleSheetRuleCallback;
    styleDeclaration?: styleDeclarationCallback;
    canvasMutation?: canvasMutationCallback;
    font?: fontCallback;
    selection?: selectionCallback;
    customElement?: customElementCallback;
};

export declare interface ICrossOriginIframeMirror {
    getId(iframe: HTMLIFrameElement, remoteId: number, parentToRemoteMap?: Map<number, number>, remoteToParentMap?: Map<number, number>): number;
    getIds(iframe: HTMLIFrameElement, remoteId: number[]): number[];
    getRemoteId(iframe: HTMLIFrameElement, parentId: number, map?: Map<number, number>): number;
    getRemoteIds(iframe: HTMLIFrameElement, parentId: number[]): number[];
    reset(iframe?: HTMLIFrameElement): void;
}

export declare type ImageBitmapDataURLWorkerParams = {
    id: number;
    bitmap: ImageBitmap;
    width: number;
    height: number;
    dataURLOptions: DataURLOptions;
};

export declare type ImageBitmapDataURLWorkerResponse = {
    id: number;
} | {
    id: number;
    type: string;
    base64: string;
    width: number;
    height: number;
};

export declare interface IMirror<TNode> {
    getId(n: TNode | undefined | null): number;
    getNode(id: number): TNode | null;
    getIds(): number[];
    getMeta(n: TNode): serializedNodeWithId | null;
    removeNodeFromMap(n: TNode): void;
    has(id: number): boolean;
    hasNode(node: TNode): boolean;
    add(n: TNode, meta: serializedNodeWithId): void;
    replace(id: number, n: TNode): void;
    reset(): void;
}

export declare type incrementalData = mutationData | mousemoveData | mouseInteractionData | scrollData | viewportResizeData | inputData | mediaInteractionData | styleSheetRuleData | canvasMutationData | fontData | selectionData | styleDeclarationData | adoptedStyleSheetData | customElementData;

export declare type incrementalSnapshotEvent = {
    type: EventType.IncrementalSnapshot;
    data: incrementalData;
};

export declare enum IncrementalSource {
    Mutation = 0,
    MouseMove = 1,
    MouseInteraction = 2,
    Scroll = 3,
    ViewportResize = 4,
    Input = 5,
    TouchMove = 6,
    MediaInteraction = 7,
    StyleSheetRule = 8,
    CanvasMutation = 9,
    Font = 10,
    Log = 11,
    Drag = 12,
    StyleDeclaration = 13,
    Selection = 14,
    AdoptedStyleSheet = 15,
    CustomElement = 16
}

declare interface INode extends Node {
    __sn: serializedNodeWithId;
}

export declare type inputCallback = (v: inputValue & {
    id: number;
}) => void;

export declare type inputData = {
    source: IncrementalSource.Input;
    id: number;
} & inputValue;

export declare type inputValue = {
    text: string;
    isChecked: boolean;
    userTriggered?: boolean;
};

export declare type IWindow = Window & typeof globalThis;

export declare type KeepIframeSrcFn = (src: string) => boolean;

export declare type legacyAttributes = {
    selected: false;
};

export declare type listenerHandler = () => void;

export declare type loadedEvent = {
    type: EventType.Load;
    data: unknown;
};

export declare type maskTextClass = string | RegExp;

export declare type mediaAttributes = {
    rr_mediaState: 'played' | 'paused';
    rr_mediaCurrentTime: number;
    rr_mediaPlaybackRate?: number;
    rr_mediaMuted?: boolean;
    rr_mediaLoop?: boolean;
    rr_mediaVolume?: number;
};

export declare type mediaInteractionCallback = (p: mediaInteractionParam) => void;

export declare type mediaInteractionData = {
    source: IncrementalSource.MediaInteraction;
} & mediaInteractionParam;

export declare type mediaInteractionParam = {
    type: MediaInteractions;
    id: number;
    currentTime?: number;
    volume?: number;
    muted?: boolean;
    loop?: boolean;
    playbackRate?: number;
};

export declare enum MediaInteractions {
    Play = 0,
    Pause = 1,
    Seeked = 2,
    VolumeChange = 3,
    RateChange = 4
}

export declare type metaEvent = {
    type: EventType.Meta;
    data: {
        href: string;
        width: number;
        height: number;
    };
};

export declare type mouseInteractionCallBack = (d: mouseInteractionParam) => void;

export declare type mouseInteractionData = {
    source: IncrementalSource.MouseInteraction;
} & mouseInteractionParam;

declare type mouseInteractionParam = {
    type: MouseInteractions;
    id: number;
    x?: number;
    y?: number;
    pointerType?: PointerTypes;
};

export declare enum MouseInteractions {
    MouseUp = 0,
    MouseDown = 1,
    Click = 2,
    ContextMenu = 3,
    DblClick = 4,
    Focus = 5,
    Blur = 6,
    TouchStart = 7,
    TouchMove_Departed = 8,
    TouchEnd = 9,
    TouchCancel = 10
}

export declare type mousemoveCallBack = (p: mousePosition[], source: IncrementalSource.MouseMove | IncrementalSource.TouchMove | IncrementalSource.Drag) => void;

export declare type mousemoveData = {
    source: IncrementalSource.MouseMove | IncrementalSource.TouchMove | IncrementalSource.Drag;
    positions: mousePosition[];
};

export declare type mouseMovePos = {
    x: number;
    y: number;
    id: number;
    debugData: incrementalData;
};

export declare type mousePosition = {
    x: number;
    y: number;
    id: number;
    timeOffset: number;
};

export declare type mutationCallBack = (m: mutationCallbackParam) => void;

export declare type mutationCallbackParam = {
    texts: textMutation[];
    attributes: attributeMutation[];
    removes: removedNodeMutation[];
    adds: addedNodeMutation[];
    isAttachIframe?: true;
};

export declare type mutationData = {
    source: IncrementalSource.Mutation;
} & mutationCallbackParam;

export declare type mutationRecord = Readonly<{
    type: string;
    target: Node;
    oldValue: string | null;
    addedNodes: NodeList;
    removedNodes: NodeList;
    attributeName: string | null;
}>;

export declare enum NodeType {
    Document = 0,
    DocumentType = 1,
    Element = 2,
    Text = 3,
    CDATA = 4,
    Comment = 5
}

export declare type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export declare type PackFn = (event: eventWithTime) => string;

export declare type playerMetaData = {
    startTime: number;
    endTime: number;
    totalTime: number;
};

export declare type pluginEvent<T = unknown> = {
    type: EventType.Plugin;
    data: {
        plugin: string;
        payload: T;
    };
};

export declare enum PointerTypes {
    Mouse = 0,
    Pen = 1,
    Touch = 2
}

export declare type RecordPlugin<TOptions = unknown> = {
    name: string;
    observer?: (cb: (...args: Array<unknown>) => void, win: IWindow, options: TOptions) => listenerHandler;
    eventProcessor?: <TExtend>(event: eventWithTime) => eventWithTime & TExtend;
    getMirror?: (mirrors: {
        nodeMirror: IMirror<Node>;
        crossOriginIframeMirror: ICrossOriginIframeMirror;
        crossOriginIframeStyleMirror: ICrossOriginIframeMirror;
    }) => void;
    options: TOptions;
};

export declare type removedNodeMutation = {
    parentId: number;
    id: number;
    isShadow?: boolean;
};

export declare enum ReplayerEvents {
    Start = "start",
    Pause = "pause",
    Resume = "resume",
    Resize = "resize",
    Finish = "finish",
    FullsnapshotRebuilded = "fullsnapshot-rebuilded",
    LoadStylesheetStart = "load-stylesheet-start",
    LoadStylesheetEnd = "load-stylesheet-end",
    SkipStart = "skip-start",
    SkipEnd = "skip-end",
    MouseInteraction = "mouse-interaction",
    EventCast = "event-cast",
    CustomEvent = "custom-event",
    Flush = "flush",
    StateChange = "state-change",
    PlayBack = "play-back",
    Destroy = "destroy"
}

export declare type SamplingStrategy = Partial<{
    mousemove: boolean | number;
    mousemoveCallback: number;
    mouseInteraction: boolean | Record<string, boolean | undefined>;
    scroll: number;
    media: number;
    input: 'all' | 'last';
    canvas: 'all' | number;
}>;

export declare type scrollCallback = (p: scrollPosition) => void;

export declare type scrollData = {
    source: IncrementalSource.Scroll;
} & scrollPosition;

export declare type scrollPosition = {
    id: number;
    x: number;
    y: number;
};

export declare type selectionCallback = (p: selectionParam) => void;

export declare type selectionData = {
    source: IncrementalSource.Selection;
} & selectionParam;

export declare type selectionParam = {
    ranges: Array<SelectionRange>;
};

export declare type SelectionRange = {
    start: number;
    startOffset: number;
    end: number;
    endOffset: number;
};

export declare type SerializedCanvasArg = {
    rr_type: 'ArrayBuffer';
    base64: string;
} | {
    rr_type: 'Blob';
    data: Array<CanvasArg>;
    type?: string;
} | {
    rr_type: string;
    src: string;
} | {
    rr_type: string;
    args: Array<CanvasArg>;
} | {
    rr_type: string;
    index: number;
};

export declare type serializedElementNodeWithId = Extract<serializedNodeWithId, Record<'type', NodeType.Element>>;

export declare type serializedNode = (documentNode | documentTypeNode | elementNode | textNode | cdataNode | commentNode) & {
    rootId?: number;
    isShadowHost?: boolean;
    isShadow?: boolean;
};

export declare type serializedNodeWithId = serializedNode & {
    id: number;
};

export declare type styleDeclarationCallback = (s: styleDeclarationParam) => void;

export declare type styleDeclarationData = {
    source: IncrementalSource.StyleDeclaration;
} & styleDeclarationParam;

export declare type styleDeclarationParam = {
    id?: number;
    styleId?: number;
    index: number[];
    set?: {
        property: string;
        value: string | null;
        priority: string | undefined;
    };
    remove?: {
        property: string;
    };
};

export declare type styleOMValue = {
    [key: string]: styleValueWithPriority | string | false;
};

export declare type styleSheetAddRule = {
    rule: string;
    index?: number | number[];
};

export declare type styleSheetDeleteRule = {
    index: number | number[];
};

export declare type styleSheetRuleCallback = (s: styleSheetRuleParam) => void;

export declare type styleSheetRuleData = {
    source: IncrementalSource.StyleSheetRule;
} & styleSheetRuleParam;

export declare type styleSheetRuleParam = {
    id?: number;
    styleId?: number;
    removes?: styleSheetDeleteRule[];
    adds?: styleSheetAddRule[];
    replace?: string;
    replaceSync?: string;
};

export declare type styleValueWithPriority = [string, string];

export declare type TakeTypedKeyValues<Obj extends object, Type> = Pick<Obj, TakeTypeHelper<Obj, Type>[keyof TakeTypeHelper<Obj, Type>]>;

export declare type TakeTypeHelper<Obj extends object, ValueType> = {
    [K in keyof Obj]: Obj[K] extends ValueType ? K : never;
};

export declare type textCursor = {
    node: Node;
    value: string | null;
};

export declare type textMutation = {
    id: number;
    value: string | null;
};

export declare type textNode = {
    type: NodeType.Text;
    textContent: string;
    isStyle?: true;
};

export declare type throttleOptions = {
    leading?: boolean;
    trailing?: boolean;
};

export declare type UnpackFn = (raw: string) => eventWithTime;

export declare type viewportResizeCallback = (d: viewportResizeDimension) => void;

export declare type viewportResizeData = {
    source: IncrementalSource.ViewportResize;
} & viewportResizeDimension;

export declare type viewportResizeDimension = {
    width: number;
    height: number;
};

export { }


declare global {
    interface Window {
        FontFace: typeof FontFace;
    }
}

