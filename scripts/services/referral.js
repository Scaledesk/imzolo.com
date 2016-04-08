/**
 * Created by tushar on 17/3/16.
 */
angular.module('newApp').factory('referral', function($resource,serverConfig) {
    return $resource(serverConfig.address+'api/referral',{referral_code:"@referral_code"},{
        referralSignUp:{
            url:serverConfig.address+'api/referralSignUp/:referral_code',
            method:"post"
        }
    });
});

