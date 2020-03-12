export function generateTree(list, parentId, tree) {
  const childList = list.filter(({parentKey}) => parentId === parentKey || (!parentKey && !parentId));
  if (childList.length > 0) {
    tree.children = childList;
    childList.map(item => {
      const {key} = item;
      generateTree(list, key, item);
    });
  }
}
