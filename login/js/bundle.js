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
            if (request.readyState === 4) {
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
        page,
        services,
        _classes, _validation;

    page = base.extend(base, "Page");

    services = base.extend(base, "Services");

    elements = base.extend(page, "Elements");

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
    elements.supportClose       = document.getElementById("support--close");
    elements.supportName        = document.getElementById("support--name");
    elements.supportEmail       = document.getElementById("support--email");
    elements.supportMode        = document.getElementById("support--mode");
    elements.supportDetails     = document.getElementById("support--details");


    _validation = {
        username: null,
        password: null,
        email: null
    };

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

        // Setup username validation.
        _validation.username = new InputGroup(elements.loginUsernameCtrl, {
            events: "change",
            messages: {
                empty: "Oi, get back here! We need you username!",
                invalid: "This doesn't seem right..."
            },
            validationMethod: function () {
                return this.value.match(/^\w/);
            }
        });

        // Setup password validation.
        _validation.password = new InputGroup(elements.loginPasswordCtrl, {
            events: "change",
            messages: {
                empty: "You kind of need a password to log in... Duh!"
            }
        });

        // Setup e-mail validation.
        _validation.email = new InputGroup(elements.passwordEmailCtrl, {
            events: "change",
            messages: {
                empty: "Put your e-mail here, silly!",
                invalid: "That doesn't look like a valid e-mail address."
            },
            validationMethod: function () {
                return this.value.match(/^\S+@\S+$/g);
            }
        });


        // Events related to password request.

        elements.passwordEmail.addEventListener("keyup", page.validatePasswordRequest, false);

        elements.loginSendPassword.addEventListener("click", page.onRequestPassword, false);

        elements.passwordCancel.addEventListener("click", page.onCancelPasswordRequest, false);

        elements.passwordSend.addEventListener("click", page.requestNewPassword, false);


        // Events related to logging in.

        elements.loginUsername.addEventListener("change", page.validateLoginDetails, false);

        elements.loginPassword.addEventListener("change", page.validateLoginDetails, false);

        elements.loginPassword.addEventListener("keyup", page.validateLoginDetails, false);

        elements.loginUsername.addEventListener("keyup", page.onLoginAttempt, false);

        elements.loginPassword.addEventListener("keyup", page.onLoginAttempt, false);

        elements.loginButton.addEventListener("click", page.attemptLoggingIn, false);

        // Events related to both views.

        elements.supportTrigger.addEventListener("click", page.onSupportRequest, false);

        elements.supportClose.addEventListener("click", page.onSupportClose, false);
    };


    /********************* "Login" View Functionality ***********************/


    /**
     * Function executed when user clicks on "Log in" button.
     */

    page.attemptLoggingIn = function () {
        var loginDetails;

        // Getting login details from the page.
        loginDetails = page.getLoginDetails(true);

        if (loginDetails.valid) {

            // Call login method.
            services.post("/Login", {
                username: loginDetails.username,
                password: loginDetails.password
            }, function (response) {
                alert("Success");
            }, function () {
                alert("Fail");
            });
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

        valid = _validation.username.validate(!validate) & _validation.password.validate(!validate);

        return {
            valid: valid,
            username: elements.loginUsername.value,
            password: elements.loginPassword.value
        }
    };


    /**
     * Show/hide login button if the fields are valid/invalid.
     */

    page.validateLoginDetails = function () {
        var valid;

        valid = _validation.username.validate(true) && _validation.password.validate(true);

        elements.loginButton.classList.toggle(_classes.disabledButton, !valid);
    };


    /********************* "Forgot Password" View Functionality ***********************/


    /**
     * Request New Password method.
     */

    page.requestNewPassword = function () {
        var email;

        email = page.getEmail(true);

        if (email.valid) {

            services.post("/RequestPassword", {
                email: email.email
            }, function (response) {
                alert("Success!");
            }, function () {
                alert("Fail!");
            });
        }
    };


    /**
     * Function used to retrieve email address.
     *
     * @param {boolean} validate -  If `true` validation method will be triggered.
     * @returns {{valid: boolean, email: string}}
     */

    page.getEmail = function (validate) {
        var valid;

        valid = _validation.email.validate(!validate);

        return {
            valid: valid,
            email: elements.passwordEmail.value
        };
    };


    /**
     * Validate e-mail on password request panel.
     */

    page.validatePasswordRequest = function () {
        var valid;

        valid = _validation.email.validate(true);

        // If valid, use `validate()` to clear any error/warning messages.
        if (valid) {
            _validation.email.validate();
        }

        elements.passwordSend.classList.toggle(_classes.disabledButton, !valid);
    };


    /********************* Both Views Functionality ***********************/


    /**
     * Toggle "Forgot Password" view.
     *
     * @param {boolean} show - Indicate whether to show or hide the panel.
     */

    page.showForgotPasswordPanel = function (show) {

        // Focus different input depending on the view.
        if (show) {
            elements.passwordEmail.focus();
        }
        else {
            elements.loginUsername.focus();
        }

        elements.app.classList.toggle(_classes.flipperActive, !!show);
    };


    /**
     * Function used to show or hide support panel.
     *
     * @param {boolean} show - Indicate whether to show or hide the panel.
     */

    page.toggleSupportPanel = function (show) {
        if (show) {

        }

        elements.support.classList.toggle(_classes.modalVisible, !!show);
    };


    /********************* Events ***********************/


    page.onLoginAttempt = function (e) {
        // On enter...
        if (e.keyCode === 13) {
            page.attemptLoggingIn();
        }
    };


    /**
     * Function called when user clicks on the "Cancel" button on the "Forgot Password" view.
     *
     * @param {object} e - Click event.
     */

    page.onCancelPasswordRequest = function (e) {
        e.preventDefault();

        page.showForgotPasswordPanel(false);
    };


    /**
     * Function called when user clicks on the "Forgot Password" link on the "Login" view.
     *
     * @param {object} e - Click event.
     */

    page.onRequestPassword = function (e) {
        e.preventDefault();

        page.showForgotPasswordPanel(true);
    };


    /**
     * Event handler for Support panel trigger.
     *
     * @param {object} e - Click event.
     */

    page.onSupportRequest = function (e) {
        e.preventDefault();

        page.toggleSupportPanel(true);
    };


    /**
     * Event handler for Support panel cancel button.
     *
     * @param {object} e - Click event.
     */
    page.onSupportClose= function (e) {
        e.preventDefault();

        page.toggleSupportPanel(false);
    };

})(window.BV);