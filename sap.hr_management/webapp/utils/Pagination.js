sap.ui.define([], function() {
    "use strict";

    return {
        paginate: function(oData, iPageSize, iCurrentPage) {
            var iStartIndex = (iCurrentPage - 1) * iPageSize;
            var iEndIndex = iStartIndex + iPageSize;

            return oData.slice(iStartIndex, iEndIndex);
        },

        getTotalPages: function(iTotalItems, iPageSize) {
            return Math.ceil(iTotalItems / iPageSize);
        },

        getPaginationInfo: function(iTotalItems, iPageSize, iCurrentPage) {
            var iTotalPages = this.getTotalPages(iTotalItems, iPageSize);
            return {
                currentPage: iCurrentPage,
                pageSize: iPageSize,
                totalItems: iTotalItems,
                totalPages: iTotalPages,
                hasPrevious: iCurrentPage > 1,
                hasNext: iCurrentPage < iTotalPages
            };
        }
    };
});
