import { CanvasContext } from '../../../../../types/dist/types.js';
import { patch, isBlocked, hookSetter } from '../../../utils.js';
import { serializeArgs } from './serialize-args.js';

function initCanvas2DMutationObserver(cb, win, blockClass, blockSelector) {
    const handlers = [];
    const props2D = Object.getOwnPropertyNames(win.CanvasRenderingContext2D.prototype);
    for (const prop of props2D) {
        try {
            if (typeof win.CanvasRenderingContext2D.prototype[prop] !== 'function') {
                continue;
            }
            const restoreHandler = patch(win.CanvasRenderingContext2D.prototype, prop, function (original) {
                return function (...args) {
                    if (!isBlocked(this.canvas, blockClass, blockSelector, true)) {
                        setTimeout(() => {
                            const recordArgs = serializeArgs([...args], win, this);
                            cb(this.canvas, {
                                type: CanvasContext['2D'],
                                property: prop,
                                args: recordArgs,
                            });
                        }, 0);
                    }
                    return original.apply(this, args);
                };
            });
            handlers.push(restoreHandler);
        }
        catch (_a) {
            const hookHandler = hookSetter(win.CanvasRenderingContext2D.prototype, prop, {
                set(v) {
                    cb(this.canvas, {
                        type: CanvasContext['2D'],
                        property: prop,
                        args: [v],
                        setter: true,
                    });
                },
            });
            handlers.push(hookHandler);
        }
    }
    return () => {
        handlers.forEach((h) => h());
    };
}

export { initCanvas2DMutationObserver as default };
