<template>
  <div class="app-container">
    <el-dialog
      :title="entity.name"
      :visible.sync="defaultFormDialogVisible"
      width="1000px"
      :append-to-body="true"
    >
      <una-form v-if="defaultFormDialogVisible" ref="formController" :entity="entity" @saveSuccess="saveSuccess" />
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
              :query="dataQuery"
              selectable
              multiple
              @showAddDialog="showAddDialog"
              @tableRowEdit="handleEdit"
              @tableRowDelete="handleDelete"
              @tableRowSortUp="handleUp"
              @submitSelect="submitSelect"
            />
          </el-col>
        </el-row>
      </div>
    </ClientArea>

    <div v-else>
      <ClientArea>
        <div slot="content" style="height:100%">
          页面未配置
        </div>
      </ClientArea>
    </div>
  </div>
</template>

<script>
import ClientArea from '../../layout/components/ClientArea'

import { getEntity } from '@/utils/una/entity-util.js'
import { chPut, chDelete } from '../../api/index'

// 分解代码
import Tree from './components/Tree.vue'

export default {
  name: 'SysManage',
  components: {
    Tree,
    ClientArea
  },
  data() {
    return {
      treeSelected: '', // 选中的树节点id
      relationList: [],
      entity: '',
      defaultFormDialogVisible: false,
      treeQuery: {},
      dataQuery: {},
      treeAddData: {},
      treeMergeData: {}
    }
  },
  mounted() {
    this.entity = getEntity(this.$route.meta.code)
    // this.dataQuery = qs.parse(this.$route.meta.query)
    this.relationList = this.entity.relationList
  },
  methods: {
    // 新增分散处理
    treeNodeClick(code, id, node) {
      const obj = {}
      obj[code] = id
      this.treeSelected = id
      this.treeQuery = obj
      this.$refs.tableController.initPage()
      this.updateTableData(obj)

      if (this.relationList.length > 0) {
        const map = {}
        const rel = this.relationList[0]
        map[rel.relatedFieldCode] = node.id
        this.treeAddData = map
        if (Object.prototype.hasOwnProperty.call(rel, 'extendFieldCode')) {
          const mergeMap = {}
          mergeMap[rel.extendFieldCode] = node[rel.extendFieldCode]
          this.treeMergeData = mergeMap
        }
      }


    },
    updateTableData(query) {
      this.$refs.tableController.getPublicList(query)
    },
    saveSuccess() {
      this.defaultFormDialogVisible = false
      this.updateTableData(Object.keys(this.treeQuery).length > 0 ? this.treeQuery : '')
    },
    // 新增分散处理

    handleEdit(e) {
      // chGet(this.entity.path + `/${e.id}`).then((resolve) => {
      this.defaultFormDialogVisible = true
      this.$nextTick(() => {
        this.$refs.formController.initTreeAddData(this.treeAddData)
        this.$refs.formController.initForm(e)
      })
      // })
    },
    handleUp(e) {
      chPut(this.entity.path + `/ascend/${e.id}`).then((resolve) => {
        this.$message.success('保存成功')
        this.updateTableData(this.treeQuery)
      })
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
    showAddDialog() {
      if (Array.isArray(this.relationList) && this.relationList.length > 0 && !this.treeSelected) {
        this.$message.error('请选择树节点')
        return false
      }
      this.defaultFormDialogVisible = true
      this.$nextTick(() => {
        this.$refs.formController.initTreeAddData(this.treeAddData)
        this.$refs.formController.initForm('', { ...this.treeQuery, ...this.treeMergeData })
      })
    },
    submitSelect(e) {

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
// .box-content {
//   width: calc(100%);
//   height: 100%;
//   border-radius: 5px;
// }
</style>
