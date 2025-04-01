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

export { stringify };
