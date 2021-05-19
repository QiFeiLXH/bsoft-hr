<template>
  <a-card :bordered="false" :bodyStyle="{height:'2000px',padding: '10px 10px'}">
    <!--    <a-input-search placeholder="请输入人员财务类别信息" style="width: 300px;margin-bottom: 10px" @search="onSearch" />-->
    <a-row style="margin-bottom: 10px;margin-top:5px;">
      <!--    <span>调动日期：</span>-->
      <!--    <a-select v-model="queryParam.transferDate" @change="onFinancialTypeChange" allowClear  style="width :200px">-->
      <!--      <a-select-option v-for="e in financialTypeAfterData" :key="e.id">{{ e.name }}</a-select-option>-->
      <!--    </a-select>-->
      <a-month-picker @change="onDateChange"
                      v-model="queryParam.transferDate"
                      fomat="YYYY-MM-DD"
      />
      <a-divider type="vertical"/>
      <span>调后部门：</span>
      <memory-dept-select style="width:200px"
                          :storageKey="'DeptCostMaintainView_deptUseful_01'"
                          ref="dept" :disabled="false"
                          :dept-type="queryParam.xdno"
                          placeholder="按部门查询" @change="handleDeptChange">
      </memory-dept-select>
      <a-divider type="vertical"/>
<!--      <person-select ref="person" @change="onApplyUserChange" allow-clear style="width :200px">-->
<!--      </person-select>-->
      <a-input-search placeholder="工号/姓名(拼音码)"
                      v-model="queryParam.xuslgname"
                      style="width: 200px"
                      :allowClear="true"
                      @search="onPersonChange"
                      @pressEnter="onPersonChange"
      />
      <a-divider type="vertical"/>
      <a-checkbox @change="onFlagChange">含新入司</a-checkbox>
      <a-divider type="vertical"/>
      <a-button type="primary"  @click="onPersonChange" >查询</a-button>
      <a-divider type="vertical"/>
      <a-button v-action:1 type="primary" icon="download" @click="doDownloadTemplate" :loading="isDownloading">导出</a-button>

    </a-row>

    <a-table
      :columns="columns"
      :dataSource="data"
      :rowKey="(record) => record.id"
      :scroll="{ x: 1975,y: listScrollHeight }"
      :bodyStyle="{ height: listScrollHeight + 'px' }"
      :bordered="false"
      @change = "handleTableChange"
      :pagination="pagination"
      size="small"
      v-watermark>
      <template slot="rowIndex" slot-scope="text, record, index">
        <span>{{ (pagination.current - 1) * pagination.pageSize + index + 1 }}</span>
      </template>

      <template slot="personId" slot-scope="text, record">
        <span v-if="record.flag && record.flag === '1'" style="color: red">{{text}}</span>
        <span v-else>{{text}}</span>
      </template>

      <template slot="personName" slot-scope="text, record">
        <span v-if="record.flag && record.flag === '1'" style="color: red">{{text}}</span>
        <span v-else>{{text}}</span>
      </template>

    </a-table>
<!--    <footer-tool-bar>-->
<!--      <a-pagination-->
<!--        :total="pagination.totalCount"-->
<!--        :pageSize.sync="pagination.pageSize"-->
<!--        v-model="pagination.current"-->
<!--        @change="pageChange"-->
<!--        :showTotal="total => `共 ${total} 条`"-->
<!--        style="margin-top: 10px"/>-->
<!--    </footer-tool-bar>-->
  </a-card>
</template>
<script>
  import FooterToolBar from '@/components/FooterToolbar'
  import moment from 'moment/moment'
  import {STable} from '@/components'
  import {getPersonTransferCondition,exportdownload} from '@/api/PersonTransferCondition'
  import MemoryDeptSelect from "@/components/MemorySelect/MemoryDeptSelect";
  import PersonSelect from "@/module/person/PersonSelect/PersonSelect";
  import store from "@/store";
  import {exportKnowledgeLearnTemplate} from "@/api/learnshare";
  import {downFile} from "@/utils/util";

  export default {
    components: {
      PersonSelect,
      MemoryDeptSelect,
      FooterToolBar,
      STable,
    },
    name: 'PersonTransferCondition',
    data() {
      return {
        data: [],
        costTypedata: [],
        financialTypedata: [],
        columns: [
          {
            title: '序号',
            width: 75,
            key: 'rowIndex',
            dataIndex: 'rowIndex',
            align: 'left',
            fixed: 'left',
            scopedSlots: {customRender: 'rowIndex'},
          },
          {
            title: '工号',
            width: 100,
            dataIndex: 'personId',
            fixed: 'left',
            scopedSlots: {customRender: 'personId'},
          },
          {
            title: '姓名',
            width: 100,
            dataIndex: 'personName',
            fixed: 'left',
            scopedSlots: {customRender: 'personName'},
          },
          {
            title: '调动日期',
            width: 100,
            dataIndex: 'transferDate',
            scopedSlots: {customRender: 'transferDate'},
          },
          {
            title: '调前部门',
            dataIndex: 'aheadDeptText',
            width: 150,
            scopedSlots: {customRender: 'aheadDeptText'},
          },
          {
            title: '调前岗位大类',
            dataIndex: 'aheadJobCategoryText',
            width: 125,
            scopedSlots: {customRender: 'aheadJobCategoryText'},
          },
          {
            title: '调前岗位',
            dataIndex: 'aheadPostText',
            width: 125,
            scopedSlots: {customRender: 'aheadPostText'},
          },
          {
            title: '调前核算口径归属',
            dataIndex: 'aheadCommunicationSubsidyText',
            width: 150,
            scopedSlots: {customRender: 'aheadCommunicationSubsidyText'},
          },
          {
            title: '调前费用类别',
            dataIndex: 'aheadCostText',
            width: 125,
            scopedSlots: {customRender: 'aheadCostText'},
          },
          {
            title: '调前财务类别',
            dataIndex: 'aheadFinancialText',
            width: 125,
            scopedSlots: {customRender: 'aheadFinancialText'},
          },
          {
            title: '调后部门',
            key: 'laterDeptText',
            dataIndex: 'laterDeptText',
            width: 150,
            scopedSlots: {customRender: 'laterDeptText'},
          },
          {
            title: '调后岗位大类',
            dataIndex: 'laterJobCategoryText',
            width: 125,
            scopedSlots: {customRender: 'laterJobCategoryText'},
          },
          {
            title: '调后岗位',
            dataIndex: 'laterPostText',
            width: 125,
            scopedSlots: {customRender: 'laterPostText'},
          },
          {
            title: '调后核算口径归属',
            dataIndex: 'laterCommunicationSubsidyText',
            width: 150,
            scopedSlots: {customRender: 'laterCommunicationSubsidyText'},
          },
          {
            title: '调后费用类别',
            dataIndex: 'laterCostText',
            width: 125,
            scopedSlots: {customRender: 'laterCostText'},
          },
          {
            title: '调后财务类别',
            dataIndex: 'laterFinancialText',
            width: 125,
            scopedSlots: {customRender: 'laterFinancialText'},
          },
        ],
        listScrollHeight : window.innerHeight - 280,
        editingKey: '',
        queryParam: {xdno: null, xuslgname: null, transferDate: null, pageNo: 1, pageSize: 25,flag:0},
        personflag: 0,
        deleteMsg: '',
        isDownloading: false,
        pagination: { current: 1, pageSize: 25, total: 0,},

      };
    },
    computed: {
      rowSelection() {
        return {
          onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          },


          getCheckboxProps: record => ({
            props: {
              disabled: record.name === 'Disabled User', // Column configuration not to be checked
              name: record.name,
            },
          }),
        };
      },

    },
    mounted() {
        this.queryParam.transferDate=moment(moment()).startOf('month').format('YYYY-MM-DD')
        this.doQuery()
    },
    methods: {
      moment,
      doQuery() {
        const params = {
          xuslgname: this.queryParam.xuslgname,
          xdno: this.queryParam.xdno,
          transferDate: this.queryParam.transferDate,
          // deptType: this.deptTypeId,
          pageNo: this.pagination.current,
          pageSize: this.pagination.pageSize,
          flag:this.queryParam.flag
        }
        getPersonTransferCondition(params).then(res => {
          if(res.code===200){
            this.pagination.total = res.body.totalCount
            this.data = res.body.items;
          }
        })
      },
      pageChange(current){
        this.queryParam.pageNo=current;
        getPersonTransferCondition(this.queryParam)
          .then(res => {
            if (res.code === 200) {
              this.data = res.body.items;
              this.pagination.totalCount= res.body.totalCount;
            }
          })
      },
      handleDeptChange(value) {
        this.queryParam.xdno = value
        this.pagination.current = 1
        this.doQuery()
      },
      onPersonChange(value) {
        this.pagination.current = 1
        this.doQuery()
      },
      onFlagChange(e){
        if(e.target.checked){
          this.queryParam.flag = 1
        }else{
          this.queryParam.flag = 0
        }
        this.pagination.current = 1
        this.doQuery()
      },
      doDownloadTemplate () {
        const params = {}
        Object.assign(params, this.queryParam)
        params.menuId = this.$route.meta.id // 菜单id
        params.context = this.$route.meta.title // 菜单名称
        params.personId = store.getters.userInfo.personId // 用户id
        params.system = 15 // 系统
        exportdownload(params).then(res => {
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
          this.isDownloading = false
        }).catch(error => {
          console.log(error)
          this.isDownloading = false
        })
      },

      handleInputChange(val, key) {
        const newData = [...this.data];
        const target = newData.filter(item => key === item.id)[0];
        if (target) {
          target.name = val;
          this.data = newData;
        }
      },
      handleTableChange(pagination) {
        this.pagination.current = pagination.current
        this.pagination.pageSize = pagination.pageSize
        this.doQuery()
      },
      onDateChange(date, dateString) {
        if (dateString === '') {
          this.queryParam.transferDate = null
        } else {
          this.queryParam.transferDate = dateString + '-01'
        }
        this.pagination.current = 1
        this.doQuery();
      },
      disabledStartDate(current) {
        return current && current > moment();
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
