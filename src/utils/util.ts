 // 扁平数据转树结构---暂不支持多级
 export function arrToTree({
    list = [],
    id = 'CODE',
    pid = 'PARENT_CODE',
    children = 'Children',
  }: {
    list: any[]
    id?: string
    pid?: string
    children?: string
  }) {
    // 定义最终需要返回的树形结构数据
    let treeData: any[] = []
    // 对传入的数组进行遍历
    list.forEach((item) => {
      // 如果pid没有值,那就是顶级对象,直接添加进数组
      if (!item[pid]) {
        treeData.push(item)
      }
      // 理解为二次遍历 ：每个对象都找一遍自己的孩子添加到children
      let objList = list.filter((data) => data[pid] === item[id])
      if (objList.length) {
        item[children] = objList
      }
    })
    console.log('treeData',treeData);
    return treeData
  }