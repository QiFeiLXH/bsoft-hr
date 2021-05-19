<template>
  <a-card :body-style="{ height: '2000px', padding: '0px 10px' }">
    <a-row>
      <a-col style="margin: 10px 0;">
        <span>类型：</span>
        <a-dropdown>
          <a class="ant-dropdown-link" @click="e => e.preventDefault()">{{ typeName }}<a-icon type="down" /></a>
          <a-menu slot="overlay">
            <a-menu-item v-for="record in typeList" :key="record.id">
              <a href="javascript:;" @click="chooseType(record)">{{ record.name }}</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
        <span style="margin-left: 15px">保管员：</span>
        <a-dropdown>
          <a class="ant-dropdown-link" @click="e => e.preventDefault()">{{ archivistName }}<a-icon type="down" /></a>
          <a-menu slot="overlay">
            <a-menu-item v-for="record in archivistList" :key="record.id">
              <a href="javascript:;" @click="chooseArchivist(record)">{{ record.archivistName }}</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
        <a-input-search v-model="queryParam.name"
                        @search="doCertOriginalScriptQuery"
                        @pressEnter="doCertOriginalScriptQuery"
                        placeholder="请输入证书名称查询"
                        :allowClear="true"
                        style="width: 250px; margin-left: 15px"></a-input-search>

        <a-button @click="doCertOriginalScriptQuery" type="primary" style="margin-left: 20px">查询</a-button>

        <a-button @click="add" v-action:1 type="primary" style="margin-left: 20px">新增</a-button>

      </a-col>
    </a-row>

    <a-row>
      <a-col>
        <a-table :columns="tableColumns"
                 :dataSource="tableData"
                 :pagination="pagination"
                 :loading="tableLoading"
                 :row-key="(record,index)=>{return index}"
                 @change="handleTableChange"
                 :scroll="{ x: false, y: tableHeight }"
                 :bodyStyle="{ height: tableHeight + 'px' }"
                 size="small">
          <template slot="rowIndex" slot-scope="text, record, index">
            <span> {{ (pagination.current - 1) * pagination.pageSize + index + 1 }} </span>
          </template>
          <template slot="name" slot-scope="text, record">
            <a-tooltip>
              <template slot="title"> {{record.name}} </template>
              <template>{{ text }} </template>
            </a-tooltip>
          </template>
          <template slot="logoff" slot-scope="text, record">
            <template v-if="text === 0 || text === 1">
              <a-badge :status="text | logoffStatusFilter" :text="text | logoffTextFilter"/>
            </template>
          </template>
          <template slot="operate" slot-scope="text, record">
            <a @click="edit(record)" v-action:1>修改</a>
          </template>
        </a-table>

        <a-drawer title="新增证书"
                  placement="right"
                  :closable="false"
                  :visible="showAddModel"
                  @close="addCancel"
                  width="600px"
                  :bodyStyle="{ padding: '0px 0px 0px 0px' }">
          <a-card :bordered="false">
            <a-row style="height: 50px;">
              <span>证书名称：</span>
              <a-input v-model="addParam.name" style="width: 480px"></a-input>
            </a-row>
            <a-row style="height: 50px; padding-top: 7px">
              <span>证书类型：</span>
              <a-dropdown>
                <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                  {{ addTypeName }}<a-icon type="down" />
                </a>
                <a-menu slot="overlay">
                  <a-menu-item v-for="record in addTypeList" :key="record.id">
                    <a href="javascript:;" @click="chooseAddType(record)"> {{ record.name }} </a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </a-row>
            <a-row style="height: 50px; padding-top: 7px">
              <span>保&nbsp;管&nbsp;员：</span>
              <a-dropdown>
                <a class="ant-dropdown-link" @click="e => e.preventDefault()">{{ addArchivistName }}<a-icon type="down" /></a>
                <a-menu slot="overlay">
                  <a-menu-item v-for="record in addArchivistList" :key="record.id">
                    <a href="javascript:;" @click="chooseAddArchivist(record)">{{ record.archivistName }}</a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </a-row>
          </a-card>
          <div :style="{ position: 'absolute', right: 10,bottom: 0,width: '100%',borderTop: '1px solid #e9e9e9',padding: '9px 16px', background: '#fff',textAlign: 'right',}">
            <a-button type="primary" style="margin-left: 10px" @click="addSubmit">保存</a-button>
            <a-button @click="addCancel">关闭</a-button>
          </div>
        </a-drawer>

        <a-drawer title="证书原件维护"
                  placement="right"
                  :closable="false"
                  :visible="showEditModel"
                  @close="editCancel"
                  width="600px"
                  :bodyStyle="{ padding: '0px 0px 0px 0px' }">
          <a-card :bordered="false">
            <a-row style="height: 50px;">
              <span>证书名称：</span>
              <a-input v-model="addParam.name" style="width: 480px"></a-input>
            </a-row>
            <a-row style="height: 50px; padding-top: 7px">
              <span>证书类型：</span>
              <a-dropdown>
                <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                  {{ addTypeName }}<a-icon type="down" />
                </a>
                <a-menu slot="overlay">
                  <a-menu-item v-for="record in addTypeList" :key="record.id">
                    <a href="javascript:;" @click="chooseAddType(record)"> {{ record.name }} </a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </a-row>
            <a-row style="height: 50px; padding-top: 7px">
              <span>保&nbsp;管&nbsp;员：</span>
              <a-dropdown>
                <a class="ant-dropdown-link" @click="e => e.preventDefault()">{{ addArchivistName }}<a-icon type="down" /></a>
                <a-menu slot="overlay">
                  <a-menu-item v-for="record in addArchivistList" :key="record.id">
                    <a href="javascript:;" @click="chooseAddArchivist(record)">{{ record.archivistName }}</a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </a-row>
            <a-row style="height: 50px; padding-top: 7px">
              <span>注销标志：</span>
              <a-radio-group  v-model="addParam.logoff" @change="handleRadioChange">
                <a-radio :value="0">未注销</a-radio>
                <a-radio :value="1">已注销</a-radio>
              </a-radio-group>
            </a-row>
          </a-card>
          <div :style="{ position: 'absolute', right: 10,bottom: 0,width: '100%',borderTop: '1px solid #e9e9e9',padding: '9px 16px', background: '#fff',textAlign: 'right',}">
            <a-button type="primary" style="margin-left: 10px" @click="editSubmit">保存</a-button>
            <a-button @click="editCancel">关闭</a-button>
          </div>
        </a-drawer>
      </a-col>
    </a-row>

  </a-card>
</template>

<script>
  import { certOriginalScriptQuery, certOriginalScriptAudit,  certOriginalScriptSave, certOriginalScriptUpdate, certTypeQuery } from "@/api/certificate"
  import PersonSearchSelect from "@/components/Person/PersonSearchSelect";
  import store from '@/store'
  const permissions = store.getters.roles.permissions

  const logoffMap = {
    0: { status: 'success',  text: '未注销' },
    1: { status: 'default',  text: '已注销' },
  }
  export default {
    name: 'CertificateOriginalScriptView',
    components: { PersonSearchSelect },
    data(){
      return {
        maintainPermission: false,
        showAddModel: false,
        showEditModel: false,
        queryParam: { id: null, name: null, type: null , archivist: null, logoff: null, },
        addParam: { id: null, name: null, type: null, archivist: null, logoff: 0, },
        typeName: "全部",
        typeList: [],// 查询分类
        addTypeName: '营业执照',
        addTypeList: [],// 新增修改分类
        archivistName: '全部',
        archivistList: [
          {archivist: '', archivistName: '全部'},
          {archivist: '1531', archivistName: '杨怡倩'},
          {archivist: '1992', archivistName: '金建平'}
        ],// 保管员列表（固定）
        addArchivistName: '全部',
        addArchivistList: [
          {archivist: '1531', archivistName: '杨怡倩'},
          {archivist: '1992', archivistName: '金建平'}
        ],// 保管员列表（固定）
        auditName: null,
        tableLoading: false,
        tableHeight: window.innerHeight - 260,
        tableData: [],
        pagination: { current: 1, pageSize: 25, total: 0},
        tableColumns: [
          {
            title: '',
            dataIndex:'rowIndex',
            width:'5%',
            scopedSlots: { customRender: 'rowIndex' },
          },
          {
            title: '证书名称',
            dataIndex: 'name',
            width: '45%',
            ellipsis: true,
            scopedSlots: { customRender: 'name' },
          },
          {
            title: '证书类别',
            dataIndex: 'typeName',
            width: '15%',
            scopedSlots: { customRender: 'type' },
          },
          {
            title: '保管员',
            dataIndex: 'archivistName',
            width: '15%',
          },
          {
            title: '注销标志',
            dataIndex: 'logoff',
            width: '15%',
            scopedSlots: { customRender: 'logoff' },
          },
          {
            title: '',
            dataIndex: 'operate',
            width: '5%',
            scopedSlots: { customRender: 'operate' },
          }
        ],
      }
    },
    filters: {
      logoffStatusFilter (val) {
        return logoffMap[val].status
      },
      logoffTextFilter (val) {
        return logoffMap[val].text
      }
    },
    created() {
      this.doCertOriginalScriptQuery()
      this.doCertTypeQuery()
    },
    methods:{
      doCertOriginalScriptQuery() {
        const params = {
          name: this.queryParam.name,
          type: this.queryParam.type,
          archivist: this.queryParam.archivist,
          logoff: this.queryParam.logoff,
          pageNo: this.pagination.current,
          pageSize: this.pagination.pageSize,
        }
        this.tableLoading = true
        certOriginalScriptQuery(params).then( res => {
          if(res.code === 200){
            this.tableLoading = false
            this.pagination.total = res.body.totalCount
            this.tableData = res.body.items
          }
        })
      },
      doCertOriginalScriptSave() {
        this.tableLoading = true
        certOriginalScriptSave(this.addParam).then( res => {
          if(res.code === 200){
            this.tableLoading = false
            this.$message.success("保存成功！")
            this.pagination.currnent = 1
            this.doCertOriginalScriptQuery()
          }
        })
      },
      doCertOriginalScriptUpdate() {
        this.tableLoading = true
        certOriginalScriptUpdate(this.addParam).then( res => {
          if(res.code === 200){
            this.tableLoading = false
            this.$message.success("修改成功！")
            this.pagination.currnent = 1
            this.doCertOriginalScriptQuery()
          }
        })
      },
      doCertTypeQuery() {
        this.typeList = [{id: 0, name: '全部'}]
        this.addTypeList = []
        certTypeQuery().then(res => {
          res.body.forEach(item => {
            this.typeList.push({
              id: item.id,
              name: item.name,
            })
            this.addTypeList.push({
              id: item.id,
              name: item.name,
            })
          })
        })
      },

      add(){
        this.addParam.name = null
        this.addParam.type = 1
        this.addParam.logoff = 0
        this.addParam.archivist = '1531'
        this.addTypeName = "营业执照"
        this.addArchivistName = '杨怡倩'
        this.showAddModel = true
      },
      addSubmit() {
        if(this.addParam.name === null || this.addParam.name.trim() === ''){
          this.$message.error('证书名称不能为空！')
          return
        } else{
          const params = {
            name: this.addParam.name
          }
          certOriginalScriptAudit(params).then(res => {
            if (res.body != null) {
              this.$message.error('证书名称已存在！')
              return
            }
            this.doCertOriginalScriptSave()
            this.showAddModel = false
          })
        }
      },
      addCancel() {
        this.showAddModel = false
      },

      edit(record){
        this.addParam.id = record.id
        this.addParam.name = record.name
        this.addParam.type = record.type
        this.addParam.logoff = record.logoff
        this.addParam.archivist = record.archivist
        this.addTypeName = record.typeName
        this.addArchivistName = record.archivistName
        this.auditName = record.name
        /*this.$nextTick(() => {
          this.$refs.editPerson.getCurrent(record.archivist, record.archivistName)
        })*/
        this.showEditModel = true
      },
      editSubmit() {
        if(this.addParam.name === null || this.addParam.name.trim() === ''){
          this.$message.error('证书名称不能为空！')
          return
        } else{
          const params = {
            name: this.addParam.name
          }
          certOriginalScriptAudit(params).then(res => {
            if (res.body != null && res.body.name != this.auditName) {
              this.$message.error('证书名称已存在！')
              return
            }
            this.doCertOriginalScriptUpdate()
            this.showEditModel = false
          })
        }
      },
      editCancel() {
        this.showEditModel = false
      },


      chooseType(record) {
        this.typeName = record.name
        this.queryParam.type = record.id
        this.queryParam.name = null
        this.doCertOriginalScriptQuery()
      },
      chooseArchivist(record) {
        this.archivistName = record.archivistName
        this.queryParam.archivist = record.archivist
        this.queryParam.name = null
        this.doCertOriginalScriptQuery()
      },
      chooseAddType(record) {
        this.addTypeName = record.name
        this.addParam.type = record.id
      },
      chooseAddArchivist(record) {
        this.addArchivistName = record.archivistName
        this.addParam.archivist = record.archivist
      },

      handleTableChange(pagination) {
        this.pagination.current = pagination.current
        this.pagination.pageSize = pagination.pageSize
        this.doCertOriginalScriptQuery()
      },
      handleRadioChange(e){
        this.addParam.logoff = e.target.value
      },
      setPerson(record) {
        this.addParam.archivist = record.personId
      },
      findTypeName(type){
        return typeMap[type].text
      },
      /*getUserPermissions () {
        if (permissions.length > 0) {
          for (var i = 0; i < permissions.length; i++) {
            if (permissions[i].permissionId === 'CertificateOriginalScriptView') {
              if (permissions[i].actionList.includes('maintain')) {
                this.maintainPermission = true
                return
              }
            }
          }
        }
      },*/
    },
  }
</script>

<style scoped>

</style>