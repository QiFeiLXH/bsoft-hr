import { axios } from '@/utils/request'

const api = {
  socialPlaceQuery: 'personsocialplace/query',
  socialPlaceSave: 'personsocialplace/save',
  adjustRecordQuery: 'personsocialplace/adjustrecord'
}
const qs = require('qs')

/**
 * 获取人员社保缴纳地信息列表
 */
export function doLoadPersonSocialPlaceList (parameter) {
  return axios({
    url: api.socialPlaceQuery,
    method: 'get',
    params: parameter,
  })
}

/**
 * 获取人员调整记录列表
 */
export function doLoadPersonAdjustRecordList (parameter) {
  return axios({
    url: api.adjustRecordQuery,
    method: 'get',
    params: parameter
  })
}

/**
 * 保存社保对接人
 */
export function doSavePersonalSocialPlace (parameter) {
  return axios({
    url: api.socialPlaceSave,
    method: 'post',
    data: parameter,
  })
}
