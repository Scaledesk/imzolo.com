/**
 * Created by tushar on 16/3/16.
 */
angular.module('newApp').controller('OrderDetailsPageControllerBuyer', function ($routeParams,$scope,Booking,BookingMessaging,toaster) {
    booking_id = $routeParams.booking_id;
    Booking.get({booking_id: booking_id}, function (response) {
        $scope.booking = response.data;
        $scope.total_price = $scope.booking.deal_price;
        angular.forEach($scope.booking.bookingPackagesAddons.data, function (value, key) {
            $scope.total_price = parseInt($scope.total_price) + parseInt(value.amount);
        });
    });
    BookingMessaging.getConversation({booking_id:booking_id},function(data){
        $scope.messages=data.data;
    });
    $scope.sendMessageBooking=function(message){
        message.booking_id=$scope.booking.id;
        message.receiver_id=$scope.booking.seller_id;
        BookingMessaging.save(message,function(){
            $scope.booking_message={};
            angular.forEach($scope.booking.bookingPackagesAddons.data, function (value, key) {
                $scope.total_price = parseInt($scope.total_price) + parseInt(value.amount);
            });
            toaster.pop('success','Message Sent Successfully');
        });
    };
    //for security resons me make different functions to change the status of the booking
    $scope.notAccept=function(){ //this function  used multiple times for submit work to review or re-review
        Booking.changeStatus({
            booking_id:$scope.booking.id,
            status:'review'    //submit the application
        },function(data){
            toaster.pop('success','Your request for re-review submitted to the seller.');
        },function(response){
            toaster.pop('error','Some Error Occurred!','Try Again');
        });
    };
    //for security resons me make different functions to change the status of the booking
    $scope.acceptWork=function(){ //accept
        Booking.changeStatus({
            booking_id:$scope.booking.id,
            status:'completed'    //submit the application
        },function(data){
            alert('Thanks for accepting the work, Your order is completed now');
            toaster.pop('success','Thanks for accepting the work, Your order is completed now');
        },function(response){
            toaster.pop('error','Some Error Occurred!','Try Again');
        });
    };
});


