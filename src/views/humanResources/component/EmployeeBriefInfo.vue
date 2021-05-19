<template>
  <a-card hoverable :body-style="{height: '200px',padding: 0}" >
    <article style="padding: 14px" @dblclick="dbClick">
      <a-row>
        <a-col :md="17">
          <div style="font-weight: bold;overflow:hidden;white-space: nowrap;-o-text-overflow:ellipsis;text-overflow: ellipsis;">{{ info.personName }}</div>
        </a-col>
        <a-col :md="7">
          <a-checkbox style="float: right;" :checked="info.status === 7 || info.status=== 2||info.status === 3"/>
        </a-col>
      </a-row>
      <a-row>
        <a-col :md="17">
          <div style="margin-top: 10px;height: 21px;overflow:hidden;white-space: nowrap;-o-text-overflow:ellipsis;text-overflow: ellipsis;">{{ info.deptText }}</div>
          <div style="margin-top: 10px;height: 21px;overflow:hidden;white-space: nowrap;-o-text-overflow:ellipsis;text-overflow: ellipsis;">{{ info.appliedPositionText }}</div>
          <div style="margin-top: 10px;height: 21px">{{ info.phone }}</div>
        </a-col>
        <a-col :md="7">
          <img :src="'/api/publicapi/showimage?fileId='+ info.oneInchPhoto + '&time=' + moment().millisecond()" style="width: 64px;height: 64px;margin-top: 10px;float: right" v-if="info.oneInchPhoto != null && info.oneInchPhoto != ''"/>
          <a-avatar style="margin-top: 10px;float: right" v-else shape="square" :size="64" icon="user" />
        </a-col>
      </a-row>
      <template v-if="info.remarks&&info.status===6">
        <a-tooltip>
          <template slot="title">
            {{ info.remarks }}
          </template>
          <div style="overflow:hidden;color: red;height: 21px;white-space: nowrap;-o-text-overflow:ellipsis;text-overflow: ellipsis;">{{ info.remarks }}</div>
        </a-tooltip>
      </template>

    </article>
    <footer style="position: absolute;bottom: 10px;text-align:right;width:100%;border-top: 1px solid #e9e9e9;padding-top: 10px">
      <div style="height: 21px">
        <span style="float: left;margin-left: 10px;color: red">{{ info.statusText }}</span>

        <a style="margin-right: 10px" v-if="info.status === 1|| info.status === 4" @click="sendEmail">发邮件</a>
        <a style="margin-right: 10px" v-if="info.status === 1||info.status === 4" @click="editInfo" >编辑</a>
        <a v-antiShake="reclick" style="margin-right: 10px" v-if="info.status === 1 || info.status === 4||info.status === 5||info.status === 6">HR审核</a>
        <a style="margin-right: 10px" v-if="info.status === 1" @click="deleteInfo">删除</a>
        <a v-anti-shake="headQuartersClick" style="margin-right: 10px" v-if="info.status === 7 && headquartersAuth">总部审核</a>
      </div>

    </footer>
  </a-card>

</template>

<script>
import moment from 'moment/moment'
// import { showImage } from '@/api/common'
import EmployeeAuditInfo from './EmployeeAuditInfo'
import EmployeeDetailedInfo from './EmployeeDetailedInfo'

export default {
  name: 'EmployeeBriefInfo',
  components: { EmployeeAuditInfo, EmployeeDetailedInfo },
  props: {
    info: {
      type: Object,
      required: true
    },
    headquartersAuth: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    // const me = this
    // if(this.info.oneInchPhoto !== null){
    //   me.headPic = "/api/recruitmentinfo/showimage?id=" + this.info.oneInchPhoto
    // }else{
    //   me.headPic = ''
    // }
  },
  data () {
    return {
      moment,
      // imageSrc: showImage(this.info.oneInchPhoto , moment().millisecond()),
      headPic: '',
      reclick: { time: 300, callback: () => { this.auditInfo() } },
      headQuartersClick: { time: 300, callback: () => { this.headquartersAuditInfo() } }
    }
  },
  methods: {
    editInfo () {
      this.$emit('editInfo', this.info, false)
    },
    auditInfo () {
      this.$emit('auditInfo', this.info.id, false)
    },
    deleteInfo () {
      this.$emit('deleteInfo', this.info)
    },
    sendEmail () {
      this.$emit('sendEmail', this.info)
    },
    headquartersAuditInfo () {
      this.$emit('headquartersAuditInfo', this.info.id, false)
    },
    dbClick () {
      if (this.info.status === 1 || this.info.status === 4) { // 招聘中  已发邮件状态
        this.$emit('editInfo', this.info, true)
      } else {
        this.$emit('auditInfo', this.info.id, true)
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
