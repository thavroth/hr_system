sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (JSONModel, MessageToast) {
    "use strict";

    return {

        createModel: function () {
            return new JSONModel();
        },

        loadData: function (oModel) {
            oModel.loadData("https://jsonplaceholder.typicode.com/posts");
        },

        getPostById: function (iId, fnSuccess, fnError) {
            var sUrl = "https://jsonplaceholder.typicode.com/posts/" + iId;
            var oDataModel = new JSONModel();
            oDataModel.loadData(sUrl, null, true, "GET", false, false, {
                "Accept": "application/json"
            });

            oDataModel.attachRequestCompleted(function (oEvent) {
                if (oEvent.getParameter("success")) {
                    if (fnSuccess) {
                        fnSuccess(oDataModel.getData());
                    }
                } else if (fnError) {
                    fnError(oEvent);
                }
            });

            oDataModel.attachRequestFailed(fnError);
        },

        createPost: function (oPostData, fnSuccess, fnError) {
            $.ajax({
                url: "https://jsonplaceholder.typicode.com/posts",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify(oPostData),
                success: function (data) {
                    if (fnSuccess) {
                        fnSuccess(data);
                     
                    }
                    MessageToast.show("Post created successfully");
                },
                error: fnError
            });
        },

        updatePost: function (iId, oPostData, fnSuccess, fnError) {
            $.ajax({
                url: "https://jsonplaceholder.typicode.com/posts/" + iId,
                method: "PUT",
                contentType: "application/json",
                data: JSON.stringify(oPostData),
                success: function (data) {
                    if (fnSuccess) {
                        fnSuccess(data);
                    }
                    MessageToast.show("Post updated successfully");
                },
                error: fnError
            });
        },

        deletePost: function (iId, fnSuccess, fnError) {
            $.ajax({
                url: "https://jsonplaceholder.typicode.com/posts/" + iId,
                method: "DELETE",
                success: function () {
                    if (fnSuccess) {
                        fnSuccess();
                    }
                    MessageToast.show("Post deleted successfully");
                },
                error: fnError
            });
        },

        getPostById: function (iId, fnSuccess, fnError) {
            var sUrl = "https://jsonplaceholder.typicode.com/posts/" + iId;
            var oDataModel = new JSONModel();
            oDataModel.loadData(sUrl, null, true, "GET", false, false, {
                "Accept": "application/json"
            });

            oDataModel.attachRequestCompleted(function (oEvent) {
                if (oEvent.getParameter("success")) {
                    if (fnSuccess) {
                        fnSuccess(oDataModel.getData());
                    }
                } else if (fnError) {
                    fnError(oEvent);
                }
            });

            oDataModel.attachRequestFailed(fnError);
        },


    };
});





