'use strict';

angular.module('fifoApp')
  .controller('PackageNewCtrl', function ($scope, wiggle, $location, status, utils) {

    $scope.create_package = function() {

        if ($scope.rules === false) {
            status.error('Some rules are not valid. Please fix them');
            return;
        }

        if (!$scope.quota) {
            status.error('Quota not set!');
            return;
        }

        if (!$scope.ram) {
            status.error('RAM not set!');
            return;
        }
        if (!$scope.cpu_cap) {
            status.error('CPU cap not set!');
            return;
        }
        var pkg = new wiggle.packages({
            name: $scope.name,
            quota: parseInt($scope.quota),
            ram: parseInt($scope.ram),
            cpu_cap: parseInt($scope.cpu_cap),
            requirements: $scope.rules
        })

        if ($scope.io) pkg.zfs_io_priority = $scope.io;

        var block_size = $scope.block_size;
        if (block_size) {
            if (!(block_size == 0) && !(block_size & (block_size - 1))) {
                pkg.block_size = block_size;
            } else {
                status.error('Block size needs to be a power of two.');
                return;
            }
        }


        if ($scope.compression && $scope.compression != "none")
            pkg.compression = $scope.compression;

        pkg.$create({}, function success(data, headers) {
            $location.path('/configuration/packages');
        }, function error(data) {
            console.error('Create Package error:', data);
            status.error('There was an error creating your package. See the javascript console.');
        });
    }

    $scope.rules;

  });
