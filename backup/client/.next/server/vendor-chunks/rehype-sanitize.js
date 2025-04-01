"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/rehype-sanitize";
exports.ids = ["vendor-chunks/rehype-sanitize"];
exports.modules = {

/***/ "(ssr)/./node_modules/rehype-sanitize/lib/index.js":
/*!***************************************************!*\
  !*** ./node_modules/rehype-sanitize/lib/index.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ rehypeSanitize)\n/* harmony export */ });\n/* harmony import */ var hast_util_sanitize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! hast-util-sanitize */ \"(ssr)/./node_modules/hast-util-sanitize/lib/index.js\");\n/**\n * @typedef {import('hast').Root} Root\n * @typedef {import('hast-util-sanitize').Schema} Schema\n */\n\n\n\n/**\n * Sanitize HTML.\n *\n * @param {Schema | null | undefined} [options]\n *   Configuration (optional).\n * @returns\n *   Transform.\n */\nfunction rehypeSanitize(options) {\n  /**\n   * @param {Root} tree\n   *   Tree.\n   * @returns {Root}\n   *   New tree.\n   */\n  return function (tree) {\n    // Assume root in -> root out.\n    const result = /** @type {Root} */ ((0,hast_util_sanitize__WEBPACK_IMPORTED_MODULE_0__.sanitize)(tree, options))\n    return result\n  }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvcmVoeXBlLXNhbml0aXplL2xpYi9pbmRleC5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0EsYUFBYSxxQkFBcUI7QUFDbEMsYUFBYSxxQ0FBcUM7QUFDbEQ7O0FBRTJDOztBQUUzQztBQUNBO0FBQ0E7QUFDQSxXQUFXLDJCQUEyQjtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNlO0FBQ2Y7QUFDQSxhQUFhLE1BQU07QUFDbkI7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsTUFBTSxJQUFJLDREQUFRO0FBQ2hEO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsiL1VzZXJzL2hpcmVzaGIvRG9jdW1lbnRzL2NvZGluZy9zaWRlLXByb2plY3RzL1gtQnJvd3Nlci1BZ2VudC9jbGllbnQvbm9kZV9tb2R1bGVzL3JlaHlwZS1zYW5pdGl6ZS9saWIvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCdoYXN0JykuUm9vdH0gUm9vdFxuICogQHR5cGVkZWYge2ltcG9ydCgnaGFzdC11dGlsLXNhbml0aXplJykuU2NoZW1hfSBTY2hlbWFcbiAqL1xuXG5pbXBvcnQge3Nhbml0aXplfSBmcm9tICdoYXN0LXV0aWwtc2FuaXRpemUnXG5cbi8qKlxuICogU2FuaXRpemUgSFRNTC5cbiAqXG4gKiBAcGFyYW0ge1NjaGVtYSB8IG51bGwgfCB1bmRlZmluZWR9IFtvcHRpb25zXVxuICogICBDb25maWd1cmF0aW9uIChvcHRpb25hbCkuXG4gKiBAcmV0dXJuc1xuICogICBUcmFuc2Zvcm0uXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJlaHlwZVNhbml0aXplKG9wdGlvbnMpIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7Um9vdH0gdHJlZVxuICAgKiAgIFRyZWUuXG4gICAqIEByZXR1cm5zIHtSb290fVxuICAgKiAgIE5ldyB0cmVlLlxuICAgKi9cbiAgcmV0dXJuIGZ1bmN0aW9uICh0cmVlKSB7XG4gICAgLy8gQXNzdW1lIHJvb3QgaW4gLT4gcm9vdCBvdXQuXG4gICAgY29uc3QgcmVzdWx0ID0gLyoqIEB0eXBlIHtSb290fSAqLyAoc2FuaXRpemUodHJlZSwgb3B0aW9ucykpXG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG59XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/rehype-sanitize/lib/index.js\n");

/***/ })

};
;