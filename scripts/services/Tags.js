angular.module('newApp').factory('Tags', function($resource,serverConfig){
    return $resource(serverConfig.address+'api/tag/:id', {id: "@id"}, {
        update: {
            method: "PUT"
        }
    });
});