var rrwebConsoleReplay = (function (exports) {
    'use strict';

    var NodeType;
    (function(NodeType2) {
      NodeType2[NodeType2["Document"] = 0] = "Document";
      NodeType2[NodeType2["DocumentType"] = 1] = "DocumentType";
      NodeType2[NodeType2["Element"] = 2] = "Element";
      NodeType2[NodeType2["Text"] = 3] = "Text";
      NodeType2[NodeType2["CDATA"] = 4] = "CDATA";
      NodeType2[NodeType2["Comment"] = 5] = "Comment";
    })(NodeType || (NodeType = {}));

    const DEPARTED_MIRROR_ACCESS_WARNING = "Please stop import mirror directly. Instead of that,\r\nnow you can use replayer.getMirror() to access the mirror instance of a replayer,\r\nor you can use record.mirror to access the mirror instance during recording.";
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
      }
    };
    if (typeof window !== "undefined" && window.Proxy && window.Reflect) {
      _mirror = new Proxy(_mirror, {
        get(target, prop, receiver) {
          if (prop === "map") {
            console.error(DEPARTED_MIRROR_ACCESS_WARNING);
          }
          return Reflect.get(target, prop, receiver);
        }
      });
    }

    const PLUGIN_NAME = "rrweb/console@1";

    var EventType = /* @__PURE__ */ ((EventType2) => {
      EventType2[EventType2["DomContentLoaded"] = 0] = "DomContentLoaded";
      EventType2[EventType2["Load"] = 1] = "Load";
      EventType2[EventType2["FullSnapshot"] = 2] = "FullSnapshot";
      EventType2[EventType2["IncrementalSnapshot"] = 3] = "IncrementalSnapshot";
      EventType2[EventType2["Meta"] = 4] = "Meta";
      EventType2[EventType2["Custom"] = 5] = "Custom";
      EventType2[EventType2["Plugin"] = 6] = "Plugin";
      return EventType2;
    })(EventType || {});
    var IncrementalSource = /* @__PURE__ */ ((IncrementalSource2) => {
      IncrementalSource2[IncrementalSource2["Mutation"] = 0] = "Mutation";
      IncrementalSource2[IncrementalSource2["MouseMove"] = 1] = "MouseMove";
      IncrementalSource2[IncrementalSource2["MouseInteraction"] = 2] = "MouseInteraction";
      IncrementalSource2[IncrementalSource2["Scroll"] = 3] = "Scroll";
      IncrementalSource2[IncrementalSource2["ViewportResize"] = 4] = "ViewportResize";
      IncrementalSource2[IncrementalSource2["Input"] = 5] = "Input";
      IncrementalSource2[IncrementalSource2["TouchMove"] = 6] = "TouchMove";
      IncrementalSource2[IncrementalSource2["MediaInteraction"] = 7] = "MediaInteraction";
      IncrementalSource2[IncrementalSource2["StyleSheetRule"] = 8] = "StyleSheetRule";
      IncrementalSource2[IncrementalSource2["CanvasMutation"] = 9] = "CanvasMutation";
      IncrementalSource2[IncrementalSource2["Font"] = 10] = "Font";
      IncrementalSource2[IncrementalSource2["Log"] = 11] = "Log";
      IncrementalSource2[IncrementalSource2["Drag"] = 12] = "Drag";
      IncrementalSource2[IncrementalSource2["StyleDeclaration"] = 13] = "StyleDeclaration";
      IncrementalSource2[IncrementalSource2["Selection"] = 14] = "Selection";
      IncrementalSource2[IncrementalSource2["AdoptedStyleSheet"] = 15] = "AdoptedStyleSheet";
      return IncrementalSource2;
    })(IncrementalSource || {});

    const ORIGINAL_ATTRIBUTE_NAME = "__rrweb_original__";
    const defaultLogConfig = {
      level: [
        "assert",
        "clear",
        "count",
        "countReset",
        "debug",
        "dir",
        "dirxml",
        "error",
        "group",
        "groupCollapsed",
        "groupEnd",
        "info",
        "log",
        "table",
        "time",
        "timeEnd",
        "timeLog",
        "trace",
        "warn"
      ],
      replayLogger: void 0
    };
    class LogReplayPlugin {
      constructor(config) {
        this.config = Object.assign(defaultLogConfig, config);
      }
      getConsoleLogger() {
        const replayLogger = {};
        for (const level of this.config.level) {
          if (level === "trace") {
            replayLogger[level] = (data) => {
              const logger = console.log[ORIGINAL_ATTRIBUTE_NAME] ? console.log[ORIGINAL_ATTRIBUTE_NAME] : console.log;
              logger(...data.payload.map((s) => JSON.parse(s)), this.formatMessage(data));
            };
          } else {
            replayLogger[level] = (data) => {
              const logger = console[level][ORIGINAL_ATTRIBUTE_NAME] ? console[level][ORIGINAL_ATTRIBUTE_NAME] : console[level];
              logger(...data.payload.map((s) => JSON.parse(s)), this.formatMessage(data));
            };
          }
        }
        return replayLogger;
      }
      formatMessage(data) {
        if (data.trace.length === 0) {
          return "";
        }
        const stackPrefix = "\n	at ";
        let result = stackPrefix;
        result += data.trace.join(stackPrefix);
        return result;
      }
    }
    const getReplayConsolePlugin = (options) => {
      const replayLogger = (options == null ? void 0 : options.replayLogger) || new LogReplayPlugin(options).getConsoleLogger();
      return {
        handler(event, _isSync, context) {
          let logData = null;
          if (event.type === EventType.IncrementalSnapshot && event.data.source === IncrementalSource.Log) {
            logData = event.data;
          } else if (event.type === EventType.Plugin && event.data.plugin === PLUGIN_NAME) {
            logData = event.data.payload;
          }
          if (logData) {
            try {
              if (typeof replayLogger[logData.level] === "function") {
                replayLogger[logData.level](logData);
              }
            } catch (error) {
              if (context.replayer.config.showWarning) {
                console.warn(error);
              }
            }
          }
        }
      };
    };

    exports.getReplayConsolePlugin = getReplayConsolePlugin;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
