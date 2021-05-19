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
              style="width: 250px;margin-left: 20px"
              v-model="queryParam.inputContent"
              @search="doQueryPerformance"
              @pressEnter="doQueryPerformance"/>
            <a-button type="primary" icon="search" @click="doQueryPerformance" style="margin-left: 30px">查询</a-button>
            <a-divider type="vertical"/>
            <a-upload
              :customRequest="doUploadData"
              :showUploadList="false"
              :fileList="fileList"
              :remove="handleRemove"
              :beforeUpload="beforeUpload">
              <a-button type="primary" icon="upload" :loading="isUploading">导入数据</a-button>
            </a-upload>
            <a-divider type="vertical"/>
            <a-button type="primary" icon="download" @click="doDownloadTemplate" :loading="isDownloading">下载模板
            </a-button>
            <a-divider type="vertical"/>
            <a-button type="danger" icon="delete" @click="doBatchRemove">批量删除</a-button>
          </a-col>
        </a-row>
        <a-row style="margin-bottom:5px;height:35px">
          <a-col>
            <template v-if="isDisplaying">
              <span>导出结果：{{ importResultMsg }}</span>
              <a-button
                type="primary"
                icon="file-excel"
                @click="doDownloadErrorRecords"
                :loading="isErrorDownloading"
                v-if="haveErrors"
                style="margin-left:20px">导出</a-button>
              <a-icon type="close-circle" @click="handleClose" style="margin-left:20px"></a-icon>
            </template>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table
      v-watermark
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      ref="table"
      size="small"
      :rowKey="(record) => record.personId + '.' + record.year"
      :columns="performanceColumns"
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
    </s-table>
  </a-card>
</template>

<script>
import { STable, DeptSelect } from '@/components'
import MemorySelect from '@/components/MemorySelect/MemoryDeptSelect'
import { doLoadPerformanceList, exportTemplate, importPerformanceData, doDeletePerformanceData, exportPerformanceErrorRecords } from '@/api/performance'
import moment from 'moment/moment'
import { downFile } from '@/utils/util'
import store from '@/store'

export default {
  name: 'PerformanceView',
  components: {
    STable,
    DeptSelect,
    MemorySelect
  },
  data () {
    return {
      moment,
      cardHeight: 0,
      tableHeight: 0,
      listScrollHeight: 0,
      queryParam: { pageSize: 25, year: null, deptId: null, inputContent: '' },
      rowSelected: '',
      pagination: { pageNumber: 1, pageSize: 25, totalCount: 1 },
      performanceColumns: [
        {
          dataIndex: 'personName',
          width: '8%',
          title: '姓名'
        },
        {
          dataIndex: 'deptName',
          width: '13%',
          title: '所在部门'
        },
        {
          dataIndex: 'performance',
          width: '10%',
          title: '年度绩效分'
        },
        {
          dataIndex: 'evaluationGrade',
          width: '10%',
          title: '绩效等级'
        },
        {
          dataIndex: 'evaluationContent',
          width: '28%',
          title: '评价内容'
        },
        {
          dataIndex: 'evaluationPersonName',
          width: '13%',
          title: '登记人',
          align: 'center'
        },
        {
          dataIndex: 'evaluationDate',
          width: '13%',
          title: '登记日期'
        }
      ],
      loadTableList: parameter => {
        return doLoadPerformanceList(Object.assign(parameter, this.queryParam)).then(res => {
          if (res.code === 200) {
            this.pagination.pageNumber = res.body.pageNumber + 1
            this.pagination.totalCount = res.body.totalCount
            return res.body
          }
        })
      },
      isDownloading: false,
      isUploading: false,
      fileList: [],
      uploadTypes: ['xls', 'xlsx'],
      selectedRowKeys: [],
      importResultMsg: '',
      isDisplaying: false,
      haveErrors: false,
      isErrorDownloading: false
    }
  },
  methods: {
    handleYearChange (val) {
      this.queryParam.year = val
      this.doQueryPerformance()
    },
    handleDeptChange (val) {
      this.queryParam.deptId = val
      this.doQueryPerformance()
    },
    doQueryPerformance () {
      this.rowSelected = ''
      setTimeout(() => {
        this.$refs.table.refresh(true) // refresh() 不传参默认值 false 不刷新到分页第一页
      }, 100)
    },
    doUploadData () {
      this.isUploading = true
      this.loading = true
      const { fileList } = this
      const formData = new FormData()
      fileList.forEach(file => {
        formData.append('file', file)
      })
      const me = this
      importPerformanceData(formData).then(res => {
        if (res.code === 200) {
          if (res.body.failCount > 0) {
            this.importResultMsg = '成功导入数据' + res.body.successCount + '条数据，导入失败' + res.body.failCount + '条数据，请点击右边下载查看导入失败数据！'
            this.haveErrors = true
          } else {
            this.importResultMsg = '成功导入数据' + res.body.successCount + '条数据，导入失败0条数据！'
          }
          this.isDisplaying = true
          me.doQueryPerformance()
        }
        me.isUploading = false
      })
    },
    handleRemove (file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    beforeUpload (file) {
      const suffix = file.name.substr(file.name.lastIndexOf('.') + 1)
      const index = this.uploadTypes.findIndex(item => item === suffix)
      if (index === -1) {
        this.$message.error('文件格式不对!')
        return false
      } else {
        this.fileList = [file]
        return true
      }
    },
    doDownloadTemplate () {
      const params = {}
      Object.assign(params, this.queryParam)
      params.menuId = this.$route.meta.id // 菜单id
      params.context = this.$route.meta.title // 菜单名称
      params.personId = store.getters.userInfo.personId // 用户id
      params.system = 15 // 系统
      this.isDownloading = true
      exportTemplate(params).then(res => {
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
    doDownloadErrorRecords () {
      this.isErrorDownloading = true
      exportPerformanceErrorRecords().then(res => {
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
    },
    doBatchRemove () {
      if (this.selectedRowKeys.length === 0) {
        this.$message.error('未选择需要删除的数据！')
        return
      }
      const me = this
      var deleteArry = []
      this.selectedRowKeys.forEach(item => {
        deleteArry.push({ personId: item.split('.')[0], year: item.split('.')[1] })
      })
      this.$confirm({
        title: '是否确认删除选中的年度绩效数据?',
        // 确认 与 关闭位置对调
        cancelText: '确定',
        okText: '关闭',
        okButtonProps: {
          props: {
            type: 'default'
          }
        },
        cancelButtonProps: {
          props: {
            type: 'primary'
          }
        },
        onOk () {
        },
        onCancel () {
          doDeletePerformanceData(deleteArry).then(res => {
            if (res.code === 200) {
              me.$message.success('删除成功！')
              me.selectedRowKeys = []
              me.doQueryPerformance()
            }
          })
        }
      })
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    onClickRow (record, index) {
      return {
        on: {
          click: () => {
            this.rowSelected = record.personId + '.' + record.year
          }
        }
      }
    },
    setCurrentRow (record, index) {
      var styleClassName = ''
      if (record.personId + '.' + record.year === this.rowSelected) {
        styleClassName = 'clickRowStyle hoverRowStyle'
      }
      return styleClassName
    },
    handleClose () {
      this.haveErrors = false
      this.isDisplaying = false
      this.importResultMsg = ''
    },
    initPage () {
      var currentYear = moment().year()
      this.queryParam.year = currentYear
      this.listScrollHeight = window.innerHeight - 300
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
