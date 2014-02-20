'use strict';

angular.module('fifoApp')
  .controller('DtracesCtrl', function ($scope, wiggle, status) {
 
    $scope.dtraces = wiggle.dtrace.query();

    $scope.delete = function(idx) {
        var dtrace = $scope.dtraces[idx];

        $scope.modal = {
            btnClass: 'btn-danger',
            confirm: 'Delete',
            title: 'Confirm DTrace Deletion',
            body: '<p><font color="red">Warning!</font> you are about to delete the dtrace <b>' +
                dtrace.name +" (" + dtrace.uuid + ") </b> Are you 100% sure you really want to do this?</p>", 
            ok: function() {
                wiggle.dtrace.delete({id: dtrace.uuid},
                                 function success (data, h) {
                                     $scope.dtraces.splice(idx, 1);
                                     status.success('Script ' + dtrace.name + ' deleted');
                                 },
                                 function error (data) {
                                     console.error('Delete dtrace error:', data);
                                     alert('There was an error deleting your packge. See the javascript console.');
                                 })
            }
        }
    }

  });
