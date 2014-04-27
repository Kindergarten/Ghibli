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