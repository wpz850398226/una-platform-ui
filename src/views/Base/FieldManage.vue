<template>
  <div class="app-container">
    <el-dialog
      :title="entity.name"
      :visible.sync="defaultFormDialogVisible"
      width="1200px"
      :append-to-body="true"
    >
      <el-form
        ref="fieldForm"
        :model="dataForm"
        status-icon
        :rules="defaultFormRules"
        label-width="100px"
      >
        <h3>基本信息</h3>
        <div class="flex justify-between">
          <el-form-item label="所属实体" prop="entityIdName">
            <el-input v-model="dataForm.entityIdName" readonly />
            <el-input v-model="dataForm.entityId" style="display:none;" readonly />
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="dataForm.name" />
          </el-form-item>
<!--        </div>-->
<!--        <div class="flex justify-between">-->
          <el-form-item label="所属组名" prop="groupName">
            <el-input v-model="dataForm.groupName" />
          </el-form-item>
          <el-form-item label="所属权限" prop="permissionId">
            <el-select
              v-model="dataForm.permissionId"
              filterable
              clearable
            >
              <el-option
                v-for="item in permissionList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />

            </el-select>
          </el-form-item>
        </div>
        <div class="flex justify-between">
          <el-form-item label="赋值编码" prop="assignmentCode">
            <el-input v-model="dataForm.assignmentCode" />
          </el-form-item>
          <el-form-item label="取值编码" prop="displayCode">
            <el-input v-model="dataForm.displayCode" />
          </el-form-item>

<!--        </div>-->
<!--        <div class="flex justify-between">-->
          <el-form-item label="转换值编码" prop="transformDisplayCode">
            <el-input v-model="dataForm.transformDisplayCode" />
          </el-form-item>

          <el-form-item label="存储类型" prop="columnTypeDcode">
            <UnaDicSelect v-model="dataForm.columnTypeDcode" parent-code="field_storage" auto-pick-first />
          </el-form-item>
        </div>
        <h3>表格相关</h3>
        <div class="flex justify-between">
          <el-form-item label="展示" prop="isEffect">
            <el-switch
              v-model="dataForm.isEffect"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-form-item>
          <el-form-item label="导入" prop="isImport">
            <el-switch
              v-model="dataForm.isImport"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-form-item>
          <el-form-item label="导出" prop="isExport">
            <el-switch
              v-model="dataForm.isExport"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-form-item>
<!--        </div>-->
<!--        <div class="flex justify-between">-->
          <el-form-item label="展示方式" prop="displayModeDcode">
            <UnaDicSelect v-model="dataForm.displayModeDcode" parent-code="field_display" auto-pick-first />
          </el-form-item>
          <!-- <el-form-item label="展示长度" prop="displayLength">
            <el-input
              v-model="dataForm.displayLength"
              type="number"
            />
          </el-form-item> -->
        </div>
        <h3>表单相关</h3>
        <div class="flex justify-between">
          <el-form-item label="是否必填" prop="isRequired">
            <el-switch
              v-model="dataForm.isRequired"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-form-item>
          <el-form-item label="表单是否加载" prop="isUpdate">
            <el-switch
              v-model="dataForm.isUpdate"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-form-item>
          <el-form-item label="批量修改" prop="isBatchUpdate">
            <el-switch
              v-model="dataForm.isBatchUpdate"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-form-item>
        </div>
        <div class="flex justify-between">
          <el-form-item label="赋值方式" prop="assignmentModeDcode">
            <UnaDicSelect v-model="dataForm.assignmentModeDcode" parent-code="field_assignment" auto-pick-first />
          </el-form-item>
          <el-form-item label="可选上限" prop="selectableLimitNum">
<!--            <el-input
              v-model="dataForm.selectableLimitNum"
              type="number"
            />-->
            <el-input-number
              v-model="dataForm.selectableLimitNum"
              controls-position="right"
              :min="1"
              :max="10"
            />
          </el-form-item>
<!--        </div>-->
<!--        <div class="flex justify-between">-->
          <el-form-item label="格式校验" prop="formatCheckTypeDcode">
            <UnaDicSelect v-model="dataForm.formatCheckTypeDcode" parent-code="field_formatDetection" />
          </el-form-item>
          <el-form-item label="数据检测" prop="dataCheckTypeDcode">
            <UnaDicSelect v-model="dataForm.dataCheckTypeDcode" parent-code="field_dataDetection" />
          </el-form-item>
        </div>
        <div
          v-if="dataForm.assignmentModeDcode === 'field_assignment_singleselect' || dataForm.assignmentModeDcode ==='field_assignment_multiselect' || dataForm.assignmentModeDcode ==='field_assignment_entityRecord'"
          class="flex justify-between"
        >
          <el-form-item label="选项实体" prop="optionEntityId">
            <el-select
              v-model="dataForm.optionEntityId"
              filterable
              clearable
              @change="getEntityFieldList"
            >
              <el-option
                v-for="item in entityList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />

            </el-select>
          </el-form-item>
          <el-form-item label="选项展示" prop="optionNameFieldCode">
            <el-select
              v-model="dataForm.optionNameFieldCode"
              clearable
              filterable
            >
              <el-option
                v-for="item in entityFieldList"
                :key="item.id"
                :label="item.name"
                :value="item.assignmentCode"
              />
            </el-select>
          </el-form-item>
<!--        </div>-->
<!--        <div class="flex justify-between">-->
          <el-form-item
            v-if="dataForm.assignmentModeDcode === 'field_assignment_singleselect' || dataForm.assignmentModeDcode ==='field_assignment_multiselect'"
            label="选项提交"
            prop="optionValueFieldCode"
          >
            <el-select
              v-model="dataForm.optionValueFieldCode"
              clearable
              filterable
            >
              <el-option
                v-for="item in entityFieldList"
                :key="item.id"
                :label="item.name"
                :value="item.assignmentCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="选项参数键" prop="optionParamName">
            <el-input
              v-model="dataForm.optionParamName"
            />
          </el-form-item>
          <el-form-item label="选项参数值" prop="optionParamValue">
            <el-input
              v-model="dataForm.optionParamValue"
            />
          </el-form-item>
        </div>
        <div class="flex justify-between">
          <el-form-item label="联动父元素" prop="selectParentId">
            <el-select
              v-model="dataForm.selectParentId"
              filterable
              clearable
            >
              <el-option
                v-for="item in entityLinkageFieldList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
<!--        </div>-->
<!--        <div class="flex justify-between">-->
          <el-form-item label="触隐父字段" prop="hideFieldId">
            <el-select
              v-model="dataForm.hideFieldId"
              filterable
              clearable
            >
              <el-option
                v-for="item in entityLinkageFieldList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="触隐值" prop="hideFieldValue">
            <el-input
              v-model="dataForm.hideFieldValue"
            />
          </el-form-item>
        </div>
        <div class="flex justify-between">
          <el-form-item label="默认值" prop="defaultValue">
            <el-input
              v-model="dataForm.defaultValue"
            />
          </el-form-item>
          <el-form-item label="注释" prop="annotation">
            <el-input
              v-model="dataForm.annotation"
            />
          </el-form-item>
          <el-form-item label="单选备选值" prop="radioOptions">
            <el-input
              v-model="dataForm.radioOptions"
            />
          </el-form-item>
        </div>
<!--        <el-form-item label="选项查询语句" prop="optionSql">-->
<!--          <el-input-->
<!--            v-model="dataForm.optionSql"-->
<!--            type="textarea"-->
<!--            row="3"-->
<!--          />-->
<!--        </el-form-item>-->
        <el-form-item label="备注" prop="optionSql">
          <el-input
            v-model="dataForm.remark"
          />
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="defaultFormDialogVisible = false">取 消</el-button>
        <el-button
          :loading="loading"
          type="primary"
          @click="submitField('fieldForm')"
        >确 定</el-button>
      </span>
    </el-dialog>

    <ClientArea v-if="entity">
      <div slot="content" style="height:100%">
        <el-row style="height: 100%;">
          <el-col
            v-if="Array.isArray(relationList) && relationList.length > 0"
            :span="4"
            style="height: 100%;"
          >
            <Tree :entity="entity" @treeNodeClick="treeNodeClick" />
          </el-col>
          <el-col
            :span="Array.isArray(relationList) && relationList.length > 0 ? 20: 24"
            style="height: 100%;"
          >
            <una-table
              ref="tableController"
              :entity="entity"
              @showAddDialog="showAddDialog"
              @tableRowEdit="handleEdit"
              @tableRowDelete="handleDelete"
              @tableRowSortUp="handleUp"
            />
          </el-col>
        </el-row>
      </div>
    </ClientArea>
  </div>
</template>

<script>
import ClientArea from '../../layout/components/ClientArea'
import { getEntity } from '@/utils/una/entity-util.js'
import * as fieldPort from '../../api/una/sys_field'
import * as entityData from '../../api/una/sys_entity'
import { chDelete, jsonPost, jsonPut } from '../../api/index'
import UnaDicSelect from '@/layout/components/UnaDicSelect.vue'

import Tree from './components/Tree.vue'

export default {
  name: 'FieldManage',
  components: {
    Tree,
    ClientArea, UnaDicSelect
  },
  data() {
    return {
      entity: '',
      relationList: [],
      defaultForm: {
        isEffect: true,
        isUpdate: true
      }, // 默认表单
      defaultFormRules: {
        name: [{ required: true, message: '请输入名称', trigger: 'change' }],
        assignmentCode: [{ required: true, message: '请输入赋值编码', trigger: 'change' }],
        displayModeDcode: [{ required: true, message: '请选择展示方式', trigger: 'change' }],
        assignmentModeDcode: [{ required: true, message: '请选择赋值方式', trigger: 'change' }],
        columnTypeDcode: [{ required: true, message: '请选择存储方式', trigger: 'change' }]
      },
      dataForm: {}, // 数据表单，绑定数据的
      defaultFormDialogVisible: false,
      entityList: [],
      entityFieldList: [],
      entityLinkageFieldList: [],
      treeSelected: '',
      treeNode: '',
      treeQuery: {},
      loading: false,
      isEdit: false,
      permissionList: []
    }
  },
  mounted() {
    this.entity = getEntity(this.$route.meta.code)
    this.relationList = this.entity.relationList
    this.getEntityListAll()
  },
  methods: {
    getPermissionList(entityId) {
      entityData.permissionList({ entityId: entityId }).then(res => {
        this.permissionList = res
      })
    },
    syncName(e) {
      this.dataForm.displayCode = JSON.stringify(e)
    },
    updateTableData(query) {
      this.$refs.tableController.getPublicList(query)
    },
    treeNodeClick(code, id, node) {
      const obj = {}
      obj[code] = id
      this.treeSelected = id
      this.treeQuery = obj
      this.treeNode = node
      this.updateTableData(obj)

      this.getEntityLinkageFieldList(node.id)
      this.getPermissionList(node.id)
    },
    getEntityFieldList(e) {
      fieldPort.fieldList({ 'entityId': e }).then(res => {
        this.entityFieldList = res
      })
    },
    getEntityLinkageFieldList(e) {
      fieldPort.fieldList({ 'entityId': e }).then(res => {
        this.entityLinkageFieldList = res
      })
    },
    getEntityListAll() {
      entityData.entityListAll().then(res => {
        this.entityList = res
      })
    },
    showAddDialog() {
      if (Array.isArray(this.relationList) && this.relationList.length > 0 && !this.treeSelected) {
        this.$message.error('请选择树节点')
        return false
      }

      this.isEdit = false
      this.dataForm = { ...this.defaultForm }
      this.dataForm.entityId = this.treeSelected
      this.dataForm.entityIdName = this.treeNode.title
      this.dataForm.selectableLimitNum = 1
      this.defaultFormDialogVisible = true

      if (this.$refs.fieldForm) {
        this.$refs.fieldForm.resetFields()
        this.$refs.fieldForm.clearValidate()
      }
    },
    handleEdit(e) {
      this.isEdit = true
      // chGet(this.entity.path + `/${e.id}`).then((resolve) => {
      this.defaultFormDialogVisible = true
      this.dataForm = { ...e }
      // })
    },
    handleDelete(e) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        chDelete(this.entity.path + `/${e.id}`).then((resolve) => {
          this.$message.success('删除成功!')
          this.updateTableData(this.treeQuery)
        })
      })
    },
    handleUp(e) {
      jsonPut(this.entity.path + `/ascend/${e.id}`).then((resolve) => {
        this.$message.success('保存成功')
        this.updateTableData(this.treeQuery)
      })
    },
    submitField(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          delete this.dataForm.map
          if (!this.isEdit) {
            jsonPost(this.entity.path, this.dataForm).then((resolve) => {
              this.defaultFormDialogVisible = false
              this.$message.success('保存成功')
              this.updateTableData(this.treeQuery)
              this.loading = false
            }, (e) => {
              this.loading = false
            })
          } else {
            jsonPut(this.entity.path, this.dataForm).then((resolve) => {
              this.defaultFormDialogVisible = false
              this.$message.success('保存成功')
              this.updateTableData(this.treeQuery)
              this.loading = false
            }, (e) => {
              this.loading = false
            })
          }
        }
      })
    }
  }
}
</script>

<style>

</style>
