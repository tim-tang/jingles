
function mk_permission_fn(wiggle, $scope) {
    return function(level) {
        delete $scope.permission;
        switch(level) {

        case 3:
            if ($scope.perm3 == "ssh") {
                $scope.show_text = true;
            } else {
                $scope.show_text = false;
            }
            $scope.permission =
                {controller_id: $scope.perm1,
                 controller_id1: $scope.perm2,
                 controller_id2: $scope.perm3};


            break;
        case 1:
            $scope.show_text = false;
            $scope.p2 = false;
            $scope.p3 = false;
            $scope.perm2 = "";
            $scope.perm3 = "";
            switch($scope.perm1) {
            case "...":
                $scope.permission = {controller_id: "..."};
                break;
            case "cloud":
                $scope.p2 = {
                    "cloud": {id: "cloud", name: "Cloud"},
                    "datasets": {id: "datasets", name: "Datasets"},
                    "dtraces": {id: "dtraces", name: "DTrace"},
                    "roles": {id: "roles", name: "Roles"},
                    "hypervisors": {id: "hypervisors", name: "Hypervisors"},
                    "ipranges": {id: "ipranges", name: "IP Ranges"},
                    "networks": {id: "networks", name: "Networks"},
                    "orgs": {id: "orgs", name: "Organizations"},
                    "packages": {id: "packages", name: "Packages"},
                    "users": {id: "users", name: "Users"},
                    "vms": {id: "vms", name: "Virtual Machines"},
                };
                break;
            case "channels":
                $scope.p2 = {}
                wiggle.hypervisors.query(function(hypers) {
                    hypers.forEach(function(res) {
                        $scope.p2[res.uuid] = {id: res.uuid, name: 'Server ' + res.alias}
                    })
                })
                wiggle.vms.query(function(vms) {
                    vms.forEach(function(res) {
                         $scope.p2[res.uuid] = {id: res.uuid, name: 'Machine ' + res.config.alias}
                    })
                })
                break;
            case "dtraces":
                wiggle.dtrace.query(function(dtraces) {
                    if (dtraces.length > 0)
                        $scope.p2 = {
                            "...": {id: "...", name: "Everything"},
                            "_": {id: "_", name: "All Dtraces"},
                        };
                    dtraces.forEach(function(dtrace){
                        $scope.p2[dtrace.uuid] = {id: dtrace.uuid, name: dtrace.name};
                    })
                });
                break;
            case "users":
                wiggle.users.query(function(users) {
                    if (users.length > 0)
                        $scope.p2 = {
                            "...": {id: "...", name: "Everything"},
                            "_": {id: "_", name: "All Users"},
                        };
                    users.forEach(function(user){
                        $scope.p2[user.uuid] = {id: user.uuid, name: user.name};
                    })
                });
                break;
            case "orgs":
                wiggle.orgs.query(function(orgs) {
                    $scope.p2 = {
                        '...': {id: '...', name: 'Everything'},
                        '_': {id: '_', name: 'All Orgs'},
                    }
                    orgs.forEach(function(org) {
                        $scope.p2[org.uuid] = {id: org.uuid, name: org.name}
                    })
                })
                break;
            case "roles":
                wiggle.roles.query(function(roles) {
                    if (roles.length > 0)
                        $scope.p2 = {
                            "...": {id: "...", name: "Everything"},
                            "_": {id: "_", name: "All Roles"},
                        };
                    roles.forEach(function(role){
                        $scope.p2[role.uuid] = {id: role.uuid, name: role.name};
                    })
                });
                break;
            case "hypervisors":
                wiggle.hypervisors.query(function(hypers) {
                    if (hypers.length > 0)
                        $scope.p2 = {
                            "...": {id: "...", name: "Everything"},
                            "_": {id: "_", name: "All Hypervisors"},
                        };
                    hypers.forEach(function(hyper){
                        $scope.p2[hyper.uuid] = {id: hyper.uuid, name: hyper.alias};
                    })
                });
                break;
            case "vms":
                wiggle.vms.query(function(vms) {
                    if (vms.length > 0)
                        $scope.p2 = {
                            "...": {id: "...", name: "Everything"},
                            "_": {id: "_", name: "All Virtual Machines"},
                        };
                    vms.forEach(function(vm){
                        $scope.p2[vm.uuid] = {id: vm.uuid};
                        var name = vm.uuid;
                        if (vm.config && vm.config.alias)
                            name = name + " (" + vm.config.alias + ")";
                        $scope.p2[vm.uuid].name = name;
                    })
                });
                break;
            case "datasets":
                wiggle.datasets.query(function(datasets) {
                    if (datasets.length > 0)
                        $scope.p2 = {
                            "...": {id: "...", name: "Everything"},
                            "_": {id: "_", name: "All Datasets"},
                        };
                    datasets.forEach(function(ds){
                        $scope.p2[ds.dataset] = {id: ds.dataset, name: ds.name + ' ' + ds.version};
                    })
                });
                break;
            case "packages":
                wiggle.packages.query(function(packages) {
                    if (packages.length > 0)
                        $scope.p2 = {
                            "...": {id: "...", name: "Everything"},
                            "_": {id: "_", name: "All Packages"},
                        };
                    packages.forEach(function(pack){
                        $scope.p2[pack.uuid] = {id: pack.uuid, name: pack.name + " (" + pack.uuid + ")"};
                    })
                });
                break;
            case "ipranges":
                wiggle.ipranges.query(function(ranges) {
                    if (ranges.length > 0)
                        $scope.p2 = {
                            "...": {id: "...", name: "Everything"},
                            "_": {id: "_", name: "All Networks"},
                        };
                    ranges.forEach(function(ipr){
                        $scope.p2[ipr.uuid] = {id: ipr.uuid, name: ipr.name + " (" + ipr.uuid + ")"};
                    })
                });
                break;
            case "networks":
                wiggle.networks.query(function(nets) {
                    if (nets.length > 0)
                        $scope.p2 = {
                            "...": {id: "...", name: "Everything"},
                            "_": {id: "_", name: "All Networks"},
                        };
                    nets.forEach(function(net){
                        $scope.p2[net.uuid] = {id: net.uuid, name: net.name + " (" + net.uuid + ")"};
                    })
                });
                break;

            }
            break;
        case 2:
            $scope.show_text = false;
            $scope.p3 = false;
            $scope.perm3 = "";
            if ($scope.perm2 == "...") {
                $scope.permission = {controller_id: $scope.perm1,
                                     controller_id1: "..."};
            } else {
                switch($scope.perm1) {
                case "cloud":
                    switch($scope.perm2) {
                    case "cloud":
                        $scope.p3 = [
                            {id: "status", name: "Status"}
                        ]
                        break;
                    case "vms":
                        $scope.p3 = [
                            {id: "list", name: "List"},
                            {id: "create", name: "Create"},
                            {id: "advanced_create", name: "Advanced Create"}
                        ];
                        break;
                    case "users":
                    case "roles":
                    case "packages":
                    case "dtraces":
                    case "ipranges":
                    case "networks":
                    case "orgs":
                        $scope.p3 = [
                            {id: "list", name: "List"},
                            {id: "create", name: "Create"}
                        ];
                        break;
                    case "datasets":
                        $scope.p3 = [
                            {id: "list", name: "List"},
                            {id: "import", name: "Import"}
                        ]
                        break;
                    case "hypervisors":
                        $scope.p3 = [
                            {id: "list", name: "List"}
                        ]
                        break;
                    }
                    break;
                case "users":
                    $scope.p3 = [
                        {id:"get", name: "See"},
                        {id:"passwd", name: "Change Password"},
                        {id:"delete", name: "Delete"},
                        {id:"grant", name: "Grant a Permission"},
                        {id:"revoke", name: "Revoke a Permission"},
                        {id:"join", name: "Join a role"},
                        {id:"leave", name: "Leave a role"}
                    ];
                    break;
                case "orgs":
                    $scope.p3 = [
                        {id: "list", name: "List"},
                        {id: "get", name: "See"},
                        {id: "edit", name: "Edit"},
                        {id: "delete", name: "Delete"},
                        {id: "create", name: "Create"}
                    ]
                    break;
                case "roles":
                    $scope.p3 = [
                        {id:"get", name: "See"},
                        {id:"delete", name: "Delete"},
                        {id:"grant", name: "Grant a Permission"},
                        {id:"revoke", name: "Revoke a Permission"},
                        {id:"join", name: "Join this role"},
                        {id:"leave", name: "Leave this role"}
                    ];
                    break;
                case "channels":
                    $scope.p3 = [
                        {id: 'join', name: 'Join'},
                        {id: 'leave', name: 'Leave'},
                    ]
                    break;
                case "vms":
                    $scope.p3 = [
                        {id:"get", name: "See"},
                        {id:"state", name: "State"},
                        {id:"delete", name: "Delete"},
                        {id:"console", name: "Console/VNC"},
                        {id:"snapshot", name: "Create a Snapshot"},
                        {id:"rollback", name: "Rollback a Snapshot"},
                        {id:"edit", name: "Edit"},
                        {id:"snapshot_delete", name: "Delete a Snapshot"},
                        {id:"ssh", name:"SSH Login"}
                    ];
                    break;
                case "dtraces":
                    $scope.p3 = [
                        {id:"get", name: "See"},
                        {id:"create", name: "Create VM's here"},
                        {id:"edit", name: "Edit"},
                        {id:"stream", name: "Stream"},
                        {id:"delete", name: "Delete"}
                    ];
                    break;
                case "hypervisors":
                    $scope.p3 = [
                        {id:"get", name: "See"},
                        {id:"create", name: "Create VM's here"},
                        {id:"edit", name: "Edit Metadata"}
                    ];
                    break;
                case "networks":
                case "ipranges":
                case "packages":
                case "datasets":
                    $scope.p3 = [
                        {id:"get", name: "See"},
                        {id:"delete", name: "Delete"},
                        {id:"edit", name: "Edit"},
                        {id:"create", name: "Create"},
                    ];
                    break;
                }
                if ($scope.p3) {
                    $scope.p3.unshift({'id': '...', name:'Everything'});
                }
            }
        };
    };
};
