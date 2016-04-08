angular.module('newApp').factory('Registration', function($resource,serverConfig){
    return $resource(serverConfig.address+'api/signup');
});