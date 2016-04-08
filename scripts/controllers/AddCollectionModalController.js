angular.module('newApp').controller('AddCollectionModalController', function (ZoloCollection,toaster,$uibModalInstance, Profile, $rootScope, $scope, UserProfile, $auth, $location) {
    getCollection2=function(){
        ZoloCollection.get({user_id:window.localStorage['user_id']},function(data){
            //$scope.Collections=data.data;
            $uibModalInstance.close(data.data);
            //console.log($scope.Collections.length);
        });
    };
    $scope.saveCollection=function(collection){

        collection.user_id=window.localStorage['user_id'];
        ZoloCollection.addCollection(collection,function(data){
            getCollection2();
            toaster.pop({
                type: 'success',
                title: 'Collection added',
                body: 'collection added successfully!',
                showCloseButton: true
            });
        });
    };
    $scope.cloaseModal = function(){
        $uibModalInstance.dismiss();
    }
});