'use strict';

angular.module('fifoApp')
  .factory('datasetsat', function ($resource, $http) {
 
    var endpoint = "http://" + Config.datasets + "/"
    var services = {
        datasets: $resource(endpoint + 'datasets/:id',
                            {id: '@id'}),
    }

    /* Gets with cache! */
    services.datasets.get = function(obj, success, error) {
        res = $http.get(endpoint + 'datasets/' + obj.id, {cache: true})
            .success(success)
            .error(function(data) {
                error && error(data)
            });
        return res;
    }
    return services

  });
