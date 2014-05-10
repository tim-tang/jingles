'use strict';

angular.module('fifoApp').controller('GroupingsCtrl', function ($scope, wiggle) {

    wiggle.groupings.query(function (gs) {
        $scope.clusters = {};
        $scope.stacks = {};
        gs.forEach(function(g) {
            if (g.type == "cluster") {
                $scope.clusters[g.uuid] = g;
            } else if (g.type == "stack") {
                $scope.stacks[g.uuid] = g;
            }
        })
    });

    $scope.add_stack = function add_stack() {
        var name;
        if (name = window.prompt("Stack name")) {
            console.log(name);
            new wiggle.groupings({name: name, type: "stack"}).
                $save().then(function ok(res) {
                    $scope.stacks[res.uuid] = res;
                }, function err(res) {
                    console.log("err:", res);
                })
        }
    };

    $scope.add_cluster = function add_cluster() {
        var name;
        if (name = window.prompt("Cluster name")) {
            console.log(name);
            new wiggle.groupings({name: name, type: "cluster"}).
                $save().then(function ok(res) {
                    $scope.clusters[res.uuid] = res;
                }, function err(res) {
                    console.log("err:", res);
                })
        }
    };

    $scope.delete_grouping = function delete_grouping(grouping) {
        $scope.modal = {
            btnClass: 'btn-danger',
            confirm: 'Delete',
            title: 'Confirm ' + grouping.type + ' Deletion',
            body: '<p><font color="red">Warning!</font> you are about to delete the ' + grouping.type + ' <b>' +
                grouping.name + " (" + grouping.uuid + ")</b> Are you 100% sure you really want to do this?</p>",
            ok: function() {
                var uuid = grouping.uuid;
                wiggle.groupings.delete({id: uuid}, function success() {
                    if (grouping.type == 'cluster') {
                        delete $scope.clusters[uuid];
                    } else if  (grouping.type == 'stack') {
                        delete $scope.stacks[uuid];
                    }
                });
            }
        };
    };

});
