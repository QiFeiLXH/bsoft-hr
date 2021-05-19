import { axios } from '@/utils/request'

const api = {
  getPostAndCostRuleList: '/personfinancialtotal/getpostandcostrulelist',
  getCostList: '/personfinancialtotal/getcostlist',
  getFinanceList:'/personfinancialtotal/getfinanceList',
  updatePostAndCostRule:'/personfinancialtotal/updatepostandcostrule',
  deletePostAndCostRule:'/personfinancialtotal/deletepostandcostrule'
}

/* 获取全部岗位费用默认规则列表 */
export function getPostAndCostRuleList (parameter) {
  return axios({
    url: api.getPostAndCostRuleList,
    method: 'get',
    params: parameter
  })
}


/* 获取费用类别列表 */
export function getCostList (parameter) {
  return axios({
    url: api.getCostList,
    method: 'get',
    params: parameter
  })
}


/* 获取财务类别列表 */
export function getFinanceList (parameter) {
  return axios({
    url: api.getFinanceList,
    method: 'get',
    params: parameter
  })
}



/* 修改岗位费用默认规则类别 */
export function updatePostAndCostRule (parameter) {
  return axios({
    url: api.updatePostAndCostRule,
    method: 'post',
    data: parameter
  })
}

/* 删除岗位费用默认规则管理 */
export function deletePostAndCostRule (parameter) {
  return axios({
    url: api.deletePostAndCostRule,
    method: 'get',
    params: parameter
  })
}


