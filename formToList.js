///存储数据的类
///创建对象的时候需要传入 默认的集合
///baseList： 初始化的结果值
function FormToList(baseList) {
    ///基础数据集合的记录
    ///key      : 对应数据源中的key
    ///DOMId    : 在dom结构中对应的元素的id，即追加的节点id
    ///DOMNode  : 来源于创建的时候，直接绑定
    ///oldValue : 来源于createNewList的参数valueList，
    ///newValue : 存储在修改过程中的数据
    ///changeValueFunction : 数据改变时触发的方法
    ///     由于用户可能需要增加一些验证方法，所以请注意验证成功后，手动触发updateNewList方法
    ///     此处可允许无参函数
    ///     如果为空，默认增加updateNewList方法
    ///getValueFunction    : 获得值的函数，如果返回值为null，则表示放弃此次获值
    this.baseList = baseList;  

    ///设置值并形成dom结构
    ///valueList : 数据列表 [key] 和 [value]
    this.setValueAndCreateDom = function(valueList) {
        createDomAndAppend(this.baseList);       //创建dom结构
        createNewList(valueList, this.baseList); //初始值
    }
    ///检查内容的方法
    ///valueNewList : 数据列表 [key] 和 [value]
    this.checkNewList = function(valueNewList) {
        var hasError = false; //判断是否有冲突
        for (var i = 0; i < this.baseList.length; i++) {
            //清空之前的样式
            for(var k = 0; k < this.baseList[i].DOMNode.classList.length; k++){
                if (this.baseList[i].DOMNode.classList[k] == "alertInput") {
                    this.baseList[i].DOMNode.classList.remove("alertInput");
                    this.baseList[i].DOMNode.nextElementSibling.innerText = "";
                }
            }

            updateNewList(i, this.baseList);//更新数据

            //检查是否数据库已被更新
            //如果数据库更新，带页面没改，则更新初始数据和改后的数据
            //如果数据库更新，但页面修改了，则显示提示信息
            for (var j = 0; j < valueNewList.length; j++) {
                if ((this.baseList[i].key == valueNewList[j].key) && (this.baseList[i].oldValue != valueNewList[j].value)) {
                    //检查数据是否在本页面更改
                    if ((this.baseList[i].oldValue == this.baseList[i].newValue) || ((this.baseList[i].oldValue != this.baseList[i].newValue) && (this.baseList[i].newValue == valueNewList[j].value))) {
                        //如果没改,或整好改成数据库的值，则直接更新
                        this.baseList[i].newValue = valueNewList[j].value;
                        this.baseList[i].DOMNode.value = valueNewList[j].value;
                    } else {
                        this.baseList[i].DOMNode.classList.add("alertInput");
                        this.baseList[i].DOMNode.nextElementSibling.innerText = "数据库数据为：" + valueNewList[j].value;
                        hasError = true;
                    }
                    this.baseList[i].oldValue = valueNewList[j].value;//更新初始数据
                    break;
                }
            }
        }

        return hasError;
    }
    ///获得更新的数据集合
    ///返回  ：更改了的数据。 结构 [key] 和 [value]
    this.getUpdateList = function () {
        var newList = [];
        for (var i = 0; i < this.baseList.length; i++) {
            if (this.baseList[i].oldValue != this.baseList[i].newValue) {
                var content = {};
                content.key = this.baseList[i].key;
                content.value = this.baseList[i].newValue;
                newList.push(content);
            }
        }
        return newList;
    }


    ///根据初始值baseList创建dom结构，创建类型目前均为input
    ///baseList ：基础数据集合的记录，为当前的this.baseList集合
    function createDomAndAppend(baseList) {
        for (var i = 0; i < baseList.length; i++) {
            //创建input元素并追加
            var baseEle = document.getElementById(baseList[i].DOMId);
            var inputEle = document.createElement("input");
            inputEle.dataset.index = i;
            baseEle.appendChild(inputEle);
            //创建p元素并追加
            var pEle = document.createElement("p");
            pEle.dataset.index = i;
            baseEle.appendChild(pEle);

            baseList[i].DOMNode = inputEle;//存储dom节点

            //追加onchange函数
            //如果不为空，则先执行用户定义的函数
            if (baseList[i].changeValueFunction != null) {
                baseList[i].DOMNode.onchange = function () {
                    var bool = baseList[this.dataset.index].changeValueFunction();
                    if (bool)
                        updateNewList(this.dataset.index, baseList);
                }
            } else {
                baseList[i].DOMNode.onchange = function () {
                    updateNewList(this.dataset.index, baseList);
                }
            }
        }
    }
    ///根据原数据集合和值集合，修改原数据集合，修改dom中值，并创建新的数组
    ///valueList: 值集合 [key] 和 [value]
    ///baseList : 基础数据集合的记录，为当前的this.baseList集合
    function createNewList(valueList, baseList) {
        for (var i = 0; i < baseList.length; i++) {
            //遍历寻找value的初始值
            for (var j = 0; j < valueList.length; j++) {
                if (valueList[j].key == baseList[i].key) {
                    baseList[i].oldValue = valueList[j].value;
                    baseList[i].newValue = valueList[j].value;
                    baseList[i].DOMNode.value = valueList[j].value;//修改dom结构中展示的数值
                    
                    break;
                }
            }
        }
    };
    ///根据序号i,通过调用获得值的方法，修改对应的value内容的方法
    ///i        : 序号
    ///baseList ：基础数据集合的记录，为当前的this.baseList集合
    function updateNewList(i, baseList) {
        //如果获得的方法不为空、返回值不为null，则获值
        if (baseList[i].getValueFunction != null) {
            var result = baseList[i].getValueFunction();
            if (result != null) {
                baseList[i].newValue = result;
                baseList[i].DOMNode.value = result;
            }
        }
    }
}