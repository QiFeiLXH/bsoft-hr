<template>
  <a-card :bordered="false" :bodyStyle="{height:'1000px',padding: '0'}">
    <!--    <a-input-search placeholder="请输入人员财务类别信息" style="width: 300px;margin-bottom: 10px" @search="onSearch" />-->
    <a-row style="padding: 10px 0">
      <span>现财务类别：</span>
      <a-select v-model="queryParam.financialTypeFind" @change="onFinancialTypeChange" allowClear  style="width :200px">
        <a-select-option v-for="e in financialTypeAfterData" :key="e.id">{{ e.name }}</a-select-option>
      </a-select>
      <a-divider type="vertical" />
      <span>员工信息：</span>
      <person-select  ref ="person" @change="onApplyUserChange" allow-clear style="width :200px" ></person-select>

      <a-divider type="vertical" />

      <template>
<!--        :disabled="changedPersonDeptId.length === 0"-->
        <a-button  type="primary" @click="doSetPersonal()"
                   v-if="changedPersonDeptId.length != 0"
                  :loading="buttonLoading">
          {{ buttonLoading ? '保存中' : '保存' }}
        </a-button>
      </template>
    </a-row>
    <a-row>
    <a-table :columns="columns"
             :dataSource="data"
             size="small"
             :rowKey="(record,index)=> record.personId"
             :showPagination = 'false'
             :pagination = 'page'
             :scroll="{ x: false,y: listScrollHeight }"
             :bodyStyle="{ height: listScrollHeight + 'px' }"
             :rowClassName="setRowClassNamePost"
             :customRow="rowClickPost"
             @change="handleTableChangePost">

      <template  slot="dept"  slot-scope="text, record" >
<!--        <template >{{deptName}}</template>-->
        <template >
          {{ text }}
        </template>
      </template>
      <template  slot="personId"  slot-scope="text, record" >
        <template >
          {{ text }}
        </template>
      </template>
      <template  slot="xusName"  slot-scope="text, record" >
        <template >
          {{ text }}
        </template>
      </template>
      <template  slot="postName"  slot-scope="text, record" >
        <template >
          {{ text }}
        </template>
      </template>

      <template
        slot="financialTypeNow"
        slot-scope="text, record"
      >
        <template >
          {{ text }}
        </template>
      </template>


      <template
        slot="financialTypeAfter"
        slot-scope="text, record"
      >
        <a-select v-model="record.financialTypeAfter" style="margin: -5px 0;width:100px" @change="value => handleFinancialTypeChange(value,record)"  size="small">
          <a-select-option v-for="e in financialTypeAfterData" :key="e.id">
            {{ e.name }}
          </a-select-option>
        </a-select>
      </template>


      <template
      slot="adjustDate"
      slot-scope="text,record">
        <a-month-picker  @change="(date, dateStr) => onDateChange(date, dateStr,record)"
                         v-model="record.adjustDate"
                         fomat="YYYY-MM"
                         :disabled-date="disabledStartDate"
        />
      </template>


      <template slot="rowIndex" slot-scope="text, record, index">
        {{index + 1}}
      </template>

    </a-table>
    </a-row>

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
        <div :style="{ height: formHeight + 'px',paddingBottom: '50px', overflowY: 'hidden' }">
          <s-table
            ref="recordTable"
            class="custom"
            size="small"
            :rowKey="(record) => record.id"
            :columns="recordColumn"
            :height="tableHeight"
            :data="loadRecordList"
            :customRow="onRecordClickRow"
            :rowClassName="setRecordCurrentRow"
            :showSizeChanger="false"
            :pageSize="recordPagination.pageSize"
            :pageNum="recordPagination.pageNumber"
            :showPagination="true"
            :bodyStyle="{ minHeight: recordListScrollHeight+'px' }"
            :scroll="{ x: false, y: recordListScrollHeight }"
          >
            <template slot="rowIndex" slot-scope="text, record, index">
                <span>
                  {{ (recordPagination.pageNumber - 1) * recordPagination.pageSize + index + 1 }}
                </span>
            </template>

<!--            <template-->
<!--              slot="adjustDate"-->
<!--              slot-scope="text,record">-->
<!--              <a-month-picker-->
<!--                             v-model="record.adjustDate"-->
<!--                               fomat="YYYY-MM"-->
<!--              />-->
<!--            </template>-->
          </s-table>
        </div>
        <div
          :style="{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: '950px',
              borderTop: '1px solid #e9e9e9',
              padding: '9px 16px',
              background: '#fff',
              textAlign: 'right',
            }"
        >
          <a-button key="back" @click="onDrawerClose" style="margin-left: 20px">关闭</a-button>
        </div>
      </a-card>
    </a-drawer>

  </a-card>

</template>
<script>
  import FooterToolBar from '@/components/FooterToolbar'
  import moment from 'moment/moment'
  import {STable} from '@/components'
  import {getFinanceList } from '@/api/postAndCostRule'
  import { getPersonFinancialViewlist, updatePersonFinancialview,getHrFeeRulesRecordList  } from '@/api/personFinancialMaintain'
  import {queryList} from "@/api/personType";
  import PersonSelect from "@/module/person/PersonSelect/PersonSelect";
  import {doLoadPersonAdjustRecordList} from "@/api/personSocialPlaceAdjustment";
  const columns = [
    {
      title: '序号',
      width:'6%',
      dataIndex:'rowIndex',
      align: 'left',
      scopedSlots: { customRender: 'rowIndex' },
    },
    {
      title: '所属部门',
      width:'19%',
      dataIndex: 'deptName',
      scopedSlots: { customRender: 'dept' },
    },
    {
      title: '工号',
      width:'13%',
      dataIndex: 'personId',
      scopedSlots: { customRender: 'personId' },
    },
    {
      title: '姓名',
      width:'15%',
      dataIndex: 'xusName',
      scopedSlots: { customRender: 'xusName' },
    },
    {
      title: '岗位大类',
      width:'12%',
      dataIndex: 'postName',
      scopedSlots: { customRender: 'postName' },
    },
    {
      title: '现财务类别',
      width:'15%',
      dataIndex: 'financialNameNow',
      scopedSlots: { customRender: 'financialTypeNow' },
    },
    {
      title: '调整后财务类别',
      width:'18%',
      dataIndex: 'financialNameAfter',
      scopedSlots: { customRender: 'financialTypeAfter' },
    },
    {
      title: '调整年月',
      width:'17%',
      dataIndex: 'adjustDate',
      scopedSlots: { customRender: 'adjustDate' },
    },
    // {
    //   title: '调整后财务类别',
    //   width:'20%',
    //   dataIndex: 'financialName',
    //   scopedSlots: { customRender: 'financialType' },
    // },
    // {
    //   title: '操作',
    //   dataIndex: 'operation',
    //   width:'10%',
    //   scopedSlots: { customRender: 'operation' },
    // },
  ];

  const recordColumn = [
    {
      title: '序号',
      width:'10%',
      dataIndex:'rowIndex',
      align: 'left',
      scopedSlots: { customRender: 'rowIndex' },
    },
    {
      title: '调整年月',
      width:'15%',
      dataIndex: 'adjustDate',
      scopedSlots: { customRender: 'adjustDate' },
    },
    {
      title: '原财务类别',
      width:'15%',
      dataIndex: 'financialNameNow',
      scopedSlots: { customRender: 'financialTypeNow' },
    },
    {
      title: '调整后财务类别',
      width:'15%',
      dataIndex: 'financialNameAfter',
      scopedSlots: { customRender: 'financialTypeAfter' },
    },
    {
      dataIndex: 'registrantionDate',
      title: '登记日期',
      width: '15%'
    }, {
      dataIndex: 'registrantName',
      title: '登记人',
      width: '15%'
    }
  ];
  export default {
    components:{
      FooterToolBar,
      STable,
      PersonSelect,
    },
    props: {
      deptId: {
        type: String,
        default: '',
      },
      deptName: {
        type: String,
        default: '',
      }
    },
    name: 'PostWithUpdate',
    data() {
      return {
        data:[],
        costTypedata:[],
        // financialTypedata:[],
        columns,
        listScrollHeight:window.innerHeight - 310,
        editingKey: '',
        adjustDate:null,
        queryParam: {pseronId:null,dept: null,xusName: null,type:3,personId:null,financialTypeFind:null,pageNo: 1,pageSize: 25},
        deleteParam:{'id':''},
        updateParam: {pseronId: null, postType: null,financialTypeNow: null,financialTypeAfter: null,financialTypeFind: null,adjustDate:null,type:3 },
        personflag:0,
        deleteMsg: '',
        buttonLoading: false,
        changedPersonRows: [],// 记录修改过的人
        changedPersonDeptId: [],// 标记修改过的人
        changedDeptRows: [],// 记录修改过的部门
        deptButtonLoading: false,
        // currentPersonRecord: {Id: null,financialType:null,type:2,AdjustDate:null,dept:null,postType:null},
        currentPersonRecord: {pseronId: null, postType: null,financialTypeNow: null,financialTypeAfter: null,financialTypeFind: null,adjustDate:null,type:3},
        date:null,
        // financialType:null,
        financialTypeNowData:[],
        financialTypeAfterData:[],
        selectPerson:null,
        personData: [],
        page:{current: 1, pageSize:25, totalCount: 0},
        pageNo: 1,
        pageSize: 25,
        total:0,

        drawerTitle: '',
        recordColumn,
        recordQueryParam: { personId: '', pageNo: 1, pageSize: 25 },
        recordRowSelected: '',
        drawerVisible: false,
        tableHeight: 0,
        drawerCardHeight: window.innerHeight - 60,
        formHeight: window.innerHeight - 140,
        recordListScrollHeight: window.innerHeight - 230,
        recordPagination: { pageNumber: 1, pageSize: 25, totalCount: 1 },
        loadRecordList: parameter => {
          return getHrFeeRulesRecordList(Object.assign(parameter, this.recordQueryParam)).then(res => {
            if (res.code === 200) {
              this.recordPagination.pageNumber = res.body.pageNumber + 1
              this.recordPagination.totalCount = res.body.totalCount
              return res.body
            }
          })
        }


      };
    },
    computed: {
    },

    mounted(){
      // this.loadListData();
      console.log(this.deptId)
      // this.deptname=this.deptName
      this.loadFinanceListData();
      // this.listScrollHeight = window.innerHeight - 290
    },
    methods:{
      loadPage () {
        this.loadListData();
        console.log(this.deptId)
      },
      loadListData(){
        const param = {
          dept:this.deptId,
          type:3,
          financialTypeFind:this.financialTypeFind,
          personId:this.queryParam.personId,
          pageNo:this.page.current,
          pageSize: this.page.pageSize,
        }
        console.log(param)
        getPersonFinancialViewlist(param)
          .then(res => {
            if (res.code === 200) {
              this.data = res.body.items
              this.queryParam.financialTypeFind = null
              this.$refs.person.getCurrent()
              this.queryParam.personId=null
            }
          })
      },


      loadSearchData(value){
        getPersonFinancialViewlist(value)
          .then(res => {
            if (res.code === 200) {
              this.data = res.body.items
            }
          })
      },

      doSetPersonal() {
        this.changedPersonRows = this.data.filter(item => this.changedPersonDeptId.includes(item.personId))
        this.buttonLoading=true
        var temp1 = this.changedPersonRows.filter(item=>item.financialTypeAfter===null)
        console.log(temp1)
        if(temp1.length>0){
          this.$message.info("被修改人的调整后财务类别不能为空")
          this.buttonLoading=false
          return
        }
        var temp2 = this.changedPersonRows.filter(item=>item.adjustDate===null)
        if(temp2.length>0){
          this.$message.info("被修改人的调整后年月不能为空")
          this.buttonLoading=false
          return;
        }
        console.log(temp2)

        // console.log(this.changedPersonRows)
        updatePersonFinancialview(this.changedPersonRows).then(res => {
          this.buttonLoading=false
          if (res.code === 200) {
            this.$message.success("保存成功");
            this.changedPersonDeptId = []
            this.changedPersonRows = []
            this.queryParam.pageNo=this.page.current;
            // this.onSearch()
            this.loadListData();
          }
        })
      },

      // onsearch(current){
      //   this.queryParam.pageNo=current;
      //   this.queryParam.personId = this.personId;
      //   this.queryParam.xusName = this.xusName;
      //   getPersonFinancialViewlist(this.queryParam)
      //     .then(res => {
      //       if (res.code === 200) {
      //         this.data = res.body
      //       }
      //     })
      // },

      onApplyUserChange(value) {
        this.queryParam.personId = value
        this.onSearch()
      },
      onFinancialTypeChange(value) {
        this.queryParam.financialTypeFind = value
        this.queryParam.dept = this.deptId
        this.onSearch()
      },
      onSearch() {
        this.queryParam.pageNo=this.page.current;
        this.queryParam.dept = this.deptId;
        this.getTaskList()
      },
      getTaskList() {
        // this.tableLoading = true
        getPersonFinancialViewlist(this.queryParam).then(res=>{
          if (res.code === 200){
            this.data = res.body.items
            this.page.totalCount = res.body.totalCount
            // this.tableLoading = false
          }
        })
      },

      pageChange(current){
        this.queryParam.pageNo=current;
        queryList(this.queryParam)
          .then(res => {
            if (res.code === 200) {
              this.data = res.body.items;
              this.page.totalCount= res.body.totalCount;
            }
          })
      },
      
      loadFinanceListData(){
        getFinanceList()
          .then(res => {
            if (res.code === 200) {
              // this.financialTypeNowdata = res.body;
              this.financialTypeAfterData = res.body;
              console.log(res.body)
            }
          })
      },


      onDateChange(date, dateString, record) {
        console.log(date, dateString, record)
        const data = [...this.data]
        // var target = data.find(item => item.personId === record.personId)
        if (record) {
          record.adjustDate = dateString +'-01'
          // this.adjustDate = dateString
        }
        this.currentPersonRecord = record
        console.log(record)
        this.selectPerson= record.personId
        var isExist = this.changedPersonDeptId.includes(record.personId)
        if (!isExist) {

          this.changedPersonDeptId.push(record.personId)
        }
      },



      handleFinancialTypeChange(value, record){
        // console.log(value, record)
        // console.log(this.financialTypeAfterData)
        const newData = [...this.data]
        var target = newData.find(item => item.postType === record.postType)
        var financialType= this.financialTypeAfterData.find(item => item.id === value)
        console.log(financialType)
        console.log(target)
        if(record){
          record["financialNameAfter"] = financialType.name;
          record["financialTypeAfter"] = financialType.id;
        }



        this.currentPersonRecord = record
        if(record.adjustDate==null){
          record.adjustDate= moment()
        }
        console.log(record)
        this.selectPerson= record.personId
        // const data = [...this.personData]
        // var target = data.find(item => this.body.dept === record.dept)
        // // if (target) {
        // //   target.personTypeFlag = e.target.value
        // // }
        // this.deptData = data
        var isExist = this.changedPersonDeptId.includes(record.personId)
        if (!isExist) {

          this.changedPersonDeptId.push(record.personId)
        }

      },

      handleTableChangePost(pagination) {
        this.deptPagination.current = pagination.current
        this.deptPagination.pageSize = pagination.pageSize
        // this.queryParam.dept = null
        // this.selectedDept = null
        // this.changedDept = []
        // this.changedDeptRows = []
        this.changedPersonDeptId = []
        this.changedPersonRows = []
        this.loadListData()
      },

      setRowClassNamePost(record) {
        if (this.changedPersonDeptId.indexOf(record.id) > -1) {
          return 'changeRowStyle'
        }
        if (this.selectPerson == record.personId) {
          return 'selectRowStyle'
        }
      },

      rowClickPost(record) {
        return {
          on: {
            click: ()=> {
              this.currentPersonRecord = record
              this.selectPerson = record.personId
            },
            dblclick: () => {
              this.drawerTitle = record.deptName + '(工号： ' + record.personId + ')' + '-调整记录'
              this.drawerVisible = true
              this.recordQueryParam.personId = record.personId
              setTimeout(() => {
                this.$refs.recordTable.refresh(true) // refresh() 不传参默认值 false 不刷新到分页第一页
              }, 100)
            }
          }
        }
      },

      handleTableChangePersonal(pagination) {
        this.changedPersonDeptId = []
        this.changedPersonRows = []
      },

      disabledStartDate(current) {
        return current && current > moment();
      },



      onDrawerClose () {
        this.drawerVisible = false
        this.drawerTitle = ''
      },

      onRecordClickRow (record, index) {
        return {
          on: {
            click: () => {
              this.recordRowSelected = record.id
            }
          }
        }
      },
      setRecordCurrentRow (record, index) {
        var styleClassName = ''
        if (record.id === this.recordRowSelected) {
          styleClassName = 'clickRowStyle hoverRowStyle'
        }
        return styleClassName
      },
    },
  };
</script>
<style scoped>
  components-table-demo-size h4 {
    margin-bottom: 16px;
  }
  .editable-row-operations a {
    margin-right: 8px;
  }
  /deep/ .ant-select-disabled .ant-select-selection {
    background: #ffffff;
    cursor: not-allowed;
  }
  /deep/ .ant-select-disabled {
    color: rgba(0, 0, 0, 0.65);
  }

  /deep/ .ant-table-placeholder{
    display:none;
  }
</style>
