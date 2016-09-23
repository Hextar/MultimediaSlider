(function () {
    'use strict';

    angular
        .module('angular-multimediaslider')
        .directive('ionSlider', ionSlider);

    ionSlider.$inject = ['$ionicModal', 'ionGalleryHelper', '$ionicPlatform', '$timeout', '$ionicScrollDelegate'];

    var players = [];
    var AUTO_REFRESH = false;
    var AUTO_START= false;
    var AUTO_STOP= true;

    function ionSlider($ionicModal, ionGalleryHelper, $ionicPlatform, $timeout, $ionicScrollDelegate) {

        return {
            restrict: 'A',
            controller: controller,
            link: link
        };

        function controller($scope, $sce) {
            var lastSlideIndex;
            var currentImage;
            var galleryLength = $scope.ionGalleryItems.length;

            var zoomStart = false;

            players = Array.apply(null, new Array(galleryLength)).map(Number.prototype.valueOf, 0);

            $scope.refreshPlayers = function (indexInput, indexOutput) {

                var uid = $scope.ionGalleryItems[indexInput].uid;
                //console.debug(players);
                //console.debug("uid is: " + uid);
                if (($scope.ionGalleryItems[indexInput] != '')
                    && (players[indexOutput] == 0)
                    && (uid != '')
                    && AUTO_REFRESH) {
                    var tempPlayer = YT.get(uid);
                    if (tempPlayer != null) {
                        //console.debug("===Prendo da " + indexInput + " e metto in " + indexOutput + " ===");
                        players[indexOutput] = tempPlayer;
                        //console.debug("Player now contains: ");
                        //console.debug(players);
                    }

                }

            }

            $scope.startVideo = function (index) {
                if (!players.isEmpty && AUTO_START) {
                    console.debug("ATTEMPTING TO START " + index + "° video in: ");
                    console.debug(players[index]);
                    if (players[index] != 0) {
                        players[index].playVideo();
                    }
                }
            }

            $scope.stopVideo = function () {
                if (!players.isEmpty && AUTO_STOP) {
                    console.debug("ATTEMPTING TO STOP all videos");
                    angular.forEach(players, function (player, key) {
                        console.log(player);
                        if (player != 0) player.stopVideo();
                    });
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

                $scope.refreshPlayers(index, lastSlideIndex);
                $scope.startVideo(index);
            };

            $scope.slideChanged = function (currentSlideIndex) {

                if (currentSlideIndex === lastSlideIndex) {
                    return;
                }

                var slideToLoad = $scope.slides.length - lastSlideIndex - currentSlideIndex;
                var imageToLoad;
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

                $scope.refreshPlayers(videoToLoad, imageToLoad);
                $scope.stopVideo(imageToLoad);
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
                scope.stopVideo();
                players = [];
                _modal.hide();
            };

            scope.$on('$destroy', function () {
                try {
                    _modal.remove();
                    players = [];

                } catch (err) {
                    console.log(err.message);
                }
            });
        }
    }
})();
