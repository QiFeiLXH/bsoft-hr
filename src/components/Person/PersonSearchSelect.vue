<template>
  <a-select
    show-search
    :value="personId"
    placeholder="姓名、简拼检索"
    style="width: 200px"
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
    <a-spin v-if="searchIng" slot="notFoundContent" size="small" />
    <a-select-option :label="item.personName" v-for="item in personSelectList" :key="item.personId">
      <a-row>
        <a-col :span="15">
          {{ item.deptName}}
        </a-col>
        <a-col :span="9">
          {{ item.personName}}
        </a-col>
      </a-row>
    </a-select-option>
  </a-select>
</template>
<script>
  import { findPersonSelectList, getCurrentPerson} from '@/api/common'

  export default {
    name: 'PersonSearchSelect',
    data() {
      return {
        searchIng: false,
        personSelectList: [],
        personId: undefined,
      };
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
      }
    },
    model : {
      prop:"registrant",
      event:"change"
    },
    methods: {
      triggerChange(changedValue) {
        this.$emit('change', changedValue);
      },
      getCurrent (personId,personName) {
        if(personId === null){
          getCurrentPerson().then((res) => {
            if (res.code === 200) {
              this.personSelectList = []
              this.personId = res.body.personId
              this.triggerChange(res.body.personId)
              this.$emit('setPerson', res.body)
              this.personSelectList = [res.body]
            } else {
              this.$message.error(res.msg)
            }
          }).catch((res) => {
          })
        }else{
          this.personId = personId
          this.personSelectList = [{personId:personId,personName:personName}]
        }
      },
      personSelectSearch (value) {
        if(value.length > 1){
          this.searchIng = true
          let params = { simpleCode: value }
          findPersonSelectList(params).then((res) => {
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
      handleSearch(value) {
        if(value === '' || value === null){
          this.personId = undefined
          this.personSelectList = []
        }else{
          this.personSelectSearch(value)
        }
      },

      clearPerson(){//用于清空人员选择框
        this.personId = undefined
        this.personSelectList = []
      },

      handleSelect(value, option){
        this.open = false
        this.personId = value
        let record = this.personSelectList.find(item => item.personId === value)
        this.$emit('setPerson', record)
        this.triggerChange(value)
      },

      handleClear () {
       /* this.record.userId = null
        this.record.isChanged = true*/
        this.triggerChange(null)
      },

    },
  };
</script>