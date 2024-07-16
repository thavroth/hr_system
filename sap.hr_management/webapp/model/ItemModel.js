// ItemModel.js
sap.ui.define([
    "ui5/walkthrough/utils/HttpService",
], function (HttpService) {
    "use strict";

    return {

        fetchItems: function (params, onSuccess, onError) {

            let queryString = Object.keys(params)
                .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
                .join("&");

            const url = HttpService.getUrl(`Items?${queryString}`);

            HttpService.callApi(url, "GET", null, onSuccess, onError);
        },

        getItemByItemCode: function (sItemCode, onSuccess, onError) {
            const url = HttpService.getUrl(`Items('${sItemCode}')`);
            HttpService.callApi(url, "GET", null, onSuccess, onError);
        },


        searchItems: function (sSearchValue, onSuccess, onError) {
            HttpService.callApi(HttpService.getUrl("Items?$filter=ItemCode eq '" + sSearchValue + "'"), "GET", null, onSuccess, onError);
        },


        addItem: function(oItemData) {
            return HttpService.callApi(HttpService.getUrl("Items"), "POST", oItemData);
        },

        updateItem: function(sItemCode, oItemData) {
            return HttpService.callApi(HttpService.getUrl("Items('" + sItemCode + "')"), "PATCH", oItemData);
        },

        deleteItem: function (sItemCode, onSuccess, onError) {
            HttpService.callApi(HttpService.getUrl("Items('" + sItemCode + "')"), "DELETE", null, onSuccess, onError);
        }
    };
});
