'use strict';

angular.module('fifoApp').controller('GroupingsCtrl', function ($scope, wiggle, status) {

    $scope.getData = function() {
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

            //Add the vms in the clusters
            Object.keys($scope.clusters).forEach(function(k){
                $scope.clusters[k]._vms = $scope.clusters[k].elements.map(function(vmId) {
                    return wiggle.vms.get({id: vmId})
                })
            })

            //Add the cluster object inside the stacks ones (cluster._elements = [{cluster1, cluster2, etc}])
            Object.keys($scope.stacks).forEach(function(k) {
                //The cluster of the stacks, are in the propery 'elements'
                $scope.stacks[k]._elements = $scope.stacks[k].elements.map(function(clusterId) {
                    return $scope.clusters[clusterId]
                })

            })

        });
    }
    $scope.getData()

    $scope.add_stack = function add_stack() {
        var name;
        if (name = window.prompt("Stack name")) {
            new wiggle.groupings({name: name, type: "stack"}).
                $save().then(function ok(res) {
                    status.success(name + ' stack created')
                    res._elements = [] //Add empty array, so we can add cluster to it directly.
                    $scope.stacks[res.uuid] = res;
                }, function nk(res) {
                    status.error('Could not create stack: ' + res.statusText)
                    console.error(res);
                })
        }
    };

    $scope.add_cluster = function add_cluster() {
        var name;
        if (name = window.prompt("Cluster name")) {
            new wiggle.groupings({name: name, type: "cluster"}).
                $save().then(function ok(res) {
                    $scope.clusters[res.uuid] = res;
                    status.success(name + ' cluster created')
                }, function nk(res) {
                    status.error('Could not create cluster')
                    console.error(res);
                })
        }
    };

    $scope.asociate_cluster = function(cluster, stack) {
        wiggle.groupings.put({id: stack.uuid,
                              controller: "elements",
                              controller_id: cluster.uuid},
                             {}, function() {
                                stack.elements.push(cluster.uuid)
                                stack._elements.push(cluster)
                             }, function nk(res) {
                                status.error('Could not asociate cluster: ' + res.statusText)
                                console.error(res)
                             });
    }

    $scope.deasociate_cluster = function(cluster, stack, index) {
        wiggle.groupings.delete({id: stack.uuid,
                                 controller: "elements",
                                 controller_id: cluster.uuid},
                                {}, function ok() {
                                    stack.elements.splice(index, 1)
                                    stack._elements.splice(index, 1)
                             }, function nk(res){
                                status.error('Could not remove cluster: ' + res.statusText)
                                console.error(res)
                             });
    }

    $scope.remove_vm = function(cluster, vm, index) {
        wiggle.groupings.delete({id: cluster.uuid,
                         controller: "elements",
                         controller_id: vm.uuid},
                        {}, function ok() {
                            cluster._vms.splice(index, 1)
                            cluster.elements.splice(index, 1)
                        }, function nk(res) {
                            status.error('Could not remove VM: ' + res.statusText)
                            console.error(res)
                        });
    }

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
                        status.success('Cluster removed')
                        delete $scope.clusters[uuid];
                        //When deleting a cluster, that is on a stack, reload the stack list...
                        $scope.getData()
                    } else if  (grouping.type == 'stack') {
                        status.success('Stack removed')
                        delete $scope.stacks[uuid];
                    }
                }, function nk(res) {
                    status.error('Could not delete ' + grouping.type + ': ' + res.statusText)
                    console.error(res)
                });
            }
        };
    };

});
