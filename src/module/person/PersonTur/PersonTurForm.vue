<template>
  <a-card
    :bordered="false"
    :bodyStyle="{
      height:cardHeight+'px',
      padding: '0px 10px 0px 0px'
    }">
    <a-form-model style="margin-bottom: 70px" v-watermark :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-row>
        <a-col :span="8">
          <a-form-model-item label="申请人">
            <a-input v-model="formData.personName" :disabled="disable"/>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="申请日期">
            <a-input v-model="formData.applyDate" :disabled="disable"/>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="所在部门"
                             :labelCol="{lg: {span: 7}}"
                             :wrapperCol="{lg: {span: 17}}">
            <a-input v-model="formData.deptName" :disabled="disable"/>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="8">
          <a-form-model-item label="帮带老师">
            <a-input v-model="formData.teacherName" :disabled="disable"/>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="试用期结束日期">
            <a-input v-model="formData.endDate" :disabled="disable"/>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="转正职级"
                             :labelCol="{lg: {span: 7}}"
                             :wrapperCol="{lg: {span: 17}}">
            <a-input v-model="formData.rank" :disabled="disable"/>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="16">
          <a-form-model-item label="转正岗位"
                             :labelCol="{lg: {span: 6}}"
                             :wrapperCol="{lg: {span: 18}}">
            <a-input v-model="formData.post" :disabled="disable"/>
          </a-form-model-item>
        </a-col>
        <a-col :span="8" style="text-align: left">
          <a-checkbox :checked="formData.correctionFlag == 1" :disabled="disable" style="padding-left:15px;">
            转正
          </a-checkbox>
        </a-col>
      </a-row>
      <a-row>
        <a-form-model-item label="个人工作小结"
                           :labelCol="{lg: {span: 4}}"
                           :wrapperCol="{lg: {span: 20}}">
          <a-textarea v-model="formData.workReport" :disabled="disable" :auto-size="{ minRows: 3, maxRows: 6 }"></a-textarea>
        </a-form-model-item>
      </a-row>
      <a-row>
        <a-form-model-item label="导师评价"
                           :labelCol="{lg: {span: 4}}"
                           :wrapperCol="{lg: {span: 20}}">
          <a-textarea v-model="formData.teacherEvaluation" :disabled="disable" :auto-size="{ minRows: 3, maxRows: 6 }"></a-textarea>
        </a-form-model-item>
      </a-row>
      <a-row>
        <a-form-model-item label="导师胜任能力评价"
                           :labelCol="{lg: {span: 4}}"
                           :wrapperCol="{lg: {span: 20}}">
          <a-select v-model="formData.teacherAbilityEvaluation" :disabled="disable">
            <a-select-option v-for="item in evaluationDic" :key="item.id">
              {{item.value}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-row>

      <a-row>
        <a-form-model-item label="部门评价"
                           :labelCol="{lg: {span: 4}}"
                           :wrapperCol="{lg: {span: 20}}">
          <a-textarea v-model="formData.depEvaluation" :disabled="disable" :auto-size="{ minRows: 3, maxRows: 6 }"></a-textarea>
        </a-form-model-item>
      </a-row>
      <a-row>
        <a-form-model-item label="部门胜任能力评价"
                           :labelCol="{lg: {span: 4}}"
                           :wrapperCol="{lg: {span: 20}}">
          <a-select v-model="formData.competencyEvaluation" :disabled="disable">
            <a-select-option v-for="item in evaluationDic" :key="item.id">
              {{item.value}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-row>
      <a-row>
        <a-form-model-item label="考试方式"
                           :labelCol="{lg: {span: 4}}"
                           :wrapperCol="{lg: {span: 20}}">
          <a-input v-model="formData.testMode" :disabled="disable"></a-input>
        </a-form-model-item>
      </a-row>
      <a-row>
        <a-col :span="8">
          <a-form-model-item label="工作考核成绩">
            <a-input v-model="formData.workScore" :disabled="disable" style="width: 115px;">
            </a-input>分
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="知识技能成绩"
                             :labelCol="{lg: {span: 10}}"
                             :wrapperCol="{lg: {span: 14}}">
            <a-input v-model="formData.knowledgeScore" :disabled="disable" style="width: 135px;"/>分
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="综合得分"
                             :labelCol="{lg: {span: 9}}"
                             :wrapperCol="{lg: {span: 15}}">
            <a-input v-model="formData.compositeScore" :disabled="disable" style="width: 145px;"/>分
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :span="8">
          <a-form-model-item label="转正日期">
            <a-input v-model="formData.correctionDate" :disabled="disable" style="width: 115px;"/>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="转正考试流水号"
                             style="margin-left: -2px"
                             :labelCol="{lg: {span: 10}}"
                             :wrapperCol="{lg: {span: 14}}">
            <a-input v-model="formData.examLshid" :disabled="disable" style="width: 145px;margin-left: 2px"></a-input>
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row>
        <a-form-model-item label="审批意见"
                           :labelCol="{lg: {span: 4}}"
                           :wrapperCol="{lg: {span: 20}}">
          <a-textarea v-model="formData.approvalOpinion" :disabled="disable" :auto-size="{ minRows: 5, maxRows: 9 }"></a-textarea>
        </a-form-model-item>
      </a-row>
    </a-form-model>
  </a-card>
</template>

<script>
  import { getPersonTurInfo} from "../../../api/personToFormal";
  export default {
  name: "PersonTurForm",
  data(){
    return{
      disable:true,
      labelCol: { lg: {span: 12}},
      wrapperCol: { lg: {span: 12}},
      formData:{
        applyDate: null,
        competencyEvaluation: null,
        compositeScore: null,
        correctionDate: null,
        correctionFlag: null,
        depEvaluation: null,
        depno: null,
        deptName: null,
        endDate: null,
        id: null,
        knowledgeScore: null,
        lshid: null,
        personId: null,
        personName: null,
        post: null,
        teacherAbilityEvaluation: null,
        teacherEvaluation: null,
        teacherId: null,
        teacherName: null,
        testMode: null,
        workReport: null,
        workScore: null,
        rank:null,
        examLshid:null,
        approvalOpinion:null,
      },
      evaluationDic:[
        {
          id:1,
          value:'完全胜任'
        },
        {
          id:2,
          value:'较好胜任'
        },
        {
          id:3,
          value:'基本胜任'
        },
        {
          id:4,
          value:'不胜任'
        }
      ]
    }
  },
  props: {
    turId: {
      type: Number,
      default: null
    }
  },
  computed:{
    cardHeight(){
      return window.innerHeight - 75;
    }
  },
  mounted() {
    this.getBaseInfo()
  },
  methods:{
    getBaseInfo(){
      const params ={
        "turId":this.turId
      }
      getPersonTurInfo(params).then(res=>{
        if(res.code === 200){
          this.formData = res.body
          this.$emit('updateTitle',this.formData.lshid)
        }
      }).catch(err=>{
        console.log(err)
      })
    }
  }
}
</script>

<style scoped lang="less">
/deep/ .ant-input[disabled] {
    color: black;
    background-color: transparent;
    cursor: not-allowed;
    opacity: 1;
  }
/deep/ .ant-form-item {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  list-style: none;
  -webkit-font-feature-settings: 'tnum';
  font-feature-settings: 'tnum';
  margin-bottom: 2px;
  margin-top: 4px;
  vertical-align: top;
}
/deep/ .ant-form-item-label > label::after {
  content: ':';
  position: relative;
  top: -0.5px;
  margin: 0 3px 0 2px;
}
/deep/ .ant-checkbox-disabled + span {
  color: black;
  cursor: not-allowed;
}
/deep/ .ant-select-disabled .ant-select-selection {
  cursor: not-allowed;
  background-color: transparent;
  color: black;
}
/deep/ .ant-checkbox-wrapper.ant-checkbox-wrapper-disabled {
  cursor: not-allowed;
  margin-top: 11px;
}
/deep/ .ant-checkbox-disabled.ant-checkbox-checked .ant-checkbox-inner {
  background-color: #1890ff;
  border-color: #1890ff;
}
/deep/ .ant-checkbox-disabled.ant-checkbox-checked .ant-checkbox-inner::after {
  border-color: white;
  -webkit-animation-name: none;
  animation-name: none;
}
</style>