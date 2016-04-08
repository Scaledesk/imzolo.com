/**
 * Created by tushar on 21/3/16.
 */
angular.module('newApp').controller('WalletController', function ($routeParams,myPageCtx,$scope,Booking,serverConfig,$auth,$location,Wallet){
    $scope.money=0;
    myPageCtx.menuBar='dashboard';
    $scope.addToWallet=function(amount){
        window.location.assign(serverConfig.address+'api/wallet/addCredit/'+amount+'?access_token='+$auth.getToken());
    };
    Wallet.getWalletAmount().then(function(data){
        $scope.amount=data.data.data;
    });
    Wallet.getWalletTransactions().then(function(data){
        $scope.transactions=data.data.data.reverse();
        console.log(data);
    });

    $scope.change_add_amount=function(do_change_amount){
        $scope.money=do_change_amount;
    }
});
