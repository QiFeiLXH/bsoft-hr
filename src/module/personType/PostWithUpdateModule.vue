<template>
  <a-card :bordered="false" :bodyStyle="{height:'1000px',padding: '10px 10px'}">
    <!--    <a-input-search placeholder="请输入人员财务类别信息" style="width: 300px;margin-bottom: 10px" @search="onSearch" />-->


    <a-table :columns="columns"
             :dataSource="data"
             size="small"
             :rowKey="(record,index)=> record.postType"
             :showPagination = 'false'
             :pagination = 'false'
             :scroll="{ x: false,y: listScrollHeight }"
             :bodyStyle="{ height: listScrollHeight + 'px' }"
             :rowClassName="setRowClassNamePost"
             :customRow="rowClickPost"
             @change="handleTableChangePost">
      <template  slot="postType"  slot-scope="text, record" >
        <template >
          {{ text }}
        </template>
      </template>

      <template
        slot="financialType"
        slot-scope="text, record"
      >
        <a-select :value="text" style="margin: -5px 0;width:200px" @change="value => handleFinancialTypeChange(value,record)"  size="small">
          <a-select-option v-for="e in financialTypedata" :key="e.id">
            {{ e.name }}
          </a-select-option>
        </a-select>
      </template>




      <template slot="rowIndex" slot-scope="text, record, index">
        {{index + 1}}
      </template>

    </a-table>
    <a-row  style="padding-top: 10px">
<!--      :disabled="changedPostRows.length === 0"-->
<!--      v-if="changedPostDeptId.length != 0"-->
      <a-month-picker @change="onDateChange"
                     fomat="YYYY-MM"
                     v-model="adjustDate" :disabled-date="disabledStartDate"
      />
      <a-divider type="vertical" />
      <a-button type="primary" @click="doSetPersonal()"
                :loading="buttonLoading">
        {{ buttonLoading ? '保存中' : '保存' }}
      </a-button>
    </a-row>

  </a-card>
</template>
<script>
  import FooterToolBar from '@/components/FooterToolbar'
  import {STable} from '@/components'
  import { getPostAndCostRuleList,getCostList,getFinanceList,updatePostAndCostRule,deletePostAndCostRule } from '@/api/postAndCostRule'
  import { selectWithDept, listDeptForMaintainSelect, updateDeptCost, updatePostCost  } from '@/api/deptCostMaintain'
  import moment from 'moment/moment'

  const columns = [
    {
      title: '序号',
      width:'8%',
      dataIndex:'rowIndex',
      align: 'left',
      scopedSlots: { customRender: 'rowIndex' },
    },
    {
      title: '岗位大类',
      width:'20%',
      dataIndex: 'postName',
      scopedSlots: { customRender: 'postType' },
    },
    {
      title: '财务类别',
      width:'20%',
      dataIndex: 'financialName',
      scopedSlots: { customRender: 'financialType' },
    },
    // {
    //   title: '操作',
    //   dataIndex: 'operation',
    //   width:'10%',
    //   scopedSlots: { customRender: 'operation' },
    // },
  ];
  export default {
    components:{
      FooterToolBar,
      STable,
    },
    props: {
      deptId: {
        type: String,
        default: '',
      }
    },
    name: 'PostWithUpdate',
    data() {
      return {
        data:[],
        costTypedata:[],
        financialTypedata:[],
        columns,
        listScrollHeight:0,
        editingKey: '',
        adjustDate:null,
        queryParam: {dept: null,maintain: 1},
        deleteParam:{'id':''},
        updateParam: {id: null, postType: null,financialType: null,adjustDate:null,type:2 },
        personflag:0,
        deleteMsg: '',
        buttonLoading: false,
        changedPostRows: [],// 记录修改过的岗位
        changedPostDeptId: [],// 标记修改过的岗位
        changedDeptRows: [],// 记录修改过的部门
        deptButtonLoading: false,
        currentPostRecord: {Id: null,financialType:null,type:2,adjustDate:null,dept:null,postType:null},
        date:null,
        // financialType:null,
        financialTypeData:[],
        selectPost:null,
        postData: [],
      };
    },
    computed: {
    },

    mounted(){
      // this.loadListData();
      // console.log(this.deptId)
      this.loadFinanceListData();
      // this.loadListData();
      this.listScrollHeight = window.innerHeight - 344
    },
    watch: {
      deptId: function (val, oldVal) {
        this.loadListData(val);
      }
    },
    methods:{
      moment,
      loadListData(deptId){
        selectWithDept({ dept: deptId })
          .then(res => {
            if (res.code === 200) {
              this.data = res.body
              this.adjustDate=moment()
            }
          })
      },
      // resetAdjustDate() {
      //   this.queryParam.ad
      //.startOf('month')
      // },
      loadFinanceListData(){
        getFinanceList()
          .then(res => {
            if (res.code === 200) {
              this.financialTypedata = res.body;
              console.log(this.financialTypeData)
            }
          })
      },

      doSetPersonal() {
        var oneUpdateDatas = this.data.filter(item => this.id!==0)
        console.log(11,oneUpdateDatas)
        if(oneUpdateDatas.length===0){
          this.changedPostRows = this.data.filter(item => this.changedPostDeptId.includes(item.postType))
          var target = this.data.filter(item => this.changedPostDeptId.includes(item.postType))
        }else {
          var target = this.data
        }
        // const newData = [...this.changedPostRows];
        // const newData = target;
        target.forEach(item=>{
          item.dept = this.deptId
          item.adjustDate = this.adjustDate
          console.log(this.adjustDate)
        })

        var temp1 = this.data.filter(item => item.financialName===null)
        console.log(temp1);
        if(temp1.length>0){
          this.$message.info("财务类别不能为空'");
          return;
        }

        var temp2 = this.data.filter(item => item.adjustDate===null)
        if(temp2.length>0){
          this.$message.info("调整年月不能为空'");
          return;
        }
        // target.forEach(item=>{
        //     if(item.financialName === null) {
        //       console.log(item)
        //       this.$message.info("财务类别不能为空'");
        //       return;
        //     }
        //   if(item.adjustDate === null) {
        //     console.log(item)
        //     this.$message.info("调整年月不能为空'");
        //     return;
        //   }
        //   }
        // )

        this.buttonLoading=true
        updatePostCost(target).then(res => {
          this.buttonLoading=false
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.changedPostDeptId = []
            this.changedPostRows = []
            this.loadListData(this.deptId)
          }
        })
      },



      handleRadioChangePost(record) {
        this.currentPostRecord = record
        console.log(record)
        this.selectPost = record.postType
        const data = [...this.postData]
        var target = data.find(item => this.body.dept === record.dept)
        // if (target) {
        //   target.personTypeFlag = e.target.value
        // }
        this.deptData = data
        var isExist = this.changedPostDeptId.includes(record.postType)
        if (!isExist) {
          // this.changedDeptRows.push({
          //   id: this.currentPostRecord.id,
          //   dept: this.currentPostRecord.dept,
          //   postType:this.currentPostRecord.postType,
          //   adjustDate:this.adjustDate,
          //   type: this.value,
          //   financialType : this.currentPostRecord.financialType,
          // })
          this.changedPostDeptId.push(record.postType)
        }

      },

      onDateChange(date, dateString) {
        console.log(date, dateString);
        if(dateString === '') {
          this.updateParam.adjustDate=null;
          this.currentPostRecord.adjustDate=null;
          this.adjustDate=null;
        } else {
          this.updateParam.adjustDate= dateString + '-01';
          this.currentPostRecord.adjustDate= dateString + '-01';
          this.adjustDate= dateString + '-01';
        }


      },



      handleFinancialTypeChange(value, record){
        console.log(value, record)
        console.log(this.financialTypeData)
        const newData = [...this.data]
        var target = newData.find(item => item.postType === record.postType)
        var financialType= this.financialTypedata.find(item => item.id === value)
        console.log(financialType)
        if(target){
          target["financialName"] = financialType.name;
          target["financialType"] = financialType.id;
        }
        if (!this.changedPostDeptId.includes(record.postType)) {
          this.changedPostDeptId.push(record.postType)
          // this.changedPostRows.push({
          //   id: record.id,
          //   dept: record.dept,
          //   postType:record.postType,
          //   AdjustDate:this.date,
          //   type: value,
          //   financialType : record.financialType,
          // })
        }
      },

      handleTableChangePost(pagination) {
        this.changedPostDeptId = []
        this.changedPostRows = []
        this.loadListData()
      },

      disabledStartDate(current) {
        return current && current > moment();
      },

      setRowClassNamePost(record) {
        if (this.changedPostDeptId.indexOf(record.id) > -1) {
          return 'changeRowStyle'
        }
        if (this.selectPost == record.postType) {
          return 'selectRowStyle'
        }
      },

      rowClickPost(record) {
        return {
          on: {
            click: ()=> {
              this.currentPostRecord = record
              this.selectPost = record.postType
            },
          }
        }
      },

      handleTableChangePersonal(pagination) {
        this.changedPostDeptId = []
        this.changedPostRows = []
      },

    },
  };
</script>
<style>
  components-table-demo-size h4 {
    margin-bottom: 16px;
  }
  .editable-row-operations a {
    margin-right: 8px;
  }
</style>
