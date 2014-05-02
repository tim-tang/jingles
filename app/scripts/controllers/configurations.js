'use strict';

angular.module('fifoApp')
  .controller('ConfigurationCtrl', function ($scope, $routeParams, wiggle, status, breadcrumbs, ngTableParams, $filter) {

    $scope.menus = [
    	{name: 'Organizations', target: 'organizations', permission: 'orgs'},
    	{name: 'Users and Roles', target: 'users_roles', permission: 'users'},
    	{name: 'Packages', target: 'packages', permission: 'packages'},
    	{name: 'Networking', target: 'networking', permission: 'networks'},
        {name: 'DTrace', target: 'dtraces', permission: 'dtraces'}
    ]

    $scope.target = $routeParams.target || 'index'

    //Process the data for the ng-table's
    var proccessData = function(source) {
        var data = $scope.searchQuery
            ? $filter('filter')(source, $scope.searchQuery)
            : source

        var order = $scope.tableParams.orderBy()
        if (order)
            data = $filter('orderBy')(data, order)

        $scope.list = data
        return data
    }

    var initView = function(target) {
    	switch (target) {
    		case 'packages':
    			$scope.packages = wiggle.packages.query();
				$scope.delete = function(pack) {
			        $scope.modal = {
			            btnClass: 'btn-danger',
			            confirm: 'Delete',
			            title: 'Confirm Package Deletion',
			            body: '<p><font color="red">Warning!</font> you are about to delete the package <b>' +
			                pack.name +"(" + pack.uuid + ")</b> Are you 100% sure you really want to do this?</p>",
			            ok: function() {
			                wiggle.packages.delete({id: pack.uuid},
			                    function success (data, h) {
			                        status.success(pack.name + ' deleted');

			                        var idx = $scope.packages.indexOf(pack)
			                        $scope.packages.splice(idx, 1)
                                    proccessData($scope.packages)
			                    },
			                    function error (data) {
			                        console.error('Delete package error:', data);
			                        status.error('There was an error deleting your packge. See the javascript console.');
			                    }
			                )
			            }
			        }

			    }

                $scope.$watch('searchQuery',  function() {proccessData($scope.packages)})
                $scope.packages.$promise.then(function() {proccessData($scope.packages)})
                $scope.tableParams = new ngTableParams({sorting: {ram: 'asc'}}, {
                    getData: function($defer, params) {
                        $defer.resolve(proccessData($scope.packages))
                    }
                })
    			break

    		case 'users_roles':
                breadcrumbs.setLast('Users and Roles')
    			$scope.users = wiggle.users.queryFull()
    			$scope.roles = wiggle.roles.query();
    			break;

    		case 'organizations':
    			$scope.orgs = wiggle.orgs.query()
    			break

            case 'networking':
                $scope.networks = wiggle.networks.queryFull()
                $scope.ipranges = wiggle.ipranges.query()
                $scope.ipranges.$promise.then(function(ranges) {
                    ranges.forEach(function(range) {
                        var cur = range.current.split(/\./);
                        var last = range.last.split(/\./);
                        var c = 0;
                        var l = 0;
                        for (var x=0; x<4; x++){
                            c += Math.pow(256, 3-x)*cur[x];
                            l += Math.pow(256, 3-x)*last[x];
                        };
                        range.full = (c > l);
                    })
                })

                $scope.delete_network = function(el, idx) {
                    $scope.modal = {
                        btnClass: 'btn-danger',
                        confirm: 'Delete',
                        title: 'Confirm Network Deletion',
                        body: '<p><font color="red">Warning!</font> you are about to delete network <b>' +
                            el.name +"(" + el.uuid + ")</b> Are you 100% sure you really want to do this?</p>",
                        ok: function() {
                            wiggle.networks.delete({id: el.uuid}, function success(data, h) {
                                var idx = $scope.networks.indexOf(el)
                                $scope.networks.splice(idx, 1)
                                status.success(el.name + ' deleted')
                            }, function error(data) {
                                console.error('Delete network error:', data)
                                status.error('There was an error deleting your network. See the javascript console.')
                            });
                        }
                    }
                }
                $scope.delete_iprange = function(el) {
                    $scope.modal = {
                        btnClass: 'btn-danger',
                        confirm: 'Delete',
                        title: 'Confirm Iprange Deletion',
                        body: '<p><font color="red">Warning!</font> you are about to delete iprange <b>' +
                            el.name +"(" + el.uuid + ")</b> Are you 100% sure you really want to do this?</p>",
                        ok: function() {
                            wiggle.ipranges.delete({id: el.uuid}, function success (data, h) {
                                var idx = $scope.ipranges.indexOf(el)
                                $scope.ipranges.splice(idx, 1)
                                proccessData($scope.ipranges)
                                status.success(el.name + ' deleted')
                            }, function error(data) {
                                console.error('Delete iprange error:', data)
                                status.error('There was an error deleting your iprange. See the javascript console.')
                            });
                        }
                    }
                }

                $scope.$watch('searchQuery',  function() {proccessData($scope.ipranges)})
                $scope.ipranges.$promise.then(function() {proccessData($scope.ipranges)})
                $scope.tableParams = new ngTableParams({sorting: {name: 'asc'}}, {
                    getData: function($defer, params) {
                        $defer.resolve(proccessData($scope.ipranges))
                    }
                })
                break

                case 'dtraces':
                    $scope.dtraces = wiggle.dtrace.query();
                    $scope.delete = function(idx) {
                        var dtrace = $scope.dtraces[idx];
                        $scope.modal = {
                            btnClass: 'btn-danger',
                            confirm: 'Delete',
                            title: 'Confirm DTrace Deletion',
                            body: '<p><font color="red">Warning!</font> you are about to delete the dtrace <b>' +
                                dtrace.name +" (" + dtrace.uuid + ") </b> Are you 100% sure you really want to do this?</p>", 
                            ok: function() {
                                wiggle.dtrace.delete({id: dtrace.uuid},
                                                 function success (data, h) {
                                                     $scope.dtraces.splice(idx, 1);
                                                     status.success('Script ' + dtrace.name + ' deleted');
                                                 },
                                                 function error (data) {
                                                     console.error('Delete dtrace error:', data);
                                                     alert('There was an error deleting your packge. See the javascript console.');
                                                 })
                            }
                        }
                    }
                    break

    	}
    }

    initView($scope.target)

  });
