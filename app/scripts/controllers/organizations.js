'use strict';

angular.module('fifoApp')
  .controller('OrganizationsCtrl', function ($scope, wiggle) {

    $scope.orgs = wiggle.orgs.query();

  });
