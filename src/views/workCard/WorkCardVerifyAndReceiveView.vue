<template>
  <div>
    <a-card
      :bordered="false"
      :bodyStyle="{
        height:cardHeight+'px',
        padding: '0px 10px',
      }">
      <a-col :span="4">
        <a-row style="margin-top:10px;">
        </a-row>
        <a-table
          size="small"
          :bordered="false"
          :loading="dateLoading"
          :rowKey="(record) => record.dateStr"
          :columns="dateColumns"
          :height="tableHeight"
          :dataSource="dateList"
          :customRow="onClickDateRow"
          :rowClassName="setCurrentDateRow"
          :pagination="false"
          :bodyStyle="{ minHeight:listScrollHeight + 44 +'px' }"
          :scroll="{ x: false, y: listScrollHeight + 44 }"
        >
          <template slot="dateStr" slot-scope="text, record">
            <template v-if="text === 'all'">
              <span v-if="record.count > 0">全部 ({{ record.count }}人)</span>
            </template>
            <template v-else>
              <span v-if="record.count > 0">{{ text }} ({{ record.count }}人)</span>
            </template>
          </template>
        </a-table>
      </a-col>
      <a-col :span="20">
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
            <a-checkbox-group v-model="queryParam.recharge" :options="options" @change="onRechargeChange" />
            <a-divider type="vertical"/>
            <a-radio-group v-model="queryParam.flag" @change="onFlagChange">
              <a-radio :value="0">
                待审核<span v-if="verifyingCount > 0">({{ verifyingCount }}个)</span>
              </a-radio>
              <a-radio :value="1">
                待领取<span v-if="receivingCount > 0">({{ receivingCount }}个)</span>
              </a-radio>
              <a-radio :value="-1">
                全部
              </a-radio>
            </a-radio-group>
            <a-divider type="vertical"/>
            <a-button type="primary" icon="search" @click="doQueryPerson">查询</a-button>
            <a-divider type="vertical" v-if="queryParam.flag === 1"/>
            <a-button type="primary" @click="doBatchReceive" v-if="queryParam.flag === 1" :loading="btnLoading">批量领取</a-button>
          </a-col>
        </a-row>
        <s-table
          ref="table"
          size="small"
          :rowKey="(record) => record.personId"
          :row-selection="queryParam.flag === 1 ? { selectedRowKeys: selectedRowKeys, onChange: onRowChange } : null"
          :columns="personColumns"
          :height="tableHeight"
          :initLoadData="false"
          :data="loadPersonList"
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
          <template slot="cardType" slot-scope="text">
            <a-badge :color="text | cardTypeFilter" :text="text | cardTypeTextFilter"/>
          </template>
          <template slot="status" slot-scope="text, record">
            <template v-if="record.status === 1">
              <a-badge status="default" text="待核实" />
            </template>
            <template v-if="record.status === 2 && record.received === 0">
              <a-badge status="warning" text="待制作" />
            </template>
            <template v-if="record.status > 2 && record.received === 0">
              <a-badge status="processing" text="待领取" />
            </template>
            <template v-if="record.received === 1">
              <a-badge status="success" text="已领取" />
            </template>
          </template>
          <template slot="operation" slot-scope="text, record">
            <template v-if="record.status === 1">
              <a @click="handleWorkCard(record)">办理</a>
            </template>
            <template v-if="record.status > 2 && record.received === 0">
              <a @click="receiveWorkCard(record)">领取</a>
            </template>
            <template v-if="record.received === 1 || (record.status === 2 && record.received === 0)">
              <a @click="readWorkCard(record)">查看</a>
            </template>
          </template>
        </s-table>
      </a-col>
    </a-card>
    <a-drawer
      :title="drawerTitle"
      :wrapStyle="{overflow: 'hidden'}"
      placement="right"
      :closable="false"
      :width="1050"
      @close="onDrawerClose"
      :visible="drawerVisible"
      :bodyStyle="{ padding: '0px 0px 0px 0px' }">
      <verify-and-receive-module-view
        ref="personInfo"
        :person="person"
        :operation="operation"
        v-if="drawerVisible"
        @closeDrawer="onDrawerClose"
        @refresh="refreshTable"></verify-and-receive-module-view>
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
        <a-button type="primary" @click="doReceiveWorkCard" style="margin-left: 20px" v-if="operation === 'receive'">领取</a-button>
        <a-button type="primary" @click="doVerifyWorkCard" style="margin-left: 20px" v-if="operation === 'verify'">核实</a-button>
        <a-button key="back" @click="onDrawerClose" style="margin-left: 20px">关闭</a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { STable } from '@/components'
import { doLoadDateList, doLoadPersonList, getVerifyCount, getReceiveCount, doBatchReceive } from '@/api/workCardVerifyAndReceive'
import moment from 'moment'
import VerifyAndReceiveModuleView from './component/VerifyAndReceiveModuleView'

const cardTypeMap = {
  1: {
    color: 'blue',
    text: '蓝色卡'
  },
  2: {
    color: 'yellow',
    text: '黄色卡'
  },
  3: {
    color: 'gold',
    text: '金色卡'
  }
}
export default {
  name: 'WorkCardVerifyAndReceiveView',
  components: {
    STable,
    VerifyAndReceiveModuleView
  },
  data () {
    return {
      moment,
      dateRowSelected: null,
      personRowSelected: null,
      cardHeight: 0,
      tableHeight: 0,
      listScrollHeight: 0,
      dateQueryParam: {},
      queryParam: { pageSize: 25, inputContent: null, recharge: [0, 1], dateStr: '', flag: 0 },
      pagination: { pageNumber: 1, pageSize: 25, totalCount: 1 },
      dateList: [],
      dateLoading: false,
      loadPersonList: parameter => {
        return doLoadPersonList(Object.assign(parameter, this.queryParam)).then(res => {
          if (res.code === 200) {
            this.pagination.pageNumber = res.body.pageNumber
            this.pagination.totalCount = res.body.totalCount
            return res.body
          }
        })
      },
      dateColumns: [
        {
          dataIndex: 'dateStr',
          width: '100%',
          title: '日期',
          scopedSlots: { customRender: 'dateStr' }
        }
      ],
      personColumns: [
        {
          dataIndex: 'rowIndex',
          width: '6%',
          title: '序号',
          scopedSlots: { customRender: 'rowIndex' }
        },
        {
          dataIndex: 'personId',
          width: '9%',
          title: '工号'
        },
        {
          dataIndex: 'personName',
          width: '11%',
          title: '姓名'
        },
        {
          dataIndex: 'deptName',
          width: '18%',
          title: '部门',
          align: 'left'
        },
        {
          dataIndex: 'startDate',
          width: '13%',
          title: '报到日期'
        },
        {
          dataIndex: 'cardType',
          width: '12%',
          title: '卡种类',
          scopedSlots: { customRender: 'cardType' }
        },
        {
          dataIndex: 'amount',
          width: '12%',
          title: '充值金额'
        },
        {
          dataIndex: 'status',
          width: '9%',
          title: '状态',
          scopedSlots: { customRender: 'status' }
        },
        {
          dataIndex: 'operation',
          width: '9%',
          title: '操作',
          scopedSlots: { customRender: 'operation' },
          align: 'center'
        }
      ],
      verifyingCount: 0,
      receivingCount: 0,
      drawerVisible: false,
      person: {},
      operation: null,
      drawerTitle: '',
      options: [
        { label: '充餐费', value: 1 },
        { label: '无餐费', value: 0 }
      ],
      selectedRowKeys: [],
      btnLoading: false
    }
  },
  filters: {
    cardTypeTextFilter (type) {
      return cardTypeMap[type].text
    },
    cardTypeFilter (type) {
      return cardTypeMap[type].color
    }
  },
  methods: {
    doQueryPerson () {
      this.refreshPersonTable()
      this.getVerifyCount()
      this.getReceiveCount()
    },
    doBatchReceive () {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请先选择数据！')
        return
      }
      if (this.btnLoading) {
        return
      }
      this.btnLoading = true
      doBatchReceive({ personIds: this.selectedRowKeys }).then(res => {
        if (res.code === 200) {
          this.$message.success('批量领取成功！')
          this.refreshTable()
          this.btnLoading = false
        }
        this.btnLoading = false
      })
    },
    onRechargeChange (val) {
      this.queryParam.recharge = val
      this.refreshPersonTable()
      this.getVerifyCount()
      this.getReceiveCount()
    },
    onFlagChange (e) {
      this.selectedRowKeys = []
      this.refreshPersonTable()
      this.getVerifyCount()
      this.getReceiveCount()
    },
    onRowChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
    },
    refreshTable () {
      this.loadDateList()
    },
    handleWorkCard (record) {
      this.personRowSelected = record.personId
      this.person = { ...record }
      this.drawerVisible = true
      this.operation = 'verify'
      this.drawerTitle = '工牌信息核实'
    },
    receiveWorkCard (record) {
      this.personRowSelected = record.personId
      this.person = { ...record }
      this.drawerVisible = true
      this.operation = 'receive'
      this.drawerTitle = '工牌领取'
    },
    readWorkCard (record) {
      this.personRowSelected = record.personId
      this.person = { ...record }
      this.drawerVisible = true
      this.operation = 'read'
      this.drawerTitle = '工牌查看'
    },
    doVerifyWorkCard () {
      this.$refs.personInfo.handleVerify()
    },
    doReceiveWorkCard () {
      this.$refs.personInfo.handleReceive()
    },
    loadDateList () {
      this.dateLoading = true
      doLoadDateList(this.dateQueryParam).then(res => {
        if (res.code === 200) {
          this.dateList = res.body
          if (res.body.length > 0) {
            if (!this.dateRowSelected) {
              this.queryParam.dateStr = res.body[0].dateStr
              this.dateRowSelected = res.body[0].dateStr
            }
            this.refreshPersonTable()
            this.getVerifyCount()
            this.getReceiveCount()
          }
          this.dateLoading = false
        }
        this.dateLoading = false
      })
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
    onClickDateRow (record, index) {
      return {
        on: {
          click: () => {
            this.dateRowSelected = record.dateStr
            this.queryParam.dateStr = record.dateStr
            this.dateRowSelected = record.dateStr
            this.refreshPersonTable()
            this.getVerifyCount()
            this.getReceiveCount()
          }
        }
      }
    },
    setCurrentDateRow (record, index) {
      var styleClassName = ''
      if (record.dateStr === this.dateRowSelected) {
        styleClassName = 'clickRowStyle hoverRowStyle'
      }
      return styleClassName
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
    getVerifyCount () {
      getVerifyCount(this.queryParam).then(res => {
        if (res.code === 200) {
          this.verifyingCount = res.body
        }
      })
    },
    getReceiveCount () {
      getReceiveCount(this.queryParam).then(res => {
        if (res.code === 200) {
          this.receivingCount = res.body
        }
      })
    },
    initPage () {
      var currentYear = moment().year()
      this.queryParam.year = currentYear
      this.listScrollHeight = window.innerHeight - 260
      this.cardHeight = window.innerHeight - 85
    }
  },
  created () {
    this.initPage()
    this.loadDateList()
  }
}
</script>

<style scoped>
  /deep/ .ant-table-placeholder{
    display:none;
  }
</style>
