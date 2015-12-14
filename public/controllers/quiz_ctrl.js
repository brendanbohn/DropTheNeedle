angular.module('myApp.controllers')

.controller('QuizController', [ '$scope', '$http', '$window', 'Auth', 'API', 'PlaylistId','$rootScope', 'Playback', 'PlayQueue', '$q',
	function ($scope, $http, $window, Auth, API, PlaylistId, $rootScope, Playback, PlayQueue, $q) {
	
	//gets vallues from SearchController(search bar form)
	var user_id = PlaylistId.getOwnerId();
	var playlist = PlaylistId.getPlaylistId();
	var promiseArray = [];
	var position = 0;
	var playlistTracks = [];
	var shortenedPlaylist = [];
	var shortenedPlaylistURIs = [];

	//gets the tracks for playlist clicked on search page
	API.getPlaylistTracks(user_id, playlist).then(function (data) {
		
		playlistTracks = data.items;
		setTrackList(playlistTracks);
		
		shortenedPlaylist.forEach( function(object){
			var trackURI = object.track.uri.split(':')[2];
			shortenedPlaylistURIs.push(trackURI);
		});
		for(var i = 0; i < shortenedPlaylistURIs.length; i++) {
			promiseArray.push(API.getTrack(shortenedPlaylistURIs[i]));
		}
		$q.all(promiseArray)
		.then( function () {
			//this loop removes any null preview_url's from the promise_array queue
			for(var i = 0; i < promiseArray.length; i++){
				if(promiseArray[i].$$state.value.preview_url === null) {
					promiseArray.splice(i, 1);
					console.log("SPLICED");
				}
			}
			console.log('promise_array.length', promiseArray.length);
			console.log('PROMISE ARRAY', promiseArray);
			console.log('example url', promiseArray[0].$$state.value.preview_url);
			createAndPlayAudio(promiseArray[0].$$state.value.preview_url);
			
		});

	});	
	
	var _playing = false;
	var _track = '';
	var _volume = 100;
	var _progress = 0;
	var _duration = 0;
	var _trackdata = null;	

	function createAndPlayAudio(url) {

		console.log('createAndPlayAudio', url);
		if(audiotag) {
			audiotag = null;
		}
		var audiotag = new Audio();
		audiotag.src = url;

		audiotag.addEventListener('loadedmetadata', function() {
			console.log('audiotag loadedmetadata');
			console.log('metadata audiotag', audiotag);
			_duration = audiotag.duration * 1000.0;
			audiotag.volume = _volume / 100.0;
			audiotag.play();
		}, false);
		audiotag.addEventListener('ended', function () {
			console.log('audiotag ended');
			console.log('ended audiotag', audiotag);
			_playing = false;
			_track = '';
			playNextSong();
			// disableTick();
			$rootScope.$emit('endtrack');
		}, false);
	}


	function playNextSong () {
		if(position < promiseArray.length-1){
			position = position + 1;
			createAndPlayAudio(promiseArray[position].$$state.value.preview_url);
			console.log("position ", position);
		}
	}

	//sets quiz length to a max of 20 songs. 
	function setTrackList (array) {

		if(array.length <= 20){
			shortenedPlaylist.concat(array);
		} else if(array.length > 20) {
			for(var i = 0; i < 20; i++) {
				var j =	getRandomInt(0, array.length);
				var spliced = array.splice(j, 1);
				shortenedPlaylist.push(spliced[0]); 
			}
		}
	}
	//gets random int for setting track list
	function getRandomInt(min, max) {
	  return Math.floor(Math.random() * (max - min)) + min;
	}

}]);



