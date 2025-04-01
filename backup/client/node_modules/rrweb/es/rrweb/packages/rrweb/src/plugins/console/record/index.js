import { patch } from '../../../utils.js';
import { ErrorStackParser } from './error-stack-parser.js';
import { stringify } from './stringify.js';

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

export { PLUGIN_NAME, getRecordConsolePlugin };
