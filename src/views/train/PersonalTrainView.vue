<template>
  <a-card
    :bordered="false"
    :bodyStyle="{
      height:cardHeight+'px',
      padding: '0px 10px'
    }">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row style="margin-bottom: 10px;margin-top:10px;">
          <a-col>
            <span style="margin-right:15px">年份：</span>
            <a-input-number v-model="queryParam.year" @change="handleYearChange"/>
            <memory-select
              :storageKey="'PerformanceView_deptUseful_01'"
              ref="dept"
              v-model="queryParam.deptId"
              @change="handleDeptChange"
              style="width:150px;margin-left: 20px"
              placeholder="按部门查询"></memory-select>
            <a-input-search
              placeholder="请输入姓名或拼音简码查询"
              :allowClear="true"
              style="width: 250px;margin:0px 20px"
              v-model="queryParam.inputContent"
              @search="doQueryPersonalTrain"
              @pressEnter="doQueryPersonalTrain"/>
            <a-radio-group v-model="queryParam.sortFlag" @change="handleSortChange">
              <a-radio :value="1">
                按授课时排序
              </a-radio>
              <a-radio :value="2">
                按参训课时排序
              </a-radio>
            </a-radio-group>
            <a-button type="primary" icon="search" @click="doQueryPersonalTrain" style="margin-left: 30px">查询</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table
      ref="table"
      size="small"
      :rowKey="(record) => record.personId"
      :columns="personalTrainColumns"
      :height="tableHeight"
      :data="loadTableList"
      :customRow="onClickRow"
      :rowClassName="setCurrentRow"
      :showSizeChanger="false"
      :pageSize="pagination.pageSize"
      :pageNum="pagination.pageNumber"
      :showPagination="true"
      :bodyStyle="{ minHeight:listScrollHeight+'px' }"
      :scroll="{ x: false, y: listScrollHeight }"
    >
      <template slot="rowIndex" slot-scope="text, record, index">
        <span>
          {{ (pagination.pageNumber - 1) * pagination.pageSize + index + 1 }}
        </span>
      </template>
      <template slot="totalTeachingHours" slot-scope="text">
        <span v-if="text > 0">
          {{ text }}
        </span>
      </template>
      <template slot="totalTrainingHours" slot-scope="text">
        <span v-if="text > 0">
          {{ text }}
        </span>
      </template>
      <template slot="eofficeHours" slot-scope="text">
        <span v-if="text > 0">
          {{ text }}
        </span>
      </template>
      <template slot="yxtLearnSelfHours" slot-scope="text">
        <span v-if="text > 0">
          {{ text }}
        </span>
      </template>
      <template slot="yxtLearnAssignedHours" slot-scope="text">
        <span v-if="text > 0">
          {{ text }}
        </span>
      </template>
      <template slot="shareCount" slot-scope="text">
        <span v-if="text > 0">
          {{ text }}
        </span>
      </template>
    </s-table>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import MemorySelect from '@/components/MemorySelect/MemoryDeptSelect'
import { doLoadPersonalTrainList } from '@/api/personaltrain'
import moment from 'moment/moment'
import store from '@/store'
const permissions = store.getters.roles.permissions

export default {
  name: 'PersonalTrainView',
  components: {
    STable,
    MemorySelect
  },
  data () {
    return {
      moment,
      cardHeight: 0,
      tableHeight: 0,
      listScrollHeight: 0,
      queryParam: { pageSize: 25, year: null, deptId: null, sortFlag: 1, inputContent: '', allPermission: false },
      rowSelected: '',
      pagination: { pageNumber: 1, pageSize: 25, totalCount: 1 },
      personalTrainColumns: [
        {
          dataIndex: 'rowIndex',
          width: '6%',
          title: '序号',
          scopedSlots: { customRender: 'rowIndex' }
        },
        {
          dataIndex: 'personName',
          width: '9%',
          title: '姓名'
        },
        {
          dataIndex: 'deptName',
          width: '14%',
          title: '所在部门'
        },
        {
          dataIndex: 'totalTeachingHours',
          width: '10%',
          title: '授课课时',
          scopedSlots: { customRender: 'totalTeachingHours' }
        },
        {
          dataIndex: 'totalTrainingHours',
          width: '10%',
          title: '总参训课时',
          scopedSlots: { customRender: 'totalTrainingHours' }
        },
        {
          dataIndex: 'eofficeHours',
          width: '14%',
          title: '其中：Eoffice参训记录课时',
          scopedSlots: { customRender: 'eofficeHours' }
        },
        {
          dataIndex: 'yxtLearnSelfHours',
          width: '14%',
          title: '云学堂(自学课时)',
          scopedSlots: { customRender: 'yxtLearnSelfHours' }
        },
        {
          dataIndex: 'yxtLearnAssignedHours',
          width: '14%',
          title: '云学堂(指派学习课时)',
          scopedSlots: { customRender: 'yxtLearnAssignedHours' }
        },
        {
          dataIndex: 'shareCount',
          width: '9%',
          title: '知识分享个数',
          scopedSlots: { customRender: 'shareCount' }
        }
      ],
      loadTableList: parameter => {
        return doLoadPersonalTrainList(Object.assign(parameter, this.queryParam)).then(res => {
          if (res.code === 200) {
            this.pagination.pageNumber = res.body.pageNumber + 1
            this.pagination.totalCount = res.body.totalCount
            return res.body
          }
        })
      }
    }
  },
  methods: {
    handleYearChange (val) {
      this.queryParam.year = val
      this.doQueryPersonalTrain()
    },
    handleDeptChange (val) {
      this.queryParam.deptId = val
      this.doQueryPersonalTrain()
    },
    handleSortChange (val) {
      this.queryParam.sortFlag = val.target.value
      this.doQueryPersonalTrain()
    },
    doQueryPersonalTrain () {
      this.rowSelected = ''
      setTimeout(() => {
        this.$refs.table.refresh(true) // refresh() 不传参默认值 false 不刷新到分页第一页
      }, 100)
    },
    onClickRow (record, index) {
      return {
        on: {
          click: () => {
            this.rowSelected = record.personId
          }
        }
      }
    },
    setCurrentRow (record, index) {
      var styleClassName = ''
      if (record.personId === this.rowSelected) {
        styleClassName = 'clickRowStyle hoverRowStyle'
      }
      return styleClassName
    },
    getUserPermissions () {
      if (permissions.length > 0) {
        for (var i = 0; i < permissions.length; i++) {
          if (permissions[i].permissionId === this.$route.meta.permission) {
            if (permissions[i].actionList.includes('1')) {
              this.queryParam.allPermission = true
              return
            }
          }
        }
      }
    },
    initPage () {
      this.getUserPermissions()
      var currentYear = moment().year()
      this.queryParam.year = currentYear
      this.listScrollHeight = window.innerHeight - 270
      this.cardHeight = window.innerHeight - 85
    }
  },
  created () {
    this.initPage()
  }
}
</script>

<style scoped>
  /deep/ .ant-table-placeholder {
    position: absolute;
    z-index: 1;
    padding: 16px 16px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    text-align: center;
    background: #fff;
    border-bottom: 1px solid #e8e8e8;
    border-radius: 0 0 4px 4px;
    margin-top: 1px;
    top: 36px;
    width: 100%
  }

</style>
