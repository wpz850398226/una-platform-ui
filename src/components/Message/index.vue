<template>
  <div>
    <el-button type="text" icon="el-icon-message-solid" @click="click"/>
    <el-dialog
      append-to-body
      title="在线服务"
      :visible.sync="messageDialogVisible"
      width="840px"
    >
      <iframe :src="'http://123.56.79.121/tim/index?fromUserId='+fromUserId" frameborder="0" width="800px" height="600px"></iframe>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'MessageOpen',
  data() {
    return {
      messageDialogVisible: false,
      fromUserId: ''
    }
  },
  mounted() {
    this.fromUserId = this.$store.getters.userinfo.id
  },
  methods: {
    click() {
      this.messageDialogVisible = true
    }
  }
}
</script>
