angular.module('newApp').factory('PaymentTypes', function($resource,serverConfig){
    return $resource(serverConfig.address + 'api/packagesPaymentTypes', {

    });
});