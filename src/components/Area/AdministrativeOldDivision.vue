<template>
  <a-cascader
    :field-names="{ label: 'name', value: 'code', children: 'children' }"
    :options="options"
    :value="value"
    :show-search="{ filter }"
    :disabled="disabled"
    placeholder="请选择"
    :getPopupContainer="triggerNode => triggerNode.parentNode"
    @focus="handleFocus"
    @change="onChange"
  />
</template>

<script>
import {  getOldArea ,getOneOldArea} from '@/api/employee'
export default {
  name: 'AdministrativeOldDivision',
  data () {
    return {
      value: [],
      area: [],
      options:[]
    }
  },
  props: {
    division:{
      type:Number
    },
    disabled:{
      type:Boolean,
      default:false
    }
  },
  model : {
    prop:"division",
    event:"change"
  },
  methods: {
    triggerChange(changedValue) {
      this.$emit('change', changedValue);
    },
    getCurrent (value,option) {
      if(value[2] === null){
        this.value = undefined
        this.options = []
      }else{
        this.value = value
        this.options = option
      }
    },
    filter(inputValue, path) {
      return path.some(option => option.name.indexOf(inputValue.toLowerCase()) > -1 || option.zipCode.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
    },
    onChange(value,option) {
      this.value = value
      this.triggerChange(value[2])
    },
    handleFocus(){
      const me = this
      if(this.options.length === 0 || this.options.length === 1){
        getOldArea().then(res => {
          if(res.code === 200){
            me.options = res.body
            me.getAllArea(res.body)
          }
        })
      }
    },
    getAllArea (arr) {
      arr.forEach(item => {
        this.area.push(item)
        if (item.children) {
          this.getAllArea(item.children)
        }
      })
    },
  },
}
</script>

<style scoped>

</style>
