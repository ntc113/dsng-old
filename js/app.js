'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
	'ui.router',
	'ui.bootstrap',
	'myApp.filters',
	'myApp.services',
	'myApp.directives',
	'myApp.controllers',
    'angularMoment',
    'wu.masonry',
    'infinite-scroll',
    'ngCookies',
    'bsLoadingOverlay',
    'ngProgress',
    'flow',
    'ng-jwplayer',
    'angulartics',
    'angulartics.google.analytics',
    'ui.utils',
    'luegg.directives'
	]).
    config(function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {
    $urlRouterProvider.otherwise("error");
    $stateProvider.state("home", {
        url: "/", templateUrl: "/views/home/home.html",
        controller: "HomeCtrl"
    }).state("post", {
        url: "/post/:post_id",
        templateUrl: "/views/post/detail.html",
        resolve: {
            post: function (Post, $stateParams, $state) {
                return Post.getPost($stateParams.post_id).success(function (data) {
                    if (data.error != 0)return $state.go("error");
                    return data
                })
            }
        },
        controller: "PostDetailCtrl"
    }).state("search", {
        url: "/search?keyword",
        templateUrl: "/views/home/search.html"
    }).state("users", {
        url: "/users",
        templateUrl: "views/home/search.html"
    }).state("profiles", {
        url: "/profiles",
        templateUrl: "/views/user/profiles.html",
        controller: "ProfilesCtrl"
    }).state("chat", {
        url: "/chat",
        templateUrl: "/views/chat/chat.html"
    }).state("chat/", {
        url: "/chat/:chatId",
        templateUrl: "/views/chat/chat.html"
    }).state("user", {
        url: "/user/:userId",
        templateUrl: "/views/user/index.html",
        "abstract": true,
        controller: "UserCtrl",
        resolve: {
            user: function ($stateParams, $state, User, $rootScope) {
                return User.getUserInfo($stateParams.userId).success(function (data, status, header, config) {
                    //if (!data.status)return $state.go("error");

                    return data
                })
            }
        }}).state("user.activity", {url: "", templateUrl: "/views/user/index.html"})
        .state("category", {
        url: "/category/:slug",
        templateUrl: "/views/home/home.html",
        "abstract": true,
        controller: "CategoryCtrl",
        resolve: {

        }}).state("category.detail", {url: "", templateUrl: "/views/home/home.html"})
        .state("error", {url: "/error", templateUrl: "/views/error.html"});
        $locationProvider.html5Mode({enabled: true, requireBase: false}).hashPrefix("!")

})
    .run(function(amMoment, $rootScope, $location, $anchorScroll, $state) {
        amMoment.changeLocale('vi');
        $rootScope.$on('$routeChangeSuccess', function(){
            ga('send', 'pageview', $location.path());
        });
        $rootScope.$on("$locationChangeSuccess", function() {
            $anchorScroll();
        });

        //Connect AZ
        azstack.onAuthenticationCompleted = function(code, authenticatedAZStackUserID) {
            if (code == 1) {
                console.log('INFO', new Date().toGMTString() + ' azstack.onAuthenticationCompleted');
                ChatService.authenticationCompleted = true;
                ChatService.user.userId = authenticatedAZStackUserID.userId;
                ChatService.user.id = authenticatedAZStackUserID.azStackUserId;
                $rootScope.$apply();
            } else if (code == -12) {
                console.log('ERROR', new Date().toGMTString() + ' azstack.onAuthenticationCompleted; code = ' + code);
                ChatService.showLogout("Error", "Your account is logged in on other devices. Please log out the account on those devices to log in on this website.");
            } else {
                console.log('ERROR', new Date().toGMTString() + ' azstack.onAuthenticationCompleted; code = ' + code);
                ChatService.showLogout("Error", "Unknown error occurred!");
            }
        };
        //authentication --------------------------------------------------- <---

        //group notification -->
        azstack.onInviteGroupNotification = function(packet) {

            $rootScope.$broadcast('onInviteGroupNotification', packet);
        };
        azstack.onChatGroupChangeAdmin = function(packet) {

            $rootScope.$broadcast('onChatGroupChangeAdmin', packet);
        };
        azstack.onLeaveGroupNotification = function(packet) {

            $rootScope.$broadcast('onLeaveGroupNotification', packet);

        };
        azstack.onRenameGroupNotification = function(packet) {

            $rootScope.$broadcast('onRenameGroupNotification', packet);
        };
        azstack.onMakeGroupNotification = function(packet) {

            $rootScope.$broadcast('onMakeGroupNotification', packet);
        };
        azstack.chat_group_typing_processor = function(service, body) {
            $rootScope.$broadcast('chat_group_typing_processor', service, body);
        };
        //group notification <--

        azstack.onMessagesSent = function(packet) { //bao cao tin nhan da gui
            $rootScope.$broadcast('onMessagesSent', packet);
        };
        azstack.chat_typing_processor = function(service, body) {

            $rootScope.$broadcast('chat_typing_processor', service, body);
        };
        azstack.onListFilesReceived = function(packet) {

            $rootScope.$broadcast('onListFilesReceived', packet);
        };
        azstack.onListUnreadMessagesReceived = function(packet) {
            $rootScope.$broadcast('onListUnreadMessagesReceived', packet);
        };
        azstack.onListModifiedMessagesReceived = function(packet) {
            if($state.current.name != 'chat/'){
                $rootScope.$broadcast('onListModifiedMessagesReceived', packet);
            }else{
                $rootScope.$broadcast('onListModifiedMessagesReceivedDetail', packet);
            }

        };
        azstack.onListModifiedConversationReceived = function(packet) {

            $rootScope.$broadcast('onListModifiedConversationReceived', packet);
        };
        azstack.onGroupMessageReceived = function(msg) { //nhan dc 1 tin nhan chat group
            console.log('INFO', new Date().toGMTString() + ' azstack.onGroupMessageReceived');
            console.log('DEBUG', msg);
            $rootScope.$broadcast('onGroupMessageReceived', msg);
        };
        azstack.onMessageFromMe = function(packet) { //tin nhan tu` chinh minh` (dc gui tu 1 device khac)
            console.log('INFO', new Date().toGMTString() + ' azstack.onMessageFromMe');
            console.log('DEBUG', packet);
            $rootScope.$broadcast('onMessageFromMe', packet);
        };
        azstack.onMessageReceived = function(user, msg) { //nhan dc 1 tin nhan chat 1-1
            $rootScope.$broadcast('onMessageReceived', user, msg);
            if($rootScope.boxChats[user.userId]){
                $rootScope.boxChats[user.userId].messages.push(msg);
                $rootScope.$apply();
            }else{
                console.log(user);
                $rootScope.openBoxChat(user.userId, 1, user.fullname, user.azStackUserID);
                $rootScope.$apply();
            }
        };
        azstack.onMessagesDelivered = function(packet) { //nhan dc bao cao tin nhan da nhan
            $rootScope.$broadcast('onMessagesDelivered', packet);
        };
        azstack.onSeenMessage = function(packet) {
            $rootScope.$broadcast('onSeenMessage', packet);
        };
        azstack.onSeenMessages = function(packet) {
            $rootScope.$broadcast('onSeenMessages', packet);
        };
        azstack.onDeleteConversation = function(packet) {
            $rootScope.$broadcast('onDeleteConversation', packet);
        };
        azstack.onListChatGroup = function(packet) {
            $rootScope.$broadcast('onListChatGroup', packet);
        };
        azstack.onApplicationChangeState = function (packet) {

        };




});
