'use strict';

angular.module('fifoApp')
	.directive('topology', function() {
		return {
			// templateUrl: '/views/partials/topology.html',
			restrict: 'AE',
			controller: function topologyController($scope) {

				$scope.buildDataTree = function(servers) {

					//1.- Build the nodes object
					var nodes = [],
						nodesById = []

					servers.forEach(function(server) {

						server.path.forEach(function(path) {

							var node;

							//Its the server
							if (path.name == server.uuid) {
								node = server
								node.cost = path.cost
								// node.name = path.name        
								node.isServer = true
							} else {
								node = path
								node.uuid = path.name + path.cost //For the case when same path.name from different hypers have different costs.
								node.isServer = false
							}

							if (nodesById.indexOf(node.uuid) < 0) {
								nodes.push(node)
								nodesById.push(node.uuid)
							}

						})
					})
					// console.log('nodes:', nodes)

					//2.- Get the links between them
					var connections = [],
						connectionsById = {}

					servers.forEach(function(server) {
						var lastPath = null;
						server.path.forEach(function(path) {

							if (lastPath !== null) {
								//dont repeate link.
								// var connectionId = lastPath.name + lastPath.cost + path.name + path.cost
								var connectionId = lastPath.name + path.name
								if (!connectionsById[connectionId]) {
									connections.push({
										source: path.isServer === false ? path.name + path.cost : path.name,
										target: lastPath.isServer === false ? lastPath.name + lastPath.cost : lastPath.name
									})
									connectionsById[connectionId] = true
								}
							}

							lastPath = path

						})
					})
					// console.log('connections:', connections)

					//3.- Transform the connection in 'links' (nodes index)
					var links = connections.map(function(con) {
							return {
								source: nodesById.indexOf(con.source),
								target: nodesById.indexOf(con.target)
							}
						})
						// console.log('links:', links)

					return {
						nodes: nodes,
						links: links
					}

				}

				$scope.paintNodes = function(data) {

					var links = $scope.svg.selectAll('line')
						.data(data.links)

					var newLink = links.enter()
						.append('line')
						.attr("r", 1)
						.style("stroke", function(d) {
							return '#ccc'
						})

					var nodes = $scope.svg.selectAll('circle')
						.data(data.nodes, function(d) {
							return d.uuid
						})

					var newNode = nodes.enter()
						.append('g')
						.attr('class', function(d) {
							return d.isServer ? 'node clickable' : 'node'
						})
						.attr('transform', function(d) {
							return "translate(" + d.x + "," + d.y + ")"
						})
						.call($scope.force.drag)

					newNode.append('circle')
						.attr('r', function(d) {
							return d.isServer ? 9 : 6
						})
						.attr('fill', function(d) {
							return d.isServer ? 'blue' : 'orange'
						})
						.call($scope.force.drag)

					nodes.exit()
						.remove()

					nodes.on('click', function(node) {
						if (!node.isServer) return;

						//Unselect all nodes
						nodes.attr('stroke-width', '1px')
						//The clicked node
						var el = d3.select(this)
							.transition()
							.attr('stroke-width', '3px')

						//Mark the nodes that are part of the path of the server
						var nodesById = node.path.map(function(path) {
							return path.uuid
						}).filter(function(d) {
							return d
						})
						var pathNodes = data.nodes.map(function(node) {
							if (nodesById.indexOf(node.uuid) > -1)
								return node
						}).filter(function(d) {
							return d
						})

						//Reset the color of all nodes
						$scope.svg.selectAll('circle')
							.attr('fill', function(d) {
								return d.isServer ? 'blue' : 'orange'
							})

						//Color the node in the path of the hypervisor
						$scope.svg.selectAll('circle')
							.data(pathNodes, function(d) {
								return d.uuid
							})
							.transition()
							.attr('fill', 'yellow')

						$scope.$apply(function() {
							$scope.selected = node
						})

					})

					$scope.force
						.nodes(data.nodes)
						.links(data.links)
						.on('tick', function tick(e) {
							// Push sources up and targets down to form a weak tree.
							var k = 6 * e.alpha;
							data.links.forEach(function(d, i) {
								d.source.y -= k;
								d.target.y += k;
							});

							nodes.attr('transform', function(d) {
								return "translate(" + d.x + "," + d.y + ")"
							})

							links.attr("x1", function(d) {
								return d.source.x;
							})
								.attr("y1", function(d) {
									return d.source.y;
								})
								.attr("x2", function(d) {
									return d.target.x;
								})
								.attr("y2", function(d) {
									return d.target.y;
								});
						})
						.start()

				},

				$scope.togglelabels = function(data) {
					$scope.showLabels = !$scope.showLabels

					var g = $scope.svg.selectAll('g.node')
					if ($scope.showLabels) {
						g.data(data.nodes)
							.append('text')
							.attr({
								class: 'text',
								dy: function(d) {
									return d.isServer ? 20 : -10
								},
								// dx: function(d) {return 25},
								'text-anchor': 'middle',
								'font-size': function(d) {
									return d.isServer ? 12 : 10
								}
							})
							.text(function(d) {
								return d.isServer ? d.alias : d.name + ' (' + d.cost + ')'
							});
					} else {
						g.selectAll('text').remove()
					}
				},

				//Dummy data
				$scope.buildDataTreeNoop = function dummy() {

					return {
						"nodes": [
							{uuid: '1', "name": "cero", cost: 0},
							{uuid: '2', "name": "uno", cost: 1},
							{uuid: '3', "name": "dos", cost: 2},
							{uuid: '4', "name": "tres", cost: 3},
							{uuid: '5', "name": "cuatro", cost: 0},
							{uuid: '6', "alias": "cinco", cost: 0, isServer: true},
							{uuid: '7', "alias": "seis", cost: 0, isServer: true},
							{uuid: '8', "alias": "siete", cost: 0, isServer: true},
							{uuid: '9', "alias": "ocho", cost: 0, isServer: true},
						],
						"links": [
							{"source": 0, "target": 1},
							{"source": 0, "target": 2},
							{"source": 0, "target": 3},
							{"source": 1, "target": 4},
							{"source": 4, "target": 5},
							{"source": 2, "target": 6},
							{"source": 3, "target": 7},
							{"source": 3, "target": 8},
						]
						}
				}

			},

			scope: {
				servers: '=',
				selected: '='
			},

			link: function postLink(scope, element, attrs) {

				scope.svg = d3.select('#' + attrs.id).append('svg').attr('height', 250)

				scope.force = d3.layout.force()
				// .size([window.innerWidth||500,300])
					.size([500, 300])
					.charge(-170)
					.linkDistance(40)

				scope.servers.$promise.then(function(servers) {
					var treeData = scope.buildDataTree(servers)
					scope.paintNodes(treeData)
					scope.togglelabels(treeData)
				})

			}
		};
	});