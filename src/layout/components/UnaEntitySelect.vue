<template>
  <div>
    <el-link v-if="!showImg" type="primary" @click.native="openEntityDialog">去选择</el-link>
    <!-- <div v-else>
      11
    </div> -->
    <div v-if="!showImg" class="flex">
      {{ selectedName }}
    </div>
    <div v-else class="flex">
      <div v-for="(item,index) in selectedDatas" :key="index" class="flex flex-direction">
        <el-image
          class="margin-right-xs "
          style="width: 100px; height: 100px"
          :src="item.path"
          fit="fill"
          :preview-src-list="selectedDatas.map(v=>v.path)"
        />
        <div class="del-img"><i class="el-icon-delete"></i></div>
        <!-- <el-button type="text" size="mini" @click="delImg(index)">删除</el-button> -->
      </div>

      <div class="img-upload-btn flex align-center justify-center" @click="openEntityDialog">
        <i class="el-icon-plus avatar-uploader-icon" />
      </div>
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
    limit: {
      type: Number,
      default: 1
    },
    showImg: {
      type: Boolean,
      default: false
    },
    realVal: {
      type: Object,
      default: () => {}
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
    entityById(this.field.optionEntityId).then((res) => {
      this.entity = res.data
    })

    this.selVal = this.value
    //

    if (this.selVal && this.realVal) {
      if (this.realVal[this.field.assignmentCode] && this.field.assignmentCode !== this.field.displayCode) {
        // 如果赋值编码不等于显示编码，则查询显示数据
        const realField = this.realVal.map[this.field.displayCode]

        this.selectedDatas = realField
          .split(',')
          .map(v => { return { path: v } })
        this.selectedName = this.realVal.map[this.field.displayCode]
      }
    }
  },
  methods: {
    openEntityDialog() {
      this.entityDialogVisible = true
    },
    delImg(i) {
      this.selectedDatas.splice(i, 1)
      this.updateTableData()
    },
    submitSelect(e, en, datas) {
      if (this.multiple) {
        if (datas.length > this.field.selectableLimitNum) {
          this.$message.warning(`选择数量超过上限(${this.field.selectableLimitNum})`)
          return
        }
      }

      this.entityDialogVisible = false
      this.selectedName = en
      // 追加选中项
      for (let data of datas) {
        this.selectedDatas.push(data)
      }
      console.log(this.selectedDatas)
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
        this.$refs.formController.initForm('')
      })
    },
    handleEdit(e) {
      // chGet(this.entity.path + `/${e.id}`).then((resolve) => {
      this.defaultFormDialogVisible = true
      this.$nextTick(() => {
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

  .del-img {
    position: relative;
    right: -85px;
    top: -105px;
    height: 15px;
    width: 15px;
    cursor: pointer;

  }
</style>
