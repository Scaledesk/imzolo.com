'use strict';
angular.module('newApp').controller('loginCtrl', function (Profile,toaster, $rootScope, $scope, $auth, $location) {
    $scope.$on('$viewContentLoaded', function () {
        $scope.showpassword = false;
        if ($auth.isAuthenticated()) {
            $location.path('/');
        }
        $scope.login_text = 'Sign In';
        $scope.disabled = false;
        $scope.error_m = false;
        $scope.email_error ='';
        $scope.password_error = '';
    });
    $scope.changeSelection = function(val)
    {
        $scope.selection = val;
    };
    //console.log($location.slug);
    $scope.login = function () {
        if ($scope.email == undefined || $scope.email == '') {
            $scope.email_error = 'email required';
            return;
        }
        if ($scope.password == undefined || $scope.password == '') {
            $scope.password_error = 'password required';
            return;
        }
        if ($scope.email != undefined) {
            if ($scope.email.indexOf("@") == -1 || $scope.email.indexOf(".") == -1) {
                $scope.email_error = 'enter valid email';
                return;
            }
        }
        var user = {
            username: $scope.email,
            password: $scope.password,
            grant_type: "password",
            "client_id": "client_1",
            "client_secret": "client_secret"
        };
        $scope.login_text = 'Please Wait...';
        $scope.disabled = true;
        $scope.get_token(user);
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




    /*
    $scope.login = function () {
        if ($scope.email == undefined || $scope.email == '') {
            $scope.error_email_required = true;
            $scope.error_password_required = false;
            $scope.error_email_invalid = false;
            $scope.error = false;
            $scope.error_m = true;
            return;
        }
        if ($scope.password == undefined || $scope.password == '') {
            $scope.error_email_required = false;
            $scope.error_password_required = true;
            $scope.error_email_invalid = false;
            $scope.error = false;
            $scope.error_m = true;
            return;
        }
        if ($scope.email != undefined) {
            if ($scope.email.indexOf("@") == -1 || $scope.email.indexOf(".") == -1) {
                $scope.error_email_required = false;
                $scope.error_password_required = false;
                $scope.error_email_invalid = true;
                $scope.error = false;
                $scope.error_m = true;
                return;
            }
        }
        var user = {
            username: $scope.email,
            password: $scope.password,
            grant_type: "password",
            "client_id": "client_1",
            "client_secret": "client_secret"
        };
        $scope.login_text = 'Please Wait...';
        $scope.get_token(user);
    };

    $scope.authenticate = function (provider) {
        $auth.authenticate(provider)
            .then(function (response) {
                var user = {
                    google_id: response.data.google_id,
                    google_access_token: response.data.google_access_token,
                    grant_type: "google",
                    "client_id": "client_1",
                    "client_secret": "client_secret"
                };
                $scope.get_token(user);
            }).catch(function (response) {

            });
    };
    $scope.get_token = function(user){
        $auth.login(user)
            .then(function (response) {
                console.log("here");
                console.log($scope.redirectFlag);
                $scope.myStyle={'visibility':'hidden'};
                $scope.login_text = 'Sign In';
                $scope.disabled = false;
                Profile.myProfile().then(function (data) {
                    $rootScope.user_profile = data.data.data;
                    console.log($rootScope.user_profile);
                    window.localStorage['user_id'] = data.data.data.user_id;
                });
                $scope.$emit('profileUpdated', { message: "u" });
                //$uibModalInstance.close($scope.assignment);
                if($scope.redirectFlag == true)
                {
                    $location.path('/dashboard/my-dashboard');
                }
            })
            .catch(function (response) {
                $scope.error = true;
                $scope.error_email_required = false;
                $scope.error_password_required = false;
                $scope.error_email_invalid = false;
                $scope.error_m = 1;
                $scope.login_text = 'Sign In';
                $scope.myStyle={'visibility':'hidden'};
                $scope.disabled = false;
            });
    };*/
    /*//Register
    $scope.registration = {
    };
    $scope.error = 0;
    $scope.reg_text = 'Sign Up';
    $scope.registration = new Registration();
    $scope.sign_up_successful = false;
    $scope.userRegistration = function (user) {
        $scope.error_messages=[];
        console.log(user.mobile);
        i=10;
        if(user.mobile.match(/[a-z]/i)){
            $scope.error_messages.push("Please enter valid mobile number");
            return false;
        }
        //$scope.signing_up = true;
        $scope.registration.password_confirmation = $scope.registration.password;
        $scope.disabled = true;
        //$scope.reg_text = 'Please Wait...';
        $scope.myStyle={'visibility':'visible'};
        $scope.registration.$save(function (data) {
                $scope.error = 0;
                $scope.disabled = false;
                $scope.sign_up_successful = true;
                //$scope.reg_text = 'Sign Up';
                $scope.myStyle={'visibility':'hidden'};
            },
            function (response) {

                $scope.disabled = false;
                $scope.error = 1;
                $scope.error_messages = response.data.message;
                //$scope.reg_text = 'Sign Up';
                $scope.myStyle={'visibility':'hidden'};
                //  $scope.signing_up = true;

            });
    };*/

});



