export const availableNav = (nav, permissions) => {
  let resultNav = [];
  nav.map((item) => {
    if (!item.hasOwnProperty("permissions")) {
      if (item.hasOwnProperty("children")) {
        const { children } = item;
        let newChildren = [];
        children.map((ele) => {
          if (!ele.hasOwnProperty("permissions")) {
            newChildren.push(ele);
          } else {
            const { permissions: curr } = ele;
            if (curr.every((x) => permissions.includes(x))) {
              newChildren.push(ele);
            }
          }
        });
        item.children = newChildren;
      }
      resultNav.push(item);
    } else {
      const { permissions: curr } = item;
      if (curr.every((x) => permissions.includes(x))) {
        if (item.hasOwnProperty("children")) {
          const { children } = item;
          let newChildren = [];
          children.map((ele) => {
            if (!ele.hasOwnProperty("permissions")) {
              newChildren.push(ele);
            } else {
              const { permissions: deepCurr } = ele;
              if (deepCurr.every((x) => permissions.includes(x))) {
                newChildren.push(ele);
              }
            }
          });
          item.children = newChildren;
        }
        resultNav.push(item);
      }
    }
  });
  return resultNav;
};