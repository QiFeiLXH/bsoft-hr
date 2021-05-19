<template>
  <a-card :bordered="false" :body-style="{ padding: '0' }">
    <a-form-model :model="contractInfo" ref="LaborContractAuditForm" :rules="rules">
      <a-card title="基本信息" :body-style="{padding: '10px 0'}">
        <a-row>
          <a-col :md="8" >
            <a-form-model-item
              label="工　　号"
              :labelCol="{lg: {span: 9}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 15}, sm: {span: 20} }"
              :required="false"
              style="margin-bottom: 0;">
              <label>{{contractInfo.personId}}</label>
            </a-form-model-item>
          </a-col>
          <a-col :md="8">
            <a-form-model-item
              label="姓　　名"
              :labelCol="{lg: {span: 9}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 15}, sm: {span: 20} }"
              :required="false"
              style="margin-bottom: 0">
              <label>{{contractInfo.personName}}</label>
            </a-form-model-item>
          </a-col>
          <a-col :md="8">
            <a-form-model-item
              label="岗　　位"
              :labelCol="{lg: {span: 9}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 15}, sm: {span: 20} }"
              :required="false"
              style="margin-bottom: 0">
              <label>{{contractInfo.post}}</label>
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :md="8">
            <a-form-model-item
              label="部　　门"
              :labelCol="{lg: {span: 9}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 15}, sm: {span: 20} }"
              :required="false"
              style="margin-bottom: 0">
              <label>{{contractInfo.dept}}</label>
            </a-form-model-item>
          </a-col>
          <a-col :md="8">
            <a-form-model-item
              label="入职时间"
              :labelCol="{lg: {span: 9}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 15}, sm: {span: 20} }"
              :required="false"
              style="margin-bottom: 0">
              <label>{{contractInfo.inDate ? moment(contractInfo.inDate).format('YYYY年MM月DD日') : ''}}</label>
            </a-form-model-item>
          </a-col>
          <a-col :md="8">
            <a-form-model-item
              label="年度绩效"
              :labelCol="{lg: {span: 9}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 15}, sm: {span: 20} }"
              :required="false"
              style="margin-bottom: 0">
              <label>{{contractInfo.evaluationGrade}}</label>
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :md="8">
            <a-form-model-item
              label="岗位序列"
              :labelCol="{lg: {span: 9}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 15}, sm: {span: 20} }"
              :required="false"
              style="margin-bottom: 0">
              <label>{{contractInfo.sequence}}</label>
            </a-form-model-item>
          </a-col>
          <a-col :md="8">
            <a-form-model-item
              label="职级评定"
              :labelCol="{lg: {span: 9}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 15}, sm: {span: 20} }"
              :required="false"
              style="margin-bottom: 0">
              <label>{{contractInfo.specialRank}}</label>
            </a-form-model-item>
          </a-col>
          <a-col :md="8">
            <a-form-model-item
              label="到期时间"
              :labelCol="{lg: {span: 9}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 15}, sm: {span: 20} }"
              :required="false"
              style="margin-bottom: 0">
              <label>{{contractInfo.endDate ? moment(contractInfo.endDate).format('YYYY年MM月DD日') : ''}}</label>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-card>

      <a-card title="续签劳动合同" :bordered="false" :body-style="{padding: '10px 0'}">
        <a-row>
          <a-col :md="8">
            <a-form-model-item
              label="续签年限"
              :labelCol="{lg: {span: 9}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 15}, sm: {span: 20} }"
              :required="false"
              style="margin-bottom: 0">
              <a-input-number :min="0" :max="100" :disabled="formAuth.renewalDate.disabled == 'true'" v-model="contractInfo.renewalYear" @change="renewalYearChange"/>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="24">
            <a-form-model-item
              label="续签期限"
              :labelCol="{lg: {span: 3}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
              :required="false"
              style="margin-bottom: 0">
              <label>{{contractInfo.renewalStartDate ? moment(contractInfo.renewalStartDate).format('YYYY年MM月DD日') + ' ~ ' + moment(contractInfo.renewalEndDate).format('YYYY年MM月DD日') : ''  }}</label>
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-row v-show="formAuth.deptAudit.hidden == 'false'">
        <a-col :md="8">
          <a-form-model-item
            label="部门审核"
            :labelCol="{lg: {span: 9}, sm: {span: 2}}"
            :wrapperCol="{lg: {span: 15}, sm: {span: 20} }"
            :required="false"
            style="margin-bottom: 0">
            <a-radio-group v-model="contractInfo.deptAudit" :style="{width: '200px' }">
              <a-radio :value="1" :disabled="formAuth.deptAudit.disabled == 'true' && contractInfo.deptAudit != 1">同意</a-radio>
              <a-radio :value="2" :disabled="formAuth.deptAudit.disabled == 'true' && contractInfo.deptAudit != 2">不同意</a-radio>
            </a-radio-group>
          </a-form-model-item>
        </a-col>
        <a-col :md="8">
          <a-form-model-item
            label="审 核 人"
            :labelCol="{lg: {span: 9}, sm: {span: 2}}"
            :wrapperCol="{lg: {span: 15}, sm: {span: 20} }"
            :required="false"
            style="margin-bottom: 0">
            <label>{{contractInfo.deptAuditorName}}</label>
          </a-form-model-item>
        </a-col>
      </a-row>
        <a-row>
          <a-col :md="24">
            <a-form-model-item
              label="审核意见"
              :labelCol="{lg: {span: 3}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
              :required="false"
              style="margin-bottom: 0">
              <a-textarea v-model="contractInfo.deptOpinion" :rows="2" :readOnly="formAuth.deptAudit.disabled == 'true'" style="resize: none"/>
            </a-form-model-item>
          </a-col>
        </a-row>

        <div v-show="formAuth.areaAudit.hidden === 'false'">
          <a-row v-if="contractInfo.deptAudit == 1">
            <a-col :md="24">
              <a-form-model-item
                label="签订单位"
                :labelCol="{lg: {span: 3}, sm: {span: 2}}"
                :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
                prop="signUnit"
                style="margin-bottom: 0">
<!--                <a-select v-model="contractInfo.signUnit" showSearch :filter-option="filterCompanyOption" optionFilterProp="children" :disabled="formAuth.areaAudit.disabled == 'true'">-->
<!--                  <a-select-option v-for="item in companyList" :key="item.companyId" :detail="item">{{ item.abbreviation }}</a-select-option>-->
<!--                </a-select>-->
                <general-dic-select :storageKey="'LaborContractAuditForm_CompanyUseful_01'" :custom-list="companyList" :customLabel="'abbreviation'" :customKey="'companyId'" v-model="contractInfo.signUnit" :width="735"></general-dic-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row v-if="contractInfo.deptAudit == 1">
            <a-col :md="8">
              <a-form-model-item
                label="经 办 人"
                :labelCol="{lg: {span: 9}, sm: {span: 2}}"
                :wrapperCol="{lg: {span: 15}, sm: {span: 20} }"
                :required="false"
                style="margin-bottom: 0">
                <label>{{contractInfo.dealPersonName}}</label>
              </a-form-model-item>
            </a-col>
            <a-col :md="8">
              <a-form-model-item
                label="办理日期"
                :labelCol="{lg: {span: 9}, sm: {span: 2}}"
                :wrapperCol="{lg: {span: 15}, sm: {span: 20} }"
                :required="false"
                style="margin-bottom: 0">
                <label>{{contractInfo.dealDate ? moment(contractInfo.dealDate).format('YYYY年MM月DD日') : ''}}</label>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row v-if="contractInfo.deptAudit == 2">
            <a-col :md="24">
              <a-form-model-item
                label="离职申请单"
                :labelCol="{lg: {span: 3}, sm: {span: 2} }"
                :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
                prop="quitApplyId"
                style="margin: 0">
                <a-select v-model="contractInfo.quitApplyId" :disabled="formAuth.areaAudit.disabled == 'true'">
                  <a-select-option v-for="item in quitList" :key="item.id">{{ item.personName + " " + item.deptName + " " + item.quitDate}}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :md="24">
              <a-form-model-item
                label="备　　 注"
                :labelCol="{lg: {span: 3}, sm: {span: 2}}"
                :wrapperCol="{lg: {span: 30}, sm: {span: 20} }"
                :required="false"
                style="margin-bottom: 0">
                <a-textarea v-model="contractInfo.remark" :rows="2" :readOnly="formAuth.areaAudit.disabled == 'true'"  style="resize: none"/>
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>


        <div v-show="formAuth.hrAudit.hidden === 'false'">
          <a-row>
            <a-col :md="8">
              <a-form-model-item
                label="人事审核"
                :labelCol="{lg: {span: 9}, sm: {span: 2}}"
                :wrapperCol="{lg: {span: 15}, sm: {span: 20} }"
                :required="false"
                style="margin-bottom: 0">
                <label>{{contractInfo.hrAuditorName}}</label>
              </a-form-model-item>
            </a-col>
            <a-col :md="8">
              <a-form-model-item
                label="审核日期"
                :labelCol="{lg: {span: 9}, sm: {span: 2}}"
                :wrapperCol="{lg: {span: 15}, sm: {span: 20} }"
                :required="false"
                style="margin-bottom: 0">
                <label>{{contractInfo.hrAuditDate ? moment(contractInfo.hrAuditDate).format('YYYY年MM月DD日') : ''}}</label>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :md="24">
              <a-form-model-item
                label="审核意见"
                :labelCol="{lg: {span: 3}, sm: {span: 2}}"
                :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
                :required="false"
                style="margin-bottom: 0">
                <a-textarea v-model="contractInfo.hrOpinion" :rows="2" :readOnly="formAuth.hrAudit.disabled == 'true'" style="resize: none"/>
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>


      </a-card>
    </a-form-model>
  </a-card>
</template>

<script>
  import moment from "moment";
  import GeneralDicSelect from "../../../components/MemorySelect/GeneralDicSelect";
  import {getCompany,getQuitList} from '@/api/laborContractAudit'
  import MemoryDeptSelect from "../../../components/MemorySelect/MemoryDeptSelect";
    export default {
      name: "LaborContractAuditForm",
      components: {
        GeneralDicSelect
      },
      props: {
        contractInfo:{
          type: Object,
          default: {},
        },
        formAuth:{
          type: Object,
          default: {},
        },
        rules:{
          type: Object,
          default: {
            signUnit: [{ required: true, message: '请选择签订单位', trigger: 'blur' }],
            quitApplyId: [{ required: true, message: '请选择签订单位', trigger: 'blur' }],
          },
        },
      },
      mounted() {
        this.getCompany()
        this.getQuit()
      },
      data(){
        return{
          companyList:[],
          quitList:[]
        }
      },
      methods:{
        moment,
        DateTime (value) {
          const dateee = new Date(value).toJSON()
          const date = new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
          return date
        },
        renewalYearChange(val){
          const renewalDate = []
          const renewalStartDate = moment(this.contractInfo.endDate).add(1,"day")
          const renewalEndDate = moment(this.contractInfo.endDate).add(val,"year")
          renewalDate.push(renewalStartDate,renewalEndDate);
          this.contractInfo.renewalDate = renewalDate
          this.contractInfo.renewalStartDate = renewalStartDate.format('YYYY-MM-DD')
          this.contractInfo.renewalEndDate = renewalEndDate.format('YYYY-MM-DD')
        },
        getCompany() {
          getCompany({'type':2}).then(res=>{
            this.companyList = res.body
          })
        },
        getQuit(){
          getQuitList({
            personId:this.contractInfo.personId
          }).then(res=>{
            this.quitList = res.body
          })
        },
        filterCompanyOption(input, option) {
          return (
            option.data.attrs.detail.pinyinCode == null ?
              option.data.attrs.detail.companyName.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
              option.data.attrs.detail.abbreviation.indexOf(input) >= 0:
              option.data.attrs.detail.pinyinCode.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
              option.data.attrs.detail.companyName.indexOf(input) >= 0 ||
              option.data.attrs.detail.abbreviation.indexOf(input) >= 0
          );
        },
      }
    }
</script>

<style scoped>
  /deep/ .ant-input-number-disabled {
    color: rgba(0, 0, 0,0.65);
    background-color: #ffffff;
    cursor: not-allowed;
    opacity: 1;
  }
  /deep/ .ant-select-disabled .ant-select-selection {
    color: rgba(0, 0, 0,0.65);
    background-color: #ffffff;
    cursor: not-allowed;
  }
  /deep/.ant-radio-disabled + span {
    color: rgb(0, 0, 0);
    cursor: not-allowed;
  }

  /deep/ .ant-card-head-title {
    display: inline-block;
    -webkit-box-flex: 1;
    flex: 1;
    padding: 12px 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight: bold;
    font-size: 14px;
  }
</style>