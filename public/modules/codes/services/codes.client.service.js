'use strict';

//Codes service used to communicate Codes REST endpoints
angular.module('codes').factory('Codes', ['$resource',
	function($resource) {
		return $resource('codes/:codeId', { codeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);