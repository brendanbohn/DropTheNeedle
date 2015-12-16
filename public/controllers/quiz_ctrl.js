angular.module('myApp.controllers')

.controller('QuizController', [ '$scope', '$http', '$window', 'Auth', 'API', 'PlaylistId','$rootScope', 'Playback', 'PlayQueue', '$q', '$timeout',
	function ($scope, $http, $window, Auth, API, PlaylistId, $rootScope, Playback, PlayQueue, $q, $timeout) {
	
	//gets vallues from SearchController(search bar form)
	$scope.game = true;
	var user_id = PlaylistId.getOwnerId();
	var playlist = PlaylistId.getPlaylistId();
	var playlistName = PlaylistId.getPlaylistName();
	var promiseArray = [];
	var position = 0;
	var playlistTracks = [];
	var shortenedPlaylist = [];
	var shortenedPlaylistURIs = [];
	var currentlyPlaying = {};
	var answerCount = 0;
	$scope.score = 0;

	quizTimer();

	//gets the tracks for playlist clicked on search page
	API.getPlaylistTracks(user_id, playlist).then(function (data) {
		
		playlistTracks = data.items;
		console.log('playlistTracks', playlistTracks);
		//this function will set the quiz max to 20 and return the shortenedPlaylist
		shortenPlaylist(playlistTracks);
		console.log('shortenedPlaylist', shortenedPlaylist);
		//creates an array with the URIs(track id's) needed to get tracks external API
		shortenedPlaylist.forEach( function(object){
			var trackURI = object.track.uri.split(':')[2];
			shortenedPlaylistURIs.push(trackURI);
		});
		console.log('shortenedPlaylistURIs', shortenedPlaylistURIs);
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
			$scope.gameLength = promiseArray.length;		
			console.log('promiseArray', promiseArray);
			$scope.promiseArray = promiseArray;
			//plays the first track in the resolved promiseArray
			createAndPlayAudio(promiseArray[0].$$state.value.preview_url);
			currentlyPlaying = promiseArray[0].$$state.value;
			console.log('currentlyPlaying', currentlyPlaying);
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
		// for the quiz timer
		$scope.counter = 30;
		console.log('createAndPlayAudio', url);
		//resets any previous audiotag(and events related to it)
		if($scope.audiotag) {
			$scope.audiotag = null;
		}
		//creates a new Audio tag
		$scope.audiotag = new Audio();
		//sets the audio url to the spotify preview url 
		$scope.audiotag.src = url;

		//when url is loaded sound will start playing
		$scope.audiotag.addEventListener('loadedmetadata', function() {
			console.log('audiotag loadedmetadata');
			_duration = $scope.audiotag.duration * 1000.0;
			$scope.audiotag.volume = _volume / 100.0;
			$scope.audiotag.play();
		}, false);
		//when track sound is done playing it will play next song (only if there is a next song)
		$scope.audiotag.addEventListener('ended', function () {
			console.log('audiotag ended');

			playNextSong();
	
		}, false);
	}

	//checks length of current playlist and plays next track in promiseArray
	function playNextSong () {
		if($scope.audiotag){
			$scope.audiotag.pause();
			$scope.audiotag = null;
		}
		if(position < promiseArray.length - 1){
			position = position + 1;
			createAndPlayAudio(promiseArray[position].$$state.value.preview_url);
			currentlyPlaying = promiseArray[position].$$state.value;
			console.log("currentlyPlaying ", currentlyPlaying);
		} else {
			console.log('SCORE IS:' + $scope.score + 'out of:' + promiseArray.length);
			$scope.game = false;
			//creating quiz and result in database
			// '/quiz/:playlist_name/:playlist_id/result/:score/:possible_score'
			$http({
				method: 'POST',
				url: '/user/'+ $rootScope.activeAccount.spotify_id + '/quiz/' + playlistName + '/' + playlist + '/result/' + $scope.score + '/' + promiseArray.length,
			}).then( function success(response) {

			}, function error(response) {
				console.log('error', response);
			});
		}
	}

	//sets quiz length to a max of 20 songs. 
	function shortenPlaylist (array) {
	
		if (array.length <= 20) {
			shortenedPlaylist.concat(array);
		} else if (array.length > 20) {
			for (var i = 0; i < 20; i++) {
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


	//QUIZ FORM, ANSWER COMPARISON, AND SCORE KEEPING
	$scope.compareAnswer = function () {
		console.log('submitted');
		 if (currentlyPlaying.artists[0].name == $scope.answer) {
			$scope.score ++;
			console.log($scope.score);
			$scope.answer = '';
			$scope.styling = "correct";
			playNextSong();
		} else {
			$scope.answer = '';
			playNextSong();
		}
	};

	// CREATES THE QUIZ TIMER
	function quizTimer() {
		$scope.counter = 30;
		$scope.onTimeout = function(){
		    $scope.counter--;
		    mytimeout = $timeout($scope.onTimeout,1000);
		};
		var mytimeout = $timeout($scope.onTimeout,1000);
	}


}]);



