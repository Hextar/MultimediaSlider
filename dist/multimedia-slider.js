/*** **************** ***/
/*** gallery.js ***** ***/
/*** **************** ***/

(function () {
    'use strict';

    angular
        .module('ion-gallery', [templates])
        .directive('ionGallery', ionGallery);

    ionGallery.$inject = ['$ionicPlatform', 'ionGalleryHelper', 'ionGalleryConfig'];

    function ionGallery($ionicPlatform, ionGalleryHelper, ionGalleryConfig) {
        return {
            restrict: 'AE',
            scope: {
                ionGalleryItems: '=ionGalleryItems',
                ionGalleryRowSize: '=?ionGalleryRow',
                ionItemCallback: '&?ionItemCallback'
            },
            controller: controller,
            link: link,
            replace: true,
            templateUrl: 'templates/gallery.html'
        };

        function controller($scope) {
            var _rowSize = parseInt($scope.ionGalleryRowSize);

            var _drawGallery = function () {
                $scope.ionGalleryRowSize = ionGalleryHelper.getRowSize(_rowSize || ionGalleryConfig.row_size, $scope.ionGalleryItems.length);
                $scope.actionLabel = ionGalleryConfig.action_label;
                $scope.items = ionGalleryHelper.buildGallery($scope.ionGalleryItems, $scope.ionGalleryRowSize);
                $scope.responsiveGrid = parseInt((1 / $scope.ionGalleryRowSize) * 100);
            };

            _drawGallery();

            (function () {
                $scope.$watch(function () {
                    return $scope.ionGalleryItems.length;
                }, function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                        _drawGallery();
                    }
                });
            }());

        }

        function link(scope, element, attrs) {

            scope.customCallback = angular.isFunction(scope.ionItemCallback) && attrs.hasOwnProperty('ionItemCallback')

            scope.ionSliderToggle = attrs.ionGalleryToggle === 'false' ? false : ionGalleryConfig.toggle;
        }
    }
})();

/*** **************** ***/
/*** galleryConfig.js ***/
/*** **************** ***/
(function(){
    'use strict';

    angular
        .module('ion-gallery')
        .provider('ionGalleryConfig',ionGalleryConfig);

    ionGalleryConfig.$inject = [];

    function ionGalleryConfig(){
        this.config = {
            action_label: 'Close',
            toggle: true,
            row_size: 3,
            fixed_row_size: true
        };

        this.$get = function() {
            return this.config;
        };

        this.setGalleryConfig = function(config) {
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
        .module('ion-gallery')
        .service('ionGalleryHelper', ionGalleryHelper);

    ionGalleryHelper.$inject = ['ionGalleryConfig'];

    function ionGalleryHelper(ionGalleryConfig) {

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

                if (!items[i].hasOwnProperty('videoUid')) {
                    items[i].videoID = '';
                }

                if (!items[i].hasOwnProperty('video')) {
                    items[i].video = '';
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
(function(){
    'use strict';

    angular
        .module('ion-gallery')
        .directive('ionImageScale',ionImageScale);

    ionImageScale.$inject = [];

    function ionImageScale(){

        return {
            restrict: 'A',
            link : link
        };

        function link(scope, element, attrs) {

            var scaleImage = function(context,value) {
                if(value>0){
                    if(context.naturalHeight >= context.naturalWidth){
                        element.attr('width','100%');
                    }
                    else{
                        element.attr('height',element.parent()[0].offsetHeight+'px');
                    }
                }
            };

            element.bind("load" , function(e){
                var _this = this;
                if(element.parent()[0].offsetHeight > 0){
                    scaleImage(this,element.parent()[0].offsetHeight);
                }

                scope.$watch(function(){
                    return element.parent()[0].offsetHeight;
                },function(newValue){
                    scaleImage(_this,newValue);
                });
            });
        }
    }
})();

/*** ************ ***/
/*** rowHeight.js ***/
/*** ************ ***/
(function(){
    'use strict';

    angular
        .module('ion-gallery')
        .directive('ionRowHeight',ionRowHeight);

    ionRowHeight.$inject = ['ionGalleryConfig'];

    function ionRowHeight(ionGalleryConfig){

        return {
            restrict: 'A',
            link : link
        };

        function link(scope, element, attrs) {
            scope.$watch(
                function(){
                    return scope.ionGalleryRowSize;
                },
                function(newValue,oldValue){
                    if(newValue > 0){
                        element.css('height',element[0].offsetWidth * parseInt(scope.responsiveGrid)/100 + 'px');
                    }
                });
        }
    }
})();

/*** ************** ***/
/*** slideAction.js ***/
/*** ************** ***/
(function(){
    'use strict';

    angular
        .module('ion-gallery')
        .directive('ionSlideAction',ionSlideAction);

    ionSlideAction.$inject = ['$ionicGesture','$timeout'];

    function ionSlideAction($ionicGesture, $timeout){

        return {
            restrict: 'A',
            link : link
        };

        function link(scope, element, attrs) {

            var isDoubleTapAction = false;

            var pinchZoom = function pinchZoom(){
                scope.$emit('ZoomStarted');
            };

            var imageDoubleTapGesture = function imageDoubleTapGesture(event) {

                isDoubleTapAction = true;

                $timeout(function(){
                    isDoubleTapAction = false;
                    scope.$emit('DoubleTapEvent',{ 'x': event.gesture.touches[0].pageX, 'y': event.gesture.touches[0].pageY});
                },200);
            };

            var imageTapGesture = function imageTapGesture(event) {

                if(isDoubleTapAction === true){
                    return;
                }
                else{
                    $timeout(function(){
                        if(isDoubleTapAction === true){
                            return;
                        }
                        else{
                            scope.$emit('TapEvent');
                        }
                    },200);
                }
            };

            var pinchEvent = $ionicGesture.on('pinch',pinchZoom,element);
            var doubleTapEvent = $ionicGesture.on('doubletap', function(e){imageDoubleTapGesture(e);}, element);
            var tapEvent = $ionicGesture.on('tap', imageTapGesture, element);

            scope.$on('$destroy', function() {
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
        .module('ion-gallery')
        .directive('ionSlider', ionSlider);

    ionSlider.$inject = ['$ionicModal', 'ionGalleryHelper', '$ionicPlatform', '$timeout', '$ionicScrollDelegate'];

    var players = [];

    function ionSlider($ionicModal, ionGalleryHelper, $ionicPlatform, $timeout, $ionicScrollDelegate) {

        return {
            restrict: 'A',
            controller: controller,
            link: link
        };

        var tempPlayer = 0;

        function controller($scope) {
            var lastSlideIndex;
            var currentImage;
            var galleryLength = $scope.ionGalleryItems.length;

            var rowSize = $scope.ionGalleryRowSize;
            var zoomStart = false;

            players = Array.apply(null, new Array(galleryLength)).map(Number.prototype.valueOf, 0);

            $scope.refreshPlayers = function (index) {
                tempPlayer = index;
                $scope.$on('youtube.player.ready', function ($event, player) {
                    tempPlayer = player;
                    players[index] = tempPlayer;

                    console.debug("found player id: "+player.id);
                });
                console.debug("Player now contains: ");
                console.debug(players);
            }

            $scope.startVideo = function (index) {
                if (!players.isEmpty) {
                    console.debug("ATTEMPTING TO START " + index + "° video in: ");
                    console.debug(players[index]);
                    if (players[index] != 0) {
                        [index].playVideo();
                    }
                }
            }

            $scope.stopVideo = function (index) {
                if (!players.isEmpty) {
                    console.debug("ATTEMPTING TO STOP " + index + "° video in: ");
                    console.debug(players[index]);
                    if (players[index] != 0) {
                        players[index].stopVideo();
                    }
                }
            }

            $scope.selectedSlide = 1;
            $scope.hideAll = false;

            $scope.showImage = function (index) {
                $scope.slides = [];

                currentImage = index;

                var previndex = index - 1 < 0 ? galleryLength - 1 : index - 1;
                var nextindex = index + 1 >= galleryLength ? 0 : index + 1;

                console.debug($scope.ionGalleryItems);
                $scope.slides[0] = $scope.ionGalleryItems[previndex];
                $scope.slides[1] = $scope.ionGalleryItems[index];
                $scope.slides[2] = $scope.ionGalleryItems[nextindex];

                lastSlideIndex = 1;
                $scope.loadModal();

                console.debug("=========== "+ lastSlideIndex +" ===========");
                $scope.refreshPlayers(lastSlideIndex);
                //$scope.startVideo(lastSlideIndex);
            };

            $scope.slideChanged = function (currentSlideIndex) {

                if (currentSlideIndex === lastSlideIndex) {
                    return;
                }

                var slideToLoad = $scope.slides.length - lastSlideIndex - currentSlideIndex;
                var imageToLoad;
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

                console.debug("=========== "+ imageToLoad +" ===========");
                if($scope.ionGalleryItems[imageToLoad].hasOwnProperty('video')) {
                    $scope.refreshPlayers(imageToLoad);
                }
                $scope.stopVideo(lastSlideIndex);
                $scope.startVideo(imageToLoad);

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
                    _onDoubleTap(position);
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

            scope.closeModal = function ($scope) {
                console.debug("ATTEMPTING TO STOP all videos");
                angular.forEach(players, function (player, key) {
                    console.log(player);
                    if (player != 0) player.stopVideo();
                });
                _modal.hide();
            };

            scope.$on('$destroy', function () {
                try {
                    _modal.remove();
                } catch (err) {
                    console.log(err.message);
                }
            });
        }
    }
})();

/*** ******************** ***/
/*** youtube-directive.js ***/
/*** ******************** ***/
(function () {
    'use strict';

    angular
        .module('youtube-embed', [])
        .directive('youtubeEmbedUtils', youtubeDirective);

    youtubeDirective.$inject = ['$window', 'youtubeEmbedUtils'];

    function youtubeDirective($window, youtubeEmbedUtils) {
        var uniqId = 1;

        // from YT.PlayerState
        var stateNames = {
            '-1': 'unstarted',
            0: 'ended',
            1: 'playing',
            2: 'paused',
            3: 'buffering',
            5: 'queued'
        };

        var eventPrefix = 'youtube.player.';

        $window.YTConfig = {
            host: 'https://www.youtube.com'
        };

        return {
            restrict: 'EA',
            scope: {
                playerUid: '=?',
                videoId: '=?',
                videoUrl: '=?',
                player: '=?',
                playerVars: '=?',
                playerHeight: '=?',
                playerWidth: '=?'
            },
            link: function (scope, element, attrs) {
                // allows us to $watch `ready`
                scope.utils = youtubeEmbedUtils;

                // player-id attr > id attr > directive-generated ID
                var playerId = attrs.playerId || element[0].id || 'unique-youtube-embed-id-' + scope.playerUid;
                element[0].id = playerId;

                // Attach to element
                scope.playerHeight = scope.playerHeight || 390;
                scope.playerWidth = scope.playerWidth || 640;
                scope.playerVars = scope.playerVars || {};

                // YT calls callbacks outside of digest cycle
                function applyBroadcast() {
                    var args = Array.prototype.slice.call(arguments);
                    scope.$apply(function () {
                        scope.$emit.apply(scope, args);
                    });
                }

                function onPlayerStateChange(event) {
                    var state = stateNames[event.data];
                    if (typeof state !== 'undefined') {
                        applyBroadcast(eventPrefix + state, scope.player, event);
                    }
                    scope.$apply(function () {
                        scope.player.currentState = state;
                    });
                }

                function onPlayerReady(event) {
                    applyBroadcast(eventPrefix + 'ready', scope.player, event);
                }

                function onPlayerError(event) {
                    applyBroadcast(eventPrefix + 'error', scope.player, event);
                }

                function createPlayer() {
                    var playerVars = angular.copy(scope.playerVars);
                    playerVars.start = playerVars.start || scope.urlStartTime;
                    var player = new YT.Player(playerId, {
                        height: scope.playerHeight,
                        width: scope.playerWidth,
                        videoId: scope.videoId,
                        playerVars: playerVars,
                        events: {
                            onReady: onPlayerReady,
                            onStateChange: onPlayerStateChange,
                            onError: onPlayerError
                        }
                    });

                    //player.id = playerId;
                    return player;
                }

                function loadPlayer() {
                    if (scope.videoId || scope.playerVars.list) {
                        if (scope.player && typeof scope.player.destroy === 'function') {
                            scope.player.destroy();
                        }

                        scope.player = createPlayer();
                    }
                };

                var stopWatchingReady = scope.$watch(
                    function () {
                        return scope.utils.ready
                            // Wait until one of them is defined...
                            && (typeof scope.videoUrl !== 'undefined'
                            || typeof scope.videoId !== 'undefined'
                            || typeof scope.playerVars.list !== 'undefined');
                    },
                    function (ready) {
                        if (ready) {
                            stopWatchingReady();

                            // URL takes first priority
                            if (typeof scope.videoUrl !== 'undefined') {
                                scope.$watch('videoUrl', function (url) {
                                    scope.videoId = scope.utils.getIdFromURL(url);
                                    scope.urlStartTime = scope.utils.getTimeFromURL(url);

                                    loadPlayer();
                                });

                                // then, a video ID
                            } else if (typeof scope.videoId !== 'undefined') {
                                scope.$watch('videoId', function () {
                                    scope.urlStartTime = null;
                                    loadPlayer();
                                });

                                // finally, a list
                            } else {
                                scope.$watch('playerVars.list', function () {
                                    scope.urlStartTime = null;
                                    loadPlayer();
                                });
                            }
                        }
                    });

                scope.$watchCollection(['playerHeight', 'playerWidth'], function () {
                    if (scope.player) {
                        scope.player.setSize(scope.playerWidth, scope.playerHeight);
                    }
                });

                scope.$on('$destroy', function () {
                    scope.player && scope.player.destroy();
                });
            }
        };

    }

})();

/*** ****************** ***/
/*** youtube-service.js ***/
/*** ****************** ***/
(function () {
    'use strict';

    angular
        .module('youtube-embed', [])
        .service('youtubeEmbedUtils', youtubeEmbedService);

    youtubeEmbedService.$inject = ['$window', '$rootScope'];

    function youtubeEmbedService($window, $rootScope) {

        var Service = {}

        // adapted from http://stackoverflow.com/a/5831191/1614967
        var youtubeRegexp = /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/ig;
        var timeRegexp = /t=(\d+)[ms]?(\d+)?s?/;

        function contains(str, substr) {
            return (str.indexOf(substr) > -1);
        }

        Service.getIdFromURL = function getIdFromURL(url) {
            var id = url.replace(youtubeRegexp, '$1');

            if (contains(id, ';')) {
                var pieces = id.split(';');

                if (contains(pieces[1], '%')) {
                    // links like this:
                    // "http://www.youtube.com/attribution_link?a=pxa6goHqzaA&amp;u=%2Fwatch%3Fv%3DdPdgx30w9sU%26feature%3Dshare"
                    // have the real query string URI encoded behind a ';'.
                    // at this point, `id is 'pxa6goHqzaA;u=%2Fwatch%3Fv%3DdPdgx30w9sU%26feature%3Dshare'
                    var uriComponent = decodeURIComponent(pieces[1]);
                    id = ('http://youtube.com' + uriComponent)
                        .replace(youtubeRegexp, '$1');
                } else {
                    // https://www.youtube.com/watch?v=VbNF9X1waSc&amp;feature=youtu.be
                    // `id` looks like 'VbNF9X1waSc;feature=youtu.be' currently.
                    // strip the ';feature=youtu.be'
                    id = pieces[0];
                }
            } else if (contains(id, '#')) {
                // id might look like '93LvTKF_jW0#t=1'
                // and we want '93LvTKF_jW0'
                id = id.split('#')[0];
            }

            return id;
        };

        Service.getTimeFromURL = function getTimeFromURL(url) {
            url = url || '';

            // t=4m20s
            // returns ['t=4m20s', '4', '20']
            // t=46s
            // returns ['t=46s', '46']
            // t=46
            // returns ['t=46', '46']
            var times = url.match(timeRegexp);

            if (!times) {
                // zero seconds
                return 0;
            }

            // assume the first
            var full = times[0],
                minutes = times[1],
                seconds = times[2];

            // t=4m20s
            if (typeof seconds !== 'undefined') {
                seconds = parseInt(seconds, 10);
                minutes = parseInt(minutes, 10);

                // t=4m
            } else if (contains(full, 'm')) {
                minutes = parseInt(minutes, 10);
                seconds = 0;

                // t=4s
                // t=4
            } else {
                seconds = parseInt(minutes, 10);
                minutes = 0;
            }

            // in seconds
            return seconds + (minutes * 60);
        };

        Service.ready = false;

        function applyServiceIsReady() {
            $rootScope.$apply(function () {
                Service.ready = true;
            });
        };

        // If the library isn't here at all,
        if (typeof YT === "undefined") {
            // ...grab on to global callback, in case it's eventually loaded
            $window.onYouTubeIframeAPIReady = applyServiceIsReady;
            console.log('Unable to find YouTube iframe library on this page.')
        } else if (YT.loaded) {
            Service.ready = true;
        } else {
            YT.ready(applyServiceIsReady);
        }

        return Service;

    }

})();

angular.module("templates", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("gallery.html","<div class=\"gallery-view\"> <div class=\"row\" ng-repeat=\"item in items track by $index\" ion-row-height> <div ng-repeat=\"photo in item track by $index\" class=\"col col-{{responsiveGrid}}image-container\"> <img ion-image-scale ng-src=\"{{photo.thumb}}\" ng-click=\"customCallback ? ionItemCallback({item:photo}) : showImage(photo.position)\"> </div></div><div ion-slider></div></div>");
    $templateCache.put("slider.html","<ion-modal-view class=\"imageView\"> <ion-header-bar class=\"headerView\" ng-show=\"!hideAll\"> <button class=\"button button-outline button-light close-btn\" ng-click=\"closeModal()\">{{::actionLabel}}</button> </ion-header-bar> <ion-content class=\"has-no-header\" scroll=\"false\"> <ion-slide-box does-continue=\"true\" active-slide=\"selectedSlide\" show-pager=\"false\" class=\"listContainer\" on-slide-changed=\"slideChanged($index)\"> <ion-slide ng-repeat=\"single in slides track by $index\"> <ion-scroll direction=\"x\" locking=\"false\" zooming=\"true\" min-zoom=\"1\" scrollbar-x=\"false\" scrollbar-y=\"false\" ion-slide-action delegate-handle=\"slide-{{$index}}\" overflow-scroll=\"false\" > <div class=\"item item-image gallery-slide-view\"> <img ng-src=\"{{single.src}}\" ng-show=\"single.src!=''\"> <div class=\"embed-responsive embed-responsive-16by9\" ng-show=\"single.video!=''\"> <youtube-video player-uid=\"single.videoUid\" video-url=\"single.video\" player-vars=\"{controls: 1, autoplay: 0}\" class=\"embed-responsive-item\"></youtube-video> </div></div><div ng-if=\"single.sub.length > 0\" style=\"width: 100%; left: 0\" class=\"text-center image-subtitle\" ng-show=\"!hideAll\"> <span style=\"margin: 0 auto\" ng-bind-html='single.sub'></span> </div></ion-scroll> </ion-slide> </ion-slide-box> </ion-content></ion-modal-view>");
}]);
