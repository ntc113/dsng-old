(function () {
    "use strict";
    angular.module("myApp").factory("User", userFactory);
    function userFactory($http, $window, $q, $cookies, $rootScope, $cacheFactory) {
        var User = {
            getUserInfo: getUserInfo,
            getUserAvatar: getUserAvatar,
            getUsersAvatar: getUsersAvatar,
            updateInfo: updateInfo,
            getFriend: getFriend,
            follow: follow,
            unFollow: unFollow,
            getUserAz: getUserAz
        };
        return User;
        function getUserInfo(userId) {
            var url = "/api/user/api_get_user_by_id/"+userId;
            return $http.get(url)
        }
        function getUserAvatar(userId) {
            var url = "/api/user/api_get_user_avatar_by_id/"+userId;
            return $http.get(url)
        }
        function getUsersAvatar(userIds) {
            var url = "/api/user/api_get_user_avatar_by_ids";
            return $http.post(url, {ids: userIds})
        }

        function updateInfo(userId, info) {
            info.userId = userId;
            var url = "/ajax/index.php/user/updateinfo";
            return $http.post(url, serializeData(info))
        }

        function getFriend() {
            if (!$rootScope.loggedIn)return;
            var params = {limit: 10};
            var url = "/ajax/index.php/search/getfriend";
            return $http.get(url, {params: params})
        }

        function follow(userId) {
            var url = "/api/user/api_follow/pc";
            return $http.post(url, {user_id: userId})
        }

        function unFollow(userId) {
            var url = "/api/user/api_unfollow/pc";
            return $http.post(url, serializeData({userId: userId}))
        }

        function getUserAz(id) {
            var user = null;
            if ($rootScope.authenticationCompleted) {
                if (id) {
                    id = "" + id;
                    user = angular.copy(azstack.azStackUsers.get(id));
                    if ($rootScope.requestedUser.indexOf(id) == -1) {
                        $rootScope.requestedUser.push(id);
                        user = angular.copy(azstack.getUserInfoByUsernameAndRequestToServerWithCallBack(id, function(users) {
                            $rootScope.setTimeout(function() {
                                $rootScope.$apply();
                            }, 0);
                        }));
                    }
                    if (!user) {
                        user = angular.copy(azstack.azStackUsers.get(id));
                    }
                }
            }

            return user;
        }


    }
})();