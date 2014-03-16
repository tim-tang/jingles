'use strict';

angular.module('fifoApp')
  .controller('NetworkCtrl', function ($scope, $routeParams, $location, wiggle, vmService, status, breadcrumbs) {
     var uuid = $routeParams.uuid;

    $scope.delete = function() {
      var name = $scope.network.name;
      var uuid = $scope.network.uuid;

      $scope.modal = {
        btnClass: 'btn-danger',
        confirm: 'Delete',
        title: 'Confirm VM Deletion',
        body: '<p><font color="red">Warning!</font> you are about to delete the Network <b id="delete-uuid">' + name + " (" + uuid + ") </b> Are you 100% sure you really want to do this?</p><p>Clicking on Delete here will mean this Network is gone forever!</p>",
        ok: function() {
        	wiggle.networks.delete({id: uuid},
             function success(data, h) {
               status.success(name + ' deleted');
               $location.path('/configuration/networks')
             },
             function error(data) {
               console.error('Delete Network error:', data);
               status.error('There was an error deleting your network. See the javascript console.');
             });
        }
      }
    };

    $scope.remove_iprange = function(iprange, idx) {
      var uuid = $scope.network.ipranges[idx]
      wiggle.networks.delete({
        id: $scope.network.uuid,
        controller: 'ipranges',
        controller_id: uuid},
       function ok(){
          $scope.network._ipranges.splice(idx, 1)
          $scope.network.ipranges.splice(idx, 1)
      });
    };

    $scope.add_iprange = function(iprange) {
      wiggle.networks.put({
        id: $scope.network.uuid,
        controller: 'ipranges',
        controller_id: iprange.uuid},
        function ok() {
          $scope.network.ipranges.push(iprange.uuid)
          $scope.network._ipranges.push(iprange)
        }
      );
    };

    $scope.available_ipranges = function(items) {
      if (!$scope.network || !$scope.network.ipranges) return items

      return items.filter(function(item) {return $scope.network.ipranges.indexOf(item.uuid) < 0})
    }

    $scope.ipranges = wiggle.ipranges.query();
    $scope.network = wiggle.networks.getFull({id: uuid})

    $scope.network.$promise.then(function(n) {
      breadcrumbs.setLast(n.name)
      
      //Default empty array if network.iprange is undefined, so we can push to it later.
      if (!$scope.network.ipranges) {
        $scope.network.ipranges = []
        $scope.network._ipranges = []
      }
    })

  });




