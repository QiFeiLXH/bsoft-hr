<template>
  <a-card :bordered="false" :bodyStyle="{ height: '2000px', padding: '0px 10px' }">
    <a-row style="height: 45px">
      <a-col :span="6" style="padding-right: 10px">
        <a-row style="padding: 10px 0">
          <dept-select ref="dept" @change="handleDeptChange" :dept-type="deptTypeId" placeholder="按部门查询" style="width:200px;"></dept-select>
          <a-divider type="vertical" />
          <span>部门类别：</span>
          <a-dropdown>
            <a class="ant-dropdown-link" @click="e => e.preventDefault()">
              {{ deptTypeName }}<a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item v-for="record in deptTypeList" :key="record.id">
                <a href="javascript:;" @click="chooseDeptType(record)"> {{ record.name }} </a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </a-row>
        <a-table :columns="deptCol"
                 :dataSource="deptData"
                 :pagination="deptPagination"
                 :rowKey="record => record.dept"
                 :expandIconColumnIndex="0"
                 :indentSize="50"
                 :rowClassName="setRowClassNameDept"
                 :customRow="rowClickDept"
                 @change="handleTableChangeDept"
                 :scroll="{ x: false, y: tableHeight }"
                 :bodyStyle="{ height: tableHeight + 'px' }"
                 v-watermark
                 size="small">
          <!--              <template slot="personTypeFlag" slot-scope="text, record">-->
          <!--                <a-radio-group :value="text" @change="e => handleRadioChangeDept(e, record)">-->
          <!--                  <a-radio :value="1">按部门</a-radio>-->
          <!--                  <a-radio :value="2">按岗位</a-radio>-->
          <!--                </a-radio-group>-->
          <!--              </template>-->
        </a-table>
      </a-col>


      <a-col :span="18">

            <person-financial-update-module ref="table" :deptId="selectedDept" :deptName="selectedDeptName"></person-financial-update-module>
            <!--        <dept-with-update-module ></dept-with-update-module>-->
            <!--        <post-with-update-module v-if="selectedDept && currentDeptRecord.personTypeFlag === 2" :deptId="selectedDept"></post-with-update-module>-->
      </a-col>
    </a-row>

  </a-card>
</template>

<script>
  import { selectWithDept, listDeptForMaintainSelect, updateDeptCost, updatePostCost,getDeptFinancialType,updateDeptInfoWithPage  } from '@/api/deptCostMaintain'
  import { DeptSelect } from '@/components'
  import { PostWithUpdateModule,DeptWithUpdateModule,PersonFinancialUpdateModule } from '@/module'
  import {setDept, setPersonal} from "@/api/clockinmode";
  export default {
    name: "PersonFinancialMaintainView",
    components: { DeptSelect, PostWithUpdateModule,DeptWithUpdateModule,PersonFinancialUpdateModule },
    data() {
      return {
        tableHeight: window.innerHeight - 330,
        deptButtonLoading: false,
        personButtonLoading: false,
        currentDeptRecord: {dept: null,type:3 },
        currentPersonalRecord: {personId: null,},
        changedDept: [],// 标记修改过的部门
        changedPersonId: [],// 标记修改过的人
        changedDeptRows: [],// 记录修改过的部门
        changedPersonalRows: [],// 记录修改过的人
        selectedDept: null, //
        selectedDeptName: null, //
        updateType:'post',//修改类型
        changedPostRows: [],// 记录修改过的岗位
        changedPostDeptId: [],// 标记修改过的岗位
        attendFlagDept:1,
        currentPostRecord: {Id: null,financialType:null,type:2},
        queryParam: {dept: null, personId: null, personName: null,maintain: 1},
        deptPagination: { current: 1, pageSize: 25, total: 0,},
        personPagination: { current: 1, pageSize: 25, total: 0,},
        deptTypeName:'全部',
        deptTypeId: '',
        deptTypeList:[
          { id: '', name: "全部" },
          { id: '1', name: "行政职能" },
          { id: '2', name: "大区" },
          { id: '3', name: "事业部" },
          { id: '4', name: "其他" },
        ],
        deptData: [],
        personData: [],
        deptCol: [
          {
            title: '一级部门',
            dataIndex:'deptName',
            ellipsis: true,
            width:'45%',
          },
          // {
          //   title: '维护方式',
          //   dataIndex:'personTypeFlag',
          //   width:'35%',
          //   scopedSlots: { customRender: 'personTypeFlag' },
          // },
        ],
      }
    },
    created() {
      this.initPage()
    },
    methods: {
      initPage(){
        // this.tableHeight = window.innerHeight - 260
        this.doQueryDept();
      },
      doQueryDept() {
        const params = {
          dept: this.queryParam.dept,
          deptType: this.deptTypeId,
          maintain: 1,
          pageNo: this.deptPagination.current,
          pageSize: this.deptPagination.pageSize,
        }
        listDeptForMaintainSelect(params).then(res => {
          var deptData = res.body.items;
          deptData.forEach(item => {
            if (item.children == null || item.children.length == 0) {
              delete item.children
            }
          })
          this.deptPagination.total = res.body.totalCount
          this.deptData = deptData
        })
      },
      // doQuerySelectWithDept() {
      //   const params = {
      //     // dept: this.selectedDept,
      //     dept: this.queryParam.dept,
      //     // personName: this.queryParam.personName,
      //     // pageNo: this.personPagination.current,
      //     // pageSize: this.personPagination.pageSize,
      //   }
      //   selectWithDept(params).then(res => {
      //     this.personData = [...res.body]
      //   })
      // },
      onChange(e) {
        console.log(`checked = ${e.target.checked}`);
        if(true==e.target.checked){
          const params = {
            dept: this.queryParam.dept,
            deptType: this.deptTypeId,
            maintain: 0,
            pageNo: this.deptPagination.current,
            pageSize: this.deptPagination.pageSize,
          }
          listDeptForMaintainSelect(params).then(res => {
            if(res.code=200){
              var deptData = res.body.items;
              deptData.forEach(item => {
                if (item.children == null || item.children.length == 0) {
                  delete item.children
                }
              })
              this.deptPagination.total = res.body.totalCount
              this.deptData = deptData
            }
          })
        }
      },

      handleDeptChange(value) {
        this.queryParam.dept = value
        this.changedDept = []
        this.changedDeptRows = []
        this.deptPagination.current = 1
        this.doQueryDept()
      },
      chooseDeptType(record) {
        this.deptTypeId = record.id
        this.deptTypeName = record.name
        this.changedDept = []
        this.changedDeptRows = []
        this.deptPagination.current = 1
        this.doQueryDept()
      },

      // handleRadioChangeDept(e, record) {
      //   this.currentDeptRecord = record
      //   this.selectedDept = record.dept
      //   const data = [...this.deptData]
      //   var target = data.find(item => item.dept === record.dept)
      //   if (target) {
      //     target.personTypeFlag = e.target.value
      //   }
      //   this.deptData = data
      //   var isExist = this.changedDept.includes(record.dept)
      //   if (!isExist) {
      //     this.changedDeptRows.push({
      //       dept: record.dept,
      //       personTypeFlag: e.target.value,
      //     })
      //     this.changedDept.push(record.dept)
      //   }
      //
      // },
      handleTableChangeDept(pagination) {
        this.deptPagination.current = pagination.current
        this.deptPagination.pageSize = pagination.pageSize
        this.queryParam.dept = null
        this.selectedDept = null
        this.changedDept = []
        this.changedDeptRows = []
        this.doQueryDept()
      },
      handleBatchSave () {
        updateDeptInfoWithPage(this.changedDeptRows).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.changedDept = []
            this.changedDeptRows = []
            this.doQueryDept()
          }
        })
      },
      setRowClassNameDept(record) {
        if (this.selectedDept == record.dept) {
          return 'selectRowStyle'
        }
      },

      rowClickDept(record) {
        return {
          on: {
            click: ()=> {
              console.log(record)
              this.currentDeptRecord = record
              this.currentDeptRecord.type = 3
              this.selectedDept =  record.dept
              this.selectedDeptName =  record.deptName
              this.$nextTick(()=>{
                this.$refs.table.onSearch()
              })
            },
            dblclick: () => {
              this.selectedDept = record.dept
              this.selectedDeptName =  record.deptName
              this.currentDeptRecord = record
              this.currentDeptRecord.type = 3
              this.changedPersonId = []
              this.changedPersonalRows = []
              this.personPagination.current = 1
            }
          }
        }
      },

    }
  }
</script>

<style scoped>
  /deep/ .childrenRowStyle {
    background-color: #fcfcfc;
  }
  /deep/ .changeRowStyle {
    background-color: #e8f7ff;
    color: #1890FF
  }
  /deep/ .selectRowStyle {
    background-color: #d5fffe;
  }
  /deep/ .ant-table-placeholder{
    display:none;
  }
</style>