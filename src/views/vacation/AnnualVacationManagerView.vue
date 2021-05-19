<template>
  <a-card :bordered="false" :bodyStyle="{ height: '2000px', padding: '0px 10px' }">

    <a-row>
      <a-col style="margin: 10px 0">
        <span style="margin-right: 15px;">年份：</span>
        <a-input-number v-model="queryParam.year"
                        @change="handleYearChange"/>

        <dept-select v-model="queryParam.deptId"
                     @change="handleDeptChange"
                     placeholder="按部门查询"
                     style="width:150px; margin-left: 20px">
        </dept-select>

        <a-input-search v-model="queryParam.personName"
                        @search="doQueryAnnualVacation"
                        @pressEnter="doQueryAnnualVacation"
                        :allowClear="true"
                        placeholder="请输入姓名或拼音简码查询"
                        style="width: 250px; margin-left: 20px">
        </a-input-search>

        <a-button type="primary" icon="search" @click="handleButtonSearch" style="margin-left: 20px">查询</a-button>

        <a-button type="primary" @click="handleButtonAdd" style="margin-left: 20px">新增假期</a-button>

        <span style="margin: 0 15px;">类型：</span>
        <a-dropdown>
          <a class="ant-dropdown-link" @click="e => e.preventDefault()">{{ typeName }}<a-icon type="down" /></a>
          <a-menu slot="overlay">
            <a-menu-item v-for="record in typeList" :key="record.id">
              <a href="javascript:;" @click="chooseType(record)">{{ record.name }}</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>

        <span style="margin: 0 15px;">假期：</span>
        <a-dropdown>
          <a class="ant-dropdown-link" @click="e => e.preventDefault()">{{ vacationName }}<a-icon type="down" /></a>
          <a-menu slot="overlay">
            <a-menu-item v-for="record in vacationNameList" :key="record.id">
              <a href="javascript:;" @click="chooseVacation(record)">{{ record.name }}</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>

      </a-col>
    </a-row>

    <a-row>
      <a-col>
        <a-table :columns="column"
                 v-watermark
                 :dataSource="data"
                 :pagination="pagination"
                 :loading="tableLoading"
                 :row-key="record => record.id"
                 @change="handleTableChange"
                 :scroll="{ x: false, y: tableHeight }"
                 :bodyStyle="{ height: tableHeight + 'px' }"
                 v-watermark
                 size="small">
          <template slot="rowIndex" slot-scope="text, record, index">
            <span> {{ (pagination.current - 1) * pagination.pageSize + index + 1 }} </span>
          </template>
          <template slot="type" slot-scope="text, record">
            <span> {{ record.type === 13 ? '年假' : '调休' }} </span>
          </template>
          <template slot="workTimes" slot-scope="text, record">
            <span v-if="(record.workTimes*8) >= 8">{{ parseInt(record.workTimes*8/8) + '天' }}</span>
            <span v-if="(record.workTimes*8)%8 != 0">{{(record.workTimes*8)%8 + '小时' }}</span>
          </template>
          <template slot="remark" slot-scope="text, record">
            <a-tooltip>
              <template slot="title">{{record.remark}}</template>
              {{text}}
            </a-tooltip>
          </template>
          <template slot="autoFlag" slot-scope="text, record">
            <a @click="edit(record)">{{ record.autoFlag == 0 && record.useFlag == 0? '修改' : ''}}</a>
          </template>
        </a-table>

        <a-drawer
          title="新增假期"
          placement="right"
          :closable="false"
          :visible="showAddModel"
          @close="addCancel"
          width="400px"
          :bodyStyle="{ padding: '0px 0px 0px 0px' }"
        >
         <!-- :wrapStyle="{overflow: 'hidden'}"-->
          <a-card :bordered="false"  v-watermark>
            <a-form></a-form>
            <a-row style="height: 50px;">
              <span>姓名：</span>
              <person-search-select ref="person" @setPerson="setPerson" v-model="addParam.personId"></person-search-select>
            </a-row>
            <a-row style="height: 50px">
              <span>年份：</span>
              <span>{{addParam.year}}</span>
            </a-row>
            <a-row style="height: 50px">
              <span>类型：</span>
              <a-dropdown>
                <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                  {{ vacationTypeName }}<a-icon type="down" />
                </a>
                <a-menu slot="overlay">
                  <a-menu-item v-for="record in vacationTypeList" :key="record.id">
                    <a href="javascript:;" @click="chooseVacationType(record)"> {{ record.name }} </a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </a-row>
            <a-row style="height: 50px">
              <span>时长：</span>
                <a-input-number v-model="workDaysAndTimes.workDays" :max="30" :min="0" :precision="0" :style="{width:'80px'}" @change="changeDays"/>天
              <a-select v-model=" workDaysAndTimes.workTimes" :style="{width:'80px'}" @change="changeTimes">
                <a-select-option :value="item.id" v-for="item in hoursList" :key="item.id">
                  {{item.name}}
                </a-select-option>
              </a-select>小时
<!--              <a-input-number v-model="workDaysAndTimes.workTimes" :max="8" :min="0"/>-->
            </a-row>
            <a-row style="height: 50px">
              <span>示例： 2天4.5小时</span>
            </a-row>
            <a-row style="height: 50px; padding-top: 5px">
              <span>备注：</span>
              <a-input v-model="addParam.remark" placeholder="请填写备注" style="width: 300px"></a-input>
            </a-row>
          </a-card>
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
            <a-button @click="addCancel">取消</a-button>
            <a-button type="primary" style="margin-left: 10px" @click="addSubmit">保存</a-button>
          </div>
        </a-drawer>

        <a-drawer
          title="修改假期"
          placement="right"
          :closable="false"
          :visible="showEditModel"
          @close="editCancel"
          width="400px"
          :bodyStyle="{ padding: '0px 0px 0px 0px' }"
        >
          <a-card :bordered="false"  v-watermark>
            <a-row style="height: 50px;">
              <span>姓名：</span><span>{{addParam.personName}}</span>
            </a-row>
            <a-row style="height: 50px">
              <span>年份：</span>
              <span>{{addParam.year}}</span>
            </a-row>
            <a-row style="height: 50px; padding-top: 5px">
              <span>类型：</span><span>{{updateVacationTypeName}}</span>
            </a-row>
            <a-row style="height: 50px">
              <span>时长：</span>
              <a-input-number v-model="workDaysAndTimes.workDays" :max="30" :min="0" :precision="0" :style="{width:'80px'}" @change="changeDays"/>天
              <a-select v-model=" workDaysAndTimes.workTimes" :style="{width:'80px'}" @change="changeTimes">
                <a-select-option :value="item.id" v-for="item in hoursList" :key="item.id">
                  {{item.name}}
                </a-select-option>
              </a-select>小时
            </a-row>
            <a-row style="height: 50px">
              <span>备注：</span>
              <a-input v-model="addParam.remark" placeholder="请填写备注" style="width: 300px"></a-input>
            </a-row>
          </a-card>
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
            <a-button @click="editCancel">取消</a-button>
            <a-button type="primary" style="margin-left: 10px" @click="editSubmit">保存</a-button>
          </div>
        </a-drawer>

      </a-col>
    </a-row>

  </a-card>

</template>

<script>
  import { queryAnnualVacation, addAnnualVacation, updateAnnualVacation } from '@/api/annualvacation'
  import { DeptSelect } from '@/components'
  import moment from "moment";
  import PersonSearchSelect from "@/components/Person/PersonSearchSelect";
  export default {
    name: "AnnualVacationManagerView",
    components: { DeptSelect, PersonSearchSelect },
    data() {
      return {
        hoursList:[
          { id: 1, name: '1'},
          { id: 1.5, name: '1.5'},
          { id: 2, name: '2'},
          { id: 2.5, name: '2.5'},
          { id: 3, name: '3'},
          { id: 3.5, name: '3.5'},
          { id: 4, name: '4'},
          { id: 4.5, name: '4.5'},
          { id: 5, name: '5'},
          { id: 5.5, name: '5.5'},
          { id: 6, name: '6'},
          { id: 6.5, name: '6.5'},
          { id: 7, name: '7'},
          { id: 7.5, name: '7.5'},
          { id: 8, name: '8'},
        ],
        tableHeight: 0,
        tableLoading: false,
        addLoading: false,
        showAddModel: false,
        showEditModel: false,
        currentRecord: null,
        typeName: '手工维护',
        vacationName:'全部',
        vacationNameList:[
          { id: null, name: '全部',},
          { id: 13, name: '年假',},
          { id: 12, name: '调休',}
        ],
        typeList: [
          { id: 2, name: '全部',},
          { id: 1, name: '系统生成',},
          { id: 0, name: '手工维护',}
        ],
        updateVacationTypeName:'年假',
        vacationTypeName: '年假',
        vacationTypeList: [{id: 13, name: '年假'},{id: 12, name: '调休'}],
        queryParam: { year: null, deptId: null, personId: null, personName: null, autoFlag: 0, type:null},
        workDaysAndTimes:{
          workDays:0,
          workTimes:0
        },
        addParam: {year: null, dept: null,  personId: null, workTimes: 0, type: 13, remark: null },
        // updateParam: { year: null, dept: null, personName: null, workTimes: 0, remark: null},
        pagination: { current: 1, pageSize: 25, total: 1,},
        data: [],
        column: [
          {
            title: '序号',
            dataIndex:'rowIndex',
            width:'5%',
            align: 'center',
            scopedSlots: { customRender: 'rowIndex' },
          },
          {
            title: '年份',
            dataIndex:'year',
            width:'5%',
            align: 'center',
          },
          {
            title: '姓名',
            dataIndex:'personName',
            width:'10%',
            align: 'center',
          },
          {
            title: '部门',
            dataIndex:'deptName',
            width:'17%',
            align: 'center',
          },
          {
            title: '类型',
            dataIndex:'type',
            width:'5%',
            align: 'center',
            scopedSlots: { customRender: 'type' },
          },
          {
            title: '天数',
            dataIndex:'workTimes',
            width:'5%',
            align: 'center',
            scopedSlots: { customRender: 'workTimes' },
          },
          {
            title: '创建时间',
            dataIndex:'createDate',
            width:'10%',
            align: 'center',
          },
          {
            title: '有效开始时间',
            dataIndex:'startDate',
            width:'10%',
            align: 'center',
          },
          {
            title: '有效截止时间',
            dataIndex:'endDate',
            width:'10%',
            align: 'center',
          },
          {
            title: '备注',
            dataIndex:'remark',
            width:'18%',
            align: 'center',
            ellipsis: true,
            scopedSlots: { customRender: 'remark' },
          },
          {
            title: '',
            dataIndex:'autoFlag',
            width:'5%',
            align: 'center',
            scopedSlots: { customRender: 'autoFlag' },
          },
        ],

      }
    },
    created(){
      this.initPage();
    },
    methods:{
      changeDays(value){
        this.addParam.workTimes = value + this.workDaysAndTimes.workTimes / 8
      },
      changeTimes(value){
        this.addParam.workTimes = value /8 + this.workDaysAndTimes.workDays
      },
      initPage(){
        this.tableHeight = window.innerHeight - 265
        this.queryParam.year = moment(moment()).format("YYYY").toString()
        this.addParam.year = moment(moment()).format("YYYY").toString()
        this.doQueryAnnualVacation()
      },
      doQueryAnnualVacation() {
        const params = {
          year: this.queryParam.year,
          deptId: this.queryParam.deptId,
          personName: this.queryParam.personName,
          autoFlag: this.queryParam.autoFlag,
          pageNo: this.pagination.current,
          pageSize: this.pagination.pageSize,
          type:this.queryParam.type
        }
        this.tableLoading = true
        queryAnnualVacation(params).then(res => {
          this.tableLoading = false
          this.pagination.total = res.body.totalCount
          this.data = res.body.items
        })
      },
      doAddAnnualVacation() {
        this.addLoading = true
        addAnnualVacation(this.addParam).then(res => {
          this.addLoading = false
          if(res.code === 200 ){
            this.$message.success(res.msg)
            this.doQueryAnnualVacation();
            this.addCancel()
          }
        })
      },
      doUpdateAnnualVacation() {
        this.addLoading = true
        updateAnnualVacation(this.addParam).then(res => {
          this.addLoading = false
          if(res.code === 200 ){
            this.$message.success(res.msg)
            // this.doQueryAnnualVacation()
            this.editCancel()
          }
        })
      },

      handleYearChange(value) {
        this.queryParam.year = value
        this.queryParam.personName = null
        this.pagination.current = 1
        this.doQueryAnnualVacation()
      },
      handleDeptChange(value) {
        this.queryParam.deptId = value
        this.queryParam.personName = null
        this.pagination.current = 1
        this.doQueryAnnualVacation()
      },
      handleButtonSearch() {
        this.pagination.current = 1
        this.doQueryAnnualVacation()
      },

      handleButtonAdd() {
        this.showAddModel = true;
        this.addParam = {year: 2020, dept: null,  personId: null, workTimes: 0, type: 13, remark: null };
        this.addParam.year = moment(moment()).format("YYYY").toString()
        this.workDaysAndTimes = {
          workDays:0,
          workTimes:0
        };
        if(this.$refs.person){
          this.$refs.person.clearPerson()
        }
      },
      setPerson(record) {
        this.addParam.personId = record.personId
        this.addParam.dept = record.deptCode
      },
      chooseType(record) {
        this.typeName = record.name
        this.queryParam.personName = null
        this.queryParam.autoFlag = record.id
        this.pagination.current = 1
        this.doQueryAnnualVacation()
      },
      chooseVacation(record){
        this.vacationName = record.name
        this.queryParam.personName = null
        this.queryParam.type = record.id
        this.pagination.current = 1
        this.doQueryAnnualVacation()
      },
      chooseVacationType(record) {
        this.vacationTypeName = record.name
        this.addParam.type = record.id
      },
      addSubmit() {
        const reg = /^[0-9]+(\.5)?$/
        if ( this.addParam.personId === null ) {
          this.$message.error("请填写姓名")
          return
        }
        this.addParam.workTimes = this.workDaysAndTimes.workDays + this.workDaysAndTimes.workTimes / 8
        if (this.addParam.workTimes === 0) {
          this.$message.error("时长不能为0")
          return
        }

        if ( this.addParam.remark === null || this.addParam === "" ) {
          this.$message.error("请填写备注")
          return
        }
        this.doAddAnnualVacation()
      },
      addCancel() {
        this.showAddModel = false
        this.addParam.workTimes = 0
        this.addParam.remark = null
        this.addParam.year = moment(moment()).format("YYYY").toString()
        //this.$refs.person.handleClear()
      },
      onOk(value){
        const startDate = value[0].format("YYYY-MM-DD HH:mm").toString()
        const endDate = value[1].format("YYYY-MM-DD HH:mm").toString()
        this.addParam.workStartDate = startDate
        // this.updateParam.workStartDate = startDate
        this.addParam.workEndDate = endDate
        // this.updateParam.workEndDate = endDate
      },
      edit(record){
        this.addParam = record
        this.addParam.dept = record.deptId
        if(record.type == 12){
          this.updateVacationTypeName = "调休"
        }else{
          this.updateVacationTypeName = "年假"
        }

        this.workDaysAndTimes.workDays = Math.floor(record.workTimes)//将时长整数位数位作为天数
        this.workDaysAndTimes.workTimes = (record.workTimes+"").split(".")[1] == null ? 0 : parseFloat("0."+(record.workTimes+"").split(".")[1])*8;//将时长小数位换算为小时
        this.showEditModel = true
      },
      editSubmit() {
        this.addParam.workTimes = this.workDaysAndTimes.workDays + this.workDaysAndTimes.workTimes / 8
        if (this.addParam.workTimes === 0) {
          this.$message.error("时长不能为0")
          return
        }
        this.doUpdateAnnualVacation()
      },
      editCancel() {
        this.showEditModel = false
      },

      handleTableChange(pagination) {
        this.pagination.current = pagination.current
        this.pagination.pageSize = pagination.pageSize
        this.doQueryAnnualVacation()
      }
    },
  }
</script>

<style scoped>

</style>