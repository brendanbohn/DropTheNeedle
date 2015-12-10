

angular.module('myApp.controllers')
.service('Playlist', function () {
	this.playlistId =  function (playlist_id) {
		return playlist_id;
	};
})
.controller('PlaylistSearchController', ['$scope', '$http', '$window', function ($scope, $http, $window) {

	//searching spotify playlist
	$scope.searchPlaylist = function() {

		var term = { term: $scope.term };

		$http.post($window.location.origin + '/api/playlist/search' , term)
		.success( function (data) {
			$scope.playlists = data.playlists.items;
			console.log(data.playlists.items[1].images[2].url);
			console.log(data.playlists.items);
			$scope.term = null;
		})
		.error( function (data) {
			console.log('ERROR' + data);
		});
	};

	// $scope.passPlaylist = function (p) {
	// 	Playlist.playlistId(p.id);
	// };

}]);
