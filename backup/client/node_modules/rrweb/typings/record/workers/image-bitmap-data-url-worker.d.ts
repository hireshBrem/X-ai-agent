import type { ImageBitmapDataURLWorkerParams, ImageBitmapDataURLWorkerResponse } from '@rrweb/types';
export interface ImageBitmapDataURLRequestWorker {
    postMessage: (message: ImageBitmapDataURLWorkerParams, transfer?: [ImageBitmap]) => void;
    onmessage: (message: MessageEvent<ImageBitmapDataURLWorkerResponse>) => void;
}
