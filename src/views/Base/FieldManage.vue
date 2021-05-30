<template>
  <div class="app-container">
    <el-dialog :title="entity.name" :visible.sync="defaultFormDialogVisible" width="700px" :append-to-body="true">
      <el-form
        ref="publicAddForm"
        :model="dataForm"
        status-icon
        :rules="defaultFormRules"
        label-width="70px"
      >
        <h3>基本信息</h3>
        <div class="flex justify-between">
          <el-form-item label="所属实体" prop="entityIdName">
            <el-input v-model="dataForm.entityIdName" />
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
            <el-input v-model="dataForm.assignmentCode" />
          </el-form-item>
          <el-form-item label="取值编码" prop="displayCode">
            <el-input v-model="dataForm.displayCode" />
          </el-form-item>
        </div>
        <div class="flex justify-between">
          <el-form-item label="赋值编码" prop="assignmentCode">
            <el-input v-model="dataForm.assignmentCode" />
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
        <h3>表单相关</h3>
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
            <el-button size="medium" type="primary" @click="showAddDialog">添加{{ this.entity.name }}</el-button>
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
                <el-table-column label="操作" width="100" fixed="right">
                  <template slot-scope="scope">
                    <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
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
import { chDelete, chGet, chPost } from '../../api/index'
import CardArea from '../../layout/components/CardArea'
import UnaSingleSelect from '../../layout/components/UnaSingleSelect.vue'

export default {
  name: 'DeviceTypeManage',
  components: {
    ClientArea, CardArea, UnaSingleSelect
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
      defaultForm: {}, // 默认表单
      defaultFormRules: {
        name: [{ required: true, message: '请输入名称', trigger: 'change' }],
        path: [{ required: true, message: '请输入路径', trigger: 'change' }],
        className: [{ required: true, message: '请输入类名', trigger: 'change' }]
      },
      dataForm: {}, // 数据表单，绑定数据的
      defaultFormDialogVisible: false
    }
  },
  mounted() {
    this.entity = getEntity(this.className)
    this.getTreeList()
    this.getFieldList(this.entity.id)
    this.getPublicList()
  },
  methods: {
    showAddDialog() {
      if (Array.isArray(this.relationList) && this.relationList.length > 0 && !this.treeSelected) {
        this.$message.error('请选择树节点')
        return false
      }
      this.dataForm = { ...this.defaultForm }
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
      this.treeSelected = e.id
      const obj = {}
      const code = this.relationList[0].relatedFieldCode
      // 刷新表格
      obj[code] = e.id
      this.getPublicList(obj)
      // 设置表单父类元素默认值
      this.$set(this.defaultForm, code, e.id)
    },
    getFieldList(entityId) {
      // return new Promise((resolve, reject) => {
      fieldPort.fieldList({ 'entityId': entityId }).then((result) => {
        console.log('字段列表', result)
        this.fieldList = result.map(record => {
          this.defaultForm[record.assignmentCode] = ''
          return record
        })

        this.dataForm = { ...this.defaultForm }
        // resolve()
      })
      // })
    },
    getPublicList(e) {
      chGet(this.entity.path.replace('/sys', '') + '/page', e).then((result) => {
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
      console.log('kkk')
      if (Array.isArray(this.relationList) && this.relationList.length > 0) {
        const path = this.relationList[0].parentEntityPath
        const fieldCode = this.relationList[0].relatedFieldCode
        const dataValue = this.relationList[0].parentDataValue
        const obj = {}
        obj[fieldCode] = dataValue
        chGet(path.replace('/sys', '') + '/list', obj).then((result) => {
          console.log('sss', result)
          this.treeData = result
        })
      }
    }
  }

}
</script>

<style>

</style>
