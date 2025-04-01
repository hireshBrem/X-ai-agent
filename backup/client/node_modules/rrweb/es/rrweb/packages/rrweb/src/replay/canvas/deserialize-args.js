import { __awaiter } from './../../../../../ext/tslib/tslib.es6.js';
import { decode } from './../../../../../ext/base64-arraybuffer/dist/base64-arraybuffer.es5.js';

const webGLVarMap = new Map();
function variableListFor(ctx, ctor) {
    let contextMap = webGLVarMap.get(ctx);
    if (!contextMap) {
        contextMap = new Map();
        webGLVarMap.set(ctx, contextMap);
    }
    if (!contextMap.has(ctor)) {
        contextMap.set(ctor, []);
    }
    return contextMap.get(ctor);
}
function deserializeArg(imageMap, ctx, preload) {
    return (arg) => __awaiter(this, void 0, void 0, function* () {
        if (arg && typeof arg === 'object' && 'rr_type' in arg) {
            if (preload)
                preload.isUnchanged = false;
            if (arg.rr_type === 'ImageBitmap' && 'args' in arg) {
                const args = yield deserializeArg(imageMap, ctx, preload)(arg.args);
                return yield createImageBitmap.apply(null, args);
            }
            else if ('index' in arg) {
                if (preload || ctx === null)
                    return arg;
                const { rr_type: name, index } = arg;
                return variableListFor(ctx, name)[index];
            }
            else if ('args' in arg) {
                const { rr_type: name, args } = arg;
                const ctor = window[name];
                return new ctor(...(yield Promise.all(args.map(deserializeArg(imageMap, ctx, preload)))));
            }
            else if ('base64' in arg) {
                return decode(arg.base64);
            }
            else if ('src' in arg) {
                const image = imageMap.get(arg.src);
                if (image) {
                    return image;
                }
                else {
                    const image = new Image();
                    image.src = arg.src;
                    imageMap.set(arg.src, image);
                    return image;
                }
            }
            else if ('data' in arg && arg.rr_type === 'Blob') {
                const blobContents = yield Promise.all(arg.data.map(deserializeArg(imageMap, ctx, preload)));
                const blob = new Blob(blobContents, {
                    type: arg.type,
                });
                return blob;
            }
        }
        else if (Array.isArray(arg)) {
            const result = yield Promise.all(arg.map(deserializeArg(imageMap, ctx, preload)));
            return result;
        }
        return arg;
    });
}

export { deserializeArg, variableListFor };
