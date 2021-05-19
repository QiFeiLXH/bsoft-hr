<template>
  <div>
    <a-card
      :bordered="false"
      :bodyStyle="{
        height:cardHeight+'px',
        padding: '0px 10px',
      }">
      <a-row style="margin-bottom: 10px;margin-top:10px;">
        <a-col>
          <a-input-search
            placeholder="请输入姓名或拼音简码或工号查询"
            :allowClear="true"
            style="width: 270px;"
            v-model="queryParam.inputContent"
            @search="doQueryPerson"
            @pressEnter="doQueryPerson"/>
          <a-divider type="vertical"/>
          <a-radio-group v-model="queryParam.flag" @change="onFlagChange">
            <a-radio :value="1">
              待办<span v-if="openingCount > 0">({{ openingCount }}个)</span>
            </a-radio>
            <a-radio :value="2">
              已办
            </a-radio>
          </a-radio-group>
          <a-divider type="vertical"/>
          <a-button type="primary" icon="search" @click="doQueryPerson">查询</a-button>
        </a-col>
      </a-row>
      <s-table
          ref="table"
          size="small"
          :rowKey="(record) => record.personId"
          :columns="personColumns"
          :height="tableHeight"
          :data="loadPersonList"
          :customRow="onClickRow"
          :rowClassName="setCurrentRow"
          :showSizeChanger="false"
          :pageSize="pagination.pageSize"
          :pageNum="pagination.pageNumber"
          :showPagination="true"
          :bodyStyle="{ minHeight:listScrollHeight+'px' }"
          :scroll="{ x: false, y: listScrollHeight }"
        >
          <template slot="rowIndex" slot-scope="text, record, index">
            <span>
              {{ (pagination.pageNumber - 1) * pagination.pageSize + index + 1 }}
            </span>
          </template>
          <template slot="accessControl" slot-scope="text">
            <span>{{ text | accessFilter }}</span>
          </template>
          <template slot="cardType" slot-scope="text">
            <a-badge :color="text | cardTypeFilter" :text="text | cardTypeTextFilter"/>
          </template>
          <template slot="status" slot-scope="text, record">
            <template v-if="record.status === 3">
              <a-badge status="default" text="待办" />
            </template>
            <template v-else>
              <a-badge status="success" text="已办" />
            </template>
          </template>
          <template slot="operation" slot-scope="text, record">
            <template>
              <a @click="handleWorkCard(record)" v-if="record.status === 3">办理</a>
              <a @click="doReadWorkCard(record)" v-else>查看</a>
            </template>
          </template>
        </s-table>
    </a-card>
    <a-drawer
      :title="drawerTitle"
      :wrapStyle="{overflow: 'hidden'}"
      placement="right"
      :closable="false"
      :width="850"
      @close="onDrawerClose"
      :visible="drawerVisible"
      :bodyStyle="{ padding: '0px 0px 0px 0px' }">
      <access-open-module-view
        ref="personInfo"
        :person="person"
        :operation="operation"
        v-if="drawerVisible"
        @closeDrawer="onDrawerClose"
        @refresh="refreshTable"></access-open-module-view>
      <div
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '9px 16px',
          background: '#fff',
          textAlign: 'right',
        }"
      >
        <a-button type="primary" @click="doOpenAccessWorkCard" style="margin-left: 20px" v-if="operation === 'open'">开通</a-button>
        <a-button key="back" @click="onDrawerClose" style="margin-left: 20px">关闭</a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { STable } from '@/components'
import { doLoadPersonList, getOpenAccessCount } from '@/api/workCardAccessOpen'
import moment from 'moment'
import AccessOpenModuleView from './component/AccessOpenModuleView'

export default {
  name: 'WorkCardAccessOpenView',
  components: {
    AccessOpenModuleView,
    STable
  },
  data () {
    return {
      moment,
      personRowSelected: null,
      cardHeight: 0,
      tableHeight: 0,
      listScrollHeight: 0,
      queryParam: { pageSize: 25, inputContent: null, recharge: 1, flag: 1 },
      pagination: { pageNumber: 1, pageSize: 25, totalCount: 1 },
      loadPersonList: parameter => {
        return doLoadPersonList(Object.assign(parameter, this.queryParam)).then(res => {
          if (res.code === 200) {
            this.pagination.pageNumber = res.body.pageNumber + 1
            this.pagination.totalCount = res.body.totalCount
            return res.body
          }
        })
      },
      personColumns: [
        {
          dataIndex: 'rowIndex',
          width: '5%',
          title: '序号',
          scopedSlots: { customRender: 'rowIndex' }
        },
        {
          dataIndex: 'personId',
          width: '12%',
          title: '工号'
        },
        {
          dataIndex: 'personName',
          width: '14%',
          title: '姓名'
        },
        {
          dataIndex: 'deptName',
          width: '21%',
          title: '部门',
          align: 'left'
        },
        {
          dataIndex: 'accessControl',
          width: '14%',
          title: '门禁权限',
          scopedSlots: { customRender: 'accessControl' }
        },
        {
          dataIndex: 'status',
          width: '10%',
          title: '状态',
          scopedSlots: { customRender: 'status' }
        },
        {
          dataIndex: 'openDate',
          width: '10%',
          title: '开通日期',
          scopedSlots: { customRender: 'openDate' }
        },
        {
          dataIndex: 'operation',
          width: '14%',
          title: '操作',
          scopedSlots: { customRender: 'operation' },
          align: 'center'
        }
      ],
      openingCount: 0,
      drawerVisible: false,
      person: {},
      operation: null,
      drawerTitle: ''
    }
  },
  filters: {
    accessFilter (text) {
      var accessArray = []
      if (text) {
        // 升序
        var sortedArray = text.split(',').map(Number).sort(function (a, b) { return a - b })
        var head = sortedArray[0]
        var tail = sortedArray[0]
        sortedArray.forEach(item => {
          if (item - tail <= 1) {
            tail = item
          } else {
            var index = null
            if (head === tail) {
              index = head + 'F'
            } else {
              index = head + '~' + tail + 'F'
            }
            accessArray.push(index)
            head = item
            tail = item
          }
        })
        var lastEl = null
        if (head === tail) {
          lastEl = head + 'F'
        } else {
          lastEl = head + '~' + tail + 'F'
        }
        accessArray.push(lastEl)
        return accessArray.join(',')
      } else {
        return text
      }
    }
  },
  methods: {
    doQueryPerson () {
      this.refreshPersonTable()
      this.getOpenAccessCount()
    },
    onRechargeChange (e) {
      this.queryParam.recharge = e.target.checked ? 1 : 0
      this.refreshPersonTable()
      this.getOpenAccessCount()
    },
    onFlagChange () {
      this.refreshPersonTable()
      this.getOpenAccessCount()
    },
    refreshTable () {
      this.refreshPersonTable()
      this.getOpenAccessCount()
    },
    handleWorkCard (record) {
      this.personRowSelected = record.personId
      this.person = { ...record }
      this.drawerVisible = true
      this.operation = 'open'
      this.drawerTitle = '工牌门禁权限开通'
    },
    doReadWorkCard (record) {
      this.personRowSelected = record.personId
      this.person = { ...record }
      this.drawerVisible = true
      this.operation = 'read'
      this.drawerTitle = '工牌门禁权限开通'
    },
    doOpenAccessWorkCard () {
      this.$refs.personInfo.handleOpenAccess()
    },
    refreshPersonTable () {
      this.personRowSelected = ''
      setTimeout(() => {
        this.$refs.table.refresh(true) // refresh() 不传参默认值 false 不刷新到分页第一页
      }, 100)
    },
    onDrawerClose () {
      this.drawerVisible = false
    },
    onClickRow (record, index) {
      return {
        on: {
          click: () => {
            this.personRowSelected = record.personId
          }
        }
      }
    },
    setCurrentRow (record, index) {
      var styleClassName = ''
      if (record.personId === this.personRowSelected) {
        styleClassName = 'clickRowStyle hoverRowStyle'
      }
      return styleClassName
    },
    getOpenAccessCount () {
      getOpenAccessCount(this.queryParam).then(res => {
        if (res.code === 200) {
          this.openingCount = res.body
        }
      })
    },
    initPage () {
      var currentYear = moment().year()
      this.queryParam.year = currentYear
      this.listScrollHeight = window.innerHeight - 260
      this.cardHeight = window.innerHeight - 85
      this.getOpenAccessCount()
    }
  },
  created () {
    this.initPage()
  }
}
</script>

<style scoped>
  /deep/ .ant-table-placeholder{
    display:none;
  }
</style>
