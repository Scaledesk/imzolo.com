angular.module('newApp').factory('Packages', function($http,serverConfig) {
    return {
        // get all the Packages
        get : function() {
            return $http.get(serverConfig.address+'api/package');
        },
        getSellerPackages : function() {
            return $http.get(serverConfig.address+'api/mySales?access_token='+window.localStorage['satellizer_access_token']);
        },
        getBuyerPackages : function() {
            return $http.get(serverConfig.address+'api/myPurchases?access_token='+window.localStorage['satellizer_access_token']);
        },
        getUserPackages : function(user_id) {
            return $http.get(serverConfig.address+'api/getUserPackages?access_token='+window.localStorage['satellizer_access_token']+"&user_id="+user_id);
        },
        getPackagesByUserId : function(user_id) {
            return $http.get(serverConfig.address+'api/user/'+user_id+'/packages'+'?access_token='+window.localStorage['satellizer_access_token']+"&user_id="+user_id);
        },
        book : function(booking) {
            return $http({
                method: 'POST',
                url: serverConfig.address+'api/booking',
                data: booking
            });
        },
        show: function(id){
            return $http.get(serverConfig.address+'api/package/' + id + '?user_id='+window.localStorage['user_id'])
        },
        showSlug: function(id){
            return $http.get(serverConfig.address+'api/packages?slug=' + id)
        },

        // Adding Packages
        addPackage : function(packageData) {
            return $http({
                method: 'POST',
                url: serverConfig.address+'api/add-package?user_id='+window.localStorage['user_id'],
                //   headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
                data: packageData
            });
        },


        packagesType : function() {
            return $http({
                method: 'GET',
                url: serverConfig.address+'api/packagesTypes'
            });
        },
        // update packages
        updateData : function(packageData, id) {
            return $http({
                method: 'put',
                url: serverConfig.address+'api/user/packages/'+ id,
                //   headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
                data: packageData
            });
        },
        // completing packages
        complete : function(id) {
            return $http({
                method: 'get',
                url: serverConfig.address+'api/user/packages/'+id
                //   headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
            });
        },
      PackagesPaused : function() {
            return $http({
                method: 'PUT',
                url: serverConfig.address+'api/packages/pause'
                //   headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
            });
        },
       PackagesActive : function() {
            return $http({
                method: 'PUT',
                url: serverConfig.address+'api/packages/resume'
                //   headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
            });
        },

        // Delete Packages
        adminDeletePackage : function(id) {
            return $http({
                method: 'delete',
                url: serverConfig.address+'api/adminDeletePackage/'+ id
                //   headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
            });
        },
        doDeletePackage:function(id){
            return $http({
                method: 'delete',
                url: serverConfig.address+'api/user/packages/'+ id
            });
        },
        //submit addons
        submitAddons : function(Data) {
            return $http({
                method: 'post',
                url: serverConfig.address+'api/addon/',
                data: Data
                //   headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
            });
        },
        // for searching packages
        searchResult : function(searchQuery) {
        return $http({
            method: 'get',
            url: serverConfig.address+'api/package?user_id='+window.localStorage['user_id']+searchQuery
            //   headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
        });
    },
        getMaxPrice : function() {
            return $http({
                method: 'GET',
                url: serverConfig.address+'api/maxPrice'
            });
        },

        //submit bonus value
        submitBonus : function(Data) {
        return $http({
            method: 'post',
            url: serverConfig.address+'api/bonus',
            data: Data
            //   headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
        });
    },
        assignBadge : function(user_id,badge_id) {
            return $http({
                method: 'post',
                url: serverConfig.address+'user/'+user_id+'/badge/'+badge_id
            });
        },
        nextpage : function(id) {
        return $http({
            method: 'get',
            url: serverConfig.address+'api/package?orderBy=id&page='+id
        });
      },
        getCategoryPackages:function(id){
            return $http({
                method:"get",
                url:serverConfig.address+"api/category/"+id+"?include=Packages"
            });
        },
        getCategoryBySlug:function(name){
            return $http({
                method:"get",
                url:serverConfig.address+"api/category?include=Packages&category="+name
            });
        },

        setMaxPrice: function (data) {
            maxPrice = data;
        },
        getMaxPriceFilter: function() {
            return maxPrice;
        },


        CancelBooking:function(cancel){
            return $http({
                method: 'PUT',
                url: serverConfig.address+'api/booking/'+cancel.id+'/status/'+cancel.status
            });
        }
    }

});