/**
 * Created by tushar on 28/3/16.
 */
angular.module('newApp').controller('MessageController',function($scope,Message,$location,toaster,$timeout,Packages,$filter){
    $scope.dashboard_loading = true;
    $scope.loading_messages = true;
    $scope.error='';
    $scope.success='';
    user_id=window.localStorage['user_id'];
    $scope.active_placeholder={};
    console.log(user_id);
    $scope.starred_placeholder_index=-1;
    getNumberOfNewMessages=function(data){
        $scope.new_messages_count=data.data;
        console.log($scope.new_messages_count);
    };
    read_message=function(data){
        $scope.active_message.read=1;
        $location.path("/message/"+$scope.active_message.id);
    };
    star_message=function(data){
        $scope.active_message.star=1;
        console.log($scope.active_message);
    };
    unstar_message=function(data){
        $scope.active_message.star=0;
        console.log($scope.active_message);
    };
    getAllPlaceholders=function(data){
        $scope.placeholders=data.data;
        $scope.placeholders.reverse();
        $scope.active_placeholder=$scope.placeholders[$scope.placeholders.length-1];
    };
    $scope.makePlaceholderActive=function(placeholder){
        $scope.active_placeholder=placeholder;
    };
    changeMessagesToShow=function(data){
        $scope.messages=data.data;
        $scope.clickedMessage($scope.messages[0].id);
        $scope.clickedMessage(0);
        reset();
    };
    //all user messages will be fetched by this function called when watch triggered
    $scope.loadOtherMessages=function(){
        Message.getOtherMessages({placeholder_id:$scope.active_placeholder.id,user_id:user_id},changeMessagesToShow);
    };
    $scope.$watch('active_placeholder.id',function() {
        if($scope.placeholders!=undefined) {
            console.log($scope.starred_placeholder_index);
            $scope.loadOtherMessages();
        }

    },true);
    $scope.showStarredMessageOnly=function(){
        Message.getStarredOtherMessages({placeholder_id:$scope.active_placeholder.id,user_id:user_id},changeMessagesToShow);
    };
    /*get all placeholders*/
    Message.placeholders({},getAllPlaceholders);
    /*get Number Of New Messages */
    Message.numberOfNewMessages({},getNumberOfNewMessages);
    /*read user message*/
    $scope.readMessage=function(message){
        $scope.active_message=message;
        Message.ReadMessage({placeholder_id:$scope.active_placeholder.id,messages_ids:message.id},read_message)
    };
    /*star user message*/
    $scope.starMessage=function(message){
        $scope.active_message=message;
        Message.StarMessage({placeholder_id:$scope.active_placeholder.id,messages_ids:message.id},star_message)
    };
    /*unstar user message*/
    $scope.unstarMessage=function(message){
        $scope.active_message=message;
        Message.UnstarMessage({placeholder_id:$scope.active_placeholder.id,messages_ids:message.id},unstar_message)
    };
    $scope.redirectToMessage=function(id){
        $location.path("/message/"+id);
    };

    //get all read messages
    $scope.getAllReadMessagesOfPlaceholder=function(){
        Message.getReadOtherMessages({placeholder_id:$scope.active_placeholder.id,user_id:user_id},changeMessagesToShow);
    };
    //get all unread messages
    $scope.getAllUnreadMessagesOfPlaceholder=function(){
        Message.getUnreadOtherMessages({placeholder_id:$scope.active_placeholder.id,user_id:user_id},changeMessagesToShow);
    };
    //get all read messages
    $scope.getAllUnstarMessagesOfPlaceholder=function(){
        Message.getUnstarredOtherMessages({placeholder_id:$scope.active_placeholder.id,user_id:user_id},changeMessagesToShow);
    };
    //get all messages of placeholder
    $scope.getAllMessagesOfPlaceholder=function(){
        $scope.loadOtherMessages();
    };
    //method to select the message so that wecan send the message in reply
    $scope.clickedMessage=function(current_index){
        $scope.active_message_index=current_index;
        $scope.message=$scope.messages[$scope.active_message_index];
        reset();
        //functionality for the custom offer
        $scope.show=$scope.replyMessage.is_custom;
    };
    //method to send the message
    $scope.sendMessage_controller=function(){/*
        replyMessage.subject='Re: '+$scope.messages[$scope.active_message_index].subject;
        replyMessage.receiver_id=$scope.messages[$scope.active_message_index].sender.data.user_id;*/

        if($scope.replyMessage.body==""||$scope.replyMessage.body==null||$scope.replyMessage.body==undefined){
            $scope.success="";
            $scope.error="Empty message! Message is required.";
            return;
        }
        if($scope.show=='true'&&($scope.replyMessage.days==null||$scope.replyMessage.days==""||$scope.replyMessage.days==undefined)){
            $scope.success="";
            $scope.error="Error! No of Days is required.";
            return;
        }
        if($scope.show=='true'&&($scope.replyMessage.price==null||$scope.replyMessage.price==""||$scope.replyMessage.price==undefined)){
            $scope.success="";
            $scope.error="Error! Price is required.";
            return;
        }

        //logic to send the message
        if($scope.replyMessage.is_custom=='true'){
            obj= {
                'body': $scope.replyMessage.body,
                'receiver_id': $scope.messages[$scope.active_message_index].sender.data.user_id,
                'subject':'Re: '+$scope.messages[$scope.active_message_index].subject,
                'receiver_placeholder_id': $scope.messages[$scope.active_message_index].receiver_placeholder_id,   //placeholder id of inbox
                'sender_placeholder_id': $scope.messages[$scope.active_message_index].sender_placeholder_id,
                'days': $scope.replyMessage.days,
                'price': $scope.replyMessage.price,
                'custom_offer_package_id': $scope.messages[$scope.active_message_index].custom_offer_package_id,
                'has_buy_action': true,
            };
        }else if($scope.replyMessage.is_custom=='false'){
            obj= {
                'body': $scope.replyMessage.body,
                'receiver_id': $scope.messages[$scope.active_message_index].sender.data.user_id,
                'subject':'Re: '+$scope.messages[$scope.active_message_index].subject,
                'receiver_placeholder_id': $scope.messages[$scope.active_message_index].receiver_placeholder_id,   //placeholder id of inbox
                'sender_placeholder_id': $scope.messages[$scope.active_message_index].sender_placeholder_id,
            };
        }


            Message.sendMessage(obj,function(response){
                console.log(response);
                toaster.pop('success',"Message Send Successfully!");
                $timeout(reset, 100);

            },function(error_response){
                console.log(error_response);
                console.log(error_response.status==401);
                if(error_response.status==401){
                    toaster.pop('warning',"Something wrong or you try to send message to yourself!");
                }else{
                    toaster.pop('error',"Some Error Occurred!","Try Again");
                }

            });
    };
    //to show the fields in case of custom offer
    $scope.showHideCustomOfferDaysPrice=function(){
        if($scope.show=="true"){
            $scope.show="false";
            return;
        }else
        if($scope.show=="false"){
            $scope.show="true";
            return;
        }
    };
    reset=function(){
        //is custom variable is taken to do the custom offer functionality
        $scope.replyMessage={
            is_custom:'false'
        };
        $scope.resetErrorSuccess=function(){
            $scope.error="";
            $scope.success="";
        }
    };
    $scope.Book=function(){
        booking_object={};
        booking_object.is_custom=true;
        booking_object.message_id=$scope.message.id;
        booking_object.package_id=$scope.message.custom_offer_package_id;
        Packages.book(booking_object).then(function(response){
            //redirect the user to the booking page
            console.log(response.data);
            $location.path('/booking/'+response.data.data.booking_id+'/'+response.data.data.id);
        },function(error){
            //do the logic if booking failed i.e unable to save the booking datails in the booking table
        });
    }

}).filter('capitalize', function() {
    return function(input, all) {
        var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
        return (!!input) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
    }
});
