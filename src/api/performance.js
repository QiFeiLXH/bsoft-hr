import { axios } from '@/utils/request'

const api = {
  performanceQuery: '/performance/query',
  templateDownload: '/performance/templatedownload',
  performanceImport: '/performance/import',
  performanceDelete: '/performance/delete',
  performanceErrorDownload: '/performance/errordownload'

}
const qs = require('qs')

/* 年度绩效 绩效查询 */
export function doLoadPerformanceList (parameter) {
  return axios({
    url: api.performanceQuery,
    method: 'get',
    params: parameter
  })
}

/* 年度绩效 下载模板 */
export function exportTemplate (parameter) {
  return axios({
    url: api.templateDownload,
    method: 'get',
    params: parameter,
    responseType: 'arraybuffer'
  })
}

/* 年度绩效 导入数据 */
export function importPerformanceData(parameter) {
  return axios({
    url: api.performanceImport,
    method: 'post',
    data: parameter,
  })
}

/* 年度绩效 批量删除 */
export function doDeletePerformanceData(parameter) {
  return axios({
    url: api.performanceDelete,
    method: 'post',
    data: parameter,
  })
}

/* 年度绩效数据下载 */
export function exportPerformanceErrorRecords (parameter) {
  return axios({
    url: api.performanceErrorDownload,
    method: 'get',
    params: parameter,
    responseType: 'arraybuffer'
  })
}
