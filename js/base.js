function preventDefault() {
    var event = event?event:window.event;
    if(event.preventDefault){
        event.preventDefault();
    }else{
        event.returnValue = false;
    }
}
function initTypes(typeNames) {
    console.log(typeNames);
    $.ajax({
        url:"http://117.48.204.110/xmmrh/dict/initType.json",
        async :false,
        type:"POST",
        data:{typeNames:typeNames},
        // dataType : "json",
        // contentType : "application/json;charset=utf-8",  跨域不能设置json
        success:function (data) {
            if(data.status == "success"){
                $.extend((window._typesMap = window._typesMap || {}),data.data);
            }else{
                console.log(data.message);
            }
        },
        error:function () {
            console.log("字典请求失败");
        }
    });
}