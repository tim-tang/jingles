'use strict';

angular.module('fifoApp')
  .controller('MainCtrl', function ($scope, wiggle, auth) {

    $scope.msgTrClass = function(type) {
        return type == 'critical' ? 'error': type;
    }

    $scope.show = function() {

        wiggle.cloud.get(function res (data) {
            $scope.metrics = data.metrics
            $scope.versions = data.versions
            $scope.messages = Config.evaluate_cloud(data.metrics).concat(data.warnings)
            $scope.adjustMessage = Config.adjustMessage
            $scope.cloud_ok = $scope.messages.filter(function(i) {
                /* Msg from the server has no ok attr, so set it. */
                i.ok = !!i.ok;
                return !i.ok;
            }).length < 1

            $scope.cloud_status = $scope.cloud_ok ? 'images/healthy-cluster.png' : 'images/unhealthy-cluster.png'
            $scope.cloud_resume = $scope.cloud_ok ? 'Your cloud is fine!'        : 'Your cloud needs some attention!'

            $scope.user = auth.currentUser()
            $scope.keys = Object.keys($scope.user.keys).length
            $scope.activeOrg = wiggle.orgs.get({id: $scope.user.org})
            
            $scope.groups = []
            $scope.user.groups.forEach(function(gid) {
                wiggle.groups.get({id: gid}, 
                    function(res) {
                        $scope.groups.push(res.name)
                })
            })
        })

    }

    // $cookies["x-snarl-token"] && $scope.show()

    /* Update data on memory change */
    $scope.$on('memorychange', $scope.show);

    $scope.show();

  });
