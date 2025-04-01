import type { Mirror, serializedNodeWithId } from 'rrweb-snapshot';
import CrossOriginIframeMirror from './cross-origin-iframe-mirror';
import type { eventWithTime, mutationCallBack } from '@rrweb/types';
import type { StylesheetManager } from './stylesheet-manager';
export declare class IframeManager {
    private iframes;
    private crossOriginIframeMap;
    crossOriginIframeMirror: CrossOriginIframeMirror;
    crossOriginIframeStyleMirror: CrossOriginIframeMirror;
    private mirror;
    private mutationCb;
    private wrappedEmit;
    private loadListener?;
    private stylesheetManager;
    private recordCrossOriginIframes;
    constructor(options: {
        mirror: Mirror;
        mutationCb: mutationCallBack;
        stylesheetManager: StylesheetManager;
        recordCrossOriginIframes: boolean;
        wrappedEmit: (e: eventWithTime, isCheckout?: boolean) => void;
    });
    addIframe(iframeEl: HTMLIFrameElement): void;
    addLoadListener(cb: (iframeEl: HTMLIFrameElement) => unknown): void;
    attachIframe(iframeEl: HTMLIFrameElement, childSn: serializedNodeWithId): void;
    private handleMessage;
    private transformCrossOriginEvent;
    private replace;
    private replaceIds;
    private replaceStyleIds;
    private replaceIdOnNode;
}
