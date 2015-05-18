'use strict';

//Setting up route
angular.module('codes').config(['$stateProvider',
	function($stateProvider) {
		// Codes state routing
		$stateProvider.
		state('listCodes', {
			url: '/codes',
			templateUrl: 'modules/codes/views/list-codes.client.view.html'
		}).
		state('createCode', {
			url: '/codes/create',
			templateUrl: 'modules/codes/views/create-code.client.view.html'
		}).
		state('viewCode', {
			url: '/codes/:codeId',
			templateUrl: 'modules/codes/views/view-code.client.view.html'
		}).
		state('editCode', {
			url: '/codes/:codeId/edit',
			templateUrl: 'modules/codes/views/edit-code.client.view.html'
		});
	}
]);