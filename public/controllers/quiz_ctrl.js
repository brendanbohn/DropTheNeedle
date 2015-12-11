angular.module('myApp.controllers')

.controller('QuizController', [ '$scope', '$http', '$window', '$stateParams', 'Auth', function ($scope, $http, $window, $stateParams, Auth) {
	
	//$stateParams gets the params from the 'quiz' state defined in app.js, being set in the form with ui-sref
	console.log($stateParams.playlist_id);
	var user_id = Auth.getAccessToken();
	console.log(user_id);
	$http.get('/get-tracks/user_id/'+ user_id + '/playlist_id/'+ $stateParams.playlist_id)
	.success( function (data) {
		console.log(data);
	})
	.error( function (data) {
		console.log(data);
	});
}]);

