sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/core/Fragment',
    "ui5/walkthrough/utils/Cookie",
], function (Controller, Fragment, Cookie) {
    "use strict";

    return Controller.extend("ui5.walkthrough.controller.Main", {
        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            
            oRouter.attachRouteMatched(this.onRouteMatched, this);
            
            // Ensure router is aware of the app container
            this.getView().byId("appContainer").addDelegate({
                onAfterRendering: function () {
                    oRouter.initialize();
                }.bind(this)
            });

            if (!Cookie.getCookie("B1SESSION")) {
                oRouter.navTo("login");
            } else {
                oRouter.navTo("employees", {}, true);
            }
        },

        onSideNavButtonPress: function () {
            var oToolPage = this.byId("toolPage");
            var bSideExpanded = oToolPage.getSideExpanded();
            oToolPage.setSideExpanded(!bSideExpanded);
        },

        onItemSelect: function (oEvent) {
            var sKey = oEvent.getParameter("item").getKey();
            this.getOwnerComponent().getRouter().navTo(sKey);
        },

        onRouteMatched: function (oEvent) {
            var sRouteName = oEvent.getParameter("name");

            if (!Cookie.getCookie("B1SESSION")) {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("login");
                return;
            }        

            var oSideNavigation = this.byId("sideNavigation");
            var oNavigationList = this.byId("navigationList");
            var oSelectedItem = oNavigationList.getItems().find(function (item) {
                return item.getKey() === sRouteName;
            });

            if (oSelectedItem) {
                oSideNavigation.setSelectedItem(oSelectedItem);
            }
        },

        onMyAccountPress: function () {
            var oView = this.getView(),
                oButton = oView.byId("button");

            if (!this._oMenuFragment) {
                this._oMenuFragment = Fragment.load({
                    id: oView.getId(),
                    name: "ui5.walkthrough.view.components.Menu",
                    controller: this
                }).then(function(oMenu) {
                    oMenu.openBy(oButton);
                    this._oMenuFragment = oMenu;
                    return this._oMenuFragment;
                }.bind(this));
            } else {
                this._oMenuFragment.openBy(oButton);
            }
        },

        onMenuAction: function (oEvent) {
            var oItem = oEvent.getParameter("item");
            var sKey = oItem.getKey();

            if (sKey === "logout") {
                this._showLogoutConfirmDialog();
            } else {
                // Handle other menu actions
            }
        },

        _showLogoutConfirmDialog: function () {
            var oView = this.getView();

            if (!this.byId("logoutConfirmDialog")) {
                Fragment.load({
                    id: oView.getId(),
                    name: "ui5.walkthrough.view.components.LogOutDialog",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    oDialog.open();
                });
            } else {
                this.byId("logoutConfirmDialog").open();
            }
        },

        onConfirmLogout: function () {
        
            this.byId("logoutConfirmDialog").close();
        
     
            Cookie.deleteCookie("B1SESSION");
        
       
            var oModel = this.getView().getModel();
            if (oModel) {
                oModel.setData(null); 
            }
        
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("login");

            window.location.reload();
        },
        


        onCancelLogout: function () {
            this.byId("logoutConfirmDialog").close();
        }

        
    });
});
