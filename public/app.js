/*
 * ANGULAR APP.JS
 */

'use strict';

angular.module('myApp', ['ui.router',
                         'myApp.controllers', 
                         'myApp.services'])

  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
      .state('home', {
        url: "/",
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
  .controller('MainCtrl', ['$rootScope', '$scope', 'Auth', '$window', function ($rootScope, $scope, Auth, $window) {
    // INITIALIZATION AND NAVBAR LOGIC

    $window.addEventListener("message", function(event) {
      var hash = JSON.parse(event.data);
        if (hash.type == 'access_token') {
          Auth.setAccessToken(hash.access_token, hash.expires_in || 60);  
          
          if(Auth.getAccessToken()) {
            $rootScope.isLoggedIn = true;
            console.log("true");  
          } else {
            $rootScope.isLoggedIn = false;
            console.log("false");
          }
          $scope.$apply();
        }
      }, false);

          if(Auth.getAccessToken()) {
            $rootScope.isLoggedIn = true;
            console.log("true");  
          } else {
            $rootScope.isLoggedIn = false;
            console.log("false");
          }
  }]);