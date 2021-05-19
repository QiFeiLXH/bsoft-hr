import { axios} from "@/utils/request";

const api = {
  query: "trainreport/query"
}

/* 培训情况查询 */
export function getTrainReportList (parameter) {
  return axios({
    url: api.query,
    method: 'POST',
    data: parameter
  })
}