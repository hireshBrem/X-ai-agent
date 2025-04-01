'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var NodeType;
(function (NodeType) {
    NodeType[NodeType["Document"] = 0] = "Document";
    NodeType[NodeType["DocumentType"] = 1] = "DocumentType";
    NodeType[NodeType["Element"] = 2] = "Element";
    NodeType[NodeType["Text"] = 3] = "Text";
    NodeType[NodeType["CDATA"] = 4] = "CDATA";
    NodeType[NodeType["Comment"] = 5] = "Comment";
})(NodeType || (NodeType = {}));

const DEPARTED_MIRROR_ACCESS_WARNING = 'Please stop import mirror directly. Instead of that,' +
    '\r\n' +
    'now you can use replayer.getMirror() to access the mirror instance of a replayer,' +
    '\r\n' +
    'or you can use record.mirror to access the mirror instance during recording.';
let _mirror = {
    map: {},
    getId() {
        console.error(DEPARTED_MIRROR_ACCESS_WARNING);
        return -1;
    },
    getNode() {
        console.error(DEPARTED_MIRROR_ACCESS_WARNING);
        return null;
    },
    removeNodeFromMap() {
        console.error(DEPARTED_MIRROR_ACCESS_WARNING);
    },
    has() {
        console.error(DEPARTED_MIRROR_ACCESS_WARNING);
        return false;
    },
    reset() {
        console.error(DEPARTED_MIRROR_ACCESS_WARNING);
    },
};
if (typeof window !== 'undefined' && window.Proxy && window.Reflect) {
    _mirror = new Proxy(_mirror, {
        get(target, prop, receiver) {
            if (prop === 'map') {
                console.error(DEPARTED_MIRROR_ACCESS_WARNING);
            }
            return Reflect.get(target, prop, receiver);
        },
    });
}
function patch(source, name, replacement) {
    try {
        if (!(name in source)) {
            return () => {
            };
        }
        const original = source[name];
        const wrapped = replacement(original);
        if (typeof wrapped === 'function') {
            wrapped.prototype = wrapped.prototype || {};
            Object.defineProperties(wrapped, {
                __rrweb_original__: {
                    enumerable: false,
                    value: original,
                },
            });
        }
        source[name] = wrapped;
        return () => {
            source[name] = original;
        };
    }
    catch (_a) {
        return () => {
        };
    }
}

class StackFrame {
    constructor(obj) {
        this.fileName = obj.fileName || '';
        this.functionName = obj.functionName || '';
        this.lineNumber = obj.lineNumber;
        this.columnNumber = obj.columnNumber;
    }
    toString() {
        const lineNumber = this.lineNumber || '';
        const columnNumber = this.columnNumber || '';
        if (this.functionName)
            return `${this.functionName} (${this.fileName}:${lineNumber}:${columnNumber})`;
        return `${this.fileName}:${lineNumber}:${columnNumber}`;
    }
}
const FIREFOX_SAFARI_STACK_REGEXP = /(^|@)\S+:\d+/;
const CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+:\d+|\(native\))/m;
const SAFARI_NATIVE_CODE_REGEXP = /^(eval@)?(\[native code])?$/;
const ErrorStackParser = {
    parse: function (error) {
        if (!error) {
            return [];
        }
        if (typeof error.stacktrace !== 'undefined' ||
            typeof error['opera#sourceloc'] !== 'undefined') {
            return this.parseOpera(error);
        }
        else if (error.stack && error.stack.match(CHROME_IE_STACK_REGEXP)) {
            return this.parseV8OrIE(error);
        }
        else if (error.stack) {
            return this.parseFFOrSafari(error);
        }
        else {
            throw new Error('Cannot parse given Error object');
        }
    },
    extractLocation: function (urlLike) {
        if (urlLike.indexOf(':') === -1) {
            return [urlLike];
        }
        const regExp = /(.+?)(?::(\d+))?(?::(\d+))?$/;
        const parts = regExp.exec(urlLike.replace(/[()]/g, ''));
        if (!parts)
            throw new Error(`Cannot parse given url: ${urlLike}`);
        return [parts[1], parts[2] || undefined, parts[3] || undefined];
    },
    parseV8OrIE: function (error) {
        const filtered = error.stack.split('\n').filter(function (line) {
            return !!line.match(CHROME_IE_STACK_REGEXP);
        }, this);
        return filtered.map(function (line) {
            if (line.indexOf('(eval ') > -1) {
                line = line
                    .replace(/eval code/g, 'eval')
                    .replace(/(\(eval at [^()]*)|(\),.*$)/g, '');
            }
            let sanitizedLine = line.replace(/^\s+/, '').replace(/\(eval code/g, '(');
            const location = sanitizedLine.match(/ (\((.+):(\d+):(\d+)\)$)/);
            sanitizedLine = location
                ? sanitizedLine.replace(location[0], '')
                : sanitizedLine;
            const tokens = sanitizedLine.split(/\s+/).slice(1);
            const locationParts = this.extractLocation(location ? location[1] : tokens.pop());
            const functionName = tokens.join(' ') || undefined;
            const fileName = ['eval', '<anonymous>'].indexOf(locationParts[0]) > -1
                ? undefined
                : locationParts[0];
            return new StackFrame({
                functionName,
                fileName,
                lineNumber: locationParts[1],
                columnNumber: locationParts[2],
            });
        }, this);
    },
    parseFFOrSafari: function (error) {
        const filtered = error.stack.split('\n').filter(function (line) {
            return !line.match(SAFARI_NATIVE_CODE_REGEXP);
        }, this);
        return filtered.map(function (line) {
            if (line.indexOf(' > eval') > -1) {
                line = line.replace(/ line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g, ':$1');
            }
            if (line.indexOf('@') === -1 && line.indexOf(':') === -1) {
                return new StackFrame({
                    functionName: line,
                });
            }
            else {
                const functionNameRegex = /((.*".+"[^@]*)?[^@]*)(?:@)/;
                const matches = line.match(functionNameRegex);
                const functionName = matches && matches[1] ? matches[1] : undefined;
                const locationParts = this.extractLocation(line.replace(functionNameRegex, ''));
                return new StackFrame({
                    functionName,
                    fileName: locationParts[0],
                    lineNumber: locationParts[1],
                    columnNumber: locationParts[2],
                });
            }
        }, this);
    },
    parseOpera: function (e) {
        if (!e.stacktrace ||
            (e.message.indexOf('\n') > -1 &&
                e.message.split('\n').length > e.stacktrace.split('\n').length)) {
            return this.parseOpera9(e);
        }
        else if (!e.stack) {
            return this.parseOpera10(e);
        }
        else {
            return this.parseOpera11(e);
        }
    },
    parseOpera9: function (e) {
        const lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
        const lines = e.message.split('\n');
        const result = [];
        for (let i = 2, len = lines.length; i < len; i += 2) {
            const match = lineRE.exec(lines[i]);
            if (match) {
                result.push(new StackFrame({
                    fileName: match[2],
                    lineNumber: parseFloat(match[1]),
                }));
            }
        }
        return result;
    },
    parseOpera10: function (e) {
        const lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
        const lines = e.stacktrace.split('\n');
        const result = [];
        for (let i = 0, len = lines.length; i < len; i += 2) {
            const match = lineRE.exec(lines[i]);
            if (match) {
                result.push(new StackFrame({
                    functionName: match[3] || undefined,
                    fileName: match[2],
                    lineNumber: parseFloat(match[1]),
                }));
            }
        }
        return result;
    },
    parseOpera11: function (error) {
        const filtered = error.stack.split('\n').filter(function (line) {
            return (!!line.match(FIREFOX_SAFARI_STACK_REGEXP) &&
                !line.match(/^Error created at/));
        }, this);
        return filtered.map(function (line) {
            const tokens = line.split('@');
            const locationParts = this.extractLocation(tokens.pop());
            const functionCall = tokens.shift() || '';
            const functionName = functionCall
                .replace(/<anonymous function(: (\w+))?>/, '$2')
                .replace(/\([^)]*\)/g, '') || undefined;
            return new StackFrame({
                functionName,
                fileName: locationParts[0],
                lineNumber: locationParts[1],
                columnNumber: locationParts[2],
            });
        }, this);
    },
};

function pathToSelector(node) {
    if (!node || !node.outerHTML) {
        return '';
    }
    let path = '';
    while (node.parentElement) {
        let name = node.localName;
        if (!name) {
            break;
        }
        name = name.toLowerCase();
        const parent = node.parentElement;
        const domSiblings = [];
        if (parent.children && parent.children.length > 0) {
            for (let i = 0; i < parent.children.length; i++) {
                const sibling = parent.children[i];
                if (sibling.localName && sibling.localName.toLowerCase) {
                    if (sibling.localName.toLowerCase() === name) {
                        domSiblings.push(sibling);
                    }
                }
            }
        }
        if (domSiblings.length > 1) {
            name += `:eq(${domSiblings.indexOf(node)})`;
        }
        path = name + (path ? '>' + path : '');
        node = parent;
    }
    return path;
}
function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}
function isObjTooDeep(obj, limit) {
    if (limit === 0) {
        return true;
    }
    const keys = Object.keys(obj);
    for (const key of keys) {
        if (isObject(obj[key]) &&
            isObjTooDeep(obj[key], limit - 1)) {
            return true;
        }
    }
    return false;
}
function stringify(obj, stringifyOptions) {
    const options = {
        numOfKeysLimit: 50,
        depthOfLimit: 4,
    };
    Object.assign(options, stringifyOptions);
    const stack = [];
    const keys = [];
    return JSON.stringify(obj, function (key, value) {
        if (stack.length > 0) {
            const thisPos = stack.indexOf(this);
            ~thisPos ? stack.splice(thisPos + 1) : stack.push(this);
            ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key);
            if (~stack.indexOf(value)) {
                if (stack[0] === value) {
                    value = '[Circular ~]';
                }
                else {
                    value =
                        '[Circular ~.' +
                            keys.slice(0, stack.indexOf(value)).join('.') +
                            ']';
                }
            }
        }
        else {
            stack.push(value);
        }
        if (value === null)
            return value;
        if (value === undefined)
            return 'undefined';
        if (shouldIgnore(value)) {
            return toString(value);
        }
        if (value instanceof Event) {
            const eventResult = {};
            for (const eventKey in value) {
                const eventValue = value[eventKey];
                if (Array.isArray(eventValue)) {
                    eventResult[eventKey] = pathToSelector((eventValue.length ? eventValue[0] : null));
                }
                else {
                    eventResult[eventKey] = eventValue;
                }
            }
            return eventResult;
        }
        else if (value instanceof Node) {
            if (value instanceof HTMLElement) {
                return value ? value.outerHTML : '';
            }
            return value.nodeName;
        }
        else if (value instanceof Error) {
            return value.stack
                ? value.stack + '\nEnd of stack for Error object'
                : value.name + ': ' + value.message;
        }
        return value;
    });
    function shouldIgnore(_obj) {
        if (isObject(_obj) && Object.keys(_obj).length > options.numOfKeysLimit) {
            return true;
        }
        if (typeof _obj === 'function') {
            return true;
        }
        if (isObject(_obj) &&
            isObjTooDeep(_obj, options.depthOfLimit)) {
            return true;
        }
        return false;
    }
    function toString(_obj) {
        let str = _obj.toString();
        if (options.stringLengthLimit && str.length > options.stringLengthLimit) {
            str = `${str.slice(0, options.stringLengthLimit)}...`;
        }
        return str;
    }
}

const defaultLogOptions = {
    level: [
        'assert',
        'clear',
        'count',
        'countReset',
        'debug',
        'dir',
        'dirxml',
        'error',
        'group',
        'groupCollapsed',
        'groupEnd',
        'info',
        'log',
        'table',
        'time',
        'timeEnd',
        'timeLog',
        'trace',
        'warn',
    ],
    lengthThreshold: 1000,
    logger: 'console',
};
function initLogObserver(cb, win, options) {
    const logOptions = (options
        ? Object.assign({}, defaultLogOptions, options)
        : defaultLogOptions);
    const loggerType = logOptions.logger;
    if (!loggerType) {
        return () => {
        };
    }
    let logger;
    if (typeof loggerType === 'string') {
        logger = win[loggerType];
    }
    else {
        logger = loggerType;
    }
    let logCount = 0;
    const cancelHandlers = [];
    if (logOptions.level.includes('error')) {
        if (window) {
            const errorHandler = (event) => {
                const message = event.message, error = event.error;
                const trace = ErrorStackParser.parse(error).map((stackFrame) => stackFrame.toString());
                const payload = [stringify(message, logOptions.stringifyOptions)];
                cb({
                    level: 'error',
                    trace,
                    payload,
                });
            };
            window.addEventListener('error', errorHandler);
            cancelHandlers.push(() => {
                if (window)
                    window.removeEventListener('error', errorHandler);
            });
        }
    }
    for (const levelType of logOptions.level) {
        cancelHandlers.push(replace(logger, levelType));
    }
    return () => {
        cancelHandlers.forEach((h) => h());
    };
    function replace(_logger, level) {
        if (!_logger[level]) {
            return () => {
            };
        }
        return patch(_logger, level, (original) => {
            return (...args) => {
                original.apply(this, args);
                try {
                    const trace = ErrorStackParser.parse(new Error())
                        .map((stackFrame) => stackFrame.toString())
                        .splice(1);
                    const payload = args.map((s) => stringify(s, logOptions.stringifyOptions));
                    logCount++;
                    if (logCount < logOptions.lengthThreshold) {
                        cb({
                            level,
                            trace,
                            payload,
                        });
                    }
                    else if (logCount === logOptions.lengthThreshold) {
                        cb({
                            level: 'warn',
                            trace: [],
                            payload: [
                                stringify('The number of log records reached the threshold.'),
                            ],
                        });
                    }
                }
                catch (error) {
                    original('rrweb logger error:', error, ...args);
                }
            };
        });
    }
}
const PLUGIN_NAME = 'rrweb/console@1';
const getRecordConsolePlugin = (options) => ({
    name: PLUGIN_NAME,
    observer: initLogObserver,
    options: options,
});

exports.PLUGIN_NAME = PLUGIN_NAME;
exports.getRecordConsolePlugin = getRecordConsolePlugin;
