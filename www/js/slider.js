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
