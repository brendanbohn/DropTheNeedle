angular.module('myApp.controllers')

.controller('QuizController', [ '$scope', '$http', '$window', 'Auth', 'API', 'PlaylistId','$rootScope', 'Playback', 'PlayQueue', 
	function ($scope, $http, $window, Auth, API, PlaylistId, $rootScope, Playback, PlayQueue) {
	
	//gets vallues from SearchController(search bar form)
	var user_id = PlaylistId.getOwnerId();
	var playlist = PlaylistId.getPlaylistId();

	//gets the tracks for playlist clicked on search page
	API.getPlaylistTracks(user_id, playlist).then(function (tracks) {
		
		$scope.tracks = tracks.items;
		setTrackList($scope.tracks);

		$scope.toQueue = [];
		$scope.tracklist.forEach( function(object){
			$scope.toQueue.push(object.track.uri);
		});

		PlayQueue._queue = $scope.toQueue;
		Playback.startPlaying(PlayQueue._queue[0]);
	});	

	$rootScope.$on('endtrack', function() {
		PlayQueue.next();
	});
	$rootScope.$on('playqueuechanged', function() {
		console.log("QUEUE:", PlayQueue._queue);
		var position = PlayQueue.getPosition();
		console.log(position);
		Playback.startPlaying(PlayQueue._queue[position]);
	});

	//sets quiz length to a max of 20 songs. 
	function setTrackList (array) {
		$scope.tracklist = [];

		if(array.length <= 20){
			$scope.tracklist.concat(array);
		} else if(array.length > 20) {
			for(var i = 0; i < 20; i++) {
				var j =	getRandomInt(0, array.length);
				var spliced = array.splice(j, 1);
				$scope.tracklist.push(spliced[0]); 
			}
		}
	}
	//gets random int for setting track list
	function getRandomInt(min, max) {
	  return Math.floor(Math.random() * (max - min)) + min;
	}

}]);



