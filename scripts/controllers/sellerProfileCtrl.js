'use strict';

angular.module('newApp').controller('sellerProfileCtrl', function ($scope,Profile,Packages,$routeParams) {

    $scope.$on('$viewContentLoaded', function() {

        /*Profile.myProfile().then(function (data) {
            $scope.profile = data.data.data;
            console.log($scope.profile);
        });*/



        $scope.other_user_id = $routeParams.other_user_id;
        Profile.get($scope.other_user_id).then(function (data) {
            $scope.profile = data.data.data;
            console.log($scope.profile);
            Packages.getPackagesByUserId($scope.other_user_id).then(function(data){
                $scope.other_user_packages = data.data;
                console.log($scope.other_user_packages);
                Profile.getReviews($scope.other_user_id).then(function(data){
                    $scope.other_user_reviews = data.data.data;
                    console.log($scope.other_user_reviews);
                });
            });
        });



        Profile.getSellerPortfolio($scope.other_user_id).then(function (data) {
            $scope.portfolios = data.data.data;
            console.log('portfolio');
            console.log(data);
        });

/*
        prettyPrint();
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
*/


    });
});
