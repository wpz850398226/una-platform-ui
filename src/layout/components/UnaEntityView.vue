<template>
  <div>
    <el-link type="primary" @click="openEntityView">查看</el-link>

    <el-dialog
      :title="entity.name"
      :visible.sync="defaultFormDialogVisible"
      width="1000px"
      :append-to-body="true"
    >
      <una-form ref="formController" :entity="entity" @saveSuccess="saveSuccess" />
    </el-dialog>

    <el-dialog

      title="实体记录"
      fullscreen
      :visible.sync="entityDialogVisible"
      :append-to-body="true"
    >

      <una-table
        ref="tableController"
        :entity="entity"
        :query="dataQuery"
        @tableRowEdit="handleEdit"
        @tableRowDelete="handleDelete"
        @tableRowSortUp="handleUp"
      />

      <!-- @tableRowEdit="handleEdit"
        @tableRowDelete="handleDelete"
        @tableRowSortUp="handleUp" -->

      <!--  @tableRowEdit="handleEdit"
        @tableRowDelete="handleDelete"
        @tableRowSortUp="handleUp" -->
      <!-- @showAddDialog="showAddDialog"
        @tableRowEdit="handleEdit"
        @tableRowDelete="handleDelete"
        @tableRowSortUp="handleUp" -->
    </el-dialog>
  </div>
</template>

<script>
import UnaForm from '../../views/Base/components/UnaForm.vue'
import { entityList } from '@/api/una/sys_entity'
import { chPut, chDelete } from '@/api/index'

export default {
  name: 'UnaEntityView',
  components: {
    UnaForm
  },
  props: {
    field: { type: Object, required: true },
    row: { type: Object, required: true }
  },
  data() {
    return {
      entity: '',
      dataQuery: {},
      defaultFormDialogVisible: false,
      entityDialogVisible: false
    }
  },

  mounted() {
    // this.entity = getEntity('CpOrderItem')
    entityList(1, 1, { id: this.field.optionEntityId }).then((res) => {
      this.entity = res.data[0]
    })
    // this.field.optionEntityId

    console.log(this.entity, 'entityview')
    console.log(this.field, 'field')
    console.log(this.row, 'row')
    const map = {}
    if (Object.prototype.hasOwnProperty.call(this.field, 'optionParamName')) {
      if (Object.prototype.hasOwnProperty.call(this.field, 'optionParamValue')) {
        if (this.field.optionParamValue.indexOf('$s') !== -1) {
          const k = this.field.optionParamValue.substring(3)
          if (Object.prototype.hasOwnProperty.call(this.row, k)) {
            map[this.field.optionParamName] = this.row[k]
          }
        } else {
          map[this.field.optionParamName] = this.field.optionParamValue
        }
      }
      this.dataQuery = map
    }
  },
  methods: {
    openEntityView() {
      this.entityDialogVisible = true
    },
    handleEdit(e) {
      this.defaultFormDialogVisible = true
      this.$nextTick(() => {
        this.$refs.formController.initForm(e)
      })
    },
    handleUp(e) {
      chPut(this.entity.path + `/ascend/${e.id}`).then((resolve) => {
        this.$message.success('保存成功')
        this.updateTableData()
      })
    },
    handleDelete(e) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        chDelete(this.entity.path + `/${e.id}`).then((resolve) => {
          this.$message.success('删除成功!')
          this.updateTableData()
        })
      })
    },
    saveSuccess() {
      this.defaultFormDialogVisible = false
      this.updateTableData()
    },
    updateTableData() {
      this.$refs.tableController.getPublicList(this.dataQuery)
    }
  }
}
</script>
