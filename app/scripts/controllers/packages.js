'use strict';

angular.module('fifoApp')
  .controller('PackagesCtrl', function ($scope, wiggle, status) {

    $scope.packages = wiggle.packages.query();

    $scope.delete = function(pack) {

        $scope.modal = {
            btnClass: 'btn-danger',
            confirm: 'Delete',
            title: 'Confirm Package Deletion',
            body: '<p><font color="red">Warning!</font> you are about to delete the package <b>' +
                pack.name +"(" + pack.uuid + ")</b> Are you 100% sure you really want to do this?</p>",
            ok: function() {
                wiggle.packages.delete({id: pack.uuid},
                    function success (data, h) {
                        status.success(pack.name + ' deleted');

                        var idx = $scope.packages.indexOf(pack) 
                        $scope.packages.splice(idx, 1)
                    },
                    function error (data) {
                        console.error('Delete package error:', data);
                        status.error('There was an error deleting your packge. See the javascript console.');
                    }
                )
            }
        }

    }

  });
