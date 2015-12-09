

angular.module('myApp.controllers')

.controller('QuizCtrl', [ '$scope', '$http', '$window', '$stateParams', function ($scope, $http, $window, $stateParams) {
	
	//$stateParams gets the params from the 'quiz' state defined in app.js, being set in the form with ui-sref
	console.log($stateParams);
	$http.get('/get-tracks' + $stateParams.playlist_id )
	.success( function (data) {
		console.log(data);
	})
	.error( function (data) {
		console.log(data);
	});
}]);

