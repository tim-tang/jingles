'use strict';

angular.module('fifoApp')
  .controller('ServersCtrl', function ($scope, wiggle, status) {

    $scope.hypervisors = wiggle.hypervisors.queryFull()

    $scope.$on('memorychange', function(e, msg) {
        $scope.hypervisors.hash[msg.channel]['free-memory']        = msg.message.data.free
        $scope.hypervisors.hash[msg.channel]['provisioned-memory'] = msg.message.data.provisioned
        $scope.$apply()
    })

  });
