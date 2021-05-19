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
<!--            <dept-select v-model="queryParam.deptId" style="width:150px;" placeholder="按部门查询"-->
<!--                         @change="handleDeptChange"></dept-select>-->
            <memory-dept-select style="width:250px;" :storageKey="'WorkCertificateView_deptUseful_01'" ref="dept" :disabled="false" v-model="queryParam.deptId"  @change="handleDeptChange"></memory-dept-select>
            <a-input-search
              placeholder="请输入姓名或拼音简码查询"
              :allowClear="true"
              style="width: 250px;margin-left: 20px"
              v-model="queryParam.inputContent"
              @search="doQueryCertificate"
              @pressEnter="doQueryCertificate"/>
            <a-button type="primary" icon="search" @click="doQueryCertificate" style="margin-left: 30px">查询</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-row>
      <a-col :span="6">
        <s-table
          ref="table"
          size="small"
          :rowKey="(record) => record.personId"
          :columns="certificateNumColumns"
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
        </s-table>
      </a-col>
      <a-col :span="18">
        <s-table
          ref="infoTable"
          size="small"
          :rowKey="(record) => record.id"
          :columns="certificateInfoColumns"
          :height="tableHeight"
          :data="loadInfoTableList"
          :customRow="onInfoClickRow"
          :rowClassName="setInfoCurrentRow"
          :showSizeChanger="false"
          :pageSize="infoPagination.pageSize"
          :pageNum="infoPagination.pageNumber"
          :showPagination="true"
          :bodyStyle="{ minHeight:infoListScrollHeight+'px' }"
          :scroll="{ x: false, y: infoListScrollHeight }"
        >
          <template slot="rowIndex" slot-scope="text, record, index">
            <span>
              {{ (infoPagination.pageNumber - 1) * infoPagination.pageSize + index + 1 }}
            </span>
          </template>
        </s-table>
      </a-col>
    </a-row>

  </a-card>
</template>

<script>
  import {STable, DeptSelect} from '@/components'
  import {doLoadPersonalCertificateNumList, doLoadPersonalCertificateList} from '@/api/certificate'
  import MemoryDeptSelect from "../../components/MemorySelect/MemoryDeptSelect";
  export default {
    name: "WorkCertificateView",
    components: {
      STable,
      MemoryDeptSelect,
      DeptSelect
    },
    data() {
      return {
        cardHeight: 0,
        tableHeight: 0,
        listScrollHeight: 0,
        infoListScrollHeight: 0,
        queryParam: {pageSize: 25, deptId: null, inputContent: ''},
        certificateInfoQueryParam: {pageSize: 25, personId: null},
        rowSelected: '',
        infoRowSelected: '',
        pagination: {pageNumber: 1, pageSize: 25, totalCount: 1},
        infoPagination: {pageNumber: 1, pageSize: 25, totalCount: 1},
        certificateNumColumns: [
          {
            dataIndex: 'rowIndex',
            width: '10%',
            title: '',
            scopedSlots: {customRender: 'rowIndex'},
          },
          {
            dataIndex: 'deptName',
            width: '35%',
            title: '部门'
          },
          {
            dataIndex: 'personName',
            width: '30%',
            title: '姓名'
          },
          {
            dataIndex: 'certificatesNum',
            width: '25%',
            title: '证书数量',
            align: 'center'
          }
        ],
        certificateInfoColumns: [
          {
            dataIndex: 'rowIndex',
            width: '10%',
            title: '',
            scopedSlots: {customRender: 'rowIndex'},
          },
          {
            dataIndex: 'getDate',
            width: '20%',
            title: '获取日期'
          },
          {
            dataIndex: 'cerName',
            width: '25%',
            title: '证书/职称名称'
          },
          {
            dataIndex: 'cerNum',
            width: '20%',
            title: '证书编号'
          },
          {
            dataIndex: 'organ',
            width: '25%',
            title: '发证机构'
          }
        ],
        loadTableList: parameter => {
          return doLoadPersonalCertificateNumList(Object.assign(parameter, this.queryParam)).then(res => {
            if (res.code === 200) {
              this.pagination.pageNumber = res.body.pageNumber + 1
              this.pagination.totalCount = res.body.totalCount
              if (res.body.items.length > 0) {
                this.rowSelected = res.body.items[0].personId
              } else {
                this.rowSelected = ''
              }
              this.certificateInfoQueryParam.personId = this.rowSelected
              this.doQueryCertificateInfo()
              return res.body
            }
          })
        },
        loadInfoTableList: parameter => {
          return doLoadPersonalCertificateList(Object.assign(parameter, this.certificateInfoQueryParam)).then(res => {
            if (res.code === 200) {
              this.infoPagination.pageNumber = res.body.pageNumber + 1
              this.infoPagination.totalCount = res.body.totalCount
              return res.body
            }
          })
        }
      }
    },
    methods: {
      handleDeptChange(val) {
        this.queryParam.deptId = val
        this.doQueryCertificate()
      },
      doQueryCertificate() {
        this.rowSelected = ''
        setTimeout(() => {
          this.$refs.table.refresh(true) // refresh() 不传参默认值 false 不刷新到分页第一页
        }, 100)
      },
      doQueryCertificateInfo() {
        this.infoRowSelected = ''
        setTimeout(() => {
          this.$refs.infoTable.refresh(true) // refresh() 不传参默认值 false 不刷新到分页第一页
        }, 100)
      },
      onClickRow(record, index) {
        return {
          on: {
            click: () => {
              this.rowSelected = record.personId
              this.certificateInfoQueryParam.personId = this.rowSelected
              this.doQueryCertificateInfo()
            }
          }
        }
      },
      setCurrentRow(record, index) {
        var styleClassName = ''
        if (record.personId === this.rowSelected) {
          styleClassName = 'clickRowStyle hoverRowStyle'
        }
        return styleClassName
      },
      onInfoClickRow(record, index) {
        return {
          on: {
            click: () => {
              this.infoRowSelected = record.id
            }
          }
        }
      },
      setInfoCurrentRow(record, index) {
        var styleClassName = ''
        if (record.id === this.infoRowSelected) {
          styleClassName = 'clickRowStyle hoverRowStyle'
        }
        return styleClassName
      },
      initPage() {
        this.listScrollHeight = window.innerHeight - 260
        this.infoListScrollHeight = window.innerHeight - 260
        this.cardHeight = window.innerHeight - 85
      }
    },
    created() {
      this.initPage()
    },
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