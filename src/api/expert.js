import { axios } from '@/utils/request'

const api = {
  allexpert: '/expert/getexperts',
  saveexpert: '/expert/saveexpert',
  experttype:'/expert/gettypedic',
  removeexpert:'/expert/removeexpert',
}

/* 获取全部专家列表 */
export function getExperts (parameter) {
  return axios({
    url: api.allexpert,
    method: 'get',
    params: parameter
  })
}

/* 保存专家 */
export function saveExpert (parameter) {
  return axios({
    url: api.saveexpert,
    method: 'post',
    data: parameter
  })
}

/* 获取全部专家列表 */
export function getExpertTypeDic (parameter) {
  return axios({
    url: api.experttype,
    method: 'get',
    params: parameter
  })
}

/* 删除专家 */
export function removeExpert (parameter) {
  return axios({
    url: api.removeexpert,
    method: 'delete',
    params: parameter
  })
}

