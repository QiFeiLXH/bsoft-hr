<template>
  <a-modal
    style="top: 30px"
    v-model="show"
    :width="800"
    :maskClosable="false"
    :destroyOnClose="true">
    <a-spin :spinning="loading">

      <div style="height: 350px;overflow-y: auto;margin-top: 20px">
      <a-form-model v-if="type==='update'||type==='read'" :model="workInfo" ref="ruleForm" :rules="rules">
        <a-card>
          <div slot="title">
            <span>工作经历</span>
            <span style="color: red">（更改起始时间会修改入司前工龄）</span>
          </div>
          <a-row>
            <a-col :md="18">
              <a-form-model-item
                label="起止时间"
                :labelCol="{lg: {span: 4}, sm: {span: 2}}"
                :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
                prop="startEndDate">
                <a-range-picker :disabled="disabled" v-model="workInfo.startEndDate" />
              </a-form-model-item>
            </a-col>
            <a-col :md="6">
              <a-form-model-item
                label="含实习"
                :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                prop="check">
                <a-switch v-model="workInfo.check" :disabled="disabled"/>
              </a-form-model-item>
            </a-col>
          </a-row>

          <a-form-model-item
            label="工作单位"
            :labelCol="{lg: {span: 3}, sm: {span: 2}}"
            :wrapperCol="{lg: {span: 21}, sm: {span: 20} }"
            prop="company">
            <a-input :maxLength="16" v-model="workInfo.company" :disabled="disabled"></a-input>
          </a-form-model-item>
          <a-form-model-item
            label="岗位职务"
            :labelCol="{lg: {span: 3}, sm: {span: 2}}"
            :wrapperCol="{lg: {span: 21}, sm: {span: 20} }"
            prop="post">
            <a-input :maxLength="10" v-model="workInfo.post" :disabled="disabled"></a-input>
          </a-form-model-item>
          <a-form-model-item
            label="离职原因"
            :labelCol="{lg: {span: 3}, sm: {span: 2}}"
            :wrapperCol="{lg: {span: 21}, sm: {span: 20} }"
            prop="reason">
            <a-textarea :maxLength="16" v-model="workInfo.reason" :rows="2" :disabled="disabled"></a-textarea>
          </a-form-model-item>

        </a-card>
      </a-form-model>

      <a-form-model v-else :model="item" ref="ruleForm" v-for="(item,index) in workData" :key="index" :rules="rules">
        <a-card>
          <div slot="title">
            <span>{{getTitle(index+1)}}</span>
            <span style="color: red">（更改起始时间会修改入司前工龄）</span>
          </div>
          <a-button-group slot="extra" v-if="!disabled">
            <a-button type="link" icon="plus" @click="doAdd">新增</a-button>
            <a-popconfirm title="是否要删除此行？" @confirm="doDelete(index )">
              <a-button type="link" icon="delete">删除</a-button>
            </a-popconfirm>
          </a-button-group>

          <a-row>
            <a-col :md="18">
              <a-form-model-item
                label="起止时间"
                :labelCol="{lg: {span: 4}, sm: {span: 2}}"
                :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
                prop="startEndDate">
                <a-range-picker v-model="item.startEndDate" />
              </a-form-model-item>
            </a-col>
            <a-col :md="6">
              <a-form-model-item
                label="含实习"
                :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                >
                <a-switch v-model="item.check"/>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-form-model-item
            label="工作单位"
            :labelCol="{lg: {span: 3}, sm: {span: 2}}"
            :wrapperCol="{lg: {span: 21}, sm: {span: 20} }"
            prop="company">
            <a-input :maxLength="16" v-model="item.company"></a-input>
          </a-form-model-item>
          <a-form-model-item
            label="岗位职务"
            :labelCol="{lg: {span: 3}, sm: {span: 2}}"
            :wrapperCol="{lg: {span: 21}, sm: {span: 20} }"
            prop="post">
            <a-input :maxLength="10" v-model="item.post"></a-input>
          </a-form-model-item>
          <a-form-model-item
            label="离职原因"
            :labelCol="{lg: {span: 3}, sm: {span: 2}}"
            :wrapperCol="{lg: {span: 21}, sm: {span: 20} }"
            prop="reason">
            <a-textarea :maxLength="16" v-model="item.reason" :rows="2"></a-textarea>
          </a-form-model-item>

        </a-card>
      </a-form-model>
    </div>

    </a-spin>
    <template slot="footer">
      <a-button v-if="!disabled" type="primary" :disabled="loading" @click="handleSave">保存</a-button>
      <a-button key="back" :disabled="loading" @click="handleClose">关闭</a-button>
    </template>
  </a-modal>
</template>

<script>
  import moment from 'moment';
  import AFormModelItem from "ant-design-vue/es/form-model/FormItem";
  import AFormModel from "ant-design-vue/es/form-model/Form";
  import SearchSelect from "../../../components/SearchSelect/SearchSelect";
  import {saveWork} from '@/api/employee'


  export default {
    name: "WorkModal",
    components: {
      SearchSelect,
      AFormModelItem, AFormModel
    },
    props: {
      workInfo:{
        type: Object,
        required: false,
        default: ()=>{}
      },
      recruitmentInfoId: {
        type: Number,
        required:true
      },
    },
    data() {
      return {
        loading:false,
        type:'',
        moment,
        show: false,
        disabled: false,
        workData: [],
        rules : {
          startEndDate: [{ required: true, message: '请选择起止时间', trigger: 'change' },],
          company: [{ required: true, message: '请填写工作单位', trigger: 'blur' }],
          post: [{ required: true ,message: '请填写岗位职务', trigger: 'blur'}],
          reason: [{ required: true ,message: '请填写离职原因', trigger: 'blur'}]
        }
      }
    },
    methods: {
      handleOpen(type) {
        this.type = type
        this.workData = []
        if(type==="create"){
          this.doAdd()
        }
        this.disabled = this.type === "read"
        this.show = true
      },
      handleClose() {
        this.show = false
      },
      getTitle(index) {
        return "工作经历" + index
      },
      doAdd(){
        this.workData.push({
          id: null,
          zpid: this.recruitmentInfoId,
          appellation: null,
          name: null,
          age: null,
          company: null,
          phone: null,
          startDate: null,
          endDate: null,
          startEndDate:null,
        })
      },
      doDelete(index){
        this.workData.splice(index, 1)
        this.$message.success('删除成功')
        if(this.workData.length === 0){
          this.doAdd()
        }
      },
      handleSave(){
        const { $refs: { ruleForm } } = this
        let count = 0
        if(this.type === "update"){
          ruleForm.validate(valid => {
            if (valid) {
              this.saveToServe()
            }else{
              return false
            }
          })
        }else{
          ruleForm.forEach(f => f.validate(valid => {
            if (valid) {
              count++
            }
          }))
          if(count === ruleForm.length){
            this.saveToServe()
          }
        }
      },
      saveToServe(){
        const me = this
        me.loading = true
        let work
        if(this.type === "create"){
          work = [...this.workData]
        }else{
          this.workData.push(this.workInfo)
          work = [...this.workData]
        }
        work.forEach((value) => {
          value.startDate = value.startEndDate[0]
          value.endDate = value.startEndDate[1]
          value.isInternship = value.check ? 1 : 0
        })
        saveWork(work).then(res=> {
          if(res.code === 200){
            me.$message.success('保存成功')
            me.handleClose()
            me.$emit('refresh')
          }
          me.loading = false
        })
      }
    }
  }
</script>

<style scoped lang="less">
  /deep/ .ant-card-body {
    padding: 10px
  }
</style>