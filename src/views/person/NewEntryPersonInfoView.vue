<template>
  <a-card
    :bordered="false"
    :bodyStyle="{
      height:cardHeight+'px',
      padding: '0px 10px'
    }">
    <a-row>
      <a-col :span="3">
        <a-table
          v-watermark
          ref="table"
          size="small"
          :style="{marginTop : '10px'}"
          :loading="isLoading"
          :tableHeight="listScrollHeight"
          :customRow="onCompanyClickRow"
          :rowClassName="setCompanyCurrentRow"
          :rowKey="(record) => record.companyId"
          :bordered="false"
          :columns="companyColumns"
          :dataSource="companyData"
          :pagination="false"
          :bodyStyle="{
            minHeight:companyListHeight+'px'
          }"
          :scroll="{ y: listScrollHeight }">

        </a-table>
      </a-col>
      <a-col :span="21">
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row style="margin-bottom: 10px;margin-top:10px;">
              <a-col>
                <a-dropdown>
                  <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                    {{dateTypeName}}<a-icon type="down" />
                  </a>
                  <a-menu slot="overlay">
                    <a-menu-item v-for="record in dateTypeList" :key="record.id">
                      <a href="javascript:;" @click="chooseDateType(record)"> {{ record.name }} </a>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
                :
                <a-month-picker v-model="startDate" :disabled-date="disabledStartDate" placeholder="开始" :style="{ width: '100px' }" @change="startChange"/>
                ~
                <a-month-picker v-model="endDate" :disabled-date="disabledEndDate" placeholder="结束" :style="{ width: '100px' }" @change="endChange"/>

<!--                <dept-select-->
<!--                  v-model="queryParam.deptNo"-->
<!--                  style="width:200px;margin-left: 20px"-->
<!--                  placeholder="按部门查询"-->
<!--                  @change="handleDeptChange"></dept-select>-->
                <memory-dept-select style="width:200px;margin-left: 20px" :storageKey="'NewEntryPersonInfoView_deptUseful_01'" ref="dept" :disabled="false" v-model="queryParam.deptNo"  @change="handleDeptChange"></memory-dept-select>
                <a-input-search
                  placeholder="请输入姓名或拼音简码查询"
                  :allowClear="true"
                  style="width: 250px;margin-left: 20px"
                  v-model="queryParam.inputContent"
                  @search="getPersonList"
                  @pressEnter="getPersonList"/>
<!--                <a-button type="primary" icon="search" @click="getPersonList" style="margin-left: 30px">查询</a-button>-->
                <a-button v-action:2 type="primary" icon="file-excel" @click="exportPersonInfo" :loading="isErrorDownloading" style="margin-left: 30px">导出</a-button>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <a-table
          v-watermark
          ref="table"
          size="small"
          :loading="isLoading"
          :customRow="onClickRow"
          :rowClassName="setCurrentRow"
          :rowKey="(record) => record.personId"
          :bordered="false"
          :columns="columns"
          :dataSource="dataList"
          :pagination="false"
          :scroll="{ y: listScrollHeight }">
          <template slot="money" slot-scope="text">
            {{ text | NumberFormat }}
          </template>
          <template slot="personName" slot-scope="text,record">
            <span v-if="record.flag == 0">{{ text }}</span>
            <span v-else style="color: red">{{ text }}</span>
          </template>
          <span slot="action" slot-scope="text, record">
        <template>
          <a v-action:1 v-if="(moment(record.regularDate).year() - moment().year()) * 12 +  (moment(record.regularDate).month() - moment().month()) >  - 3" @click="modify(record)">修改</a>
        </template>
      </span>
        </a-table>
        <footer-tool-bar>
          <a-pagination
            :disabled="isLoading"
            :total="page.totalCount"
            :pageSize.sync="page.pageSize"
            v-model="page.pageNo"
            @change="onPageChange"
            style="margin-top: 10px"/>
        </footer-tool-bar>
      </a-col>
    </a-row>

    <a-drawer
      title="修改薪资"
      placement="right"
      :closable="false"
      :visible="showEditModel"
      @close="editCancel"
      width="900px"
      :bodyStyle="{ padding: '0px 0px 0px 0px' }"
    >
      <a-card :bordered="false">
        <a-row>
          <a-col :md="8">
            <a-form-item
              label="工　　号"
              :labelCol="{lg: {span: 10}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 14}, sm: {span: 20} }"
              :required="false"
              style="margin-bottom: 0"
            >
              <label>{{rowSelectedInfo.personId}}</label>
            </a-form-item>
          </a-col>
          <a-col :md="8">
            <a-form-item
              label="姓　　名"
              :labelCol="{lg: {span: 10}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 14}, sm: {span: 20} }"
              :required="false"
              style="margin-bottom: 0"
            >
              <label>{{rowSelectedInfo.personName}}</label>
            </a-form-item>
          </a-col>
          <a-col :md="8">
            <a-form-item
              label="部　　门"
              :labelCol="{lg: {span: 10}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 14}, sm: {span: 20} }"
              :required="false"
              style="margin-bottom: 0"
            >
              <label>{{rowSelectedInfo.deptName}}</label>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="8">
            <a-form-item
              label="报到日期"
              :labelCol="{lg: {span: 10}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 14}, sm: {span: 20} }"
              :required="false"
              style="margin-bottom: 0"
            >
              <label>{{rowSelectedInfo.startDate}}</label>
            </a-form-item>
          </a-col>
          <a-col :md="8">
            <a-form-item
              label="到职日期"
              :labelCol="{lg: {span: 10}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 14}, sm: {span: 20} }"
              :required="false"
              style="margin-bottom: 0"
            >
              <label>{{rowSelectedInfo.entryDate}}</label>
            </a-form-item>
          </a-col>
          <a-col :md="8">
            <a-form-item
              label="转正日期"
              :labelCol="{lg: {span: 10}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 14}, sm: {span: 20} }"
              :required="false"
              style="margin-bottom: 0"
            >
              <label>{{rowSelectedInfo.regularDate}}</label>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="8">
            <a-form-item
              label="实习薪资"
              :labelCol="{lg: {span: 10}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 14}, sm: {span: 20} }"
              :required="false"
              style="margin-bottom: 0"
            >
              <label>{{rowSelectedInfo.internshipSalary | NumberFormat}}</label>
            </a-form-item>
          </a-col>
          <a-col :md="8">
            <a-form-item
              label="试用薪资"
              :labelCol="{lg: {span: 10}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 14}, sm: {span: 20} }"
              :required="false"
              style="margin-bottom: 0"
            >
              <label>{{rowSelectedInfo.probationSalary | NumberFormat}}</label>
            </a-form-item>
          </a-col>
          <a-col :md="8">
            <a-form-item
              label="转正薪资"
              :labelCol="{lg: {span: 10}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 14}, sm: {span: 20} }"
              :required="false"
              style="margin-bottom: 0"
            >
              <label>{{rowSelectedInfo.regularSalary | NumberFormat}}</label>
            </a-form-item>
          </a-col>
        </a-row>
        <a-divider orientation="left" style="font-weight: bold">
          修改后
        </a-divider>
        <a-row>
          <a-col :md="16">
            <a-form-item
              label="转正薪资"
              :labelCol="{lg: {span: 5}, sm: {span: 7}}"
              :wrapperCol="{lg: {span: 14}, sm: {span: 20} }"
              :required="false"
              style="margin-bottom: 0"
            >
              <a-input-number v-model="regularSalary" :min="0" :style="{'width':'150px'}"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="16">
            <a-form-item
              label="社保缴纳地"
              :labelCol="{lg: {span: 5}, sm: {span: 7}}"
              :wrapperCol="{lg: {span: 14}, sm: {span: 20} }"
              :required="false"
              style="margin-bottom: 0"
            >
<!--              <a-select @focus="getPaymentPlaceDic" :getPopupContainer="triggerNode => triggerNode.parentNode"  v-model="place" showSearch optionFilterProp="children" :filter-option="filterOption" :style="{'width':'150px'}">-->
<!--                <a-spin v-if="paymentPlaceDic.length === 0" slot="notFoundContent" size="small" />-->
<!--                <a-select-option :value="item.companyId" v-for="item in paymentPlaceDic" :detail="item" :key="item.companyId">-->
<!--                  {{item.abbreviation}}-->
<!--                </a-select-option>-->
<!--              </a-select>-->
              <general-dic-select :storageKey="'NewEntryPersonInfoView_paymentPlaceUseful_01'" :custom-list="paymentPlaceDic" :customLabel="'abbreviation'" :customKey="'companyId'" v-model="place" :width="450" @getGeneralDicList="getPaymentPlaceDic"></general-dic-select>
            </a-form-item>
          </a-col>
          <a-col :md="8">
            <a-form-item
              label="社保缴纳基数"
              :labelCol="{lg: {span: 10}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 14}, sm: {span: 20} }"
              :required="false"
              style="margin-bottom: 0"
            >
              <a-input-number v-model="paymentBase" :min="0"/>
            </a-form-item>
          </a-col>
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
        <a-button type="primary"  @click="editSubmit">保存</a-button>
        <a-button style="margin-left: 10px" @click="editCancel">取消</a-button>
      </div>
    </a-drawer>
  </a-card>
</template>

<script>
  import FooterToolBar from '@/components/FooterToolbar'
  import { getCompanyList } from '@/api/common'
  import { DeptSelect } from '@/components'
  import moment from "moment";
  import { queryPersonInfo,updateSalary,exportExcel,getAllCompany } from '@/api/newEntryPersonInfo'
  import {getPublicDic} from '@/api/employee'
  import { downFile } from '@/utils/util'
  import store from '@/store'
  import MemoryDeptSelect from "../../components/MemorySelect/MemoryDeptSelect";
  import GeneralDicSelect from "../../components/MemorySelect/GeneralDicSelect";

  export default {
    name: "NewEntryPersonInfoView",
    components: {
      FooterToolBar,
      DeptSelect,
      MemoryDeptSelect,
      GeneralDicSelect
    },
    data() {
      return {
        dateTypeName:"报到日期",
        dateTypeList:[
          {id:1,name:"报到日期"},
          {id:2,name:"转正日期"},
          {id:3,name:"到职日期"},
          ],
        startDate:null,
        endDate:null,
        companyListHeight:0,
        regularSalary:0,
        paymentBase:0,
        place:null,
        companyColumns:[{
          key: 'abbreviation',
          width: '100%',
          dataIndex: 'abbreviation',
          title: '所属公司',
        }],
        companyData:[],
        companySelected:null,
        companySelectedInfo:[],
        rowSelected:null,
        rowSelectedInfo:{},
        showEditModel: false,
        registrationDate: [],
        paymentPlaceDic: [],
        dateRangeMode: ['month', 'month'],
        isLoading:false,
        isErrorDownloading:false,
        dataList:[],
        listScrollHeight:0,
        cardHeight:0,
        page: { pageNo: 1, pageSize: 25, totalCount: 0 },
        queryParam: { pageSize: 25, deptNo: null, inputContent: ''},
        columns:[{
          key: 'personId',
          width: '10%',
          dataIndex: 'personId',
          title: '工号',
        },{
          key: 'personName',
          width: '10%',
          dataIndex: 'personName',
          scopedSlots: { customRender: 'personName' },
          title: '姓名',
        },{
          key: 'deptName',
          width: '10%',
          dataIndex: 'deptName',
          title: '部门',
        },{
          key: 'startDate',
          width: '10%',
          dataIndex: 'startDate',
          title: '报到日期',
        },{
          key: 'entryDate',
          width: '10%',
          dataIndex: 'entryDate',
          title: '到职日期',
        },{
          key: 'companyText',
          width: '10%',
          dataIndex: 'companyText',
          title: '所属公司',
        },{
          key: 'place',
          width: '10%',
          dataIndex: 'place',
          title: '社保缴纳地',
        },{
          key: 'paymentBase',
          width: '10%',
          align: 'right',
          dataIndex: 'paymentBase',
          title: '社保缴纳基数',
          // scopedSlots: { customRender: 'money' },
          className: 'center-th-header'
        },{
          key: 'internshipSalary',
          width: '10%',
          dataIndex: 'internshipSalary',
          align: 'right',
          title: '实习薪资',
          scopedSlots: { customRender: 'money' },
          className: 'center-th-header'
        },{
          key: 'probationSalary',
          width: '10%',
          align: 'right',
          dataIndex: 'probationSalary',
          title: '试用期薪资',
          scopedSlots: { customRender: 'money' },
          className: 'center-th-header'
        },{
          key: 'regularSalary',
          width: '10%',
          dataIndex: 'regularSalary',
          align: 'right',
          title: '转正薪资',
          scopedSlots: { customRender: 'money' },
          className: 'center-th-header'
        },{
          key: 'regularDate',
          width: '10%',
          dataIndex: 'regularDate',
          title: '转正日期',
        },{
          key: 'action',
          width: '5%',
          dataIndex: 'action',
          title: '操作',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }],

      }
    },
    methods: {
      filterOption(input, option) {
        return (
          option.data.attrs.detail.pinyin == null ?
            option.data.attrs.detail.name.toLowerCase().indexOf(input.toLowerCase()) >= 0:
            option.data.attrs.detail.pinyin.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
            option.data.attrs.detail.name.toLowerCase().indexOf(input.toLowerCase()) >= 0
        );
      },
      getPaymentPlaceDic (){
        if(this.paymentPlaceDic.length === 0 || this.paymentPlaceDic.length ===1) {
          this.paymentPlaceDic = []
          getCompanyList({'type':2}).then(res=>{
            this.paymentPlaceDic = res.body
          })
        }
      },
      chooseDateType(record){
        this.dateTypeName = record.name
        this.queryParam.dateType = record.id
        this.getPersonList()
      },
      moment,
      disabledStartDate(start){
        const endDate = this.endDate;
        if (!start || !endDate) {
          return start && start.year() != moment().year();
        }
        // return start && (start.month() > this.endDate.month() || start.year() != moment().year());
        return start && ((start.month() + start.year() * 12) > (this.endDate.month() + this.endDate.year() *12) ||(start.month() + start.year() * 12)  > (moment().month() + moment().year() * 12) || (start.month() + start.year() * 12)  < (moment().month() + moment().year() * 12 - 3));
      },
      disabledEndDate(end){
        const startDate = this.startDate;
        if (!startDate || !end) {
          return end && end.year() != moment().year();
        }
        // return end && (end.month() < this.startDate.month() || end.year() != moment().year());
        return end && ((end.month() + end.year() * 12) < (this.startDate.month() + this.startDate.year() * 12) || (end.month() + end.year() * 12)  > (moment().month() + moment().year() * 12) ||  (end.month() + end.year() * 12 ) < (moment().month() + moment().year() * 12 - 3));
      },
      editSubmit(){
        const me = this
        const params={}
        params.updatePersonId = this.rowSelectedInfo.personId
        params.probationSalary = this.rowSelectedInfo.probationSalary
        params.regularSalary = this.regularSalary
        params.paymentBase = this.paymentBase
        params.place = this.place
        updateSalary(params).then(res=>{
          if (res.code === 200){
            me.getPersonList();
            this.showEditModel = false
            me.$message.success('修改成功')
          }
        }).catch(err=>{
          console.log(err)
        })
      },
      modify(record){
        this.rowSelectedInfo = record
        this.regularSalary = record.regularSalary
        this.paymentBase = record.paymentBase
        this.place = record.placeId
        this.paymentPlaceDic = [{companyId: record.placeId,abbreviation: record.place}]
        this.showEditModel = true
      },
      editCancel() {
        this.showEditModel = false
      },
      onCompanyClickRow(record){
        const me = this
        return {
          on: {
            click: () => {
              me.companySelected = record.companyId
              me.companySelectedInfo = record
              me.queryParam.company = record.companyId
              me.getPersonList()
            }
          }
        }
      },
      setCompanyCurrentRow(record, index){
        var styleClassName = '';
        if (record.companyId === this.companySelected) {
          styleClassName = 'clickRowStyle hoverRowStyle'
        }
        return styleClassName;
      },
      onClickRow (record) {
        const me = this
        return {
          on: {
            click: () => {
              me.rowSelected = record.personId
              me.rowSelectedInfo = record
            }
          }
        }
      },
      setCurrentRow (record, index) {
        var styleClassName = '';
        if (record.personId === this.rowSelected) {
          styleClassName = 'clickRowStyle hoverRowStyle'
        }
        return styleClassName;
      },
      startChange(){
        if(this.startDate){
          this.queryParam.startDate = this.startDate.format('YYYY-MM')+"-01"
          this.getPersonList()
        }
      },
      endChange(){
        if(this.endDate){
          let endDate = moment(this.endDate.format('YYYY-MM-DD'));
          this.queryParam.endDate = endDate.endOf("month").format('YYYY-MM-DD') //获取结束月份最后一天
          this.getPersonList()
        }
      },
      handleDeptChange (val) {
        this.queryParam.deptNo = val
        this.getPersonList()
      },
      onPageChange (current) {
        this.queryParam.pageNo = current;
        this.getPersonList();
      },
      getPersonList(){
        this.isLoading = true
        queryPersonInfo(Object.assign(this.queryParam)).then(res=>{
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
      getCompanyList(){
        // getCompanyList({'type':2}).then(res=>{
        //   this.paymentPlaceDic = res.body
        // })
        getCompanyList({'type':3}).then(res=>{
          if (res.code === 200){
            this.companyData = []
            this.companyData = this.companyData.concat(res.body)
          }
          this.isLoading = false
        }).catch(err=>{
          this.isLoading = false
          console.log(err)
        })
      },
      exportPersonInfo(){
        const params = {}
        Object.assign(params, this.queryParam)
        params.menuId = this.$route.meta.id // 菜单id
        params.context = this.$route.meta.title // 菜单名称
        params.personId = store.getters.userInfo.personId // 用户id
        params.system = 15 // 系统
        this.isErrorDownloading = true
        exportExcel(params).then(res => {
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
          this.isErrorDownloading = false
        }).catch(error => {
          console.log(error)
          this.isErrorDownloading = false
        })
      }
    },
    mounted() {
      this.dateTypeName = "报到日期"
      this.queryParam.dateType = 1
      var current = moment();
      this.startDate = current
      this.endDate = current
      let endDate = moment(current.format('YYYY-MM-DD'));
      this.queryParam.startDate = current.format('YYYY-MM')+"-01"
      this.queryParam.endDate = endDate.endOf("month").format('YYYY-MM-DD') //获取结束月份最后一天
      this.listScrollHeight = window.innerHeight - 300
      this.cardHeight = window.innerHeight - 125
      this.queryParam.pageNo = 1
      this.queryParam.pageSize = 25
      this.companyListHeight = window.innerHeight - 215
      // this.queryParam.auditFlag = 0
      this.getPersonList()
      this.getCompanyList()
    }
  }
</script>

<style scoped>

</style>