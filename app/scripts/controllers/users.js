'use strict';

angular.module('fifoApp').controller('UsersCtrl', function ($scope, wiggle) {

    $scope.users = wiggle.users.queryFull()

});
