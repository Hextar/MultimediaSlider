angular.module('angular-multimediaslider')

    .factory('DetailsService', function ($resource) {
        var Detail = $resource("http://localhost:3000/details/1");
        return {
            getById() {
                return Detail.get();
            }
        }
    });

