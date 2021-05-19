<template>
  <a-spin :spinning="loading">
    <div :style="{height: viewHeight+'px',overflowY:'hidden'}">
      <a-layout>

        <a-layout-sider style="background-color: white;" >
          <a-card :bordered="false" class="leftImg">
            <a-row>
              <a-col :md="10">
                <a-tooltip>
                  <template slot="title">
                    {{ form.personName }}
                  </template>
                  <div style="font-weight: bold;font-size: 16px;margin-bottom: 10px;overflow:hidden;white-space: nowrap;-o-text-overflow:ellipsis;text-overflow: ellipsis;">{{ form.personName }}</div>
                </a-tooltip>
              </a-col>
              <a-col :md="14">
                <a-tooltip>
                  <template slot="title">
                    {{ form.deptText }}
                  </template>
                  <div class="deptBorder">{{ form.deptText }}</div>
                </a-tooltip>
              </a-col>
            </a-row>
            <div style="color: #8c8c8c">报到日期:　{{ form.startDate != null?form.startDate.format('YYYY-MM-DD'):'' }}</div>
          </a-card>
          <a-card :bordered="false">
            <a-anchor :getContainer="container" :target-offset="targetOffset">
              <a-anchor-link href="#base" title="基本信息" />
              <a-anchor-link href="#employee" title="招聘信息" />
              <a-anchor-link href="#place" title="驻地信息" />
              <a-anchor-link href="#year" title="工龄信息" />
              <a-anchor-link href="#person" title="个人资料" />
              <a-anchor-link href="#money" title="工资卡情况" />
              <a-anchor-link href="#family" title="家庭情况" />
              <a-anchor-link href="#education" title="教育经历" />
              <a-anchor-link href="#work" title="工作经历" />
            </a-anchor>
          </a-card>

        </a-layout-sider>
        <a-layout-content id="content" :style="{backgroundColor: 'white',overflowY: 'auto',height: formHeight+'px'}">
          <viewer :images="getPhoto" ref="viewer">
            <div id="mark">
              <a-form-model :model="form" ref="ruleForm" :rules="getRules">
                <a-card id="base" v-watermark title="基本信息">
                  <a-row>
                    <a-col :md="19">
                      <a-row>
                        <a-col :md="8">
                          <a-form-model-item
                            label="姓　　名"
                            :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                            :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                            prop="personName">
                            <a-input :maxLength="12" :disabled="disabled" v-model="form.personName"/>
                          </a-form-model-item>
                        </a-col>
                        <a-col :md="8">
                          <a-form-model-item
                            label="证件类型"
                            :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                            :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                            prop="idCardType">
                            <a-select :disabled="disabled" :getPopupContainer="triggerNode => triggerNode.parentNode" v-model="form.idCardType" @select="cardTypeSelect">
                              <a-select-option :value="1">
                                身份证
                              </a-select-option>
                              <a-select-option :value="2">
                                护照
                              </a-select-option>
                            </a-select>
                          </a-form-model-item>
                        </a-col>
                        <a-col :md="8">
                          <a-form-model-item
                            label="报到日期"
                            :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                            :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                            prop="startDate">
                            <a-date-picker :disabled-date="disabledDate" :disabled="disabled" v-model="form.startDate" @change="doChangeStartDate"/>
                          </a-form-model-item>
                        </a-col>

                      </a-row>
                      <a-row>
                        <a-col :md="8">
                          <a-form-model-item
                            v-if="form.idCardType === 1"
                            label="身份证号"
                            :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                            :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                            prop="idCard">
                            <a-input :maxLength="20" :disabled="disabled" v-model="form.idCard" @change="idCardChange"/>
                          </a-form-model-item>
                          <a-form-model-item
                            v-if="form.idCardType === 2"
                            label="护照号码"
                            :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                            :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                            prop="idCard">
                            <a-input :maxLength="20" :disabled="disabled" v-model="form.idCard"/>
                          </a-form-model-item>
                        </a-col>
                        <a-col :md="8">
                          <a-form-model-item
                            label="性　　别"
                            :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                            :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                            prop="gender">
                            <a-select
                              :disabled="disabled||genderDisabled"
                              v-model="form.gender"
                            >
                              <a-select-option :value="1">
                                男
                              </a-select-option>
                              <a-select-option :value="2">
                                女
                              </a-select-option>
                            </a-select>
                          </a-form-model-item>
                        </a-col>
                        <a-col :md="8">
                          <a-form-model-item
                            label="出生日期"
                            :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                            :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                            prop="birthDate">
                            <a-date-picker :disabled="disabled||genderDisabled" v-model="form.birthDate"/>
                          </a-form-model-item>
                        </a-col>
                      </a-row>
                      <a-row>
                        <a-col :md="8">
                          <a-form-model-item
                            label="文化程度"
                            :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                            :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                            prop="education">
<!--                            <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" :disabled="disabled" v-model="form.education" @focus="getEducationDic">-->
<!--                              <a-spin v-if="educationDic.length === 0" slot="notFoundContent" size="small" />-->
<!--                              <a-select-option :value="item.id" v-for="item in educationDic" :key="item.id">-->
<!--                                {{ item.name }}-->
<!--                              </a-select-option>-->
<!--                            </a-select>-->
                            <hr-dic-select :storageKey="'EmployeeAuditInfo_education_01'" :custom-list="educationDic" v-model="form.education" :type="10" :width="165" :searchable="true"></hr-dic-select>
                          </a-form-model-item>
                        </a-col>
                        <a-col :md="8">
                          <a-form-model-item
                            label="毕业日期"
                            :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                            :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                            prop="graduateDate">
                            <a-date-picker v-model="form.graduateDate" :disabled="disabled" @change="changeGraduateDate"/>
                          </a-form-model-item>
                        </a-col>
                        <a-col :md="8">
                          <a-form-model-item
                            label="首次工作"
                            :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                            :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                          >
                            <a-date-picker v-model="form.firstWork" :disabled-date="disabledGtDate" :disabled="disabled"/>
                          </a-form-model-item>
                        </a-col>
                      </a-row>
                      <a-row>
                        <a-col :md="8">
                          <a-form-model-item
                            label="手机号码"
                            :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                            :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                            prop="phone">
                            <a-input :disabled="disabled" v-model="form.phone"/>
                          </a-form-model-item>
                        </a-col>
                        <a-col :md="8">
                          <a-form-model-item
                            label="邮箱地址"
                            :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                            :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                            prop="email">
                            <a-auto-complete
                              :data-source="emailSource"
                              style="width: 100%"
                              placeholder="Email"
                              v-model="form.email"
                              @change="handleChange"
                              :disabled="disabled"
                            />
                          </a-form-model-item>
                        </a-col>
                      </a-row>
                    </a-col>
                    <a-col :md="5">
                      <div style="text-align:center;">
                        <vue-hover-mask>
                          <a-row>
                            <a-col v-if="photo[0]">
                              <a-spin :spinning="uploading">
                                <img style="width: 100px;height: 140px;cursor: pointer;" :src="photo[0]"/>
                              </a-spin>
                            </a-col>
                            <a-col v-else>
                              <a-avatar style="float: right" shape="square" :size="150" icon="user"/>
                            </a-col>
                          </a-row>
                          <template slot="action">
                            <a-icon type="eye" @click="handleImageEnlarge"></a-icon>
                            <a-upload
                              :customRequest="handleUpload"
                              :showUploadList="false"
                              :fileList="fileList"
                              :remove="handleRemove"
                              :beforeUpload="beforeUpload">
                              <a-icon type="edit" style="margin-left: 6px;color:white;font-size: 18px"></a-icon>
                            </a-upload>
                          </template>
                        </vue-hover-mask>
                      </div>
                    </a-col>
                  </a-row>
                </a-card>
                <a-card id="employee" title="招聘信息" v-watermark>
                  <a-row>
                    <a-col :md="16">
                      <a-form-model-item
                        label="招聘类型"
                        :labelCol="{lg: {span: 4}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
                        prop="recruitmentType">
                        <a-radio-group :disabled="disabled" name="stageGroup" v-model="form.recruitmentType" @change="stageGroupChange">
                          <a-radio :value="0">
                            普通
                          </a-radio>
                          <a-radio :value="1">
                            实习
                          </a-radio>
                          <a-radio :value="2">
                            中层
                          </a-radio>
                          <a-radio :value="3">
                            领导
                          </a-radio>
                          <a-radio :value="4">
                            顾问
                          </a-radio>
                        </a-radio-group>
                      </a-form-model-item>
                    </a-col>
                    <a-col :md="8">
                      <a-form-model-item
                        label="通讯补贴"
                        :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                        prop="communicationSubsidy">
<!--                        <a-select @focus="getSubsidyDic" :disabled="disabled" :getPopupContainer="triggerNode => triggerNode.parentNode" v-model="form.communicationSubsidy">-->
<!--                          <a-spin v-if="communicationSubsidyDic.length === 0" slot="notFoundContent" size="small" />-->
<!--                          <a-select-option :value="item.id" v-for="item in communicationSubsidyDic" :key="item.id">-->
<!--                            {{ item.name }}-->
<!--                          </a-select-option>-->
<!--                        </a-select>-->
                        <general-dic-select :storageKey="'EmployeeAuditInfo_subsidyUseful_01'" :custom-list="communicationSubsidyDic" v-model="form.communicationSubsidy" :width="208" @getGeneralDicList="getSubsidyDic"></general-dic-select>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col :md="8">
                      <a-form-model-item
                        label="所属公司"
                        :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                        prop="company">
<!--                        <a-select-->
<!--                          :disabled="disabled"-->
<!--                          :getPopupContainer="triggerNode => triggerNode.parentNode"-->
<!--                          v-model="form.company"-->
<!--                          showSearch-->
<!--                          optionFilterProp="children"-->
<!--                          :filter-option="filterCompanyOption"-->
<!--                          @focus="getCompanyDic"-->
<!--                          @select="companySelectChange">-->
<!--                          <a-spin v-if="companyDic.length === 0" slot="notFoundContent" size="small" />-->
<!--                          <a-select-option :value="item.companyId" v-for="item in companyDic" :detail="item" :key="item.companyId">-->
<!--                            {{ item.abbreviation }}-->
<!--                          </a-select-option>-->
<!--                        </a-select>-->
                        <general-dic-select :storageKey="'EmployeeAuditInfo_companyUseful_01'" :custom-list="companyDic" :customLabel="'abbreviation'" :customKey="'companyId'" v-model="form.company" :width="208" @getGeneralDicList="getCompanyDic" @change="companySelectChange"></general-dic-select>
                      </a-form-model-item>
                    </a-col>
                    <a-col :md="8">
                      <a-form-model-item
                        label="应聘岗位"
                        :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                        prop="appliedPosition">
<!--                        <a-select-->
<!--                          :disabled="disabled"-->
<!--                          :getPopupContainer="triggerNode => triggerNode.parentNode"-->
<!--                          v-model="form.appliedPosition"-->
<!--                          showSearch-->
<!--                          optionFilterProp="children"-->
<!--                          :filter-option="filterOption"-->
<!--                          @focus="getAppliedPositionDic">-->
<!--                          <a-spin v-if="appliedPositionDic.length === 0" slot="notFoundContent" size="small" />-->
<!--                          <a-select-option :value="item.id" v-for="item in appliedPositionDic" :detail="item" :key="item.id">-->
<!--                            {{ item.name }}-->
<!--                          </a-select-option>-->
<!--                        </a-select>-->
                        <hr-dic-select :storageKey="'EmployeeAuditInfo_appliedPosition_01'" :custom-list="appliedPositionDic" v-model="form.appliedPosition" :type="14" :width="208" :searchable="true"></hr-dic-select>
                      </a-form-model-item>
                    </a-col>
                    <a-col :md="8">
                      <a-form-model-item
                        label="岗位大类"
                        :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                        prop="jobCategory">
<!--                        <a-select :disabled="disabled" :getPopupContainer="triggerNode => triggerNode.parentNode" @focus="getJobCategory" v-model="form.jobCategory">-->
<!--                          <a-spin v-if="jobCategoryDic.length === 0" slot="notFoundContent" size="small" />-->
<!--                          <a-select-option :value="item.id+''" v-for="item in jobCategoryDic" :key="item.id">-->
<!--                            {{ item.name }}-->
<!--                          </a-select-option>-->
<!--                        </a-select>-->
                        <hr-dic-select :storageKey="'EmployeeAuditInfo_jobCategory_01'" :custom-list="jobCategoryDic" v-model="form.jobCategory" :type="2" :width="208" :searchable="true"></hr-dic-select>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col :md="8">
                      <a-form-model-item
                        label="录用部门"
                        :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                        prop="dept">
<!--                        <dept-select ref="dept" :disabled="disabled" v-model="form.dept" @change="deptChange"></dept-select>-->
                        <memory-select :storageKey="'EmployeeAuditInfo_deptUseful_01'" ref="dept" :disabled="disabled" v-model="form.dept"  @change="memoryDeptChange" style="width:208px;"></memory-select>
                      </a-form-model-item>
                    </a-col>
                    <a-col :md="8">
                      <a-form-model-item
                        label="人员归属群"
                        :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                        prop="personnelGroup">
                        <a-select
                          notFoundContent="未维护核算口径归属"
                          :disabled="disabled"
                          :getPopupContainer="triggerNode => triggerNode.parentNode"
                          @focus="getPersonnelGroupDic"
                          v-model="form.personnelGroup"
                          showSearch
                          optionFilterProp="children"
                          :filter-option="filterOption">
                          <a-spin v-if="personnelGroupDic.length === 0" slot="notFoundContent" size="small" />
                          <a-select-option :value="item.id" v-for="item in personnelGroupDic" :detail="item" :key="item.id">
                            {{ item.name }}
                          </a-select-option>
                        </a-select>
                      </a-form-model-item>
                    </a-col>
                    <a-col :md="8">
                      <a-form-model-item
                        label="试用期"
                        :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                        prop="probationPeriod">
                        <a-input-number
                          :disabled="disabled"
                          style="width: 80%;"
                          id="inputNumber"
                          v-model="form.probationPeriod"
                          :min="0"
                          :max="99"
                          :precision="0"/>
                        个月
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col :md="8">
                      <a-form-model-item
                        label="实习薪资"
                        :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                        prop="internshipSalary">
                        <a-input-number
                          :disabled="disabled||form.recruitmentType !== 1"
                          :min="0"
                          :max="1000000000"
                          :precision="2"
                          style="width:90%"
                          v-model="form.internshipSalary"/>元
                      </a-form-model-item>
                    </a-col>

                    <a-col :md="8">
                      <a-form-model-item
                        label="试用期薪资"
                        :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                        prop="trialSalary">
                        <a-input-number
                          :disabled="disabled"
                          :min="0"
                          :max="1000000000"
                          :precision="2"
                          style="width:90%"
                          v-model="form.trialSalary"/>元
                      </a-form-model-item>
                    </a-col>

                    <a-col :md="8">
                      <a-form-model-item
                        label="转正薪资"
                        :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                        prop="regularSalary">
                        <a-input-number
                          :disabled="disabled"
                          style="width:90%"
                          :min="0"
                          :max="1000000000"
                          :precision="2"
                          v-model="form.regularSalary"/>元
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col :md="8">
                      <a-form-model-item
                        label="HR联系人"
                        :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                        prop="registrant">
                        <person-search-select :disabled="disabled" ref="person" @setPerson="setPerson" v-model="form.registrant"></person-search-select>
                      </a-form-model-item>
                    </a-col>
                    <a-col :md="8">
                      <a-form-model-item
                        label="联系电话"
                        :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                      >
                        <a-input disabled v-model="form.registrantPhone"/>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col :md="8">
                      <a-form-model-item
                        label="实习生留用"
                        :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                        prop="isUse">
                        <a-radio-group :disabled="disabled || isUseDisabled" name="useGroup" v-model="form.isUse" @change="isUseChange">
                          <a-radio :value="1">
                            是
                          </a-radio>
                          <a-radio :value="2">
                            否
                          </a-radio>
                        </a-radio-group>
                      </a-form-model-item>
                    </a-col>
                    <a-col :md="8">
                      <a-form-model-item
                        label="缴纳社保"
                        :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 16}, sm: {span: 20} }">
                        <a-radio-group :disabled="disabled" name="paymentFlagGroup" :value="form.paymentFlag" @change="paymentFlagChange">
                          <a-radio :value="1">
                            是
                          </a-radio>
                          <a-radio :value="2">
                            否
                          </a-radio>
                        </a-radio-group>
                      </a-form-model-item>
                    </a-col>
                    <a-col :md="8" v-if="form.company === 60 || form.company === 85">
                      <a-form-model-item
                        label="同创业工号"
                        :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                        prop="sameBsoft">
                        <a-radio-group :disabled="disabled" name="sameBsoftGroup" v-model="form.sameBsoft">
                          <a-radio :value="1">
                            是
                          </a-radio>
                          <a-radio :value="0">
                            否
                          </a-radio>
                        </a-radio-group>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row v-if="form.paymentFlag === 1">
                    <a-col :md="8">
                      <a-form-model-item
                        label="社保缴纳基数"
                        :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                        prop="paymentBase">
                        <a-input-number
                          :disabled="disabled"
                          style="width: 100%"
                          v-model="form.paymentBase"
                          :max="1000000000"
                          :min="0"
                          :precision="2"/>
                      </a-form-model-item>
                    </a-col>
                    <a-col :md="16">
                      <a-form-model-item
                        label="社保缴纳地"
                        :labelCol="{lg: {span: 4}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
                        prop="paymentPlace">
<!--                        <a-select-->
<!--                          @focus="getPaymentPlaceDic"-->
<!--                          :getPopupContainer="triggerNode => triggerNode.parentNode"-->
<!--                          :disabled="disabled"-->
<!--                          v-model="form.paymentPlace"-->
<!--                          showSearch-->
<!--                          optionFilterProp="children"-->
<!--                          :filter-option="filterCompanyOption">-->
<!--                          <a-spin v-if="paymentPlaceDic.length === 0" slot="notFoundContent" size="small" />-->
<!--                          <a-select-option :value="item.companyId" v-for="item in paymentPlaceDic" :detail="item" :key="item.companyId">-->
<!--                            {{ item.abbreviation }}-->
<!--                          </a-select-option>-->
<!--                        </a-select>-->
                        <general-dic-select :placeholder="'选择社保缴纳地'" :storageKey="'EmployeeAuditInfo_paymentPlaceUseful_01'" :custom-list="paymentPlaceDic" :customLabel="'abbreviation'" :customKey="'companyId'" v-model="form.paymentPlace" :width="518" @getGeneralDicList="getPaymentPlaceDic"></general-dic-select>
                      </a-form-model-item>
                    </a-col>

                  </a-row>
                  <a-row>
                    <a-col :md="8">
                      <a-form-model-item
                        label="录用备注"
                        :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                        prop="employmentNotes">
<!--                        <a-select @focus="getEmploymentNotesDic" :getPopupContainer="triggerNode => triggerNode.parentNode" :disabled="disabled" v-model="form.employmentNotes" @select="employmentNotesSelect">-->
<!--                          <a-spin v-if="employmentNotesDic.length === 0" slot="notFoundContent" size="small" />-->
<!--                          <a-select-option :value="item.id" v-for="item in employmentNotesDic" :key="item.id">-->
<!--                            {{ item.name }}-->
<!--                          </a-select-option>-->
<!--                        </a-select>-->
                        <public-dic-select :storageKey="'EmployeeAuditInfo_employmentNotes_01'" :custom-list="employmentNotesDic" v-model="form.employmentNotes" :type="3010" :width="200"></public-dic-select>
                      </a-form-model-item>
                    </a-col>
                    <a-col :md="16">
                      <a-form-model-item
                        label="其他说明"
                        :labelCol="{lg: {span: 4}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
                        prop="employmentNotesDetail">
                        <a-input v-model="form.employmentNotesDetail" :maxLength="80" :readOnly="form.employmentNotes !== 4||disabled"/>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col :md="8">
                      <a-form-model-item
                        label="办理总部工牌"
                        :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                        prop="workCardFlag">
                        <a-radio-group :disabled="disabled" name="workCardFlagGroup" v-model="form.workCardFlag" @change="workCardFlagChange">
                          <a-radio :value="1">
                            是
                          </a-radio>
                          <a-radio :value="0">
                            否
                          </a-radio>
                        </a-radio-group>
                      </a-form-model-item>
                    </a-col>
                    <a-col :md="8">
                      <a-form-model-item
                        label="餐补充值"
                        :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                        prop="mealRechargeFlag">
                        <a-radio-group :disabled="disabled" name="mealRechargeFlagGroup" v-model="form.mealRechargeFlag" @change="mealRechargeFlagChange">
                          <a-radio :value="1">
                            是
                          </a-radio>
                          <a-radio :value="0">
                            否
                          </a-radio>
                        </a-radio-group>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                </a-card>
                <a-card id="place" title="驻地信息" v-watermark>
                  <a-row>
                    <a-col :md="12">
                      <a-form-model-item
                        label="本地化"
                        :labelCol="{lg: {span: 4}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
                        prop="localFlag">
                        <a-radio-group :disabled="disabled" name="placeGroup" :value="form.localFlag" @change="localChange">
                          <a-radio :value="0">
                            非本地
                          </a-radio>
                          <a-radio :value="1">
                            县级市
                          </a-radio>
                          <a-radio :value="3">
                            地级市
                          </a-radio>
                          <a-radio :value="2">
                            省级
                          </a-radio>
                        </a-radio-group>
                      </a-form-model-item>
                    </a-col>
                    <a-col :md="12">
                      <a-form-model-item
                        label="省市县"
                        :labelCol="{lg: {span: 6}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
                        prop="divisionCounty">
                        <administrative-new-division ref="divisionCounty" :disabled="disabled" v-model="form.divisionCounty" @setDivision="setDivision"></administrative-new-division>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                </a-card>
                <a-card id="year" title="工龄信息" v-watermark>
                  <a-row>
                    <a-col :md="12">
                      <a-form-model-item
                        label="首次工作"
                        :labelCol="{lg: {span: 6}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
                      >
                        <a-date-picker v-model="form.firstWork" :disabled-date="disabledGtDate" :disabled="disabled"/>
                      </a-form-model-item>
                    </a-col>
                    <a-col :md="12">
                      <a-form-model-item
                        label="上单位离职日期"
                        :labelCol="{lg: {span: 6}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
                      >
                        <a-input readOnly v-model="lastWorkDate"/>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col :md="12">
                      <a-form-model-item
                        label="入司连续工龄"
                        :labelCol="{lg: {span: 6}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
                        prop="continuousYearsMark">
                        <a-radio-group :disabled="disabled" name="yearGroup" v-model="form.continuousYearsMark" @change="continuousYearsMarkChange">
                          <a-radio :value="1">
                            是
                          </a-radio>
                          <a-radio :value="2">
                            否
                          </a-radio>
                        </a-radio-group>
                      </a-form-model-item>
                    </a-col>
                    <a-col :md="12">
                      <a-form-model-item
                        label="入司前工龄"
                        :labelCol="{lg: {span: 6}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
                        prop="workedYears">
                        <a-input-number
                          :disabled="disabled"
                          :step="0.01"
                          style="width: 100%;"
                          v-model="form.workedYears"
                          :max="100"
                          :min="0"
                          :precision="2"/>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                </a-card>
                <a-card id="person" title="个人资料" v-watermark>
                  <a-form-model-item
                    label="出生地"
                    :labelCol="{lg: {span: 3}, sm: {span: 2}}"
                    :wrapperCol="{lg: {span: 21}, sm: {span: 20} }"
                    prop="birthplace">
                    <administrative-old-division ref="birthplace" :disabled="disabled" v-model="form.birthplace" ></administrative-old-division>
                  </a-form-model-item>
                  <a-row>
                    <a-col :md="12">
                      <a-form-model-item
                        label="籍贯"
                        :labelCol="{lg: {span: 6}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
                        prop="nativePlace">
                        <administrative-old-division ref="nativePlace" :disabled="disabled" v-model="form.nativePlace" ></administrative-old-division>
                      </a-form-model-item>
                    </a-col>
                    <a-col :md="12">
                      <a-form-model-item
                        label="民族"
                        :labelCol="{lg: {span: 6}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
                        prop="nation">
<!--                        <a-select-->
<!--                          @focus="getNationDic"-->
<!--                          :getPopupContainer="triggerNode => triggerNode.parentNode"-->
<!--                          :disabled="disabled"-->
<!--                          v-model="form.nation"-->
<!--                          showSearch-->
<!--                          optionFilterProp="children"-->
<!--                          :filter-option="filterOption">-->
<!--                          <a-spin v-if="nationDic.length === 0" slot="notFoundContent" size="small" />-->
<!--                          <a-select-option :value="item.id" v-for="item in nationDic" :detail="item" :key="item.id">-->
<!--                            {{ item.name }}-->
<!--                          </a-select-option>-->
<!--                        </a-select>-->
                        <hr-dic-select :storageKey="'EmployeeAuditInfo_nation_01'" :custom-list="nationDic" v-model="form.nation" :type="3" :width="350" :searchable="true"></hr-dic-select>
                      </a-form-model-item>
                    </a-col>

                  </a-row>
                  <a-row>
                    <a-col :md="12">
                      <a-form-model-item
                        label="身高"
                        :labelCol="{lg: {span: 6}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
                        prop="height">
                        <a-input-number
                          :disabled="disabled"
                          :step="1"
                          style="width: 90%;"
                          v-model="form.height"
                          :max="500"
                          :min="1"
                          :precision="0"/>cm
                      </a-form-model-item>
                    </a-col>
                    <a-col :md="12">
                      <a-form-model-item
                        label="体重"
                        :labelCol="{lg: {span: 6}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
                        prop="weight">
                        <a-input-number
                          :disabled="disabled"
                          :step="0.01"
                          style="width: 90%;"
                          v-model="form.weight"
                          :max="999"
                          :min="1"
                          :precision="2"/>kg
                      </a-form-model-item>
                    </a-col>

                  </a-row>
                  <a-row>
                    <a-col :md="12">
                      <a-form-model-item
                        label="血型"
                        :labelCol="{lg: {span: 6}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
                        prop="bloodType">
                        <a-select @focus="getBloodTypeDic" :getPopupContainer="triggerNode => triggerNode.parentNode" :disabled="disabled" v-model="form.bloodType">
                          <a-spin v-if="bloodTypeDic.length === 0" slot="notFoundContent" size="small" />
                          <a-select-option :value="item.id" v-for="item in bloodTypeDic" :key="item.id">
                            {{ item.name }}
                          </a-select-option>
                        </a-select>
                      </a-form-model-item>
                    </a-col>
                    <a-col :md="12">
                      <a-form-model-item
                        label="婚姻状况"
                        :labelCol="{lg: {span: 6}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
                        prop="maritalStatus">
                        <a-select @focus="getMaritalStatusDic" :getPopupContainer="triggerNode => triggerNode.parentNode" :disabled="disabled" v-model="form.maritalStatus">
                          <a-spin v-if="maritalStatusDic.length === 0" slot="notFoundContent" size="small" />
                          <a-select-option :value="item.id" v-for="item in maritalStatusDic" :key="item.id">
                            {{ item.name }}
                          </a-select-option>
                        </a-select>

                      </a-form-model-item>
                    </a-col>

                  </a-row>
                  <a-row>
                    <a-col :md="12">
                      <a-form-model-item
                        label="政治面貌"
                        :labelCol="{lg: {span: 6}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
                        prop="politicalOutlook">
                        <a-select @focus="getPoliticalOutlookDic" :getPopupContainer="triggerNode => triggerNode.parentNode" :disabled="disabled" v-model="form.politicalOutlook">
                          <a-spin v-if="politicalOutlookDic.length === 0" slot="notFoundContent" size="small" />
                          <a-select-option :value="item.id" v-for="item in politicalOutlookDic" :key="item.id">
                            {{ item.name }}
                          </a-select-option>
                        </a-select>
                      </a-form-model-item>
                    </a-col>
                    <a-col :md="12">
                      <a-form-model-item
                        label="户口性质"
                        :labelCol="{lg: {span: 6}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
                        prop="accountNature">
                        <a-select @focus="getAccountNatureDic" :getPopupContainer="triggerNode => triggerNode.parentNode" :disabled="disabled" v-model="form.accountNature">
                          <a-spin v-if="accountNatureDic.length === 0" slot="notFoundContent" size="small" />
                          <a-select-option :value="item.id" v-for="item in accountNatureDic" :key="item.id">
                            {{ item.name }}
                          </a-select-option>
                        </a-select>
                      </a-form-model-item>
                    </a-col>

                  </a-row>
                  <a-row>
                    <a-col>
                      <a-form-model-item
                        label="户口详细地址"
                        :labelCol="{lg: {span: 3}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 21}, sm: {span: 20} }"
                        prop="registeredAddress">
                        <a-input :disabled="disabled" v-model="form.registeredAddress" :maxLength="100"/>
                      </a-form-model-item>
                    </a-col>

                  </a-row>
                  <a-row>
                    <a-col>
                      <a-form-model-item
                        label="家庭地址"
                        :labelCol="{lg: {span: 3}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 21}, sm: {span: 20} }"
                        prop="homeAddress">
                        <a-input :disabled="disabled" v-model="form.homeAddress" :maxLength="100"/>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col :md="12">
                      <a-form-model-item
                        label="身份证正面"
                        :labelCol="{lg: {span: 6}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
                        v-if="photo[1]"
                      >
                        <img :src="photo[1]" class="certificates-image"/>
                      </a-form-model-item>
                    </a-col>
                    <a-col :md="12">
                      <a-form-model-item
                        label="身份证反面"
                        :labelCol="{lg: {span: 6}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
                        v-if="photo[2]"
                      >
                        <img :src="photo[2]" class="certificates-image"/>
                      </a-form-model-item>
                    </a-col>

                  </a-row>
                </a-card>
                <a-card id="money" title="工资卡情况" v-watermark>
                  <a-row>
                    <a-col :md="5">
                      <a-form-model-item
                        label=""
                        :labelCol="{lg: {span: 0}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 24}, sm: {span: 20} }"
                        prop="needApplyCard">
                        <a-radio-group :disabled="disabled" name="applyCardGroup" v-model="form.needApplyCard" @change="applyCardChange">
                          <a-radio :value="1">
                            需办卡
                          </a-radio>
                          <a-radio :value="2">
                            无需办卡
                          </a-radio>
                        </a-radio-group>
                      </a-form-model-item>
                    </a-col>
                    <a-col :md="5" v-if="form.needApplyCard === 2">
                      <a-form-model-item
                        label=""
                        :labelCol="{lg: {span: 0}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 24}, sm: {span: 20} }"
                        prop="depositBank">
                        <a-radio-group :disabled="disabled" name="depositBankGroup" v-model="form.depositBank" >
                          <a-radio value="招商">
                            招商
                          </a-radio>
                          <a-radio value="杭州">
                            杭州
                          </a-radio>
                        </a-radio-group>
                      </a-form-model-item>
                    </a-col>
                    <a-col :md="7" v-if="form.needApplyCard === 2">
                      <a-form-model-item
                        label="开户行"
                        :labelCol="{lg: {span: 6}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
                        prop="openingBank">
                        <a-input :disabled="disabled" v-model="form.openingBank" :maxLength="30"/>
                      </a-form-model-item>
                    </a-col>
                    <a-col :md="7" v-if="form.needApplyCard === 2">
                      <a-form-model-item
                        label="银行账号"
                        :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                        prop="bankAccount">
                        <a-input :disabled="disabled" v-model="form.bankAccount"/>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-form-model-item
                    label="银行卡照片"
                    :labelCol="{lg: {span: 3}, sm: {span: 2}}"
                    :wrapperCol="{lg: {span: 21}, sm: {span: 20} }"
                    v-if="photo[3] && form.needApplyCard === 2"
                  >
                    <img class="certificates-image" :src="photo[3]"/>
                  </a-form-model-item>
                </a-card>
                <a-card id="family" title="家庭情况" v-watermark>
                  <a-button slot="extra" type="link" icon="plus" @click="doFamilyAdd" v-if="!disabled">新增成员</a-button>
                  <a-table
                    size="small"
                    :columns="familyColumns"
                    :data-source="familyData"
                    :loading="familyLoading"
                    :customRow="onFamilyClickRow"
                    :rowKey="(record) => record.id"
                    :pagination="false"
                  >

                    <span slot="operation" slot-scope="text, record, index" v-if="!disabled">
                      <template>
                        <a-button v-if="record.show" type="link" size="small" icon="edit" @click="editFamilyRecord(record)" />
                        <a-popconfirm title="是否要删除此行？" @confirm="doFamilyDelete(index, record)">
                          <a-button v-if="record.show" type="link" size="small" icon="delete" />
                        </a-popconfirm>
                      </template>
                    </span>
                  </a-table>
                </a-card>
                <a-card id="education" title="教育经历" v-watermark>
                  <a-button slot="extra" type="link" icon="plus" @click="doEducationAdd" v-if="!disabled">新增教育</a-button>
                  <a-table
                    size="small"
                    :columns="educationColumns"
                    :data-source="educationData"
                    :loading="educationLoading"
                    :customRow="onEducationClickRow"
                    :rowKey="(record) => record.id"
                    :pagination="false"
                  >
                    <template slot="renderStartEndDate" slot-scope="text, record">
                      <template>
                        {{ record.startEndDate[0].format('YYYY-MM') +"至"+ record.startEndDate[1].format('YYYY-MM') }}
                      </template>
                    </template>

                    <span slot="operation" slot-scope="text, record, index" v-if="!disabled">
                      <template>
                        <a-button v-if="record.show" type="link" size="small" icon="edit" @click="editEducationRecord(record)" />
                        <a-popconfirm title="是否要删除此行？" @confirm="doEducationDelete(index , record)" v-if="!disabled">
                          <a-button v-if="record.show" type="link" size="small" icon="delete" />
                        </a-popconfirm>
                      </template>
                    </span>
                  </a-table>
                </a-card>
                <a-card id="work" title="工作经历" v-watermark>
                  <a-button slot="extra" type="link" icon="plus" @click="doWorkAdd" v-if="!disabled">新增工作</a-button>
                  <a-table
                    size="small"
                    :columns="workColumns"
                    :loading="workLoading"
                    :data-source="workData"
                    :customRow="onWorkClickRow"
                    :rowKey="(record) => record.id"
                    :pagination="false"
                  >
                    <template slot="renderIsInternship" slot-scope="text, record">
                      <template>
                        <a-switch v-model="record.check" disabled/>
                      </template>
                    </template>
                    <template slot="renderStartEndDate" slot-scope="text, record">
                      <template>
                        {{ record.startEndDate[0].format('YYYY-MM-DD') +"至"+ record.startEndDate[1].format('YYYY-MM-DD') }}
                      </template>
                    </template>
                    <span slot="operation" slot-scope="text, record, index" v-if="!disabled">
                      <template>
                        <a-button v-if="record.show" type="link" size="small" icon="edit" @click="editWorkRecord(record)" />
                        <a-popconfirm title="是否要删除此行？" @confirm="doWorkDelete(index,record)">
                          <a-button v-if="record.show" type="link" size="small" icon="delete" />
                        </a-popconfirm>
                      </template>
                    </span>
                  </a-table>
                </a-card>
              </a-form-model>
            </div>
          </viewer>
          <family-modal @refresh="getFamilyInfo" :recruitmentInfoId="recruitmentInfoId" :appellation-dic="appellationDic" ref="familyModal" :familyInfo="familyInfo"></family-modal>
          <education-modal
            @refresh="getEducationInfo"
            :recruitmentInfoId="recruitmentInfoId"
            :education-dic="educationDic"
            :school-dic="schoolDic"
            :major-dic="majorDic"
            ref="educationModal"
            :educationInfo="educationInfo"></education-modal>
          <work-modal @refresh="getWorkInfo" :recruitmentInfoId="recruitmentInfoId" ref="workModal" :workInfo="workInfo"></work-modal>
        </a-layout-content>
      </a-layout>
      <div
        :style="{
          position: 'absolute',
          right: 10,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '9px 16px',
          background: '#fff',
          textAlign: 'right',
        }"
        v-if="!disabled"
      >
        <a-button @click.stop="doBack" v-if="form.status === 5 || form.status === 6">退回</a-button>
        <a-button type="primary" style="margin-left: 10px" @click.stop="saveInfo" :disabled="saveLoading">保存</a-button>
        <a-button type="primary" style="margin-left: 10px" @click.stop="auditInfo" v-if="form.status !== 7" :disabled="saveLoading">审核通过</a-button>
        <a-button type="primary" style="margin-left: 10px" @click.stop="headquartersAuditInfo" v-if="form.status === 7" :disabled="saveLoading">总部审核通过</a-button>
      </div>
    </div>

  </a-spin>
</template>

<script>
import VueHoverMask from '../../../components/HoverMask/VueHoverMask'
import MemorySelect from "../../../components/MemorySelect/MemoryDeptSelect"
import PublicDicSelect from "../../../components/MemorySelect/PublicDicSelect";
import SystemDicSelect from "../../../components/MemorySelect/SystemDicSelect";
import HrDicSelect from "../../../components/MemorySelect/HrDicSelect"
import GeneralDicSelect from "../../../components/MemorySelect/GeneralDicSelect";
import moment from 'moment/moment'
import AFormModelItem from 'ant-design-vue/es/form-model/FormItem'
import AFormModel from 'ant-design-vue/es/form-model/Form'
import DeptSelect from '../../../components/Dept/DeptSelect'
import { doBack, getSubsidy, getWorkYears, getHumanDic, getPublicDic, initRecruitmentAuditInfo, getFamilyList, getWorkList, getEducationList, getRecruitmentAuditInfo, saveRecruitmentAuditInfo, deleteFamily, deleteWork, deleteEducation, getPersonnelGroupDic, getCompanyDic, uploadImage, rewriteImage } from '@/api/employee'
import PersonSearchSelect from '../../../components/Person/PersonSearchSelect'
import ARow from 'ant-design-vue/es/grid/Row'
import ACol from 'ant-design-vue/es/grid/Col'
import SearchSelect from '../../../components/SearchSelect/SearchSelect'
import store from '@/store'
import EducationModal from './EducationModal'
import FamilyModal from './FamilyModal'
import WorkModal from './WorkModal'
import AdministrativeNewDivision from '../../../components/Area/AdministrativeNewDivision'
import AdministrativeOldDivision from '../../../components/Area/AdministrativeOldDivision'
import {showImage} from '@/api/common'

const familyColumns = [
  {
    title: '称谓',
    dataIndex: 'appellationText',
    scopedSlots: { customRender: 'renderAppellation' },
    width: '120px'
  },
  {
    title: '姓名',
    dataIndex: 'name',
    scopedSlots: { customRender: 'renderName' },
    width: '180px'
  },
  {
    title: '年龄',
    dataIndex: 'age',
    scopedSlots: { customRender: 'renderAge' },
    width: '100px'
  },
  {
    title: '工作单位及岗位职务',
    dataIndex: 'company',
    scopedSlots: { customRender: 'renderCompany' }
  },
  {
    title: '联系电话',
    dataIndex: 'phone',
    scopedSlots: { customRender: 'renderPhone' },
    width: '180px'
  },
  {
    dataIndex: 'operation',
    title: '',
    scopedSlots: { customRender: 'operation' },
    width: '80px'
  }

]
const educationColumns = [
  {
    title: '起止时间',
    dataIndex: 'startEndDate',
    scopedSlots: { customRender: 'renderStartEndDate' },
    width: '150px'
  },
  {
    title: '学历',
    dataIndex: 'educationText',
    width: '80px'
  },
  {
    title: '院校名称',
    dataIndex: 'schoolName', // 字典
    scopedSlots: { customRender: 'renderSchool' },
    width: '260px'
  },
  {
    title: '所学专业',
    dataIndex: 'majorName', // 字典
    scopedSlots: { customRender: 'renderMajor' },
    width: '260px'
  },
  {
    title: '职务',
    dataIndex: 'post',
    scopedSlots: { customRender: 'renderPost' }
  },
  {
    dataIndex: 'operation',
    title: '',
    scopedSlots: { customRender: 'operation' },
    width: '80px'
  }
]
const workColumns = [
  {
    title: '含实习',
    dataIndex: 'check',
    scopedSlots: { customRender: 'renderIsInternship' },
    width: '80px'
  },
  {
    title: '起止时间',
    dataIndex: 'startEndDate',
    scopedSlots: { customRender: 'renderStartEndDate' },
    width: '200px'
  },
  {
    title: '工作单位',
    dataIndex: 'company',
    scopedSlots: { customRender: 'renderCompany' },
    width: '220px'
  },
  {
    title: '岗位职务',
    dataIndex: 'post',
    scopedSlots: { customRender: 'renderPost' },
    width: '150px'
  },
  {
    title: '离职原因',
    dataIndex: 'reason',
    scopedSlots: { customRender: 'renderReason' }
  },
  {
    dataIndex: 'operation',
    title: '',
    scopedSlots: { customRender: 'operation' },
    width: '80px'
  }
]
const validateIdCard = (rule, value, callback) => {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X)$)/
  if (value === '') {
    callback(new Error('请输入证件号'))
  } else if (reg.test(value) === false) {
    callback(new Error('请输入正确的证件号'))
  } else {
    const year = value.substr(6, 4); const // 身份证年
      month = value.substr(10, 2); const // 身份证月
      date = value.substr(12, 2); const // 身份证日
      time = Date.parse(month + '-' + date + '-' + year); const // 身份证日期时间戳date
      now_time = Date.parse(new Date()); const // 当前时间戳
      dates = (new Date(year, month, 0)).getDate()// 身份证当月天数
    if (parseInt(month) === 0 || parseInt(month) > 12 || parseInt(date) > 31 || time > now_time || date > dates) {
      callback(new Error('请输入正确的证件号'))
    } else {
      callback()
    }
  }
}
const validateCard = (rule, value, callback) => {
  if (value === '' || value === undefined || value === null) {
    callback(new Error('请输入证件号'))
  } else {
    callback()
  }
}
const validateIdPhone = (rule, value, callback) => {
  const reg = /^[1][0-9][0-9]{9}$/
  if (value === '') {
    callback(new Error('请输入手机号'))
  } else if (reg.test(value) === false) {
    callback(new Error('请输入正确的手机号'))
  } else {
    callback()
  }
}
const validateIdEmail = (rule, value, callback) => {
  const reg = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/
  if (value === '') {
    callback(new Error('请输入邮箱'))
  } else if (reg.test(value) === false) {
    callback(new Error('请输入正确的邮箱'))
  } else {
    callback()
  }
}
const validateIdBankAccount = (rule, value, callback) => {
  const num = /^\d*$/// 全数字
  // 开头6位
  const strBin = '10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99'

  if (value === '') {
    callback(new Error('请输入银行卡号'))
  } else if (value.length < 16 || value.length > 19) {
    callback(new Error('请输入正确的银行卡号'))
  } else if (!num.exec(value)) {
    callback(new Error('请输入正确的银行卡号'))
  } else if (strBin.indexOf(value.substring(0, 2)) == -1) {
    callback(new Error('请输入正确的银行卡号'))
  } else if (!luhnCheck(value)) { // Luhn校验
    callback(new Error('请输入正确的银行卡号'))
  } else {
    callback()
  }
}

function luhnCheck (bankno) {
  var lastNum = Number(bankno.substr(bankno.length - 1, 1))// 取出最后一位（与luhn进行比较）

  var first15Num = bankno.substr(0, bankno.length - 1)// 前15或18位
  var newArr = new Array()
  for (var i = first15Num.length - 1; i > -1; i--) { // 前15或18位倒序存进数组
    newArr.push(first15Num.substr(i, 1))
  }
  var arrJiShu = new Array() // 奇数位*2的积 <9
  var arrJiShu2 = new Array() // 奇数位*2的积 >9

  var arrOuShu = new Array() // 偶数位数组
  for (var j = 0; j < newArr.length; j++) {
    if ((j + 1) % 2 == 1) { // 奇数位
      if (parseInt(newArr[j]) * 2 < 9) { arrJiShu.push(parseInt(newArr[j]) * 2) } else { arrJiShu2.push(parseInt(newArr[j]) * 2) }
    } else // 偶数位
    { arrOuShu.push(newArr[j]) }
  }

  var jishu_child1 = []// 奇数位*2 >9 的分割之后的数组个位数
  var jishu_child2 = []// 奇数位*2 >9 的分割之后的数组十位数
  for (var h = 0; h < arrJiShu2.length; h++) {
    jishu_child1.push(parseInt(arrJiShu2[h]) % 10)
    jishu_child2.push(parseInt(arrJiShu2[h]) / 10)
  }

  var sumJiShu = 0 // 奇数位*2 < 9 的数组之和
  var sumOuShu = 0 // 偶数位数组之和
  var sumJiShuChild1 = 0 // 奇数位*2 >9 的分割之后的数组个位数之和
  var sumJiShuChild2 = 0 // 奇数位*2 >9 的分割之后的数组十位数之和
  var sumTotal = 0
  for (var m = 0; m < arrJiShu.length; m++) {
    sumJiShu = sumJiShu + parseInt(arrJiShu[m])
  }

  for (var n = 0; n < arrOuShu.length; n++) {
    sumOuShu = sumOuShu + parseInt(arrOuShu[n])
  }

  for (var p = 0; p < jishu_child1.length; p++) {
    sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p])
    sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p])
  }
  // 计算总和
  sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2)

  // 计算luhn值
  var k = parseInt(sumTotal) % 10 === 0 ? 10 : parseInt(sumTotal) % 10
  var luhn = 10 - k

  return lastNum === luhn
}

const validateIdDivision = (rule, value, callback) => {
  if (value === undefined || value === null) {
    callback(new Error('请选择省市县'))
  } else {
    callback()
  }
}
const validateIdBirthplace = (rule, value, callback) => {
  if (value === undefined || value === null) {
    callback(new Error('请选择出生地'))
  } else {
    callback()
  }
}
const validateIdNativePlace = (rule, value, callback) => {
  if (value === undefined || value === null) {
    callback(new Error('请选择籍贯'))
  } else {
    callback()
  }
}

const rules = {
  personName: [{ required: true, message: '请填写姓名', trigger: 'blur' }],
  idCardType: [{ required: true, message: '请选择证件类型', trigger: 'change' }],
  startDate: [{ required: true, message: '请选择报到日期', trigger: 'change' }],
  idCard: [{ required: true }],
  education: [{ required: true, message: '请选择文化程度', trigger: 'change' }],
  graduateDate: [{ required: true, message: '请选择毕业日期', trigger: 'change' }],
  phone: [{ required: true, validator: validateIdPhone, trigger: 'blur' }],
  email: [{ required: true, validator: validateIdEmail, trigger: 'blur' }],
  company: [{ required: true, message: '请选择所属公司', trigger: 'change' }],
  appliedPosition: [{ required: true, message: '请选择应聘岗位', trigger: 'blur' }],
  jobCategory: [{ required: true, message: '请选择岗位大类', trigger: 'blur' }],
  dept: [{ required: true, message: '请选择录用部门', trigger: 'change' }],
  personnelGroup: [{ required: true, message: '请选择人员归属群', trigger: 'blur' }],
  probationPeriod: [{ required: true, message: '请填写试用期', trigger: 'blur' }],
  trialSalary: [{ required: true, message: '请填写试用期薪资', trigger: 'blur' }],
  internshipSalary: [{ required: true, message: '请填写实习薪资', trigger: 'blur' }],
  workedYears: [{ required: true, message: '请填写入司前工龄', trigger: 'blur' }],
  regularSalary: [{ required: true, message: '请填写转正薪资', trigger: 'blur' }],
  registrant: [{ required: true, message: '请选择HR联系人', trigger: 'change' }],
  paymentBase: [{ required: true, message: '请填写社保缴纳基数', trigger: 'blur' }],
  recruitmentType: [{ required: true, message: '请选择招聘类型', trigger: 'change' }],
  paymentPlace: [{ required: true, message: '请选择社保缴纳地', trigger: 'change' }],
  employmentNotes: [{ required: true, message: '请选择录用备注', trigger: 'change' }],
  communicationSubsidy: [{ required: true, message: '请选择通讯补贴', trigger: 'change' }],
  localFlag: [{ required: true, message: '请选择本地化', trigger: 'change' }],
  divisionCounty: [{ required: false }],
  birthplace: [{ required: true, validator: validateIdBirthplace, trigger: 'change' }],
  nativePlace: [{ required: true, validator: validateIdNativePlace, trigger: 'change' }],
  nation: [{ required: true, message: '请选择民族', trigger: 'change' }],
  height: [{ required: true, message: '请填写身高', trigger: 'blur' }],
  weight: [{ required: true, message: '请填写体重', trigger: 'blur' }],
  bloodType: [{ required: true, message: '请选择血型', trigger: 'change' }],
  continuousYearsMark: [{ required: true, message: '请选择入司是否连续工龄', trigger: 'change' }],
  maritalStatus: [{ required: true, message: '请选择婚姻状况', trigger: 'change' }],
  politicalOutlook: [{ required: true, message: '请选择政治面貌', trigger: 'change' }],
  needApplyCard: [{ required: true, message: '请选择是否需办卡', trigger: 'change' }],
  accountNature: [{ required: true, message: '请选择户口性质', trigger: 'change' }],
  depositBank: [{ required: true, message: '请选择银行类别', trigger: 'change' }],
  registeredAddress: [{ required: true, message: '请填写户口详细地址', trigger: 'blur' }],
  homeAddress: [{ required: true, message: '请填写家庭地址', trigger: 'blur' }],
  openingBank: [{ required: true, message: '请填写开户行', trigger: 'blur' }],
  bankAccount: [{ required: true, trigger: ['blur', 'change'] }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  birthDate: [{ required: true, message: '请选择出生日期', trigger: 'change' }],
  workCardFlag: [{ required: true, message: '请选择是否办理总部工牌', trigger: 'change' }],
  mealRechargeFlag: [{ required: true, message: '请选择餐补是否充值入工牌', trigger: 'change' }]
}
const compare = function (obj1, obj2) {
  const val1 = obj1.key
  const val2 = obj2.key
  if (val1 < val2) {
    return -1
  } else if (val1 > val2) {
    return 1
  } else {
    return 0
  }
}
export default {
  name: 'EmployeeAuditInfo',
  components: {
    AdministrativeOldDivision,
    AdministrativeNewDivision,
    WorkModal,
    FamilyModal,
    EducationModal,
    SearchSelect,
    VueHoverMask,
    ACol,
    ARow,
    PersonSearchSelect,
    DeptSelect,
    AFormModelItem,
    AFormModel,
    MemorySelect,
    PublicDicSelect,
    SystemDicSelect,
    HrDicSelect,
    GeneralDicSelect},
  props: {
    recruitmentInfoId: {
      type: Number,
      required: true
    },
    disabled: {
      type: Boolean,
      required: false
    }
  },
  data () {
    return {
      saveLoading:false,
      markSetting: { watermark_txt: store.getters.userInfo.personId, watermark_x: 200 },
      familyLoading: false,
      educationLoading: false,
      workLoading: false,
      educationInfo: {},
      lastWorkDate: '',
      photo: [],
      personImages: [],
      type: 'old',
      headPic: '',
      frontIdCardPic: '',
      reverseIdCardPic: '',
      backCardPhotoPic: '',
      emailSource: [],
      container: () => document.getElementById('content'),
      targetOffset: undefined,
      familyDefaultId: 0,
      educationDefaultId: 0,
      workDefaultId: 0,
      educationColumns,
      workColumns,
      familyColumns,
      moment,
      form: {
        personName: '',
        birthDate: null,
        gender: null,
        genderText: null,
        communicationSubsidy: 8,
        county: null,
        city: null,
        province: null,
        idCardType: 1,
        registrationTime: null,
        startDate: null,
        localFlag: null,
        isUse: null,
        firstWork: null,
        probationPeriod: 3,
        division: [],
        paymentFlag: 1,
        depositBank: null,
        openingBank: null,
        bankAccount: null,
        personnelGroup: null,
        sameBsoft: null,
        workCardFlag: null,
        mealRechargeFlag: null,
        continuousYearsMark: null
      },
      familyData: [],
      educationData: [],
      workData: [],
      appliedPositionDic: [],
      educationDic: [],
      employmentNotesDic: [],
      companyDic: [],
      jobCategoryDic: [],
      personnelGroupDic: [],
      paymentPlaceDic: [],
      communicationSubsidyDic: [],
      schoolDic: [],
      majorDic: [],
      appellationDic: [],
      nationDic: [],
      bloodTypeDic: [],
      maritalStatusDic: [],
      politicalOutlookDic: [],
      accountNatureDic: [],
      familyInfo: {},
      edcationInfo: {},
      workInfo: {},
      informationForm: { birthDate: null, gender: null, genderText: null },
      fileList: [],
      uploading: false,
      imageDic: ['jpg', 'jpeg', 'png', 'bmp']
    }
  },
  computed: {
    viewHeight: function () {
      return window.innerHeight
    },
    formHeight: function () {
      return this.disabled ? window.innerHeight : window.innerHeight - 60
    },
    isUseDisabled: function () {
      return this.form.recruitmentType !== 1
    },
    genderDisabled: function () {
      return this.form.idCardType === 1
    },
    getRules: function () {
      if (this.form.recruitmentType === 1) {
        rules.isUse = [{ required: true, message: '请选择是否留用', trigger: 'change' }]
        rules.internshipSalary = [{ required: true, message: '请填写实习薪资', trigger: 'blur' }]
      } else {
        rules.isUse = [{ required: false }]
        rules.internshipSalary = [{ required: false }]
      }
      if (this.form.employmentNotes === 4) {
        rules.employmentNotesDetail = [{ required: true, message: '请填写其他说明', trigger: 'blur' }]
      } else {
        rules.employmentNotesDetail = [{ required: false }]
      }
      if (this.form.paymentFlag === 1){
          rules.paymentBase = [{ required: true, message: '请填写社保缴纳基数', trigger: 'blur' }]
          rules.paymentPlace = [{ required: true, message: '请选择社保缴纳地', trigger: 'change' }]
      }else{
          rules.paymentBase = [{ required: false }]
          rules.paymentPlace = [{ required: false }]
      }
      // if (this.form.employmentNotes === 1 || this.form.employmentNotes === 4) {
      //   rules.paymentBase = [{ required: false }]
      //   rules.paymentPlace = [{ required: false }]
      // } else {
      //   rules.paymentBase = [{ required: true, message: '请填写社保缴纳基数', trigger: 'blur' }]
      //   rules.paymentPlace = [{ required: true, message: '请选择社保缴纳地', trigger: 'change' }]
      // }

      if (this.form.needApplyCard === 1) {
        rules.depositBank = [{ required: false }]
        rules.openingBank = [{ required: false }]
        rules.bankAccount = [{ required: false }]
      } else {
        rules.depositBank = [{ required: true, message: '请选择银行类别', trigger: 'change' }]
        rules.openingBank = [{ required: true, message: '请填写开户行', trigger: 'blur' }]
        rules.bankAccount = [{ required: true, validator: validateIdBankAccount, trigger: 'blur' }]
      }
      if (this.form.idCardType === 1) {
        rules.idCard = [{ required: true, validator: validateIdCard, trigger: 'blur' }]
      } else {
        rules.idCard = [{ required: true, validator: validateCard, trigger: 'blur' }]
      }
      if (this.form.localFlag === 0) {
        rules.divisionCounty = [{ required: false }]
      } else {
        rules.divisionCounty = [{ required: true, validator: validateIdDivision, trigger: 'change' }]
      }
      if (this.form.company === 60 || this.form.company === 85) {
        rules.sameBsoft = [{ required: true, message: '请选择是否同创业生成补贴', trigger: 'change' }]
      } else {
        rules.sameBsoft = [{ required: false }]
      }
      return rules
    },
    getPhoto: function () {
      if (this.personImages.length === 0) {
        return []
      } else if (this.personImages.length === 4) {
        this.personImages.sort(compare)
        this.personImages.forEach(item => this.photo.push(item.src))
        return this.photo
      } else {
        return []
      }
    }
  },
  created () {
    const me = this
    me.loading = true
    initRecruitmentAuditInfo()
      .then(res => {
        if (res.code === 200) {
          me.communicationSubsidyDic = res.body.communicationSubsidyDic
          me.companyDic = res.body.companyDic
          me.schoolDic = res.body.schoolDic
          me.majorDic = res.body.majorDic
          me.appellationDic = res.body.appellationDic
        }
        me.loading = false
      })
    this.getAuditInfo()
  },
  mounted () {
    this.targetOffset = window.innerHeight / 4
  },
  methods: {
    changeGraduateDate(){
      this.$forceUpdate()
    },
    doChangeStartDate(){
      if (this.form.dept == null){
        return
      }
      var year = new Date(this.form.startDate).getFullYear()
      const param = { deptId: this.form.dept, year: year }
      this.personnelGroupDic = []
      getPersonnelGroupDic(param).then(res => {
        if (res.code === 200) {
          this.personnelGroupDic = res.body
          if (this.personnelGroupDic.length > 0) {
            this.form.personnelGroup = this.personnelGroupDic[0].id
          } else {
            this.form.personnelGroup = null
          }
        }
      })
    },
    companySelectChange (value) {
      if(value === 60 || value === 85){
        this.form.sameBsoft = 1
      }
      if (value !== 60 && value !== 85) {
        this.form.sameBsoft = null
      }
    },
    beforeUpload (file) {
      const isLt5M = file.size / 1024 / 1024 < 5
      const suffix = file.name.substr(file.name.lastIndexOf('.') + 1).toLowerCase()
      const match = this.imageDic.includes(suffix)
      if (!isLt5M) {
        this.$message.error('单个文件不超过5M!')
        return false
      } else if (!match) {
        this.$message.error('文件格式不对!')
        return false
      } else {
        this.fileList = [file]
        return true
      }
    },
    handleUpload () {
      if (this.form.oneInchPhoto) {
        this.handleRewriteImage()
      } else {
        this.handleUploadImage()
      }
    },
    handleRewriteImage () {
      this.uploading = true
      const { fileList } = this
      const formData = new FormData()
      fileList.forEach(file => {
        formData.append('file', file)
      })
      formData.append('fileId', this.form.oneInchPhoto) // 图片id
      const me = this
      rewriteImage(formData).then(res => {
        if (res.code === 200) {
          this.$message.success('图片修改成功！')
          this.personImages[0] = { key: 0, src: showImage(this.form.oneInchPhoto, moment().millisecond())  }
          this.regetPhoto()
        }
        me.uploading = false
      })
    },
    handleImageEnlarge () {
      // 直接显示图片
      const viewer = this.$refs.viewer.$viewer
      viewer.show()
    },
    handleUploadImage () {
      this.uploading = true
      const { fileList } = this
      const formData = new FormData()
      fileList.forEach(file => {
        formData.append('file', file)
      })
      formData.append('menuId', this.$route.meta.id) // 菜单id
      const me = this
      uploadImage(formData).then(res => {
        if (res.code === 200) {
          this.$message.success('图片上传成功！')
          this.form.oneInchPhoto = res.body
          if (this.form.oneInchPhoto != null) {
            this.personImages[0] = { key: 0, src: showImage(this.form.oneInchPhoto, moment().millisecond()) }
            this.regetPhoto()
          }
        }
        me.uploading = false
      })
    },
    regetPhoto () {
      if (this.personImages.length === 0) {
        return []
      } else if (this.personImages.length === 4) {
        this.photo = []
        this.personImages.sort(compare)
        this.personImages.forEach(item => this.photo.push(item.src))
        return this.photo
      } else {
        return []
      }
    },
    handleRemove (file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    applyCardChange (e) {
      this.form.depositBank = null
      this.form.openingBank = null
      this.form.bankAccount = null
    },
    onFamilyClickRow (record) {
      const me = this
      return {
        on: {
          mouseenter: () => {
            record.show = true
          },
          mouseleave: () => {
            record.show = false
          },
          dblclick: () => {
            this.familyInfo = { ...record }
            this.$refs.familyModal.handleOpen('read')
          }
        }
      }
    },
    onWorkClickRow (record) {
      const me = this
      return {
        on: {
          mouseenter: () => {
            record.show = true
          },
          mouseleave: () => {
            record.show = false
          },
          dblclick: () => {
            this.workInfo = { ...record }
            this.$refs.workModal.handleOpen('read')
          }
        }
      }
    },
    onEducationClickRow (record) {
      const me = this
      return {
        on: {
          mouseenter: () => {
            record.show = true
          },
          mouseleave: () => {
            record.show = false
          },
          dblclick: () => {
            this.educationInfo = { ...record }
            this.$refs.educationModal.handleOpen('read', record)
          }
        }
      }
    },
    disabledGtDate (current) {
      return current > moment().endOf('day')
    },
    disabledDate (current) {
      return current < moment().startOf('day')
    },
    setSchool (value, record) {
      record.school = value.id
      record.schoolName = value.name
    },
    setMajor (value, record) {
      record.major = value.id
      record.majorName = value.name
    },
    getAuditInfo () {
      const me = this
      me.loading = true
      const param = { id: me.recruitmentInfoId }
      getRecruitmentAuditInfo(param).then(res => {
        if (res.code === 200) {
          me.form = res.body.recruitmentInfoView
          me.form.startDate = me.form.startDate == null ? null : moment(me.form.startDate)
          me.form.graduateDate = me.form.graduateDate == null ? null : moment(me.form.graduateDate)
          me.form.firstWork = me.form.firstWork == null ? null : moment(me.form.firstWork)
          me.form.birthDate = me.form.birthDate == null ? null : moment(me.form.birthDate)
          me.form.jobCategory = !me.form.jobCategory ? null : parseInt(me.form.jobCategory);
          this.initDic()

          me.showPersonelImage()
          res.body.educationList.forEach((value) => {
            value.startEndDate = [moment(value.startDate), moment(value.endDate)]
            value.show = false
          })
          res.body.familyList.forEach((value) => {
            value.show = false
          })
          res.body.workList.forEach((value) => {
            value.startEndDate = [moment(value.startDate), moment(value.endDate)]
            value.check = value.isInternship === 1
            value.show = false
          })
          if (res.body.workList != null && res.body.workList.length > 0) {
            me.lastWorkDate = res.body.workList[0].endDate
          } else {
            me.lastWorkDate = ''
          }
          if (me.form.continuousYearsMark == null) {
            if (me.lastWorkDate !== '') {
              if (moment(me.lastWorkDate).diff(me.form.startDate, 'months') <= 1) {
                me.form.continuousYearsMark = 1
              } else {
                me.form.continuousYearsMark = 2
              }
            }
          }

          me.familyData = res.body.familyList
          me.educationData = res.body.educationList
          me.workData = res.body.workList
        }
        me.loading = false
      })
    },
    initDic () {
      const me = this
      me.$refs.person.getCurrent(me.form.registrant, me.form.registrantName)
      me.$refs.dept.getCurrent(me.form.dept, me.form.deptText)
      const divisions = [me.form.divisionProvince, me.form.divisionCity, me.form.divisionCounty].filter(Boolean)
      const divisionOption = [{
        name: me.form.divisionProvinceText,
        id: me.form.divisionProvince
      }]
      if (me.form.divisionCity === null) {
        divisionOption[0].children = [{
          name: me.form.divisionCountyText,
          id: me.form.divisionCounty
        }]
      } else {
        divisionOption[0].children = [{
          name: me.form.divisionCityText,
          id: me.form.divisionCity,
          children: [{
            name: me.form.divisionCountyText,
            id: me.form.divisionCounty
          }]
        }]
      }
      me.$refs.divisionCounty.getCurrent(divisions, divisionOption)
      const birValue = [me.form.birthplaceProvince, me.form.birthplaceCity, me.form.birthplace]
      const birOption = [{
        name: me.form.birthplaceProvinceText,
        code: me.form.birthplaceProvince,
        children: [{
          name: me.form.birthplaceCityText,
          code: me.form.birthplaceCity,
          children: [{
            name: me.form.birthplaceText,
            code: me.form.birthplace
          }]
        }]
      }]

      me.$refs.birthplace.getCurrent(birValue, birOption)
      const nativeValue = [me.form.nativePlaceProvince, me.form.nativePlaceCity, me.form.nativePlace]
      const nativeOption = [{
        name: me.form.nativePlaceProvinceText,
        code: me.form.nativePlaceProvince,
        children: [{
          name: me.form.nativePlaceCityText,
          code: me.form.nativePlaceCity,
          children: [{
            name: me.form.nativePlaceText,
            code: me.form.nativePlace
          }]
        }]
      }]
      me.$refs.nativePlace.getCurrent(nativeValue, nativeOption)
      me.communicationSubsidyDic = [{ id: me.form.communicationSubsidy, name: me.form.communicationSubsidyText }]
      me.educationDic = [{ id: me.form.education, name: me.form.educationText }]
      me.appliedPositionDic = [{ id: me.form.appliedPosition, name: me.form.appliedPositionText }]
      me.employmentNotesDic = [{ id: me.form.employmentNotes, name: me.form.employmentNotesText }]
      me.companyDic = [{ companyId: me.form.company, abbreviation: me.form.companyText }]
      me.jobCategoryDic = [{ id: me.form.jobCategory, name: me.form.jobCategoryText }]
      me.personnelGroupDic = [{ id: me.form.personnelGroup, name: me.form.personnelGroupText }]
      me.paymentPlaceDic = [{ companyId: me.form.paymentPlace, abbreviation: me.form.paymentPlaceText }]
      me.nationDic = [{ id: me.form.nation, name: me.form.nationText }]
      me.bloodTypeDic = [{ id: me.form.bloodType, name: me.form.bloodTypeText }]
      me.maritalStatusDic = [{ id: me.form.maritalStatus, name: me.form.maritalStatusText }]
      me.politicalOutlookDic = [{ id: me.form.politicalOutlook, name: me.form.politicalOutlookText }]
      me.accountNatureDic = [{ id: me.form.accountNature, name: me.form.accountNatureText }]
    },
    filterCompanyOption (input, option) {
      return (
        option.data.attrs.detail.pinyinCode == null
          ? option.data.attrs.detail.companyName.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
            option.data.attrs.detail.abbreviation.indexOf(input) >= 0
          : option.data.attrs.detail.pinyinCode.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
            option.data.attrs.detail.companyName.indexOf(input) >= 0 ||
            option.data.attrs.detail.abbreviation.indexOf(input) >= 0
      )
    },
    filterOption (input, option) {
      return (
        option.data.attrs.detail.pinyin == null
          ? option.data.attrs.detail.name.toLowerCase().indexOf(input.toLowerCase()) >= 0
          : option.data.attrs.detail.pinyin.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
            option.data.attrs.detail.name.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    showPersonelImage: function () {
      const me = this
      this.personImages = []
      if (this.form.oneInchPhoto !== null) {
        me.personImages.push({ key: 0, src: showImage(this.form.oneInchPhoto, moment().millisecond()) })
      } else {
        me.personImages.push({ key: 0, src: null })
      }
      if (this.form.frontIdCard !== null) {
        me.personImages.push({ key: 1, src: showImage(this.form.frontIdCard) })
      } else {
        me.personImages.push({ key: 1, src: null })
      }
      if (this.form.reverseIdCard !== null) {
        me.personImages.push({ key: 2, src: showImage(this.form.reverseIdCard)  })
      } else {
        me.personImages.push({ key: 2, src: null })
      }
      if (this.form.backCardPhoto !== null) {
        me.personImages.push({ key: 3, src: showImage( this.form.backCardPhoto) })
      } else {
        me.personImages.push({ key: 3, src: null })
      }
    },
    idCardChange (e) {
      const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X)$)/

      if (reg.test(e.target.value) === true) {
        const year = e.target.value.substr(6, 4); const // 身份证年
          month = e.target.value.substr(10, 2); const // 身份证月
          date = e.target.value.substr(12, 2); const // 身份证日
          time = Date.parse(month + '-' + date + '-' + year); const // 身份证日期时间戳date
          now_time = Date.parse(new Date()); const // 当前时间戳
          dates = (new Date(year, month, 0)).getDate()// 身份证当月天数
        if (!(parseInt(month) === 0 || parseInt(month) > 12 || parseInt(date) > 31 || time > now_time || date > dates)) {
          if (e.target.value.length === 15) {
            this.form.birthDate = moment(`19${e.target.value.substr(6, 2)}-${e.target.value.substr(8, 2)}-${e.target.value.substr(10, 2)}`)
            this.form.gender = (e.target.value.substr(14, 1) % 2) || 2
          }
          if (e.target.value.length === 18) {
            this.form.birthDate = moment(`${e.target.value.substr(6, 4)}-${e.target.value.substr(10, 2)}-${e.target.value.substr(12, 2)}`)
            this.form.gender = (e.target.value.substr(16, 1) % 2) || 2
          }
          this.$refs.ruleForm.clearValidate('gender')
          this.$refs.ruleForm.clearValidate('birthDate')
        }
      } else {
        this.form.birthDate = null
        this.form.gender = ''
      }
    },
    handleChange (value) {
      this.emailSource =
          !value || value.indexOf('@') >= 0
            ? []
            : [`${value}@gmail.com`, `${value}@163.com`, `${value}@qq.com`]
    },
    employmentNotesSelect (value) {
      if (value !== 4) {
        this.form.employmentNotesDetail = ''
        this.$refs.ruleForm.clearValidate('employmentNotesDetail')
      }
    },
    cardTypeSelect (value) {
      this.form.idCard = null
      this.form.gender = null
      this.form.birthDate = null
      this.$refs.ruleForm.clearValidate('idCard')
      this.$refs.ruleForm.clearValidate('gender')
      this.$refs.ruleForm.clearValidate('birthDate')
    },
    setDivision (newVal, oldVal) {
      this.form.divisionProvince = newVal.province
      this.form.divisionCity = newVal.city
      this.form.divisionCounty = newVal.county
      this.form.province = newVal.province
      this.form.city = newVal.city
      this.form.county = newVal.county
    },
    getFamilyInfo () {
      const me = this
      me.familyLoading = true
      const param = { recruitmentId: me.recruitmentInfoId }
      getFamilyList(param).then(res => {
        if (res.code === 200) {
          res.body.forEach((value) => {
            value.show = false
          })
          me.familyData = res.body
        }
        me.familyLoading = false
      })
    },
    getEducationInfo () {
      const me = this
      me.educationLoading = true
      const param = { recruitmentId: me.recruitmentInfoId }
      getEducationList(param).then(res => {
        if (res.code === 200) {
          res.body.forEach((value) => {
            value.show = false
            value.startEndDate = [moment(value.startDate), moment(value.endDate)]
          })
          me.educationData = res.body
        }
        me.educationLoading = false
      })
    },
    getWorkInfo () {
      const me = this
      me.workLoading = true
      me.refreshWorYears()
      const param = { recruitmentId: me.recruitmentInfoId }
      getWorkList(param).then(res => {
        if (res.code === 200) {
          res.body.forEach((value) => {
            value.startEndDate = [moment(value.startDate), moment(value.endDate)]
            value.check = value.isInternship === 1
            value.show = false
          })
          me.workData = res.body
          if (res.body != null && res.body.length > 0) {
            me.lastWorkDate = res.body[0].endDate
          } else {
            me.lastWorkDate = ''
          }
        }
        me.workLoading = false
      })
    },
    refreshWorYears () {
      const me = this
      getWorkYears({ employId: this.recruitmentInfoId }).then(res => {
        if (res.code === 200) {
          me.form.workedYears = res.body
        }
      })
    },
    doFamilyAdd () {
      this.$refs.familyModal.handleOpen('create')
    },
    doFamilyDelete (index, record) {
      const me = this
      if (record.id > 0) {
        const param = { id: record.id }
        deleteFamily(param).then(res => {
          if (res.code === 200) {
            me.$message.success('删除成功')
            me.familyData.splice(index, 1)
          } else {
            me.$message.error('删除失败')
          }
        })
      } else {
        this.familyData.splice(index, 1)
      }
    },
    doEducationAdd () {
      this.$refs.educationModal.handleOpen('create')
    },
    doEducationDelete (index, record) {
      const me = this
      if (record.id > 0) {
        const param = { id: record.id }
        deleteEducation(param).then(res => {
          if (res.code === 200) {
            me.$message.success('删除成功')
            me.educationData.splice(index, 1)
          } else {
            me.$message.error('删除失败')
          }
        })
      } else {
        this.educationData.splice(index, 1)
      }
    },
    doWorkAdd () {
      this.$refs.workModal.handleOpen('create')
    },
    doWorkDelete (index, record) {
      const me = this
      if (record.id > 0) {
        const param = { id: record.id }
        deleteWork(param).then(res => {
          if (res.code === 200) {
            me.$message.success('删除成功')
            me.refreshWorYears()
            me.workData.splice(index, 1)
          } else {
            me.$message.error('删除失败')
          }
        })
      } else {
        this.workData.splice(index, 1)
      }
    },
    setPerson (record) {
      this.form.registrantName = record.personName
      this.form.registrantPhone = record.mobile
      this.form.registrantEmail = record.email
      if (this.form.company === undefined || this.form.company === null) {
        this.form.company = record.company
      }
      this.$refs.ruleForm.clearValidate('registrant')
    },
    stageGroupChange (e) {
      this.form.recruitmentType = e.target.value
      this.form.isUse = null
      if (e.target.value === 0) {
        this.form.communicationSubsidy = 8
        this.form.internshipSalary = null
        this.$refs.ruleForm.clearValidate('internshipSalary')
        this.$refs.ruleForm.clearValidate('isUse')
      } else if (e.target.value === 1) {
        this.form.communicationSubsidy = 9
        this.form.trialSalary = null
        this.form.regularSalary = null
      } else {
        this.form.communicationSubsidy = null
        this.form.internshipSalary = null
        this.$refs.ruleForm.clearValidate('internshipSalary')
        this.$refs.ruleForm.clearValidate('isUse')
      }
      if (e.target.value === 1 || e.target.value === 4) {
        this.form.paymentFlag = 2
        this.form.paymentBase = null
        this.form.paymentPlace = null
      } else {
        this.form.paymentFlag = 1
      }
    },
    isUseChange (e) {
      this.form.isUse  = e.target.value
      this.$forceUpdate();
    },
    paymentFlagChange (e) {
      this.form.paymentFlag = e.target.value
      if (e.target.value === 2) {
        this.form.paymentBase = null
        this.form.paymentPlace = null
      }
    },
    workCardFlagChange (e) {
      if (e.target.value === 0) {
        this.form.mealRechargeFlag = 0
      }
    },
    mealRechargeFlagChange (e) {
      if (e.target.value === 1) {
        this.form.workCardFlag = 1
      }
    },
    continuousYearsMarkChange (e) {
      this.form.continuousYearsMark = e.target.value
    },
    localChange (e) {
      this.form.localFlag = e.target.value
      this.$refs.ruleForm.clearValidate('divisionCounty')
    },
    editFamilyRecord (record) {
      this.familyInfo = { ...record }
      this.$refs.familyModal.handleOpen('update')
    },
    editWorkRecord (record) {
      this.workInfo = { ...record }
      this.$refs.workModal.handleOpen('update')
    },
    editEducationRecord (record) {
      this.educationInfo = { ...record }
      this.$refs.educationModal.handleOpen('update', record)
    },
    doBack () {
      const me = this
      doBack({ employId: this.recruitmentInfoId }).then(res => {
        if (res.code === 200) {
          me.$message.success('退回成功')
          setTimeout(function () {
            me.$emit('close')
          }, 500)
        } else {
          me.$message.error('退回失败!')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    saveInfo () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.form.status === 7) {
            this.saveToServe(7)
          } else {
            this.saveToServe(5)
          }
        } else {
          return false
        }
      })
    },
    auditInfo () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.saveToServe(7)
        } else {
          return false
        }
      })
    },
    headquartersAuditInfo () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.saveToServe(8)
        } else {
          return false
        }
      })
    },
    getEducationDic () {
      if (this.educationDic.length === 0 || this.educationDic.length === 1) {
        this.educationDic = []
        const param = { type: 10 }
        getHumanDic(param).then(res => {
          if (res.code === 200) {
            this.educationDic = res.body
          }
        })
      }
    },
    getCompanyDic () {
      if (this.companyDic.length === 0 || this.companyDic.length === 1) {
        const param = { type: 3 }
        this.companyDic = []
        getCompanyDic(param).then(res => {
          if (res.code === 200) {
            this.companyDic = res.body
          }
        })
      }
    },
    getPersonnelGroupDic () {
      if (this.form.dept === undefined || this.form.dept == null) {
        this.$message.warn('请先选择录用部门')
        return
      }
      if (this.form.startDate === undefined || this.form.startDate == null) {
        this.$message.warn('请先选择报道日期')
        return
      }
      var year = new Date(this.form.startDate).getFullYear()
      const param = { deptId: this.form.dept, year: year }
      this.personnelGroupDic = []
      getPersonnelGroupDic(param).then(res => {
        if (res.code === 200) {
          this.personnelGroupDic = res.body
          if (this.personnelGroupDic.length > 0) {
            this.form.personnelGroup = this.personnelGroupDic[0].id
          } else {
            this.form.personnelGroup = null
          }
        }
      })
    },
    deptChange (value) {
      // 修改录用部门
      this.getPersonnelGroupDic()
    },
    memoryDeptChange(value){
      this.getPersonnelGroupDic()
    },
    getPaymentPlaceDic () {
      if (this.paymentPlaceDic.length === 0 || this.paymentPlaceDic.length === 1) {
        const param = { type: 2 }
        this.paymentPlaceDic = []
        getCompanyDic(param).then(res => {
          if (res.code === 200) {
            this.paymentPlaceDic = res.body
          }
        })
      }
    },
    getSubsidyDic () {
      if (this.communicationSubsidyDic.length === 0 || this.communicationSubsidyDic.length === 1) {
        this.communicationSubsidyDic = []
        getSubsidy().then(res => {
          if (res.code === 200) {
            this.communicationSubsidyDic = res.body
          }
        })
      }
    },
    getEmploymentNotesDic () {
      if (this.employmentNotesDic.length === 0 || this.employmentNotesDic.length === 1) {
        const param = { type: 3010 }
        this.employmentNotesDic = []
        getPublicDic(param).then(res => {
          if (res.code === 200) {
            this.employmentNotesDic = res.body
          }
        })
      }
    },
    getNationDic () {
      if (this.nationDic.length === 0 || this.nationDic.length === 1) {
        const param = { type: 3 }
        this.nationDic = []
        getHumanDic(param).then(res => {
          if (res.code === 200) {
            this.nationDic = res.body
          }
        })
      }
    },
    getBloodTypeDic () {
      if (this.bloodTypeDic.length === 0 || this.bloodTypeDic.length === 1) {
        const param = { type: 12 }
        this.bloodTypeDic = []
        getHumanDic(param).then(res => {
          if (res.code === 200) {
            this.bloodTypeDic = res.body
          }
        })
      }
    },
    getMaritalStatusDic () {
      if (this.maritalStatusDic.length === 0 || this.maritalStatusDic.length === 1) {
        const param = { type: 13 }
        this.maritalStatusDic = []
        getHumanDic(param).then(res => {
          if (res.code === 200) {
            this.maritalStatusDic = res.body
          }
        })
      }
    },
    getPoliticalOutlookDic () {
      if (this.politicalOutlookDic.length === 0 || this.politicalOutlookDic.length === 1) {
        const param = { type: 7 }
        this.politicalOutlookDic = []
        getHumanDic(param).then(res => {
          if (res.code === 200) {
            this.politicalOutlookDic = res.body
          }
        })
      }
    },
    getAccountNatureDic () {
      if (this.accountNatureDic.length === 0 || this.accountNatureDic.length === 1) {
        const param = { type: 34 }
        this.accountNatureDic = []
        getHumanDic(param).then(res => {
          if (res.code === 200) {
            this.accountNatureDic = res.body
          }
        })
      }
    },
    getJobCategory () {
      if (this.jobCategoryDic.length === 0 || this.jobCategoryDic.length === 1) {
        const param = { type: 2 }
        this.jobCategoryDic = []
        getHumanDic(param).then(res => {
          if (res.code === 200) {
            this.jobCategoryDic = res.body
          }
        })
      }
    },
    getAppliedPositionDic () {
      if (this.appliedPositionDic.length === 0 || this.appliedPositionDic.length === 1) {
        const param = { type: 14 }
        this.appliedPositionDic = []
        getHumanDic(param).then(res => {
          if (res.code === 200) {
            this.appliedPositionDic = res.body
          }
        })
      }
    },
    saveToServe (status) {
      if (this.familyData.length === 0) {
        this.$notification['error']({
          message: '请填写至少一条家庭情况！'
        })
        return
      }
      if (this.educationData.length === 0) {
        this.$notification['error']({
          message: '请填写至少一条教育经历！'
        })
        return
      }
      if (this.form.firstWork !== null) {
        if (this.workData.length === 0) {
          this.$notification['error']({
            message: '请填写至少一条工作经历！'
          })
          return
        }
      }
      this.loading = true
      this.saveLoading = true
      this.informationForm = { ...this.form }
      this.informationForm.startDate = this.informationForm.startDate.format('YYYY-MM-DD')
      if (this.informationForm.graduateDate !== undefined && this.informationForm.graduateDate !== null) {
        this.informationForm.graduateDate = this.informationForm.graduateDate.format('YYYY-MM-DD')
      }
      if (this.informationForm.firstWork !== undefined && this.informationForm.firstWork !== null) {
        this.informationForm.firstWork = this.informationForm.firstWork.format('YYYY-MM-DD')
      }
      if (this.informationForm.birthDate !== undefined && this.informationForm.birthDate !== null) {
        this.informationForm.birthDate = this.informationForm.birthDate.format('YYYY-MM-DD')
      }
      this.informationForm.status = status
      const me = this
      const param = {}
      const family = [...this.familyData]

      const education = [...this.educationData]
      education.forEach((value) => {
        value.startDate = value.startEndDate[0]
        value.endDate = value.startEndDate[1]
        if (value.school === null) {
          const a = me.schoolDic.find(item => item.name === value.schoolName)
          if (a) {
            value.school = a.id
          }
        }
        if (value.major !== null) {
          const b = me.majorDic.find(item => item.name === value.majorName)
          if (b) {
            value.marjor = b.id
          }
        }
      })
      const work = [...this.workData]
      work.forEach((value) => {
        value.startDate = value.startEndDate[0]
        value.endDate = value.startEndDate[1]
        value.isInternship = value.check ? 1 : 0
      })

      param['familyList'] = family
      param['educationList'] = education
      param['workList'] = work
      param['recruitmentInfoView'] = this.informationForm
      saveRecruitmentAuditInfo(param).then(res => {
        if (res.code === 200) {
          if (status === 5 || status === 7) {
            me.$message.success('保存成功')
          } else {
            me.$message.success('审核成功')
          }
          setTimeout(function () {
            me.$emit('close')
          }, 500)
        }
        me.loading = false
        me.saveLoading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .deptBorder {
    overflow:hidden;
    white-space: nowrap;
    -o-text-overflow:ellipsis;
    text-overflow: ellipsis;
    margin:0 auto;
    color: #1890FF;
    font-size: 12px;
    border:1.5px solid #1890FF;
    border-radius:30px;
    text-align: center;
  }

  .leftImg{
    background: url(~@/assets/leftBackground.png) no-repeat 100%;
    background-size: 340px auto;
  }

 .title {
   width: 100%;
   display: inline-block;
   -webkit-box-flex: 1;
   flex: 1;
   padding: 12px 0;
   overflow: hidden;
   white-space: nowrap;
   text-overflow: ellipsis;
   font-weight: bold;
   font-size: 14px;
   padding-left: 24px;
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

 /deep/.ant-drawer-wrapper-body {
   height: 100%;
   overflow: hidden;
 }

  /deep/.ant-drawer-wrapper-body {
    height: 100%;
    overflow: hidden;
  }

 .certificates-image {
   width: 80px;
   height: 45px;
   cursor: pointer;
 }

  /deep/ #family .ant-card-body {
    padding: 0
  }
 /deep/ #education .ant-card-body {
   padding: 0
 }
 /deep/ #work .ant-card-body {
   padding: 0
 }
  /deep/ .ant-card-head-title {
    padding-bottom: 0
  }

  /deep/ .ant-card-extra {
    padding-bottom: 0;
  }

  /deep/ .ant-table-tbody > tr {
    -webkit-transition: all 0.3s, height 0s;
    transition: all 0.3s, height 0s;
    height: 40px;
  }

  /deep/.ant-form-item {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5;
    list-style: none;
    -webkit-font-feature-settings: 'tnum';
    font-feature-settings: 'tnum';
    margin-bottom: 0;
    vertical-align: top;
  }

  /deep/ .ant-anchor-link {
    padding: 7px 0 7px 16px;
    line-height: 2;
  }
  /*.headClass{*/
  /*  background-color: transparent;*/
  /*}*/
  /*.headClass .mask{*/
  /*  opacity: 1;*/
  /*}*/
  /*.mask {*/
  /*  text-align: center;*/
  /*  position: absolute;*/
  /*  top: 0;*/
  /*  left:47px;*/
  /*  width: 100px;*/
  /*  height: 140px;*/
  /*  background: rgba(101, 101, 101, 0.6);*/
  /*  color: #ffffff;*/
  /*  opacity: 0;*/
  /*}*/
</style>
