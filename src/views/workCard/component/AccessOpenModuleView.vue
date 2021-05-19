<template>
  <a-spin :spinning="isSpanning">
    <div :style="{height: viewHeight+'px',overflowY:'hidden'}">
      <a-card :bordered="false" :style="{height: formHeight+'px',overflowY:'auto'}">
        <a-form-model :model="personForm" :rules="personFormRules" ref="personForm">
          <a-card>
            <a-row>
              <a-col :md="13">
                <a-form-model-item
                  label="工　　号"
                  :labelCol="{lg: {span: 6}, sm: {span: 2}}"
                  :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
                  style="margin-bottom: 10px;"
                  prop="personId">
                  <a-input :readOnly="true" v-model="personForm.personId" style="width: 274px;color: #000000"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="11">
                <a-form-model-item
                  label="姓　　名"
                  :labelCol="{lg: {span: 7}, sm: {span: 2}}"
                  :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
                  style="margin-bottom: 10px;"
                  prop="personName">
                  <a-input :readOnly="true" v-model="personForm.personName" style="width: 221px;color: #000000"/>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :md="13">
                <a-form-model-item
                  label="部门编码"
                  :labelCol="{lg: {span: 6}, sm: {span: 2}}"
                  :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
                  style="margin-bottom: 10px;"
                  prop="deptId">
                  <a-input :readOnly="true" v-model="personForm.deptId" style="width: 274px;color: #000000"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="11">
                <a-form-model-item
                  label="部　　门"
                  :labelCol="{lg: {span: 7}, sm: {span: 2}}"
                  :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
                  style="margin-bottom: 10px;"
                  prop="deptName">
                  <a-input :readOnly="true" v-model="personForm.deptName" style="width: 221px;color: #000000"/>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-card>
          <a-card>
            <a-row>
              <a-col :md="13">
                <a-form-model-item
                  label="工牌编号"
                  :labelCol="{lg: {span: 6}, sm: {span: 2}}"
                  :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
                  style="margin-bottom: 10px;"
                  prop="workCardNo">
                  <a-input :readOnly="true" v-model="personForm.workCardNo" style="width: 274px;color: #000000"/>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :md="13">
                <a-form-model-item
                  label="工牌办理人"
                  :labelCol="{lg: {span: 6}, sm: {span: 2}}"
                  :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
                  style="margin-bottom: 10px;"
                  prop="maker">
                  <person-select
                    ref="maker"
                    :disabled="true"
                    v-model="personForm.maker"
                    style="color: #000000;width:274px"></person-select>
                </a-form-model-item>
              </a-col>
              <a-col :md="11">
                <a-form-model-item
                  label="工牌办理日期"
                  :labelCol="{lg: {span: 7}, sm: {span: 2}}"
                  :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
                  style="margin-bottom: 10px;"
                  prop="makeDate">
                  <a-date-picker
                    :value="personForm.makeDate ? moment(personForm.makeDate) : null"
                    style="width: 221px;"
                    :disabled="true"/>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-card>
          <a-card>
            <a-row>
              <a-col>
                <a-form-model-item
                  label="门禁权限"
                  :labelCol="{lg: {span: 3}, sm: {span: 2}}"
                  :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
                  style="margin-bottom: 10px;"
                  prop="accessControlList">
                  <a-card>
                    <a-checkbox-group :value="accessControlList">
                      <a-row>
                        <div v-for="i in 7" :key="i" style="width: 70px;display: inline-block;margin-bottom: 5px">
                          <a-checkbox :value="i + 3" :key="i">{{ i + 3 }}F</a-checkbox>
                        </div>
                      </a-row>
                      <a-row>
                        <div v-for="i in 3" :key="i" style="width: 70px;display: inline-block">
                          <a-checkbox :value="i + 10" :key="i">{{ i + 10 }}F</a-checkbox>
                        </div>
                        <div style="width: 70px;display: inline-block">
                          <a-checkbox :value="16">16F</a-checkbox>
                        </div>
                      </a-row>
                    </a-checkbox-group>
                  </a-card>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-card>
          <a-card>
            <a-row>
              <a-col :md="13">
                <a-form-model-item
                  label="核实人"
                  :labelCol="{lg: {span: 6}, sm: {span: 2}}"
                  :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
                  style="margin-bottom: 10px;"
                  prop="verifier">
                  <person-select
                    :disabled="true"
                    ref="verifier"
                    v-model="personForm.verifier"
                    style="color: #000000;width:274px"></person-select>
                </a-form-model-item>
              </a-col>
              <a-col :md="11">
                <a-form-model-item
                  label="核实日期"
                  :labelCol="{lg: {span: 7}, sm: {span: 2}}"
                  :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
                  style="margin-bottom: 10px;"
                  prop="verifyDate">
                  <a-date-picker
                    :value="personForm.verifyDate ? moment(personForm.verifyDate) : null"
                    style="width: 221px;"
                    :allowClear="false"
                    :disabled="true"/>
                </a-form-model-item>
              </a-col>
            </a-row><a-row>
              <a-col :md="13">
                <a-form-model-item
                  label="门禁办理人"
                  :labelCol="{lg: {span: 6}, sm: {span: 2}}"
                  :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
                  style="margin-bottom: 10px;"
                  prop="opener">
                  <person-select
                    :disabled="readOnly"
                    ref="person"
                    v-model="personForm.opener"
                    style="color: #000000;width:274px"></person-select>
                </a-form-model-item>
              </a-col>
              <a-col :md="11">
                <a-form-model-item
                  label="开通日期"
                  :labelCol="{lg: {span: 7}, sm: {span: 2}}"
                  :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
                  style="margin-bottom: 10px;"
                  prop="openDate">
                  <a-date-picker
                    v-model="personForm.openDate"
                    style="width: 221px;"
                    :allowClear="false"
                    :disabled="readOnly"/>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-card>
        </a-form-model>
      </a-card>
    </div>
  </a-spin>
</template>

<script>
import { PersonSelect } from '@/module'
import { openAccessWorkCard } from '@/api/workCardAccessOpen'
import moment from 'moment'
import store from '@/store'

const userInfo = store.getters.userInfo

export default {
  name: 'AccessOpenModuleView',
  components: {
    PersonSelect
  },
  data () {
    return {
      moment,
      personForm: {},
      isSpanning: false,
      accessControlList: [],
      readOnly: false,
      personFormRules: {
        opener: [{ required: true, message: '请选择工牌门禁办理人!', trigger: 'change' }],
        openDate: [{ required: true, message: '请选择工牌门禁权限开通日期!', trigger: 'change' }]
      }
    }
  },
  props: {
    person: {
      type: Object,
      default: () => {
      }
    },
    operation: {
      type: String,
      default: ''
    }
  },
  computed: {
    viewHeight: function () {
      return window.innerHeight - 100
    },
    formHeight: function () {
      return window.innerHeight - 110
    }
  },
  methods: {
    initFormFields () {
      this.personForm = {
        personId: null,
        personName: null,
        deptId: null,
        deptName: null,
        opener: null,
        openDate: moment(),
        maker: null,
        makerDate: moment(),
        workcardFlag: null,
        accessControl: null,
        received: 0,
        workCardNo: null,
        verifier: null,
        verifyDate: null
      }
    },
    handleOpenAccess () {
      var validateResult = true
      this.$refs.personForm.validate(valid => { // 校验
        if (valid) {
        } else {
          validateResult = false
        }
      })
      if (!validateResult) {
        return
      }
      const personForm = {}
      Object.assign(personForm, this.personForm)
      personForm.openDate = personForm.openDate.format('YYYY-MM-DD')
      personForm.status = 4
      this.isSpanning = true
      openAccessWorkCard(personForm).then(res => {
        if (res.code === 200) {
          this.$message.success('开通成功！')
          this.isSpanning = false
          this.$emit('refresh', true)
          this.onDrawerClose()
        }
        this.isSpanning = false
      })
    },
    initFormData () {
      // this.personForm = { ...this.person }
      Object.assign(this.personForm, this.person)
      if (!this.readOnly) {
        this.$nextTick(() => {
          this.$refs.person.getCurrent(userInfo.personId, userInfo.personName)
          this.$refs.maker.getCurrent(this.personForm.maker, null)
          this.$refs.verifier.getCurrent(this.personForm.verifier, null)
        })
        this.personForm.openDate = moment()
      } else {
        this.$nextTick(() => {
          this.$refs.person.getCurrent(this.personForm.opener, null)
          this.$refs.maker.getCurrent(this.personForm.maker, null)
          this.$refs.verifier.getCurrent(this.personForm.verifier, null)
        })
        this.personForm.openDate = this.personForm.openDate ? moment(this.personForm.openDate) : null
      }
      this.initAccessControl()
    },
    initAccessControl () {
      if (this.personForm.accessControl) {
        this.accessControlList = this.personForm.accessControl.split(',').map(Number)
      }
    },
    initPage () {
      if (this.operation === 'read') {
        this.readOnly = true
      } else {
        this.readOnly = false
      }
      this.initFormFields()
      this.initFormData()
    },
    onDrawerClose () {
      this.$emit('closeDrawer', true)
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

  /deep/ .ant-radio-disabled + span {
    color: rgb(0, 0, 0);
    cursor: not-allowed;
  }

  /deep/ .ant-select-disabled .ant-select-selection {
    background: #ffffff;
    cursor: not-allowed;
  }

  /deep/ .ant-input-number-disabled .ant-input-number-input {
    cursor: not-allowed;
    background: white;
  }

</style>
