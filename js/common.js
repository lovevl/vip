function getStyle(obj,attr){
    if(obj.currentStyle){
        return obj.currentStyle[attr];
    }else{
        return window.getComputedStyle(obj,null)[attr];
    }
}
function client() {
    if(window.innerWidth != null)  // ie9 +  最新浏览器
    {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        }
    }
    else if(document.compatMode === "CSS1Compat")  // 标准浏览器
    {
        return {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        }
    }
    return {   // 怪异浏览器
        width: document.body.clientWidth,
        height: document.body.clientHeight
    }
}
$(function () {
    user = {
        iDiv : document.getElementById("iframe_div"),
        $recentBox : $("#recent_box"),
        $head : $("head"),
        iDivInitHeight : 550,
        iFramescale : $("#scale_iframe"),
        iFrameRec : $("#recovery_iframe"),
        iPlayer : $("#iframe-player"),
        iInterface : $("#interface_id"),
        iVip : $("#vip_movie_id"),
        iButton : $("#happy_id"),
        smaller : $(".smaller"),
        enlarge : $(".enlarge"),
        msg : $('.message'),
        iHappyfn : function (a,b,c) {
            var watchUrl = c.data("url");
            if(c.val() != null && c.val() != ""){
                a.attr({"src":b.val()+c.val(),"data-url":b.val()});
            }else{
                a.attr({"src":b.val()+watchUrl,"data-url":b.val()});
            }
        },
        removeMsg : function (a,b) {
            if(b == undefined ){
                a.hide();
            }else if(b.val() != null && b.val() != "" ){
                a.hide();
            }else if($(b).data("url") != null && $(b).data("url") != ""){
                a.hide();
            }else{
                a.show();
                return false;
            }
            return true;
        },
        setCookie : function (a,b,c) {

            //储存格式: localStorage.recentR = {l:[{},{},{},{},{}]};5个对象
            //每个对象储存格式：{name:"name",url:"url",counts:"counts"}
            if(window.localStorage && a && b){
                var v = {l:[]};
                if(localStorage.recentR){
                    v = JSON.parse(localStorage.recentR);
                    if(v.l.length>=5){
                        v.l.pop();
                    }
                }
                for(var i in v.l){
                    if(v.l[i].name == a){
                        v.l.splice(i,1);
                    }
                }
                if(c){
                    v.l.unshift({name:a,url:b,counts:c});
                }else{
                    v.l.unshift({name:a,url:b});
                }
                localStorage.recentR = JSON.stringify(v);
                user.showRecent();
            }else if(window.localStorage && localStorage.recentR){
                user.showRecent();
            }
        },
        showRecent : function () {
            var r = JSON.parse(localStorage.recentR);
            user.$recentBox.show();
            var $p = user.$recentBox.find('p');
            $p.find("span:gt(0)").remove();
            for(var i in r.l){
                var $span,$a;
                if(r.l[i].counts){
                    $span = $('<span></span>');
                    $a = $('<a href="#" onclick="startRecentPlay(this);" data-recent="'+r.l[i].url+'">'+r.l[i].name+'第'+r.l[i].counts+'集</a>');
                }else{
                    $span = $('<span></span>');
                    $a = $('<a href="#" onclick="startRecentPlay(this);" data-recent="'+r.l[i].url+'">'+r.l[i].name+'</a>');
                }
                $span.append($a);
                $p.append($span);
            }
        }
    };
    var width = parseInt(getStyle(document.getElementById('v_list'),"width"))-10;
    $("#content_id").text('.active .content{width: '+width+'px;}');
    user.setCookie();
    with(window.location) {
        var vipaddr = search.substring(search.indexOf("=") + 1);
        if (vipaddr != null && vipaddr != '') {
            user.removeMsg(user.msg);
            user.iVip.removeAttr("placeholder").attr("value", vipaddr);
            user.iPlayer.attr("src", user.iInterface.eq(0).val() + vipaddr);
        }
    };
    with(user){
        iButton.on("click",function () {
            if(removeMsg(msg,iVip)){
                iHappyfn(iPlayer,iInterface,iVip);
            }
        });
        iFramescale.on("click",function () {
            var height = iDivInitHeight*0.7;
            var width = Math.ceil(parseInt(getStyle(iDiv,"width"))*0.7);
            console.log(height+'==='+iDivInitHeight);
            iDiv.style.width = width + "px";
            iDiv.style.height = height + "px";
            iPlayer.attr({"width":width+"px","height":height+"px"});
            window.scrollTo(0,0);
            smaller.hide();
            enlarge.show();
        });
        iFrameRec.on("click",function () {
            iDiv.style.height = iDivInitHeight+"px";
            iDiv.style.width = "100%";
            iPlayer.attr({"width":"100%","height":iDivInitHeight+"px"});
            enlarge.hide();
            smaller.show();
        });
    };

    $.ajax({
        url:"http://117.48.204.110/xmmrh/v/getRTV.json",
        data:{name:null},
        type:"POST",
        // contentType : "application/json;charset=utf-8",
        success:function (data) {
            if(data.status == "success"){
                listContent(data.data);
            }
        },
        error:function () {
            console.log("获取列表错误");
        }
    });

    $.ajax({
        url:"http://117.48.204.110/xmmrh/v/getRM.json",
        data:{name:null},
        type:"POST",
        // contentType : "application/json;charset=utf-8",
        success:function (data) {
            if(data.status == "success"){
                listMovie(data.data);
            }
        },
        error:function () {
            console.log("获取列表错误");
        }
    });


});

userParam = {
    $vList : $("#v_list"),
    $mList : $("#mo_v_list"),
    $commonList : $(".common-list"),
    color : ['#f56293','#aa72d2','#0dc3ce','#97b921','#f56293','#b58571','#52a0ea'],
    $style : $('#style_id'),
    $enHeiStyle : $("#enheight_id"),
    $slideId : $("#slide_id"),
    btnAfterTop :10,
    contentInitTop : 30,
    enheightInit : 12,
    randomBorder : function (obj) {
        var len = userParam.color.length;
        var index = Math.ceil(Math.random()*len)-1;
        obj.style.border = "1px solid "+userParam.color[index];
        userParam.$style.text('.v-list>.active button:after{border-bottom-color:'+userParam.color[index]+'}');
    }
};

listEposide = function (obj) {
    var $obj = $(obj);
    var $parent = $obj.parent();
    var en = $obj.nextAll(".enheight")[0];
    if($parent.hasClass('active')){
        $parent.removeClass('active');
        userParam.$enHeiStyle.text('');
    } else {
        var $content = $obj.next(".content");
        userParam.randomBorder($content[0]);
        $content.css("top", $obj.data('top') + userParam.contentInitTop + "px");
        // if($obj.data('top') > 5){
        //     userParam.$slideId.text('');
        // }else{
        //     userParam.$slideId.text('.enheight{height: 0;transition: all 0.8s;}');
        // }
        $parent.siblings("li").removeClass("active");
        $parent.addClass('active');
        var height = parseInt(getStyle($content[0], "height"));
        userParam.$enHeiStyle.text(' .active .enheight{height:'+(height+userParam.enheightInit)+'px;}');
    }
};
startPlayer = function (url,obj,m) {
    var $obj = $(obj);
    if(m){
        userParam.$vList.find('li').removeClass('active');
        userParam.$enHeiStyle.text('');
    }else{
        userParam.$mList.find('li').removeClass('active');
        $obj.parent().siblings().removeClass('active');
    }
    $obj.parent().addClass("active");
    user.removeMsg(user.msg);
    var iUrl = user.iPlayer.data('url');
    if(iUrl != undefined && iUrl != "") {
        user.iPlayer.attr("src", user.iPlayer.data('url') + url);
    }else{
        user.iPlayer.attr("src", user.iInterface.val() + url);
    }
    if(m){
        user.iVip.attr({"placeholder":"你正在观看>>>"+$obj.data('name'),
            "data-url":url
        });
        user.setCookie($obj.data('name'),url);
    }else{
        user.iVip.attr({"placeholder":"正在观看:"+$obj.data('name')+"第"+$obj.data('episode')+"集",
            "data-url":url
        });
        user.setCookie($obj.data('name'),url,$obj.data('episode'));
    }
};
listContent = function (array) {
    for(var i = 0; i < array.length; i++){
        var $li = $('<li></li>');
        var $btn = $('<button class="btn btn-success btn-xs" onclick="listEposide(this)">'+array[i].name+'</button>');
        $li.append($btn);
        var $content;
        if(array[i].tvCounts.length > 0){
            var $en = $('<div class="enheight"></div>');
            $content = $('<div class="content" ></div>');
            var $c_ul = $('<ul class="tv-count"></ul>');
            var l = array[i].tvCounts.length;
            for(var j = 0; j < l; j++){
                var $c_li = $('<li><a data-name='+array[i].name+
                    ' data-episode='+array[i].tvCounts[j].episode+
                    ' onclick="startPlayer(\''+array[i].tvCounts[j].url+'\',this)">'+array[i].tvCounts[j].episode+'</a></li>');
                $c_ul.append($c_li);
            }
            var text = '';
            if(l == array[i].count){
                text = "完结／总"+l+"集";
            }else{
                text = "更新至"+l+"集／总"+array[i].count+"集";
            }
            var $span = $('<span class="episode-count">'+text+'</span>');
            $content.append($span).append($c_ul);
            $li.append($content).append($en);
        }
        userParam.$vList.append($li);
        var offsetTop = $btn[0].offsetTop;
        $btn.attr("data-top",offsetTop);
    }
};

listMovie = function (array) {
    if(array){
        for(var i = 0; i < array.length; i++) {
            var $li = $('<li></li>');
            var $btn = $('<button data-name="'+array[i].name +'" class="btn btn-success btn-xs" '+
                'onclick="startPlayer(\''+array[i].url+'\',this,\'m\')">' + array[i].name + '</button>');
            $li.append($btn);
            userParam.$mList.append($li);
        }
        var offsetTop = $btn[0].offsetTop;
        $btn.attr("data-top",offsetTop);
    }
}


