import { __awaiter } from './../../../../../ext/tslib/tslib.es6.js';
import { deserializeArg } from './deserialize-args.js';

function canvasMutation({ event, mutation, target, imageMap, errorHandler, }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ctx = target.getContext('2d');
            if (mutation.setter) {
                ctx[mutation.property] =
                    mutation.args[0];
                return;
            }
            const original = ctx[mutation.property];
            if (mutation.property === 'drawImage' &&
                typeof mutation.args[0] === 'string') {
                imageMap.get(event);
                original.apply(ctx, mutation.args);
            }
            else {
                const args = yield Promise.all(mutation.args.map(deserializeArg(imageMap, ctx)));
                original.apply(ctx, args);
            }
        }
        catch (error) {
            errorHandler(mutation, error);
        }
    });
}

export { canvasMutation as default };
