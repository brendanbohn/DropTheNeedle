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
        templateUrl: 'templates/home'
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
  .controller('MainCtrl', ['$rootScope', '$scope', 'Auth', '$window', '$http', 'API', 'UserPlaylists', 'PlaylistId',
    function ($rootScope, $scope, Auth, $window, $http, API, UserPlaylists, PlaylistId) {
    // INITIALIZATION AND NAVBAR LOGIC

    $window.addEventListener("message", function(event) {
      var hash = JSON.parse(event.data);
        if (hash.type == 'access_token') {
          Auth.setAccessToken(hash.access_token, hash.expires_in || 60);  
          
          if(Auth.getAccessToken()) {
            $rootScope.isLoggedIn = true;
            API.getMe().then(function(userInfo){
              $rootScope.spotifyUser = userInfo;
                return userInfo;
            }).then(function(userInfo) {
              var user = userInfo;
              UserPlaylists.getUserPlaylists(userInfo.id);

              //sets account if user exists and redirects to create-new-account if cant find this user
              $http({
                method: 'GET',
                url: '/set-current-account/user/' + user.id,
                })
              .then(function success(response) {
                console.log('success data is ', response.data[0]);
                $rootScope.activeAccount = response.data[0];
              }, function error(response) {
                console.log('error', response);
              }); 
            });

          } else {
            $rootScope.isLoggedIn = false;
            console.log("false");
          }
          $scope.$apply();
        }
      }, false);

          if(Auth.getAccessToken()) {
            $rootScope.isLoggedIn = true;
          } else {
            $rootScope.isLoggedIn = false;
          }

          API.getMe().then(function(userInfo){
              $rootScope.spotifyUser = userInfo;
                return userInfo;
            }).then(function(userInfo) {
              UserPlaylists.getUserPlaylists(userInfo.id);
            
            });

            //sets the playlist scope in the service to send to quiz controller to find quiz playlist
            $scope.setPlaylistScope = function(playlist, owner) {
              PlaylistId.setPlaylistId(playlist);
              PlaylistId.setOwnerId(owner);
            };


  }]);