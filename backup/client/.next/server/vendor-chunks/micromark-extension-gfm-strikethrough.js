"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/micromark-extension-gfm-strikethrough";
exports.ids = ["vendor-chunks/micromark-extension-gfm-strikethrough"];
exports.modules = {

/***/ "(ssr)/./node_modules/micromark-extension-gfm-strikethrough/dev/lib/html.js":
/*!****************************************************************************!*\
  !*** ./node_modules/micromark-extension-gfm-strikethrough/dev/lib/html.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   gfmStrikethroughHtml: () => (/* binding */ gfmStrikethroughHtml)\n/* harmony export */ });\n/**\n * @import {HtmlExtension} from 'micromark-util-types'\n */\n\n/**\n * Create an HTML extension for `micromark` to support GFM strikethrough when\n * serializing to HTML.\n *\n * @returns {HtmlExtension}\n *   Extension for `micromark` that can be passed in `htmlExtensions`, to\n *   support GFM strikethrough when serializing to HTML.\n */\nfunction gfmStrikethroughHtml() {\n  return {\n    enter: {\n      strikethrough() {\n        this.tag('<del>')\n      }\n    },\n    exit: {\n      strikethrough() {\n        this.tag('</del>')\n      }\n    }\n  }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbWljcm9tYXJrLWV4dGVuc2lvbi1nZm0tc3RyaWtldGhyb3VnaC9kZXYvbGliL2h0bWwuanMiLCJtYXBwaW5ncyI6Ijs7OztBQUFBO0FBQ0EsWUFBWSxlQUFlO0FBQzNCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsiL1VzZXJzL2hpcmVzaGIvRG9jdW1lbnRzL2NvZGluZy9zaWRlLXByb2plY3RzL1gtQnJvd3Nlci1BZ2VudC9jbGllbnQvbm9kZV9tb2R1bGVzL21pY3JvbWFyay1leHRlbnNpb24tZ2ZtLXN0cmlrZXRocm91Z2gvZGV2L2xpYi9odG1sLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGltcG9ydCB7SHRtbEV4dGVuc2lvbn0gZnJvbSAnbWljcm9tYXJrLXV0aWwtdHlwZXMnXG4gKi9cblxuLyoqXG4gKiBDcmVhdGUgYW4gSFRNTCBleHRlbnNpb24gZm9yIGBtaWNyb21hcmtgIHRvIHN1cHBvcnQgR0ZNIHN0cmlrZXRocm91Z2ggd2hlblxuICogc2VyaWFsaXppbmcgdG8gSFRNTC5cbiAqXG4gKiBAcmV0dXJucyB7SHRtbEV4dGVuc2lvbn1cbiAqICAgRXh0ZW5zaW9uIGZvciBgbWljcm9tYXJrYCB0aGF0IGNhbiBiZSBwYXNzZWQgaW4gYGh0bWxFeHRlbnNpb25zYCwgdG9cbiAqICAgc3VwcG9ydCBHRk0gc3RyaWtldGhyb3VnaCB3aGVuIHNlcmlhbGl6aW5nIHRvIEhUTUwuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZm1TdHJpa2V0aHJvdWdoSHRtbCgpIHtcbiAgcmV0dXJuIHtcbiAgICBlbnRlcjoge1xuICAgICAgc3RyaWtldGhyb3VnaCgpIHtcbiAgICAgICAgdGhpcy50YWcoJzxkZWw+JylcbiAgICAgIH1cbiAgICB9LFxuICAgIGV4aXQ6IHtcbiAgICAgIHN0cmlrZXRocm91Z2goKSB7XG4gICAgICAgIHRoaXMudGFnKCc8L2RlbD4nKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6WzBdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/micromark-extension-gfm-strikethrough/dev/lib/html.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/micromark-extension-gfm-strikethrough/dev/lib/syntax.js":
/*!******************************************************************************!*\
  !*** ./node_modules/micromark-extension-gfm-strikethrough/dev/lib/syntax.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   gfmStrikethrough: () => (/* binding */ gfmStrikethrough)\n/* harmony export */ });\n/* harmony import */ var devlop__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! devlop */ \"(ssr)/./node_modules/devlop/lib/development.js\");\n/* harmony import */ var micromark_util_chunked__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! micromark-util-chunked */ \"(ssr)/./node_modules/micromark-util-chunked/dev/index.js\");\n/* harmony import */ var micromark_util_classify_character__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! micromark-util-classify-character */ \"(ssr)/./node_modules/micromark-util-classify-character/dev/index.js\");\n/* harmony import */ var micromark_util_resolve_all__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! micromark-util-resolve-all */ \"(ssr)/./node_modules/micromark-util-resolve-all/index.js\");\n/* harmony import */ var micromark_util_symbol__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! micromark-util-symbol */ \"(ssr)/./node_modules/micromark-util-symbol/lib/codes.js\");\n/* harmony import */ var micromark_util_symbol__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! micromark-util-symbol */ \"(ssr)/./node_modules/micromark-util-symbol/lib/types.js\");\n/* harmony import */ var micromark_util_symbol__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! micromark-util-symbol */ \"(ssr)/./node_modules/micromark-util-symbol/lib/constants.js\");\n/**\n * @import {Options} from 'micromark-extension-gfm-strikethrough'\n * @import {Event, Extension, Resolver, State, Token, TokenizeContext, Tokenizer} from 'micromark-util-types'\n */\n\n\n\n\n\n\n\n/**\n * Create an extension for `micromark` to enable GFM strikethrough syntax.\n *\n * @param {Options | null | undefined} [options={}]\n *   Configuration.\n * @returns {Extension}\n *   Extension for `micromark` that can be passed in `extensions`, to\n *   enable GFM strikethrough syntax.\n */\nfunction gfmStrikethrough(options) {\n  const options_ = options || {}\n  let single = options_.singleTilde\n  const tokenizer = {\n    name: 'strikethrough',\n    tokenize: tokenizeStrikethrough,\n    resolveAll: resolveAllStrikethrough\n  }\n\n  if (single === null || single === undefined) {\n    single = true\n  }\n\n  return {\n    text: {[micromark_util_symbol__WEBPACK_IMPORTED_MODULE_0__.codes.tilde]: tokenizer},\n    insideSpan: {null: [tokenizer]},\n    attentionMarkers: {null: [micromark_util_symbol__WEBPACK_IMPORTED_MODULE_0__.codes.tilde]}\n  }\n\n  /**\n   * Take events and resolve strikethrough.\n   *\n   * @type {Resolver}\n   */\n  function resolveAllStrikethrough(events, context) {\n    let index = -1\n\n    // Walk through all events.\n    while (++index < events.length) {\n      // Find a token that can close.\n      if (\n        events[index][0] === 'enter' &&\n        events[index][1].type === 'strikethroughSequenceTemporary' &&\n        events[index][1]._close\n      ) {\n        let open = index\n\n        // Now walk back to find an opener.\n        while (open--) {\n          // Find a token that can open the closer.\n          if (\n            events[open][0] === 'exit' &&\n            events[open][1].type === 'strikethroughSequenceTemporary' &&\n            events[open][1]._open &&\n            // If the sizes are the same:\n            events[index][1].end.offset - events[index][1].start.offset ===\n              events[open][1].end.offset - events[open][1].start.offset\n          ) {\n            events[index][1].type = 'strikethroughSequence'\n            events[open][1].type = 'strikethroughSequence'\n\n            /** @type {Token} */\n            const strikethrough = {\n              type: 'strikethrough',\n              start: Object.assign({}, events[open][1].start),\n              end: Object.assign({}, events[index][1].end)\n            }\n\n            /** @type {Token} */\n            const text = {\n              type: 'strikethroughText',\n              start: Object.assign({}, events[open][1].end),\n              end: Object.assign({}, events[index][1].start)\n            }\n\n            // Opening.\n            /** @type {Array<Event>} */\n            const nextEvents = [\n              ['enter', strikethrough, context],\n              ['enter', events[open][1], context],\n              ['exit', events[open][1], context],\n              ['enter', text, context]\n            ]\n\n            const insideSpan = context.parser.constructs.insideSpan.null\n\n            if (insideSpan) {\n              // Between.\n              (0,micromark_util_chunked__WEBPACK_IMPORTED_MODULE_1__.splice)(\n                nextEvents,\n                nextEvents.length,\n                0,\n                (0,micromark_util_resolve_all__WEBPACK_IMPORTED_MODULE_2__.resolveAll)(insideSpan, events.slice(open + 1, index), context)\n              )\n            }\n\n            // Closing.\n            (0,micromark_util_chunked__WEBPACK_IMPORTED_MODULE_1__.splice)(nextEvents, nextEvents.length, 0, [\n              ['exit', text, context],\n              ['enter', events[index][1], context],\n              ['exit', events[index][1], context],\n              ['exit', strikethrough, context]\n            ])\n\n            ;(0,micromark_util_chunked__WEBPACK_IMPORTED_MODULE_1__.splice)(events, open - 1, index - open + 3, nextEvents)\n\n            index = open + nextEvents.length - 2\n            break\n          }\n        }\n      }\n    }\n\n    index = -1\n\n    while (++index < events.length) {\n      if (events[index][1].type === 'strikethroughSequenceTemporary') {\n        events[index][1].type = micromark_util_symbol__WEBPACK_IMPORTED_MODULE_3__.types.data\n      }\n    }\n\n    return events\n  }\n\n  /**\n   * @this {TokenizeContext}\n   * @type {Tokenizer}\n   */\n  function tokenizeStrikethrough(effects, ok, nok) {\n    const previous = this.previous\n    const events = this.events\n    let size = 0\n\n    return start\n\n    /** @type {State} */\n    function start(code) {\n      ;(0,devlop__WEBPACK_IMPORTED_MODULE_4__.ok)(code === micromark_util_symbol__WEBPACK_IMPORTED_MODULE_0__.codes.tilde, 'expected `~`')\n\n      if (\n        previous === micromark_util_symbol__WEBPACK_IMPORTED_MODULE_0__.codes.tilde &&\n        events[events.length - 1][1].type !== micromark_util_symbol__WEBPACK_IMPORTED_MODULE_3__.types.characterEscape\n      ) {\n        return nok(code)\n      }\n\n      effects.enter('strikethroughSequenceTemporary')\n      return more(code)\n    }\n\n    /** @type {State} */\n    function more(code) {\n      const before = (0,micromark_util_classify_character__WEBPACK_IMPORTED_MODULE_5__.classifyCharacter)(previous)\n\n      if (code === micromark_util_symbol__WEBPACK_IMPORTED_MODULE_0__.codes.tilde) {\n        // If this is the third marker, exit.\n        if (size > 1) return nok(code)\n        effects.consume(code)\n        size++\n        return more\n      }\n\n      if (size < 2 && !single) return nok(code)\n      const token = effects.exit('strikethroughSequenceTemporary')\n      const after = (0,micromark_util_classify_character__WEBPACK_IMPORTED_MODULE_5__.classifyCharacter)(code)\n      token._open =\n        !after || (after === micromark_util_symbol__WEBPACK_IMPORTED_MODULE_6__.constants.attentionSideAfter && Boolean(before))\n      token._close =\n        !before || (before === micromark_util_symbol__WEBPACK_IMPORTED_MODULE_6__.constants.attentionSideAfter && Boolean(after))\n      return ok(code)\n    }\n  }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbWljcm9tYXJrLWV4dGVuc2lvbi1nZm0tc3RyaWtldGhyb3VnaC9kZXYvbGliL3N5bnRheC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBO0FBQ0EsWUFBWSxTQUFTO0FBQ3JCLFlBQVksc0VBQXNFO0FBQ2xGOztBQUVtQztBQUNVO0FBQ3NCO0FBQ2Q7QUFDUTs7QUFFN0Q7QUFDQTtBQUNBO0FBQ0EsV0FBVyw0QkFBNEIsV0FBVztBQUNsRDtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFdBQVcsQ0FBQyx3REFBSyxtQkFBbUI7QUFDcEMsaUJBQWlCLGtCQUFrQjtBQUNuQyx1QkFBdUIsT0FBTyx3REFBSztBQUNuQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx1QkFBdUIsT0FBTztBQUM5QjtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDLG1DQUFtQztBQUNuQzs7QUFFQSx1QkFBdUIsT0FBTztBQUM5QjtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDLG1DQUFtQztBQUNuQzs7QUFFQTtBQUNBLHVCQUF1QixjQUFjO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYyw4REFBTTtBQUNwQjtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0Isc0VBQVU7QUFDMUI7QUFDQTs7QUFFQTtBQUNBLFlBQVksOERBQU07QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxZQUFZLCtEQUFNOztBQUVsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLGdDQUFnQyx3REFBSztBQUNyQztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxZQUFZO0FBQ1osWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsZUFBZSxPQUFPO0FBQ3RCO0FBQ0EsTUFBTSwyQ0FBTSxVQUFVLHdEQUFLOztBQUUzQjtBQUNBLHFCQUFxQix3REFBSztBQUMxQiw4Q0FBOEMsd0RBQUs7QUFDbkQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxlQUFlLE9BQU87QUFDdEI7QUFDQSxxQkFBcUIsb0ZBQWlCOztBQUV0QyxtQkFBbUIsd0RBQUs7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBb0Isb0ZBQWlCO0FBQ3JDO0FBQ0EsNkJBQTZCLDREQUFTO0FBQ3RDO0FBQ0EsK0JBQStCLDREQUFTO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyIvVXNlcnMvaGlyZXNoYi9Eb2N1bWVudHMvY29kaW5nL3NpZGUtcHJvamVjdHMvWC1Ccm93c2VyLUFnZW50L2NsaWVudC9ub2RlX21vZHVsZXMvbWljcm9tYXJrLWV4dGVuc2lvbi1nZm0tc3RyaWtldGhyb3VnaC9kZXYvbGliL3N5bnRheC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBpbXBvcnQge09wdGlvbnN9IGZyb20gJ21pY3JvbWFyay1leHRlbnNpb24tZ2ZtLXN0cmlrZXRocm91Z2gnXG4gKiBAaW1wb3J0IHtFdmVudCwgRXh0ZW5zaW9uLCBSZXNvbHZlciwgU3RhdGUsIFRva2VuLCBUb2tlbml6ZUNvbnRleHQsIFRva2VuaXplcn0gZnJvbSAnbWljcm9tYXJrLXV0aWwtdHlwZXMnXG4gKi9cblxuaW1wb3J0IHtvayBhcyBhc3NlcnR9IGZyb20gJ2RldmxvcCdcbmltcG9ydCB7c3BsaWNlfSBmcm9tICdtaWNyb21hcmstdXRpbC1jaHVua2VkJ1xuaW1wb3J0IHtjbGFzc2lmeUNoYXJhY3Rlcn0gZnJvbSAnbWljcm9tYXJrLXV0aWwtY2xhc3NpZnktY2hhcmFjdGVyJ1xuaW1wb3J0IHtyZXNvbHZlQWxsfSBmcm9tICdtaWNyb21hcmstdXRpbC1yZXNvbHZlLWFsbCdcbmltcG9ydCB7Y29kZXMsIGNvbnN0YW50cywgdHlwZXN9IGZyb20gJ21pY3JvbWFyay11dGlsLXN5bWJvbCdcblxuLyoqXG4gKiBDcmVhdGUgYW4gZXh0ZW5zaW9uIGZvciBgbWljcm9tYXJrYCB0byBlbmFibGUgR0ZNIHN0cmlrZXRocm91Z2ggc3ludGF4LlxuICpcbiAqIEBwYXJhbSB7T3B0aW9ucyB8IG51bGwgfCB1bmRlZmluZWR9IFtvcHRpb25zPXt9XVxuICogICBDb25maWd1cmF0aW9uLlxuICogQHJldHVybnMge0V4dGVuc2lvbn1cbiAqICAgRXh0ZW5zaW9uIGZvciBgbWljcm9tYXJrYCB0aGF0IGNhbiBiZSBwYXNzZWQgaW4gYGV4dGVuc2lvbnNgLCB0b1xuICogICBlbmFibGUgR0ZNIHN0cmlrZXRocm91Z2ggc3ludGF4LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2ZtU3RyaWtldGhyb3VnaChvcHRpb25zKSB7XG4gIGNvbnN0IG9wdGlvbnNfID0gb3B0aW9ucyB8fCB7fVxuICBsZXQgc2luZ2xlID0gb3B0aW9uc18uc2luZ2xlVGlsZGVcbiAgY29uc3QgdG9rZW5pemVyID0ge1xuICAgIG5hbWU6ICdzdHJpa2V0aHJvdWdoJyxcbiAgICB0b2tlbml6ZTogdG9rZW5pemVTdHJpa2V0aHJvdWdoLFxuICAgIHJlc29sdmVBbGw6IHJlc29sdmVBbGxTdHJpa2V0aHJvdWdoXG4gIH1cblxuICBpZiAoc2luZ2xlID09PSBudWxsIHx8IHNpbmdsZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgc2luZ2xlID0gdHJ1ZVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB0ZXh0OiB7W2NvZGVzLnRpbGRlXTogdG9rZW5pemVyfSxcbiAgICBpbnNpZGVTcGFuOiB7bnVsbDogW3Rva2VuaXplcl19LFxuICAgIGF0dGVudGlvbk1hcmtlcnM6IHtudWxsOiBbY29kZXMudGlsZGVdfVxuICB9XG5cbiAgLyoqXG4gICAqIFRha2UgZXZlbnRzIGFuZCByZXNvbHZlIHN0cmlrZXRocm91Z2guXG4gICAqXG4gICAqIEB0eXBlIHtSZXNvbHZlcn1cbiAgICovXG4gIGZ1bmN0aW9uIHJlc29sdmVBbGxTdHJpa2V0aHJvdWdoKGV2ZW50cywgY29udGV4dCkge1xuICAgIGxldCBpbmRleCA9IC0xXG5cbiAgICAvLyBXYWxrIHRocm91Z2ggYWxsIGV2ZW50cy5cbiAgICB3aGlsZSAoKytpbmRleCA8IGV2ZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIEZpbmQgYSB0b2tlbiB0aGF0IGNhbiBjbG9zZS5cbiAgICAgIGlmIChcbiAgICAgICAgZXZlbnRzW2luZGV4XVswXSA9PT0gJ2VudGVyJyAmJlxuICAgICAgICBldmVudHNbaW5kZXhdWzFdLnR5cGUgPT09ICdzdHJpa2V0aHJvdWdoU2VxdWVuY2VUZW1wb3JhcnknICYmXG4gICAgICAgIGV2ZW50c1tpbmRleF1bMV0uX2Nsb3NlXG4gICAgICApIHtcbiAgICAgICAgbGV0IG9wZW4gPSBpbmRleFxuXG4gICAgICAgIC8vIE5vdyB3YWxrIGJhY2sgdG8gZmluZCBhbiBvcGVuZXIuXG4gICAgICAgIHdoaWxlIChvcGVuLS0pIHtcbiAgICAgICAgICAvLyBGaW5kIGEgdG9rZW4gdGhhdCBjYW4gb3BlbiB0aGUgY2xvc2VyLlxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIGV2ZW50c1tvcGVuXVswXSA9PT0gJ2V4aXQnICYmXG4gICAgICAgICAgICBldmVudHNbb3Blbl1bMV0udHlwZSA9PT0gJ3N0cmlrZXRocm91Z2hTZXF1ZW5jZVRlbXBvcmFyeScgJiZcbiAgICAgICAgICAgIGV2ZW50c1tvcGVuXVsxXS5fb3BlbiAmJlxuICAgICAgICAgICAgLy8gSWYgdGhlIHNpemVzIGFyZSB0aGUgc2FtZTpcbiAgICAgICAgICAgIGV2ZW50c1tpbmRleF1bMV0uZW5kLm9mZnNldCAtIGV2ZW50c1tpbmRleF1bMV0uc3RhcnQub2Zmc2V0ID09PVxuICAgICAgICAgICAgICBldmVudHNbb3Blbl1bMV0uZW5kLm9mZnNldCAtIGV2ZW50c1tvcGVuXVsxXS5zdGFydC5vZmZzZXRcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGV2ZW50c1tpbmRleF1bMV0udHlwZSA9ICdzdHJpa2V0aHJvdWdoU2VxdWVuY2UnXG4gICAgICAgICAgICBldmVudHNbb3Blbl1bMV0udHlwZSA9ICdzdHJpa2V0aHJvdWdoU2VxdWVuY2UnXG5cbiAgICAgICAgICAgIC8qKiBAdHlwZSB7VG9rZW59ICovXG4gICAgICAgICAgICBjb25zdCBzdHJpa2V0aHJvdWdoID0ge1xuICAgICAgICAgICAgICB0eXBlOiAnc3RyaWtldGhyb3VnaCcsXG4gICAgICAgICAgICAgIHN0YXJ0OiBPYmplY3QuYXNzaWduKHt9LCBldmVudHNbb3Blbl1bMV0uc3RhcnQpLFxuICAgICAgICAgICAgICBlbmQ6IE9iamVjdC5hc3NpZ24oe30sIGV2ZW50c1tpbmRleF1bMV0uZW5kKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKiogQHR5cGUge1Rva2VufSAqL1xuICAgICAgICAgICAgY29uc3QgdGV4dCA9IHtcbiAgICAgICAgICAgICAgdHlwZTogJ3N0cmlrZXRocm91Z2hUZXh0JyxcbiAgICAgICAgICAgICAgc3RhcnQ6IE9iamVjdC5hc3NpZ24oe30sIGV2ZW50c1tvcGVuXVsxXS5lbmQpLFxuICAgICAgICAgICAgICBlbmQ6IE9iamVjdC5hc3NpZ24oe30sIGV2ZW50c1tpbmRleF1bMV0uc3RhcnQpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIE9wZW5pbmcuXG4gICAgICAgICAgICAvKiogQHR5cGUge0FycmF5PEV2ZW50Pn0gKi9cbiAgICAgICAgICAgIGNvbnN0IG5leHRFdmVudHMgPSBbXG4gICAgICAgICAgICAgIFsnZW50ZXInLCBzdHJpa2V0aHJvdWdoLCBjb250ZXh0XSxcbiAgICAgICAgICAgICAgWydlbnRlcicsIGV2ZW50c1tvcGVuXVsxXSwgY29udGV4dF0sXG4gICAgICAgICAgICAgIFsnZXhpdCcsIGV2ZW50c1tvcGVuXVsxXSwgY29udGV4dF0sXG4gICAgICAgICAgICAgIFsnZW50ZXInLCB0ZXh0LCBjb250ZXh0XVxuICAgICAgICAgICAgXVxuXG4gICAgICAgICAgICBjb25zdCBpbnNpZGVTcGFuID0gY29udGV4dC5wYXJzZXIuY29uc3RydWN0cy5pbnNpZGVTcGFuLm51bGxcblxuICAgICAgICAgICAgaWYgKGluc2lkZVNwYW4pIHtcbiAgICAgICAgICAgICAgLy8gQmV0d2Vlbi5cbiAgICAgICAgICAgICAgc3BsaWNlKFxuICAgICAgICAgICAgICAgIG5leHRFdmVudHMsXG4gICAgICAgICAgICAgICAgbmV4dEV2ZW50cy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICByZXNvbHZlQWxsKGluc2lkZVNwYW4sIGV2ZW50cy5zbGljZShvcGVuICsgMSwgaW5kZXgpLCBjb250ZXh0KVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENsb3NpbmcuXG4gICAgICAgICAgICBzcGxpY2UobmV4dEV2ZW50cywgbmV4dEV2ZW50cy5sZW5ndGgsIDAsIFtcbiAgICAgICAgICAgICAgWydleGl0JywgdGV4dCwgY29udGV4dF0sXG4gICAgICAgICAgICAgIFsnZW50ZXInLCBldmVudHNbaW5kZXhdWzFdLCBjb250ZXh0XSxcbiAgICAgICAgICAgICAgWydleGl0JywgZXZlbnRzW2luZGV4XVsxXSwgY29udGV4dF0sXG4gICAgICAgICAgICAgIFsnZXhpdCcsIHN0cmlrZXRocm91Z2gsIGNvbnRleHRdXG4gICAgICAgICAgICBdKVxuXG4gICAgICAgICAgICBzcGxpY2UoZXZlbnRzLCBvcGVuIC0gMSwgaW5kZXggLSBvcGVuICsgMywgbmV4dEV2ZW50cylcblxuICAgICAgICAgICAgaW5kZXggPSBvcGVuICsgbmV4dEV2ZW50cy5sZW5ndGggLSAyXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGluZGV4ID0gLTFcblxuICAgIHdoaWxlICgrK2luZGV4IDwgZXZlbnRzLmxlbmd0aCkge1xuICAgICAgaWYgKGV2ZW50c1tpbmRleF1bMV0udHlwZSA9PT0gJ3N0cmlrZXRocm91Z2hTZXF1ZW5jZVRlbXBvcmFyeScpIHtcbiAgICAgICAgZXZlbnRzW2luZGV4XVsxXS50eXBlID0gdHlwZXMuZGF0YVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBldmVudHNcbiAgfVxuXG4gIC8qKlxuICAgKiBAdGhpcyB7VG9rZW5pemVDb250ZXh0fVxuICAgKiBAdHlwZSB7VG9rZW5pemVyfVxuICAgKi9cbiAgZnVuY3Rpb24gdG9rZW5pemVTdHJpa2V0aHJvdWdoKGVmZmVjdHMsIG9rLCBub2spIHtcbiAgICBjb25zdCBwcmV2aW91cyA9IHRoaXMucHJldmlvdXNcbiAgICBjb25zdCBldmVudHMgPSB0aGlzLmV2ZW50c1xuICAgIGxldCBzaXplID0gMFxuXG4gICAgcmV0dXJuIHN0YXJ0XG5cbiAgICAvKiogQHR5cGUge1N0YXRlfSAqL1xuICAgIGZ1bmN0aW9uIHN0YXJ0KGNvZGUpIHtcbiAgICAgIGFzc2VydChjb2RlID09PSBjb2Rlcy50aWxkZSwgJ2V4cGVjdGVkIGB+YCcpXG5cbiAgICAgIGlmIChcbiAgICAgICAgcHJldmlvdXMgPT09IGNvZGVzLnRpbGRlICYmXG4gICAgICAgIGV2ZW50c1tldmVudHMubGVuZ3RoIC0gMV1bMV0udHlwZSAhPT0gdHlwZXMuY2hhcmFjdGVyRXNjYXBlXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIG5vayhjb2RlKVxuICAgICAgfVxuXG4gICAgICBlZmZlY3RzLmVudGVyKCdzdHJpa2V0aHJvdWdoU2VxdWVuY2VUZW1wb3JhcnknKVxuICAgICAgcmV0dXJuIG1vcmUoY29kZSlcbiAgICB9XG5cbiAgICAvKiogQHR5cGUge1N0YXRlfSAqL1xuICAgIGZ1bmN0aW9uIG1vcmUoY29kZSkge1xuICAgICAgY29uc3QgYmVmb3JlID0gY2xhc3NpZnlDaGFyYWN0ZXIocHJldmlvdXMpXG5cbiAgICAgIGlmIChjb2RlID09PSBjb2Rlcy50aWxkZSkge1xuICAgICAgICAvLyBJZiB0aGlzIGlzIHRoZSB0aGlyZCBtYXJrZXIsIGV4aXQuXG4gICAgICAgIGlmIChzaXplID4gMSkgcmV0dXJuIG5vayhjb2RlKVxuICAgICAgICBlZmZlY3RzLmNvbnN1bWUoY29kZSlcbiAgICAgICAgc2l6ZSsrXG4gICAgICAgIHJldHVybiBtb3JlXG4gICAgICB9XG5cbiAgICAgIGlmIChzaXplIDwgMiAmJiAhc2luZ2xlKSByZXR1cm4gbm9rKGNvZGUpXG4gICAgICBjb25zdCB0b2tlbiA9IGVmZmVjdHMuZXhpdCgnc3RyaWtldGhyb3VnaFNlcXVlbmNlVGVtcG9yYXJ5JylcbiAgICAgIGNvbnN0IGFmdGVyID0gY2xhc3NpZnlDaGFyYWN0ZXIoY29kZSlcbiAgICAgIHRva2VuLl9vcGVuID1cbiAgICAgICAgIWFmdGVyIHx8IChhZnRlciA9PT0gY29uc3RhbnRzLmF0dGVudGlvblNpZGVBZnRlciAmJiBCb29sZWFuKGJlZm9yZSkpXG4gICAgICB0b2tlbi5fY2xvc2UgPVxuICAgICAgICAhYmVmb3JlIHx8IChiZWZvcmUgPT09IGNvbnN0YW50cy5hdHRlbnRpb25TaWRlQWZ0ZXIgJiYgQm9vbGVhbihhZnRlcikpXG4gICAgICByZXR1cm4gb2soY29kZSlcbiAgICB9XG4gIH1cbn1cbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/micromark-extension-gfm-strikethrough/dev/lib/syntax.js\n");

/***/ })

};
;