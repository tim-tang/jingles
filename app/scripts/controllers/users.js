'use strict';

angular.module('fifoApp').controller('UsersCtrl', function ($scope, wiggle) {

    $scope.init = function() {
        $scope.groups = {};
        $scope.orgs = {};
        $scope.users = [];
        wiggle.users.query(function(users) {
            $scope.users = users.map(function(user) {
                user._orgs = {};
                user._groups = {};
                user.orgs.forEach(function (uuid) {
                    if ($scope.orgs[uuid]) {
                        user._orgs[uuid] = $scope.orgs[uuid]
                    } else {
                        user._orgs[uuid] = {uuid: uuid, name: "DELETED", deleted: true}
                    }
                });

                user.groups.forEach(function (uuid) {
                    if ($scope.groups[uuid]) {
                        user._groups[uuid] = $scope.groups[uuid]
                    } else {
                        user._groups[uuid] = {uuid: uuid, name: "DELETED", deleted: true}
                    }
                });
                return user;
            });
        });
        wiggle.groups.query(function(gs) {
            $scope.groups = gs;
            for (var i = 0; i < $scope.users.length; i++) {
                gs.forEach(function(g) {
                    if ($scope.users[i]._groups[g.uuid]) {
                        $scope.users[i]._groups[g.uuid] = g;
                    };
                });
            };
        });
        wiggle.orgs.query(function(os) {
            $scope.orgs = os;
            for (var i = 0; i < $scope.users.length; i++) {
                os.forEach(function(o) {
                    if ($scope.users[i]._orgs[o.uuid]) {
                        $scope.users[i]._orgs[o.uuid] = o;
                    };
                });
            };
        })

    };
    $scope.init();
});
