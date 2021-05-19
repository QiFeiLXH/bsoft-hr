import { axios } from '@/utils/request'

const api = {
  personQuery: '/workcardmake/personquery',
  makeCount: '/workcardmake/makecount',
  batchDownload: '/workcardmake/batchDownload',
  imageDownload: '/workcardmake/imagedownload',
  showImage: '/workcardmake/showimage',
  workCardMake: '/workcardmake/make'
}

const qs = require('qs')

/**
 * 获取人员列表
 */
export function doLoadPersonList (parameter) {
  return axios({
    url: api.personQuery,
    method: 'get',
    params: parameter,
  })
}

/**
 * 获取工牌待制作数量
 */
export function getMakeCount (parameter) {
  return axios({
    url: api.makeCount,
    method: 'get',
    params: parameter,
  })
}

/**
 * 批量打包下载
 */
export function batchCompressDownload (parameter) {
  return axios({
    url: api.batchDownload,
    method: 'get',
    params: parameter,
    responseType: 'arraybuffer'
  })
}

export function imageDownload (parameter) {
  return axios({
    url: api.imageDownload,
    method: 'get',
    params: parameter,
    responseType: 'arraybuffer'
  })
}

export function showImage (parameter) {
  return axios({
    url: api.showImage,
    method: 'get',
    params: parameter
  })
}

export function makeWorkCard (parameter) {
  return axios({
    url: api.workCardMake,
    method: 'post',
    data: parameter
  })
}
