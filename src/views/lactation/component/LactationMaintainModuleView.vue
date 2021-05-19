<template>
  <a-spin :spinning="isSpinning">
    <a-card :bordered="false" :body-style="{ height:cardHeight + 'px',padding:'10px 0px 0px 10px'}">
      <div :style="{ height: formHeight + 'px',paddingBottom: '50px', overflowY: 'auto' }">
        <a-form-model :model="lactationForm" ref="lactationForm" :rules="readOnly ? null : lactationFormRules">
          <a-form-model-item
            label="姓名"
            :labelCol="{lg: {span: 5}, sm: {span: 2}}"
            :wrapperCol="{lg: {span: 19}, sm: {span: 20} }"
            prop="personId"
            style="margin-bottom: 10px;"
          >
            <person-select
              ref="person"
              v-model="lactationForm.personId"
              :disabled="readOnly"
              style="width: 230px;color: #000000"
              @setPerson="setPerson"></person-select>
          </a-form-model-item>
          <a-form-model-item
            label="部门"
            :labelCol="{lg: {span: 5}, sm: {span: 2}}"
            :wrapperCol="{lg: {span: 19}, sm: {span: 20} }"
            prop="deptName"
            style="margin-bottom: 10px;"
          >
            <a-input
              v-model="lactationForm.deptName"
              style="width: 230px;color: #000000"
              :readOnly="true"></a-input>
          </a-form-model-item>
          <a-form-model-item
            label="哺乳假期"
            :labelCol="{lg: {span: 5}, sm: {span: 2}}"
            :wrapperCol="{lg: {span: 19}, sm: {span: 20} }"
            prop="duration"
            style="margin-bottom: 10px;"
          >
            <a-select style="width: 230px" v-model="lactationForm.duration" :disabled="readOnly">
              <a-select-option v-for="i in 5" :key="i">
                {{ i }}
              </a-select-option>
            </a-select>
            小时
          </a-form-model-item>
          <a-form-model-item
            label="开始日期"
            :labelCol="{lg: {span: 5}, sm: {span: 2}}"
            :wrapperCol="{lg: {span: 19}, sm: {span: 20} }"
            prop="startDate"
            style="margin-bottom: 10px;"
          >
            <a-date-picker
              v-model="lactationForm.startDate"
              @change="onStartDateChange"
              style="width: 230px;"
              :allowClear="false"
              :disabled="readOnly"/>
          </a-form-model-item>
          <a-form-model-item
            label="结束日期"
            :labelCol="{lg: {span: 5}, sm: {span: 2}}"
            :wrapperCol="{lg: {span: 19}, sm: {span: 20} }"
            prop="endDate"
            style="margin-bottom: 10px;"
          >
            <a-date-picker
              v-model="lactationForm.endDate"
              :disabled-date="disabledEndDate"
              style="width: 230px;"
              :allowClear="false"
              :disabled="readOnly"/>
          </a-form-model-item>
        </a-form-model>
      </div>
      <span style="float: left;color: red;">注：从当前登记日期起调整考勤情况</span>
      <div
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '580px',
          borderTop: '1px solid #e9e9e9',
          padding: '9px 16px',
          background: '#fff',
          textAlign: 'right',
        }"
      >
        <a-button
          type="primary"
          icon="check"
          v-if="!readOnly"
          @click="handleSaveLactation"
          :loading="btnLoading"
          style="margin-left: 30px;">保存
        </a-button>
        <a-button key="back" icon="close-circle" @click="onDrawerClose" style="margin-left: 20px">退出</a-button>
      </div>
    </a-card>
  </a-spin>
</template>

<script>
import { PersonSelect } from '@/module'
import moment from 'moment/moment'
import { doSaveLactation } from '@/api/lactationMaintain'

export default {
  name: 'LactationMaintainModuleView',
  components: {
    PersonSelect
  },
  data () {
    return {
      moment,
      cardHeight: window.innerHeight - 60,
      formHeight: window.innerHeight - 150,
      lactationForm: {
        startDate: moment(),
        endDate: moment()
      },
      lactationFormRules: {
        personId: [{ required: true, message: '请填写姓名!', trigger: 'blur' }],
        duration: [{ required: true, message: '请填写哺乳假时长!', trigger: 'blur' }],
        startDate: [{ required: true, message: '请选择哺乳假开始日期!', trigger: 'change' }],
        endDate: [{ required: true, message: '请选择哺乳假结束日期!', trigger: 'change' }]
      },
      readOnly: false,
      btnLoading: false,
      isSpinning: false
    }
  },
  props: {
    lactaionInfo: {
      type: Object,
      default: () => {
      }
    },
    operation: {
      type: String,
      default: ''
    }
  },
  methods: {
    initFormFields () {
      this.lactationForm = {
        id: null,
        personId: null,
        personName: null,
        deptId: null,
        deptName: null,
        duration: 1,
        startDate: moment(),
        endDate: moment()
      }
    },
    onStartDateChange (moment) {
      this.lactationForm.endDate = this.lactationForm.endDate >= moment ? this.lactationForm.endDate : moment
    },
    disabledEndDate (current) {
      return current && current < this.lactationForm.startDate
    },
    handleSaveLactation () {
      if (this.btnLoading) {
        return
      }
      var validateResult = true
      this.$refs.lactationForm.validate(valid => { // 校验
        if (valid) {
        } else {
          validateResult = false
        }
      })
      if (!validateResult) {
        return
      }
      const lactationForm = {}
      Object.assign(lactationForm, this.lactationForm)
      lactationForm.startDate = lactationForm.startDate.format('YYYY-MM-DD')
      lactationForm.endDate = lactationForm.endDate.format('YYYY-MM-DD')
      this.btnLoading = true
      this.isSpinning = true
      doSaveLactation(lactationForm).then(res => {
        if (res.code === 200) {
          this.$message.success('保存成功！')
          this.btnLoading = false
          this.isSpinning = false
          this.$emit('refresh', true)
          this.onDrawerClose()
        }
        this.btnLoading = false
        this.isSpinning = false
      })
    },
    onDrawerClose () {
      this.$emit('close')
    },
    setPerson (person) {
      this.lactationForm.deptId = person.deptCode
      this.lactationForm.deptName = person.deptName
      this.lactationForm.personName = person.personName
    },
    initFormData () {
      this.lactationForm = { ...this.lactaionInfo }
      this.$nextTick(() => {
        this.$refs.person.getCurrent(this.lactationForm.personId, this.lactationForm.personName)
      })
      this.lactationForm.startDate = this.lactationForm.startDate ? moment(this.lactationForm.startDate) : null
      this.lactationForm.endDate = this.lactationForm.endDate ? moment(this.lactationForm.endDate) : null
    },
    initPage () {
      this.initFormFields()
      if (this.operation === 'create') {
        this.readOnly = false
      } else if (this.operation === 'modify') {
        this.readOnly = false
        this.initFormData()
      } else {
        this.readOnly = true
        this.initFormData()
      }
    }
  },
  mounted () {
    this.initPage()
  }
}
</script>

<style scoped>
  /deep/ .ant-calendar-picker-input.ant-input {
    line-height: 1.5;
    color: #000000;
    background: #ffffff;
  }
  /deep/ .ant-select-disabled .ant-select-selection {
    background: #ffffff;
    cursor: not-allowed;
  }

</style>
