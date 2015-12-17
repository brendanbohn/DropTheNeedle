angular.module('myApp.controllers')
.controller('PlaylistSearchController', ['$scope', '$http', '$window', 'Auth','$rootScope', 'API', 'PlaylistId', function ($scope, $http, $window, Auth, $rootScope, API, PlaylistId) {

	//searching spotify playlist
	$scope.searchPlaylist = function() {
		var term = $scope.term;
		$scope.searchTerm = term;
		console.log(term);
		$http.get("https://api.spotify.com/v1/search?q=" + term + "&type=playlist")
		.success( function (data) {
			console.log(data);
			$scope.playlists = data.playlists.items;
			if (data.playlists.items.length === 0) {
				$scope.noResults = true;
				$scope.searchResults = false;
			} else {
				$scope.noResults = false;
				$scope.searchResults = true;
			}
			$scope.term = '';
		})
		.error( function (data) {
			console.log(data);
		});
	};


	$scope.setPlaylistScope = function(playlist, owner, playlistName) {
		console.log('home 21', playlistName);
		PlaylistId.setPlaylistId(playlist);
		PlaylistId.setOwnerId(owner);
		PlaylistId.setPlaylistName(playlistName);
	};
}]);
