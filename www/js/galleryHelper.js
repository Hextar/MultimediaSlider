(function () {
    'use strict';

    angular
        .module('angular-multimediaslider')
        .service('ionGalleryHelper', ionGalleryHelper);

    ionGalleryHelper.$inject = ['ionGalleryConfig', '$sce'];

    function ionGalleryHelper(ionGalleryConfig, $sce) {

        var YTB_VIDEO_PREPEND = "https://www.youtube.com/embed/";
        var YTB_VIDEO_POSTPEND = "?enablejsapi=1&amp;rel=0&amp;showinfo=0&amp;controls=0";
        var YTB_VIDEO_THUMB_PREPEND = "http://img.youtube.com/vi/";
        var YTB_VIDEO_THUMB_POSTPEND = "/0.jpg";
        var UID_PREPEND = "youtube-embed-uid-";
        var TYPE_IMAGE = "image";
        var TYPE_VIDEO = "video";
        var TYPE_NULL = "NOT_SET";
        var uidCounter = 1;

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

            for (var i = 0; i < items.length; i++) {

                if (i % rowSize === 0) {
                    row++;
                    _gallery[row] = [];
                    col = 0;
                }

                // url dell'immagine
                if ((!items[i].hasOwnProperty('type')) || (!items[i].hasOwnProperty('mediaURI'))) {
                    items[i].src = TYPE_NULL;
                } else if(items[i].type == TYPE_IMAGE) {

                    items[i].src = items[i].mediaURI;

                    // immagine per la gallery
                    if (!items[i].hasOwnProperty('thumb')) {
                        items[i].thumb = items[i].src;
                    }

                } else if(items[i].type == TYPE_VIDEO) {

                    var temp = YTB_VIDEO_PREPEND+items[i].mediaURI+YTB_VIDEO_POSTPEND;
                    items[i].video = $sce.trustAsResourceUrl(temp);

                    // proprietà video playing = Boolean
                    if (!items[i].hasOwnProperty('playing') && items[i].video != '') {
                        items[i].playing = false;
                    }
                    // proprietà video id dell'iframe
                    if (!items[i].hasOwnProperty('uid') && items[i].video != '') {
                        items[i].uid = UID_PREPEND + uidCounter++;
                    }

                    if (!items[i].hasOwnProperty('thumb') && items[i].video != '') {
                        items[i].thumb = YTB_VIDEO_THUMB_PREPEND + items[i].mediaURI + YTB_VIDEO_THUMB_POSTPEND;
                    }

                }

                // sottotitolo dell'elemento multimediale
                if (!items[i].hasOwnProperty('name')) {
                    items[i].name = '';
                }

                items[i].position = i;

                _gallery[row][col] = items[i];
                col++;
            }

            return _gallery;
        };
    }

})();
