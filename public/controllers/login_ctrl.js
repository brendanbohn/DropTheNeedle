angular.module('myApp.controllers')

	.controller('LoginController', function($scope, Auth, $state) {
		if(Auth.getAccessToken()) {
			$scope.isLoggedIn = true;
			console.log("true");
			$state.go('home');		
		} else {
			$scope.isLoggedIn = false;
			console.log("false");
		}

		$scope.login = function() {
			// do login!
			console.log('do login...');

			Auth.openLogin();
			// $scope.$emit('login');
		};

		$scope.logout = function() {
			console.log('do logout...');
			Auth.setAccessToken('', 0);
			$scope.$emit('logout');
		};
	});

