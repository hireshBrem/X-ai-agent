import { NodeType, serializedNodeWithId } from 'rrweb-snapshot';
import { NWSAPI } from 'nwsapi';
export declare abstract class RRNode {
    __sn: serializedNodeWithId | undefined;
    children: Array<RRNode>;
    parentElement: RRElement | null;
    parentNode: RRNode | null;
    ownerDocument: RRDocument | null;
    ELEMENT_NODE: number;
    TEXT_NODE: number;
    get firstChild(): RRNode;
    get nodeType(): NodeType | undefined;
    get childNodes(): RRNode[];
    appendChild(newChild: RRNode): RRNode;
    insertBefore(newChild: RRNode, refChild: RRNode | null): RRNode;
    contains(node: RRNode): boolean;
    removeChild(node: RRNode): void;
    toString(nodeName?: string): string;
}
export declare class RRWindow {
    scrollLeft: number;
    scrollTop: number;
    scrollTo(options?: ScrollToOptions): void;
}
export declare class RRDocument extends RRNode {
    private mirror;
    private _nwsapi;
    get nwsapi(): NWSAPI;
    get documentElement(): RRElement;
    get body(): RRNode | null;
    get head(): RRNode | null;
    get implementation(): this;
    get firstElementChild(): RRElement;
    appendChild(childNode: RRNode): RRNode;
    insertBefore(newChild: RRNode, refChild: RRNode | null): RRNode;
    querySelectorAll(selectors: string): RRNode[];
    getElementsByTagName(tagName: string): RRElement[];
    getElementsByClassName(className: string): RRElement[];
    getElementById(elementId: string): RRElement | null;
    createDocument(_namespace: string | null, _qualifiedName: string | null, _doctype?: DocumentType | null): RRDocument;
    createDocumentType(qualifiedName: string, publicId: string, systemId: string): RRDocumentType;
    createElement<K extends keyof HTMLElementTagNameMap>(tagName: K): RRElementType<K>;
    createElement(tagName: string): RRElement;
    createElementNS(_namespaceURI: 'http://www.w3.org/2000/svg', qualifiedName: string): RRElement | RRMediaElement | RRImageElement;
    createComment(data: string): RRComment;
    createCDATASection(data: string): RRCDATASection;
    createTextNode(data: string): RRText;
    open(): void;
    close(): void;
    buildFromDom(dom: Document): void;
    destroyTree(): void;
    toString(): string;
}
export declare class RRDocumentType extends RRNode {
    readonly name: string;
    readonly publicId: string;
    readonly systemId: string;
    constructor(qualifiedName: string, publicId: string, systemId: string);
    toString(): string;
}
export declare class RRElement extends RRNode {
    tagName: string;
    attributes: Record<string, string | number | boolean>;
    scrollLeft: number;
    scrollTop: number;
    shadowRoot: RRElement | null;
    constructor(tagName: string);
    get classList(): ClassList;
    get id(): string | number | boolean;
    get className(): string | number | true;
    get textContent(): string;
    set textContent(newText: string);
    get style(): Record<string, string> & {
        setProperty: (name: string, value: string | null, priority?: string | null | undefined) => void;
    };
    get firstElementChild(): RRElement | null;
    get nextElementSibling(): RRElement | null;
    getAttribute(name: string): string | number | boolean | null;
    setAttribute(name: string, attribute: string): void;
    hasAttribute(name: string): boolean;
    setAttributeNS(_namespace: string | null, qualifiedName: string, value: string): void;
    removeAttribute(name: string): void;
    appendChild(newChild: RRNode): RRNode;
    insertBefore(newChild: RRNode, refChild: RRNode | null): RRNode;
    querySelectorAll(selectors: string): RRNode[];
    getElementById(elementId: string): RRElement | null;
    getElementsByClassName(className: string): RRElement[];
    getElementsByTagName(tagName: string): RRElement[];
    dispatchEvent(_event: Event): boolean;
    attachShadow(init: ShadowRootInit): RRElement;
    toString(): string;
}
export declare class RRImageElement extends RRElement {
    src: string;
    width: number;
    height: number;
    onload: ((this: GlobalEventHandlers, ev: Event) => any) | null;
}
export declare class RRMediaElement extends RRElement {
    currentTime: number;
    paused: boolean;
    play(): Promise<void>;
    pause(): Promise<void>;
}
export declare class RRCanvasElement extends RRElement {
    getContext(): CanvasRenderingContext2D | null;
}
export declare class RRStyleElement extends RRElement {
    private _sheet;
    get sheet(): CSSStyleSheet | null;
}
export declare class RRIframeElement extends RRElement {
    width: string;
    height: string;
    src: string;
    contentDocument: RRDocument;
    contentWindow: RRWindow;
    constructor(tagName: string);
}
export declare class RRText extends RRNode {
    textContent: string;
    constructor(data: string);
    toString(): string;
}
export declare class RRComment extends RRNode {
    data: string;
    constructor(data: string);
    toString(): string;
}
export declare class RRCDATASection extends RRNode {
    data: string;
    constructor(data: string);
    toString(): string;
}
interface RRElementTagNameMap {
    img: RRImageElement;
    audio: RRMediaElement;
    video: RRMediaElement;
}
declare type RRElementType<K extends keyof HTMLElementTagNameMap> = K extends keyof RRElementTagNameMap ? RRElementTagNameMap[K] : RRElement;
declare class ClassList extends Array {
    private onChange;
    constructor(classText?: string, onChange?: ((newClassText: string) => void) | undefined);
    add: (...classNames: string[]) => void;
    remove: (...classNames: string[]) => void;
}
export {};
