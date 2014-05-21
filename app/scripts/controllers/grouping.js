'use strict';

angular.module('fifoApp')
  .controller('GroupingsCtrl', function ($scope, wiggle) {

      $scope.groupings = wiggle.groupings.query();
  });
