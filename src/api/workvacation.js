import { axios } from '@/utils/request'

const api = {
  queryVacationTotal: '/vacation/query/total',
  queryVacationPersonal: '/vacation/query/personal'

}

/* 员工假期记录查询 */
export function queryVacationTotal (parameter) {
  return axios({
    url: api.queryVacationTotal,
    method: 'get',
    params: parameter
  })
}

export function queryVacationPersonal (parameter) {
  return axios({
    url: api.queryVacationPersonal,
    method: 'get',
    params: parameter
  })
}
