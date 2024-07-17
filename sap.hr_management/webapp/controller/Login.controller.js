sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageBox",
    "ui5/walkthrough/model/LoginModel"
], function (Controller, History, MessageBox, LoginModel) {
    "use strict";

    return Controller.extend("ui5.walkthrough.controller.Login", {
        onLoginPress: function () {
            var that = this;

            var username = this.byId("usernameInput").getValue();
            var password = this.byId("passwordInput").getValue();
            var companyDB = this.byId("companyDBInput").getValue();

            var payload = {
                "CompanyDB": companyDB,
                "UserName": username,
                "Password": password
            };

            // var payload = {
            //     "CompanyDB": "TLTELA_DEVELOPER",
            //     "UserName": 'manager',
            //     "Password": '1234'
            // };

            LoginModel.login(payload,
                function onSuccess(data) {
                   
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                    oRouter.navTo("home");
                },
                function onError(xhr, status, error) {
                    MessageBox.error("Login failed");
                }
            );
        }
    });
});
