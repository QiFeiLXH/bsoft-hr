import { axios } from '@/utils/request'

const api = {
  monthCount: 'toformal/count',
  monthDetail: 'toformal/list',
  getPersonTurInfo: 'toformal/turinfo',
}

export function monthCount (parameter) {
  return axios({
    url: api.monthCount,
    method: 'get',
    params: parameter
  })
}

export function monthDetail (parameter) {
  return axios({
    url: api.monthDetail,
    method: 'post',
    data: parameter
  })
}

export function getPersonTurInfo (parameter) {
  return axios({
    url: api.getPersonTurInfo,
    method: 'get',
    params: parameter
  })
}