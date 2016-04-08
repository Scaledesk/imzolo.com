/**
 * Created by tushar on 30/3/16.
 */
angular.module("newApp").controller('MessageSellerCustomOfferController',function($scope,receiver_id,receiver_name,$uibModalInstance,Message,$timeout,package_id,package_name_in_model){
    $scope.modalmessage={};
    if(receiver_name!=undefined||receiver_name!=''){
        $scope.receiver_name=receiver_name;
    }else{
        $scope.receiver_name='Seller';
    }
    //$scope.sender_id=sender_id;
    $scope.receiver_id=receiver_id;
    $scope.package_id_in_model=package_id;
    $scope.keyPressed=function(){
        $scope.error='';
    };
    $scope.success='';
    $scope.error='';
    $scope.cloaseModal = function(){
        $uibModalInstance.close(); //close without error
    };
    $scope.sendMessageSeller=function(){
        $scope.modalmessage.subject="Custom Offer"+' - '+package_name_in_model;
        if($scope.modalmessage.body==''||$scope.modalmessage.body==null||$scope.modalmessage.body==undefined||$scope.modalmessage.body.length<100){
            $scope.success='';
            $scope.error="Offer Description is required, min length must be 100";
            return;
        }
        if($scope.modalmessage.days==''||$scope.modalmessage.days==null||$scope.modalmessage.days==undefined||$scope.modalmessage.days<=0){
            $scope.success='';
            $scope.error="Day is required and min is 1";
            return;
        }
        if($scope.modalmessage.title==''||$scope.modalmessage.title==null||$scope.modalmessage.title==undefined){
            $scope.success='';
            $scope.error="Title is required";
            return;
        }
        if($scope.modalmessage.price==''||$scope.modalmessage.price==null||$scope.modalmessage.price==undefined||$scope.modalmessage.price<=0){
            $scope.success='';
            $scope.error="price is required and and it cannot be zero or negative";
            return;
        }
        console.log({
            'subject':$scope.modalmessage.subject,
            'body':$scope.modalmessage.body,
            'days':$scope.modalmessage.days,
            'title':$scope.modalmessage.title,
            'price':$scope.modalmessage.price,
            'receiver_id':$scope.receiver_id,
            'sender_id':$scope.sender_id,
            'receiver_placeholder_id':3,   //placeholder id of custom_offer
            'sender_placeholder_id':2,   //placeholder id of sent it has to be shown in the sent box
            'custom_offer_package_id':$scope.package_id_in_model   //placeholder id of sent it has to be shown in the sent box
        });
        Message.sendMessage({
            'subject':$scope.modalmessage.subject,
            'body':$scope.modalmessage.body,
            'days':$scope.modalmessage.days,
            'title':$scope.modalmessage.title,
            'price':$scope.modalmessage.price,
            'receiver_id':$scope.receiver_id,
            'receiver_placeholder_id':3,   //placeholder id of custom_offer
            'sender_placeholder_id':2,   //placeholder id of sent it has to be shown in the sent box
            'custom_offer_package_id':$scope.package_id_in_model   //placeholder id of sent it has to be shown in the sent box
        },function(data){
            $scope.error='';
            $scope.success='Request for custom offer submitted successfully';
            $timeout(function() {
                $scope.cloaseModal();
            }, 350);
        },function(data){
            $scope.success='';
            $scope.error='Some error occurred, Try Again';
            $timeout(function() {
                $uibModalInstance.dismiss();
            }, 350);
        });
    };
});

