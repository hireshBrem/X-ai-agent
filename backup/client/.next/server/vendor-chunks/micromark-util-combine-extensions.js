"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/micromark-util-combine-extensions";
exports.ids = ["vendor-chunks/micromark-util-combine-extensions"];
exports.modules = {

/***/ "(ssr)/./node_modules/micromark-util-combine-extensions/index.js":
/*!*****************************************************************!*\
  !*** ./node_modules/micromark-util-combine-extensions/index.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   combineExtensions: () => (/* binding */ combineExtensions),\n/* harmony export */   combineHtmlExtensions: () => (/* binding */ combineHtmlExtensions)\n/* harmony export */ });\n/* harmony import */ var micromark_util_chunked__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! micromark-util-chunked */ \"(ssr)/./node_modules/micromark-util-chunked/dev/index.js\");\n/**\n * @import {\n *   Extension,\n *   Handles,\n *   HtmlExtension,\n *   NormalizedExtension\n * } from 'micromark-util-types'\n */\n\n\n\nconst hasOwnProperty = {}.hasOwnProperty\n\n/**\n * Combine multiple syntax extensions into one.\n *\n * @param {ReadonlyArray<Extension>} extensions\n *   List of syntax extensions.\n * @returns {NormalizedExtension}\n *   A single combined extension.\n */\nfunction combineExtensions(extensions) {\n  /** @type {NormalizedExtension} */\n  const all = {}\n  let index = -1\n\n  while (++index < extensions.length) {\n    syntaxExtension(all, extensions[index])\n  }\n\n  return all\n}\n\n/**\n * Merge `extension` into `all`.\n *\n * @param {NormalizedExtension} all\n *   Extension to merge into.\n * @param {Extension} extension\n *   Extension to merge.\n * @returns {undefined}\n *   Nothing.\n */\nfunction syntaxExtension(all, extension) {\n  /** @type {keyof Extension} */\n  let hook\n\n  for (hook in extension) {\n    const maybe = hasOwnProperty.call(all, hook) ? all[hook] : undefined\n    /** @type {Record<string, unknown>} */\n    const left = maybe || (all[hook] = {})\n    /** @type {Record<string, unknown> | undefined} */\n    const right = extension[hook]\n    /** @type {string} */\n    let code\n\n    if (right) {\n      for (code in right) {\n        if (!hasOwnProperty.call(left, code)) left[code] = []\n        const value = right[code]\n        constructs(\n          // @ts-expect-error Looks like a list.\n          left[code],\n          Array.isArray(value) ? value : value ? [value] : []\n        )\n      }\n    }\n  }\n}\n\n/**\n * Merge `list` into `existing` (both lists of constructs).\n * Mutates `existing`.\n *\n * @param {Array<unknown>} existing\n *   List of constructs to merge into.\n * @param {Array<unknown>} list\n *   List of constructs to merge.\n * @returns {undefined}\n *   Nothing.\n */\nfunction constructs(existing, list) {\n  let index = -1\n  /** @type {Array<unknown>} */\n  const before = []\n\n  while (++index < list.length) {\n    // @ts-expect-error Looks like an object.\n    ;(list[index].add === 'after' ? existing : before).push(list[index])\n  }\n\n  (0,micromark_util_chunked__WEBPACK_IMPORTED_MODULE_0__.splice)(existing, 0, 0, before)\n}\n\n/**\n * Combine multiple HTML extensions into one.\n *\n * @param {ReadonlyArray<HtmlExtension>} htmlExtensions\n *   List of HTML extensions.\n * @returns {HtmlExtension}\n *   Single combined HTML extension.\n */\nfunction combineHtmlExtensions(htmlExtensions) {\n  /** @type {HtmlExtension} */\n  const handlers = {}\n  let index = -1\n\n  while (++index < htmlExtensions.length) {\n    htmlExtension(handlers, htmlExtensions[index])\n  }\n\n  return handlers\n}\n\n/**\n * Merge `extension` into `all`.\n *\n * @param {HtmlExtension} all\n *   Extension to merge into.\n * @param {HtmlExtension} extension\n *   Extension to merge.\n * @returns {undefined}\n *   Nothing.\n */\nfunction htmlExtension(all, extension) {\n  /** @type {keyof HtmlExtension} */\n  let hook\n\n  for (hook in extension) {\n    const maybe = hasOwnProperty.call(all, hook) ? all[hook] : undefined\n    const left = maybe || (all[hook] = {})\n    const right = extension[hook]\n    /** @type {keyof Handles} */\n    let type\n\n    if (right) {\n      for (type in right) {\n        // @ts-expect-error assume document vs regular handler are managed correctly.\n        left[type] = right[type]\n      }\n    }\n  }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbWljcm9tYXJrLXV0aWwtY29tYmluZS1leHRlbnNpb25zL2luZGV4LmpzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFNkM7O0FBRTdDLHlCQUF5Qjs7QUFFekI7QUFDQTtBQUNBO0FBQ0EsV0FBVywwQkFBMEI7QUFDckM7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNPO0FBQ1AsYUFBYSxxQkFBcUI7QUFDbEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLHFCQUFxQjtBQUNoQztBQUNBLFdBQVcsV0FBVztBQUN0QjtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhLGlCQUFpQjtBQUM5Qjs7QUFFQTtBQUNBO0FBQ0EsZUFBZSx5QkFBeUI7QUFDeEMseUNBQXlDO0FBQ3pDLGVBQWUscUNBQXFDO0FBQ3BEO0FBQ0EsZUFBZSxRQUFRO0FBQ3ZCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxnQkFBZ0I7QUFDM0I7QUFDQSxXQUFXLGdCQUFnQjtBQUMzQjtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsZ0JBQWdCO0FBQzdCOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUEsRUFBRSw4REFBTTtBQUNSOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsOEJBQThCO0FBQ3pDO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDTztBQUNQLGFBQWEsZUFBZTtBQUM1QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsZUFBZTtBQUMxQjtBQUNBLFdBQVcsZUFBZTtBQUMxQjtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhLHFCQUFxQjtBQUNsQzs7QUFFQTtBQUNBO0FBQ0EseUNBQXlDO0FBQ3pDO0FBQ0EsZUFBZSxlQUFlO0FBQzlCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIi9Vc2Vycy9oaXJlc2hiL0RvY3VtZW50cy9jb2Rpbmcvc2lkZS1wcm9qZWN0cy9YLUJyb3dzZXItQWdlbnQvY2xpZW50L25vZGVfbW9kdWxlcy9taWNyb21hcmstdXRpbC1jb21iaW5lLWV4dGVuc2lvbnMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAaW1wb3J0IHtcbiAqICAgRXh0ZW5zaW9uLFxuICogICBIYW5kbGVzLFxuICogICBIdG1sRXh0ZW5zaW9uLFxuICogICBOb3JtYWxpemVkRXh0ZW5zaW9uXG4gKiB9IGZyb20gJ21pY3JvbWFyay11dGlsLXR5cGVzJ1xuICovXG5cbmltcG9ydCB7c3BsaWNlfSBmcm9tICdtaWNyb21hcmstdXRpbC1jaHVua2VkJ1xuXG5jb25zdCBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5XG5cbi8qKlxuICogQ29tYmluZSBtdWx0aXBsZSBzeW50YXggZXh0ZW5zaW9ucyBpbnRvIG9uZS5cbiAqXG4gKiBAcGFyYW0ge1JlYWRvbmx5QXJyYXk8RXh0ZW5zaW9uPn0gZXh0ZW5zaW9uc1xuICogICBMaXN0IG9mIHN5bnRheCBleHRlbnNpb25zLlxuICogQHJldHVybnMge05vcm1hbGl6ZWRFeHRlbnNpb259XG4gKiAgIEEgc2luZ2xlIGNvbWJpbmVkIGV4dGVuc2lvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmVFeHRlbnNpb25zKGV4dGVuc2lvbnMpIHtcbiAgLyoqIEB0eXBlIHtOb3JtYWxpemVkRXh0ZW5zaW9ufSAqL1xuICBjb25zdCBhbGwgPSB7fVxuICBsZXQgaW5kZXggPSAtMVxuXG4gIHdoaWxlICgrK2luZGV4IDwgZXh0ZW5zaW9ucy5sZW5ndGgpIHtcbiAgICBzeW50YXhFeHRlbnNpb24oYWxsLCBleHRlbnNpb25zW2luZGV4XSlcbiAgfVxuXG4gIHJldHVybiBhbGxcbn1cblxuLyoqXG4gKiBNZXJnZSBgZXh0ZW5zaW9uYCBpbnRvIGBhbGxgLlxuICpcbiAqIEBwYXJhbSB7Tm9ybWFsaXplZEV4dGVuc2lvbn0gYWxsXG4gKiAgIEV4dGVuc2lvbiB0byBtZXJnZSBpbnRvLlxuICogQHBhcmFtIHtFeHRlbnNpb259IGV4dGVuc2lvblxuICogICBFeHRlbnNpb24gdG8gbWVyZ2UuXG4gKiBAcmV0dXJucyB7dW5kZWZpbmVkfVxuICogICBOb3RoaW5nLlxuICovXG5mdW5jdGlvbiBzeW50YXhFeHRlbnNpb24oYWxsLCBleHRlbnNpb24pIHtcbiAgLyoqIEB0eXBlIHtrZXlvZiBFeHRlbnNpb259ICovXG4gIGxldCBob29rXG5cbiAgZm9yIChob29rIGluIGV4dGVuc2lvbikge1xuICAgIGNvbnN0IG1heWJlID0gaGFzT3duUHJvcGVydHkuY2FsbChhbGwsIGhvb2spID8gYWxsW2hvb2tdIDogdW5kZWZpbmVkXG4gICAgLyoqIEB0eXBlIHtSZWNvcmQ8c3RyaW5nLCB1bmtub3duPn0gKi9cbiAgICBjb25zdCBsZWZ0ID0gbWF5YmUgfHwgKGFsbFtob29rXSA9IHt9KVxuICAgIC8qKiBAdHlwZSB7UmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCB1bmRlZmluZWR9ICovXG4gICAgY29uc3QgcmlnaHQgPSBleHRlbnNpb25baG9va11cbiAgICAvKiogQHR5cGUge3N0cmluZ30gKi9cbiAgICBsZXQgY29kZVxuXG4gICAgaWYgKHJpZ2h0KSB7XG4gICAgICBmb3IgKGNvZGUgaW4gcmlnaHQpIHtcbiAgICAgICAgaWYgKCFoYXNPd25Qcm9wZXJ0eS5jYWxsKGxlZnQsIGNvZGUpKSBsZWZ0W2NvZGVdID0gW11cbiAgICAgICAgY29uc3QgdmFsdWUgPSByaWdodFtjb2RlXVxuICAgICAgICBjb25zdHJ1Y3RzKFxuICAgICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgTG9va3MgbGlrZSBhIGxpc3QuXG4gICAgICAgICAgbGVmdFtjb2RlXSxcbiAgICAgICAgICBBcnJheS5pc0FycmF5KHZhbHVlKSA/IHZhbHVlIDogdmFsdWUgPyBbdmFsdWVdIDogW11cbiAgICAgICAgKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIE1lcmdlIGBsaXN0YCBpbnRvIGBleGlzdGluZ2AgKGJvdGggbGlzdHMgb2YgY29uc3RydWN0cykuXG4gKiBNdXRhdGVzIGBleGlzdGluZ2AuXG4gKlxuICogQHBhcmFtIHtBcnJheTx1bmtub3duPn0gZXhpc3RpbmdcbiAqICAgTGlzdCBvZiBjb25zdHJ1Y3RzIHRvIG1lcmdlIGludG8uXG4gKiBAcGFyYW0ge0FycmF5PHVua25vd24+fSBsaXN0XG4gKiAgIExpc3Qgb2YgY29uc3RydWN0cyB0byBtZXJnZS5cbiAqIEByZXR1cm5zIHt1bmRlZmluZWR9XG4gKiAgIE5vdGhpbmcuXG4gKi9cbmZ1bmN0aW9uIGNvbnN0cnVjdHMoZXhpc3RpbmcsIGxpc3QpIHtcbiAgbGV0IGluZGV4ID0gLTFcbiAgLyoqIEB0eXBlIHtBcnJheTx1bmtub3duPn0gKi9cbiAgY29uc3QgYmVmb3JlID0gW11cblxuICB3aGlsZSAoKytpbmRleCA8IGxpc3QubGVuZ3RoKSB7XG4gICAgLy8gQHRzLWV4cGVjdC1lcnJvciBMb29rcyBsaWtlIGFuIG9iamVjdC5cbiAgICA7KGxpc3RbaW5kZXhdLmFkZCA9PT0gJ2FmdGVyJyA/IGV4aXN0aW5nIDogYmVmb3JlKS5wdXNoKGxpc3RbaW5kZXhdKVxuICB9XG5cbiAgc3BsaWNlKGV4aXN0aW5nLCAwLCAwLCBiZWZvcmUpXG59XG5cbi8qKlxuICogQ29tYmluZSBtdWx0aXBsZSBIVE1MIGV4dGVuc2lvbnMgaW50byBvbmUuXG4gKlxuICogQHBhcmFtIHtSZWFkb25seUFycmF5PEh0bWxFeHRlbnNpb24+fSBodG1sRXh0ZW5zaW9uc1xuICogICBMaXN0IG9mIEhUTUwgZXh0ZW5zaW9ucy5cbiAqIEByZXR1cm5zIHtIdG1sRXh0ZW5zaW9ufVxuICogICBTaW5nbGUgY29tYmluZWQgSFRNTCBleHRlbnNpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lSHRtbEV4dGVuc2lvbnMoaHRtbEV4dGVuc2lvbnMpIHtcbiAgLyoqIEB0eXBlIHtIdG1sRXh0ZW5zaW9ufSAqL1xuICBjb25zdCBoYW5kbGVycyA9IHt9XG4gIGxldCBpbmRleCA9IC0xXG5cbiAgd2hpbGUgKCsraW5kZXggPCBodG1sRXh0ZW5zaW9ucy5sZW5ndGgpIHtcbiAgICBodG1sRXh0ZW5zaW9uKGhhbmRsZXJzLCBodG1sRXh0ZW5zaW9uc1tpbmRleF0pXG4gIH1cblxuICByZXR1cm4gaGFuZGxlcnNcbn1cblxuLyoqXG4gKiBNZXJnZSBgZXh0ZW5zaW9uYCBpbnRvIGBhbGxgLlxuICpcbiAqIEBwYXJhbSB7SHRtbEV4dGVuc2lvbn0gYWxsXG4gKiAgIEV4dGVuc2lvbiB0byBtZXJnZSBpbnRvLlxuICogQHBhcmFtIHtIdG1sRXh0ZW5zaW9ufSBleHRlbnNpb25cbiAqICAgRXh0ZW5zaW9uIHRvIG1lcmdlLlxuICogQHJldHVybnMge3VuZGVmaW5lZH1cbiAqICAgTm90aGluZy5cbiAqL1xuZnVuY3Rpb24gaHRtbEV4dGVuc2lvbihhbGwsIGV4dGVuc2lvbikge1xuICAvKiogQHR5cGUge2tleW9mIEh0bWxFeHRlbnNpb259ICovXG4gIGxldCBob29rXG5cbiAgZm9yIChob29rIGluIGV4dGVuc2lvbikge1xuICAgIGNvbnN0IG1heWJlID0gaGFzT3duUHJvcGVydHkuY2FsbChhbGwsIGhvb2spID8gYWxsW2hvb2tdIDogdW5kZWZpbmVkXG4gICAgY29uc3QgbGVmdCA9IG1heWJlIHx8IChhbGxbaG9va10gPSB7fSlcbiAgICBjb25zdCByaWdodCA9IGV4dGVuc2lvbltob29rXVxuICAgIC8qKiBAdHlwZSB7a2V5b2YgSGFuZGxlc30gKi9cbiAgICBsZXQgdHlwZVxuXG4gICAgaWYgKHJpZ2h0KSB7XG4gICAgICBmb3IgKHR5cGUgaW4gcmlnaHQpIHtcbiAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvciBhc3N1bWUgZG9jdW1lbnQgdnMgcmVndWxhciBoYW5kbGVyIGFyZSBtYW5hZ2VkIGNvcnJlY3RseS5cbiAgICAgICAgbGVmdFt0eXBlXSA9IHJpZ2h0W3R5cGVdXG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/micromark-util-combine-extensions/index.js\n");

/***/ })

};
;