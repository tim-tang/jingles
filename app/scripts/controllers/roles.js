'use strict';

angular.module('fifoApp')
  .controller('RolesCtrl', function ($scope, wiggle) {

    $scope.roles = wiggle.roles.query();
    
  });
