import { patch, isBlocked } from '../../../utils.js';

function initCanvasContextObserver(win, blockClass, blockSelector) {
    const handlers = [];
    try {
        const restoreHandler = patch(win.HTMLCanvasElement.prototype, 'getContext', function (original) {
            return function (contextType, ...args) {
                if (!isBlocked(this, blockClass, blockSelector, true)) {
                    if (!('__context' in this))
                        this.__context = contextType;
                }
                return original.apply(this, [contextType, ...args]);
            };
        });
        handlers.push(restoreHandler);
    }
    catch (_a) {
        console.error('failed to patch HTMLCanvasElement.prototype.getContext');
    }
    return () => {
        handlers.forEach((h) => h());
    };
}

export { initCanvasContextObserver as default };
