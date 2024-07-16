
sap.ui.define([
    "ui5/walkthrough/utils/HttpService",
], function (HttpService) {
    "use strict";

    return {

        fetchEmployees: function (params, onSuccess, onError) {

            let queryString = Object.keys(params)
                .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
                .join("&");

            const url = HttpService.getUrl(`EmployeesInfo?${queryString}`);

            HttpService.callApi(url, "GET", null, onSuccess, onError);
        },

        getEmployeeByEmployeeId: function (sEmployeeId, onSuccess, onError) {
            const url = HttpService.getUrl(`EmployeesInfo(${sEmployeeId})`);
            HttpService.callApi(url, "GET", null, onSuccess, onError);
        },


        
        searchEmployees: function (sSearchValue, onSuccess, onError) {

            const oParams = {
                $filter: `contains(FirstName, '${sSearchValue}') or contains(LastName, '${sSearchValue}')`,
                $count: true
            };

            let queryString = Object.keys(oParams)
                .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(oParams[key])}`)
                .join("&");

            const url = HttpService.getUrl(`EmployeesInfo?${queryString}`);
            HttpService.callApi(url, "GET", null, onSuccess, onError);
        }

        
        // addItem: function(oItemData) {
        //     return HttpService.callApi(HttpService.getUrl("Items"), "POST", oItemData);
        // },

        // updateItem: function(sItemCode, oItemData) {
        //     return HttpService.callApi(HttpService.getUrl("Items('" + sItemCode + "')"), "PATCH", oItemData);
        // },

        // deleteItem: function (sItemCode, onSuccess, onError) {
        //     HttpService.callApi(HttpService.getUrl("Items('" + sItemCode + "')"), "DELETE", null, onSuccess, onError);
        // }
    };
});
