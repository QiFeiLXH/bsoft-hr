import { axios } from '@/utils/request'

const api = {
  selectWithDept: '/personfinancialtotal/selectWithDept',
  getDeptFinancialType:'/personfinancialtotal/getDeptFinancialType',
  listDeptForMaintainSelect: '/personfinancialtotal/listDeptForMaintainSelect',
  updateDeptInfoWithPage:'/personfinancialtotal/updateDeptInfoWithPage',
  updateDeptCost:'/personfinancialtotal/updateDeptCost',
  updatePostCost:'/personfinancialtotal/updatePostCost',
}

/* 查询部门下所有的岗位财务类别信息(按岗位) */
export function selectWithDept (parameter) {
  return axios({
    url: api.selectWithDept,
    method: 'get',
    params: parameter
  })
}


/* 查询部门下所有的岗位财务类别信息 （按部门）*/
export function getDeptFinancialType (parameter) {
  return axios({
    url: api.getDeptFinancialType,
    method: 'get',
    params: parameter
  })
}

/* 获取部门维护信息 */
export function listDeptForMaintainSelect (parameter) {
  return axios({
    url: api.listDeptForMaintainSelect,
    method: 'get',
    params: parameter
  })
}
/* 按部门更新财物类别信息(更新同时删除该部门下所有岗位的维护信息) */
export function updateDeptInfoWithPage (parameter) {
  return axios({
    url: api.updateDeptInfoWithPage,
    method: 'post',
    data: parameter
  })
}



/* 按部门更新财物类别信息(更新同时删除该部门下所有岗位的维护信息) */
export function updateDeptCost (parameter) {
  return axios({
    url: api.updateDeptCost,
    method: 'post',
    data: parameter
  })
}

/* 按照岗位更新财物类别信息 */
export function updatePostCost (parameter) {
  return axios({
    url: api.updatePostCost,
    method: 'post',
    data: parameter
  })
}



