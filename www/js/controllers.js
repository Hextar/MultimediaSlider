angular.module('angular-multimediaslider')

    .controller('Home', function ($scope, $log, DetailsService) {

        $scope.items = DetailsService.getById().$promise.then(function(data) {
            $scope.items = data.activity.multimedia;

            console.debug($scope.items);

        });

    });
