angular.module('newApp').directive('packageCard', function() {
    return {
        restrict: 'A',
        scope: {
            package : '=',
            masterCollections: '='
        },
        controller : function($auth,$scope,toaster,Wishlist,$location,$uibModal,ZoloCollection){
            //Wishlist
            //console.log($scope.masterCollections);
            $scope.collections = angular.copy($scope.masterCollections);
            $scope.isAuthenticated = function(){
                return $auth.isAuthenticated();
            };
            $scope.markCollections = function(){
                angular.forEach($scope.collections,function(collection){
                    var flag = false;
                    if(collection.packages_ids.length == 0){
                        collection.package_collection_status = true;
                    }
                    angular.forEach(collection.packages_ids,function(package_id){
                        if(package_id === $scope.package.id)
                        {
                            flag = true;
                        }
                    });
                    collection.package_collection_status = flag;

                });
            };
            $scope.markCollections();
          
            $scope.openAddCollectionModal = function () {
                var AddCollectionModal = $uibModal.open({
                    animation: true,
                    templateUrl: 'user/collection/add-collection-modal.html',
                    controller: 'AddCollectionModalController',
                    size: 'sm'
                });
                AddCollectionModal.result.then(function (data) {
                    $scope.collections = data;
                    $scope.markCollections();
                    $scope.$emit('collectionAdded', { message: "u" });
                }, function () {
                    //$log.info('Modal dismissed at: ' + new Date());
                });

            };

            $scope.toggleCollectionStatus = function(package_id,collection){
                if(collection.package_collection_status == false){
                    ZoloCollection.addPackage1({packages_ids:package_id,collection_id:collection.id},function(data){
                        toaster.pop({
                            type: 'success',
                            title: 'Package Added in collection '+collection.name,
                            body: '',
                            showCloseButton: true
                        });
                        collection.package_collection_status = true;
                    });
                }
                else{
                    ZoloCollection.removePackage({packages_ids:package_id,collection_id:collection.id},function(data){
                        toaster.pop({
                            type: 'success',
                            title: 'Package Deleted in collection '+collection.name,
                            body: '',
                            showCloseButton: true
                        });
                        collection.package_collection_status = false;
                    });
                }
            };

            //
            $scope.toggleDropdown = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.status.isopen = !$scope.status.isopen;
            };

            $scope.addAndDeleteWishlist = function(package){
                if (!$auth.isAuthenticated()) {
                    $location.path('/login');
                }
                else {
                    if (package.wished_by_user != 'yes') {
                        Wishlist.add({
                            'user_id': window.localStorage['user_id'],
                            'package_id': package.id
                        }).then(function successCallback(response) {
                            package.wished_by_user = 'yes';
                            toaster.pop({
                                type: 'success',
                                title: 'Package Added in Wishlist',
                                body: '',
                                showCloseButton: true
                            });
                        }, function errorCallback(response) {
                        });
                    }
                    else {
                        Wishlist.remove({
                            'user_id': window.localStorage['user_id'],
                            'package_id': package.id
                        }).then(function successCallback(response) {
                            package.wished_by_user = 'no';
                            toaster.pop({
                                type: 'success',
                                title: 'Package Removed from Wishlist',
                                body: '',
                                showCloseButton: true
                            });
                        }, function errorCallback(response) {
                        });
                    }
                }
            };


$scope.reidrectTpLogin = function(){
    $location.path('/login');
};



            $scope.socialShair = function(p){
               /* $('.profil-content').on('click', '.more-share', function() {
                    $(this).closest('.more').find('.more-share').toggleClass('active');
                    $(this).closest('.more').find('.share').slideToggle(200);
                });*/

            if(p.shareTab==false){
                p.shareTab=true;
            }
                else{
                p.shareTab=false;
            }



            };

            /* Handle Share Show / Hide */
           // $('.profil-content').on('click', '.more-share', function() {

                /*$(this).closest('.more').find('.comments').slideUp(200, function() {
                 $(this).closest('.more').find('.share').slideToggle(200);
                 $(this).closest('.more').find('.more-share').toggleClass('active');
                 // $(this).closest('.more').find('.more-comments').removeClass('active');
                 });*/
           // });






        },
        templateUrl : "../../views/packageCard.html"

    }
});
