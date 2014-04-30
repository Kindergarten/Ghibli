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