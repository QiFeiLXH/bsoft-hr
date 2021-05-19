<template>
  <a-tree-select
    :allowClear="allowClear"
    :treeDefaultExpandAll="true"
    :treeData="deptList"
    :size="size"
    :placeholder="placeholder"
    @change="onChange"
    @search="onSearch"
    :filterTreeNode="filterTreeNode"
    :value ="value"
    searchPlaceholder="请输入拼音码或部门名称"
    :disabled = "disabled"
    :searchValue="searchValue"
    :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
    showSearch>
    <a-spin v-if="searchIng" slot="notFoundContent" size="small" />

  </a-tree-select>
</template>

<script>
import { getDeptSelectTreeWithPerson } from '@/api/common'
export default {
  name: 'DeptSelect',
  props: {
    // 部门注销标志 ''为搜索全部， 0为未注销， 1已注销， 2含注销且部门内有人员的
    logout: {
      type: String,
      default: '0'
    },
    all:{ //1 表示所有，0表示根据人员工号部门权限
      type: Number,
      default:0
    },
    size: {
      // 规格大小，default small large
      type: String,
      default: 'default'
    },
    dept: {
      type: String,
      default: ''
    },
    disabled:{
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    deptType: {
      type: String,
      default: ''
    },
    allowClear:{
      type: Boolean,
      default: true
    },
  },
  model: {
    prop:"dept",
    event:"change"
  },
  data () {
    return {
      searchIng:false,
      value: undefined,
      deptList: [],
      searchValue: undefined,
      filterTreeNode: (inputValue, treeNode) => {
        let simpleCode = treeNode.data.props.simpleCode
        if(simpleCode !== undefined){
          let deptName = treeNode.data.props.title
          if (deptName.indexOf(inputValue) > -1 || simpleCode.indexOf(inputValue.toUpperCase()) > -1) {
            return true
          }
        }
      }
    }
  },
  watch: {
    deptType(newValue, oldValue) {
      console.log('watch')
      this.loadDeptSelect()
    }
  },
  methods: {
    triggerChange(changedValue) {
      this.$emit('change', changedValue);
    },
    loadDeptSelect () {
      this.searchIng = true
      let param = {
        logout: this.logout,
        deptType: this.deptType,
        all:this.all
      }
      getDeptSelectTreeWithPerson(param).then((res) => {
        if (res.code === 200) {
          this.deptList = res.body
        } else {
          this.$message.error(res.msg)
        }
        this.searchIng = false
      }).catch((res) => {
        console.log(res)
      })
    },
    getCurrent (dept,deptText) {
      this.deptList = []
      this.deptList.push({value:dept,title:deptText})
      this.value = dept
    },
    onChange (e) {
      this.value = e
      this.triggerChange(e)
    },
    onSearch (e) {
      this.searchValue = e
      this.loadDeptSelect()
    },

  },

}
</script>

<style scoped>

</style>
