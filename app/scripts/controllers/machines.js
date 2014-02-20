'use strict';

angular.module('fifoApp')
.controller('MachinesCtrl', function ($scope, $http, $filter, wiggle, status, vmService, $q, auth, ngTableParams) {

    //To hide colums based on permission on the view
    $scope.auth = auth;

    $scope.infinitScroll = function() {
      if ($scope.tableParams.count() >= $scope.vms.length)
        return;
      $scope.tableParams.count($scope.tableParams.count() + 25);
    }

    $scope.start = function(vm) {
      vmService.executeAction('start', vm.uuid, vm.config &&  vm.config.alias)
    }

    $scope.connect = function(vm) {
      if (vm.config.type == 'kvm')
        window.open('vnc.html?uuid=' + vm.uuid);
      else
        window.open('console.html?uuid=' + vm.uuid);
    }

    var filterData = function() {
      var p = $scope.tableParams;

      var data = $scope.searchQuery ? $filter('filter')($scope.vms, $scope.searchQuery) : $scope.vms;
      data = p.sorting()? $filter('orderBy')(data, p.orderBy()) : data

      $scope.vmsFiltered = data.slice((p.page() - 1) * p.count(), p.page() * p.count());
    }

    var listenEvents = function() {

      $scope.$on('state', function(e, msg) {
          var vm = $scope.vms.hash[msg.channel];
          if (!vm) return;
          var failed = function(reason) {
              status.error("The creation of the VM " + vm.config.alias +
                           "(" + vm.uuid + ") failed. <br/>" + reason);
          }
          vm.state = msg.message.data;
          vmService.updateCustomFields(vm);
          if (vm.state == 'failed') {
              failed(vm.state_description);
          };
          $scope.$apply()
      })

      $scope.$on('update', function(e, msg) {

        requestsPromise.then(function() {
          var vm = $scope.vms.hash[msg.channel];

          vm.config = msg.message.data.config;
          vmService.updateCustomFields(vm);

          /* Get the extra data */
          wiggle.datasets.get({id: vm.config.dataset}, function(ds) {
              vm.config._dataset = ds;
          })
          wiggle.packages.get({id: vm.config.package}, function(pack) {
              vm._package = pack
          })
          if (vm.owner)
              wiggle.orgs.get({id: vm.owner}, function(org) {
                  vm._owner = org
              })

          // $scope.$apply()
        })
      })

      $scope.$on('delete', function(e, msg) {

        //Wait for the list to exists, before deleting an element of it.
        requestsPromise.then(function() {

          for (var i=0; i < $scope.vms.length; i++) {
            if ($scope.vm[i].uuid == msg.channel) {
              $scope.vms.splice(i, 1);
              break;
            }
          }
          filterData()
        })
      })
    }

    var startRequests = function() {

      var defered = $q.defer();

      $scope.tableParams = new ngTableParams({
        page: 1,
        count: 25,
        total: 0, //0=disable
        sorting: {
          'config.alias': 'desc' //Could save this in the user metadata.. :P
        },
        counts: [] ,//[] = disable ngTable pagination buttons
      }, {
        getData: function($defer, params) {
          filterData()
          $defer.resolve($scope.vmsFiltered)
        }
      })

      //When something on the table changes, i.e. infinit scroll detected.
      $scope.$watch('tableParams', function() {
        filterData()
      }, true);

      $scope.$watch('searchQuery', function(val) {
        filterData()

        if (typeof val != 'undefined')
          auth.currentUser().mdata_set({vm_searchQuery: val})
      })

      $scope.vmsFiltered = []

      $scope.vms = wiggle.vms.queryFull()

      $scope.vms.$promise.then(function(vms) {
        vms.forEach(vmService.updateCustomFields)
        defered.resolve()
      })

      listenEvents()

      return defered.promise

  }

  var requestsPromise = startRequests()
  
  requestsPromise.then(function() {
    $scope.searchQuery = auth.currentUser().mdata('vm_searchQuery');
    filterData()
    $scope.infinitScroll()
  });

  });
