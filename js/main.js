
$(document).ready(function ($) {

    var hList = window.innerHeight-58;
    $('.sidebar-scroll').css('height', hList);
    $(window).on('resize', function(){
        $('.sidebar-scroll').css('height',hList);
    });
    // delegate calls to data-toggle="lightbox"
    $(document).delegate('*[data-toggle="lightbox"]:not([data-gallery="navigateTo"])', 'click', function(event) {
        event.preventDefault();
        return $(this).ekkoLightbox({
            onShown: function() {

            },
            onNavigate: function(direction, itemIndex) {

            }
        });

    });
    var navMain = $("#navbar");
    navMain.on("click", "a", null, function () {
        navMain.collapse('hide');
    });
    var slideHeightSticky = $('.content-right').height();
    //Scroll Menu
    $(window).on('scroll', function(){

        if( $(window).scrollTop()>$('.content-sticky').height()-$(window).height()+74){
            $('.content-sticky').addClass('affix');
        } else {
            $('.content-sticky').removeClass('affix');
        }
        if( $(window).scrollTop() == 0)
            $('.content-sticky').removeClass('affix');
    });
});
function serializeData(data) {
    if (!angular.isObject(data)) {
        return data == null ? "" : data.toString()
    }
    var buffer = [];
    for (var name in data) {
        if (!data.hasOwnProperty(name)) {
            continue
        }
        var value = data[name];
        buffer.push(encodeURIComponent(name) + "=" + encodeURIComponent(value == null ? "" : value))
    }
    var source = buffer.join("&").replace(/%20/g, "+");
    return source
}
function processTxt(text) {
    text = text.replace(/<input.*?[^id]id="(.*?)".*?[^value]value="(.*?)"(|.*?[^>])>(\s)?/gi, "[[@$1:$2]] ");
    text = text.replace(/<div>(<br>|<br\/>)/gi, "\n");
    text = text.replace(/<div>/gi, "\n");
    text = text.replace(/<br([^>]+)?>/g, "\n");
    text = text.replace(/<([^>]+)>/gi, "");
    text = html_entity_decode(text);
    text = text.replace(/&nbsp;/g, " ");
    return text
}
function html_entity_decode(str) {
    try {
        var ta = document.createElement("textarea");
        ta.innerHTML = str;
        return ta.value
    } catch (e) {
    }
    try {
        var d = document.createElement("div");
        d.innerHTML = str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        if (typeof d.innerText != "undefined")return d.innerText
    } catch (e) {
    }
}
function htmlEncode(html) {
    return html.replace(/</g, "&lt;").replace(/>/g, "&gt;")
}
function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
}
