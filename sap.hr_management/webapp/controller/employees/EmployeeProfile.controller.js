sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "ui5/walkthrough/model/EmployeeModel"
], (Controller, History, MessageToast, JSONModel, EmployeeModel) => {
    "use strict";

    return Controller.extend("ui5.walkthrough.controller.employees.EmployeeProfile", {
        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("employeeProfile").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            var sEmployeeId = oEvent.getParameter("arguments").employeeId;
            this._fetchEmployeeDetails(sEmployeeId);
        },

        _fetchEmployeeDetails: function (sEmployeeId) {
            EmployeeModel.getEmployeeByEmployeeId(sEmployeeId,
                function (oData) {
               
                    var sPrefix = oData.Gender === "gt_Male" ? "Mr." : "Miss";
                    oData.FullName = sPrefix + " " + oData.FirstName + " " + oData.LastName;
                    var sHomeAddress = [
                        oData.HomeStreet,
                        oData.HomeCity,
                        oData.HomeState,
                        oData.HomeCountry
                    ].filter(Boolean).join(", ");

                    oData.HomeAddress = sHomeAddress || "Address not available";
                    
        
                    var oProfileModel = new JSONModel(oData);
                    this.getView().setModel(oProfileModel, "profile");
                }.bind(this),
                function () {
                    MessageToast.show("Failed to fetch employee data.");
                }
            );
        },

        onNavBack: function () {
            const oHistory = History.getInstance();
            const sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("employee", {}, true);
            }
        }
    });
});
