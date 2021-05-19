<template>
  <a-popover v-model="visible" trigger="click">
    <template slot="content" >
      <div style="margin-bottom: 10px">
        <a-input allow-clear @change="onChange" v-model="searchValue"></a-input>
      </div>
      <div style="height: 300px;overflow-y: auto">
        <a-list size="small" :data-source="searchSource" :split="false">
          <a-list-item slot="renderItem" slot-scope="item, index">
            <li @click="select(item)">{{ item.name }}</li>
          </a-list-item>
        </a-list>
      </div>
    </template>
    <a-button
      icon="edit"
      type="link"
      size="small"
      @click="showClick"
    ></a-button>
  </a-popover>

</template>

<script>
    export default {
      name: "SearchSelect",
      data() {
        return {
          visible: false,
          searchValue: '',
          searchSource:[]
          //dataSource: [],
        };
      },
      props: {
        // 部门注销标志 ''为搜索全部 0为未注销 1已注销
        dataSource: {
          type: Array,
          default: []
        },
        record: {
          type: Object,
          default: {}
        }
      },

      methods: {
        onChange() {
          if(this.searchValue === ""){
            this.searchSource = this.dataSource
          }else {
            this.searchSource = this.dataSource.filter(item => {
              if(item.pinyin !== null){
                return item.name.indexOf(this.searchValue) > -1 || item.pinyin.indexOf(this.searchValue.toLowerCase())>-1
              }else{
                return item.name.indexOf(this.searchValue) > -1
              }
            })
          }

        },
        showClick () {
          this.searchValue = ""
          this.searchSource = this.dataSource
        },
        select (value) {
          this.visible = false
          this.$emit('setValue',value,this.record)
        }
      },
    }


</script>

<style lang="less" scoped>
  li:hover {
    cursor: pointer;
    color: #1890ff;
  }
</style>