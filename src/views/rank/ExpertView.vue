<template>
   <a-card :bordered="false" :bodyStyle="{height:'2000px',padding: '10px 10px'}">
     <a-input-search placeholder="请输入姓名或者部门" style="width: 300px;margin-bottom: 10px" @search="onSearch" />
     <a-button type="primary" style="margin-left:10px" @click="() => add()">
       <a-icon type="plus" />
      新增
    </a-button> 
      <a-table :columns="columns" :dataSource="data" size="small" :rowKey="(record,index)=> index" :showPagination = 'false' :pagination = 'false' :scroll="{ y: listScrollHeight }">
      <template
      slot="name"
      slot-scope="text, record"
      >
        <v-personselect
          v-if="record.editable"
          :personName="text"
          ref="personselect"
          size="small"
          :styleClass="record.error?'errorClass':'editBtnClass'"
          @setPerson="handlePersonChange">
        </v-personselect>
        <template v-else>
          {{ text }}
        </template>
      </template>
      <template
        slot="dept"
        slot-scope="text, record"
        >
          <a-input
            v-if="record.editable"
            style="margin: -5px 0"
            size="small"
            :value="text" 
            :disabled="true"
          />
          <template v-else>
            {{ text }}
          </template>
      </template>
      <template
        slot="type"
        slot-scope="text, record"
        >
          <a-select :default-value="{key:record.type?record.type:'',label:text?text:''}" style="margin: -5px 0;width:200px" @change="handleTypeChange" v-if="record.editable" :labelInValue="true" size="small">
            <a-select-option v-for="d in typedata" :key="d.id">
              {{ d.name }}
            </a-select-option>
          </a-select>
          <template v-else>
            {{ text }}
          </template>
      </template>
      <template slot="rowIndex" slot-scope="text, record, index">
          {{index + 1}}
      </template>
      <template slot="operation" slot-scope="text, record, index">
        <div class="editable-row-operations">
          <span v-if="record.editable">
            <a @click="() => save(record,index)">保存</a>
            <a-popconfirm title="确定取消?" @confirm="() => cancel(index)">
              <a>取消</a>
            </a-popconfirm>
          </span>
          <span v-else>
            <a :disabled="editingKey !== ''" @click="() => edit(index)">编辑</a>
            <a :disabled="editingKey !== ''" @click="() => remove(index)">删除</a>
          </span>
        </div>
      </template>
    </a-table>
   </a-card>
</template>
<script>
import FooterToolBar from '@/components/FooterToolbar'
import {STable} from '@/components'
import {PersonSearchSelect} from '@/module'
import {getExperts, saveExpert,getExpertTypeDic,removeExpert} from '@/api/expert'
const columns = [
  {
    title: '',
    width:'8%',
    dataIndex:'rowIndex',
    align: 'left',
    scopedSlots: { customRender: 'rowIndex' },
  },
  {
    title: '专家姓名',
    width:'20%',
    dataIndex: 'expertName',
    scopedSlots: { customRender: 'name' },
  },
  {
    title: '所在部门',
    width:'20%',
    dataIndex: 'dept',
    scopedSlots: { customRender: 'dept' },
  },
  {
    title: '专家类型',
    width:'20%',
    dataIndex: 'typeText',
    scopedSlots: { customRender: 'type' },
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width:'10%',
    scopedSlots: { customRender: 'operation' },
  },
];
export default {
  components:{
    FooterToolBar,
    'v-personselect': PersonSearchSelect,
    STable,
  },
  data() {
    return {
      data:[],
      typedata:[],
      columns,
      listScrollHeight:0,
      editingKey: '',
      queryParam: {'context': ''},
      deleteParam:{'id':0},
    };
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name,
          },
        }),
      };
    },
    
  },

  mounted(){
    this.loadListData();
    this.loadTypeDic();
    this.listScrollHeight = window.innerHeight - 210
  },
  methods:{
    onSearch(value){
      this.queryParam.context = value
      this.loadListData();
    },
    loadListData(){
      getExperts(this.queryParam)
          .then(res => {
            if (res.code === 200) {
              this.data = res.body;
            }
          })
      },

    loadTypeDic(){
      getExpertTypeDic(Object.assign([], this.queryParam)).then(
        res => {
           if (res.code === 200) {
              this.typedata = res.body;
            }
        }
      )
    },
    edit(index) {
      const newData = [...this.data];
      const target = newData[index];
      if (target) {
        target.editable = true;
        this.data = newData;
      }
      this.editingKey = index;
    },
    save(record,index) {
      const newData = [...this.data];
      if(record.expertId == null){
          this.$notification.open({
            message: '提示',
            description:
              '专家名称不能为空',
            icon: <a-icon type="smile" style="color: #108ee9" />,
          });
          return;
      }
      if(record.type == null){
          this.$notification.open({
            message: '提示',
            description:
              '专家类型不能为空',
            icon: <a-icon type="smile" style="color: #108ee9" />,
          });
          return;
      }
      for(var i=0;i < newData.length;i++){
        if(record.expertId == newData[i].expertId && index != i){
          this.$notification.open({
            message: '提示',
            description:
              "已存在" + newData[i].expertName + "的专家",
            icon: <a-icon type="smile" style="color: #108ee9" />,
          });
          return;
        }
      }
      saveExpert(record).then(
        res => {
            if (res.code === 200) {
              this.data = newData;
              this.editingKey = '';
              const target = newData[index];
              delete target.editable;
              target.id = res.body.id;
            }
          })
      
    },
    remove(index){
      const newData = [...this.data];
      const target = newData[index];
      if(target.id){
        this.deleteParam.id = target.id;
        removeExpert(this.deleteParam).then(
          res=>{
            if (res.code === 200) {
              newData.splice(index,1);
              this.data = newData;
            }
          }
        )
      }
    },
    cancel(index) {
      const newData = [...this.data];
      const target = newData[index];
      if(target.id == null){
        newData.splice(index,1);
      }
      this.editingKey = '';
      if (target) {
        delete target.editable;
        this.data = newData;
      }
    },
    add(){
      this.data.push(
        {
          editable:true
        }
      );
      this.editingKey = this.data.length - 1;
    },
    handlePersonChange (data) {
      // this.memebersName = data.personName
      this.setPersonData(data)
    },

    handleTypeChange(value){
      var index = this.editingKey;
      const newData = [...this.data]
      const target = newData[index]
      if(target){
        target["typeText"] = value.label;
        target["type"] = value.key;
      }
    },
    setPersonData (value) {
      console.log(this.editingKey)
      var index = this.editingKey
      const newData = [...this.data]
      const target = newData[index]
      if (target) {
        target['dept'] = value.deptName
        target['expertId'] = value.personId
        target['expertName'] = value.personName
        this.data = newData
      }
    },
  },
};
</script>
<style>
components-table-demo-size h4 {
  margin-bottom: 16px;
}
.editable-row-operations a {
  margin-right: 8px;
}
</style>
