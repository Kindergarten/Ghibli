if (window.WebFont) {
    window.WebFont.load({
        google: {
            families: ["Open+Sans:400,300,600:latin"]
        }
    });
}

// TODO: focus relevant fields on page load / password recovery.
var app = document.querySelector("#app"),
    forgotPassword = document.querySelector("#forgot-password"),
    cancelPasswordRecovery = document.querySelector("#cancel-password-recovery");

forgotPassword.addEventListener("click", function (e) {
    e.preventDefault();

    showPasswordRecovery.call(this, true);
}, false);

cancelPasswordRecovery.addEventListener("click", function (e) {
    e.preventDefault();

    showPasswordRecovery.call(this, false);
}, false);

function showPasswordRecovery (show) {
    app.classList.toggle("flipper--active", !!show);
}