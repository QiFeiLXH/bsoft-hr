<template>
  <div :class="prefixCls">
    <div style="float: right">
      <slot name="extra">{{ extra }}</slot>
    </div>
    <slot name="content"/>
    <div style="float: left">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DrawFooterToolBar',
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-footer-toolbar'
    },
    extra: {
      type: [String, Object],
      default: ''
    }
  }
}
</script>

<style lang="less" scoped>

</style>
