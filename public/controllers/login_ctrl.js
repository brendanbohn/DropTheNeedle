angular.module('myApp.controllers')

	.controller('LoginController', ['$scope', 'Auth','$rootScope', function ($scope, Auth, $rootScope) {
		

		$scope.login = function() {
			// do login!
			console.log('do login...');

			Auth.openLogin();
			// $scope.$emit('login');
		};

		$scope.logout = function() {
			console.log('do logout...');
			Auth.setAccessToken('', 0);
			// $scope.$emit('logout');
			$rootScope.isLoggedIn = false;
		};
	}]);

