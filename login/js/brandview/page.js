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