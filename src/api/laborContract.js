import { axios } from '@/utils/request'

const api = {
  getLaborContractList: '/laborcontract/list',
  getPersonalLaborContractList: '/laborcontract/detail',

}

/* 获取劳动合同列表 */
export function getLaborContractList (parameter) {
  return axios({
    url: api.getLaborContractList,
    method: 'get',
    params: parameter
  })
}

/* 获取个人劳动合同列表 */
export function getPersonalLaborContractList (parameter) {
  return axios({
    url: api.getPersonalLaborContractList,
    method: 'get',
    params: parameter
  })
}
