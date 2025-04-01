import type { ReplayPlugin } from '../../../types';
export declare class RRWebPluginCanvasWebRTCReplay {
    private canvasFoundCallback;
    private signalSendCallback;
    private mirror;
    constructor({ canvasFoundCallback, signalSendCallback, }: {
        canvasFoundCallback: RRWebPluginCanvasWebRTCReplay['canvasFoundCallback'];
        signalSendCallback: RRWebPluginCanvasWebRTCReplay['signalSendCallback'];
    });
    initPlugin(): ReplayPlugin;
    private startStream;
    private peer;
    private streamNodeMap;
    private streams;
    private runningStreams;
    signalReceive(msg: RTCSessionDescriptionInit): void;
    private flushStreams;
}
