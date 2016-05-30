'use strict';

/* Filters */

angular.module('myApp.filters', [])
  .filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}]).filter('shortNumber', function() {
    return function( number ) {
        if ( number ) {
            var abs = Math.abs( number );
            if ( abs >= Math.pow( 10, 12 ) ) {
                number = ( number / Math.pow( 10, 12 ) ).toFixed( 1 ) + "T";
            } else if ( abs < Math.pow( 10, 12 ) && abs >= Math.pow( 10, 9 ) ) {
                number = ( number / Math.pow( 10, 9 ) ).toFixed( 1 ) + "B";
            } else if ( abs < Math.pow( 10, 9 ) && abs >= Math.pow( 10, 6 ) ) {
                number = ( number / Math.pow( 10, 6 ) ).toFixed( 1 ) + "M";
            } else if ( abs < Math.pow( 10, 6 ) && abs >= Math.pow( 10, 3 ) ) {
                number = ( number / Math.pow( 10, 3 ) ).toFixed( 1 ) + "K";
            }
            return number;
        }
    };
}).filter('multiImage', function($timeout, $rootScope) {
    return function( index) {
        var img =  '/images/thumb-1x1.png';
        if(index <= 1) {
            img =  '/images/thumb-3x2.png';
        }
        $timeout(function () {
            $rootScope.$broadcast('masonry.reload');
        }, 300);
        return img;
    };
}).filter('multiImage2', function($timeout, $rootScope) {
    return function( index) {
        var img =  'images/thumb-1x1.png';
        if(index < 1) {
            img =  'images/thumb-3x2.png';
        }
        $timeout(function () {
            $rootScope.$broadcast('masonry.reload');
        }, 300);
        return img;
    };
}).filter('classImage', function() {
    return function( length) {

        if(length >= 5) {
            length =  5;
        }

        return length;
    };
}).filter("filterTxt", function ($sce) {
    return function (content) {
        if (!content) return content;
        //content = htmlEncode(content);
        var exp = /(\b(((https?|ftp|file|):\/\/)|www[.])[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        content = content.replace(exp,"<a style='word-wrap:break-word' target='_blank' href='$1'>$1</a>");
        content = content.replace(/(\n|&#10;|&#13;)/g, "<br/>");
        content = content.replace(/\s*(<br ?\/>\s*)+/g, "<br />").replace(/^<br \/>|<br \/>$/g, "");

        return $sce.trustAsHtml(content)
    }
});
