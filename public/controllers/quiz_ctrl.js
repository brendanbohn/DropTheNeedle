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
		//this function will set the quiz max to 20 and return the shortenedPlaylist
		shortenPlaylist(playlistTracks);
		
		//creates an array with the URIs(track id's) needed to get tracks external API
		shortenedPlaylist.forEach( function(object){
			var trackURI = object.track.uri.split(':')[2];
			shortenedPlaylistURIs.push(trackURI);
		});

		//requests all the tracks in the array or URIs and pushes all the promises into and array
		for(var i = 0; i < shortenedPlaylistURIs.length; i++) {
			promiseArray.push(API.getTrack(shortenedPlaylistURIs[i]));
		}

		//once all the promises are fullfilled...
		$q.all(promiseArray).then( function () {
			//this loop removes any null preview_url's from the promise_array queue
			for(var i = 0; i < promiseArray.length; i++){
				if(promiseArray[i].$$state.value.preview_url === null) {
					promiseArray.splice(i, 1);
					console.log("SPLICED");
				}
			}
			//plays the first track in the resolved promiseArray
			createAndPlayAudio(promiseArray[0].$$state.value.preview_url);
			
		});

	});	
	
	//variables 
	var _playing = false;
	var _track = '';
	var _volume = 100;
	var _progress = 0;
	var _duration = 0;
	var _trackdata = null;	

	function createAndPlayAudio(url) {

		console.log('createAndPlayAudio', url);
		//resets any previous audiotag(and events related to it)
		if(audiotag) {
			audiotag = null;
		}
		//creates a new Audio tag
		var audiotag = new Audio();
		//sets the audio url to the spotify preview url 
		audiotag.src = url;

		//when url is loaded sound will start playing
		audiotag.addEventListener('loadedmetadata', function() {
			console.log('audiotag loadedmetadata');
			_duration = audiotag.duration * 1000.0;
			audiotag.volume = _volume / 100.0;
			audiotag.play();
		}, false);
		//when track sound is done playing it will play next song (only if there is a next song)
		audiotag.addEventListener('ended', function () {
			console.log('audiotag ended');
			_playing = false;
			_track = '';
			playNextSong();
			// disableTick();
			$rootScope.$emit('endtrack');
		}, false);
	}

	//checks length of current playlist 
	function playNextSong () {
		if(position < promiseArray.length-1){
			position = position + 1;
			createAndPlayAudio(promiseArray[position].$$state.value.preview_url);
			console.log("position ", position);
		}
	}

	//sets quiz length to a max of 20 songs. 
	function shortenPlaylist (array) {

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



