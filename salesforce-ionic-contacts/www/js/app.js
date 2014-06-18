angular.module('starter', ['ionic', 'salesforce.oauth', 'starter.controllers', 'starter.services'])

    .run(function ($ionicPlatform, OAuthService) {

//        $ionicPlatform.ready(function () {
//            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
//            // for form inputs)
//            if (window.cordova && window.cordova.plugins.Keyboard) {
//                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
//            }
//            if (window.StatusBar) {
//                // org.apache.cordova.statusbar required
//                StatusBar.styleDefault();
//            }
//        });

        console.log('1');
        window.location.hash = '#/login';
        console.log('2');

        OAuthService.authenticate().then(function() {
            console.log('4');
            window.location.hash = '#/contacts';
        });
        console.log('3');

    })

    .config(function ($stateProvider) {

        console.log('config');

        $stateProvider

            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html'
            })

            .state('contact-list', {
                url: '/contacts',
                templateUrl: 'templates/contact-list.html',
                controller: 'ContactListCtrl'
            })

            .state('contact-detail', {
                url: '/contacts/:contactId',
                templateUrl: 'templates/contact-detail.html',
                controller: 'ContactDetailCtrl'
            });

    });