angular.module('myApp.controllers')
.service('Playlist', function () {
	this.playlistId =  function (playlist_id) {
		return playlist_id;
	};
})
.controller('PlaylistSearchController', ['$scope', '$http', '$window', 'Auth','$rootScope', 'API', function ($scope, $http, $window, Auth, $rootScope, API) {


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

	

}]);
