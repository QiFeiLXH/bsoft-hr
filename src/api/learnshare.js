import { axios } from '@/utils/request'

const api = {
  learnQuery: '/train/learn/query',
  learnTemplateDownload: '/train/learn/templatedownload',
  learnErrorDownload: '/train/learn/errordownload',
  learnImport: '/train/learn/import',
  learnDelete: '/train/learn/delete',
  shareQuery: '/train/share/query',
  shareTemplateDownload: '/train/share/templatedownload',
  shareErrorDownload: '/train/share/errordownload',
  shareImport: '/train/share/import',
  shareDelete: '/train/share/delete'
}

const qs = require('qs')

/* 知识学习查询 */
export function doLoadKnowledgeLearnList (parameter) {
  return axios({
    url: api.learnQuery,
    method: 'get',
    params: parameter
  })
}

/* 知识学习下载模板 */
export function exportKnowledgeLearnTemplate (parameter) {
  return axios({
    url: api.learnTemplateDownload,
    method: 'get',
    params: parameter,
    responseType: 'arraybuffer'
  })
}

/* 知识学习导入数据 */
export function importKnowledgeLearnData(parameter) {
  return axios({
    url: api.learnImport,
    method: 'post',
    data: parameter,
  })
}

/* 知识分享查询 */
export function doLoadKnowledgeShareList (parameter) {
  return axios({
    url: api.shareQuery,
    method: 'get',
    params: parameter
  })
}

/* 知识分享下载模板 */
export function exportKnowledgeShareTemplate (parameter) {
  return axios({
    url: api.shareTemplateDownload,
    method: 'get',
    params: parameter,
    responseType: 'arraybuffer'
  })
}

/* 知识分享导入数据 */
export function importKnowledgeShareData(parameter) {
  return axios({
    url: api.shareImport,
    method: 'post',
    data: parameter
  })
}

/* 知识分享错误数据下载 */
export function exportShareErrorRecords (parameter) {
  return axios({
    url: api.shareErrorDownload,
    method: 'get',
    params: parameter,
    responseType: 'arraybuffer'
  })
}

/* 知识学习错误数据下载 */
export function exportLearnErrorRecords (parameter) {
  return axios({
    url: api.learnErrorDownload,
    method: 'get',
    params: parameter,
    responseType: 'arraybuffer'
  })
}

/* 知识学习批量删除 */
export function doDeleteLearnData(parameter) {
  return axios({
    url: api.learnDelete,
    method: 'delete',
    params: { deletes: parameter.deletes },
  })
}

/* 知识分享批量删除 */
export function doDeleteShareData(parameter) {
  return axios({
    url: api.shareDelete,
    method: 'delete',
    params: { deletes: parameter.deletes },
  })
}