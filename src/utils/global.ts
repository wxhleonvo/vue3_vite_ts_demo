/**设置超级管理员的账号，控制前端无法删除超级管理员相关账号和角色 */
import { getCurrentInstance } from 'vue'
import { superAdmin, superAdminRole } from '../dictionary/staff'

export default function useGetGlobalProperties() {
  const {
    appContext: {
      app: {
        config: { globalProperties },
      },
    },
  } = getCurrentInstance() as any

  return { ...globalProperties, superAdmin, superAdminRole }
}
