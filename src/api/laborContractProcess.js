import { axios } from '@/utils/request'

const api = {
  getTaskList: '/laborcontract/process/tasklist',
  getLaborContractInfo: '/laborcontract/process/laborcontract',
  getActionRecordList: '/laborcontract/process/actionrecord',
}

/* 获取任务列表 */
export function getTaskList (parameter) {
  return axios({
    url: api.getTaskList,
    method: 'get',
    params: parameter
  })
}

/* 获取劳动合同信息 */
export function getLaborContractInfo (parameter) {
  return axios({
    url: api.getLaborContractInfo,
    method: 'get',
    params: parameter
  })
}

/* 获取流程操作记录信息 */
export function getActionRecordList (parameter) {
  return axios({
    url: api.getActionRecordList,
    method: 'get',
    params: parameter
  })
}

