import { axios } from '@/utils/request'

const api = {
  queryVacationTotalMine: '/personalvacation/query/total/mine',
  queryVacationMine: '/personalvacation/query/mine'

}

export function queryVacationTotalMine (parameter) {
  return axios({
    url: api.queryVacationTotalMine,
    method: 'get',
    params: parameter
  })
}

export function queryVacationMine (parameter) {
  return axios({
    url: api.queryVacationMine,
    method: 'get',
    params: parameter
  })
}
