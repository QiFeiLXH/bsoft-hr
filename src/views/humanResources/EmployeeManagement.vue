<template>
  <a-layout style="background-color: white">
    <a-spin :spinning="loading">
      <header style="margin: 10px">
        <a-row>
          <a-col>
            <a-button type="primary" @click="addNewInfo">
              新增
            </a-button>
            <!--
            <a-radio-group @change="onStatusChange" v-model="informationParam.status" :options="options" style="margin-left: 10px"></a-radio-group>
-->
            <a-checkbox-group style="margin-left: 10px" v-model="checkedList" :options="options" @change="onStatusChange"/>
            <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange">
              全部
            </a-checkbox>
            <a-input-search
              :pressEnter="onSearch"
              placeholder="输入姓名或身份证"
              allow-clear
              @change="changeContent"
              @search="onSearch"
              style="width: 300px"/>
            <a-divider v-action:2 type="vertical" v-show="!showGrid"/>
            <a-button
              v-action:2
              type="primary"
              icon="copy"
              @click="doBatchAudit"
              v-show="!showGrid"
              :loading="btnLoading">批量审核</a-button>
          </a-col>
        </a-row>
        <a-row style="margin-top: 10px">
          <a-radio-group default-value="grid" button-style="solid" @change="showChange">
            <a-radio-button value="grid">
              缩略图
            </a-radio-button>
            <a-radio-button value="list">
              列表显示
            </a-radio-button>
          </a-radio-group>
          <span style="color:red;margin-left:15px">仅显示报道日期在前30天及之后的招聘信息（报到日期在审核之前都可修改）</span>
        </a-row>
      </header>

      <article class="content" :style="{height: viewHeight+'px',overflow:'hidden auto',marginLeft:'10px',display:showGrid?'block':'none'}">
        <div v-for="(value,key) in gridInformation" :key="key">
          <a-tag color="#108ee9">
            {{ key.substring(0,10) }}
          </a-tag>
          <a-list :grid="{ gutter: 16, column: 4 }" :data-source="value" style="margin-top:10px ">
            <a-list-item slot="renderItem" slot-scope="item" v-if="item.id !== null">
              <employee-brief-info
                @sendEmail="sendEmail"
                @deleteInfo="deleteInfo"
                @auditInfo="auditInfo"
                @editInfo="editInfo"
                @headquartersAuditInfo="headquartersAuditInfo"
                :headquartersAuth="headquartersAuth"
                :info="item"/>
            </a-list-item>
          </a-list>
        </div>
      </article>
      <article :style="{display:showGrid?'none':'block'}">
        <a-layout style="background-color: white">

          <a-layout-sider style="width: 200px">
            <a-card :style="{height: viewHeight+'px'}">
              报到日期
              <a-tree
                :tree-data="treeData"
                defaultExpandAll
                @select="startDateSelect"
              >

              </a-tree>
            </a-card>
          </a-layout-sider>
          <a-layout-content>
            <a-table
              v-watermark
              :rowKey="(record) => record.id"
              :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onRowChange,
                                getCheckboxProps: record => ({
                                  props: {
                                    disabled: record.status !== 7
                                  }
                                }) }"
              :columns="columns"
              :dataSource="listInformation"
              :loading="isLoading"
              size="small"
              :scroll="{ x:false, y:tableHeight}"
              :customRow="onClickRow"
              :rowClassName="setCurrentRow"
              :pagination="false"
            >
              <span slot="serial" slot-scope="text, record, index" v-if="informationPage.pageNumber === 0">
                {{ index + 1 }}
              </span>
              <span slot="serial" slot-scope="text, record, index" v-else>
                {{ (informationCurrentPage-1)*informationPage.pageSize +index + 1 }}
              </span>

              <span slot="renderOperation" slot-scope="text, record" >
                <a v-if="record.status === 1 || record.status === 4" @click="sendEmail(record)">发邮件</a>
                <a style="margin-left: 10px" v-if="record.status === 1||record.status === 4" @click="editInfo(record,false)">编辑</a>
                <a style="margin-left: 10px" v-if="record.status === 1||record.status === 4||record.status === 5||record.status === 6" @click="auditInfo(record.id,false)">HR审核</a>
                <a style="margin-left: 10px;margin-right: 10px" v-if="record.status === 1" @click="deleteInfo(record)">删除</a>
                <a v-if="record.status === 7" @click="headquartersAuditInfo(record.id,false)" v-action:2>总部审核</a>
              </span>
            </a-table>

            <a-drawer
              :wrapStyle="{overflow: 'hidden'}"
              placement="right"
              :closable="false"
              :width="1200"
              @close="onEditClose"
              :visible="editVisible"
              :bodyStyle="{ padding: '0px 0px 0px 0px' }"
            >
              <employee-detailed-info @close="onEditClose" :disabled="editDisabled" :baseInfo="baseInfo" v-if="editVisible"/>
            </a-drawer>

            <a-drawer
              placement="right"
              :closable="false"
              :width="1200"
              @close="onAuditClose"
              :visible="auditVisible"
              :bodyStyle="{ padding: '0px 0px 0px 0px', }"
            >
              <employee-audit-info @close="onAuditClose" :disabled="auditDisabled" :recruitmentInfoId="recruitmentInfoId" v-if="auditVisible"/>
            </a-drawer>
          </a-layout-content>
        </a-layout>
      </article>
      <footer-tool-bar>
        <a-pagination
          style="margin-top: 15px"
          size="small"
          :total="informationPage.totalCount"
          :pageSize.sync="informationPage.pageSize"
          v-model="informationPage.pageNumber"
          @change="onModalChange" />
      </footer-tool-bar>
    </a-spin>
  </a-layout>

</template>

<script>
import { deleteRecruitmentInfo, sendRecruitmentEmail, getRecruitmentInfoList, doBatchHeadquartersAudit } from '@/api/employee'
import EmployeeBriefInfo from './component/EmployeeBriefInfo'
import FooterToolBar from '../../components/FooterToolbar'
import { mixin, mixinDevice } from '@/utils/mixin'
import EmployeeDetailedInfo from './component/EmployeeDetailedInfo'
import EmployeeAuditInfo from './component/EmployeeAuditInfo'
import store from '@/store'

// 权限
const permissions = store.getters.roles.permissions
const options = [
  { label: '总部待审', value: 7 },
  { label: 'HR待审', value: 5 },
  { label: '待修改', value: 6 },
  { label: '未发邮件', value: 1 }
]
const status = [7, 5, 6, 1]
const columns = [
  {
    title: '',
    scopedSlots: { customRender: 'serial' },
    width: '4%'
  },
  {
    title: '姓名',
    dataIndex: 'personName',
    width: '10%'
  },
  {
    title: '应聘部门',
    dataIndex: 'deptText',
    width: '20%'
  },
  {
    title: '报到日期',
    dataIndex: 'startDate',
    width: '13%'
  },
  {
    title: '手机号码',
    dataIndex: 'phone',
    width: '14%'
  },
  {
    title: '邮箱地址',
    dataIndex: 'email',
    width: '14%'
  },
  {
    title: '状态',
    dataIndex: 'statusText',
    width: '6%'
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'renderOperation' },
    width: '20%'
  }
]

export default {
  name: 'EmployeeManagement',
  mixins: [mixin, mixinDevice],
  components: { EmployeeDetailedInfo, EmployeeAuditInfo, FooterToolBar, EmployeeBriefInfo },
  data () {
    return {
      checkAll: false,
      indeterminate: true,
      options,
      status,
      checkedList: [6, 1],
      editDisabled: false,
      auditDisabled: false,
      loading: false,
      columns,
      baseInfo: {},
      currentId: '',
      treeData: [],
      listInformation: [],
      gridInformation: {},
      informationPage: { pageNumber: 1, pageSize: 25, totalCount: 1 },
      informationParam: { 'content': '', 'status': [1, 6], 'checkAll': false, 'queryAll': false },
      informationCurrentPage: 1,
      drawerVisible: false,
      editVisible: false,
      auditVisible: false,
      showGrid: true,
      isLoading: false,
      recruitmentInfoId: '',
      selectedRowKeys: [],
      btnLoading: false,
      headquartersAuth: false
    }
  },
  computed: {
    cardHeight: function () {
      return window.innerHeight - 56 + 'px'
    },
    tableHeight: function () {
      return window.innerHeight - 300
    },
    viewHeight: function () {
      return window.innerHeight - 260
    }
  },
  created () {
    this.loading = true
    this.getRecruitmentInformation()
  },
  methods: {
    doBatchAudit () {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请先选择数据！')
        return
      }
      if (this.btnLoading) {
        return
      }
      const me = this
      this.$confirm({
        title: '是否批量审核人员？',
        // 确认 与 关闭位置对调
        cancelText: '确定',
        okText: '取消',
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
          me.btnLoading = true
          doBatchHeadquartersAudit({ recruitmentIds: me.selectedRowKeys }).then(res => {
            if (res.code === 200) {
              me.$message.success('审核成功')
              me.getRecruitmentInformation()
              me.selectedRowKeys = []
              me.btnLoading = false
            } else {
              me.$message.error(res.msg)
              me.btnLoading = false
            }
          })
        }
      })
    },
    onRowChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
    },
    onClickRow (record) {
      const me = this
      return {
        on: {
          dblclick: () => {
            me.currentId = record.id
            if (record.status === 1 || record.status === 4) { // 招聘中  已发邮件状态
              me.editInfo(record, true)
            } else {
              me.auditInfo(record.id, true)
            }
          }
        }
      }
    },
    setCurrentRow (record, index) {
      let styleClassName = ''
      if (record.id === this.currentId) {
        styleClassName = 'clickRowStyle'
      }
      return styleClassName
    },
    showChange (e) {
      this.showGrid = e.target.value === 'grid'
    },
    onModalChange (current) {
      this.loading = true
      this.informationPage.pageNumber = current
      this.getRecruitmentInformation()
    },
    startDateSelect (record, e) {
      this.loading = true
      if (record.length > 0) {
        const nodeValue = e.node.dataRef
        if (nodeValue.parent) {
          this.informationParam.startTime = nodeValue.startTime
          this.informationParam.checkTime = null
        } else {
          this.informationParam.startTime = null
          this.informationParam.checkTime = nodeValue.checkTime
        }
      } else {
        this.informationParam.startTime = null
        this.informationParam.checkTime = null
      }
      this.getRecruitmentInformation()
    },
    getUserPermissions () {
      if (permissions.length > 0) {
        for (let i = 0; i < permissions.length; i++) {
          if (permissions[i].permissionId === this.$route.meta.permission) {
            if (permissions[i].actionList.includes('1')) {
              this.informationParam.queryAll = true
            }
            if (permissions[i].actionList.includes('2')) {
              this.headquartersAuth = true
            }
          }
        }
      }
    },
    onSearch (value) {
      this.loading = true
      this.informationPage.pageNumber = 0
      this.informationPage.pageSize = 25
      this.getRecruitmentInformation()
    },
    changeContent (e) {
      this.informationParam.content = e.target.value.trim()
    },
    onStatusChange: function (checkedList) {
      this.loading = true
      this.indeterminate = !!checkedList.length && checkedList.length < status.length
      this.checkAll = checkedList.length === status.length
      this.informationParam.checkAll = checkedList.length > 0 ? this.checkAll : true
      this.informationParam.status = checkedList
      this.informationParam.startTime = null
      this.informationParam.checkTime = null
      this.informationPage.pageNumber = 0
      this.informationPage.pageSize = 25
      this.getRecruitmentInformation()
    },
    onCheckAllChange (e) {
      Object.assign(this, {
        checkedList: e.target.checked ? status : [],
        indeterminate: false,
        checkAll: e.target.checked
      })
      this.informationParam.checkAll = true
      this.informationParam.startTime = null
      this.informationParam.checkTime = null
      this.informationPage.pageNumber = 0
      this.informationPage.pageSize = 25
      this.getRecruitmentInformation()
    },
    addNewInfo () {
      this.baseInfo = { id: null }
      this.editDisabled = false
      this.editVisible = true
    },
    sendEmail (record) {
      const me = this
      me.loading = true
      sendRecruitmentEmail(record).then(res => {
        if (res.code === 200) {
          me.$message.success('发送成功')
          me.getRecruitmentInformation()
        } else {
          me.$message.error(res.msg)
        }
      })
    },
    editInfo (record, disabled) {
      this.baseInfo = record
      this.editDisabled = disabled
      this.editVisible = true
    },
    onEditClose () {
      this.editVisible = false
      this.getRecruitmentInformation()
    },
    auditInfo (id, disabled) {
      this.recruitmentInfoId = id
      this.auditDisabled = disabled
      this.auditVisible = true
    },
    headquartersAuditInfo (id, disabled) {
      this.recruitmentInfoId = id
      this.auditDisabled = disabled
      this.auditVisible = true
    },
    onAuditClose () {
      this.auditVisible = false
      this.getRecruitmentInformation()
    },
    deleteInfo (record) {
      const me = this
      this.$confirm({
        title: '是否确认删除该条招聘信息?',
        onOk () {
          me.loading = true
          const param = { 'id': record.id }
          deleteRecruitmentInfo(param).then(res => {
            if (res.code === 200) {
              me.$message.success('删除成功')
              me.getRecruitmentInformation()
            } else {
              me.$message.error(res.msg)
            }
          })
        },
        onCancel () {}
      })
    },
    getRecruitmentInformation () {
      this.getUserPermissions()
      this.informationPage.pageNumber = this.informationPage.pageNumber - 1 > 0 ? this.informationPage.pageNumber - 1 : 0
      const me = this
      getRecruitmentInfoList(Object.assign(this.informationParam, this.informationPage))
        .then(res => {
          if (res.code === 200) {
            me.informationPage.pageNumber = res.body.data.pageNumber + 1
            me.informationPage.totalCount = res.body.data.totalCount
            me.informationCurrentPage = res.body.data.pageNumber + 1
            me.gridInformation = res.body.group
            me.listInformation = res.body.data.items.filter(item => item.id)
            me.treeData = res.body.tree
          }
          me.loading = false
        })
    }
  }
}
</script>

<style lang="less" scoped>
  /deep/.ant-drawer-wrapper-body {
    height: 100%;
    overflow: hidden;
  }

  .content {
    overflow-y: auto;
    overflow-x: hidden;
  }
</style>
