/**
 * Created by tushar on 17/3/16.
 */
angular.module('newApp').controller('referralCtrl', function($routeParams,referral,$scope,toaster,$location){
    code=$routeParams.code;
    $scope.doSignUp=function(obj){
referral.referralSignUp({referral_code:code},obj,function(response){
toaster.pop('success','Thank you for signing up!','Hi'+obj.name+'thank you for signing up. Now, Login to Zolo');
    $location.path('#login/');
},function(response){
toaster.pop('error','Error!You are already registered with your email!','Hi '+obj.name+' Kindly login with your existing account.');
    $location.path('#login/');
});
    };
});
