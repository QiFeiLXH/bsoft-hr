<template>
  <a-tabs size="small">
    <a-tab-pane key="1" tab="劳动合同续签信息">
      <form-create v-model="fApi" :rule="createRule" :option="option" @labor-contract-change="renewalYearChange"/>
    </a-tab-pane>
    <a-tab-pane key="2" tab="审核信息">
      <action-record-view :actionRecords="actionRecords"></action-record-view>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
  import ActionRecordView from "@/module/workflow/ActionRecord/ActionRecordView";
  import {getDetail} from "@/api/laborContractAudit";
  import moment from "moment";

  export default {
    name: "ProcessAuditForm",
    components: {ActionRecordView},
    props: {
      /*// 业务ID
      businessId: {
        type: Number,
        default: -1,
      },
      // 流程实例ID
      processInstanceId: {
        type: String,
        default: '',
      },
      // 任务ID
      taskId: {
        type: String,
        default: '',
      },*/
      // 业务数据列表的单条数据
      customRecord: {
        type: Object,
        default: () => {},
      },
      /*customFormData: {
        type: Object,
        default: () => {},
      },*/
      /*// 隐藏的表单项名称
      hiddenFields: {
        type: Array,
        default: () => ['id','taskDefineKey', 'renewalStartDate', 'renewalEndDate']
      },*/
      // 权限对应的表单项名称
      /*authFields: {
        type: Object,
        default:  {
          deptAudit: ['deptAuditorName', 'deptAuditDate', 'deptOpinion'],
          areaAudit: ['dealPersonName', 'dealDate', 'remark', 'quitApplyId', 'signUnit'],
          hrAudit: ['hrAuditorName', 'hrAuditDate', 'hrOpinion'],
          renewalDate: ['renewalYear'],
        }
      },*/
    },
    /*model: {
      prop: 'customFormData',
    },*/
    mounted() {
      this.init()
      // this.renewalYearChange()
    },
    data() {
      return {
        // 隐藏的表单项名称
        hiddenFields: ['id','taskDefineKey', 'renewalStartDate', 'renewalEndDate'],
        // 权限对应的表单项名称
        authFields: {
          deptAudit: ['deptAuditorName', 'deptAuditDate', 'deptOpinion'],
          areaAudit: ['dealPersonName', 'dealDate', 'remark', 'quitApplyId', 'signUnit'],
          hrAudit: ['hrAuditorName', 'hrAuditDate', 'hrOpinion'],
          renewalDate: ['renewalYear'],
        },
        formData: {},
        formRules: {},
        actionRecords: [],
        // form-create 表单实例对象
        fApi: {},
        // form-create 表单生成规则
        createRule: [],
        // form-create 组件参数配置
        option: {
          resetBtn: false,
          submitBtn: false,
          onSubmit: formData => {
            //按钮进入提交状态
            // this.fApi.btn.loading();
            //重置按钮禁用
            // this.fApi.resetBtn.disabled();
            //按钮进入可点击状态
            // this.fApi.btn.finish();
            this.fApi.validate((valid, fail) => {
              if (valid) {
                this.$message.success('表单验证通过')
                alert(JSON.stringify(this.fApi.formData()));
                this.$emit("afterFormSubmit")
                return
                this.closeForm()
              } else {
                this.$message.error('表单验证未通过')
                return
              }
            })
          }
        },
      }
    },
    methods: {
      init(){
        // console.log(this.customRecord)
        const param = {
          'id': this.customRecord.id,
          'taskId': this.customRecord.taskId,
          'processInstanceId': this.customRecord.processInstanceId
        }
        getDetail(param).then(res=>{
          if (res.code === 200){
            /*console.log(res.body)*/

            this.createRule = JSON.parse(res.body.formRule.rule.replace(/[\r\n]/g,""))
            this.actionRecords = res.body.actionRecord

            // 表单数据
            Object.assign(this.formData, res.body.detail);
            this.formData.taskDefineKey = this.customRecord.taskDefineKey
            this.formData.taskId = this.customRecord.taskId
            this.formData.notifyFlag = this.customRecord.notifyFlag
            if(this.formData.deptAudit != 1 && this.formData.deptAudit != 2 && this.formData.notifyFlag == 0){
              this.formData.deptAudit = 1
            }
            if(this.formData.renewalYear == null){
              this.formData.renewalYear = 5
            }

            // 权限
            let reg=new RegExp("'",'g')//g代表全部
            if (res.body.auth == null) {
              this.formAuth = Object.assign(this.formAuth,this.defaultFormAuth)
            } else{
              let auth =res.body.auth[0].param.replace(reg,'"');
              this.formAuth = JSON.parse(auth);//将字符串转换成json对象
            }

          }
          console.log(this.createRule)
          console.log(this.actionRecords)
          console.log(this.formData)
          console.log(this.formAuth)
          this.setFormData()
        }).catch(err=>{
          console.log(err)
        })
      },
      setFormData() {

        // 遍历vo为表单设值
        /*var dataFields = Object.keys(this.formData)
        console.log(this.fApi)
        dataFields.forEach(field => {
          var ruleSetData = this.fApi.getRule(field)

          console.log(field)
          console.log(ruleSetData)
          if(ruleSetData) {
            ruleSetData.value = this.formData[field] ? this.formData[field] : ""
            if (ruleSetData.type == 'label') {
              if (ruleSetData.children) {
                ruleSetData.children = []
                ruleSetData.children.push(this.formData[field] ? this.formData[field] : "")
              }
            }
            console.log(field)
            console.log(ruleSetData)
            this.fApi.updateRule(field, ruleSetData)
          }
        })*/

        this.createRule.forEach(item  => {
          var field = item.field
          console.log(field)
          if(this.formData[field]) {
            item.value = this.formData[field]
            if (item.type == 'label') {
              item.children = []
              item.children.push(this.formData[field])
            }
            console.log(item)
            this.fApi.updateRule(field, item)

          }
        })

        // 隐藏hiddenFields中指定的字段
        this.hiddenFields.forEach(field => {
          this.fApi.hidden(true, field)
        })

        // 根据权限设置：表单的显示隐藏、表单项验证
        var authFields = Object.keys(this.formAuth)
        authFields.forEach(field => {
          this.authFields[field].forEach(item => {
            if (this.formAuth[field].disabled == 'true') {
              this.fApi.disabled(true, item)
            } if (this.formAuth[field].hidden == 'true') {
              this.fApi.hidden(true, item)
            }
          })
        })

        this.fApi.reload();
        console.log(this.fApi.formData())
        var formData = this.fApi.bind()
        console.log(formData)
      },
      renewalYearChange() {
        const endDate = this.fApi.getValue('endDate')
        const renewalYear = this.fApi.getValue('renewalYear')
        const renewalStartDate = moment(endDate).add(1,"day")
        const renewalEndDate = moment(endDate).add(renewalYear,"year")
        const renewalDate = renewalStartDate.format('YYYY年MM月DD日') + ' ~ ' + renewalEndDate.format('YYYY年MM月DD日')
        console.log(renewalDate)
        this.fApi.setValue({renewalDate: renewalDate })
        var createRule = this.fApi.getRule('renewalDate')
        console.log(createRule)
        createRule.children = [renewalDate]
        this.fApi.updateRule('renewalDate', createRule)
      },
    }
  }
</script>

<style scoped>

</style>