angular.module('newApp').factory('Profile', function($http,serverConfig,$auth,$location) {
    return {
        // get all the Inbox Messages
        get : function(id) {
            return $http({
                method: 'GET',
                url: serverConfig.address+'api/userProfile/'+id+'?access_token='+window.localStorage['satellizer_access_token']
            });
        },
        myProfile : function() {
            return $http({
                method: 'GET',
                url: serverConfig.address+'api/myProfile?access_token='+window.localStorage['satellizer_access_token']
            }).then(function(data){return data;},function(response){
                if(response.status == 500){
                    $auth.logout();
                    $location.path('/');
                }

            });
        },
        update: function(id,data) {
          return $http({
              method:'PUT',
              url : serverConfig.address+'api/userProfile?user_id='+window.localStorage['user_id'],
              data : data
          });
        },
            getMyPortfolio: function() {
                return $http({
                    method:'GET',
                    url : serverConfig.address+'api/userPortfolio/'+window.localStorage['user_id']
                });
            },

        getSellerPortfolio: function(id) {
            return $http({
                method:'GET',
                url : serverConfig.address+'api/userPortfolio/'+id
            });
        },


            addPortfolio: function(data) {
                return $http({
                    method:'POST',
                    url : serverConfig.address+'api/userPortfolio',
                    data : data
                });
            },
        getReviews: function(user_id){
            return $http({
                method: 'GET',
                url: serverConfig.address+'api/users/'+user_id+'/packagesReviews'+'?access_token='+window.localStorage['satellizer_access_token']
            });
        }
    }
});