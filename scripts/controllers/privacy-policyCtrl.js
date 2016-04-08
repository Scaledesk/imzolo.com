'use strict';

angular.module('newApp')
    .controller('privacy-policyCtrl', ['$scope', function ($scope) {


        $scope.$on('$viewContentLoaded', function () {
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
        });






        /* Handle Comments Show / Hide */
        $('.profil-content').on('click', '.more-comments', function() {
            $(this).closest('.more').find('.share').slideUp(200, function() {
                $(this).closest('.more').find('.comments').slideToggle(200);
                $(this).closest('.more').find('.more-comments').toggleClass('active');
                $(this).closest('.more').find('.more-share').removeClass('active');
            });
        });


        /* Handle Like Comment */
        $('.profil-content').on('click', '.like', function() {
            $(this).toggleClass('liked');
        });

        /* Handle Share Show / Hide */
        $('.profil-content').on('click', '.more-share', function() {
            $(this).closest('.more').find('.comments').slideUp(200, function() {
                $(this).closest('.more').find('.share').slideToggle(200);
                $(this).closest('.more').find('.more-share').toggleClass('active');
                $(this).closest('.more').find('.more-comments').removeClass('active');
            });
        });



    }]);
