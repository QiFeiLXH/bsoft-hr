import { axios } from '@/utils/request'

const api = {
  certificateNumQuery: '/certificate/numberquery',
  certificateQuery: '/certificate/query',

  certOriginalScriptQuery: '/certificate/origin/query',
  certOriginalScriptAudit: '/certificate/origin/audit',
  certOriginalScriptSave: '/certificate/origin/save',
  certOriginalScriptUpdate: '/certificate/origin/update',
  certTypeQuery: '/certificate/origin/type'
}

/* 工作证书数量查询 */
export function doLoadPersonalCertificateNumList (parameter) {
  return axios({
    url: api.certificateNumQuery,
    method: 'get',
    params: parameter
  })
}

/* 个人工作证书查询 */
export function doLoadPersonalCertificateList (parameter) {
  return axios({
    url: api.certificateQuery,
    method: 'get',
    params: parameter
  })
}

/* 查询证书原件 */
export function certOriginalScriptQuery (parameter) {
  return axios({
    url: api.certOriginalScriptQuery,
    method: 'get',
    params: parameter
  })
}

/* 根据名字获取 */
export function certOriginalScriptAudit (parameter) {
  return axios({
    url: api.certOriginalScriptAudit,
    method: 'get',
    params: parameter
  })
}

/* 新增证书原件 */
export function certOriginalScriptSave (parameter) {
  return axios({
    url: api.certOriginalScriptSave,
    method: 'POST',
    data: parameter
  })
}

/* 修改证书原件 */
export function certOriginalScriptUpdate (parameter) {
  return axios({
    url: api.certOriginalScriptUpdate,
    method: 'POST',
    data: parameter
  })
}

/* 查询证书类别 */
export function certTypeQuery (parameter) {
  return axios({
    url: api.certTypeQuery,
    method: 'get',
    params: parameter
  })
}
