angular.module('newApp').factory('Aws', function($http,serverConfig) {
    return {
        // get all the Inbox Messages
        get : function() {
            return $http({
                method: 'GET',
                url: serverConfig.address+'awsUpload'
            });
        }

    }
});