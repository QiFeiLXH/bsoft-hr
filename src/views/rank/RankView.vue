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
            <dept-select v-model="queryParam.deptId" style="width:150px;margin-left: 20px" placeholder="按部门查询"
                         @change="handleDeptChange"></dept-select>
            <a-input-search
              placeholder="请输入姓名或拼音简码查询"
              :allowClear="true"
              style="width: 250px;margin-left: 20px"
              v-model="queryParam.inputContent"
              @search="doQueryRank"
              @pressEnter="doQueryRank"/>
            <a-button type="primary" icon="search" @click="doQueryRank" style="margin-left: 30px">查询</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table
      ref="table"
      size="small"
      :rowKey="(record) => record.id"
      :columns="rankColumns"
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
      <template slot="evalResult" slot-scope="text">
        {{text | resultFilter }}
      </template>
      <template slot="pptName" slot-scope="text, record">
        <template v-if="record.pptId">
          <img :src="require(`@/assets/fileicon/fileicon-s-pptx.png`) " style="margin-right: 10px;"/>
          <span style="cursor:pointer" class="hoverClass">{{ text }}</span>
        </template>
      </template>
    </s-table>
  </a-card>
</template>

<script>
  import {STable, DeptSelect} from '@/components'
  import { doLoadRankList,downloadPPTFile } from '@/api/rank'
  import moment from 'moment/moment'
  import {downFile} from '@/utils/util'

  const resultMap = {
    1: {
      text: '通 过'
    },
    2: {
      text: '未通过'
    },
    null: {
      text: ''
    }
  }
  export default {
    name: "RankView",
    components: {
      STable,
      DeptSelect
    },
    data() {
      return {
        moment,
        cardHeight: 0,
        tableHeight: 0,
        listScrollHeight: 0,
        queryParam: {pageSize: 25, year: null, deptId: null, inputContent: ''},
        rowSelected: '',
        pagination: {pageNumber: 1, pageSize: 25, totalCount: 1},
        rankColumns: [
          {
            dataIndex:'rowIndex',
            width:'3%',
            title: '',
            scopedSlots: { customRender: 'rowIndex' },
          },
          {
            dataIndex: 'personName',
            width: '6%',
            title: '姓名'
          },
          {
            dataIndex: 'deptName',
            width: '10%',
            title: '所在部门'
          },
          {
            dataIndex: 'rankSequenceText',
            width: '8%',
            title: '申报序列'
          },
          {
            dataIndex: 'declareGradeText',
            width: '7%',
            title: '申报职级'
          },
          {
            dataIndex: 'declareDate',
            width: '7%',
            title: '申报日期'
          },
          {
            dataIndex: 'evalScore',
            width: '7%',
            title: '评分'
          },
          {
            dataIndex: 'expertOpinion',
            width: '14%',
            title: '专家意见'
          },
          {
            dataIndex: 'leaderOpinion',
            width: '14%',
            title: '领导意见'
          },
          {
            dataIndex: 'evalResult',
            width: '6%',
            title: '评定结果',
            align: 'center',
            scopedSlots: { customRender: 'evalResult' },
          },
          {
            dataIndex: 'gradeText',
            width: '6%',
            title: '评定职级'
          },
          {
            dataIndex: 'pptName',
            width: '12%',
            title: '申报PPT',
            scopedSlots: { customRender: 'pptName' },
            customCell: (record, rowindex) => {
              return {
                on: {
                  click: () => {
                    if (record.pptId) {
                      this.doDownloadPPTFile(record.pptId)
                    }
                  }
                }
              }
            },
          }
        ],
        loadTableList: parameter => {
          return doLoadRankList(Object.assign(parameter, this.queryParam)).then(res => {
            if (res.code === 200) {
              this.pagination.pageNumber = res.body.pageNumber + 1
              this.pagination.totalCount = res.body.totalCount
              return res.body
            }
          })
        }
      }
    },
    filters: {
      resultFilter (val) {
        return resultMap[val].text
      }
    },
    methods: {
      handleYearChange(val) {
        this.queryParam.year = val
        this.doQueryRank()
      },
      handleDeptChange(val) {
        this.queryParam.deptId = val
        this.doQueryRank()
      },
      doQueryRank() {
        this.rowSelected = ''
        setTimeout(() => {
          this.$refs.table.refresh(true) // refresh() 不传参默认值 false 不刷新到分页第一页
        }, 100)
      },
      doDownloadPPTFile (pptId) {
        downloadPPTFile({pptId: pptId}).then(res => {
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
              this.rowSelected = record.id
            }
          }
        }
      },
      setCurrentRow(record, index) {
        var styleClassName = ''
        if (record.id  === this.rowSelected) {
          styleClassName = 'clickRowStyle hoverRowStyle'
        }
        return styleClassName
      },
      initPage() {
        var currentYear = moment().year()
        this.queryParam.year = currentYear
        this.listScrollHeight = window.innerHeight - 260
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

  span.hoverClass:hover{
    color:#1890FF;
    text-decoration: underline;
  }
</style>