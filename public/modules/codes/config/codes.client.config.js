'use strict';

// Configuring the Articles module
angular.module('codes').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Codes', 'codes', 'dropdown', '/codes(/create)?');
		Menus.addSubMenuItem('topbar', 'codes', 'List Codes', 'codes');
		Menus.addSubMenuItem('topbar', 'codes', 'New Code', 'codes/create');
	}
]);