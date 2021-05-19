<template>
  <a-card :bordered="false" :bodyStyle="{ height: '2000px', padding: '0px 10px' }">
    <a-row style="height: 45px;margin-top: 20px">
      <a-col>
        <dept-select ref="dept" @change="handleDeptChange" :dept-type="queryParam.deptTypeId" placeholder="按部门查询" style="width:250px;"></dept-select>
        <span style="margin-left: 15px;">部门类别：</span>
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
        <a-divider type="vertical"/>
        <a-checkbox style="margin-left: 15px;" @change="onChange" :checked="queryParam.maintain === 0" >
          未维护
        </a-checkbox>
        <a-divider type="vertical"/>

      </a-col>
    </a-row>
    <a-row :gutter="8">
      <a-col span="10" style="margin: 10px 0">

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
          <template slot="deptName" slot-scope="text, record">
            <span :style="record.flag === 0 ? { color: 'red'} : null">{{text}}</span>
          </template>
              <template slot="personTypeFlag" slot-scope="text, record">
                <a-radio-group :value="text" @change="e => handleRadioChangeDept(e, record)">
                  <a-radio :value="1">按部门</a-radio>
                  <a-radio :value="2">按岗位</a-radio>
                </a-radio-group>
              </template>
            </a-table>

      </a-col >
      <a-col :span="14">
        <dept-with-update-module ref="deptUpdate" v-show="deptModuleVisible" :deptId="selectedDept"></dept-with-update-module>
        <post-with-update-module ref="postUpdate" v-show="postModuleVisible" :deptId="selectedDept"></post-with-update-module>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
  import { selectWithDept, listDeptForMaintainSelect, updateDeptCost, updatePostCost,getDeptFinancialType,updateDeptInfoWithPage  } from '@/api/deptCostMaintain'
  import { DeptSelect } from '@/components'
  import { PostWithUpdateModule,DeptWithUpdateModule } from '@/module'
  import {setDept, setPersonal} from "@/api/clockinmode";
  export default {
    name: "DeptCostMaintainView",
    components: { DeptSelect, PostWithUpdateModule,DeptWithUpdateModule },
    data() {
      return {
        tableHeight: 0,
        deptButtonLoading: false,
        personButtonLoading: false,
        currentDeptRecord: {dept: null, },
        currentPersonalRecord: {personId: null,},
        changedDept: [],// 标记修改过的部门
        changedPersonId: [],// 标记修改过的人
        changedDeptRows: [],// 记录修改过的部门
        changedPersonalRows: [],// 记录修改过的人
        selectedDept: null, //查询部门下的所有岗位财务类别
        updateType:'post',//修改类型
        changedPostRows: [],// 记录修改过的岗位
        changedPostDeptId: [],// 标记修改过的岗位
        attendFlagDept:1,
        currentPostRecord: {Id: null,financialType:null,type:2},
        queryParam: {dept: null, personId: null, personName: null,maintain: 0, deptTypeId: null},
        deptPagination: { current: 1, pageSize: 25, total: 0,},
        personPagination: { current: 1, pageSize: 25, total: 0,},
        deptTypeName:'全部',
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
            scopedSlots: { customRender: 'deptName' },
          },
          {
            title: '维护方式',
            dataIndex:'personTypeFlag',
            width:'40%',
            scopedSlots: { customRender: 'personTypeFlag' },
          },
        ],
        deptModuleVisible: false,
        postModuleVisible: false
      }
    },
    created() {
      // this.initPage()
    },
    methods: {
      initPage(){
        this.tableHeight = window.innerHeight - 340
        this.doQueryDept();
      },
      doQueryDept() {
        const params = {
          dept: this.queryParam.dept,
          deptType: this.queryParam.deptTypeId,
          maintain: this.queryParam.maintain,
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
        this.queryParam.maintain = e.target.checked ? 0 : 1
        this.doQueryDept()
         /* listDeptForMaintainSelect(Object.assign(params, this.queryParam)).then(res => {
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
          })*/

      },

      handleDeptChange(value) {
        this.queryParam.dept = value
        this.changedDept = []
        this.changedDeptRows = []
        this.deptPagination.current = 1
        this.doQueryDept()
      },
      chooseDeptType(record) {
        this.queryParam.deptTypeId = record.id
        this.deptTypeName = record.name
        this.changedDept = []
        this.changedDeptRows = []
        this.deptPagination.current = 1
        this.doQueryDept()
      },

      handleRadioChangeDept(e, record) {
        this.currentDeptRecord = record
        this.selectedDept = record.dept
        const data = [...this.deptData]
        var target = this.getTargetDept(data, record.dept)
        console.log(target)
        if (target) {
          target.personTypeFlag = e.target.value
        }
        this.deptData = data
        if(e.target.value===1){
          this.deptModuleVisible = true
          this.postModuleVisible = false
          /*this.$nextTick(()=>{
            this.$refs.deptUpdate.loadListDeptData()
          })*/
        }else{
          this.deptModuleVisible = false
          this.postModuleVisible = true
          /*this.$nextTick(()=>{
            this.$refs.postUpdate.loadListData()
          })*/
        }
      },
      getTargetDept (array, deptId) {
        for (var i = 0; i < array.length; i++) {
          if (array[i].dept === deptId) {
            return array[i]
          }
          if (array[i].children && array[i].children.length > 0) {
            var target = this.getTargetDept(array[i].children, deptId)
            if (target) {
              return target
            }
          }
        }
      },
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
              // this.currentDeptRecord.personTypeFlag=null
              this.currentDeptRecord = record
              this.selectedDept =  record.dept
              if (record.personTypeFlag) {
                if(record.personTypeFlag===1){
                  this.deptModuleVisible = true
                  this.postModuleVisible = false
                  /*this.$nextTick(()=>{
                    this.$refs.deptUpdate.loadListDeptData()
                  })*/
                }else{
                  this.deptModuleVisible = false
                  this.postModuleVisible = true
                  /*this.$nextTick(()=>{
                    this.$refs.postUpdate.loadListData()
                  })*/
                }
              }
            },
            dblclick: () => {
              this.selectedDept = record.dept
              this.currentDeptRecord = record
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