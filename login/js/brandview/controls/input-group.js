(function(window) {
    "use strict";

    var ctrl,
        _applyValidationSettings,
        _classes,
        _clearValidationClasses,
        _initialise,
        _initialiseEvents,
        _onValidation,
        _validate,
        _validType;


    /**
     * Manages input groups.
     *
     * @constructor
     * @param {HTMLElement} element - HTML element on which the controller will be initialised.
     * @param {object=} options - Custom options for the controller.
     * @param {boolean=} preventAutoValidation - Decide whether you want auto validation or not (can be changed later).
     * @param {function=} options.validationMethod - Function used to validate an input.
     * @param {object=} options.messages - List of validation messages.
     * @param {string=} options.messages.empty - Empty input warning message.
     * @param {string=} options.messages.invalid - Invalid input message.
     * @param {string=} options.messages.valid - Valid input message.
     */

    ctrl = window.InputGroup = function(element, options) {
        this.config = {
            container: element,
            element: element.getElementsByTagName("input")[0],
            message: element.getElementsByClassName("input-group__message")[0],
            options: options
        };

        _initialise.call(this);
    };


    /********************* Private Variables ***********************/


    /**
     * List of classes.
     *
     * @typedef {object} Classes
     * @type {{container: {VALID: string, EMPTY: string, INVALID: string}, element: {VALID: string, EMPTY: string, INVALID: string}}}
     * @private
     */

    _classes = {
        container: {
            NO_MESSAGE: "input-group--validation-off",
            SUCCESS: "input-group--success",
            WARNING: "input-group--warning",
            ERROR: "input-group--error"
        },
        element: {
            SUCCESS: "input-group__input--valid",
            EMPTY: "input-group__input--empty",
            ERROR: "input-group__input--invalid"
        }
    };


    /**
     * Types of validation.
     *
     * @typedef {object} ValidationType
     * @type {{VALID: number, INVALID: number, EMPTY: number}}
     * @private
     */

    _validType = {
        VALID: 1,
        INVALID: 2,
        EMPTY: 3
    };


    /********************* Private Methods ***********************/


    /**
     * Apply new validation classes and change message text.
     *
     * @param {string} containerClass
     * @param {string} elementClass
     * @param {string} messageText
     * @private
     */

    _applyValidationSettings = function (containerClass, elementClass, messageText) {

        // Add new validation classes.
        if (containerClass) {
            this.config.container.classList.add(containerClass);
        }

        if (elementClass) {
            this.config.element.classList.add(elementClass);
        }

        if (messageText) {

            // Insert new message text.
            this.config.message.innerText = messageText;
        }

        // Add class to the container to indicate whether to show validation message or not.
        this.config.container.classList.toggle(_classes.container.NO_MESSAGE, !messageText);
    };

    /**
     * Clearing validation classes.
     *
     * @private
     */

    _clearValidationClasses = function () {
        var containerClasses, elementClasses;

        // Clean container.
        containerClasses = this.config.container.classList;

        containerClasses.remove(_classes.container.SUCCESS);

        containerClasses.remove(_classes.container.ERROR);

        containerClasses.remove(_classes.container.WARNING);

        // Clean element.
        elementClasses = this.config.element.classList;

        elementClasses.remove(_classes.element.EMPTY);

        elementClasses.remove(_classes.element.ERROR);

        elementClasses.remove(_classes.element.SUCCESS);
    };

    /**
     * Initialise the control.
     *
     * @private
     */

    _initialise = function () {

        // Store instance in the HTML elements.
        this.config.container.InputGroup = this;

        this.config.element.InputGroup = this;

        _initialiseEvents.call(this);
    };


    /**
     * Initialise events.
     *
     * @private
     */

    _initialiseEvents = function () {
        var instance = this,
            events;

        events = this.config.options && this.config.options.events;

        if (events) {

            // Initially the events should be separated with commas e.g.:
            // "keyup, change, blur"
            // This line will remove any spaces from the string and split it into an array.
            events = this.config.options.events.replace(/\s/g, "").split(",");

            // Loop through the events and attach validation method to each one of them.
            for (var i = 0, l = events.length; i < l; i++) {

                // Wrapping event into IIFE to avoid any leaks.
                (function(base) {
                    var instance = base;

                    base.config.element.addEventListener(events[i], function () {
                        _onValidation.call(instance);
                    }, false);
                })(this);
            }
        }
    };


    /**
     * Validate input and return relevant validation type.
     *
     * @returns {ValidationType}
     * @private
     */

    _validate = function () {
        if (this.isEmpty()) {
            return _validType.EMPTY;
        }

        if (!this.isValid()) {
            return _validType.INVALID;
        }

        return _validType.VALID;
    };


    /********************* Public Methods ***********************/


    /**
     * Clear validation state.
     *
     * @returns {window.InputGroup}
     */

    ctrl.prototype.clearState = function () {
        _clearValidationClasses.call(this);

        return this;
    };


    /**
     * Check if input element is empty.
     *
     * @returns {boolean}
     */

    ctrl.prototype.isEmpty = function () {
        return !this.config.element.value;
    };


    /**
     * Check if input is valid using method provided in `options.validationMethod`.
     *
     * @returns {boolean}
     */

    ctrl.prototype.isValid = function () {
        var validationMethod = this.config.options.validationMethod;

        if (validationMethod && typeof validationMethod === "function") {

            // Double exclamation mark to ensure this function returns a boolean.
            return !!validationMethod.call(this.config.element);
        }

        // Always return true if validation method has not been provided.
        return true;
    };


    /**
     * Pause/start automatic validation.
     *
     * @param {boolean} pause - Indicate whether to pause or start.
     */

    ctrl.prototype.pauseValidation = function (pause) {
        _clearValidationClasses.call(this);

        this.config.preventAutoValidation = !!pause;
    };

    /**
     * Use this method to set custom error state.
     * 
     * @param {string} messageText - Validation message.
     * @returns {window.InputGroup}
     */
    
    ctrl.prototype.setErrorState = function (messageText) {

        // Clear an existing state.
        _clearValidationClasses.call(this);

        _applyValidationSettings.call(this, _classes.container.ERROR, _classes.element.ERROR, messageText);
        
        return this;
    };


    /**
     * Use this method to set custom success state.
     *
     * @param {string} messageText - Validation message.
     * @returns {window.InputGroup}
     */

    ctrl.prototype.setSuccessState = function (messageText) {

        // Clear an existing state.
        _clearValidationClasses.call(this);

        _applyValidationSettings.call(this, _classes.container.SUCCESS, _classes.element.SUCCESS, messageText);

        return this;
    };


    /**
     * Use this method to set custom warning state.
     *
     * @param {string} messageText - Validation message.
     * @returns {window.InputGroup}
     */

    ctrl.prototype.setWarningState = function (messageText, pause) {
        var elementClass;

        // Clear an existing state.
        _clearValidationClasses.call(this);

        // Check if the input is empty and add relevant class if so.
        elementClass = this.isEmpty() ? _classes.element.EMPTY : null;

        _applyValidationSettings.call(this, _classes.container.WARNING, elementClass, messageText);

        return this;
    };


    /**
     * Validate input and apply new classes.
     *
     * @param {boolean=} preventMessages - Stops control from showing validation messages.
     * @returns {boolean}
     */

    ctrl.prototype.validate = function (preventMessages) {
        var validate = _validate.call(this),
            messages, containerClass, elementClass, messageText;

        // If `preventMessages` is set to `true` then all the logic for displaying messages is ignored.
        if (!preventMessages) {
            messages = this.config.options.messages;

            if (validate === _validType.EMPTY) {
                containerClass = _classes.container.WARNING;

                elementClass = _classes.element.EMPTY;

                messageText = messages.empty;
            }
            else if (validate === _validType.INVALID) {

                containerClass = _classes.container.ERROR;

                elementClass = _classes.element.ERROR;

                messageText = messages.invalid;
            }
            else if (validate === _validType.VALID) {

                containerClass = _classes.container.SUCCESS;

                elementClass = _classes.element.SUCCESS;

                messageText = messages.valid;
            }

            _clearValidationClasses.call(this);

            _applyValidationSettings.call(this, containerClass, elementClass, messageText);
        }

        return validate === _validType.VALID;
    };


    /********************* Events ***********************/

    _onValidation = function () {
        if (!this.config.preventAutoValidation) {
            this.validate();
        }
    }
})(window);