angular.module('newApp').controller('packagePageCtrl', function ($document,Address,toaster,$window,$uibModal,$mdDialog, $filter,Packages,Wallet,Wishlist, $scope, $location, $auth, $http,$routeParams,Message , ZoloCollection,$sce) {

    $scope.$on('$viewContentLoaded', function () {
        //prettyPrint();
        window.localStorage['url'] = '';
       $('.responsive-slick').slick({
            dots: true,
            infinite: false,
            speed: 300,
            slidesToShow: 3,
            slidesToScroll: 3,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        infinite: true,
                        dots: true
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });
    });

    var originatorEv;
    $scope.openMenu = function($mdOpenMenu, ev) {
        originatorEv = ev;
        $mdOpenMenu(ev);
    };
    $scope.announceClick = function(index) {
        $mdDialog.show(
            $mdDialog.alert()
                .title('You clicked!')
                .textContent('You clicked the menu item at index ' + index)
                .ok('Nice')
                .targetEvent(originatorEv)
        );
        originatorEv = null;
    };



    $scope.packagePaused = false;
    Packages.show($routeParams.id)
        .success(function(data) {
            $scope.package = data.data;
            if($scope.package.status=='PAUSED'){
                $scope.packagePaused = true;
            }
            if(window.localStorage['user_id']==$scope.package.seller_profile.user_id){
                $scope.sameUser = true;
            }
            else{
                $scope.sameUser = false;
            }
            $scope.seller_description=$sce.trustAsHtml($scope.package.seller_profile.description);
            $scope.wishlist_status = data.meta.wishlist_status;
            $scope.totalPrice = $scope.package.deal_price;
            //$scope.loading = false;
            $scope.booking.package_id = $scope.package.id;
            $scope.booking.package_timestamp = $scope.package.timestamp.date;
            $filter('date')($scope.package.timestamp.date, 'yyyy-MM-dd HH:mm:ss');
            console.log($scope.package);
            Packages.getPackagesByUserId($scope.package.seller_profile.user_id).success(function(data){
                $scope.sellerOtherPackages = data.data;
                console.log($scope.sellerOtherPackages);
            });
            $scope.truncatedDescription = $scope.truncate($scope.package.description,1200);
            $scope.package.description = $sce.trustAsHtml($scope.package.description);
        });

    $scope.package = {};
    $scope.booking = {
    };
    //$document.scrollTop(0);
    $scope.selectedaddons = [];
    $scope.description = {isTruncated: true,textLength : 100};
       $scope.getCollection2=function(){
         ZoloCollection.get({user_id:window.localStorage['user_id']},function(data){console.log(data.data);
            $scope.Collections=data.data;

            angular.forEach($scope.Collections,function(collection){
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
            })
        });
    };
    if($auth.isAuthenticated()){
        $scope.getCollection2();
    }
    $scope.openAddCollectionModal = function () {
        var AddCollectionModal = $uibModal.open({
            animation: true,
            templateUrl: 'user/collection/add-collection-modal.html',
            controller: 'AddCollectionModalController',
            size: 'sm'
        });
        AddCollectionModal.result.then(function (data) {
            $scope.collections = data;
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















    $scope.isLoggedIn = function(){
        if($auth.isAuthenticated()){
            return true;
        }
        else{
            return false;
        }
    };


    $scope.updateTotalPrice = function(){
        var temp = $scope.package.deal_price;
        $scope.booking.addons.forEach(function(p){
            temp = temp + p.amount;
        });
        $scope.totalPrice = temp;
    };

    $scope.bookNowClicked = function(){
        $scope.booking.package_id = $scope.package.id;
        $scope.booking.bonus_id = $scope.package.bonus_id;

        if($scope.selectedaddons.length > 0)
        {
            $scope.booking.addons = $scope.selectedaddons.join();
        }
        $scope.openBookPackageModal();



    };

    //Booking Modal

   /* $scope.openBookPackageModal = function () {

        var BookPackageModal = $uibModal.open({
            animation: true,
            templateUrl: 'templates/book-package-modal.html',
            controller: 'BookPackageModalController',
            size: 'lg',
            resolve: {
                packageSelected: function () {
                    return $scope.package;
                },
                booking : function(){
                    return $scope.booking;
                },
                selectedAddons : function(){
                    return $scope.selectedaddons;
                },
                is_custom:function(){
                    return false;
                },
                message_id:function(){
                    return null;
                }
            }
        });

        BookPackageModal.result.then(function (data) {

        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };
   */
   /* $scope.openSendMessageToSeller = function () {
        if(!$auth.isAuthenticated())
        {
            return $scope.openSignInModal(false);
        }
        var MessageSellerModal = $uibModal.open({
            animation: true,
            templateUrl: 'templates/MessageSellerModal.html',
            controller: 'MessageSellerModalController',
            size: 'lg',
            resolve: {
                sender_id:function(){
                    return window.localStorage['user_id'];
                },
                receiver_id:function () {
                    return $scope.package.seller_profile.user_id;
                },
                receiver_name:function () {
                    return $scope.package.seller_profile.name;
                }
            }
        });

        MessageSellerModal.result.then(function (data) {

        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };
   */
   /* $scope.openMessageSellerCustomOffer = function () {
        if(!$auth.isAuthenticated())
        {
            return $scope.openSignInModal(false);
        }
        var openMessageSellerCustomOfferModal = $uibModal.open({
            animation: true,
            templateUrl: 'templates/MessageSellerCustomOffer.html',
            controller: 'MessageSellerCustomOfferController',
            size: 'lg',
            resolve: {
                sender_id:function(){
                    return window.localStorage['user_id'];
                },
                receiver_id:function () {
                    return $scope.package.seller_profile.user_id;
                },
                receiver_name:function () {
                    return $scope.package.seller_profile.name;
                },
                package_id:function(){
                    return $scope.package.id;
                },
                package_name_in_model:function(){
                    return $scope.package.name;
                }
            }
        });

        openMessageSellerCustomOfferModal.result.then(function (data) {

        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };
   */
    $scope.agreeClicked = function(){
        Packages.book($scope.booking);
        Wallet.debit({'user_id':window.localStorage['user_id'],'amount':$scope.totalPrice,'transaction_type':'debit'});
        $location.path('/dashboard');
    };
//wishlist function
/*
    $scope.addWishlist = function(){

        Wishlist.add({'user_id' : window.localStorage['user_id'],'package_id' : $scope.package.id}).then(function successCallback(response) {
            // this callback will be called asynchronously
            $scope.wishlist_status = true;
            // when the response is available
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    };
    $scope.removeWishlist = function(){
        $scope.wishlist_status = false;
        Wishlist.remove({'user_id' : window.localStorage['user_id'],'package_id' : $scope.package.id});
    };
*/

    $scope.truncate = function (text, length, end) {
        if (isNaN(length))
            length = 10;

        if (end === undefined)
            end = "...";

        if (text.length <= length || text.length - end.length <= length) {
            return text;
        }
        else {
            return String(text).substring(0, length-end.length) + end;
        }

    };
    $scope.sendMessageToSeller=function(message){
        message.user_id= window.localStorage['user_id'];
        message.receivers_id=$scope.package.seller.data.id;
        Message.save({todo:"send"},message,function(data){
            if(data.status_code==200) {
                alert("Message Send Successfully");
            }
        });
    };
    $scope.toggleDescriptionTruncation = function(){
        if($scope.description.isTruncated == true){
            $scope.truncatedDescription = $scope.package.description;
            $scope.description.isTruncated = false;
            return;
        }
        if($scope.description.isTruncated == false){
            $scope.truncatedDescription = $scope.truncate($scope.package.description,1200);
            $scope.description.isTruncated = true;
            return;
        }
    };


    //Add Collection Modal

    /*$scope.openAddCollectionModal = function () {

        var AddCollectionModal = $uibModal.open({
            animation: true,
            templateUrl: 'templates/add-collection-modal.html',
            controller: 'AddCollectionModalController',
            size: 'sm',

        });

        AddCollectionModal.result.then(function (data) {
            $scope.Collections = data;
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };
*/
    //Wishlist

/*
    $scope.addWishlist = function(){
        Wishlist.add({'user_id' : window.localStorage['user_id'],'package_id' : $scope.package.id}).then(function successCallback(response) {
            // this callback will be called asynchronously
            $scope.wishlist_status = true;
            // when the response is available
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    };
    $scope.removeWishlist = function(){

        $scope.wishlist_status = false;
        Wishlist.remove({'user_id' : window.localStorage['user_id'],'package_id' : $scope.package.id});
    };
*/

    $scope.getBuyNowAction = function(){
        if($auth.isAuthenticated()){
            return $scope.bookNowClicked();
        }
        else{
            $location.path('/login')
        }
    };

    $scope.show_addon = true;
    $scope.show_addon_checked = true;
    $scope.selected_addons_price = 0;
    $scope.changeSelectedAddonsPrice = function(addon,checked){
        if(checked == true)
        {
            $scope.selected_addons_price = $scope.selected_addons_price + addon.amount;
            $scope.show_addon_checked = false;
            $scope.show_addon = false;
            addon.style={background: '#F6F2F9'};
        }
        if(checked == false)
        {
            $scope.selected_addons_price = $scope.selected_addons_price - addon.amount;
            $scope.show_addon_checked = true;
            addon.style={};
        }
    };

    //booking the package

    $scope.booking=function(package_id){

        if (!$auth.isAuthenticated()) {
            window.localStorage['url'] =$location.url();
            console.log(window.localStorage['url']);
            $location.path('/login');
        }

        if(angular.isUndefined($scope.book)){
            $scope.book={};
        }
        $scope.book.package_id=package_id;
        if(!angular.isUndefined($scope.booking_addons)){
            $scope.book.addons=$scope.booking_addons.join();
        }
        Packages.book($scope.book).then(function(response){
            //redirect the user to the booking page
            console.log(response.data);
            $location.path('/booking/'+response.data.data.booking_id+'/'+response.data.data.id);
        },function(error){
            //do the logic if booking failed i.e unable to save the booking datails in the booking table
        });
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

    $scope.redirectLink = function (link) {
       // window.location.assign(link);
        //window.location.href='http://'+link;
        window.location.href=link;
    };






    $scope.initializeAddons=function(addon_id){
        if(!angular.isUndefined($scope.booking_addons)){
            $scope.booking_addons.push(addon_id);
        }else{
            $scope.booking_addons=[];
            $scope.booking_addons.push(addon_id);
        }
    };
    //custom offer
    $scope.openMessageSellerCustomOffer = function () {
        if(!$auth.isAuthenticated())
        {
            return $scope.openSignInModal(false);
        }
        var openMessageSellerCustomOfferModal = $uibModal.open({
            animation: true,
            templateUrl: '/app/views/MessageSellerCustomOffer.html',
            controller: 'MessageSellerCustomOfferController',
            size: 'lg',
            resolve: {
                /*sender_id:function(){
                    return window.localStorage['user_id'];
                },*/
                receiver_id:function () {
                    return $scope.package.seller_profile.user_id;
                },
                receiver_name:function () {
                    return $scope.package.seller_profile.name;
                },
                package_id:function(){
                    return $scope.package.id;
                },
                package_name_in_model:function(){
                    return $scope.package.name;
                }
            }
        });

        openMessageSellerCustomOfferModal.result.then(function (data) {

        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };
});
