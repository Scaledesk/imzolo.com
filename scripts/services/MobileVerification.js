/**
 * Created by tushar on 16/2/16.
 */
angular.module('newApp').factory('MobileVerification',function($resource,serverConfig){
    return $resource(serverConfig.address+'api/users/:uid/mobileVerified/',{uid:'@uid',code:'@code'},{
        sendVerificationSms:{
            url:serverConfig.address+'api/sendMobileVerificationMessage/:uid',
            method:"POST"
        },
        verifyMobileByCode:{
            url:serverConfig.address+'api/users/:uid/verifyMobile/:code',
            method:"POST"
        }
    })

});
