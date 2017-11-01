$(function () {
    url = {
        dictUrl : {
            delete : "http://127.0.0.1:8089/xmmrh/dict/deleteit.json",
            save : "http://127.0.0.1:8089/xmmrh/dict/saveit.json",
            selOnchange : "http://127.0.0.1:8089/xmmrh/dict/getT.json",
            types: "http://127.0.0.1:8089/xmmrh/dict/types.json"
        }
    };
    $.ajax({
        url:url.dictUrl.types,
        data:null,
        type:"POST",
        // contentType : "application/json;charset=utf-8",
        success:function (data) {
            if(data.status == "success"){
                dict.listTypes(data.list);
            }
        },
        error:function () {
            alert("错误");
        }
    });
});

submitit = function (obj) {
    var urlVal = $(obj).find("input:eq(0)").val();
    $.ajax({
        url:obj.action,
        data:$(obj).serialize(),
        type:"POST",
        // contentType : "application/json;charset=utf-8",
        success:function (data) {
            if(data.status == "success"){
                alert("更新成功");
            }else{
                if(data.message) {
                    if (window.confirm(data.message)) {
                        forceUpdate(obj);
                    }
                }else{
                    alert(data.error);
                }
            }
        },
        error:function () {
            alert("错误");
        }
    });
    preventDefault();
    //return false;
};

forceUpdate = function (obj) {
    var urlVal = $(obj).find("input:eq(0)").val();
    $.ajax({
        url:obj.action,
        data:$(obj).serialize().replace("forceUp=false","forceUp=true"),
        type:"POST",
        // contentType : "application/json;charset=utf-8",
        success:function (data) {
            if(data.status == "success"){
                alert("更新成功");
            }else{
                alert("更新失败");
            }
        },
        error:function () {
            alert("错误");
        }
    });
};
// 一个url添加电视剧end


dict = {
    $table : $("#type_table"),
    listTypes :function (l) {
        var $list = $("#list_types");
        if(l){
            var $op = ('<option value="-1" selected="">选择一个类型</option>');
            $list.append($op);
            for(var i = 0; i < l.length; i++){
                $op = $('<option value="'+l[i]+'">'+l[i]+'</option>');
                $list.append($op);
            }
        }
    },
    tables :function (l) {
        if(l){
            dict.$table.children("tbody").empty();
            for(var i = 0; i < l.length; i++){
                var $th = $('<th>'+(i+1)+'</th>');
                var $td1 = $('<td>'+l[i].value+'</td>');
                var $td2 = $('<td>'+l[i].name+'</td>');
                var $td3 = $('<td>'+l[i].type+'</td>');
                var $td4 = $('<td><button class="btn btn-xs btn-danger" data-id="'+l[i].id+'" onclick="deleteit(this);">是</button></td>');
                var $tr = $('<tr></tr>').append($th).append($td1).append($td2).append($td3).append($td4);
                dict.$table.append($tr);

            }
        }
    }
}

submitDict = function (obj) {
    $.ajax({
        url:url.dictUrl.save,
        data:$(obj).serialize(),
        type:"POST",
        // contentType : "application/json;charset=utf-8",
        success:function (data) {
            if(data.status == "success"){
                alert("保存成功");
                $(obj).find(".waitdel").val("");
            }
        },
        error:function () {
            alert("错误");
        }
    });
    preventDefault();
}

deleteit = function (obj) {
    $.ajax({
        url:url.dictUrl.delete,
        data:{id:$(obj).data('id')},
        type:"POST",
        // contentType : "application/json;charset=utf-8",
        success:function (data) {
            if(data.status == "success"){
                alert("删除成功");
                $(obj).parents("tr").remove();
            }
        },
        error:function () {
            alert("列表错误");
        }
    });
};

getDetail = function (obj) {
    if($(obj).val() != -1) {
        $.ajax({
            url: url.dictUrl.selOnchange,
            data: {type: $(obj).val()},
            type: "POST",
            // contentType : "application/json;charset=utf-8",
            success: function (data) {
                if (data.status == "success") {
                    dict.tables(data.list);
                    $('#inputType1').removeAttr("placeholder").val($(obj).val());
                }
            },
            error: function () {
                alert("列表错误");
            }
        });
    }else{
        dict.$table.children("tbody").empty();
    }
};




// 字典库end

