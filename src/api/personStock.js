import { axios } from '@/utils/request'

const api = {
  personStockQuery: '/personstock/query',
  personStockLogoutOne: '/personstock/logoutone',
  personStockBatchLogout: '/personstock/batchlogout',
  personStockSave: '/personstock/save',
  personStockExport: 'personstock/exportdownload',
  templateDownload: 'personstock/templatedownload',
  errorDataDownload: 'personstock/errordatadownload',
  personStockImport: 'personstock/import'
}

const qs = require('qs')

/**
 * 获取员工股份列表
 */
export function doLoadPersonStockList (parameter) {
  return axios({
    url: api.personStockQuery,
    method: 'get',
    params: parameter
  })
}

/**
 * 删除员工股份
 */
export function doLogoutPersonStock (parameter) {
  return axios({
    url: api.personStockLogoutOne,
    method: 'delete',
    params: parameter
  })
}

/**
 * 批量删除员工股份
 */
export function doBatchLogoutPersonStocks (parameter) {
  return axios({
    url: api.personStockBatchLogout,
    method: 'delete',
    params: parameter,
  })
}

/**
 * 删除员工股份
 */
export function doSavePersonStock (parameter) {
  return axios({
    url: api.personStockSave,
    method: 'post',
    data: parameter
  })
}

/* 员工股份下载模板 */
export function exportPersonStockTemplate (parameter) {
  return axios({
    url: api.templateDownload,
    method: 'get',
    params: parameter,
    responseType: 'arraybuffer'
  })
}

/* 员工股份下载 */
export function exportPersonStock (parameter) {
  return axios({
    url: api.personStockExport,
    method: 'get',
    params: parameter,
    responseType: 'arraybuffer'
  })
}

/* 员工股份导入错误下载 */
export function exportErrorRecords (parameter) {
  return axios({
    url: api.errorDataDownload,
    method: 'get',
    params: parameter,
    responseType: 'arraybuffer'
  })
}

/* 员工股份导入数据 */
export function importPersonStocks (parameter) {
  return axios({
    url: api.personStockImport,
    method: 'post',
    data: parameter
  })
}
