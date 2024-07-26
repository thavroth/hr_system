// sap.ui.define([
//     "sap/ui/core/mvc/Controller",
//     'sap/ui/core/Fragment',
//     "sap/ui/model/json/JSONModel",
//     "ui5/walkthrough/utils/Cookie",
// ], function (Controller, Fragment, JSONModel, Cookie) {
//     "use strict";

//     return Controller.extend("ui5.walkthrough.controller.Main", {
//         onInit: function () {
//             this._bExpanded = false;
//             var oRouter = this.getOwnerComponent().getRouter();
            
//             oRouter.attachRouteMatched(this.onRouteMatched, this);
            
     
//             this.getView().byId("appContainer").addDelegate({
//                 onAfterRendering: function () {
//                     oRouter.initialize();
//                 }.bind(this)
//             });

//             if (!Cookie.getCookie("B1SESSION")) {
//                 oRouter.navTo("login");
//             } else {
//                 oRouter.navTo("employees", {}, true);
//             }
           
//             var oMenuModel = new JSONModel();
//             oMenuModel.loadData(sap.ui.require.toUrl("ui5/walkthrough/model/menu/menuItem.json"));
//             this.getView().setModel(oMenuModel, "menu");
//         },

//         onSideNavButtonPress: function () {
//             var oToolPage = this.byId("toolPage");
//             var bSideExpanded = oToolPage.getSideExpanded();
//             oToolPage.setSideExpanded(!bSideExpanded);
//         },


//         onItemSelect: function (oEvent) {
//             var sKey = oEvent.getParameter("item").getKey();
//             this.getOwnerComponent().getRouter().navTo(sKey);
//         },

//         onToggleSidebar: function () {
//             var oSplitApp = this.byId("splitApp");
//             var bShowHide = oSplitApp.getMode() === "ShowHideMode" ? "HideMode" : "ShowHideMode";
//             oSplitApp.setMode(bShowHide);
//         },

//         onItemSelect: function (oEvent) {
//             var sKey = oEvent.getSource().getBindingContext("menu").getProperty("key");
//             this.getOwnerComponent().getRouter().navTo(sKey);
//         },

//         onRouteMatched: function (oEvent) {
          

//             if (!Cookie.getCookie("B1SESSION")) {
//                 var oRouter = this.getOwnerComponent().getRouter();
//                 oRouter.navTo("login");
//                 return;
//             }
//         },

//         onSideNavButtonPress: function () {
//             var oSplitApp = this.byId("splitApp");
//             var sCurrentMode = oSplitApp.getMode();

//             if (sCurrentMode === "ShowHideMode") {
//                 oSplitApp.setMode("HideMode");
//             } else {
//                 oSplitApp.setMode("ShowHideMode");
//             }
//         },

//         onRouteMatched: function (oEvent) {
//             var sRouteName = oEvent.getParameter("name");

//             if (!Cookie.getCookie("B1SESSION")) {
//                 var oRouter = this.getOwnerComponent().getRouter();
//                 oRouter.navTo("login");
//                 return;
//             }        

//             var oSideNavigation = this.byId("sideNavigation");
//             var oNavigationList = this.byId("navigationList");
//             var oSelectedItem = oNavigationList.getItems().find(function (item) {
//                 return item.getKey() === sRouteName;
//             });

//             if (oSelectedItem) {
//                 oSideNavigation.setSelectedItem(oSelectedItem);
//             }
//         },

//         onMyAccountPress: function () {
//             var oView = this.getView(),
//                 oButton = oView.byId("button");

//             if (!this._oMenuFragment) {
//                 this._oMenuFragment = Fragment.load({
//                     id: oView.getId(),
//                     name: "ui5.walkthrough.view.components.Menu",
//                     controller: this
//                 }).then(function(oMenu) {
//                     oMenu.openBy(oButton);
//                     this._oMenuFragment = oMenu;
//                     return this._oMenuFragment;
//                 }.bind(this));
//             } else {
//                 this._oMenuFragment.openBy(oButton);
//             }
//         },

//         onMenuAction: function (oEvent) {
//             var oItem = oEvent.getParameter("item");
//             var sKey = oItem.getKey();

//             if (sKey === "logout") {
//                 this._showLogoutConfirmDialog();
//             } else {
                
//             }
//         },

//         _showLogoutConfirmDialog: function () {
//             var oView = this.getView();

//             if (!this.byId("logoutConfirmDialog")) {
//                 Fragment.load({
//                     id: oView.getId(),
//                     name: "ui5.walkthrough.view.components.LogOutDialog",
//                     controller: this
//                 }).then(function (oDialog) {
//                     oView.addDependent(oDialog);
//                     oDialog.open();
//                 });
//             } else {
//                 this.byId("logoutConfirmDialog").open();
//             }
//         },

//         onConfirmLogout: function () {
        
//             this.byId("logoutConfirmDialog").close();
        
     
//             Cookie.deleteCookie("B1SESSION");
        
       
//             var oModel = this.getView().getModel();
//             if (oModel) {
//                 oModel.setData(null); 
//             }
        
//             var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
//             oRouter.navTo("login");

//             window.location.reload();
//         },
        


//         onCancelLogout: function () {
//             this.byId("logoutConfirmDialog").close();
//         }

        
//     });
// });

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "ui5/walkthrough/utils/Cookie",
    "sap/ui/Device"
], function (Controller, Fragment, JSONModel, Cookie, Device) {
    "use strict";

    return Controller.extend("ui5.walkthrough.controller.Main", {
        onInit: function () {

            var oIconTabBar = this.byId("iconTabBar");
            var sId = oIconTabBar.getId(); // Get the ID of the IconTabBar instance
            
            var style = document.createElement('style');
            style.innerHTML = '#' + sId + ' .sapMITBContent { display: none !important; }';
            document.head.appendChild(style);

            this._oSplitApp = this.byId("splitApp");
            this._oRouter = this.getOwnerComponent().getRouter();
            
            var oMenuModel = new JSONModel({
                selectedKey: "home",
                menuItems: []
            });
            
            oMenuModel.loadData(sap.ui.require.toUrl("ui5/walkthrough/model/menu/menuItem.json"));
            this.getView().setModel(oMenuModel, "menu");

            this._oRouter.attachRouteMatched(this.onRouteMatched, this);
            
            this.getView().byId("appContainer").addDelegate({
                onAfterRendering: function () {
                    this._oRouter.initialize();
                }.bind(this)
            });

            if (!Cookie.getCookie("B1SESSION")) {
                this._oRouter.navTo("login");
            } else {
                this._oRouter.navTo("home", {}, true);
            }
        
        },

        // onItemSelect: function (oEvent) {
        //     var oItem = oEvent.getParameter("item").getBindingContext("menu").getObject();
        //     var sKey = oItem.key;

        //     this.getView().getModel("menu").setProperty("/selectedKey", sKey);

        //     this._oRouter.navTo(sKey);
        // },

        // onRouteMatched: function (oEvent) {
        //     var sRouteName = oEvent.getParameter("name");
        //     var oRouter = this.getOwnerComponent().getRouter();
            
        //     if (!Cookie.getCookie("B1SESSION")) {
        //         oRouter.navTo("login");
        //         return;
        //     }
            
        //     var oMenuModel = this.getView().getModel("menu");
        //     var aMenuItems = oMenuModel.getProperty("/menuItems");
            
        //     var oSelectedItem = this.findItemByKey(aMenuItems, sRouteName);
            
        //     if (!oSelectedItem) {
        //         return;
        //     }
            
        //     oMenuModel.setProperty("/selectedKey", oSelectedItem.key);
        //     console.log(oSelectedItem.key);
            
        //     var oNavigationList = this.byId("navigationList");
            
        //     if (oSelectedItem.subItems) {
        
        //         var oNavItem = oNavigationList.getItems().find(function (item) {
        //             return item.getKey() === oSelectedItem.key;
        //         });
                
        //         if (oNavItem) {
            
        //             oNavigationList.setSelectedItem(oNavItem);
                    
        //             var oParentItem = oNavItem.getParent();
        //             if (oParentItem && oParentItem.getItems().length > 1) {
        //                 oParentItem.setExpanded(true);
        //             }
                    
        //             var oSubItem = oNavItem.getItems().find(function (item) {
        //                 return item.getKey() === sRouteName;
        //             });
                    
        //             if (oSubItem) {
        //                 oNavItem.setSelectedItem(oSubItem);
        //             }
        //         }
        //     } else {
        
        //         var oNavItem = oNavigationList.getItems().find(function (item) {
        //             return item.getKey() === sRouteName;
        //         });
                
        //         if (oNavItem) {
        //             oNavigationList.setSelectedItem(oNavItem);
        //         }
        //     }
        // },
        
        // findItemByKey: function (aItems, sKey) {
        //     for (var i = 0; i < aItems.length; i++) {
        //         if (aItems[i].key === sKey) {
        //             return aItems[i];
        //         }
        //         if (aItems[i].subItems) {
        //             var oSubItem = this.findItemByKey(aItems[i].subItems, sKey);
        //             if (oSubItem) {
        //                 return oSubItem;
        //             }
        //         }
        //     }
        //     return null;
        // },
        
        onItemSelect: function (oEvent) {
            var oItem = oEvent.getParameter("item").getBindingContext("menu").getObject();
            var sKey = oItem.key;
        
            this.getView().getModel("menu").setProperty("/selectedKey", sKey);
        
            this._oRouter.navTo(sKey);
        },
        
        onRouteMatched: function (oEvent) {
            var sRouteName = oEvent.getParameter("name");
            var oRouter = this.getOwnerComponent().getRouter();
            
            if (!Cookie.getCookie("B1SESSION")) {
                oRouter.navTo("login");
                return;
            }
            
            var oMenuModel = this.getView().getModel("menu");
            var aMenuItems = oMenuModel.getProperty("/menuItems");
            
            var oSelectedItem = this.findItemByKey(aMenuItems, sRouteName);
            
            if (!oSelectedItem) {
                return;
            }
            
    
            oMenuModel.setProperty("/selectedKey", oSelectedItem.key);
            
        },
        
        setIconTabBarSelection: function (sKey) {
            var oIconTabBar = this.byId("iconTabBar");
        
            if (oIconTabBar) {
                var oTab = oIconTabBar.getItems().find(function (item) {
                    return item.getKey() === sKey;
                });
        
                if (oTab) {
                    oIconTabBar.setSelectedKey(oTab.getKey());
                } else {
        
                    var oMenuModel = this.getView().getModel("menu");
                    var aMenuItems = oMenuModel.getProperty("/menuItems");
        
                    var oParentItem = aMenuItems.find(function (item) {
                        return item.subItems && item.subItems.some(function (subItem) {
                            return subItem.key === sKey;
                        });
                    });
        
                    if (oParentItem) {
                        oIconTabBar.setSelectedKey(oParentItem.key);
                    }
                }
            }
        },
        
        findItemByKey: function (aItems, sKey) {
            for (var i = 0; i < aItems.length; i++) {
                if (aItems[i].key === sKey) {
                    return aItems[i];
                }
                if (aItems[i].subItems) {
                    var oSubItem = this.findItemByKey(aItems[i].subItems, sKey);
                    if (oSubItem) {
                        return oSubItem;
                    }
                }
            }
            return null;
        },
        
        
        
              
        onSideNavButtonPress: function () {
            var oSplitApp = this.byId("splitApp");
            var screenWidth = sap.ui.Device.resize.width;
            
            if (screenWidth <= 1103) {
                if (oSplitApp.isMasterShown()) {
                    oSplitApp.hideMaster();
                } else {
                    oSplitApp.showMaster();
                }
            } else {
                var bMasterVisible = oSplitApp.getMode() === "ShowHideMode" || oSplitApp.getMode() === "StretchCompressMode";
                if (bMasterVisible) {
                    oSplitApp.setMode("HideMode");
                } else {
                    oSplitApp.setMode("ShowHideMode");
                }
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

            this._oRouter.navTo("login");

            window.location.reload();
        },

        onCancelLogout: function () {
            this.byId("logoutConfirmDialog").close();
        }
    });
});


