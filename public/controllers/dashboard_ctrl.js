angular.module('myApp.controllers')
.controller('DashboardController', ['$rootScope', '$scope' , '$http' , 'API', 'UserPlaylists', 'PlaylistId', 'Auth',function ($rootScope, $scope, $http, API, UserPlaylists, PlaylistId, Auth) {

	if(Auth.getAccessToken()) {
	  $rootScope.isLoggedIn = true;

	  API.getMe().then(function(userInfo){
	      $rootScope.spotifyUser = userInfo;
	        return userInfo;
	    }).then(function(userInfo) {
	      UserPlaylists.getUserPlaylists(userInfo.id);

	     //this request needs to be repeated for page refreshing purposes.
	      $http({
	        method: 'GET',
	        url: '/set-current-account/user/' + userInfo.id,
	        })
	      .then(function success(response) {

	        $rootScope.activeAccount = response.data[0];
	        $scope.username = $rootScope.activeAccount.spotify_id;
	        $scope.quizzes = $rootScope.activeAccount.quizzes;

	        //finding the favorite quiz by the amount of results it has 
	        var highest = 0;
	        for (var i = 0; i < $scope.quizzes.length; i++) {
	        	if($scope.quizzes[i].results.length > highest) {
	        		highest = $scope.quizzes[i].results.length;
	        		$scope.favorite = $scope.quizzes[i];
	        	}
	        }
	        console.log($scope.favorite);

	        $scope.setPlaylistScope = function(playlist, owner, playlistName) {
	        	console.log('home 21', playlistName);
	        	PlaylistId.setPlaylistId(playlist);
	        	PlaylistId.setOwnerId(owner);
	        	PlaylistId.setPlaylistName(playlistName);
	        };
	      }, function error(response) {
	        console.log('error', response);
	      }); 
	    });
	}


	

	
}]);