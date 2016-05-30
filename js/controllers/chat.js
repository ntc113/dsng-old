(function () {
    angular.module("myApp")
        .controller("BoxChatCtrl", BoxChatCtrl)
        .controller("ChatCtrl", ChatCtrl)
    BoxChatCtrl.$inject = ["$scope", "$rootScope", "User"];
    ChatCtrl.$inject = ["$scope", "$rootScope", "$stateParams", "$state", "User"];
    function BoxChatCtrl ($scope, $rootScope, User) {
        $scope.currentMsgId = Math.floor(Date.now() / 1000);
        $scope.closeBoxChat = function (chatId) {
            for (var id in $rootScope.boxChats) {
                if (id == chatId) {
                    delete $rootScope.boxChats[id];
                    break
                }
            }
        };
        $scope.init = function (chatId, senderId) {
            $scope.chatId = chatId;
            $rootScope.boxChats[$scope.chatId].avatar = 'http://www.beatvn.com/images/beatvn.png';
            User.getUserInfo(senderId).success(function (data, status, header, config) {
                if(data.error == 0){
                    $rootScope.boxChats[$scope.chatId].avatar = data.data.avatar;
                }
            })
        };

        $scope.send = function(senderId){
            var msg = {msg: $scope.msg, sender: {azStackUserID: $rootScope.me.id}};
            if($scope.msg != ''){
                azstack.azSendMessage($scope.msg, senderId, $scope.currentMsgId++)
                $scope.msg = '';
                $rootScope.boxChats[$scope.chatId].messages.push(msg);
            }

        }
    }
    function ChatCtrl ($scope, $rootScope, $stateParams, $state, User) {
        $scope.init = function () {
            $rootScope.messages = {};
            $scope.$on("onListModifiedConversationReceived", function (event, packet) {
                if (!$stateParams.chatId) {
                    if (packet.list.length) {
                        $state.go("chat/", {chatId: packet.list[0].chatId}, {location: "replace"})
                    }
                    return true
                }
            });
            $rootScope.boxchat = {fullname: 'BeatVN', avatar: 'http://www.beatvn.com/images/beatvn.png'};
            if( $rootScope.authenticationAzCompleted){

                var id = "" + $stateParams.chatId;
                var userData = azstack.azStackUsers.get(id);
                userData = angular.copy(azstack.azStackUsers.get(id));
                userData = azstack.getUserInfoByUsernameAndRequestToServerWithCallBack(id, function(users) {
                    $rootScope.setTimeout(function() {
                        if (!userData) {
                            userData = angular.copy(azstack.azStackUsers.get(id));
                            azstack.azGetListModifiedMessages(0, 1, userData.userId);
                            $rootScope.boxchat.fullname = userData.fullname;
                        }
                        $rootScope.$apply();
                    }, 0);
                });
                if (userData) {
                    userData = angular.copy(azstack.azStackUsers.get(id));
                    azstack.azGetListModifiedMessages(0, 1, userData.userId);
                    $rootScope.boxchat.fullname = userData.fullname;
                }
            }

        };
        $scope.$on("onListModifiedMessagesReceivedDetail", function (event, packet) {
            if (packet.done == 1) {
                packet.list = packet.list.reverse();
                $rootScope.messages = packet.list;
                User.getUserAvatar($stateParams.chatId).success(function (data, status, header, config) {
                    if(data.error == 0){
                        $rootScope.boxchat.avatar = data.data.avatar;
                    }
                })
                $rootScope.$apply();
            }
        });
        $scope.$on("authenticationAzCompleted", function (event, args) {

            $scope.init();
        });
        $scope.send = function(senderId){
            if($scope.msg != ''){
                azstack.azSendMessage($scope.msg, senderId, $scope.currentMsgId++)
                $scope.msg = '';
            }

        }
    }
})();