<template>
  <a-select
    show-search
    :allowClear="true"
    :placeholder="placeholder"
    :size="size"
    @change="onChange"
    @select="onSelect"
    :filter-option="filterCompanyOption"
    :getPopupContainer="triggerNode => triggerNode.parentNode"
    optionFilterProp="children"
    :value="value"
    :disabled="disabled"
    :dropdownMatchSelectWidth="false"
    :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }">
    <a-spin v-if="searchIng" slot="notFoundContent" size="small" />
    <a-select-option :value="item.companyId" v-for="item in companyList" :detail="item" :key="item.companyId">
      <span style="text-align: left">{{ item.abbreviation }}</span>
    </a-select-option>
  </a-select>
</template>

<script>
import { getCompanyList } from '@/api/common'
export default {
  name: 'CompanySelect',
  props: {
    // 1 费用归属，2 社保缴纳地，3 人员归属公司
    type: {
      type: Number,
      default: 0
    },
    size: {
      // 规格大小，default small large
      type: String,
      default: 'default'
    },
    company: {
      type: Number,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  model: {
    prop: 'company',
    event: 'change'
  },
  data () {
    return {
      searchIng: false,
      value: undefined,
      companyList: []
    }
  },
  methods: {
    triggerChange (changedValue) {
      this.$emit('change', changedValue)
    },
    loadCompanySelect () {
      this.searchIng = true
      const param = {
        type: this.type
      }
      getCompanyList(param).then((res) => {
        if (res.code === 200) {
          this.companyList = res.body
        } else {
          this.$message.error(res.msg)
        }
        this.searchIng = false
      }).catch((res) => {
        console.log(res)
      })
    },
    getCurrent (company, companyText) {
      if (!this.companyList.length > 0) {
        this.companyList.push({ companyId: company, companyName: companyText })
      }
      this.value = company
    },
    onChange (e) {
      this.value = e
      this.triggerChange(e)
    },
    onSelect (value, option) {
      var company = this.companyList.find(item => item.companyId === value)
      this.$emit('setCompany', company)
      this.triggerChange(value)
    },
    filterCompanyOption (input, option) {
      return (
        option.data.attrs.detail.pinyinCode == null
          ? option.data.attrs.detail.companyName.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
          option.data.attrs.detail.abbreviation.indexOf(input) >= 0
          : option.data.attrs.detail.pinyinCode.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
          option.data.attrs.detail.companyName.indexOf(input) >= 0 ||
          option.data.attrs.detail.abbreviation.indexOf(input) >= 0
      )
    }

  },
  created () {
    this.loadCompanySelect()
  }
}
</script>

<style scoped>

</style>
