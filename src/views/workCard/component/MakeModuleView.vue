<template>
  <a-spin :spinning="isSpanning">
    <div :style="{height: viewHeight+'px',overflowY:'hidden'}">
      <a-card :bordered="false" :style="{height: formHeight+'px',overflowY:'auto'}">
        <viewer :images="personalPicture" ref="viewer">
          <a-form-model :model="personForm" :rules="personFormRules" ref="personForm">
            <a-card>
              <a-row>
                <a-col :md="20">
                  <a-row>
                    <a-col :md="13">
                      <a-form-model-item
                        label="工　　号"
                        :labelCol="{lg: {span: 6}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
                        style="margin-bottom: 10px;"
                        prop="personId">
                        <a-input :readOnly="true" v-model="personForm.personId" style="width: 230px;color: #000000"/>
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
                        label="部门编码"
                        :labelCol="{lg: {span: 6}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
                        style="margin-bottom: 10px;"
                        prop="deptId">
                        <a-input :readOnly="true" v-model="personForm.deptId" style="width: 230px;color: #000000"/>
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
                </a-col>
                <a-col :md="4">
                  <div style="text-align:center;">
                    <a-row>
                      <a-col v-if="personalPicture[0]">
                        <vue-hover-mask>
                          <a-spin :spinning="loading">
                            <img style="width: 100px;height: 140px;cursor: pointer;" :src="imageSrc"/>
                          </a-spin>
                          <template slot="action">
                            <a-icon type="eye" @click="handleImageEnlarge"></a-icon>
                            <a-icon type="download" @click="handleImageDownload" style="margin-left: 6px"></a-icon>
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
                        <a-switch :checked="personForm.workcardFlag === 1"></a-switch>
                      </a-form-model-item>
                    </a-col>
                    <a-col :md="11">
                      <a-form-model-item
                        label="卡种类"
                        :labelCol="{lg: {span: 7}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
                        style="margin-bottom: 10px;"
                        prop="cardType">
                        <a-input :readOnly="true" :value="personForm.cardType | cardTypeTextFilter" style="width: 230px;color: #000000" v-if="personForm.cardType">
                          <a-badge slot="prefix" :color="personForm.cardType | cardTypeFilter"/>
                        </a-input>
                        <a-input :readOnly="true" :value="personForm.cardType" style="width: 230px;color: #000000" v-else/>
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
                        <a-switch :checked="personForm.recharge === 1"></a-switch>
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
                          :disabled="true"
                          :min="0"
                          v-model="personForm.amount"
                          :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                          :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                          style="width: 230px;color: #000000"></a-input-number>
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
                    <a-col :md="13">
                      <a-form-model-item
                        label="工牌编号"
                        :labelCol="{lg: {span: 6}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
                        style="margin-bottom: 10px;"
                        prop="workCardNo">
                        <a-input v-model="personForm.workCardNo" style="width: 274px;color: #000000" :readOnly="readOnly"/>
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
                          ref="person"
                          :disabled="readOnly"
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
                        <a-date-picker v-model="personForm.makeDate" style="width: 230px;" :allowClear="false" :disabled="readOnly"/>
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
import { makeWorkCard, imageDownload } from '@/api/workCardMake'
import moment from 'moment'
import store from '@/store'
import { downFile } from '@/utils/util'
import { showImage } from "@/api/common";

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
  name: 'MakeModuleView',
  components: {
    AdministrativeNewDivision,
    PersonSelect,
    VueHoverMask
  },
  data () {
    return {
      moment,
      personForm: {},
      isSpanning: false,
      personalPicture: [],
      personImages: [],
      imageSrc: '',
      amount: null,
      loading: false,
      readOnly: false,
      personFormRules: {
        workCardNo: [{ required: true, message: '请填写工牌编号!', trigger: 'blur' }],
        maker: [{ required: true, message: '请选择工牌办理人!', trigger: 'change' }],
        makeDate: [{ required: true, message: '请选择工牌办理日期!', trigger: 'change' }]
      }
    }
  },
  props: {
    person: {
      type: Object,
      default: () => {}
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
    }
  },
  methods: {
    initFormFields () {
      this.personForm = {
        personId: null,
        personName: null,
        deptName: null,
        maker: null,
        makeDate: moment(),
        amount: null,
        recharge: null,
        workcardFlag: null,
        cardType: null,
        received: 0,
        workCardNo: null
      }
    },
    handleMake () {
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
      personForm.makeDate = personForm.makeDate.format('YYYY-MM-DD')
      personForm.status = 3
      this.isSpanning = true
      makeWorkCard(personForm).then(res => {
        if (res.code === 200) {
          this.$message.success('制作成功！')
          this.isSpanning = false
          this.$emit('refresh', true)
          this.onDrawerClose()
        }
        this.isSpanning = false
      })
    },
    handleImageEnlarge () {
      // 直接显示图片
      const viewer = this.$refs.viewer.$viewer
      viewer.show()
    },
    handleImageDownload () {
      this.loading = true
      var imageName = (this.personForm.personId + '&' + this.personForm.personName).toString()
      const param = { fileId: this.personForm.oneInchPhoto }
      imageDownload(param).then(res => {
        const headers = res.headers
        const contentType = headers['content-type']
        if (res.data) {
          const blob = new Blob([res.data], { type: contentType })
          const contentDisposition = res.headers['content-disposition']
          let fileName = 'unknown'
          if (contentDisposition) {
            var theWholeFileName = decodeURI(res.headers['content-disposition'].split('=')[1])
            const suffix = theWholeFileName.substr(theWholeFileName.lastIndexOf('.') + 1).toLowerCase()
            fileName = imageName + '.' + suffix
          }
          downFile(blob, fileName)
          this.loading = false
        }
        this.loading = false
      })
    },
    initFormData () {
      // this.personForm = { ...this.person }
      Object.assign(this.personForm, this.person)
      if (this.readOnly) {
        this.$nextTick(() => {
          this.$refs.person.getCurrent(this.personForm.maker, null)
        })
        this.personForm.makeDate = this.personForm.makeDate ? moment(this.personForm.makeDate) : null
      } else {
        this.$nextTick(() => {
          this.$refs.person.getCurrent(userInfo.personId, userInfo.personName)
        })
        this.personForm.makeDate = moment()
      }
      this.showPersonalImage()
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
    initPage () {
      this.initFormFields()
      if (this.operation === 'read') {
        this.readOnly = true
      } else {
        this.readOnly = false
      }
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
