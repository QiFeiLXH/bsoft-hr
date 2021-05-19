import { axios } from '@/utils/request'

const api = {
  personalTrainQuery: '/personaltrain/query',

}

/* 个人培训情况查询 */
export function doLoadPersonalTrainList (parameter) {
  return axios({
    url: api.personalTrainQuery,
    method: 'get',
    params: parameter
  })
}
