import { __spreadArray, __read } from '../../ext/tslib/tslib.es6.js';

var StyleRuleType;
(function (StyleRuleType) {
    StyleRuleType[StyleRuleType["Insert"] = 0] = "Insert";
    StyleRuleType[StyleRuleType["Remove"] = 1] = "Remove";
    StyleRuleType[StyleRuleType["Snapshot"] = 2] = "Snapshot";
    StyleRuleType[StyleRuleType["SetProperty"] = 3] = "SetProperty";
    StyleRuleType[StyleRuleType["RemoveProperty"] = 4] = "RemoveProperty";
})(StyleRuleType || (StyleRuleType = {}));
function getNestedRule(rules, position) {
    var rule = rules[position[0]];
    if (position.length === 1) {
        return rule;
    }
    else {
        return getNestedRule(rule.cssRules[position[1]]
            .cssRules, position.slice(2));
    }
}
function getPositionsAndIndex(nestedIndex) {
    var positions = __spreadArray([], __read(nestedIndex), false);
    var index = positions.pop();
    return { positions: positions, index: index };
}
function applyVirtualStyleRulesToNode(storedRules, styleNode) {
    var sheet = styleNode.sheet;
    if (!sheet) {
        return;
    }
    storedRules.forEach(function (rule) {
        if (rule.type === StyleRuleType.Insert) {
            try {
                if (Array.isArray(rule.index)) {
                    var _a = getPositionsAndIndex(rule.index), positions = _a.positions, index = _a.index;
                    var nestedRule = getNestedRule(sheet.cssRules, positions);
                    nestedRule.insertRule(rule.cssText, index);
                }
                else {
                    sheet.insertRule(rule.cssText, rule.index);
                }
            }
            catch (e) {
            }
        }
        else if (rule.type === StyleRuleType.Remove) {
            try {
                if (Array.isArray(rule.index)) {
                    var _b = getPositionsAndIndex(rule.index), positions = _b.positions, index = _b.index;
                    var nestedRule = getNestedRule(sheet.cssRules, positions);
                    nestedRule.deleteRule(index || 0);
                }
                else {
                    sheet.deleteRule(rule.index);
                }
            }
            catch (e) {
            }
        }
        else if (rule.type === StyleRuleType.Snapshot) {
            restoreSnapshotOfStyleRulesToNode(rule.cssTexts, styleNode);
        }
        else if (rule.type === StyleRuleType.SetProperty) {
            var nativeRule = getNestedRule(sheet.cssRules, rule.index);
            nativeRule.style.setProperty(rule.property, rule.value, rule.priority);
        }
        else if (rule.type === StyleRuleType.RemoveProperty) {
            var nativeRule = getNestedRule(sheet.cssRules, rule.index);
            nativeRule.style.removeProperty(rule.property);
        }
    });
}
function restoreSnapshotOfStyleRulesToNode(cssTexts, styleNode) {
    var _a;
    try {
        var existingRules = Array.from(((_a = styleNode.sheet) === null || _a === void 0 ? void 0 : _a.cssRules) || []).map(function (rule) { return rule.cssText; });
        var existingRulesReversed = Object.entries(existingRules).reverse();
        var lastMatch_1 = existingRules.length;
        existingRulesReversed.forEach(function (_a) {
            var _b;
            var _c = __read(_a, 2), index = _c[0], rule = _c[1];
            var indexOf = cssTexts.indexOf(rule);
            if (indexOf === -1 || indexOf > lastMatch_1) {
                try {
                    (_b = styleNode.sheet) === null || _b === void 0 ? void 0 : _b.deleteRule(Number(index));
                }
                catch (e) {
                }
            }
            lastMatch_1 = indexOf;
        });
        cssTexts.forEach(function (cssText, index) {
            var _a, _b, _c;
            try {
                if (((_b = (_a = styleNode.sheet) === null || _a === void 0 ? void 0 : _a.cssRules[index]) === null || _b === void 0 ? void 0 : _b.cssText) !== cssText) {
                    (_c = styleNode.sheet) === null || _c === void 0 ? void 0 : _c.insertRule(cssText, index);
                }
            }
            catch (e) {
            }
        });
    }
    catch (e) {
    }
}
function storeCSSRules(parentElement, virtualStyleRulesMap) {
    var _a;
    try {
        var cssTexts = Array.from(((_a = parentElement.sheet) === null || _a === void 0 ? void 0 : _a.cssRules) || []).map(function (rule) { return rule.cssText; });
        virtualStyleRulesMap.set(parentElement, [
            {
                type: StyleRuleType.Snapshot,
                cssTexts: cssTexts,
            },
        ]);
    }
    catch (e) {
    }
}

export { StyleRuleType, applyVirtualStyleRulesToNode, getNestedRule, getPositionsAndIndex, storeCSSRules };
