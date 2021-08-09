<template>
  <div>
    <el-link v-if="!showImg" type="primary" @click.native="openEntityDialog">去选择</el-link>
    <div v-else>
      <div v-if="selectedDatas.length<=0" class="img-upload-btn flex align-center justify-center" @click="openEntityDialog">
        <i class="el-icon-plus avatar-uploader-icon" />
      </div>
    </div>
    <div v-if="!showImg" class="flex">
      {{ selectedName }}
    </div>
    <div v-else class="flex">
      <el-image
        v-for="(item,index) in selectedDatas"
        :key="index"
        style="width: 100px; height: 100px"
        :src="item.path"
        fit="fill"
        :preview-src-list="selectedDatas.map(v=>v.path)"
      />
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
import { entityById } from '@/api/una/sys_entity'
import { chPut, chDelete, chGet, chPost } from '../../api/index'

export default {
  name: 'UnaEntitySelect',
  components: {

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
    },
    showImg: {
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
      selectedName: '',
      selectedDatas: []
    }
  },
  mounted() {
    console.log('sssss,,', this.field.optionEntityId)
    entityById(this.field.optionEntityId).then((res) => {
      console.log(res, 'kkkkkkkkkkk')
      this.entity = res.data
      console.log(this.entity, '88888888888888888')
    })

    this.selVal = this.value
  },
  methods: {
    openEntityDialog() {
      console.log('去选择')
      this.entityDialogVisible = true
    },
    submitSelect(e, en, datas) {
      console.log(e)
      this.entityDialogVisible = false
      this.selectedName = en
      this.selectedDatas = datas
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
      // chGet(this.entity.path + `/${e.id}`).then((resolve) => {
      this.defaultFormDialogVisible = true
      this.$nextTick(() => {
        console.log(this.$refs)
        this.$refs.formController.initForm(e)
      })
      // })
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

<style lang="scss" scoped>
  .img-upload-btn {
    height: 100px;
    width: 100px;

    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    overflow: hidden;
  }
</style>
