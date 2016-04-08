angular.module('newApp')
// inject the Activation service into our controller
    .controller('SendResetPasswordMailCtrl', function(ForgotPassword, $http, $scope) {

        $scope.dt = "";
        $scope.msg="";
        $scope.loaderStyle={'visibility':'hidden'};
        $scope.sendResetMail = function(){
            console.log($scope.dt);
            $scope.loading = true;
            $scope.loaderStyle={'visibility':'visible'};
            ForgotPassword.sendMail($scope.dt)
                .success(function(data) {
                    $scope.msg= "Password Reset link send to your email check mail and reset password";
                    console.log(data);
                    $scope.loading = false;
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