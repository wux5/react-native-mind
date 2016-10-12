import utils from './utils'
import Point from './point'
import Box from './box'

import nodeStyle from '../style/node.style'


class Node {
    constructor() {

        // 指针
        this.parent = null;
        this.root = this;
        this.children = [];
        this.point=new Point(0,0,0,0);
        this.titleBox=new Box(0,0);
        this.contentBox=new Box(0,0);

        // 数据
        this.data = {
            id: utils.guid(),
            created: +new Date()
        };

    }

    getData(key) {
        return key ? this.data[key] : this.data;
    }

    setData(key, value) {
        if (typeof key == 'object') {
            var data = key;
            for (key in data) {
                if (data.hasOwnProperty(key)) {
                    this.data[key] = data[key];
                }
            }
        } else {
            this.data[key] = value;
        }
        return this;
    }

    getChildren() {
        return this.children;
    }

    get level() {
        var level = 0,
            ancestor = this.parent;
        while (ancestor) {
            level++;
            ancestor = ancestor.parent;
        }
        return level;
    }

    get maxHeight(){
        var children = this.getChildren();
        var h=0;
        for (var i = 0; i < children.length; i++) {
            h+=children[i].calcMaxHeight();
        }
        return h;
    }

    get style(){
        let style;
        switch(this.data.type){
            case 1:
                style=nodeStyle.image;
                break;
            case 2:
                style=nodeStyle.file;
                break;
            case 3:
                style=nodeStyle.content;
                break;
            default:
                style=nodeStyle.text;
                break;
        }
        return style;
    }

    get shape(){
        let box = new Box(0,0);
        box.width=Math.max(this.titleBox.width,this.contentBox.width);
        box.height=this.titleBox.height+this.contentBox.height;
        return box;
    }

    calcMaxHeight(){
        var children = this.getChildren();

        var _h=0;
        for (var i = 0; i < children.length; i++) {
            _h+=this.children[i].calcMaxHeight();
        }

        return Math.max(this.shape.height+nodeStyle.blankBottom,_h);
    }

    isRoot() {
        return this.root === this;
    }
    /**
     * 先序遍历当前节点树
     * @param  {Function} fn 遍历函数
     */
    preTraverse(fn, excludeThis) {
        var children = this.getChildren();
        if (!excludeThis) fn(this);
        for (var i = 0; i < children.length; i++) {
            children[i].preTraverse(fn);
        }
    }

    /**
     * 后序遍历当前节点树
     * @param  {Function} fn 遍历函数
     */
    postTraverse(fn, excludeThis) {
        var children = this.getChildren();
        for (var i = 0; i < children.length; i++) {
            children[i].postTraverse(fn);
        }
        if (!excludeThis) fn(this);
    }

    traverse(fn, excludeThis) {
        return this.preTraverse(fn, excludeThis);
    }

    insertChild(node, index) {
        if (index === undefined) {
            index = this.children.length;
        }
        // if (node.parent) {
        //     node.parent.removeChild(node);
        // }
        node.parent = this;
        node.root = this.root;
        node.index=index;

        this.children.splice(index, 0, node);
    }
}

module.exports = Node;
