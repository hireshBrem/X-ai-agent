"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/mdast-util-gfm-footnote";
exports.ids = ["vendor-chunks/mdast-util-gfm-footnote"];
exports.modules = {

/***/ "(ssr)/./node_modules/mdast-util-gfm-footnote/lib/index.js":
/*!***********************************************************!*\
  !*** ./node_modules/mdast-util-gfm-footnote/lib/index.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   gfmFootnoteFromMarkdown: () => (/* binding */ gfmFootnoteFromMarkdown),\n/* harmony export */   gfmFootnoteToMarkdown: () => (/* binding */ gfmFootnoteToMarkdown)\n/* harmony export */ });\n/* harmony import */ var devlop__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! devlop */ \"(ssr)/./node_modules/devlop/lib/development.js\");\n/* harmony import */ var micromark_util_normalize_identifier__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! micromark-util-normalize-identifier */ \"(ssr)/./node_modules/micromark-util-normalize-identifier/dev/index.js\");\n/**\n * @import {\n *   CompileContext,\n *   Extension as FromMarkdownExtension,\n *   Handle as FromMarkdownHandle\n * } from 'mdast-util-from-markdown'\n * @import {ToMarkdownOptions} from 'mdast-util-gfm-footnote'\n * @import {\n *   Handle as ToMarkdownHandle,\n *   Map,\n *   Options as ToMarkdownExtension\n * } from 'mdast-util-to-markdown'\n * @import {FootnoteDefinition, FootnoteReference} from 'mdast'\n */\n\n\n\n\nfootnoteReference.peek = footnoteReferencePeek\n\n/**\n * @this {CompileContext}\n * @type {FromMarkdownHandle}\n */\nfunction enterFootnoteCallString() {\n  this.buffer()\n}\n\n/**\n * @this {CompileContext}\n * @type {FromMarkdownHandle}\n */\nfunction enterFootnoteCall(token) {\n  this.enter({type: 'footnoteReference', identifier: '', label: ''}, token)\n}\n\n/**\n * @this {CompileContext}\n * @type {FromMarkdownHandle}\n */\nfunction enterFootnoteDefinitionLabelString() {\n  this.buffer()\n}\n\n/**\n * @this {CompileContext}\n * @type {FromMarkdownHandle}\n */\nfunction enterFootnoteDefinition(token) {\n  this.enter(\n    {type: 'footnoteDefinition', identifier: '', label: '', children: []},\n    token\n  )\n}\n\n/**\n * @this {CompileContext}\n * @type {FromMarkdownHandle}\n */\nfunction exitFootnoteCallString(token) {\n  const label = this.resume()\n  const node = this.stack[this.stack.length - 1]\n  ;(0,devlop__WEBPACK_IMPORTED_MODULE_0__.ok)(node.type === 'footnoteReference')\n  node.identifier = (0,micromark_util_normalize_identifier__WEBPACK_IMPORTED_MODULE_1__.normalizeIdentifier)(\n    this.sliceSerialize(token)\n  ).toLowerCase()\n  node.label = label\n}\n\n/**\n * @this {CompileContext}\n * @type {FromMarkdownHandle}\n */\nfunction exitFootnoteCall(token) {\n  this.exit(token)\n}\n\n/**\n * @this {CompileContext}\n * @type {FromMarkdownHandle}\n */\nfunction exitFootnoteDefinitionLabelString(token) {\n  const label = this.resume()\n  const node = this.stack[this.stack.length - 1]\n  ;(0,devlop__WEBPACK_IMPORTED_MODULE_0__.ok)(node.type === 'footnoteDefinition')\n  node.identifier = (0,micromark_util_normalize_identifier__WEBPACK_IMPORTED_MODULE_1__.normalizeIdentifier)(\n    this.sliceSerialize(token)\n  ).toLowerCase()\n  node.label = label\n}\n\n/**\n * @this {CompileContext}\n * @type {FromMarkdownHandle}\n */\nfunction exitFootnoteDefinition(token) {\n  this.exit(token)\n}\n\n/** @type {ToMarkdownHandle} */\nfunction footnoteReferencePeek() {\n  return '['\n}\n\n/**\n * @type {ToMarkdownHandle}\n * @param {FootnoteReference} node\n */\nfunction footnoteReference(node, _, state, info) {\n  const tracker = state.createTracker(info)\n  let value = tracker.move('[^')\n  const exit = state.enter('footnoteReference')\n  const subexit = state.enter('reference')\n  value += tracker.move(\n    state.safe(state.associationId(node), {after: ']', before: value})\n  )\n  subexit()\n  exit()\n  value += tracker.move(']')\n  return value\n}\n\n/**\n * Create an extension for `mdast-util-from-markdown` to enable GFM footnotes\n * in markdown.\n *\n * @returns {FromMarkdownExtension}\n *   Extension for `mdast-util-from-markdown`.\n */\nfunction gfmFootnoteFromMarkdown() {\n  return {\n    enter: {\n      gfmFootnoteCallString: enterFootnoteCallString,\n      gfmFootnoteCall: enterFootnoteCall,\n      gfmFootnoteDefinitionLabelString: enterFootnoteDefinitionLabelString,\n      gfmFootnoteDefinition: enterFootnoteDefinition\n    },\n    exit: {\n      gfmFootnoteCallString: exitFootnoteCallString,\n      gfmFootnoteCall: exitFootnoteCall,\n      gfmFootnoteDefinitionLabelString: exitFootnoteDefinitionLabelString,\n      gfmFootnoteDefinition: exitFootnoteDefinition\n    }\n  }\n}\n\n/**\n * Create an extension for `mdast-util-to-markdown` to enable GFM footnotes\n * in markdown.\n *\n * @param {ToMarkdownOptions | null | undefined} [options]\n *   Configuration (optional).\n * @returns {ToMarkdownExtension}\n *   Extension for `mdast-util-to-markdown`.\n */\nfunction gfmFootnoteToMarkdown(options) {\n  // To do: next major: change default.\n  let firstLineBlank = false\n\n  if (options && options.firstLineBlank) {\n    firstLineBlank = true\n  }\n\n  return {\n    handlers: {footnoteDefinition, footnoteReference},\n    // This is on by default already.\n    unsafe: [{character: '[', inConstruct: ['label', 'phrasing', 'reference']}]\n  }\n\n  /**\n   * @type {ToMarkdownHandle}\n   * @param {FootnoteDefinition} node\n   */\n  function footnoteDefinition(node, _, state, info) {\n    const tracker = state.createTracker(info)\n    let value = tracker.move('[^')\n    const exit = state.enter('footnoteDefinition')\n    const subexit = state.enter('label')\n    value += tracker.move(\n      state.safe(state.associationId(node), {before: value, after: ']'})\n    )\n    subexit()\n\n    value += tracker.move(']:')\n\n    if (node.children && node.children.length > 0) {\n      tracker.shift(4)\n\n      value += tracker.move(\n        (firstLineBlank ? '\\n' : ' ') +\n          state.indentLines(\n            state.containerFlow(node, tracker.current()),\n            firstLineBlank ? mapAll : mapExceptFirst\n          )\n      )\n    }\n\n    exit()\n\n    return value\n  }\n}\n\n/** @type {Map} */\nfunction mapExceptFirst(line, index, blank) {\n  return index === 0 ? line : mapAll(line, index, blank)\n}\n\n/** @type {Map} */\nfunction mapAll(line, index, blank) {\n  return (blank ? '' : '    ') + line\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbWRhc3QtdXRpbC1nZm0tZm9vdG5vdGUvbGliL2luZGV4LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLFlBQVksbUJBQW1CO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLFlBQVksdUNBQXVDO0FBQ25EOztBQUVtQztBQUNvQzs7QUFFdkU7O0FBRUE7QUFDQSxVQUFVO0FBQ1YsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsVUFBVTtBQUNWLFVBQVU7QUFDVjtBQUNBO0FBQ0EsY0FBYyxxREFBcUQ7QUFDbkU7O0FBRUE7QUFDQSxVQUFVO0FBQ1YsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsVUFBVTtBQUNWLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQSxLQUFLLG9FQUFvRTtBQUN6RTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxVQUFVO0FBQ1YsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSwyQ0FBTTtBQUNSLG9CQUFvQix3RkFBbUI7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxVQUFVO0FBQ1YsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsVUFBVTtBQUNWLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsMkNBQU07QUFDUixvQkFBb0Isd0ZBQW1CO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsVUFBVTtBQUNWLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXLGtCQUFrQjtBQUM3QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxVQUFVO0FBQ1YsV0FBVyxtQkFBbUI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMsMEJBQTBCO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsc0NBQXNDO0FBQ2pEO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZUFBZSxzQ0FBc0M7QUFDckQ7QUFDQSxjQUFjLGdFQUFnRTtBQUM5RTs7QUFFQTtBQUNBLFlBQVk7QUFDWixhQUFhLG9CQUFvQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZDQUE2QywwQkFBMEI7QUFDdkU7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBLFdBQVcsS0FBSztBQUNoQjtBQUNBO0FBQ0E7O0FBRUEsV0FBVyxLQUFLO0FBQ2hCO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsiL1VzZXJzL2hpcmVzaGIvRG9jdW1lbnRzL2NvZGluZy9zaWRlLXByb2plY3RzL1gtQnJvd3Nlci1BZ2VudC9jbGllbnQvbm9kZV9tb2R1bGVzL21kYXN0LXV0aWwtZ2ZtLWZvb3Rub3RlL2xpYi9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBpbXBvcnQge1xuICogICBDb21waWxlQ29udGV4dCxcbiAqICAgRXh0ZW5zaW9uIGFzIEZyb21NYXJrZG93bkV4dGVuc2lvbixcbiAqICAgSGFuZGxlIGFzIEZyb21NYXJrZG93bkhhbmRsZVxuICogfSBmcm9tICdtZGFzdC11dGlsLWZyb20tbWFya2Rvd24nXG4gKiBAaW1wb3J0IHtUb01hcmtkb3duT3B0aW9uc30gZnJvbSAnbWRhc3QtdXRpbC1nZm0tZm9vdG5vdGUnXG4gKiBAaW1wb3J0IHtcbiAqICAgSGFuZGxlIGFzIFRvTWFya2Rvd25IYW5kbGUsXG4gKiAgIE1hcCxcbiAqICAgT3B0aW9ucyBhcyBUb01hcmtkb3duRXh0ZW5zaW9uXG4gKiB9IGZyb20gJ21kYXN0LXV0aWwtdG8tbWFya2Rvd24nXG4gKiBAaW1wb3J0IHtGb290bm90ZURlZmluaXRpb24sIEZvb3Rub3RlUmVmZXJlbmNlfSBmcm9tICdtZGFzdCdcbiAqL1xuXG5pbXBvcnQge29rIGFzIGFzc2VydH0gZnJvbSAnZGV2bG9wJ1xuaW1wb3J0IHtub3JtYWxpemVJZGVudGlmaWVyfSBmcm9tICdtaWNyb21hcmstdXRpbC1ub3JtYWxpemUtaWRlbnRpZmllcidcblxuZm9vdG5vdGVSZWZlcmVuY2UucGVlayA9IGZvb3Rub3RlUmVmZXJlbmNlUGVla1xuXG4vKipcbiAqIEB0aGlzIHtDb21waWxlQ29udGV4dH1cbiAqIEB0eXBlIHtGcm9tTWFya2Rvd25IYW5kbGV9XG4gKi9cbmZ1bmN0aW9uIGVudGVyRm9vdG5vdGVDYWxsU3RyaW5nKCkge1xuICB0aGlzLmJ1ZmZlcigpXG59XG5cbi8qKlxuICogQHRoaXMge0NvbXBpbGVDb250ZXh0fVxuICogQHR5cGUge0Zyb21NYXJrZG93bkhhbmRsZX1cbiAqL1xuZnVuY3Rpb24gZW50ZXJGb290bm90ZUNhbGwodG9rZW4pIHtcbiAgdGhpcy5lbnRlcih7dHlwZTogJ2Zvb3Rub3RlUmVmZXJlbmNlJywgaWRlbnRpZmllcjogJycsIGxhYmVsOiAnJ30sIHRva2VuKVxufVxuXG4vKipcbiAqIEB0aGlzIHtDb21waWxlQ29udGV4dH1cbiAqIEB0eXBlIHtGcm9tTWFya2Rvd25IYW5kbGV9XG4gKi9cbmZ1bmN0aW9uIGVudGVyRm9vdG5vdGVEZWZpbml0aW9uTGFiZWxTdHJpbmcoKSB7XG4gIHRoaXMuYnVmZmVyKClcbn1cblxuLyoqXG4gKiBAdGhpcyB7Q29tcGlsZUNvbnRleHR9XG4gKiBAdHlwZSB7RnJvbU1hcmtkb3duSGFuZGxlfVxuICovXG5mdW5jdGlvbiBlbnRlckZvb3Rub3RlRGVmaW5pdGlvbih0b2tlbikge1xuICB0aGlzLmVudGVyKFxuICAgIHt0eXBlOiAnZm9vdG5vdGVEZWZpbml0aW9uJywgaWRlbnRpZmllcjogJycsIGxhYmVsOiAnJywgY2hpbGRyZW46IFtdfSxcbiAgICB0b2tlblxuICApXG59XG5cbi8qKlxuICogQHRoaXMge0NvbXBpbGVDb250ZXh0fVxuICogQHR5cGUge0Zyb21NYXJrZG93bkhhbmRsZX1cbiAqL1xuZnVuY3Rpb24gZXhpdEZvb3Rub3RlQ2FsbFN0cmluZyh0b2tlbikge1xuICBjb25zdCBsYWJlbCA9IHRoaXMucmVzdW1lKClcbiAgY29uc3Qgbm9kZSA9IHRoaXMuc3RhY2tbdGhpcy5zdGFjay5sZW5ndGggLSAxXVxuICBhc3NlcnQobm9kZS50eXBlID09PSAnZm9vdG5vdGVSZWZlcmVuY2UnKVxuICBub2RlLmlkZW50aWZpZXIgPSBub3JtYWxpemVJZGVudGlmaWVyKFxuICAgIHRoaXMuc2xpY2VTZXJpYWxpemUodG9rZW4pXG4gICkudG9Mb3dlckNhc2UoKVxuICBub2RlLmxhYmVsID0gbGFiZWxcbn1cblxuLyoqXG4gKiBAdGhpcyB7Q29tcGlsZUNvbnRleHR9XG4gKiBAdHlwZSB7RnJvbU1hcmtkb3duSGFuZGxlfVxuICovXG5mdW5jdGlvbiBleGl0Rm9vdG5vdGVDYWxsKHRva2VuKSB7XG4gIHRoaXMuZXhpdCh0b2tlbilcbn1cblxuLyoqXG4gKiBAdGhpcyB7Q29tcGlsZUNvbnRleHR9XG4gKiBAdHlwZSB7RnJvbU1hcmtkb3duSGFuZGxlfVxuICovXG5mdW5jdGlvbiBleGl0Rm9vdG5vdGVEZWZpbml0aW9uTGFiZWxTdHJpbmcodG9rZW4pIHtcbiAgY29uc3QgbGFiZWwgPSB0aGlzLnJlc3VtZSgpXG4gIGNvbnN0IG5vZGUgPSB0aGlzLnN0YWNrW3RoaXMuc3RhY2subGVuZ3RoIC0gMV1cbiAgYXNzZXJ0KG5vZGUudHlwZSA9PT0gJ2Zvb3Rub3RlRGVmaW5pdGlvbicpXG4gIG5vZGUuaWRlbnRpZmllciA9IG5vcm1hbGl6ZUlkZW50aWZpZXIoXG4gICAgdGhpcy5zbGljZVNlcmlhbGl6ZSh0b2tlbilcbiAgKS50b0xvd2VyQ2FzZSgpXG4gIG5vZGUubGFiZWwgPSBsYWJlbFxufVxuXG4vKipcbiAqIEB0aGlzIHtDb21waWxlQ29udGV4dH1cbiAqIEB0eXBlIHtGcm9tTWFya2Rvd25IYW5kbGV9XG4gKi9cbmZ1bmN0aW9uIGV4aXRGb290bm90ZURlZmluaXRpb24odG9rZW4pIHtcbiAgdGhpcy5leGl0KHRva2VuKVxufVxuXG4vKiogQHR5cGUge1RvTWFya2Rvd25IYW5kbGV9ICovXG5mdW5jdGlvbiBmb290bm90ZVJlZmVyZW5jZVBlZWsoKSB7XG4gIHJldHVybiAnWydcbn1cblxuLyoqXG4gKiBAdHlwZSB7VG9NYXJrZG93bkhhbmRsZX1cbiAqIEBwYXJhbSB7Rm9vdG5vdGVSZWZlcmVuY2V9IG5vZGVcbiAqL1xuZnVuY3Rpb24gZm9vdG5vdGVSZWZlcmVuY2Uobm9kZSwgXywgc3RhdGUsIGluZm8pIHtcbiAgY29uc3QgdHJhY2tlciA9IHN0YXRlLmNyZWF0ZVRyYWNrZXIoaW5mbylcbiAgbGV0IHZhbHVlID0gdHJhY2tlci5tb3ZlKCdbXicpXG4gIGNvbnN0IGV4aXQgPSBzdGF0ZS5lbnRlcignZm9vdG5vdGVSZWZlcmVuY2UnKVxuICBjb25zdCBzdWJleGl0ID0gc3RhdGUuZW50ZXIoJ3JlZmVyZW5jZScpXG4gIHZhbHVlICs9IHRyYWNrZXIubW92ZShcbiAgICBzdGF0ZS5zYWZlKHN0YXRlLmFzc29jaWF0aW9uSWQobm9kZSksIHthZnRlcjogJ10nLCBiZWZvcmU6IHZhbHVlfSlcbiAgKVxuICBzdWJleGl0KClcbiAgZXhpdCgpXG4gIHZhbHVlICs9IHRyYWNrZXIubW92ZSgnXScpXG4gIHJldHVybiB2YWx1ZVxufVxuXG4vKipcbiAqIENyZWF0ZSBhbiBleHRlbnNpb24gZm9yIGBtZGFzdC11dGlsLWZyb20tbWFya2Rvd25gIHRvIGVuYWJsZSBHRk0gZm9vdG5vdGVzXG4gKiBpbiBtYXJrZG93bi5cbiAqXG4gKiBAcmV0dXJucyB7RnJvbU1hcmtkb3duRXh0ZW5zaW9ufVxuICogICBFeHRlbnNpb24gZm9yIGBtZGFzdC11dGlsLWZyb20tbWFya2Rvd25gLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2ZtRm9vdG5vdGVGcm9tTWFya2Rvd24oKSB7XG4gIHJldHVybiB7XG4gICAgZW50ZXI6IHtcbiAgICAgIGdmbUZvb3Rub3RlQ2FsbFN0cmluZzogZW50ZXJGb290bm90ZUNhbGxTdHJpbmcsXG4gICAgICBnZm1Gb290bm90ZUNhbGw6IGVudGVyRm9vdG5vdGVDYWxsLFxuICAgICAgZ2ZtRm9vdG5vdGVEZWZpbml0aW9uTGFiZWxTdHJpbmc6IGVudGVyRm9vdG5vdGVEZWZpbml0aW9uTGFiZWxTdHJpbmcsXG4gICAgICBnZm1Gb290bm90ZURlZmluaXRpb246IGVudGVyRm9vdG5vdGVEZWZpbml0aW9uXG4gICAgfSxcbiAgICBleGl0OiB7XG4gICAgICBnZm1Gb290bm90ZUNhbGxTdHJpbmc6IGV4aXRGb290bm90ZUNhbGxTdHJpbmcsXG4gICAgICBnZm1Gb290bm90ZUNhbGw6IGV4aXRGb290bm90ZUNhbGwsXG4gICAgICBnZm1Gb290bm90ZURlZmluaXRpb25MYWJlbFN0cmluZzogZXhpdEZvb3Rub3RlRGVmaW5pdGlvbkxhYmVsU3RyaW5nLFxuICAgICAgZ2ZtRm9vdG5vdGVEZWZpbml0aW9uOiBleGl0Rm9vdG5vdGVEZWZpbml0aW9uXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQ3JlYXRlIGFuIGV4dGVuc2lvbiBmb3IgYG1kYXN0LXV0aWwtdG8tbWFya2Rvd25gIHRvIGVuYWJsZSBHRk0gZm9vdG5vdGVzXG4gKiBpbiBtYXJrZG93bi5cbiAqXG4gKiBAcGFyYW0ge1RvTWFya2Rvd25PcHRpb25zIHwgbnVsbCB8IHVuZGVmaW5lZH0gW29wdGlvbnNdXG4gKiAgIENvbmZpZ3VyYXRpb24gKG9wdGlvbmFsKS5cbiAqIEByZXR1cm5zIHtUb01hcmtkb3duRXh0ZW5zaW9ufVxuICogICBFeHRlbnNpb24gZm9yIGBtZGFzdC11dGlsLXRvLW1hcmtkb3duYC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdmbUZvb3Rub3RlVG9NYXJrZG93bihvcHRpb25zKSB7XG4gIC8vIFRvIGRvOiBuZXh0IG1ham9yOiBjaGFuZ2UgZGVmYXVsdC5cbiAgbGV0IGZpcnN0TGluZUJsYW5rID0gZmFsc2VcblxuICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmZpcnN0TGluZUJsYW5rKSB7XG4gICAgZmlyc3RMaW5lQmxhbmsgPSB0cnVlXG4gIH1cblxuICByZXR1cm4ge1xuICAgIGhhbmRsZXJzOiB7Zm9vdG5vdGVEZWZpbml0aW9uLCBmb290bm90ZVJlZmVyZW5jZX0sXG4gICAgLy8gVGhpcyBpcyBvbiBieSBkZWZhdWx0IGFscmVhZHkuXG4gICAgdW5zYWZlOiBbe2NoYXJhY3RlcjogJ1snLCBpbkNvbnN0cnVjdDogWydsYWJlbCcsICdwaHJhc2luZycsICdyZWZlcmVuY2UnXX1dXG4gIH1cblxuICAvKipcbiAgICogQHR5cGUge1RvTWFya2Rvd25IYW5kbGV9XG4gICAqIEBwYXJhbSB7Rm9vdG5vdGVEZWZpbml0aW9ufSBub2RlXG4gICAqL1xuICBmdW5jdGlvbiBmb290bm90ZURlZmluaXRpb24obm9kZSwgXywgc3RhdGUsIGluZm8pIHtcbiAgICBjb25zdCB0cmFja2VyID0gc3RhdGUuY3JlYXRlVHJhY2tlcihpbmZvKVxuICAgIGxldCB2YWx1ZSA9IHRyYWNrZXIubW92ZSgnW14nKVxuICAgIGNvbnN0IGV4aXQgPSBzdGF0ZS5lbnRlcignZm9vdG5vdGVEZWZpbml0aW9uJylcbiAgICBjb25zdCBzdWJleGl0ID0gc3RhdGUuZW50ZXIoJ2xhYmVsJylcbiAgICB2YWx1ZSArPSB0cmFja2VyLm1vdmUoXG4gICAgICBzdGF0ZS5zYWZlKHN0YXRlLmFzc29jaWF0aW9uSWQobm9kZSksIHtiZWZvcmU6IHZhbHVlLCBhZnRlcjogJ10nfSlcbiAgICApXG4gICAgc3ViZXhpdCgpXG5cbiAgICB2YWx1ZSArPSB0cmFja2VyLm1vdmUoJ106JylcblxuICAgIGlmIChub2RlLmNoaWxkcmVuICYmIG5vZGUuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgdHJhY2tlci5zaGlmdCg0KVxuXG4gICAgICB2YWx1ZSArPSB0cmFja2VyLm1vdmUoXG4gICAgICAgIChmaXJzdExpbmVCbGFuayA/ICdcXG4nIDogJyAnKSArXG4gICAgICAgICAgc3RhdGUuaW5kZW50TGluZXMoXG4gICAgICAgICAgICBzdGF0ZS5jb250YWluZXJGbG93KG5vZGUsIHRyYWNrZXIuY3VycmVudCgpKSxcbiAgICAgICAgICAgIGZpcnN0TGluZUJsYW5rID8gbWFwQWxsIDogbWFwRXhjZXB0Rmlyc3RcbiAgICAgICAgICApXG4gICAgICApXG4gICAgfVxuXG4gICAgZXhpdCgpXG5cbiAgICByZXR1cm4gdmFsdWVcbiAgfVxufVxuXG4vKiogQHR5cGUge01hcH0gKi9cbmZ1bmN0aW9uIG1hcEV4Y2VwdEZpcnN0KGxpbmUsIGluZGV4LCBibGFuaykge1xuICByZXR1cm4gaW5kZXggPT09IDAgPyBsaW5lIDogbWFwQWxsKGxpbmUsIGluZGV4LCBibGFuaylcbn1cblxuLyoqIEB0eXBlIHtNYXB9ICovXG5mdW5jdGlvbiBtYXBBbGwobGluZSwgaW5kZXgsIGJsYW5rKSB7XG4gIHJldHVybiAoYmxhbmsgPyAnJyA6ICcgICAgJykgKyBsaW5lXG59XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/mdast-util-gfm-footnote/lib/index.js\n");

/***/ })

};
;