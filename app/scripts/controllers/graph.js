'use strict';

fifoApp.controller('GraphCtrl', function($scope, wiggle, user) {
    $scope.setTitle('Graph');

    /* Setup canvas */
    var setup = function(parentEl, opts) {
        opts = opts || {w: 500, h: 200}
        opts.margin = opts.margin || {}
        opts.margin.w = opts.margin.w || 0
        opts.margin.h = opts.margin.w || 0

        var canvas = d3.select(parentEl)
            .append('svg')
                .attr("width",  opts.w + opts.margin.w * 2)
                .attr("height", opts.h + opts.margin.h * 2)
            .append('g')
                .attr("transform", "translate(" + opts.margin.w + "," + opts.margin.h + ")")

        return canvas;

    }

    /* Build the VM nodes */
    var buildVms = function() {

        $scope.vmsNodes = ($scope.vmsNodes || canvas.selectAll('g.vm'))
            .data($scope.vms)

        var newVmsNodes = $scope.vmsNodes.enter()
            .append('g')
                .attr('class', 'vm')
                .call(forceLayout.drag)
                .on('mouseover', function(h) {

                    var pop = document.querySelector('#popover')
                    pop.style.display='block'
                    pop.style.top = h.y  + 25+ 'px'
                    pop.style.left = h.x + 210 + 'px'

                    pop.querySelector('.popover-title').innerHTML = h.config.alias + ':'
                    pop.querySelector('.popover-content').innerHTML = 'Memory: ' + h.config.ram/1024 + 'GB'

                })
                .on('mouseout', function() {
                    document.querySelector('#popover').style.display = 'none'
                })
        var logoSize = 30;
        //newVmsNodes.append('circle')
        //    .attr('r', function(d) {return d.config.ram / 150})
    /*    newVmsNodes.append('text')
            .attr('class', 'alias')
            .attr('x', logoSize/2)
            .attr('y', -4)
            .text(function(d) { return d.config.alias })
*/
        newVmsNodes.append('text')
            .attr('class', 'ram')
            .attr('x', logoSize/2)
            .attr('y', 5)
            .text(function(d) { return d.config.ram/1024 + 'G' })

        newVmsNodes.append('image')
            .attr('xlink:href', function(d) { return 'images/logos/' + (d.config._dataset && d.config._dataset.os || 'unknown') + '.png' })
            .attr('width', logoSize)
            .attr('height', logoSize)
            .attr('x', -logoSize/2)
            .attr('y', -logoSize/2)

    }

    /* Build the Hypervisor nodes */
    var buildHypers = function() {
        $scope.hypersNodes = ($scope.hypersNodes || canvas.selectAll('g.hyper'))
            .data($scope.hypers)
        var newHypersNode = $scope.hypersNodes.enter()
            .append('g')
                .attr('class', 'hyper')
                .call(forceLayout.drag)
                .on('mouseover', function(h) {

                    var pop = document.querySelector('#popover')
                    pop.style.display='block'
                    pop.style.top = h.y  + 25+ 'px'
                    pop.style.left = h.x + 210 + 'px'

                    pop.querySelector('.popover-title').innerHTML = h.name + ':'
                    pop.querySelector('.popover-content').innerHTML = 'Free memory: ' + 
                        parseInt(h.resources['free-memory']/1024) + ' of ' + 
                        parseInt(h.resources['total-memory']/1024) + 'GB'

                })
                .on('mouseout', function() {
                    document.querySelector('#popover').style.display = 'none'
                })
        var hyperSize = 60;
        newHypersNode.append('image')
            .attr('xlink:href', 'images/server.png')
            .attr({
                width: hyperSize,
                height: hyperSize,
                x: -hyperSize/2,
                y: -hyperSize/2
            })
        newHypersNode.append('text')
            .attr('y', hyperSize/2)
            .attr('text-anchor', 'middle')
            .text(function(d) { return d.name })

    }

    /* Build the links between hypers and vm's */
    var buildLinks = function(linksArray) {
        $scope.links = ($scope.links || canvas.selectAll('line.link'))
            .data(linksArray);
        $scope.links
                .enter()
                    .insert('line', '.hyper')
                        .attr('class', 'link')
                        .attr('x1', function(d) {return d.source.x})
                        .attr('y1', function(d) {return d.source.y})
                        .attr('x2', function(d) {return d.target.x})
                        .attr('y2', function(d) {return d.target.y})
                        .attr('stroke-width', function(d) {
                            
                            return d.target.config? d.target.config.ram/1024 * 2: 0;
                        })
    }

    /* Setup the force layout and build */
    var setupForceLayout = function() {
        var links = [],
            nodes = []

        /* Connect every hyper with its vm.
           Add all node types into a common 'nodes' object, and calculate the links on them,
           so the force layout can work them out */
        var hyperIdx = {}
        $scope.hypers.forEach(function(hyper, hIdx) {
            hyperIdx[hyper.name] = hIdx

            /* Add links between hypers */
            nodes.forEach(function(other) {
                links.push({source: hIdx, target: hyperIdx[other.name]})
            })

            nodes.push(hyper)
        })
        $scope.vms.forEach(function(vm, idx) {
            nodes.push(vm)
            var hIdx = hyperIdx[vm.hypervisor]
            if (typeof hIdx == 'number')
                links.push({source: hIdx, target: nodes.length-1})
            else
                console.log('WARN: no hidx for ' + vm.hypervisor)
        })

        console.log('ASI QUEDARON:', nodes, links)
        forceLayout.nodes(nodes).links(links).start()

        buildLinks(links)
    }

    var canvasOpts = {w: 800, h: 400},
        canvas = window.viz = setup('#container', canvasOpts),

        forceLayout = d3.layout.force()
            //.charge(-220)
            .charge(function(d) {
                return -400

                //TODO!
                //Charge of the node ~ to the ram.
                var charge;
                if (d.name)
                    //hyper
                    charge = -d.resources['total-memory']/100
                else
                    charge = -d.config.ram/10

                return charge
            })
            .linkDistance(100)
            .size([canvasOpts.w, canvasOpts.h])
            .on('tick', function() {

                $scope.vmsNodes.attr('transform', function(d, i) { return "translate(" + (d.x) + "," + (d.y) + ")" })
                $scope.hypersNodes.attr('transform', function(d, i) { return "translate(" + (d.x) + "," + (d.y) + ")" })

                $scope.links.attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });

            })

    $scope.vms = [];
    $scope.hypers = [];

    /*$scope.$watch('hypers.length', buildHypers)
    $scope.$watch('vms.length', function() {
        setupForceLayout()
        buildVms()
    });
*/
    var initSimu = function() {

        $scope.hypers.push({name: 'uno', resources: {}})
        $scope.hypers.push({name: 'dos', resources: {}})
        $scope.hypers.push({name: 'tres', resources: {}})

        $scope.vms.push({hypervisor: 'uno', config: {alias: 'vm1', ram: '1024'}})
        $scope.vms.push({hypervisor: 'uno', config: {alias: 'vm2', ram: '1024'}})
        $scope.vms.push({hypervisor: 'dos', config: {alias: 'vm3', ram: '1024'}})
        $scope.vms.push({hypervisor: 'tres', config: {alias: 'vm3', ram: '1024'}})

        buildHypers()
        setupForceLayout();
        buildVms()
    }
    var init= function() {

        wiggle.hypervisors.list(function(ids) {
            ids.forEach(function(id) {
                wiggle.hypervisors.get({id: id}, function(res) {
                    $scope.hypers.push(res)

                    //Load vms after hypers, so we can draw links and calculate force layout
                    if (ids.length == $scope.hypers.length) loadVms()
                })
            })
        })

        var loadVms = function() {
            wiggle.vms.list(function(ids) {
                ids.forEach(function(id) {
                    wiggle.vms.get({id: id}, function(res) {
                        $scope.vms.push(res)
                        if (ids.length == $scope.vms.length) {
                            buildHypers()
                            setupForceLayout();
                            buildVms()
                        }
                    })
                })
            })    
        }
        
    }

    $scope.$on('user_login', init)
    if (user.logged()) init()

});