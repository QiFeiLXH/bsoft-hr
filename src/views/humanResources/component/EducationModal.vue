<template>
  <a-modal
    style="top: 30px"
    v-model="show"
    :width="900"
    :maskClosable="false"
    :destroyOnClose="true">
    <a-spin :spinning="loading">

      <div style="height: 360px;overflow-y: auto;margin-top: 20px">
      <a-form-model v-if="type==='update'||type==='read'" :model="educationInfo" :rules="rules" ref="ruleForm">
        <a-card title="教育经历">
          <!--<a-button-group slot="extra" v-if="!disabled">
            <a-button type="link"  icon="plus" @click="doAdd" >新增</a-button>
            <a-popconfirm title="是否要删除此行？" @confirm="doDelete(index )" >
              <a-button type="link" icon="delete">删除</a-button>
            </a-popconfirm>
          </a-button-group>-->
          <a-row>
            <a-col :md="16">
              <a-form-model-item
                label="起止时间"
                :labelCol="{lg: {span: 6}, sm: {span: 2}}"
                :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
                prop="startEndDate">
                <a-range-picker  :disabled="disabled" v-model="educationInfo.startEndDate"/>
              </a-form-model-item>
            </a-col>
            <a-col :md="8">
              <a-form-model-item
                label="学　　　历"
                :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                :wrapperCol="{lg: {span: 12}, sm: {span: 20} }"
                prop="education">
                <a-select @focus="getEducationDic" v-model="educationInfo.education" :disabled="disabled">
                  <a-spin v-if="educationDic.length === 0" slot="notFoundContent" size="small" />
                  <a-select-option :value="dic.id" v-for="dic in educationDic" :key="dic.id">
                    {{dic.name}}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>

          <a-form-model-item
            label="院校名称"
            :labelCol="{lg: {span: 4}, sm: {span: 2}}"
            :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
            prop="schoolName">
            <a-input v-model="educationInfo.schoolName" style="width: 90%" :disabled="disabled"></a-input>
            <search-select :maxLength="30" :dataSource="schoolDic" :record="educationInfo" v-if="!disabled" @setValue="setSchool"></search-select>
          </a-form-model-item>
          <a-form-model-item
            label="所学专业"
            :labelCol="{lg: {span: 4}, sm: {span: 2}}"
            :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
            prop="majorName">
            <a-input :maxLength="30" v-model="educationInfo.majorName" style="width: 90%" :disabled="disabled"></a-input>
            <search-select :dataSource="majorDic" :record="educationInfo" v-if="!disabled" @setValue="setMajor"></search-select>
          </a-form-model-item>
          <a-form-model-item
            label="职　　务"
            :labelCol="{lg: {span: 4}, sm: {span: 2}}"
            :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
            prop="post">
            <a-input :maxLength="10" v-model="educationInfo.post" :disabled="disabled" style="width: 90%;"></a-input>
          </a-form-model-item>
          <viewer :images="getEducationImages">
            <a-descriptions size="small" style="margin-left: 65px;">
              <a-descriptions-item label="学历证书">
                <img :src="educationImages[0]" v-if="educationImages[0]" class="certificates-image"/>
              </a-descriptions-item>
              <a-descriptions-item label="学位证书">
                <img :src="educationImages[1]" v-if="educationImages[1]" class="certificates-image"/>
              </a-descriptions-item>

              <a-descriptions-item v-for="(item,index) in educationInfo.others" :key="item.id" :label="item.certificateName">
                <img :src="educationImages[index+2]" v-if="educationImages[index+2]" class="certificates-image"/>
              </a-descriptions-item>
            </a-descriptions>
          </viewer>

        </a-card>
      </a-form-model>

      <a-form-model v-else :model="item" ref="ruleForm" v-for="(item,index) in educationData" :rules="rules" :key="index">
        <a-card :title="getTitle(index+1)">
          <a-button-group slot="extra" v-if="!disabled">
            <a-button type="link"  icon="plus" @click="doAdd" >新增</a-button>
            <a-popconfirm title="是否要删除此行？" @confirm="doDelete(index )" >
              <a-button type="link" icon="delete">删除</a-button>
            </a-popconfirm>
          </a-button-group>

          <a-row>
            <a-col :md="16">
              <a-form-model-item
                label="起止时间"
                :labelCol="{lg: {span: 6}, sm: {span: 2}}"
                :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
                prop="startEndDate">
                <a-range-picker :disabled="disabled" v-model="item.startEndDate"/>
              </a-form-model-item>
            </a-col>
            <a-col :md="8">
              <a-form-model-item
                label="学　　　历"
                :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                :wrapperCol="{lg: {span: 12}, sm: {span: 20} }"
                prop="education">
                <a-select @focus="getEducationDic" v-model="item.education">
                  <a-spin v-if="educationDic.length === 0" slot="notFoundContent" size="small" />
                  <a-select-option :value="dic.id" v-for="dic in educationDic" :key="dic.id">
                    {{dic.name}}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>

          <a-form-model-item
            label="院校名称"
            :labelCol="{lg: {span: 4}, sm: {span: 2}}"
            :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
            prop="schoolName">
            <a-input :maxLength="30" v-model="item.schoolName" style="width: 90%"></a-input>
            <search-select :dataSource="schoolDic" :record="item" @setValue="setSchool"></search-select>
          </a-form-model-item>
          <a-form-model-item
            label="所学专业"
            :labelCol="{lg: {span: 4}, sm: {span: 2}}"
            :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
            prop="majorName">
            <a-input :maxLength="30" v-model="item.majorName" style="width: 90%"></a-input>
            <search-select :dataSource="majorDic" :record="item" @setValue="setMajor"></search-select>
          </a-form-model-item>
          <a-form-model-item
            label="职　　务"
            :labelCol="{lg: {span: 4}, sm: {span: 2}}"
            :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
            prop="post">
            <a-input :maxLength="10" v-model="item.post" style="width: 90%;"></a-input>
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
  import {saveEducation, getHumanDic} from '@/api/employee'
  import {showImage} from '@/api/common'
  const compare = function (obj1, obj2) {
    let val1 = obj1.key
    let val2 = obj2.key
    if (val1 < val2) {
      return -1;
    } else if (val1 > val2) {
      return 1;
    } else {
      return 0;
    }
  }

  export default {
    name: "EducationModal",
    components: {
      SearchSelect,
      AFormModelItem, AFormModel
    },
    props: {
      schoolDic: {
        type: Array,
        required: true
      },
      majorDic: {
        type: Array,
        required: true
      },
      recruitmentInfoId: {
        type: Number,
        required:true
      }
    },
    computed: {
      getEducationImages : function () {
        if(this.eduImageSize === 0){
          return []
        }else if(this.eduImages.length === this.eduImageSize){
          this.eduImages.sort(compare)
          this.eduImages.forEach(item => this.educationImages.push(item.src))
          return this.educationImages
        }else{
          return []
        }
      }
    },
    data() {
      return {
        type:'',
        moment,
        show: false,
        loading:false,
        disabled: false,
        educationData: [],
        educationImages: [],
        eduImages:[],
        eduImageSize:0,
        educationInfo:{},
        educationDic: [],
        rules : {
          startEndDate: [{ required: true, message: '请选择起止时间', trigger: 'change' },],
          education: [{ required: true, message: '请选择学历', trigger: 'change' }],
          schoolName: [{ required: true, message: '请填写院校', trigger: 'blur' }],
          //majorName: [{ required: true ,message: '请填写所学专业', trigger: 'blur'}],
          post: [{ required: true ,message: '请填写职务', trigger: 'blur'}]
        }
      }
    },

    methods: {
      disabledDate(current) {
        return current > moment().endOf('day');
      },

      lookEducation (record) {
        if(record.id > 0 ){
          this.eduImageSize = 2 + record.others.length
          this.educationImages = []
          this.eduImages = []
          const me = this
          if(record.diploma !== null){
            me.eduImages.push({key:0, src: showImage(record.diploma)})
          }else{
            me.eduImages.push({key:0, src:null})
          }
          if(record.academicDegree !== null){
            me.eduImages.push({key:1, src: showImage(record.academicDegree) })
          }else{
            me.eduImages.push({key:1,src:null})
          }
          if(record.others !== null){
            for (let i = 0; i < record.others.length; i++) {
              if(record.others[i].certificateID !== null){
                me.eduImages.push({key: i+2, src: showImage(record.others[i].certificateID) })
              }else{
                me.eduImages.push({key:i+2,src:null})
              }
            }
          }
          me.startEndDate = [moment(me.startDate),moment(me.endDate)]
        }
      },
      handleOpen(type,record) {
        this.educationInfo = record
        this.type = type
        this.educationData = []
        if(type==="create"){
          this.doAdd()
        }else if(type === "update" || type === "read" ){
          this.educationDic = [{id:this.educationInfo.education,name:this.educationInfo.educationText}]
          this.lookEducation(this.educationInfo)
        }
        this.disabled = this.type === "read"
        this.show = true
      },
      handleClose() {
        this.show = false
      },
      getTitle(index) {
        return "教育经历" + index
      },
      setSchool(value, record) {
        record.school = value.id
        record.schoolName = value.name
      },
      setMajor(value, record) {
        record.major = value.id
        record.majorName = value.name
      },
      doAdd(){
        this.educationData.push({
          id: null,
          zpid: this.recruitmentInfoId,
          startDate: null,
          endDate: null,
          startEndDate: null,
          school: null,
          major: null,
          majorName:null,
          majorText: null,
          post: null,
          schoolName: null,
          others:[]
        })
      },
      getEducationDic(){
        if(this.educationDic.length === 0 || this.educationDic.length ===1) {
          this.educationDic = []
          let param = {type : 10}
          getHumanDic(param).then(res=> {
            if(res.code === 200){
              this.educationDic = res.body
            }
          })
        }

      },
      doDelete(index){
        this.educationData.splice(index, 1)
        this.$message.success('删除成功')
        if(this.educationData.length === 0){
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
        let education
        if(this.type === "create"){
          education = [...this.educationData]
        }else{
          this.educationData.push(this.educationInfo)
          education = [...this.educationData]
        }
        education.forEach((value) => {
          value.startDate = value.startEndDate[0]
          value.endDate = value.startEndDate[1]
          if(value.school === null){
            let a = me.schoolDic.find(item => item.name === value.schoolName)
            if(a){
              value.school = a.id
            }
          }
          if(value.major !== null){
            let b = me.majorDic.find(item => item.name === value.majorName)
            if(b){
              value.marjor = b.id
            }
          }
        })
        saveEducation(education).then(res=> {
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

  .certificates-image {
    width: 80px;
    height: 45px;
  }
  /deep/ .ant-card-body {
    padding: 10px
  }
</style>