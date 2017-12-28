
var valueList = [{ "key": "name", "value": "aa" }, { "key": "id", "value": "bb" }, { "key": "class", "value": "cc" }];//后台的初始数据

///初始化设定,集合中
///key  ：对应数据源中的key
///DOMId：在dom结构中对应的元素的id，即追加的节点id
///changeValueFunction: 数据改变时触发的方法
///getValueFunction   : 获得值的函数，如果返回值为null，则表示放弃此次获值
var baseList = [
    {
        "key": "name", "DOMId": "base_namePart",
        "changeValueFunction": function () { return true },
        "getValueFunction": function () {
            return document.getElementById("base_namePart").children[0].value;
        }
    },{
        "key": "id", "DOMId": "base_idPart",
        "changeValueFunction": function () { return true },
        "getValueFunction": function () {
            return document.getElementById("base_idPart").children[0].value;
        }
    },{
        "key": "class", "DOMId": "base_classPart",
        "changeValueFunction": function () { return true },
        "getValueFunction": function () {
            return document.getElementById("base_classPart").children[0].value;
        }
    }
];

var formToListObj = new FormToList(baseList);
formToListObj.setValueAndCreateDom(valueList); //设置数据，并创建dom

///提交按钮的点击事件
function buttonOnClickFunction() {
    var valueNewList = [{ "key": "name", "value": "aa" }, { "key": "id", "value": "bb1" }, { "key": "class", "value": "cc1" }];//后台再次传入的数据

    var hasError = formToListObj.checkNewList(valueNewList);
    if (hasError)
        alert("部分数据已在数据库中更新，请再次确认更新");
    else {
        var newList = formToListObj.getUpdateList();
        alert(JSON.stringify(newList));
    }
}