'use strict';

angular.module('newApp').controller('profileCtrl', function ($scope,Aws,$window,Packages,ZoloCollection,Profile,Upload,toaster,$uibModal) {
    $scope.$on('$viewContentLoaded', function() {
        //$uibModal,Wishlist,Activate,Profile,Aws, $timeout, $http, $scope,$rootScope, $location, Packages, $routeParams,
        $scope.max = 3;
        $scope.portfolio ={};
        $scope.document = {};
        $scope.validation = {};
        $scope.edit_profile = false;
        $scope.edit_profile_button = "Edit Profile";
        $scope.animationsEnabled=true;
        Profile.myProfile().then(function (data) {
            $scope.profile = data.data.data;
            $scope.birth_date = new Date($scope.profile.birth_date);
            console.log($scope.profile);
        });

        Profile.getMyPortfolio().then(function (data) {
            $scope.portfolios = data.data.data;
            console.log('portfolio');
            console.log(data);
        });
        Packages.getUserPackages(window.localStorage['user_id']).then(function(data){
            console.log('my package');
            $scope.user_packages = data.data;
            console.log($scope.user_packages);
        });
        ZoloCollection.get({user_id:window.localStorage['user_id']},function(data){
            $scope.collections=data.data;
            console.log('my collection');
            console.log($scope.collections);
        });
        Aws.get().then(function(data){
            $scope.policy = data.data.policy;
            $scope.signature = data.data.signature;
            $scope.key = data.data.key;
        });
        $scope.getKey = function(){
            var length = 40;
            var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            var result = '';
            for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
            return result;
        };
        $scope.uploadBanner = function(banner){
           // $scope.file = banner;
            var fileKey = $scope.getKey() +'.'+  banner.name.split('.').pop();
            Upload.upload({
                skipAuthorization: true,
                url: 'https://scaledesk.s3.amazonaws.com/', //S3 upload url including bucket name
                method: 'POST',
                data: {
                    key: fileKey, // the key to store the file on S3, could be file name or customized
                    AWSAccessKeyId: $scope.key,
                    acl: 'public-read', // sets the access to the uploaded file in the bucket: private, public-read, ...
                    policy: $scope.policy, // base64-encoded json policy (see article below)
                    signature: $scope.signature, // base64-encoded signature based on policy string (see article below)
                    "Content-Type": banner.type != '' ? banner.type : 'application/octet-stream', // content type of the file (NotEmpty)
                    file: banner
                }
            }).then(function (response) {
                //$timeout(function () {
                $scope.UploadResult = response.data;
                $scope.profile.banner = 'https://scaledesk.s3.amazonaws.com/' + fileKey;
                $scope.updateProfile();
                //});
            }, function (response) {
                if (response.status > 0){
                    $scope.errorMsg = response.status + ': ' + response.data;
                    toaster.pop({
                        type: 'error',
                        title: 'Uploading Error',
                        body: 'Please try again',
                        showCloseButton: true
                    })
                }
            }, function (evt) {
                banner.progress = Math.min(100, parseInt(100.0 *
                    evt.loaded / evt.total));
            });
        };

        $scope.uploadPortfolio = function (file) {
            var fileKey = $scope.getKey() +'.'+  file.name.split('.').pop();
            $scope.portfolio.file = 'https://scaledesk.s3.amazonaws.com/' + fileKey;
            Upload.upload({
                skipAuthorization: true,
                url: 'https://scaledesk.s3.amazonaws.com/', //S3 upload url including bucket name
                method: 'POST',
                data: {
                    key: fileKey, // the key to store the file on S3, could be file name or customized
                    AWSAccessKeyId: $scope.key,
                    acl: 'public-read', // sets the access to the uploaded file in the bucket: private, public-read, ...
                    policy: $scope.policy, // base64-encoded json policy (see article below)
                    signature: $scope.signature, // base64-encoded signature based on policy string (see article below)
                    "Content-Type": file.type != '' ? file.type : 'application/octet-stream', // content type of the file (NotEmpty)
                    file: file
                }
            }).then(function (response) {
                //$timeout(function () {
                    $scope.UploadResult = response.data;
                    console.log($scope.UploadResult);
                    $scope.savePortfolio();
                //});
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 *
                    evt.loaded / evt.total));
            });
        };

        $scope.edit_profile=false;
        $scope.openProfilePicModal = function () {
            var ProfilePicModal = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'user/profile/profilePicModal.html',
                controller: 'profilePicModalCtrl',
                size:'lg',
                resolve: {
                    profile: function () {
                        return $scope.profile;
                    }

                }
            });
            profilePicModal.result.then(function () {
              //  $scope.user_profile = angular.copy($scope.profile);
                /*Profile.myProfile().then(function (data) {
                    $scope.profile = data.data.data;
                    console.log($scope.profile);
                });*/
                //$scope.selected = selectedItem;
            }, function () {
                //$log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.updateProfile = function(){

            Profile.update(window.localStorage['user_id'],$scope.profile).then(function(){
                toaster.pop({
                    type: 'success',
                    title: 'Updated Successfully',
                    body: 'you have successfully updated',
                    showCloseButton: true
                });
                if($scope.profile.is_seller == 1){
                    if($scope.selectedIndex != $scope.max){
                        $scope.selectedIndex = $scope.selectedIndex+1;
                    }
                }
            });
        };
        $scope.updateFirstTab = function(){
            if($scope.profile.step_number ==null){
                $scope.profile.step_number = 1;
            }
            $scope.profile.birth_date = $scope.birth_date
            //$scope.birth_date = new Date();
            if($scope.validation.name){
                $window.document.getElementById('name').focus();
                return false;
            }
            $scope.updateProfile();
        };
        $scope.saveAndNext = function(){
            if($scope.profile.step_number ==1){
                $scope.profile.step_number = 2;
            }
            $scope.updateProfile();
            if($scope.selectedIndex != $scope.max){
                $scope.selectedIndex = $scope.selectedIndex+1;
            }
        };
        $scope.savePortfolio=function(){
            Profile.addPortfolio($scope.portfolio).then(function(){
                toaster.pop({
                    type: 'success',
                    title: 'Save Successfully',
                    body: 'you have successfully portfolio',
                    showCloseButton: true
                });
                if(!$scope.selectedIndex == $scope.max){
                    $scope.selectedIndex = $scope.selectedIndex+1;
                }
            });
        };
        $scope.updateDocument = function(doc){
            // $scope.file = banner;
            var fileKey = $scope.getKey() +'.'+  doc.name.split('.').pop();
            Upload.upload({
                skipAuthorization: true,
                url: 'https://scaledesk.s3.amazonaws.com/', //S3 upload url including bucket name
                method: 'POST',
                data: {
                    key: fileKey, // the key to store the file on S3, could be file name or customized
                    AWSAccessKeyId: $scope.key,
                    acl: 'public-read', // sets the access to the uploaded file in the bucket: private, public-read, ...
                    policy: $scope.policy, // base64-encoded json policy (see article below)
                    signature: $scope.signature, // base64-encoded signature based on policy string (see article below)
                    "Content-Type": doc.type != '' ? doc.type : 'application/octet-stream', // content type of the file (NotEmpty)
                    file: banner
                }
            }).then(function (response) {
                //$timeout(function () {
                $scope.UploadResult = response.data;
                $scope.document.file = 'https://scaledesk.s3.amazonaws.com/' + fileKey;
                $scope.saveDocument();
                //});
            }, function (response) {
                if (response.status > 0){
                    $scope.errorMsg = response.status + ': ' + response.data;
                    toaster.pop({
                        type: 'error',
                        title: 'Uploading Error',
                        body: 'Please try again',
                        showCloseButton: true
                    })
                }
            }, function (evt) {
                banner.progress = Math.min(100, parseInt(100.0 *
                    evt.loaded / evt.total));
            });
        };
        $scope.saveDocument = function(){
            $scope.updateProfile();
        };


        $scope.skills=["Accounting","Administrative","Computer","Conflict Management","Strategy MAnagement","Convencing"];
        $scope.nextTab = function() {
            /*var index = ($scope.selectedIndex == $scope.max) ? 0 : $scope.selectedIndex + 1;
            $scope.selectedIndex = index;*/
            if($scope.selectedIndex!=$scope.max){
                $scope.selectedIndex = $scope.selectedIndex +1;
            }
        };

        $scope.backTab = function() {
            if($scope.selectedIndex!=0){
                $scope.selectedIndex = $scope.selectedIndex -1;
            }
        };

        $scope.saveProfile = function(){
            if($scope.validation.name){
                $window.document.getElementById('name').focus();
                return false;
            }
            Profile.update(window.localStorage['user_id'],$scope.profile).then(function(){
                toaster.pop({
                    type: 'success',
                    title: 'Updated Successfully',
                    body: 'you have successfully updated',
                    showCloseButton: true
                });
                $scope.edit_profile = false;
            });
        };

        /*$scope.profilewizard=function(){
            $scope.edit_profile = true;
            //$scope.edit_profile_button = "Edit Profile";
            /!*if($scope.edit_profile==true){
                $scope.edit_profile = false;
                $scope.edit_profile_button = "Edit Profile";
            }
            else{
                $scope.edit_profile = true;
                $scope.edit_profile_button = "Hide";
            }*!/
        };*/

        $scope.selectPortfolio = function(portfolio){
            $scope.portfolio_selected = true;
            $scope.selected_portfolio = portfolio;
        };
        $scope.backtoportfolio = function(){
            $scope.portfolio_selected = false;
            $scope.selected_portfolio = {};
        };




        $scope.validateProfileName = function(){
        if($scope.profile.name==='' || $scope.profile.name===undefined) {
            $scope.validation.name = true;
        }
            else {
            var AllowRegex  = /^[a-zA-Z @]+$/;
            //var AllowRegex  = /^[\ba-zA-Z\s-]$/;
//            return AllowRegex.test($scope.profile.name);
            if (!AllowRegex.test($scope.profile.name)) {
                //return true;
                $scope.validation.name = true;
            }
            else {
               // return false;
                $scope.validation.name = false;
            }
        }

        };

        /*prettyPrint();
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
        });*/
        $scope.docType = [
            {
                "name":"Adhar Card"
            },
            {
                "name":"PAN Vard"
            },
            {
                "name":"Voter ID"
            },
            {
                "name":"Passport"
            },
            {
                "name":"Driving Licence"
            }
        ]
    });
});
