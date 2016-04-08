/*
angular.module('CandyBrush').factory('UserProfile', function($http,serverConfig) {
    return {
        // get all the Packages
        get: function (id) {
            return $http.get(serverConfig.address + 'api/userProfiles/'+ id);
        }
    }
});*/

angular.module('newApp').factory('UserProfile', function($resource,serverConfig){
    return $resource(serverConfig.address + 'api/userProfile/:id', {id: "@id"}, {
        update: {
            method: "PUT"
        }
    });
});