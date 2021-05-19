<template>
  <a-card :bordered="false" :bodyStyle="{ height: cardHeight + 'px', padding: '0px 10px'}">

    <a-row>
      <a-col :span="24">
        <a-row style="padding: 10px 0; height: 52px">
          <a-col>
            <span>申请ID：</span>
              <a-input-search v-model="queryParam.applyId" @search="onSearch" allowClear placeholder="流程申请ID" style="width: 200px"></a-input-search>
            <a-divider type="vertical" />
            <span>申请人：</span>
            <person-select @change="onApplyUserChange" allow-clear></person-select>
            <a-divider type="vertical" />
            <a-radio-group v-model="queryParam.finished" @change="onStatusChange" >
              <a-radio :value="false">未完结</a-radio>
              <a-radio :value="true">已完结</a-radio>
            </a-radio-group>
            <span>
              <a @click="toggleAdvanced">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'"/>
              </a>
            </span>
            <a-button type="primary" @click="getTaskList" style="margin-left:20px">查询</a-button>
          </a-col>
        </a-row>
        <a-row style="padding-bottom: 10px; height: 42px" v-if="advanced">
          <span>待办人：</span>
          <person-select @change="onPersonChange" allow-clear style="width: 200px"></person-select>
          <a-divider type="vertical" />
          <span>接收时间：</span>
          <a-range-picker @change="onDateChange" style="width: 220px"/>
        </a-row>
        <a-table :loading="tableLoading"
                 :columns="tableColumns"
                 :dataSource="tableData"
                 :pagination="false"
                 :customRow="tableRowClick"
                 :rowKey="(record) => record.applyId + record.businessKey + record.taskId"
                 :bodyStyle="{ height: tableHeight + 'px' }"
                 :scroll="{x: false, y: tableScrollHeight }"
                 :bordered="false"
                 size="small"
                 v-watermark>
          <template slot="rowIndex" slot-scope="text, record, index">
            <span>{{ (page.pageNo - 1) * page.pageSize + index + 1 }}</span>
          </template>
        </a-table>
      </a-col>
    </a-row>
    <footer-tool-bar>
      <a-pagination :disabled="tableLoading"
                    :total="page.totalCount"
                    :pageSize.sync="page.pageSize"
                    @change="onPageChange"
                    :showTotal="total => `共 ${total} 条`"
                    style="margin-top: 10px"/>
    </footer-tool-bar>
    <a-drawer ref="modalDrawer"
              placement="right"
              :closable="false"
              :width="900"
              :bodyStyle="{padding: '0px',height: drawerHeight + 'px', overflowY:'scroll'}"
              @close="onClose"
              :visible="showDrawer">
      <a-tabs :activeKey="activeKey" @change="onTabChange" size="small">
        <a-tab-pane :key="1" tab="表单信息">
          <labor-contract-process-form :contract-info="laborContractInfo"></labor-contract-process-form>
        </a-tab-pane>
        <a-tab-pane :key="2" tab="审核信息">
          <action-record-view :action-records="actionRecordList"></action-record-view>
        </a-tab-pane>
      </a-tabs>
      <div :style="{ position: 'absolute', right: 10, bottom: 0, width: '100%', borderTop: '1px solid #e9e9e9', padding: '9px 16px', background: '#fff', textAlign: 'right', }">
        <a-button type="primary" @click="onClose">关闭</a-button>
      </div>
    </a-drawer>
  </a-card>
</template>

<script>
  import LaborContractProcessForm from "@/views/laborContract/component/LaborContractProcessForm";
  import PersonSearchSelect from "@/components/Person/PersonSearchSelect";
  import FooterToolBar from "@/components/FooterToolbar";
  import {getTaskList, getActionRecordList, getLaborContractInfo} from "@/api/laborContractProcess";
  import ActionRecordView from "@/module/workflow/ActionRecord/ActionRecordView";
  import PersonSelect from "@/module/person/PersonSelect/PersonSelect";

  const tableColumns = [
    {
      key: 'rowIndex',
      width: '5%',
      dataIndex: 'rowIndex',
      title: '序号',
      align: 'center',
      scopedSlots: { customRender: 'rowIndex' },
    },{
      key: 'processName',
      width: '15%',
      dataIndex: 'processName',
      title: '流程标题',
      className: "center-th-header",
      ellipsis: true
    },{
      key: 'applyId',
      width: '10%',
      dataIndex: 'applyId',
      title: '申请ID',
      align: 'center',
    },{
      key: 'applyUserName',
      width: '10%',
      dataIndex: 'applyUserName',
      title: '申请人',
      align: 'center',
    }, {
      key: 'processCreateTime',
      width: '15%',
      dataIndex: 'processCreateTime',
      title: '流程发起时间',
      align: 'center'
    },{
      key: 'assigneeName',
      width: '10%',
      dataIndex: 'assigneeName',
      title: '当前待办人',
      align: 'center'
    },{
      key: 'taskName',
      width: '10%',
      dataIndex: 'taskName',
      title: '当前节点',
      align: 'left'
    },{
      key: 'createTime',
      width: '15%',
      dataIndex: 'createTime',
      title: '接收时间',
      align: 'center'
    }
  ]

  export default {
    name: "LaborContractListView",
    components: {PersonSelect, ActionRecordView, PersonSearchSelect, FooterToolBar, LaborContractProcessForm},
    data() {
      return {
        drawerHeight: window.innerHeight - 51  ,
        cardHeight: window.innerHeight - 115,
        tableScrollHeight: window.innerHeight - 265,
        tableHeight: window.innerHeight - 265,
        advanced:false,
        showDrawer: false,
        tableLoading: false,
        activeKey: '1',
        selectedRow: 0,
        tableData: [],
        actionRecordList: [],//流程操作记录
        laborContractInfo: {}, //劳动合同表单信息
        queryParam: {applyId: '', applyUserId: null, personId: null, startDate: null, endDate: null, finished:false, flag: 0, pageNo: 1, pageSize: 25},
        page: {pageNo: 1, pageSize: 25, totalCount: 0},
        tableColumns,
      }
    },
    mounted() {
      this.getTaskList()
    },
    methods: {
      onSearch() {
        this.queryParam.pageNo = 1
        this.page.pageNo = 1
        this.getTaskList()
      },
      getTaskList() {
        this.tableLoading = true
        getTaskList(this.queryParam).then(res=>{
          if (res.code === 200){
            this.tableData = res.body.items
            this.page.totalCount = res.body.totalCount
            this.tableLoading = false
          }
        })
      },
      getActionRecordList(processInstanceId){
        const params = {
          'processInstanceId': processInstanceId
        }
        getActionRecordList(params).then(res=>{
          if (res.code === 200){
            this.actionRecordList = res.body
          }
        })
      },
      getLaborContractInfo(laborContractId) {
        const params = {
          'laborContractId': laborContractId
        }
        getLaborContractInfo(params).then(res=>{
          if (res.code === 200){
            this.laborContractInfo = res.body
          }
        })
      },
      onApplyUserChange(value) {
        this.queryParam.applyUserId = value
        this.onSearch()
      },
      onStatusChange (val) {
        this.queryParam.finished = val.target.value
        this.queryParam.flag = val.target.value ? 1:0
        setTimeout(() => {
          this.onSearch()
        }, 100)
      },
      onPersonChange(value) {
        this.queryParam.personId = value
        this.onSearch()
      },
      onDateChange(date, dateString) {
        if(dateString[0] === '') {
          this.queryParam.startDate = null
          this.queryParam.endDate = null
        } else {
          this.queryParam.startDate = dateString[0] + ' 00:00:00'
          this.queryParam.endDate = dateString[1] + ' 23:59:59'
        }
        this.onSearch()
      },
      toggleAdvanced () {
        this.advanced = !this.advanced
        if (this.advanced) {
          this.tableScrollHeight = window.innerHeight - 307
        } else {
          this.queryParam.endDate = null
          this.queryParam.startDate = null
          this.queryParam.personId = null
          this.tableScrollHeight = window.innerHeight - 265
        }
      },
      onPageChange(pageNo, pageSize) {
        this.page.pageNo = pageNo
        this.queryParam.pageNo = pageNo
        this.getTaskList()
      },
      onTabChange (key) {
        this.activeKey = key
      },
      onClose() {
        this.showDrawer = false
        this.activeKey = 1
      },
      setRowClassName(record) {
        return this.selectedRow === record.id + record.name ? 'selectRowStyle' : ''
      },
      tableRowClick(record) {
        return {
          on: {
            dblclick: () => {
              this.getActionRecordList(record.processInstanceId)
              this.getLaborContractInfo(record.businessKey.split(":")[1])
              this.activeKey = 1
              this.showDrawer = true
            }
          }
        }
      }
    }
  }
</script>

<style scoped>
  /deep/ .ant-table-placeholder{
    display:none;
  }
  /deep/ .selectRowStyle {
    background-color: #d5fffe;
  }
</style>