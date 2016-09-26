(function () {
    'use strict';

    angular
        .module('angular-multimediaslider')
        .service('ionGalleryHelper', ionGalleryHelper);

    ionGalleryHelper.$inject = ['ionGalleryConfig', '$sce'];

    function ionGalleryHelper(ionGalleryConfig, $sce) {

        var YTB_VIDEO_PREPEND  = "https://www.youtube.com/embed/";
        var YTB_VIDEO_POSTPEND  = "?enablejsapi=1";

        this.getRowSize = function (size, length) {
            var rowSize;

            if (isNaN(size) === true || size <= 0) {
                rowSize = ionGalleryConfig.row_size;
            }
            else if (size > length && !ionGalleryConfig.fixed_row_size) {
                rowSize = length;
            }
            else {
                rowSize = size;
            }

            return rowSize;

        };

        this.buildGallery = function (items, rowSize) {
            var _gallery = [];
            var row = -1;
            var col = 0;

            var UID_PREPEND = "youtube-embed-uid-";
            var uidCounter = 1;

            for (var i = 0; i < items.length; i++) {

                if (i % rowSize === 0) {
                    row++;
                    _gallery[row] = [];
                    col = 0;
                }

                if (!items[i].hasOwnProperty('src')) {
                    items[i].src = '';
                }

                if (!items[i].hasOwnProperty('video')) {
                    items[i].video = '';
                } else {
                    var temp = YTB_VIDEO_PREPEND+items[i].video+YTB_VIDEO_POSTPEND;
                    items[i].video = $sce.trustAsResourceUrl(temp);
                }

                if (!items[i].hasOwnProperty('uid') && items[i].video != '') {
                    items[i].uid = UID_PREPEND+uidCounter++;
                }

                if (!items[i].hasOwnProperty('sub')) {
                    items[i].sub = '';
                }

                if (!items[i].hasOwnProperty('thumb')) {
                    items[i].thumb = items[i].src;
                }

                items[i].position = i;

                _gallery[row][col] = items[i];
                col++;
            }

            return _gallery;
        };
    }

})();
