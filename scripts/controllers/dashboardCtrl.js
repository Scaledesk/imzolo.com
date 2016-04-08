angular.module('newApp')
// inject the Activation service into our controller
    .controller('dashboardCtrl', function($route,$document, $auth,$mdDialog, $filter,$uibModal,Wishlist,Activate,Profile,Aws, $timeout, $http, $scope,$rootScope, $location, Packages, $routeParams,ChangePassword,UserRole,ZoloCollection,referral,myPageCtx,toaster) {
        //$document.scrollTop(0);
        //dashboardService.init();
        $scope.$on('$viewContentLoaded', function () {
            if (!$auth.isAuthenticated()) {
                $location.path('/login');
            }
            else{
                myPageCtx.menuBar='dashboard';
                if($routeParams.target=='' || $routeParams.target== undefined){
                    $scope.target = 'my-dashboard';
                    console.log($scope.target);
                }
                else{
                    $scope.target = $routeParams.target;
                }

                Packages.getSellerPackages(window.localStorage['user_id']).then(function(data){
                    $scope.my_seles = data.data;
                    console.log('my sales');
                    console.log($scope.my_seles);
                });
                Packages.getBuyerPackages(window.localStorage['user_id']).then(function(data){
                    $scope.my_purchases = data.data;
                    console.log('my purchases');
                    console.log($scope.my_purchases);
                });

                if($routeParams.target=='my-packages'){
                    Packages.getUserPackages(window.localStorage['user_id']).then(function(data){
                        console.log('my package');
                        $scope.user_packages = data.data;
                        console.log($scope.user_packages);
                    });
                }
                if($routeParams.target=='my-wishlist'){
                Wishlist.get(window.localStorage['user_id']).then(function(data){
                    $scope.user_wishlist = data.data.data;
                    console.log('my wishlist');
                    console.log($scope.user_wishlist);
                });
                }


                if($routeParams.target=='my-collection'){
                    $scope.loading_collection = false;
                    getCollection2=function(){
                        $scope.loading_collection = true;
                        ZoloCollection.get({user_id:window.localStorage['user_id']},function(data){
                            $scope.collections=data.data;
                            $scope.loading_collection = false;
                            console.log('my collection');
                            console.log($scope.collections);
                        });
                    };
                    getCollection2();
                }

                Profile.myProfile().then(function(data){
                    $scope.profile = data.data.data;
                    console.log($scope.profile);
                    if(data.data.data.is_seller==="1"){
                        window.localStorage['is_seller'] = "seller";
                        $scope.user_role=window.localStorage['is_seller'];
                    }else{
                        window.localStorage['is_seller'] = "buyer";
                        $scope.user_role=window.localStorage['is_seller'];
                    }
                    $scope.user_role=window.localStorage['is_seller'];
                    if($scope.profile.is_seller == 0)
                    {
                        $scope.become_seller_text = 'Become Seller';
                    }else{
                        $scope.become_seller_text = 'Add a Package';
                    }
                    if($scope.profile.experiences!=undefined){
                        $scope.experiences = $scope.profile.experiences;
                    }
                    else{
                        $scope.experiences = [];
                    }
                    $scope.dashboard_loading = false;
                    //$rootScope.profile = $scope.profile;


                });
                Aws.get().then(function(data){
                    $scope.policy = data.data.policy;
                    $scope.signature = data.data.signature;
                    $scope.key = data.data.key;
                });
            }


        });

        $scope.user_role=window.localStorage['is_seller'];
        /*$scope.wishlistCurrentPage = 1;
        $scope.wishlistItemsPerPage = 6;*/
        local_user_id=window.localStorage['user_id'];
        //$scope.profile_target = 'overview';
        $scope.changeProfileTarget = function(value){
            $scope.profile_target = value;
        };
//floara
        $scope.froalaOptions = {
            toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', '|', 'color'/*, 'emoticons'*/, 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', '-', /*'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'insertTable', '|', 'quote', 'insertHR',*/ 'undo', 'redo'/*, 'clearFormatting', 'selectAll', 'html'*/]
        };
        $scope.skills=["Accounting","Administrative","Computer","Conflict Management","Strategy MAnagement","Convencing"];
        /**
         * Collections
         */

        $scope.addPackageToCollection=function(package_id,collection_id){
            ZoloCollection.addPackage1({packages_ids:package_id,collection_id:collection_id},function(data){
                getCollection2();
            });
        };
        $scope.deleteCollection1=function(collection_id){
            var confirm = $mdDialog.confirm()
                .title('Would you like to delete your package from this collection?')
                .textContent('')
                .ariaLabel('')
                .targetEvent()
                .cancel('No')
                .ok('Yes');
            $mdDialog.show(confirm).then(function() {
                ZoloCollection.deleteCollection({id:collection_id},function(data){
                    toaster.pop({
                        type: 'success',
                        title: 'Deleted',
                        body: 'Collection deleted successfully!',
                        showCloseButton: true
                    });
                    getCollection2();
                });
            }, function() {
            });
        };
        $scope.saveCollection=function(collection){
            collection.user_id=window.localStorage['user_id'];
            ZoloCollection.addCollection(collection,function(data){
                getCollection2();
            });
        };
        $scope.disabled = false;
        $scope.dashboard_loading = true;
        $scope.removeWishlist = function(item){
            item.wishlist_removed_loader = true;
            Wishlist.remove({'user_id' : window.localStorage['user_id'],'package_id' : item.id}).then(function () {
                Wishlist.get(window.localStorage['user_id']).then(function(data){
                    $scope.user_wishlist = data.data.data;
                    item.wishlist_removed_loader = false;
                });
            });
        };
        $scope.updateProfile = function(){
            $scope.loading_text = 'Saving Changes';
            $scope.profile_updated = false;
            $scope.disabled = true;
            $scope.profile.experiences=$scope.experiences;
            Profile.update(window.localStorage['user_id'],$scope.profile).then(function(){
                $scope.loading_text = 'Save Changes';
                $scope.disabled = false;
                $scope.profile_updated = true;
                console.log("updated");
                $scope.user_profile = angular.copy($scope.profile);
                console.log($scope.user_profile);
                $scope.$emit('profileUpdated', { message: "u" });
            });

        };
        $scope.getKey = function(){
            length = 40;
            chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

            var result = '';
            for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
            return result;

        };
        $scope.addNewExp = function() {
            var newItemNo = $scope.experiences.length+1;
            $scope.experiences.push({'id':'experience'+newItemNo});
        };
        $scope.removeExp = function(id) {
            var item;
            $scope.experiences.forEach(function(){
                if(id===$scope.experiences.id){
                    var item=$scope.experiences[id-1]
                };
            })
            $scope.experiences.splice(item,1);
        };
        $scope.upload = function (file,blobUrl) {
            var fileUplad = Upload.dataUrltoBlob(blobUrl);
            $scope.file = file;
            //$scope.errFile = errFile;
            //angular.forEpach(files,function(file){
            file.key = $scope.getKey() +'.'+  file.name.split('.').pop();
            $scope.profile.image = 'https://scaledesk.s3.amazonaws.com/' + file.key;
            Upload.upload({
                skipAuthorization: true,
                url: 'https://scaledesk.s3.amazonaws.com/', //S3 upload url including bucket name
                method: 'POST',
                data: {
                    key: file.key, // the key to store the file on S3, could be file name or customized
                    AWSAccessKeyId: $scope.key,
                    acl: 'public-read', // sets the access to the uploaded file in the bucket: private, public-read, ...
                    policy: $scope.policy, // base64-encoded json policy (see article below)
                    signature: $scope.signature, // base64-encoded signature based on policy string (see article below)
                    "Content-Type": file.type != '' ? file.type : 'application/octet-stream', // content type of the file (NotEmpty)
                    file: fileUplad
                }
            }).then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                    $scope.updateProfile();
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 *
                    evt.loaded / evt.total));
            });
            //});
        };
        $scope.step = 1;
        $scope.becomeSeller = function(){
            $scope.profile.is_seller = 1;
            Profile.update(window.localStorage['user_id'],$scope.profile).then(function(){
                $scope.become_seller_text = 'Add a Package';
            });
            $location.path('/add-package');
        };
        $scope.goForVocationLoader = false;
        $scope.pausedAll = function(){
            $scope.goForVocationLoader = true;
            Packages.PackagesPaused().then(function(data){
                console.log(data);
                Profile.myProfile().then(function(data){
                    $scope.profile = data.data.data;
                    console.log($scope.profile);
                    Packages.getUserPackages(window.localStorage['user_id']).then(function(data){
                        console.log('my package');
                        $scope.user_packages = data.data;
                        console.log($scope.user_packages);
                    });
                    $scope.goForVocationLoader = false;
                });

            });
        };
        $scope.activeAll = function(){
            $scope.goForVocationLoader = true;
            Packages.PackagesActive().then(function(data){
                console.log(data);
                Profile.myProfile().then(function(data){
                    console.log('profile');
                    $scope.profile = data.data.data;

                    Packages.getUserPackages(window.localStorage['user_id']).then(function(data){
                        console.log('my package');
                        $scope.user_packages = data.data;
                        console.log($scope.user_packages);
                    });
                    $scope.goForVocationLoader = false;
                });
            });
        };
        $scope.myStyle={'visibility':'hidden'};
        $scope.status_changing = false;
        $scope.activate = function(p){
            $scope.myStyle={'visibility':'visible'};
            $scope.status_changing = true;
            Packages.updateData({'status':'ACTIVE'},p.id).then(function(){
                $scope.myStyle={'visibility':'hidden'};
                $scope.status_changing = false;
                p.status = 'ACTIVE';
            });
        };
        $scope.deletePackage=function(id){
            //delete the package
            Packages.doDeletePackage(window.localStorage['user_id'],id)
                .success(function (data) {
                    $scope.response = data;
                    Packages.getUserPackages(window.localStorage['user_id']).then(function(data){
                        $scope.user_packages = data.data;
                    });
                    /*$location.path('/dash/my-packages');*/
                })
                .error(function (data) {
                    $scope.response = data;
                });
        };
        $scope.pause = function(p){
            $scope.myStyle={'visibility':'visible'};
            $scope.status_changing = true;
            Packages.updateData({'status':'PAUSED'},p.id).then(function(){
                $scope.myStyle={'visibility':'hidden'};
                $scope.status_changing = false;
                p.status = 'PAUSED';
            });
        };

        $scope.target = $routeParams.target;
        $scope.changeAction=function(value){
            $location.path('/dashboard/'+value);
        };
        $scope.settings_error = null;
        $scope.password_updated = null;
        $scope.password_succefully_changed = false
        $scope.passwordError = 0;
        $scope.changePassword=function(request){
            if(request == undefined)
            {
                $scope.settings_error = 'Old Password is required';
                return;
            }
            if(request.old_password == undefined || request.old_password == '')
            {
                $scope.settings_error = 'Old Password is required';
                return;
            }
            if(request.new_password == undefined || request.new_password == '')
            {
                $scope.settings_error = 'New Password is required';
                return;
            }
            /*if(request.new_password == undefined || request.new_password == '')
             {
             $scope.settings_error = 'New Password is required';
             return;
             }*/
            if(request.confirm_password != request.new_password)
            {
                $scope.settings_error = 'New Password and confirmation password should match.';
                return;
            }
            $scope.disabled  = true;
            request.user_id=window.localStorage['user_id'];
            ChangePassword.update(request).$promise.then(function(a) {
                $scope.settings_error = null;
                $scope.password_updated = true;
                $scope.disabled  = false;
                $scope.passwordError = 0;
                $scope.password_succefully_changed = true;
                toaster.pop({
                    type: 'success',
                    title: 'Password Changes',
                    body: 'Login Again!',
                    showCloseButton: true
                });
                $scope.logout();
            },function(a){
                $scope.passwordError = 1;
                console.log(a);
                // $scope.error_messages = a.data.message;
                $scope.settings_error = a.data.message;
                $scope.password_updated = false;
                $scope.disabled  = false;

            })
        };




        $scope.logout = function(){
            window.localStorage.removeItem('is_seller');
            window.localStorage.removeItem('user_id');
            $rootScope.user_profile = {};
            $rootScope.profile = null;
            console.log($rootScope.user_profile);
            $auth.logout();
            $location.path('/login');
        };








        //Profile Pic Modal
        $scope.openProfilePicModal = function () {
            var ProfilePicModal = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: '../../views/profilePicModal.html',
                controller: 'ProfilePicModalController',
                resolve: {
                    profile: function () {
                        return $scope.profile;
                    }
                }
            });
            ProfilePicModal.result.then(function () {
                $scope.user_profile = angular.copy($scope.profile);
                //$scope.selected = selectedItem;
            }, function () {
                //$log.info('Modal dismissed at: ' + new Date());
            });
        };
        //Add collection Modal
        $scope.openAddCollectionModal = function () {

            var AddCollectionModal = $uibModal.open({
                animation: true,
                templateUrl: '../../views/add-collection-modal.html',
                controller: 'AddCollectionModalController',
                size: 'sm'
            });
            AddCollectionModal.result.then(function (data) {
                $scope.collections = data;
            }, function () {
                //$log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.doReferral=function(obj){
            referral.save(obj,function(response){
              $location.path('/referralThankYou/')
            })
        };

        //toasters
        if($location.search().status=='walletcredit_success'){
            toaster.pop('success','Amount successfully add to your wallet');
        }else if($location.search().status=='walletcredit_failed'){
            toaster.pop('error','Error!','Transaction failed');
        }
    });


