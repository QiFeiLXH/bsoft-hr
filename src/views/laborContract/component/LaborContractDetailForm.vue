<template>
  <a-card :bordered="false" :body-style="{ padding: '0'}">
    <a-form-model :model="contractInfo" ref="LaborContractDetailForm">
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
              <label>{{contractInfo.postName}}</label>
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
              <label>{{contractInfo.deptName}}</label>
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
              <label>{{contractInfo.sequenceName}}</label>
            </a-form-model-item>
          </a-col>
          <a-col :md="8">
            <a-form-model-item
              label="职级评定"
              :labelCol="{lg: {span: 9}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 15}, sm: {span: 20} }"
              :required="false"
              style="margin-bottom: 0">
              <label>{{contractInfo.specialRankName}}</label>
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

      <a-card title="劳动合同" :body-style="{padding: 0}" :bordered="false">
        <a-tabs :activeKey="activeKey" v-show="detailList.length" @change="onTabChange" size="small">
          <a-tab-pane v-for="item in detailList" :key="item.id" :tab="item.renewalStartDate">
            <a-row>
              <a-col :md="24">
                <a-form-model-item
                  label="首续签　"
                  :labelCol="{lg: {span: 3}, sm: {span: 2}}"
                  :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
                  :required="false"
                  style="margin-bottom: 0">
                  <label>{{item.renewalFlag ? item.renewalFlag == 0 ? '首签' : '续签' : ''}}</label>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :md="24">
                <a-form-model-item
                  label="试用期　"
                  :labelCol="{lg: {span: 3}, sm: {span: 2}}"
                  :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
                  :required="false"
                  style="margin-bottom: 0">
                  <label>{{item.trialStartDate && item.trialEndDate ? moment(item.trialStartDate).format('YYYY年MM月DD日') + ' ~ ' + moment(item.trialEndDate).format('YYYY年MM月DD日') : ''}}</label>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :md="24">
                <a-form-model-item
                  label="合同年限"
                  :labelCol="{lg: {span: 3}, sm: {span: 2}}"
                  :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
                  :required="false"
                  style="margin-bottom: 0">
                  <label>{{item.renewalYear}}</label>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :md="24">
                <a-form-model-item
                  label="合同期限"
                  :labelCol="{lg: {span: 3}, sm: {span: 2}}"
                  :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
                  :required="false"
                  style="margin-bottom: 0">
                  <label>{{item.renewalStartDate && item.renewalEndDate ? moment(item.renewalStartDate).format('YYYY年MM月DD日') + ' ~ ' + moment(item.renewalEndDate).format('YYYY年MM月DD日') : ''}}</label>
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
                  <a-radio-group v-model="item.deptAudit">
                    <a-radio :value="1" :disabled="item.deptAudit != 1">同意</a-radio>
                    <a-radio :value="2" :disabled="item.deptAudit != 2">不同意</a-radio>
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
                  <label>{{item.deptAuditorName}}</label>
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
                  <a-textarea v-model="item.deptOpinion" :rows="2" :readOnly="true" style="resize: none"/>
                </a-form-model-item>
              </a-col>
            </a-row>

            <a-row>
              <a-col :md="24">
                <a-form-model-item
                  label="签订单位"
                  :labelCol="{lg: {span: 3}, sm: {span: 2}}"
                  :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
                  prop="signUnit"
                  style="margin-bottom: 0">
                  <label>{{item.signUnitName}}</label>
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
                  <label>{{item.dealPersonName}}</label>
                </a-form-model-item>
              </a-col>
              <a-col :md="8">
                <a-form-model-item
                  label="办理日期"
                  :labelCol="{lg: {span: 9}, sm: {span: 2}}"
                  :wrapperCol="{lg: {span: 15}, sm: {span: 20} }"
                  :required="false"
                  style="margin-bottom: 0">
                  <label>{{item.dealDate ? moment(item.dealDate).format('YYYY年MM月DD日') : ''}}</label>
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
                  <a-textarea v-model="item.remark" :rows="2" :readOnly="true"  style="resize: none"/>
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
                  <label>{{item.hrAuditorName}}</label>
                </a-form-model-item>
              </a-col>
              <a-col :md="8">
                <a-form-model-item
                  label="审核日期"
                  :labelCol="{lg: {span: 9}, sm: {span: 2}}"
                  :wrapperCol="{lg: {span: 15}, sm: {span: 20} }"
                  :required="false"
                  style="margin-bottom: 0">
                  <label>{{item.hrAuditDate ? moment(item.hrAuditDate).format('YYYY年MM月DD日') : ''}}</label>
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
                  <a-textarea v-model="item.hrOpinion" :rows="2" :readOnly="true" style="resize: none"/>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </a-card>




    </a-form-model>
  </a-card>
</template>

<script>
  import {getPersonalLaborContractList} from "@/api/laborContract";
  import moment from 'moment/moment'

  export default {
    name: "LaborContractDetailForm",
    props: {
      contractInfo:{
        type: Object,
        default: {},
      },
    },
    data() {
      return {
        activeKey: null,
        detailList: [],
      }
    },
    methods: {
      moment,
      onTabChange (key) {
        this.activeKey = key
      },
      getLaborContractDetail(personId) {
        const params = {
          'personId': personId,
        }
        getPersonalLaborContractList(params).then(res=>{
          this.detailList = []
          if (res.code === 200){
            if (res.body.length > 0) {
              this.detailList = res.body
              this.activeKey = res.body[0].id
            }
          }
        })
      }
    }
  }
</script>

<style scoped>

  /deep/ .ant-tabs-nav-scroll {
    overflow: hidden;
    white-space: nowrap;
    padding: 0 24px;
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