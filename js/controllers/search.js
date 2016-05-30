(function () {
    angular.module("myApp").controller("SearchCtrl", SearchCtrl);
    SearchCtrl.$inject = ["$scope", "$location", "$rootScope", "$stateParams", "$timeout", "$q", "Search"];
    function SearchCtrl($scope, $location, $rootScope, $stateParams, $timeout, $q, Search) {
        $rootScope.currentPage = "search";
        $scope.keyword = decodeURIComponent($stateParams.keyword);
        $scope.limit = 10;
        $scope.offset = 0;
        $scope.users = [];
        $scope.busyUser = false;
        $scope.loadmoreUser = true;
        $scope.hasResultUser = true;
        $scope.searchUser = function () {
            if ($scope.busyUser)return;
            if (!$scope.loadmoreUser)return;
            $scope.busyUser = true;
            if ($scope.keyword == "undefined"){
                $scope.keyword = 'all_users';
            }
            var params = {keyword: $scope.keyword};
            Search.searchUser(params, $scope.offset, $scope.limit).success(function (data) {
                if (data.error == 0) {
                    if (data.total > 0) {
                        var items = data.data;
                        if (items.length > 0) {
                            for (var i = 0; i < items.length; i++) {
                                $scope.users.push(items[i])

                            }
                            $scope.offset += 10;
                        }
                    } else {
                        $scope.loadmoreUser = false;
                        $scope.hasResultUser = false
                    }
                }
                $scope.busyUser = false
            })
        };
    }
})();
