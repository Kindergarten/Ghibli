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