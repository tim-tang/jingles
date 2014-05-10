'use strict';

angular.module('fifoApp').controller('ClusterCtrl', function ($scope, wiggle, $routeParams) {
    var uuid = $routeParams.uuid;
    $scope.grouping = {}
    var groupings = {};
    wiggle.groupings.query(function (gs) {
        $scope.stacks = {};
        gs.forEach(function(g) {
            groupings[g.uuid] = g;
            if (g.type == "stack") {
                $scope.stacks[g.uuid] = g;
            };
        })
        $scope.grouping = groupings[uuid]
        $scope.grouping._vms = {};
        $scope.grouping._stacks = {};
        $scope.grouping.elements.forEach(function(e){
            $scope.grouping._vms[e] = wiggle.vms.get({id: e})
        });
        $scope.grouping.groupings.forEach(function(e){
            if(groupings[e]) {
                delete $scope.stacks[e];
                $scope.grouping._stacks[e] = groupings[e];
            } else {
                $scope.grouping._stacks[e] = {name: 'DELETED', uuid:e};
            }
        });
    });
    $scope.stack_join = function() {
        var stack = $scope.stack;
        wiggle.groupings.put({id: uuid,
                              controller: "groupings",
                              controller_id: stack},
                             {}, function() {
                                 delete $scope.stacks[stack];
                                 $scope.grouping._stacks[stack] = groupings[stack];
                             });
    }
    $scope.remove_stack = function (stack){
        wiggle.groupings.delete({id: uuid,
                                 controller: "groupings",
                                 controller_id: stack.uuid},
                                {}, function() {
                                    delete $scope.grouping._stacks[stack.uuid]
                                    if (groupings[stack.uuid])
                                        $scope.stacks[stack.uuid] = stack;
                             });
    }

    $scope.remove_vm = function (vm){
        wiggle.groupings.delete({id: uuid,
                                 controller: "elements",
                                 controller_id: vm.uuid},
                                {}, function() {
                                    delete $scope.grouping._vms[vm.uuid]
                                });
    }

});
