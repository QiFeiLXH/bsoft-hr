import { axios } from '@/utils/request'

const api = {
  queryVacationReduce: '/vacation/reduce/query',
  saveVacationReduce: '/vacation/reduce/save',
  deleteVacationReduce: '/vacation/reduce/delete',
  reduceVacation: '/vacation/reduce/reduce',
}

/* 年假扣除记录查询 */
export function queryVacationReduce (parameter) {
  return axios({
    url: api.queryVacationReduce,
    method: 'get',
    params: parameter
  })
}

/* 保存年假扣除记录 */
export function saveVacationReduce (parameter) {
  return axios({
    url: api.saveVacationReduce,
    method: 'POST',
    data: parameter
  })
}

/* 删除年假扣除记录 */
export function deleteVacationReduce (parameter) {
  return axios({
    url: api.deleteVacationReduce,
    method: 'POST',
    data: parameter
  })
}

/* 扣除年假 */
export function reduceVacation (parameter) {
  return axios({
    url: api.reduceVacation,
    method: 'get',
    params: parameter
  })
}

