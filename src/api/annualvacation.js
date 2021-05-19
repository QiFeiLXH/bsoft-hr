import { axios } from '@/utils/request'

const api = {
  queryAnnualVacation: '/vacation/annual/query',
  addAnnualVacation: '/vacation/annual/add',
  updateAnnualVacation: '/vacation/annual/update',
}

/* 员工年假记录查询 */
export function queryAnnualVacation (parameter) {
  return axios({
    url: api.queryAnnualVacation,
    method: 'get',
    params: parameter
  })
}

/* 新增年假记录 */
export function addAnnualVacation (parameter) {
  return axios({
    url: api.addAnnualVacation,
    method: 'POST',
    data: parameter
  })
}

/* 修改年假记录（仅修改备注） */
export function updateAnnualVacation (parameter) {
  return axios({
    url: api.updateAnnualVacation,
    method: 'POST',
    data: parameter
  })
}

