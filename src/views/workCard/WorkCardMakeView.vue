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
          <a-checkbox-group v-model="queryParam.recharge" :options="options" @change="onRechargeChange" />
          <a-divider type="vertical"/>
          <a-radio-group v-model="queryParam.flag" @change="onFlagChange">
            <a-radio :value="1">
              待办<span v-if="makingCount > 0">({{ makingCount }}个)</span>
            </a-radio>
            <a-radio :value="2">
              已办
            </a-radio>
          </a-radio-group>
          <a-divider type="vertical"/>
          <a-button type="primary" icon="search" @click="doQueryPerson">查询</a-button>
          <a-divider type="vertical"/>
          <a-button type="primary" icon="download" @click="doBatchDownload" :loading="isDownloading">照片批量下载</a-button>
        </a-col>
      </a-row>
      <s-table
        ref="table"
        size="small"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onRowChange }"
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
        <template slot="cardType" slot-scope="text">
          <a-badge :color="text | cardTypeFilter" :text="text | cardTypeTextFilter"/>
        </template>
        <template slot="status" slot-scope="text, record">
          <template v-if="record.status === 2">
            <a-badge status="default" text="待办" />
          </template>
          <template v-else>
            <a-badge status="success" text="已办" />
          </template>
        </template>
        <template slot="operation" slot-scope="text, record">
          <template>
            <a @click="handleWorkCard(record)" v-if="record.status === 2">办理</a>
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
      :width="1050"
      @close="onDrawerClose"
      :visible="drawerVisible"
      :bodyStyle="{ padding: '0px 0px 0px 0px' }">
      <make-module-view
        ref="personInfo"
        :person="person"
        :operation="operation"
        v-if="drawerVisible"
        @closeDrawer="onDrawerClose"
        @refresh="refreshTable"></make-module-view>
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
        <a-button type="primary" @click="doMakeWorkCard" style="margin-left: 20px" v-if="operation === 'make'">制作</a-button>
        <a-button key="back" @click="onDrawerClose" style="margin-left: 20px">关闭</a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { STable } from '@/components'
import { doLoadPersonList, getMakeCount, batchCompressDownload } from '@/api/workCardMake'
import moment from 'moment'
import MakeModuleView from './component/MakeModuleView'
import store from '@/store'
import { downFile } from '@/utils/util'

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
  name: 'WorkCardMakeView',
  components: {
    MakeModuleView,
    STable
  },
  data () {
    return {
      moment,
      personRowSelected: null,
      cardHeight: 0,
      tableHeight: 0,
      listScrollHeight: 0,
      queryParam: { pageSize: 25, inputContent: null, recharge: [0, 1], flag: 1 },
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
          dataIndex: 'deptId',
          width: '11%',
          title: '部门编码'
        },
        {
          dataIndex: 'deptName',
          width: '19%',
          title: '部门',
          align: 'left'
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
          width: '11%',
          title: '操作',
          scopedSlots: { customRender: 'operation' },
          align: 'center'
        }
      ],
      makingCount: 0,
      drawerVisible: false,
      person: {},
      operation: null,
      drawerTitle: '',
      selectedRowKeys: [],
      selectedRows: [],
      isDownloading: false,
      options: [
        { label: '充餐费', value: 1 },
        { label: '无餐费', value: 0 }
      ]
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
      this.getMakeCount()
    },
    doBatchDownload () {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请先选择数据！')
        return
      }
      if (this.isDownloading) {
        return
      }
      var persons = []
      Object.assign(persons, this.selectedRows)
      persons.forEach(person => {
        person.accessControl = this.accessFilter(person.accessControl)
        person.accessControlStr = person.accessControl
      })
      var params = {}
      params.menuId = this.$route.meta.id // 菜单id
      params.context = this.$route.meta.title // 菜单名称
      params.personId = store.getters.userInfo.personId // 用户id
      params.system = 15 // 系统
      params.personIds = this.selectedRowKeys
      this.isDownloading = true
      batchCompressDownload(params).then(res => {
        const headers = res.headers
        const contentType = headers['content-type']
        if (res.data) {
          const blob = new Blob([res.data], { type: contentType })
          const contentDisposition = res.headers['content-disposition']
          let fileName = 'unknown'
          if (contentDisposition) {
            fileName = window.decodeURI(res.headers['content-disposition'].split('=')[1])
          }
          downFile(blob, fileName)
          this.isDownloading = false
        }
        this.isDownloading = false
      })
    },
    onRechargeChange (val) {
      this.queryParam.recharge = val
      this.refreshPersonTable()
      this.getMakeCount()
    },
    onFlagChange (e) {
      this.refreshPersonTable()
      this.getMakeCount()
    },
    refreshTable () {
      this.refreshPersonTable()
      this.getMakeCount()
    },
    onRowChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleWorkCard (record) {
      this.personRowSelected = record.personId
      this.person = { ...record }
      this.drawerVisible = true
      this.operation = 'make'
      this.drawerTitle = '工牌制作'
    },
    doReadWorkCard (record) {
      this.personRowSelected = record.personId
      this.person = { ...record }
      this.drawerVisible = true
      this.operation = 'read'
      this.drawerTitle = '工牌制作'
    },
    doMakeWorkCard () {
      this.$refs.personInfo.handleMake()
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
    getMakeCount () {
      getMakeCount(this.queryParam).then(res => {
        if (res.code === 200) {
          this.makingCount = res.body
        }
      })
    },
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
              index = head + '楼'
            } else {
              index = head + '楼-' + tail + '楼'
            }
            accessArray.push(index)
            head = item
            tail = item
          }
        })
        var lastEl = null
        if (head === tail) {
          lastEl = head + '楼'
        } else {
          lastEl = head + '楼-' + tail + '楼'
        }
        accessArray.push(lastEl)
        return accessArray.join(',')
      } else {
        return text
      }
    },
    initPage () {
      var currentYear = moment().year()
      this.queryParam.year = currentYear
      this.listScrollHeight = window.innerHeight - 260
      this.cardHeight = window.innerHeight - 85
      this.getMakeCount()
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
