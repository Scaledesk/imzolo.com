'use strict';
angular.module('newApp').controller('signUpCtrl', function (Profile,Registration,toaster, $rootScope, $scope, $auth, $location) {
    $scope.$on('$viewContentLoaded', function () {
        $scope.showpassword = false;
        if ($auth.isAuthenticated()) {
            $location.path('/');
        }
        $scope.sign_up_text = 'Sign Up';
        $scope.registration = {
        };
        $scope.reg_text = 'Sign Up';
        $scope.registration = new Registration();
        $scope.sign_up_successful = false;
        $scope.disabled = false;
    });


    //var PHONE_REGEXP = /^[(]{0,1}[0-9]{3}[)\.\- ]{0,1}[0-9]{3}[\.\- ]{0,1}[0-9]{4}$/;
    //$scope.phone_error = false;
    //Register
     $scope.userRegistration = function () {

         if($scope.registration.name=='' || $scope.registration.name==undefined){
             console.log('validation error');
             return false;
         }
         if($scope.registration.email==''||$scope.registration.email==undefined){
             console.log('validation error');
             return false;

         }
         if($scope.registration.password==''|| $scope.registration.password==undefined){
             return false;
         }
         if($scope.registration.mobile==''||$scope.registration.mobile==undefined){
             return false;
         }
         /*if(!PHONE_REGEXP.test($scope.registration.mobile)){

             $scope.phone_error = true;
             return false;
         }*/
         console.log($scope.registration);
         $scope.registration.password_confirmation = $scope.registration.password;
     //$scope.myStyle={'visibility':'visible'};
     $scope.registration.$save(function (data) {

     $scope.sign_up_successful = true;

             /*toaster.pop({
                 type: 'success',
                 title: 'Hi User',
                 body: 'Welcome to Zolo',
                 showCloseButton: true
             });*/
             $location.path('/welcome-to-zolo');
     //$scope.myStyle={'visibility':'hidden'};
     },
     function (response) {

     //$scope.disabled = false;
     //$scope.error = 1;
         console.log(response.data.message);
      $scope.error_messages = response.data.message;

     //$scope.myStyle={'visibility':'hidden'};
         toaster.pop({
             type: 'error',
             title: "ERROR",
             body: response.data.message,
             showCloseButton: true
         });

     });
     };


    $scope.authenticate = function (provider) {
        $auth.authenticate(provider)
            .then(function (response) {
                console.log("here");
                var user = {
                    google_id: response.data.google_id,
                    google_access_token: response.data.google_access_token,
                    grant_type: "google",
                    "client_id": "client_1",
                    "client_secret": "client_secret"
                };

                /*social_auth_provider:response.data.social_auth_provider,
                 social_auth_provider_id:response.data.social_auth_provider_id,
                 social_auth_provider_access_token:response.data.social_auth_provider_access_token,
                 grant_type:"social"*/

                $scope.get_token(user);
            }).catch(function (response) {
                console.log(response);
            });
    };
    $scope.get_token = function(user){
        $auth.login(user)
            .then(function (response) {
                $scope.login_text = 'Sign In';
                $scope.disabled = false;
                Profile.myProfile().then(function (data) {
                    $rootScope.user_profile = data.data.data;
                    console.log(data.data.data.is_seller==="1");
                    if(data.data.data.is_seller==="1"){
                        window.localStorage['is_seller'] = "seller";
                    }else{
                        window.localStorage['is_seller'] = "buyer";
                    }
                    window.localStorage['user_id'] = data.data.data.user_id;
                    console.log($rootScope.user_profile);
                    if(window.localStorage['url']!=''){
                        //url = window.localStorage['url'];
//                    window.localStorage['url'] = '';
                        console.log(window.localStorage['url']);
                        $location.path(window.localStorage['url']);
                    }
                    else{
                        console.log($rootScope.user_profile.name);
                        toaster.pop({
                            type: 'success',
                            title: 'Hi '+$rootScope.user_profile.name,
                            body: 'You are logged in',
                            showCloseButton: true
                        });
                        $location.path('/');
                    }
                });
                //$scope.$emit('profileUpdated', { message: "u" });
            })
            .catch(function (response) {
                // Handle errors here, such as displaying a notification
                // for invalid email and/or password.
                toaster.pop({
                    type: 'error',
                    title: 'Validation Error',
                    body: 'Email or Password not match',
                    showCloseButton: true
                });
                //$scope.error = true;
                //$scope.login_text = 'Sign In';
                $scope.disabled = false;
            });
    };








});



