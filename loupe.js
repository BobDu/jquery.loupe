/*  jQuery放大镜插件 
    依赖于jQuery mousewheel插件
    配合loupe.css使用
    需放大图片外层div的jQuery对象绑定loupe()方法
    如 $('#p1').loupe(); 即可实现鼠标移入出现放大框

    注意事项：
    1.外围容器必须有position属性
    2.外围容器不能有边框 不能与图片之间出现间距，补白

    BobDu 2018.05.23
*/
$.fn.loupe = function(){
    // 放大倍率 初始值为2.5
    var scale = 2.5;

    var iId = $(this).attr('id');
    var iT = $(this).find('img').offset().top;
    var iL = $(this).find('img').offset().left;
    var iw = $(this).find('img').width();
    var ih = $(this).find('img').height();
    var iSrc = $(this).find('img').attr('src');

    
    var loupeStr = '<div id="'+iId+'loupe" class="loupe"><img></img></div>';
    var newLoupe = $(loupeStr).appendTo($(this));
    $(newLoupe).find('img').attr({
        src: iSrc,
        width: iw * scale
    }).css('position', 'relative');
    $(newLoupe).css({
        position: 'absolute',
        left: iw + 50 +'px',
        top: 0,
        
        width: '400px',
        height: '400px',
        overflow: 'hidden',
    
        display: 'none',
        border: '1px solid #ccc',
        borderRradius: '3%',
        
        zIndex: '999',
        background: '#fff',
    });

    var moveStr = '<div id="'+iId+'move" class="move">' 
    var newMove = $(moveStr).appendTo($(this));
    $(newMove).css({
        background: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAMAAABFaP0WAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAGUExURT1uzv///62t27cAAAACdFJOU/8A5bcwSgAAABBJREFUeNpiYGBkYGQECDAAAA0ABMZIs2EAAAAASUVORK5CYII=)',
        position: 'absolute',
        display: 'none',
        borderRadius: '3%',

        width: iw / scale,
        height: ih / scale,
    });
    
    // 鼠标在文档中的位置
    var mouseX = 0;
    var mouseY = 0;

    function updPosi(){
        // 更新蒙版位置与放大镜框图片位置
        var mx = mouseX - $(newMove).width()/2 - iL;
        var my = mouseY - $(newMove).height()/2 - iT;
        if(mx < 0) mx = 0;
        else if(mx > iw - $(newMove).width()) mx = iw - $(newMove).width();
        if(my < 0) my = 0;
        else if(my > ih - $(newMove).height()) my = ih - $(newMove).height();
        $(newMove).css({
            left: mx + 'px',
            top: my + 'px'
        })
        $(newLoupe).find('img').css({
            left: -mx*scale + 'px',
            top: -my*scale + 'px'
        });
    }

    $(this).mouseover(function(){
        // 鼠标移入图片框 显示蒙版与放大镜框
        $(newLoupe).css('display', 'block');
        $(newMove).css('display', 'block');
    }).mousemove(function(eve){
        // 鼠标在图片框中移动 修改鼠标在文档中位置全局变量
        // 调用函数更新蒙版位置与放大镜框图片位置
        mouseX = eve.pageX;
        mouseY = eve.pageY;
        updPosi();
    }).mousewheel(function(eve){
        // 鼠标滚轮滚动 修改倍率 修改放大镜框图片大小 修改蒙版大小
        // 调用函数更新蒙版位置与放大镜框图片位置
        if(eve.deltaY == 1) scale += 0.2;
        else scale -= 0.2;

        if(scale <= 1) scale = 1;
        if(scale >= 4) scale = 4;

        $(newLoupe).find('img').attr({
            width: iw * scale
        });
        $(newMove).css({
            width: iw / scale,
            height: ih / scale
        });
        updPosi();
        return false;
        // 阻止滚轮默认事件
    }).mouseout(function(){
        // 鼠标移出图片框 隐藏蒙版与放大镜框
        $(newLoupe).css('display', 'none');
        $(newMove).css('display', 'none');
    });
};

$(function(){
    $('#p1').loupe();
});
