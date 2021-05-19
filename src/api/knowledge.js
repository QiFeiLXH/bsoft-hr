import { axios } from '@/utils/request'

const api = {
  knowledgeNumQuery: '/knowledge/numberquery',
  knowledgeQuery: '/knowledge/query',
  knowledgeDownload: '/knowledge/knowledgedownload',

}

/* 知识贡献数量查询 */
export function doLoadPersonalKnowledgeNumList (parameter) {
  return axios({
    url: api.knowledgeNumQuery,
    method: 'get',
    params: parameter
  })
}

/*  个人知识贡献查询 */
export function doLoadPersonalKnowledgeList (parameter) {
  return axios({
    url: api.knowledgeQuery,
    method: 'get',
    params: parameter
  })
}

/* 知识贡献下载 */
export function downloadEnclosure (parameter) {
  return axios({
    url: api.knowledgeDownload,
    method: 'get',
    params: parameter,
    responseType: 'arraybuffer'
  })
}