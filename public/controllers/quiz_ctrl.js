angular.module('myApp.controllers')

.controller('QuizController', [ '$scope', '$http', '$window', 'Auth', 'API', 'PlaylistId','$rootScope', function ($scope, $http, $window, Auth, API, PlaylistId, $rootScope) {
	
	var user_id = PlaylistId.getOwnerId();
	var playlist = PlaylistId.getPlaylistId();

	console.log('user_id', user_id);
	console.log('playlist', playlist);

	API.getPlaylistTracks(user_id, playlist).then(function (tracks) {
		$scope.tracks = tracks.items;
		console.log($scope.tracks);
	});	
}]);

