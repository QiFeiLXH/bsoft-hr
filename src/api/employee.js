import { axios } from '@/utils/request'

const api = {
  getRecruitmentInfoList: '/recruitmentinfo/getrecruitmentinfolist',
  getRecruitmentAuditInfo: '/recruitmentinfo/getrecruitmentauditinfo',
  initRecruitmentBaseInfo: '/recruitmentinfo/initrecruitmentbaseinfo',
  initRecruitmentAuditInfo: '/recruitmentinfo/initrecruitmentauditinfo',
  getArea: '/recruitmentinfo/getarea',
  saveRecruitmentBaseInfo: '/recruitmentinfo/saverecruitmentbaseinfo',
  saveRecruitmentAuditInfo: '/recruitmentinfo/saverecruitmentauditinfo',
  deleteFamily: '/recruitmentinfo/deletefamily',
  saveFamily: '/recruitmentinfo/savefamily',
  getFamilyList: '/recruitmentinfo/familylist',
  saveWork: '/recruitmentinfo/savework',
  deleteWork: '/recruitmentinfo/deletework',
  getWorkList: '/recruitmentinfo/worklist',
  saveEducation: '/recruitmentinfo/saveeducation',
  deleteEducation: '/recruitmentinfo/deleteeducation',
  getEducationList: '/recruitmentinfo/educationlist',

  deleteRecruitmentInfo: '/recruitmentinfo/deleterecruitmentinfo',
  sendRecruitmentEmail: '/recruitmentinfo/sendrecruitmentemail',
  showImage: '/recruitmentinfo/showimage',
  getOldArea: '/recruitmentinfo/getoldarea',
  getOneOldArea: '/recruitmentinfo/getoneoldarea',
  getSchool: '/recruitmentinfo/getschool',
  getMajor: '/recruitmentinfo/getmajor',
  getRecruitmentInfo: '/recruitmentinfo/getrecruitmentinfo',
  getHumanDic: '/recruitmentinfo/gethumandic',
  getPublicDic: '/recruitmentinfo/getpublicdic',
  getSubsidy: '/recruitmentinfo/getsubsidy',
  getWorkYears: '/recruitmentinfo/getworkyears',
  getPersonnelGroupDic: '/recruitmentinfo/getPersonnelGroupDic',
  getCompanyDic: '/recruitmentinfo/getcompanydic',
  doBack: '/recruitmentinfo/doback',
  imageRewrite: '/recruitmentinfo/imagerewrite',
  imageUpload: '/recruitmentinfo/imagereupload',
  batchAudit: '/recruitmentinfo/batchaudit'
}

export function rewriteImage (parameter) {
  return axios({
    url: api.imageRewrite,
    method: 'post',
    data: parameter
  })
}

export function uploadImage (parameter) {
  return axios({
    url: api.imageUpload,
    method: 'post',
    data: parameter
  })
}

export function getSchool (parameter) {
  return axios({
    url: api.getSchool,
    method: 'get',
    params: parameter
  })
}

export function doBack (parameter) {
  return axios({
    url: api.doBack,
    method: 'get',
    params: parameter
  })
}

export function getSubsidy (parameter) {
  return axios({
    url: api.getSubsidy,
    method: 'get',
    params: parameter
  })
}

export function getWorkYears (parameter) {
  return axios({
    url: api.getWorkYears,
    method: 'get',
    params: parameter
  })
}

export function getHumanDic (parameter) {
  return axios({
    url: api.getHumanDic,
    method: 'get',
    params: parameter
  })
}

export function getPublicDic (parameter) {
  return axios({
    url: api.getPublicDic,
    method: 'get',
    params: parameter
  })
}

export function getCompanyDic (parameter) {
  return axios({
    url: api.getCompanyDic,
    method: 'get',
    params: parameter
  })
}

export function getMajor (parameter) {
  return axios({
    url: api.getMajor,
    method: 'get',
    params: parameter
  })
}

export function getRecruitmentInfoList (parameter) {
  return axios({
    url: api.getRecruitmentInfoList,
    method: 'get',
    params: parameter,
  })
}

export function getRecruitmentInfo (parameter) {
  return axios({
    url: api.getRecruitmentInfo,
    method: 'get',
    params: parameter
  })
}

export function getRecruitmentAuditInfo (parameter) {
  return axios({
    url: api.getRecruitmentAuditInfo,
    method: 'get',
    params: parameter
  })
}

export function initRecruitmentBaseInfo (parameter) {
  return axios({
    url: api.initRecruitmentBaseInfo,
    method: 'get',
    params: parameter
  })
}

export function initRecruitmentAuditInfo (parameter) {
  return axios({
    url: api.initRecruitmentAuditInfo,
    method: 'get',
    params: parameter
  })
}

export function getArea (parameter) {
  return axios({
    url: api.getArea,
    method: 'get',
    params: parameter
  })
}

export function saveRecruitmentBaseInfo (parameter) {
  return axios({
    url: api.saveRecruitmentBaseInfo,
    method: 'post',
    data: parameter
  })
}

export function saveRecruitmentAuditInfo (parameter) {
  return axios({
    url: api.saveRecruitmentAuditInfo,
    method: 'post',
    data: parameter
  })
}

export function sendRecruitmentEmail (parameter) {
  return axios({
    url: api.sendRecruitmentEmail,
    method: 'put',
    data: parameter
  })
}

export function saveFamily (parameter) {
  return axios({
    url: api.saveFamily,
    method: 'post',
    data: parameter
  })
}

export function saveEducation (parameter) {
  return axios({
    url: api.saveEducation,
    method: 'post',
    data: parameter
  })
}

export function saveWork (parameter) {
  return axios({
    url: api.saveWork,
    method: 'post',
    data: parameter
  })
}
export function getFamilyList (parameter) {
  return axios({
    url: api.getFamilyList,
    method: 'get',
    params: parameter
  })
}

export function getWorkList (parameter) {
  return axios({
    url: api.getWorkList,
    method: 'get',
    params: parameter
  })
}

export function getEducationList (parameter) {
  return axios({
    url: api.getEducationList,
    method: 'get',
    params: parameter
  })
}

export function deleteFamily (parameter) {
  return axios({
    url: api.deleteFamily,
    method: 'delete',
    params: parameter
  })
}

export function deleteWork (parameter) {
  return axios({
    url: api.deleteWork,
    method: 'delete',
    params: parameter
  })
}

export function deleteEducation (parameter) {
  return axios({
    url: api.deleteEducation,
    method: 'delete',
    params: parameter
  })
}

export function deleteRecruitmentInfo (parameter) {
  return axios({
    url: api.deleteRecruitmentInfo,
    method: 'delete',
    params: parameter
  })
}

export function showImage (parameter) {
  return axios({
    url: api.showImage,
    method: 'get',
    params: parameter
  })
}

export function getOldArea (parameter) {
  return axios({
    url: api.getOldArea,
    method: 'get',
    params: parameter
  })
}

export function getOneOldArea (parameter) {
  return axios({
    url: api.getOneOldArea,
    method: 'get',
    params: parameter
  })
}

export function getPersonnelGroupDic (parameter) {
  return axios({
    url: api.getPersonnelGroupDic,
    method: 'get',
    params: parameter
  })
}

export function doBatchHeadquartersAudit (parameter) {
  return axios({
    url: api.batchAudit,
    method: 'get',
    params: parameter,
  })
}
