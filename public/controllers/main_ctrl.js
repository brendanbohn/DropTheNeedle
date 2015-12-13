angular.module('myApp.controllers', [])
.controller('MainCtrl', ['$rootScope', '$scope', 'Auth', '$window', '$http', 'API', function ($rootScope, $scope, Auth, $window, $http, API) {
// INITIALIZATION AND NAVBAR LOGIC

//Receives message from popup window with the spotify user 
$window.addEventListener("message", function(event) {
  var hash = JSON.parse(event.data);
  if (hash.type == 'access_token') {
    Auth.setAccessToken(hash.access_token, hash.expires_in || 60);  

    if(Auth.getAccessToken()) {
      $rootScope.isLoggedIn = true;
      API.getMe().then(function(userInfo){
        $rootScope.spotifyUser = userInfo;
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
      console.log("true");  
    } else {
      $rootScope.isLoggedIn = false;
      console.log("false");
    }

}]);
