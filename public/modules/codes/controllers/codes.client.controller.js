'use strict';

// Codes controller
angular.module('codes').controller('CodesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Codes',
	function($scope, $stateParams, $location, Authentication, Codes) {
		$scope.authentication = Authentication;

		// Create new Code
		$scope.create = function() {
			// Create new Code object
			var code = new Codes ({
				description: this.description,
				code: this.code
			});

			// Redirect after save
			code.$save(function(response) {
				$location.path('codes/' + response._id);

				// Clear form fields
				$scope.description = '';
				$scope.code = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Code
		$scope.remove = function(code) {
			if ( code ) { 
				code.$remove();

				for (var i in $scope.codes) {
					if ($scope.codes [i] === code) {
						$scope.codes.splice(i, 1);
					}
				}
			} else {
				$scope.code.$remove(function() {
					$location.path('codes');
				});
			}
		};

		// Update existing Code
		$scope.update = function() {
			var code = $scope.code;

			code.$update(function() {
				$location.path('codes/' + code._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Codes
		$scope.find = function() {
			$scope.codes = Codes.query();
		};

		// Find existing Code
		$scope.findOne = function() {
			$scope.code = Codes.get({ 
				codeId: $stateParams.codeId
			});
		};
	}
]);