import { axios } from '@/utils/request'

const api = {
  leaveQuery: '/leave/query',
  leaveTotalQuery: '/leave/totalquery',
  leaveInfoQuery: '/leave/infoquery'

}

/* 员工假期记录查询 */
export function doLoadLeaveList (parameter) {
  return axios({
    url: api.leaveQuery,
    method: 'get',
    params: parameter
  })
}
/* 员工假期调休、年休总天数查询 */
export function doLoadTotalVacationList (parameter) {
  return axios({
    url: api.leaveTotalQuery,
    method: 'get',
    params: parameter
  })
}

/* 员工假期调休、年休已用天数查询 */
export function doLoadVacationUsedList (parameter) {
  return axios({
    url: api.leaveInfoQuery,
    method: 'get',
    params: parameter
  })
}
