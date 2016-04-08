/**
 * Created by tushar on 20/12/15.
 */
angular.module("newApp").factory("PackageTypes",function($resource,serverConfig){
return $resource(serverConfig.address+'api/packagesTypes/');
});