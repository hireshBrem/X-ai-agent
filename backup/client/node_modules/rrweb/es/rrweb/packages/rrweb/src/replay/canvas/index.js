import { __awaiter } from './../../../../../ext/tslib/tslib.es6.js';
import { CanvasContext } from '../../../../types/dist/types.js';
import webglMutation from './webgl.js';
import canvasMutation$1 from './2d.js';

function canvasMutation({ event, mutation, target, imageMap, canvasEventMap, errorHandler, }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const precomputedMutation = canvasEventMap.get(event) || mutation;
            const commands = 'commands' in precomputedMutation
                ? precomputedMutation.commands
                : [precomputedMutation];
            if ([CanvasContext.WebGL, CanvasContext.WebGL2].includes(mutation.type)) {
                for (let i = 0; i < commands.length; i++) {
                    const command = commands[i];
                    yield webglMutation({
                        mutation: command,
                        type: mutation.type,
                        target,
                        imageMap,
                        errorHandler,
                    });
                }
                return;
            }
            for (let i = 0; i < commands.length; i++) {
                const command = commands[i];
                yield canvasMutation$1({
                    event,
                    mutation: command,
                    target,
                    imageMap,
                    errorHandler,
                });
            }
        }
        catch (error) {
            errorHandler(mutation, error);
        }
    });
}

export { canvasMutation as default };
