/**
 * Created by tushar on 19/3/16.
 */
/**
 * its gives the routes for the booking messaging
 */
angular.module('newApp').factory('BookingMessaging', function($resource,serverConfig) {
    return $resource(serverConfig.address+'api/booking/message/',{booking_id:"@booking_id"},{
        getConversation:{
            url:serverConfig.address+'api/getBookingConversation',
            method:"get"
        }
    })
});

