<template>
  <a-select
    show-search
    :value="personId"
    :allowClear="allowClear"
    placeholder="工号、姓名、简拼检索"
    style="width: 200px;background: #ffffff"
    :default-active-first-option="false"
    :show-arrow="false"
    :filter-option="false"
    :not-found-content="searchIng ? undefined : null"
    :dropdownMatchSelectWidth="false"
    :dropdownStyle="{width: '300px'}"
    :getPopupContainer="triggerNode => triggerNode.parentNode"
    :disabled="disabled"
    option-label-prop="label"
    @search="handleSearch"
    @select="handleSelect"
  >
    <a-icon slot="clearIcon" type="close-circle" theme="filled" @click="handleClear" v-if="allowClear"/>
    <a-spin v-if="searchIng" slot="notFoundContent" size="small" />
    <a-select-option :label="item.personName" v-for="item in personSelectList" :key="item.personId">
      <a-row>
        <a-col :span="15">
          {{ item.deptName }}
        </a-col>
        <a-col :span="9">
          {{ item.personName }}
        </a-col>
      </a-row>
    </a-select-option>
  </a-select>
</template>
<script>
import { getPersonSelectList } from '@/api/common'

export default {
  name: 'PersonSelect',
  data () {
    return {
      searchIng: false,
      personSelectList: [],
      personId: undefined
    }
  },
  props: {
    registrant: {
      type: String,
      default: ''
    },
    disabled: {
      // 不可选状态
      type: Boolean,
      default: false
    },
    allowClear: {
      type: Boolean,
      default: false
    },
    isValid: {
      type: String,
      default: ''
    }
  },
  model: {
    prop: 'registrant',
    event: 'change'
  },
  methods: {
    triggerChange (changedValue) {
      this.$emit('change', changedValue)
    },
    /** 设置初始值 */
    getCurrent (personId, personName) {
      if (personId || personName) { // 工号姓名至少传一个
        const params = { personId: personId, personName: personName }
        getPersonSelectList(params).then(res => {
          if (res.code === 200) {
            if (res.body && res.body.length > 0) {
              this.personId = res.body[0].personId
              this.personSelectList = res.body
            } else {
              this.personId = undefined
              this.personSelectList = []
            }
            this.triggerChange(this.personId)
          } else {
            this.$message.error(res.msg)
          }
        })
      } else { // 工号姓名都不传
        this.personId = undefined
        this.personSelectList = []
      }
    },
    personSelectSearch (value) {
      if (value.length > 1) {
        this.searchIng = true
        const params = { inputContent: value, isValid: this.isValid }
        getPersonSelectList(params).then((res) => {
          if (res.code === 200) {
            if (res.body != null || res.body !== undefined) {
              this.personSelectList = res.body
            }
          } else {
            this.$message.error(res.msg)
          }
          this.searchIng = false
        }).catch((res) => {
          this.searchIng = false
        })
      }
    },
    handleSearch (value) {
      if (value) {
        this.personSelectSearch(value)
      } else {
        this.personId = undefined
        this.personSelectList = []
      }
    },
    handleSelect (value, option) {
      this.personId = value
      const record = this.personSelectList.find(item => item.personId === value)
      this.$emit('setPerson', record)
      this.triggerChange(value)
    },
    handleClear () {
      this.personId = undefined
      this.triggerChange()
    }
  }
}
</script>

<style scoped>
  /deep/ .ant-select-disabled .ant-select-selection {
    background: #ffffff;
    cursor: not-allowed;
  }
</style>
