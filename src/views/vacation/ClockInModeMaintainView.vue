<template>
  <a-card :bordered="false" :bodyStyle="{ height: '2000px', padding: '0px 10px' }">
    <a-row :gutter="8">
      <a-col span="10" style="margin: 10px 0">

        <a-row style="height: 45px">
          <a-col>
<!--            <dept-select ref="dept" @change="handleDeptChange" :dept-type="deptTypeId" placeholder="按部门查询" style="width:250px;"></dept-select>-->
            <memory-dept-select style="width:250px;" :storageKey="'ClockInModeMaintainView_deptUseful_01'" ref="dept" :disabled="false"  @change="handleDeptChange"></memory-dept-select>
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
            <a-button v-if="this.changedDeptRows.length != 0"
                      @click="doSetDept"
                      :loading="deptButtonLoading"
                      type="primary" style="margin-left: 15px;">
              {{ deptButtonLoading ? '保存中' : '保存' }}
            </a-button>
          </a-col>
        </a-row>

        <a-row>
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
            <template slot="attendFlagDept" slot-scope="text, record">
              <a-radio-group  v-model="record.attendFlagDept" @change="handleRadioChangeDept">
                <a-radio :value="1">考勤机</a-radio>
                <a-radio :value="2">APP</a-radio>
              </a-radio-group>
            </template>
          </a-table>
        </a-row>
      </a-col >

      <a-col span="14" style="margin: 10px 0">

        <a-row style="height: 45px">
          <a-input-search v-model="queryParam.personName"
                          @search="handlePersonSearch"
                          :allowClear="true"
                          placeholder="请输入姓名或拼音简码查询"
                          style="width: 250px;">
          </a-input-search>
          <a-button v-if="this.changedPersonalRows.length != 0"
                    :loading="personButtonLoading"
                    @click="doSetPersonal"
                    type="primary" style="margin-left: 15px;">
            {{ personButtonLoading ? '保存中' : '保存' }}
          </a-button>
        </a-row>
        <a-row>
          <a-table :columns="personCol"
                   :dataSource="personData"
                   :pagination="personPagination"
                   :rowKey="record => record.personId"
                   :rowClassName="setRowClassNamePersonal"
                   :customRow="rowClickPersonal"
                   @change="handleTableChangePersonal"
                   :scroll="{ x: false, y: tableHeight }"
                   :bodyStyle="{ height: tableHeight + 'px' }"
                   v-watermark
                   size="small">
            <template slot="attendFlagDept" slot-scope="text, record, index">
              <span v-if="record.attendFlagDept != null"> {{ record.attendFlagDept == 1 ? '考勤机' : 'APP' }} </span>
            </template>
            <template slot="attendFlagPersonal" slot-scope="text, record">
              <a-radio-group name="radioGroup" v-model="record.attendFlagPersonal" @change="handleRadioChangePersonal">
                <a-radio :value="1">考勤机</a-radio>
                <a-radio :value="2">APP</a-radio>
              </a-radio-group>
            </template>
          </a-table>
        </a-row>
      </a-col>

    </a-row>
  </a-card>
</template>

<script>
  import { queryDept, queryPersonal, setDept, setPersonal  } from '@/api/clockinmode'
  import { DeptSelect } from '@/components'
  import MemoryDeptSelect from "../../components/MemorySelect/MemoryDeptSelect";
  export default {
    name: "ClockInModeMaintainView",
    components: { DeptSelect,MemoryDeptSelect },
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
        selectedDept: null,
        queryParam: {dept: null, personId: null, personName: null,},
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
          {
            title: '考勤方式',
            dataIndex:'attendFlagDept',
            width:'35%',
            scopedSlots: { customRender: 'attendFlagDept' },
          },
        ],
        personCol: [
          {
            title: '姓名',
            dataIndex:'personName',
            width:'15%',
            align: 'center',
          },
          {
            title: '部门',
            dataIndex:'deptName',
            ellipsis: true,
            width:'30%',
            align: 'center',
          },
          {
            title: '部门考勤方式',
            dataIndex:'attendFlagDept',
            width:'15%',
            align: 'center',
            scopedSlots: { customRender: 'attendFlagDept' },
          },
          {
            title: '考勤方式',
            dataIndex:'attendFlagPersonal',
            width:'30%',
            align: 'center',
            scopedSlots: { customRender: 'attendFlagPersonal' },
          },
        ],
      }
    },
    created() {
      this.initPage()
    },
    methods: {
      initPage(){
        this.tableHeight = window.innerHeight - 260
        this.doQueryDept();
        this.doQueryPersonal()
      },
      doQueryDept() {
        const params = {
          dept: this.queryParam.dept,
          deptType: this.deptTypeId,
          pageNo: this.deptPagination.current,
          pageSize: this.deptPagination.pageSize,
        }
        queryDept(params).then(res => {
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
      doQueryPersonal() {
        const params = {
          dept: this.selectedDept,
          personName: this.queryParam.personName,
          pageNo: this.personPagination.current,
          pageSize: this.personPagination.pageSize,
        }
        queryPersonal(params).then(res => {
          this.personPagination.total = res.body.totalCount
          this.personData = [...res.body.items]
        })
      },
      doSetDept() {
        this.deptButtonLoading = true
        setDept(this.changedDeptRows).then(res => {
          this.deptButtonLoading = false
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.changedDept = []
            this.changedDeptRows = []
            this.doQueryDept()
            this.doQueryPersonal()
          }
        })
      },
      doSetPersonal() {
        this.personButtonLoading = true
        setPersonal(this.changedPersonalRows).then(res => {
          this.personButtonLoading = false
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.changedPersonId = []
            this.changedPersonalRows = []
            this.doQueryPersonal()
          }
        })
      },
      handleDeptChange(value) {
        this.queryParam.dept = value
        this.changedDept = []
        this.changedDeptRows = []
        this.deptPagination.current = 1
        this.doQueryDept()
        this.doQueryPersonal()
      },
      chooseDeptType(record) {
        this.deptTypeId = record.id
        this.deptTypeName = record.name
        this.changedDept = []
        this.changedDeptRows = []
        this.deptPagination.current = 1
        this.doQueryDept()
      },
      handlePersonSearch() {
        this.changedPersonId = []
        this.changedPersonalRows = []
        this.personPagination.current = 1
        this.doQueryPersonal()
      },
      handleRadioChangeDept(e) {
        const rows = this.changedDeptRows
        let isExist = false
        rows.forEach(row => {
          if(this.currentDeptRecord.dept === row.dept){//判断是否修改过
            row.attendFlagDept = e.target.value
            isExist = true
          }
        })
        if(!isExist) {//未修改过则加入数组
          this.changedDeptRows.push({
            dept: this.currentDeptRecord.dept,
            attendFlagDept: e.target.value,
          })
        }
        this.changedDept.push(this.currentDeptRecord.dept)
      },
      handleRadioChangePersonal(e) {
        const rows = this.changedPersonalRows
        let isExist = false
        rows.forEach(row => {
          if(this.currentPersonalRecord.personId === row.personId){//判断是否修改过
            row.attendFlagPersonal = e.target.value
            isExist = true
          }
        })
        if (!isExist) {//未修改过则加入数组
          this.changedPersonalRows.push({
            personId: this.currentPersonalRecord.personId,
            attendFlagPersonal: e.target.value,
          })
        }
        this.changedPersonId.push(this.currentPersonalRecord.personId)
      },
      handleTableChangeDept(pagination) {
        this.deptPagination.current = pagination.current
        this.deptPagination.pageSize = pagination.pageSize
        this.queryParam.dept = null
        this.selectedDept = null
        this.changedDept = []
        this.changedDeptRows = []
        this.doQueryDept()
        this.doQueryPersonal()
      },
      handleTableChangePersonal(pagination) {
        this.personPagination.current = pagination.current
        this.personPagination.pageSize = pagination.pageSize
        this.changedPersonId = []
        this.changedPersonalRows = []
        this.doQueryPersonal()
      },
      setRowClassNameDept(record) {
        if (this.selectedDept == record.dept) {
          return 'selectRowStyle'
        }
        if (this.changedDept.indexOf(record.dept) > -1) {
          return 'changeRowStyle'
        }
      },
      setRowClassNamePersonal(record) {
        if (this.changedPersonId.indexOf(record.personId) > -1) {
          return 'changeRowStyle'
        }
      },
      rowClickDept(record) {
        return {
          on: {
            click: ()=> {
              this.currentDeptRecord = record
            },
            dblclick: () => {
              this.selectedDept = record.dept
              this.currentDeptRecord = record
              this.changedPersonId = []
              this.changedPersonalRows = []
              this.personPagination.current = 1
              this.doQueryPersonal()
            }
          }
        }
      },
      rowClickPersonal(record) {
        return {
          on: {
            click: ()=> {
              this.currentPersonalRecord = record
            },
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
</style>