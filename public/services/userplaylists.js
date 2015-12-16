angular.module('myApp').factory('UserPlaylists', ['API','$rootScope', function (API, $rootScope) {
	return {
		 getUserPlaylists: function(username) {
				API.getPlaylists(username)
					.then( function(playlists) {
					// var publicPlaylists = [];
					//makes sure the user's playlists are public before populating
					// for (var i = 0; i < playlists.length; i++) {
					// 	if(playlists[i].public === true) {
							// publicPlaylists.push(playlists[i]);
						// }
					// }
					$rootScope.userPlaylists = playlists;
				});
		}
	};	
}]);