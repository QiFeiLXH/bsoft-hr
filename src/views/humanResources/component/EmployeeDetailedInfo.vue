<template>
    <a-spin :spinning="loading">
      <div :style="{height: viewHeight+'px',overflowY:'hidden'}">
        <a-card :bordered="false" :style="{height: formHeight+'px',overflowY:'auto'}">
          <a-form-model ref="ruleForm" :model="form" :rules="getRules">
            <a-card id="base" title="基本信息">
              <a-row>
                <a-col :md="19">
                  <a-row>
                    <a-col :md="8">
                      <a-form-model-item
                        label="姓　　名"
                        :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                        prop="personName">
                        <a-input :maxLength="12" v-model="form.personName" :disabled="disabled"/>
                      </a-form-model-item>
                    </a-col>
                    <a-col :md="8">
                      <a-form-model-item
                        label="证件类型"
                        :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                        prop="idCardType">
                        <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" v-model="form.idCardType" :disabled="disabled" @select="cardTypeSelect">
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
                        <a-date-picker :disabled-date="disabledDate" v-model="form.startDate" :disabled="disabled" @change="doChangeStartDate"/>
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
                        prop="gender"
                        :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 16}, sm: {span: 20} }">
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
                        prop="birthDate"
                        :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 16}, sm: {span: 20} }">
                        <a-date-picker v-model="form.birthDate" :disabled="disabled||genderDisabled"></a-date-picker>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col :md="8">
                      <a-form-model-item
                        label="文化程度"
                        :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                      >
<!--                        <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" v-model="form.education" :disabled="disabled" @focus="getEducationDic">-->
<!--                          <a-spin v-if="educationDic.length === 0" slot="notFoundContent" size="small" />-->
<!--                          <a-select-option :value="item.id" v-for="item in educationDic" :key="item.id">-->
<!--                            {{item.name}}-->
<!--                          </a-select-option>-->
<!--                        </a-select>-->
                        <hr-dic-select :storageKey="'EmployeeDetailedInfo_education_01'" :custom-list="educationDic" v-model="form.education" :type="10" :width="195" :searchable="true"></hr-dic-select>
                      </a-form-model-item>
                    </a-col>
                    <a-col :md="8">
                      <a-form-model-item label="毕业日期" :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                                         :wrapperCol="{lg: {span: 16}, sm: {span: 20} }">
                        <a-date-picker v-model="form.graduateDate" :disabled="disabled" @change="changeGraduateDate"/>
                      </a-form-model-item>
                    </a-col>
                    <a-col :md="8">
                      <a-form-model-item label="首次工作" :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                                         :wrapperCol="{lg: {span: 16}, sm: {span: 20} }">
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
                        <a-input v-model="form.phone" :disabled="disabled"/>
                      </a-form-model-item>
                    </a-col>
                    <a-col :md="8">
                      <a-form-model-item
                        label="邮箱地址"
                        :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                        :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                        prop="email">
                        <a-auto-complete
                          :disabled="disabled"
                          :data-source="emailSource"
                          style="width: 100%"
                          placeholder="Email"
                          v-model="form.email"
                          @change="handleChange"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                </a-col>
                <a-col :md="5">
                  <div v-if="headPic" style="text-align:center ;">
                    <img style="width: 100px;height: 140px;" :src="headPic"/>
                  </div>
                  <a-avatar v-else style="float: right" shape="square" :size="150" icon="user"/>
                </a-col>
              </a-row>

            </a-card>
            <a-card title="招聘信息">
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
                    >
<!--                    <a-select @focus="getSubsidyDic" :disabled="disabled" :getPopupContainer="triggerNode => triggerNode.parentNode" v-model="form.communicationSubsidy">-->
<!--                      <a-spin v-if="communicationSubsidyDic.length === 0" slot="notFoundContent" size="small" />-->
<!--                      <a-select-option :value="item.id" v-for="item in communicationSubsidyDic" :key="item.id">-->
<!--                        {{item.name}}-->
<!--                      </a-select-option>-->
<!--                    </a-select>-->
                    <general-dic-select :storageKey="'EmployeeDetailedInfo_subsidyUseful_01'" :custom-list="communicationSubsidyDic" v-model="form.communicationSubsidy" :width="245" @getGeneralDicList="getSubsidyDic"></general-dic-select>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :md="8">
                  <a-form-model-item
                    label="所属公司"
                    :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                    :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                    >
<!--                    <a-select :disabled="disabled" :getPopupContainer="triggerNode => triggerNode.parentNode" v-model="form.company" showSearch optionFilterProp="children" :filter-option="filterCompanyOption" @focus="getCompanyDic" @select="companySelectChange">-->
<!--                      <a-spin v-if="companyDic.length === 0" slot="notFoundContent" size="small" />-->
<!--                      <a-select-option :value="item.companyId" v-for="item in companyDic" :detail="item" :key="item.companyId">-->
<!--                        {{item.abbreviation}}-->
<!--                      </a-select-option>-->

<!--                    </a-select>-->
                    <general-dic-select :storageKey="'EmployeeDetailedInfo_companyUseful_01'" :custom-list="companyDic" :customLabel="'abbreviation'" :customKey="'companyId'" v-model="form.company" :width="245" @getGeneralDicList="getCompanyDic" @change="companySelectChange"></general-dic-select>
                  </a-form-model-item>
                </a-col>
                <a-col :md="8">
                  <a-form-model-item
                    label="应聘岗位"
                    :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                    :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                    prop="appliedPosition">
<!--                    <a-select :disabled="disabled" :getPopupContainer="triggerNode => triggerNode.parentNode" v-model="form.appliedPosition" showSearch optionFilterProp="children" :filter-option="filterOption" @focus="getAppliedPositionDic">-->
<!--                      <a-spin v-if="appliedPositionDic.length === 0" slot="notFoundContent" size="small" />-->
<!--                      <a-select-option :value="item.id" v-for="item in appliedPositionDic" :detail="item" :key="item.id">-->
<!--                        {{item.name}}-->
<!--                      </a-select-option>-->
<!--                    </a-select>-->
                    <hr-dic-select :storageKey="'EmployeeDetailedInfo_appliedPosition_01'" :custom-list="appliedPositionDic" v-model="form.appliedPosition" :type="14" :width="245" :searchable="true"></hr-dic-select>
                  </a-form-model-item>
                </a-col>
                <a-col :md="8">
                  <a-form-model-item
                    label="岗位大类"
                    :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                    :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                    >
<!--                    <a-select :disabled="disabled" :getPopupContainer="triggerNode => triggerNode.parentNode" @focus="getJobCategory" v-model="form.jobCategory">-->
<!--                      <a-spin v-if="jobCategoryDic.length === 0" slot="notFoundContent" size="small" />-->
<!--                      <a-select-option :value="item.id+''" v-for="item in jobCategoryDic" :key="item.id">-->
<!--                        {{item.name}}-->
<!--                      </a-select-option>-->
<!--                    </a-select>-->
                    <hr-dic-select :storageKey="'EmployeeDetailedInfo_jobCategory_01'" :custom-list="jobCategoryDic" v-model="form.jobCategory" :type="2" :width="245" :searchable="true"></hr-dic-select>
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
<!--                    <dept-select ref="dept" :disabled="disabled" v-model="form.dept" @change="deptChange"></dept-select>-->
                    <memory-select  :storageKey="'EmployeeDetailedInfo_deptUseful_01'"  ref="dept" :disabled="disabled" v-model="form.dept" @change="memoryDeptChange" style="width:245px"></memory-select>
                  </a-form-model-item>
                </a-col>
                <a-col :md="8">
                  <a-form-model-item
                    label="人员归属群"
                    :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                    :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                    >
                    <a-select ref="PersonnelGroup" notFoundContent="未维护核算口径归属" :disabled="disabled" :allowClear="true" :getPopupContainer="triggerNode => triggerNode.parentNode" @focus="getPersonnelGroupDic" v-model="form.personnelGroup" showSearch optionFilterProp="children" :filter-option="filterOption">
                      <a-spin v-if="personnelGroupDic.length === 0" slot="notFoundContent" size="small" />
                      <a-select-option :value="item.id" v-for="item in personnelGroupDic" :detail="item" :key="item.id">
                        {{item.name}}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :md="8">
                  <a-form-model-item
                    label="试用期"
                    :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                    :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                    >
                    <a-input-number :disabled="disabled"  style="width: 80%;" id="inputNumber" v-model="form.probationPeriod" :min="0" :max="99" :precision="0"/>
                    个月
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :md="8">
                  <a-form-model-item label="实习薪资" :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                                     :wrapperCol="{lg: {span: 16}, sm: {span: 20} }">
                    <a-input-number :min="0" :max="1000000000" :precision="2" :disabled="disabled||form.recruitmentType !== 1" style="width: 90%" v-model="form.internshipSalary"/>元
                  </a-form-model-item>
                </a-col>

                <a-col :md="8">
                  <a-form-model-item label="试用期薪资" :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                                     :wrapperCol="{lg: {span: 16}, sm: {span: 20} }">
                    <a-input-number :min="0" :max="1000000000" :precision="2" :disabled="disabled" style="width: 90%" v-model="form.trialSalary" />元
                  </a-form-model-item>
                </a-col>

                <a-col :md="8">
                  <a-form-model-item label="转正薪资" :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                                     :wrapperCol="{lg: {span: 16}, sm: {span: 20} }">
                    <a-input-number :min="0" :max="1000000000" :precision="2" :disabled="disabled" style="width: 90%" v-model="form.regularSalary"/>元
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
                  <a-form-model-item label="联系电话" :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                                     :wrapperCol="{lg: {span: 16}, sm: {span: 20} }">
                    <a-input disabled v-model="form.registrantPhone"/>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :md="8">
                  <a-form-model-item label="实习生留用" :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                                     :wrapperCol="{lg: {span: 16}, sm: {span: 20} }">
                    <a-radio-group :disabled="disabled||isUseDisabled" name="useGroup" :value="form.isUse" @change="isUseChange">
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
                  <a-form-model-item label="缴纳社保" :labelCol="{lg: {span: 8}, sm: {span: 2}}"
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
                  <a-form-model-item label="同创业工号" :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                                     :wrapperCol="{lg: {span: 16}, sm: {span: 20} }" prop="sameBsoft">
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
                    >
                    <a-input-number :disabled="disabled" style="width: 100%" v-model="form.paymentBase" :max="1000000000" :min="0" :precision="2"/>
                  </a-form-model-item>
                </a-col>
                <a-col :md="16">
                  <a-form-model-item
                    label="社保缴纳地"
                    :labelCol="{lg: {span: 4}, sm: {span: 2}}"
                    :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
                    >
<!--                    <a-select @focus="getPaymentPlaceDic" :getPopupContainer="triggerNode => triggerNode.parentNode" :disabled="disabled" v-model="form.paymentPlace" showSearch optionFilterProp="children" :filter-option="filterCompanyOption">-->
<!--                      <a-spin v-if="paymentPlaceDic.length === 0" slot="notFoundContent" size="small" />-->
<!--                      <a-select-option :value="item.companyId" v-for="item in paymentPlaceDic" :detail="item" :key="item.companyId">-->
<!--                        {{item.abbreviation}}-->
<!--                      </a-select-option>-->
<!--                    </a-select>-->
                    <general-dic-select :placeholder="'选择社保缴纳地'" :storageKey="'EmployeeDetailedInfo_paymentPlaceUseful_01'" :custom-list="paymentPlaceDic" :customLabel="'abbreviation'" :customKey="'companyId'" v-model="form.paymentPlace" :width="610" @getGeneralDicList="getPaymentPlaceDic"></general-dic-select>
                  </a-form-model-item>
                </a-col>

              </a-row>
              <a-row>
                <a-col :md="8">

                  <a-form-model-item
                    label="录用备注"
                    :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                    :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                    >
<!--                    <a-select @focus="getEmploymentNotesDic" :getPopupContainer="triggerNode => triggerNode.parentNode" :disabled="disabled" v-model="form.employmentNotes" @select="employmentNotesSelect">-->
<!--                      <a-spin v-if="employmentNotesDic.length === 0" slot="notFoundContent" size="small" />-->
<!--                      <a-select-option :value="item.id" v-for="item in employmentNotesDic" :key="item.id">-->
<!--                        {{item.name}}-->
<!--                      </a-select-option>-->
<!--                    </a-select>-->
                    <public-dic-select :storageKey="'EmployeeDetailedInfo_employmentNotes_01'" :custom-list="employmentNotesDic"  v-model="form.employmentNotes" :type="3010" :width="245"></public-dic-select>
                  </a-form-model-item>
                </a-col>
                <a-col :md="16">
                  <a-form-model-item
                    label="其他说明"
                    :labelCol="{lg: {span: 4}, sm: {span: 2}}"
                    :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
                    prop="employmentNotesDetail">
                    <a-input  v-model="form.employmentNotesDetail" :maxLength="80" :readOnly="form.employmentNotes !== 4||disabled"/>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :md="8">
                  <a-form-model-item label="办理总部工牌" :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                                     :wrapperCol="{lg: {span: 16}, sm: {span: 20} }" prop="workCardFlag">
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
                  <a-form-model-item label="餐补充值" :labelCol="{lg: {span: 8}, sm: {span: 2}}"
                                     :wrapperCol="{lg: {span: 16}, sm: {span: 20} }" prop="mealRechargeFlag">
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
            <a-card title="驻地信息">
              <a-row>
                <a-col :md="9">
                  <a-form-model-item label="" :labelCol="{lg: {span: 4}, sm: {span: 2}}"
                                     :wrapperCol="{lg: {span: 20}, sm: {span: 20} }">
                    <a-radio-group :disabled="disabled" name="placeGroup" v-model="form.localFlag" @change="localChange">
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
                <a-col :md="15">
                  <a-form-model-item
                    label="省市县"
                    :labelCol="{lg: {span: 6}, sm: {span: 2}}"
                    :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
                    >
                    <administrative-new-division ref="divisionCounty" :disabled="disabled" v-model="form.divisionCounty" @setDivision="setDivision"></administrative-new-division>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-card>

          </a-form-model>
        </a-card>
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
          <a-button type="primary" @click="saveBaseInfo">保存</a-button>
          <a-button type="primary" style="margin-left: 10px" @click="sendEmail">发送邮件</a-button>
        </div>
      </div>
    </a-spin>
</template>

<script>
  import moment from 'moment/moment'
  import AFormModelItem from "ant-design-vue/es/form-model/FormItem";
  import MemorySelect from "../../../components/MemorySelect/MemoryDeptSelect"
  import PublicDicSelect from "../../../components/MemorySelect/PublicDicSelect";
  import SystemDicSelect from "../../../components/MemorySelect/SystemDicSelect";
  import GeneralDicSelect from "../../../components/MemorySelect/GeneralDicSelect";
  import HrDicSelect from "../../../components/MemorySelect/HrDicSelect";
  import AFormModel from "ant-design-vue/es/form-model/Form";
  import DeptSelect from "../../../components/Dept/DeptSelect";
  import {getRecruitmentAuditInfo,getSubsidy,getHumanDic,getPublicDic,initRecruitmentBaseInfo, saveRecruitmentBaseInfo, getRecruitmentInfo,getPersonnelGroupDic,getCompanyDic} from '@/api/employee'
  import AdministrativeNewDivision from "../../../components/Area/AdministrativeNewDivision";
  import PersonSearchSelect from "../../../components/Person/PersonSearchSelect";
  import {showImage} from '@/api/common';

  const validateIdCard = (rule, value, callback) => {
    const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X)$)/
    if (value === '') {
      callback(new Error('请输入证件号'));
    } else if (reg.test(value) === false) {
      callback(new Error("请输入正确的证件号"));
    } else {
      let year = value.substr(6, 4),//身份证年
        month = value.substr(10, 2),//身份证月
        date = value.substr(12, 2),//身份证日
        time = Date.parse(month + '-' + date + '-' + year),//身份证日期时间戳date
        now_time = Date.parse(new Date()),//当前时间戳
        dates = (new Date(year, month, 0)).getDate();//身份证当月天数
      if (parseInt(month) === 0 || parseInt(month) > 12 || parseInt(date) > 31 ||time > now_time || date > dates) {
        callback(new Error("请输入正确的证件号"));
      }else{
        callback();
      }
    }
  };
  const validateCard = (rule, value, callback) => {
    if (value === '' || value === undefined || value === null) {
      callback(new Error('请输入证件号'));
    } else {
      callback();
    }
  };

  const validateIdPhone = (rule, value, callback) => {
    const reg = /^[1][0-9][0-9]{9}$/
    if(value === ''){
      callback(new Error('请输入手机号'));
    }else if(reg.test(value) === false){
      callback(new Error("请输入正确的手机号"));
    }else{
      callback()
    }
  }
  const validateIdEmail = (rule, value, callback) => {
    const reg = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/
    if(value === ''){
      callback(new Error('请输入邮箱'));
    }else if(reg.test(value) === false){
      callback(new Error("请输入正确的邮箱"));
    }else{
      callback()
    }
  }

  const rules = {
      personName: [{ required: true, message: '请填写姓名', trigger: 'blur' },],
      idCardType: [{ required: true, message: '请选择证件类型', trigger: 'change' }],
      startDate: [{ required: true, message: '请选择报到日期', trigger: 'change' }],
      idCard: [{ required: true }],
      registrant: [{ required: true, message: '请选择HR联系人', trigger: 'change' },],
      dept: [{ required: true, message: '请选择录用部门', trigger: 'change' },],
      phone: [{ required: true, validator: validateIdPhone, trigger: 'blur' },],
      email: [{ required: true, validator: validateIdEmail, trigger: 'blur' },],
      appliedPosition: [{ required: true, message: '请选择应聘岗位', trigger: 'change' },],
      recruitmentType: [{ required: true, message: '请选择招聘类型', trigger: 'change' }],
      gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
      birthDate: [{ required: true, message: '请选择出生日期', trigger: 'change' }],
  };

  export default {
    name: "EmployeeDetailedInfo",
    components: {
      AdministrativeNewDivision,
      PersonSearchSelect, DeptSelect, AFormModelItem, AFormModel,MemorySelect, PublicDicSelect, SystemDicSelect, HrDicSelect, GeneralDicSelect
    },
    props: {
      baseInfo:{
        type: Object,
        required: true
      },
      disabled:{
        type: Boolean,
        required: false
      }
    },
    computed: {
      genderDisabled: function () {
        return this.form.idCardType === 1
      },
      viewHeight: function () {
        return window.innerHeight
      },
      formHeight: function () {
        return this.disabled ? window.innerHeight : window.innerHeight - 60
      },
      isUseDisabled: function () {
        return this.form.recruitmentType !== 1
      },
      getRules : function () {
        if(this.form.idCardType === 1 ){
          rules.idCard = [{ required: true,validator: validateIdCard , trigger: 'blur' }]
        }else{
          rules.idCard = [{ required: true,validator: validateCard , trigger: 'blur' }]
        }
        if(this.form.employmentNotes === 4){
          rules.employmentNotesDetail = [{ required: true, message: '请填写其他说明', trigger: 'blur' },]
        }else{
          rules.employmentNotesDetail = [{ required: false},]
        }
        if(this.form.company === 60 || this.form.company === 85){
          rules.sameBsoft = [{ required: true, message: '请选择是否同创业生成补贴', trigger: 'change' }]
        }else{
          rules.sameBsoft =  [{ required: false}]
        }
        return rules
      },
    },
    mounted() {
      this.loading = true
      if(this.baseInfo.id !== null){//编辑
        this.getAuditInfo();
      }else{//新增
        this.$refs.person.getCurrent(this.form.registrant,this.form.registrantName)
      }
      const me = this
      initRecruitmentBaseInfo()
        .then(res => {
          if (res.code === 200) {
            me.communicationSubsidyDic = res.body.communicationSubsidyDic
            me.companyDic = res.body.companyDic
          }
          this.loading = false
        })
    },
    data() {
      return {
        headPic:'',
        emailSource: [],
        moment,
        notesReadOnly:true,
        form: {
          birthDate: null,
          gender: null,
          genderText: null,
          communicationSubsidy: 8,
          county: null,
          city: null,
          province: null,
          idCardType:1,
          localFlag:null,
          registrant: null,
          isUse:null,
          recruitmentType:0,
          probationPeriod: 3,
          status:1,
          paymentFlag:1,
          personnelGroup: null,
          sameBsoft: null,
          workCardFlag: null,
          mealRechargeFlag: null,
          company: null
        },
        appliedPositionDic: [],
        educationDic: [],
        employmentNotesDic: [],
        companyDic: [],
        jobCategoryDic: [],
        personnelGroupDic: [],
        paymentPlaceDic: [],
        communicationSubsidyDic: [],
        informationForm: {birthDate: null, gender: null, genderText: null},
        loading: false,
      }
    },
    methods: {
      changeGraduateDate(){
        this.$forceUpdate()
      },
      getAuditInfo () {
        const me = this
        me.loading = true
        let param = {id : me.baseInfo.id}
        getRecruitmentAuditInfo(param).then(res=> {
          if(res.code === 200){
            me.form = res.body.recruitmentInfoView
            me.form.startDate = me.form.startDate == null?null: moment(me.form.startDate)
            me.form.graduateDate = me.form.graduateDate == null? null: moment(me.form.graduateDate)
            me.form.firstWork = me.form.firstWork == null?null: moment(me.form.firstWork)
            me.form.birthDate = me.form.birthDate == null ? null :moment(me.form.birthDate)
            me.form.jobCategory = !me.form.jobCategory ? null : parseInt(me.form.jobCategory);
            if(me.form.oneInchPhoto !== null){
              me.headPic = showImage(me.form.oneInchPhoto)
            }
            me.form.division = [me.form.divisionProvince,me.form.divisionCity,me.form.divisionCounty].filter(Boolean)
            me.initDic()
          }
          me.loading = false
        })
      },
      initDic() {
        const me = this
        me.$refs.person.getCurrent(me.form.registrant, me.form.registrantName)
        me.$refs.dept.getCurrent(me.form.dept,me.form.deptText)
        let divisions = [me.form.divisionProvince,me.form.divisionCity,me.form.divisionCounty].filter(Boolean)
        let divisionOption = [{
          name:me.form.divisionProvinceText,
          id:me.form.divisionProvince,
        }]
        if(me.form.divisionCity === null){
          divisionOption[0].children = [{
            name:me.form.divisionCountyText,
            id:me.form.divisionCounty,
          }]
        }else{
          divisionOption[0].children = [{
            name:me.form.divisionCityText,
            id:me.form.divisionCity,
            children:[{
              name:me.form.divisionCountyText,
              id:me.form.divisionCounty,
            }]
          }]
        }
        // me.$refs.divisionCounty.getCurrent(divisions,divisionOption)

        me.educationDic = [{id:me.form.education,name:me.form.educationText}]
        me.appliedPositionDic = [{id:me.form.appliedPosition,name:me.form.appliedPositionText}]
        me.employmentNotesDic=[{id:me.form.employmentNotes,name:me.form.employmentNotesText}]
        me.companyDic=[{companyId:me.form.company,abbreviation:me.form.companyText}]
        me.jobCategoryDic=[{id:me.form.jobCategory,name:me.form.jobCategoryText}]
        me.personnelGroupDic=[{id:me.form.personnelGroup,name:me.form.personnelGroupText}]
        me.paymentPlaceDic=[{companyId:me.form.paymentPlace,abbreviation:me.form.paymentPlaceText}]
        me.communicationSubsidyDic = [{id:me.form.communicationSubsidy,name:me.form.communicationSubsidyText}]

      },
      getEducationDic(){
        this.educationDic = []
        let param = {type : 10}
        getHumanDic(param).then(res=> {
          if(res.code === 200){
            this.educationDic = res.body
          }
        })
      },
      getCompanyDic (){
        let param = {type : 3}
        this.companyDic = []
        getCompanyDic(param).then(res=> {
          if(res.code === 200){
            this.companyDic = res.body
          }
        })
      },
      companySelectChange(value){
        console.log(value)
        if(value === 60 || value === 85){
          this.form.sameBsoft = 1
        }
        if (value !== 60 && value !== 85){
          this.form.sameBsoft = null
        }
      },
      getPersonnelGroupDic (){
        if (this.form.dept == undefined || this.form.dept == null){
          this.$message.warn("请先选择录用部门")
          return
        }
        if (this.form.startDate == undefined || this.form.startDate == null){
          this.$message.warn("请先选择报道日期")
          return
        }
        var year = new Date(this.form.startDate).getFullYear()
        let param = {deptId : this.form.dept, year: year}
        this.personnelGroupDic = []
        getPersonnelGroupDic(param).then(res=> {
          if(res.code === 200){
            this.personnelGroupDic = res.body
            if (this.personnelGroupDic.length > 0){
              this.form.personnelGroup = this.personnelGroupDic[0].id
            }else{
              this.form.personnelGroup = null
            }
          }
        })
      },
      getPaymentPlaceDic (){
        let param = {type : 2}
        this.paymentPlaceDic = []
        getCompanyDic(param).then(res=> {
          if(res.code === 200){
            this.paymentPlaceDic = res.body
          }
        })
      },
      getSubsidyDic(){
        if(this.communicationSubsidyDic.length === 0 || this.communicationSubsidyDic.length ===1) {
          this.communicationSubsidyDic = []
          getSubsidy().then(res=> {
            if(res.code === 200){
              this.communicationSubsidyDic = res.body
            }
          })
        }
      },
      getJobCategory () {
        if(this.jobCategoryDic.length === 0 || this.jobCategoryDic.length ===1){
          let param = {type : 2}
          this.jobCategoryDic = []
          getHumanDic(param).then(res=> {
            if(res.code === 200){
              this.jobCategoryDic = res.body
            }
          })
        }
      },
      getEmploymentNotesDic (){
        let param = {type : 3010}
        this.employmentNotesDic = []
        getPublicDic(param).then(res=> {
          if(res.code === 200){
            this.employmentNotesDic = res.body
          }
        })
      },
      disabledGtDate (current) {
        return current > moment().endOf('day');
      },
      disabledDate(current) {
        return current < moment().startOf('day');
      },
      cardTypeSelect (value) {
        this.form.idCard = null
        this.form.gender = null
        this.form.birthDate = null
        this.$refs.ruleForm.clearValidate("idCard")
        this.$refs.ruleForm.clearValidate("gender")
        this.$refs.ruleForm.clearValidate("birthDate")
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
      filterOption(input, option) {
        return (
          option.data.attrs.detail.pinyin == null ?
            option.data.attrs.detail.name.toLowerCase().indexOf(input.toLowerCase()) >= 0:
            option.data.attrs.detail.pinyin.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
            option.data.attrs.detail.name.toLowerCase().indexOf(input.toLowerCase()) >= 0
        );
      },
      idCardChange(e) {
        const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X)$)/

        if (reg.test(e.target.value) === true) {
          let year = e.target.value.substr(6, 4),//身份证年
            month = e.target.value.substr(10, 2),//身份证月
            date = e.target.value.substr(12, 2),//身份证日
            time = Date.parse(month + '-' + date + '-' + year),//身份证日期时间戳date
            now_time = Date.parse(new Date()),//当前时间戳
            dates = (new Date(year, month, 0)).getDate();//身份证当月天数
          if (!(time > now_time || date > dates)) {
            if (e.target.value.length === 15) {
              this.form.birthDate = moment(`19${e.target.value.substr(6, 2)}-${e.target.value.substr(8, 2)}-${e.target.value.substr(10, 2)}`)
              this.form.gender = (e.target.value.substr(14, 1) % 2) || 2
            }
            if (e.target.value.length === 18) {
              this.form.birthDate = moment(`${e.target.value.substr(6, 4)}-${e.target.value.substr(10, 2)}-${e.target.value.substr(12, 2)}`)
              this.form.gender = (e.target.value.substr(16, 1) % 2) || 2
            }
            this.$refs.ruleForm.clearValidate("gender")
            this.$refs.ruleForm.clearValidate("birthDate")
          }
        } else {
          this.form.birthDate = null
          this.form.gender = ''
        }
      },
      handleChange(value) {
        this.emailSource =
          !value || value.indexOf('@') >= 0
            ? []
            : [`${value}@gmail.com`, `${value}@163.com`, `${value}@qq.com`];
      },
      deptChange(value){
        //修改录用部门
        this.getPersonnelGroupDic();
      },
      memoryDeptChange(value){
        this.form.dept = value
        this.getPersonnelGroupDic()
      },
      doChangeStartDate(value){
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
      employmentNotesSelect (value) {
        if(value!==4){
          this.form.employmentNotesDetail = ''
          this.$refs.ruleForm.clearValidate("employmentNotesDetail")
        }
      },
      saveBaseInfo() {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.form.sendStatus = 0
            this.form.status = this.form.status? this.form.status:1
            this.loading = true
            this.saveToServer(0)
          } else {
            return false
          }
        })
      },
      saveToServer(type) {
        this.informationForm = {...this.form}
        this.informationForm.startDate = this.informationForm.startDate.format('YYYY-MM-DD')
        if(this.informationForm.graduateDate !== undefined && this.informationForm.graduateDate !== null){
          this.informationForm.graduateDate = this.informationForm.graduateDate.format('YYYY-MM-DD')
        }
        if(this.informationForm.firstWork !== undefined && this.informationForm.firstWork !== null){
          this.informationForm.firstWork = this.informationForm.firstWork.format('YYYY-MM-DD')
        }
        if(this.informationForm.birthDate !== undefined && this.informationForm.birthDate !== null){
          this.informationForm.birthDate = this.informationForm.birthDate.format('YYYY-MM-DD')
        }
        const me = this
        saveRecruitmentBaseInfo(this.informationForm)
          .then(res => {
            if (res.code === 200) {
              if(type === 0){
                me.$message.success('保存成功')
                me.loading = true
                let param = {recruitmentId:res.body.id}
                getRecruitmentInfo(param).then(res => {
                  if(res.code === 200){
                    me.form = res.body
                    me.form.startDate = me.form.startDate == null?null: moment(me.form.startDate)
                    me.form.graduateDate = me.form.graduateDate == null? null: moment(me.form.graduateDate)
                    me.form.firstWork = me.form.firstWork == null?null: moment(me.form.firstWork)
                    me.form.birthDate = me.form.birthDate == null ? null :moment(me.form.birthDate)
                    me.form.jobCategory = Number(res.body.jobCategory)
                  }
                  me.loading = false
                })
              }else{
                me.$emit('close')
                me.$message.success('发送邮件成功')
              }
            }
            me.loading = false
          })
      },
      sendEmail() {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.form.sendStatus = 1
            this.form.status = 4
            this.saveToServer(1)
          } else {
            return false
          }
        })
      },
      setDivision (newVal,oldVal) {
        this.form.divisionProvince = newVal.province
        this.form.divisionCity = newVal.city
        this.form.divisionCounty = newVal.county
        this.form.province = newVal.province
        this.form.city = newVal.city
        this.form.county = newVal.county
      },
      setPerson(record) {
        this.form.registrantName = record.personName
        this.form.registrantPhone = record.mobile
        this.form.registrantEmail = record.email
        if(this.form.company === undefined || this.form.company === null){
          this.form.company = record.company
        }
        this.$refs.ruleForm.clearValidate("registrant")
      },
      stageGroupChange(e) {
        this.form.recruitmentType = e.target.value
        this.form.isUse = null
        if (e.target.value === 0) {
          this.form.communicationSubsidy = 8
          this.form.internshipSalary = null
        } else if (e.target.value === 1) {
          this.form.communicationSubsidy = 9
          this.form.trialSalary = null
          this.form.regularSalary = null
        } else {
          this.form.communicationSubsidy = null
          this.form.internshipSalary = null
        }
        if(e.target.value === 1 || e.target.value === 4){
          this.form.paymentFlag = 2
          this.form.paymentBase = null
          this.form.paymentPlace = null
        }else{
          this.form.paymentFlag = 1
        }
      },
      workCardFlagChange(e){
        if (e.target.value === 0){
          this.form.mealRechargeFlag = 0
        }
      },
      mealRechargeFlagChange(e){
        if (e.target.value === 1){
          this.form.workCardFlag = 1
        }
      },
      getAppliedPositionDic () {
        if(this.appliedPositionDic.length === 0 || this.appliedPositionDic.length ===1) {
          let param = {type : 14}
          this.appliedPositionDic = []
          getHumanDic(param).then(res=> {
            if(res.code === 200){
              this.appliedPositionDic = res.body
            }
          })
        }
      },
      isUseChange(e) {
        this.form.isUse = e.target.value
      },
      paymentFlagChange (e) {
        this.form.paymentFlag = e.target.value
        if( e.target.value === 2){
          this.form.paymentBase = null
          this.form.paymentPlace = null
        }
      },
      localChange(e) {
        this.form.localFlag = e.target.value
      },
    }
  }
</script>

<style lang="less" scoped>
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
</style>