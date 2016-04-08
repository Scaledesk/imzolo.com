/**
 * Created by tushar on 15/3/16.
 */
angular.module('newApp').controller('bookingCtrl', function ($routeParams,$scope,Booking,serverConfig,$auth,$location,Wallet) {
    booking_id=$routeParams.booking_id1;
    transaction_id=$routeParams.transaction_id;
    Wallet.getWalletAmount().then(function(response){
        $scope.wallet_amount=response.data;
    });
    if($location.search().status=='failed'){ // this evaluates this order page comes for the first time or it was just failed anf has to be try again
        $scope.isfailed=1;
    }else{
        $scope.isfailed=0;
    }
    Booking.get({booking_id:booking_id},function(response){
        $scope.booking=response.data;
        $scope.selected_addons_length=$scope.booking.bookingPackagesAddons.data.length;
        $scope.total_price=$scope.booking.deal_price;
        angular.forEach($scope.booking.bookingPackagesAddons.data,function(value,key){
            $scope.total_price=parseInt($scope.total_price)+parseInt(value.amount);
            if(($scope.selected_addons_length-1)==key){
                Booking.getRestAmountToBuyPackageFromWallet({amount:$scope.total_price},function(response_local){
                    $scope.restAmount=response_local.data;
                });
            }
        });
        $scope.by_medium='by_wallet';
        //calculate or get the rest amount oif no addin isd selected
        Booking.getRestAmountToBuyPackageFromWallet({amount:$scope.total_price},function(response_local){
            $scope.restAmount=response_local.data;
        });
    });
    $scope.onSelectPaymentMethod=function(){
        if($scope.by_medium=='by_wallet'){
            //now two condition if has sufficient balance
           if($scope.restAmount<=0){
            window.location.assign(serverConfig.address+"api/bookingByWallet/"+transaction_id+"?access_token="+$auth.getToken());
           }else if($scope.restAmount>0){
               window.location.assign(serverConfig.address+"api/booking/addToWalletTransaction/"+$scope.restAmount+"?access_token="+$auth.getToken()+'&transaction_id='+transaction_id);
           }
        }else if($scope.by_medium=='by_payment_gateway'){
            window.location.assign(serverConfig.address+"/payBookingAmount/"+transaction_id+"?access_token="+$auth.getToken());
        }
    };
    $scope.hideFailed=function()
    {
        $scope.isfailed=0;
    }
});
