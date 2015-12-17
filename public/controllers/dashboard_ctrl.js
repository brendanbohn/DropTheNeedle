angular.module('myApp.controllers')
.controller('DashboardController', ['$rootScope', '$scope' , '$http' , 'API', 'UserPlaylists', 'PlaylistId',function ($rootScope, $scope, $http, API, UserPlaylists, PlaylistId) {

	console.log($rootScope.activeAccount);
	$scope.username = $rootScope.activeAccount.spotify_id;
	console.log($scope.username);
	$scope.quizzes = $rootScope.activeAccount.quizzes;
	console.log($scope.quizzes);

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
}]);