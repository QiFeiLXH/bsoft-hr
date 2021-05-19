import { axios } from '@/utils/request'

const api = {

  getPersonFinancialViewlist: '/personfinancialtotal/getpersonfinancialviewlist',
  updatePersonFinancialview:'/personfinancialtotal/updatepersonfinancialview',
  getHrFeeRulesRecordList: '/hrfeerulesrecord/getlist',


}


/* 获取人员财务信息调整记录 */
export function getHrFeeRulesRecordList (parameter) {
  return axios({
    url: api.getHrFeeRulesRecordList,
    method: 'get',
    params: parameter
  })
}


/* 获取人员财物列表维护信息 */
export function getPersonFinancialViewlist (parameter) {
  return axios({
    url: api.getPersonFinancialViewlist,
    method: 'get',
    params: parameter
  })
}
/* 按人员更新财物类别信息(更新同时删除该部门下所有岗位的维护信息) */
export function updatePersonFinancialview (parameter) {
  return axios({
    url: api.updatePersonFinancialview,
    method: 'post',
    data: parameter
  })
}



