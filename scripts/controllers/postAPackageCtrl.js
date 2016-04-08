angular.module('newApp').controller('postAPackageCtrl', function ($document,$window,Upload,myPageCtx,pluginsService,Aws,$auth,City,$filter,PaymentTypes, $timeout, Packages, Activate, Category, Tags, $http, $scope, $location,toaster) {
    //floara
    $scope.froalaOptions = {
        placeholderText: "Please type here....",
        toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', '|', 'color', 'emoticons', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', '-', 'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'insertTable', '|', 'quote', 'insertHR', 'undo', 'redo', 'clearFormatting', 'selectAll', 'html']
    };
    $scope.update=function(){
        alert("fires");
    };
    $scope.save_success = false;
    $scope.completed_first = true;
    $scope.completed_second = true;
    $scope.completed_third = true;
    $scope.completed_fourth = true;
    $scope.completed_package = true;
    $scope.loaderStyle={'visibility':'hidden'};
    $scope.package={};
    //$scope.package.category_id=1;
    //$scope.sub_category=[];
    $scope.selected_category_id={
        value:1
    };
    $scope.$on('$viewContentLoaded', function () {
        if (!$auth.isAuthenticated()) {
            $location.path('/login');
        }
        myPageCtx.menuBar='dashboard';
        pluginsService.init();
        Aws.get().then(function(data){
            $scope.policy = data.data.policy;
            $scope.signature = data.data.signature;
            $scope.key = data.data.key;
        });
        $scope.validation_error = {
            "package_name":false
        };
        Category.get({},function(response){
           $scope.master_category= response.data;
            console.log('master_category');
            console.log($scope.master_category);
            $scope.category=$scope.pCategory();
            console.log('category');
            console.log($scope.category);
        });



        $scope.pCategory = function(){
            return $filter('filter')($scope.master_category, { parent_id: null });
        };
        $scope.subCategory = function() {
            $scope.sub_category  = $filter('filter')($scope.master_category, { parent_id: $scope.package.category_id });
            $scope.validation_error.package_category=false
        };
        console.log($scope.category);
        Tags.get(function(data){
            $scope.tags = data.data;
            console.log($scope.tags);
        });
        Packages.packagesType().then(function(data){
                $scope.packagesType = data.data.data;
            console.log('package type');
            console.log($scope.packagesType);
        });
        $scope.locations = [
            { text: 'Delhi' },
            { text: 'Gurgaon' },
            { text: 'Noida' },
            { text: 'Greater Noida' },
            { text: 'India' }
        ];
        $scope.package.photos = [];
        $scope.package.payment_types = [1];
    });
    $scope.is_open = true;
    $scope.invalidFiles = [];
    //floara
    $scope.froalaOptions = {
        placeholderText: "Please type here...",
        toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', '|', 'color', 'emoticons', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'insertTable', '|', 'quote', 'insertHR', 'undo', 'redo', 'clearFormatting', 'selectAll', 'html']
    };
    $scope.froalaOptions1 = {
        placeholderText: "Package Terms and Conditions",
        toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', '|', 'color', 'emoticons', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', '-', 'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'insertTable', '|', 'quote', 'insertHR', 'undo', 'redo', 'clearFormatting', 'selectAll', 'html']
    };

    $scope.refreshAddresses = function(query) {
        $scope.addresses =  $filter('filter')($scope.master_addresses, { name: query });
    };


    $scope.loadLocations = function(val){
        return $filter('filter')($scope.locations,{text:val});
    };

    $scope.loadTags = function(val){
        return $filter('filter')($scope.tags,{text:val});
    };


    $scope.savePackage = function (packageData,status) {

        angular.forEach(packageData.photos,function(value,key) {
            if (thumbnail === value) {
                temp = packageData.photos[0];
                packageData.photos[0] = packageData.photos[key];
                packageData.photos[key] = temp;
            }
        });
        console.log(packageData);
        $scope.loaderStyle={'visibility':'visible'};
        if(status == 'DRAFT')
        {
            $scope.draft_button_text = 'Saving..';
        }
        if(status == 'ACTIVE')
        {
            $scope.draft_button_text = 'Publishing..';
        }
        if($scope.package.deal_price == '' || $scope.package.deal_price == undefined){
            $scope.package.deal_price = $scope.package.price;
        }
        //$scope.saving = true;
        var tags = [];
        console.log(packageData.tags);
        angular.forEach(packageData.tags ,function(value){
            tags.push(value.value);
        });
        packageData.tags = tags.join(',');
        console.log(packageData.tags);
        packageData.status = status;
        Packages.addPackage(angular.toJson(packageData,2))
            .success(function(data) {
                toaster.pop('success','Your package is saved successfully. Now add some addons, if you want.');
                //$location.path('/dashboard/my-packages');
                console.log(data);
                $scope.package_id=data.package_id;
                $scope.completed_package = false;
          //      $scope.saving = false;
                $scope.loaderStyle={'visibility':'hidden'};
                $scope.nextTab();
            })
            .error(function(data) {
                console.log(data);
                toaster.pop('error','Some error occurred try again!');
                $scope.response = data;
            });

    };
    $scope.location = {};
    $scope.$watch('package.installment_total_number', function (newValue, oldValue) {
            if (newValue) {
                $scope.package.installments = [];
                for (var i = 1; i <= newValue.id; i++) {
                    $scope.package.installments.push(new Object({'installment_number': i}));
                }
            }
        }
    );
    $scope.$watch('location.selected', function (newValue, oldValue) {
            if (newValue) {
                $scope.package.location = newValue.name;
            }
        }
    );

    $scope.getKey = function(){
        length = 40;
        chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
        return result;

    };

    $scope.save = function(status){


       /* if($scope.package.name === undefined || $scope.package.name.length < 20 || $scope.package.name.length > 100)
        {
            $scope.validation_error.package_name = true;
            $scope.required_title = true;
            //$scope.selectedIndex = 0;
            $window.document.getElementById('title').focus();
            //$document.scrollTop(0);
            $document.scrollToElement('title');
            return false;
        }
        else if($scope.package.category_id==undefined || $scope.package.category_id==''){
            console.log('category');
            $scope.validation_error.package_category=true;
            //$scope.selectedIndex = 0;
            $window.document.getElementById('category').focus();
            //$document.scrollTop(0);
            $document.scrollToElement(category);
            return false;
        }
        else if($scope.package.location === undefined || $scope.package.location === '')
        {
            console.log('location');
            $scope.validation_error.package_location = true;
            //$scope.selectedIndex = 0;
            $window.document.getElementById('location').focus();
            $document.scrollTop(0);
            return false;
        }
        else if($scope.package.packages_type === undefined || $scope.package.packages_type === '')
        {
            console.log('package type');
            $scope.validation_error.package_type = true;
            // $scope.selectedIndex = 0;
            $window.document.getElementById('package_type').focus();
            $document.scrollTop(0);
            return false;
        }// first tab complete
        else if ($scope.package.description == undefined || $scope.package.description =='' || $scope.package.description > 4000) {
            $scope.validation_error.package_description = true;
            //$scope.selectedIndex = 1;
            $window.document.getElementById('description').focus();
            $document.scrollTop(0);
            return false;
        } // second tab completed
        else if ($scope.package.price === undefined || $scope.package.price ==='' ) {
            $scope.validation_error.package_price = true;
            //$scope.selectedIndex = 2;
            $window.document.getElementById('actual_price').focus();
            $document.scrollTop(0);
            return false;
        }
        else if (($scope.package.deal_price != '' || $scope.package.deal_price !=undefined) && $scope.package.deal_price > $scope.package.price ) {
            //console.log('inside');
            $scope.validation_error.package_deal_price = true;
            //$scope.selectedIndex = 2;
            $window.document.getElementById('deal_price').focus();
            $document.scrollTop(0);
            return false;
        }
        else if ($scope.package.delivery_time_type === undefined || $scope.package.delivery_time_type ==='' ) {
            console.log('type');
            $scope.validation_error.delivery_time_type = true;
            //$scope.selectedIndex = 2;
            $window.document.getElementById('delivery_time_type').focus();
            //$document.scrollTop(0);
            return false;
        }
        else if ($scope.package.delivery_time_type === 'days' && ($scope.package.delivery_time ==='' || $scope.package.delivery_time ===undefined) ) {
            console.log('time');
            $scope.validation_error.delivery_time_days = true;
            //$scope.selectedIndex = 2;
            $window.document.getElementById('delivery_time_days').focus();
            //  $document.scrollTop(0);
            return false;
        }
        else if ($scope.package.delivery_time_type === 'hours' && ($scope.package.delivery_time ==='' || $scope.package.delivery_time ===undefined) ) {
            console.log('time');
            //$scope.validation_error.delivery_time_houre = true;
            //$scope.selectedIndex = 2;
            $window.document.getElementById('delivery_time_hours').focus();
            //    $document.scrollTop(0);
            return false;
        }// third tab completed
        else if ($scope.package.meeting_availability === undefined || $scope.package.meeting_availability ==='' ) {
            $scope.validation_error.meeting_availability = true;
            //$scope.selectedIndex = 2;
            $window.document.getElementById('meeting_availability').focus();
            //$document.scrollTop(0);
            return false;
        }
        else {
            //save photos to the package
            //console.log(photos);
            $scope.package.photos = photos;
            // console.log(thumbnail);
            //console.log($window.document.getElementById('thumbnail').value());
            //console.log(thumbnail);
            $scope.savePackage($scope.package, status);
        }*/
        $scope.package.photos = photos;
        $scope.savePackage($scope.package, status);
    };




    $scope.max = 5;
    $scope.selectedIndex = 0;
    $scope.backTab = function() {
        if($scope.selectedIndex!=0){
            $scope.selectedIndex = $scope.selectedIndex -1;
        }

    };
    $scope.nextTab = function() {
       // var index = ($scope.selectedIndex == $scope.max) ? 0 : $scope.selectedIndex + 1;
        //$scope.selectedIndex = index;
        if($scope.selectedIndex!=$scope.max){
            $scope.selectedIndex = $scope.selectedIndex +1;
        }
    };


    //Addons
    if($scope.addons===undefined||$scope.addons.length===0){
        $scope.addons = [{id: '1'}];
    }
    $scope.addNewAddon= function() {
        var newItemNo = $scope.addons.length+1;
        $scope.addons.push({'id':newItemNo});

    };

    $scope.removeAddon = function(id) {
        var item=$scope.addons[id];
        $scope.addons.splice(id,1);
    };

    //  Add a comment to this line
    $scope.savePackageAddons = function (packageData) {

        /*if($scope.package.name === undefined || $scope.package.name.length < 30 || $scope.package.name.length > 100)
        {
            $scope.validation_error.package_name = true;
            //$scope.selectedIndex = 0;
            $window.document.getElementById('title').focus();
            return false;
        }
        else if($scope.package.category_id==undefined || $scope.package.category_id==''){
            console.log('category');
            $scope.validation_error.package_category=true;
            //$scope.selectedIndex = 0;
            $window.document.getElementById('category').focus();
            return false;
        }
        else{
            $scope.completed_first = false;
            /!*if($scope.selectedIndex!=$scope.max){
             //console.log($scope.selectedIndex);
             //$scope.selectedIndex = $scope.selectedIndex +1;
             $scope.selectedIndex = 1;
             }*!/
            $scope.selectedIndex = 1;
        }*/




        data={addons:packageData};
        console.log(data);
        console.log(angular.toJson(data, 2));
        Packages.updateData(angular.toJson(data, 2),$scope.package_id)
            .success(function (data) {
                $scope.response = data;
                toaster.pop('success','Your package saved successfully with the addons.');
                $location.path('/dashboard/my-packages');
            })
            .error(function (data) {
                console.log(data);
                toaster.pop('error','Some error occurred try again!');
                $scope.response = data;
            });

    };



$scope.showTooltip = false;

    $scope.checkValidationFirst =function() {
        if($scope.package.name === undefined || $scope.package.name.length < 20 || $scope.package.name.length > 100)
         {
            $scope.validation_error.package_name = true;
             $scope.required_title = true;
             //$scope.selectedIndex = 0;
             $window.document.getElementById('title').focus();
             //$document.scrollTop(0);
             $document.scrollToElement('title');
         return false;
         }
         else if($scope.package.category_id==undefined || $scope.package.category_id==''){
            console.log('category');
            $scope.validation_error.package_category=true;
            //$scope.selectedIndex = 0;
            $window.document.getElementById('category').focus();
            //$document.scrollTop(0);
            $document.scrollToElement(category);
             return false;
          }
        else if($scope.package.location === undefined || $scope.package.location === '')
        {
            console.log('location');
            $scope.validation_error.package_location = true;
            //$scope.selectedIndex = 0;
            $window.document.getElementById('location').focus();
            $document.scrollTop(0);
            return false;
        }
        else if($scope.package.packages_type === undefined || $scope.package.packages_type === '')
        {
            console.log('package type');
            $scope.validation_error.package_type = true;
           // $scope.selectedIndex = 0;
            $window.document.getElementById('package_type').focus();
            $document.scrollTop(0);
            return false;
        }
        else{
            $scope.completed_first = false;
            /*if($scope.selectedIndex!=$scope.max){
                //console.log($scope.selectedIndex);
                //$scope.selectedIndex = $scope.selectedIndex +1;
                $scope.selectedIndex = 1;
            }*/
            $document.scrollTop(0);
            $scope.selectedIndex = 1;
        }

        /* if($scope.package.price === undefined || $scope.package.price === null || $scope.package.category_id < 0)
         {
         $scope.validation_error.price = 'Package Price is required and must be a positive number';
         var someElement = angular.element(document.getElementById('price'));
         $document.scrollToElementAnimated(someElement,20);
         return;
         }
         if(!$scope.package.price.match(/^[0-9]/)){
         $scope.validation_error.price = "Please enter valid amount, amount must be a number";
         var someElement = angular.element(document.getElementById('price'));
         $document.scrollToElementAnimated(someElement,20);
         return;
         }
         if($scope.package.location === undefined || $scope.package.location.length === undefined || $scope.package.location.length === null || $scope.package.location.length < 0)
         {
         $scope.validation_error.location = 'Select atleast one location';
         var someElement = angular.element(document.getElementById('location'));
         $document.scrollToElementAnimated(someElement,20);
         return;
         }
         if($scope.package.description === undefined || $scope.package.description < 120)
         {
         $scope.validation_error.description = 'Package Description is required and must be minimum 120 characters long';
         var someElement = angular.element(document.getElementById('description'));
         $document.scrollToElementAnimated(someElement,20);
         return;
         }
         if($scope.package.delivery_time_type === undefined || $scope.package.delivery_time_type === null)
         {
         $scope.validation_error.package_delivery_time_type = 'Package Delivery Time is required';
         var someElement = angular.element(document.getElementById('delivery_time_type'));
         $document.scrollToElementAnimated(someElement);
         return;
         }
         if($scope.agreement != true)
         {
         $scope.validation_error.terms = 'You must read and agree to our terms of service';
         var someElement = angular.element(document.getElementById('agree'));
         $document.scrollToElementAnimated(someElement);
         return;
         }*/
    };
    $scope.checkValidationSecond =function() {
        if ($scope.package.description == undefined || $scope.package.description =='' || $scope.package.description > 4000) {
            $scope.validation_error.package_description = true;
            //$scope.selectedIndex = 1;
            $window.document.getElementById('description').focus();
            $document.scrollTop(0);
            return false;
        }
        else {
            $scope.completed_second = false;
            /*if($scope.selectedIndex!=$scope.max){
             //console.log($scope.selectedIndex);
             //$scope.selectedIndex = $scope.selectedIndex +1;
             $scope.selectedIndex = 1;
             }*/
            $scope.selectedIndex = 2;
            $document.scrollTop(0);
        }
    };
    $scope.checkValidationThird =function() {
        if ($scope.package.price === undefined || $scope.package.price ==='' ) {
            $scope.validation_error.package_price = true;
            //$scope.selectedIndex = 2;
            $window.document.getElementById('actual_price').focus();
            $document.scrollTop(0);
            return false;
        }
        else if (($scope.package.deal_price != '' || $scope.package.deal_price !=undefined) && $scope.package.deal_price > $scope.package.price ) {
                //console.log('inside');
                $scope.validation_error.package_deal_price = true;
                //$scope.selectedIndex = 2;
                $window.document.getElementById('deal_price').focus();
            $document.scrollTop(0);
                return false;
        }
        else if ($scope.package.delivery_time_type === undefined || $scope.package.delivery_time_type ==='' ) {
            console.log('type');
            $scope.validation_error.delivery_time_type = true;
            //$scope.selectedIndex = 2;
            $window.document.getElementById('delivery_time_type').focus();
            //$document.scrollTop(0);
            return false;
        }
        else if ($scope.package.delivery_time_type === 'days' && ($scope.package.delivery_time ==='' || $scope.package.delivery_time ===undefined) ) {
            console.log('time');
            $scope.validation_error.delivery_time_days = true;
            //$scope.selectedIndex = 2;
            $window.document.getElementById('delivery_time_days').focus();
          //  $document.scrollTop(0);
            return false;
        }
        else if ($scope.package.delivery_time_type === 'hours' && ($scope.package.delivery_time ==='' || $scope.package.delivery_time ===undefined) ) {
            console.log('time');
            //$scope.validation_error.delivery_time_houre = true;
            //$scope.selectedIndex = 2;
            $window.document.getElementById('delivery_time_hours').focus();
        //    $document.scrollTop(0);
            return false;
        }
        else{
            $scope.completed_third = false;
            $scope.selectedIndex = 3;
            $document.scrollTop(0);
        }
    };
    $scope.checkValidationFourth =function() {
            $scope.completed_fourth = false;
            $scope.selectedIndex = 4;
        $document.scrollTop(0);
    };
    $scope.checkValidationFifth =function(status) {
        if ($scope.package.meeting_availability === undefined || $scope.package.meeting_availability ==='' ) {
            $scope.validation_error.meeting_availability = true;
            //$scope.selectedIndex = 2;
            $window.document.getElementById('meeting_availability').focus();
            //$document.scrollTop(0);
            return false;
        }
        else{
            $scope.save(status);
        }
    };






    $scope.changeTitle = function(){
        if($scope.package.name === undefined || $scope.package.name.length < 20 || $scope.package.name.length > 100){

            $scope.validation_error.package_name =true;
        }
        else{
            $scope.validation_error.package_name = false;
        }
    }









});
