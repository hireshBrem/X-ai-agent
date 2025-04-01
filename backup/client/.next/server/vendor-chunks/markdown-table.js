"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/markdown-table";
exports.ids = ["vendor-chunks/markdown-table"];
exports.modules = {

/***/ "(ssr)/./node_modules/markdown-table/index.js":
/*!**********************************************!*\
  !*** ./node_modules/markdown-table/index.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   markdownTable: () => (/* binding */ markdownTable)\n/* harmony export */ });\n// To do: next major: remove.\n/**\n * @typedef {Options} MarkdownTableOptions\n *   Configuration.\n */\n\n/**\n * @typedef Options\n *   Configuration.\n * @property {boolean | null | undefined} [alignDelimiters=true]\n *   Whether to align the delimiters (default: `true`);\n *   they are aligned by default:\n *\n *   ```markdown\n *   | Alpha | B     |\n *   | ----- | ----- |\n *   | C     | Delta |\n *   ```\n *\n *   Pass `false` to make them staggered:\n *\n *   ```markdown\n *   | Alpha | B |\n *   | - | - |\n *   | C | Delta |\n *   ```\n * @property {ReadonlyArray<string | null | undefined> | string | null | undefined} [align]\n *   How to align columns (default: `''`);\n *   one style for all columns or styles for their respective columns;\n *   each style is either `'l'` (left), `'r'` (right), or `'c'` (center);\n *   other values are treated as `''`, which doesn’t place the colon in the\n *   alignment row but does align left;\n *   *only the lowercased first character is used, so `Right` is fine.*\n * @property {boolean | null | undefined} [delimiterEnd=true]\n *   Whether to end each row with the delimiter (default: `true`).\n *\n *   > 👉 **Note**: please don’t use this: it could create fragile structures\n *   > that aren’t understandable to some markdown parsers.\n *\n *   When `true`, there are ending delimiters:\n *\n *   ```markdown\n *   | Alpha | B     |\n *   | ----- | ----- |\n *   | C     | Delta |\n *   ```\n *\n *   When `false`, there are no ending delimiters:\n *\n *   ```markdown\n *   | Alpha | B\n *   | ----- | -----\n *   | C     | Delta\n *   ```\n * @property {boolean | null | undefined} [delimiterStart=true]\n *   Whether to begin each row with the delimiter (default: `true`).\n *\n *   > 👉 **Note**: please don’t use this: it could create fragile structures\n *   > that aren’t understandable to some markdown parsers.\n *\n *   When `true`, there are starting delimiters:\n *\n *   ```markdown\n *   | Alpha | B     |\n *   | ----- | ----- |\n *   | C     | Delta |\n *   ```\n *\n *   When `false`, there are no starting delimiters:\n *\n *   ```markdown\n *   Alpha | B     |\n *   ----- | ----- |\n *   C     | Delta |\n *   ```\n * @property {boolean | null | undefined} [padding=true]\n *   Whether to add a space of padding between delimiters and cells\n *   (default: `true`).\n *\n *   When `true`, there is padding:\n *\n *   ```markdown\n *   | Alpha | B     |\n *   | ----- | ----- |\n *   | C     | Delta |\n *   ```\n *\n *   When `false`, there is no padding:\n *\n *   ```markdown\n *   |Alpha|B    |\n *   |-----|-----|\n *   |C    |Delta|\n *   ```\n * @property {((value: string) => number) | null | undefined} [stringLength]\n *   Function to detect the length of table cell content (optional);\n *   this is used when aligning the delimiters (`|`) between table cells;\n *   full-width characters and emoji mess up delimiter alignment when viewing\n *   the markdown source;\n *   to fix this, you can pass this function,\n *   which receives the cell content and returns its “visible” size;\n *   note that what is and isn’t visible depends on where the text is displayed.\n *\n *   Without such a function, the following:\n *\n *   ```js\n *   markdownTable([\n *     ['Alpha', 'Bravo'],\n *     ['中文', 'Charlie'],\n *     ['👩‍❤️‍👩', 'Delta']\n *   ])\n *   ```\n *\n *   Yields:\n *\n *   ```markdown\n *   | Alpha | Bravo |\n *   | - | - |\n *   | 中文 | Charlie |\n *   | 👩‍❤️‍👩 | Delta |\n *   ```\n *\n *   With [`string-width`](https://github.com/sindresorhus/string-width):\n *\n *   ```js\n *   import stringWidth from 'string-width'\n *\n *   markdownTable(\n *     [\n *       ['Alpha', 'Bravo'],\n *       ['中文', 'Charlie'],\n *       ['👩‍❤️‍👩', 'Delta']\n *     ],\n *     {stringLength: stringWidth}\n *   )\n *   ```\n *\n *   Yields:\n *\n *   ```markdown\n *   | Alpha | Bravo   |\n *   | ----- | ------- |\n *   | 中文  | Charlie |\n *   | 👩‍❤️‍👩    | Delta   |\n *   ```\n */\n\n/**\n * @param {string} value\n *   Cell value.\n * @returns {number}\n *   Cell size.\n */\nfunction defaultStringLength(value) {\n  return value.length\n}\n\n/**\n * Generate a markdown\n * ([GFM](https://docs.github.com/en/github/writing-on-github/working-with-advanced-formatting/organizing-information-with-tables))\n * table.\n *\n * @param {ReadonlyArray<ReadonlyArray<string | null | undefined>>} table\n *   Table data (matrix of strings).\n * @param {Readonly<Options> | null | undefined} [options]\n *   Configuration (optional).\n * @returns {string}\n *   Result.\n */\nfunction markdownTable(table, options) {\n  const settings = options || {}\n  // To do: next major: change to spread.\n  const align = (settings.align || []).concat()\n  const stringLength = settings.stringLength || defaultStringLength\n  /** @type {Array<number>} Character codes as symbols for alignment per column. */\n  const alignments = []\n  /** @type {Array<Array<string>>} Cells per row. */\n  const cellMatrix = []\n  /** @type {Array<Array<number>>} Sizes of each cell per row. */\n  const sizeMatrix = []\n  /** @type {Array<number>} */\n  const longestCellByColumn = []\n  let mostCellsPerRow = 0\n  let rowIndex = -1\n\n  // This is a superfluous loop if we don’t align delimiters, but otherwise we’d\n  // do superfluous work when aligning, so optimize for aligning.\n  while (++rowIndex < table.length) {\n    /** @type {Array<string>} */\n    const row = []\n    /** @type {Array<number>} */\n    const sizes = []\n    let columnIndex = -1\n\n    if (table[rowIndex].length > mostCellsPerRow) {\n      mostCellsPerRow = table[rowIndex].length\n    }\n\n    while (++columnIndex < table[rowIndex].length) {\n      const cell = serialize(table[rowIndex][columnIndex])\n\n      if (settings.alignDelimiters !== false) {\n        const size = stringLength(cell)\n        sizes[columnIndex] = size\n\n        if (\n          longestCellByColumn[columnIndex] === undefined ||\n          size > longestCellByColumn[columnIndex]\n        ) {\n          longestCellByColumn[columnIndex] = size\n        }\n      }\n\n      row.push(cell)\n    }\n\n    cellMatrix[rowIndex] = row\n    sizeMatrix[rowIndex] = sizes\n  }\n\n  // Figure out which alignments to use.\n  let columnIndex = -1\n\n  if (typeof align === 'object' && 'length' in align) {\n    while (++columnIndex < mostCellsPerRow) {\n      alignments[columnIndex] = toAlignment(align[columnIndex])\n    }\n  } else {\n    const code = toAlignment(align)\n\n    while (++columnIndex < mostCellsPerRow) {\n      alignments[columnIndex] = code\n    }\n  }\n\n  // Inject the alignment row.\n  columnIndex = -1\n  /** @type {Array<string>} */\n  const row = []\n  /** @type {Array<number>} */\n  const sizes = []\n\n  while (++columnIndex < mostCellsPerRow) {\n    const code = alignments[columnIndex]\n    let before = ''\n    let after = ''\n\n    if (code === 99 /* `c` */) {\n      before = ':'\n      after = ':'\n    } else if (code === 108 /* `l` */) {\n      before = ':'\n    } else if (code === 114 /* `r` */) {\n      after = ':'\n    }\n\n    // There *must* be at least one hyphen-minus in each alignment cell.\n    let size =\n      settings.alignDelimiters === false\n        ? 1\n        : Math.max(\n            1,\n            longestCellByColumn[columnIndex] - before.length - after.length\n          )\n\n    const cell = before + '-'.repeat(size) + after\n\n    if (settings.alignDelimiters !== false) {\n      size = before.length + size + after.length\n\n      if (size > longestCellByColumn[columnIndex]) {\n        longestCellByColumn[columnIndex] = size\n      }\n\n      sizes[columnIndex] = size\n    }\n\n    row[columnIndex] = cell\n  }\n\n  // Inject the alignment row.\n  cellMatrix.splice(1, 0, row)\n  sizeMatrix.splice(1, 0, sizes)\n\n  rowIndex = -1\n  /** @type {Array<string>} */\n  const lines = []\n\n  while (++rowIndex < cellMatrix.length) {\n    const row = cellMatrix[rowIndex]\n    const sizes = sizeMatrix[rowIndex]\n    columnIndex = -1\n    /** @type {Array<string>} */\n    const line = []\n\n    while (++columnIndex < mostCellsPerRow) {\n      const cell = row[columnIndex] || ''\n      let before = ''\n      let after = ''\n\n      if (settings.alignDelimiters !== false) {\n        const size =\n          longestCellByColumn[columnIndex] - (sizes[columnIndex] || 0)\n        const code = alignments[columnIndex]\n\n        if (code === 114 /* `r` */) {\n          before = ' '.repeat(size)\n        } else if (code === 99 /* `c` */) {\n          if (size % 2) {\n            before = ' '.repeat(size / 2 + 0.5)\n            after = ' '.repeat(size / 2 - 0.5)\n          } else {\n            before = ' '.repeat(size / 2)\n            after = before\n          }\n        } else {\n          after = ' '.repeat(size)\n        }\n      }\n\n      if (settings.delimiterStart !== false && !columnIndex) {\n        line.push('|')\n      }\n\n      if (\n        settings.padding !== false &&\n        // Don’t add the opening space if we’re not aligning and the cell is\n        // empty: there will be a closing space.\n        !(settings.alignDelimiters === false && cell === '') &&\n        (settings.delimiterStart !== false || columnIndex)\n      ) {\n        line.push(' ')\n      }\n\n      if (settings.alignDelimiters !== false) {\n        line.push(before)\n      }\n\n      line.push(cell)\n\n      if (settings.alignDelimiters !== false) {\n        line.push(after)\n      }\n\n      if (settings.padding !== false) {\n        line.push(' ')\n      }\n\n      if (\n        settings.delimiterEnd !== false ||\n        columnIndex !== mostCellsPerRow - 1\n      ) {\n        line.push('|')\n      }\n    }\n\n    lines.push(\n      settings.delimiterEnd === false\n        ? line.join('').replace(/ +$/, '')\n        : line.join('')\n    )\n  }\n\n  return lines.join('\\n')\n}\n\n/**\n * @param {string | null | undefined} [value]\n *   Value to serialize.\n * @returns {string}\n *   Result.\n */\nfunction serialize(value) {\n  return value === null || value === undefined ? '' : String(value)\n}\n\n/**\n * @param {string | null | undefined} value\n *   Value.\n * @returns {number}\n *   Alignment.\n */\nfunction toAlignment(value) {\n  const code = typeof value === 'string' ? value.codePointAt(0) : 0\n\n  return code === 67 /* `C` */ || code === 99 /* `c` */\n    ? 99 /* `c` */\n    : code === 76 /* `L` */ || code === 108 /* `l` */\n      ? 108 /* `l` */\n      : code === 82 /* `R` */ || code === 114 /* `r` */\n        ? 114 /* `r` */\n        : 0\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbWFya2Rvd24tdGFibGUvaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7OztBQUFBO0FBQ0E7QUFDQSxhQUFhLFNBQVM7QUFDdEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLDRCQUE0QjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsc0VBQXNFO0FBQ3BGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsNEJBQTRCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLDRCQUE0QjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYyw0QkFBNEI7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYyxnREFBZ0Q7QUFDOUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxXQUFXLFFBQVE7QUFDbkI7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyx5REFBeUQ7QUFDcEU7QUFDQSxXQUFXLHNDQUFzQztBQUNqRDtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsZUFBZTtBQUM1QjtBQUNBLGFBQWEsc0JBQXNCO0FBQ25DO0FBQ0EsYUFBYSxzQkFBc0I7QUFDbkM7QUFDQSxhQUFhLGVBQWU7QUFDNUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsZUFBZTtBQUM5QjtBQUNBLGVBQWUsZUFBZTtBQUM5QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLGVBQWU7QUFDNUI7QUFDQSxhQUFhLGVBQWU7QUFDNUI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxlQUFlO0FBQzVCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxlQUFlO0FBQzlCOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLFdBQVcsMkJBQTJCO0FBQ3RDO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxXQUFXLDJCQUEyQjtBQUN0QztBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyIvVXNlcnMvaGlyZXNoYi9Eb2N1bWVudHMvY29kaW5nL3NpZGUtcHJvamVjdHMvWC1Ccm93c2VyLUFnZW50L2NsaWVudC9ub2RlX21vZHVsZXMvbWFya2Rvd24tdGFibGUvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVG8gZG86IG5leHQgbWFqb3I6IHJlbW92ZS5cbi8qKlxuICogQHR5cGVkZWYge09wdGlvbnN9IE1hcmtkb3duVGFibGVPcHRpb25zXG4gKiAgIENvbmZpZ3VyYXRpb24uXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiBPcHRpb25zXG4gKiAgIENvbmZpZ3VyYXRpb24uXG4gKiBAcHJvcGVydHkge2Jvb2xlYW4gfCBudWxsIHwgdW5kZWZpbmVkfSBbYWxpZ25EZWxpbWl0ZXJzPXRydWVdXG4gKiAgIFdoZXRoZXIgdG8gYWxpZ24gdGhlIGRlbGltaXRlcnMgKGRlZmF1bHQ6IGB0cnVlYCk7XG4gKiAgIHRoZXkgYXJlIGFsaWduZWQgYnkgZGVmYXVsdDpcbiAqXG4gKiAgIGBgYG1hcmtkb3duXG4gKiAgIHwgQWxwaGEgfCBCICAgICB8XG4gKiAgIHwgLS0tLS0gfCAtLS0tLSB8XG4gKiAgIHwgQyAgICAgfCBEZWx0YSB8XG4gKiAgIGBgYFxuICpcbiAqICAgUGFzcyBgZmFsc2VgIHRvIG1ha2UgdGhlbSBzdGFnZ2VyZWQ6XG4gKlxuICogICBgYGBtYXJrZG93blxuICogICB8IEFscGhhIHwgQiB8XG4gKiAgIHwgLSB8IC0gfFxuICogICB8IEMgfCBEZWx0YSB8XG4gKiAgIGBgYFxuICogQHByb3BlcnR5IHtSZWFkb25seUFycmF5PHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQ+IHwgc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZH0gW2FsaWduXVxuICogICBIb3cgdG8gYWxpZ24gY29sdW1ucyAoZGVmYXVsdDogYCcnYCk7XG4gKiAgIG9uZSBzdHlsZSBmb3IgYWxsIGNvbHVtbnMgb3Igc3R5bGVzIGZvciB0aGVpciByZXNwZWN0aXZlIGNvbHVtbnM7XG4gKiAgIGVhY2ggc3R5bGUgaXMgZWl0aGVyIGAnbCdgIChsZWZ0KSwgYCdyJ2AgKHJpZ2h0KSwgb3IgYCdjJ2AgKGNlbnRlcik7XG4gKiAgIG90aGVyIHZhbHVlcyBhcmUgdHJlYXRlZCBhcyBgJydgLCB3aGljaCBkb2VzbuKAmXQgcGxhY2UgdGhlIGNvbG9uIGluIHRoZVxuICogICBhbGlnbm1lbnQgcm93IGJ1dCBkb2VzIGFsaWduIGxlZnQ7XG4gKiAgICpvbmx5IHRoZSBsb3dlcmNhc2VkIGZpcnN0IGNoYXJhY3RlciBpcyB1c2VkLCBzbyBgUmlnaHRgIGlzIGZpbmUuKlxuICogQHByb3BlcnR5IHtib29sZWFuIHwgbnVsbCB8IHVuZGVmaW5lZH0gW2RlbGltaXRlckVuZD10cnVlXVxuICogICBXaGV0aGVyIHRvIGVuZCBlYWNoIHJvdyB3aXRoIHRoZSBkZWxpbWl0ZXIgKGRlZmF1bHQ6IGB0cnVlYCkuXG4gKlxuICogICA+IPCfkYkgKipOb3RlKio6IHBsZWFzZSBkb27igJl0IHVzZSB0aGlzOiBpdCBjb3VsZCBjcmVhdGUgZnJhZ2lsZSBzdHJ1Y3R1cmVzXG4gKiAgID4gdGhhdCBhcmVu4oCZdCB1bmRlcnN0YW5kYWJsZSB0byBzb21lIG1hcmtkb3duIHBhcnNlcnMuXG4gKlxuICogICBXaGVuIGB0cnVlYCwgdGhlcmUgYXJlIGVuZGluZyBkZWxpbWl0ZXJzOlxuICpcbiAqICAgYGBgbWFya2Rvd25cbiAqICAgfCBBbHBoYSB8IEIgICAgIHxcbiAqICAgfCAtLS0tLSB8IC0tLS0tIHxcbiAqICAgfCBDICAgICB8IERlbHRhIHxcbiAqICAgYGBgXG4gKlxuICogICBXaGVuIGBmYWxzZWAsIHRoZXJlIGFyZSBubyBlbmRpbmcgZGVsaW1pdGVyczpcbiAqXG4gKiAgIGBgYG1hcmtkb3duXG4gKiAgIHwgQWxwaGEgfCBCXG4gKiAgIHwgLS0tLS0gfCAtLS0tLVxuICogICB8IEMgICAgIHwgRGVsdGFcbiAqICAgYGBgXG4gKiBAcHJvcGVydHkge2Jvb2xlYW4gfCBudWxsIHwgdW5kZWZpbmVkfSBbZGVsaW1pdGVyU3RhcnQ9dHJ1ZV1cbiAqICAgV2hldGhlciB0byBiZWdpbiBlYWNoIHJvdyB3aXRoIHRoZSBkZWxpbWl0ZXIgKGRlZmF1bHQ6IGB0cnVlYCkuXG4gKlxuICogICA+IPCfkYkgKipOb3RlKio6IHBsZWFzZSBkb27igJl0IHVzZSB0aGlzOiBpdCBjb3VsZCBjcmVhdGUgZnJhZ2lsZSBzdHJ1Y3R1cmVzXG4gKiAgID4gdGhhdCBhcmVu4oCZdCB1bmRlcnN0YW5kYWJsZSB0byBzb21lIG1hcmtkb3duIHBhcnNlcnMuXG4gKlxuICogICBXaGVuIGB0cnVlYCwgdGhlcmUgYXJlIHN0YXJ0aW5nIGRlbGltaXRlcnM6XG4gKlxuICogICBgYGBtYXJrZG93blxuICogICB8IEFscGhhIHwgQiAgICAgfFxuICogICB8IC0tLS0tIHwgLS0tLS0gfFxuICogICB8IEMgICAgIHwgRGVsdGEgfFxuICogICBgYGBcbiAqXG4gKiAgIFdoZW4gYGZhbHNlYCwgdGhlcmUgYXJlIG5vIHN0YXJ0aW5nIGRlbGltaXRlcnM6XG4gKlxuICogICBgYGBtYXJrZG93blxuICogICBBbHBoYSB8IEIgICAgIHxcbiAqICAgLS0tLS0gfCAtLS0tLSB8XG4gKiAgIEMgICAgIHwgRGVsdGEgfFxuICogICBgYGBcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbiB8IG51bGwgfCB1bmRlZmluZWR9IFtwYWRkaW5nPXRydWVdXG4gKiAgIFdoZXRoZXIgdG8gYWRkIGEgc3BhY2Ugb2YgcGFkZGluZyBiZXR3ZWVuIGRlbGltaXRlcnMgYW5kIGNlbGxzXG4gKiAgIChkZWZhdWx0OiBgdHJ1ZWApLlxuICpcbiAqICAgV2hlbiBgdHJ1ZWAsIHRoZXJlIGlzIHBhZGRpbmc6XG4gKlxuICogICBgYGBtYXJrZG93blxuICogICB8IEFscGhhIHwgQiAgICAgfFxuICogICB8IC0tLS0tIHwgLS0tLS0gfFxuICogICB8IEMgICAgIHwgRGVsdGEgfFxuICogICBgYGBcbiAqXG4gKiAgIFdoZW4gYGZhbHNlYCwgdGhlcmUgaXMgbm8gcGFkZGluZzpcbiAqXG4gKiAgIGBgYG1hcmtkb3duXG4gKiAgIHxBbHBoYXxCICAgIHxcbiAqICAgfC0tLS0tfC0tLS0tfFxuICogICB8QyAgICB8RGVsdGF8XG4gKiAgIGBgYFxuICogQHByb3BlcnR5IHsoKHZhbHVlOiBzdHJpbmcpID0+IG51bWJlcikgfCBudWxsIHwgdW5kZWZpbmVkfSBbc3RyaW5nTGVuZ3RoXVxuICogICBGdW5jdGlvbiB0byBkZXRlY3QgdGhlIGxlbmd0aCBvZiB0YWJsZSBjZWxsIGNvbnRlbnQgKG9wdGlvbmFsKTtcbiAqICAgdGhpcyBpcyB1c2VkIHdoZW4gYWxpZ25pbmcgdGhlIGRlbGltaXRlcnMgKGB8YCkgYmV0d2VlbiB0YWJsZSBjZWxscztcbiAqICAgZnVsbC13aWR0aCBjaGFyYWN0ZXJzIGFuZCBlbW9qaSBtZXNzIHVwIGRlbGltaXRlciBhbGlnbm1lbnQgd2hlbiB2aWV3aW5nXG4gKiAgIHRoZSBtYXJrZG93biBzb3VyY2U7XG4gKiAgIHRvIGZpeCB0aGlzLCB5b3UgY2FuIHBhc3MgdGhpcyBmdW5jdGlvbixcbiAqICAgd2hpY2ggcmVjZWl2ZXMgdGhlIGNlbGwgY29udGVudCBhbmQgcmV0dXJucyBpdHMg4oCcdmlzaWJsZeKAnSBzaXplO1xuICogICBub3RlIHRoYXQgd2hhdCBpcyBhbmQgaXNu4oCZdCB2aXNpYmxlIGRlcGVuZHMgb24gd2hlcmUgdGhlIHRleHQgaXMgZGlzcGxheWVkLlxuICpcbiAqICAgV2l0aG91dCBzdWNoIGEgZnVuY3Rpb24sIHRoZSBmb2xsb3dpbmc6XG4gKlxuICogICBgYGBqc1xuICogICBtYXJrZG93blRhYmxlKFtcbiAqICAgICBbJ0FscGhhJywgJ0JyYXZvJ10sXG4gKiAgICAgWyfkuK3mlocnLCAnQ2hhcmxpZSddLFxuICogICAgIFsn8J+RqeKAjeKdpO+4j+KAjfCfkaknLCAnRGVsdGEnXVxuICogICBdKVxuICogICBgYGBcbiAqXG4gKiAgIFlpZWxkczpcbiAqXG4gKiAgIGBgYG1hcmtkb3duXG4gKiAgIHwgQWxwaGEgfCBCcmF2byB8XG4gKiAgIHwgLSB8IC0gfFxuICogICB8IOS4reaWhyB8IENoYXJsaWUgfFxuICogICB8IPCfkanigI3inaTvuI/igI3wn5GpIHwgRGVsdGEgfFxuICogICBgYGBcbiAqXG4gKiAgIFdpdGggW2BzdHJpbmctd2lkdGhgXShodHRwczovL2dpdGh1Yi5jb20vc2luZHJlc29yaHVzL3N0cmluZy13aWR0aCk6XG4gKlxuICogICBgYGBqc1xuICogICBpbXBvcnQgc3RyaW5nV2lkdGggZnJvbSAnc3RyaW5nLXdpZHRoJ1xuICpcbiAqICAgbWFya2Rvd25UYWJsZShcbiAqICAgICBbXG4gKiAgICAgICBbJ0FscGhhJywgJ0JyYXZvJ10sXG4gKiAgICAgICBbJ+S4reaWhycsICdDaGFybGllJ10sXG4gKiAgICAgICBbJ/CfkanigI3inaTvuI/igI3wn5GpJywgJ0RlbHRhJ11cbiAqICAgICBdLFxuICogICAgIHtzdHJpbmdMZW5ndGg6IHN0cmluZ1dpZHRofVxuICogICApXG4gKiAgIGBgYFxuICpcbiAqICAgWWllbGRzOlxuICpcbiAqICAgYGBgbWFya2Rvd25cbiAqICAgfCBBbHBoYSB8IEJyYXZvICAgfFxuICogICB8IC0tLS0tIHwgLS0tLS0tLSB8XG4gKiAgIHwg5Lit5paHICB8IENoYXJsaWUgfFxuICogICB8IPCfkanigI3inaTvuI/igI3wn5GpICAgIHwgRGVsdGEgICB8XG4gKiAgIGBgYFxuICovXG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlXG4gKiAgIENlbGwgdmFsdWUuXG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICogICBDZWxsIHNpemUuXG4gKi9cbmZ1bmN0aW9uIGRlZmF1bHRTdHJpbmdMZW5ndGgodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlLmxlbmd0aFxufVxuXG4vKipcbiAqIEdlbmVyYXRlIGEgbWFya2Rvd25cbiAqIChbR0ZNXShodHRwczovL2RvY3MuZ2l0aHViLmNvbS9lbi9naXRodWIvd3JpdGluZy1vbi1naXRodWIvd29ya2luZy13aXRoLWFkdmFuY2VkLWZvcm1hdHRpbmcvb3JnYW5pemluZy1pbmZvcm1hdGlvbi13aXRoLXRhYmxlcykpXG4gKiB0YWJsZS5cbiAqXG4gKiBAcGFyYW0ge1JlYWRvbmx5QXJyYXk8UmVhZG9ubHlBcnJheTxzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkPj59IHRhYmxlXG4gKiAgIFRhYmxlIGRhdGEgKG1hdHJpeCBvZiBzdHJpbmdzKS5cbiAqIEBwYXJhbSB7UmVhZG9ubHk8T3B0aW9ucz4gfCBudWxsIHwgdW5kZWZpbmVkfSBbb3B0aW9uc11cbiAqICAgQ29uZmlndXJhdGlvbiAob3B0aW9uYWwpLlxuICogQHJldHVybnMge3N0cmluZ31cbiAqICAgUmVzdWx0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWFya2Rvd25UYWJsZSh0YWJsZSwgb3B0aW9ucykge1xuICBjb25zdCBzZXR0aW5ncyA9IG9wdGlvbnMgfHwge31cbiAgLy8gVG8gZG86IG5leHQgbWFqb3I6IGNoYW5nZSB0byBzcHJlYWQuXG4gIGNvbnN0IGFsaWduID0gKHNldHRpbmdzLmFsaWduIHx8IFtdKS5jb25jYXQoKVxuICBjb25zdCBzdHJpbmdMZW5ndGggPSBzZXR0aW5ncy5zdHJpbmdMZW5ndGggfHwgZGVmYXVsdFN0cmluZ0xlbmd0aFxuICAvKiogQHR5cGUge0FycmF5PG51bWJlcj59IENoYXJhY3RlciBjb2RlcyBhcyBzeW1ib2xzIGZvciBhbGlnbm1lbnQgcGVyIGNvbHVtbi4gKi9cbiAgY29uc3QgYWxpZ25tZW50cyA9IFtdXG4gIC8qKiBAdHlwZSB7QXJyYXk8QXJyYXk8c3RyaW5nPj59IENlbGxzIHBlciByb3cuICovXG4gIGNvbnN0IGNlbGxNYXRyaXggPSBbXVxuICAvKiogQHR5cGUge0FycmF5PEFycmF5PG51bWJlcj4+fSBTaXplcyBvZiBlYWNoIGNlbGwgcGVyIHJvdy4gKi9cbiAgY29uc3Qgc2l6ZU1hdHJpeCA9IFtdXG4gIC8qKiBAdHlwZSB7QXJyYXk8bnVtYmVyPn0gKi9cbiAgY29uc3QgbG9uZ2VzdENlbGxCeUNvbHVtbiA9IFtdXG4gIGxldCBtb3N0Q2VsbHNQZXJSb3cgPSAwXG4gIGxldCByb3dJbmRleCA9IC0xXG5cbiAgLy8gVGhpcyBpcyBhIHN1cGVyZmx1b3VzIGxvb3AgaWYgd2UgZG9u4oCZdCBhbGlnbiBkZWxpbWl0ZXJzLCBidXQgb3RoZXJ3aXNlIHdl4oCZZFxuICAvLyBkbyBzdXBlcmZsdW91cyB3b3JrIHdoZW4gYWxpZ25pbmcsIHNvIG9wdGltaXplIGZvciBhbGlnbmluZy5cbiAgd2hpbGUgKCsrcm93SW5kZXggPCB0YWJsZS5sZW5ndGgpIHtcbiAgICAvKiogQHR5cGUge0FycmF5PHN0cmluZz59ICovXG4gICAgY29uc3Qgcm93ID0gW11cbiAgICAvKiogQHR5cGUge0FycmF5PG51bWJlcj59ICovXG4gICAgY29uc3Qgc2l6ZXMgPSBbXVxuICAgIGxldCBjb2x1bW5JbmRleCA9IC0xXG5cbiAgICBpZiAodGFibGVbcm93SW5kZXhdLmxlbmd0aCA+IG1vc3RDZWxsc1BlclJvdykge1xuICAgICAgbW9zdENlbGxzUGVyUm93ID0gdGFibGVbcm93SW5kZXhdLmxlbmd0aFxuICAgIH1cblxuICAgIHdoaWxlICgrK2NvbHVtbkluZGV4IDwgdGFibGVbcm93SW5kZXhdLmxlbmd0aCkge1xuICAgICAgY29uc3QgY2VsbCA9IHNlcmlhbGl6ZSh0YWJsZVtyb3dJbmRleF1bY29sdW1uSW5kZXhdKVxuXG4gICAgICBpZiAoc2V0dGluZ3MuYWxpZ25EZWxpbWl0ZXJzICE9PSBmYWxzZSkge1xuICAgICAgICBjb25zdCBzaXplID0gc3RyaW5nTGVuZ3RoKGNlbGwpXG4gICAgICAgIHNpemVzW2NvbHVtbkluZGV4XSA9IHNpemVcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgbG9uZ2VzdENlbGxCeUNvbHVtbltjb2x1bW5JbmRleF0gPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgIHNpemUgPiBsb25nZXN0Q2VsbEJ5Q29sdW1uW2NvbHVtbkluZGV4XVxuICAgICAgICApIHtcbiAgICAgICAgICBsb25nZXN0Q2VsbEJ5Q29sdW1uW2NvbHVtbkluZGV4XSA9IHNpemVcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByb3cucHVzaChjZWxsKVxuICAgIH1cblxuICAgIGNlbGxNYXRyaXhbcm93SW5kZXhdID0gcm93XG4gICAgc2l6ZU1hdHJpeFtyb3dJbmRleF0gPSBzaXplc1xuICB9XG5cbiAgLy8gRmlndXJlIG91dCB3aGljaCBhbGlnbm1lbnRzIHRvIHVzZS5cbiAgbGV0IGNvbHVtbkluZGV4ID0gLTFcblxuICBpZiAodHlwZW9mIGFsaWduID09PSAnb2JqZWN0JyAmJiAnbGVuZ3RoJyBpbiBhbGlnbikge1xuICAgIHdoaWxlICgrK2NvbHVtbkluZGV4IDwgbW9zdENlbGxzUGVyUm93KSB7XG4gICAgICBhbGlnbm1lbnRzW2NvbHVtbkluZGV4XSA9IHRvQWxpZ25tZW50KGFsaWduW2NvbHVtbkluZGV4XSlcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgY29kZSA9IHRvQWxpZ25tZW50KGFsaWduKVxuXG4gICAgd2hpbGUgKCsrY29sdW1uSW5kZXggPCBtb3N0Q2VsbHNQZXJSb3cpIHtcbiAgICAgIGFsaWdubWVudHNbY29sdW1uSW5kZXhdID0gY29kZVxuICAgIH1cbiAgfVxuXG4gIC8vIEluamVjdCB0aGUgYWxpZ25tZW50IHJvdy5cbiAgY29sdW1uSW5kZXggPSAtMVxuICAvKiogQHR5cGUge0FycmF5PHN0cmluZz59ICovXG4gIGNvbnN0IHJvdyA9IFtdXG4gIC8qKiBAdHlwZSB7QXJyYXk8bnVtYmVyPn0gKi9cbiAgY29uc3Qgc2l6ZXMgPSBbXVxuXG4gIHdoaWxlICgrK2NvbHVtbkluZGV4IDwgbW9zdENlbGxzUGVyUm93KSB7XG4gICAgY29uc3QgY29kZSA9IGFsaWdubWVudHNbY29sdW1uSW5kZXhdXG4gICAgbGV0IGJlZm9yZSA9ICcnXG4gICAgbGV0IGFmdGVyID0gJydcblxuICAgIGlmIChjb2RlID09PSA5OSAvKiBgY2AgKi8pIHtcbiAgICAgIGJlZm9yZSA9ICc6J1xuICAgICAgYWZ0ZXIgPSAnOidcbiAgICB9IGVsc2UgaWYgKGNvZGUgPT09IDEwOCAvKiBgbGAgKi8pIHtcbiAgICAgIGJlZm9yZSA9ICc6J1xuICAgIH0gZWxzZSBpZiAoY29kZSA9PT0gMTE0IC8qIGByYCAqLykge1xuICAgICAgYWZ0ZXIgPSAnOidcbiAgICB9XG5cbiAgICAvLyBUaGVyZSAqbXVzdCogYmUgYXQgbGVhc3Qgb25lIGh5cGhlbi1taW51cyBpbiBlYWNoIGFsaWdubWVudCBjZWxsLlxuICAgIGxldCBzaXplID1cbiAgICAgIHNldHRpbmdzLmFsaWduRGVsaW1pdGVycyA9PT0gZmFsc2VcbiAgICAgICAgPyAxXG4gICAgICAgIDogTWF0aC5tYXgoXG4gICAgICAgICAgICAxLFxuICAgICAgICAgICAgbG9uZ2VzdENlbGxCeUNvbHVtbltjb2x1bW5JbmRleF0gLSBiZWZvcmUubGVuZ3RoIC0gYWZ0ZXIubGVuZ3RoXG4gICAgICAgICAgKVxuXG4gICAgY29uc3QgY2VsbCA9IGJlZm9yZSArICctJy5yZXBlYXQoc2l6ZSkgKyBhZnRlclxuXG4gICAgaWYgKHNldHRpbmdzLmFsaWduRGVsaW1pdGVycyAhPT0gZmFsc2UpIHtcbiAgICAgIHNpemUgPSBiZWZvcmUubGVuZ3RoICsgc2l6ZSArIGFmdGVyLmxlbmd0aFxuXG4gICAgICBpZiAoc2l6ZSA+IGxvbmdlc3RDZWxsQnlDb2x1bW5bY29sdW1uSW5kZXhdKSB7XG4gICAgICAgIGxvbmdlc3RDZWxsQnlDb2x1bW5bY29sdW1uSW5kZXhdID0gc2l6ZVxuICAgICAgfVxuXG4gICAgICBzaXplc1tjb2x1bW5JbmRleF0gPSBzaXplXG4gICAgfVxuXG4gICAgcm93W2NvbHVtbkluZGV4XSA9IGNlbGxcbiAgfVxuXG4gIC8vIEluamVjdCB0aGUgYWxpZ25tZW50IHJvdy5cbiAgY2VsbE1hdHJpeC5zcGxpY2UoMSwgMCwgcm93KVxuICBzaXplTWF0cml4LnNwbGljZSgxLCAwLCBzaXplcylcblxuICByb3dJbmRleCA9IC0xXG4gIC8qKiBAdHlwZSB7QXJyYXk8c3RyaW5nPn0gKi9cbiAgY29uc3QgbGluZXMgPSBbXVxuXG4gIHdoaWxlICgrK3Jvd0luZGV4IDwgY2VsbE1hdHJpeC5sZW5ndGgpIHtcbiAgICBjb25zdCByb3cgPSBjZWxsTWF0cml4W3Jvd0luZGV4XVxuICAgIGNvbnN0IHNpemVzID0gc2l6ZU1hdHJpeFtyb3dJbmRleF1cbiAgICBjb2x1bW5JbmRleCA9IC0xXG4gICAgLyoqIEB0eXBlIHtBcnJheTxzdHJpbmc+fSAqL1xuICAgIGNvbnN0IGxpbmUgPSBbXVxuXG4gICAgd2hpbGUgKCsrY29sdW1uSW5kZXggPCBtb3N0Q2VsbHNQZXJSb3cpIHtcbiAgICAgIGNvbnN0IGNlbGwgPSByb3dbY29sdW1uSW5kZXhdIHx8ICcnXG4gICAgICBsZXQgYmVmb3JlID0gJydcbiAgICAgIGxldCBhZnRlciA9ICcnXG5cbiAgICAgIGlmIChzZXR0aW5ncy5hbGlnbkRlbGltaXRlcnMgIT09IGZhbHNlKSB7XG4gICAgICAgIGNvbnN0IHNpemUgPVxuICAgICAgICAgIGxvbmdlc3RDZWxsQnlDb2x1bW5bY29sdW1uSW5kZXhdIC0gKHNpemVzW2NvbHVtbkluZGV4XSB8fCAwKVxuICAgICAgICBjb25zdCBjb2RlID0gYWxpZ25tZW50c1tjb2x1bW5JbmRleF1cblxuICAgICAgICBpZiAoY29kZSA9PT0gMTE0IC8qIGByYCAqLykge1xuICAgICAgICAgIGJlZm9yZSA9ICcgJy5yZXBlYXQoc2l6ZSlcbiAgICAgICAgfSBlbHNlIGlmIChjb2RlID09PSA5OSAvKiBgY2AgKi8pIHtcbiAgICAgICAgICBpZiAoc2l6ZSAlIDIpIHtcbiAgICAgICAgICAgIGJlZm9yZSA9ICcgJy5yZXBlYXQoc2l6ZSAvIDIgKyAwLjUpXG4gICAgICAgICAgICBhZnRlciA9ICcgJy5yZXBlYXQoc2l6ZSAvIDIgLSAwLjUpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJlZm9yZSA9ICcgJy5yZXBlYXQoc2l6ZSAvIDIpXG4gICAgICAgICAgICBhZnRlciA9IGJlZm9yZVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhZnRlciA9ICcgJy5yZXBlYXQoc2l6ZSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoc2V0dGluZ3MuZGVsaW1pdGVyU3RhcnQgIT09IGZhbHNlICYmICFjb2x1bW5JbmRleCkge1xuICAgICAgICBsaW5lLnB1c2goJ3wnKVxuICAgICAgfVxuXG4gICAgICBpZiAoXG4gICAgICAgIHNldHRpbmdzLnBhZGRpbmcgIT09IGZhbHNlICYmXG4gICAgICAgIC8vIERvbuKAmXQgYWRkIHRoZSBvcGVuaW5nIHNwYWNlIGlmIHdl4oCZcmUgbm90IGFsaWduaW5nIGFuZCB0aGUgY2VsbCBpc1xuICAgICAgICAvLyBlbXB0eTogdGhlcmUgd2lsbCBiZSBhIGNsb3Npbmcgc3BhY2UuXG4gICAgICAgICEoc2V0dGluZ3MuYWxpZ25EZWxpbWl0ZXJzID09PSBmYWxzZSAmJiBjZWxsID09PSAnJykgJiZcbiAgICAgICAgKHNldHRpbmdzLmRlbGltaXRlclN0YXJ0ICE9PSBmYWxzZSB8fCBjb2x1bW5JbmRleClcbiAgICAgICkge1xuICAgICAgICBsaW5lLnB1c2goJyAnKVxuICAgICAgfVxuXG4gICAgICBpZiAoc2V0dGluZ3MuYWxpZ25EZWxpbWl0ZXJzICE9PSBmYWxzZSkge1xuICAgICAgICBsaW5lLnB1c2goYmVmb3JlKVxuICAgICAgfVxuXG4gICAgICBsaW5lLnB1c2goY2VsbClcblxuICAgICAgaWYgKHNldHRpbmdzLmFsaWduRGVsaW1pdGVycyAhPT0gZmFsc2UpIHtcbiAgICAgICAgbGluZS5wdXNoKGFmdGVyKVxuICAgICAgfVxuXG4gICAgICBpZiAoc2V0dGluZ3MucGFkZGluZyAhPT0gZmFsc2UpIHtcbiAgICAgICAgbGluZS5wdXNoKCcgJylcbiAgICAgIH1cblxuICAgICAgaWYgKFxuICAgICAgICBzZXR0aW5ncy5kZWxpbWl0ZXJFbmQgIT09IGZhbHNlIHx8XG4gICAgICAgIGNvbHVtbkluZGV4ICE9PSBtb3N0Q2VsbHNQZXJSb3cgLSAxXG4gICAgICApIHtcbiAgICAgICAgbGluZS5wdXNoKCd8JylcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsaW5lcy5wdXNoKFxuICAgICAgc2V0dGluZ3MuZGVsaW1pdGVyRW5kID09PSBmYWxzZVxuICAgICAgICA/IGxpbmUuam9pbignJykucmVwbGFjZSgvICskLywgJycpXG4gICAgICAgIDogbGluZS5qb2luKCcnKVxuICAgIClcbiAgfVxuXG4gIHJldHVybiBsaW5lcy5qb2luKCdcXG4nKVxufVxuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZH0gW3ZhbHVlXVxuICogICBWYWx1ZSB0byBzZXJpYWxpemUuXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICogICBSZXN1bHQuXG4gKi9cbmZ1bmN0aW9uIHNlcmlhbGl6ZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogU3RyaW5nKHZhbHVlKVxufVxuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZH0gdmFsdWVcbiAqICAgVmFsdWUuXG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICogICBBbGlnbm1lbnQuXG4gKi9cbmZ1bmN0aW9uIHRvQWxpZ25tZW50KHZhbHVlKSB7XG4gIGNvbnN0IGNvZGUgPSB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnID8gdmFsdWUuY29kZVBvaW50QXQoMCkgOiAwXG5cbiAgcmV0dXJuIGNvZGUgPT09IDY3IC8qIGBDYCAqLyB8fCBjb2RlID09PSA5OSAvKiBgY2AgKi9cbiAgICA/IDk5IC8qIGBjYCAqL1xuICAgIDogY29kZSA9PT0gNzYgLyogYExgICovIHx8IGNvZGUgPT09IDEwOCAvKiBgbGAgKi9cbiAgICAgID8gMTA4IC8qIGBsYCAqL1xuICAgICAgOiBjb2RlID09PSA4MiAvKiBgUmAgKi8gfHwgY29kZSA9PT0gMTE0IC8qIGByYCAqL1xuICAgICAgICA/IDExNCAvKiBgcmAgKi9cbiAgICAgICAgOiAwXG59XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/markdown-table/index.js\n");

/***/ })

};
;