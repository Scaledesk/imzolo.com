angular.module('newApp').factory('ChangePassword', function(serverConfig,$resource) {
    return $resource(serverConfig.address+'api/users/changePassword', {}, {
        update: {
            method: "PUT"
        }
    });
});
