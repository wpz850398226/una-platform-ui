<template>
  <div class="Tree">
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
</template>

<script>
import CardArea from '@/layout/components/CardArea'
import { chGet } from '@/api/index'

export default {
  name: 'Tree',
  components: {
    CardArea
  },
  props: {
    entity: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      treeData: []
    }
  },
  mounted() {
    this.getTreeList()
  },
  methods: {
    getTreeList() {
      const relationList = this.entity.relationList
      if (Array.isArray(relationList) && relationList.length > 0) {
        const path = relationList[0].parentEntityPath
        const fieldCode = relationList[0].relatedFieldCode
        const dataValue = relationList[0].parentDataValue
        const obj = {}
        obj[fieldCode] = dataValue
        chGet(path + '/list', obj).then((result) => {
          console.log('sss', result)
          this.treeData = result
        })
      }
    },
    handleNodeClick(e) {
      this.treeSelected = e.id

      const relationList = this.entity.relationList
      const code = relationList[0].relatedFieldCode

      this.$emit('treeNodeClick', code, e.id)
      // const obj = {}
      // const code = this.relationList[0].relatedFieldCode
      // // 刷新表格
      // obj[code] = e.id
      // this.getPublicList(obj)
      // // 设置表单父类元素默认值
      // this.$set(this.defaultForm, code, e.id)
    }
  }
}
</script>

<style lang="scss" scoped>
  .Tree {
    height: 100%;
    .box-card {
      height: 100%;
    }
  }
</style>
