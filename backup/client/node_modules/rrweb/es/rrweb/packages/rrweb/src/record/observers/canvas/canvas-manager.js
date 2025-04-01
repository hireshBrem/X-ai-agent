import { __rest, __awaiter } from './../../../../../../ext/tslib/tslib.es6.js';
import { isBlocked } from '../../../utils.js';
import { CanvasContext } from '../../../../../types/dist/types.js';
import initCanvas2DMutationObserver from './2d.js';
import initCanvasContextObserver from './canvas.js';
import initCanvasWebGLMutationObserver from './webgl.js';
import WorkerFactory from '../../../../../../_virtual/image-bitmap-data-url-worker.js';

class CanvasManager {
    constructor(options) {
        this.pendingCanvasMutations = new Map();
        this.rafStamps = { latestId: 0, invokeId: null };
        this.frozen = false;
        this.locked = false;
        this.processMutation = (target, mutation) => {
            const newFrame = this.rafStamps.invokeId &&
                this.rafStamps.latestId !== this.rafStamps.invokeId;
            if (newFrame || !this.rafStamps.invokeId)
                this.rafStamps.invokeId = this.rafStamps.latestId;
            if (!this.pendingCanvasMutations.has(target)) {
                this.pendingCanvasMutations.set(target, []);
            }
            this.pendingCanvasMutations.get(target).push(mutation);
        };
        const { sampling = 'all', win, blockClass, blockSelector, recordCanvas, dataURLOptions, } = options;
        this.mutationCb = options.mutationCb;
        this.mirror = options.mirror;
        if (recordCanvas && sampling === 'all')
            this.initCanvasMutationObserver(win, blockClass, blockSelector);
        if (recordCanvas && typeof sampling === 'number')
            this.initCanvasFPSObserver(sampling, win, blockClass, blockSelector, {
                dataURLOptions,
            });
    }
    reset() {
        this.pendingCanvasMutations.clear();
        this.resetObservers && this.resetObservers();
    }
    freeze() {
        this.frozen = true;
    }
    unfreeze() {
        this.frozen = false;
    }
    lock() {
        this.locked = true;
    }
    unlock() {
        this.locked = false;
    }
    initCanvasFPSObserver(fps, win, blockClass, blockSelector, options) {
        const canvasContextReset = initCanvasContextObserver(win, blockClass, blockSelector);
        const snapshotInProgressMap = new Map();
        const worker = new WorkerFactory();
        worker.onmessage = (e) => {
            const { id } = e.data;
            snapshotInProgressMap.set(id, false);
            if (!('base64' in e.data))
                return;
            const { base64, type, width, height } = e.data;
            this.mutationCb({
                id,
                type: CanvasContext['2D'],
                commands: [
                    {
                        property: 'clearRect',
                        args: [0, 0, width, height],
                    },
                    {
                        property: 'drawImage',
                        args: [
                            {
                                rr_type: 'ImageBitmap',
                                args: [
                                    {
                                        rr_type: 'Blob',
                                        data: [{ rr_type: 'ArrayBuffer', base64 }],
                                        type,
                                    },
                                ],
                            },
                            0,
                            0,
                        ],
                    },
                ],
            });
        };
        const timeBetweenSnapshots = 1000 / fps;
        let lastSnapshotTime = 0;
        let rafId;
        const getCanvas = () => {
            const matchedCanvas = [];
            win.document.querySelectorAll('canvas').forEach((canvas) => {
                if (!isBlocked(canvas, blockClass, blockSelector, true)) {
                    matchedCanvas.push(canvas);
                }
            });
            return matchedCanvas;
        };
        const takeCanvasSnapshots = (timestamp) => {
            if (lastSnapshotTime &&
                timestamp - lastSnapshotTime < timeBetweenSnapshots) {
                rafId = requestAnimationFrame(takeCanvasSnapshots);
                return;
            }
            lastSnapshotTime = timestamp;
            getCanvas()
                .forEach((canvas) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const id = this.mirror.getId(canvas);
                if (snapshotInProgressMap.get(id))
                    return;
                snapshotInProgressMap.set(id, true);
                if (['webgl', 'webgl2'].includes(canvas.__context)) {
                    const context = canvas.getContext(canvas.__context);
                    if (((_a = context === null || context === void 0 ? void 0 : context.getContextAttributes()) === null || _a === void 0 ? void 0 : _a.preserveDrawingBuffer) === false) {
                        context === null || context === void 0 ? void 0 : context.clear(context.COLOR_BUFFER_BIT);
                    }
                }
                const bitmap = yield createImageBitmap(canvas);
                worker.postMessage({
                    id,
                    bitmap,
                    width: canvas.width,
                    height: canvas.height,
                    dataURLOptions: options.dataURLOptions,
                }, [bitmap]);
            }));
            rafId = requestAnimationFrame(takeCanvasSnapshots);
        };
        rafId = requestAnimationFrame(takeCanvasSnapshots);
        this.resetObservers = () => {
            canvasContextReset();
            cancelAnimationFrame(rafId);
        };
    }
    initCanvasMutationObserver(win, blockClass, blockSelector) {
        this.startRAFTimestamping();
        this.startPendingCanvasMutationFlusher();
        const canvasContextReset = initCanvasContextObserver(win, blockClass, blockSelector);
        const canvas2DReset = initCanvas2DMutationObserver(this.processMutation.bind(this), win, blockClass, blockSelector);
        const canvasWebGL1and2Reset = initCanvasWebGLMutationObserver(this.processMutation.bind(this), win, blockClass, blockSelector, this.mirror);
        this.resetObservers = () => {
            canvasContextReset();
            canvas2DReset();
            canvasWebGL1and2Reset();
        };
    }
    startPendingCanvasMutationFlusher() {
        requestAnimationFrame(() => this.flushPendingCanvasMutations());
    }
    startRAFTimestamping() {
        const setLatestRAFTimestamp = (timestamp) => {
            this.rafStamps.latestId = timestamp;
            requestAnimationFrame(setLatestRAFTimestamp);
        };
        requestAnimationFrame(setLatestRAFTimestamp);
    }
    flushPendingCanvasMutations() {
        this.pendingCanvasMutations.forEach((values, canvas) => {
            const id = this.mirror.getId(canvas);
            this.flushPendingCanvasMutationFor(canvas, id);
        });
        requestAnimationFrame(() => this.flushPendingCanvasMutations());
    }
    flushPendingCanvasMutationFor(canvas, id) {
        if (this.frozen || this.locked) {
            return;
        }
        const valuesWithType = this.pendingCanvasMutations.get(canvas);
        if (!valuesWithType || id === -1)
            return;
        const values = valuesWithType.map((value) => {
            const rest = __rest(value, ["type"]);
            return rest;
        });
        const { type } = valuesWithType[0];
        this.mutationCb({ id, type, commands: values });
        this.pendingCanvasMutations.delete(canvas);
    }
}

export { CanvasManager };
