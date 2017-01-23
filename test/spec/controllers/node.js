'use strict';

describe('Controller: NodeCtrl', function () {

  // load the controller's module
  beforeEach(module('eyelinkParstreamApp'));

  var NodeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NodeCtrl = $controller('NodeCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(NodeCtrl.awesomeThings.length).toBe(3);
  });
});
