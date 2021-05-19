import { axios } from '@/utils/request'
import moment from "moment";

const api = {
  getDeptTree: '/publicapi/depttree',
  getDeptSelectTree: '/publicapi/deptselecttree',
  getDeptSelectTreeWithPerson: '/publicapi/deptselectwithperson',
  findPersonSelectList: '/publicapi/personselectlist',
  getCurrentPerson: '/publicapi/getcurrentperson',
  companyList: '/publicapi/companylist',
  getPersonSelectList: '/publicapi/personselect',
  getCustomerContractList: '/publicapi/customercontact',
  getPubDicList: '/publicapi/pubdiclist',
  getSysDicList: '/publicapi/sysdiclist',
  getHrDicList: '/publicapi/hrdiclist',
}

export function getDeptTree (parameter) {
  return axios({
    url: api.getDeptTree,
    method: 'get',
    params: parameter
  })
}

export function getDeptSelectTree (parameter) {
  return axios({
    url: api.getDeptSelectTree,
    method: 'get',
    params: parameter
  })
}

export function getDeptSelectTreeWithPerson (parameter) {
  return axios({
    url: api.getDeptSelectTreeWithPerson,
    method: 'get',
    params: parameter
  })
}

export function findPersonSelectList (parameter) {
  return axios({
    url: api.findPersonSelectList,
    method: 'get',
    params: parameter
  })
}

export function getPersonSelectList (parameter) {
  return axios({
    url: api.getPersonSelectList,
    method: 'get',
    params: parameter
  })
}

export function getCurrentPerson (parameter) {
  return axios({
    url: api.getCurrentPerson,
    method: 'get',
    params: parameter
  })
}

export function getCompanyList (parameter) {
  return axios({
    url: api.companyList,
    method: 'get',
    params: parameter
  })
}

/**
 * 图片预览请求
 * @param fileId 文件ID
 * @param time 时间
 * @returns {string} 统一的URL格式
 */
export function showImage (fileId, time) {
  if(fileId && time) {
    return '/api/publicapi/showimage?fileId=' + fileId + '&time=' + time
  } else if (fileId) {
    return '/api/publicapi/showimage?fileId=' + fileId
  }
}

/** 客户往来单位选择列表*/
export function getCustomerContractList (parameter) {
  return axios({
    url: api.getCustomerContractList,
    method: 'get',
    params: parameter
  })
}

/** 公用代码字典列表*/
export function getPubDicList (parameter) {
  return axios({
    url: api.getPubDicList,
    method: 'get',
    params: parameter
  })
}

/** 系统代码字典列表*/
export function getSysDicList (parameter) {
  return axios({
    url: api.getSysDicList,
    method: 'get',
    params: parameter
  })
}

/** 人事代码字典列表*/
export function getHrDicList (parameter) {
  return axios({
    url: api.getHrDicList,
    method: 'get',
    params: parameter
  })
}