angular.module('newApp').factory('Category', function($resource,serverConfig){
    return $resource(serverConfig.address + 'api/category/:id', {id: "@id"}, {
        update: {
            method: "PUT"
        }
    });
});