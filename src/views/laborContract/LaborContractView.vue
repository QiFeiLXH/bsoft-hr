<template>
  <a-card :bordered="false" :bodyStyle="{ height: cardHeight + 'px', padding: '0px 10px'}">

    <a-row>
      <a-col :span="24">
        <a-row style="padding: 10px 0; height: 52px">
          <a-col>
            <span>部门：</span>
<!--            <dept-select v-model="queryParam.dept" @change="onDeptChange" style="width: 200px" placeholder="部门简拼检索"></dept-select>-->
            <memory-dept-select style="width:200px;" :storageKey="'LaborContractView_deptUseful_01'" ref="dept" v-model="queryParam.dept" :disabled="false"  @change="onDeptChange"></memory-dept-select>
            <a-divider type="vertical" />
            <span>姓名：</span>
            <person-select v-model="queryParam.personId" @change="onPersonChange" :allow-clear="true" style="width: 200px"></person-select>
            <a-divider type="vertical" />
            <a-radio-group v-model="queryParam.flag" @change="onFlagChange" >
              <a-radio value="0">在职</a-radio>
              <a-radio value="1">离职</a-radio>
            </a-radio-group>
            <a-button type="primary" @click="getLaborContractList" style="margin-left:20px">查询</a-button>
          </a-col>
        </a-row>
        <a-table :loading="tableLoading"
                 :columns="tableColumns"
                 :dataSource="tableData"
                 :pagination="false"
                 :customRow="tableRowClick"
                 :rowKey="(record) => record.id"
                 :bodyStyle="{ height: tableHeight + 'px' }"
                 :scroll="{x: false, y: tableScrollHeight }"
                 :bordered="false"
                 size="small"
                 v-watermark>
          <template slot="rowIndex" slot-scope="text, record, index">
            <span>{{ (page.pageNo - 1) * page.pageSize + index + 1 }}</span>
          </template>
          <template slot="personName" slot-scope="text, record, index">
            <span v-if="record.flag == 1" style="color: red">{{ text  }}</span>
            <span v-else>{{ text  }}</span>
          </template>
          <template slot="renewalFlag" slot-scope="text, record, index">
            <span>{{ text == 1 ? '续签' : '首签' }}</span>
          </template>
          <template slot="renewalDate" slot-scope="text, record, index">
            {{ record.renewalStartDate + " 至 " + record.renewalEndDate}}
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
              title="劳动合同详情"
              :width="900"
              :bodyStyle="{padding: '0px',height: drawerHeight + 'px', overflowY:'scroll'}"
              @close="onClose"
              :visible="showDrawer">
        <labor-contract-form ref="detail" :contract-info="currentRecord"></labor-contract-form>
      <div :style="{ position: 'absolute', right: 10, bottom: 0, width: '100%', borderTop: '1px solid #e9e9e9', padding: '9px 16px', background: '#fff', textAlign: 'right', }">
        <a-button type="primary" style="margin-right: 20px" @click="onClose">关闭</a-button>
      </div>
    </a-drawer>
  </a-card>
</template>

<script>
  import LaborContractForm from "@/views/laborContract/component/LaborContractDetailForm";
  import PersonSelect from "@/module/person/PersonSelect/PersonSelect";
  import FooterToolBar from "@/components/FooterToolbar/FooterToolBar"
  import DeptSelect from "@/components/Dept/DeptSelect";
  import {getLaborContractList} from "@/api/laborContract";
  import MemoryDeptSelect from "../../components/MemorySelect/MemoryDeptSelect";

  const tableColumns = [
    {
      key: 'rowIndex',
      dataIndex: 'rowIndex',
      title: '序号',
      width: '5%',
      align: 'center',
      ellipsis: true,
      scopedSlots: { customRender: 'rowIndex' },
    },{
      key: 'personId',
      dataIndex: 'personId',
      title: '工号',
      width: '10%',
      align: 'center',
      ellipsis: true,
      scopedSlots: { customRender: 'personId' },
    },{
      key: 'personName',
      dataIndex: 'personName',
      title: '姓名',
      width: '10%',
      align: 'center',
      ellipsis: true,
      scopedSlots: { customRender: 'personName' },
    },{
      key: 'renewalFlag',
      dataIndex: 'renewalFlag',
      title: '首续签',
      width: '10%',
      align: 'center',
      ellipsis: true,
      scopedSlots: { customRender: 'renewalFlag' },
    },{
      key: 'deptName',
      dataIndex: 'deptName',
      title: '部门',
      width: '15%',
      align: 'left',
      ellipsis: true,
    },{
      key: 'signUnitName',
      dataIndex: 'signUnitName',
      title: '签订单位',
      width: '20%',
      align: 'left',
      ellipsis: true,
    },{
      key: 'renewalDate',
      width: '20%',
      dataIndex: 'renewalDate',
      title: '劳动合同起止时间',
      align: 'left',
      ellipsis: true,
      scopedSlots: { customRender: 'renewalDate' },
    },{
      key: 'dealPersonName',
      width: '10%',
      dataIndex: 'dealPersonName',
      title: '经办人',
      align: 'center',
      ellipsis: true,
    }
  ]

  export default {
    name: "LaborContractView",
    components: {DeptSelect, PersonSelect, FooterToolBar, LaborContractForm,MemoryDeptSelect},
    data() {
      return {
        drawerHeight: window.innerHeight - 105  ,
        cardHeight: window.innerHeight - 115,
        tableScrollHeight: window.innerHeight - 265,
        tableHeight: window.innerHeight - 265,
        advanced:false,
        showDrawer: false,
        tableLoading: false,
        activeKey: '1',
        selectedRow: 0,
        currentRecord: {},
        personalList: [],
        tableData: [],
        actionRecordList: [],//流程操作记录
        laborContractInfo: {}, //劳动合同表单信息
        queryParam: {personId: null, dept: null, flag:'0', pageNo: 1, pageSize: 25},
        page: {pageNo: 1, pageSize: 25, totalCount: 0},
        tableColumns,
      }
    },
    mounted() {
      this.onSearch()
    },
    methods: {
      onSearch() {
        this.queryParam.pageNo = 1
        this.page.pageNo = 1
        this.getLaborContractList()
      },
      getLaborContractList() {
        this.tableLoading = true
        getLaborContractList(this.queryParam).then(res=>{
          if (res.code === 200){
            this.tableData = res.body.items
            this.page.totalCount = res.body.totalCount
            this.tableLoading = false
          }
        })
      },
      onDeptChange(value) {
        this.queryParam.dept = value
        this.onSearch()
      },
      onPersonChange(value) {
        this.queryParam.personId = value
        this.onSearch()
      },
      onFlagChange (val) {
        this.queryParam.flag = val.target.value
        setTimeout(() => {
          this.onSearch()
        }, 100)
      },
      onPageChange(pageNo, pageSize) {
        this.page.pageNo = pageNo
        this.queryParam.pageNo = pageNo
        this.getLaborContractList()
      },

      onClose() {
        this.showDrawer = false
        this.activeKey = 1
      },
      tableRowClick(record) {
        return {
          on: {
            dblclick: () => {
              this.currentRecord = record
              this.showDrawer = true
              this.$nextTick(() => {
                this.$refs.detail.getLaborContractDetail(record.personId)
              })
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