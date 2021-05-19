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
            <a-input-search
              placeholder="请输入工号/姓名/拼音简码查询"
              :allowClear="true"
              style="width: 250px;"
              v-model="queryParam.inputContent"
              @search="doQueryPersonStock"
              @pressEnter="doQueryPersonStock"/>
            <a-divider type="vertical"/>
            <a-button type="primary" icon="search" @click="doQueryPersonStock">查询</a-button>
            <a-divider type="vertical"/>
            <a-button type="primary" icon="plus-circle" @click="doCreatePersonStock">新增</a-button>
            <a-divider type="vertical"/>
            <a-upload :customRequest="doUploadData" :showUploadList="false" :fileList="fileList" :remove="handleRemove" :beforeUpload="beforeUpload">
              <a-button type="primary" icon="upload" :loading="isUploading">导入</a-button>
            </a-upload>
            <a-divider v-action:1 type="vertical"/>
            <a-button v-action:1 type="primary" icon="download" @click="doExportPersonStock" :loading="isExporting">导出</a-button>
            <a-divider type="vertical"/>
            <a-button type="primary" icon="snippets" @click="doDownloadTemplate" :loading="isDownloading">下载模板</a-button>
            <a-divider type="vertical"/>
            <a-button type="danger" icon="delete" @click="doBatchDelete">批量删除</a-button>
          </a-col>
        </a-row>
        <a-row style="margin-bottom:5px">
          <a-col>
            <a-radio-group v-model="queryParam.flag" @change="onFlagChange">
              <a-radio value="-1">
                全部
              </a-radio>
              <a-radio value="0">
                在职
              </a-radio>
              <a-radio value="1">
                离职
              </a-radio>
            </a-radio-group>
          </a-col>
        </a-row>
        <a-row style="margin-bottom:5px;" v-if="isDisplaying">
          <a-col>
            <template>
              <span>导出结果：{{ importResultMsg }}</span>
              <a-button
                type="primary"
                icon="file-excel"
                @click="doDownloadErrorRecords"
                :loading="isErrorDownloading"
                v-if="haveErrors"
                style="margin-left:20px">查看</a-button>
              <a-icon type="close-circle" @click="handleClose" style="margin-left:20px"></a-icon>
            </template>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      ref="table"
      size="small"
      :rowKey="(record) => record.id"
      :columns="personStockColumns"
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
      <template slot="deptName" slot-scope="text">
        <a-tooltip>
          <template slot="title">
            {{ text }}
          </template>
          {{ text }}
        </a-tooltip>
      </template>
      <template slot="flag" slot-scope="text">
        <a-badge text="在职" status="success" v-if="text === '0'"/>
        <a-badge text="离职" status="error"  v-if="text === '1'"/>
      </template>
      <template slot="remark" slot-scope="text">
        <a-tooltip>
          <template slot="title">
            {{ text }}
          </template>
          {{ text }}
        </a-tooltip>
      </template>
      <template slot="operation" slot-scope="text, record">
        <a @click="doOperate('modify', record)">修改</a>
        <a-divider type="vertical"/>
        <a @click="doOperate('remove', record)">删除</a>
      </template>
    </s-table>
    <a-drawer
      :title="drawerTitle"
      :wrapStyle="{overflow: 'hidden'}"
      placement="right"
      :closable="false"
      :width="450"
      @close="onDrawerClose"
      :visible="drawerVisible"
      :bodyStyle="{ padding: '0px 0px 0px 0px' }"
    >
      <person-stock-maintain-module-view :personStockInfo="personStockInfo" :operation="operation" @close="onDrawerClose" @refresh="doQueryPersonStock" v-if="drawerVisible"></person-stock-maintain-module-view>
    </a-drawer>
  </a-card>
</template>

<script>
import { STable, DeptSelect } from '@/components'
import { doLoadPersonStockList, doLogoutPersonStock, doBatchLogoutPersonStocks, exportPersonStockTemplate, importPersonStocks, exportErrorRecords, exportPersonStock } from '@/api/personStock'
import moment from 'moment/moment'
import { downFile } from '@/utils/util'
import store from '@/store'
import PersonStockMaintainModuleView from './component/PersonStockMaintainModuleView'
export default {
  name: 'PersonStockView',
  components: {
    STable,
    DeptSelect,
    PersonStockMaintainModuleView
  },
  data () {
    return {
      moment,
      tableHeight: 0,
      queryParam: { pageSize: 25, flag: '-1', inputContent: '' },
      rowSelected: '',
      pagination: { pageNumber: 1, pageSize: 25, totalCount: 1 },
      personStockColumns: [
        {
          dataIndex: 'personName',
          width: '9%',
          title: '姓名'
        },
        {
          dataIndex: 'deptName',
          width: '16%',
          title: '部门',
          ellipsis: true,
          scopedSlots: { customRender: 'deptName' }
        },
        {
          dataIndex: 'flag',
          width: '8%',
          title: '状态',
          scopedSlots: { customRender: 'flag' }
        },
        {
          dataIndex: 'resignationDate',
          width: '10%',
          title: '离职日期'
        },
        {
          dataIndex: 'registerName',
          width: '10%',
          title: '登记人员'
        },
        {
          dataIndex: 'registerDate',
          width: '10%',
          title: '登记日期'
        },
        {
          dataIndex: 'remark',
          width: '17%',
          title: '备注',
          ellipsis: true,
          scopedSlots: { customRender: 'remark' }
        },
        {
          dataIndex: 'operation',
          width: '9%',
          title: '操作',
          scopedSlots: { customRender: 'operation' },
          align: 'center'
        }
      ],
      loadTableList: parameter => {
        return doLoadPersonStockList(Object.assign(parameter, this.queryParam)).then(res => {
          if (res.code === 200) {
            this.selectedRowKeys = []
            this.personStockList = res.body.items
            this.pagination.pageNumber = res.body.pageNumber + 1
            this.pagination.totalCount = res.body.totalCount
            return res.body
          }
        })
      },
      isDownloading: false,
      isExporting: false,
      isErrorDownloading: false,
      isUploading: false,
      fileList: [],
      uploadTypes: ['xls', 'xlsx'],
      registrationDate: [],
      dateRangeMode: ['month', 'month'],
      importResultMsg: '',
      isDisplaying: false,
      haveErrors: false,
      selectedRowKeys: [],
      drawerTitle: '',
      drawerVisible: false,
      personStockInfo: {},
      operation: '',
      personStockList: []
    }
  },
  computed: {
    cardHeight: function () {
      return window.innerHeight - 85
    },
    listScrollHeight: function () {
      return this.isDisplaying ? window.innerHeight - 325 : window.innerHeight - 285
    }
  },
  methods: {
    onFlagChange (e) {
      this.queryParam.flag = e.target.value
      this.doQueryPersonStock()
    },
    doQueryPersonStock (index) {
      this.selectedRowKeys = []
      this.rowSelected = ''
      setTimeout(() => {
        this.$refs.table.refresh(index !== 1) // refresh() 不传参默认值 false 不刷新到分页第一页
      }, 100)
    },
    doCreatePersonStock () {
      this.drawerTitle = '员工股份信息维护-新增'
      this.drawerVisible = true
      this.operation = 'create'
    },
    doOperate (op, record) {
      this.operation = op
      this.rowSelected = record.id
      if (op === 'remove') {
        this.doDeleteOne(record.id)
      }
      if (op === 'modify') {
        this.doModify(record)
      }
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
      importPersonStocks(formData).then(res => {
        if (res.code === 200) {
          this.$message.success('导入结束')
          if (res.body.failCount > 0) {
            this.importResultMsg = '成功导入数据' + res.body.successCount + '条数据，导入失败' + res.body.failCount + '条数据，请点击右边下载查看导入失败数据！'
            this.haveErrors = true
          } else {
            this.importResultMsg = '成功导入数据' + res.body.successCount + '条数据，导入失败0条数据！'
          }
          this.isDisplaying = true
          me.doQueryPersonStock()
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
      params.context = this.$route.meta.title + '-下载模板'// 菜单名称
      params.personId = store.getters.userInfo.personId // 用户id
      params.system = 15 // 系统
      this.isDownloading = true
      exportPersonStockTemplate(params).then(res => {
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
    doExportPersonStock () {
      const params = {}
      Object.assign(params, this.queryParam)
      params.menuId = this.$route.meta.id // 菜单id
      params.context = this.$route.meta.title + '-导出'// 菜单名称
      params.personId = store.getters.userInfo.personId // 用户id
      params.system = 15 // 系统
      this.isExporting = true
      exportPersonStock(params).then(res => {
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
        this.isExporting = false
      }).catch(error => {
        console.log(error)
        this.isExporting = false
      })
    },
    doDownloadErrorRecords () {
      this.isErrorDownloading = true
      exportErrorRecords().then(res => {
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
    doBatchDelete () {
      if (this.selectedRowKeys.length === 0) {
        this.$message.error('未选择需要删除的数据！')
        return
      }
      const me = this
      this.$confirm({
        title: '是否确认删除选中的员工股份数据?',
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
          var ids = [ ...me.selectedRowKeys ]
          doBatchLogoutPersonStocks({ ids: ids }).then(res => {
            if (res.code === 200) {
              me.$message.success('删除成功！')
              me.selectedRowKeys = []
              var leftList = me.personStockList.filter(item => !ids.includes(item.id))
              var index = leftList.length === 0 ? 2 : 1
              me.doQueryPersonStock(index)
            }
          })
        }
      })
    },
    doDeleteOne (id) {
      const me = this
      this.$confirm({
        title: '是否确认删除该条员工股份记录?',
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
          doLogoutPersonStock({ id: id }).then(res => {
            if (res.code === 200) {
              me.$message.success('删除成功！')
              me.selectedRowKeys = me.selectedRowKeys.filter(item => item !== id)
              var leftList = me.personStockList.filter(item => item.id !== id)
              var index = leftList.length === 0 ? 2 : 1
              me.doQueryPersonStock(index)
            }
          })
        }
      })
    },
    doModify (record) {
      this.drawerTitle = '员工股份信息（工号： ' + record.personId + ' )'
      this.personStockInfo = { ...record }
      this.drawerVisible = true
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
          },
          dblclick: () => {
            this.rowSelected = record.id
            this.operation = 'read'
            this.drawerTitle = '员工股份信息（工号： ' + record.personId + ' )'
            this.personStockInfo = { ...record }
            this.drawerVisible = true
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
    onDrawerClose () {
      this.drawerVisible = false
      this.drawerTitle = ''
    }
  }
}
</script>

<style scoped>
  /deep/ .ant-table-placeholder {
    display: none;
  }
</style>
