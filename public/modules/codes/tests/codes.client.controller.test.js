'use strict';

(function() {
	// Codes Controller Spec
	describe('Codes Controller Tests', function() {
		// Initialize global variables
		var CodesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Codes controller.
			CodesController = $controller('CodesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Code object fetched from XHR', inject(function(Codes) {
			// Create sample Code using the Codes service
			var sampleCode = new Codes({
				name: 'New Code'
			});

			// Create a sample Codes array that includes the new Code
			var sampleCodes = [sampleCode];

			// Set GET response
			$httpBackend.expectGET('codes').respond(sampleCodes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.codes).toEqualData(sampleCodes);
		}));

		it('$scope.findOne() should create an array with one Code object fetched from XHR using a codeId URL parameter', inject(function(Codes) {
			// Define a sample Code object
			var sampleCode = new Codes({
				name: 'New Code'
			});

			// Set the URL parameter
			$stateParams.codeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/codes\/([0-9a-fA-F]{24})$/).respond(sampleCode);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.code).toEqualData(sampleCode);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Codes) {
			// Create a sample Code object
			var sampleCodePostData = new Codes({
				name: 'New Code'
			});

			// Create a sample Code response
			var sampleCodeResponse = new Codes({
				_id: '525cf20451979dea2c000001',
				name: 'New Code'
			});

			// Fixture mock form input values
			scope.name = 'New Code';

			// Set POST response
			$httpBackend.expectPOST('codes', sampleCodePostData).respond(sampleCodeResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Code was created
			expect($location.path()).toBe('/codes/' + sampleCodeResponse._id);
		}));

		it('$scope.update() should update a valid Code', inject(function(Codes) {
			// Define a sample Code put data
			var sampleCodePutData = new Codes({
				_id: '525cf20451979dea2c000001',
				name: 'New Code'
			});

			// Mock Code in scope
			scope.code = sampleCodePutData;

			// Set PUT response
			$httpBackend.expectPUT(/codes\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/codes/' + sampleCodePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid codeId and remove the Code from the scope', inject(function(Codes) {
			// Create new Code object
			var sampleCode = new Codes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Codes array and include the Code
			scope.codes = [sampleCode];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/codes\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCode);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.codes.length).toBe(0);
		}));
	});
}());