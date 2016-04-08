angular.module('newApp').factory('Address', function($http,serverConfig,$routeParams,$resource) {
  //  return {
       /* // get all the Inbox Messages
        get : function() {
            return $http({
                method: 'GET',
                url: serverConfig.address+'api/userAddress?user_id='+$routeParams.user_id
            });
        }*/

    //}
    return $resource(serverConfig.address+'api/userAddress/:id', {id: "@id"}, {
        update: {
            method: "PUT"
        }
    });
});