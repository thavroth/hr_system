sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "ui5/walkthrough/model/ItemModel",
    "ui5/walkthrough/utils/Pagination",
    "sap/ui/thirdparty/jquery",
    "sap/ui/core/Fragment",
    "sap/ui/core/UIComponent"
], function (Controller, JSONModel, MessageToast, ItemModel, Pagination, jQuery, Fragment, UIComponent) {
    "use strict";

    return Controller.extend("ui5.walkthrough.controller.User", {
        onNavToEmployeeProfile: function (oEvent) {
      
            var sEmployeeId = oEvent.getSource().getParent().getBindingContext("ui").getProperty("ItemCode");
            console.log("Employee ID:", sEmployeeId);
            
            UIComponent.getRouterFor(this).navTo("employeeProfile", {
                employeeId: sEmployeeId
            });
        },
        onInit: function () {
        
            this._oUIModel = new JSONModel({
                pagination: {
                    currentPage: 1,
                    pageSize: 20,
                    totalItems: 0,
                    totalPages: 0,
                    hasPrevious: false,
                    hasNext: false
                },
                items: [],
                currentItems: []
            });
            this.getView().setModel(this._oUIModel, "ui");

            this.loadItems(1);
            this._oDeleteDialog = null;
            this._sSelectedItemCode = null;
        },

        loadItems: function (pageNumber) {
            var pageSize = this._oUIModel.getProperty("/pagination/pageSize");
            var skip = (pageNumber - 1) * pageSize;
            var top = pageSize;

            var oParams = {
                $top: top,
                $skip: skip,
                $count: true
            
            };

            ItemModel.fetchItems(
                oParams,
                function (oData) {
                    if (oData && oData.value) {
                        this._oUIModel.setProperty("/items", oData.value);

             
                        var totalItems = oData["odata.count"];
                     
                        var totalPages = Pagination.getTotalPages(totalItems, pageSize);

                        this._oUIModel.setProperty("/pagination/totalItems", totalItems);
                        this._oUIModel.setProperty("/pagination/totalPages", totalPages);

                        this.loadPageData(pageNumber);
                    } else {
                        MessageToast.show("No data received from the Service Layer.");
                    }
                }.bind(this),
                function (oError) {
                    MessageToast.show("Failed to fetch data from Service Layer.");
                    console.error("Error fetching items:", oError);
                }
            );
        },

        loadPageData: function(pageNumber) {
            var allData = this._oUIModel.getProperty("/items");
            if (!allData) {
                console.error("No data available to paginate");
                return;
            }
        
            var pageSize = this._oUIModel.getProperty("/pagination/pageSize");
            var totalItems = this._oUIModel.getProperty("/pagination/totalItems");
        
            var paginationRange = Pagination.paginate(allData, pageSize, pageNumber);
            var startIndex = paginationRange.startIndex;
            var endIndex = paginationRange.endIndex;
        
            var pageData = allData.slice(startIndex, endIndex);
        
            this._oUIModel.setProperty("/currentItems", pageData);
        
            var paginationInfo = Pagination.getPaginationInfo(totalItems, pageSize, pageNumber);
            this._oUIModel.setProperty("/pagination", paginationInfo);
        },
        

        onNextPage: function() {
            var currentPage = this._oUIModel.getProperty("/pagination/currentPage");
            var totalPages = this._oUIModel.getProperty("/pagination/totalPages");
            
            if (currentPage < totalPages) {
                currentPage++;
                this.loadItems(currentPage);
            }
        },
        
        onPreviousPage: function() {
            var currentPage = this._oUIModel.getProperty("/pagination/currentPage");
            
            if (currentPage > 1) {
                currentPage--;
                this.loadItems(currentPage);
            }
        },

        onFirstPage: function () {
            this.loadItems(1);
        },

        onLastPage: function () {
            var totalPages = this._oUIModel.getProperty("/pagination/totalPages");
            this.loadItems(totalPages);
        },

        onSearch: function (oEvent) {
            var sSearchValue = oEvent.getParameter("query");
            if (sSearchValue) {
                ItemModel.searchItems(
                    sSearchValue,
                    function (oData) {
                        if (oData && oData.value) {
                            this._oUIModel.setProperty("/items", oData.value);

                            var totalItems = oData.value.length;
                            var pageSize = this._oUIModel.getProperty("/pagination/pageSize");
                            var totalPages = Pagination.getTotalPages(totalItems, pageSize);

                            this._oUIModel.setProperty("/pagination/totalItems", totalItems);
                            this._oUIModel.setProperty("/pagination/totalPages", totalPages);

                            this.loadPageData(1);
                        } else {
                            MessageToast.show("No data received from the Service Layer.");
                        }
                    }.bind(this),
                    function (oError) {
                        MessageToast.show("Failed to fetch data from Service Layer.");
                        console.error("Error fetching items:", oError);
                    }
                );
            }
        },

        onAddPress: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("itemForm", {
                mode: "Create",
                item: "new"
            });
        },

        onViewPress: function (oEvent) {
            var sItemCode = oEvent.getSource().getParent().getBindingContext("ui").getProperty("ItemCode");
            this._navigateToForm(sItemCode, "View");
        },
        
        onEditPress: function (oEvent) {
            var sItemCode = oEvent.getSource().getParent().getBindingContext("ui").getProperty("ItemCode");
            this._navigateToForm(sItemCode, "Update");
        },
        
        _navigateToForm: function (sItemCode, sMode) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("itemForm", {
                mode: sMode,
                item: sItemCode
            });
        },
        
        

        onDeletePress: function (oEvent) {
            var oSelectedItem = oEvent.getSource().getParent().getBindingContext("ui").getObject();
            this._sSelectedItemCode = oSelectedItem.ItemCode;

            if (!this._oDeleteDialog) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "ui5.walkthrough.view.DeleteConfirmationDialog",
                    controller: this
                }).then(function (oDialog) {
                    this._oDeleteDialog = oDialog;
                    this.getView().addDependent(this._oDeleteDialog);
                    this._oDeleteDialog.open();
                }.bind(this));
            } else {
                this._oDeleteDialog.open();
            }
        },

        onDeleteConfirmed: function () {
            var sItemCode = this._sSelectedItemCode;
            if (!sItemCode) {
                sap.m.MessageToast.show("No item selected to delete.");
                return;
            }

            ItemModel.deleteItem(sItemCode, function () {
                sap.m.MessageToast.show("Item deleted successfully.");
                this._updateModelAfterDeletion(sItemCode);
                this._oDeleteDialog.close();
            }.bind(this), function () {
                sap.m.MessageToast.show("Failed to delete item.");
            });
        },

        onCloseDeleteDialog: function () {
            this._oDeleteDialog.close();
        },

        _updateModelAfterDeletion: function (sItemCode) {
            var oModel = this.getView().getModel("ui");
            var aItems = oModel.getProperty("/items");
            var iIndex = aItems.findIndex(item => item.ItemCode === sItemCode);
            if (iIndex !== -1) {
                aItems.splice(iIndex, 1);
                oModel.setProperty("/items", aItems);
                var iTotalItems = oModel.getProperty("/pagination/totalItems");
                oModel.setProperty("/pagination/totalItems", iTotalItems - 1);
                this._updatePagination();
            }
        },

        _updatePagination: function () {
            var oModel = this.getView().getModel("ui");
            var iTotalItems = oModel.getProperty("/pagination/totalItems");
            var iPageSize = oModel.getProperty("/pagination/pageSize");
            var iCurrentPage = oModel.getProperty("/pagination/currentPage");
            var oPaginationInfo = Pagination.getPaginationInfo(iTotalItems, iPageSize, iCurrentPage);
            oModel.setProperty("/pagination", oPaginationInfo);

            this.loadPageData(iCurrentPage);
        }

    });
});