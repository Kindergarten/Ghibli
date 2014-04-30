(function(undefined) {
    "use strict";

    var ctrl,
        _applyValidationSettings,
        _classes,
        _clearValidationClasses,
        _findMessage,
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
            element:
                element.getElementsByTagName("input")[0] ||
                element.getElementsByTagName("select")[0] ||
                element.getElementsByTagName("textarea")[0],
            message: _findMessage.call(this, element),
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
            ERROR: "input-group--error",
            MESSAGE: "input-group__message"
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
        if (messageText) {
            this.config.container.classList.remove(_classes.container.NO_MESSAGE);
        }
        else {
            this.config.container.classList.add(_classes.container.NO_MESSAGE);
        }
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


    _findMessage = function (target) {
        var elements,
            element,
            cla;

        if (document.getElementsByClassName) {
            element = target.getElementsByClassName(_classes.container.MESSAGE)[0];
        }
        else {
            elements = target.getElementsByTagName("*");

            for (var i = 0, l = elements.length; i < l; i++) {
                element = elements[i];

                if (element.classList.contains(_classes.container.MESSAGE)) {
                    break;
                }
            }
        }

        return element;
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
            messages, containerClass, elementClass, messageText, valid;

        valid = validate === _validType.VALID;

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

            if (!valid) {
                _applyValidationSettings.call(this, containerClass, elementClass, messageText);
            }
        }

        return valid;
    };


    /********************* Events ***********************/


    _onValidation = function () {
        if (!this.config.preventAutoValidation) {
            this.validate();
        }
    }
})();
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
window.BV = {};

(function(base, WebFont, undefined) {
    "use strict";

    /**
     * Function used to extend namespaces.
     *
     * @param {object} namespace - base namespace object.
     * @param {string} newNamespace - List of namespaces joined with `.`.
     * @returns {object}
     */

    base.extend = function (namespace, newNamespace) {
        var parts = newNamespace.split("."),
            part;

        if (parts[0] === "BV") {
            parts = parts.slice(1);
        }

        for (var i = 0, l = parts.length; i < l; i++) {
            part = namespace[parts[i]];

            if (typeof (part) === "undefined") {
                namespace[parts[i]] = {};
            }

            namespace = namespace[parts[i]];
        }

        return namespace;
    };


    /**
     * List of numbers representing most of the keys on the keyboard.
     *
     * @typedef {number} Keys
     * @type {{ENTER: number}}
     */

    base.Keys = {
        A: 65,
        B: 66,
        C: 67,
        D: 68,
        E: 69,
        F: 70,
        G: 71,
        H: 72,
        I: 73,
        J: 74,
        K: 75,
        L: 76,
        M: 77,
        N: 78,
        O: 79,
        P: 80,
        Q: 81,
        R: 82,
        S: 83,
        T: 84,
        U: 85,
        V: 86,
        W: 87,
        X: 88,
        Y: 89,
        Z: 90,

        BACKSPACE: 8,
        TAB: 9,
        ENTER: 13,
        SHIFT: 16,
        CONTROL: 17,
        CTRL: 17,
        ALT: 18,
        ESC: 27,
        ESCAPE: 27,

        SPACE: 32,
        PAGEUP: 33,
        PAGEDOWN: 34,
        END: 35,
        HOME: 36,

        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,

        DELETE: 46,

        ZERO: 48,
        ONE: 49,
        TWO: 50,
        THREE: 51,
        FOUR: 52,
        FIVE: 53,
        SIX: 54,
        SEVEN: 55,
        EIGHT: 56,
        NINE: 57,
        HASH: 222,

        NUMZERO: 96,
        NUMONE: 97,
        NUMTWO: 98,
        NUMTHREE: 99,
        NUMFOUR: 100,
        NUMFIVE: 101,
        NUMSIX: 102,
        NUMSEVEN: 103,
        NUMEIGHT: 104,
        NUMNINE: 105,

        NUMMULT: 106,
        NUMPLUS: 107,
        NUMSUBTRACT: 109,
        NUMDECIMAL: 110,
        NUMDIVIDE: 111,

        F5: 116,

        NUMLOCK: 144,

        SUBTRACT: 187,
        COMMA: 188,
        PLUS: 189,
        FULLSTOP: 190
    };

    /**
     * Load "Open Sans" Font
     */

    if (WebFont) {
        WebFont.load({
            google: {
                families: ["Open+Sans:300,400,600:latin"]
            }
        })
    }

})(window.BV, window.WebFont);
(function (base, undefined) {
    "use strict";

    var services,
        _methods, _validateSettings;

    /**
     * @typedef {string} Method
     * @private
     */

    _methods = {
        "POST": "POST",
        "GET": "GET",
        "PUT": "PUT",
        "DELETE": "DELETE"
    };


    services = base.extend(base, "Services");


    /**
     * Basic AJAX call.
     *
     * @param {object} settings - AJAX settings.
     * @param {Method} settings.method - Method type.
     * @param {string} settings.url - URL.
     * @param {string} settings.successCallback - Function called when everything is OK.
     * @param {string} settings.errorCallback - Function executed if something goes wrong.
     */

    services.ajax = function (settings) {
        var request;

        settings = _validateSettings(settings);

        request = new XMLHttpRequest();

        request.open(settings.method, settings.url, true);

        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

        request.onreadystatechange = function () {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200) {
                    if (settings.successCallback) {
                        settings.successCallback.call(this, JSON.parse(request.responseText));
                    }
                }
                else {
                    if (settings.errorCallback) {
                        settings.errorCallback.call(this);
                    }
                }
            }
        };

        request.send(settings.data);
    };


    /**
     * Simple wrapper for `.ajax` method.
     *
     * @param {string} url
     * @param {object} data
     * @param {function=} successCallback
     * @param {function=} errorCallback
     */

    services.post = function (url, data, successCallback, errorCallback) {
        services.ajax({
            method: _methods.POST,
            url: url,
            data: data,
            successCallback: successCallback,
            errorCallback: errorCallback
        });
    };


    /**
     * Very simple validation method.
     *
     * @param {object} settings
     * @returns {{method: string, url: string, async: boolean, successCallback: function, errorCallback: function}}
     * @private
     */

    _validateSettings = function (settings) {
        return {
            // Check if method provided by user appears in the `_methods` list. Use `POST` if it's not on the list.
            method: _methods[settings.method] || _methods.POST,
            data: JSON.stringify(settings.data),
            url: typeof settings.url === "string" ? settings.url : "",
            successCallback: typeof settings.successCallback === "function" ? settings.successCallback : false,
            errorCallback: typeof settings.errorCallback === "function" ? settings.errorCallback : false
        }
    };

})(window.BV);
(function (base, undefined) {
    var elements,
        keys,
        page,
        services,
        
        
        // Private variables.

        _button,
        _classes,
        _inputGroup,
        
        
        // Events variables.
        
        _onLoginAttempt,
        _onValidateLoginDetails,
        _onCancelPasswordRequest,
        _onEmailValidation,
        _onRequestPassword,
        _onSupportRequest,
        _onSupportClose,
        _onSupportValidation,
        _onSupportEmailValidation;

    
    // Setup namespaces.
    
    keys        = base.extend(base, "Keys");
    services    = base.extend(base, "Services");
    page        = base.extend(base, "Page");
    elements    = base.extend(page, "Elements");


    // Caching elements.

    elements.app                = document.getElementById("app");
    elements.loginUsername      = document.getElementById("login--username");
    elements.loginUsernameCtrl  = document.getElementById("login--username-ctrl");
    elements.loginPassword      = document.getElementById("login--password");
    elements.loginPasswordCtrl  = document.getElementById("login--password-ctrl");
    elements.loginKeepIn        = document.getElementById("login--keep-in");
    elements.loginSendPassword  = document.getElementById("login--send-password");
    elements.loginButton        = document.getElementById("login--log-in");
    elements.passwordEmail      = document.getElementById("password--email");
    elements.passwordEmailCtrl  = document.getElementById("password--email-ctrl");
    elements.passwordSend       = document.getElementById("password--send");
    elements.passwordCancel     = document.getElementById("password--cancel");
    elements.support            = document.getElementById("support");
    elements.supportTrigger     = document.getElementById("support--trigger");
    elements.supportSend        = document.getElementById("support--send");
    elements.supportClose       = document.getElementById("support--close");
    elements.supportName        = document.getElementById("support--name");
    elements.supportNameCtrl    = document.getElementById("support--name-ctrl");
    elements.supportEmail       = document.getElementById("support--email");
    elements.supportEmailCtrl   = document.getElementById("support--email-ctrl");
    elements.supportType        = document.getElementById("support--type");
    elements.supportTypeCtrl    = document.getElementById("support--type-ctrl");
    elements.supportDetails     = document.getElementById("support--details");
    elements.supportDetailsCtrl = document.getElementById("support--details-ctrl");


    // Placeholders for `InputGroup` controls.

    _inputGroup = {
        login: {
            username: null,
            password: null
        },
        forgotPassword: {
            email: null
        },
        support: {
            name: null,
            email: null,
            type: null,
            details: null
        }
    };


    // Placeholders for `Button` controls.

    _button = {
        login: {
            submit: null
        },
        forgotPassword: {
            submit: null
        },
        support: {
            submit: null
        }
    };


    // Common CSS classes.

    _classes = {
        flipperActive: "flipper--active",
        disabledButton: "button--disabled",
        modalVisible: "modal--visible"
    };


    /********************* Page Initialisation ***********************/


    /**
     * Initialise page functionality.
     */

    page.initialise = function () {
        page.initialiseControls();
    };


    /**
     * Initialise controls and events.
     */

    page.initialiseControls = function () {

        // Focus username on page load.
        elements.loginUsername.focus();


        // "Login" View validation.

        _inputGroup.login.username = new InputGroup(elements.loginUsernameCtrl, {
            events: "change",
            messages: {
                empty: "Oi, get back here! We need you username!",
                invalid: "This doesn't seem right..."
            },
            validationMethod: function () {
                return this.value.match(/^\w/);
            }
        });

        _inputGroup.login.password = new InputGroup(elements.loginPasswordCtrl, {
            events: "change",
            messages: {
                empty: "You kind of need a password to log in... Duh!"
            }
        });


        // "Login" View buttons.

        _button.login.submit = new Button(elements.loginButton, {
            busy: {
                text: "Logging in, please wait..."
            }
        });


        // "Forgot Password" View validation.

        _inputGroup.forgotPassword.email = new InputGroup(elements.passwordEmailCtrl, {
            events: "change",
            messages: {
                empty: "Put your e-mail here, silly!",
                invalid: "That doesn't look like a valid e-mail address."
            },
            validationMethod: function () {
                return this.value.match(/^\S+@\S+$/g);
            }
        });


        // "Forgot Password" View buttons.

        _button.forgotPassword.submit = new Button(elements.passwordSend, {
            busy: {
                text: "Please wait..."
            }
        });


        // "Support" Panel Validation.

        _inputGroup.support.name = new InputGroup(elements.supportNameCtrl, {
            events: "change",
            messages: {
                empty: "Please tell us your name."
            }
        });

        _inputGroup.support.email = new InputGroup(elements.supportEmailCtrl, {
            events: "change",
            messages: {
                empty: "Put your e-mail here, silly!",
                invalid: "That doesn't look like a valid e-mail address."
            },
            validationMethod: function () {
                return this.value.match(/^\S+@\S+$/g);
            }
        });

        _inputGroup.support.type = new InputGroup(elements.supportTypeCtrl, {
            events: "change",
            messages: {
                empty: "Please let us know how we can help."
            }
        });

        _inputGroup.support.details = new InputGroup(elements.supportDetailsCtrl, {
            events: "change",
            messages: {
                empty: "Please let us know how we can help."
            }
        });


        // "Support" Panel buttons.

        _button.support.submit = new Button(elements.supportSend, {
            busy: {
                text: "Sending, please wait..."
            }
        });


        // Document-level events.

        document.addEventListener("keyup", page.onSupportClose, false);


        // Events related to logging in.

        elements.loginUsername  .addEventListener("change", _onValidateLoginDetails, false);
        elements.loginPassword  .addEventListener("change", _onValidateLoginDetails, false);
        elements.loginPassword  .addEventListener("keyup", _onValidateLoginDetails, false);
        elements.loginUsername  .addEventListener("keyup", _onValidateLoginDetails, false);
        elements.loginUsername  .addEventListener("keyup", _onLoginAttempt, false);
        elements.loginPassword  .addEventListener("keyup", _onLoginAttempt, false);
        elements.loginButton    .addEventListener("click", page.attemptLoggingIn, false);


        // Events related to password request.

        elements.passwordEmail      .addEventListener("keyup", _onEmailValidation, false);
        elements.loginSendPassword  .addEventListener("click", _onRequestPassword, false);
        elements.passwordCancel     .addEventListener("click", _onCancelPasswordRequest, false);
        elements.passwordSend       .addEventListener("click", page.requestNewPassword, false);


        // Events related to support panel.

        elements.supportTrigger .addEventListener("click", _onSupportRequest, false);
        elements.supportClose   .addEventListener("click", _onSupportClose, false);
        elements.supportName    .addEventListener("keyup", _onSupportValidation, false);
        elements.supportEmail   .addEventListener("keyup", _onSupportValidation, false);
        elements.supportEmail   .addEventListener("keyup", _onSupportEmailValidation, false);
        elements.supportType    .addEventListener("change", _onSupportValidation, false);
        elements.supportDetails .addEventListener("blur", _onSupportValidation, false);
        elements.supportDetails .addEventListener("keyup", _onSupportValidation, false);
        elements.supportSend    .addEventListener("click", page.sendSupportRequest, false);
    };


    /********************* "Login" View Functionality ***********************/


    /**
     * Function executed when user clicks on "Log in" button.
     */

    page.attemptLoggingIn = function () {
        var loginDetails;

        // Getting login details from the page.
        loginDetails = page.getLoginDetails(true);

        if (loginDetails.valid && !_button.login.submit.isBusy) {

            _button.login.submit.setBusy(true);

            window.setTimeout(function () {
                _button.login.submit.setBusy(false);

                _inputGroup.login.username.setErrorState("Invalid username or password, please try again.");

                _inputGroup.login.username.config.element.focus();

            }, 3000);

//            // Call login method.
//            services.post("/Login", {
//                username: loginDetails.username,
//                password: loginDetails.password
//            }, function (response) {
//                alert("Success");
//            }, function () {
//                alert("Fail");
//            });
        }
    };


    /**
     * Function used to retrieve login details entered by user.
     *
     * @param {boolean=} validate - If `true` validation method will be triggered.
     * @returns {{valid: boolean, username: {string}, password: {string}}}
     */

    page.getLoginDetails = function (validate) {
        var valid;

        valid = page.validateLoginDetails(!!validate);

        return {
            valid: valid,
            username: elements.loginUsername.value,
            password: elements.loginPassword.value
        }
    };


    /**
     * Show/hide login button if the fields are valid/invalid.
     *
     * @param {boolean=} validate - If `true` validation method will be triggered.
     * @returns {boolean}
     */

    page.validateLoginDetails = function (validate) {
        var valid;

        valid =
            _inputGroup.login.username.validate(!validate) &
            _inputGroup.login.password.validate(!validate);

        return !!valid;
    };


    /********************* "Forgot Password" View Functionality ***********************/


    /**
     * Request New Password method.
     */

    page.requestNewPassword = function () {
        var email;

        email = page.getNewPasswordDetails(true);

        if (email.valid && !_button.forgotPassword.isBusy) {
            _button.forgotPassword.submit.setBusy(true);

            window.setTimeout(function () {
                _button.forgotPassword.submit.setBusy(false);

                if (Math.random()<.5) {
                    _inputGroup.forgotPassword.email.setSuccessState("Thank you, please check your e-mail for further instructions.");
                }
                else {
                    _inputGroup.forgotPassword.email.setErrorState("Sorry, something went wrong. Please contact our support team...");
                }
            }, 3000);

            // Call web service.
//            services.post("/RequestPassword", {
//                email: email.email
//            }, function (response) {
//                alert("Success!");
//            }, function () {
//                alert("Fail!");
//            });
        }
    };


    /**
     * Function used to retrieve email address.
     *
     * @param {boolean} validate -  If `true` validation method will be triggered.
     * @returns {{valid: boolean, email: string}}
     */

    page.getNewPasswordDetails = function (validate) {
        var valid;

        valid = page.validatePasswordRequest(!!validate);

        return {
            valid: valid,
            email: elements.passwordEmail.value
        };
    };


    /**
     * Validate e-mail on password request panel.
     */

    page.validatePasswordRequest = function (validate) {
        var valid;

        valid = _inputGroup.forgotPassword.email.validate(!validate);

        return valid;
    };


    /********************* "Support" Panel Functionality ***********************/


    /**
     * Get details from the support form.
     *
     * @param {boolean=} validate - Indicate whether to show validation messages or not.
     * @returns {object}
     */

    page.getSupportDetails = function (validate) {
        var valid;

        valid = page.validateSupportPanel(!!validate);

        return {
            valid: valid,
            name: elements.supportName.value,
            email: elements.supportEmail.value,
            type: elements.supportType.value,
            details: elements.supportDetails.value
        }
    };


    /**
     * Send support request.
     */

    page.sendSupportRequest = function () {
        var supportDetails;

        supportDetails = page.getSupportDetails(true);

        if (supportDetails.valid && !_button.support.submit.isBusy) {

            _button.support.submit.setBusy(true);

            window.setTimeout(function () {
                _button.support.submit.setBusy(false);

                if (Math.random()<.5) {
                    _inputGroup.support.details.setSuccessState("Thank you, one of our team members will contact you shortly.");
                }
                else {
                    _inputGroup.support.details.setErrorState("Sorry, something went wrong. Please contact our support team..");
                }
            }, 3000);

            // Call support method.
//            services.post("/Support", {
//                name: supportDetails.name,
//                email: supportDetails.email,
//                type: supportDetails.type,
//                details: supportDetails.details
//            }, function (response) {
//                alert("Success");
//            }, function () {
//                alert("Fail");
//            });
        }
    };


    /**
     * Function used to show or hide support panel.
     *
     * @param {boolean} show - Indicate whether to show or hide the panel.
     */

    page.toggleSupportPanel = function (show) {
        if (show) {
            elements.support.classList.add(_classes.modalVisible);

            //elements.supportName.focus();
        }
        else {
            elements.support.classList.remove(_classes.modalVisible);
        }
    };


    /**
     * Validate entire support form.
     *
     * @param {boolean=} validate - Indicate whether to show validation messages.
     * @returns {boolean}
     */

    page.validateSupportPanel = function (validate) {
        var valid;

        valid =
            _inputGroup.support.name.validate(!validate) &
            _inputGroup.support.email.validate(!validate) &
            _inputGroup.support.type.validate(!validate) &
            _inputGroup.support.details.validate(!validate);

        return !!valid;
    };


    /**
     * Toggle "Forgot Password" view.
     *
     * @param {boolean} show - Indicate whether to show or hide the panel.
     */

    page.showForgotPasswordPanel = function (show) {

        // Focus different input depending on the view.
        if (show) {
            elements.app.classList.add(_classes.flipperActive);

            elements.passwordEmail.focus()
        }
        else {
            elements.app.classList.remove(_classes.flipperActive);

            elements.loginUsername.focus();
        }
    };


    /********************* "Login" View Events ***********************/

    
    /**
     * Function executed when user tries to log in.
     *
     * @param {object} e - Event.
     * @private
     */

    _onLoginAttempt = function (e) {
        if (e.keyCode === keys.ENTER) {
            page.attemptLoggingIn();
        }
    };


    /**
     * Function executed when user changes any of the login inputs.
     *
     * @param {object} e = Event
     * @private
     */

    _onValidateLoginDetails = function (e) {
        var valid;

        valid = page.validateLoginDetails(false);

        if (valid) {
            elements.loginButton.classList.remove(_classes.disabledButton);

            // Clear any outstanding error messages.
            page.validateLoginDetails(true);
        }
        else {
            elements.loginButton.classList.add(_classes.disabledButton);
        }
    };


    /********************* "Forgot Password" View Events ***********************/


    /**
     * Function called when user clicks on the "Cancel" button on the "Forgot Password" view.
     *
     * @param {object} e - Click event.
     * @private
     */

    _onCancelPasswordRequest = function (e) {
        e.preventDefault();

        page.showForgotPasswordPanel(false);
    };


    /**
     * Event handler for email input.
     *
     * @param {object} e - Keyup event.
     * @private
     */

    _onEmailValidation = function (e) {
        var valid;

        if (e.keyCode === keys.ENTER) {
            return page.requestNewPassword();
        }

        valid = page.validatePasswordRequest(false);

        if (valid) {
            elements.passwordSend.classList.remove(_classes.disabledButton);
        }
        else {
            elements.passwordSend.classList.add(_classes.disabledButton);
        }

        // If valid clear any outstanding error messages.
        if (valid) {
            page.validatePasswordRequest(true);
        }
    };


    /**
     * Function called when user clicks on the "Forgot Password" link on the "Login" view.
     *
     * @param {object} e - Click event.
     * @private
     */

    _onRequestPassword = function (e) {
        e.preventDefault();

        page.showForgotPasswordPanel(true);
    };


    /********************* "Support" Panel Events ***********************/


    /**
     * Event handler for Support panel trigger.
     *
     * @param {object} e - Click event.
     * @private
     */

    _onSupportRequest = function (e) {
        e.preventDefault();

        e.stopPropagation();

        page.toggleSupportPanel(true);
    };


    /**
     * Event handler for Support panel cancel button.
     *
     * @param {object} e - Click event.
     * @private
     */

    _onSupportClose = function (e) {
        e.preventDefault();

        if (e.type === "click" || e.keyCode === keys.ESC) {
            page.toggleSupportPanel(false);
        }
    };


    /**
     * Event handler for support form validation.
     *
     * @private
     */

    _onSupportValidation = function (e) {
        var valid;

        valid = page.validateSupportPanel(false);

        if (e.keyCode === keys.ENTER && (!e.target || e.target.tagName !== "TEXTAREA")) {
            return page.sendSupportRequest();
        }

        if (valid) {
            elements.supportSend.classList.remove(_classes.disabledButton);
        }
        else {
            elements.supportSend.classList.add(_classes.disabledButton);
        }

        // Clear any outstanding messages.
        if (valid) {
            page.validateSupportPanel(true);
        }
    };


    /**
     * Event handler for support email validation.
     * 
     * @private
     */
    
    _onSupportEmailValidation = function () {
        var valid;

        valid = _inputGroup.support.email.validate(true);

        if (valid) {
            _inputGroup.support.email.clearState();
        }
    };

})(window.BV);