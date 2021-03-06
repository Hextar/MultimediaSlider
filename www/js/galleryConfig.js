(function () {
    'use strict';

    angular
        .module('angular-multimediaslider')
        .provider('ionGalleryConfig', ionGalleryConfig);

    ionGalleryConfig.$inject = [];

    function ionGalleryConfig() {
        this.config = {
            action_label: 'Chiudi',
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