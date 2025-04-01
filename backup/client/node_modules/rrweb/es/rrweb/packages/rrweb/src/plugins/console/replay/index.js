import { PLUGIN_NAME } from '../record/index.js';
import { EventType, IncrementalSource } from '../../../../../types/dist/types.js';

const ORIGINAL_ATTRIBUTE_NAME = '__rrweb_original__';
const defaultLogConfig = {
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
    replayLogger: undefined,
};
class LogReplayPlugin {
    constructor(config) {
        this.config = Object.assign(defaultLogConfig, config);
    }
    getConsoleLogger() {
        const replayLogger = {};
        for (const level of this.config.level) {
            if (level === 'trace') {
                replayLogger[level] = (data) => {
                    const logger = console.log[ORIGINAL_ATTRIBUTE_NAME]
                        ? console.log[ORIGINAL_ATTRIBUTE_NAME]
                        : console.log;
                    logger(...data.payload.map((s) => JSON.parse(s)), this.formatMessage(data));
                };
            }
            else {
                replayLogger[level] = (data) => {
                    const logger = console[level][ORIGINAL_ATTRIBUTE_NAME]
                        ? console[level][ORIGINAL_ATTRIBUTE_NAME]
                        : console[level];
                    logger(...data.payload.map((s) => JSON.parse(s)), this.formatMessage(data));
                };
            }
        }
        return replayLogger;
    }
    formatMessage(data) {
        if (data.trace.length === 0) {
            return '';
        }
        const stackPrefix = '\n\tat ';
        let result = stackPrefix;
        result += data.trace.join(stackPrefix);
        return result;
    }
}
const getReplayConsolePlugin = (options) => {
    const replayLogger = (options === null || options === void 0 ? void 0 : options.replayLogger) || new LogReplayPlugin(options).getConsoleLogger();
    return {
        handler(event, _isSync, context) {
            let logData = null;
            if (event.type === EventType.IncrementalSnapshot &&
                event.data.source === IncrementalSource.Log) {
                logData = event.data;
            }
            else if (event.type === EventType.Plugin &&
                event.data.plugin === PLUGIN_NAME) {
                logData = event.data.payload;
            }
            if (logData) {
                try {
                    if (typeof replayLogger[logData.level] === 'function') {
                        replayLogger[logData.level](logData);
                    }
                }
                catch (error) {
                    if (context.replayer.config.showWarning) {
                        console.warn(error);
                    }
                }
            }
        },
    };
};

export { getReplayConsolePlugin };
