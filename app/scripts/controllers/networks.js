'use strict';

angular.module('fifoApp')
  .controller('NetworksCtrl', function ($scope, wiggle, status) {

    $scope.delete = function(el, idx) {
        $scope.modal = {
            btnClass: 'btn-danger',
            confirm: 'Delete',
            title: 'Confirm Network Deletion',
            body: '<p><font color="red">Warning!</font> you are about to delete network <b>' +
                el.name +"(" + el.uuid + ")</b> Are you 100% sure you really want to do this?</p>",
            ok: function() {
                wiggle.networks.delete({id: el.uuid}, function success(data, h) {
                    var idx = $scope.networks.indexOf(el)
                    $scope.networks.splice(idx, 1)
                    status.success(el.name + ' deleted')
                }, function error(data) {
                    console.error('Delete network error:', data)
                    status.error('There was an error deleting your network. See the javascript console.')
                });
            }
        }
    }

    $scope.networks = wiggle.networks.queryFull()
  });
