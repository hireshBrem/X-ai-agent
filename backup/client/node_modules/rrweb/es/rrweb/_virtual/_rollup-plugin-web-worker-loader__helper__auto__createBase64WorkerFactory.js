import { createBase64WorkerFactory as createBase64WorkerFactory$1 } from './_rollup-plugin-web-worker-loader__helper__node__createBase64WorkerFactory.js';
import { createBase64WorkerFactory as createBase64WorkerFactory$2 } from './_rollup-plugin-web-worker-loader__helper__browser__createBase64WorkerFactory.js';
import { isNodeJS } from './_rollup-plugin-web-worker-loader__helper__auto__isNodeJS.js';

function createBase64WorkerFactory(base64, sourcemapArg, enableUnicodeArg) {
    if (isNodeJS()) {
        return createBase64WorkerFactory$1(base64, sourcemapArg, enableUnicodeArg);
    }
    return createBase64WorkerFactory$2(base64, sourcemapArg, enableUnicodeArg);
}

export { createBase64WorkerFactory };
