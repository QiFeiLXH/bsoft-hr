<template>
  <a-spin :spinning="isSpinning">
    <a-card :bordered="false" :body-style="{ height:cardHeight + 'px',padding:'10px 0px 0px 10px'}">
      <div :style="{ height: formHeight + 'px',paddingBottom: '50px', overflowY: 'auto' }">
        <a-form-model :model="personStockForm" ref="personStockForm" :rules="readOnly ? null : personStockFormRules">
          <a-form-model-item
            label="姓名"
            :labelCol="{lg: {span: 5}, sm: {span: 2}}"
            :wrapperCol="{lg: {span: 19}, sm: {span: 20} }"
            prop="personId"
            style="margin-bottom: 10px;"
          >
            <person-select
              ref="person"
              v-model="personStockForm.personId"
              isValid="0"
              :disabled="operation !== 'create'"
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
              v-model="personStockForm.deptName"
              style="width: 230px;color: #000000"
              :readOnly="true"></a-input>
          </a-form-model-item>
          <a-form-model-item
            label="备注"
            :labelCol="{lg: {span: 5}, sm: {span: 2}}"
            :wrapperCol="{lg: {span: 19}, sm: {span: 20} }"
            prop="remark"
            style="margin-bottom: 10px;"
          >
            <a-textarea
              v-model="personStockForm.remark"
              :auto-size="{ minRows: 3, maxRows: 3 }"
              style="width: 230px;color: #000000"
              :readOnly="readOnly"></a-textarea>
          </a-form-model-item>
          <a-form-model-item
            label="登记人"
            :labelCol="{lg: {span: 5}, sm: {span: 2}}"
            :wrapperCol="{lg: {span: 19}, sm: {span: 20} }"
            prop="registerName"
            style="margin-bottom: 10px;"
          >
            <a-input
              v-model="personStockForm.registerName"
              style="width: 230px;color: #000000"
              :readOnly="true"></a-input>
          </a-form-model-item>
          <a-form-model-item
            label="登记日期"
            :labelCol="{lg: {span: 5}, sm: {span: 2}}"
            :wrapperCol="{lg: {span: 19}, sm: {span: 20} }"
            prop="registerDate"
            style="margin-bottom: 10px;"
          >
            <a-date-picker
              v-model="personStockForm.registerDate"
              style="width: 230px;"
              :allowClear="false"
              :disabled="true"/>
          </a-form-model-item>
        </a-form-model>
      </div>
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
          @click="doSavePersonStock"
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
import { doSavePersonStock } from '@/api/personStock'
import store from '@/store'

export default {
  name: 'PersonStockMaintainModuleView',
  components: {
    PersonSelect
  },
  data () {
    return {
      moment,
      cardHeight: window.innerHeight - 60,
      formHeight: window.innerHeight - 150,
      personStockForm: {},
      personStockFormRules: {
        personId: [{ required: true, message: '请填写姓名!', trigger: 'blur' }]
      },
      readOnly: false,
      btnLoading: false,
      isSpinning: false
    }
  },
  props: {
    personStockInfo: {
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
      this.personStockForm = {
        id: null,
        personId: null,
        personName: null,
        deptId: null,
        deptName: null,
        remark: null,
        register: null,
        registerName: store.getters.userInfo.personName,
        registerDate: moment(),
        logout: 0
      }
    },
    doSavePersonStock () {
      if (this.btnLoading) {
        return
      }
      var validateResult = true
      this.$refs.personStockForm.validate(valid => { // 校验
        if (valid) {
        } else {
          validateResult = false
        }
      })
      if (!validateResult) {
        return
      }
      const personStockForm = {}
      Object.assign(personStockForm, this.personStockForm)
      if (this.operation === 'create') {
        personStockForm.registerDate = null
      } else {
        personStockForm.registerDate = personStockForm.registerDate.format('YYYY-MM-DD')
      }
      this.btnLoading = true
      this.isSpinning = true
      doSavePersonStock(personStockForm).then(res => {
        if (res.code === 200) {
          this.$message.success('保存成功！')
          this.btnLoading = false
          this.isSpinning = false
          this.$emit('refresh', 1)
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
      this.personStockForm.deptId = person.deptCode
      this.personStockForm.deptName = person.deptName
      this.personStockForm.personName = person.personName
    },
    initFormData () {
      this.personStockForm = { ...this.personStockInfo }
      this.$nextTick(() => {
        this.$refs.person.getCurrent(this.personStockForm.personId, this.personStockForm.personName)
      })
      this.personStockForm.registerDate = this.personStockForm.registerDate ? moment(this.personStockForm.registerDate) : null
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
