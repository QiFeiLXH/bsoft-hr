import { axios } from '@/utils/request'

const api = {
  personQuery: '/workcardopenaccess/personquery',
  openAccessCount: '/workcardopenaccess/openaccesscount',
  workCardAccessOpen: '/workcardopenaccess/openaccess'
}

/**
 * 获取人员列表
 */
export function doLoadPersonList (parameter) {
  return axios({
    url: api.personQuery,
    method: 'get',
    params: parameter
  })
}

/**
 * 获取工牌待制作数量
 */
export function getOpenAccessCount (parameter) {
  return axios({
    url: api.openAccessCount,
    method: 'get',
    params: parameter
  })
}

export function openAccessWorkCard (parameter) {
  return axios({
    url: api.workCardAccessOpen,
    method: 'post',
    data: parameter
  })
}
