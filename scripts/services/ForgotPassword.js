angular.module('newApp').factory('ForgotPassword', function($http,serverConfig) {
    return {
        // validate forgot password code
        validate : function(d) {
            return $http({
                method: 'POST',
                url: serverConfig.address+'api/users/validateForgotPasswordCode',
                data: d
            });
        },
        // reset password
        changePassword : function(dt) {
            return $http({
                method: 'POST',
                url: serverConfig.address+'api/users/resetPassword',
                data: dt
            });
        },
        sendMail : function(dt) {
            return $http({
                method: 'POST',
                url: serverConfig.address+'api/users/forgotPassword',
                data: dt
            });
        }

    }
});