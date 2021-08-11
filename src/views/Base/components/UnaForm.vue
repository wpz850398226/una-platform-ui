<template>
  <div class="Form">
    <!-- {{ entity }} -->
    <!-- {{ validateDataForm }} -->
    <el-form
      v-if="!validateDataForm || (validateDataForm&& Object.keys(dataForm).length>0)"
      ref="publicForm"
      :model="dataForm"
      status-icon
      :rules="defaultFormRules"
      label-width="120px"
    >
      <div
        v-for="field in fieldList"
        :key="field.id"
      >

        <!-- 权限检查 -->
        <div
          v-if="Object.prototype.hasOwnProperty.call(field, 'permissionCode')
            && checkPermission(field.permissionCode)
            || !Object.prototype.hasOwnProperty.call(field, 'permissionCode')"
        >

          <h3 v-if="field.groupName">{{ field.groupName }}</h3>
          <el-form-item
            v-show="formItemVisible(field)"
            :label="field.name"
            :prop="field.assignmentCode"
          >
            <!-- {{ field.assignmentCode }} -->
            <!-- {{ field }} -->
            <!-- defaultValue -->
            <!-- {{ dataForm }} -->

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
            <el-rate
              v-else-if="field.assignmentModeDcode === 'field_assignment_score'"
              v-model="dataForm[field.assignmentCode]"
              show-score
            />
            <el-input
              v-else-if="field.assignmentModeDcode === 'field_assignment_textarea'"
              v-model="dataForm[field.assignmentCode]"
              type="textarea"
              :rows="2"
            />
            <el-input
              v-else-if="field.assignmentModeDcode === 'field_assignment_password'"
              v-model="dataForm[field.assignmentCode]"
              show-password
            />
            <el-input
              v-else-if="field.assignmentModeDcode === 'field_assignment_hidden'"
              v-model="dataForm[field.assignmentCode]"
            />
            <una-single-select
              v-else-if="field.assignmentModeDcode === 'field_assignment_singleselect'"
              v-model="dataForm[field.assignmentCode]"
              :field="field"
              :union-field-value="pid2pVal(field)"
              :row-data="dataForm"
            />
            <una-single-select
              v-else-if="field.assignmentModeDcode === 'field_assignment_multiselect'"
              v-model="dataForm[field.assignmentCode]"
              :field="field"
              multiple
              :row-data="dataForm"
            />
            <una-cascader
              v-else-if="field.assignmentModeDcode === 'field_assignment_gangedDic'"
              v-model="dataForm[field.assignmentCode]"
              :field="field"
              :row-data="dataForm"
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
              @saveSuccess="saveSuccess"
            />

            <una-entity-select
              v-else-if="field.assignmentModeDcode === 'field_assignment_entityRecord'"
              v-model="dataForm[field.assignmentCode]"
              :field="field"
              :real-val="dataForm"
              :multiple="field.selectableLimitNum && field.selectableLimitNum>1"
              :show-img="field.displayModeDcode==='field_display_img'"
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
              v-else-if="field.assignmentModeDcode === 'field_assignment_date'"
              v-model="dataForm[field.assignmentCode]"
              type="date"
              :placeholder="field.annotation"
              value-format="yyyy-MM-dd"
            />
            <el-date-picker
              v-else-if="field.assignmentModeDcode === 'field_assignment_datetime'"
              v-model="dataForm[field.assignmentCode]"
              type="datetime"
              :placeholder="field.annotation"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
            <el-date-picker
              v-else-if="field.assignmentModeDcode === 'field_assignment_yearMonth'"
              v-model="dataForm[field.assignmentCode]"
              type="month"
              placeholder="选择年月"
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
            <!-- <div>{{ field.assignmentModeDcode }}</div> -->
          </el-form-item>
        </div>
        <!-- 权限检查 -->

      </div>

    </el-form>
    <span v-if="entity.code !='SysFile' && actionBar" slot="footer" class="dialog-footer flex justify-between">
      <div>
        <el-button
          v-for="btn in formButtonList"
          :key="btn.id"
          size="small"
          :icon="btn.iconDcode"
          @click="reflectFun(btn.event)"
        >{{ btn.name }}</el-button>
      </div>
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
import UnaEntitySelect from '@/layout/components/UnaEntitySelect.vue'
import UnaCascader from '@/layout/components/UnaCascader.vue'

import CkEditor from '@/components/CKEditor/index.vue'

import { jsonPut, chDelete, chGet, jsonPost } from '@/api/index'
import * as fieldPort from '@/api/una/sys_field'

import { buttonList } from '@/api/una/sys_button'
import checkPermission from '@/utils/permission.js'

export default {
  name: 'UnaForm',
  components: {
    UnaSingleSelect, UnaTreeNode, UnaArea,
    CkEditor, UnaLocation, UnaUpload, UnaEntitySelect,
    UnaCascader
  },
  props: {
    entity: {
      required: true,
      type: Object
    },
    defaultData: {
      type: Object,
      default: () => {}
    },
    readonly: {
      type: Boolean,
      default: false
    },
    actionBar: {
      type: Boolean,
      default: true
    },
    validateDataForm: {
      type: Boolean,
      deafult: false
    }
  },
  data() {
    return {
      fieldList: [],
      defaultForm: {}, // 默认表单
      defaultFormRules: {},
      dataForm: {}, // 数据表单，绑定数据的
      loading: false,
      formButtonList: [], // 表单通用按钮
      isEdit: false,
      treeAddData: {} // 选择树后添加需要合并的数据
    }
  },
  computed: {
    formItemVisible() {
      return (e) => {
        let isShow = true
        const exclude = [
          'field_assignment_treeNode',
          'field_assignment_autoCount',
          'field_assignment_hidden'
        ]

        if (exclude.includes(e.assignmentModeDcode)) {
          isShow = false
          return isShow // 快速判断
        }

        if (e.hideFieldId && e.hideFieldValue) { // 隐藏条件
          const find = this.fieldList.filter(v => v.id === e.hideFieldId)

          if (find.length > 0) {
            const pVal = this.dataForm[find[0].assignmentCode] + '' // 父元素值
            const sp = e.hideFieldValue.split(',')
            if (sp.includes(pVal)) {
              isShow = false
            }
          }
        }

        return isShow
        // return !exclude.includes(e.assignmentModeDcode)
      }
    },
    pid2pVal() { // 将子控件绑定的父id转换成表单父id对应得值
      return (field) => {
        if (field.selectParentId) {
          const find = this.fieldList.filter(v => v.id === field.selectParentId)
          if (find.length > 0) {
            return this.dataForm[find[0].assignmentCode]
          }
        }
      }
    }
  },
  mounted() {
    this.getFieldList()
    this.getButtonList()
    if (this.defaultData && Object.keys(this.defaultData).length > 0) {
      this.initForm(this.defaultData)
    }
  },
  methods: {
    checkPermission,
    getButtonList() {
      buttonList({ 'entityId': this.entity.id }).then(res => {
        this.formButtonList = res.data.filter(v => v.positionDcode === 'entity_buttonPosition_formBottom')
      })
    },
    initForm(oldData, mergeData) {
      console.log('initForm', oldData, mergeData)

      if (oldData) {
        if (this.entity.isVirtual) { // 如果是虚拟实体，表单加载entity.value
          this.dataForm = { ...oldData.value, map: oldData.map, id: oldData.id }
        } else {
          this.dataForm = oldData
        }
        this.isEdit = true
      } else {
        this.isEdit = false
        if (mergeData) { // 合并默认值
          Object.keys(mergeData).map(v => {
            this.$set(this.defaultForm, v, mergeData[v])
          })
        }
        this.dataForm = { ...this.defaultForm }
      }

      if (this.$refs.publicForm) {
        this.$refs.publicForm.resetFields()
      }
    },
    initTreeAddData(e) {
      this.treeAddData = e
    },
    getFieldList() {
      fieldPort.fieldList({ 'entityId': this.entity.id, 'isUpdate': 1 })
        .then((result) => {
          result.forEach(e => {
            if (e.isRequired) {
              this.defaultFormRules[e.assignmentCode] = [{ required: true, message: `请输入或选择${e.name}`, trigger: 'change' }]
            }
          })

          this.fieldList = result
        })
    },
    saveSuccess(e) {
      this.$emit('saveSuccess', e)
    },
    submitPublic(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          this.loading = true
          const { children, map, ...commitData } = this.dataForm // 删除无用字段

          const submitData = { ...commitData, ...this.treeAddData } // 合并树选择

          if (!this.isEdit) {
            jsonPost(this.entity.path, submitData).then((resolve) => {
              this.defaultFormDialogVisible = false
              this.$message.success('保存成功')
              this.$emit('saveSuccess', resolve)
              this.loading = false
            }, (e) => {
              this.loading = false
            })
          } else {
            jsonPut(this.entity.path, commitData).then((resolve) => {
              this.defaultFormDialogVisible = false
              this.$message.success('保存成功')
              this.$emit('saveSuccess', resolve)
              this.loading = false
            }, (e) => {
              this.loading = false
            })
          }
        }
      })
    },
    // 通用按钮事件处理器
    reflectFun(handler, extra) {
      const methodCenter = {
        'checkForm': () => {
          this.$refs.publicForm.validate()
          this.$message.success('表单检查完成')
        },
        'sendGoldCard': (extra) => {
          this.$message.success(`给${extra.name}发放金卡成功`)
        }
      }
      if (Object.prototype.hasOwnProperty.call(methodCenter, handler)) {
        return methodCenter[handler](extra)
      } else {
        this.$message.error('指定事件未绑定')
      }
    }
  }
}
</script>

<style>

</style>
