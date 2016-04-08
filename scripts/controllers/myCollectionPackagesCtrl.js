/**
 * Created by tushar on 25/12/15.
 */
collectioncontroller=function($scope,ZoloCollection,toaster,$mdDialog,$routeParams,serverConfig){
    $scope.collectionPackageLoader = true;
    $scope.loading_collection_package = false;
    getCollection2=function(){
        $scope.loading_collection_package = true;
        ZoloCollection.getCollection({id:$routeParams.id},function(data){
            $scope.collection= data.data;
            $scope.loading_collection_package = false;
            console.log('collection package details');
            console.log($scope.collection);
        });
    };
    //$scope.myCollectionPackagesPerPage = 6;
    //$scope.myCollectionPackagesCurrentPage = 1;
    getCollection2();
    $scope.removeFromCollection=function(item,collection_id){
        //item.l = true;
        ZoloCollection.removePackage({packages_ids:item.id,collection_id:collection_id},function(data){
            getCollection2();
            toaster.pop({
                type: 'success',
                title: 'Package Deleted',
                body: 'Package deleted from your collection list',
                showCloseButton: true
            });
        });
    };
    $scope.showConfirm = function(item,collection_id) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title('Would you like to delete your package from this collection?')
            .textContent('')
            .ariaLabel('')
            .targetEvent()
            .ok('Yes')
            .cancel('No');
        $mdDialog.show(confirm).then(function() {
            $scope.removeFromCollection(item,collection_id);
        }, function() {

        });
    };


};
angular.module("newApp").controller('CollectionController',collectioncontroller);
