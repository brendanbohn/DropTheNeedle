angular.module('myApp').service('PlaylistId', function() {
	return {
		getPlaylistId: function () {
			return playlist_id;
		},
		setPlaylistId: function(playlist) {
			playlist_id = playlist;
			console.log("Playlist ID:",playlist_id);

		},
		getOwnerId: function () {
			return owner_id;
		},
		setOwnerId: function (owner) {
			owner_id = owner;
			console.log("Owner ID:", owner_id);
		},
		getPlaylistName: function() {
			return playlist_name;
		},
		setPlaylistName: function(playlistName) {
			playlist_name = playlistName;
		}
	};
});