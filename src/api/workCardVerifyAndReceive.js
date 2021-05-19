import { axios } from '@/utils/request'

const api = {
  dateQuery: '/workcardverifyreceive/datequery',
  personQuery: '/workcardverifyreceive/personquery',
  workCardAmount: '/workcardverifyreceive/amount',
  imageRewrite: '/workcardverifyreceive/imagerewrite',
  imageUpload: '/workcardverifyreceive/imageupload',
  imageDownload: '/workcardverifyreceive/imagedownload',
  showImage: '/workcardverifyreceive/showimage',
  workCardVerify: '/workcardverifyreceive/verify',
  workCardReceive: '/workcardverifyreceive/receive',
  verifyCount: '/workcardverifyreceive/verifycount',
  receiveCount: '/workcardverifyreceive/receivecount',
  batchReceive: '/workcardverifyreceive/batchreceive'
}
const qs = require('qs')
/**
 * 获取日期列表
 */
export function doLoadDateList (parameter) {
  return axios({
    url: api.dateQuery,
    method: 'get',
    params: parameter
  })
}

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
 * 获取人员工牌充值金额
 */
export function getWorkCardAmount (parameter) {
  return axios({
    url: api.workCardAmount,
    method: 'get',
    params: parameter
  })
}

export function rewriteImage (parameter) {
  return axios({
    url: api.imageRewrite,
    method: 'post',
    data: parameter
  })
}

export function uploadImage (parameter) {
  return axios({
    url: api.imageUpload,
    method: 'post',
    data: parameter
  })
}

export function showImage (parameter) {
  return axios({
    url: api.showImage,
    method: 'get',
    params: parameter
  })
}

export function verifyWorkCard (parameter) {
  return axios({
    url: api.workCardVerify,
    method: 'post',
    data: parameter
  })
}

export function receiveWorkCard (parameter) {
  return axios({
    url: api.workCardReceive,
    method: 'get',
    params: parameter
  })
}

export function getVerifyCount (parameter) {
  return axios({
    url: api.verifyCount,
    method: 'get',
    params: parameter,
  })
}

export function getReceiveCount (parameter) {
  return axios({
    url: api.receiveCount,
    method: 'get',
    params: parameter,
  })
}

/**
 * 批量领取
 */
export function doBatchReceive (parameter) {
  return axios({
    url: api.batchReceive,
    method: 'get',
    params: parameter,
  })
}