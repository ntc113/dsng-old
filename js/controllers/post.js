(function () {
    angular.module("myApp")
        .controller("PostCtrl", PostCtrl)
        .controller("PostBoxCtrl", PostBoxCtrl)
        .controller("UserWallCtrl", UserWallCtrl)
    .controller("PostDetailCtrl", PostDetailCtrl)
    .controller("ListLikeCtrl", ListLikeCtrl)
    ListLikeCtrl.$inject = ["$scope", "$rootScope", "$uibModalInstance", "User", "Post", "postIdLike"];
    function ListLikeCtrl ($scope, $rootScope, $uibModalInstance, User, Post, postIdLike) {
        $scope.likes = [];
        $scope.numPerPage = 10;
        $scope.offset = 0;
        $scope.busyLike = false;
        $scope.loadLike = true;
        $scope.loadMoreListLiked = function () {
            if ($scope.busyLike)return;
            if (!$scope.loadLike)return;
            $scope.busyLike = true;
            Post.getListLiked(postIdLike, $scope.offset, $scope.numPerPage).success(function (data) {
                if (data.error == 0) {
                    var items = data.data;
                    if (items.length > 0) {
                        for (i = 0; i < items.length; i++) {
                            if ($rootScope.me.userId == items[i].userId)items[i].followed = true;
                            if (typeof items[i].aliasId != "undefined") {
                                items[i].isAlias = true
                            } else {
                                items[i].isUser = true
                            }
                            $scope.likes.push(items[i])
                        }
                        $scope.offset += $scope.numPerPage;
                    } else {
                        $scope.loadLike = false
                    }
                    $scope.busyLike = false
                }
            })
        };
        $scope.loadMoreListLiked();
        $scope.closeModal = function () {
            $modalInstance.close()
        };
        $scope.$on("$stateChangeSuccess", function (oldState, newState) {
            if (oldState != newState)$scope.closeModal()
        })
    }

    PostDetailCtrl.$inject = ["$scope", "$state", "$rootScope", "$stateParams", "$q", "$timeout", "User", "post"];
    function PostDetailCtrl($scope, $state, $rootScope, $stateParams, $q, $timeout, User, post) {
        init();

        $scope.postId = $stateParams.postId;
        $scope.error = {status: false, msg: ""};
        if(post.data.is_facebook){
            $rootScope.page = "facebook";
        }else{
            $rootScope.page = "postdetail";
        }
        function init() {
            if (!post)return false;
            if (post.error != 0) {
                $scope.show = true;
                $scope.detailPost = post.data;
            } else {
                $state.go("error")
            }
            $scope.loading = false
        }


    }
    PostCtrl.$inject = ["$scope", "$state", "$rootScope", "$location", "$stateParams", "$uibModal", "$q", "$timeout", "$window", "$http", "Post", "$sce"];
    function PostCtrl($scope, $state, $rootScope, $location, $stateParams, $uibModal, $q, $timeout, $window, $http, Post, $sce) {
        $rootScope.currentPage = "post";
        $scope.init = function (post, id) {
            $scope.loading = false;
            $scope.post = post;
            if($rootScope.page != "facebook" && $rootScope.page != "fb"){
                $scope.post.comments = {data: [], offset: 0, moreComment: false, showReply: false};
            }
            if ($scope.post.content.length > $rootScope.txtLength) {
                $scope.post.showMore = true;
                if (typeof $scope.post.moreTxt == "undefined")$scope.post.moreTxt = $scope.post.content;
                $scope.post.content = $scope.post.content.substr(0, $rootScope.txtLength) + "..."
            }
            if ($state.current.name == "post" || $rootScope.page == "postbox")$scope.getComment(5);
            if($rootScope.page == "postdetail"){
                $scope.otherPosts = [];
                $scope.getPostByUser( $scope.post.category_id);
            }

        };
        $scope.showMore = function () {
            $scope.post.showMore = false;
            $scope.post.content = $scope.post.moreTxt;
            $timeout(function () {
                $rootScope.$broadcast('masonry.reload');
            }, 500);
        };
        $scope.getPostByUser  = function (cateId) {
            $http.get('/api/post/api_get_posts_by_ghim/0/6/0/'+cateId+'?device_id=pc')
                .success(function(data, status, headers, config) {
                    var otherPosts = data.data;
                    for (var i = 0; i < otherPosts.length; i++) {
                        $scope.otherPosts.unshift(otherPosts[i]);
                    }
                });
        }
        $scope.replyComment = function(id){
             $scope.post.comments.data[id].showReply = true;
            $timeout(function () {
                $rootScope.$broadcast('masonry.reload');
            }, 300);
        }

        $scope.getComment = function (limit) {
            if ($rootScope.loadingComment || $scope.post.isLoadedComment)return;
            if (typeof limit == "undefined") {
                limit = 10
            }
            $rootScope.loadingComment = true;
            $scope.post.isLoadedComment = true;
            var offset = $scope.post.comments.offset;

            var postId = $scope.post.post_id;
            Post.getComment(postId, limit, offset).success(function (data, status, header, config) {
                if (data.error == 0) {
                    var comments = data.data;
                    for (var i = 0; i < comments.length; i++) {
                        comments[i].replies = [];
                        $scope.post.comments.data.push(comments[i]);
                    }
                    $scope.post.isLoadedComment = false;
                    $scope.post.comments.offset += limit;
                    if ($scope.post.comments.data.length < $scope.post.commented) {
                        $scope.post.comments.moreComment = true
                    } else {
                        $scope.post.comments.moreComment = false
                        $scope.post.isLoadedComment = true;
                    }

                    $timeout(function () {
                        $rootScope.$broadcast('masonry.reload');
                    }, 300);
                }else{
                    $scope.post.comments.moreComment = false
                }
                $rootScope.loadingComment = false
            }).error(function (data, status, header, config) {
            })
        };
        $scope.getReplyComment = function (comment_id) {
            Post.getReplyComment(comment_id, 10).success(function (data, status, header, config) {
                if (data.error == 0) {
                    var repComments = data.data;
                    for (var i = 0; i < $scope.post.comments.data.length; i++) {
                        if($scope.post.comments.data[i].comment_id == comment_id){
                            for (var j = 0; j < repComments.length; j++) {
                                $scope.post.comments.data[i].replies.unshift(repComments[j]);
                            }
                        }
                    }
                    $timeout(function () {
                        $rootScope.$broadcast('masonry.reload');
                    }, 300);
                }
            })
        };
        $scope.selectPost = function (id) {
            var post = angular.copy($scope.post);
            post.activeId = id;
            var modalInstance = $uibModal.open({
                templateUrl: "partials/postbox.html",
                controller: "PostBoxCtrl",
                windowClass: "dialog-photo",
                resolve: {
                    postBox: function () {
                        return post
                    }
                }
            });
            modalInstance.result.then(function (data) {
            })
        };
        $scope.leaveReplyComment = function(id){
            if ($scope.post.isReplyComment)return;
            if (!$rootScope.loggedIn) {
                $scope.showLoginBox();
                return
            }
            var commentId = $scope.post.comments.data[id].comment_id;
            var text = $scope.post.inputCommentReply[id];
            if (!text)return false;
            text = processTxt(text);
            text = text.trim();
            if (!text)return false;
            if (text) {
                $scope.post.isReplyComment = true;
                var postId = $scope.post.post_id;
                var params = {content: text, post_id: postId, parent_id: commentId};

                Post.leaveComment(params).success(function (data, status, header, config) {
                    $scope.post.isReplyComment = false;
                    if (data.error == 0) {
                        var comment = data.data;
                        $scope.post.inputCommentReply[id] = "";
                        $scope.post.comments.data[id].replies.unshift(comment);
                        $timeout(function () {
                            $rootScope.$broadcast('masonry.reload');
                        }, 500);
                        $scope.post.isLoadedComment = true;
                    } else {
                        $scope.post.comments.error = "Comment cannot send at this moment. Please try again later";
                        return
                    }
                })
            }
        }
        $scope.leaveComment = function (e) {
            e.preventDefault();
            if ($scope.post.isComment)return;
            $scope.post.comments.error = "";
            if (!$rootScope.loggedIn) {
                $scope.showLoginBox();
                return
            }
            var text = $scope.post.inputComment;
            if (!text)return false;
            text = processTxt(text);
            text = text.trim();
            if (!text)return false;
            if (text) {
                $scope.post.isComment = true;
                var postId = $scope.post.post_id;
                var params = {content: text, post_id: postId};
                if ($state.current.name != "newsfeed" && typeof $scope.option != "undefined" && typeof $scope.option.useAlias != "undefined")params.useAlias = $scope.option.useAlias;
                Post.leaveComment(params).success(function (data, status, header, config) {
                    $scope.post.isComment = false;
                    if (data.error == 0) {
                        var comment = data.data;

                        $scope.post.comments.data.push(comment);
                        $scope.post.inputComment = "";
                        $scope.post.commented++;
                        $timeout(function () {
                            $rootScope.$broadcast('masonry.reload');
                        }, 500);
                    } else {
                        $scope.post.comments.error = "Comment cannot send at this moment. Please try again later";
                        return
                    }
                })
            }
        };
        $scope.likePost = function () {
            if (!$rootScope.loggedIn) {
                $scope.showLoginBox();
                return
            }
            $scope.post.liked++;
            $scope.post.is_liked = true
            var postId = $scope.post.post_id;
            $scope.post.isLoading = true;
            Post.likePost(postId).success(function (data, status, header, config) {
                $scope.post.isLoading = false;
                if (data.error != 0) {
                    $scope.post.liked--;
                    $scope.post.is_liked = false
                }
                if (data.error == 2) {
                    alert('Bạn chưa đăng nhập');
                    $rootScope.loggedIn = false;
                    $rootScope.me = {};
                    $window.location.reload()
                }
            }).error(function (data, status, header, config) {
                $scope.post.isLoading = false
            })
        };
        $scope.unlikePost = function () {
            if (!$rootScope.loggedIn) {
                $scope.showLoginBox();
                return
            }
            var postId = $scope.post.post_id;
            $scope.post.isLoading = true;
            $scope.post.liked--;
            $scope.post.is_liked = false
            Post.unlikePost(postId).success(function (data) {
                $scope.post.isLoading = false;
                if (data.error != 0) {
                    $scope.post.liked++;
                    $scope.post.is_liked = true
                }
            }).error(function (data, status, header, config) {
                $scope.post.isLoading = false
            })
        };

        $scope.deletePost = function () {
            if (!$rootScope.loggedIn) {
                $scope.showLoginBox();
                return
            }
            $timeout(function () {
                var confirm = $window.confirm("Are you sure delete this post?");
                if (!confirm)return false;
                var postId = $scope.post.postId;
                $scope.post.isLoading = true;
                Post.deletePost(postId).success(function (data) {
                    $scope.post.isLoading = false;
                    if (data.status && $state.current.name == "post") {
                        $location.path("newsfeed/all")
                    }
                }).error(function (data, status, header, config) {
                    $scope.post.isLoading = false
                })
            }, 100)
        };
        $scope.seeMore = function (id) {
            $scope.post.comments.data[id].seeMore = false;
            $scope.post.comments.data[id].text = $scope.post.comments.data[id].moreTxt
        };
        $scope.likeComment = function (id) {
            if (!$rootScope.loggedIn) {
                $scope.showLoginBox();
                return
            }

            var commentId = $scope.post.comments.data[id].comment_id;
            $scope.post.comments.data[id].is_liked = true;
            $scope.post.comments.data[id].liked++
            Post.likeComment(commentId).success(function (data) {
                if (data.error != 0) {
                    $scope.post.comments.data[id].is_liked = false;
                    $scope.post.comments.data[id].liked--
                }
                if (data.error == 2) {
                    $rootScope.loggedIn = false;
                    $rootScope.me = {};
                    $window.location.reload()
                }
            })
        };
        $scope.unLikeComment = function (id) {
            if (!$rootScope.loggedIn) {
                $scope.showLoginBox();
                return
            }
            var commentId = $scope.post.comments.data[id].comment_id;
            $scope.post.comments.data[id].is_liked = false;
            $scope.post.comments.data[id].liked--
            Post.unLikeComment(commentId).success(function (data) {
                if (data.error != 0) {
                    $scope.post.comments.data[id].is_liked = true;
                    $scope.post.comments.data[id].liked++
                }
                if (data.error == 2) {
                    $rootScope.loggedIn = false;
                    $rootScope.me = {};
                    $window.location.reload()
                }
            })
        };
        $scope.deleteComment = function (id) {
            if (!$rootScope.loggedIn) {
                $scope.showLoginBox();
                return
            }
            $timeout(function () {
                var confirm = window.confirm("Are you sure to delete this comment?");
                if (!confirm)return;
                var commentId = $scope.post.comments.data[id].commentId;
                $scope.post.comments.data[id].hide = true;
                Post.deleteComment(commentId).success(function (data, status, header, config) {
                    if (data.status) {
                        $scope.post.comments.data.splice(id, 1);
                        $scope.post.totalComment--
                    } else {
                        $scope.post.comments.data[id].hide = false
                    }
                }).error(function (data, status, header, config) {
                    $scope.post.comments.data[id].hide = false
                })
            })
        };
        $scope.listLiked = function () {
            if (!$rootScope.loggedIn) {
                $scope.showLoginBox();
                return
            }
            var modalInstance = $uibModal.open({
                templateUrl: "views/post/listlike.html",
                controller: "ListLikeCtrl",
                windowClass: "modal-border",
                resolve: {
                    postIdLike: function () {
                        return $scope.post.post_id
                    }
                }
            });
            modalInstance.result.then(function (data) {
            })
        };
        $scope.listShared = function () {
            if (!$rootScope.loggedIn) {
                $scope.showLoginBox();
                return
            }
            var modalInstance = $modal.open({
                templateUrl: "/views/listshare.html?v=" + $rootScope.getAppVersion(),
                controller: "ListShareCtrl",
                resolve: {
                    postIdShare: function () {
                        return $scope.post.postId
                    }
                }
            });
            modalInstance.result.then(function (data) {
            })
        };
        $scope.share = function () {
            if (!$rootScope.loggedIn) {
                $scope.showLoginBox();
                return
            }
            var modalInstance = $modal.open({
                templateUrl: "/views/sharebox.html?v=" + $rootScope.getAppVersion(),
                controller: "SharedPostCtrl",
                resolve: {
                    sharedPost: function () {
                        return $scope.post
                    }
                }
            });
            modalInstance.result.then(function (data) {
                if (data != "cancel") {
                    $scope.post.totalShare++
                }
            })
        }
    }
    PostBoxCtrl.$inject = ["$scope", "$rootScope", "$uibModalInstance", "$uibModal", "$q", "$timeout", "Post", "postBox"];
    function PostBoxCtrl($scope, $rootScope, $uibModalInstance, $uibModal, $q, $timeout, Post, postBox) {
        $rootScope.page = "postbox";
        $scope.postBox = postBox;
        //var id = postBox.activeId;
        $scope.closeModal = function () {
            $uibModalInstance.close($scope.postBox)
        };
        $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
            $uibModalInstance.close($scope.postBox)
        })
    }
    UserWallCtrl.$inject = ["$scope", "$rootScope", "$http", "$location", "$q", "$sce", "$uibModal", "$timeout", "$state", "$window", "User", "Post"];
    function UserWallCtrl($scope, $rootScope, $http, $location, $q, $sce, $uibModal, $timeout, $state, $window, User, Post) {

        $scope.friends = [];

        $scope.posts = [];
        $scope.busy = false;
        $scope.cursor = "";
        $scope.loadmore = true;
        $scope.hasLoaded = false;
        $scope.numPerPage = 10;
        $scope.offset = 0;
        $scope.showMore = true;
        $scope.nextPage = function () {
            if ($scope.busy)return;
            if (!$scope.loadmore)return;
            $scope.busy = true;

            Post.nextPage($scope.url+'/'+$scope.offset+'/'+$scope.numPerPage+'?device_id=pc', $scope.params).success(function (data) {
                if (data.error == 0) {
                    $scope.hasLoaded = true;
                    var items = [];
                    items = data.data
                    if (items.length > 0) {
                        var k = $scope.posts.length;
                        for (var i = 0; i < items.length; i++) {
                            $scope.posts.push(items[i])
                        }

                    } else {
                        $scope.loadmore = false;
                        $scope.showMore = false;
                    }
                    if($scope.offset >= 10)
                        $scope.busy = false;
                }
                $timeout(function () {
                    $rootScope.$broadcast('masonry.reload');
                }, 500);
                $scope.offset += 10;
            })
        };
        $scope.loadNextPage = function() {
            $scope.busy = false;
            $scope.showMore = false;
        };

    }

})();