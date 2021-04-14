<template>
  <div>
    <div class="scale">
      <el-button
        icon="el-icon-plus"
        size="small"
        :disabled="scale >= 150"
        circle
        @click="scale += 10"
      />
      <span>{{ scale }}%</span>
      <el-button
        icon="el-icon-minus"
        size="small"
        :disabled="scale <= 50"
        circle
        @click="scale -= 10"
      />
    </div>
    <div
      class="design"
      :style="
        'transform: scale(' +
          scale / 100 +
          '); transform-origin: 50% 0px 0px; width: 100%;height:calc(100vh - 200px - '+(scale-100)*5.5+'px);'
      "
    >
      <Process @select="selectNode" />
      <el-row>
        <div class="end">
          <div />
          <div />
          <div class="end-node">流程结束</div>
        </div>
      </el-row>
    </div>
    <el-drawer
      :title="select.name"
      :visible.sync="drawer"
      size="500px"
      direction="rtl"
      :modal="false"
    >
      <div slot="title">
        <el-input
          v-if="showInput"
          v-model="select.name"
          size="medium"
          style="width: 300px"
          @blur="showInput = false"
        />
        <el-link v-else style="font-size: medium" @click="showInput = true">
          <i class="el-icon-edit" style="margin-right: 10px" />
          {{ select.name }}
        </el-link>
      </div>

      <NodeConfig :node="select" />
    </el-drawer>
  </div>
</template>

<script>
import Process from './process/index.vue'
import NodeConfig from './process/NodeConfig.vue'

export default {
  name: 'ProcessDesign',
  components: { Process, NodeConfig },
  data() {
    return {
      select: {},
      showInput: false,
      drawer: false,
      scale: 100,
      nodes: []
    }
  },
  methods: {
    selectNode(node) {
      this.select = node
      this.drawer = true
    }
  }
}
</script>

<style lang="scss" scoped>

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: #e1e1e1;
}

::-webkit-scrollbar-thumb {
  border-radius: 16px;
  background-color: #99999a;
}
.design {
  margin-top: 50px;
  height: calc(100vh - 345px);
  border: 1px solid red;
  overflow-y: scroll;
  ::v-deep .el-row {
    display: flex;
    justify-content: center;
    .end {
      .end-node {
        margin-bottom: 20px;
        border-radius: 15px;
        padding: 5px 10px;
        font-size: small;
        color: #747474;
        background-color: #f2f2f2;
        box-shadow: 0 0 10px 0 #bcbcbc;
      }
    }
  }
}

::v-deep .el-link {
  display: inline;
  width: 50px;
}

::v-deep .el-drawer__body {
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background-color: #e1e1e1;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background-color: #a8a8a9;
  }
}
.scale {
  position: absolute;
  top: 160px;
  right: 20px;

  span {
    margin: 0 10px;
    font-size: 15px;
    color: #7a7a7a;
    width: 50px;
  }
}
</style>
