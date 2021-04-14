<template>
  <el-dialog
    title="选择角色"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    :modal="false"
    :visible.sync="show"
    :before-close="close"
    width="700px"
    center
  >
    <!-- <el-checkbox-group v-model="checkList">
      <el-checkbox
        v-for="(item,index) in roleList"
        :key="index"
        :label="item.id"
      >{{ item.name }}</el-checkbox>
    </el-checkbox-group> -->
    <el-transfer v-model="checkList" filterable :titles="['全部角色', '已选角色']" :data="roleList" :props="roleProps" />
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">取 消</el-button>
      <el-button type="primary" size="small" @click="selectOk">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'RoleBox',
  props: {
    // 是否展示
    show: {
      default: false,
      type: Boolean
    },
    roleList: {
      default: () => [],
      type: Array
    },
    selected: {
      default: () => [],
      type: Array
    }
  },
  data() {
    return {
      roleProps: {
        key: 'id',
        label: 'name'
      },
      checkList: []
    }
  },
  watch: {
    show() {
      if (this.show) {
        this.init()
      }
    }
  },
  methods: {
    init() {
      const t = []
      console.log('检查', this.selected)
      this.selected.forEach(m => {
        t.push(m.id)
      })
      this.checkList = t
      console.log('自动', this.checkList)
    },
    selectOk() {
      this.$emit('selectOver', this.checkList)
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style>

</style>
