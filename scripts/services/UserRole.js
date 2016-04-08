/**
 * Created by tushar on 23/12/15.
 */
angular.module("newApp").factory("UserRole",function($resource,serverConfig){
    return $resource(serverConfig.address+'api/userRole?user_id=:user_id',{user_id:"@user_id"},{});
});
