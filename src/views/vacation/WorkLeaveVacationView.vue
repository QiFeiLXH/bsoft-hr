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
            <dept-select
              v-model="queryParam.deptId"
              style="width:150px;margin-left: 20px"
              placeholder="按部门查询"
              @change="handleDeptChange"></dept-select>
            <a-input-search
              placeholder="请输入姓名或拼音简码查询"
              :allowClear="true"
              style="width: 250px;margin-left: 20px"
              v-model="queryParam.inputContent"
              @search="doQueryVacation"
              @pressEnter="doQueryVacation"/>
            <a-button type="primary" icon="search" @click="doQueryVacation" style="margin-left: 30px">查询</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table
      v-watermark
      ref="table"
      size="small"
      class="allCustomClass"
      bordered
      :rowKey="(record) => record.personId"
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
      <template slot="currentAnnualDays" slot-scope="text, record">
        <!--当今年与历年都有数据时-->
        <span v-if="text > 0 && record.oldAnnualDays > 0">
          <!-- 当总天数大于等于1 -->
          <span v-if="(text + record.oldAnnualDays) >= 1">
            <!--当总天数不是整数-->
            <span v-if="(text + record.oldAnnualDays)%1 > 0">{{ (text + record.oldAnnualDays) - (text + record.oldAnnualDays)%1 }}天{{ ((text + record.oldAnnualDays)%1)*8 }}小时</span>
            <!--当总天数刚好是整数-->
            <span v-else>{{ text + record.oldAnnualDays }}天</span>
          </span>
          <!--当总天数大于0小于1-->
          <span v-if="(text + record.oldAnnualDays) > 0 && (text + record.oldAnnualDays) < 1">
            <span>{{ (text + record.oldAnnualDays)*8 }}小时</span>
          </span>
          <!--拼接历年剩余天数-->
          <!--当历年天数不是整数时-->
          <span v-if="record.oldAnnualDays%1 > 0">({{ record.oldAnnualDays - record.oldAnnualDays%1 }}天{{ (record.oldAnnualDays%1)*8 }}小时)</span>
          <!--当历年天数是整数-->
          <span v-else>({{ record.oldAnnualDays }}天)</span>
        </span>
        <span v-else-if="text > 0 || record.oldAnnualDays > 0">
          <!-- 当总天数大于等于1 -->
          <span v-if="(text + record.oldAnnualDays) >= 1">
            <!--当总天数不是整数-->
            <span v-if="(text + record.oldAnnualDays)%1 > 0">{{ (text + record.oldAnnualDays) - (text + record.oldAnnualDays)%1 }}天{{ ((text + record.oldAnnualDays)%1)*8 }}小时</span>
            <!--当总天数刚好是整数-->
            <span v-else>{{ text + record.oldAnnualDays }}天</span>
          </span>
          <!--当总天数大于0小于1-->
          <span v-if="(text + record.oldAnnualDays) > 0 && (text + record.oldAnnualDays) < 1">
            <span>{{ (text + record.oldAnnualDays)*8 }}小时</span>
          </span>
        </span>
      </template>
      <template slot="annualDaysUsed" slot-scope="text">
        <span v-if="text >= 1">
          <span v-if="text%1 > 0">{{ text - text%1 }}天{{ (text%1)*8 }}小时</span>
          <span v-else>{{ text - text%1 }}天</span>
        </span>
        <span v-if="text > 0 && text < 1">
          <span>{{ text*8 }}小时</span>
        </span>
      </template>
      <template slot="annualDaysLeft" slot-scope="text">
        <span v-if="text >= 1">
          <span v-if="text%1 > 0" style="font-weight:bold">{{ text - text%1 }}天{{ (text%1)*8 }}小时</span>
          <span v-else style="font-weight:bold">{{ text - text%1 }}天</span>
        </span>
        <span v-if="text > 0 && text < 1">
          <span style="font-weight:bold">{{ text*8 }}小时</span>
        </span>
      </template>
      <template slot="currentRestDays" slot-scope="text, record">
        <!--当今年与历年都有数据时-->
        <span v-if="text > 0 && record.oldRestDays > 0">
          <!-- 当总天数大于等于1 -->
          <span v-if="(text + record.oldRestDays) >= 1">
            <!--当总天数不是整数-->
            <span v-if="(text + record.oldRestDays)%1 > 0">{{ (text + record.oldRestDays) - (text + record.oldRestDays)%1 }}天{{ ((text + record.oldRestDays)%1)*8 }}小时</span>
            <!--当总天数刚好是整数-->
            <span v-else>{{ text + record.oldRestDays }}天</span>
          </span>
          <!--当总天数大于0小于1-->
          <span v-if="(text + record.oldRestDays) > 0 && (text + record.oldRestDays) < 1">
            <span>{{ (text + record.oldRestDays)*8 }}小时</span>
          </span>
          <!--拼接历年剩余天数-->
          <!--当历年天数不是整数时-->
          <span v-if="record.oldRestDays%1 > 0">({{ record.oldRestDays - record.oldRestDays%1 }}天{{ (record.oldRestDays%1)*8 }}小时)</span>
          <!--当历年天数是整数-->
          <span v-else>({{ record.oldRestDays }}天)</span>
        </span>
        <span v-else-if="text > 0 || record.oldRestDays > 0">
          <!-- 当总天数大于等于1 -->
          <span v-if="(text + record.oldRestDays) >= 1">
            <!--当总天数不是整数-->
            <span v-if="(text + record.oldRestDays)%1 > 0">{{ (text + record.oldRestDays) - (text + record.oldRestDays)%1 }}天{{ ((text + record.oldRestDays)%1)*8 }}小时</span>
            <!--当总天数刚好是整数-->
            <span v-else>{{ text + record.oldRestDays }}天</span>
          </span>
          <!--当总天数大于0小于1-->
          <span v-if="(text + record.oldRestDays) > 0 && (text + record.oldRestDays) < 1">
            <span>{{ (text + record.oldRestDays)*8 }}小时</span>
          </span>
        </span>
      </template>
      <template slot="restDaysUsed" slot-scope="text">
        <span v-if="text >= 1">
          <span v-if="text%1 > 0">{{ text - text%1 }}天{{ (text%1)*8 }}小时</span>
          <span v-else>{{ text - text%1 }}天</span>
        </span>
        <span v-if="text > 0 && text < 1">
          <span>{{ text*8 }}小时</span>
        </span>
      </template>
      <template slot="restDaysLeft" slot-scope="text">
        <span v-if="text >= 1">
          <span v-if="text%1 > 0" style="font-weight:bold">{{ text - text%1 }}天{{ (text%1)*8 }}小时</span>
          <span v-else style="font-weight:bold">{{ text - text%1 }}天</span>
        </span>
        <span v-if="text > 0 && text < 1">
          <span style="font-weight:bold">{{ text*8 }}小时</span>
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
            ref="totalTable"
            class="customClass"
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
            :bodyStyle="{ minHeight:totalListScrollHeight+'px' }"
            :scroll="{ x: false, y: totalListScrollHeight }"
          >
            <template slot="rowIndex" slot-scope="text, record, index">
              <span>
                {{ (totalPagination.pageNumber - 1) * totalPagination.pageSize + index + 1 }}
              </span>
            </template>
            <template slot="type" slot-scope="text">
              <span>{{ text | typeFilter }}</span>
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
            class="customClass"
            size="small"
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
            <template slot="morningLeaveType" slot-scope="text">
              <span>{{ text | typeFilter }}</span>
            </template>
            <template slot="afternoonLeaveType" slot-scope="text">
              <span>{{ text | typeFilter }}</span>
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
import { STable, DeptSelect } from '@/components'
import { doLoadLeaveList, doLoadTotalVacationList, doLoadVacationUsedList } from '@/api/leavevacation'
import moment from 'moment/moment'
import store from '@/store'

const permissions = store.getters.roles.permissions

const typeMap = {
  12: {
    text: '调休'
  },
  13: {
    text: '年休'
  },
  null: {
    text: ''
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
    title: '序号',
    scopedSlots: { customRender: 'rowIndex' }
  },
  {
    dataIndex: 'standing',
    width: '14%',
    title: '累计工龄(年)'
  },
  {
    dataIndex: 'days',
    width: '14%',
    title: '年假天数',
    scopedSlots: { customRender: 'days' }
  },
  {
    dataIndex: 'createDate',
    width: '14%',
    title: '生成日期'
  },
  {
    dataIndex: 'startDate',
    width: '16%',
    title: '有效开始日期'
  },
  {
    dataIndex: 'endDate',
    width: '16%',
    title: '有效截止日期'
  },
  {
    dataIndex: 'daysUsed',
    width: '16%',
    title: '备注',
    scopedSlots: { customRender: 'daysUsed' }
  }
]

const totalRestColumn = [
  {
    dataIndex: 'rowIndex',
    width: '10%',
    title: '序号',
    scopedSlots: { customRender: 'rowIndex' }
  },
  {
    dataIndex: 'createDate',
    width: '16%',
    title: '加班日期'
  },
  {
    dataIndex: 'days',
    width: '16%',
    title: '加班时长',
    scopedSlots: { customRender: 'days' }
  },
  {
    dataIndex: 'startDate',
    width: '18%',
    title: '有效开始日期'
  },
  {
    dataIndex: 'endDate',
    width: '18%',
    title: '有效截止日期'
  },
  {
    dataIndex: 'daysUsed',
    width: '18%',
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
  name: 'WorkLeaveVacationView',
  components: {
    STable,
    DeptSelect
  },
  data () {
    return {
      moment,
      totalAnnualColumn,
      totalRestColumn,
      usedColumn,
      cardHeight: 0,
      dynamicColumn: [],
      drawerCardHeight: window.innerHeight - 60,
      topCardHeight: (window.innerHeight - 70) / 2,
      bottomCardHeight: (window.innerHeight - 70) / 2,
      totalListScrollHeight: (window.innerHeight - 70) / 2 - 140,
      usedListScrollHeight: (window.innerHeight - 70) / 2 - 140,
      tableHeight: 0,
      listScrollHeight: 0,
      drawerListScrollHeight: 0,
      queryParam: { pageSize: 25, year: null, deptId: null, inputContent: '', allPermission: 0, startDate: null, endDate: null },
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
        }, {
          dataIndex: 'personName',
          width: '9%',
          title: '姓名',
          align: 'center'
        },
        {
          dataIndex: 'deptName',
          width: '14%',
          title: '部门',
          align: 'center'
        },
        {
          title: '年假',
          children: [
            {
              dataIndex: 'currentAnnualDays',
              width: '9%',
              title: '总天数(上年结余)',
              align: 'center',
              scopedSlots: { customRender: 'currentAnnualDays' },
              customCell: (record, rowindex) => {
                return {
                  on: {
                    dblclick: () => {
                      if (record.currentAnnualDays + record.oldAnnualDays + record.annualDaysUsed > 0) {
                        this.showAnnualVacationRecord(record)
                      }
                    }
                  }
                }
              }
            },
            {
              dataIndex: 'annualDaysUsed',
              width: '9%',
              title: '已使用',
              scopedSlots: { customRender: 'annualDaysUsed' },
              align: 'center',
              customCell: (record, rowindex) => {
                return {
                  on: {
                    dblclick: () => {
                      if (record.currentAnnualDays + record.oldAnnualDays + record.annualDaysUsed > 0) {
                        this.showAnnualVacationRecord(record)
                      }
                    }
                  }
                }
              }
            },
            {
              dataIndex: 'annualDaysLeft',
              width: '9%',
              title: '剩余可用',
              align: 'center',
              scopedSlots: { customRender: 'annualDaysLeft' },
              customCell: (record, rowindex) => {
                return {
                  on: {
                    dblclick: () => {
                      if (record.currentAnnualDays + record.oldAnnualDays + record.annualDaysUsed > 0) {
                        this.showAnnualVacationRecord(record)
                      }
                    }
                  }
                }
              }
            }
          ]
        },
        {
          title: '调休',
          children: [
            {
              dataIndex: 'currentRestDays',
              width: '9%',
              title: '总天数(上年结余)',
              align: 'center',
              scopedSlots: { customRender: 'currentRestDays' },
              customCell: (record, rowindex) => {
                return {
                  on: {
                    dblclick: () => {
                      if (record.currentRestDays + record.oldRestDays + record.restDaysUsed > 0) {
                        this.showRestVacationRecord(record)
                      }
                    }
                  }
                }
              }
            },
            {
              dataIndex: 'restDaysUsed',
              width: '9%',
              title: '已使用',
              align: 'center',
              scopedSlots: { customRender: 'restDaysUsed' },
              customCell: (record, rowindex) => {
                return {
                  on: {
                    dblclick: () => {
                      if (record.currentRestDays + record.oldRestDays + record.restDaysUsed > 0) {
                        this.showRestVacationRecord(record)
                      }
                    }
                  }
                }
              }
            },
            {
              dataIndex: 'restDaysLeft',
              width: '9%',
              title: '剩余可用',
              align: 'center',
              scopedSlots: { customRender: 'restDaysLeft' },
              customCell: (record, rowindex) => {
                return {
                  on: {
                    dblclick: () => {
                      if (record.currentRestDays + record.oldRestDays + record.restDaysUsed > 0) {
                        this.showRestVacationRecord(record)
                      }
                    }
                  }
                }
              }
            }
          ]
        }
      ],
      loadTableList: parameter => {
        return doLoadLeaveList(Object.assign(parameter, this.queryParam)).then(res => {
          if (res.code === 200) {
            this.pagination.pageNumber = res.body.pageNumber
            this.pagination.totalCount = res.body.totalCount
            return res.body
          }
        })
      },
      loadTotalList: parameter => {
        return doLoadTotalVacationList(Object.assign(parameter, this.totalQueryParam)).then(res => {
          if (res.code === 200) {
            this.totalPagination.pageNumber = res.body.pageNumber
            this.totalPagination.totalCount = res.body.totalCount
            return res.body
          }
        })
      },
      loadUsedList: parameter => {
        return doLoadVacationUsedList(Object.assign(parameter, this.usedQueryParam)).then(res => {
          if (res.code === 200) {
            this.usedPagination.pageNumber = res.body.pageNumber + 1
            this.usedPagination.totalCount = res.body.totalCount
            return res.body
          }
        })
      },
      drawerTitle: '',
      topButtonTitle: '',
      bottomButtonTitle: '',
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
    },
    handleDeptChange (val) {
      this.queryParam.deptId = val
      this.doQueryVacation()
    },
    doQueryVacation () {
      this.rowSelected = ''
      setTimeout(() => {
        this.$refs.table.refresh(true) // refresh() 不传参默认值 false 不刷新到分页第一页
      }, 100)
    },
    showAnnualVacationRecord (record) {
      this.dynamicColumn = totalAnnualColumn
      this.showPagination = false
      this.drawerTitle = '年假及使用情况'
      this.topButtonTitle = '员工年假'
      this.bottomButtonTitle = '已使用年假'
      this.totalQueryParam.year = this.queryParam.year
      this.usedQueryParam.year = this.queryParam.year
      this.totalQueryParam.personId = record.personId
      this.usedQueryParam.personId = record.personId
      this.totalQueryParam.type = 13
      this.usedQueryParam.type = 13
      this.drawerVisible = true
      this.totalRowSelected = ''
      this.usedRowSelected = ''
      setTimeout(() => {
        this.$refs.totalTable.refresh(true) // refresh() 不传参默认值 false 不刷新到分页第一页
        this.$refs.usedTable.refresh(true) // refresh() 不传参默认值 false 不刷新到分页第一页
      }, 100)
    },
    showRestVacationRecord (record) {
      this.dynamicColumn = totalRestColumn
      this.showPagination = true
      this.drawerTitle = '调休及使用情况'
      this.topButtonTitle = '加班记录'
      this.bottomButtonTitle = '调休记录'
      this.totalQueryParam.year = this.queryParam.year
      this.usedQueryParam.year = this.queryParam.year
      this.totalQueryParam.personId = record.personId
      this.usedQueryParam.personId = record.personId
      this.totalQueryParam.type = 12
      this.usedQueryParam.type = 12
      this.drawerVisible = true
      this.totalRowSelected = ''
      this.usedRowSelected = ''
      setTimeout(() => {
        this.$refs.totalTable.refresh(true) // refresh() 不传参默认值 false 不刷新到分页第一页
        this.$refs.usedTable.refresh(true) // refresh() 不传参默认值 false 不刷新到分页第一页
      }, 100)
    },
    onClickRow (record, index) {
      return {
        on: {
          click: () => {
            this.rowSelected = record.personId
          }
        }
      }
    },
    setCurrentRow (record, index) {
      var styleClassName = ''
      if (record.personId === this.rowSelected) {
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
    getUserPermissions () {
      if (permissions.length > 0) {
        for (var i = 0; i < permissions.length; i++) {
          if (permissions[i].permissionId === this.$route.meta.permission) {
            if (permissions[i].actionList.includes('1')) {
              this.queryParam.allPermission = 1
              return
            }
          }
        }
      }
    },
    initPage () {
      this.getUserPermissions()
      var currentYear = moment().year()
      this.queryParam.year = currentYear.toString()
      this.queryParam.startDate = moment().startOf('year').format('YYYY-MM-DD').toString()
      this.queryParam.endDate = moment().endOf('year').format('YYYY-MM-DD').toString()
      this.listScrollHeight = window.innerHeight - 300
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
  /deep/ .ant-table-bordered .ant-table-tbody > tr > td {
    border-right: 0px solid #e8e8e8;
  }

  .customClass /deep/ .ant-table-placeholder {
    position: absolute;
    z-index: 1;
    padding: 16px 16px;
    color: rgba(0, 0, 0, .45);
    font-size: 14px;
    text-align: center;
    background: rgba(0, 0, 0, 0);
    border-bottom: 0px solid #e8e8e8;
    border-radius: 0 0 4px 4px;
    margin-top: 1px;
    top: 36px;
    width: 100%
  }

  .allCustomClass /deep/ .ant-table-placeholder {
    position: absolute;
    z-index: 1;
    padding: 16px 16px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    text-align: center;
    background: rgba(0, 0, 0, 0);
    border-bottom: 0px solid #e8e8e8;
    border-radius: 0 0 4px 4px;
    margin-top: 40px;
    top: 36px;
    width: 100%
  }
</style>
