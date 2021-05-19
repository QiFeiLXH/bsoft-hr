<template>
  <a-card :bordered="false" :bodyStyle="{ 'min-height': (actionRecords.length )*200  +'px','padding':'0 24px'}">
<!--    <a-list>-->
<!--      <a-list-item v-for="(item,i) in actionRecords" :key="i" style="border-bottom: 0px solid #e8e8e8;">-->
<!--        <div style="width: 785px;color:black">-->
<!--          <div class="taskName">{{ item.taskName }}</div>-->
<!--          <div class="auditor">操作人：{{ item.auditor}}</div>-->
<!--          <div class="action">状态：{{ item.action == null ? "&nbsp;" : item.action}}</div>-->
<!--          <div class="auditDate">操作时间：{{ item.auditDate}}</div>-->
<!--          <p class="auditOpinion">{{ item.auditOpinion }}</p>-->
<!--        </div>-->
<!--      </a-list-item>-->
<!--    </a-list>-->
    <ul class="cbp_tmtimeline">
      <li>
    　　<div v-for="(item, index) in actionRecords" :key="index" :class="{'cbp_div': index === (actionRecords.length - 1)}">
          <div class="cbp_tmlabel">
            <div class="taskName">{{ item.taskName }}</div>
            <div class="auditor">操作人：{{ item.auditor}}</div>
            <div class="action">状态：{{ item.action == null ? "&nbsp;" : item.action}}</div>
            <div class="auditDate">操作时间：{{ item.auditDate}}</div>
            <p class="auditOpinion">{{ item.auditOpinion }}</p>
            <div class="system_info" v-if="item.system == 1">发自移动端慧康办公</div>
            <img src="../../../assets/images/time.png" :class="readFlag?'cbp_tmicon':'cbp_tmicon_gray'" v-if="!item.auditDate || index === (actionRecords.length - 1) && !finished"/>
            <img src="../../../assets/images/check.png" class="cbp_tmicon" v-else></img>
          </div>
        </div>
      </li>
    </ul>

  </a-card>
</template>

<script>
    export default {
      name: "ActionRecordView",
      props: {
        actionRecords:{
          type: Array,
          default: []
        },
        readFlag:{
          type: Boolean,
          default:false
        },
        finished:{
          type: Boolean,
          default:false
        }
      },
    }
</script>

<style scoped>
  .system_info{
    width: 140px;
    height: 22px;
    position: absolute;
    bottom: 25px;
    left: 40px;
    color: rgba(168, 168, 168, 1);
  }
  .taskName{
    width: 755px;
    font-weight: bold;
    font-size:14px;
    background-color: #a9a9a942;
    padding: 10px 10px 0px 10px;
  }
  .auditor{
    width:250px;
    float:left;
    background-color: #a9a9a942;
    padding: 10px 0px 10px 10px;
  }
  .action{
    width:120px;
    float:left;
    padding: 10px 0px 10px 0px;
    background-color: #a9a9a942
  }
  .auditDate{
    width:385px;
    float:left;
    padding: 10px 0px 10px 0px;
    background-color: #a9a9a942
  }
  .auditOpinion{
    padding-top: 50px;
    padding-left: 10px;
  }
  .cbp_div {
    height: 0px;
    width:620px;
  }

  .cbp_left {
    width: 150px;
    color: black;
    font-size: 14px;
    font-weight: 300;
    line-height: 1.4;
    margin-bottom: 25px;
  }

  .main
  {
    width: 90%;
    max-width: 69em;
    margin: 0 auto;
    padding: 0 1.875em 3.125em 1.875em;
  }

  .cbp_tmtimeline
  {
    width: 40px;
    margin-top: 40px;
    padding: 1px 0 40px 0;
    /*padding: 0 0 0 0;*/
    list-style: none;
    position: relative;
  }

  /* The line */
  .cbp_tmtimeline:before
  {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 3px;
    background: #b8cad6;
    left: 25%;
    margin-left: -11px;
  }

  .cbp_tmtimeline > li
  {
    position: relative;
  }
  .cbp_tmtimeline > li .cbp_tmlabel
  {
    margin: -30px 0 15px 0;
    color: black;
    padding-left: 30px;
    font-size: 14px;
    position: relative;
    border-radius: 5px;
    height: 200px;
    width: 785px;
  }
  .cbp_tmtimeline > li .cbp_tmicon
  {
    width: 18px;
    height: 18px;
    font-family: 'ecoico';
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    position: absolute;
    color: #fff;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 0 0 3px #afdcf8;
    left: 26%;
    top: 0;
    margin: 25px 0px 0px -212px
  }
  .cbp_tmtimeline > li .cbp_tmicon_gray
  {
    width: 18px;
    height: 18px;
    font-family: 'ecoico';
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    position: absolute;
    color: #000;
    /*background-image: url("../../../assets/images/time.png");*/
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 0 0 3px #e6ecf1;
    left: 26%;
    top: 0;
    margin:25px 0px 0px -212px
  }
</style>