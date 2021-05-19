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
            <a-button type="primary" icon="search" @click="getVacationReduceList" style="margin-left: 30px">查询</a-button>
            <a-button type="primary" @click="create" style="margin-left: 30px">新增</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-table
      v-watermark
      ref="table"
      size="small"
      :loading="isLoading"
      :customRow="onClickRow"
      :rowClassName="setCurrentRow"
      :rowKey="(record) => record.id"
      :bordered="false"
      :columns="columns"
      :dataSource="dataList"
      :pagination="false"
      v-watermark
      :scroll="{ y: listScrollHeight }">
      <template slot="rowIndex" slot-scope="text, record, index">
        <span>
          {{ (page.pageNo - 1) * page.pageSize + index + 1 }}
        </span>
      </template>

      <template slot="flag" slot-scope="text, record, index">
        <a-switch checked-children="已执行" un-checked-children="未执行"  :checked="text === 1"/>
      </template>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="updateInfo(record)" v-show="record.flag === 0">修改</a>
          <a-divider type="vertical" v-show="record.flag === 0"/>
          <a @click="deleteInfo(record)"  v-show="record.flag === 0">删除</a>
          <a-divider type="vertical" v-show="record.flag === 0"/>
          <a @click="showConfirm(record)"  v-show="record.flag === 0">执行</a>
        </template>
      </span>
    </a-table>
    <footer-tool-bar>
      <a-pagination
        :disabled="isLoading"
        :total="page.totalCount"
        :pageSize.sync="page.pageSize"
        v-model="page.pageNo"
        @change="onPageChange"
        style="margin-top: 10px"/>
    </footer-tool-bar>
    <a-drawer
      ref="modalDrawer"
      title="年假统一扣除"
      placement="right"
      :closable="false"
      :width="700"
      :bodyStyle="{padding: '12px 24px'}"
      @close="onClose"
      :visible="visible">
      <a-form :form="reduceForm" hideRequiredMark  v-watermark>
        <a-row>
          <a-col span="8">
            <a-form-item
              label="年　　份"
              :labelCol="{lg: {span: 12}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 12}, sm: {span: 22} }"
              :required="false"
              style="margin-bottom: 0"
            >
              <a-input-number :min="1" v-model="rowSelectedInfo.year"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col span="8">
            <a-form-item
              label="使用年假"
              :labelCol="{lg: {span: 12}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 12}, sm: {span: 22} }"
              :required="false"
              style="margin-bottom: 0"
            >
              <a-input-number :min="1" v-model="rowSelectedInfo.days"/>
            </a-form-item>
          </a-col>
          <a-col span="8" style="height: 40px; padding-top: 8px;">
            <label>天</label>
          </a-col>
        </a-row>
        <a-row>
          <a-col span="24">
            <a-form-item
              label="备　　注"
              :labelCol="{lg: {span: 4}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 20}, sm: {span: 22} }"
              :required="false"
              style="margin-bottom: 0"
            >
              <a-textarea v-model="rowSelectedInfo.remark" :rows="4"/>
            </a-form-item>
          </a-col>
        </a-row>
<!--        <a-row>-->
<!--          <a-col span="8">-->
<!--            <a-form-item-->
<!--              label="登记人"-->
<!--              :labelCol="{lg: {span: 6}, sm: {span: 2}}"-->
<!--              :wrapperCol="{lg: {span: 18}, sm: {span: 22} }"-->
<!--              :required="false"-->
<!--              style="margin-bottom: 0"-->
<!--            >-->
<!--              <a-input v-model="rowSelectedInfo.registrant"/>-->
<!--            </a-form-item>-->
<!--          </a-col>-->
<!--          <a-col span="16">-->
<!--            <a-form-item-->
<!--              label="登记日期"-->
<!--              :labelCol="{lg: {span: 8}, sm: {span: 2}}"-->
<!--              :wrapperCol="{lg: {span: 16}, sm: {span: 22} }"-->
<!--              :required="false"-->
<!--              style="margin-bottom: 0"-->
<!--            >-->
<!--              <a-input v-model="rowSelectedInfo.registDate"/>-->
<!--            </a-form-item>-->
<!--          </a-col>-->
<!--        </a-row>-->
      </a-form>
      <footer-tool-bar style="width:700px;" v-if="visible">
        <a-button htmlType="submit" @click="save" type="primary">保存</a-button>
        <a-button @click="cancel" style="margin-left: 20px">取消</a-button>
      </footer-tool-bar>
    </a-drawer>
  </a-card>
</template>

<script>
    import moment from "moment";
    import { queryVacationReduce,saveVacationReduce,reduceVacation,deleteVacationReduce } from '@/api/vacationreduce'
    import FooterToolBar from '@/components/FooterToolbar'

    export default {
      name: "VacationReduceView",
      components: {
        FooterToolBar
      },
      data() {
        return {
          rowSelectedInfo:{},
          reduceForm:this.$form.createForm(this),
          isLoading:false,
          dataList:[],
          listScrollHeight:0,
          cardHeight: 0,
          visible:false,
          page: { pageNo: 1, pageSize: 25, totalCount: 0 },
          queryParam: { pageNo: 1, pageSize: 25 ,year: null },
          columns:[{
            key: 'rowIndex',
            width: '5%',
            dataIndex: 'rowIndex',
            title: '序号',
            scopedSlots: { customRender: 'rowIndex' },
            align: 'center'
          },{
            key: 'year',
            width: '10%',
            dataIndex: 'year',
            title: '年份',
          },{
            key: 'days',
            width: '10%',
            dataIndex: 'days',
            title: '扣除天数',
          },{
            key: 'remark',
            width: '10%',
            dataIndex: 'remark',
            title: '备注',
          },{
            key: 'flag',
            width: '20%',
            dataIndex: 'flag',
            title: '状态',
            align: 'center',
            scopedSlots: { customRender: 'flag' }
          },{
            key: 'action',
            width: '20%',
            dataIndex: 'action',
            title: '操作',
            align: 'center',
            scopedSlots: { customRender: 'action' }
          }],
        }
      },
      methods: {
        showConfirm(record) {
          var me = this
          this.$confirm({
            title: '扣减员工年假',
            content: '是否扣减全体员工年假？',
            onOk() {
              me.reduceVacation(record)
            },
            onCancel() {},
          });
        },
        reduceVacation(record){
          // alert(record.id)
          var params = {
            year:record.year.toString(),
            days:record.days,
            reduceId:record.id
          }
          reduceVacation(params).then(res => {
            if (res.code === 200) {
              this.$message.success('扣除年假成功')
              this.visible = false
              this.getVacationReduceList()
            } else {
              this.$message.error(res.msg)
            }
          })
        },
        updateInfo(record){
          this.rowSelected = record.id
          this.rowSelectedInfo = record
          this.visible = true
        },
        handleYearChange(val){
          this.queryParam.year = val.toString()
          this.getVacationReduceList()
        },
        getVacationReduceList(){
          this.isLoading = true
          queryVacationReduce(Object.assign(this.queryParam)).then(res=>{
            if (res.code === 200){
              this.dataList = []
              this.dataList = this.dataList.concat(res.body.items)
              this.page.totalCount = res.body.totalCount
            }
            this.isLoading = false
          }).catch(err=>{
            this.isLoading = false
            console.log(err)
          })
        },
        onClickRow (record) {
          const me = this
          return {
            on: {
              click: () => {
                me.rowSelected = record.id
              }
            }
          }
        },
        setCurrentRow (record, index) {
          var styleClassName = '';
          if (record.id === this.selectedRow) {
            styleClassName = 'clickRowStyle hoverRowStyle'
          }
          return styleClassName;
        },
        onPageChange (current) {
          this.queryParam.pageNo = current;
          this.getVacationReduceList();
        },
        create(){
          this.rowSelectedInfo = {}
          var currentYear = moment().year()
          this.rowSelectedInfo.year = currentYear.toString()
          this.visible = true
        },
        onClose () {
          this.visible = false;
          this.getVacationReduceList();
        },
        deleteInfo(record){
          var me = this
          this.$confirm({
            title: '删除',
            content: '是否确认删除该记录？',
            onOk() {
              deleteVacationReduce(record).then(res => {
                if (res.code === 200) {
                  me.$message.success('删除成功')
                  me.visible = false
                  me.getVacationReduceList()
                } else {
                  me.$message.error(res.msg)
                }
              })
            },
            onCancel() {},
          });
        },
        save(){
          this.rowSelectedInfo.flag = 0;//保存时默认未执行
          saveVacationReduce(this.rowSelectedInfo).then(res => {
            if (res.code === 200) {
              this.$message.success('保存成功')
              this.visible = false
              this.getVacationReduceList()
            } else {
              this.$message.error(res.msg)
            }
          })
        },
        cancel(){
          this.visible = false;
          this.getVacationReduceList()
        },
      },
      mounted() {
        var currentYear = moment().year()
        this.listScrollHeight = window.innerHeight - 300
        this.cardHeight = window.innerHeight - 125
        this.queryParam.year = currentYear.toString()
        this.queryParam.pageNo = 1
        this.queryParam.pageSize = 25
        // this.queryParam.auditFlag = 0
        this.getVacationReduceList()
      },
    }
</script>

<style scoped>

</style>