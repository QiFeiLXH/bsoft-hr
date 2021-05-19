import { axios } from '@/utils/request'

const api = {
  queryAttendenceStatis: '/attendencestatis/query',
  queryAttendenceCount: '/attendencestatis/querycount',
  generAttendenceCount: '/attendencestatis/gener',
  queryAttendenceAbnormal: '/attendencestatis/queryabnormal',
  doCommitAttendence: '/attendencestatis/commit',
  doBackAttendence: '/attendencestatis/doback',
  exportAttendenceInfo: '/attendencestatis/exportdownload',
  queryAttendenceCountDetail: '/attendencestatis/detail',
}

export function exportAttendenceInfo (parameter) {
  return axios({
    url: api.exportAttendenceInfo,
    method: 'get',
    params: parameter,
    responseType: 'arraybuffer'
  })
}

export function queryAttendenceCountDetail (parameter) {
  return axios({
    url: api.queryAttendenceCountDetail,
    method: 'get',
    params: parameter
  })
}

/* 統計考勤信息*/
export function queryAttendenceStatis (parameter) {
  return axios({
    url: api.queryAttendenceStatis,
    method: 'post',
    data: parameter
  })
}

export function queryAttendenceCount (parameter) {
  return axios({
    url: api.queryAttendenceCount,
    method: 'post',
    data: parameter
  })
}

export function generAttendenceCount (parameter) {
  return axios({
    url: api.generAttendenceCount,
    method: 'post',
    data: parameter
  })
}

/* 查询考勤异常信息*/
export function queryAttendenceAbnormal (parameter) {
  return axios({
    url: api.queryAttendenceAbnormal,
    method: 'post',
    data: parameter
  })
}

export function doCommitAttendence (parameter) {
  return axios({
    url: api.doCommitAttendence,
    method: 'post',
    data: parameter
  })
}

export function doBackAttendence (parameter) {
  return axios({
    url: api.doBackAttendence,
    method: 'post',
    data: parameter
  })
}
