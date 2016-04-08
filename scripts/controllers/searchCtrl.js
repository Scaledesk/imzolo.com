'use strict';

/**
 * @ngdoc function
 * @name newappApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the newappApp
 */
/*
angular.module('newApp')
    .controller('searchCtrl', ['$scope', function ($scope) {

    }]);
*/


angular.module('newApp').controller('searchCtrl', function ($document,toaster,$route,ZoloCollection,Wishlist,Notification,Category,City,$filter, Packages, $scope, $location, $auth, $http, $routeParams,PackageTypes) {
    //$document.scrollTop(0);

    $scope.$on('$viewContentLoaded', function () {
        window.localStorage['url'] = '';
        $scope.loading = true;
        $scope.initializingFrom = true;
        $scope.initializingTo = true;
        $scope.range = {
            from: 0,
            to: 200000
        };
        Packages.getMaxPrice().then(function (data) {
            $scope.max_price = data.data.data;
            $scope.range = {
                from: 0,
                to: $scope.max_price
            };
            $scope.RangeOptions = {
                floor: 0,
                ceil: $scope.max_price,
                step: 500
            };
          //  $scope.updateSearchResults();
        });
        $scope.SerchloaderStyle={'visibility':'hidden'};
        $scope.clear =function(){
            toaster.pop({
                type: 'success',
                title: '',
                body: 'All filter are clear',
                showCloseButton: true
            });
            $location.search({});
            $route.reload();
        };
        PackageTypes.get(function(data){
            $scope.package_types=data.data;
            //console.log($scope.package_types);
        });
        City.get().then(function(response) {
           // console.log('city');
            //console.log(response);
            $scope.master_addresses = response.data.city;
            //console.log($scope.master_addresses);
        });
        Category.get(function (data) {
            $scope.cat = data.data;
            $scope.categories = $filter('filter')($scope.cat, { parent_id: null });
        });
        $scope.deliveryTime = [1, 2, 3, 4, 5, 6];
        $scope.selectedTab = 1;
        if ($location.search().query) {
            $scope.searchQuery = $location.search().query;
        }
        if ($location.search().location) {
            $scope.selectedLocations = $location.search().location;
            console.log($scope.selectedLocations);
        }

        $scope.packages = [];
        $scope.morepackages = [];
        $scope.searching = true;
        $scope.bool = false;
        $scope.rate = 3;
        $scope.curr_page = 1;
        $scope.pagination = {};
        $scope.toggle = false;
        //  $activityIndicator.startAnimating();
       // $scope.loading_more = false;
        $scope.sortBy = '';
        //$scope.sortBy = 'id';
        $scope.address = {
            'id' : $location.search().id,
            'name' : $location.search().name,
            'state' : $location.search().state
        };
        //get collection

        ZoloCollection.get({user_id:window.localStorage['user_id']},function(data){
            $scope.collections=data.data;
        });
     });
    //$scope.loading = true;
    $scope.isLoggedIn = function(){
        if($auth.isAuthenticated()){
            return true;
        }
        else{
            return false;
        }
    };
    $scope.changeSortBy=function(){
        if($scope.sortBy==="price_ltoh"){
            $scope.sortBy="price_htol"
        }else{
            $scope.sortBy="price_ltoh"
        }
        $scope.updateSearchResults();
    };
    $scope.refreshAddresses = function(query) {
        $scope.addresses =  $filter('filter')($scope.master_addresses, { name: query });
    };
    $scope.selectedPackageTypes = [];
    $scope.selectedDeliveryTime = [];
    /*$scope.result_location= [
            {"id":"1","name":"Gurgaon","state":"Haryana"},
            {"id":"2","name":"Mumbai","state":"Maharashtra"},
            {"id":"3","name":"Pune","state":"Maharashtra"},
            {"id":"4","name":"Ghaziabad","state":"UP"},
            {"id":"5","name":"Jaipur","state":"Rajasthan"},
            {"id":"6","name":"Chandigarh","state":"Punjab"},
            {"id":"7","name":"Any where in India","state":""}
        ];*/
    $scope.result_location= [
        {"name":"Delhi"},
        {"name":"Gurgaon"},
        {"name":"Noida"},
        {"name":"Greater Noida"},
        {"name":"All India"}
    ];

//console.log('first');
    $scope.searchPackage = function (location, searchQuery, categories, days, from, to, sortBy,nextpage) {
        console.log(nextpage);
        var q = '';
        if(sortBy)
        {
            q = q+'&sort_by='+sortBy;
        }
        if(location){
         q = q+'&location='+location;
         }
        /*if($scope.location){
            q = q+'&location='+$scope.location;
        }*/
        if($scope.selectedPackageTypes){
            q = q+'&packages_types='+$scope.selectedPackageTypes;
        }
        if(searchQuery)
        {
            q = q+'&query='+searchQuery;
        }
        if(categories && categories != '')
        {
            q = q+'&category_id='+categories;
        }
        if(days && days != '')
        {
            q = q+'&mdd='+days;
        }
        if(from != undefined)
        {
            q = q+'&min_price='+from;
        }
        if(to)
        {
            q = q+'&max_price='+to;
        }
        if(nextpage !=0 || nextpage)
        {
            q = q+'&page='+($scope.pagination.current_page+1);
            $scope.loading_more = true;
        }
        else{
            $scope.searching=true;
        }
        //alert($scope.selectedDeliveryTime);
        Packages.searchResult(q)
            .success(function (data) {

                if(nextpage == 0)
                {
                    $scope.packages = data.data;
                    if(data.meta===undefined){
                        $scope.pagination = 0;
                    }else{
                        $scope.pagination = data.meta.pagination;
                    }



//split the array of packages in rows of three three packages
                        if($scope.packages.length!=0){
                            console.log($scope.packages);
                            var packages_local=$scope.packages;
                            var rows=[];
                            for(var i=0;i< Math.ceil(packages_local.length/3);i++){
                                rows[i]=[];
                                for(var j=i*3;j<(i*3)+3;j++){
                                    if(j<packages_local.length){
                                        rows[i].push(packages_local[j]);
                                    }
                                }
                            }
                            $scope.package_rows=rows;
                            console.log($scope.package_rows);
                            $scope.loading = false;
                        }
                    $scope.SerchloaderStyle={'visibility':'hidden'};
                    $scope.loading = false;
                }
                else{

                    angular.forEach(data.data,function(p){
                        $scope.packages.push(p) ;
                    });
                    console.log($scope.packages);
                    $scope.pagination = data.meta.pagination;
                    console.log('pagination');
                    console.log($scope.pagination);
                    $scope.loading = false;
                    $scope.SerchloaderStyle={'visibility':'hidden'};
                }
                //split the array of packages in rows of three three packages
                if($scope.packages.length!=0){
                    console.log($scope.packages);
                    var packages_local=$scope.packages;
                    var rows=[];
                    for(var i=0;i< Math.ceil(packages_local.length/3);i++){
                        rows[i]=[];
                        for(var j=i*3;j<(i*3)+3;j++){
                            if(j<packages_local.length){
                                rows[i].push(packages_local[j]);
                            }
                        }
                    }
                    $scope.package_rows=rows;
                    console.log($scope.package_rows);

                    $scope.loading = false;
                }
                $scope.loading_more = false;
                $scope.searching = false;
                $scope.SerchloaderStyle={'visibility':'hidden'};
                // $activityIndicator.stopAnimating();
            })
            .error(function (data) {
                $scope.response = data;
                $scope.searching = false;
                $scope.loading = false;
                $scope.loading_more = false;
                $scope.SerchloaderStyle={'visibility':'hidden'};
                //$activityIndicator.stopAnimating();
            });
    };

    /**
     *
     * @type {{from: number, to: number}}
     */
    // $scope.max = 15;
    $scope.selectedCategories = [];
    $scope.updateSearchResults = function () {
        $scope.loading = true;
        var from = $scope.range.from;
        var to = $scope.range.to;
        // var from = $scope.slider.minValue;
        //var to = $scope.slider.maxValue;
        $scope.searchPackage($scope.selectedLocations,$scope.searchQuery,$scope.selectedCategories, $scope.selectedDeliveryTime, from, to, $scope.sortBy,0);
    };

    $scope.loadMoreResults = function () {
        $scope.loading_more = true;
        var from = $scope.range.from;
        var to = $scope.range.to;
       // $scope.loading = true;
        $scope.SerchloaderStyle={'visibility':'visible'};
        $scope.searchPackage($scope.selectedLocations,$scope.searchQuery,$scope.selectedCategories, $scope.selectedDeliveryTime, from, to, $scope.sortBy,1);
    };




    $scope.$watch('range.from', function (newValue, oldValue) {

        if ($scope.initializingFrom) {
             $scope.initializingFrom = false;
        } else {
            $scope.updateSearchResults();
        }
        //console.log($scope.range);
        //$scope.updateSearchResults();
    });
    $scope.$watch('range.to', function (newValue, oldValue) {
        if ($scope.initializingTo) {
            $scope.initializingTo = false;
        } else {
            $scope.updateSearchResults();
        }
        //console.log($scope.range);
        //$scope.updateSearchResults();
    });
    $scope.newSearch = function () {
        console.log($scope.searchQuery);
        console.log("ok");
        console.log($scope.searchQuery);
        if ($scope.searchQuery && $scope.selectedLocations) {
            console.log("1");
            $location.search({'location': $scope.selectedLocations, 'query': $scope.searchQuery});
        }
        else {
            if($scope.searchQuery==''){
                console.log("2 : empty");
                $location.search({'query': ''});
            }
            if ($scope.searchQuery) {
                console.log("2");
                $location.search({'query': $scope.searchQuery});
            }
            if ($scope.selectedLocations) {
                console.log("3");
                $location.search({'location': $scope.selectedLocations});
            }
        }
        $location.path('/');
        //$location.path('/result');
    };
    $scope.sort = function(data){
        $scope.sortBy = data;
        $scope.updateSearchResults();
    };



    //Colections
    $scope.$on('collectionAdded', function (event, args) {
        ZoloCollection.get({user_id:window.localStorage['user_id']},function(data){
            $scope.collections = data.data;
            $scope.updateSearchResults();

        });
    });


});