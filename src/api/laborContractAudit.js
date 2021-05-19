import { axios } from '@/utils/request'

const api = {
  getAuditList: '/laborcontractaudit/getlist',
  deptAudit: '/laborcontractaudit/deptaudit',
  areaAudit: '/laborcontractaudit/areaaudit',
  hrAudit: '/laborcontractaudit/hraudit',
  audit: '/laborcontractaudit/audit',
  getDetail: '/laborcontractaudit/getdetail',
  getCompany: '/laborcontractaudit/getcompanydic',
  getQuitList: '/laborcontractaudit/getquit',
  auditAll: '/laborcontractaudit/auditall',
  completeNotify: '/laborcontractaudit/completenotify',
  getFormRule: '/laborcontractaudit/formrule',

}

/* 待办审核列表 */
export function getAuditList (parameter) {
  return axios({
    url: api.getAuditList,
    method: 'post',
    data: parameter
  })
}


/* 部门审核 */
export function deptAudit (parameter) {
  return axios({
    url: api.deptAudit,
    method: 'post',
    data: parameter
  })
}



/* 行政总监审核 */
export function areaAudit (parameter) {
  return axios({
    url: api.areaAudit,
    method: 'post',
    data: parameter
  })
}


/* 人事审核 */
export function hrAudit (parameter) {
  return axios({
    url: api.hrAudit,
    method: 'post',
    data: parameter
  })
}

/* 审核 */
export function audit (parameter) {
  return axios({
    url: api.audit,
    method: 'post',
    data: parameter
  })
}
/* 审核全部 */
export function auditAll (parameter) {
  return axios({
    url: api.auditAll,
    method: 'post',
    data: parameter
  })
}

/*查询任务节点对应表单权限*/
export function getDetail (parameter) {
  return axios({
    url: api.getDetail,
    method: 'get',
    params: parameter
  })
}

/*查询社保缴纳单位*/
export function getCompany (parameter) {
  return axios({
    url: api.getCompany,
    method: 'get',
    params: parameter
  })
}

/*查询离职单*/
export function getQuitList (parameter) {
  return axios({
    url: api.getQuitList,
    method: 'get',
    params: parameter
  })
}

/*完成知会*/
export function completeNotify (parameter) {
  return axios({
    url: api.completeNotify,
    method: 'get',
    params: parameter
  })
}

/**获取流程正在使用表单*/
export function getFormRule (parameter) {
  return axios({
    url: api.getFormRule,
    method: 'get',
    params: parameter
  })
}