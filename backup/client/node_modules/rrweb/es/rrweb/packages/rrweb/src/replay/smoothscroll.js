function polyfill(w = window, d = document) {
    if ('scrollBehavior' in d.documentElement.style &&
        w.__forceSmoothScrollPolyfill__ !== true) {
        return;
    }
    const Element = w.HTMLElement || w.Element;
    const SCROLL_TIME = 468;
    const original = {
        scroll: w.scroll || w.scrollTo,
        scrollBy: w.scrollBy,
        elementScroll: Element.prototype.scroll || scrollElement,
        scrollIntoView: Element.prototype.scrollIntoView,
    };
    const now = w.performance && w.performance.now
        ? w.performance.now.bind(w.performance)
        : Date.now;
    function isMicrosoftBrowser(userAgent) {
        const userAgentPatterns = ['MSIE ', 'Trident/', 'Edge/'];
        return new RegExp(userAgentPatterns.join('|')).test(userAgent);
    }
    const ROUNDING_TOLERANCE = isMicrosoftBrowser(w.navigator.userAgent) ? 1 : 0;
    function scrollElement(x, y) {
        this.scrollLeft = x;
        this.scrollTop = y;
    }
    function ease(k) {
        return 0.5 * (1 - Math.cos(Math.PI * k));
    }
    function shouldBailOut(firstArg) {
        if (firstArg === null ||
            typeof firstArg !== 'object' ||
            firstArg.behavior === undefined ||
            firstArg.behavior === 'auto' ||
            firstArg.behavior === 'instant') {
            return true;
        }
        if (typeof firstArg === 'object' && firstArg.behavior === 'smooth') {
            return false;
        }
        throw new TypeError('behavior member of ScrollOptions ' +
            firstArg.behavior +
            ' is not a valid value for enumeration ScrollBehavior.');
    }
    function hasScrollableSpace(el, axis) {
        if (axis === 'Y') {
            return el.clientHeight + ROUNDING_TOLERANCE < el.scrollHeight;
        }
        if (axis === 'X') {
            return el.clientWidth + ROUNDING_TOLERANCE < el.scrollWidth;
        }
    }
    function canOverflow(el, axis) {
        const overflowValue = w.getComputedStyle(el, null)['overflow' + axis];
        return overflowValue === 'auto' || overflowValue === 'scroll';
    }
    function isScrollable(el) {
        const isScrollableY = hasScrollableSpace(el, 'Y') && canOverflow(el, 'Y');
        const isScrollableX = hasScrollableSpace(el, 'X') && canOverflow(el, 'X');
        return isScrollableY || isScrollableX;
    }
    function findScrollableParent(el) {
        while (el !== d.body && isScrollable(el) === false) {
            el = el.parentNode || el.host;
        }
        return el;
    }
    function step(context) {
        const time = now();
        let value;
        let currentX;
        let currentY;
        let elapsed = (time - context.startTime) / SCROLL_TIME;
        elapsed = elapsed > 1 ? 1 : elapsed;
        value = ease(elapsed);
        currentX = context.startX + (context.x - context.startX) * value;
        currentY = context.startY + (context.y - context.startY) * value;
        context.method.call(context.scrollable, currentX, currentY);
        if (currentX !== context.x || currentY !== context.y) {
            w.requestAnimationFrame(step.bind(w, context));
        }
    }
    function smoothScroll(el, x, y) {
        let scrollable;
        let startX;
        let startY;
        let method;
        const startTime = now();
        if (el === d.body) {
            scrollable = w;
            startX = w.scrollX || w.pageXOffset;
            startY = w.scrollY || w.pageYOffset;
            method = original.scroll;
        }
        else {
            scrollable = el;
            startX = el.scrollLeft;
            startY = el.scrollTop;
            method = scrollElement;
        }
        step({
            scrollable: scrollable,
            method: method,
            startTime: startTime,
            startX: startX,
            startY: startY,
            x: x,
            y: y,
        });
    }
    w.scroll = w.scrollTo = function () {
        if (arguments[0] === undefined) {
            return;
        }
        if (shouldBailOut(arguments[0]) === true) {
            original.scroll.call(w, arguments[0].left !== undefined
                ? arguments[0].left
                : typeof arguments[0] !== 'object'
                    ? arguments[0]
                    : w.scrollX || w.pageXOffset, arguments[0].top !== undefined
                ? arguments[0].top
                : arguments[1] !== undefined
                    ? arguments[1]
                    : w.scrollY || w.pageYOffset);
            return;
        }
        smoothScroll.call(w, d.body, arguments[0].left !== undefined
            ? ~~arguments[0].left
            : w.scrollX || w.pageXOffset, arguments[0].top !== undefined
            ? ~~arguments[0].top
            : w.scrollY || w.pageYOffset);
    };
    w.scrollBy = function () {
        if (arguments[0] === undefined) {
            return;
        }
        if (shouldBailOut(arguments[0])) {
            original.scrollBy.call(w, arguments[0].left !== undefined
                ? arguments[0].left
                : typeof arguments[0] !== 'object'
                    ? arguments[0]
                    : 0, arguments[0].top !== undefined
                ? arguments[0].top
                : arguments[1] !== undefined
                    ? arguments[1]
                    : 0);
            return;
        }
        smoothScroll.call(w, d.body, ~~arguments[0].left + (w.scrollX || w.pageXOffset), ~~arguments[0].top + (w.scrollY || w.pageYOffset));
    };
    Element.prototype.scroll = Element.prototype.scrollTo = function () {
        if (arguments[0] === undefined) {
            return;
        }
        if (shouldBailOut(arguments[0]) === true) {
            if (typeof arguments[0] === 'number' && arguments[1] === undefined) {
                throw new SyntaxError('Value could not be converted');
            }
            original.elementScroll.call(this, arguments[0].left !== undefined
                ? ~~arguments[0].left
                : typeof arguments[0] !== 'object'
                    ? ~~arguments[0]
                    : this.scrollLeft, arguments[0].top !== undefined
                ? ~~arguments[0].top
                : arguments[1] !== undefined
                    ? ~~arguments[1]
                    : this.scrollTop);
            return;
        }
        const left = arguments[0].left;
        const top = arguments[0].top;
        smoothScroll.call(this, this, typeof left === 'undefined' ? this.scrollLeft : ~~left, typeof top === 'undefined' ? this.scrollTop : ~~top);
    };
    Element.prototype.scrollBy = function () {
        if (arguments[0] === undefined) {
            return;
        }
        if (shouldBailOut(arguments[0]) === true) {
            original.elementScroll.call(this, arguments[0].left !== undefined
                ? ~~arguments[0].left + this.scrollLeft
                : ~~arguments[0] + this.scrollLeft, arguments[0].top !== undefined
                ? ~~arguments[0].top + this.scrollTop
                : ~~arguments[1] + this.scrollTop);
            return;
        }
        this.scroll({
            left: ~~arguments[0].left + this.scrollLeft,
            top: ~~arguments[0].top + this.scrollTop,
            behavior: arguments[0].behavior,
        });
    };
    Element.prototype.scrollIntoView = function () {
        if (shouldBailOut(arguments[0]) === true) {
            original.scrollIntoView.call(this, arguments[0] === undefined ? true : arguments[0]);
            return;
        }
        const scrollableParent = findScrollableParent(this);
        const parentRects = scrollableParent.getBoundingClientRect();
        const clientRects = this.getBoundingClientRect();
        if (scrollableParent !== d.body) {
            smoothScroll.call(this, scrollableParent, scrollableParent.scrollLeft + clientRects.left - parentRects.left, scrollableParent.scrollTop + clientRects.top - parentRects.top);
            if (w.getComputedStyle(scrollableParent).position !== 'fixed') {
                w.scrollBy({
                    left: parentRects.left,
                    top: parentRects.top,
                    behavior: 'smooth',
                });
            }
        }
        else {
            w.scrollBy({
                left: clientRects.left,
                top: clientRects.top,
                behavior: 'smooth',
            });
        }
    };
}

export { polyfill };
