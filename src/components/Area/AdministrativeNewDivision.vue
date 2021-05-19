<template>
  <a-cascader
    :field-names="{ label: 'name', value: 'id', children: 'children' }"
    :options="options"
    :value="value"
    :show-search="{ filter }"
    :disabled="disabled"
    :allowClear="false"
    placeholder="请选择"
    style="color: #000000;background: #ffffff"
    :changeOnSelect="true"
    :getPopupContainer="triggerNode => triggerNode.parentNode"
    @focus="handleFocus"
    @change="onChange"
  />
</template>

<script>
import { getArea } from '@/api/employee'
export default {
  name: 'AdministrativeNewDivision',
  data () {
    return {
      value: [],
      area: [],
      options:[]
    }
  },
  props: {
    /*division:{
      type:Array,
      default:() => []
    },*/
    division:{
      type:Number
    },
    disabled:{
      type:Boolean,
      default:false
    }
  },
  model : {
    // prop:"division",
    event:"change"
  },
  methods: {
    triggerChange(changedValue) {
      this.$emit('change', changedValue);
    },
    filter(inputValue, path) {
      return path.some(option => option.name.indexOf(inputValue.toLowerCase()) > -1 || option.pinyin.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
    },
    getCurrent(value,option){
      if(value[value.length -1] === null){
        this.value = undefined
        this.options = []
      }else{
        this.value = value
        this.options = option
      }
    },
    onChange(value,option) {
      this.value = value
      let oldVal = { province:null,city:null,county:null }
      let newVal = { province:null,city:null,county:null }
      if(option !== undefined){
        for (let i = 0; i < option.length; i++) {
          if(option[i].level === 1){
            oldVal.province = option[i].divisionId
            newVal.province = option[i].id
          }else if(option[i].level === 2){
            oldVal.city = option[i].divisionId
            newVal.city = option[i].id
          }else if(option[i].level === 3){
            oldVal.county = option[i].divisionId
            newVal.county = option[i].id
          }
        }
      }
      this.$emit('setDivision',newVal,oldVal)
      this.triggerChange(value[value.length-1])
    },
    handleFocus(){
      const me = this
      if(this.options.length === 0 || this.options.length === 1){
        const me = this
        getArea().then(res => {
          if(res.code === 200) {
            me.options = res.body
          }
        })
      }
    },
  },
}
</script>

<style scoped>

</style>
