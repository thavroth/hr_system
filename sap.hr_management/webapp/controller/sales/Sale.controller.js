sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("ui5.walkthrough.controller.sales.Sale", {
        onInit: function () {
            var oMenuModel = new JSONModel({
                selectedKey: "home",
                menuItems: []
            });

            oMenuModel.loadData(sap.ui.require.toUrl("ui5/walkthrough/model/menu/menuItem.json"));
            this.getView().setModel(oMenuModel, "menu");


            oMenuModel.attachRequestCompleted(function() {
                var aMenuItems = oMenuModel.getProperty("/menuItems");
                var oSalesMenu = aMenuItems.find(function(item) { return item.key === "sales"; });
                if (oSalesMenu) {
                    var aSalesSubItems = oSalesMenu.subItems || [];
                    var oSalesModel = new JSONModel({
                        tiles: aSalesSubItems
                    });
                    this.getView().setModel(oSalesModel, "sales");
                }
            }.bind(this));
        },

        onTilePress: function (oEvent) {
            var sTileKey = oEvent.getSource().getCustomData()[0].getValue();
            this.getOwnerComponent().getRouter().navTo(sTileKey);
        }
    });
});
