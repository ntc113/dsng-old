'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
.controller('rootCtrl', ['$scope', '$rootScope', '$uibModal', 'User', '$timeout', '$http', 'ngProgressFactory', '$window', function($scope, $rootScope, $uibModal, User, $timeout, $http, ngProgressFactory, $window) {
    $rootScope.baseURL = window.location.protocol + "//" + window.location.host + "/";
    $rootScope.txtLength = 300;
    $rootScope.isMobile = false;
    $rootScope.authenticationAzCompleted = false;
    $rootScope.recentChats = {};
    $rootScope.boxChats = {};
    $rootScope.requestedUser = [];
    var isMobile = false;
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;
    if(isMobile){
        $rootScope.isMobile = true;
    }
    $rootScope.page = 'BeatVN';
    $rootScope.showLoginBox = function () {
        if ($rootScope.loggedIn)return;
        $rootScope.remind = false;
        var modalInstance = $uibModal.open({
            size: "lg",
            windowTemplateUrl: "/views/post/window_login.html",
            templateUrl: "/views/home/login.html",
            windowClass: "modal-border",
            controller: "LoginCtrl"

        });
        modalInstance.result.then(function (data) {
            if (typeof data != "undefined" && data == "success")$rootScope.$broadcast("login-success", {})
        });
        return
    };
    $rootScope.loadingComment = false;
    $rootScope.showRegistrationBox = function () {
        if ($rootScope.loggedIn)return;
        $rootScope.remind = false;
        var modalInstance = $uibModal.open({
            size: "lg",
            windowTemplateUrl: "/views/post/window_login.html",
            templateUrl: "/views/home/registration.html",
            windowClass: "modal-border",
            controller: "LoginCtrl"

        });
        modalInstance.result.then(function (data) {
            if (typeof data != "undefined" && data == "success")$rootScope.$broadcast("login-success", {})
        });
        return
    };
    $rootScope.getApp = function () {
        var modalInstance = $uibModal.open({
            size: "m",
            templateUrl: "/views/home/getapp.html",
            controller: "ComposeCtrl",
            windowTemplateUrl: "/views/home/window.html",
        });

    };
    $rootScope.rules = function () {
        var modalInstance = $uibModal.open({
            size: "lg",
            windowTemplateUrl: "/views/home/windowPolicy.html",
            templateUrl: "/views/home/rules.html",
            controller: "ComposeCtrl"
        });

    };
    $scope.logout = function () {
        $http.post("/api/user/api_logout/pc").success(function (data, status, header, config) {
            if (!data.error) {
                $rootScope.loggedIn = false;
                $rootScope.me = {};
                $window.location.reload()
            }
        }).error(function (data, status, header, config) {
        })
    };
    $rootScope.openBoxChat = function (chatId, type, name, senderId) {
        if (!$rootScope.loggedIn) {
            $scope.showLoginBox();
            return
        }
        if(!chatId){
            alert('Dữ liệu đang được cập nhật vui lòng chờ chút');
            return;
        }
        if(Object.keys($rootScope.boxChats).length > 2){
            for (var first in $rootScope.boxChats) break;
            delete $rootScope.boxChats[first];
        }
        $rootScope.boxChats[chatId] = {messages: {}, mini: false, focus: true, name: name, senderId: senderId}

        azstack.azGetListUnreadMessages(type, chatId);
        azstack.azGetListModifiedMessages(0, type, chatId);
    };
    $scope.show = false;
    $scope.init = function () {
        User.getUserInfo("me").success(function (data) {
            if (data.error == 0) {
                $rootScope.loggedIn = true;
                $rootScope.$broadcast("get-user-info-success", {});
                $rootScope.me = data.data;
                var azAppID = "d180ba42469411aef6db7ee03aa9673b";
                var publicKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwlYpAkrChsD6UHlUTO1PKRpAEpFuyNMsn/JPRJoNUuutKNDmHTomeRfUy48RbjwcZSMfFBo7Bl8c/C3GIwTZa8iNfakJjcr4P0Ei6X9NhcD+glRCd8avvEFYuMausxtW8HPHJhdeQXw5mnBJVqVG/QZ7Tq2yy8IwrIf7O7Qv3ex6n4Jljqz+O/xa1pGsA215hQ0TLi2kxc/M++V2QKUrRHBWEaBm4tihUi4r8GpsgZ8aeQH8/KiV7LBq7sp4SaHx8j/hvnj68TRz1rJD5N7/xDC6WEtbdNYazlJ1Oa474xWqSmr+SBPhK+uCa2Q4IxxPoqgZ5EeDcByzHWKBeoXLVwIDAQAB';
                var azStackUserId = data.data.id;
                var fullname = data.data.display_name;
                var userCredentials = data.data.token;
                azstack.connect(azAppID, publicKey, azStackUserId, userCredentials, fullname);
                azstack.onAuthenticationCompleted = function (code, authenticatedUser) {
                    azstack.azGetListModifiedConversations(0);
                    $rootScope.authenticationAzCompleted = true;
                    $rootScope.$broadcast('authenticationAzCompleted');
                    $rootScope.$apply();
                }
                $scope.listUsersForChat = [];

                $http.get('/api/user/api_get_users_for_chat/0/11')
                    .success(function(data, status, headers, config) {
                        $scope.listUsersForChat = data.data;
                        var hList = window.innerHeight-58;
                        $('.sidebar-scroll').css('height', hList);
                    });
            } else {
                $rootScope.loggedIn = false;
                $rootScope.appReady = true
            }
        }).error(function () {
            $rootScope.appReady = true
        });

        $rootScope.setTimeout = function(func, time) {
            var interval = setInterval(function() {
                clearInterval(interval);
                setTimeout(func, time);
            });
        };
        $rootScope.menus = [];
        $http.get('/api/category/api_get_categories')
            .success(function(data, status, headers, config) {
                $rootScope.menus = data;
            });

        $timeout(function(){
            $scope.show = true;
        }, 2000);
        $scope.activities = [];
        $http.get('/api/post/api_get_activities?device_id=pc')
            .success(function(data, status, headers, config) {
                if(data.count > 0){
                    $scope.activities = data.data;
                }
            });
        $scope.awards = [];
        $http.get('/api/award/api_get_awards?device_id=pc')
            .success(function(data, status, headers, config) {
                $scope.awards = data;
            });
        $scope.listUsers = [];
        $scope.preLoadingUsers = true;

        $http.get('/api/user/api_get_users/0/11')
            .success(function(data, status, headers, config) {
                $scope.listUsers = data.data;
                $scope.preLoadingUsers = false;
            });
    };
    $scope.shareFb = function (id) {

        var url = $rootScope.baseURL+'post/'+id;
        $timeout(function () {
            $window.FB.ui({method: "share", href: url}, function (response) {
            })
        }, 10)
    };
    $scope.selectCate = function(){
        if (!$rootScope.loggedIn) {
            $scope.showLoginBox();
            return
        }
        $rootScope.remind = false;
        var modalInstance = $uibModal.open({
            size: "lg",
            windowTemplateUrl: "/views/post/window.html",
            templateUrl: "/views/post/select_categories.html",
            controller: "ComposeCtrl"

        });
        modalInstance.result.then(function (data) {
            if (typeof data != "undefined" && data == "success")$rootScope.$broadcast("login-success", {})
        });
        return
    };
    $scope.$on("onListModifiedConversationReceived", function (event, packet) {
        if (packet.done == 1) {
            //$rootScope.messages.avatar = 'http://www.beatvn.com/images/beatvn.png';
            //User.getUserInfo(senderId).success(function (data, status, header, config) {
            //    if(data.error == 0){
            //        $rootScope.messages.avatar = data.data.avatar;
            //    }
            //})
            var ids = [];
            for(var i in packet.list) {
                packet.list[i].avatar = 'http://www.beatvn.com/images/beatvn.png';
                ids.push(packet.list[i].chatTarget.azStackUserID);
            }
            User.getUsersAvatar(ids).success(function (data, status, header, config) {
                if(data.error == 0){
                    for(var i in packet.list) {
                        packet.list[i].avatar = 'http://www.beatvn.com/images/beatvn.png';
                        for(var idx in data.data) {
                            if(packet.list[i].chatTarget.azStackUserID == data.data[idx].id){
                                packet.list[i].avatar = data.data[idx].avatar;
                            }
                        }
                    }
                }
            });

            $rootScope.recentChats = packet.list;
            $rootScope.$apply();
        }
    });
    $scope.$on("onListModifiedMessagesReceived", function (event, packet) {
        if (packet.done == 1) {
            $rootScope.boxChats[packet.chatId].messages = packet.list.reverse();
            $rootScope.$apply();
        }
    });
    $scope.$on("login-success", function (event, args) {
        $scope.init();

    });
    $scope.$on("authenticationAzCompleted", function (event, args) {

        for(var index in $scope.listUsersForChat) {
            if($scope.listUsersForChat[index].is_following){
                $rootScope.getAzInfo($scope.listUsersForChat[index].id, index);
                $rootScope.$apply();
            }
        }

    });
    $rootScope.getAzInfo = function(id, index){
        if( $rootScope.authenticationAzCompleted){
            id = "" + id;
            var user = azstack.azStackUsers.get(id);
            user = angular.copy(azstack.azStackUsers.get(id));
            if ($rootScope.requestedUser.indexOf(id) == -1) {
                $rootScope.requestedUser.push(id);
                user = azstack.getUserInfoByUsernameAndRequestToServerWithCallBack(id, function(users) {
                    $rootScope.setTimeout(function() {
                        if (!user) {
                            user = angular.copy(azstack.azStackUsers.get(id));
                            user.lastVisitDate = timeConverter(user.lastVisitDate);

                            $scope.listUsersForChat[index].infoUser = user;

                        }
                        $rootScope.$apply();
                    }, 0);
                });
            }
            if(user){
                user.lastVisitDate = timeConverter(user.lastVisitDate);
                $scope.listUsers[index].infoUser = user;
            }
        }
    };
    $scope.init();
}])
.controller('ComposeCtrl', ['$scope','$http','$location','$rootScope', '$uibModal', '$uibModalInstance', '$state', function($scope,$http,$location,$rootScope, $uibModal, $uibModalInstance, $state) {
    $scope.closeModal = function () {
        $uibModalInstance.close()
    };
    $scope.images = [];
    $scope.is_anonymous = 0;
    $scope.privacy = 'Mọi người';
    $scope.updateImages = function(data){
        console.log(data.error)
        $scope.images.push(data);
    };
    $scope.changePrivacy = function(privacy){
        if(privacy == 'Anonymous'){
            $scope.privacy = 'Ẩn danh';
            $scope.is_anonymous = 1;
        }else{
            $scope.is_anonymous = 0;
            $scope.privacy = 'Mọi người';
        }
    };
    $scope.error = 0;
    $scope.error_msg = '';
    $scope.formData = {};
    $scope.save = function(){
        $scope.error = 0;
        $scope.error_msg = '';
        var params = {
            category_id: $rootScope.create_category.category_id,
            attachments: $scope.images,
            content: $scope.formData.content,
            is_anonymous: $scope.is_anonymous
        };
        if(params.attachments == '' || params.content == ''){
            $scope.error = 1;
            $scope.error_msg = 'Xin hãy nhập đủ thông tin';
            return;
        }
        $http.post('/api/post/api_new_post?device_id=pc', params )
            .success(function(data, status, headers, config) {
                if(data.error == 0){
                    $state.go('post', {post_id: data.insert_id}, {
                        location: "replace"
                    });
                    $scope.closeModal();
                }else if(data.error == 2){
                    alert(data.message);
                    $rootScope.loggedIn = false;
                    $rootScope.me = {};
                    $window.location.reload()
                }else{
                    $scope.error = 1;
                    $scope.error_msg = data.message;
                }
            })
    }
    $scope.compose = function(index){
        if (!$rootScope.loggedIn)return;
        $rootScope.create_category = $rootScope.menus[index];

        $scope.closeModal();
        var modalInstance = $uibModal.open({
            size: "m",
            windowTemplateUrl: "/views/home/window.html",

            templateUrl: "/views/post/compose.html",
            windowClass: "modal-border",
            controller: "ComposeCtrl"
        });
    };
}])
.controller('LoginCtrl', ['$scope','$http','$location','headerFooterData','$uibModalInstance','$uibModal','AuthService', '$rootScope', function($scope, $http, $location, headerFooterData, $uibModalInstance, $uibModal, AuthService, $rootScope) {
    $scope.error = "";
    $scope.state = "";
    $scope.login = function () {
        if ($scope.state == "loading")return false;
        $scope.error = "";
        $http.post("/api/user/api_login/pc", {
            email: $scope.email,
            password: $scope.password
        }).success(function (data, status, header, config) {

            if (data.error == 0) {

                $scope.state = "success";
                $rootScope.loggedIn = true;
                $rootScope.$broadcast("login-success", {});
                $uibModalInstance.close("success");
                $rootScope.me = data.data;
                $rootScope.access_token = data.token;
            } else {
                $scope.error = data.error;
                $scope.state = "error"
            }
        }).error(function (data, status, header, config) {
            $scope.error = "System busy now, please try again later!";
            $scope.state = "error"
        })
    };
    $scope.signup = function () {
        if ($scope.state == "loading")return false;
        $scope.error = "";
        $http.post("/api/user/api_register/pc", {
            display_name: $scope.display_name,
            phone: $scope.phone,
            email: $scope.email,
            password: $scope.password
        }).success(function (data, status, header, config) {

            if (data.error == 0) {
                $scope.state = "success";
                $rootScope.loggedIn = true;
                $rootScope.$broadcast("login-success", {});
                $uibModalInstance.close("success");
                $rootScope.me = data.data;
                $rootScope.access_token = data.token;
            } else {
                $scope.error = data.error;
                $scope.state = "error"
            }
        }).error(function (data, status, header, config) {
            $scope.error = "System busy now, please try again later!";
            $scope.state = "error"
        })
    };
    $scope.loginFacebook = function (token) {
        if (!token) {
            window.open("https://www.facebook.com/v2.0/dialog/oauth?response_type=token&display=popup&scope=user_birthday,user_friends,email,public_profile,user_likes,user_posts,publish_actions&client_id=1622653208014005&auth_type=rerequest&redirect_uri=" + $rootScope.baseURL + "api/user/api_redirect_facebook", "_blank ", "width=600,height=400");
            return true
        }

        $scope.token = token;
        $http.get("/api/user/api_social_login/"+token).success(function (data, status, header, config) {
            if (data.error == 0) {
                $scope.state = "success";
                $rootScope.loggedIn = true;
                $rootScope.$broadcast("login-success", {});
                $uibModalInstance.close("success");
                $rootScope.me = data.data;
                $rootScope.access_token = data.token;
            } else {
                $scope.error = data.error;
                $scope.state = "error"
            }
        }).error(function (data, status, header, config) {
            $scope.error = "System busy now, please try again later!";
            $scope.state = "error"
        })
    };
    $scope.closeModal = function () {
        $uibModalInstance.close()
    };
    $scope.switchForm = function (to) {
        $scope.closeModal();
        var modalInstance = $uibModal.open({
            windowTemplateUrl: "/views/post/window_login.html",
            templateUrl: "/view/home/" + to + ".html",
            windowClass: "modal-border",
            controller: "LoginCtrl",
            size: "lg",
        });
        modalInstance.result.then(function (data) {
        })
    };
}])
.controller('HomeCtrl', ['$scope','$http','$location', 'Post', '$timeout', '$rootScope', 'ngProgressFactory', function($scope,$http,$location, Post, $timeout, $rootScope, ngProgressFactory) {
    $scope.posts = [];
    $scope.busy = false;
    $scope.numPerPage = 10;
    $scope.offset = 0;
    $scope.progressbar = ngProgressFactory.createInstance();
    $scope.preLoading = false;

    $rootScope.page = 'fb';
    $scope.nextPage = function() {
        if ($scope.busy) return;
        $scope.busy = true;
        $scope.progressbar.start();
        $http.get('/api/post/api_get_home_posts/'+$scope.offset+'/'+$scope.numPerPage+'?device_id=pc')
            .success(function(data, status, headers, config) {
                if(data.error == 0){
                    var items = data.data;
                    for (var i = 0; i < items.length; i++) {
                        $scope.posts.push(items[i]);
                    }
                    $scope.busy = false;


                    //$timeout(function () {
                    //    $rootScope.$broadcast('masonry.reload');
                    //}, 500);
                    $timeout(function () {
                        $scope.preLoading = true;
                        $('.preLoading').remove();
                        $scope.progressbar.complete();

                    }, 100);
                    $scope.offset += $scope.numPerPage;
                }
            });
    };

}])
.controller('SearchBarCtrl', ['$scope','$http','$location', '$timeout', '$rootScope', '$state', function($scope,$http,$location, $timeout, $rootScope, $state) {
    $scope.keyword = "";
    $scope.search = function () {
        if (!$scope.keyword)return;
        var keyword = $scope.keyword;
        $scope.keyword = "";
        return $state.go("search", {keyword: keyword})
    }

}])
.controller('CategoryCtrl', ['$scope','$http','$location', 'Post', '$timeout', '$rootScope', '$stateParams', 'ngProgressFactory',
    function($scope,$http,$location, Post, $timeout, $rootScope, $stateParams, ngProgressFactory) {
    $scope.progressbar = ngProgressFactory.createInstance();
    $scope.progressbar.complete();
    $scope.progressbar.start();
    $rootScope.page = 'cateogory';
    var slug = $stateParams.slug;
    $scope.posts = [];
    $scope.busy = false;
    $scope.preLoading = false;

    $scope.numPerPage = 10;
    $scope.offset = 0;
    $scope.nextPage = function() {
        if ($scope.busy) return;
        $scope.busy = true;
        $http.get('/api/post/api_get_posts_by_slug/'+slug+'/'+$scope.offset+'/'+$scope.numPerPage+'?device_id=pc')
            .success(function(data, status, headers, config) {
                var items = data.data;
                for (var i = 0; i < items.length; i++) {
                     $scope.posts.push(items[i]);
                }

                    $scope.busy = false;


                //$timeout(function () {
                //    $rootScope.$broadcast('masonry.reload');
                //}, 500);
                $timeout(function () {
                    $scope.preLoading = true;
                    $('.preLoading').remove();
                    $scope.progressbar.complete();

                }, 100);
                $scope.offset += 10;
            });
    };

}])
    .controller('ListFeaturedCtrl', ['$scope','$http','$location','$stateParams', function($scope,$http,$location,$stateParams) {
    $scope.featured = [];
        var slug = '';
        if($stateParams.slug){
            slug = $stateParams.slug;
        }
    $http.get('/api/post/api_get_posts_by_ghim/0/4/'+slug+'?device_id=pc')
	.success(function(data, status, headers, config) {
        $scope.featured = data.data;
	});
}]).controller('ProfilesCtrl', ['$scope','$http','$state','$rootScope', function($scope,$http,$state,$rootScope) {

    if (!$rootScope.loggedIn) {
        $state.go("home");
        $scope.showLoginBox();
        return
    }
    $scope.tabSelected = "#tab-basic";
    $scope.tabChange = function(e){
        if (e.target.nodeName === 'A') {
            $scope.tabSelected = e.target.getAttribute("href");
            e.preventDefault();
        }
    }

    $scope.error = 0;
    $scope.error_msg = '';

    $scope.updateProfiles = function(){
        var params = {
            display_name: $scope.me.display_name,
            username: $scope.me.username,
            email: $scope.me.email,
            phone: $scope.me.phone
        };
        $http.post('/api/user/api_update_profile?device_id=pc', params )
            .success(function(data, status, headers, config) {
                if(data.error == 0){
                    $scope.error = 0;
                    $scope.error_msg = '';
                }else if(data.error == 2){
                    $state.go("home");
                    $scope.showLoginBox();
                }else{
                    $scope.error = 1;
                    $scope.error_msg = data.message;
                }
            })
    }
}]);