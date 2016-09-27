/*** **************** ***/
/*** gallery.js ***** ***/
/*** **************** ***/
(function () {
    'use strict';

    angular
        .module('angular-multimediaslider', ['templates'])
        .provider('ionGalleryConfig', ionGalleryConfig);

    ionGalleryConfig.$inject = [];

    function ionGalleryConfig() {
        this.config = {
            action_label: 'Close',
            toggle: true,
            row_size: 3,
            fixed_row_size: true
        };

        this.$get = function () {
            return this.config;
        };

        this.setGalleryConfig = function (config) {
            angular.extend(this.config, this.config, config);
        };
    }

})();


/*** **************** ***/
/*** galleryConfig.js ***/
/*** **************** ***/
(function () {
    'use strict';

    angular
        .module('angular-multimediaslider')
        .provider('ionGalleryConfig', ionGalleryConfig);

    ionGalleryConfig.$inject = [];

    function ionGalleryConfig() {
        this.config = {
            action_label: 'Close',
            toggle: true,
            row_size: 3,
            fixed_row_size: true
        };

        this.$get = function () {
            return this.config;
        };

        this.setGalleryConfig = function (config) {
            angular.extend(this.config, this.config, config);
        };
    }

})();


/*** **************** ***/
/*** galleryHelper.js ***/
/*** **************** ***/
(function () {
    'use strict';

    angular
        .module('angular-multimediaslider')
        .service('ionGalleryHelper', ionGalleryHelper);
//posa
    ionGalleryHelper.$inject = ['ionGalleryConfig', '$sce'];

    function ionGalleryHelper(ionGalleryConfig, $sce) {

        var YTB_VIDEO_PREPEND = "https://www.youtube.com/embed/";
        var YTB_VIDEO_POSTPEND = "?enablejsapi=1&amp;rel=0&amp;showinfo=0&amp;wmode=transparent";
        var UID_PREPEND = "youtube-embed-uid-";
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
                } else if (items[i].video != '') {
                    items[i].uid = UID_PREPEND+items[i].uid;
                } else {
                    items[i].uid = '';
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


/*** ************* ***/
/*** imageScale.js ***/
/*** ************* ***/
(function () {
    'use strict';

    angular
        .module('angular-multimediaslider')
        .directive('ionImageScale', ionImageScale);

    ionImageScale.$inject = [];

    function ionImageScale() {

        return {
            restrict: 'A',
            link: link
        };

        function link(scope, element, attrs) {

            var scaleImage = function (context, value) {
                if (value > 0) {
                    if (context.naturalHeight >= context.naturalWidth) {
                        element.attr('width', '100%');
                    }
                    else {
                        element.attr('height', element.parent()[0].offsetHeight + 'px');
                    }
                }
            };

            element.bind("load", function (e) {
                var _this = this;
                if (element.parent()[0].offsetHeight > 0) {
                    scaleImage(this, element.parent()[0].offsetHeight);
                }

                scope.$watch(function () {
                    return element.parent()[0].offsetHeight;
                }, function (newValue) {
                    scaleImage(_this, newValue);
                });
            });
        }
    }
})();


/*** ************ ***/
/*** rowHeight.js ***/
/*** ************ ***/
(function () {
    'use strict';

    angular
        .module('angular-multimediaslider')
        .directive('ionRowHeight', ionRowHeight);

    ionRowHeight.$inject = ['ionGalleryConfig'];

    function ionRowHeight(ionGalleryConfig) {

        return {
            restrict: 'A',
            link: link
        };

        function link(scope, element, attrs) {
            scope.$watch(
                function () {
                    return scope.ionGalleryRowSize;
                },
                function (newValue, oldValue) {
                    if (newValue > 0) {
                        element.css('height', element[0].offsetWidth * parseInt(scope.responsiveGrid) / 100 + 'px');
                    }
                });
        }
    }
})();


/*** ************** ***/
/*** slideAction.js ***/
/*** ************** ***/
(function () {
    'use strict';

    angular
        .module('angular-multimediaslider')
        .directive('ionSlideAction', ionSlideAction);

    ionSlideAction.$inject = ['$ionicGesture', '$timeout'];

    function ionSlideAction($ionicGesture, $timeout) {

        return {
            restrict: 'A',
            link: link
        };

        function link(scope, element, attrs) {

            var isDoubleTapAction = false;

            var pinchZoom = function pinchZoom() {
                scope.$emit('ZoomStarted');
            };

            var imageDoubleTapGesture = function imageDoubleTapGesture(event) {

                isDoubleTapAction = true;

                $timeout(function () {
                    isDoubleTapAction = false;
                    scope.$emit('DoubleTapEvent', {
                        'x': event.gesture.touches[0].pageX,
                        'y': event.gesture.touches[0].pageY
                    });
                }, 200);
            };

            var imageTapGesture = function imageTapGesture(event) {

                if (isDoubleTapAction === true) {
                    return;
                }
                else {
                    $timeout(function () {
                        if (isDoubleTapAction === true) {
                            return;
                        }
                        else {
                            scope.$emit('TapEvent');
                        }
                    }, 200);
                }
            };

            var pinchEvent = $ionicGesture.on('pinch', pinchZoom, element);
            var doubleTapEvent = $ionicGesture.on('doubletap', function (e) {
                imageDoubleTapGesture(e);
            }, element);
            var tapEvent = $ionicGesture.on('tap', imageTapGesture, element);

            scope.$on('$destroy', function () {
                $ionicGesture.off(doubleTapEvent, 'doubletap', imageDoubleTapGesture);
                $ionicGesture.off(tapEvent, 'tap', imageTapGesture);
                $ionicGesture.off(pinchEvent, 'pinch', pinchZoom);
            });
        }
    }
})();


/*** ********* ***/
/*** slider.js ***/
/*** ********* ***/
(function () {
    'use strict';

    angular
        .module('angular-multimediaslider')
        .directive('ionSlider', ionSlider);

    ionSlider.$inject = ['$ionicModal', 'ionGalleryHelper', '$ionicPlatform', '$timeout', '$ionicScrollDelegate'];

    var AUTO_START= false;
    var AUTO_STOP= true;
    var AUTO_DESTROY= false;

    function ionSlider($ionicModal, ionGalleryHelper, $ionicPlatform, $timeout, $ionicScrollDelegate) {

        return {
            restrict: 'EA',
            controller: controller,
            link: link
        };

        function controller($scope) {

            var lastSlideIndex;
            var currentImage;
            var imageToLoad;
            var galleryLength = 0;

            var zoomStart = false;


            $scope.startVideo = function (index) {
                if(AUTO_START) {
                    var uid = $scope.ionGalleryItems[index].uid;
                    if (uid != '') {
                        console.debug("ATTEMPTING TO START " + uid + " video");
                        callPlayer(uid, "playVideo");
                    }
                }
            }

            $scope.stopVideo = function () {
                if (AUTO_STOP) {
                    angular.forEach($scope.slides, function (media, key) {
                        if(media.uid != '') {
                            console.debug("ATTEMPTING TO STOP " + media.uid + " video");
                            callPlayer(media.uid, "stopVideo");
                        }
                    });
                }
            }

            $scope.destroyPlayers = function () {
                if (AUTO_DESTROY) {
                    angular.forEach($scope.slides, function (player, key) {
                        if(player.uid != '') {
                            callPlayer(player.uid, "destroy");
                        }
                    });
                }
            }

            $scope.selectedSlide = 1;
            $scope.hideAll = false;

            $scope.showImage = function (index) {
                $scope.slides = [];

                currentImage = index;

                galleryLength = $scope.ionGalleryItems.length;

                var previndex = index - 1 < 0 ? galleryLength - 1 : index - 1;
                var nextindex = index + 1 >= galleryLength ? 0 : index + 1;

                $scope.slides[0] = $scope.ionGalleryItems[previndex];
                $scope.slides[1] = $scope.ionGalleryItems[index];
                $scope.slides[2] = $scope.ionGalleryItems[nextindex];

                lastSlideIndex = 1;
                imageToLoad = 1;
                $scope.loadModal();

                $scope.startVideo(index);
            };

            $scope.slideChanged = function (currentSlideIndex) {

                if (currentSlideIndex === lastSlideIndex) {
                    return;
                }

                var slideToLoad = $scope.slides.length - lastSlideIndex - currentSlideIndex;
                var videoToLoad;
                var slidePosition = lastSlideIndex + '>' + currentSlideIndex;

                if (slidePosition === '0>1' || slidePosition === '1>2' || slidePosition === '2>0') {
                    currentImage++;

                    if (currentImage >= galleryLength) {
                        currentImage = 0;
                    }

                    imageToLoad = currentImage + 1;

                    if (imageToLoad >= galleryLength) {
                        imageToLoad = 0;
                    }
                }
                else if (slidePosition === '0>2' || slidePosition === '1>0' || slidePosition === '2>1') {
                    currentImage--;

                    if (currentImage < 0) {
                        currentImage = galleryLength - 1;
                    }

                    imageToLoad = currentImage - 1;

                    if (imageToLoad < 0) {
                        imageToLoad = galleryLength - 1;
                    }
                }

                //Clear zoom
                $ionicScrollDelegate.$getByHandle('slide-' + slideToLoad).zoomTo(1);

                $scope.slides[slideToLoad] = $scope.ionGalleryItems[imageToLoad];

                videoToLoad = imageToLoad - 1 < 0 ? galleryLength - 1 : imageToLoad - 1;

                $scope.stopVideo(videoToLoad);
                $scope.startVideo(videoToLoad);

                lastSlideIndex = currentSlideIndex;

            };

            $scope.$on('ZoomStarted', function (e) {
                $timeout(function () {
                    zoomStart = true;
                    $scope.hideAll = true;
                });

            });

            $scope.$on('TapEvent', function (e) {
                $timeout(function () {
                    _onTap();
                });

            });

            $scope.$on('DoubleTapEvent', function (event, position) {
                $timeout(function () {
                    var index = imageToLoad % $scope.slides.length;
                    //console.debug($scope.slides[index]);
                    if($scope.slides[index].video == '') {
                        _onDoubleTap(position);
                    }
                });

            });

            var _onTap = function _onTap() {

                if (zoomStart === true) {
                    $ionicScrollDelegate.$getByHandle('slide-' + lastSlideIndex).zoomTo(1, true);

                    $timeout(function () {
                        _isOriginalSize();
                    }, 300);

                    return;
                }

                if (($scope.hasOwnProperty('ionSliderToggle') && $scope.ionSliderToggle === false && $scope.hideAll === false) || zoomStart === true) {
                    return;
                }

                $scope.hideAll = !$scope.hideAll;
            };

            var _onDoubleTap = function _onDoubleTap(position) {
                if (zoomStart === false) {
                    $ionicScrollDelegate.$getByHandle('slide-' + lastSlideIndex).zoomTo(3, true, position.x, position.y);
                    zoomStart = true;
                    $scope.hideAll = true;
                }
                else {
                    _onTap();
                }
            };

            function _isOriginalSize() {
                zoomStart = false;
                _onTap();
            }

        }

        function link(scope, element, attrs) {
            var _modal;

            scope.loadModal = function () {
                $ionicModal.fromTemplateUrl('templates/slider.html', {
                    scope: scope,
                    animation: 'fade-in'
                }).then(function (modal) {
                    _modal = modal;
                    scope.openModal();
                });
            };

            scope.openModal = function () {
                _modal.show();
            };

            scope.closeModal = function () {
                scope.stopVideo();
                _modal.hide();
            };

            scope.$on('$destroy', function () {
                try {
                    scope.destroyPlayers();
                    _modal.remove();
                } catch (err) {
                    console.log(err.message);
                }
            });
        }
    }
})();


angular.module("templates", []).run(["$templateCache", function ($templateCache) {
    $templateCache.put("templates/gallery.html", "<div class=\"gallery-view\"> <div class=\"row\" ng-repeat=\"item in items track by $index\" ion-row-height> <div ng-repeat=\"photo in item track by $index\" class=\"col col-{{responsiveGrid}}image-container\"> <img ion-image-scale ng-src=\"{{photo.thumb}}\" ng-click=\"customCallback ? ionItemCallback({item:photo}) : showImage(photo.position)\"> <i class=\"icon ion-play\" ng-if=\"photo.video!=''\"></i> </div></div><div ion-slider></div></div>");
    $templateCache.put("templates/slider.html", "<ion-modal-view class=\"imageView\"> <ion-header-bar class=\"headerView\" ng-show=\"!hideAll\"> <button class=\"button button-outline button-light close-btn\" ng-click=\"closeModal()\">{{::actionLabel}}</button> </ion-header-bar> <ion-content class=\"has-no-header\" scroll=\"false\"> <ion-slide-box does-continue=\"true\" active-slide=\"selectedSlide\" show-pager=\"false\" class=\"listContainer\" on-slide-changed=\"slideChanged($index)\"> <ion-slide ng-repeat=\"single in slides track by $index\"> <ion-scroll direction=\"x\" locking=\"false\" zooming=\"true\" min-zoom=\"1\" scrollbar-x=\"false\" scrollbar-y=\"false\" ion-slide-action delegate-handle=\"slide-{{$index}}\" overflow-scroll=\"false\" > <div class=\"item item-image gallery-slide-view\"> <img ng-src=\"{{single.src}}\" ng-show=\"single.src!=''\"> <div class=\"embed-responsive embed-responsive-16by9\" ng-if=\"single.video!=''\"> <iframe id=\"{{single.uid}}\" class=\"embed-responsive-item\" src={{single.video}} frameborder=\"0\" allowfullscreen></iframe> </div></div><div ng-if=\"single.sub.length > 0\" style=\"width: 100%; left: 0\" class=\"text-center image-subtitle\" ng-show=\"!hideAll\"> <span style=\"margin: 0 auto\" ng-bind-html='single.sub'></span> </div></ion-scroll> </ion-slide> </ion-slide-box> </ion-content></ion-modal-view>");
}]);


/**
 * @author       Rob W <gwnRob@gmail.com>
 * @website      http://stackoverflow.com/a/7513356/938089
 * @version      20131010
 * @description  Executes function on a framed YouTube video (see website link)
 *               For a full list of possible functions, see:
 *               https://developers.google.com/youtube/js_api_reference
 * @param String frame_id The id of (the div containing) the frame
 * @param String func     Desired function to call, eg. "playVideo"
 *        (Function)      Function to call when the player is ready.
 * @param Array  args     (optional) List of arguments to pass to function func*/
function callPlayer(frame_id, func, args) {

    if (window.jQuery && frame_id instanceof jQuery) frame_id = frame_id.get(0).id;
    var iframe = document.getElementById(frame_id);

    if (iframe && iframe.tagName.toUpperCase() != 'IFRAME') {
        iframe = iframe.getElementsByTagName('iframe')[0];
    }

    // When the player is not ready yet, add the event to a queue
    // Each frame_id is associated with an own queue.
    // Each queue has three possible states:
    //  undefined = uninitialised / array = queue / 0 = ready
    if (!callPlayer.queue) callPlayer.queue = {};
    var queue = callPlayer.queue[frame_id],
        domReady = document.readyState == 'complete';

    if (domReady && !iframe) {
        // DOM is ready and iframe does not exist. Log a message
        window.console && console.log('callPlayer: Frame not found; id=' + frame_id);
        if (queue) clearInterval(queue.poller);
    } else if (func === 'listening') {
        // Sending the "listener" message to the frame, to request status updates
        if (iframe && iframe.contentWindow) {
            func = '{"event":"listening","id":' + JSON.stringify('' + frame_id) + '}';
            iframe.contentWindow.postMessage(func, '*');
        }
    } else if (!domReady ||
        iframe && (!iframe.contentWindow || queue && !queue.ready) ||
        (!queue || !queue.ready) && typeof func === 'function') {
        if (!queue) queue = callPlayer.queue[frame_id] = [];
        queue.push([func, args]);
        if (!('poller' in queue)) {
            // keep polling until the document and frame is ready
            queue.poller = setInterval(function () {
                callPlayer(frame_id, 'listening');
            }, 250);
            // Add a global "message" event listener, to catch status updates:
            messageEvent(1, function runOnceReady(e) {
                if (!iframe) {
                    iframe = document.getElementById(frame_id);
                    if (!iframe) return;
                    if (iframe.tagName.toUpperCase() != 'IFRAME') {
                        iframe = iframe.getElementsByTagName('iframe')[0];
                        if (!iframe) return;
                    }
                }
                if (e.source === iframe.contentWindow) {
                    // Assume that the player is ready if we receive a
                    // message from the iframe
                    clearInterval(queue.poller);
                    queue.ready = true;
                    messageEvent(0, runOnceReady);
                    // .. and release the queue:
                    while (tmp = queue.shift()) {
                        callPlayer(frame_id, tmp[0], tmp[1]);
                    }
                }
            }, false);
        }
    } else if (iframe && iframe.contentWindow) {
        // When a function is supplied, just call it (like "onYouTubePlayerReady")
        if (func.call) return func();
        // Frame exists, send message
        iframe.contentWindow.postMessage(JSON.stringify({
            "event": "command",
            "func": func,
            "args": args || [],
            "id": frame_id
        }), "*");
    }
    /* IE8 does not support addEventListener... */
    function messageEvent(add, listener) {
        var w3 = add ? window.addEventListener : window.removeEventListener;
        w3 ?
            w3('message', listener, !1)
            :
            (add ? window.attachEvent : window.detachEvent)('onmessage', listener);
    }
}

