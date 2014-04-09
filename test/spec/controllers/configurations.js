'use strict';

describe('Controller: ConfigurationCtrl', function () {

  // load the controller's module
  beforeEach(module('fifoApp'));

  var ConfigurationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConfigurationCtrl = $controller('ConfigurationCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
