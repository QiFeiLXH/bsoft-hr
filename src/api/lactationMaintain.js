import { axios } from '@/utils/request'

const api = {
  lactationQuery: '/lactation/list',
  lactationSave: '/lactation/save'
}

const qs = require('qs')

/**
 * 获取哺乳假期列表
 */
export function doLoadLactationList (parameter) {
  return axios({
    url: api.lactationQuery,
    method: 'get',
    params: parameter,
  })
}

/**
 * 保存，更新哺乳假
 */
export function doSaveLactation (parameter) {
  return axios({
    url: api.lactationSave,
    method: 'post',
    data: parameter
  })
}
