<template>
  <div ref="arrow" :class="{ arrow: true, borderTop: !showCard(node) }">
    <div v-if="showCard(node)" @click.stop="select">
      <el-card shadow="always">
        <div slot="header" :class="node.type">
          <span>
            <i
              :class="{
                'el-icon-s-check': node.type === nodeType.SP,
                'el-icon-s-promotion': node.type === nodeType.CS,
              }"
            />
            {{ node.name }}
          </span>
          <i
            v-if="nodeType.ROOT !== node.type"
            class="el-icon-close"
            @click.stop="delNode"
          />
          <el-tooltip effect="dark" content="复制条件" placement="top-start">
            <i
              v-if="nodeType.TJ === node.type"
              class="el-icon-copy-document"
            />
          </el-tooltip>
        </div>
        <div
          v-show="'NOTIFY' === node.props.approval.timeoutEvent.event"
          style="position: relative"
        >
          <i
            class="el-icon-time"
            style="
              font-size: x-small;
              position: absolute;
              left: -15px;
              top: -5px;
            "
          />
        </div>
        <span v-html="nodeText" />
      </el-card>
    </div>
    <div class="line-y">
      <el-popover
        placement="bottom-start"
        title="添加流程节点"
        width="350"
        trigger="click"
      >
        <div class="node-select">
          <div @click="addNode(nodeType.SP)">
            <i class="el-icon-s-check" style="color: rgb(255, 148, 62)" />
            <span>审批人</span>
          </div>
          <div @click="addNode(nodeType.CS)">
            <i class="el-icon-s-promotion" style="color: rgb(50, 150, 250)" />
            <span>抄送人</span>
          </div>
          <div v-if="(node.type !== nodeType.TJ) && (node.type !== nodeType.EMPTY)" @click="addNode(nodeType.TJ)">
            <i class="el-icon-share" style="color: rgb(21, 188, 131)" />
            <span>条件分支</span>
          </div>
        </div>
        <el-button
          ref="bt"
          slot="reference"
          icon="el-icon-plus"
          type="primary"
          size="small"
          circle
        />
      </el-popover>
    </div>
    <div v-if="showArrow(node)" class="jt" />
    <div v-if="showAddTjBtn(node)" class="add-tj" @click="addCd">添加条件</div>
  </div>
</template>

<script>
import { nodeType } from '../../config/workflow-enum'

export default {
  name: 'Arrow',
  props: {
    hasArrow: {
      default: true,
      type: Boolean
    },
    node: {
      default: null,
      type: Object
    },
    index: {
      default: null,
      type: Number
    }
  },
  data() {
    return {
      nodeType
    }
  },
  computed: {
    nodeText() {
      let text = ''
      let type = ''
      const { approval } = this.node.props
      if (this.node.type === nodeType.ROOT) {
        const userText = this.getUsersText(approval.user.users)
        console.log('计算解雇', text)
        text = !userText ? '请设置发起人' : userText
        type = '请设置发起人'
      } else if (this.node.type === nodeType.SP) {
        let tr = ''
        switch (approval.type) {
          case '1':
            text = this.getUsersText(approval.user.users)
            break
          case '2':
            if (approval.user.role && Array.isArray(approval.user.role) && approval.user.role.length > 0) {
              approval.user.role.forEach(p => {
                tr = `${tr}${p.name}、`
              })
            }
            text = `角色- ${
              approval.user.role !== '' ? tr : '请选择角色'
            }`
            console.log(text, '********')
            break
          case '3':
            text = '发起人自己'
            break
          case '4':
            text = '直接上级'
            break
        }
        type = '请设置审批人'
      } else if (this.node.type === nodeType.TJ) {
        type = '请设置审批条件'
        if (this.node.condition && Array.isArray(this.node.condition) && this.node.condition.length > 0) {
          let tmp = ''
          const c = this.node.condition
          c.forEach(k => {
            if (k.optionType === 'select') {
              const ops = JSON.parse(k.options)
              const opt = ops.filter(m => m.value === k.val)
              console.log('检查aa', opt)
              if (opt.length === 1) {
                tmp = `${tmp} ${k.name} ${k.symbol} ${opt[0].label} &`
              } else {
                tmp = `${tmp} ${k.name} ${k.symbol} 未选择 &`
              }
            } else {
              tmp = `${tmp} ${k.name} ${k.symbol} ${k.val} &`
            }
          })
          console.warn(tmp)

          type = tmp.substring(0, tmp.length - 1)
        }
        console.log('该文本', this.node)
      } else if (this.node.type === nodeType.CS) {
        console.log('ksssss', approval)
        if (approval.type === '1') {
          text = this.getUsersText(approval.user.users)
        }
        if (approval.type === '2') {
          text = '指定角色'
        }
        if (approval.type === '3') {
          text = '发起人自己'
        }
        if (approval.type === '4') {
          text = '直接上级'
        }

        type = '请设置抄送对象'
      } else {
        return '未知节点'
      }
      if (text.lastIndexOf('、') !== -1) {
        text = text.substring(0, text.length - 1)
      } else if (text === '') {
        text = `${type}`
      }
      return text.length > 28 ? `${text.substring(0, 28)}...` : text
    }
  },
  methods: {
    addNode(type) {
      this.$refs.arrow.click()
      this.$emit('addNode', type, this.node)
    },
    getUsersText(users) {
      console.log('检查用户', users)
      let text = ''
      if (users && Array.isArray(users)) {
        users.forEach((u) => {
          text = `${text + u.name}、`
        })
      }
      return text
    },
    addCd() {
      this.$emit('addCd', this.node)
    },
    delNode() {
      console.log('删除节点', this.node)
      this.$emit('delNode', this.node)
    },
    select() {
      // console
      this.$store.commit('workflow/selectedNode', this.node)
      this.$emit('select', this.node)
    },
    showCard(node) {
      return (
        node !== null &&
        node !== undefined &&
        (node.type === nodeType.ROOT ||
          node.type === nodeType.SP ||
          node.type === nodeType.CS ||
          node.type === nodeType.TJ)
      )
    },
    showArrow(node) {
      return false && node // node.node === undefined
    },
    showAddTjBtn(node) {
      return node.node !== undefined && node.node.conditions !== undefined
    }
  }
}
</script>

<style lang="scss" scoped>

::v-deep .el-card {
  .el-card__body {
    height: 50px;
    overflow: hidden;
    padding: 0 20px !important;
    display: flex;
    align-items: center;
  }
}

.arrow {
  z-index: 555;
  position: relative;

  .add-tj {
    cursor: pointer;
    font-size: small;
    border-radius: 14px;
    padding: 8px 10px;
    color: rgb(21, 188, 131);
    width: 75px;
    left: calc(50% - 36px);
    bottom: -30px;
    background-color: #ffffff;
    position: absolute;
    box-shadow: 0 0 8px 2px #e5e5e5;

    &:hover {
      box-shadow: 0 0 8px 2px #d6d6d6;
    }
  }
}

.arrow::before {
  content: "";
  z-index: -999;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 2px;
  height: calc(100% + 4px);
  background-color: #cacaca;
}

.arrow {
  padding: 30px 0px;

  //margin: 0 50px;
  ::v-deep .el-card {
    margin: 0 auto;
    cursor: pointer;
    /*  margin: 0 60px;*/
    height: 77px;
    font-size: medium;
    width: 220px;

    .el-card__header {
      color: #ffffff;
      font-size: small;
      width: 100%;
      padding: 0;
    }

    .el-card__body {
      padding: 10px 20px;
      font-size: small;
    }

    .ROOT,
    .SP,
    .CS,
    .TJ {
      padding: 5px 10px;

      span {
        &:hover {
          text-decoration: underline;
        }
      }

      .el-icon-close,
      .el-icon-copy-document {
        display: none;
        float: right;
        margin-top: 2px;

        &:hover {
          font-size: 15px;
        }
      }
    }

    .ROOT {
      background-color: rgb(87, 106, 149);
    }

    .SP {
      background-color: rgb(255, 148, 62);
    }

    .CS {
      background-color: #1890ff;
    }

    .TJ {
      font-size: small;
      background-color: #ffffff;
      color: rgb(21, 188, 131);

      i {
        color: #818181;
      }

      i:last-child {
        margin-right: 10px;
      }
    }

    &:hover {
      border: 1px solid #1890ff;

      .el-icon-close,
      .el-icon-copy-document {
        display: inline;
      }
    }
  }

  .line-y {
    position: relative;
    height: 80px;
    margin: 0 auto;
    width: 0;
    //border: 1px solid #a9a9a9;

    button {
      position: absolute;
      top: 18px;
      right: -16px;

      &:hover {
        box-shadow: 0 0 10px 2px #c2c2c2;
      }
    }
  }

  .jt {
    border: 5px solid rgb(245, 246, 246);
    border-top-width: 10px;
    border-top-color: #a9a9a9;
    margin: 0 auto;
    width: 0;
    height: 0;
  }
}

.node-select {
  div {
    display: inline-block;
    margin: 5px 5px;
    cursor: pointer;
    padding: 10px 15px;
    border: 1px solid #f8f9f9;
    background-color: #f8f9f9;
    border-radius: 10px;
    width: 130px;
    position: relative;

    span {
      position: absolute;
      left: 65px;
      top: 18px;
    }

    &:hover {
      background-color: #fff;
      box-shadow: 0 0 8px 2px #d6d6d6;
    }

    i {
      font-size: 25px;
      padding: 5px;
      border: 1px solid #dedfdf;
      border-radius: 14px;
    }
  }
}
</style>
