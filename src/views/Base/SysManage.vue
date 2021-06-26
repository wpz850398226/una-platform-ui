cls<template>
  <div class="app-container">
    <el-dialog :title="entity.name" :visible.sync="defaultFormDialogVisible" width="550px" :append-to-body="true">
      <el-form
        ref="publicAddForm"
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
          <div v-else-if="field.assignmentModeDcode === 'field_assignment_image'" class="avatar avatar-uploader" @click="showAvatar = true">
            <img
              v-if="busUserForm.accountImg"
              class="img"
              :src="dataForm[field.assignmentCode]"
            >
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </div>
          <avatarBox
            v-else-if="field.assignmentModeDcode === 'field_assignment_image'"
            v-model="showAvatar"
            field="img"
            :width="300"
            :height="300"
            img-format="png"
            @crop-success="cropSuccess"
          />
          <div>{{ field.assignmentModeDcode }}</div>
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
          v-show="Array.isArray(relationList) && relationList.length > 0"
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
          <el-row :gutter="20">
            <el-col v-for="(item,index) in entity.queryList" :key="index" :span="8" class="flex">
              <div class="flex align-center">
                <div class="margin-right-xs" style="min-width: 50px;">{{ item.name }}</div>
                <el-input
                  v-if="item.assignmentModeDcode === 'field_query_exactText' || item.assignmentModeDcode === 'field_query_fuzzyText'"
                  v-model="queryFields[item.fieldCode]"
                />
                <el-switch
                  v-else-if="item.assignmentModeDcode === 'field_query_switch'"
                  v-model="queryFields[item.fieldCode]"
                  active-color="#13ce66"
                  :active-value="1"
                  :inactive-value="0"
                  inactive-color="#ff4949"
                />
                <una-single-select
                  v-else-if="item.assignmentModeDcode === 'field_query_singleselect'"
                  v-model="queryFields[item.fieldCode]"
                  :field="item"
                />
                <el-date-picker
                  v-else-if="item.assignmentModeDcode === 'field_query_geDate'"
                  v-model="queryFields[item.fieldCode]"
                  type="date"
                  value-format="yyyy-MM-dd 00:00:00"
                  format="yyyy-MM-dd"
                  clearable
                />
                <el-date-picker
                  v-else-if="item.assignmentModeDcode === 'field_query_leDate'"
                  v-model="queryFields[item.fieldCode]"
                  type="date"
                  value-format="yyyy-MM-dd 23:59:59"
                  format="yyyy-MM-dd"
                  clearable
                />
              </div>

            </el-col>
            <el-col v-if="entity.queryList.length>0" :span="3">
              <el-button size="medium" type="primary" @click="goQuery">搜索</el-button>
            </el-col>
            <el-col :span="3">
              <el-button size="medium" type="primary" @click="showAddDialog">添加{{ this.entity.name }}</el-button>
            </el-col>
          </el-row>
          <CardArea class="margin-top-xs">
            <div slot="content">

              <el-table border :data="tableData" style="width: 100%;" height="75%">
                <el-table-column v-for="field in fieldList" :key="field.id" :prop="field.assignmentCode" :label="field.name">
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
import { chImg } from '@/api/index'
import avatarBox from 'vue-image-crop-upload'
import ClientArea from '../../layout/components/ClientArea'
import CardArea from '../../layout/components/CardArea'
import UnaSingleSelect from '../../layout/components/UnaSingleSelect.vue'
import UnaTreeNode from '../../layout/components/UnaTreeNode.vue'
import UnaLocation from '../../layout/components/UnaLocation.vue'
import UnaUpload from '../../layout/components/UnaUpload.vue'
import CkEditor from '../../components/CKEditor/index.vue'

import * as fieldPort from '../../api/una/sys_field'
import { getEntity } from '@/utils/una/entity-util.js'
import { chPut, chDelete, chGet, chPost } from '../../api/index'

export default {
  name: 'SysManage',
  components: {
    ClientArea, avatarBox, CardArea, UnaSingleSelect, UnaTreeNode,
    CkEditor, UnaLocation, UnaUpload
  },
  data() {
    return {
      className: this.$route.meta.code,
      tableReady: false, // 表格数据是否处理完成
      treeSelected: null, // 选中的树节点id
      relationList: [],
      entity: {},
      fieldList: [],
      tableData: [],
      treeData: [],
      defaultForm: {}, // 默认表单
      dataForm: {}, // 数据表单，绑定数据的
      defaultFormDialogVisible: false,
      loading: false,
      defaultFormRules: {
        // typeDcode: [{ required: true, message: '请输入名称', trigger: 'change' }]
        // path: [{ required: true, message: '请输入路径', trigger: 'change' }],
        // className: [{ required: true, message: '请输入类名', trigger: 'change' }]
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      pageTotal: 0,
      showAvatar: false,
      queryFields: {}
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
  async mounted() {
    this.entity = getEntity(this.className)
    // 处理模糊查询条件
    this.entity.queryList.map((v) => {
      if (v.assignmentModeDcode === 'field_query_fuzzyText') {
        v.fieldCode = `:${v.fieldCode}`
      }
      if (v.assignmentModeDcode === 'field_query_geDate') {
        v.fieldCode = `ge:${v.fieldCode}`
      }
      if (v.assignmentModeDcode === 'field_query_leDate') {
        v.fieldCode = `le:${v.fieldCode}`
      }
      return v
    })

    // 处理模糊查询条件

    console.log(this.entity, '88888')
    await this.getFieldList(this.entity.id)
    this.getPublicList()
    this.getTreeList()
  },
  methods: {
    chImg,
    goQuery() {
      chGet(this.entity.path + '/page', this.queryFields).then((result) => {
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
          if (record.isRequired) {
            this.defaultFormRules[record.assignmentCode] = [{ required: true, message: `请输入或选择${record.name}`, trigger: 'change' }]
          }
          return record
        })

        this.dataForm = { ...this.defaultForm }
        // resolve()
      })
      // })
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
      console.log('kkk')
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
    handleEdit(e) {
      chGet(this.entity.path + `/${e.id}`).then((resolve) => {
        console.log(resolve.data)
        this.dataForm = resolve.data

        this.defaultFormDialogVisible = true
      }, (e) => {
      })

      // this.dataForm = { ...e }
      // this.defaultFormDialogVisible = true
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
    },
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
    submitAddPublic(formName) {
      console.log(this.dataForm)
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          this.loading = true
          // this.dataForm.map = ''
          const { map, ...commitData } = this.dataForm
          console.log('提交检查', commitData)

          chPost(this.entity.path + '/save', commitData).then((resolve) => {
            this.defaultFormDialogVisible = false
            this.$message.success('保存成功')
            this.getPublicList()
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

<style lang="scss" scoped>
.image {
  height: 100px;
  width: 100px;
  display: block;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
  border-radius: 4px;
   .img {
      display: block;
      height: 100%;
      width: 100%;
      border-radius: 4px;
    }
}
.box-card {
  width: 300px;
  height: 100%;
  margin-right: 10px;
}
.box-content {
  width: calc(100%);
  height: 100%;
  border-radius: 5px;
}
</style>
