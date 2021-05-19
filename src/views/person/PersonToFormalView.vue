<template>
  <a-card :bordered="false" :bodyStyle="{ height: cardHeight + 'px', padding: '0px 10px'}">
    <a-layout>
      <a-layout-header style="background: #fff;">
        <span style="margin-left:-50px">年份：</span>
        <a-input-number v-model="year" @change="onYearChange" placeholder="年份"/>
        <a-divider type="vertical" />
        <dept-select v-model="queryParams.dept" style="width:150px;margin-left: 20px" placeholder="按部门查询"
                     @change="doQuery"></dept-select>
        <a-divider type="vertical" />
        <a-input-search placeholder="工号/姓名(拼音码)"
                        v-model="queryParams.inputContent"
                        style="width: 180px"
                        :allowClear="true"
                        @search="doQuery"
        />
        <a-radio-group style="margin-left:10px;" name="radioGroup" v-model="queryParams.flag" @change="doQuery">
          <a-radio :value="1">
            未申请
          </a-radio>
          <a-radio :value="2">
            办理中
          </a-radio>
          <a-radio :value="3">
            已通过
          </a-radio>
          <a-radio :value="0">
            全部
          </a-radio>
        </a-radio-group>
        <a-button type="primary" icon="search" style="margin-left:5px" @click="getMonthCount">刷新</a-button>
      </a-layout-header>
      <a-layout>
      <a-layout-sider width="245" style="background: #fff">
        <a-table
          :loading="leftLoading"
          :showHeader="false"
          :columns="LeftColumns"
          :dataSource="leftData"
          :pagination="false"
          :customRow="onLeftClickRow"
          :rowClassName="setLeftCurrentRow"
          :rowKey="(record) => record.month"
          :bodyStyle="{ height: lefttableHeight + 'px' }"
          :bordered="false"
          size="small">
          <template slot="month" slot-scope="text, record, index">
            <span v-if="text.substr(4,2) == '全部'">
              {{ "全部  (已转正 " + record.hasToFormal + "人/应转正 " + record.need + "人)" }}
            </span>
            <span v-else>
              {{text +  "  (" + record.hasToFormal + "/" + record.need + "人)" }}
            </span>
          </template>
        </a-table>
      </a-layout-sider>
      <a-layout-content style="background: #fff;margin-left: 0px">
        <a-table
          v-watermark
          :loading="rightLoading"
          :columns="RightColumns"
          :dataSource="rightData"
          :pagination="false"
          :customRow="onRightClickRow"
          :rowClassName="setRightCurrentRow"
          :rowKey="(record) => record.personId"
          :bodyStyle="{ height: tableHeight + 'px' }"
          :scroll="{y: tableScrollHeight }"
          :bordered="false"
          size="small">
          <template slot="status" slot-scope="text, record, index">
            <a-badge v-if="text === 1" color="grey" text="未申请" />
            <a-badge v-else-if="text === 2" color="blue" text="未发起转正" />
            <a-badge v-else-if="text === 3" color="green" text="已通过" />
            <a-badge v-else-if="text === 4" color="yellow" text="未通过" />
            <span v-else-if="text === 5">
              <a-badge color="red"></a-badge><span style="color:red;">未申请(延期)</span>
            </span>
            <span v-else-if="text === 6">
              <a-badge color="red"></a-badge><span style="color:red;">未发起转正(延期)</span>
            </span>
            <a-badge v-else-if="text === 7" color="geekblue" text="转正审批中" />
            <span v-else-if="text === 8">
              <a-badge color="red"></a-badge><span style="color:red;">转正审批中(延期)</span>
            </span>
            <span v-else></span>
          </template>
          <template slot="deptName" slot-scope="text, record, index">
            <a-tooltip>
              <template slot="title">
                {{text}}
              </template>
              {{text}}
            </a-tooltip>
          </template>
          <template slot="personName" slot-scope="text, record, index">
            <a-tooltip>
              <template slot="title">
                {{text}}
              </template>
              {{text}}
            </a-tooltip>
          </template>
          <template slot="toformalTypeText" slot-scope="text, record, index">
            <a-tooltip>
              <template slot="title">
                {{text}}
              </template>
              {{text}}
            </a-tooltip>
          </template>
          <template slot="testMode" slot-scope="text, record, index">
            <a-tooltip>
              <template slot="title">
                {{text}}
              </template>
              {{text}}
            </a-tooltip>
          </template>
        </a-table>
        <footer-tool-bar>
          <a-pagination
            :total="page.totalCount"
            :pageSize.sync="page.pageSize"
            v-model="page.pageNo"
            @change="onPageChange"
            :showTotal="total => `共 ${total} 条`"
            style="margin-top: 10px"/>
        </footer-tool-bar>
        <a-drawer
          :title="title"
          placement="right"
          :closable="false"
          :visible="drawerVisable"
          :destroyOnClose="true"
          @close="onClose"
          width="850px"
          :bodyStyle="{ padding: '0px 0px 0px 0px' }">
          <person-tur-form :turId="turId" refs="form" @updateTitle="updateTitle">
          </person-tur-form>
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
            <a-button style="margin-left: 10px" @click="doClose">关闭</a-button>
          </div>
        </a-drawer>
      </a-layout-content>
    </a-layout>
    </a-layout>
  </a-card>
</template>

<script>
  import { DeptSelect} from '@/components'
  import FooterToolBar from "../../components/FooterToolbar/FooterToolBar";
  import { monthCount,monthDetail } from "../../api/personToFormal";
  import { PersonTurForm } from '@/module'
  export default {
    name: "PersonToFormalView",
    components:{
      FooterToolBar,
      PersonTurForm,
      DeptSelect
    },
    data(){
      return{
        leftLoading : false,
        rightLoading : false,
        title:'员工转正信息',
        year:null,
        queryParams:{
          pageSize:25,
          pageNo:1,
          inputContent:null,
          flag: 1,
          dept:null,
        },
        page: { pageNo: 1, pageSize: 25, totalCount: 0 },
        LeftColumns:[
          {
            key: 'month',
            width: '100%',
            dataIndex: 'month',
            align: 'left',
            scopedSlots: { customRender: 'month' },
          },
        ],
        RightColumns:[
          {
            key: 'deptName',
            width: '12%',
            dataIndex: 'deptName',
            title: '所属部门',
            align: 'left',
            ellipsis:true,
            scopedSlots: { customRender: 'deptName' },
          },
          {
            key: 'personId',
            width: '10%',
            dataIndex: 'personId',
            title: '工号',
            align: 'left',
          },
          {
            key: 'personName',
            width: '10%',
            dataIndex: 'personName',
            title: '姓名',
            align: 'left',
            ellipsis:true,
            scopedSlots: { customRender: 'personName' },
          },
          {
            key: 'probation',
            width: '13%',
            dataIndex: 'probation',
            title: '试用期(个月)',
            align: 'center',
          },
          {
            key: 'probationEndDate',
            width: '16%',
            dataIndex: 'probationEndDate',
            title: '试用期结束日期',
            align: 'center',
          },
          {
            key: 'toformalTypeText',
            width: '10%',
            dataIndex: 'toformalTypeText',
            title: '转正方式',
            align: 'left',
            ellipsis:true,
            scopedSlots: { customRender: 'toformalTypeText' },
          },
          {
            key: 'testMode',
            width: '11%',
            dataIndex: 'testMode',
            title: '考试方式',
            align: 'left',
            ellipsis:true,
            scopedSlots: { customRender: 'testMode' },
          },
          {
            key: 'toFormalDate',
            width: '13%',
            dataIndex: 'toFormalDate',
            title: '转正日期',
            align: 'center',
          },
          {
            key: 'status',
            width: '15%',
            dataIndex: 'status',
            title: '状态',
            align: 'left',
            scopedSlots: { customRender: 'status' },
          },
        ],
        leftData:[],
        rightData:[],
        leftSelectedRow:null,
        rightSelectedRow:null,
        turId:null,
        drawerVisable:false
      }
    },
    computed:{
      cardHeight(){
        return window.innerHeight - 165;
      },
      tableHeight(){
        return window.innerHeight - 270;
      },
      tableScrollHeight(){
        return window.innerHeight - 270;
      },
      lefttableHeight(){
        return window.innerHeight - 220;
      },
    },
    mounted() {
      this.year = new Date().getFullYear()
      this.getMonthCount()
    },
    methods:{
      updateTitle(lshid){
        this.title = '员工转正信息（流水号：' + lshid +'）'
      },
      onClose(){
        this.drawerVisable = false
        this.title = '员工转正信息'
      },
      doClose(){
        this.drawerVisable = false
        this.title = '员工转正信息'
      },
      getMonthCount(){
        this.leftLoading = true
        const params = {
          "year":this.year
        }
        monthCount(params).then(res=>{
          this.leftLoading = false
          if (res.code === 200){
            this.leftData = []
            var items = res.body
            var needCount = 0
            var hasCount = 0
            for(var i=0;i<items.length;i++){
              var item = items[i]
              needCount = needCount + item.need
              hasCount = hasCount + item.hasToFormal
            }
            const allItem = {
              'need':needCount,
              'hasToFormal':hasCount,
              'month':this.year + "全部"
            }
            this.leftData = this.leftData.concat(allItem)
            this.leftData = this.leftData.concat(items)
            if(this.leftData.length > 0){
              this.leftSelectedRow = this.leftData[0].month
              this.doQuery()
            }else{
              this.rightData = []
              this.page.pageNo = 1
              this.page.totalCount = 0
            }
          }
        }).catch(err=>{
          this.leftLoading = false
          console.log(err)
        }).finally(()=>{
          this.leftLoading = false
        })
      },
      onPageChange(current){
        this.page.pageNo = current
        this.queryParams.pageNo = current
        this.getMonthDetailList()
      },
      onYearChange(value){
        if (value == null){
          return
        }
        if (value.toString().length < 4){
          return
        }
        this.year = value;
        this.getMonthCount();
      },
      doQuery(){
        this.page.pageNo = 1
        this.queryParams.pageNo = 1
        this.queryParams.month = this.leftSelectedRow
        this.getMonthDetailList()
      },
      getMonthDetailList(){
        this.rightLoading = true
        monthDetail(this.queryParams).then(res=>{
          this.rightLoading = false
          if(res.code === 200){
            this.rightSelectedRow = null
            this.rightData = []
            this.rightData = this.rightData.concat(res.body.items)
            this.page.totalCount = res.body.totalCount
          }
        }).catch(err=>{
          this.rightLoading = false
          console.log(err)
        })
      },
      onLeftClickRow (record, index) {
        return {
          on: {
            click: () => {
              this.leftSelectedRow = record.month
              this.doQuery()
            }
          }
        }
      },
      setLeftCurrentRow (record, index) {
        var styleClassName = ''
        if (record.month === this.leftSelectedRow) {
          styleClassName = 'clickRowStyle hoverRowStyle'
        }
        return styleClassName
      },
      onRightClickRow (record, index) {
        return {
          on: {
            click: () => {
              this.rightSelectedRow = record.personId
            },
            dblclick: (event) => {
              if(record.turId != null){
                this.showDrawer(record.turId)
              }else{
                this.$message.info('未发起转正申请！');
              }
            }
          }
        }
      },
      showDrawer(turId){
        this.turId = turId
        this.drawerVisable = true
      },
      setRightCurrentRow (record, index) {
        var styleClassName = ''
        if (record.personId === this.rightSelectedRow) {
          styleClassName = 'clickRowStyle hoverRowStyle'
        }
        return styleClassName
      },
    }
  }
</script>

<style scoped>

</style>