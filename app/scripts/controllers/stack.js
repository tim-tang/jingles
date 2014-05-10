'use strict';

angular.module('fifoApp').controller('StackCtrl', function ($scope, wiggle, $routeParams) {
    var uuid = $routeParams.uuid;
    $scope.grouping = {}
    var groupings = {};
    wiggle.groupings.query(function (gs) {
        $scope.clusters = {};
        gs.forEach(function(g) {
            groupings[g.uuid] = g;
            if (g.type == "cluster") {
                $scope.clusters[g.uuid] = g;
            };
        })
        $scope.grouping = groupings[uuid]
        $scope.grouping._clusters = {};
        $scope.grouping.elements.forEach(function(e){
            if(groupings[e]) {
                delete $scope.clusters[e];
                $scope.grouping._clusters[e] = groupings[e];
            } else {
                $scope.grouping._clusters[e] = {name: 'DELETED', uuid:e};
            }
        });
    });
    $scope.cluster_add = function() {
        var cluster = $scope.cluster;
        wiggle.groupings.put({id: uuid,
                              controller: "elements",
                              controller_id: cluster},
                             {}, function() {
                                 delete $scope.clusters[cluster];
                                 $scope.grouping._clusters[cluster] = groupings[cluster];
                             });
    }
    $scope.remove_cluster = function (cluster){
        wiggle.groupings.delete({id: uuid,
                                 controller: "elements",
                                 controller_id: cluster.uuid},
                                {}, function() {
                                    delete $scope.grouping._clusters[cluster.uuid]
                                    if (groupings[cluster.uuid])
                                        $scope.clusters[cluster.uuid] = cluster;
                             });
    }

});
