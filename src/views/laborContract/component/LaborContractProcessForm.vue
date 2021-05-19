<template>
  <a-card :bordered="false" :body-style="{ padding: '0'}">
    <a-form-model :model="contractInfo" ref="LaborContractProcessForm">
      <a-card title="基本信息" :bordered="true" :body-style="{padding: '10px 0'}">
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

      <a-card title="劳动合同" :body-style="{padding: '10px 0'}" :bordered="false">
        <a-row>
          <a-col :md="24">
            <a-form-model-item
              label="续签年限"
              :labelCol="{lg: {span: 3}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
              :required="false"
              style="margin-bottom: 0">
              <label>{{contractInfo.renewalYear}}</label>
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
              <label>{{contractInfo.renewalStartDate && contractInfo.renewalEndDate ? moment(contractInfo.renewalStartDate).format('YYYY年MM月DD日') + ' ~ ' + moment(contractInfo.renewalEndDate).format('YYYY年MM月DD日') : ''}}</label>
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :md="8">
            <a-form-model-item
              label="部门审核"
              :labelCol="{lg: {span: 9}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 15}, sm: {span: 20} }"
              :required="false"
              style="margin-bottom: 0">
              <a-radio-group v-model="contractInfo.deptAudit" >
                <a-radio :value="1" :disabled="contractInfo.deptAudit != 1">同意</a-radio>
                <a-radio :value="2" :disabled="contractInfo.deptAudit != 2">不同意</a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :md="8">
            <a-form-model-item
              label="审核人　"
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
              <a-textarea v-model="contractInfo.deptOpinion" :rows="2" :readOnly="true" style="resize: none"/>
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :md="24">
            <a-form-model-item
              label="签订单位"
              :labelCol="{lg: {span: 3}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
              style="margin-bottom: 0">
              <label>{{contractInfo.signUnitName}}</label>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="8">
            <a-form-model-item
              label="经办人　"
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
        <a-row>
          <a-col :md="24">
            <a-form-model-item
              label="备　　 注"
              :labelCol="{lg: {span: 3}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 30}, sm: {span: 20} }"
              :required="false"
              style="margin-bottom: 0">
              <a-textarea v-model="contractInfo.remark" :rows="2" :readOnly="true"  style="resize: none"/>
            </a-form-model-item>
          </a-col>
        </a-row>


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
              <a-textarea v-model="contractInfo.hrOpinion" :rows="2" :readOnly="true" style="resize: none"/>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-card>
    </a-form-model>
  </a-card>
</template>

<script>
  import moment from "moment";
  export default {
    name: "LaborContractProcessForm",
    props: {
      contractInfo:{
        type: Object,
        default: {},
      },
    },
    methods: {
      moment,
    }
  }
</script>

<style scoped>
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