<template>
  <div>
    <el-button v-if="entityId && id" type="primary" @click="openDocumentDialog">显示文档</el-button>

    <el-dialog
      title="文档查看"
      fullscreen
      :visible.sync="defaultFormDialogVisible"
      width="550px"
      :append-to-body="true"
    >
      <div v-html="h5">1</div>
    </el-dialog>
  </div>
</template>

<script>
import { getTemplateData } from '@/api/una/sys_template'

export default {
  name: 'UnaDocument',
  props: {
    entityId: {
      type: Number,
      default: -1
    },
    id: {
      default: -1,
      type: Number
    }
  },
  data() {
    return {
      defaultFormDialogVisible: false,
      h5: ''
    }
  },
  watch: {
    entityId() {
      this.getDocText()
    },
    id() {
      this.getDocText()
    }
  },
  mounted() {
    this.getDocText()
  },
  methods: {
    openDocumentDialog() {
      this.defaultFormDialogVisible = true
    },
    getDocText() {
      if (this.entityId && this.id) {
        getTemplateData(this.entityId, this.id).then(res => {
          console.log(res, '文档')
          this.h5 = res.message
        })
      }
    }

  }
}
</script>
