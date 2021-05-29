<template>
  <div>
    <div v-if="mode ==0">
      <FormListPanel @newProcess="newProcess" @editProcess="editProcess" />
    </div>
    <div v-if="mode == 1">
      <div class="header">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item
            index="baseSetup"
          >基础设置</el-menu-item>
          <el-menu-item
            index="processDesign"
          >流程设计</el-menu-item>
        </el-menu>
        <div class="publish">
          <el-button
            size="medium"
            type="primary"
            @click="publish"
          ><i class="el-icon-receiving" />保存</el-button>
        </div>
        <div class="back">
          <el-button
            size="medium"
            icon="el-icon-arrow-left"
            circle
            @click="exit"
          />
          <span>
            <i :class="setup.icon" :style="'background:' + setup.background" />
            <span>{{ setup.name }}</span>
          </span>
        </div>
      </div>

      <div class="layout-body">
        <div v-show="activeIndex === 'baseSetup'">
          <BaseSetup />
        </div>
        <div v-show="activeIndex === 'processDesign'">
          <ProcessDesign />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as netData from '../../api/workflow'
import BaseSetup from './components/BaseSetup'
import FormListPanel from './components/FormListPanel'
import ProcessDesign from './components/ProcessDesign'

export default {
  name: 'WorkFlowManage',
  components: {
    BaseSetup, ProcessDesign, FormListPanel
  },
  data() {
    return {
      mode: 0,

      activeIndex: 'baseSetup',
      viewCode: false
    }
  },
  computed: {
    setup() {
      return this.$store.state.workflow.template.baseSetup
    },
    template() {
      return this.$store.state.workflow.template
    }
  },
  mounted() {
    this.activeIndex = 'baseSetup'
  },
  methods: {
    handleSelect(key, keyPath) {
      this.activeIndex = key
    },
    newProcess() {
      this.mode = 1
      this.activeIndex = 'baseSetup'
    },
    editProcess() {
      this.mode = 1
      this.activeIndex = 'baseSetup'
    },
    publish() {
      this.$confirm(
        '您确定审批流程已配置完毕,并需要将其保存?',
        '提示',
        {
          confirmButtonText: '保存',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        const template = {
          id: this.template.id,
          templateName: this.setup.name,
          icon: this.setup.icon,
          groupId: this.setup.group,
          code: this.setup.code,
          background: this.setup.background,
          callback: this.setup.callback,
          topic: this.setup.topic,
          tag: this.setup.tag,
          remark: this.setup.remark,
          process: JSON.stringify(this.template.process)
        }
        if (this.valid()) {
          if (template.id) {
            netData.editWorkflow(template).then(resolve => {
              this.$message.success('修改成功')
              this.mode = 0
              this.$store.commit('workflow/clearTemplate')
            })
          } else {
            netData.addWorkflow(template).then(resolve => {
              this.$message.success('添加成功')
              this.mode = 0
              this.$store.commit('workflow/clearTemplate')
            })
          }
        }
      })
    },
    valid() {
      if (!this.setup.group) {
        this.$message.warning('请选择分组')
        return false
      }
      return true
    },
    exit() {
      this.mode = 0
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  position: relative;
  width: 100%;
  .el-menu {
    top: 0;
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .publish {
    position: absolute;
    top: 15px;
    right: 20px;

    i {
      margin-right: 6px;
    }

    button {
      border-radius: 15px;
    }
  }

  .back {
    position: absolute;
    top: 10px;
    left: 20px;
    font-size: small;
    span {
      i {
        border-radius: 10px;
        padding: 7.8px;
        font-size: 20px;
        color: #ffffff;
        margin: 0 10px;
      }
    }
  }
}

</style>
