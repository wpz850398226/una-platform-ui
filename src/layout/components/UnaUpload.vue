<template>
  <div>
    <el-upload
      :list-type="showFileList ? 'picture-card' : 'text'"
      action=""
      :limit="limit"
      multiple
      :http-request="handleUpload"
      :file-list="myFileList"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :on-exceed="uploadExceed"
      :on-remove="uploadRemove "
      :class="{'hide-exec':hideUpload}"
    >
      <i v-if="showFileList" class="el-icon-plus" />
      <el-button v-else type="primary" size="medium">上传文件</el-button>
    </el-upload>
  </div>
</template>

<script>
// import AliyunOSS from '@/utils/oss'
import axios from 'axios'

export default {
  name: 'ElUploadA',
  model: {
    prop: 'fileList',
    event: 'change'
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    // eslint-disable-next-line vue/require-prop-types
    fileList: {
      required: true
    },
    showFileList: {
      type: Boolean,
      default: true
    },
    limit: {
      type: Number,
      default: 99
    },
    prefix: {
      type: String,
      default: '/una-file'
    }
  },
  data() {
    return {
      hideUpload: false,
      myFileList: []
    }
  },
  watch: {
    myFileList() {
      this.hideUpload = this.myFileList.length >= this.limit
    }
  },
  mounted() {
    //
    // this.myFileList = this.fileList ? this.fileList.split(',') : []
    // this.hideUpload = this.myFileList.length >= this.limit
  },
  methods: {
    async handleUpload(e) {
      const data = new FormData()
      data.append('file', await e.file)

      const res = await axios({
        url: `/api/sys/file/save`,
        method: 'POST',
        // headers: {
        //   'Authorization': getToken(),
        //   'tentId': getTentId(),
        //   'appKey': getAppKey()
        // },
        data,
        withCredentials: true // true 为不允许带 token, false 为允许
      })

      this.$message.success(res.data.message)
      return res.data
      // return AliyunOSS.getInstance().upload(e.file, 'ylmc/')
    },
    uploadSuccess(response, file, fileList) {
      this.processFileList(fileList)
      this.$emit('saveSuccess', response)
    },
    uploadExceed(files, fileList) {
      this.$message.error('已超过最大上传文件数')
    },
    uploadRemove(file, fileList) {
      this.processFileList(fileList)
    },
    uploadError(err, file, fileList) {
      if (err.code !== 200) {
        this.$message({
          message: err.message || '上传失败',
          type: 'warning'
        })
      }
      this.processFileList(fileList)
    },
    processFileList(fileList) {
      const files = fileList.map((item) => {
        if (!item.url && item.response) {
          const response = item.response
          item.url = response.url
        }
        return item
      })
      this.triggerChange(files)
    },
    triggerChange(fileList) {
      this.$emit('change', fileList.join(','))
    }
  }
}
</script>

<style>
  .hide-exec .el-upload--picture-card {
    display: none;
  }
</style>
