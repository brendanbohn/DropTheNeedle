angular.module('myApp.controllers')
.controller('PlaylistSearchController', ['$scope', '$http', '$window', 'Auth','$rootScope', 'API', 'PlaylistId', function ($scope, $http, $window, Auth, $rootScope, API, PlaylistId) {


	//searching spotify playlist
	$scope.searchPlaylist = function() {
		var term = $scope.term;
		console.log(term);
		$http.get("https://api.spotify.com/v1/search?q=" + term + "&type=playlist")
		.success( function (data) {
			console.log(data);
			$scope.playlists = data.playlists.items;
		})
		.error( function (data) {
			console.log(data);
		});
	};


	$scope.setPlaylistScope = function(playlist, owner) {
		PlaylistId.setPlaylistId(playlist);
		PlaylistId.setOwnerId(owner);
	};
	
	function getUserPlaylists() {
		API.getMyUsername()
		.then( function (data) {
			API.getPlaylists(data.id).then( function(playlists) {
			$scope.userPlaylists = playlists;
			console.log($scope.userPlaylists);
			});
		});
	}
	getUserPlaylists();
}]);
