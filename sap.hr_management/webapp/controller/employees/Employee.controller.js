sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "ui5/walkthrough/model/EmployeeModel",
    "ui5/walkthrough/utils/Pagination",
    "sap/ui/thirdparty/jquery",
    "sap/ui/core/Fragment",
    "sap/ui/core/UIComponent"
], function (Controller, JSONModel, MessageToast, EmployeeModel, Pagination, jQuery, Fragment, UIComponent) {
    "use strict";

    return Controller.extend("ui5.walkthrough.controller.employees.Employee", {
     
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
                employees: [],
                currentEmployees: [],
                allEmployees: [] 
            });
            this.getView().setModel(this._oUIModel, "ui");

            this.loadItems(1);
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

            EmployeeModel.fetchEmployees(
                oParams,
                function (oData) {
                    if (oData && oData.value) {
                        this._oUIModel.setProperty("/employees", oData.value);
             
                        var totalItems = oData["odata.count"];
                     
                        var totalPages = Pagination.getTotalPages(totalItems, pageSize);

                        this._oUIModel.setProperty("/pagination/totalEmployees", totalItems);
                        this._oUIModel.setProperty("/pagination/totalPages", totalPages);

                        this.loadPageData(pageNumber);
                    } else {
                        MessageToast.show("No data received from the Service Layer.");
                    }
                }.bind(this),
                function (oError) {
                    MessageToast.show("Failed to fetch data from Service Layer.");
              
                }
            );
        },

        loadPageData: function(pageNumber) {
            var allData = this._oUIModel.getProperty("/employees");
            if (!allData) {
                console.error("No data available to paginate");
                return;
            }
        
            var pageSize = this._oUIModel.getProperty("/pagination/pageSize");
            var totalItems = this._oUIModel.getProperty("/pagination/totalEmployees");
        
            var paginationRange = Pagination.paginate(allData, pageSize, pageNumber);
            var startIndex = paginationRange.startIndex;
            var endIndex = paginationRange.endIndex;
        
            var pageData = allData.slice(startIndex, endIndex);
        
            this._oUIModel.setProperty("/currentEmployees", pageData);
        
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
            this._searchAndLoadData(sSearchValue);
        },

        onSearchLive: function (oEvent) {
            var sSearchValue = oEvent.getParameter("newValue");
            this._searchAndLoadData(sSearchValue);
        },

        onSearchButtonPress: function () {
            var sSearchValue = this.byId("searchField").getValue();
            this._searchAndLoadData(sSearchValue);
        },
        

        _searchAndLoadData: function (sSearchValue) {
            if (sSearchValue) {
                EmployeeModel.searchEmployees(
                    sSearchValue,
                    function (oData) {
                        if (oData && oData.value) {
                            this._oUIModel.setProperty("/employees", oData.value);

                            var totalItems = oData.value.length;
                            var pageSize = this._oUIModel.getProperty("/pagination/pageSize");
                            var totalPages = Pagination.getTotalPages(totalItems, pageSize);

                            this._oUIModel.setProperty("/pagination/totalEmployees", totalItems);
                            this._oUIModel.setProperty("/pagination/totalPages", totalPages);

                            this.loadPageData(1);
                        } else {
                            MessageToast.show("No data received from the Service Layer.");
                        }
                    }.bind(this),
                    function (oError) {
                        MessageToast.show("Failed to fetch data from Service Layer.");
                    }
                );
            } else {
                this.loadItems(1);
            }
        },


        onNavToEmployeeProfile: function (oEvent) {
      
            var sEmployeeId = oEvent.getSource().getParent().getBindingContext("ui").getProperty("EmployeeID");
            UIComponent.getRouterFor(this).navTo("employeeProfile", {
                employeeId: sEmployeeId
            });
        },

        _updatePagination: function () {
            var oModel = this.getView().getModel("ui");
            var iTotalItems = oModel.getProperty("/pagination/totalEmployees");
            var iPageSize = oModel.getProperty("/pagination/pageSize");
            var iCurrentPage = oModel.getProperty("/pagination/currentPage");
            var oPaginationInfo = Pagination.getPaginationInfo(iTotalItems, iPageSize, iCurrentPage);
            oModel.setProperty("/pagination", oPaginationInfo);

            this.loadPageData(iCurrentPage);
        }

    });
});