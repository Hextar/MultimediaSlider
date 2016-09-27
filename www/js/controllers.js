angular.module('angular-multimediaslider')

    .controller('Home', function ($scope, $log, DetailsService) {

        $scope.items = DetailsService.getById(1).$promise.then(function(data) {
            $scope.items = data.images;
            //$log.debug("Json data is here: ");
            //$log.debug($scope.items);
        });

    });
