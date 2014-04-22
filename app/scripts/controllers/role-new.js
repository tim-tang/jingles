'use strict';

angular.module('fifoApp')
  .controller('RoleNewCtrl', function ($scope, $location, wiggle, status) {

    $scope.create_role = function() {
        var user = new wiggle.roles({name: $scope.name});
        user.$create({},
                     function() {
                         $location.path('/configuration/users_roles');
                     },
                     function() {
                         console.error('Create Package error:', data);
                         status.error('There was an error creating your package. See the javascript console.');
                     });
    };
  });
