'use strict';

/**
 * @ngdoc overview
 * @name newappApp
 * @description
 * # newappApp
 *
 * Main module of the application.
 */

// 'ngActivityIndicator',
//ui.select',
//  'infinite-scroll',
// 'mgo-angular-wizard',
// 'ui.filters'
// 'duScroll',
// 'froala',
// 'angulartics',
// 'angulartics.google.analytics']




var MakeApp = angular
  .module('newApp', [
      'froala',
    'ngAnimate',
    'toaster',
    'satellizer',
    'ngCookies',
    "checklist-model",
    'ngResource',
    'ngRoute',
    'slick',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'rzModule',
    'ngFileUpload',
    'ngTagsInput',
    'duScroll',
    'angular-preload-image',
    'ngImgCrop',
    'ngMaterial',
    '720kb.socialshare',
  ]).config(
    function ($authProvider, serverConfig) {
        $authProvider.httpInterceptor = function() { console.log("true"); return true; },
            $authProvider.tokenName = 'access_token';
        $authProvider.google({
            url: serverConfig.address + 'api/auth/google',
            clientId: '982638547625-ui0lp1pteh6moug1sgct1ag0ub0aen7g.apps.googleusercontent.com',
            clientSecret: '3_FHOlRYTrJffGBhGAMr59b_',
            redirectUri: 'http://'+location.hostname+'/'
        });
        $authProvider.facebook({
            url: serverConfig.address + 'api/auth/facebook',
            clientId: '953913041345816',
            clientSecret: 'e9652fa4cea1dca0a1d6658adaa0ab36',
            redirectUri: 'http://'+location.hostname+'/'
        });
        $authProvider.loginUrl = serverConfig.address + 'oauth/access_token';
    }).run(function($rootScope) {
        $rootScope.user_profile = {};
    }).animation('.slide', [function() {
        return {
            // make note that other events (like addClass/removeClass)
            // have different function input parameters
            enter: function(element, doneFn) {
                jQuery(element).fadeIn(1000, doneFn);

                // remember to call doneFn so that angular
                // knows that the animation has concluded
            },
            move: function(element, doneFn) {
                jQuery(element).fadeIn(1000, doneFn);
            },

            leave: function(element, doneFn) {
                jQuery(element).fadeOut(1000, doneFn);
            }
        }

    }]).run(/*function($FB){
    $FB.init('953913041345816');
}*/).filter('htmlToPlaintext', function() {
        return function(text) {
            return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
        };
    });




  MakeApp.config(function ($routeProvider) {
      $routeProvider
        /*.when('/frontend', {
            templateUrl: 'frontend/frontend.html',
            controller: 'frontendCtrl'
        })
        .when('/charts', {
            templateUrl: 'charts/charts/charts.html',
            controller: 'chartsCtrl'
        })
        .when('/financial-charts', {
            templateUrl: 'charts/financialCharts/financialCharts.html',
            controller: 'financialChartsCtrl'
        })
        .when('/ui-animations', {
            templateUrl: 'uiElements/animations/animations.html',
            controller: 'animationsCtrl'
        })
        .when('/material-buttons', {
            templateUrl: 'uiElements/buttons/material-buttons.html',
            controller: 'buttonsCtrl'
        })
        .when('/material-colors', {
            templateUrl: 'uiElements/colors/material-colors.html',
            controller: 'colorsCtrl'
        })
        .when('/material-cards', {
            templateUrl: 'uiElements/cards/material-cards.html',
            controller: 'cardsCtrl'
        })
        .when('/material-icons', {
            templateUrl: 'uiElements/icons/material-icons.html',
            controller: 'iconsCtrl'
        })
        .when('/ui-components', {
            templateUrl: 'uiElements/components/components.html',
            controller: 'componentsCtrl'
        })
        .when('/ui-helperClasses', {
            templateUrl: 'uiElements/helperClasses/helperClasses.html',
            controller: 'helperClassesCtrl'
        })
        .when('/ui-icons', {
            templateUrl: 'uiElements/icons/icons.html',
            controller: 'iconsCtrl'
        })
        .when('/ui-modals', {
            templateUrl: 'uiElements/modals/modals.html',
            controller: 'modalsCtrl'
        })
        .when('/ui-nestableList', {
            templateUrl: 'uiElements/nestableList/nestableList.html',
            controller: 'nestableListCtrl'
        })
        .when('/ui-notifications', {
            templateUrl: 'uiElements/notifications/notifications.html',
            controller: 'notificationsCtrl'
        })
        .when('/ui-portlets', {
            templateUrl: 'uiElements/portlets/portlets.html',
            controller: 'portletsCtrl'
        })
        .when('/ui-tabs', {
            templateUrl: 'uiElements/Tabs/tabs.html',
            controller: 'tabsCtrl'
        })
        .when('/ui-treeView', {
            templateUrl: 'uiElements/treeView/treeView.html',
            controller: 'treeViewCtrl'
        })
        .when('/ui-typography', {
            templateUrl: 'uiElements/typography/typography.html',
            controller: 'typographyCtrl'
        })
        .when('/email-templates', {
            templateUrl: 'mailbox/mailbox-templates.html',
            controller: 'mailboxTemplatesCtrl'
        })
          .when('/material-forms', {
              templateUrl: 'forms/elements/elements.html',
              controller: 'elementsCtrl'
          })
             .when('/forms-validation', {
                 templateUrl: 'forms/validation/validation.html',
                 controller: 'elementsCtrl'
             })
            .when('/forms-plugins', {
                templateUrl: 'forms/plugins/plugins.html',
                controller: 'pluginsCtrl'
            })
          .when('/forms-wizard', {
              templateUrl: 'forms/wizard/wizard.html',
              controller: 'wizardCtrl'
          })
          .when('/material-sliders', {
              templateUrl: 'forms/sliders/material-sliders.html',
              controller: 'slidersCtrl'
          })
          .when('/forms-editors', {
              templateUrl: 'forms/editors/editors.html',
              controller: 'editorsCtrl'
          })
            .when('/forms-input-masks', {
                templateUrl: 'forms/inputMasks/inputMasks.html',
                controller: 'inputMasksCtrl'
            })

           //medias
        .when('/medias-croping', {
            templateUrl: 'medias/croping/croping.html',
            controller: 'cropingCtrl'
        })
        .when('/medias-hover', {
            templateUrl: 'medias/hover/hover.html',
            controller: 'hoverCtrl'
        })
        .when('/medias-sortable', {
            templateUrl: 'medias/sortable/sortable.html',
            controller: 'sortableCtrl'
        })
          //pages
        .when('/pages-blank', {
            templateUrl: 'pages/blank/blank.html',
            controller: 'blankCtrl'
        })
        .when('/pages-blank-1', {
            templateUrl: 'pages/blank1/blank1.html',
            controller: 'blankCtrl1'
        })
        .when('/pages-blank-2', {
            templateUrl: 'pages/blank2/blank2.html',
            controller: 'blankCtrl2'
        })
        .when('/pages-contact', {
            templateUrl: 'pages/contact/contact.html',
            controller: 'contactCtrl'
        })
        .when('/pages-timeline', {
            templateUrl: 'pages/timeline/timeline.html',
            controller: 'timelineCtrl'
        })
             //ecommerce
        .when('/ecom-cart', {
            templateUrl: 'ecommerce/cart/cart.html',
            controller: 'cartCtrl'
        })
        .when('/ecom-invoice', {
            templateUrl: 'ecommerce/invoice/invoice.html',
            controller: 'invoiceCtrl'
        })
        .when('/ecom-pricingTable', {
            templateUrl: 'ecommerce/pricingTable/pricingTable.html',
            controller: 'pricingTableCtrl'
        })
          //extra
        .when('/extra-fullCalendar', {
            templateUrl: 'extra/fullCalendar/fullCalendar.html',
            controller: 'fullCalendarCtrl'
        })
        .when('/extra-google', {
            templateUrl: 'extra/google/google.html',
            controller: 'googleCtrl'
        })
        .when('/extra-slider', {
            templateUrl: 'extra/slider/slider.html',
            controller: 'sliderCtrl'
        })
        .when('/extra-vector', {
            templateUrl: 'extra/vector/vector.html',
            controller: 'vectorCtrl'
        })
        .when('/extra-widgets', {
            templateUrl: 'extra/widgets/widgets.html',
            controller: 'widgetsCtrl'
        })
          //tables
        .when('/tables-dynamic', {
            templateUrl: 'tables/dynamic/dynamic.html',
            controller: 'dynamicCtrl'
        })
        .when('/tables-editable', {
            templateUrl: 'tables/editable/editable.html',
            controller: 'editableCtrl'
        })
        .when('/tables-filter', {
            templateUrl: 'tables/filter/filter.html',
            controller: 'filterCtrl'
        })*/
        .when('/welcome-to-zolo', {
            templateUrl: '/views/welcome.html',
            controller: 'signUpCtrl'
        })

          .when('/pages-blank', {
              templateUrl: '../pages/blank/blank.html',
              controller: 'blankCtrl'
          })

          .when('/terms-of-use', {
              templateUrl: '/views/terms-of-use.html',
              controller: 'terms-of-useCtrl'
          })

          .when('/privacy-policy', {
              templateUrl: '/views/privacy-policy.html',
              controller: 'privacy-policyCtrl'
          })


        .when('/user-sessionTimeout', {
            templateUrl: '/views/sessionTimeout.html',
            controller: 'sessionTimeoutCtrl'
        })
          .when('/login', {                                   // for login
              templateUrl: '/views/login.html',
              controller: 'loginCtrl'
          })
          .when('/sign-up', {                                 // for sign up
              templateUrl: '/views/sign-up.html',
              controller: 'signUpCtrl'
          })
        .when('/dashboard/my-collection/:id', {                 // my collection packages
            templateUrl: '/views/my-collection-packages.html',
            controller: 'dashboardCtrl'
        })
          .when('/dashboard/edit-package/:id', {                 // my collection packages
              templateUrl: '/views/edit-package.html',
              controller: 'editPackageCtrl'
          })
          .when('/sendResetMail', {                                 // forgot password send reset mail
              templateUrl: '/views/forgot-password.html',
              controller: 'SendResetPasswordMailCtrl'
          })
          .when('/resetPassword', {                                 //  reset password
              templateUrl: '/views/resetPassword.html',
              controller: 'ResetPasswordCtrl'
          })
          .when('/activate', {                                              //for verify email and activate account
              templateUrl: '/views/activate.html',
              controller: 'activateCtrl'
          })
          .when('/profile/:other_user_id', {                                 // for other profile
              templateUrl: '/views/sellerProfile.html',
              controller: 'sellerProfileCtrl'
          })
          .when('/profile', {                                 // for profile
              templateUrl: '/views/profile.html',
              controller: 'profileCtrl'
          })
          .when('/', {
              templateUrl: '/views/search.html',            // home search page
              controller: 'searchCtrl'
          })
          .when('/result', {                                // search result
              templateUrl: '/views/search.html',
              controller: 'searchCtrl'
          })
          .when('/login-successful', {                           // after login successful
              templateUrl: '/views/afterLogin.html',
              controller: 'afterLoginCtrl'
          })
          .when('/package/:id', {                              // package display page
              templateUrl: '/views/package.html',
              controller: 'packagePageCtrl'
          })
          .when('/dashboard', {                                 // dashboard
              templateUrl: '/views/dashboard.html',
              controller: 'dashboardCtrl'
          })
          .when('/dashboard/:target', {                             // dashboard routes
              templateUrl: '/views/dashboard.html',
              controller: 'dashboardCtrl'
          })
          .when('/post-a-package', {                             // post a package
              templateUrl: '/views/post-a-package.html',
              controller: 'postAPackageCtrl'
          })
          .when('/booking/:booking_id1/:transaction_id', {           // order review page
              templateUrl: '/views/order_review_page.html',
              controller: 'bookingCtrl'
          })
          .when('/bookingProcessing/:transaction_id',{          // process booking
              templateUrl: '/views/BookingWarnMessage.html',
              controller: 'BookingByWalletCtrl'
          })
          .when('/orderSuccessful/:booking_id',{              // order detail page for the buyer
              templateUrl: '/views/order_display_page_buyer.html',
              controller: 'OrderDetailsPageControllerBuyer'
          })
          .when('/orderSummary/:booking_id',{              // order detail page for the seller
              templateUrl: '/views/order_display_page_seller.html',
              controller: 'OrderDetailsPageControllerSeller'
          })
          .when('/referredSignUp/:code',{
              templateUrl: '/views/referredSignUp.html',
              controller: 'referralCtrl'
          })
          .when('/referralThankYou/',{
              templateUrl: '/views/ThankYou.html',
              controller: ''
          })
          .when('/wallet/addCredit',{
              templateUrl: '/views/AddToWallet.html',
              controller: 'WalletController'
          })
          /*  .when('/imgCrop',{
              templateUrl: 'imageCrop/imgCrop.html',
              controller: 'imgCrop'
          })*/

            .when('/messaging',{
              templateUrl: '/views/message.html',
              controller: 'MessageController'
          })
            .when('/sendMessage',{
              templateUrl: '../messaging/mailbox-send.html',
              controller: ''
          })


        .otherwise({
            redirectTo: '/'
        });
  });
MakeApp.constant("serverConfig", {
    //"address": "http://localhost:8000/"
    //"address": "http://192.168.1.13:8000/"
      // "address": "http://52.88.21.108/"
       "address": "http://54.169.76.224/"
});

// Route State Load Spinner(used on page or content load)

MakeApp.directive('ngSpinnerLoader', ['$rootScope',
    function($rootScope) {
        return {
            link: function(scope, element, attrs) {
                // by defult hide the spinner bar
                element.addClass('hide'); // hide spinner bar by default
                // display the spinner bar whenever the route changes(the content part started loading)
                $rootScope.$on('$routeChangeStart', function() {
                    element.removeClass('hide'); // show spinner bar
                });
                // hide the spinner bar on rounte change success(after the content loaded)
                $rootScope.$on('$routeChangeSuccess', function() {
                    setTimeout(function(){
                        element.addClass('hide'); // hide spinner bar
                    },500);
                    $("html, body").animate({
                        scrollTop: 0
                    }, 500);
                });
            }
        };
    }
]);


MakeApp.provider('myPageCtx', function() {
    var defaultCtx = {
        title: 'Zolo Get Things Done',
        menuBar: 'default',
        footerUrl: 'default-footer.tmpl.html'
    };
    var currentCtx = angular.copy(defaultCtx);
    return {
        $get: function($rootScope) {
            // We probably want to revert back to the default whenever
            // the location is changed.
            $rootScope.$on('$locationChangeStart', function() {
                angular.extend(currentCtx, defaultCtx);
            });
            return currentCtx;
        }
    };
});




MakeApp.directive('numberConverter', function() {
    return {
        priority: 1,
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attr, ngModel) {
            function toModel(value) {
                return "" + value; // convert to string
            }

            function toView(value) {
                return parseInt(value); // convert to number
            }

            ngModel.$formatters.push(toView);
            ngModel.$parsers.push(toModel);
        }
    };
});

