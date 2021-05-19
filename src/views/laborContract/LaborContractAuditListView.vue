<template>
  <a-card
    :bordered="false"
    :bodyStyle="{
      height:cardHeight+'px',
      padding: '0px 10px',
    }">
    <a-row style="margin-bottom: 10px;margin-top:10px;">
      <span>申请人：</span>
      <person-select v-model="queryParam.applyUserId" :allow-clear="true" @change="onApplyUserChange" style="width: 200px"></person-select>
      <a-divider type="vertical" />
      <a-radio-group v-model="queryParam.finished" @change="onStatusChange">
        <a-radio :value="false">待办</a-radio>
        <a-radio :value="true">已办</a-radio>
      </a-radio-group>
      <a-divider type="vertical" />
      <a-button type="primary" @click="getTaskList">查询</a-button>
    </a-row>
    <a-table
      ref="table"
      size="small"
      :loading="isLoading"
      :customRow="onClickRow"
      :rowClassName="setCurrentRow"
      :rowKey="(record) => record.processInstanceId + record.taskId + record.personId"
      :bordered="false"
      :columns="columns"
      :dataSource="dataList"
      :pagination="false"
      :scroll="{ y: listScrollHeight }"
      v-watermark>
      <template slot="rowIndex" slot-scope="text, record, index">
        <span>
          {{ (page.pageNo - 1) * page.pageSize + index + 1 }}
        </span>
      </template>
      <template slot="renewalDate" slot-scope="text, record, index">
        {{ text + " 至 " + record.renewalEndDate}}
      </template>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="showAudit(record)">{{record.notifyFlag === 0 && !queryParam.finished ? '审核' : '阅读'}}</a>
        </template>
      </span>
      <template slot="status" slot-scope="text, record">
        <a-badge :status="text | statusFilter" :text="text | statusTextFilter"/>
      </template>
    </a-table>
    <footer-tool-bar>
      <a-pagination
        :disabled="isLoading"
        :total="page.totalCount"
        :pageSize.sync="page.pageSize"
        v-model="page.pageNo"
        @change="onPageChange"
        :showTotal="total => `共 ${total} 条`"
        style="margin-top: 10px"/>
    </footer-tool-bar>
    <a-drawer
      ref="modalDrawer"
      placement="right"
      :closable="false"
      :width="900"
      :bodyStyle="{
          padding: '0px',
          height: drawerHeight+'px',
          overflowY:'scroll'}"
      @close="onClose"
      :visible="visible">
      <a-tabs :activeKey="activeKeyDrawer" @change="onTabChangeDrawer" size="small">
        <a-tab-pane :key="1" tab="劳动合同续签信息">
          <LaborContractAuditForm ref="auditForm"
                                  :contractInfo="contractInfo"
                                  :formAuth="formAuth"
                                  :rules="formRules"/>
        </a-tab-pane>
        <a-tab-pane :key="2" tab="审核信息">
          <ActionRecordView :actionRecords="actionRecords" :readFlag="readFlag" :finished="rowSelectedInfo.status == 1 ? false : true"></ActionRecordView>
        </a-tab-pane>
      </a-tabs>
      <div v-if="visible" :style="{ position: 'absolute', right: 10, bottom: 0, width: '100%', borderTop: '1px solid #e9e9e9', padding: '9px 16px', background: '#fff', textAlign: 'right', }">
        <a-button v-if="!queryParam.finished && rowSelectedInfo.notifyFlag == 0" htmlType="submit" @click="agree" type="primary" :disabled="saveLoading">提交</a-button>
        <a-button v-if="!queryParam.finished && rowSelectedInfo.notifyFlag == 1" htmlType="submit" @click="agreeNotify" type="primary" :disabled="saveLoading">提交</a-button>
        <a-button @click="onClose" style="margin-top: 0px; margin-left:10px" :disabled="saveLoading">关闭</a-button>
      </div>
    </a-drawer>
  </a-card>
</template>

<script>
  import {getAuditList, audit, getDetail, completeNotify} from '@/api/laborContractAudit'
  import FooterToolBar from '@/components/FooterToolbar'
  import DrawFooterToolBar from '@/components/DrawFooterToolbar';
  import ActionRecordView from "../../module/workflow/ActionRecord/ActionRecordView";
  import LaborContractAuditForm from "./component/LaborContractAuditForm"
  import moment from "moment";
  import store from "@/store";
  import PersonSelect from "@/module/person/PersonSelect/PersonSelect";
  const statusMap = {
    1: {status: 'default', text: '审核中'},
    2: {status: 'success', text: '已审核'},
    3: {status: 'error', text: '终止'}
  }
    export default {
      name: "LaborContractAuditListView",
      components: {
        PersonSelect,
        FooterToolBar,
        ActionRecordView,
        LaborContractAuditForm,
        DrawFooterToolBar
      },
      data () {
        return {
          opinion:'',
          auditLoading:false,
          saveLoading:false,
          errorShow:false,
          defaultFormAuth: {
            'renewalDate':{'hidden':'false','disabled':'true'},
            'deptAudit':{'hidden':'false','disabled':'true'},
            'areaAudit':{'hidden':'false','disabled':'true'},
            'hrAudit':{'hidden':'false','disabled':'true'}
          },
          formAuth: {
            'renewalDate':{'hidden':'false','disabled':'false'},
            'deptAudit':{'hidden':'false','disabled':'false'},
            'areaAudit':{'hidden':'false','disabled':'false'},
            'hrAudit':{'hidden':'false','disabled':'false'}
          },
          formRules: {
            signUnit: [{ required: true, message: '请选择签订单位', trigger: 'blur' }],
            quitApplyId: [{ required: true, message: '请选择离职申请单', trigger: 'blur' }],
          },
          actionRecords: [],
          readFlag:false,
          finished:false,
          activeKeyDrawer:1,
          contractInfo:{"renewalDate":[]},
          visible:false,
          drawerHeight:0,
          cardHeight:0,
          listScrollHeight:0,
          isLoading:false,
          selectedRows:[],
          selectedRowKeys:[],
          dataList:[],
          page: {pageNo: 1, pageSize: 25, totalCount: 0},
          queryParam: {applyUserId: null, flag:0, pageNo: 1, pageSize: 25 ,finished:false},
          rowSelectedInfo:{notifyFlag:0},
          columns:[
            {
            key: 'rowIndex',
            width: '5%',
            dataIndex: 'rowIndex',
            title: '序号',
            scopedSlots: { customRender: 'rowIndex' },
            align: 'center'
          },{
            key: 'personName',
            width: '10%',
            dataIndex: 'personName',
            title: '姓名',
          },{
            key: 'dept',
            width: '10%',
            dataIndex: 'dept',
            title: '所在部门',
          },{
            key: 'post',
            width: '10%',
            dataIndex: 'post',
            title: '岗位',
          },{
            key: 'endDate',
            width: '10%',
            dataIndex: 'endDate',
            title: '劳动合同到期时间',
          },{
            key: 'renewalStartDate',
            width: '10%',
            dataIndex: 'renewalStartDate',
            scopedSlots: { customRender: 'renewalDate' },
            title: '续签劳动合同的起止时间',
          },{
            key: 'status',
            width: '10%',
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' },
            title: '状态',
          },{
            key: 'action',
            width: '10%',
            scopedSlots: { customRender: 'action' },
            title: '操作',
          }]
        }
      },
      mounted() {
        this.drawerHeight = window.innerHeight - 51
        this.cardHeight = window.innerHeight - 85
        this.listScrollHeight = window.innerHeight - 265
        this.queryParam.pageNo = 1
        this.queryParam.pageSize = 25
        this.queryParam.processDefinitionKey = 'laborContract'
        this.getTaskList()
      },
      filters: {
        statusFilter(value) {
          return statusMap[value].status
        },
        statusTextFilter(value) {
          return statusMap[value].text
        }
      },
      methods:{
        moment,
        onTabChangeDrawer (key) {
          this.activeKeyDrawer = key
        },
        onClickRow (record) {
          const me = this
          return {
            on: {
              click: () => {
                me.rowSelected = record.taskId
                me.rowSelectedInfo = record
              }
            }
          }
        },
        setCurrentRow (record, index) {
          var styleClassName = '';
          if (record === this.rowSelectedInfo) {
            styleClassName = 'clickRowStyle hoverRowStyle'
          }
          return styleClassName;
        },
        onSelectChange (selectedRowKeys, selectedRows) {
          this.selectedRowKeys = selectedRowKeys
          this.selectedRows = selectedRows
        },
        onPageChange (current) {
          this.queryParam.pageNo = current;
          this.getTaskList();
        },
        onStatusChange(){
          this.queryParam.applyUserId = null;
          setTimeout(() => {
            this.getTaskList()
          }, 100)
        },
        onApplyUserChange() {
          this.page.pageNo = 1
          this.queryParam.pageNo = 1
          this.getTaskList()
        },
        getTaskList(){
          this.isLoading = true
          getAuditList(Object.assign(this.queryParam)).then(res=>{
            if (res.code === 200){
              this.dataList = []
              this.dataList = this.dataList.concat(res.body.items)
              this.page.totalCount = res.body.totalCount
            }
            this.isLoading = false
          }).catch(err=>{
            this.isLoading = false
            console.log(err)
          })
        },
        showAudit(record){
          const param = {
            taskId: record.taskId == null ? '' : record.taskId,
            processInstanceId: record.processInstanceId,
            id: record.id
          }
          getDetail(Object.assign(param)).then(res=>{
            if (res.code === 200){
              console.log(res.body)
              this.contractInfo = res.body.detail;
              this.contractInfo.taskDefineKey = record.taskDefineKey
              this.contractInfo.taskId = record.taskId
              this.contractInfo.notifyFlag = record.notifyFlag
              this.actionRecords = res.body.actionRecord
              if(this.contractInfo.deptAudit != 1 && this.contractInfo.deptAudit != 2 && this.contractInfo.notifyFlag == 0){
                this.contractInfo.deptAudit = 1
              }
              if(this.contractInfo.renewalYear == null){
                this.contractInfo.renewalYear = 5
              }

              let reg=new RegExp("'",'g')//g代表全部
              if (res.body.auth == null) {
                this.formAuth = Object.assign(this.formAuth,this.defaultFormAuth)
              } else{
                let auth =res.body.auth[0].param.replace(reg,'"');
                this.formAuth = Object.assign(this.formAuth, JSON.parse(auth));//将字符串转换成json对象
              }
              /*if (this.formAuth.deptAudit.hidden == 'false' && this.formAuth.deptAudit.disabled == 'false') {
                this.contractInfo.deptAuditor = store.getters.userInfo.personId
                this.contractInfo.deptAuditorName = store.getters.userInfo.personName
                this.contractInfo.deptAuditDate = moment().format('YYYY-MM-DD')
              }
              if (this.formAuth.areaAudit.hidden == 'false' && this.formAuth.areaAudit.disabled == 'false') {
                this.contractInfo.dealPerson = store.getters.userInfo.personId
                this.contractInfo.dealPersonName = store.getters.userInfo.personName
                this.contractInfo.dealDate = moment().format('YYYY-MM-DD')
              }
              if (this.formAuth.hrAudit.hidden == 'false' && this.formAuth.hrAudit.disabled == 'false') {
                this.contractInfo.hrAuditor = store.getters.userInfo.personId
                this.contractInfo.hrAuditorName = store.getters.userInfo.personName
                this.contractInfo.hrAuditDate = moment().format('YYYY-MM-DD')
              }*/

              if (this.formAuth.areaAudit.disabled == 'false') {
                if (this.contractInfo.deptAudit == 1) {
                  this.formRules = {
                    signUnit: [{ required: true, message: '请选择签订单位', trigger: 'blur' }],
                    quitApplyId: [{ required: false, message: '请选择离职申请单', trigger: 'blur' }],
                  }
                } else if(this.contractInfo.deptAudit == 2) {
                  this.formRules = {
                    signUnit: [{ required: false, message: '请选择签订单位', trigger: 'blur' }],
                    quitApplyId: [{ required: true, message: '请选择离职申请单', trigger: 'blur' }],
                  }
                }
              } else {
                this.formRules = {
                  signUnit: [{ required: false, message: '请选择签订单位', trigger: 'blur' }],
                  quitApplyId: [{ required: false, message: '请选择离职申请单', trigger: 'blur' }],
                }
              }
              console.log(this.formAuth)
              console.log(this.formRules)
              console.log(this.contractInfo)
            }
            this.activeKeyDrawer = 1
            this.visible = true
          }).catch(err=>{
            console.log(err)
          })
        },
        onClose(){
          this.visible = false;
        },
        checkData(){
          let checkResult = false
          this.$refs.auditForm.$refs.LaborContractAuditForm.validate(valid => {
            if (valid) {
              checkResult = true
            }
          })
          return checkResult
        },
        agree(){
          const auditVO = {}
          auditVO.processInstanceId = this.contractInfo.processInstanceId
          auditVO.laborContractApplyVO = this.contractInfo;
          auditVO.taskAuditVO = {
            taskId:this.contractInfo.taskId
          }
          if(!this.checkData()){
            return
          }
          console.log(111)
          //return
          this.saveLoading = true
          audit(Object.assign(auditVO)).then(res=>{
            if (res.code === 200){
              this.getNextTaskList();
              this.$message.success('审核成功')
              this.saveLoading = false
            }
          }).catch(err=>{
            console.log(err)
          })
        },
        agreeNotify() {
          if (this.contractInfo.notifyFlag === 1) {
            const params = {'taskId':this.contractInfo.taskId}
            this.saveLoading = true
            completeNotify(params).then(res=>{
              if (res.code == 200) {
                this.$message.success('提交成功')
                this.saveLoading = false
                this.visible=false
                this.getTaskList()
              }
            })
          }
        },
        getNextTaskList(){
          this.isLoading = true
          getAuditList(Object.assign(this.queryParam)).then(res=>{
            this.isLoading = false
            if (res.code === 200){
              this.dataList = []
              this.dataList = this.dataList.concat(res.body.items)
              this.page.totalCount = res.body.totalCount
              if(this.dataList.length > 0){
                var record = this.dataList[0]
                if(record.notifyFlag === 1) {
                  this.visible = false
                  return
                }
                this.rowSelected = record.taskId
                this.rowSelectedInfo = record
                this.showAudit(record);
              }else{
                this.visible = false;
              }
            }

          })
        },
      }

    }
</script>

<style scoped>

</style>