'use strict';

/* Directives */


angular.module('myApp.directives', [])
.directive('menu', ['headerFooterData', function(headerFooterData) {
	return {
		restrict: 'A',
		templateUrl: 'views/menu.html',
		controller: function($scope,headerFooterData) {
			headerFooterData.getHeaderFooterData().then(function(data) {
				$scope.nav = data;
			});
		}
	};
}]).directive("trackPosition", function ($document, $rootScope, $timeout, $window) {
    return {
        link: function (scope, element, attrs) {
            var timer = null;
            var trackPosition = function () {

                if(scope.post.commented == 0)
                    return;
                var offsetTop = element[0].getBoundingClientRect().top + (window.pageYOffset || element.scrollTop) - (element.clientTop || 0);
                var top = offsetTop - window.pageYOffset;
                var bottom = window.innerHeight - top - (element[0].offsetHeight - 20);
                if (bottom > -500 && bottom < 500) {
                    $rootScope.$broadcast('masonry.reload');
                    if (timer === null && $rootScope.page != 'facebook' && $rootScope.page != 'fb') {
                        timer = setTimeout(function () {
                            scope.getComment(5);
                            scope.requestedCm = true;

                        }, 300)
                    }
                }
                if (bottom > 400 && timer) {
                    clearTimeout(timer);
                    timer = null
                }
            };
            $document.bind("load", function () {
                trackPosition()
            });
            $document.bind("scroll", function () {
                trackPosition()
            })
        }
    }
}).directive("checkHeight", function ($timeout, $rootScope) {
    return {
        restrict: "A", link: function (scope, element, attr) {
            $timeout(function () {
                scope.wHeight = element[0].offsetHeight;
                scope.$apply(attr.checkHeight)
            }, 0)
        }
    }
}).directive('imgPreload', ['$rootScope', function($rootScope) {
    return {
        restrict: 'A',
        scope: {
            ngSrc: '@'
        },
        link: function(scope, element, attrs) {
            element.on('load', function() {
                element.addClass('in');
            }).on('error', function() {
                //
            });

            scope.$watch('ngSrc', function(newVal) {
                element.removeClass('in');
            });
        }
    };
}]);;
