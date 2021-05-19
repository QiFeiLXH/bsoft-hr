import { axios } from '@/utils/request'

const api = {
  queryDept: '/vacation/clockin/deptquery',
  queryPersonal: '/vacation/clockin/personalquery',
  setDept: '/vacation/clockin/deptset',
  setPersonal: '/vacation/clockin/personalset',
}

/**
 * 获取部门考勤方式信息
 */
export function queryDept(parameter) {
  return axios({
    url: api.queryDept,
    method: 'GET',
    params: parameter
  })
}

/**
 * 获取个人考勤方式信息
 */
export function queryPersonal(parameter) {
  return axios({
    url: api.queryPersonal,
    method: 'GET',
    params: parameter
  })
}

/**
 * 设置部门考勤方式
 */
export function setDept(parameter) {
  return axios({
    url: api.setDept,
    method: 'POST',
    data: parameter
  })
}

/**
 * 设置个人考勤方式
 */
export function setPersonal(parameter) {
  return axios({
    url: api.setPersonal,
    method: 'POST',
    data: parameter
  })
}