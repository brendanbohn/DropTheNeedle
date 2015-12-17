angular.module('myApp.controllers')
.controller('DashboardController', ['$rootScope', '$scope' , '$http' , function ($rootScope, $scope, $http) {
	//gets the user from our database on load to have the most current version with most current scores
	$http({
		method: 'GET',
		url: '/get-user-dashboard'
	}).then( function success(response) {
		console.log(response);
	}, function error(response) {
		console.log('error', response);
	});

}]);