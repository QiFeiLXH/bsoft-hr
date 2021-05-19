<template>
  <a-card
    :bordered="false"
    :bodyStyle="{
      height:cardHeight+'px',
      padding: '0px 10px'
    }">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row style="margin-bottom: 10px;margin-top:10px;">
          <a-col>
            <span style="margin-right:15px">年份：</span>
            <a-input-number v-model="queryParam.year" @change="handleYearChange"/>
            <a-button type="primary" icon="search" @click="doQueryVacation" style="margin-left: 30px">查询</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table
      v-watermark
      ref="table"
      size="small"
      :rowKey="(record) => record.type"
      :columns="leaveColumns"
      :height="tableHeight"
      :data="loadTableList"
      :customRow="onClickRow"
      :rowClassName="setCurrentRow"
      :showSizeChanger="false"
      :pageSize="pagination.pageSize"
      :pageNum="pagination.pageNumber"
      :showPagination="true"
      :isMybatis="true"
      :bodyStyle="{ minHeight:listScrollHeight+'px' }"
      :scroll="{ x: false, y: listScrollHeight }"
    >
      <template slot="rowIndex" slot-scope="text, record, index">
        <span>
          {{ (pagination.pageNumber - 1) * pagination.pageSize + index + 1 }}
        </span>
      </template>
      <template slot="lastYearDaysLeft" slot-scope="text, record">
        <!--当今年与历年都有数据时-->
        <span v-if="text > 0 && record.currentYearDays > 0">
          <!-- 当总天数大于等于1 -->
          <span v-if="(text + record.currentYearDays) >= 1">
            <!--当总天数不是整数-->
            <span v-if="(text + record.currentYearDays)%1 > 0">{{ (text + record.currentYearDays) - (text + record.currentYearDays)%1 }}天{{ ((text + record.currentYearDays)%1)*8 }}小时</span>
            <!--当总天数刚好是整数-->
            <span v-else>{{ text + record.currentYearDays }}天</span>
          </span>
          <!--当总天数大于0小于1-->
          <span v-if="(text + record.currentYearDays) > 0 && (text + record.currentYearDays) < 1">
            <span>{{ (text + record.currentYearDays)*8 }}小时</span>
          </span>
          <!--拼接历年剩余天数-->
          <!--当历年天数不是整数时-->
          <span v-if="text%1 > 0">({{ text - text%1 }}天{{ (text%1)*8 }}小时)</span>
          <!--当历年天数是整数-->
          <span v-else>({{ text }}天)</span>
        </span>
        <span v-else-if="text > 0 || record.currentYearDays > 0">
          <!-- 当总天数大于等于1 -->
          <span v-if="(text + record.currentYearDays) >= 1">
            <!--当总天数不是整数-->
            <span v-if="(text + record.currentYearDays)%1 > 0">{{ (text + record.currentYearDays) - (text + record.currentYearDays)%1 }}天{{ ((text + record.currentYearDays)%1)*8 }}小时</span>
            <!--当总天数刚好是整数-->
            <span v-else>{{ text + record.currentYearDays }}天</span>
          </span>
          <!--当总天数大于0小于1-->
          <span v-if="(text + record.currentYearDays) > 0 && (text + record.currentYearDays) < 1">
            <span>{{ (text + record.currentYearDays)*8 }}小时</span>
          </span>
        </span>
      </template>
      <template slot="type" slot-scope="text">
        <span>{{ text | typeFilter }}</span>
      </template>
      <template slot="currentYearDaysUsed" slot-scope="text">
        <span v-if="text >= 1">
          <span v-if="text%1 > 0">{{ text - text%1 }}天{{ (text%1)*8 }}小时</span>
          <span v-else>{{ text - text%1 }}天</span>
        </span>
        <span v-if="text > 0 && text < 1">
          <span>{{ text*8 }}小时</span>
        </span>
      </template>
      <template slot="totalDaysLeft" slot-scope="text">
        <span v-if="text >= 1">
          <span v-if="text%1 > 0" style="font-weight:bold">{{ text - text%1 }}天{{ (text%1)*8 }}小时</span>
          <span v-else style="font-weight:bold">{{ text - text%1 }}天</span>
        </span>
        <span v-if="text > 0 && text < 1">
          <span style="font-weight:bold">{{ text*8 }}小时</span>
        </span>
      </template>
      <template slot="expiringDays" slot-scope="text">
        <span v-if="text >= 1">
          <span v-if="text%1 > 0">其中{{ text - text%1 }}天{{ (text%1)*8 }}小时将在{{ expiredDay }}日后过期</span>
          <span v-else>其中{{ text - text%1 }}天将在{{ expiredDay }}日后过期</span>
        </span>
        <span v-if="text > 0 && text < 1">
          <span>其中{{ text*8 }}小时将在{{ expiredDay }}日后过期</span>
        </span>
      </template>
    </s-table>
    <a-drawer
      :title="drawerTitle"
      :wrapStyle="{overflow: 'hidden'}"
      placement="right"
      :closable="false"
      :width="850"
      @close="onDrawerClose"
      :visible="drawerVisible"
      :bodyStyle="{ padding: '0px 0px 0px 0px' }"
    >
      <a-card :bordered="false" :body-style="{ height:drawerCardHeight + 'px',padding:'10px 0px 0px 10px'}">
        <a-card
          :bordered="false"
          :bodyStyle="{ height:topCardHeight+'px', padding: '0px 10px' }">
          <a-button type="primary" size="small" style="margin: 0px 0px 10px 0px;">{{ topButtonTitle }}</a-button>
          <s-table
            v-watermark
            class="customClass topClass"
            ref="totalTable"
            size="small"
            :rowKey="(record) => record.id"
            :columns="dynamicColumn"
            :height="tableHeight"
            :data="loadTotalList"
            :customRow="onTotalClickRow"
            :rowClassName="setTotalCurrentRow"
            :showSizeChanger="false"
            :pageSize="totalPagination.pageSize"
            :pageNum="totalPagination.pageNumber"
            :showPagination="showPagination"
            :isMybatis="true"
            :bodyStyle="{ minHeight: totalListScrollHeight+'px' }"
            :scroll="{ x: false, y: totalListScrollHeight }"
          >
            <template slot="rowIndex" slot-scope="text, record, index">
              <span>
                {{ (totalPagination.pageNumber - 1) * totalPagination.pageSize + index + 1 }}
              </span>
            </template>
            <template slot="days" slot-scope="text">
              <span v-if="text >= 1">
                <span v-if="text%1 > 0">{{ text - text%1 }}天{{ (text%1)*8 }}小时</span>
                <span v-else>{{ text - text%1 }}天</span>
              </span>
              <span v-if="text > 0 && text < 1">
                <span>{{ text*8 }}小时</span>
              </span>
            </template>
            <template slot="daysUsed" slot-scope="text, record">
              <template v-if="record.daysUsed > 0">
                <span v-if="record.daysUsed >= 1">
                  <span v-if="record.daysUsed%1 > 0">已使用{{ record.daysUsed - record.daysUsed%1 }}天{{ (record.daysUsed%1)*8 }}小时</span>
                  <span v-else>已使用{{ record.daysUsed - record.daysUsed%1 }}天</span>
                </span>
                <span v-if="record.daysUsed > 0 && record.daysUsed < 1">
                  <span>已使用{{ record.daysUsed*8 }}小时</span>
                </span>
              </template>
            </template>
          </s-table>
        </a-card>
        <a-card
          :bordered="false"
          :bodyStyle="{ height:bottomCardHeight+'px', padding: '0px 10px' }">
          <a-button type="primary" size="small" style="margin: 10px 0px;">{{ bottomButtonTitle }}</a-button>
          <s-table
            v-watermark
            ref="usedTable"
            size="small"
            class="customClass bottomClass"
            :rowKey="(record) => record.id"
            :columns="usedColumn"
            :height="tableHeight"
            :data="loadUsedList"
            :customRow="onUsedClickRow"
            :rowClassName="setUsedCurrentRow"
            :showSizeChanger="false"
            :pageSize="usedPagination.pageSize"
            :pageNum="usedPagination.pageNumber"
            :showPagination="true"
            :bodyStyle="{ minHeight: usedListScrollHeight+'px' }"
            :scroll="{ x: false, y: usedListScrollHeight }"
          >
            <template slot="rowIndex" slot-scope="text, record, index">
              <span>
                {{ (usedPagination.pageNumber - 1) * usedPagination.pageSize + index + 1 }}
              </span>
            </template>
            <template slot="leaveDays" slot-scope="text">
              <span v-if="text >= 1">
                <span v-if="text%1 > 0">{{ text - text%1 }}天{{ (text%1)*8 }}小时</span>
                <span v-else>{{ text - text%1 }}天</span>
              </span>
              <span v-if="text > 0 && text < 1">
                <span>{{ text*8 }}小时</span>
              </span>
            </template>
            <template slot="remark" slot-scope="text">
              <a-tooltip>
                <template slot="title">
                  <span>{{ text }}</span>
                </template>
                <div style="width: 100%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{ text }}</div>
              </a-tooltip>
            </template>
            <template slot="auditFlag" slot-scope="text">
              <template v-if="text === 0 || text === 1">
                <a-badge :status="text | auditTypeFilter" :text="text | auditFilter"/>
              </template>
            </template>
          </s-table>
        </a-card>
      </a-card>
    </a-drawer>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import {
  doLoadPersonalLeaveList,
  doLoadPersonalTotalVacationList,
  doLoadPersonalVacationUsedList
} from '@/api/personalleavevacation'
import moment from 'moment/moment'

const typeMap = {
  12: {
    text: '调休'
  },
  13: {
    text: '年假'
  }
}

const auditMap = {
  0: {
    status: 'default',
    text: '未审'
  },
  1: {
    status: 'success',
    text: '已审'
  }
}
const totalAnnualColumn = [
  {
    dataIndex: 'rowIndex',
    width: '8%',
    title: '',
    scopedSlots: { customRender: 'rowIndex' }
  },
  {
    dataIndex: 'standing',
    width: '18%',
    title: '累计工龄(年)'
  },
  {
    dataIndex: 'days',
    width: '16%',
    title: '年假天数',
    scopedSlots: { customRender: 'days' }
  },
  {
    dataIndex: 'createDate',
    width: '18%',
    title: '生成日期'
  },
  {
    dataIndex: 'startDate',
    width: '20%',
    title: '有效开始日期'
  },
  {
    dataIndex: 'endDate',
    width: '20%',
    title: '有效截止日期'
  },
  {
    dataIndex: 'daysUsed',
    width: '20%',
    title: '备注',
    scopedSlots: { customRender: 'daysUsed' }
  }
]

const totalRestColumn = [
  {
    dataIndex: 'rowIndex',
    width: '11%',
    title: '',
    scopedSlots: { customRender: 'rowIndex' }
  },
  {
    dataIndex: 'createDate',
    width: '17%',
    title: '加班日期'
  },
  {
    dataIndex: 'days',
    width: '17%',
    title: '加班时长',
    scopedSlots: { customRender: 'days' }
  },
  {
    dataIndex: 'startDate',
    width: '17%',
    title: '有效开始日期'
  },
  {
    dataIndex: 'endDate',
    width: '17%',
    title: '有效截止日期'
  },
  {
    dataIndex: 'daysUsed',
    width: '21%',
    title: '备注',
    scopedSlots: { customRender: 'daysUsed' }
  }

]
const usedColumn = [
  {
    dataIndex: 'rowIndex',
    width: '6%',
    title: '',
    scopedSlots: { customRender: 'rowIndex' }
  },
  {
    dataIndex: 'startDate',
    width: '14%',
    title: '请假开始日期'
  },
  {
    dataIndex: 'endDate',
    width: '14%',
    title: '请假结束日期'
  },
  {
    dataIndex: 'leaveDays',
    width: '12%',
    title: '请假天数',
    scopedSlots: { customRender: 'leaveDays' }
  },
  {
    dataIndex: 'applyDate',
    width: '12%',
    title: '申请日期'
  },
  {
    dataIndex: 'remark',
    width: '16%',
    title: '请假原因',
    scopedSlots: { customRender: 'remark' }
  },
  {
    dataIndex: 'lshid',
    width: '15%',
    title: 'OA流水号'
  },
  {
    dataIndex: 'auditFlag',
    width: '11%',
    title: '审核情况',
    scopedSlots: { customRender: 'auditFlag' }
  }
]
export default {
  name: 'PersonalLeaveVacationView',
  components: {
    STable
  },
  data () {
    return {
      moment,
      dynamicColumn: totalAnnualColumn,
      totalAnnualColumn,
      totalRestColumn,
      usedColumn,
      cardHeight: 0,
      topCardHeight: (window.innerHeight - 70) / 2,
      bottomCardHeight: (window.innerHeight - 70) / 2,
      drawerCardHeight: window.innerHeight - 60,
      drawerListScrollHeight: 0,
      tableHeight: 0,
      listScrollHeight: 0,
      totalListScrollHeight: (window.innerHeight - 70) / 2 - 140,
      usedListScrollHeight: (window.innerHeight - 70) / 2 - 140,
      expiredDay: '',
      queryParam: { pageSize: 25, year: null },
      totalQueryParam: { pageSize: 25, personId: null, type: -1, year: null },
      usedQueryParam: { pageSize: 25, personId: null, type: -1, year: null },
      rowSelected: '',
      totalRowSelected: '',
      usedRowSelected: '',
      pagination: { pageNumber: 1, pageSize: 25, totalCount: 1 },
      totalPagination: { pageNumber: 1, pageSize: 25, totalCount: 1 },
      usedPagination: { pageNumber: 1, pageSize: 25, totalCount: 1 },
      leaveColumns: [
        {
          dataIndex: 'rowIndex',
          width: '5%',
          title: '序号',
          scopedSlots: { customRender: 'rowIndex' },
          align: 'center'
        },
        {
          dataIndex: 'type',
          width: '17%',
          title: '类型',
          scopedSlots: { customRender: 'type' },
          align: 'center'
        },
        {
          dataIndex: 'lastYearDaysLeft',
          width: '19%',
          title: '总天数(上年结余)',
          scopedSlots: { customRender: 'lastYearDaysLeft' },
          align: 'center'
        },
        {
          dataIndex: 'currentYearDaysUsed',
          width: '19%',
          title: '已用天数',
          scopedSlots: { customRender: 'currentYearDaysUsed' },
          align: 'center'
        },
        {
          dataIndex: 'totalDaysLeft',
          width: '19%',
          title: '剩余可用天数',
          scopedSlots: { customRender: 'totalDaysLeft' },
          align: 'center'
        },
        {
          dataIndex: 'expiringDays',
          width: '21%',
          title: '提示',
          scopedSlots: { customRender: 'expiringDays' },
          align: 'center'
        }
      ],
      loadTableList: parameter => {
        return doLoadPersonalLeaveList(Object.assign(parameter, this.queryParam)).then(res => {
          if (res.code === 200) {
            this.pagination.pageNumber = res.body.pageNumber
            this.pagination.totalCount = res.body.totalCount
            return res.body
          }
        })
      },
      loadTotalList: parameter => {
        return doLoadPersonalTotalVacationList(Object.assign(parameter, this.totalQueryParam)).then(res => {
          if (res.code === 200) {
            this.totalPagination.pageNumber = res.body.pageNumber
            this.totalPagination.totalCount = res.body.totalCount
            return res.body
          }
        })
      },
      loadUsedList: parameter => {
        return doLoadPersonalVacationUsedList(Object.assign(parameter, this.usedQueryParam)).then(res => {
          if (res.code === 200) {
            this.usedPagination.pageNumber = res.body.pageNumber + 1
            this.usedPagination.totalCount = res.body.totalCount
            return res.body
          }
        })
      },
      topButtonTitle: '假期类型',
      bottomButtonTitle: '已使用假期类型',
      drawerTitle: '',
      drawerVisible: false,
      showPagination: false
    }
  },
  filters: {
    typeFilter (val) {
      return typeMap[val].text
    },
    auditFilter (val) {
      return auditMap[val].text
    },
    auditTypeFilter (val) {
      return auditMap[val].status
    }
  },
  methods: {
    handleYearChange (val) {
      this.queryParam.year = val.toString()
      this.doQueryVacation()
      this.totalQueryParam.year = val.toString()
      this.usedQueryParam.year = val.toString()
    },
    doQueryVacation () {
      this.rowSelected = ''
      setTimeout(() => {
        this.$refs.table.refresh(true) // refresh() 不传参默认值 false 不刷新到分页第一页
      }, 100)
    },
    doQueryTotalVacation () {
      this.totalRowSelected = ''
      setTimeout(() => {
        this.$refs.totalTable.refresh(true) // refresh() 不传参默认值 false 不刷新到分页第一页
      }, 100)
    },
    doQueryUsedVacation () {
      this.usedRowSelected = ''
      setTimeout(() => {
        this.$refs.usedTable.refresh(true) // refresh() 不传参默认值 false 不刷新到分页第一页
      }, 100)
    },
    onClickRow (record, index) {
      return {
        on: {
          click: () => {
            this.rowSelected = record.type
          },
          dblclick: () => {
            this.totalQueryParam.type = record.type
            this.usedQueryParam.type = record.type
            if (record.type === 12) {
              this.dynamicColumn = totalRestColumn
              this.drawerTitle = '员工调休及使用情况'
              this.topButtonTitle = '加班记录'
              this.bottomButtonTitle = '调休记录'
              this.showPagination = true
            }
            if (record.type === 13) {
              this.dynamicColumn = totalAnnualColumn
              this.drawerTitle = '员工年假及使用情况'
              this.topButtonTitle = '员工年假'
              this.bottomButtonTitle = '已使用年假'
              this.showPagination = false
            }
            this.doQueryTotalVacation()
            this.doQueryUsedVacation()
            this.drawerVisible = true
          }
        }
      }
    },
    setCurrentRow (record, index) {
      var styleClassName = ''
      if (record.type === this.rowSelected) {
        styleClassName = 'clickRowStyle hoverRowStyle'
      }
      return styleClassName
    },
    onTotalClickRow (record, index) {
      return {
        on: {
          click: () => {
            this.totalRowSelected = record.id
          }
        }
      }
    },
    setTotalCurrentRow (record, index) {
      var styleClassName = ''
      if (record.id === this.totalRowSelected) {
        styleClassName = 'clickRowStyle hoverRowStyle'
      }
      return styleClassName
    },
    onUsedClickRow (record, index) {
      return {
        on: {
          click: () => {
            this.usedRowSelected = record.id
          }
        }
      }
    },
    setUsedCurrentRow (record, index) {
      var styleClassName = ''
      if (record.id === this.usedRowSelected) {
        styleClassName = 'clickRowStyle hoverRowStyle'
      }
      return styleClassName
    },
    onDrawerClose () {
      this.drawerVisible = false
      this.drawerTitle = ''
      this.topButtonTitle = ''
      this.bottomButtonTitle = ''
      this.totalPagination = { pageNumber: 1, pageSize: 25, totalCount: 1 }
      this.usedPagination = { pageNumber: 1, pageSize: 25, totalCount: 1 }
    },
    initPage () {
      var currentYear = moment().year()
      this.expiredDay = currentYear + '-3-31'
      this.totalQueryParam.year = currentYear.toString()
      this.usedQueryParam.year = currentYear.toString()
      this.queryParam.year = currentYear.toString()
      this.listScrollHeight = window.innerHeight - 270
      this.drawerListScrollHeight = window.innerHeight - 180
      this.cardHeight = window.innerHeight - 85
    }
  },
  created () {
    this.initPage()
  }
}
</script>

<style scoped>
  .topClass /deep/ .ant-table-placeholder {
    position: absolute;
    z-index: 1;
    padding: 16px 16px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    text-align: center;
    background: rgba(0, 0, 0, 0);
    border-bottom: 0px solid #e8e8e8;
    border-radius: 0 0 4px 4px;
    margin-top: 1px;
    top: 36px;
    width: 100%
  }

  .bottomClass /deep/ .ant-table-placeholder {
    position: absolute;
    z-index: 1;
    padding: 16px 16px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    text-align: center;
    background: rgba(0, 0, 0, 0);
    border-bottom: 0px solid #e8e8e8;
    border-radius: 0 0 4px 4px;
    margin-top: 1px;
    top: 36px;
    width: 100%
  }

  /deep/ .ant-table-bordered .ant-table-tbody > tr > td {
    border-right: 0px solid #e8e8e8;
  }

  .customClass /deep/ .ant-empty-normal .ant-empty-image {
    height: 0px;
  }
</style>
