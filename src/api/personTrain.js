import { axios } from '@/utils/request'

const api = {
  PersonTransferQuery: 'transfer/list',
  PersonTransferSave: 'transfer/save',
  getDic: 'transfer/getdic',
  getPersonnelGroupDic:'transfer/getPersonnelGroupDic'
}

/**
 * 查询
 */
export function doQueryPersonTransfer (parameter) {
  return axios({
    url: api.PersonTransferQuery,
    method: 'post',
    data: parameter
  })
}

export function doSavePersonTransfer (parameter) {
  return axios({
    url: api.PersonTransferSave,
    method: 'post',
    data: parameter
  })
}


export function getDic () {
  return axios({
    url: api.getDic,
    method: 'get'
  })
}

export function getPersonnelGroupDic(parameter) {
  return axios({
    url: api.getPersonnelGroupDic,
    method: 'get',
    params: parameter
  })
}
