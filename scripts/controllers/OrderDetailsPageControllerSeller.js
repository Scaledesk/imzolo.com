/**
 * Created by tushar on 16/3/16.
 */
angular.module('newApp').controller('OrderDetailsPageControllerSeller', function ($routeParams,$scope,Booking,BookingMessaging,toaster) {
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
    $scope.sentForReview=function(){
        Booking.changeStatus({
            booking_id:$scope.booking.id,
            status:'review'    //submit the application
            },function(){
                toaster.pop('success','Your work submitted to the buyer for review.');
            },function(){
            toaster.pop('error','Some Error Occurred!','Try Again');
        });
    }
});


