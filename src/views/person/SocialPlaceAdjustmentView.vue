<template>
  <a-spin :spinning="isSpinning">
    <a-card
      :bordered="false"
      :bodyStyle="{
        height:cardHeight+'px',
        padding: '0px 10px'
      }">
      <div>
        <a-form layout="inline">
          <a-row style="margin-bottom: 10px;margin-top:10px;">
            <a-col :span="6">
              <span>部门类型：</span>
              <a-select
                v-model="deptQueryParam.deptType"
                show-search
                option-filter-prop="children"
                style="width: 150px;color: #000000"
                :filter-option="filterOption"
                @change="handleDeptTypeChange">
                <a-select-option value="1">
                  行政职能
                </a-select-option>
                <a-select-option value="2">
                  大区
                </a-select-option>
                <a-select-option value="3">
                  事业部
                </a-select-option>
                <a-select-option value="4">
                  其他
                </a-select-option>
              </a-select>
            </a-col>
            <a-col :span="18">
              <!--<company-select
                v-model="personQueryParam.companyId"
                style="width:150px;"
                :type="2"
                placeholder="现社保缴纳地"
                @change="handleCompanyChange"></company-select>-->
              <general-dic-select
                :storageKey="'SocialPlaceAdjustmentView_companyUseful_01'"
                customLabel="abbreviation"
                customKey="companyId"
                :allowClear="true"
                :searchable="true"
                :custom-list="companyList"
                v-model="personQueryParam.companyId"
                :width="208"
                placeholder="现社保缴纳地"
                :customSearchCondition="['abbreviation', 'pinyinCode']"
                @getGeneralDicList="loadCompanySelect"
                @change="handleCompanyChange"></general-dic-select>
              <a-divider type="vertical"/>
              <a-input-search
                placeholder="请输入姓名/拼音/工号查询"
                :allowClear="true"
                style="width: 300px"
                v-model="personQueryParam.inputContent"
                @search="handleInputChange"
                @pressEnter="handleInputChange"/>
              <a-divider type="vertical"/>
              <a-checkbox-group :value="personQueryParam.valid" :options="plainOptions" @change="handleValidChange"/>
              <a-divider type="vertical"/>
              <a-button type="primary" @click="doQuery">查询</a-button>
              <a-divider type="vertical"/>
              <a-button type="primary" @click="handleBatchSave">保存</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <a-row>
        <a-col :span="6">
          <a-spin :spinning="deptLoading || setDeptLoading">
            <a-card
              :bodyStyle="{
                height:viewHeight +'px',
                padding: '0px 10px'
              }">
              <div class="treeStyle" :style="{height: viewHeight-180+'px'}">
                <a-empty v-if="deptLoading"></a-empty>
                <a-tree
                  v-watermark
                  v-else
                  show-icon
                  :blockNode="true"
                  :expanded-keys="expandedTreeKeys"
                  :selected-keys="selectedTreeKeys"
                  :tree-data="deptList"
                  :replaceFields="{children:'children', title:'title', key:'value' }"
                  @expand="expandedTree"
                  @select="onTreeSelect"
                >
                  <template slot="title-custom" slot-scope="item">
                    <template v-if="item.value === 'all'"><span style="font-weight: bold">{{ item.title }}</span>
                    </template>
                    <template v-else><span>{{ item.title }}</span></template>
                  </template>
                  <template slot="meh">
                    <a style="color:#FFD659;">
                      <a-icon type="folder" theme="filled"/>
                    </a>
                  </template>
                  <template slot="icon-custom" slot-scope="{ expanded }">
                    <a style="color:#FFD659;">
                      <a-icon :type="expanded?'folder-open':'folder'" theme="filled"/>
                    </a>
                  </template>
                  <template slot="meho">
                    <a style="color:#FFD659;">
                      <a-icon type="file" theme="filled"/>
                    </a>
                  </template>
                </a-tree>
              </div>
            </a-card>
          </a-spin>
        </a-col>
        <a-col :span="18">
          <a-table
            v-watermark
            :loading="personLoading"
            size="small"
            class="personClass"
            :rowKey="(record) => record.personId"
            :row-selection="{ columnTitle: '选择', selectedRowKeys: selectedRowKeys, onChange: onRowChange, onSelect: onRowSelect,
                              getCheckboxProps: record => ({
                                props: {
                                  disabled: record.valid === '1'
                                }
                              }) }"
            :columns="personColumns"
            :dataSource="personList"
            :customRow="onPersonClickRow"
            :rowClassName="setPersonCurrentRow"
            :scroll="{ x: false, y: listScrollHeight }"
            :pagination="pagination"
            @change="handleCurrentPageChange"
            :bodyStyle="{ minHeight:listScrollHeight+'px' }"
          >
            <template slot="abbreviation" slot-scope="text, record">
              <a-tooltip>
                <template slot="title">
                  {{ record.nowPlaceName }}
                </template>
                {{ text }}
              </a-tooltip>
            </template>
            <template slot="personName" slot-scope="text, record">
              <span v-if="record.valid === '1'" style="color: red">{{ text }}</span>
              <span v-else>{{ text }}</span>
            </template>
            <template slot="month" slot-scope="text, record">
              <template v-if="selectedRowKeys.includes(record.personId) || record.isModified">
                <a-month-picker placeholder="调整月份" @change="onMonthChange" :value="text ? moment(text) : null" :class="record.isError && !text? 'errorClass': ''"/>
              </template>
              <template v-else>
                {{ text }}
              </template>
            </template>
            <template slot="placeName" slot-scope="text, record ">
              <template v-if="selectedRowKeys.includes(record.personId)|| record.isModified">
                <!--<company-select
                  :class="record.isError && !text? 'errorClass': ''"
                  :ref="record.ref"
                  :type="2"
                  v-model="record.place"
                  style="width:150px;"
                  placeholder="选择社保缴纳地"
                  @setCompany="setCompany"></company-select>-->
                <general-dic-select
                  :storageKey="'SocialPlaceAdjustmentView_companyUseful_02'"
                  customLabel="abbreviation"
                  customKey="companyId"
                  :allowClear="true"
                  :searchable="true"
                  :custom-list="companyList"
                  v-model="record.place"
                  :width="150"
                  placeholder="现社保缴纳地"
                  :customSearchCondition="['abbreviation', 'pinyinCode']"
                  @getGeneralDicList="loadCompanySelect"
                  @change="handleSocialPlaceChange"></general-dic-select>
              </template>
            </template>
          </a-table>
          <a-modal
            v-model="modalVisible"
            :footer="null"
            width="412px"
            :maskClosable="false"
            :bodyStyle="{ padding: '15px 15px' }"
            :closable="false">
            <a-card :bordered="false" :body-style="{ height:120 + 'px',padding:'26px 32px 20px'}">
              <div style="height: 50px">
                <a-icon type="question-circle" style="color: #faad14;font-size: 22px"></a-icon>
                <span style="display: inline;overflow: hidden;color: rgba(0,0,0,.85);font-weight: 500;font-size: 16px;line-height: 1.4;margin-left: 15px">数据未保存，是否需要保存数据？</span>
              </div>
              <div style="text-align: right">
                <a-button type="primary" @click="handleModalConfirm" style="margin-left: 20px">是</a-button>
                <a-button key="back" @click="handleModalCancel" style="margin-left: 20px">否</a-button>
              </div>
            </a-card>
          </a-modal>
        </a-col>
      </a-row>
      <a-drawer
        :title="drawerTitle"
        :wrapStyle="{overflow: 'hidden'}"
        placement="right"
        :closable="false"
        :width="850"
        @close="onDrawerClose"
        :visible="drawerVisible"
        :bodyStyle="{ padding: '0px 0px 0px 0px' }"
      >
        <a-card :bordered="false" :body-style="{ height:drawerCardHeight + 'px',padding:'10px 0px 0px 10px'}">
          <div :style="{ height: formHeight + 'px',paddingBottom: '50px', overflowY: 'hidden' }">
            <s-table
              ref="recordTable"
              class="custom"
              size="small"
              :rowKey="(record) => record.id"
              :columns="recordColumn"
              :height="tableHeight"
              :data="loadRecordList"
              :customRow="onRecordClickRow"
              :rowClassName="setRecordCurrentRow"
              :showSizeChanger="false"
              :pageSize="recordPagination.pageSize"
              :pageNum="recordPagination.pageNumber"
              :showPagination="true"
              :bodyStyle="{ minHeight: recordListScrollHeight+'px' }"
              :scroll="{ x: false, y: recordListScrollHeight }"
            >
              <template slot="rowIndex" slot-scope="text, record, index">
                <span>
                  {{ (recordPagination.pageNumber - 1) * recordPagination.pageSize + index + 1 }}
                </span>
              </template>
              <template slot="abbreviation" slot-scope="text, record">
                <a-tooltip>
                  <template slot="title">
                    {{ record.placeName }}
                  </template>
                  {{ text }}
                </a-tooltip>
              </template>
              <template slot="meeterName" slot-scope="text">
                <a-tooltip>
                  <template slot="title">
                    {{ text }}
                  </template>
                  {{ text }}
                </a-tooltip>
              </template>
            </s-table>
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
            <a-button key="back" @click="onDrawerClose" style="margin-left: 20px">关闭</a-button>
          </div>
        </a-card>
      </a-drawer>
    </a-card>
  </a-spin>

</template>

<script>
import { STable, DeptSelect } from '@/components'
import GeneralDicSelect from '@/components/MemorySelect/GeneralDicSelect'
import { CompanySelect } from '@/module'
import { getDeptSelectTree, getCompanyList } from '@/api/common'
import {
  doLoadPersonSocialPlaceList,
  doLoadPersonAdjustRecordList,
  doSavePersonalSocialPlace
} from '@/api/personSocialPlaceAdjustment'
import moment from 'moment'

const personColumns = [
  {
    dataIndex: 'deptName',
    title: '部门',
    width: '13%',
    align: 'left',
    className: 'center-th-header'
  }, {
    dataIndex: 'personId',
    title: '工号',
    width: '10%',
    align: 'center'
  }, {
    dataIndex: 'personName',
    title: '姓名',
    width: '10%',
    align: 'center',
    scopedSlots: { customRender: 'personName' }
  }, {
    dataIndex: 'abbreviation',
    title: '现社保缴纳地',
    width: '18%',
    scopedSlots: { customRender: 'abbreviation' },
    align: 'left',
    ellipsis: true,
    className: 'center-th-header'
  }, {
    dataIndex: 'month',
    title: '调整月份',
    width: '13%',
    scopedSlots: { customRender: 'month' }
  }, {
    dataIndex: 'placeName',
    title: '调整后社保缴纳地',
    width: '16%',
    align: 'left',
    scopedSlots: { customRender: 'placeName' }
  }]

const recordColumn = [
  {
    dataIndex: 'rowIndex',
    title: '序号',
    width: '6%',
    scopedSlots: { customRender: 'rowIndex' }
  }, {
    dataIndex: 'month',
    title: '调整月份',
    width: '13%'
  }, {
    dataIndex: 'abbreviation',
    title: '调整后社保缴纳地',
    width: '17%',
    scopedSlots: { customRender: 'abbreviation' },
    align: 'left',
    ellipsis: true,
    className: 'center-th-header'
  }, {
    dataIndex: 'meeterName',
    title: '调整后社保缴纳地对接人',
    width: '17%',
    align: 'left',
    ellipsis: true,
    scopedSlots: { customRender: 'meeterName' }
  }, {
    dataIndex: 'submitDate',
    title: '登记日期',
    width: '13%'
  }, {
    dataIndex: 'submitterName',
    title: '登记人',
    width: '10%'
  }]
export default {
  name: 'SocialPlaceAdjustmentView',
  components: {
    STable,
    DeptSelect,
    CompanySelect,
    GeneralDicSelect
  },
  data () {
    return {
      moment,
      cardHeight: 0,
      tableHeight: 0,
      listScrollHeight: 0,
      drawerCardHeight: window.innerHeight - 60,
      formHeight: window.innerHeight - 140,
      recordListScrollHeight: window.innerHeight - 230,
      currentPage: 0,
      personQueryParam: {
        deptId: null,
        socialPlaceId: null,
        inputContent: '',
        valid: ['0'],
        deptType: null,
        pageNo: 1,
        pageSize: 25
      },
      recordQueryParam: { personId: '', pageNo: 1, pageSize: 25 },
      deptQueryParam: { logout: '0', deptType: '1' },
      personRowSelected: '',
      deptRowSelected: '',
      recordRowSelected: '',
      personList: [],
      deptList: [],
      originalDeptList: [],
      checkedRowKeys: [],
      selectedTreeKeys: [],
      selectedRowKeys: [],
      selectedRows: [],
      expandedTreeKeys: [],
      personLoading: false,
      deptLoading: false,
      setDeptLoading: false,
      isSpinning: false,
      personColumns,
      recordColumn,
      allItem: [{
        children: [],
        parentId: null,
        title: '全部',
        value: 'all'
      }],
      pagination: {
        total: 0,
        size: 'small',
        current: 0,
        pageSize: 0
      },
      recordPagination: { pageNumber: 1, pageSize: 25, totalCount: 1 },
      plainOptions: [
        { label: '离职', value: '1' },
        { label: '在职', value: '0' }
      ],
      templateData: '',
      drawerTitle: '',
      drawerVisible: false,
      modalVisible: false,
      socialPlaceId: null,
      loadRecordList: parameter => {
        return doLoadPersonAdjustRecordList(Object.assign(parameter, this.recordQueryParam)).then(res => {
          if (res.code === 200) {
            this.recordPagination.pageNumber = res.body.pageNumber + 1
            this.recordPagination.totalCount = res.body.totalCount
            return res.body
          }
        })
      },
      companyList: []
    }
  },
  methods: {
    handleBatchSave (pagination, selectedKeys, personQueryParam) {
      const saveData = [...this.selectedRows]
      const data = [...this.personList]
      var comanyId = []
      var comany = []
      var judgeResult = 0
      data.forEach(item => {
        if (this.selectedRowKeys.includes(item.personId)) {
          if (!item.month || !item.place || !item.meeter || !item.meeterName) {
            item.isError = true
            judgeResult = true
            if (!item.meeter || !item.meeterName) {
              if (!comanyId.includes(item.place)) {
                comanyId.push(item.place)
                comany.push(item.placeName)
              }
            }
          } else {
            item.isError = false
          }
        }
      })
      if (judgeResult) {
        if (comanyId.length > 0) {
          var companys = comany.join(',')
          this.$message.warning(companys + '未维护对接人！')
        } else {
          this.$message.warning('所选项内容不能为空！')
        }
        this.personList = data
        return
      } else {
        if (pagination.current) {
          this.personQueryParam.pageNo = pagination.current
        }
        if (selectedKeys) {
          this.selectedTreeKeys = selectedKeys
          this.personQueryParam.deptId = selectedKeys
          if (selectedKeys === 'all') {
            this.personQueryParam.deptType = Number(this.deptQueryParam.deptType)
          }
        }
        if (personQueryParam) {
          Object.assign(this.personQueryParam, personQueryParam)
        }
      }
      this.personLoading = true
      doSavePersonalSocialPlace(saveData).then(res => {
        if (res.code === 200) {
          this.$message.success('保存成功')
          this.doQueryPerson()
          this.templateData = ''
          this.selectedRows = []
          this.selectedRowKeys = []
          this.personRowSelected = ''
          this.personLoading = false
        }
        this.personLoading = false
      })
    },
    handleInputChange () {
      if (this.selectedRowKeys.length > 0) {
        const me = this
        this.$confirm({
          title: '数据未保存，是否需要保存？',
          // 确认 与 关闭位置对调
          cancelText: '是',
          okText: '否',
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
            me.personQueryParam.pageNo = 1
            me.doQueryPerson()
          },
          onCancel () {
            var personQueryParam = { ...me.personQueryParam }
            personQueryParam.pageNo = 1
            me.handleBatchSave(false, false, personQueryParam)
          }
        })
      } else {
        this.personQueryParam.pageNo = 1
        this.doQueryPerson()
      }
    },
    handleValidChange (val) {
      if (this.selectedRowKeys.length > 0) {
        const me = this
        this.$confirm({
          title: '数据未保存，是否需要保存？',
          // 确认 与 关闭位置对调
          cancelText: '是',
          okText: '否',
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
            me.personQueryParam.valid = val
            me.personQueryParam.pageNo = 1
            me.doQueryPerson()
          },
          onCancel () {
            var personQueryParam = { ...me.personQueryParam }
            personQueryParam.valid = val
            personQueryParam.pageNo = 1
            me.handleBatchSave(false, false, personQueryParam)
          }
        })
      } else {
        this.personQueryParam.valid = val
        this.personQueryParam.pageNo = 1
        this.doQueryPerson()
      }
    },
    handleCompanyChange (val) {
      if (this.selectedRowKeys.length > 0) {
        this.modalVisible = true
        this.socialPlaceId = val
      } else {
        this.personQueryParam.socialPlaceId = val
        this.personQueryParam.pageNo = 1
        this.doQueryPerson()
      }
    },
    onMonthChange (moment) {
      const data = [...this.personList]
      var target = data.find(item => item.personId === this.personRowSelected)
      if (target) {
        target.month = moment ? moment.startOf('month').format('YYYY-MM-DD') : null
        target.isModified = true
        if (target.place) {
          if (!this.templateData) {
            this.templateData = { ...target }
            // 将所选中的数据中调整月份与调整后缴纳地都为空的数据复制
            data.forEach(item => {
              if (!item.place && !item.month && this.selectedRowKeys.includes(item.personId)) {
                item.month = this.templateData.month
                item.meeter = this.templateData.meeter
                item.meeterName = this.templateData.meeterName
                item.place = this.templateData.place
                item.placeName = this.templateData.placeName
                item.isModified = true
                /* var ref = item.ref
                this.$nextTick(() => {
                  this.$refs[ref].getCurrent(this.templateData.place, this.templateData.placeName)
                }) */
              }
            })
          }
        }
      }
      this.personList = data
    },
    doQuery () {
      if (this.selectedRowKeys.length > 0) {
        const me = this
        this.$confirm({
          title: '数据未保存，是否需要保存？',
          // 确认 与 关闭位置对调
          cancelText: '是',
          okText: '否',
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
            me.doQueryPerson()
          },
          onCancel () {
            me.handleBatchSave(false, false, false)
          }
        })
      } else {
        this.doQueryPerson()
      }
    },
    onRowSelect (record, selected, selectedRows, nativeEvent) {
      const data = [...this.personList]
      const origionalData = { ...record }
      var target = data.find(item => item.personId === record.personId)
      if (!record.ref) {
        target.ref = 'companyRef_' + record.personId
      }
      if (!record._origionalData) {
        target._origionalData = origionalData
      }
      if (selected) {
        this.personRowSelected = record.personId
        if (this.templateData) {
          target.month = this.templateData.month
          target.meeter = this.templateData.meeter
          target.meeterName = this.templateData.meeterName
          target.place = this.templateData.place
          target.placeName = this.templateData.placeName
          target.isModified = true
          var ref = target.ref
          this.$nextTick(() => {
            this.$refs[ref].getCurrent(this.templateData.place, this.templateData.placeName)
          })
        }
      } else {
        Object.assign(target, target._origionalData)
        delete target.isModified
        this.personRowSelected = ''
      }
      this.personList = data
    },
    onTreeSelect (selectedKeys, e) {
      if (this.selectedRowKeys.length > 0) {
        const me = this
        this.$confirm({
          title: '数据未保存，是否需要保存？',
          // 确认 与 关闭位置对调
          cancelText: '是',
          okText: '否',
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
            me.selectedTreeKeys = selectedKeys
            me.personQueryParam.deptId = selectedKeys
            if (selectedKeys === 'all') {
              me.personQueryParam.deptType = Number(this.deptQueryParam.deptType)
            }
            me.personQueryParam.pageNo = 1
            me.doQueryPerson()
            me.templateData = ''
            me.personRowSelected = ''
            me.selectedRowKeys = []
            me.selectedRows = []
          },
          onCancel () {
            me.handleBatchSave(false, selectedKeys)
          }
        })
      } else {
        this.selectedTreeKeys = selectedKeys
        this.personQueryParam.deptId = selectedKeys.length > 0 ? selectedKeys[0] : ''
        if (selectedKeys === 'all') {
          this.personQueryParam.deptType = Number(this.deptQueryParam.deptType)
        }
        this.personQueryParam.pageNo = 1
        this.doQueryPerson()
        this.templateData = ''
        this.personRowSelected = ''
        this.selectedRowKeys = []
        this.selectedRows = []
      }
    },
    onRowChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      if (selectedRowKeys.length === 0) {
        this.templateData = ''
      }
    },
    expandedTree (expandedKeys, e) {
      this.expandedTreeKeys = expandedKeys
    },
    handleDeptTypeChange (val) {
      this.deptQueryParam.deptType = val
      this.personQueryParam.deptType = Number(val)
      this.doQueryDept()
    },
    handleSocialPlaceChange (id, name, company) {
      const data = [...this.personList]
      var target = data.find(item => item.personId === this.personRowSelected)
      if (target) {
        target.place = company.companyId
        target.placeName = company.companyName
        target.meeter = company.meeter
        target.meeterName = company.meeterName
        target.isModified = true
        if (target.month) {
          if (!this.templateData) {
            this.templateData = { ...target }
            // 将所选中的数据中调整月份与调整后缴纳地都为空的数据复制
            data.forEach(item => {
              if (!item.place && !item.month && this.selectedRowKeys.includes(item.personId)) {
                item.month = this.templateData.month
                item.meeter = this.templateData.meeter
                item.meeterName = this.templateData.meeterName
                item.place = this.templateData.place
                item.placeName = this.templateData.placeName
                item.isModified = true
                /* var ref = item.ref
                this.$nextTick(() => {
                  this.$refs[ref].getCurrent(this.templateData.place, this.templateData.placeName)
                }) */
              }
            })
          }
        }
      }
      this.personList = data
    },
    doQueryPerson () {
      this.personLoading = true
      if (!this.personQueryParam.deptId) {
        this.currentPage = 1
        this.pagination.current = 1
        this.pagination.pageSize = 25
        this.pagination.total = 0
        this.personList = []
        this.personLoading = false
      }
      doLoadPersonSocialPlaceList(this.personQueryParam).then((res) => {
        if (res.code === 200) {
          this.currentPage = res.body.pageNumber + 1
          this.pagination.current = res.body.pageNumber + 1
          this.pagination.pageSize = res.body.pageSize
          this.pagination.total = res.body.totalCount
          this.personList = res.body.items
          this.initParam()
          this.personLoading = false
        }
        this.personLoading = false
      })
    },
    doQueryDept () {
      this.deptLoading = true
      getDeptSelectTree(this.deptQueryParam).then((res) => {
        if (res.code === 200) {
          if (res.body.length > 0) {
            this.allItem = [{
              children: [],
              parentId: null,
              title: '全部',
              value: 'all'
            }]
            this.expandedTreeKeys.push('all')
            res.body.forEach(dept => {
              if (!dept.parentId) {
                dept.parentId = 'all'
                this.allItem[0].children.push(dept)
              }
              if ((dept.children && dept.children.length > 0) || !dept.parentId) {
                this.expandedTreeKeys.push(dept.value)
              }
            })
            this.deptList = [...this.allItem]
            var selectedTreeKeys = []
            selectedTreeKeys.push(this.deptList[0].value)
            this.selectedTreeKeys = selectedTreeKeys
            this.personQueryParam.deptId = this.deptList[0].value
            this.personQueryParam.deptType = Number(this.deptQueryParam.deptType)
            this.doQueryPerson()
          }
          this.setIcons(this.deptList)
          this.deptLoading = false
        }
        this.deptLoading = false
      })
    },
    handleCurrentPageChange (pagination) {
      if (this.selectedRowKeys.length > 0) {
        const me = this
        this.$confirm({
          title: '数据未保存，是否需要保存？',
          // 确认 与 关闭位置对调
          cancelText: '是',
          okText: '否',
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
            me.personQueryParam.pageNo = pagination.current
            me.templateData = ''
            me.personRowSelected = ''
            me.selectedRowKeys = []
            me.selectedRows = []
            me.doQueryPerson()
          },
          onCancel () {
            me.handleBatchSave(pagination)
          }
        })
      } else {
        this.personQueryParam.pageNo = pagination.current
        this.templateData = ''
        this.personRowSelected = ''
        this.selectedRowKeys = []
        this.selectedRows = []
        this.doQueryPerson()
      }
    },
    handleModalConfirm () {
      var personQueryParam = { ...this.personQueryParam }
      personQueryParam.socialPlaceId = this.socialPlaceId
      personQueryParam.pageNo = 1
      this.handleBatchSave(false, false, personQueryParam)
      this.modalVisible = false
    },
    handleModalCancel () {
      this.personQueryParam.socialPlaceId = this.socialPlaceId
      this.personQueryParam.pageNo = 1
      this.doQueryPerson()
      this.modalVisible = false
    },
    onPersonClickRow (record, index) {
      return {
        on: {
          click: () => {
            this.personRowSelected = record.personId
          },
          dblclick: () => {
            this.drawerTitle = record.personName + '(工号： ' + record.personId + ')' + '-调整记录'
            this.drawerVisible = true
            this.recordQueryParam.personId = record.personId
            setTimeout(() => {
              this.$refs.recordTable.refresh(true) // refresh() 不传参默认值 false 不刷新到分页第一页
            }, 100)
          }
        }
      }
    },
    setPersonCurrentRow (record, index) {
      var styleClassName = ''
      if (record.personId === this.personRowSelected) {
        styleClassName = 'clickRowStyle hoverRowStyle'
      }
      return styleClassName
    },
    onDeptClickRow (record, index) {
      return {
        on: {
          click: () => {
            this.deptRowSelected = record.value
          }
        }
      }
    },
    setDeptCurrentRow (record, index) {
      var styleClassName = ''
      if (record.value === this.deptRowSelected) {
        styleClassName = 'clickRowStyle hoverRowStyle'
      }
      return styleClassName
    },
    onRecordClickRow (record, index) {
      return {
        on: {
          click: () => {
            this.recordRowSelected = record.id
          }
        }
      }
    },
    setRecordCurrentRow (record, index) {
      var styleClassName = ''
      if (record.id === this.recordRowSelected) {
        styleClassName = 'clickRowStyle hoverRowStyle'
      }
      return styleClassName
    },
    destroyAll () {
      this.$destroyAll()
    },
    setIcons (deptTree) {
      for (var data of deptTree) {
        data.scopedSlots = {
          title: 'title-custom'
        }
        if ((data.children && data.children.length > 0) || !data.parentId) {
          if (data.children && data.children.length > 0) {
            data.scopedSlots = {
              icon: 'icon-custom'
            }
            this.setIcons(data.children)
            data.isLeaf = false
          } else {
            data.slots = {
              icon: 'meh'
            }
            data.isLeaf = true
          }
        } else {
          data.slots = {
            icon: 'meho'
          }
          data.isLeaf = true
        }
      }
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    onDrawerClose () {
      this.drawerVisible = false
      this.drawerTitle = ''
    },
    loadCompanySelect () {
      const param = {
        type: 2
      }
      getCompanyList(param).then((res) => {
        if (res.code === 200) {
          this.companyList = res.body
        } else {
          this.$message.error(res.msg)
        }
      }).catch((res) => {
        console.log(res)
      })
    },
    initParam () {
      this.personRowSelected = ''
      this.templateData = ''
      this.selectedRowKeys = []
      this.selectedRows = []
      this.socialPlaceId = null
    },
    initPage () {
      this.listScrollHeight = window.innerHeight - 270
      this.cardHeight = window.innerHeight - 95
      this.doQueryDept()
    }
  },
  computed: {
    viewHeight: function () {
      return window.innerHeight
    }
  },
  created () {
    this.initPage()
  }
}
</script>

<style scoped>
  .custom /deep/ .ant-table-placeholder {
    position: absolute;
    z-index: 1;
    padding: 16px 16px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    text-align: center;
    background: #fff;
    border-bottom: 0px solid #e8e8e8;
    border-radius: 0 0 4px 4px;
    margin-top: 1px;
    top: 36px;
    width: 100%
  }

  .personClass /deep/ .ant-table-placeholder {
    display: none;
  }

  .treeStyle {
    background: white;
    overflow-x: hidden;
    overflow-y: scroll;
  }

  .errorClass /deep/.ant-input:hover  {
    border-color: #f5222d;
  }

  .errorClass /deep/ .ant-input {
    border-color: #f5222d;
  }

  .errorClass /deep/ .ant-select-selection {
    border-color: #f5222d;
  }

  .errorClass {
    border-color: #f5222d;
  }
</style>
