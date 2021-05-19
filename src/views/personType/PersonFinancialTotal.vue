<template>
  <div class="card-container">
    <a-tabs
      hideAdd
      size="small"
      type="card"
      v-model="activeKey"
      @change="onTabPaneChange"
    >
      <a-tab-pane key="personType" tab="人员财务类别维护">
        <person-type ref="personType"></person-type>
      </a-tab-pane>
      <a-tab-pane key="postCost"  tab="岗位与费用规则维护">
        <post-and-cost-rule ref="postCost"></post-and-cost-rule>
      </a-tab-pane>
      <a-tab-pane key="deptCost"  tab="部门财务维护">
        <dept-cost-maintain-view ref="deptCost"></dept-cost-maintain-view>
      </a-tab-pane>
      <a-tab-pane key="personFinancial"  tab="特殊部门人员财务类别维护">
      <person-financial-maintain-view ref="personFinancial" ></person-financial-maintain-view>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
  import { PersonType,PostAndCostRule,DeptCostMaintainView,PersonFinancialMaintainView } from '@/module'
  export default {
    name: "PersonFinancialTotal",
    components: {
      DeptCostMaintainView,
      PostAndCostRule,
      PersonFinancialMaintainView,
      PersonType,
    },
    data() {
      return {
        activeKey: 'personType'
      }
    },
    methods: {
      onTabPaneChange (activeKey) {
        if (activeKey === 'personType') {
          this.$nextTick(() =>{
            this.$refs.personType.onSearch()
          })
        }
        if (activeKey === 'postCost') {
          this.$nextTick(() =>{
            this.$refs.postCost.loadPage()
          })
        }
        if (activeKey === 'deptCost') {
          this.$nextTick(() =>{
            this.$refs.deptCost.initPage()
          })
        }
        if (activeKey === 'personFinancial') {
          this.$nextTick(() =>{
            this.$refs.personFinancial.initPage()
          })
        }
      }
    }
  }
</script>

<style scoped>
  .card-container {
    background: #ffffff;
    overflow: hidden;
  }
</style>