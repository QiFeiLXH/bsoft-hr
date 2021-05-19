<template>
  <a-card :bordered="false" :bodyStyle="{ height: cardHeight + 'px', padding: '0px 10px'}">
    <a-row style="margin-bottom: 10px;margin-top:10px;">
      <a-month-picker style="width: 100px" @change="onStartEndDateChange" placeholder="选择考勤月份" :default-value="moment(new Date(), 'YYYY-MM')"/>
      <a-divider type="vertical" />
      <dept-select-with-person v-model="queryParams.dept" @change="handleDeptChange" style="width:130px;margin-left: 0px" placeholder="按部门查询" :logout=logout :all="all"></dept-select-with-person>
      <a-checkbox @change="onChange" style="margin-left:15px">含注销</a-checkbox>
      <a-divider type="vertical" />
      <a-input-search placeholder="工号/姓名(拼音码)"
                      v-model="queryParams.inputContent"
                      style="width: 135px"
                      :allowClear="true"
                      @search="doQuery"
      />
      <a-divider type="vertical" />
      <a-button type="primary" icon="search" style="margin-left:5px" @click="doQuery">查询</a-button>
      <a-button type="primary" icon="cloud-sync" style="margin-left:5px" @click="doCount" :loading="countloading" v-action:4>统计</a-button>
      <a-button type="primary" icon="check" style="margin-left:5px" @click="doSave" :disabled="tableData <= 0" :loading="commitloading" v-action:4>提交</a-button>
      <a-button type="primary" icon="undo" style="margin-left:5px" @click="doBack" :disabled="selectedRowKeys.length <= 0" v-action:2 :loading="backloading">退回</a-button>
      <a-button type="primary" style="margin-left:5px" v-action:1 @click="doExport" :loading="exportloading" icon="file-excel">导出已提交</a-button>
      <a-modal v-model="saveVisible" title="提醒" @ok="handleSaveOk" @cancel="handleSaveCancel">
        <p>提交考勤信息后不能再对考勤进行维护, 确认提交该{{page.totalCount}}条考勤信息吗?</p>
      </a-modal>
      <a-modal v-model="backVisible" title="提醒" @ok="handleBackOk" @cancel="handleBackCancel">
        <p>是否确认要退回该{{this.selectedRowKeys.length}}条考勤信息吗?</p>
      </a-modal>
    </a-row>
    <a-table
      v-watermark
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange
      }"
      :loading="queryloading"
      :columns="Columns"
      :dataSource="tableData"
      :pagination="false"
      :customRow="onClickRow"
      :rowClassName="setCurrentRow"
      :rowKey="(record) => record.personId"
      :bodyStyle="{ height: tableHeight + 'px' }"
      :scroll="{x: 1650, y: tableScrollHeight }"
      :bordered="false"
      size="small">
      <template slot="personName" slot-scope="text,record">
        <div v-if="record.abnormalDay != null">
          <a-tooltip>
            <template slot="title">
              {{ record.abnormalDay }} 考勤异常！
            </template>
            {{ text }} <a-icon type="warning" style="color: red"/>
          </a-tooltip>
        </div>
        <div v-else>
          {{ text }}
        </div>
      </template>
      <template slot="sdbz" slot-scope="text">
        <a-checkbox :checked="text>0" disabled=""></a-checkbox>
      </template>
      <template slot="ts1" slot-scope="text">
        {{ text | NemberFormatNotMoney }}
      </template>
      <template slot="ts2" slot-scope="text">
        {{ text | NemberFormatNotMoney }}
      </template>
      <template slot="ts3" slot-scope="text">
        {{ text | NemberFormatNotMoney }}
      </template>
      <template slot="ts4" slot-scope="text">
        {{ text | NemberFormatNotMoney }}
      </template>
      <template slot="ts5" slot-scope="text">
        {{ text | NemberFormatNotMoney }}
      </template>
      <template slot="ts6" slot-scope="text">
        {{ text | NemberFormatNotMoney }}
      </template>
      <template slot="ts7" slot-scope="text">
        {{ text | NemberFormatNotMoney }}
      </template>
      <template slot="ts8" slot-scope="text">
        {{ text | NemberFormatNotMoney }}
      </template>
      <template slot="ts9" slot-scope="text">
        {{ text | NemberFormatNotMoney }}
      </template>
      <template slot="ts10" slot-scope="text">
        {{ text | NemberFormatNotMoney }}
      </template>
      <template slot="ts11" slot-scope="text">
        {{ text | NemberFormatNotMoney }}
      </template>
      <template slot="ts12" slot-scope="text">
        {{ text | NemberFormatNotMoney }}
      </template>
      <template slot="ts13" slot-scope="text">
        {{ text | NemberFormatNotMoney }}
      </template>
      <template slot="ts14" slot-scope="text">
        {{ text | NemberFormatNotMoney }}
      </template>
      <template slot="ts15" slot-scope="text">
        {{ text | NemberFormatNotMoney }}
      </template>
      <template slot="ts16" slot-scope="text">
        {{ text | NemberFormatNotMoney }}
      </template>
      <template slot="ts17" slot-scope="text">
        {{ text | NemberFormatNotMoney }}
      </template>
      <template slot="ts19" slot-scope="text">
        {{ text | NemberFormatNotMoney }}
      </template>
    </a-table>
    <footer-tool-bar>
      <div style="margin-left:250px" slot="extra">
        <div style="color: red;">
          <span>1、查询考勤信息时需要先统计，再查询。2、提交之后不能再对考勤进行维护，需先退回。3、修改考勤之后需要重新统计。</span>
        </div>
      </div>
      <a-pagination
        :disabled="queryloading"
        :total="page.totalCount"
        :pageSize.sync="page.pageSize"
        v-model="page.pageNo"
        @change="onPageChange"
        :showTotal="total => `共 ${total} 条`"
        style="margin-top: 10px"/>
    </footer-tool-bar>
    <a-drawer
      title="明细"
      placement="right"
      :closable="false"
      :visible="visible"
      @close="onClose"
      width="800px"
      :bodyStyle="{ padding: '0px 0px 0px 0px' }"
    >
      <a-table
        v-watermark
        :columns="detailColumns"
        :dataSource="detailTableData"
        :pagination="false"
        :customRow="onDetailClickRow"
        :rowClassName="setDetailCurrentRow"
        :rowKey="(record) => record.attendanceDate"
        :bodyStyle="{ height: detailtableHeight + 'px' }"
        :scroll="{y: detailtableScrollHeight }"
        :bordered="false"
        size="small">
        <template slot="goWorkTime" slot-scope="text">
          {{ text != null ?text.substr(11,8) : '' }}
        </template>
        <template slot="offWorkTime" slot-scope="text">
          {{ text != null ?text.substr(11,8) : ''}}
        </template>
        <template slot="attendanceNotes" slot-scope="text">
          <a-tooltip>
            <template slot="title">
              {{ text }}
            </template>
            {{ text }}
          </a-tooltip>
        </template>
      </a-table>
      <div
        :style="{
              position: 'absolute',
              right: 10,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '9px 16px',
              background: '#fff',
              textAlign: 'right',
            }"
      >
        <a-button style="margin-left: 10px" @click="doCloseDetail">关闭</a-button>
      </div>
    </a-drawer>
  </a-card>
</template>

<script>
  import { queryAttendenceAbnormal,queryAttendenceCount,generAttendenceCount,doCommitAttendence,doBackAttendence,exportAttendenceInfo,queryAttendenceCountDetail } from '../../api/attendanceStatistics'
  import DeptSelectWithPerson from '../../components/Dept/DeptSelectWithPerson'
  import FooterToolBar from '@/components/FooterToolbar'
  import moment from 'moment';
  import { downFile } from '@/utils/util'
  import store from '@/store'
  const permissions = store.getters.roles.permissions
  import { getLastDay } from '../../utils/util'
  export default {
    name: "AttendanceStatisticsView",
    components: {
      DeptSelectWithPerson,
      FooterToolBar
    },
    data(){
      return{
        abnormalList:[],
        backVisible:false,
        logout:'0',
        all :0,
        visible:false,
        queryloading:false,
        backloading:false,
        exportloading:false,
        commitloading:false,
        countloading:false,
        flag:1,
        selectedRow:null,
        detailSelectedRow:null,
        selectedRowKeys:[],
        tableData:[],
        detailTableData:[],
        detailColumns:[
          {
            key: 'personName',
            width: '10%',
            dataIndex: 'personName',
            title: '姓名',
            align: 'center'
          },
          {
            key: 'attendanceDate',
            width: '10%',
            dataIndex: 'attendanceDate',
            title: '考勤日期',
            align: 'center'
          },
          {
            key: 'goWorkTime',
            width: '10%',
            dataIndex: 'goWorkTime',
            title: '上班时间',
            align: 'center',
            scopedSlots: { customRender: 'goWorkTime' },
          },
          {
            key: 'offWorkTime',
            width: '10%',
            dataIndex: 'offWorkTime',
            title: '下班时间',
            align: 'center',
            scopedSlots: { customRender: 'offWorkTime' },
          },
          {
            key: 'attendanceTypeAmText',
            width: '10%',
            dataIndex: 'attendanceTypeAmText',
            title: '上午出勤',
            align: 'center'
          },
          {
            key: 'attendanceTypeBmText',
            width: '10%',
            dataIndex: 'attendanceTypeBmText',
            title: '下午出勤',
            align: 'center'
          },
          {
            key: 'attendanceNotes',
            width: '20%',
            dataIndex: 'attendanceNotes',
            title: '考勤说明',
            align: 'left',
            ellipsis:true,
            scopedSlots: { customRender: 'attendanceNotes' },
          },
        ],
        Columns:[
          {
            key: 'deptName',
            width: 150,
            dataIndex: 'deptName',
            title: '部门名称',
            fixed: 'left',
            align: 'left',
          },
          {
            key: 'personName',
            width: 100,
            dataIndex: 'personName',
            title: '姓名',
            fixed: 'left',
            align: 'center',
            scopedSlots: { customRender: 'personName' },
          },
          {
            key: 'personId',
            width: 100,
            dataIndex: 'personId',
            title: '工号',
            fixed: 'left',
            align: 'center',
          },
          {
            key: 'sdbz',
            width: 50,
            dataIndex: 'sdbz',
            title: '提交',
            fixed: 'left',
            align: 'center',
            scopedSlots: { customRender: 'sdbz' },
          },
          {
            key: 'attendAnceCountDays',
            width: 100,
            dataIndex: 'attendAnceCountDays',
            title: '考勤天数',
            fixed: 'left',
            align: 'center'
          },
          {
            key: 'ts1',
            width: 100,
            dataIndex: 'ts1',
            title: '正常出勤',
            align: 'center',
            scopedSlots: { customRender: 'ts1' },
          },
          {
            key: 'ts2',
            width: 100,
            dataIndex: 'ts2',
            title: '出差',
            align: 'center',
            scopedSlots: { customRender: 'ts2' },
          },
          {
            key: 'ts3',
            width: 100,
            dataIndex: 'ts3',
            title: '迟到',
            align: 'center',
            scopedSlots: { customRender: 'ts3' },
          },
          {
            key: 'ts4',
            width: 100,
            dataIndex: 'ts4',
            title: '早退',
            align: 'center',
            scopedSlots: { customRender: 'ts4' },
          },
          {
            key: 'ts5',
            width: 100,
            dataIndex: 'ts5',
            title: '旷工',
            align: 'center',
            scopedSlots: { customRender: 'ts5' },
          },
          {
            key: 'ts6',
            width: 100,
            dataIndex: 'ts6',
            title: '事假',
            align: 'center',
            scopedSlots: { customRender: 'ts6' },
          },
          {
            key: 'ts7',
            width: 100,
            dataIndex: 'ts7',
            title: '病假',
            align: 'center',
            scopedSlots: { customRender: 'ts7' },
          },
          {
            key: 'ts8',
            width: 100,
            dataIndex: 'ts8',
            title: '丧假',
            align: 'center',
            scopedSlots: { customRender: 'ts8' },
          },
          {
            key: 'ts9',
            width: 100,
            dataIndex: 'ts9',
            title: '婚假',
            align: 'center',
            scopedSlots: { customRender: 'ts9' },
          },
          {
            key: 'ts10',
            width: 100,
            dataIndex: 'ts10',
            title: '产假',
            align: 'center',
            scopedSlots: { customRender: 'ts10' },
          },
          {
            key: 'ts11',
            width: 100,
            dataIndex: 'ts11',
            title: '护理假',
            align: 'center',
            scopedSlots: { customRender: 'ts11' },
          },
          {
            key: 'ts12',
            width: 100,
            dataIndex: 'ts12',
            title: '调休',
            align: 'center',
            scopedSlots: { customRender: 'ts12' },
          },
          {
            key: 'ts13',
            width: 100,
            dataIndex: 'ts13',
            title: '年休',
            align: 'center',
            scopedSlots: { customRender: 'ts13' },
          },
          {
            key: 'ts16',
            width: 100,
            dataIndex: 'ts16',
            title: '离职',
            align: 'center',
            scopedSlots: { customRender: 'ts16' },
          },
          {
            key: 'ts17',
            width: 100,
            dataIndex: 'ts17',
            title: '产检假',
            align: 'center',
            scopedSlots: { customRender: 'ts17' },
          },
          {
            key: 'ts19',
            width: 100,
            dataIndex: 'ts19',
            title: '长病假',
            align: 'center',
            scopedSlots: { customRender: 'ts19' },
          },
          {
            key: 'abnormalDay',
            width: 100,
            dataIndex: 'abnormalDay',
            title: '异常考勤',
            align: 'left',
          }
        ],
        saveVisible:false,
        page: { pageNo: 1, pageSize: 25, totalCount: 0 },
        queryParams:{
          pageNo: 1,
          pageSize: 25,
          startDate: null,
          endDate: null,
          dept:"全部",
          inputContent:"",
          all:0
        }
      }
    },
    computed:{
      cardHeight(){
        return window.innerHeight - 115;
      },
      tableHeight(){
        return window.innerHeight - 260;
      },
      tableScrollHeight(){
        return window.innerHeight - 260;
      },
      detailtableHeight(){
        return window.innerHeight - 148;
      },
      detailtableScrollHeight(){
        return window.innerHeight - 148;
      }
    },
    mounted() {
      this.selectedRowKeys = []
      this.selectedRow = null
      this.getUserPermissions()
      var start = moment(new Date()).format('YYYY-MM') + '-01'
      this.queryParams.startDate = moment(new Date(start)).format('YYYY-MM-DD')
      var end = getLastDay(start)
      this.queryParams.endDate = moment(new Date(end)).format('YYYY-MM-DD')
    },
    methods:{
      onSelectChange(selectedRowKeys, selectedRows,event){
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      doCloseDetail(){
        this.visible = false
      },
      onChange(e){
        if (e.target.checked){
          this.logout = ''
        }else{
          this.logout = '0'
        }
      },
      getUserPermissions () {
        if (permissions.length > 0) {
          for (let i = 0; i < permissions.length; i++) {
            if (permissions[i].permissionId === this.$route.meta.permission) {
              if (permissions[i].actionList.includes('3')) {
                this.queryParams.all = 1
                this.all = 1
              }
            }
          }
        }
      },
      moment,
      showDrawer(personId) {
        this.detailTableData = []
        this.visible = true
        const params = {}
        params.personId = personId
        params.startDate = this.queryParams.startDate
        params.endDate = this.queryParams.endDate
        params.type = "全部"
        queryAttendenceCountDetail(params).then(res=>{
          if(res.code === 200){
            this.detailTableData = this.detailTableData.concat(res.body)
          }
        }).catch(err=>{
          console.log(err)
        })
      },
      onClose() {
        this.visible = false;
      },
      handleDeptChange (val) {
        if(val == undefined || val == null){
          this.queryParams.dept = '全部'
        }else{
          this.queryParams.dept = val
        }
        this.doQuery()
      },
      doExport(){
        const params = {}
        Object.assign(params, this.queryParams)
        params.menuId = this.$route.meta.id // 菜单id
        params.context = this.$route.meta.title // 菜单名称
        params.personId = store.getters.userInfo.personId // 用户id
        params.system = 15 // 系统
        this.exportloading = true
        exportAttendenceInfo(params).then(res => {
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
          }
          setTimeout(()=>{
            this.exportloading = false
          },500)
        }).catch(error => {
          console.log(error)
          setTimeout(()=>{
            this.exportloading = false
          },500)
        })
      },
      handleBackCancel(){
        this.backVisible = false
      },
      handleBackOk(){
        this.backloading = true
        var params = {
          'month':this.queryParams.startDate,
          'personIds':this.selectedRowKeys
        }
        doBackAttendence(params).then(res=>{
          if(res.code == 200){
            this.$message.success("已选择人员的考勤信息已退回，可进行维护！")
            this.getAttendenceCount()
          }
          setTimeout(()=>{
            this.backloading = false
            this.backVisible = false
          },500)
        }).catch(err=>{
          setTimeout(()=>{
            this.backloading = false
            this.backVisible = false
          },500)
          console.log(err)
        })
      },
      doBack(){
        if (this.selectedRowKeys.length <= 0){
          this.$message.warn("请选择需要退回的考勤信息！")
          return
        }
        this.backVisible = true
      },
      doCommit(){
        this.commitloading = true
        doCommitAttendence(this.queryParams).then(res=>{
          if (res.code === 200){
            this.$message.success("考勤统计信息提交成功！")
            this.doQuery()
          }
          setTimeout(()=>{
            this.commitloading = false
          },500)
        }).catch(err=>{
          setTimeout(()=>{
            this.commitloading = false
          },500)
          console.log(err)
        })
        setTimeout(()=>{
          this.commitloading = false
        },500)
      },
      handleSaveOk(){
        this.saveVisible = false
        this.doCommit()
      },
      handleSaveCancel(){
        this.saveVisible = false
      },
      // handleAbnormalCancel(){
      //   this.AbnormalVisible = false
      //   this.abnormalList = []
      // },
      onPageChange (current) {
        this.page.pageNo = current
        this.queryParams.pageNo = current
        this.getAttendenceCount()
      },
      onClickRow (record, index) {
        return {
          on: {
            click: () => {
              this.selectedRow = record.personId
            },
            dblclick: (event) => {
              this.showDrawer(record.personId)
            }
          }
        }
      },
      setCurrentRow (record, index) {
        var styleClassName = ''
        if (record.personId === this.selectedRow) {
          styleClassName = 'clickRowStyle hoverRowStyle'
        }
        return styleClassName
      },
      onDetailClickRow(record, index){
        return {
          on: {
            click: () => {
              this.detailSelectedRow = record.attendanceDate
            },
          }
        }
      },
      setDetailCurrentRow (record, index) {
        var styleClassName = ''
        if (record.attendanceDate === this.detailSelectedRow) {
          styleClassName = 'clickRowStyle hoverRowStyle'
        }
        return styleClassName
      },
      doQuery(){
        this.page.pageNo = 1
        this.queryParams.pageNo = 1
        this.getAttendenceCount()
      },
      getAttendenceCount(){
        if (this.queryParams.startDate == null || this.queryParams.endDate == null){
          this.$message.error("请先选择需要查询的月份!")
          return
        }
        this.queryloading = true
        queryAttendenceCount(this.queryParams).then(res=>{
          if(res.code === 200){
            this.selectedRowKeys = []
            this.selectedRow = null
            this.tableData = []
            this.tableData = this.tableData.concat(res.body.items)
            this.page.totalCount = res.body.totalCount
          }
          setTimeout(()=>{
            this.queryloading = false
          },500)
        }).catch(err=>{
          setTimeout(()=>{
            this.queryloading = false
          },500)
          console.log(err)
        })
      },
      doCount(){
        if (this.queryParams.startDate == null || this.queryParams.endDate == null){
          this.$message.error("请先选择需要统计的月份!")
          return
        }
        this.countloading = true
        generAttendenceCount(this.queryParams).then(res=>{
          if(res.code == 200){
            this.$message.success("考勤统计生成成功！")
            this.doQuery()
            // this.getAttendenceAbnormal()
          }
          setTimeout(()=>{
            this.countloading = false
          },500)
        }).catch(err=>{
          console.log(err)
          setTimeout(()=>{
            this.countloading = false
          },500)
        })
        setTimeout(()=>{
          this.countloading = false
        },500)
      },
      doSave(){
        queryAttendenceAbnormal(this.queryParams).then(res=>{
          if(res.code === 200){
            if(res.body.length > 0){
              this.abnormalList = []
              this.abnormalList = this.abnormalList.concat(res.body)
              this.warning()
              return
            }else{
              this.saveVisible = true
            }
          }
        }).catch(err=>{
          console.log(err)
        })
      },
      warning() {
        const panes = this.abnormalList.map(item => {
          const personName = item.personName
          const rq = item.rq
          return (
            <p>{personName}： <span style="color:red">{rq}</span> 考勤异常；</p>
          )
        })
        this.$warning({
          title: '异常考勤提醒',
          content: (
            <div>
              <p>以下员工考勤存在异常，无法提交!</p>
              {panes}
            </div>
          )
        });
      },
      initItem(){
        for (var i=0;i<this.abnormalList.length;i++){

        }
      },
      onStartEndDateChange(date, dateString){
        if(dateString === '') {
          this.queryParams.startDate = null
          this.queryParams.endDate = null
        } else {
          this.queryParams.startDate = dateString + '-01'
          var end = getLastDay(dateString + '-01')
          this.queryParams.endDate = moment(new Date(end)).format('YYYY-MM-DD')
          this.doQuery()
        }
      },
    }
  }
</script>

<style lang="less" scoped>
/*/deep/ .ant-table-fixed-left table, .ant-table-fixed-right table {*/
/*    width: auto;*/
/*    background: #fff0;*/
/*  }*/
</style>