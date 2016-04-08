angular.module('newApp')
// inject the Activation service into our controller
    .controller('activateCtrl', function(Activate,toaster, $http, $scope, $location) {

        var d = $location.search().code;
        var a = {'confirmation_code' : d};
        $scope.activated_profile = false;
        $scope.activating_profile = true;
        Activate.activate(a)
            .then(function(data) {
                console.log(data);
                $scope.activating_profile = false;
                $scope.activated_profile = true;
                //$scope.$broadcast('accountActivated', { message: 'Account has been activated' });
                window.localStorage['account_activated'] = 1;
                toaster.pop({
                    type: 'success',
                    title: 'Activated',
                    body: 'Your account successfully activated',
                    showCloseButton: true
                });
                //$location.path("/");
            })
            .catch(function(data) {
                $scope.activating_profile = false;
                $scope.activated_profile = false;
                $scope.activation_response = data;
                //console.log(data);
                //console.log('ndvsghdvcs');
                //$location.path("/error");
                //$location.path("/packages");
            });
        //};
    });