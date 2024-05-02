export const Events = {
    READY: "ready",
    RENDER: "render",
    SLOT_RENDER_ENDED: "slotRenderEnded",
    IMPRESSION_VIEWABLE: "impressionViewable",
    SLOT_VISIBILITY_CHANGED: "slotVisibilityChanged",
    SLOT_LOADED: "slotOnload"
};

export function filterProps(propKeys, props, nextProps) {
    return propKeys.reduce(
        (filtered, key) => {
            filtered.props[key] = props[key];
            filtered.nextProps[key] = nextProps[key];
            return filtered;
        },
        {
            props: {},
            nextProps: {}
        }
    );
}

export function isInViewport(el, [width, height] = [0, 0], offset = 0) {
    if (!el || el.nodeType !== 1) {
        return false;
    }
    const clientRect = el.getBoundingClientRect();
    const rect = {
        top: clientRect.top,
        left: clientRect.left,
        bottom: clientRect.bottom,
        right: clientRect.right
    };
    const viewport = {
        top: 0,
        left: 0,
        bottom: window.innerHeight,
        right: window.innerWidth
    };

    const inViewport =
        rect.bottom >= viewport.top + height * offset &&
        rect.right >= viewport.left + width * offset &&
        rect.top <= viewport.bottom - height * offset &&
        rect.left <= viewport.right - width * offset;

    return inViewport;
}