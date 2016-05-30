'use strict';
angular.module('myApp.services', [])
.factory('headerFooterData', ['$http', '$q',
         function($http, $q) {
         	return {
         		getHeaderFooterData: function(type) {
         			var deferred = $q.defer();

         			return deferred.promise;
         		}
         	};
         }])
    .factory("AuthService", function () {
        var AuthService = {method: "", token: "", email: ""};
        return AuthService
    });
