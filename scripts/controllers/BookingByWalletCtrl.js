/**
 * Created by tushar on 16/3/16.
 */
angular.module('newApp').controller('BookingByWalletCtrl', function ($routeParams,$scope,Booking,serverConfig,$auth,$location){
    window.location.assign(serverConfig.address+"api/bookingByWallet/"+$routeParams.transaction_id+"?access_token="+$auth.getToken());
});

