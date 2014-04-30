(function (undefined) {
    "use strict";

    var ctrl,
        _initialise,
        _classes;


    /********************* Private Variables ***********************/


    /**
     * List of classes.
     *
     * @typedef {object} Classes
     * @type {{ ACTIVE: string }}
     * @private
     */

    _classes = {
        ACTIVE: "button--active"
    };


    /**
     * Adds some extra functionality for the buttons.
     *
     * @constructor
     * @param {HTMLElement} element - Target element.
     * @param {object=} options - Overrides for default options.
     * @param {{ text: string, cssClass: string }} options.normal - Options for default mode.
     * @param {{ text: string, cssClass: string }} options.busy - Options for `busy` mode.
     */

    ctrl = window.Button = function (element, options) {
        this.config = {
            element: element,
            options: {

                // `normal` (default) mode.
                normal: {
                    text: options && options.normal && options.normal.text || element.innerText,
                    cssClass: options && options.normal && options.normal.cssClass ||null
                },

                // `busy` mode options.
                busy: {
                    text: options && options.busy && options.busy.text || "Waiting...",
                    cssClass: options && options.busy && options.busy.cssClass || _classes.ACTIVE
                }
            }
        };

        _initialise.call(this, options);
    };


    /**
     * Set `busy` mode on the button.
     *
     * @param {boolean} set - Indicate whether to set the busy mode or not.
     */

    ctrl.prototype.setBusy = function (set) {
        var element,
            options;

        // Ensure set is always a boolean.
        set = !!set;

        options = this.config.options;

        element = this.config.element;


        this.isBusy = set;

        // Check if `busy` mode css class exists.
        if (options.busy.cssClass) {
            if (set) {
                element.classList.add(options.busy.cssClass);
            }
            else {
                element.classList.remove(options.busy.cssClass);
            }
        }

        // Check if default css class exists.
        if (options.normal.cssClass) {
            if (set) {
                element.classList.remove(options.normal.cssClass);
            }
            else {
                element.classList.add(options.normal.cssClass);
            }
        }

        element.innerText = set ? options.busy.text : options.normal.text;
    };


    /********************* Private Methods ***********************/


    /**
     * Initialise the control.
     *
     * @param {object} options - Custom options.
     * @private
     */

    _initialise = function (options) {
        this.config.element.Button = this;
    };

})();