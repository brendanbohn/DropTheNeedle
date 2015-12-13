angular.module('myApp.controllers')

.controller('QuizController', [ '$scope', '$http', '$window', 'Auth', 'API', 'PlaylistId','$rootScope', 'Playback', 'PlayQueue', 
	function ($scope, $http, $window, Auth, API, PlaylistId, $rootScope, Playback, PlayQueue) {
	
	//gets values from SearchController(search bar form)
	var userId = PlaylistId.getOwnerId();
	var playlist = PlaylistId.getPlaylistId();
	var _playing = false;
	var _track = '';
	var _volume = 100;
	var _progress = 0;
	var _duration = 0;
	var _trackdata = null;


	//gets the tracks for playlist clicked on search page
	API.getPlaylistTracks(userId, playlist).then(function (data) {
		
		//tracks response from the API
		var tracks = data.items;
		$scope.tracklist = [];
		$scope._position = 0;
		//send the tracks to the randomizer function that will limit length to 20
		setTrackList(tracks);

		//set empty array to assign to factory queue
		$scope.toQueue = [];
		//push track URI's to the variable toQueue
		$scope.tracklist.forEach( function(object){
			$scope.toQueue.push(object.track.uri);
		});
		
		startPlaying($scope.toQueue[$scope._position]);

	});	

	// $rootScope.$on('poopoo', function() {
	// 	next();
	// 	// $scope.position = $scope.position + 1;
	// 	console.log("Position after endtrack: ", $scope._position);
	// 	startPlaying($scope.toQueue[$scope._position]);
	// });

	function startPlaying(trackuri) {
		console.log('Playback::startPlaying', trackuri);
		_track = trackuri;
		_trackdata = null;
		_playing = true;
		_progress = 0;
		var trackid = trackuri.split(':')[2];

		// workaround to be able to play on mobile
		// we need to play as a response to a touch event
		// play + immediate pause of an empty song does the trick
		// see http://stackoverflow.com/questions/12517000/no-sound-on-ios-6-web-audio-api
		audiotag.src='';
		audiotag.play();
		audiotag.pause();
	
		API.getTrack(trackid).then ( function (results) {
			var toPlay = results.data;
			
			console.log("toPlay:", toPlay);
			return toPlay;
		}).then(function (toPlay) {
				processAudio(toPlay);
		});

		function processAudio(trackdata) {
			// console.log('playback got track', trackdata);
			createAndPlayAudio(trackdata.preview_url, function() {
				_trackdata = trackdata;
				_progress = 0;
				// $rootScope.$emit('playerchanged');
				$rootScope.$emit('trackprogress');
				// enableTick();
			});
		}
	}

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
			callback();
		}, false);
		audiotag.addEventListener('ended', function() {
			console.log('audiotag ended');
			_playing = false;
			_track = '';
			// disableTick(); emit.endedtrack
			while($scope._position < $scope.toQueue.length) {
				next();
				
				console.log("Position after endtrack: ", $scope._position);
				startPlaying($scope.toQueue[$scope._position]);
			}	
		}, false);
	}

	function next () {
		console.log('PlayQueue: next');
		$scope._position ++ ;
		console.log("Position:", $scope._position);
		// if (_position >= $scope.toQueue.length) {
		// 	// TODO: if repeat is on.
		// 	_position = 0;
		// }
		$rootScope.$emit('playqueuechanged');
	}

	//sets quiz length to a max of 20 songs. 
	function setTrackList (array) {

		if(array.length <= 20){
			$scope.tracklist = array;
		} else if(array.length > 20) {
			for(var i = 0; i < 20; i++) {
				var j =	getRandomInt(0, array.length);
				var spliced = array.splice(j, 1);
				$scope.tracklist.push(spliced[0]); 
			}
		}
		console.log("Tracklist after getting 20 random: ", $scope.tracklist);
	}
	//gets random int for setting track list
	function getRandomInt(min, max) {
	  return Math.floor(Math.random() * (max - min)) + min;
	}

}]);



