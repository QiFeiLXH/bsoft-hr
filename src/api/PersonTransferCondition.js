import { axios } from '@/utils/request'

const api = {
  queryPersonCondition: '/transfercondition/getPersonTransferCondition',
  exportdownload:'/transfercondition/exportdownload',
}

/* 员工调动记录查询 */
export function getPersonTransferCondition (parameter) {
  return axios({
    url: api.queryPersonCondition,
    method: 'get',
    params: parameter
  })
}

/* 员工调动记录导出 */
export function exportdownload (parameter) {
  return axios({
    url: api.exportdownload,
    method: 'get',
    params: parameter,
    responseType: 'arraybuffer'
  })
}


