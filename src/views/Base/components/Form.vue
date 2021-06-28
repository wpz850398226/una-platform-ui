<template>
  <div class="Form">
    <el-form
      ref="publicForm"
      :model="dataForm"
      status-icon
      :rules="defaultFormRules"
      label-width="120px"
    >
      <el-form-item
        v-for="field in fieldList"
        v-show="formItemVisible(field.assignmentModeDcode)"
        :key="field.id"
        :label="field.name"
        :prop="field.assignmentCode"
      >
        {{ field.assignmentCode }}
        <!-- {{ field }} -->
        <!-- defaultValue -->

        <UnaTreeNode
          v-if="field.assignmentModeDcode === 'field_assignment_treeNode'"
          v-model="dataForm[field.assignmentCode]"
          :dafault-value="field.defaultValue"
        />

        <el-radio-group
          v-else-if="field.assignmentModeDcode === 'field_assignment_radio'"
          v-model="dataForm[field.assignmentCode]"
        >
          <el-radio v-for="(item, index) in field.radioOptionArray" :key="'radio'+index" :label="item">{{ item }}</el-radio>
        </el-radio-group>

        <CkEditor
          v-else-if="field.assignmentModeDcode === 'field_assignment_editor'"
          v-model="dataForm[field.assignmentCode]"
        />

        <el-input
          v-else-if="field.assignmentModeDcode === 'field_assignment_text'"
          v-model="dataForm[field.assignmentCode]"
        />
        <el-input
          v-else-if="field.assignmentModeDcode === 'field_assignment_hidden'"
          v-model="dataForm[field.assignmentCode]"
        />
        <una-single-select
          v-else-if="field.assignmentModeDcode === 'field_assignment_singleselect'"
          v-model="dataForm[field.assignmentCode]"
          :field="field"
        />
        <una-area
          v-else-if="field.assignmentModeDcode === 'field_assignment_gangedRegion'"
          v-model="dataForm[field.assignmentCode]"
        />
        <una-location
          v-else-if="field.assignmentModeDcode === 'field_assignment_map'"
          v-model="dataForm[field.assignmentCode]"
        />
        <una-upload
          v-else-if="field.assignmentModeDcode === 'field_assignment_multiUpload'"
          v-model="dataForm[field.assignmentCode]"
          :show-file-list="false"
        />
        <el-switch
          v-else-if="field.assignmentModeDcode === 'field_assignment_switch'"
          v-model="dataForm[field.assignmentCode]"
          active-color="#13ce66"
          :active-value="1"
          :inactive-value="0"
          inactive-color="#ff4949"
        />
        <el-date-picker
          v-else-if="field.assignmentModeDcode === 'field_assignment_datetime'"
          v-model="dataForm[field.assignmentCode]"
          type="datetime"
          :placeholder="field.annotation"
          value-format="yyyy-MM-dd HH:mm:ss"
        />
        <el-input-number
          v-else-if="field.assignmentModeDcode === 'field_assignment_number'"
          v-model="dataForm[field.assignmentCode]"
          :label="field.annotation"
        />
        <div v-else-if="field.assignmentModeDcode === 'field_assignment_image'" class="avatar avatar-uploader" @click="showAvatar = true">
          <img
            v-if="busUserForm.accountImg"
            class="img"
            :src="dataForm[field.assignmentCode]"
          >
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </div>
        <div>{{ field.assignmentModeDcode }}</div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button :loading="loading" type="primary" @click="submitPublic('publicForm')">确 定</el-button>
    </span>
  </div>
</template>

<script>
import UnaSingleSelect from '@/layout/components/UnaSingleSelect.vue'
import UnaArea from '@/layout/components/UnaArea.vue'
import UnaTreeNode from '@/layout/components/UnaTreeNode.vue'
import UnaLocation from '@/layout/components/UnaLocation.vue'
import UnaUpload from '@/layout/components/UnaUpload.vue'
import CkEditor from '@/components/CKEditor/index.vue'

import { chPut, chDelete, chGet, chPost } from '@/api/index'
import * as fieldPort from '@/api/una/sys_field'

export default {
  name: 'Form',
  components: {
    UnaSingleSelect, UnaTreeNode, UnaArea,
    CkEditor, UnaLocation, UnaUpload
  },
  props: {
    entity: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      fieldList: [],
      defaultForm: {}, // 默认表单
      defaultFormRules: {},
      dataForm: {}, // 数据表单，绑定数据的
      loading: false
    }
  },
  computed: {
    formItemVisible() {
      return (e) => {
        const exclude = ['field_assignment_treeNode']
        return !exclude.includes(e)
      }
    }
  },
  mounted() {
    this.getFieldList()
  },
  methods: {
    initForm(oldData, mergeData) {
      if (oldData) {
        this.dataForm = oldData
      } else {
        this.dataForm = { ...this.defaultForm }
        if (mergeData) { // 合并默认值
          console.log(mergeData, 'mergeData')
          Object.keys(mergeData).map(v => {
            this.$set(this.defaultForm, v, mergeData[v])
          })
        }
      }

      if (this.$refs.publicForm) {
        this.$refs.publicForm.resetFields()
      }
    },
    getFieldList() {
      fieldPort.fieldList({ 'entityId': this.entity.id })
        .then((result) => {
          this.fieldList = result
        })
    },
    submitPublic(formName) {
      console.log(this.dataForm)
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          this.loading = true
          const { children, map, ...commitData } = this.dataForm // 删除无用字段
          console.log('提交检查', commitData)

          chPost(this.entity.path + '/save', commitData).then((resolve) => {
            this.defaultFormDialogVisible = false
            this.$message.success('保存成功')
            this.$emit('saveSuccess')
            this.loading = false
          }, (e) => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style>

</style>
