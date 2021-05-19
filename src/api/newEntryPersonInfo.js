import { axios } from '@/utils/request'

const api = {
  queryPersonInfo: '/newperson/query',
  updateSalary: '/newperson/updatesalary',
  exportExcel: '/newperson/exportdownload',
  getAllCompany: '/newperson/getcompany',
}

/* 入职员工信息查询 */
export function queryPersonInfo (parameter) {
  return axios({
    url: api.queryPersonInfo,
    method: 'get',
    params: parameter
  })
}

/* 获取所有所属公司 */
export function getAllCompany (parameter) {
  return axios({
    url: api.getAllCompany,
    method: 'get',
    params: parameter
  })
}


/* 更新员工薪资 */
export function updateSalary (parameter) {
  return axios({
    url: api.updateSalary,
    method: 'get',
    params: parameter
  })
}

/* 导出新入职员工信息 */
export function exportExcel (parameter) {
  return axios({
    url: api.exportExcel,
    method: 'get',
    params: parameter,
    responseType: 'arraybuffer'
  })
}

