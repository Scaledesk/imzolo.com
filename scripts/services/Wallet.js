angular.module('newApp').factory('Wallet', function($http,serverConfig) {
    return {
        debit : function(data) {
            return $http({
                method: 'PUT',
                url: serverConfig.address+'api/users/walletTransaction/',
                data: data
            });
        },
        getWalletAmount:function(){
          return $http({
              method: 'GET',
              url: serverConfig.address+'api/wallet/amount',
          });
        },
        getWalletTransactions:function(){
            return $http({
                method: 'GET',
                url: serverConfig.address+'api/Wallet/History',
            });
        }
    }
});