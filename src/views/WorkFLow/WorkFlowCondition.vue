<template>
  <div class="app-container">
    <el-dialog title="添加条件" :visible.sync="addConditionsDialogVisible" width="550px" :append-to-body="true">
      <el-form
        ref="conditionsAddForm"
        :model="conditionsForm"
        status-icon
        :rules="conditionsFormRules"
        label-width="120px"
      >
        <el-form-item label="字段名称" prop="name">
          <el-input v-model="conditionsForm.name" />
        </el-form-item>
        <el-form-item label="字段" prop="fields">
          <el-input v-model="conditionsForm.fields" />
        </el-form-item>
        <el-form-item label="关联流程" prop="defId">
          <el-select v-model="conditionsForm.defId" placeholder="请选择流程" style="width: 100%;">
            <el-option
              v-for="item in workflowList"
              :key="item.id"
              :label="item.templateName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="比较符号" prop="val">
          <el-select v-model="conditionsForm.val" placeholder="请选择比较符号" style="width: 100%;">
            <el-option
              v-for="(item, index) in conditionDefine"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="选项类型" prop="optionType">
          <el-select v-model="conditionsForm.optionType" placeholder="请选择选项类型" style="width: 100%;">
            <el-option value="input" label="文本输入" />
            <el-option value="select" label="下拉选择" />
          </el-select>
        </el-form-item>
        <el-form-item v-show="conditionsForm.optionType =='select'" label="条件选项" prop="options">
          <el-input v-model="conditionsForm.options" placeholder="请输入条件选项" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addConditionsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddConditions('conditionsAddForm')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="编辑条件" :visible.sync="editConditionsDialogVisible" width="550px" :append-to-body="true">
      <el-form
        ref="conditionsEditForm"
        :model="conditionsForm"
        status-icon
        :rules="conditionsFormRules"
        label-width="120px"
      >
        <el-form-item label="字段名称" prop="name">
          <el-input v-model="conditionsForm.name" />
        </el-form-item>
        <el-form-item label="字段" prop="fields">
          <el-input v-model="conditionsForm.fields" />
        </el-form-item>
        <el-form-item label="关联流程" prop="defId">
          <el-select v-model="conditionsForm.defId" placeholder="请选择流程" style="width: 100%;">
            <el-option
              v-for="item in workflowList"
              :key="item.id"
              :label="item.templateName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="比较符号" prop="val">
          <el-select v-model="conditionsForm.val" placeholder="请选择比较符号" style="width: 100%;">
            <el-option
              v-for="(item, index) in conditionDefine"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="选项类型" prop="optionType">
          <el-select v-model="conditionsForm.optionType" placeholder="请选择选项类型" style="width: 100%;">
            <el-option value="input">文本输入</el-option>
            <el-option value="select">下拉选择</el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="conditionsForm.optionType =='select'" label="条件选项" prop="options">
          <el-input v-model="conditionsForm.options" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editConditionsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditConditions('conditionsEditForm')">确 定</el-button>
      </span>
    </el-dialog>

    <div class="margin-bottom-sm flex justify-between">
      <div class="flex">
        <el-select v-model="searchKey" class="margin-right-xs" placeholder="请选择流程" style="width: 100%;">
          <el-option
            v-for="item in workflowList"
            :key="item.id"
            :label="item.templateName"
            :value="item.id"
          />
        </el-select>
        <el-button v-if="!searchMode" icon="el-icon-search" plain type="primary" @click="goSearch">搜索</el-button>
        <el-button v-else plain type="primary" @click="backSearch">返回全部</el-button>
      </div>

      <el-button size="medium" type="primary" @click="showAddDialog">添加条件</el-button>
    </div>

    <ClientArea search-bar>
      <div slot="content" style="height:100%">
        <el-table :data="tableData" style="width: 100%;" height="85%">
          <el-table-column prop="name" label="字段名称" width="150" />
          <el-table-column prop="defId" label="关联流程" width="150">
            <template slot-scope="scope">
              {{ convertProcess(scope.row.defId).templateName }}
            </template>
          </el-table-column>
          <el-table-column prop="val" label="条件值" width="150" />
          <el-table-column prop="fields" label="字段" width="150" />
          <el-table-column prop="optionType" label="选项类型" width="150" />
          <el-table-column prop="options" label="条件选项" width="150" />
          <el-table-column label="操作" width="100" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="text" size="mini" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="margin-top flex justify-center">
          <el-pagination
            background
            layout="total, prev, pager, next"
            :total="pageTotal"
            @current-change="switchPage"
          />
        </div>
      </div>
    </ClientArea>
  </div>
</template>

<script>
import * as netData from '../../api/condition'
import * as workflowData from '../../api/workflow'
import ClientArea from '../../layout/components/ClientArea'

const conditionsFormDefault = {
  name: '',
  defId: '',
  val: '',
  fields: '',
  optionType: '',
  options: ''
}

export default {
  name: 'WorkFlowCondition',
  components: {
    ClientArea
  },
  data() {
    return {
      tableData: [],
      workflowList: [],
      conditionDefine: ['>', '<', '==', '>=', '<=', '!='],
      conditionsForm: conditionsFormDefault,
      conditionsFormRules: {
        name: [{ required: true, message: '请输入字段名称', trigger: 'change' }],
        defId: [{ required: true, message: '请输入流程定义id', trigger: 'change' }],
        val: [{ required: true, message: '请输入条件值', trigger: 'change' }],
        fields: [{ required: true, message: '请输入字段', trigger: 'change' }],
        optionType: [{ required: true, message: '请输入选项类型', trigger: 'change' }]

      },
      addConditionsDialogVisible: false,
      editConditionsDialogVisible: false,
      loading: false,
      searchKey: '',
      searchMode: false,
      pageTotal: 0
    }
  },
  computed: {
    convertProcess() {
      return (id) => {
        const t = this.workflowList.filter(v => v.id === id)
        return t.length > 0 ? t[0] : ''
      }
    }
  },
  mounted() {
    this.getConditionsList()
    this.getWorkFlowList()
  },
  methods: {
    getWorkFlowList() {
      workflowData.workflowAllList().then((resolve) => {
        this.workflowList = resolve.rows
      })
    },
    getConditionsList() {
      netData.conditionsList(1, '', this.searchMode ? this.searchKey : '').then((resolve) => {
        this.pageTotal = resolve.total
        this.tableData = resolve.rows
      })
    },
    switchPage(e) {
      netData.conditionsList(e, '', this.searchMode ? this.searchKey : '').then((resolve) => {
        this.pageTotal = resolve.total
        this.tableData = resolve.rows
      })
    },
    handleEdit(e) {
      this.conditionsForm = { ...e }
      this.editConditionsDialogVisible = true
    },
    handleDelete(e) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        netData.deleteConditions(e.id).then((resolve) => {
          this.$message.success('删除成功!')
          this.getConditionsList()
        })
      })
    },
    showAddDialog() {
      this.addConditionsDialogVisible = true
      this.$nextTick(() => {
        this.$refs.conditionsAddForm.resetFields()
      })
    },
    submitAddConditions(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          netData.addConditions(this.conditionsForm).then((resolve) => {
            this.addConditionsDialogVisible = false
            this.$message.success('添加成功')
            this.getConditionsList()
            this.loading = false
          }, (e) => {
            this.loading = false
          })
        }
      })
    },
    submitEditConditions(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          netData.editConditions(this.conditionsForm).then((resolve) => {
            this.editConditionsDialogVisible = false
            this.$message.success('修改成功')
            this.getConditionsList()
            this.loading = false
          }, (e) => {
            this.loading = false
          })
        }
      })
    },
    goSearch() {
      this.searchMode = true
      this.getConditionsList()
    },
    backSearch() {
      this.searchMode = false
      this.getConditionsList()
    }

  }
}
</script>

<style>

</style>
