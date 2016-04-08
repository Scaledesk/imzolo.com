angular.module('newApp').directive('myPackageCard', function() {
    return {
        restrict: 'A',
        scope: {
            package : '=',
            masterCollections: '='
        },
        controller : function($auth,$scope,toaster,Wishlist,$route,$uibModal,$mdDialog,Packages,ZoloCollection){
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


            $scope.pausedAll = function(){
                $scope.goForVocationLoader = true;
                Packages.PackagesPaused(window.localStorage['user_id']).then(function(data){
                    console.log(data);
                    Profile.myProfile().then(function(data) {
                        $scope.profile = data.data.data;
                        Packages.getUserPackages(window.localStorage['user_id']).then(function(data){
                            $scope.user_packages = data.data;
                            toaster.pop({
                                type: 'success',
                                title: 'Packages Paused Successfully',
                                body: '',
                                showCloseButton: true
                            });
                        });
                    });

                });
            };
            $scope.activeAll = function(){
                $scope.goForVocationLoader = true;
                Packages.PackagesActive(window.localStorage['user_id']).then(function(data){
                    console.log(data);
                    Profile.myProfile().then(function(data) {
                        $scope.profile = data.data.data;
                        Packages.getUserPackages(window.localStorage['user_id']).then(function(data){
                            $scope.user_packages = data.data;
                            toaster.pop({
                                type: 'success',
                                title: 'Packages Active Successfully',
                                body: '',
                                showCloseButton: true
                            });
                        });
                        $scope.goForVocationLoader = false;
                    });
                });
            };
            $scope.activate = function(p){
                //$scope.myStyle={'visibility':'visible'};
                //$scope.status_changing = true;
                Packages.updateData({'status':'ACTIVE'},p.id).then(function(){
                    $scope.myStyle={'visibility':'hidden'};
                    $scope.status_changing = false;
                    p.status = 'ACTIVE';
                    toaster.pop({
                        type: 'success',
                        title: 'Package Activate Successfully',
                        body: '',
                        showCloseButton: true
                    });
                });
            };

            $scope.deletePackage=function(id){
                //delete the package
                var confirm = $mdDialog.confirm()
                    .title('Would you like to delete your package?')
                    .textContent('')
                    .ariaLabel('')
                    .targetEvent()
                    .ok('Yes')
                    .cancel('No');
                $mdDialog.show(confirm).then(function() {
                    Packages.doDeletePackage(id)
                        .success(function (data) {
                            //$scope.response = data;
                            console.log(data);
                            toaster.pop({
                                type: 'success',
                                title: 'Packages Delete Successfully',
                                body: '',
                                showCloseButton: true
                            });
                            $route.reload();

                           /* Packages.getUserPackages(window.localStorage['user_id']).then(function(data){
                                console.log('my package');
                                $scope.user_packages = data.data;
                                console.log($scope.user_packages);
                                toaster.pop({
                                    type: 'success',
                                    title: 'Packages Delete Successfully',
                                    body: '',
                                    showCloseButton: true
                                });
                                $route.reload();
                                //$location.path('/dashboard/my-packages');
                            });*/

                        })
                        .error(function (data) {
                           // $scope.response = data;
                            console.log(data);
                        });
                }, function() {

                });





            };




            $scope.pause = function(p){
                $scope.myStyle={'visibility':'visible'};
                $scope.status_changing = true;
                Packages.updateData({'status':'PAUSED'},p.id).then(function(){
                    $scope.myStyle={'visibility':'hidden'};
                    $scope.status_changing = false;
                    p.status = 'PAUSED';
                    toaster.pop({
                        type: 'success',
                        title: 'Package Paused Successfully',
                        body: '',
                        showCloseButton: true
                    });
                });
            };


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
                        collection.package_collection_status = true;
                    });
                }
                else{
                    ZoloCollection.removePackage({packages_ids:package_id,collection_id:collection.id},function(data){
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




            /* Handle Like Comment */
            /*$('.profil-content').on('click', '.like', function() {
                $(this).toggleClass('liked');
            });
*/

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
        templateUrl : "../../views/myPackageCard.html"
    }
});
