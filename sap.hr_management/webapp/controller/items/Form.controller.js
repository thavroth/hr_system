sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "ui5/walkthrough/model/ItemModel" // Ensure correct path to ItemModel
], function (Controller, JSONModel, MessageToast, MessageBox, ItemModel) {
    "use strict";

    return Controller.extend("ui5.walkthrough.controller.ItemForm", {
        onInit: function () {
            var oItemModel = new JSONModel({
                mode: "", 
                ItemCode: "",
                ItemName: "",
                ItemType: "",
                itemCodeError: ""
            });
            this.getView().setModel(oItemModel, "itemModel");

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("itemForm").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var oArgs = oEvent.getParameter("arguments");
            var sMode = oArgs.mode;
            var sItemCode = oArgs.item;

            var oItemModel = this.getView().getModel("itemModel");
            oItemModel.setProperty("/mode", sMode);

            if (sMode === "Create") {
                // Initialize empty form data for creating a new item
                oItemModel.setData({
                    mode: sMode,
                    ItemCode: "",
                    ItemName: "",
                    ItemType: "",
                    itemCodeError: ""
                });
            } else {
                // Fetch the item details from the model
                this._fetchItemDetails(sItemCode, sMode);
            }
        },

        _fetchItemDetails: function (sItemCode, sMode) {
            ItemModel.getItemByItemCode(sItemCode,
                function (oData) {
                    oData.mode = sMode; // Add mode to the data
                    oData.itemCodeError = ""; // Initialize error property
                    var oItemModel = new JSONModel(oData);
                    this.getView().setModel(oItemModel, "itemModel");
                }.bind(this),
                function (oError) {
                    MessageToast.show("Failed to fetch item data.");
                    console.error("Error fetching item data:", oError);
                }
            );
        },

        onSavePress: function () {
            var oView = this.getView();
            var oItemModel = oView.getModel("itemModel");
            var oData = oItemModel.getData();

            if (oData.mode === "Create") {
                // Validate Item Code
                if (!oData.ItemCode.trim()) {
                    oItemModel.setProperty("/itemCodeError", "Item Code cannot be empty.");
                    return;
                } else {
                    oItemModel.setProperty("/itemCodeError", "");
                }

                // Add the new item
                ItemModel.addItem({
                    ItemCode: oData.ItemCode,
                    ItemName: oData.ItemName,
                    ItemType: oData.ItemType
                });

                MessageToast.show("Item created successfully!");
                this._navigateBack();
            } else if (oData.mode === "Update") {
                // Use the updateItem method from ItemModel
                ItemModel.updateItem(oData.ItemCode, {
                    ItemName: oData.ItemName,
                    ItemType: oData.ItemType
                });

                MessageToast.show("Item updated successfully!");
                this._navigateBack();
            }
        },

        onCancelPress: function () {
            this._navigateBack();
        },

        onBackPress: function () {
            this._navigateBack();
        },

        _navigateBack: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("users");
        }
    });
});
