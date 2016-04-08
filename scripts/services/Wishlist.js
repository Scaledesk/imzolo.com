angular.module('newApp').factory('Wishlist', function($http,serverConfig) {
    return {
        // get all the Packages
        get : function() {
            return $http.get(serverConfig.address+'api/getWishlist');
        },
        add : function(wishlist) {
            return $http({
                method: 'POST',
                url: serverConfig.address+'api/wishPackage',
                data: wishlist
            });
        },
        remove : function(wishlist) {
            return $http({
                method: 'PUT',
                url: serverConfig.address+'api/removeWishPackage',
                data: wishlist
            });
        }



    }

});
