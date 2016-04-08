angular.module('newApp')
// inject the Activation service into our controller
    .controller('ResetPasswordCtrl', function(ForgotPassword, $http, $scope, $location) {
        $scope.pass = {
            "forgot_password_code" : $location.search().code
        };
        $scope.reset_success=false;
        $scope.loaderStyle={'visibility':'hidden'};
        $scope.loading = false;
        $scope.resetPassword = function(){
            $scope.loaderStyle={'visibility':'visible'};
            $scope.loading = true;
            ForgotPassword.changePassword($scope.pass)
                .success(function(data) {
                    $scope.msg= "You have Successfully reset your password login again";
                    $scope.loading = false;
                    $scope.reset_success=true;
                    $scope.loaderStyle={'visibility':'hidden'};
                })
                .error(function(data) {
                    console.log(data);
                    $scope.msg = data.message;
                    $scope.loading = false;
                    $scope.loaderStyle={'visibility':'hidden'};
                });
        };
    });