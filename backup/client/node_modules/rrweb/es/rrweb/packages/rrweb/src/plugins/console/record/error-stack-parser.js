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

export { ErrorStackParser, StackFrame };
