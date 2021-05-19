import { axios } from '@/utils/request'

const api = {
  rankQuery: '/rank/query',
  rankDownload: '/rank/pptdownload',

}

/* 职级情况查询 */
export function doLoadRankList (parameter) {
  return axios({
    url: api.rankQuery,
    method: 'get',
    params: parameter
  })
}

/* 职级ppt下载 */
export function downloadPPTFile (parameter) {
  return axios({
    url: api.rankDownload,
    method: 'get',
    params: parameter,
    responseType: 'arraybuffer'
  })
}
