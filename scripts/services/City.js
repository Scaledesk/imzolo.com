angular.module('newApp').factory('City', function($http,serverConfig) {
    return {
        // get all the Inbox Messages
        get : function(query) {
            return $http({
                method: 'GET',
                url: serverConfig.address+'api/cities'
            });
        }
    }
});