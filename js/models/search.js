(function () {
    angular.module("myApp").factory("Search", searchFactory);
    function searchFactory($http) {
        var Search = {
            searchUser: searchUser
        };
        return Search;

        function searchUser(params, offset, limit) {
            var url = "/api/user/api_get_search_users/"+offset+"/"+limit;
            return $http.get(url, {params: params})
        }

    }
})();