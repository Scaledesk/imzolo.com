angular.module('newApp').controller('profilePicModalCtrl', function ($timeout,Aws,Upload,ZoloCollection,$uibModalInstance, Profile, $rootScope, $scope, UserProfile, $auth, $location,profile) {
    Aws.get().then(function(data){
        $scope.policy = data.data.policy;
        $scope.signature = data.data.signature;
        $scope.key = data.data.key;
    });
    $scope.profile = profile;
    $scope.getKey = function(){
        length = 40;
        chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
        return result;
    };
    $scope.myStyle={'visibility':'hidden'};
    $scope.upload_button_text = 'Upload';
    $scope.upload = function (file,blobUrl) {
        $scope.myStyle={'visibility':'visible'};
        console.log("here");
        //$scope.upload_button_text = 'Uploading..';
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


    };

    $scope.updateProfile = function(){
        $scope.profile.experiences=$scope.experiences;
        Profile.update(window.localStorage['user_id'],$scope.profile).then(function(){
            $scope.user_profile = $scope.profile;
            $scope.$emit('profileUpdated', { message: "u" });
            $uibModalInstance.close()
        });

    };


    $scope.cloaseModal = function(){
        $uibModalInstance.dismiss();

    }
});