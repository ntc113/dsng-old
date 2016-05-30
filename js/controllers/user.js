(function () {
    angular.module("myApp").controller("UserCtrl", UserCtrl);
    UserCtrl.$inject = ["$scope", "$rootScope", "$http", "$location", "$stateParams", "$sce", "$uibModal", "$state", "$interval", "$timeout", "User", "Post", "user"];
    function UserCtrl($scope, $rootScope, $http, $location, $stateParams, $sce, $uibModal, $state, $interval, $timeout, User, Post, user) {
        $scope.page = "user";
        $scope.$state = $state;
        $scope.userId = $stateParams.userId;
        $scope.url = "/api/post/api_get_posts_by_user_id/"+$scope.userId;
        $scope.show = false;
        $scope.error = {status: false, msg: ""};
        $scope.user = {};
        $scope.userInfo = {};

        init();
        $scope.$on("login-success", function (e, args) {
            init()
        });
        function init() {
            if (user.data.error == 0) {
                $scope.user = user.data.data;
                $scope.show = true;

            } else {
                $location.path("error")
            }
            if($rootScope.authenticationAzCompleted){
                var id = "" + $scope.user.id;
                var userData = azstack.azStackUsers.get(id);
                userData = angular.copy(azstack.azStackUsers.get(id));
                userData = azstack.getUserInfoByUsernameAndRequestToServerWithCallBack(id, function(users) {
                    $rootScope.setTimeout(function() {
                        if (!userData) {
                            userData = angular.copy(azstack.azStackUsers.get(id));
                            $scope.user.infoUser = userData;

                        }
                        $rootScope.$apply();
                    }, 0);
                });
                if(userData){
                    $scope.user.infoUser = userData;
                }
            }
        }
        $scope.$on("authenticationAzCompleted", function (event, args) {
            init();
        });
        $scope.unFollow = function () {
            if (!$rootScope.loggedIn) {
                $scope.showLoginBox();
                return
            }
            if ($scope.user.busy)return;
            $scope.user.busy = true;
            User.unFollow($scope.userId).success(function (data) {
                $scope.user.busy = false;
                if (data.status) {
                    $scope.user.followed = false;
                    $scope.user.totalFollower--
                }
            }).error(function (data, status, header, config) {
                $scope.user.busy = false
            })
        };
        $scope.follow = function () {
            if (!$rootScope.loggedIn) {
                $scope.showLoginBox();
                return
            }
            if ($scope.user.busy)return;
            $scope.user.busy = true;
            User.follow($scope.userId).success(function (data) {
                $scope.user.busy = false;
                if (data.error == 0) {
                    $scope.user.followed = true;
                    $scope.user.follower++;
                }
            }).error(function (data, status, header, config) {
                $scope.user.busy = false
            })
        };
    }
})();