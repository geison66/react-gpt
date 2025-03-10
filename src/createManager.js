import EventEmitter from "eventemitter3";
import {debounce, throttle} from "throttle-debounce";
import {canUseDOM} from "exenv";
import {Events, isInViewport} from "./oneFile";

// based on https://developers.google.com/doubleclick-gpt/reference?hl=en
export const pubadsAPI = [
    "enableAsyncRendering",
    "enableSingleRequest",
    "enableSyncRendering",
    "disableInitialLoad",
    "collapseEmptyDivs",
    "enableVideoAds",
    "set",
    "get",
    "getAttributeKeys",
    "setTargeting",
    "clearTargeting",
    "setCategoryExclusion",
    "clearCategoryExclusions",
    "setCentering",
    "setCookieOptions",
    "setLocation",
    "setPublisherProvidedId",
    "setTagForChildDirectedTreatment",
    "clearTagForChildDirectedTreatment",
    "setVideoContent",
    "setForceSafeFrame",
    "enableLazyLoad"
];

export const APIToCallBeforeServiceEnabled = [
    "enableAsyncRendering",
    "enableSingleRequest",
    "enableSyncRendering",
    "disableInitialLoad",
    "collapseEmptyDivs",
    "setCentering",
    "enableLazyLoad"
];

export class AdManager extends EventEmitter {
    constructor(config = {}) {
        super(config);
    }

    _config = {
        /**
         * An optional function to replace the pubads().refresh call. Useful for header bidding.
         */
        refresh: undefined
    };

    _adCnt = 0;

    _initialRender = true;

    _syncCorrelator = false;

    get googletag() {
        return this._googletag;
    }

    get isLoaded() {
        return !!this._isLoaded;
    }

    get isReady() {
        return !!this._isReady;
    }

    get apiReady() {
        return this.googletag && this.googletag.apiReady;
    }

    get pubadsReady() {
        return this.googletag && this.googletag.pubadsReady;
    }

    _processPubadsQueue() {
        if (this._pubadsProxyQueue) {
            Object.keys(this._pubadsProxyQueue).forEach(method => {
                if (
                    (this.googletag &&
                        !this.googletag.pubadsReady &&
                        APIToCallBeforeServiceEnabled.indexOf(method) > -1) ||
                    this.pubadsReady
                ) {
                    this._pubadsProxyQueue[method].forEach(params =>
                        this.pubadsProxy(params)
                    );
                    delete this._pubadsProxyQueue[method];
                }
            });
            if (!Object.keys(this._pubadsProxyQueue).length) {
                this._pubadsProxyQueue = null;
            }
        }
    }

    _callPubads({method, args, resolve, reject}) {
        if (typeof this.googletag.pubads()[method] !== "function") {
            reject(
                new Error(
                    `googletag.pubads does not support ${method}, please update pubadsAPI`
                )
            );
        } else {
            try {
                const result = this.googletag.pubads()[method](...args);
                resolve(result);
            } catch (err) {
                reject(err);
            }
        }
    }

    _toggleListener(add) {
        ["scroll", "resize"].forEach(eventName => {
            window[add ? "addEventListener" : "removeEventListener"](
                eventName,
                this._foldCheck
            );
        });
    }

    _foldCheck = throttle(20, event => {
        const instances = this.getMountedInstances();
        instances.forEach(instance => {
            if (instance.getRenderWhenViewable()) {
                instance.foldCheck(event);
            }
        });
    });

    _getTimer() {
        return Date.now();
    }

    _handleMediaQueryChange = event => {
        if (this._syncCorrelator) {
            this.refresh();
            return;
        }
        // IE returns `event.media` value differently, need to use regex to evaluate.
        // eslint-disable-next-line wrap-regex
        const res = /min-width:\s?(\d+)px/.exec(event.media);
        const viewportWidth = res && res[1];

        if (viewportWidth && this._mqls[viewportWidth]) {
            this._mqls[viewportWidth].listeners.forEach(instance => {
                instance.onMediaQueryChange(event);
            });
        }
    };

    _listen() {
        if (!this._listening) {
            [
                Events.SLOT_RENDER_ENDED,
                Events.IMPRESSION_VIEWABLE,
                Events.SLOT_VISIBILITY_CHANGED,
                Events.SLOT_LOADED
            ].forEach(eventType => {
                ["pubads", "companionAds"].forEach(service => {
                    // there is no API to remove listeners.
                    this.googletag[service]().addEventListener(
                        eventType,
                        this._onEvent.bind(this, eventType)
                    );
                });
            });
            this._listening = true;
        }
    }

    _onEvent(eventType, event) {
        // fire to the global listeners
        if (this.listeners(eventType, true)) {
            this.emit(eventType, event);
        }
        // call event handler props
        const instances = this.getMountedInstances();
        const {slot} = event;
        const funcName = `on${eventType
            .charAt(0)
            .toUpperCase()}${eventType.substr(1)}`;
        const instance = instances.filter(inst => slot === inst.adSlot)[0];
        if (instance && instance.props[funcName]) {
            instance.props[funcName](event);
        }
    }

    syncCorrelator(value = true) {
        this._syncCorrelator = value;
    }

    generateDivId() {
        return `bling-${++this._adCnt}`;
    }

    getMountedInstances() {
        if (!this.mountedInstances) {
            this.mountedInstances = [];
        }
        return this.mountedInstances;
    }

    addInstance(instance) {
        const instances = this.getMountedInstances();
        const index = instances.indexOf(instance);
        if (index === -1) {
            // The first instance starts listening for the event.
            if (instances.length === 0) {
                this._toggleListener(true);
            }
            this.addMQListener(instance, instance.props);
            instances.push(instance);
        }
    }

    removeInstance(instance) {
        const instances = this.getMountedInstances();
        const index = instances.indexOf(instance);
        if (index >= 0) {
            instances.splice(index, 1);
            // The last instance removes listening for the event.
            if (instances.length === 0) {
                this._toggleListener(false);
            }
            this.removeMQListener(instance, instance.props);
        }
    }

    addMQListener(instance, {sizeMapping}) {
        if (!sizeMapping || !Array.isArray(sizeMapping)) {
            return;
        }

        sizeMapping.forEach(size => {
            const viewportWidth = size.viewport && size.viewport[0];
            if (viewportWidth !== undefined) {
                if (!this._mqls) {
                    this._mqls = {};
                }
                if (!this._mqls[viewportWidth]) {
                    const mql = window.matchMedia(
                        `(min-width: ${viewportWidth}px)`
                    );
                    mql.addListener(this._handleMediaQueryChange);
                    this._mqls[viewportWidth] = {
                        mql,
                        listeners: []
                    };
                }
                if (
                    this._mqls[viewportWidth].listeners.indexOf(instance) === -1
                ) {
                    this._mqls[viewportWidth].listeners.push(instance);
                }
            }
        });
    }

    removeMQListener(instance) {
        if (!this._mqls) {
            return;
        }

        Object.keys(this._mqls).forEach(key => {
            const index = this._mqls[key].listeners.indexOf(instance);
            if (index > -1) {
                this._mqls[key].listeners.splice(index, 1);
            }
            if (this._mqls[key].listeners.length === 0) {
                this._mqls[key].mql.removeListener(
                    this._handleMediaQueryChange
                );
                delete this._mqls[key];
            }
        });
    }

    isInViewport(...args) {
        return isInViewport(...args);
    }

    /**
     * Refreshes all the ads in the page with a new correlator value.
     *
     * @param {Array} slots An array of ad slots.
     * @param {Object} options You can pass `changeCorrelator` flag.
     * @static
     */
    refresh(slots, options) {
        if (!this.pubadsReady) {
            return false;
        }
        if (this._config.refresh) {
            // Call custom refresh method and bind `googletag`
            this._config.refresh.call(this.googletag, slots, options);
        } else {
            // GPT already debounces refresh
            this.googletag.pubads().refresh(slots, options);
        }

        return true;
    }

    clear(slots) {
        if (!this.pubadsReady) {
            return false;
        }

        this.googletag.pubads().clear(slots);

        return true;
    }

    render = debounce(4, () => {
        if (!this._initialRender) {
            return;
        }

        const instances = this.getMountedInstances();
        let hasPubAdsService = false;
        let dummyAdSlot;

        // Define all the slots
        instances.forEach(instance => {
            if (!instance.notInViewport()) {
                instance.defineSlot();
                const adSlot = instance.adSlot;

                if (
                    adSlot &&
                    adSlot.getServices &&
                    typeof adSlot.getServices === "function"
                ) {
                    const services = adSlot.getServices();
                    if (!hasPubAdsService) {
                        hasPubAdsService =
                            services.filter(
                                service => !!service.enableAsyncRendering
                            ).length > 0;
                    }
                }
            }
        });
        // if none of the ad slots uses pubads service, create dummy slot to use pubads service.
        if (!hasPubAdsService) {
            dummyAdSlot = this.googletag.defineSlot("/", []);
            dummyAdSlot.addService(this.googletag.pubads());
        }

        // Call pubads API which needs to be called before service is enabled.
        this._processPubadsQueue();

        // Enable service
        this.googletag.enableServices();

        // Queue commands that should run once the service is ready
        this.googletag.cmd.push(() => {
            // destroy dummy ad slot if exists.
            if (dummyAdSlot) {
                this.googletag.destroySlots([dummyAdSlot]);
            }
            // Call the rest of the pubads API that's in the queue.
            this._processPubadsQueue();
            // listen for GPT events
            this._listen();
            // client should be able to set any page-level setting within the event handler.
            this._isReady = true;
            this.emit(Events.READY, this.googletag);

            // Call display
            instances.forEach(instance => {
                if (!instance.notInViewport()) {
                    instance.display();
                }
            });

            this.emit(Events.RENDER, this.googletag);

            this._initialRender = false;
        });
    });

    /**
     * Re-render(not refresh) all the ads in the page and the first ad will update the correlator value.
     * Updating correlator value ensures competitive exclusion.
     *
     * @method renderAll
     * @static
     */
    renderAll = debounce(4, () => {
        if (!this.apiReady) {
            return false;
        }

        // first instance updates correlator value and re-render each ad
        const instances = this.getMountedInstances();
        instances.forEach((instance, i) => {
            if (i === 0) {
                this.googletag.destroySlots();
            }
            instance.forceUpdate();
        });

        return true;
    });

    getGPTVersion() {
        if (!this.apiReady) {
            return false;
        }
        return this.googletag.getVersion();
    }

    getPubadsVersion() {
        if (!this.pubadsReady) {
            return false;
        }
        return this.googletag.pubads().getVersion();
    }

    updateCorrelator() {
        if (!this.pubadsReady) {
            return false;
        }
        // Note, `updateCorrelator` has been deprecated. This is a short-term patch
        // to ensure the method will not be called when it is removed from GPT.
        // A better fix to come...

        // Deprecated
        // if ("updateCorrelator" in this.googletag.pubads()) {
        //    this.googletag.pubads().updateCorrelator();
        // }
        return true;
    }

    /**
     * Merge and set configuration values
     *
     * @method configure
     * @param {object} config
     */
    configure(config = {}) {
        this._config = {
            ...this._config,
            ...config
        };
    }

    load(url) {
        return (
            this._loadPromise ||
            (this._loadPromise = new Promise((resolve, reject) => {
                if (!canUseDOM) {
                    reject(new Error("DOM not available"));
                    return;
                }
                if (!url) {
                    reject(new Error("url is missing"));
                    return;
                }
                const onLoad = () => {
                    if (window.googletag) {
                        this._googletag = window.googletag;
                        // make sure API is ready for use.
                        this.googletag.cmd.push(() => {
                            this._isLoaded = true;
                            resolve(this.googletag);
                        });
                    } else {
                        reject(new Error("window.googletag is not available"));
                    }
                };
                if (window.googletag && window.googletag.apiReady) {
                    onLoad();
                } else {
                    const script = document.createElement("script");
                    script.async = true;
                    script.onload = onLoad;
                    script.onerror = () => {
                        reject(new Error("failed to load script"));
                    };
                    script.src = url;
                    document.head.appendChild(script);
                }
            }))
        );
    }

    pubadsProxy({method, args = [], resolve, reject}) {
        if (!resolve) {
            // there are couple pubads API which doesn't provide getter methods for later use,
            // so remember them here.
            if (APIToCallBeforeServiceEnabled.indexOf(method) > -1) {
                this[`_${method}`] = (args && args.length && args[0]) || true;
            }
            return new Promise((resolve2, reject2) => {
                const params = {
                    method,
                    args,
                    resolve: resolve2,
                    reject: reject2
                };
                if (!this.pubadsReady) {
                    if (!this._pubadsProxyQueue) {
                        this._pubadsProxyQueue = {};
                    }
                    if (!this._pubadsProxyQueue[method]) {
                        this._pubadsProxyQueue[method] = [];
                    }
                    this._pubadsProxyQueue[method].push(params);
                } else {
                    this._callPubads(params);
                }
            });
        }

        this._callPubads({method, args, resolve, reject});

        return Promise.resolve();
    }
}

export function createManager(config) {
    return new AdManager(config);
}
