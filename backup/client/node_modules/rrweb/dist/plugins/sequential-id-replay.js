var rrwebSequentialIdReplay = (function (exports) {
  'use strict';

  const defaultOptions = {
    key: "_sid",
    warnOnMissingId: true
  };
  const getReplaySequentialIdPlugin = (options) => {
    const { key, warnOnMissingId } = options ? Object.assign({}, defaultOptions, options) : defaultOptions;
    let currentId = 1;
    return {
      handler(event) {
        if (key in event) {
          const id = event[key];
          if (id !== currentId) {
            console.error(`[sequential-id-plugin]: expect to get an id with value "${currentId}", but got "${id}"`);
          } else {
            currentId++;
          }
        } else if (warnOnMissingId) {
          console.warn(`[sequential-id-plugin]: failed to get id in key: "${key}"`);
        }
      }
    };
  };

  exports.getReplaySequentialIdPlugin = getReplaySequentialIdPlugin;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

})({});
