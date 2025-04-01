import { __awaiter } from './../../../../../ext/tslib/tslib.es6.js';
import { CanvasContext } from '../../../../types/dist/types.js';
import { deserializeArg, variableListFor } from './deserialize-args.js';

function getContext(target, type) {
    try {
        if (type === CanvasContext.WebGL) {
            return (target.getContext('webgl') || target.getContext('experimental-webgl'));
        }
        return target.getContext('webgl2');
    }
    catch (e) {
        return null;
    }
}
const WebGLVariableConstructorsNames = [
    'WebGLActiveInfo',
    'WebGLBuffer',
    'WebGLFramebuffer',
    'WebGLProgram',
    'WebGLRenderbuffer',
    'WebGLShader',
    'WebGLShaderPrecisionFormat',
    'WebGLTexture',
    'WebGLUniformLocation',
    'WebGLVertexArrayObject',
];
function saveToWebGLVarMap(ctx, result) {
    if (!(result === null || result === void 0 ? void 0 : result.constructor))
        return;
    const { name } = result.constructor;
    if (!WebGLVariableConstructorsNames.includes(name))
        return;
    const variables = variableListFor(ctx, name);
    if (!variables.includes(result))
        variables.push(result);
}
function webglMutation({ mutation, target, type, imageMap, errorHandler, }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ctx = getContext(target, type);
            if (!ctx)
                return;
            if (mutation.setter) {
                ctx[mutation.property] = mutation.args[0];
                return;
            }
            const original = ctx[mutation.property];
            const args = yield Promise.all(mutation.args.map(deserializeArg(imageMap, ctx)));
            const result = original.apply(ctx, args);
            saveToWebGLVarMap(ctx, result);
            const debugMode = false;
            if (debugMode) ;
        }
        catch (error) {
            errorHandler(mutation, error);
        }
    });
}

export { webglMutation as default };
