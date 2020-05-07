export default {
  loop(data, id, callback) {
    data.forEach((item, index, arr) => {
      if (item.id === id) {
        return callback(item, index, arr);
      }
      if (item.children) {
        return this.loop(item.children, id, callback);
      }
    });
  },
  convertTreeToList(root) {
    let stack = [],
      array = [];
    stack.push(root);
    while (stack.length !== 0) {
      let node = stack.pop();
      this.visitNode(node, array);
      if (node.hasOwnProperty("children")) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push(node.children[i]);
        }
      }
    }
    return array;
  },
  visitNode(node, array) {
    array.push(node);
  },
  // https://github.com/William17/list-to-tree-lite
  listToTree(data, options) {
    options = options || {};
    var ID_KEY = options.idKey || "id";
    var PARENT_KEY = options.parentKey || "parentId";
    var CHILDREN_KEY = options.childrenKey || "children";

    var tree = [],
      childrenOf = {};
    var item, id, parentId;

    for (var i = 0, length = data.length; i < length; i++) {
      item = data[i];
      id = item[ID_KEY];
      parentId = item[PARENT_KEY] || 0;
      // every item may have children
      childrenOf[id] = childrenOf[id] || [];
      // init its children
      item[CHILDREN_KEY] = childrenOf[id];
      if (parentId != 0) {
        // init its parent's children object
        childrenOf[parentId] = childrenOf[parentId] || [];
        // push it into its parent's children object
        childrenOf[parentId].push(item);
      } else {
        tree.push(item);
      }
    }
    return tree;
  },
  arrayToTreeV2(arr) {
    const tree = this.listToTree(arr);
    console.log(tree)
    return this.recursiveTree(tree);
  },
  recursiveTree(tree) {
    let result = [];
    let queue = [];
    let roots = this.reorderV2(tree || []);
    roots.map((x) => {
      let newX = { ...x };
      queue.push(newX);
      result.push(newX);
    });
    while (queue.length !== 0) {
      let node = queue.shift();
      let subRoots = this.reorderV2(node.children || []);
      subRoots.map((x) => {
        let newX = { ...x };
        queue.push(newX);
        result.push(newX);
      });
    }
    return this.listToTree(result);
  },
  reorderV2(arr) {
    if (arr.length === 0) return arr;
    let newArr = [];
    let temp = arr.find((x) => x.leftId === null);
    newArr.push(temp);
    while (newArr.length < arr.length) {
      temp = arr.find((x) => x.leftId === temp.id);
      newArr.push(temp);
    }
    return newArr;
  },
  getItemUpdateWhenDelete(upDeleteObj, downDeleteObj) {
    let updateItems = [];
    if (upDeleteObj && downDeleteObj) {
      updateItems.push({
        id: upDeleteObj.id,
        rightId: downDeleteObj.id,
      });
      updateItems.push({
        id: downDeleteObj.id,
        leftId: upDeleteObj.id,
      });
    } else if (upDeleteObj && !downDeleteObj) {
      updateItems.push({
        id: upDeleteObj.id,
        rightId: null,
      });
    } else if (!upDeleteObj && downDeleteObj) {
      updateItems.push({
        id: downDeleteObj.id,
        leftId: null,
      });
    }
    return updateItems;
  },
  getItemUpdateTree(
    dragObj,
    upDragObj,
    downDragObj,
    upDropObj,
    downDropObj,
    parentDropObj
  ) {
    let updateItems = [];
    if (dragObj) {
      const leftId = upDropObj ? upDropObj.id : null;
      const rightId = downDropObj ? downDropObj.id : null;
      const parentId = parentDropObj ? parentDropObj.id : null;
      updateItems.push({
        id: dragObj.id,
        leftId,
        rightId,
        parentId,
      });
    }
    if (upDragObj) {
      const rightId = downDragObj ? downDragObj.id : null;
      updateItems.push({
        id: upDragObj.id,
        rightId,
      });
    }
    if (downDragObj) {
      const leftId = upDragObj ? upDragObj.id : null;
      updateItems.push({
        id: downDragObj.id,
        leftId,
      });
    }
    if (upDropObj) {
      const rightId = dragObj ? dragObj.id : null;
      updateItems.push({
        id: upDropObj.id,
        rightId,
      });
    }
    if (downDropObj) {
      const leftId = dragObj ? dragObj.id : null;
      updateItems.push({
        id: downDropObj.id,
        leftId,
      });
    }
    return updateItems;
  },
};
