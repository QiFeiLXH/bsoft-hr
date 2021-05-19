<template>
    <a-modal
      style="top: 30px"
      v-model="show"
      :width="800"
      :maskClosable="false"
      :destroyOnClose="true">
      <a-spin :spinning="loading">
        <div style="height: 350px;overflow-y: auto;margin-top: 20px">
        <a-form-model v-if="type==='update'||type==='read'" :model="familyInfo" ref="ruleForm" :rules="rules">
          <a-card title="家庭情况">
            <!--<a-button-group slot="extra" v-if="!disabled">
              <a-button type="link" icon="plus" @click="doAdd">新增</a-button>
              <a-popconfirm title="是否要删除此行？" @confirm="doDelete(index )">
                <a-button type="link" icon="delete">删除</a-button>
              </a-popconfirm>
            </a-button-group>-->
            <a-row>
              <a-col :md="12">
                <a-form-model-item
                  label="称　　　谓"
                  :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                  :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                  prop="appellation">
                  <a-select v-model="familyInfo.appellation" :disabled="disabled">
                    <a-select-option :value="dic.id" v-for="dic in appellationDic" :key="dic.id">
                      {{dic.name}}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :md="12">
                <a-form-model-item
                  label="姓　　名"
                  :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                  :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                  prop="name">
                  <a-input :maxLength="15" :disabled="disabled" v-model="familyInfo.name"></a-input>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :md="12">
                <a-form-model-item
                  label="年　　　龄"
                  :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                  :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                  prop="age">
                  <a-input-number :disabled="disabled" :max="200" :min="1" v-model="familyInfo.age" style="width: 100%"></a-input-number>
                </a-form-model-item>
              </a-col>
              <a-col :md="12">
                <a-form-model-item
                  label="联系电话"
                  :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                  :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                  prop="phone">
                  <a-input :maxLength="15" :disabled="disabled" v-model="familyInfo.phone"></a-input>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-form-model-item
              label="单位及职务"
              :labelCol="{lg: {span: 4}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
              prop="company">
              <a-input :maxLength="15" :disabled="disabled" v-model="familyInfo.company"></a-input>
            </a-form-model-item>

          </a-card>
        </a-form-model>

        <a-form-model v-else :model="item" ref="ruleForm" v-for="(item,index) in familyData" :key="index" :rules="rules">
          <a-card :title="getTitle(index+1)">
            <a-button-group slot="extra" v-if="!disabled">
              <a-button type="link" icon="plus" @click="doAdd">新增</a-button>
              <a-popconfirm title="是否要删除此行？" @confirm="doDelete(index )">
                <a-button type="link" icon="delete">删除</a-button>
              </a-popconfirm>
            </a-button-group>

            <a-row>
              <a-col :md="12">
                <a-form-model-item
                  label="称　　　谓"
                  :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                  :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                  prop="appellation">
                  <a-select v-model="item.appellation">
                    <a-select-option :value="dic.id" v-for="dic in appellationDic" :key="dic.id">
                      {{dic.name}}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :md="12">
                <a-form-model-item
                  label="姓　　名"
                  :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                  :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                  prop="name">
                  <a-input :maxLength="15" v-model="item.name"></a-input>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :md="12">
                <a-form-model-item
                  label="年　　　龄"
                  :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                  :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                  prop="age">
                  <a-input-number :max="200" :min="1" v-model="item.age" style="width: 100%"></a-input-number>
                </a-form-model-item>
              </a-col>
              <a-col :md="12">
                <a-form-model-item
                  label="联系电话"
                  :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                  :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                  prop="phone">
                  <a-input :maxLength="15" v-model="item.phone"></a-input>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-form-model-item
              label="单位及职务"
              :labelCol="{lg: {span: 4}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
              prop="company">
              <a-input :maxLength="15" v-model="item.company"></a-input>
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
  import AFormModelItem from "ant-design-vue/es/form-model/FormItem";
  import AFormModel from "ant-design-vue/es/form-model/Form";
  import SearchSelect from "../../../components/SearchSelect/SearchSelect";
  import {saveFamily} from '@/api/employee'


  export default {
    name: "FamilyModal",
    components: {
      SearchSelect,
      AFormModelItem, AFormModel
    },
    props: {
      appellationDic: {
        type: Array,
        required: true
      },
      familyInfo:{
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
        show: false,
        type:'',
        loading:false,
        disabled: false,
        familyData: [],
        rules : {
          appellation: [{ required: true, message: '请选择称谓', trigger: 'change' },],
          name: [{ required: true, message: '请填写姓名', trigger: 'blur' }],
          age: [{ required: true, message: '请填写年龄', trigger: 'blur' }],
          phone: [{ required: true ,message: '请填写联系电话', trigger: 'blur'}],
          company: [{ required: true ,message: '请填写单位及职务', trigger: 'blur'}]
        }
      }
    },
    methods: {
      handleOpen(type) {
        this.type = type
        this.familyData = []
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
        return "家庭情况" + index
      },
      doAdd(){
        this.familyData.push({
          id: null,
          zpid: this.recruitmentInfoId,
          appellation: null,
          name: null,
          age: null,
          company: null,
          phone: null,
        })
      },
      doDelete(index){
        this.familyData.splice(index, 1)
        this.$message.success('删除成功')
        if(this.familyData.length === 0){
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
        let param
        if(this.type === "create"){
          param = [...this.familyData]
        }else{
          this.familyData.push(this.familyInfo)
          param = [...this.familyData]
        }
        saveFamily(param).then(res=> {
          if(res.code === 200){
            me.$message.success('保存成功')
            me.$emit('refresh')
            me.handleClose()
          }
          me.loading = false
        })
      }
    }
  }
</script>

<style scoped>
  /deep/ .ant-card-body {
    padding: 10px
  }
</style>