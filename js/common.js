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
            a.attr("src",b.val()+c.val());
        },
        removeMsg : function (a,b) {
            if(b == undefined ){
                a.hide();
            }else if(b.val() != null && b.val() != ""){
                a.hide();
            }else{
                a.show();
                return false;
            }
            return true;
        }
    }

    // if(client().width < 992){
    //     var height = Math.ceil(parseInt(getStyle(user.iDiv,"width"))*4.5/5);
    //     console.log(getStyle(user.iDiv,"width")+height);
    //     user.iDiv.style.height = height+"px";
    //     user.iDivInitHeight = height;
    // }
    with(window.location) {
        var vipaddr = search.substring(search.indexOf("=") + 1);
        if (vipaddr != null && vipaddr != '') {
            user.removeMsg(user.msg);
            user.iVip.removeAttr("placeholder").attr("value", vipaddr);
            user.iPlayer.attr("src", user.iInterface.eq(0).val() + vipaddr);
        }
    }
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
            iDiv.style.height = height + "px";
            iDiv.style.backgroundColor = "transparent";
            iPlayer.attr({"width":width+"px","height":height+"px"});
            window.scrollTo(0,0);
            smaller.hide();
            enlarge.show();
        });
        iFrameRec.on("click",function () {
            iDiv.style.height = iDivInitHeight+"px";
            iPlayer.attr({"width":"100%","height":iDivInitHeight+"px"});
            enlarge.hide();
            smaller.show();
        });
    }
});



