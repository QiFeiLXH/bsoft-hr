<template>
  <a-card :bordered="false" :bodyStyle="{height:'2000px',padding: '10px 10px'}">
<!--    <a-input-search placeholder="请输入人员财务类别信息" style="width: 300px;margin-bottom: 10px" @search="onSearch" />-->

    <template>
      <div style="margin-bottom:10px">
        <a-radio-group v-model="value" @change="onRadioChange">
          <a-divider type="vertical" />
          <a-radio :value="null" >
            全部
          </a-radio>
          <a-divider type="vertical" />
          <a-radio :value="0">
            未注销
          </a-radio>
          <a-divider type="vertical" />
          <a-radio :value="1" >
            注销
          </a-radio>
        </a-radio-group>
        <a-divider type="vertical" />
        <a-button type="primary" style="margin-left:10px" @click="() => add()">
          <a-icon type="plus" />
          新增
        </a-button>
      </div>
    </template>

    <a-table :columns="columns"
             :dataSource="data"
             size="small"
             :rowKey="(record,index)=> record.id"
             :showPagination = 'false'
             :pagination = 'false'
             :scroll="{ x: false,y: listScrollHeight }"
             :bodyStyle="{ height: listScrollHeight + 'px' }">
      <template  slot="name"  slot-scope="text, record" >
        <a-input
          v-if="record.editable"
          :styleClass="record.error?'errorClass':'editBtnClass'"
          style="margin: -5px 0"
          size="small"
          :value="text"
          @change="e => handleInputChange(e.target.value, record.id)"
        />
        <template v-else>
          {{ text }}
        </template>
      </template>


      <template slot="personflag" slot-scope="text, record" >
        <a-radio-group  v-if="record.editable" :value="text" @change="e => handleInputTypeChange(e.target.value, record)">
          <a-radio :value="0">
            未注销
          </a-radio>
        </a-radio-group>
<!--        <template v-else  slot="personflag" slot-scope="text, record">-->

            <a-badge v-else :status="text | statusFilter" :text="text | statusTextFilter"/>
<!--         <span v-if="text === 0">未注销</span>-->
<!--         <span v-if="text === 1">注销</span>-->
<!--        </template>-->
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
            <a :disabled="editingKey !== ''" @click="() => edit(index)" v-if="record.personflag === 0 ? { color: 'rgba(0, 0, 0, 0.25)' } : null">编辑</a>
            <a-popconfirm  :disabled="editingKey !== ''"
                           v-if="record.personflag  === 0 ? { color: 'rgba(0, 0, 0, 0.25)' } : null"
                           title="确定注销?"
                           @confirm="() => logout(record,index)">
              <a  v-if="record.personflag  === 0 ? { color: 'rgba(0, 0, 0, 0.25)'  } : null">注销</a>
            </a-popconfirm>
<!--            <a :disabled="editingKey !== ''" @click="() => logout(record,index)">注销</a>-->
          </span>
        </div>
      </template>
    </a-table>
    <div>
<!--      <a style=""></a>-->
      <a-pagination :pageSize='pageSize' v-model="pageIndex" @change="pageChange" :total="total" show-less-items style="margin-left: 1600px"/>
    </div>
  </a-card>
</template>
<script>
  import FooterToolBar from '@/components/FooterToolbar'
  import {STable} from '@/components'
  import { queryList,savePersonType,logoutPersonType,updatePersonType } from '@/api/personType'
  const statusMap = {
    0: {status: 'success', text: '未注销'},
    1: {status: 'default', text: '已注销'}
  }
  const columns = [
    {
      title: '序号',
      width:'8%',
      dataIndex:'rowIndex',
      align: 'left',
      scopedSlots: { customRender: 'rowIndex' },
    },
    {
      title: '人员财务类别',
      width:'20%',
      dataIndex: 'name',
      scopedSlots: { customRender: 'name' },
    },
    {
      title: '登记日期',
      width:'20%',
      dataIndex: 'registerDate',
      scopedSlots: { customRender: 'registerDate' },
    },
    {
      title: '状态',
      width:'20%',
      dataIndex: 'personflag',
      scopedSlots: { customRender: 'personflag' },
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
    data() {
      return {
        data:[],
        typedata:[],
        columns,
        listScrollHeight:0,
        editingKey: '',
        queryParam: {'context': '','pageNo':1,'pageSize':25,'type':3012,'personflag':0},
        logoutParam:{'id':''},
        value: 0,
        addParam: {id: null, dept: null,  personId: null, workTimes: 0, type: 3012, remark: null },
        personflag:0,
        total:0,
        pageIndex:1,
        pageSize:25,
        customId: 0
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
      // this.loadTypeDic();
      this.listScrollHeight = window.innerHeight - 280
    },

    filters: {
      statusFilter(value) {
        return statusMap[value].status
      },
      statusTextFilter(value) {
        return statusMap[value].text
      }
    },
    methods:{
      onSearch(value){
        this.queryParam.context = value
        this.loadListData();
      },
      loadListData(){
        queryList(this.queryParam)
          .then(res => {
            if (res.code === 200) {
              this.data = res.body.items;
              this.total= res.body.totalCount;
            }
          })
      },

      pageChange(current){
        this.queryParam.pageNo=current;
        queryList(this.queryParam)
          .then(res => {
            if (res.code === 200) {
              this.data = res.body.items;
              this.total= res.body.totalCount;
            }
          })
      },

      onRadioChange(e) {
        const param = {
          "personflag":e.target.value,
          "type":3012,
          "pageNo":1,
          "pageSize":25
        }
        queryList(param)
          .then(res => {
            if (res.code === 200) {
              this.data = res.body.items;
              this.total= res.body.totalCount;
            }
          })
      },
      edit(index) {
        const newData = [...this.data];
        const target = newData[index];
        if (target.personflag  === 1) {
          return
        }
        if (target) {
          target.editable = true;
          this.data = newData;
        }
        this.editingKey = index;
      },
      save(record,index) {
        const newData = [...this.data];
        const target = newData[index];
        if(record.name == null){
          this.$message.info('人员财务类别不能为空');
        //   this.$notification.open({
        //     message: '提示',
        //     description:
        //       '人员财务类别不能为空',
        //     icon: <a-icon type="smile" style="color: #108ee9" />,
        // });
          return;
        }

        for(var i=0;i < newData.length;i++){
          if(record.id == newData[i].id && index != i){
            this.$notification.open({
              message: '提示',
              description:
                "已存在" + newData[i].name + "的人员财务类别",
              icon: <a-icon type="smile" style="color: #108ee9" />,
          });
            return;
          }
        }
        var data = { ...record }
          data.id = null
        if(target.id<0){
          savePersonType(data).then(
            res => {
              if (res.code === 200) {
                this.data = newData;
                this.editingKey = '';
                const target = newData[index];
                delete target.editable;
                // target.id = res.body.items.id;
                const param = {
                  "personflag":this.value,
                  "type":3012,
                  "pageNo":1,
                  "pageSize":25
                }
                queryList(param)
                  .then(res => {
                    if (res.code === 200) {
                      this.data = res.body.items;
                      this.total= res.body.totalCount;
                    }
                  })
              }
            })
        }
        else{
          updatePersonType(target).then(res=>{
            if(res.code==200){
              this.data = newData;
              this.editingKey = '';
              const target = newData[index];
              delete target.editable;
              target.id = res.body.id;
              const param = {
                "personflag":this.value,
                "type":3012,
                "pageNo":1,
                "pageSize":25
              }
              queryList(param)
                .then(res => {
                  if (res.code === 200) {
                    this.data = res.body.items;
                    this.total= res.body.totalCount;
                  }
                })
            }
          })
        }

        this.$message.success('保存成功');

        // this.$notification.open({
        //   message: '提示',
        //   description:
        //     '保存成功。',
        //   duration: 2,
        // });

      },

      logout(record,index){
        console.log(this.value)
        if (record.personflag  === 1) {
          return
        }
        const newData = [...this.data];
        const target = newData[index];
        if(target.id!=null&&target.personflag!=1){
          this.logoutParam.id = target.id;
          logoutPersonType(this.logoutParam).then(
            res=>{
              if (res.code === 200) {
                this.data = newData;
                const param = {
                  "personflag":this.value,
                  "type":3012,
                  "pageNo":1,
                  "pageSize":25
                }
                queryList(param)
                  .then(res => {
                    if (res.code === 200) {
                      this.data = res.body.items;
                      this.total= res.body.totalCount;
                    }
                  })

                this.$message.success('注销成功');
                // this.$notification.open({
                //   message: '提示',
                //   description:
                //     '注销成功。',
                //   duration: 2,
                // });
              }
            }
          )
        }else {
          this.$notification.open({
            message: '提示',
            description:
              '该角色已注销。',
            duration: 2,
          });
        }
      },
      cancel(index) {
        const newData = [...this.data];
        const target = newData[index];
        if(target.id < 0){
          newData.splice(index,1);
        }
        this.editingKey = '';
        if (target) {
          delete target.editable;
          this.data = newData;
        }
        this.loadListData()
      },
      add(){
        this.customId -= 1
        this.data.push(
          {
            editable:true,
            personflag: 0,
            id: this.customId
          }
        );

        this.editingKey = this.data.length - 1;
        // console.log this.data)

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
      handleInputTypeChange (val, key) {
        console.log(val, key)
        const newData = [...this.data];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
          target.personflag = val;
          this.data = newData;
        }
        console.log(this.data)
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
