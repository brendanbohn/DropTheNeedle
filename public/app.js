/*
 * ANGULAR APP.JS
 */

'use strict';

angular.module('myApp', ['ui.router',
                         'myApp.controllers', 
                         'myApp.services'])

  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
      .state('login', {
        url: "/",
        templateUrl: 'templates/loginview',
        controller: 'LoginController'
      })
      .state('home', {
        url: "/home",
        templateUrl: 'templates/home',
        controller: 'PlaylistSearchController'
      })
      .state('quiz', {
        url:"/quiz/:playlist_id",
        templateUrl: 'templates/quiz',
        controller: 'QuizController'
      })
      .state('callback', {
        url:"/callback",
        templateUrl: 'templates/callback',
        controller: 'LoginController',
        resolve: {
          'urlFix': ['$location', function($location){
            $location.url($location.url().replace('#','?'));
          }]
        }
      });

    $urlRouterProvider.otherwise("/");

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
  }]);



angular.module('myApp.controllers', [])
  .controller('MainCtrl', ['$rootScope', '$scope', '$location', 'Auth', '$window', '$state',function ($rootScope, $scope, $location, Auth, $window, $state) {
    // INITIALIZATION AND NAVBAR LOGIC

    $window.addEventListener("message", function(event) {
          console.log('got postmessage', event);
          var hash = JSON.parse(event.data);
          if (hash.type == 'access_token') {
            Auth.setAccessToken(hash.access_token, hash.expires_in || 60);
            // checkUser(true);
            $state.go('home');
          }
          }, false);
  }]);