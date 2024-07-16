// HttpService.js
sap.ui.define([], function () {
    "use strict";

    return {
        callApi: function (sUrl, sMethod, oData, onSuccess, onError) {
            jQuery.ajax({
                url: sUrl,
                type: sMethod,
                contentType: "application/json",
                data: oData ? JSON.stringify(oData) : null,
                xhrFields: {
                    withCredentials: true
                },
                success: onSuccess,
                error: onError
            });
        },

        getUrl: function (sEndpoint) {
            return "https://192.168.1.11:50000/b1s/v1/" + sEndpoint;
        }
    };
});
