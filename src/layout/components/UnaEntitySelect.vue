<template>
  <div>
    <el-button type="primary" @click="openEntityDialog">去选择</el-button>
    <div class="flex">
      {{ selectedName }}
    </div>

    <div v-if="entity">
      <el-dialog
        :title="entity.name"
        :visible.sync="defaultFormDialogVisible"
        width="550px"
        :append-to-body="true"
      >
        <una-form ref="formController" :entity="entity" @saveSuccess="saveSuccess" />
      </el-dialog>

      <el-dialog title="选择" fullscreen :visible.sync="entityDialogVisible" :append-to-body="true">
        <div style="height: 80vh">
          <una-table
            ref="tableController"
            :entity="entity"
            select-sure-btn
            :selectable="true"
            :multiple="multiple"
            @submitSelect="submitSelect"
            @showAddDialog="showAddDialog"
            @tableRowEdit="handleEdit"
            @tableRowDelete="handleDelete"
            @tableRowSortUp="handleUp"
          />
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import UnaForm from '../../views/Base/components/UnaForm.vue'
import UnaTable from '../../views/Base/components/UnaTable.vue'
import { entityList } from '@/api/una/sys_entity'
import { chPut, chDelete, chGet, chPost } from '../../api/index'

export default {
  name: 'UnaEntitySelect',
  components: {
    UnaTable, UnaForm
  },
  model: {
    prop: 'value',
    event: 'updateVal'
  },
  props: {
    field: {
      required: true,
      type: Object
    },
    // eslint-disable-next-line vue/require-prop-types
    value: {
      required: true
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      entityDialogVisible: false,
      defaultFormDialogVisible: false,
      selVal: '',
      entity: '',
      selectedName: ''
    }
  },
  mounted() {
    entityList(1, 1, { id: this.field.optionEntityId }).then((res) => {
      this.entity = res.data[0]
    })

    this.selVal = this.value
  },
  methods: {
    openEntityDialog() {
      this.entityDialogVisible = true
    },
    submitSelect(e, en) {
      console.log(e)
      this.entityDialogVisible = false
      this.selectedName = en
      this.updateVal(e)
    },
    updateVal(e) {
      this.$emit('updateVal', e)
    },
    // 基础事件
    updateTableData(query) {
      this.$refs.tableController.getPublicList(query)
    },
    saveSuccess() {
      this.defaultFormDialogVisible = false
      this.updateTableData()
    },
    showAddDialog() {
      this.defaultFormDialogVisible = true
      this.$nextTick(() => {
        console.log(this.$refs)
        this.$refs.formController.initForm('')
      })
    },
    handleEdit(e) {
      chGet(this.entity.path + `/${e.id}`).then((resolve) => {
        this.defaultFormDialogVisible = true
        this.$nextTick(() => {
          console.log(this.$refs)
          this.$refs.formController.initForm(resolve.data)
        })
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
    }
  }
}
</script>
