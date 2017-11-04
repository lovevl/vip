/**
 * Created by xmmrh on 2017/11/3.
 */
function createDocumentByFrame(data, tagname,clazz) {//
    var rootElmt = document.createElement(tagname);
    if(clazz)rootElmt.setAttribute("class", clazz);
    for (var x in data) {
        if ("object" == typeof data[x]&&data[x]!=null&&data[x]!=undefined) {
            for(var y = 0;y<data[x].length;y++){
                rootElmt.appendChild(createDocumentByFrame(data[x][y], x));
            }
        } else if ("string" == typeof data[x] || "number"== typeof data[x]) {
            if (x == "clazz") {
                rootElmt.setAttribute("class", data[x]);
            } else if (x == "innerHTML" || x == "text") {
                rootElmt.innerHTML = data[x];
            } else {
                rootElmt.setAttribute(x, data[x]);
            }
        }
    }
    return rootElmt;
}

rem_pageCount={
    fnn : function () {
        var params = {type: rem_pageCount.type,pageNo:rem_pageCount.page.pageNo,length:rem_pageCount.page.length};
        if(rem_pageCount.callee == "initRec"){
            initRec(params);
        }else if(rem_pageCount.callee == "getAll"){
            getAll(params)
        }
    },
    callee : null,
    type : null,
    page : null,
    createPageCount:function(page,type,callee) {
        rem_pageCount.callee = callee;
        rem_pageCount.type = type;
        rem_pageCount.page = page;
        var staticPage_start = Math.floor((page.pageNo - 1) / 5) * 5 + 1;
        var staticPage_end = ((staticPage_start + 4) < page.totalPage) ? (staticPage_start + 4) : page.totalPage;
        var li_pageFirst = [{innerHTML : "<a href=\"javascript:;\">|«</a>"}];
        var li_pageNoPre = [{innerHTML : "<a href=\"javascript:;\">‹</a>"}];
        var li_pageStatic = [];
        for (var i = staticPage_start; i < staticPage_end+1; i++) {
            var li = { innerHTML : "<a href=\"javascript:;\">" + i + "</a>"};
            li_pageStatic[li_pageStatic.length] = li;
        }
        var li_pageNoNext = [{ innerHTML : '<a href=\"javascript:;\">›</a>'}];
        var li_pageLast = [{ innerHTML : '<a  href=\"javascript:;\">»|</a>'}];
        var li_pageTotal = [{ innerHTML : '<a  href=\"javascript:;\">第'+page.pageNo+'/'+page.totalPage+'页</a>',clazz : "disabled"}];
        var lis = li_pageFirst.concat(li_pageNoPre).concat(li_pageStatic).concat(li_pageNoNext).concat(li_pageLast).concat(li_pageTotal);
        var ul = createDocumentByFrame({
            li : lis
        }, "ul","recom pagination");
        rem_pageCount.initPageFunc(ul);
        rem_pageCount.setPageClass(ul);
        return ul;
    },
    initPageFunc : function(ul){
        var lis = $(ul).children("li");
        lis[0].onclick = rem_pageCount.fistPage;
        lis[1].onclick = rem_pageCount.prePage;
        for(var i = 2;i<lis.length - 3;i++){
            lis[i].onclick = rem_pageCount.goPage;
        }
        lis[lis.length - 3].onclick = rem_pageCount.nextPage;
        lis[lis.length - 2].onclick = rem_pageCount.lastPage;
    },
    fistPage : function(){
        if (rem_pageCount.page.pageNo > 1) {
            rem_pageCount.page.pageNo = 1;
            rem_pageCount.fnn();
            $(this).addClass("disabled");
        } else {
            $(this).addClass("disabled");
            return false;
        }
    },
    prePage : function() {
        if (rem_pageCount.page.pageNo > 1) {
            rem_pageCount.page.pageNo--;
            rem_pageCount.fnn();
        } else {
            return false;
        }
    },
    nextPage : function() {
        if (rem_pageCount.page.pageNo < rem_pageCount.page.totalPage) {
            rem_pageCount.page.pageNo++;
            rem_pageCount.fnn();
        } else {
            return false;
        }
    },
    lastPage : function() {
        if (rem_pageCount.page.pageNo < rem_pageCount.page.totalPage) {
            rem_pageCount.page.pageNo = rem_pageCount.page.totalPage;
            rem_pageCount.fnn();
            $(this).addClass("disabled");
        } else {
            $(this).addClass("disabled");
            return false;
        }
    },
    goPage : function(){
        var	pageNo = $(this).find("a")[0].innerHTML;
        if(pageNo>0){
            rem_pageCount.page.pageNo=pageNo;
            rem_pageCount.fnn();
        }
    },
    setPageClass : function(ul) {
        var $li = $(ul).children("li");
        var length = $li.length;
        (function(p){
            if(p.pageNo == 1){
                $li.eq(0).addClass("disabled");
                $li.eq(1).addClass("disabled");
            }
            if(p.pageNo == p.totalPage){
                $li.eq(length-3).addClass("disabled");
                $li.eq(length-2).addClass("disabled");
            }
            for(var i = 2; i < length-3; i++){
                if($li.eq(i).find("a").text() == p.pageNo){
                    $li.eq(i).addClass("active");
                }
            }
        })(rem_pageCount.page);
    },
    refresh_paganation : function(jq_paganation) {
        jq_paganation.empty().append(createPageCount(page));
    }
};