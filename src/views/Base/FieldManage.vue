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
        label-position="right"
        label-width="100px"
      >
        <h3>基本信息</h3>
        <div class="flex justify-between">
<!--          <el-form-item label="所属实体" prop="entityIdName">-->
<!--            <el-input v-model="dataForm.entityIdName" readonly />-->
<!--            <el-input v-model="dataForm.entityId" style="display:none;" readonly />-->
<!--          </el-form-item>-->
          <el-form-item label="名称" prop="name">
            <el-input v-model="dataForm.name" placeholder="请输入字段名称"/>
          </el-form-item>
<!--        </div>-->
<!--        <div class="flex justify-between">-->
          <el-form-item label="所属组名" prop="groupName">
            <el-input v-model="dataForm.groupName" placeholder="请输入所属组名"/>
          </el-form-item>
          <el-tooltip class="item" effect="dark" content="控制表单中该字段的显隐权限" placement="right">
            <el-form-item label="所属权限" prop="permissionId">
              <el-select
                v-model="dataForm.permissionId"
                filterable
                clearable
                placeholder="请选择所属权限"
              >
                <el-option
                  v-for="item in permissionList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-tooltip>
        </div>
        <div class="flex justify-between">
          <el-tooltip class="item" effect="dark" content="入参值，对应后端字段保存编码" placement="right">
            <el-form-item label="赋值编码" prop="assignmentCode">
              <el-input v-model="dataForm.assignmentCode" placeholder="请输入赋值编码"/>
            </el-form-item>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="出参值，对应前端字段展示编码，默认与赋值编码相同" placement="right">
            <el-form-item label="取值编码" prop="displayCode">
              <el-input v-model="dataForm.displayCode" placeholder="请输入取值编码"/>
            </el-form-item>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="赋值编码与取值编码不同时，通过转换值编码自动转换展示内容" placement="right">
            <el-form-item label="转换值编码" prop="transformDisplayCode">
              <el-input v-model="dataForm.transformDisplayCode" placeholder="请输入转换值所属字段编码"/>
            </el-form-item>
          </el-tooltip>
        </div>
        <h3>表格相关</h3>
        <div class="flex justify-between">
          <el-tooltip class="item" effect="dark" content="是否在表格中展示该列" placement="right">
            <el-form-item label="展示" prop="isEffect">
              <el-switch
                v-model="dataForm.isEffect"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </el-form-item>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="导入模板是否包含该字段" placement="right">
            <el-form-item label="导入" prop="isImport">
              <el-switch
                v-model="dataForm.isImport"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </el-form-item>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="导出数据中是否包含该字段" placement="right">
            <el-form-item label="导出" prop="isExport">
              <el-switch
                v-model="dataForm.isExport"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </el-form-item>
          </el-tooltip>

          <el-form-item label="展示方式" prop="displayModeDcode">
            <UnaDicSelect v-model="dataForm.displayModeDcode" parent-code="field_display" auto-pick-first />
          </el-form-item>

          <el-tooltip v-if="dataForm.displayModeDcode === 'field_display_omit'"
                      class="item" effect="dark" content="控制表格中展示长度，超长部分省略" placement="right">
            <el-form-item label="展示长度" prop="displayLength">
              <el-input v-model="dataForm.displayLength" type="number" />
            </el-form-item>
          </el-tooltip>

        </div>
        <h3>表单相关</h3>
        <div class="flex justify-between">
          <el-tooltip class="item" effect="dark" content="表单中该字段是否必填" placement="right">
            <el-form-item label="必填" prop="isRequired">
              <el-switch
                v-model="dataForm.isRequired"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </el-form-item>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="表单中是否加载该字段" placement="right">
            <el-form-item label="加载" prop="isUpdate">
              <el-switch
                v-model="dataForm.isUpdate"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </el-form-item>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="表单中是否默认隐藏该字段" placement="right">
            <el-form-item label="隐藏" prop="isHidden">
              <el-switch
                v-model="dataForm.isHidden"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </el-form-item>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="批量修改表单中是否加载该字段" placement="right">
            <el-form-item label="批量修改" prop="isBatchUpdate">
              <el-switch
                v-model="dataForm.isBatchUpdate"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </el-form-item>
          </el-tooltip>

        </div>
        <div class="flex justify-between">
          <el-form-item label="赋值方式" prop="assignmentModeDcode">
            <UnaDicSelect v-model="dataForm.assignmentModeDcode" parent-code="field_assignment" auto-pick-first />
          </el-form-item>
          <el-form-item v-if="dataForm.assignmentModeDcode === 'field_assignment_multiselect' || dataForm.assignmentModeDcode === 'field_assignment_entityRecord' || dataForm.assignmentModeDcode === 'field_assignment_fileRepository'" label="可选上限" prop="selectableLimitNum">
            <el-input-number
              v-model="dataForm.selectableLimitNum"
              controls-position="right"
              :min="0"
              :max="100"
            />
          </el-form-item>
          <el-tooltip class="item" effect="dark" content="表单中联动切换该字段显隐的父字段" placement="right">
            <el-form-item label="切隐字段" prop="hideSwitchFieldId">
              <el-select
                v-model="dataForm.hideSwitchFieldId"
                filterable
                clearable
                placeholder="请选择切换显隐字段"
              >
                <el-option
                  v-for="item in entityLinkageFieldList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="联动切换该字段显隐的触发值" placement="right">
            <el-form-item label="切隐值" prop="hideSwitchFieldValue">
              <el-input v-model="dataForm.hideSwitchFieldValue" placeholder="请输入切换显隐触发值"/>
            </el-form-item>
          </el-tooltip>

        </div>
        <div
          v-if="dataForm.assignmentModeDcode === 'field_assignment_singleselect' || dataForm.assignmentModeDcode ==='field_assignment_multiselect' || dataForm.assignmentModeDcode ==='field_assignment_entityRecord'"
          class="flex justify-between"
        >
          <el-tooltip class="item" effect="dark" content="选项来源实体类" placement="right">
            <el-form-item label="选项实体" prop="optionEntityId">
              <el-select
                v-model="dataForm.optionEntityId"
                filterable
                clearable
                @change="getEntityFieldList"
                placeholder="请选择选项所属实体"
              >
                <el-option
                  v-for="item in entityList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />

              </el-select>
            </el-form-item>
          </el-tooltip>
          <el-form-item label="选项展示" prop="optionNameFieldCode">
            <el-select
              v-model="dataForm.optionNameFieldCode"
              clearable
              filterable
              placeholder="请选择选项展示字段"
            >
              <el-option
                v-for="item in entityFieldList"
                :key="item.id"
                :label="item.name"
                :value="item.assignmentCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="dataForm.assignmentModeDcode === 'field_assignment_singleselect' || dataForm.assignmentModeDcode ==='field_assignment_multiselect'"
            label="选项提交"
            prop="optionValueFieldCode"
          >
            <el-select
              v-model="dataForm.optionValueFieldCode"
              clearable
              filterable
              placeholder="请选择选项提交字段"
            >
              <el-option
                v-for="item in entityFieldList"
                :key="item.id"
                :label="item.name"
                :value="item.assignmentCode"
              />
            </el-select>
          </el-form-item>
        </div>
        <div
          v-if="dataForm.assignmentModeDcode === 'field_assignment_singleselect' || dataForm.assignmentModeDcode ==='field_assignment_multiselect' || dataForm.assignmentModeDcode ==='field_assignment_entityRecord'"
          class="flex justify-between"
        >
          <el-form-item label="选项参数键" prop="optionParamName">
            <el-input
              v-model="dataForm.optionParamName"
              placeholder="请输入查询选项参数键"
            />
          </el-form-item>
          <el-form-item label="选项参数值" prop="optionParamValue">
            <el-input
              v-model="dataForm.optionParamValue"
              placeholder="请输入查询选项参数值"
            />
          </el-form-item>
          <el-form-item label="联动父字段" prop="selectParentId">
            <el-select
              v-model="dataForm.selectParentId"
              filterable
              clearable
              placeholder="请选择下拉联动父字段"
            >
              <el-option
                v-for="item in entityLinkageFieldList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="flex justify-between">
          <el-tooltip class="item" effect="dark" content="数据格式校验，与内容无关" placement="right">
            <el-form-item label="格式校验" prop="formatCheckTypeDcode">
              <UnaDicSelect v-model="dataForm.formatCheckTypeDcode" parent-code="field_formatDetection" placeholder="请选择格式校验类型"/>
            </el-form-item>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="数据内容校验，业务或功能相关" placement="right">
            <el-form-item label="数据校验" prop="dataCheckTypeDcode">
              <UnaDicSelect v-model="dataForm.dataCheckTypeDcode" parent-code="field_dataDetection" placeholder="请选择数据校验类型"/>
            </el-form-item>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="数据校验阈值/波幅/有效值/无效值/备选值" placement="right">
            <el-form-item label="阈值" prop="threshold">
              <el-input v-model="dataForm.threshold" placeholder="请输入阈值"/>
            </el-form-item>
          </el-tooltip>
        </div>
        <div class="flex justify-between">
          <el-form-item label="默认值" prop="defaultValue">
            <el-input
              v-model="dataForm.defaultValue"
              placeholder="请输入默认值"
            />
          </el-form-item>
          <el-form-item label="注释" prop="annotation">
            <el-input
              v-model="dataForm.annotation"
              placeholder="请输入注释填充值"
            />
          </el-form-item>
          <el-form-item label="提示" prop="tip">
            <el-input v-model="dataForm.tip" placeholder="请输入提示内容"/>
          </el-form-item>
        </div>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="dataForm.description"
            placeholder="请输入描述信息"
          />
        </el-form-item>
        <h3>数据相关</h3>
        <div class="flex justify-between">
          <el-tooltip class="item" effect="dark" content="数据库存储类型" placement="right">
            <el-form-item label="存储类型" prop="columnTypeDcode">
              <UnaDicSelect v-model="dataForm.columnTypeDcode" parent-code="field_storage" auto-pick-first placeholder="请选择存储类型"/>
            </el-form-item>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="数据库存储长度" placement="right">
            <el-form-item label="存储长度" prop="storageLength">
              <el-input v-model="dataForm.storageLength" placeholder="请输入数据库存储长度"/>
            </el-form-item>
          </el-tooltip>
        </div>

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
        isUpdate: true,
        isHidden: false
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
