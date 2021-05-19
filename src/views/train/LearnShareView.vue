<template>
  <div class="card-container">
    <a-tabs
      hideAdd
      size="small"
      type="card"
      v-model="activeKey"
      @change="onTabPaneChange"
    >
      <a-tab-pane key="learn" tab="云学堂知识学习">
        <Knowledge-learning ref="learn"></Knowledge-learning>
      </a-tab-pane>
      <a-tab-pane key="share"  tab="云学堂知识分享">
        <Knowledge-sharing ref="share"></Knowledge-sharing>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
  import { KnowledgeLearning,KnowledgeSharing } from '@/module'
  export default {
    name: "LearnShareView",
    components: {
      KnowledgeLearning,
      KnowledgeSharing
    },
    data() {
      return {
        activeKey: 'learn'
      }
    },
    methods: {
      onTabPaneChange (activeKey) {
        if (activeKey === 'learn') {
          this.$nextTick(() =>{
            this.$refs.learn.doQueryKnowledgeLearn()
          })
        }
        if (activeKey === 'share') {
          this.$nextTick(() =>{
            this.$refs.share.doQueryKnowledgeShare()
          })
        }
      }
    }
  }
</script>

<style scoped>
  .card-container {
    background: #ffffff;
    overflow: hidden;
  }
</style>