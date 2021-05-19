import { axios } from '@/utils/request'

const api = {
  personalLeaveQuery: '/personalleave/personalquery',
  personalLeaveTotalQuery: '/personalleave/personaltotal',
  personalLeaveInfoQuery: '/personalleave/personalused'

}

/* 员工假期记录查询 */
export function doLoadLeaveList (parameter) {
  return axios({
    url: api.leaveQuery,
    method: 'get',
    params: parameter
  })
}

/* 员工个人假期记录查询 */
export function doLoadPersonalLeaveList (parameter) {
  return axios({
    url: api.personalLeaveQuery,
    method: 'get',
    params: parameter
  })
}

/* 员工个人假期调休、年休总天数查询 */
export function doLoadPersonalTotalVacationList (parameter) {
  return axios({
    url: api.personalLeaveTotalQuery,
    method: 'get',
    params: parameter
  })
}

/* 员工个人假期调休、年休已用天数查询 */
export function doLoadPersonalVacationUsedList (parameter) {
  return axios({
    url: api.personalLeaveInfoQuery,
    method: 'get',
    params: parameter
  })
}
