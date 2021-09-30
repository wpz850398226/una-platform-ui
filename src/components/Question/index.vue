<template>
  <div>
    <el-button type="text" icon="el-icon-question" @click="click"/>
    <el-dialog
      append-to-body
      title="帮助"
      :visible.sync="questionDialogVisible"
      width="840px"
    >

    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'QuestionOpen',
  data() {
    return {
      questionDialogVisible: false,
      fromUserId: ''
    }
  },
  mounted() {
    // this.fromUserId = this.$store.getters.userinfo.id
  },
  methods: {
    click() {
      this.questionDialogVisible = true
    }
  }
}
</script>
