cls<template>
  <div class="app-container">
    <el-dialog :title="entity.name" :visible.sync="defaultFormDialogVisible" width="550px" :append-to-body="true">
      <el-form
        ref="publicAddForm"
        :model="defaultForm"
        status-icon
        :rules="defaultFormRules"
        label-width="120px"
      >
        <el-form-item
          v-for="field in fieldList"
          :key="field.id"
          :label="field.name"
          :prop="field.assignmentCode"
        >

          <el-input
            v-if="field.assignmentModeDcode === 'field_assignment_text'"
            v-model="defaultForm[field.assignmentCode]"
          />
          <el-input
            v-if="field.assignmentModeDcode === 'field_assignment_hidden'"
            v-model="defaultForm[field.assignmentCode]"
          />
          <UnaSingleSelect
            v-if="field.assignmentModeDcode === 'field_assignment_singleselect'"
            :field="field"
            :model="defaultForm[field.assignmentCode]"
            @getCalled="changeFormValue($event,field.assignmentCode)"
          />
          <el-switch
            v-if="field.assignmentModeDcode === 'field_assignment_switch'"
            v-model="defaultForm[field.assignmentCode]"
            active-color="#13ce66"
            :active-value="1"
            :inactive-value="0"
            inactive-color="#ff4949"
          />
          <el-date-picker
            v-if="field.assignmentModeDcode === 'field_assignment_datetime'"
            v-model="defaultForm[field.assignmentCode]"
            type="datetime"
            :placeholder="field.annotation"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
          <div v-if="field.assignmentModeDcode === 'field_assignment_image'" class="avatar avatar-uploader" @click="showAvatar = true">
            <img
              v-if="busUserForm.accountImg"
              class="img"
              :src="defaultForm[field.assignmentCode]"
            >
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </div>
          <avatarBox
            v-if="field.assignmentModeDcode === 'field_assignment_image'"
            v-model="showAvatar"
            field="img"
            :width="300"
            :height="300"
            img-format="png"
            @crop-success="cropSuccess"
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
import { chImg } from '@/api/index'
import avatarBox from 'vue-image-crop-upload'
import ClientArea from '../../layout/components/ClientArea'
import CardArea from '../../layout/components/CardArea'
import UnaSingleSelect from '../../layout/components/UnaSingleSelect.vue'
import * as fieldPort from '../../api/una/sys_field'
import { findDictionaryList } from '@/utils/find-dictionary.js'
import { getEntity } from '@/utils/una/entity-util.js'
import { chDelete, chGet, chPost } from '../../api/index'

// const publicFormDefault = {
//   parentId: '',
//   name: '',
//   className: '',
//   path: ''
// }

export default {
  name: 'SysManage',
  components: {
    ClientArea, avatarBox, CardArea, UnaSingleSelect
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
        name: [{ required: true, message: '请输入名称', trigger: 'change' }],
        path: [{ required: true, message: '请输入路径', trigger: 'change' }],
        className: [{ required: true, message: '请输入类名', trigger: 'change' }]
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      pageTotal: 0,
      showAvatar: false
    }
  },
  async mounted() {
    this.entity = getEntity(this.className)
    console.log(this.entity)
    await this.getFieldList(this.entity.id)
    this.getPublicList()
    this.getTreeList()
  },
  methods: {
    chImg,
    changeFormValue(e, code) {
      this.dataForm[code] = e
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
    },
    handleEdit(e) {
      this.defaultForm = { ...e }
      this.defaultFormDialogVisible = true
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
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          this.loading = true

          chPost(this.entity.path + '/save', this.defaultForm).then((resolve) => {
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
