<template>
  <a-card :bordered="false" :bodyStyle="{ height: '1500px', padding: '0px 10px' }">

    <a-row>
      <a-col style="margin: 10px 0">
        <span style="margin-right:15px">年份：</span>
        <a-input-number v-model="queryParam.year"
                        @change="handleYearChange"/>
        <a-button type="primary" icon="search" @click="handleButtonSearch" style="margin-left: 20px">查询</a-button>
      </a-col>
    </a-row>

    <a-row :gutter="8">
      <a-col>
        <a-table :columns="personalColumn"
                 :dataSource="personalData"
                 :pagination="paginationPersonal"
                 :loading="personalLoading"
                 :row-key="record => record.id"
                 @change="handlePersonalTableChange"
                 :scroll="{ x: false, y: tableHeight  }"
                 :bodyStyle="{ height: tableHeight   + 'px' }"
                 v-watermark
                 size="small">
          <template slot="rowIndex" slot-scope="text, record, index">
            <span> {{ (paginationPersonal.current - 1) * paginationPersonal.pageSize + index + 1 }} </span>
          </template>
          <template slot="workDate" slot-scope="text, record">
            <span v-if="record.workStartDate != null"> {{ record.workStartDate + ' ~ ' + record.workEndDate }} </span>
          </template>
          <template slot="workType" slot-scope="text, record">
            <template v-if="text === 1 || text === 2">
              <span>{{ text | typeFilter }}</span>
            </template>
          </template>
          <template slot="remark" slot-scope="text, record">
            <a-tooltip>
              <template slot="title">{{record.remark}}</template>
              {{text}}
            </a-tooltip>
          </template>
          <template slot="auditFlag" slot-scope="text, record">
            <template v-if="text === 0 || text === 1">
              <a-badge :status="text | auditStatusFilter" :text="text | auditTextFilter"/>
            </template>
          </template>
        </a-table>
      </a-col>
    </a-row>

  </a-card>

</template>

<script>
  const typeMap = {
    1: { text: '工作日' },
    2: { text: '周末' },
  }
  const auditMap = {
    0: { status: 'default',  text: '未审' },
    1: { status: 'success',  text: '已审' },
  }
  import { queryVacationTotalMine, queryVacationMine } from '@/api/personalworkvacation'
  import { DeptSelect } from '@/components'
  import moment from "moment";
  export default {
    name: "WorkVacationMineView",
    components: { DeptSelect },
    data() {
      return {
        tableHeight: 0,
        personalLoading: false,
        queryParam: { year: null, deptId: null,personId: null, personName: null,},
        paginationPersonal: { current: 1, pageSize: 25, total: 0,},
        personalData: [],
        personalColumn: [
          {
            title: '序号',
            dataIndex:'rowIndex',
            width:'5%',
            align: 'center',
            scopedSlots: { customRender: 'rowIndex' },
          },
          {
            title: '加班日期',
            dataIndex:'createDate',
            width:'10%',
            align: 'center',
          },
          {
            title: '加班时间',
            dataIndex:'workDate',
            width:'10%',
            align: 'center',
            scopedSlots: { customRender: 'workDate' },
          },
          {
            title: '时长(小时)',
            dataIndex:'workTimes',
            width:'10%',
            align: 'center',
          },
          {
            title: '类型',
            dataIndex:'workType',
            width:'10%',
            align: 'center',
            scopedSlots: { customRender: 'workType' },
          },
          {
            title: '加班原因',
            dataIndex:'remark',
            width:'35%',
            align: 'center',
            ellipsis: true,
            scopedSlots: { customRender: 'remark' },
          },
          {
            title: 'OA流水号',
            dataIndex:'lshid',
            width:'10%',
            align: 'center',
          },
          {
            title: '审核情况',
            dataIndex:'auditFlag',
            width:'10%',
            align: 'center',
            scopedSlots: { customRender: 'auditFlag' },
          },
        ],

      }
    },
    created(){
      this.initPage();
    },
    filters: {
      typeFilter (val) {
        return typeMap[val].text
      },
      auditTextFilter (val) {
        return auditMap[val].text
      },
      auditStatusFilter (val) {
        return auditMap[val].status
      }
    },
    methods:{
      initPage(){
        this.tableHeight = window.innerHeight - 260
        const today = moment()
        this.queryParam.year = moment(today).format("YYYY").toString()
        this.queryParam.startDate = moment(today).startOf('year').format("YYYY-MM-DD HH-mm-ss").toString()
        this.queryParam.endDate = moment(today).endOf('year').format("YYYY-MM-DD HH-mm-ss").toString()
        //this.doQueryVacationTotal()
        this.doQueryVacationPersonal()
      },
      doQueryVacationTotal() {
        const params = {
          year: this.queryParam.year,
          personId: this.queryParam.personId,
          pageNo: 1,
          pageSize: this.paginationPersonal.pageSize,
        }
        this.workTimes = 0
        this.useTimes = 0
        this.restTimes = 0
        queryVacationTotalMine(params).then(res => {
          const totalData = res.body.items
          if(totalData.length != 0){
            totalData.forEach(item => {
              this.workTimes += item.workTimes
              this.useTimes += item.useTimes
              this.restTimes += item.restTimes
            })
          }
        })
      },
      doQueryVacationPersonal() {
        const params = {
          startDate: this.queryParam.startDate,
          endDate: this.queryParam.endDate,
          personId: this.queryParam.personId,
          pageNo: this.paginationPersonal.current,
          pageSize: this.paginationPersonal.pageSize
        }
        this.personalLoading = true
        queryVacationMine(params).then(res => {
          this.personalLoading = false
          this.paginationPersonal.total = res.body.totalCount
          this.personalData = res.body.items;
        })
      },
      handleYearChange(value) {
        this.queryParam.year = value
        this.queryParam.startDate = moment().year(value).startOf('year').format("YYYY-MM-DD HH-mm-ss").toString()
        this.queryParam.endDate = moment().year(value).endOf('year').format("YYYY-MM-DD HH-mm-ss").toString()
        this.paginationPersonal.current = 1
        //this.doQueryVacationTotal()
        this.doQueryVacationPersonal()
      },
      handleButtonSearch(){
        this.paginationPersonal.current = 1
        //this.doQueryVacationTotal()
        this.doQueryVacationPersonal()
      },
      handlePersonalTableChange(pagination) {
        this.paginationPersonal.current = pagination.current
        this.paginationPersonal.pageSize = pagination.pageSize
        this.doQueryVacationPersonal()
      }
    },
  }
</script>

<style scoped>

</style>