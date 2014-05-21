'use strict';

angular.module('fifoApp')
  .controller('HeaderCtrl', function ($scope, breadcrumbs, $location, $route, $rootScope, $http, gettextCatalog, auth, howl, wiggle, $cookies) {

  	$scope.breadcrumbs = breadcrumbs;

    //Menu higlighting
  	$scope.isActive = function (str) {
  		return $location.path().match(str) !== null;
  	}

    //Login stuff: pass the auth object to the view, kinda handy i.e. for Logout click
    $scope.auth = auth

    //Show the config button, if has permission to any of this config.
    var configPerms = [
      ['cloud','orgs','list'],
      ['cloud','users','list'],
      ['cloud','packages','list'],
      ['cloud','networks','list'],
      ['cloud','dtraces','list'],
    ]
    auth.userPromise().then(function(u) {
      var can = false
      configPerms.forEach(function(perm) {
        if (auth.canAccess(perm)) can = true;
      })
      $scope.showConfig = can
      $scope.showMore = $scope.showConfig || auth.canAccess(['cloud','groupings','list']) || auth.canAccess(['cloud','hypervisors','list'])
    })

    //Help url
  	$rootScope.$on('$routeChangeSuccess', function(event, current){
  		$scope.helpUrl = current.helpUrl || '';

      //Hide the menu dropdown of the mobile version. This should match @grid-float-breakpoint. Not working good. commenting it.
      // if ($(window).width() < 768)
      //   angular.element('.navbar-toggle').click();

      document.title = current.name ? gettextCatalog.getString(current.name) + ' - FiFo': 'FiFo Cloud';
  	})

  	//Loading spinner
  	$rootScope.$watch(
  		function() {return $http.pendingRequests.length},
  		function() {
  			$scope.loading = $http.pendingRequests.length
  	})

    //Language
    $scope.lang = gettextCatalog.currentLanguage;
    $scope.setLang = function(lang) {
      $scope.lang = gettextCatalog.currentLanguage = lang;
    }
    var langs = Object.keys(gettextCatalog.strings);

    //Put the default lang, the others are automatically added
    if (langs.indexOf('en')<1) langs.push('en');

    $scope.languages = langs.sort();

    //Backend selector
    $scope.changeBackend = function(back, idx) {
      wiggle.setEndpoint(back.endpoint)
      $route.reload();
      $cookies.backend = JSON.stringify(back)
    }

    $scope.backends = Config.backends || [{name: 'This', endpoint: ''}];
    $scope.selected_backend = $scope.backends[0];

    //Read the backend selector from the cookie.
    try {
      if ($cookies.backend) {
        var back = JSON.parse($cookies.backend)

        $scope.changeBackend(back)

        //Change the selector
        $scope.backends.forEach(function(b) {
          if (b.endpoint == back.endpoint)
            return $scope.selected_backend = b
        })
      }
    } catch(e) {
      console.error('Invalid backend cookie:', e)
      delete $cookies.backend
    }

  });
