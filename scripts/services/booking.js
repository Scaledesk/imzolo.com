/**
 * Created by tushar on 15/3/16.
 */
angular.module('newApp').factory('Booking', function($resource,serverConfig) {
    return $resource(serverConfig.address+'api/booking/:booking_id',{booking_id:"@booking_id",amount:"@amount",status:"@status"},{
        getRestAmountToBuyPackageFromWallet:{
            url:serverConfig.address+'api/booking/restAmount/:amount',
            method:"get"
        },
        changeStatus:{
            url:serverConfig.address+'api/booking/:booking_id/status/:status',
            method:"put"
        }
    })
});
