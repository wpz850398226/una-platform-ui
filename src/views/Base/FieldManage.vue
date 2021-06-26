<template>
  <div class="app-container">
    <el-dialog :title="entity.name" :visible.sync="defaultFormDialogVisible" width="720px" :append-to-body="true">
      <el-form
        ref="publicAddForm"
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
        </div>
        <div class="flex justify-between">
          <el-form-item label="所属组名" prop="groupName">
            <el-input v-model="dataForm.groupName" />
          </el-form-item>
        </div>
        <div class="flex justify-between">
          <el-form-item label="赋值编码" prop="assignmentCode">
            <el-input v-model="dataForm.assignmentCode" @input="syncName" />
          </el-form-item>
          <el-form-item label="取值编码" prop="displayCode">
            <el-input v-model="dataForm.displayCode" />
          </el-form-item>
        </div>
        <div class="flex justify-between">
          <el-form-item label="sql代码" prop="dqlName">
            <el-input v-model="dataForm.dqlName" />
          </el-form-item>
          <el-form-item label="顺序" prop="sortOrder">
            <el-input v-model="dataForm.sortOrder" />
          </el-form-item>
        </div>
        <h3>表格相关</h3>
        <div class="flex justify-between">
          <el-form-item label="展示" prop="isEffect">
            <el-switch
              v-model="dataForm.isEffect"
              active-color="#13ce66"
              :active-value="1"
              :inactive-value="0"
              inactive-color="#ff4949"
            />
          </el-form-item>
          <el-form-item label="排序" prop="isSort">
            <el-switch
              v-model="dataForm.isSort"
              active-color="#13ce66"
              :active-value="1"
              :inactive-value="0"
              inactive-color="#ff4949"
            />
          </el-form-item>
          <el-form-item label="导入" prop="isImport">
            <el-switch
              v-model="dataForm.isImport"
              active-color="#13ce66"
              :active-value="1"
              :inactive-value="0"
              inactive-color="#ff4949"
            />
          </el-form-item>
          <el-form-item label="导出" prop="isExport">
            <el-switch
              v-model="dataForm.isExport"
              active-color="#13ce66"
              :active-value="1"
              :inactive-value="0"
              inactive-color="#ff4949"
            />
          </el-form-item>
        </div>
        <div class="flex justify-between">
          <el-form-item label="展示方式" prop="displayModeDcode">
            <UnaDicSelect v-model="dataForm.displayModeDcode" parent-code="field_display" />
          </el-form-item>
          <el-form-item label="展示长度" prop="displayLength">
            <el-input
              v-model="dataForm.displayLength"
              type="number"
            />
          </el-form-item>
        </div>
        <h3>表单相关</h3>
        <div class="flex justify-between">
          <el-form-item label="是否必填" prop="isRequired">
            <el-switch
              v-model="dataForm.isRequired"
              active-color="#13ce66"
              :active-value="1"
              :inactive-value="0"
              inactive-color="#ff4949"
            />
          </el-form-item>
          <el-form-item label="表单是否加载" prop="isUpdate">
            <el-switch
              v-model="dataForm.isUpdate"
              active-color="#13ce66"
              :active-value="1"
              :inactive-value="0"
              inactive-color="#ff4949"
            />
          </el-form-item>
          <el-form-item label="批量修改" prop="isBatchUpdate">
            <el-switch
              v-model="dataForm.isBatchUpdate"
              active-color="#13ce66"
              :active-value="1"
              :inactive-value="0"
              inactive-color="#ff4949"
            />
          </el-form-item>
        </div>
        <div class="flex justify-between">
          <el-form-item label="赋值方式" prop="assignmentModeDcode">
            <UnaDicSelect v-model="dataForm.assignmentModeDcode" parent-code="field_assignment" />
          </el-form-item>
          <el-form-item label="可选上限" prop="selectableLimitNum">
            <el-input
              v-model="dataForm.selectableLimitNum"
              type="number"
            />
          </el-form-item>
        </div>
        <div class="flex justify-between">
          <el-form-item label="格式校验" prop="formatCheckTypeDcode">
            <UnaDicSelect v-model="dataForm.formatCheckTypeDcode" parent-code="field_formatDetection" />
          </el-form-item>
          <el-form-item label="数据检测" prop="dataCheckTypeDcode">
            <UnaDicSelect v-model="dataForm.dataCheckTypeDcode" parent-code="field_dataDetection" />
          </el-form-item>
        </div>
        {{ dataForm.assignmentModeDcode }}
        <div
          v-if="dataForm.assignmentModeDcode === 'field_assignment_singleselect' || dataForm.assignmentModeDcode ==='field_assignment_multiselect'"
          class="flex justify-between"
        >
          <el-form-item label="选项实体" prop="optionEntityId">
            <el-select
              v-model="dataForm.optionEntityId"
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
          v-if="dataForm.assignmentModeDcode === 'field_assignment_singleselect' || dataForm.assignmentModeDcode ==='field_assignment_multiselect'"
          class="flex justify-between"
        >
          <el-form-item label="选项提交" prop="optionValueFieldCode">
            <el-select
              v-model="dataForm.optionValueFieldCode"
              clearable
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
        </div>
        <div class="flex justify-between">
          <el-form-item label="选项参数值" prop="optionParamValue">
            <el-input
              v-model="dataForm.optionParamValue"
            />
          </el-form-item>
          <el-form-item label="联动父元素" prop="selectParentId">
            <el-select
              v-model="dataForm.selectParentId"
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
          <el-form-item label="触发隐藏" prop="switchHideOption">
            <el-select
              v-model="dataForm.switchHideOption"
            />
          </el-form-item>
          <el-form-item label="被隐藏字段" prop="switchHideIds">
            <el-input
              v-model="dataForm.switchHideIds"
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
        </div>
        <el-form-item label="单选备选值" prop="radioOptions">
          <el-input
            v-model="dataForm.radioOptions"
          />
        </el-form-item>
        <el-form-item label="选项查询语句" prop="optionSql">
          <el-input
            v-model="dataForm.optionSql"
            type="textarea"
            row="3"
          />
        </el-form-item>
        <el-form-item label="备注" prop="optionSql">
          <el-input
            v-model="dataForm.remark"
          />
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="defaultFormDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddPublic('publicAddForm')">确 定</el-button>
      </span>
    </el-dialog>

    <ClientArea>
      <div slot="content" class="flex justify-between" style="height:100%">
        <div
          v-show="Array.isArray(this.relationList) && this.relationList.length > 0"
          class="flex flex-direction justify-between"
        >
          <el-card class="box-card" shadow="never">
            <CardArea>
              <div slot="content">
                结构树
                <el-tree
                  :data="treeData"
                  :props="defaultProps"
                  node-key="id"
                  :default-expanded-keys="[100000]"
                  :expand-on-click-node="false"
                  :default-expand-all="false"
                  @node-click="handleNodeClick"
                />
              </div>
            </CardArea>
          </el-card>
        </div>
        <el-card v-if="tableReady" class="box-content" shadow="never">
          <div class="una-fix-height margin-bottom-sm flex justify-between">
            <el-button size="medium" type="primary" @click="showAddDialog">添加</el-button>
          </div>
          <CardArea>
            <div slot="content">

              <el-table border :data="tableData" style="width: 100%;" height="75%">
                <el-table-column v-for="(field, i) in fieldList" :key="field.id" :prop="field.assignmentCode" :label="field.name">
                  <template slot-scope="scope">
                    <div>
                      <div v-if="typeof scope.row[field.assignmentCode] === 'boolean'">
                        <el-tag v-if="scope.row[field.assignmentCode]" type="primary">是</el-tag>
                        <el-tag v-else type="danger">否</el-tag>
                      </div>
                      <div v-else>
                        {{ scope.row[field.assignmentCode] }}
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="150" fixed="right">
                  <template slot-scope="scope">
                    <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
                    <el-button type="text" @click="handleUp(scope.row)">升序</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="una-fix-height margin-top flex justify-center">
                <el-pagination
                  background
                  layout="total, sizes, prev, pager, next"
                  :total="pageTotal"
                  :pager-count="5"
                  @current-change="switchPage"
                  @size-change="handleSizeChange"
                />
              </div>
            </div>
          </CardArea>
        </el-card>
      </div>
    </ClientArea>
  </div>
</template>

<script>
import ClientArea from '../../layout/components/ClientArea'
import { getEntity } from '@/utils/una/entity-util.js'
import * as fieldPort from '../../api/una/sys_field'
import * as entityData from '../../api/una/sys_entity'
import { chDelete, chGet, chPost, chPut } from '../../api/index'
import CardArea from '../../layout/components/CardArea'
import UnaSingleSelect from '../../layout/components/UnaSingleSelect.vue'
import UnaDicSelect from '@/layout/components/UnaDicSelect.vue'

export default {
  name: 'FieldManage',
  components: {
    ClientArea, CardArea, UnaSingleSelect, UnaDicSelect
  },
  data() {
    return {
      className: this.$route.meta.code,
      entity: '',
      relationList: [],
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      tableReady: false, // 表格数据是否处理完成
      fieldList: [],
      tableData: [],
      pageTotal: 0,
      defaultForm: {
        isEffect: 1
      }, // 默认表单
      defaultFormRules: {
        name: [{ required: true, message: '请输入名称', trigger: 'change' }],
        assignmentCode: [{ required: true, message: '请输入赋值编码', trigger: 'change' }],
        displayModeDcode: [{ required: true, message: '请选择展示方式', trigger: 'change' }],
        assignmentModeDcode: [{ required: true, message: '请选择赋值方式', trigger: 'change' }]
      },
      dataForm: {}, // 数据表单，绑定数据的
      defaultFormDialogVisible: false,
      node: '', // 当前选中节点
      entityList: [],
      entityFieldList: [],
      entityLinkageFieldList: []
    }
  },
  mounted() {
    console.log(this.$route.meta)
    this.entity = getEntity(this.className)
    this.getTreeList()
    this.getFieldList(this.entity.id)
    this.getPublicList()
    this.getEntityListAll()
  },
  methods: {
    syncName(e) {
      this.dataForm.displayCode = e
    },
    getEntityFieldList(e) {
      console.log(e)
      fieldPort.fieldList({ 'entityId': e }).then(res => {
        this.entityFieldList = res
      })
    },
    getEntityLinkageFieldList(e) {
      console.log(e)
      fieldPort.fieldList({ 'entityId': e }).then(res => {
        this.entityLinkageFieldList = res
      })
    },
    getEntityListAll() {
      entityData.entityListAll().then(res => {
        console.log(res, '实体')
        this.entityList = res
      })
    },
    showAddDialog() {
      if (Array.isArray(this.relationList) && this.relationList.length > 0 && !this.treeSelected) {
        this.$message.error('请选择树节点')
        return false
      }
      this.dataForm = { ...this.defaultForm }
      this.dataForm.entityId = this.node.id
      this.dataForm.entityIdName = this.node.title
      this.dataForm.isEffect = 1

      this.defaultFormDialogVisible = true

      if (this.$refs.dataForm) {
        this.$refs.dataForm.clearValidate()
      }
    },
    handleSizeChange(e) {
      this.getPublicList({ 'pageNum': 1, 'pageSize': e })
    },
    switchPage(e) {
      this.getPublicList({ 'pageNum': e })
    },
    handleNodeClick(e) {
      this.node = e
      console.log(e)
      this.treeSelected = e.id
      const obj = {}
      const code = this.relationList[0].relatedFieldCode
      // 刷新表格
      obj[code] = e.id
      this.getPublicList(obj)
      this.getEntityLinkageFieldList(e.id)

      // 设置表单父类元素默认值
      this.$set(this.defaultForm, code, e.id)
    },
    getFieldList(entityId) {
      fieldPort.fieldList({ 'entityId': entityId }).then((result) => {
        console.log('字段列表', result)
        this.fieldList = result.map(record => {
          this.defaultForm[record.assignmentCode] = ''
          return record
        })

        this.dataForm = { ...this.defaultForm }
      })
    },
    getPublicList(e) {
      chGet(this.entity.path + '/page', e).then((result) => {
        this.pageTotal = result.count
        this.tableData = result.data.map(record => {
          this.fieldList.forEach(field => {
            if (record[field.assignmentCode] && field.assignmentCode !== field.displayCode) {
              // 如果赋值编码不等于显示编码，则查询显示数据
              record[field.assignmentCode] = record['map'][field.displayCode]
            }
          })
          return record
        })
        this.tableReady = true
      })
    },
    getTreeList() {
      this.relationList = this.entity.relationList
      if (Array.isArray(this.relationList) && this.relationList.length > 0) {
        const path = this.relationList[0].parentEntityPath
        const fieldCode = this.relationList[0].relatedFieldCode
        const dataValue = this.relationList[0].parentDataValue
        const obj = {}
        obj[fieldCode] = dataValue
        chGet(path + '/list', obj).then((result) => {
          console.log('sss', result)
          this.treeData = result
        })
      }
    },
    submitAddPublic(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          this.loading = true
          // this.dataForm.map = ''
          delete this.dataForm.map

          chPost(this.entity.path + '/save', this.dataForm
          ).then((resolve) => {
            this.defaultFormDialogVisible = false
            this.$message.success('保存成功')
            this.getPublicList()
            this.loading = false
          }, (e) => {
            this.loading = false
          })
        }
      })
    },
    handleEdit(e) {
      chGet(this.entity.path + `/${e.id}`).then((resolve) => {
        console.log(resolve.data)
        this.dataForm = resolve.data

        this.dataForm.entityId = this.node.id
        this.dataForm.entityIdName = this.node.title
        console.log(this.dataForm, 'kkk')

        this.getEntityFieldList(this.dataForm.optionEntityId)

        this.defaultFormDialogVisible = true
      }, (e) => {
      })
    },
    handleUp(e) {
      chPut(this.entity.path + `/ascend/${e.id}`).then((resolve) => {
        this.$message.success('保存成功')
        this.getPublicList()
      }, (e) => {
      })
    },
    handleDelete(e) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        chDelete(this.entity.path + `/${e.id}`).then((resolve) => {
          this.$message.success('删除成功!')
          this.getPublicList()
        })
      })
    }
  }

}
</script>

<style>

</style>
