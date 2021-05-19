<template>
  <a-card :bordered="false" :bodyStyle="{height:'2000px',padding: '10px 10px'}">
<!--    <a-input-search placeholder="请输入人员财务类别信息" style="width: 300px;margin-bottom: 10px" @search="onSearch" />-->


    <a-table :columns="columns"
             :dataSource="data"
             size="small"
             :rowKey="(record,index)=> record.id"
             :showPagination = 'false'
             :pagination = 'false'
             :scroll="{ x: false,y: listScrollHeight }"
             :bodyStyle="{ height: listScrollHeight + 'px' }">
      <template  slot="postType"  slot-scope="text, record" >
<!--        <a-input-->
<!--          v-if="record.editable"-->
<!--          :styleClass="record.error?'errorClass':'editBtnClass'"-->
<!--          style="margin: -5px 0"-->
<!--          size="small"-->
<!--          :value="text"-->
<!--          @change="e => handleInputChange(e.target.value, record.id)"-->
<!--        />-->
        <template >
          {{ text }}
        </template>
      </template>




      <template
        slot="costType"
        slot-scope="text, record"
      >
        <a-select :default-value="{key:record.costType?record.costType:'',label:text?text:''}" style="margin: -5px 0;width:200px" @change="handleCostTypeChange" v-if="record.editable" :labelInValue="true" size="small">
          <a-select-option v-for="d in costTypedata" :key="d.id">
            {{ d.name }}
          </a-select-option>
        </a-select>
        <template v-else>
          {{ text }}
        </template>
      </template>

      <template
        slot="financialType"
        slot-scope="text, record"
      >
        <a-select :default-value="{key:record.financialType?record.financialType:'',label:text?text:''}" style="margin: -5px 0;width:200px" @change="handleFinancialTypeChange" v-if="record.editable" :labelInValue="true" size="small">
          <a-select-option v-for="e in financialTypedata" :key="e.id">
            {{ e.name }}
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
            <a type="primary" @click="() => save(record,index)">保存</a>
            <a-popconfirm title="确定取消?" @confirm="() => cancel(index)">
              <a>取消</a>
            </a-popconfirm>
          </span>
          <span v-else>
             <a :disabled="editingKey !== ''" @click="() => edit(index)">编辑</a>
<!--             <a-popconfirm  :disabled="editingKey !== ''"  title="确定删除?" @confirm="() => remove(record,index)">-->
<!--              <a>删除</a>-->
<!--            </a-popconfirm>-->
<!--            <a :disabled="editingKey !== ''" @click="() => remove(index)">删除</a>-->
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
  import { getPostAndCostRuleList,getCostList,getFinanceList,updatePostAndCostRule,deletePostAndCostRule } from '@/api/postAndCostRule'
  const columns = [
    {
      title: '序号',
      width:'8%',
      dataIndex:'rowIndex',
      align: 'left',
      scopedSlots: { customRender: 'rowIndex' },
    },
    {
      title: '岗位大类',
      width:'20%',
      dataIndex: 'postName',
      scopedSlots: { customRender: 'postType' },
    },
    {
      title: '费用类别',
      width:'20%',
      dataIndex: 'costName',
      scopedSlots: { customRender: 'costType' },
    },
    {
      title: '财务类别',
      width:'20%',
      dataIndex: 'financialName',
      scopedSlots: { customRender: 'financialType' },
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
      STable,
    },
    name: 'PostAndCostRule',
    data() {
      return {
        data:[],
        costTypedata:[],
        financialTypedata:[],
        columns,
        listScrollHeight:0,
        editingKey: '',
        deleteParam:{'id':''},
        updateParam: {id: null, postType: null, costType: null,  financialType: null },
        personflag:0,
        deleteMsg: ''
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
     // this.loadPage();
    },
    methods:{
      loadPage(){
        this.loadListData();
        this.loadCostListData();
        this.loadFinanceListData();
        this.listScrollHeight = window.innerHeight - 260
      },

      loadListData(){
        getPostAndCostRuleList()
          .then(res => {
            if (res.code === 200) {
              this.data = res.body
            }
          })
      },

      loadCostListData(){
        getCostList()
          .then(res => {
            if (res.code === 200) {
              this.costTypedata = res.body;
            }
          })
      },

      loadFinanceListData(){
        getFinanceList()
          .then(res => {
            if (res.code === 200) {
              this.financialTypedata = res.body;
            }
          })
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
        if(record.postName == null){
          this.$notification.open({
            message: '提示',
            description:
              '岗位大类类别不能为空',
            icon: <a-icon type="smile" style="color: #108ee9" />,
        });
          return;
        }


        for(var i=0;i < newData.length;i++){
          if(record.id == newData[i].id && index != i){
            this.$notification.open({
              message: '提示',
              description:
                "已存在" + newData[i].postName + "的岗位大类类别",
              icon: <a-icon type="smile" style="color: #108ee9" />,
          });
            return;
          }
        }
        var data = { ...record }
        updatePostAndCostRule(data).then(
          res => {
            if (res.code === 200) {
              this.data = newData;
              this.editingKey = '';
              const target = newData[index];
              delete target.editable;
              // target.id = res.body.id;
              this.loadListData();
            }
          })

        this.$message.success('修改成功');

        // this.$notification.open({
        //   message: '提示',
        //   description:
        //     '修改成功。',
        //   duration: 2,
        // });

      },
      remove(record,index){
        const newData = [...this.data];
        const target = newData[index];
        if(target.id!=null){
          this.deleteParam.id = target.id;
          deletePostAndCostRule(this.deleteParam).then(
            res=>{
              if (res.code === 200) {
                this.deleteMsg = '删除成功!'
                this.loadListData()
                this.$notification.open({
                  message: '提示',
                  description: this.deleteMsg,
                  duration: 2,
                });
              }else {
                this.loadListData()
                this.deleteMsg = '该岗位大类在公共字典中已存在，无法删除！'
                this.$notification.open({
                  message: '提示',
                  description: this.deleteMsg,
                  duration: 2,
                });
              }
            }
          )
      }
        },
      cancel(index){
        const newData = [...this.data];
        const target = newData[index];
        // if(target.id != null){
        //   newData.splice(index,1);
        // }
        this.editingKey = '';
        if (target) {
          delete target.editable;
          this.data = newData;
        }
        this.loadListData()
      },

      handleInputChange (val, key) {
        const newData = [...this.data];
        const target = newData.filter(item => key === item.id)[0];
        if (target) {
          target.name = val;
          this.data = newData;
        }
        console.log(this.data)
      },

      handleCostTypeChange(value){
        var index = this.editingKey;
        const newData = [...this.data]
        const target = newData[index]
        if(target){
          target["costName"] = value.label;
          target["costType"] = value.key;
        }
      },
      handleFinancialTypeChange(value){
        var index = this.editingKey;
        const newData = [...this.data]
        const target = newData[index]
        if(target){
          target["financialName"] = value.label;
          target["financialType"] = value.key;
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
