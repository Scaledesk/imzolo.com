angular.module('newApp').controller('editPackageCtrl', function ($document,$window,Upload,$routeParams,myPageCtx,pluginsService,Aws,$auth,City,$filter,PaymentTypes, $timeout, Packages, Activate, Category, Tags, $http, $scope, $location,toaster) {
    $scope.$on('$viewContentLoaded', function () {
        if(!$auth.isAuthenticated()){
            $location.path('/login');
        }

        $scope.froalaOptions = {
            placeholderText: "Package Description",
            toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', '|', 'color', 'emoticons', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', '-', 'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'insertTable', '|', 'quote', 'insertHR', 'undo', 'redo', 'clearFormatting', 'selectAll', 'html']
        };
        $scope.package = {};
        Tags.get(function(data){
            $scope.tags = data.data;
            console.log($scope.tags);
        });

        /*Category.get({},function(response){
            $scope.category= response.data;
            console.log($scope.category);
        });*/
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





        Packages.packagesType().then(function(data){
            $scope.packagesType = data.data.data;
            console.log('package type');
            console.log($scope.packagesType);
        });
        $scope.myStyle={'visibility':'hidden'};
        $scope.saving = false;
        Packages.show($routeParams.id)
            .success(function(data) {
                console.log(data.data);
                $scope.pData = data.data;
                photos_to_be_processed=$scope.pData.photos.data;
                angular.forEach(photos_to_be_processed,function(obj){
                    photos.push(obj.url);
                });

                var i=0;
                angular.forEach(photos,function(photo){
                    document.getElementById('images_to_show').innerHTML=document.getElementById('images_to_show').innerHTML+'&nbsp;<figure style="display: inline-block;"><img width="150px" height="auto" src="'+photo+'"/>' +
                        '<figcaption style="cursor: pointer;"> <a onClick="deletePhoto('+i+')"> <i class="fa fa-times-circle"></i><small class="text-danger">Delete Image</small></a></figcaption></figure> ';
                    i++;
                });

                console.log($scope.pData.photos);
                if(data.data.tags.data != undefined && data.data.tags.data.length != 0)
                {
                    $scope.p = data.data.tags.data;
                }
                else{
                    $scope.p = [];
                }
                $scope.package.status = data.data.status;
                $scope.package.name = data.data.name;
                $scope.package.category_id = data.data.category.data.id;
                $scope.package.price = data.data.price;
                $scope.package.deal_price = data.data.deal_price;
                $scope.package.location = data.data.location;
                $scope.package.description = data.data.description;
                $scope.package.delivery_time_type = data.data.delivery_time_type;
                $scope.package.delivery_time = data.data.delivery_time;
                $scope.package.introduction = data.data.introduction;
                $scope.package.deliverable = data.data.deliverables;
                $scope.package.different_from_others = data.data.different_from_others;
                $scope.package.facebook_links = data.data.facebook_links;
                $scope.package.any_other_links = data.data.any_other_links;
                $scope.package.youtube_links = data.data.youtube_links;
                $scope.package.instructions = data.data.instructions;
                $scope.package.packages_type = data.data.PackagesTypes.data.id;
                $scope.package.meeting_availability = data.data.meeting_availability;

                $scope.package.term_condition = data.data.term_condition;

                if(data.data.Addons.data !=undefined || data.data.Addons.data.length !=0){
                    $scope.addons=data.data.Addons.data;
                }
                else{
                    $scope.addons = [{id: '1'}];
                }


                //console.log($scope.package);
            });

        $scope.validation_error = {};
        $scope.locations = [
            { text: 'India' },
            { text: 'Gurgaon' },
            { text: 'Mumbai' },
            { text: 'Pune' },
            { text: 'Ghaziabad' },
            { text: 'Jaipur' },
            { text: 'Chandigarh' },
            { text: 'New Delhi' }
        ];
    });


    $scope.changeTitle = function(){
        if($scope.package.name === undefined || $scope.package.name.length < 20 || $scope.package.name.length > 100){

            $scope.validation_error.package_name =true;
        }
        else{
            $scope.validation_error.package_name = false;
        }
    }

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

    $scope.loadLocations = function(val){
        return $filter('filter')($scope.locations,{text:val});
    };
    $scope.loadTags = function(val){
        return $filter('filter')($scope.tags,{text:val});
    };


    $scope.installment_total_number_list = [
        {
            'id': 1,
            'name': 'One'
        },
        {
            'id': 2,
            'name': 'Two'
        },
        {
            'id': 3,
            'name': 'Three'
        }
    ];



    $scope.save = function(status){

        /*if($scope.package.name === undefined || $scope.package.name.length < 70 || $scope.package.name.length > 90)
        {
            $scope.validation_error.package_name = 'Package Title is required and must be within 70 to 90 characters'
            return false;
        }
        if($scope.package.category_id === undefined || $scope.package.category_id === null || $scope.package.category_id == '-1')
        {
            $scope.validation_error.category = 'Package Category must be selected';
            return false;
        }
        if($scope.package.price === undefined || $scope.package.price === null || $scope.package.category_id < 0)
        {
            $scope.validation_error.price = 'Package Price is required and must be a positive number';
            return false;
        }
        if($scope.package.location === undefined || $scope.package.location.length === undefined || $scope.package.location.length === null || $scope.package.location.length < 0)
        {
            $scope.validation_error.location = 'Select atleast one location';
            return false;
        }
        if($scope.package.description === undefined || $scope.package.description < 120)
        {
            $scope.validation_error.description = 'Package Description is required and must be minimum 120 characters long';
            return false;
        }
        if($scope.package.delivery_time_type === undefined || $scope.package.delivery_time_type === null)
        {
            $scope.validation_error.package_delivery_time_type = 'Package Delivery Time is required';
            return false;
        }*/

         if($scope.package.name === undefined || $scope.package.name.length < 20 || $scope.package.name.length > 100)
         {
         $scope.validation_error.package_name = true;
         $scope.selectedIndex = 0;
         $window.document.getElementById('title').focus();
         $document.scrollTop(0);
            /* var someElement = angular.element(document.getElementById('title'));
             $document.scrollToElement(someElement, 20);*/
         return false;
         }
         else if($scope.package.category_id==undefined || $scope.package.category_id==''){
         console.log('category');
         $scope.validation_error.package_category=true;
         $scope.selectedIndex = 0;
         $window.document.getElementById('category').focus();
             /*var someElement = angular.element(document.getElementById('category'));
             $document.scrollToElement(someElement, 20);*/
         return false;
         }
         else if($scope.package.location === undefined || $scope.package.location === '')
         {
         console.log('location');
         $scope.validation_error.package_location = true;
         $scope.selectedIndex = 0;
         $window.document.getElementById('location').focus();
             /*var someElement = angular.element(document.getElementById('location'));
             $document.scrollToElement(someElement, 20);*/
         return false;
         }
         else if($scope.package.packages_type === undefined || $scope.package.packages_type === '')
         {
         console.log('package type');
         $scope.validation_error.package_type = true;
          $scope.selectedIndex = 0;
         $window.document.getElementById('package_type').focus();
         $document.scrollTop(0);
         return false;
         }// first tab complete
         else if ($scope.package.description == undefined || $scope.package.description =='' || $scope.package.description > 4000) {
         $scope.validation_error.package_description = true;
         $scope.selectedIndex = 1;
         $window.document.getElementById('description').focus();
         $document.scrollTop(0);
         return false;
         } // second tab completed
         else if ($scope.package.price === undefined || $scope.package.price ==='' ) {
         $scope.validation_error.package_price = true;
         $scope.selectedIndex = 2;
         $window.document.getElementById('actual_price').focus();
         $document.scrollTop(0);
         return false;
         }
         else if (($scope.package.deal_price != '' || $scope.package.deal_price !=undefined) && $scope.package.deal_price > $scope.package.price ) {
         //console.log('inside');
         $scope.validation_error.package_deal_price = true;
         $scope.selectedIndex = 2;
         $window.document.getElementById('deal_price').focus();
         $document.scrollTop(0);
         return false;
         }
         else if ($scope.package.delivery_time_type === undefined || $scope.package.delivery_time_type ==='' ) {
         console.log('type');
         $scope.validation_error.delivery_time_type = true;
         $scope.selectedIndex = 2;
         $window.document.getElementById('delivery_time_type').focus();
         //$document.scrollTop(0);
         return false;
         }
         else if ($scope.package.delivery_time_type === 'days' && ($scope.package.delivery_time ==='' || $scope.package.delivery_time ===undefined) ) {
         console.log('time');
         $scope.validation_error.delivery_time_days = true;
         $scope.selectedIndex = 2;
         $window.document.getElementById('delivery_time_days').focus();
         //  $document.scrollTop(0);
         return false;
         }
         else if ($scope.package.delivery_time_type === 'hours' && ($scope.package.delivery_time ==='' || $scope.package.delivery_time ===undefined) ) {
         console.log('time');
         //$scope.validation_error.delivery_time_houre = true;
         $scope.selectedIndex = 2;
         $window.document.getElementById('delivery_time_hours').focus();
         //    $document.scrollTop(0);
         return false;
         }// third tab completed
         else if ($scope.package.meeting_availability === undefined || $scope.package.meeting_availability ==='' ) {
         $scope.validation_error.meeting_availability = true;
         $scope.selectedIndex = 4;
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
         }

        /*// pass new assigned array of photos
        $scope.package.photos=photos;
        $scope.savePackage($scope.package);*/
    };
    $scope.savePackage = function (packageData) {
        $scope.saving = true;
       // $scope.myStyle={'visibility':'visible'};
        angular.forEach(packageData.photos,function(value,key) {
            if (thumbnail === value) {
                temp = packageData.photos[0];
                packageData.photos[0] = packageData.photos[key];
                packageData.photos[key] = temp;
            }
        });
        var tags = [];
        angular.forEach($scope.p,function(value){
            tags.push(value.value);
        });
        packageData.tags = tags.join(',');
        //packageData.status = status;
        Packages.updateData(angular.toJson(packageData,2),$scope.pData.id)
            .success(function(data) {
                $scope.response = data;
                console.log(data);
                toaster.pop('success','Your package is Updated successfully.');
                $scope.myStyle={'visibility':'hidden'};
                $scope.saving = false;
               $scope.nextTab();
                //$scope.myStyle={'visibility':'hidden'};
                //$location.path('/dashboard/my-packages');
            })
            .error(function(data) {
                console.log(data);
                toaster.pop('error','Some error occurred try again!');
                $scope.response = data;
            });

    };


    $scope.addNewAddon= function() {
        var newItemNo = $scope.addons.length+1;
        $scope.addons.push({'id':newItemNo});

    };

    $scope.removeAddon = function(id) {
        /*  var item;
         var index=0;
         console.log($scope.addons);*/
        /*$scope.addons.forEach(function(){
         if(id===$scope.addons.id){
         var item=$scope.addons[index];
         console.log(item);
         }
         index++;
         });*/
        var item=$scope.addons[id];
        $scope.addons.splice(id,1);
    };


    $scope.savePackageAddons = function (packageData) {
        data={addons:packageData};
        console.log(data);
        console.log(angular.toJson(data, 2));
        $scope.myStyle={'visibility':'visible'};
        $scope.saving = true;
        Packages.updateData(angular.toJson(data, 2),$scope.pData.id)
            .success(function (data) {
                $scope.response = data;
                toaster.pop('success','Your package saved successfully with the addons.');
                $scope.saving = false;
                $scope.myStyle={'visibility':'hidden'};
                $location.path('/dashboard/my-packages');
            })
            .error(function (data) {
                console.log(data);
                toaster.pop('error','Some error occurred try again!');
                $scope.saving = false;
                $scope.myStyle={'visibility':'hidden'};
                $scope.response = data;
            });

    };

    /*$scope.update = function(){
        Packages.updateData($scope.package,$scope.pData.id).then(function(){

        });
    }*/
});
