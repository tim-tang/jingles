'use strict';

angular.module('fifoApp')
  .controller('GroupsCtrl', function ($scope, wiggle) {

    $scope.groups = wiggle.groups.query();
    
  });
