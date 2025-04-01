import type { serializedNodeWithId } from 'rrweb-snapshot';
import type { adoptedStyleSheetCallback, mutationCallBack } from '@rrweb/types';
import { StyleSheetMirror } from '../utils';
export declare class StylesheetManager {
    private trackedLinkElements;
    private mutationCb;
    private adoptedStyleSheetCb;
    styleMirror: StyleSheetMirror;
    constructor(options: {
        mutationCb: mutationCallBack;
        adoptedStyleSheetCb: adoptedStyleSheetCallback;
    });
    attachLinkElement(linkEl: HTMLLinkElement, childSn: serializedNodeWithId): void;
    trackLinkElement(linkEl: HTMLLinkElement): void;
    adoptStyleSheets(sheets: CSSStyleSheet[], hostId: number): void;
    reset(): void;
    private trackStylesheetInLinkElement;
}
