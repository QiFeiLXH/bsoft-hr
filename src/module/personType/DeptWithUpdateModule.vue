<template>
  <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-form-model-item label="财务类别">
      <a-select v-model="form.financialType" size="small">
          <a-select-option v-for="e in financialTypeData" :key="e.id" :value="e.id">
            {{ e.name }}
          </a-select-option>
        </a-select>
    </a-form-model-item>

    <a-form-model-item label="调整年月">
      <a-month-picker
        v-model="form.adjustDate"
        placeholder="选择日期"
        style="width: 100%;"
        @change="onDateChange"
        format="YYYY-MM"
        :disabled-date="disabledStartDate"
      />
    </a-form-model-item>

    <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="onSubmit"  >
        保存
      </a-button>
    </a-form-model-item>
  </a-form-model>
</template>
<script>
  import { getFinanceList } from '@/api/postAndCostRule'
  import { updateDeptCost,getDeptFinancialType} from '@/api/deptCostMaintain'
  import moment from 'moment/moment'
  const columns = [
    {
      title: '财务类别',
      width:'20%',
      dataIndex: 'financialName',
      scopedSlots: { customRender: 'financialType' },
    },
  ];
  export default {
    name: 'DeptWithUpdateModule',
    props: {
      deptId: {
        type: String,
        default: '',
      }
    },
    data() {
      return {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
        form: {
          id: null,
          name: '',
          financialType:'',
          region: undefined,
          delivery: false,
          type: 1,
          resource: '',
          desc: '',
          adjustDate: null,
          dept: null,
          postType: null
        },
        financialTypeData:[
          // {id:1, name:'111'},
          // {id:2, name:'222'},
          // {id:3, name:'444'},
        ],
      };
    },

    mounted(){
      // console.log(this.deptId)
      this.loadFinanceListData();
      // this.loadListDeptData();
    },
    watch: {
      deptId: function (val, oldVal) {
        this.loadListData(val);
      }
    },
    methods: {
      loadListData(deptId){
        const formData = {...this.form}
        formData.dept = deptId
        getDeptFinancialType({ dept: deptId })
          .then(res => {
            if (res.code === 200) {
              this.form = {...res.body};
              if(!res.body) {
                this.form = {
                  id: null,
                  name: '',
                  financialType:'',
                  region: undefined,
                  delivery: false,
                  type: 1,
                  resource: '',
                  desc: '',
                  adjustDate: moment(),
                  dept: null,
                  postType: null
                }
              }
              console.log(this.form)
              // this.form.adjustDate=moment().startOf('month')
            }
          })
      },

      onSubmit() {
        const formData = {...this.form}
        console.log(1,this.form)
        // formData.adjustDate = formData.adjustDate ? formData.adjustDate.format('YYYY-MM-DD').toString(): null
        formData.dept = this.deptId
        formData.type = 1
        formData.id = this.form.id
        // formData.financialName = this.form.financialName
        formData.financialType = this.form.financialType


        console.log(2,formData)
       // if(this.form.adjustDate===null){
       //    this.$message.info("调整年月不能为空'");
       //    return;
       //  }
        if(this.form.financialType===undefined||this.form.financialType===null||this.form.financialType===''){
          this.$message.info("财务类别不能为空");
          return;
        }
        updateDeptCost(formData).then(res=>{
          if (res.code === 200) {
            this.$message.success("保存成功");
            this.loadListData(this.deptId);
          }
          // this.loadListData();
        })

      },

      onDateChange(date, dateString) {
        console.log(date)
        console.log(dateString)
        if(dateString === '') {
          this.form.adjustDate = null
        } else {
          this.form.adjustDate = dateString + '-01'
          console.log(this.form.adjustDate)
        }
      },

      loadFinanceListData(){
        getFinanceList()
          .then(res => {
            if (res.code === 200) {
              this.financialTypeData = res.body;
            }
          })
      },
      disabledStartDate(current) {
        return current && current > moment();
      },
    },
  };
</script>
