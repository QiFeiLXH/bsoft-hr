<template>
  <a-card :bordered="false" :bodyStyle="{ height: '2000px', padding: '0px 10px' }">

    <a-row>
      <a-col style="margin: 10px 0">
        <span style="margin-right: 15px">年份：</span>
        <a-input-number v-model="queryParam.year"
                        @change="handleYearChange"/>

        <dept-select v-model="queryParam.deptId"
                     @change="handleDeptChange"
                     placeholder="按部门查询"
                     style="width:150px; margin-left: 20px">
        </dept-select>

        <a-input-search v-model="queryParam.personName"
                        @search="doQueryVacationTotal"
                        @pressEnter="doQueryVacationTotal"
                        :allowClear="true"
                        placeholder="请输入姓名或拼音简码查询"
                        style="width: 250px; margin-left: 20px">
        </a-input-search>

        <a-button type="primary" icon="search" @click="handleButtonClick" style="margin-left: 20px">查询</a-button>
      </a-col>
    </a-row>

    <a-row :gutter="8">
      <a-col span="10">
        <a-table :columns="totalColumn"
                 :dataSource="totalData"
                 :pagination="paginationTotal"
                 :rowKey="record => record.personId + record.deptName"
                 :loading="totalLoading"
                 :rowClassName="setRowClassName"
                 :customRow="rowClick"
                 @change="handleTotalTableChange"
                 :scroll="{ x: false, y: tableHeight }"
                 :bodyStyle="{ height: tableHeight + 'px' }"
                 v-watermark
                 size="small">
          <template slot="rowIndex" slot-scope="text, record, index">
            <span> {{ (paginationTotal.current - 1) * paginationTotal.pageSize + index + 1 }} </span>
          </template>
          <template slot="deptName" slot-scope="text, record">
            <a-tooltip>
              <template slot="title">{{record.deptName}}</template>
              {{text}}
            </a-tooltip>
          </template>
          <template slot="workTimes" slot-scope="text, record">
            <span v-if="record.workTimes >= 8">{{ parseInt(record.workTimes/8) + '天' }}</span>
            <span v-if="record.workTimes%8 != 0">{{ record.workTimes%8 + '小时' }}</span>
          </template>
          <template slot="useTimes" slot-scope="text, record">
            <span v-if="record.useTimes >= 8">{{ parseInt(record.useTimes/8) + '天' }}</span>
            <span v-if="record.useTimes%8 != 0">{{ record.useTimes%8 + '小时' }}</span>
          </template>
          <template slot="restTimes" slot-scope="text, record">
            <span v-if="record.restTimes >= 8">{{ parseInt(record.restTimes/8) + '天' }}</span>
            <span v-if="record.restTimes%8 != 0">{{ record.restTimes%8 + '小时' }}</span>
          </template>
        </a-table>
      </a-col>
      <a-col span="14">
        <a-table :columns="personalColumn"
                 :dataSource="personalData"
                 :pagination="paginationPersonal"
                 :loading="personalLoading"
                 :rowKey="record => record.id"
                 @change="handlePersonalTableChange"
                 :scroll="{ x: false, y: tableHeight }"
                 :bodyStyle="{ height: tableHeight + 'px' }"
                 v-watermark
                 size="small">
          <template slot="rowIndex" slot-scope="text, record, index">
            <span style="margin: auto"> {{ (paginationPersonal.current - 1) * paginationPersonal.pageSize + index + 1 }} </span>
          </template>
          <template slot="workDate" slot-scope="text, record">
            <span v-if="record.workStartDate != null">{{ record.workStartDate + " ~ " + record.workEndDate }}</span>
          </template>
          <template slot="workType" slot-scope="text, record">
            <template v-if="text === 1 || text === 2">
              <span>{{ text | typeFilter }}</span>
            </template>
          </template>
          <template slot="remark" slot-scope="text, record">
            <a-tooltip>
              <template slot="title">{{ text }}</template>
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
  import { queryVacationTotal, queryVacationPersonal } from '@/api/workvacation'
  import { DeptSelect } from '@/components'
  import moment from 'moment/moment'
  export default {
    name: "WorkVacationView",
    components: { DeptSelect },
    data() {
      return {
        tableHeight: 0,
        totalLoading: false,
        personalLoading: false,
        queryParamPersonal: { personId: null, dept: null },
        queryParam: { year: null, deptId: null, personId: null, personName: null, deptIdPersonal: null, startDate: null, endDate: null },
        paginationTotal: { current: 1, pageSize: 25, total: 0,},
        paginationPersonal: { current: 1, pageSize: 25, total: 0,},
        totalData: [],
        personalData: [],
        totalColumn: [
          {
            title: '序号',
            dataIndex:'rowIndex',
            width:'10%',
            align: 'center',
            scopedSlots: { customRender: 'rowIndex' },
          },
          {
            title: '姓名',
            dataIndex:'personName',
            width:'15%',
            align: 'center',
          },
          {
            title: '部门',
            dataIndex:'deptName',
            ellipsis: true,
            width:'15%',
            align: 'center',
            scopedSlots: { customRender: 'deptName' },
          },
          {
            title: '总加班天数',
            dataIndex:'workTimes',
            width:'20%',
            align: 'center',
            scopedSlots: { customRender: 'workTimes' },
          },
          {
            title: '已用天数',
            dataIndex:'useTimes',
            width:'20%',
            align: 'center',
            scopedSlots: { customRender: 'useTimes' },
          },
          {
            title: '剩余天数',
            dataIndex:'restTimes',
            width:'20%',
            align: 'center',
            scopedSlots: { customRender: 'restTimes' },
          },
        ],
        personalColumn: [
          {
            title: '序号',
            dataIndex:'rowIndex',
            width:'7%',
            align: 'center',
            scopedSlots: { customRender: 'rowIndex' },
          },
          {
            title: '加班日期',
            dataIndex:'createDate',
            width:'14%',
            align: 'center',
          },
          {
            title: '加班时间',
            dataIndex:'workDate',
            width:'16%',
            align: 'center',
            scopedSlots: { customRender: 'workDate' },
          },
          {
            title: '时长(小时)',
            dataIndex:'workTimes',
            width:'12%',
            align: 'center',
          },
          {
            title: '类型',
            dataIndex:'workType',
            width:'9%',
            align: 'center',
            scopedSlots: { customRender: 'workType' },
          },
          {
            title: '加班原因',
            dataIndex:'remark',
            ellipsis: true,
            width:'19%',
            align: 'center',
            scopedSlots: { customRender: 'remark' },
          },
          {
            title: 'OA流水号',
            dataIndex:'lshid',
            width:'12%',
            align: 'center',
          },
          {
            title: '审核情况',
            dataIndex:'auditFlag',
            width:'11%',
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
        this.doQueryVacationTotal()
      },
      doQueryVacationTotal() {
        const params = {
          year: this.queryParam.year,
          deptId: this.queryParam.deptId,
          personName: this.queryParam.personName,
          pageNo: this.paginationTotal.current,
          pageSize: this.paginationTotal.pageSize
        }
        this.personalData = []
        this.totalLoading = true
        queryVacationTotal(params).then(res => {
          this.totalLoading = false
          this.paginationTotal.total = res.body.totalCount
          this.totalData = res.body.items

        })
      },
      doQueryVacationPersonal() {
        const params = {
          personId: this.queryParam.personId,
          deptId: this.queryParam.deptIdPersonal,
          startDate: this.queryParam.startDate,
          endDate: this.queryParam.endDate,
          pageNo: this.paginationPersonal.current,
          pageSize: this.paginationPersonal.pageSize
        }
        this.personalLoading = true
        queryVacationPersonal(params).then(res => {
          this.personalLoading = false
          this.paginationPersonal.total = res.body.totalCount
          this.personalData = res.body.items
        })
      },
      handleYearChange(value) {
        this.queryParam.year = value
        this.queryParam.startDate = moment().year(value).startOf('year').format("YYYY-MM-DD HH-mm-ss").toString()
        this.queryParam.endDate = moment().year(value).endOf('year').format("YYYY-MM-DD HH-mm-ss").toString()
        this.queryParam.personName = null
        this.paginationTotal.current = 1
        this.doQueryVacationTotal()
      },
      handleDeptChange(value) {
        this.queryParam.deptId = value
        this.queryParam.personName = null
        this.paginationTotal.current = 1
        this.doQueryVacationTotal()
      },
      handleButtonClick(){
        this.paginationTotal.current = 1
        this.doQueryVacationTotal()
      },
      handleTotalTableChange(pagination){
        this.paginationTotal.current = pagination.current
        this.paginationTotal.pageSize = pagination.pageSize
        this.doQueryVacationTotal()
      },
      handlePersonalTableChange(pagination){
        this.paginationPersonal.current = pagination.current
        this.paginationPersonal.pageSize = pagination.pageSize
        this.doQueryVacationPersonal()
      },
      setRowClassName (record) {
        let isSelected = false
        if (record.personId === this.queryParamPersonal.personId) {
          if (record.deptId === this.queryParamPersonal.dept) {
            isSelected = true
          }
        }
        return  isSelected ? 'clickRowStyle' : ''
      },
      rowClick(record){
        return {
          on: {
            dblclick: ()=> {
              this.queryParam.personId = record.personId
              this.queryParam.deptIdPersonal = record.deptId
              this.queryParamPersonal.personId = record.personId
              this.queryParamPersonal.dept = record.deptId
              this.doQueryVacationPersonal()
            },
          }
        }
      },
    },
  }
</script>

<style scoped>
  /deep/ .clickRowStyle {
    background-color: #e8f7ff;
    color: #1890FF
  }

</style>