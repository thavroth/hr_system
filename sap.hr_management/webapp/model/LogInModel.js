
sap.ui.define([
    "ui5/walkthrough/utils/Cookie",
    "ui5/walkthrough/utils/HttpService"
], function (Cookie, HttpService) {
    "use strict";

    return {
        login: function (payload, onSuccess, onError) {
            HttpService.callApi(
                HttpService.getUrl("Login"),
                "POST",
                payload,
                function (data) {
                    var sessionId = data.SessionId;
                    Cookie.setCookie("B1SESSION", sessionId, 30); 
                    onSuccess(data);
                },
                function (xhr, status, error) {
                    onError(xhr, status, error);
                }
            );
        },
        
        logout: function (onSuccess) {
            // Clear the session cookie
            Cookie.deleteCookie("B1SESSION");
            
            // Call the onSuccess callback to perform additional actions like routing
            if (onSuccess && typeof onSuccess === "function") {
                onSuccess();
            }
        }
    };
});


