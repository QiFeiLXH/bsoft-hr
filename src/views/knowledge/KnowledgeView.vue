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
            <dept-select v-model="queryParam.deptId" style="width:150px;" placeholder="按部门查询"
                         @change="handleDeptChange"></dept-select>
            <a-input-search
              placeholder="请输入姓名或拼音简码查询"
              :allowClear="true"
              style="width: 250px;margin-left: 20px"
              v-model="queryParam.inputContent"
              @search="doQueryKnowledge "
              @pressEnter="doQueryKnowledge"/>
            <a-button type="primary" icon="search" @click="doQueryKnowledge" style="margin-left: 30px">查询</a-button>
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
          :columns="knowledgeNumColumns"
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
          :columns="knowledgeInfoColumns"
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
          <template slot="outline" slot-scope="text">
            <a-tooltip>
              <template slot="title">
                <span>{{text}}</span>
              </template>
              <div style="width: 100%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{text}}</div>
            </a-tooltip>
          </template>
          <template slot="master" slot-scope="text">
            <a-checkbox :checked="text === 1"></a-checkbox>
          </template>
          <template slot="enclosureName" slot-scope="text, record">
            <template v-if="record.enclosure">
              <template v-if="record.enclosureName.split('.')[1]">
                <img :src="require(`@/assets/fileicon/fileicon-s-${record.enclosureName.split('.')[1]}.png`) " style="margin-right: 10px;"/>
                <span style="cursor:pointer" class="hoverClass">{{ text }}</span>
              </template>
              <template v-else>
                <span style="cursor:pointer" class="hoverClass">{{ text }}</span>
              </template>
            </template>
          </template>
          <template slot="operate" slot-scope="text, record">
            <a @click="doOperate(record)">查看</a>
          </template>
        </s-table>
        <a-drawer
          title="知识贡献详情"
          :wrapStyle="{overflow: 'hidden'}"
          placement="right"
          :closable="false"
          :width="600"
          @close="onDrawerClose"
          :visible="drawerVisible"
          :bodyStyle="{ padding: '0px 0px 0px 0px' }"
        >
          <a-card :bordered="false" :body-style="{ height:drawerCardHeight + 'px',padding:'10px 0px 0px 10px'}">
            <div :style="{ height: formHeight + 'px',paddingBottom: '50px', overflowY: 'auto' }">
              <a-form-model :model="knowledgeForm" ref="knowledgeForm">
                <a-form-model-item
                  label="完成日期"
                  :labelCol="{lg: {span: 5}, sm: {span: 2}}"
                  :wrapperCol="{lg: {span: 19}, sm: {span: 20} }"
                  prop="finishDate"
                  style="margin-bottom: 10px;"
                >
                  <a-date-picker v-model="knowledgeForm._finishDate" :disabled="true" style="width: 220px"/>
                </a-form-model-item>
                <a-form-model-item
                  label="知识贡献目录"
                  :labelCol="{lg: {span: 5}, sm: {span: 2}}"
                  :wrapperCol="{lg: {span: 19}, sm: {span: 20} }"
                  prop="catalog"
                  style="margin-bottom: 10px;"
                >
                  <a-input v-model="knowledgeForm.catalog" style="width: 400px;color: #000000" :readOnly="true"></a-input>
                </a-form-model-item>
                <a-form-model-item
                  label="第几作者"
                  :labelCol="{lg: {span: 5}, sm: {span: 2}}"
                  :wrapperCol="{lg: {span: 19}, sm: {span: 20} }"
                  prop="author"
                  style="margin-bottom: 10px;"
                >
                  <a-input v-model="knowledgeForm.author" style="width: 400px;color: #000000" :readOnly="true"></a-input>
                </a-form-model-item>
                <a-form-model-item
                  label="概要描述"
                  :labelCol="{lg: {span: 5}, sm: {span: 2}}"
                  :wrapperCol="{lg: {span: 19}, sm: {span: 20} }"
                  prop="outline"
                  style="margin-bottom: 10px;"
                >
                  <a-textarea
                    v-model="knowledgeForm.outline"
                    style="width: 400px;color: #000000"
                    :readOnly="true"
                    :maxLength="80"
                    :auto-size="{ minRows: 4, maxRows: 4 }"/>
                </a-form-model-item>
                <a-form-model-item
                  label="是否代表作"
                  :labelCol="{lg: {span: 5}, sm: {span: 2}}"
                  :wrapperCol="{lg: {span: 19}, sm: {span: 20} }"
                  prop="approval"
                  style="margin-bottom: 10px;"
                >
                  <a-switch
                    checked-children="是"
                    un-checked-children="否"
                    :checked="knowledgeForm.master === 1"/>
                </a-form-model-item>
              </a-form-model>
            </div>
            <div
              :style="{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '950px',
            borderTop: '1px solid #e9e9e9',
            padding: '9px 16px',
            background: '#fff',
            textAlign: 'right',
          }"
            >
              <a-button key="back" icon="close" @click="onDrawerClose" style="margin-left: 20px">关闭</a-button>
            </div>
          </a-card>
        </a-drawer>
      </a-col>
    </a-row>

  </a-card>
</template>

<script>
  import {STable, DeptSelect} from '@/components'
  import {doLoadPersonalKnowledgeNumList, doLoadPersonalKnowledgeList, downloadEnclosure } from '@/api/knowledge'
  import {downFile} from '@/utils/util'
  import moment from 'moment/moment'

  export default {
    name: "KnowledgeView",
    components: {
      STable,
      DeptSelect
    },
    data() {
      return {
        moment,
        cardHeight: 0,
        drawerCardHeight: window.innerHeight - 60,
        formHeight: window.innerHeight - 110,
        tableHeight: 0,
        listScrollHeight: 0,
        infoListScrollHeight: 0,
        queryParam: {pageSize: 25, deptId: null, inputContent: ''},
        knowledgeInfoQueryParam: {pageSize: 25, personId: null},
        rowSelected: '',
        infoRowSelected: '',
        pagination: {pageNumber: 1, pageSize: 25, totalCount: 1},
        infoPagination: {pageNumber: 1, pageSize: 25, totalCount: 1},
        drawerVisible: false,
        knowledgeNumColumns: [
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
            dataIndex: 'knowledgeNumber',
            width: '25%',
            title: '知识贡献数',
            align: 'center'
          }
        ],
        knowledgeInfoColumns: [
          {
            dataIndex: 'rowIndex',
            width: '6%',
            title: '',
            scopedSlots: {customRender: 'rowIndex'},
          },
          {
            dataIndex: 'catalog',
            width: '15%',
            title: '知识贡献'
          },
          {
            dataIndex: 'finishDate',
            width: '12%',
            title: '完成日期'
          },
          {
            dataIndex: 'author',
            width: '10%',
            title: '第几作者'
          },
          {
            dataIndex: 'master',
            width: '8%',
            title: '代表作',
            align: 'center',
            scopedSlots: {customRender: 'master'}
          },
          {
            dataIndex: 'outline',
            width: '22%',
            title: '概要描述',
            scopedSlots: {customRender: 'outline'}
          },
          {
            dataIndex: 'enclosureName',
            width: '19%',
            title: '附件',
            scopedSlots: {customRender: 'enclosureName'},
            customCell: (record, rowindex) => {
              return {
                on: {
                  click: () => {
                    if (record.enclosure) {
                      this.doDownloadFile(record.enclosure)
                    }
                  }
                }
              }
            },
          },
          {
            dataIndex: 'operate',
            width: '8%',
            title: '操作',
            scopedSlots: {customRender: 'operate'}
          }
        ],
        loadTableList: parameter => {
          return doLoadPersonalKnowledgeNumList(Object.assign(parameter, this.queryParam)).then(res => {
            if (res.code === 200) {
              this.pagination.pageNumber = res.body.pageNumber + 1
              this.pagination.totalCount = res.body.totalCount
              if (res.body.items.length > 0) {
                this.rowSelected = res.body.items[0].personId
              } else {
                this.rowSelected = ''
              }
              this.knowledgeInfoQueryParam.personId = this.rowSelected
              this.doQueryKnowledgeInfo()
              return res.body
            }
          })
        },
        loadInfoTableList: parameter => {
          return doLoadPersonalKnowledgeList(Object.assign(parameter, this.knowledgeInfoQueryParam)).then(res => {
            if (res.code === 200) {
              this.infoPagination.pageNumber = res.body.pageNumber + 1
              this.infoPagination.totalCount = res.body.totalCount
              return res.body
            }
          })
        },
        knowledgeForm: {
          id: null,
          personId: null,
          catalog: null,
          finishDate: null,
          _finishDate: null,
          outline: null,
          author: null,
          master: null
        }
      }
    },
    methods: {
      handleDeptChange(val) {
        this.queryParam.deptId = val
        this.doQueryKnowledge()
      },
      doQueryKnowledge() {
        this.rowSelected = ''
        setTimeout(() => {
          this.$refs.table.refresh(true) // refresh() 不传参默认值 false 不刷新到分页第一页
        }, 100)
      },
      doQueryKnowledgeInfo() {
        this.infoRowSelected = ''
        setTimeout(() => {
          this.$refs.infoTable.refresh(true) // refresh() 不传参默认值 false 不刷新到分页第一页
        }, 100)
      },
      doOperate (data) {
        this.drawerVisible = true
        this.knowledgeForm = {...data}
        this.knowledgeForm._finishDate = moment(this.knowledgeForm.finishDate)
      },
      onDrawerClose () {
        this.drawerVisible = false
        this.resetForm()
      },
      resetForm () {
        this.$refs.knowledgeForm.resetFields()
        this.knowledgeForm.id = null
        this.knowledgeForm.personId = null
        this.knowledgeForm.catalog = null
        this.knowledgeForm.author = null
        this.knowledgeForm.master = null
        this.knowledgeForm.outline = null
        this.knowledgeForm.finishDate = null
        this.knowledgeForm._finishDate = null
      },
      doDownloadFile (fileId) {
        downloadEnclosure({fileId: fileId}).then(res => {
          const headers = res.headers
          const contentType = headers['content-type']
          if (res.data) {
            const blob = new Blob([res.data], {type: contentType})
            const contentDisposition = res.headers['content-disposition']
            let fileName = 'unknown'
            if (contentDisposition) {
              fileName = window.decodeURI(res.headers['content-disposition'].split('=')[1])
            }
            downFile(blob, fileName)
          }
        }).catch(error => {
          console.log(error)
        })
      },
      onClickRow(record, index) {
        return {
          on: {
            click: () => {
              this.rowSelected = record.personId
              this.knowledgeInfoQueryParam.personId = this.rowSelected
              this.doQueryKnowledgeInfo()
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

  /deep/ .ant-calendar-picker-input.ant-input {
    line-height: 1.5;
    color: #000000;
    background: #ffffff;
  }
  span.hoverClass:hover{
    color:#1890FF;
    text-decoration: underline;
  }

</style>