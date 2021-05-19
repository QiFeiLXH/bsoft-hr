<template>
  <a-card :bordered="false" :bodyStyle="{ height: '2000px', padding: '0px 10px' }">

    <a-row :gutter="8">
      <a-col :span="12">
        <!--筛选框-->
        <a-card :bordered="false" :bodyStyle="{ height: '50px', padding: '10px 0' }">
          <span style="margin-right: 10px;">年份：</span>
          <a-input-number v-model="queryParam.trainYear" @change="handleYearChange"/>
          <span style="margin-left: 15px;">部门类别：</span>
          <a-dropdown>
            <a class="ant-dropdown-link" @click="e => e.preventDefault()">
              {{ departmentName }}<a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item v-for="record in departmentList" :key="record.id">
                <a href="javascript:;" @click="chooseDepartment(record)"> {{ record.name }} </a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          <span style="margin-left: 15px;">培训类型：</span>
          <a-dropdown>
            <a class="ant-dropdown-link" @click="e => e.preventDefault()">
              {{ trainTypeName }}<a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item v-for="record in trainTypeList" :key="record.id">
                <a href="javascript:;" @click="chooseTrainType(record)"> {{ record.name }} </a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </a-card>
        <!--饼图-->
        <div ref="chart" style="width: 100%; height: 500px; margin: auto"></div>
      </a-col>

      <a-col :span="12">
        <!--表格-->
        <a-card :bordered="false" :bodyStyle="{ height: tableHeight + 'px', padding: '0', margin: '50px' }">
          <a-table :columns="column"
                   :data-source="data"
                   :pagination="pagination"
                   :loading="loading"
                   :row-key="record => record.department"
                   :scroll="{ x: false, y: tableHeight }"
                   :bodyStyle="{ height: tableHeight + 'px' }"
                   @change="handleTableChange"
                   size="small">
            <template slot="rowIndex" slot-scope="text, record, index">
              <span style="margin: auto"> {{ (pagination.current - 1) * pagination.pageSize + index + 1 }} </span>
            </template>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
  import { getTrainReportList } from '@/api/trainreport'
  export default {
    name: "TrainReportView",
    data() {
      return {
        tableHeight: 0,
        loading: false,
        queryParam: {trainYear:2020, departmentType: 1, trainType: 2},
        pagination: {
          current: 1,
          pageSize: 25,
          total: 1,
          /*showTotal: total => `共有 ${total} 条数据`,*/
        },
        trainTypeName: '在职培训',
        trainTypeList: [
          {id: 1, name: '新员工培训'},
          {id: 2, name: '在职培训'},
        ],
        departmentName:'行政职能',
        departmentList:[
          { id: 1, name: "行政职能" },
          { id: 2, name: "大区" },
          {id: 3, name: "事业部" },
          {id: 4, name: "其他" },
        ],
        column: [
          {
            title: '序号',
            dataIndex:'rowIndex',
            width:'15%',
            align: 'center',
            scopedSlots: { customRender: 'rowIndex' },
          },
          {
            title: '一级部门',
            dataIndex: 'department',
            key: 'department',
            align: 'center',
            width: '55%',
            ellipsis: true,
          },
          {
            title: '组织培训数量',
            dataIndex: 'attendCount',
            key: 'attendCount',
            align: 'center',
            width: '30%',

          },
        ],
        data: [],
        chartOption:{
          title: {
            text: '培训情况统计',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} 次 ({d}%)'
          },
          series: [
            {
              type: 'pie',
              label: {
                formatter: '{b} ({d}%)'
              },
              radius: '55%',
              center: ['50%', '50%'],
              data: [{name:'信息中心',value:'111'},{name:'浙闽大区',value:'222'}],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
      }
    },
    created() {
      this.initPage()
      this.trainReport()
    },
    mounted () {
      this.drawChart()
    },
    methods: {
      trainReport(){
        const param = {
          trainYear: this.queryParam.trainYear,
          departmentType: this.queryParam.departmentType,
          trainType: this.queryParam.trainType,
          pageNo: this.pagination.current,
          pageSize: this.pagination.pageSize
        }
        this.loading = true
        getTrainReportList(param).then(res =>{
          this.loading = false
          this.pagination.total = res.body.totalCount;
          this.data = res.body.items
        })
      },
      drawChart(){
        const myChart = this.$echarts.init(this.$refs.chart)
        const chartOption = this.chartOption
        const seriesData = []
        const param = {
          trainYear: this.queryParam.trainYear,
          departmentType: this.queryParam.departmentType,
          trainType: this.queryParam.trainType,
          pageNo: 1,
          pageSize: 10,
        }
        myChart.showLoading({
          text: 'loading',
          color: '#c23531',
          textColor: '#000',
          maskColor: 'rgba(255, 255, 255, 0.2)',
          zlevel: 0,
        })
        getTrainReportList(param).then(res =>{
          res.body.items.forEach( item => {
            seriesData.push({
              name: item.department,
              value: item.attendCount,
            })
          })
          chartOption.title.text = '年培训情况统计（' + this.queryParam.trainYear + '）'
          chartOption.series[0].data = seriesData
          myChart.hideLoading()
          myChart.setOption(chartOption)
        })
      },
      initPage() {
        this.tableHeight = window.innerHeight - 230 - 50
      },
      chooseDepartment(record) {
        this.departmentName = record.name
        this.queryParam.departmentType = record.id
        this.pagination.current = 1
        this.trainReport()
        this.drawChart()
      },
      chooseTrainType(record) {
        this.trainTypeName = record.name
        this.queryParam.trainType = record.id
        this.pagination.current = 1
        this.trainReport()
        this.drawChart()
      },
      handleYearChange(val) {
        this.queryParam.trainYear = val
        this.pagination.current = 1
        this.trainReport()
        this.drawChart()
      },
      handleTableChange(pagination){
        this.pagination.current = pagination.current;
        this.pagination.pageSize = pagination.pageSize;
        this.trainReport();
      },
      /*processResult(result){
        let temp = []
        let seriesDate = []
        let flag = 0
        result.forEach(item => {
          // 只加前十条数据
          if(flag < 10){
            if(temp.indexOf(item.department) === -1){
              temp.push(item.department)
              seriesDate.push({
                name: item.department,
                value: item.attendCount,
              } )
            }else{
              seriesDate.forEach(data => {
                if(data.name === item.department){
                  data.value += item.attendCount
                }
              })
            }
            flag++
          }
        })
        this.chartOption.title.text = '年培训情况统计（' + this.queryParam.trainYear + '）'
        this.chartOption.series[0].data = seriesDate
      },*/
    },
  }
</script>

<style scoped>

  .ant-table {
    height: 802px !important;
  }
</style>