// 账号状态
export const staffStatusDic: { [key: string]: { text: string; type: string } } =
  {
    // '0': {
    //   text: '未激活',
    //   type: 'warning'
    // },
    '1': {
      text: '正常',
      type: 'success',
    },
    '2': {
      text: '禁用',
      type: 'danger',
    },
    '3': {
      text: '离职',
      type: 'info',
    },
  }

// 超级管理员, 禁止删除该账号
export const superAdmin: string = 'superadmin'
// 超级管理员角色，, 禁止删除该角色
export const superAdminRole: string = 'superadmin'
