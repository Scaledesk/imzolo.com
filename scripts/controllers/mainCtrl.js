angular.module('newApp').controller('mainCtrl',
    ['$scope', '$location', '$auth','Profile','$rootScope','myPageCtx','toaster',
        function ($scope, $location,$auth, Profile,$rootScope,myPageCtx,toaster) {
            $(document).ready(function () {
                //applicationService.init();
                /*quickViewService.init();
                builderService.init();
                pluginsService.init();*/
                Dropzone.autoDiscover = false;
            });
            $scope.$on('$viewContentLoaded', function () {
                //pluginsService.init();
                //applicationService.customScroll();
                //applicationService.handlePanelAction();
                $scope.searchQuery='';



//              console.log($location.path());
                $scope.munuItem = myPageCtx;
  //              console.log(myPageCtx);




                $('.nav.nav-sidebar .nav-active').removeClass('nav-active active');
                $('.nav.nav-sidebar .active:not(.nav-parent)').closest('.nav-parent').addClass('nav-active active');
                if($location.$$path == '/' || $location.$$path == '/layout-api'){
                    $('.nav.nav-sidebar .nav-parent').removeClass('nav-active active');
                    $('.nav.nav-sidebar .nav-parent .children').removeClass('nav-active active');
                    if ($('body').hasClass('sidebar-collapsed') && !$('body').hasClass('sidebar-hover')) return;
                    if ($('body').hasClass('submenu-hover')) return;
                    $('.nav.nav-sidebar .nav-parent .children').slideUp(200);
                    $('.nav-sidebar .arrow').removeClass('active');
                }
                if($location.$$path == '/'){
                    $('body').addClass('dashboard');
                }
                else{
                    $('body').removeClass('dashboard');
                }
                $.material.init();

                $(document).on('click.card', '.card', function (e) {
                    if ($(this).find('.card-reveal').length) {
                        if ($(e.target).is($('.card-reveal .card-title')) || $(e.target).is($('.card-reveal .card-title i'))) {
                            $(this).find('.card-reveal').velocity(
                                {translateY: 0}, {
                                    duration: 225,
                                    queue: false,
                                    easing: 'easeInOutQuad',
                                    complete: function() { $(this).css({ display: 'none'}) }
                                }
                           );
                        }
                        else if ($(e.target).is($('.card .activator')) ||
                                $(e.target).is($('.card .activator i')) ) {
                            $(this).find('.card-reveal').css({ display: 'block'}).velocity("stop", false).velocity({translateY: '-100%'}, {duration: 300, queue: false, easing: 'easeInOutQuad'});
                        }
                    }
                });

                if($auth.isAuthenticated()){
                    $scope.HeaderLoading = true;
                    Profile.myProfile().then(function (data) {
                        $rootScope.user_profile = data.data.data;
                        if(data.data.data.is_seller==="1"){
                            window.localStorage['is_seller'] = "seller";
                        }else{
                            window.localStorage['is_seller'] = "buyer";
                        }
                        //console.log($scope.user_profile);
                        $scope.HeaderLoading = false;
                    });
                }
            });
            $scope.isAuthenticated = function() {
                return $auth.isAuthenticated();
            };
            console.log($auth.isAuthenticated());
            $scope.newSearch = function () {
                $location.search({'query': $scope.searchQuery});
                $location.path('/');
            };
            $scope.logout = function() {
                window.localStorage.removeItem('is_seller');
                window.localStorage.removeItem('user_id');
                $rootScope.user_profile = {};
                $rootScope.profile = null;
                console.log($rootScope.user_profile);
                $auth.logout();
                toaster.pop({
                    type: 'success',
                    title: 'Logout',
                    body: 'you have successfully logout!',
                    showCloseButton: true
                });
                $location.path('/');
            };
            $scope.search = function(data) {
                $scope.searchQuery=data;
                $location.search({'query':$scope.searchQuery});
                $location.path('/');
            };
            $scope.$on('profileUpdated', function (event, args) {
                //$scope.HeaderLoading = true;
            });
            $scope.isActive = function (viewLocation) {
                return viewLocation === $location.path();
            };

            $(".rsb-links").click(function() {
                $("div#quickview-sidebar").removeClass("open");
            });








        }]);
