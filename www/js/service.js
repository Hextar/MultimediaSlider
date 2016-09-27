angular.module('angular-multimediaslider')

    .factory('DetailsService', function ($resource) {
        var Detail = $resource("http://localhost:3000/details/:detailId", {detailId:'@id'});
        return {
            getById(id) {
                return Detail.get({detailId: id});
            }
        }
    });

