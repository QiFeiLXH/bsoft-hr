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
            <span style="margin-right:15px">登记日期:</span>
            <a-range-picker
              :allowClear="true"
              format="YYYY-MM"
              v-model="registrationDate"
              :mode="dateRangeMode"
              @change="handleMonthRangeChange"
              @panelChange="handlePanelChange"
              :style="{ marginLeft: '10',width: '200px' }"/>
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
              @search="doQueryKnowledgeLearn"
              @pressEnter="doQueryKnowledgeLearn"/>
            <a-button type="primary" icon="search" @click="doQueryKnowledgeLearn" style="margin-left: 30px">查询</a-button>
            <a-divider type="vertical"/>
            <a-upload :customRequest="doUploadData" :showUploadList="false" :fileList="fileList" :remove="handleRemove" :beforeUpload="beforeUpload">
              <a-button type="primary" icon="upload" :loading="isUploading">导入数据</a-button>
            </a-upload>
            <a-divider type="vertical"/>
            <a-button type="primary" icon="download" @click="doDownloadTemplate" :loading="isDownloading">下载模板</a-button>
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
      :rowKey="(record) => record.id"
      :columns="learnColumns"
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
      <template slot="learningRate" slot-scope="text">
        <span>
          {{ text | PercentFormat }}
        </span>
      </template>
      <template slot="learningTime" slot-scope="text">
        <span>
          {{ (text/60).toFixed(2) }}
        </span>
      </template>
    </s-table>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import MemorySelect from '@/components/MemorySelect/MemoryDeptSelect'
import { doLoadKnowledgeLearnList, exportKnowledgeLearnTemplate, importKnowledgeLearnData, exportLearnErrorRecords, doDeleteLearnData } from '@/api/learnshare'
import moment from 'moment/moment'
import { downFile } from '@/utils/util'
import store from '@/store'
export default {
  name: 'KnowledgeLearningModule',
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
      queryParam: { pageSize: 25, deptId: null, inputContent: '', startDate: '', endDate: '' },
      rowSelected: '',
      pagination: { pageNumber: 1, pageSize: 25, totalCount: 1 },
      learnColumns: [
        {
          dataIndex: 'personName',
          width: '8%',
          title: '姓名'
        },
        {
          dataIndex: 'deptName',
          width: '12%',
          title: '所在部门'
        },
        {
          dataIndex: 'knowledgeName',
          width: '23%',
          title: '知识名称'
        },
        {
          dataIndex: 'learningRate',
          width: '9%',
          title: '学习进度',
          scopedSlots: { customRender: 'learningRate' }
        },
        {
          dataIndex: 'learningModel',
          width: '9%',
          title: '学习模式'
        },
        {
          dataIndex: 'learningTime',
          width: '9%',
          title: '学习时长(小时)',
          scopedSlots: { customRender: 'learningTime' }
        },
        {
          dataIndex: 'startDate',
          width: '12%',
          title: '开始时间'
        },
        {
          dataIndex: 'endDate',
          width: '12%',
          title: '结束时间'
        }
      ],
      loadTableList: parameter => {
        return doLoadKnowledgeLearnList(Object.assign(parameter, this.queryParam)).then(res => {
          if (res.code === 200) {
            this.pagination.pageNumber = res.body.pageNumber + 1
            this.pagination.totalCount = res.body.totalCount
            return res.body
          }
        })
      },
      isDownloading: false,
      isErrorDownloading: false,
      isUploading: false,
      fileList: [],
      uploadTypes: ['xls', 'xlsx'],
      registrationDate: [],
      dateRangeMode: ['month', 'month'],
      importResultMsg: '',
      isDisplaying: false,
      haveErrors: false,
      selectedRowKeys: []
    }
  },
  methods: {
    handleMonthRangeChange (val) {
      if (val.length === 0) {
        this.queryParam.startDate = ''
        this.queryParam.endDate = ''
      }
    },
    handlePanelChange (val, mode) {
      this.registrationDate = val
      this.queryParam.startDate = val[0].format('YYYY-MM-DD')
      this.queryParam.endDate = val[1].format('YYYY-MM-DD')
    },
    handleDeptChange (val) {
      this.queryParam.deptId = val
      this.doQueryKnowledgeLearn()
    },
    doQueryKnowledgeLearn () {
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
      importKnowledgeLearnData(formData).then(res => {
        if (res.code === 200) {
          if (res.body.failCount > 0) {
            this.importResultMsg = '成功导入数据' + res.body.successCount + '条数据，导入失败' + res.body.failCount + '条数据，请点击右边下载查看导入失败数据！'
            this.haveErrors = true
          } else {
            this.importResultMsg = '成功导入数据' + res.body.successCount + '条数据，导入失败0条数据！'
          }
          this.isDisplaying = true
          me.doQueryKnowledgeLearn()
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
      exportKnowledgeLearnTemplate(params).then(res => {
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
      exportLearnErrorRecords().then(res => {
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
      this.$confirm({
        title: '是否确认删除选中的知识学习数据?',
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
          doDeleteLearnData({ deletes: me.selectedRowKeys }).then(res => {
            if (res.code === 200) {
              me.$message.success('删除成功！')
              me.selectedRowKeys = []
              me.doQueryKnowledgeLearn()
            }
          })
        }
      })
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    handleClose () {
      this.haveErrors = false
      this.isDisplaying = false
      this.importResultMsg = ''
    },
    onClickRow (record, index) {
      return {
        on: {
          click: () => {
            this.rowSelected = record.id
          }
        }
      }
    },
    setCurrentRow (record, index) {
      var styleClassName = ''
      if (record.id === this.rowSelected) {
        styleClassName = 'clickRowStyle hoverRowStyle'
      }
      return styleClassName
    },
    initPage () {
      var theFirstMonthOfYear = moment().startOf('year') // 当年第一个月
      var currentMonth = moment() // 今天
      this.registrationDate.push(theFirstMonthOfYear, currentMonth)
      this.queryParam.startDate = theFirstMonthOfYear.format('YYYY-MM-DD').toString()
      this.queryParam.endDate = currentMonth.endOf('month').format('YYYY-MM-DD').toString()
      this.listScrollHeight = window.innerHeight - 360
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
    top:36px;
    width:100%
  }
</style>
