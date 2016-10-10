angular.module('angular-multimediaslider')

    .factory('DetailsService', function ($resource) {
        var Detail = $resource("http://localhost:8090/ilikesantelia/api/rest/activity/1");
        return {
            getById() {
                return Detail.get();
            }
        }
    });

