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