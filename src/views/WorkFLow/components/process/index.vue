<script>
// import test from '@/assets/approvalTemplate';
import {
  nodeType, approvalMode, timeoutEvent,
  timeLimitType, userEmpty, endCondition
} from '../../config/workflow-enum.js'
import arrow from './arrow.vue'

export default {
  name: 'Process',
  components: { arrow },
  props: {
    process: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      // pro: test,
      updated: true,
      props: {
        approval: {
          // 审批人选项类型
          type: '1',
          // 审批模式 会签/或签/依次
          mode: approvalMode.AND,
          // 审批时限
          timeLimitType: timeLimitType.HOUR,
          timeLimitVal: 0,
          timeoutEvent: {
            event: timeoutEvent.PASS,
            loop: false,
            loopTime: 0
          },
          sign: false,
          // 如果审批人为空该如何做
          userEmpty: userEmpty.TO_PASS,
          // 主管级别
          leaderLevel: 1,
          // 结束条件
          endCondition: endCondition.TOP,
          user: {
            users: [],
            multiple: false,
            moreLeader: '',
            leader: 1,
            role: '',
            self: ''
          }
        }
      }
    }
  },
  computed: {
    dom() {
      return this.$store.state.workflow.template.process
    }
  },
  mounted() {
    console.log('模板数据：', this.dom)
  },
  methods: {
    getDomTree(h, node) {
      const that = this
      if (node === undefined) {
        return []
      }

      console.log(node.type, nodeType.ROOT, node.type === nodeType.ROOT)
      if (node.type === nodeType.ROOT || node.type === nodeType.SP ||
          node.type === nodeType.CS || node.type === nodeType.EMPTY) {
        const dom = that.getDomTree(h, node.node)

        dom.unshift(h('arrow', {
          props: { node },
          class: { clear: true },
          on: {
            addNode: this.addNode,
            addCd: this.addCd,
            select: this.select,
            delNode: this.delNode
          }
        }, []))
        return [h('div', { class: { c: true }}, dom)]
      }
      if (node.type === nodeType.CONDITION && node.conditions !== undefined &&
          node.conditions instanceof Array) {
        let index = 0
        const co = node.conditions.map((cd) => {
          const c = that.getDomTree(h, cd.node)
          cd.type = nodeType.TJ

          c.unshift(h('arrow', {
            props: { node: cd },
            on: {
              addNode: this.addNode,
              addCd: this.addCd,
              select: this.select,
              delNode: this.delNode
            }
          }, []))
          index += 1
          return h('div', {
            class: {
              bd: true,
              bdl: (index === 1),
              bdr: (node.conditions.length === index)
            }
          }, c)
        })
        return [h('div', { class: { fc: true }}, [
          h('div', { class: { fdr: true, bdtb: true }}, co)]),
        h('div', {
          class: {
            clear: node.node !== undefined && node.node.type === nodeType.EMPTY,
            pt: node.node !== undefined && node.node.type !== nodeType.EMPTY
          },
          props: { node: node.node }
        }, that.getDomTree(h, node.node))
        ]
      }
      return []
    },
    searchParentNode(nodeList, node, nodes) {
      if (node.type === nodeType.TJ && node.id === nodes.id) {
        return true
      } if (nodes.node === undefined) {
        return null
      } if (nodes.node.id === node.id) {
        return nodes
      } if (nodes.node.type === nodeType.CONDITION) {
        for (let i = 0; i < nodes.node.conditions.length; i += 1) {
          const result = this.searchParentNode(nodeList, node, nodes.node.conditions[i])
          if (result === true) {
            return nodes
          } if (result !== null) {
            return nodes.node.conditions[i]
          }
        }

        return this.searchParentNode(nodeList, node, nodes.node)
      }
      return this.searchParentNode(nodeList, node, nodes.node)
    },
    select(node) {
      this.$emit('select', node)
    },
    getParentNode(node) {
      const nodeResults = []
      const rs = this.searchParentNode(nodeResults, node, this.dom)
      if (rs !== null) {
        return rs
      }
      this.$message.warning('糟糕，没有找到需要删除的节点')
      return null
    },
    addCd(node) {
      node.node.conditions.push({
        condition: [],
        id: this.getId(),
        name: '条件',
        props: JSON.parse(JSON.stringify(this.props)),
        node: {}
      })
    },
    addNode(type, node) {
      if (type === nodeType.TJ) {
        const nextNode = node.node === undefined ? { type: nodeType.EMPTY } : node.node
        this.$set(node, 'node', {
          conditions: [
            {
              condition: [],
              cids: [],
              id: this.getId(),
              type: nodeType.TJ,
              name: '条件',
              props: JSON.parse(JSON.stringify(this.props))
            }, {
              condition: [],
              cids: [],
              id: this.getId(),
              type: nodeType.TJ,
              name: '条件',
              props: JSON.parse(JSON.stringify(this.props))
            }
          ],
          id: this.getId(),
          type: nodeType.CONDITION,
          node: nextNode
        })
      } else {
        this.$set(node, 'node', {
          id: this.getId(),
          name: type === nodeType.SP ? '审批人' : '抄送人',
          type,
          node: node.node,
          props: JSON.parse(JSON.stringify(this.props))
        })
        this.$store.commit('workflow/selectedNode', node.node)
        this.select(node.node)
      }
      // this.updateDom()
    },
    delNode(node) {
      console.log('删除节点', node)
      const parentNode = this.getParentNode(node)
      console.log('父节点', parentNode)
      if (parentNode !== null) {
        if (nodeType.CONDITION === parentNode.node.type) {
          // 删除的是条件节点
          for (let i = 0; i < parentNode.node.conditions.length; i += 1) {
            if (parentNode.node.conditions[i].id === node.id) {
              parentNode.node.conditions.splice(i, 1)
            }
          }
          // 需要去除条件
          if (parentNode.node.conditions.length < 2) {
            const nextBoxNode = parentNode.node.node

            parentNode.node = parentNode.node.conditions[0].node
            if (nextBoxNode.type !== nodeType.EMPTY) {
              parentNode.node.node = nextBoxNode.node
            }
          }
        } else {
          const { node1 } = parentNode.node
          parentNode.node = node1
        }
      }
    },
    getId() {
      return (Math.floor(Math.random() * (99999 - 10000)) + 10000).toString() +
          new Date().getTime().toString().substring(5)
    },
    updateDom() {
      console.log(JSON.stringify(this.dom))
      this.updated = false
      this.$nextTick(() => {
        this.updated = true
      })
    }
  },
  render(h) {
    return h('div', { class: { process: true }}, this.updated ? this.getDomTree(h, this.dom) : [])
  }
}
</script>

<style lang="scss" scoped>
  .process {
    display: flex;
    justify-content: center;
  }

  .fc {
    display: flex;
    justify-content: center;
  }

  .bdtb {
    display: flex;
    justify-content: center;
    //width: calc(100% - 220px);
    margin-top: 15px;
    border-top: 2px solid #CACACA;
    border-bottom: 2px solid #CACACA;
  }

  .clear {
    padding-top: 0;
    padding-bottom: 0;
  }

  .fdr {
    position: relative;
  }
  .fdr::after{
    content: "";
    z-index: 100;
    top: 2px;
    left: calc(50% - 1px);
    position: absolute;
    width: 2px;
    height: calc(100% - 2px);
    background: #F0F0F0;
  }

  .pt {
    padding-top: 30px;
  }

  .bdl {
    position: relative;
    margin-right: 40px;
  }

  .bdr {
    position: relative;
    margin-left: 40px;
  }
  .bd{
    position: relative;
  }
  .bd::after {
    content: "";
    top: 0;
    left: calc(50% - 1px);
    position: absolute;
    width: 2px;
    height: 100%;
    background: #CACACA;
  }

  .c::after {display: none}

  .bdl::before {
    content: "";
    z-index: 100;
    top: -3px;
    position: absolute;
    width: calc(50% - 1px);
    height: calc(100% + 5px);
    border-bottom: 4px solid #F0F0F0;
    border-top: 4px solid #F0F0F0;
  }

  .bdr::before {
    content: "";
    z-index: 100;
    top: -3px;
    right: 0;
    position: absolute;
    width: calc(50% - 1px);
    height: calc(100% + 5px);
    border-bottom: 4px solid #F0F0F0;
    border-top: 4px solid #F0F0F0;
  }

  .addTjF {
    display: block;
    position: relative;

    .addTj {
      position: absolute;
      top: 0;
    }
  }

</style>
