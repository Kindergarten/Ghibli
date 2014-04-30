(function(m) {
    "use strict";

    var html, item, key, className;

    html = document.getElementsByTagName("html")[0];

    if (m && html) {

         // Check input attributes.
        for (key in m.input) {
            item = m.input[key];

            className = item ? "input-" + key : "no-input-" + key;

            html.className = html.className + " " + className;
        }

    }

})(Modernizr);