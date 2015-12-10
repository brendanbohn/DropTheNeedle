angular.module('myApp.controllers')

	.controller('LoginController', function($scope, Auth) {
		$scope.isLoggedIn = false;

		$scope.login = function() {
			// do login!
			console.log('do login...');

			Auth.openLogin();
			// $scope.$emit('login');
		};

		$scope.logout = function() {
			console.log('do logout...');
			Auth.setAccessToken('', 0);
			console.log('hello');
			$scope.$emit('logout');
		};
	});

