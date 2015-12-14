angular.module('myApp.controllers')

.controller('QuizController', [ '$scope', '$http', '$window', 'Auth', 'API', 'PlaylistId','$rootScope', 'Playback', 'PlayQueue', '$q',
	function ($scope, $http, $window, Auth, API, PlaylistId, $rootScope, Playback, PlayQueue, $q) {
	
	//gets vallues from SearchController(search bar form)
	var user_id = PlaylistId.getOwnerId();
	var playlist = PlaylistId.getPlaylistId();
	var promise_array = [];
	var position = 0;

	//gets the tracks for playlist clicked on search page
	API.getPlaylistTracks(user_id, playlist).then(function (tracks) {
		
		$scope.tracks = tracks.items;
		setTrackList($scope.tracks);

		$scope.toQueue = [];
		$scope.tracklist.forEach( function(object){
			var trackid = object.track.uri.split(':')[2];
			$scope.toQueue.push(trackid);
		});
		for(var i = 0; i < $scope.toQueue.length; i++) {
			promise_array.push(
				API.getTrack($scope.toQueue[i])
			);
		}
		$q.all(promise_array)
		.then( function () {
			console.log('PROMISE ARRAY', promise_array);
			console.log('example url', promise_array[0].$$state.value.preview_url);
			createAndPlayAudio(promise_array[0].$$state.value.preview_url);
		});

	});	
	
	var _playing = false;
	var _track = '';
	var _volume = 100;
	var _progress = 0;
	var _duration = 0;
	var _trackdata = null;	
	var audiotag = new Audio();

	function createAndPlayAudio(url, callback, endcallback) {
		console.log('createAndPlayAudio', url);
		if (audiotag.src !== null) {
			audiotag.pause();
			audiotag.src = null;
		}
		audiotag.src = url;
		audiotag.addEventListener('loadedmetadata', function() {
			console.log('audiotag loadedmetadata');
			_duration = audiotag.duration * 1000.0;
			audiotag.volume = _volume / 100.0;
			audiotag.play();
			// callback();
		}, false);
		audiotag.addEventListener('ended', function () {
			console.log('audiotag ended');
			_playing = false;
			_track = '';
			
			audiotag.removeEventListener('ended', playNextSong(), false);
			// disableTick();
			// $rootScope.$emit('endtrack');
		}, false);
	}
		function playNextSong () {
			if(position < promise_array.length){
				position = position + 1;
				createAndPlayAudio(promise_array[position].$$state.value.preview_url);
			}
		}
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



