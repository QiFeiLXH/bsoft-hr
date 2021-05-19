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
            <a-input-search
              placeholder="请输入员工号/姓名/拼音简码查询"
              :allowClear="true"
              style="width: 300px;"
              v-model="queryParam.inputContent"
              @search="doQueryLactation"
              @pressEnter="doQueryLactation"/>
            <a-divider type="vertical"/>
            <a-checkbox-group :value="queryParam.status" :options="plainOptions" @change="handleStatusChange"/>
            <a-divider type="vertical"/>
            <a-button type="primary" icon="search" @click="doQueryLactation">查询</a-button>
            <a-divider type="vertical"/>
            <a-button type="primary" icon="plus-circle" @click="doCreateLactation">新增</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table
      ref="table"
      size="small"
      :rowKey="(record) => record.id"
      :columns="personalTrainColumns"
      :height="tableHeight"
      :data="loadTableList"
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
      <template slot="status" slot-scope="text">
        <a-badge :text="text | statusTextFilter" :color="text | statusFilter"/>
      </template>
      <template slot="operation" slot-scope="text, record">
        <a @click="handleRead(record)" v-if="record.status === 3">查看</a>
        <a @click="handleModify(record)" v-else>修改</a>
      </template>
    </s-table>
    <a-drawer
      :title="drawerTitle"
      :wrapStyle="{overflow: 'hidden'}"
      placement="right"
      :closable="false"
      :width="580"
      @close="onDrawerClose"
      :visible="drawerVisible"
      :bodyStyle="{ padding: '0px 0px 0px 0px' }"
    >
      <lactation-maintain-module-view :lactaionInfo="lactaionInfo" :operation="operation" @close="onDrawerClose" @refresh="doQueryLactation" v-if="drawerVisible"></lactation-maintain-module-view>
    </a-drawer>
  </a-card>
</template>

<script>
import { STable, DeptSelect } from '@/components'
import { doLoadLactationList } from '@/api/lactationMaintain'
import LactationMaintainModuleView from './component/LactationMaintainModuleView'
import moment from 'moment/moment'

const statusMap = {
  1: {
    color: 'blue',
    text: '未生效'
  },
  2: {
    color: 'green',
    text: '有效中'
  },
  3: {
    color: 'grey',
    text: '已失效'
  }
}
export default {
  name: 'LactationView',
  components: {
    STable,
    DeptSelect,
    LactationMaintainModuleView
  },
  data () {
    return {
      moment,
      cardHeight: 0,
      tableHeight: 0,
      listScrollHeight: 0,
      queryParam: { pageSize: 25, status: [1, 2, 3], inputContent: '' },
      rowSelected: '',
      pagination: { pageNumber: 1, pageSize: 25, totalCount: 1 },
      personalTrainColumns: [
        {
          dataIndex: 'rowIndex',
          width: '5%',
          title: '序号',
          scopedSlots: { customRender: 'rowIndex' }
        },
        {
          dataIndex: 'personName',
          width: '13%',
          title: '姓名'
        },
        {
          dataIndex: 'deptName',
          width: '18%',
          title: '部门'
        },
        {
          dataIndex: 'duration',
          width: '12%',
          title: '哺乳假时长'
        },
        {
          dataIndex: 'startDate',
          width: '14%',
          title: '开始时间'
        },
        {
          dataIndex: 'endDate',
          width: '14%',
          title: '结束时间'
        },
        {
          dataIndex: 'status',
          width: '12%',
          title: '状态',
          scopedSlots: { customRender: 'status' }
        },
        {
          dataIndex: 'operation',
          width: '12%',
          title: '操作',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      loadTableList: parameter => {
        return doLoadLactationList(Object.assign(parameter, this.queryParam)).then(res => {
          if (res.code === 200) {
            this.pagination.pageNumber = res.body.pageNumber + 1
            this.pagination.totalCount = res.body.totalCount
            return res.body
          }
        })
      },
      plainOptions: [
        { label: '未生效', value: 1 },
        { label: '有效中', value: 2 },
        { label: '已失效', value: 3 }
      ],
      drawerVisible: false,
      drawerTitle: '',
      lactaionInfo: {},
      operation: ''
    }
  },
  filters: {
    statusTextFilter (type) {
      return statusMap[type].text
    },
    statusFilter (type) {
      return statusMap[type].color
    }
  },
  methods: {
    handleStatusChange (val) {
      this.queryParam.status = val
      this.doQueryLactation()
    },
    doQueryLactation () {
      this.rowSelected = ''
      setTimeout(() => {
        this.$refs.table.refresh(true) // refresh() 不传参默认值 false 不刷新到分页第一页
      }, 100)
    },
    doCreateLactation () {
      this.drawerTitle = '哺乳假维护-新增'
      this.drawerVisible = true
      this.operation = 'create'
    },
    handleRead (record) {
      this.rowSelected = record.id
      this.operation = 'read'
      this.drawerTitle = '哺乳假维护(' + record.personName + ')'
      this.lactaionInfo = { ...record }
      this.drawerVisible = true
    },
    handleModify (record) {
      this.rowSelected = record.id
      this.operation = 'modify'
      this.drawerTitle = '哺乳假维护(' + record.personName + ')'
      this.lactaionInfo = { ...record }
      this.drawerVisible = true
    },
    onDrawerClose () {
      this.drawerVisible = false
      this.drawerTitle = ''
    },
    onClickRow (record, index) {
      return {
        on: {
          click: () => {
            this.rowSelected = record.id
          }
        }
      }
    },
    setCurrentRow (record, index) {
      var styleClassName = ''
      if (record.id === this.rowSelected) {
        styleClassName = 'clickRowStyle hoverRowStyle'
      }
      return styleClassName
    },
    initPage () {
      var currentYear = moment().year()
      this.queryParam.year = currentYear
      this.listScrollHeight = window.innerHeight - 270
      this.cardHeight = window.innerHeight - 85
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
