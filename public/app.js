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
      .state('posts', {
        url: "/home",
        templateUrl: 'templates/posts-index',
        controller: 'PlaylistSearchController'
      })
      .state('quiz', {
        url:"/quiz/:playlist_id",
        templateUrl: 'templates/quiz',
        controller: 'QuizController'
      });

    $urlRouterProvider.otherwise("/");

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
  }]);


angular.module('myApp.controllers', [])
  .controller('MainCtrl', ['$rootScope', '$scope', '$location', function ($rootScope, $scope, $location) {
    // INITIALIZATION AND NAVBAR LOGIC
  }]);