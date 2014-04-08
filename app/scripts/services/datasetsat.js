'use strict';

angular.module('fifoApp')
  .factory('datasetsat', function ($resource, $http) {
 
    var endpoint = Config.datasets

    //If the config does not have a http(s), add https as default
    if (endpoint.indexOf('http') != 0)
        endpoint = 'https://' + endpoint

    var services = {
        endpoint: endpoint,
        datasets: $resource(endpoint + '/datasets/:id',
                            {id: '@id'}),
    }

    /* Gets with cache! */
    services.datasets.get = function(obj, success, error) {
        res = $http.get(endpoint + '/datasets/' + obj.id, {cache: true})
            .success(success)
            .error(function(data) {
                error && error(data)
            });
        return res;
    }
    return services

  });
