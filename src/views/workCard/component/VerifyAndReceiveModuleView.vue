<template>
  <a-spin :spinning="isSpanning">
    <div :style="{height: viewHeight+'px',overflowY:'hidden'}">
      <a-card :bordered="false" :style="{height: formHeight+'px',overflowY:'auto'}">
        <viewer :images="personalPicture" ref="viewer">
          <a-form-model :model="personForm" :rules="getPersonFormRules" ref="personForm">
            <a-card>
              <a-row>
                <a-col :md="20">
                  <a-row>
                    <a-col :md="13">
                      <a-form-model-item
                        label="工　　号"
                        :labelCol="{lg: {span: 4}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
                        style="margin-bottom: 10px;"
                        prop="personId">
                        <a-input :readOnly="true" v-model="personForm.personId" style="width: 315px;color: #000000"/>
                      </a-form-model-item>
                    </a-col>
                    <a-col :md="11">
                      <a-form-model-item
                        label="姓　　名"
                        :labelCol="{lg: {span: 7}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
                        style="margin-bottom: 10px;"
                        prop="personName">
                        <a-input :readOnly="true" v-model="personForm.personName" style="width: 230px;color: #000000"/>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col :md="13">
                      <a-form-model-item
                        label="岗　　位"
                        :labelCol="{lg: {span: 4}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
                        style="margin-bottom: 10px;"
                        prop="restypeText">
                        <a-input :readOnly="true" v-model="personForm.restypeText" style="width: 315px;color: #000000"/>
                      </a-form-model-item>
                    </a-col>
                    <a-col :md="11">
                      <a-form-model-item
                        label="部　　门"
                        :labelCol="{lg: {span: 7}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
                        style="margin-bottom: 10px;"
                        prop="deptName">
                        <a-input :readOnly="true" v-model="personForm.deptName" style="width: 230px;color: #000000"/>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col :md="13">
                      <a-form-model-item
                        label="报道日期"
                        :labelCol="{lg: {span: 4}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
                        style="margin-bottom: 10px;"
                        prop="startDate">
                        <a-date-picker
                          :value="personForm.startDate ? moment(personForm.startDate) : null"
                          :disabled="true"
                          style="width: 315px"/>
                      </a-form-model-item>
                    </a-col>
                    <a-col :md="11">
                      <a-form-model-item
                        label="到职日期"
                        :labelCol="{lg: {span: 7}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
                        style="margin-bottom: 10px;"
                        prop="dutyDate">
                        <a-date-picker
                          :value="personForm.dutyDate ? moment(personForm.dutyDate) : null"
                          :disabled="true"
                          style="width: 230px"/>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col :md="13">
                      <a-form-model-item
                        label="员工类型"
                        :labelCol="{lg: {span: 4}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
                        style="margin-bottom: 10px;"
                        prop="personType">
                        <a-input
                          :readOnly="true"
                          :value="personForm.personType | personTypeTextFilter"
                          style="width: 315px;color: #000000"
                          v-if="personForm.personType >= 0"/>
                        <a-input
                          :readOnly="true"
                          :value="personForm.personType"
                          style="width: 315px;color: #000000"
                          v-else/>
                      </a-form-model-item>
                    </a-col>
                    <a-col :md="11">
                      <a-form-model-item
                        label="人员归属群"
                        :labelCol="{lg: {span: 7}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
                        style="margin-bottom: 10px;"
                        prop="personnelGroupText">
                        <a-input
                          :readOnly="true"
                          v-model="personForm.personnelGroupText"
                          style="width: 230px;color: #000000"/>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col :md="13">
                      <a-form-model-item
                        label="本 地 化"
                        :labelCol="{lg: {span: 4}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
                        prop="localFlag">
                        <a-radio-group :disabled="true" name="placeGroup" :value="personForm.localFlag">
                          <a-radio :value="0">
                            非本地
                          </a-radio>
                          <a-radio :value="1">
                            县级市
                          </a-radio>
                          <a-radio :value="3">
                            地级市
                          </a-radio>
                          <a-radio :value="2">
                            省级
                          </a-radio>
                        </a-radio-group>
                      </a-form-model-item>
                    </a-col>
                    <a-col :md="11">
                      <a-form-model-item
                        label="驻地省市县"
                        :labelCol="{lg: {span: 7}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
                        prop="divisionCounty">
                        <administrative-new-division
                          ref="divisionCounty"
                          :disabled="true"
                          v-model="personForm.divisionCounty"
                          style="width: 230px;"></administrative-new-division>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                </a-col>
                <a-col :md="4">
                  <div style="text-align:center;" v-if="operation === 'verify'">
                    <vue-hover-mask>
                      <a-row>
                        <a-spin :spinning="uploading">
                          <a-col v-if="personalPicture[0]">
                            <img style="width: 100px;height: 140px;cursor: pointer;" :src="imageSrc"/>
                          </a-col>
                          <a-col v-else>
                            <a-avatar style="float: right" shape="square" :size="150" icon="user"/>
                          </a-col>
                        </a-spin>
                      </a-row>
                      <template slot="action">
                        <a-icon type="eye" @click="handleImageEnlarge" v-if="personForm.oneInchPhoto"></a-icon>
                        <a-upload
                          :customRequest="handleUpload"
                          :showUploadList="false"
                          :fileList="fileList"
                          :remove="handleRemove"
                          :beforeUpload="beforeUpload">
                          <a-icon type="edit" style="margin-left: 6px;color:white;font-size: 18px"></a-icon>
                        </a-upload>
                      </template>
                    </vue-hover-mask>
                  </div>
                  <div style="text-align:center;" v-else>
                    <a-row>
                      <a-col v-if="personalPicture[0]">
                        <vue-hover-mask>
                          <a-spin :spinning="uploading">
                            <img style="width: 100px;height: 140px;cursor: pointer;" :src="imageSrc"/>
                          </a-spin>
                          <template slot="action">
                            <a-icon type="eye" @click="handleImageEnlarge"></a-icon>
                          </template>
                        </vue-hover-mask>
                      </a-col>
                      <a-col v-else>
                        <a-avatar style="float: right" shape="square" :size="150" icon="user"/>
                      </a-col>
                    </a-row>
                  </div>
                </a-col>
              </a-row>
            </a-card>
            <a-card>
              <a-row>
                <a-col :md="20">
                  <a-row>
                    <a-col :md="13">
                      <a-form-model-item
                        label="办理总部工牌"
                        :labelCol="{lg: {span: 6}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
                        style="margin-bottom: 10px;"
                        prop="workcardFlag">
                        <a-switch
                          :checked="personForm.workcardFlag === 1"
                          @change="handleWorkCardFlagChange"></a-switch>
                      </a-form-model-item>
                    </a-col>
                    <a-col :md="11">
                      <a-form-model-item
                        label="卡 种 类"
                        :labelCol="{lg: {span: 7}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
                        style="margin-bottom: 10px;"
                        prop="cardType">
                        <a-select style="width: 230px" :value="personForm.cardType" v-if="personForm.cardType && this.personForm.workcardFlag === 1" @change="handleCardTypeChange" :disabled="readOnly">
                          <a-select-option :value="1">
                            <a-badge :color="1 | cardTypeFilter" :text="1 | cardTypeTextFilter"/>
                          </a-select-option>
                          <a-select-option :value="2">
                            <a-badge :color="2 | cardTypeFilter" :text="2 | cardTypeTextFilter"/>
                          </a-select-option>
                          <a-select-option :value="3">
                            <a-badge :color="3 | cardTypeFilter" :text="3 | cardTypeTextFilter"/>
                          </a-select-option>
                        </a-select>
                        <a-input
                          :readOnly="true"
                          :value="null"
                          style="width: 230px;color: #000000"
                          v-else/>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col :md="13">
                      <a-form-model-item
                        label="餐补充入工牌"
                        :labelCol="{lg: {span: 6}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
                        style="margin-bottom: 10px;"
                        prop="recharge">
                        <a-switch :checked="personForm.recharge === 1" v-if="disabled || readOnly"></a-switch>
                        <a-switch :checked="personForm.recharge === 1" @change="handleRechargeChange" v-else></a-switch>
                      </a-form-model-item>
                    </a-col>
                    <a-col :md="11">
                      <a-form-model-item
                        label="充值金额"
                        :labelCol="{lg: {span: 7}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
                        style="margin-bottom: 10px;"
                        prop="amount">
                        <a-input-number
                          :disabled="disabled || readOnly"
                          :min="0"
                          v-model="personForm.amount"
                          :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                          :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                          style="width: 230px;color: #000000"
                          v-if="personForm.recharge === 1 && personForm.workcardFlag === 1"></a-input-number>
                        <a-input-number
                          :readOnly="true"
                          :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                          :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                          :value="null"
                          style="width: 230px;color: #000000"
                          v-else/>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                </a-col>
                <a-col :md="4">
                </a-col>
              </a-row>
            </a-card>
            <a-card>
              <a-row>
                <a-col :md="20">
                  <a-row>
                    <a-col>
                      <a-form-model-item
                        label="门禁权限"
                        :labelCol="{lg: {span: 3}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
                        style="margin-bottom: 10px;"
                        prop="accessControlList">
                        <a-card style="width: 660px;">
                          <a-checkbox-group :value="accessControlList" @change="onPermissionChange">
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
                                <a-checkbox :value="16" >16F</a-checkbox>
                              </div>
                            </a-row>
                          </a-checkbox-group>
                        </a-card>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                </a-col>
                <a-col :md="4"></a-col>
              </a-row>
            </a-card>
            <a-card>
              <a-row>
                <a-col :md="20">
                  <a-row v-if="readOnly">
                    <a-col :md="13">
                      <a-form-model-item
                        label="工牌编号"
                        :labelCol="{lg: {span: 6}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
                        style="margin-bottom: 10px;"
                        prop="workCardNo">
                        <a-input
                          :readOnly="true"
                          v-model="personForm.workCardNo"
                          style="width: 274px;color: #000000"/>
                      </a-form-model-item>
                    </a-col>
                    <a-col :md="11">
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col :md="13">
                      <a-form-model-item
                        label="信息核实人"
                        :labelCol="{lg: {span: 6}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
                        style="margin-bottom: 10px;"
                        prop="verifier">
                        <person-select
                          ref="verifier"
                          :disabled="readOnly"
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
                          v-model="personForm.verifyDate"
                          style="width: 230px;"
                          :allowClear="false"
                          :disabled="readOnly"/>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row v-if="readOnly">
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
                        label="办理日期"
                        :labelCol="{lg: {span: 7}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
                        style="margin-bottom: 10px;"
                        prop="makeDate">
                        <a-date-picker v-model="personForm.makeDate" style="width: 230px;" :allowClear="false" :disabled="true"/>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row v-if="readOnly">
                    <a-col :md="13">
                      <a-form-model-item
                        label="门禁办理人"
                        :labelCol="{lg: {span: 6}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
                        style="margin-bottom: 10px;"
                        prop="opener">
                        <person-select
                          :disabled="true"
                          ref="opener"
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
                          style="width: 230px;"
                          :allowClear="false"
                          :disabled="true"/>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                </a-col>
                <a-col :md="4"></a-col>
              </a-row>
            </a-card>
          </a-form-model>
        </viewer>
      </a-card>
    </div>
  </a-spin>
</template>

<script>
import { AdministrativeNewDivision, VueHoverMask } from '@/components'
import { PersonSelect } from '@/module'
import {
  getWorkCardAmount,
  rewriteImage,
  uploadImage,
  verifyWorkCard,
  receiveWorkCard
} from '@/api/workCardVerifyAndReceive'
import moment from 'moment'
import store from '@/store'
import {showImage} from "@/api/common";

const userInfo = store.getters.userInfo

const cardTypeMap = {
  1: {
    color: 'blue',
    text: '蓝色卡'
  },
  2: {
    color: 'yellow',
    text: '黄色卡'
  },
  3: {
    color: 'gold',
    text: '金色卡'
  }
}
const personTypeMap = {
  0: {
    text: '普通'
  },
  1: {
    text: '实习'
  },
  2: {
    text: '中层'
  },
  3: {
    text: '领导'
  },
  4: {
    text: '顾问'
  }
}
export default {
  name: 'VerifyAndReceiveModuleView',
  components: {
    AdministrativeNewDivision,
    PersonSelect,
    VueHoverMask
  },
  data () {
    var validateAccess = (rule, value, callback) => {
      if (this.accessControlList.length === 0) {
        return callback(new Error('请选择门禁权限范围！'))
      } else {
        callback()
      }
    }
    return {
      moment,
      personForm: {},
      isSpanning: false,
      personalPicture: [],
      personImages: [],
      readOnly: false,
      disabled: false,
      accessControlList: [],
      initAccessControlList: [],
      fileList: [],
      uploading: false,
      imageDic: ['jpg', 'jpeg', 'png', 'bmp'],
      imageSrc: '',
      accessControlRule: [{ required: true, validator: validateAccess }],
      amountRule: [{ required: true, message: '请填写充值金额！' }],
      cardTypeRule: [{ required: true, message: '请选择卡种类！', trigger: 'change' }]
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
  filters: {
    personTypeTextFilter (type) {
      return personTypeMap[type].text
    },
    cardTypeTextFilter (type) {
      return cardTypeMap[type].text
    },
    cardTypeFilter (type) {
      return cardTypeMap[type].color
    }
  },
  computed: {
    viewHeight: function () {
      return window.innerHeight - 100
    },
    formHeight: function () {
      return window.innerHeight - 110
    },
    getPersonFormRules: function () {
      var personFormRules = {}
      if (this.operation === 'verify') {
        personFormRules = {
          verifier: [{ required: true, message: '请选择信息核实人!', trigger: 'change' }],
          verifyDate: [{ required: true, message: '请选择核实日期!', trigger: 'change' }]
        }
        if (this.personForm.workcardFlag === 1) {
          personFormRules.accessControlList = this.accessControlRule
          personFormRules.cardType = this.cardTypeRule
          if (this.personForm.recharge === 1) {
            personFormRules.amount = this.amountRule
          } else {
            delete personFormRules.amount
          }
        } else {
          delete personFormRules.accessControlList
          delete personFormRules.amount
          delete personFormRules.cardType
        }
      } else {
        personFormRules = {}
      }
      return personFormRules
    }
  },
  methods: {
    initFormFields () {
      this.personForm = {
        personId: null,
        personName: null,
        deptName: null,
        restypeText: null,
        startDate: null,
        dutyDate: null,
        personType: null,
        personnelGroupText: null,
        verifier: null,
        verifyDate: moment(),
        maker: null,
        makeDate: null,
        amount: null,
        recharge: null,
        workcardFlag: null,
        cardType: null,
        divisionCounty: null,
        localFlag: null,
        accessControl: null,
        received: 0,
        workCardNo: null
      }
    },
    handleVerify () {
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
      personForm.verifyDate = personForm.verifyDate.format('YYYY-MM-DD')
      personForm.amount = this.personForm.workcardFlag === 1 && this.personForm.recharge === 1 ? this.personForm.amount : null
      personForm.accessControl = this.accessControlList.length > 0 ? this.accessControlList.sort(function (a, b) { return a - b }).join(',') : null
      // 判断是否办理总部工牌
      // 是，则将状态改为待制作   否， 则改为已完成，已领取
      if (personForm.workcardFlag === 1) {
        personForm.status = 2
        personForm.received = 0
      } else {
        personForm.status = 4
        personForm.received = 1
        personForm.cardType = null
      }
      this.isSpanning = true
      verifyWorkCard(personForm).then(res => {
        if (res.code === 200) {
          this.$message.success('核实成功！')
          this.isSpanning = false
          this.$emit('refresh', true)
          this.onDrawerClose()
        }
        this.isSpanning = false
      })
    },
    handleReceive () {
      this.isSpanning = true
      var param = { personId: this.personForm.personId }
      receiveWorkCard(param).then(res => {
        if (res.code === 200) {
          this.$message.success('领取成功！')
          this.isSpanning = false
          this.$emit('refresh', true)
          this.onDrawerClose()
        }
        this.isSpanning = false
      })
    },
    handleCardTypeChange (val) {
      this.personForm.cardType = val
    },
    beforeUpload (file) {
      const isLt5M = file.size / 1024 / 1024 < 5
      const suffix = file.name.substr(file.name.lastIndexOf('.') + 1).toLowerCase()
      const match = this.imageDic.includes(suffix)
      if (!isLt5M) {
        this.$message.error('单个文件不超过5M!')
        return false
      } else if (!match) {
        this.$message.error('文件格式不对!')
        return false
      } else {
        this.fileList = [file]
        return true
      }
    },
    handleUpload () {
      if (this.personForm.oneInchPhoto) {
        this.handleRewriteImage()
      } else {
        this.handleUploadImage()
      }
    },
    handleRewriteImage () {
      this.uploading = true
      const { fileList } = this
      const formData = new FormData()
      fileList.forEach(file => {
        formData.append('file', file)
      })
      formData.append('fileId', this.personForm.oneInchPhoto) // 图片id
      const me = this
      rewriteImage(formData).then(res => {
        if (res.code === 200) {
          this.$message.success('图片修改成功！')
          this.imageSrc = showImage(this.personForm.oneInchPhoto, moment().millisecond())
        }
        me.uploading = false
      })
    },
    handleUploadImage () {
      this.uploading = true
      const { fileList } = this
      const formData = new FormData()
      fileList.forEach(file => {
        formData.append('file', file)
      })
      formData.append('recruitmentId', this.personForm.recruitmentId) // 菜单id
      const me = this
      uploadImage(formData).then(res => {
        if (res.code === 200) {
          this.$message.success('图片上传成功！')
          this.$emit('refresh', true)
          this.personForm.oneInchPhoto = res.body
          this.showPersonalImage()
        }
        me.uploading = false
      })
    },
    handleRemove (file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    handleImageEnlarge () {
      // 直接显示图片
      const viewer = this.$refs.viewer.$viewer
      viewer.show()
    },
    handleWorkCardFlagChange (checked) {
      if (this.readOnly) {
        return
      }
      this.personForm.workcardFlag = checked ? 1 : 0
      if (checked) {
        this.disabled = false
        this.accessControlList = [...this.initAccessControlList]
      } else {
        this.disabled = true
        this.accessControlList = []
        this.personForm.recharge = 0
      }
    },
    handleRechargeChange (checked) {
      this.personForm.recharge = checked ? 1 : 0
    },
    onPermissionChange (checked) {
      if (this.readOnly || this.disabled) {
        return
      }
      this.accessControlList = checked
    },
    getAmount () {
      const param = { personType: this.personForm.personType, startDate: moment(this.personForm.startDate).format('YYYY-MM-DD') }
      getWorkCardAmount(param).then(res => {
        if (res.code === 200) {
          this.amount = Number(res.body).toFixed(1)
        }
      })
    },
    initFormData () {
      // this.personForm = { ...this.person }
      Object.assign(this.personForm, this.person)
      if (this.operation === 'verify') {
        this.personForm.verifyDate = moment()
        this.$nextTick(() => {
          this.$refs.verifier.getCurrent(userInfo.personId, userInfo.personName)
        })
      } else {
        this.personForm.verifyDate = this.personForm.verifyDate ? moment(this.personForm.verifyDate) : null
        this.personForm.makeDate = this.personForm.makeDate ? moment(this.personForm.makeDate) : null
        this.personForm.openDate = this.personForm.openDate ? moment(this.personForm.openDate) : null
        this.$nextTick(() => {
          this.$refs.verifier.getCurrent(this.personForm.verifier, null)
          this.$refs.maker.getCurrent(this.personForm.maker, null)
          this.$refs.opener.getCurrent(this.personForm.opener, null)
        })
      }
      this.initFormDivisionData()
      this.showPersonalImage()
      this.initAccessControl()
    },
    initAccessControl () {
      if (this.operation === 'verify') {
        this.initAccessControlList = []
        for (var i = 4; i < 14; i++) {
          this.initAccessControlList.push(i)
        }
        if (this.personForm.deptId === '0609') {
          this.initAccessControlList.push(16)
        }
        if (this.personForm.workcardFlag === 1) {
          this.accessControlList = [...this.initAccessControlList]
          this.disabled = false
        } else {
          this.personForm.recharge = 0
          this.accessControlList = []
          this.disabled = true
        }
      } else {
        if (this.personForm.accessControl) {
          this.accessControlList = this.personForm.accessControl.split(',').map(Number)
        }
      }
    },
    showPersonalImage () {
      this.personImages = []
      this.personalPicture = []
      if (this.personForm.oneInchPhoto) {
        this.imageSrc = showImage(this.personForm.oneInchPhoto, moment().millisecond())
        this.personImages.push({ key: 0, src: this.imageSrc })
        this.personalPicture.push(this.personImages[0].src)
      }
    },
    initFormDivisionData () {
      if (this.personForm.divisionProvince) {
        this.personForm.divisionProvince = Number(this.personForm.divisionProvince)
      }
      if (this.personForm.divisionCity) {
        this.personForm.divisionCity = Number(this.personForm.divisionCity)
      }
      if (this.personForm.divisionCounty) {
        this.personForm.divisionCounty = Number(this.personForm.divisionCounty)
      }
      const divisions = [this.personForm.divisionProvince, this.personForm.divisionCity, this.personForm.divisionCounty].filter(Boolean)
      const divisionOption = [{
        name: this.personForm.divisionProvinceText,
        id: this.personForm.divisionProvince
      }]
      if (this.personForm.divisionCity === null) {
        divisionOption[0].children = [{
          name: this.personForm.divisionCountyText,
          id: this.personForm.divisionCounty
        }]
      } else {
        divisionOption[0].children = [{
          name: this.personForm.divisionCityText,
          id: this.personForm.divisionCity,
          children: [{
            name: this.personForm.divisionCountyText,
            id: this.personForm.divisionCounty
          }]
        }]
      }
      this.$nextTick(() => {
        this.$refs.divisionCounty.getCurrent(divisions, divisionOption)
      })
    },
    initPage () {
      if (this.operation === 'verify') {
        this.readOnly = false
      } else {
        this.readOnly = true
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
