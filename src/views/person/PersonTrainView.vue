<template>
  <a-card :bordered="false" :bodyStyle="{ height: cardHeight + 'px', padding: '0px 10px'}">
    <a-row style="margin-bottom: 10px;margin-top:10px;">
      <memory-dept-select
        :logout="logout"
        :storageKey="'PersonTrain_deptUseful_01'"
        style="width:150px;margin-left: 0px"
        v-model="queryParam.bmdm"
        @change="doQuery">
      </memory-dept-select>
<!--      <dept-select v-model="queryParam.bmdm" style="width:150px;margin-left: 0px" placeholder="按部门查询" :logout="logout"-->
<!--                   @change="doQuery"></dept-select>-->
      <a-divider type="vertical" />
      <a-input-search placeholder="工号/姓名(拼音码)"
                      v-model="queryParam.input"
                      style="width: 270px"
                      :allowClear="true"
                      @search="doQuery"
                      @pressEnter="doQuery"
      />
      <a-divider type="vertical" />
      <a-button type="primary" icon="search" style="margin-left:15px" @click="doQuery">查询</a-button>
      <a-button type="primary" style="margin-left:15px" @click="doSave">保存</a-button>
      <a-modal v-model="visible" title="修改提醒" @ok="handleOk" @cancel="handleCancel">
        <p>人员信息已修改，是否取消已修改内容!</p>
      </a-modal>
      <a-modal v-model="saveVisible" title="保存提醒" @ok="handleSaveOk" @cancel="handleSaveCancel">
        <p>选中的人员调动信息未保存，是否需要保存!</p>
      </a-modal>
      <a-modal v-model="querySaveVisible" title="保存提醒" @ok="handleQuerySaveOk" @cancel="handleQuerySaveCancel">
        <p>选中的人员调动信息未保存，是否需要保存!</p>
      </a-modal>
    </a-row>
    <a-table
      v-watermark
      :row-selection="{
        columnTitle:' ',
        hideDefaultSelections:true,
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
        columnWidth:'20px',
        onSelect:onRowSelectChange
      }"
      :loading="Loading"
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
      <template
        v-for="col in ['deptText','ssx', 'typeText', 'jobCategoryText','postText','communicationSubsidyText','personnelGroupText','localflagText','transferDate']"
        :slot="col"
        slot-scope="text, record, index"
      >
        <div :key="col">
          <memory-dept-select
            :initDataFlag="false"
            ref="dept"
            @focus="deptFocusSelect(record)"
            v-if="col === 'deptText'"
            :disabled="!record.editable"
            :storageKey="'PersonTrain_deptUseful_02'"
            style="width:100%;"
            @change="deptChange">
          </memory-dept-select>
<!--          <dept-select ref="dept"-->
<!--                       @focus="deptFocusSelect(record)"-->
<!--                       v-if="col === 'deptText'"-->
<!--                       :disabled="!record.editable"-->
<!--                       @change="deptChange"-->
<!--                       v-model="record.dept"-->
<!--                       :allowClear="false"-->
<!--                       style="width:100%;"-->
<!--                       placeholder="按部门查询">-->
<!--          </dept-select>-->
          <!-- 员工类别 -->
          <a-select @focus="focusSelect(record)" :default-value="record.type" v-else-if="record.editable && col === 'typeText'" style="width: 100%" @change="handleTypeChange">
            <a-select-option v-for="item in typeList" :key="item.id">
              <a-tooltip>
                <template slot="title">
                  {{ item.name }}
                </template>
                {{ item.name }}
              </a-tooltip>
            </a-select-option>
          </a-select>
          <!-- 岗位大类 -->
          <hr-dic-select
            :not-focus="true"
            :searchable="true"
            @focus="focusSelect(record)"
            v-else-if="record.editable && col === 'jobCategoryText'"
            style="width: 100%;"
            :storageKey="'PersonTrain_jobCategory_01'"
            :custom-list="jobCategoryDic"
            v-model="record.jobCategory"
            :type="2"
            @change="handleJobCategoryChange">
          </hr-dic-select>
<!--          <a-select @focus="focusSelect(record)" :default-value="record.jobCategory" v-else-if="record.editable && col === 'jobCategoryText'" style="width: 100%" @change="handleJobCategoryChange">-->
<!--            <a-select-option v-for="item in jobCategoryDic" :key="item.id">-->
<!--              <a-tooltip>-->
<!--                <template slot="title">-->
<!--                  {{ item.name }}-->
<!--                </template>-->
<!--                {{ item.name }}-->
<!--              </a-tooltip>-->
<!--            </a-select-option>-->
<!--          </a-select>-->
          <!-- 岗位 -->
          <hr-dic-select
            :not-focus="true"
            :searchable="true"
            @focus="focusSelect(record)"
            v-else-if="record.editable && col === 'postText'"
            style="width: 100%"
            :storageKey="'PersonTrain_post_01'"
            :custom-list="postDic"
            v-model="record.post"
            :type="14"
            @change="handlePostChange">
          </hr-dic-select>
<!--          <a-select-->
<!--            :dropdownMatchSelectWidth="false"-->
<!--            :dropdownStyle="{width:'200px'}"-->
<!--            @focus="focusSelect(record)"-->
<!--            :default-value="record.post"-->
<!--            :filter-option="filterOption"-->
<!--            showSearch-->
<!--            option-filter-prop="children"-->
<!--            v-else-if="record.editable && col === 'postText'"-->
<!--            style="width: 100%"-->
<!--            @change="handlePostChange">-->
<!--            <a-select-option v-for="item in postDic" :key="item.id" :value="item.id" :detail="item">-->
<!--              <a-tooltip>-->
<!--                <template slot="title">-->
<!--                  {{ item.name }}-->
<!--                </template>-->
<!--                {{ item.name }}-->
<!--              </a-tooltip>-->
<!--            </a-select-option>-->
<!--          </a-select>-->
          <!-- 补贴 -->
          <general-dic-select
            :searchable="true"
            :customLabel="'name'"
            :customKey="'id'"
            v-else-if="record.editable && col === 'communicationSubsidyText'"
            :storageKey="'PersonTrain_communicationSubsid_01'"
            :custom-list="communicationSubsidyDic"
            v-model="record.communicationSubsidy"
            @change="handleSubsidyChange"
            @getGeneralDicList="reinitDic(record)"
            style="width: 100%">
          </general-dic-select>
<!--          <a-select :dropdownMatchSelectWidth="false"-->
<!--                    :dropdownStyle="{width:'200px'}"-->
<!--                    @focus="focusSelect(record)"-->
<!--                    v-model="record.communicationSubsidy"-->
<!--                    v-else-if="record.editable && col === 'communicationSubsidyText'"-->
<!--                    style="width: 100%"-->
<!--                    @change="handleSubsidyChange">-->
<!--            <a-select-option v-for="item in communicationSubsidyDic" :key="item.id">-->
<!--              <a-tooltip>-->
<!--                <template slot="title">-->
<!--                  {{ item.name }}-->
<!--                </template>-->
<!--                {{ item.name }}-->
<!--              </a-tooltip>-->
<!--            </a-select-option>-->
<!--          </a-select>-->
          <!-- 归属群 -->
          <a-select :dropdownMatchSelectWidth="false"
                    :dropdownStyle="{width:'200px'}"
                    @focus="personGroupFocusSelect(record)"
                    v-model="record.personnelGroup"
                    v-else-if="record.editable && col === 'personnelGroupText'"
                    style="width: 100%"
                    @change="handleGroupChange">
            <a-select-option v-for="item in personnelGroupDic" :key="item.id">
              <a-tooltip>
                <template slot="title">
                  {{ item.name }}
                </template>
                {{ item.name }}
              </a-tooltip>
            </a-select-option>
          </a-select>
          <!-- 本地化 -->
          <a-select @focus="focusSelect(record)"  v-model="record.localflag" v-else-if="record.editable && col === 'localflagText'" style="width: 100%" @change="handleLocalFlagChange">
            <a-select-option v-for="item in localFlagDic" :key="item.id">
              <a-tooltip>
                <template slot="title">
                  {{ item.name }}
                </template>
                {{ item.name }}
              </a-tooltip>
            </a-select-option>
          </a-select>
          <!-- 驻地 -->
          <administrative-new-division
            @focus="focusSelect(record)"
            ref="ssx"
            v-else-if="col === 'ssx'"
            :disabled="!record.editable"
            style="width: 300px;"
            @setDivision="setDivision">
          </administrative-new-division>
          <a-date-picker v-else-if="record.editable && col === 'transferDate'" v-model="record.transferDate" @change="onDateChange"/>
          <template v-else>
            {{ text }}
          </template>
        </div>
      </template>
    </a-table>
    <footer-tool-bar>
      <a-pagination
        :disabled="pageLoading"
        :total="page.totalCount"
        :pageSize.sync="page.pageSize"
        v-model="page.pageNo"
        @change="onPageChange"
        :showTotal="total => `共 ${total} 条`"
        style="margin-top: 10px"/>
    </footer-tool-bar>
  </a-card>
</template>

<script>
  import MemoryDeptSelect from "../../components/MemorySelect/MemoryDeptSelect";
  import GeneralDicSelect from "../../components/MemorySelect/GeneralDicSelect";
  import HrDicSelect from "../../components/MemorySelect/HrDicSelect";
  import AdministrativeNewDivision from '../../components/Area/AdministrativeNewDivision'
  import DeptSelect from '../../components/Dept/DeptSelect'
  import FooterToolBar from '@/components/FooterToolbar'
  import { doQueryPersonTransfer,getDic,doSavePersonTransfer,getPersonnelGroupDic } from "../../api/personTrain";
  export default {
  name: "PersonTrainView",
  components: {
    FooterToolBar,
    DeptSelect,
    AdministrativeNewDivision,
    HrDicSelect,
    GeneralDicSelect,
    MemoryDeptSelect
  },
  computed:{
    cardHeight(){
      return window.innerHeight - 115;
    },
    tableHeight(){
      return window.innerHeight - 255;
    },
    tableScrollHeight(){
      return window.innerHeight - 255;
    },
  },
  data(){
    return{
      logout:'2',
      visible:false,
      saveVisible:false,
      querySaveVisible:false,
      typeList:[
        {
          id:0,
          name:'普通'
        },
        {
          id:1,
          name:'实习'
        },
        {
          id:2,
          name:'中层'
        },
        {
          id:3,
          name:'领导'
        },
        {
          id:4,
          name:'顾问'
        },
        {
          id:9,
          name:'其他'
        }
      ],
      selectedRowKeys:[],
      selectedRows:[],
      selectRecord:null,
      Loading:false,
      pageLoading:false,
      tableData:[],
      orgtableData:[],
      nextPageNo:null,
      queryParam: { pageNo: 1, pageSize: 25 },
      page: { pageNo: 1, pageSize: 25, totalCount: 0 },
      Columns:[
        {
          key: 'personId',
          width: 100,
          dataIndex: 'personId',
          title: '工号',
          fixed: 'left',
          align: 'center'
        },
        {
          key: 'personName',
          width: 100,
          dataIndex: 'personName',
          title: '姓名',
          fixed: 'left',
          align: 'center'
        },
        {
          key: 'deptText',
          width: 200,
          dataIndex: 'deptText',
          title: '部门',
          align: 'left',
          scopedSlots: { customRender: 'deptText' },
        },
        {
          key: 'typeText',
          width: 100,
          dataIndex: 'typeText',
          title: '员工类别',
          align: 'center',
          scopedSlots: { customRender: 'typeText' },
        },
        {
          key: 'jobCategoryText',
          width: 100,
          dataIndex: 'jobCategoryText',
          title: '岗位大类',
          align: 'left',
          scopedSlots: { customRender: 'jobCategoryText' },
        },
        {
          key: 'postText',
          width: 150,
          dataIndex: 'postText',
          title: '岗位',
          align: 'left',
          scopedSlots: { customRender: 'postText' },
        },
        {
          key: 'communicationSubsidyText',
          width: 150,
          dataIndex: 'communicationSubsidyText',
          title: '补贴',
          align: 'left',
          scopedSlots: { customRender: 'communicationSubsidyText' },
        },
        {
          key: 'personnelGroupText',
          width: 150,
          dataIndex: 'personnelGroupText',
          title: '归属群',
          align: 'left',
          scopedSlots: { customRender: 'personnelGroupText' },
        },
        {
          key: 'localflagText',
          width: 100,
          dataIndex: 'localflagText',
          title: '本地化',
          align: 'center',
          scopedSlots: { customRender: 'localflagText' },
        },
        {
          key: 'ssx',
          width: 300,
          dataIndex: 'ssx',
          title: '驻地',
          align: 'left',
          scopedSlots: { customRender: 'ssx' },
        },
        {
          key: 'transferDate',
          width: 200,
          dataIndex: 'transferDate',
          title: '调动日期',
          align: 'center',
          scopedSlots: { customRender: 'transferDate' },
        },
      ],
      selectedRow:null,
      postDic:[],
      personnelGroupDic:[],
      jobCategoryDic:[],
      communicationSubsidyDic:[],
      localFlagDic:[
        {
          id:0,
          name:'非本地'
        },
        {
          id:2,
          name:'省级'
        },
        {
          id:3,
          name:'地级市'
        },
        {
          id:1,
          name:'县级市'
        },
      ]
    }
  },
  mounted() {
    this.orgtableData = []
    this.initDic();
    this.doQuery();
  },
  methods:{
    initPersonnelGroupDic (record) {
      if (this.selectedRowKeys.length <= 0){
        return;
      }
      let index = this.selectedRowKeys.indexOf(record.personId)
      if (index === -1){
        return;
      }
      if (record.dept === undefined || record.dept == null) {
        this.$message.warn('请先选择部门')
        return
      }
      var year = new Date().getFullYear()
      const param = { deptId: record.dept, year: year }
      this.personnelGroupDic = []
      getPersonnelGroupDic(param).then(res => {
        if (res.code === 200) {
          this.personnelGroupDic = res.body
          if (this.personnelGroupDic.length > 0) {
            record.personnelGroup = this.personnelGroupDic[0].id
            record.personnelGroupText = this.personnelGroupDic[0].name
          } else {
            record.personnelGroup = null
            record.personnelGroupText = ""
          }
        }
      })
    },
    handleQuerySaveOk(){
      this.querySaveVisible = false
    },
    handleQuerySaveCancel(){
      this.selectedRowKeys = []
      this.selectedRows = []
      this.page.pageNo = 1
      this.queryParam.pageNo = 1
      this.getPersonTransferList()
    },
    handleSaveOk(){
      this.saveVisible = false
    },
    handleSaveCancel(){
      this.selectedRowKeys = []
      this.selectedRows = []
      this.page.pageNo = this.nextPageNo
      this.queryParam.pageNo = this.nextPageNo
      this.getPersonTransferList()
    },
    handleCancel(){
      this.visible = false
      this.selectedRowKeys.push(this.selectRecord.personId)
      this.selectedRows.push(this.selectRecord)
    },
    handleOk(){
      this.visible = false
      const selectRecord = this.selectRecord
      const newData = [...this.tableData];
      const orgtableData = [...this.orgtableData];
      let targetIndex = -1
      for(var i=0;i<newData.length;i++){
        if (newData[i].personId === selectRecord.personId){
          targetIndex = i
        }
      }
      let orgIndex = -1
      for(var i=0;i<orgtableData.length;i++){
        if (orgtableData[i].personId === selectRecord.personId){
          orgIndex = i
        }
      }
      if(targetIndex > -1 && orgIndex > -1) {//还原数据
        newData[targetIndex].editable = false
        newData[targetIndex].communicationSubsidy = orgtableData[orgIndex].communicationSubsidy;
        newData[targetIndex].communicationSubsidyText = orgtableData[orgIndex].communicationSubsidyText;
        newData[targetIndex].graduationDate = orgtableData[orgIndex].graduationDate;
        newData[targetIndex].id = orgtableData[orgIndex].id;
        newData[targetIndex].jobCategory = orgtableData[orgIndex].jobCategory;
        newData[targetIndex].jobCategoryText = orgtableData[orgIndex].jobCategoryText;
        newData[targetIndex].localflag = orgtableData[orgIndex].localflag;
        newData[targetIndex].localflagText = orgtableData[orgIndex].localflagText;
        newData[targetIndex].personId = orgtableData[orgIndex].personId;
        newData[targetIndex].personName = orgtableData[orgIndex].personName;
        newData[targetIndex].personnelGroup = orgtableData[orgIndex].personnelGroup;
        newData[targetIndex].personnelGroupText = orgtableData[orgIndex].personnelGroupText;
        newData[targetIndex].post = orgtableData[orgIndex].post;
        newData[targetIndex].postText = orgtableData[orgIndex].postText;
        newData[targetIndex].pym = orgtableData[orgIndex].pym;
        newData[targetIndex].ssx = orgtableData[orgIndex].ssx;
        newData[targetIndex].type = orgtableData[orgIndex].type;
        newData[targetIndex].typeText = orgtableData[orgIndex].typeText;
        newData[targetIndex].transferDate = null;
        newData[targetIndex].dept = orgtableData[orgIndex].dept
        newData[targetIndex].deptText = orgtableData[orgIndex].deptText
        newData[targetIndex].divisionProvince = orgtableData[orgIndex].divisionProvince
        newData[targetIndex].divisionProvinceText = orgtableData[orgIndex].divisionProvinceText
        newData[targetIndex].divisionCity = orgtableData[orgIndex].divisionCity
        newData[targetIndex].divisionCityText = orgtableData[orgIndex].divisionCityText
        newData[targetIndex].divisionCounty = orgtableData[orgIndex].divisionCounty
        newData[targetIndex].divisionCountyText = orgtableData[orgIndex].divisionCountyText
        delete newData[targetIndex].editable
        this.$refs.dept[targetIndex].getCurrent(newData[targetIndex].dept, newData[targetIndex].deptText)

        let divisionProvince = Number(newData[targetIndex].divisionProvince)
        let divisionCity = Number(newData[targetIndex].divisionCity)
        let divisionCounty = Number(newData[targetIndex].divisionCounty)
        let divisions = [divisionProvince, divisionCity, divisionCounty].filter(Boolean)
        const divisionOption = [{
          name: newData[targetIndex].divisionProvinceText,
          id: divisionProvince
        }]
        if (newData[targetIndex].divisionCity === null) {
          divisionOption[0].children = [{
            name: newData[targetIndex].divisionCountyText,
            id: divisionCounty
          }]
        } else {
          divisionOption[0].children = [{
            name: newData[targetIndex].divisionCityText,
            id: divisionCity,
            children: [{
              name: newData[targetIndex].divisionCountyText,
              id: divisionCounty
            }]
          }]
        }
        this.$refs.ssx[targetIndex].getCurrent(divisions, divisionOption)

        this.tableData = newData
      }
    },
    focusSelect(record){
      this.selectedRow = record.personId
    },
    personGroupFocusSelect(record){
      this.selectedRow = record.personId
      this.initPersonnelGroupDic(record)
    },
    deptFocusSelect(record){
      this.selectedRow = record.personId
      this.initPersonnelGroupDic(record)
    },
    filterOption (input, option) {
      return (
        option.data.attrs.detail.pinyin == null
          ? option.data.attrs.detail.name.toLowerCase().indexOf(input.toLowerCase()) >= 0
          : option.data.attrs.detail.pinyin.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
          option.data.attrs.detail.name.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    setDivision (newVal, oldVal) {
      const newData = [...this.tableData]
      var target = newData.filter(item => this.selectedRow === item.personId)[0];
      if (target){
        target.divisionProvince = newVal.province
        target.divisionCity = newVal.city
        target.divisionCounty = newVal.county
        this.tableData = newData
      }
    },
    onRowSelectChange(record, selected, selectedRows, nativeEvent){
      this.$nextTick(() => {
        this.selectRecord = record;
        const newData = [...this.tableData];
        if (selected) {//选择
          // this.selectedRowKeys = this.selectedRowKeys2
          // this.selectedRows = this.selectedRows2
          const target = newData.filter(item => record.personId === item.personId)[0];
          if (target) {
            this.selectedRow = target.personId
            target.editable = true
            this.personnelGroupDic = [{ id: target.personnelGroup, name: target.personnelGroupText }]
            this.tableData = newData
          }
        } else {//取消选择
          const orgtableData = [...this.orgtableData];
          let index = -1;
          for (let i=0;i<orgtableData.length;i++){
            let item = orgtableData[i]
            if(this.isObjectValueEqual(Object.assign({}, item),Object.assign({}, record))){
              index = i
            }
          }
          //index !== -1 表示此条内容未做修改
          if (index !== -1){
            // this.selectedRowKeys = this.selectedRowKeys2
            // this.selectedRows = this.selectedRows2
            const target = newData.filter(item => item.personId === orgtableData[index].personId)[0];
            if (target) {
              target.editable = false
              target.communicationSubsidy = orgtableData[index].communicationSubsidy;
              target.communicationSubsidyText = orgtableData[index].communicationSubsidyText;
              target.graduationDate = orgtableData[index].graduationDate;
              target.id = orgtableData[index].id;
              target.jobCategory = orgtableData[index].jobCategory;
              target.jobCategoryText = orgtableData[index].jobCategoryText;
              target.localflag = orgtableData[index].localflag;
              target.localflagText = orgtableData[index].localflagText;
              target.personId = orgtableData[index].personId;
              target.personName = orgtableData[index].personName;
              target.personnelGroup = orgtableData[index].personnelGroup;
              target.personnelGroupText = orgtableData[index].personnelGroupText;
              target.post = orgtableData[index].post;
              target.postText = orgtableData[index].postText;
              target.pym = orgtableData[index].pym;
              target.ssx = orgtableData[index].ssx;
              target.type = orgtableData[index].type;
              target.typeText = orgtableData[index].typeText;
              target.transferDate = null;
              target.dept = orgtableData[index].dept
              target.deptText = orgtableData[index].deptText
              target.divisionProvince = orgtableData[index].divisionProvince
              target.divisionProvinceText = orgtableData[index].divisionProvinceText
              target.divisionCity = orgtableData[index].divisionCity
              target.divisionCityText = orgtableData[index].divisionCityText
              target.divisionCounty = orgtableData[index].divisionCounty
              target.divisionCountyText = orgtableData[index].divisionCountyText
              delete target.editable
              this.tableData = newData
            }
            this.visible = false
          }else{
            //修改过内容
            this.visible = true
          }
        }
      })
    },
    isObjectValueEqual(a, b){
      //取对象a和b的属性名
      var aProps = Object.getOwnPropertyNames(a);
      var bProps = Object.getOwnPropertyNames(b);
      //判断属性名的length是否一致
      // if (aProps.length != bProps.length) {
      //   return false;
      // }
      //循环取出属性名，再判断属性值是否一致
      for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];
        if(propName != 'transferDate' && propName !=  'editable'){
          if (a[propName] !== b[propName]) {
            return false;
          }
        }
      }
      return true;
    },
    onSelectChange(selectedRowKeys, selectedRows,event){
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    initDeptDic(){
      for (let i=0;i<this.tableData.length;i++){
        const target = this.tableData[i]
        this.$refs.dept[i].getCurrent(target.dept, target.deptText)
      }
    },
    initAdminVisionDic(){
      for (let i = 0;i < this.tableData.length; i++){
        const target = this.tableData[i]
        let divisionProvince = Number(target.divisionProvince)
        let divisionCity = Number(target.divisionCity)
        let divisionCounty = Number(target.divisionCounty)
        let divisions = [divisionProvince, divisionCity, divisionCounty].filter(Boolean)
        const divisionOption = [{
          name: target.divisionProvinceText,
          id: divisionProvince
        }]
        if (target.divisionCity === null) {
          divisionOption[0].children = [{
            name: target.divisionCountyText,
            id: divisionCounty
          }]
        } else {
          divisionOption[0].children = [{
            name: target.divisionCityText,
            id: divisionCity,
            children: [{
              name: target.divisionCountyText,
              id: divisionCounty
            }]
          }]
        }
        this.$refs.ssx[i].getCurrent(divisions, divisionOption)
      }
    },
    reinitDic(record){
      const communicationSubsidyDic = [...this.communicationSubsidyDic]
      this.communicationSubsidyDic = communicationSubsidyDic
      this.focusSelect(record)
    },
    initDic(){
      getDic().then(res=>{
        if(res.code === 200){
          this.postDic = res.body.postDic
          this.jobCategoryDic = res.body.jobCategoryDic
          this.communicationSubsidyDic = res.body.communicationSubsidyDic
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    doQuery(){
      this.saveVisible = false
      if(this.selectedRowKeys.length > 0){
        this.querySaveVisible = true
        return
      }else{
        this.querySaveVisible = false
        this.queryParam.pageNo = 1
        this.page.pageNo = 1
        this.nextPageNo = 1
        this.getPersonTransferList()
      }
    },
    getPersonTransferList(){
      this.Loading = true
      this.pageLoading = true
      doQueryPersonTransfer(this.queryParam).then(res=>{
        if (res.code === 200){
          const items = res.body.items
          this.tableData = []
          this.orgtableData = []
          this.tableData = this.tableData.concat(items)
          items.map(item=>{
            this.orgtableData.push(Object.assign({}, item))
          })
          this.page.totalCount = res.body.totalCount
          this.selectedRowKeys = []
          this.selectedRows = null
          this.selectedRow = null
          this.$nextTick(()=>{
            this.initDeptDic()
            this.initAdminVisionDic()
          })
        }
        this.Loading = false
        this.pageLoading = false
      }).catch(err=>{
        this.Loading = false
        this.pageLoading = false
      })
    },
    onPageChange (current) {
      this.querySaveVisible = false
      this.nextPageNo = current
      if(this.selectedRowKeys.length > 0){
        this.saveVisible = true
        this.page.pageNo = this.queryParam.pageNo
        return
      }else{
        this.saveVisible = false
        this.page.pageNo = current
        this.queryParam.pageNo = current
        this.getPersonTransferList()
      }
    },
    doSave(){
      if ( this.selectedRowKeys.length <= 0){
        this.$message.warn("请先选择需要调动的人员信息！")
        return;
      }
      const formDatas = [...this.selectedRows]
      let hasTransferDate = true
      formDatas.map(item=>{
        if(item.transferDate == null || item.transferDate == undefined){
          this.$message.warn("请选择 "+item.personName+" 调动日期！")
          hasTransferDate = false
        }
      })
      if (!hasTransferDate){
        return;
      }
      doSavePersonTransfer(formDatas).then(res=>{
        if(res.code === 200){
          this.$message.success("调动成功！")
          this.getPersonTransferList()
          this.selectedRowKeys = []
          this.selectedRows = null
          this.selectedRow = null
          this.querySaveVisible = false
          this.saveVisible = false
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    onClickRow (record, index) {
      return {
        on: {
          click: () => {
            this.selectedRow = record.personId
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
    deptChange(newVal){
      const newData = [...this.tableData]
      var target = newData.filter(item => this.selectedRow === item.personId)[0];
      if (target){
        target.dept = newVal
        var year = new Date().getFullYear()
        const param = { deptId: newVal, year: year }
        this.personnelGroupDic = []
        getPersonnelGroupDic(param).then(res => {
          if (res.code === 200) {
            this.personnelGroupDic = res.body
            if (this.personnelGroupDic.length > 0) {
              target.personnelGroup = this.personnelGroupDic[0].id
              target.personnelGroupText = this.personnelGroupDic[0].name
            } else {
              target.personnelGroup = null
              target.personnelGroupText = ""
            }
          }
        })
        this.tableData = newData
      }
    },
    handleLocalFlagChange(value,option){
      var text = option.componentOptions.children[0].componentOptions.children[0].children[0].text
      const newData = [...this.tableData]
      var target = newData.filter(item => this.selectedRow === item.personId)[0];
      if (target){
        target.localflag = value
        target.localflagText = text.trim()
        this.tableData = newData
      }
    },
    handlePostChange(value,option){
      const newData = [...this.tableData]
      var target = newData.filter(item => this.selectedRow === item.personId)[0];
      if (target){
        target.post = value
        target.postText = option.trim()
        this.tableData = newData
      }
    },
    handleGroupChange(value,option){
      var text = option.componentOptions.children[0].componentOptions.children[0].children[0].text
      const newData = [...this.tableData]
      var target = newData.filter(item => this.selectedRow === item.personId)[0];
      if (target){
        target.personnelGroup = value
        target.personnelGroupText = text.trim()
        this.tableData = newData
      }
    },
    handleSubsidyChange(value,option){
      // var text = option.componentOptions.children[0].componentOptions.children[0].children[0].text
      const newData = [...this.tableData]
      var target = newData.filter(item => this.selectedRow === item.personId)[0];
      if (target){
        target.communicationSubsidy = value
        target.communicationSubsidyText = option.trim()
        this.tableData = newData
      }
    },
    handleJobCategoryChange(value,option){
      const newData = [...this.tableData]
      var target = newData.filter(item => this.selectedRow === item.personId)[0];
      if (target){
        target.jobCategory = value
        target.jobCategoryText = option.trim()
        this.tableData = newData
      }
    },
    handleTypeChange(value,option){
      var text = option.componentOptions.children[0].componentOptions.children[0].children[0].text
      const newData = [...this.tableData]
      var target = newData.filter(item => this.selectedRow === item.personId)[0];
      if (target){
        target.type = value
        target.typeText = text.trim()
        this.tableData = newData
      }
    },
    onDateChange(value, dateString){
      const newData = [...this.tableData]
      var target = newData.filter(item => this.selectedRow === item.personId)[0];
      if (target){
        target.transferDate = value
        this.tableData = newData
      }
    }
  },
}
</script>

<style scoped lang="less">
/deep/ .ant-cascader-menu-item {
  padding: 5px 12px;
  line-height: 22px;
  white-space: nowrap;
  cursor: pointer;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  color: black;
}

.disabledSelect .ant-select-arrow .ant-select-arrow-icon svg{
  color: transparent;
}
</style>