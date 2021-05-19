import { axios } from '@/utils/request'

const api = {
  queryList: '/personfinancialtotal/queryList',
  savePersonType: '/personfinancialtotal/add',
  logoutPersonType:'/personfinancialtotal/logout',
  updatePersonType:'/personfinancialtotal/update',
}

/* 获取全部人员财务列表列表 */
export function queryList (parameter) {
  return axios({
    url: api.queryList,
    method: 'get',
    params: parameter
  })
}

/* 新增人员财务类别 */
export function savePersonType (parameter) {
  return axios({
    url: api.savePersonType,
    method: 'post',
    data: parameter
  })
}

/* 修改人员财务类别 */
export function updatePersonType (parameter) {
  return axios({
    url: api.updatePersonType,
    method: 'post',
    data: parameter
  })
}



/* 注销人员财务管理 */
export function logoutPersonType (parameter) {
  return axios({
    url: api.logoutPersonType,
    method: 'get',
    params: parameter
  })
}



