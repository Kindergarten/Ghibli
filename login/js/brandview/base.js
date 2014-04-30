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