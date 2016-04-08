/**
 * Created by tushar on 23/2/16.
 */
/**
 * Created by tushar on 4/2/16.
 */
angular.module("newApp").factory('RequestFeature',function($resource,serverConfig){
    return $resource(serverConfig.address+'api/requestFeature',{id:"@id"},
        {
           postRequest:{
               url:serverConfig.address+'api/requestFeature',
               method:"POST"
           },
            editRequest:{
               url:serverConfig.address+'api/requestFeature/:id',
               method:"PUT"
           },
            getRequest:{
               url:serverConfig.address+'api/requestFeature/:id',
               method:"GET"
           },
            deleteRequest:{
               url:serverConfig.address+'api/requestFeature/:id',
               method:"DELETE"
           }
        });
});

