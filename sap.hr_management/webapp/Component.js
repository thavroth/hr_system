sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
], function (UIComponent, JSONModel) {
    "use strict";
    
    return UIComponent.extend("ui5.walkthrough.Component", {
        metadata: {
            manifest: "json"
        },

        init: function() {
            this._setupAjaxErrorHandler();
         
            UIComponent.prototype.init.apply(this, arguments);
            this.getRouter().initialize();
            
        },

        _setupAjaxErrorHandler: function () {
            $(document).ajaxError((event, jqXHR) => {
                if (jqXHR.status === 401) {
                    this.getRouter().navTo("login");
                }
            });
        }
    });
});
