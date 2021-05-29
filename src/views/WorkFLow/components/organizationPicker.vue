<template>
  <el-dialog
    :title="title"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    :modal="false"
    :visible.sync="show"
    :before-close="close"
    width="700px"
    center
  >
    <div class="picker">
      <div style="float: left">
        <p>选择</p>
        <div class="box">
          <div>
            <el-input
              v-if="type !== 'dept'"
              v-model="search"
              placeholder="搜索人员"
              prefix-icon="el-icon-search"
              size="medium"
              :maxlength="50"
              clearable
              @input="searchUser"
            />
            <el-breadcrumb
              separator-class="el-icon-arrow-right"
              style="overflow-x: hidden"
            >
              <el-breadcrumb-item>通讯录</el-breadcrumb-item>
              <el-breadcrumb-item
                v-for="(node, index) in navTitles"
                :key="index"
                style="color: #38adff"
              >
                {{ node }}
              </el-breadcrumb-item>
            </el-breadcrumb>
            <el-checkbox
              v-show="!single"
              v-model="checkAll"
              @change="handleCheckAllChange"
            >全选</el-checkbox>
            <span
              style="margin-left: 20px; cursor: pointer; color: #38adff"
              @click="beforeNode"
            >上一级</span>
          </div>
          <div style="margin-top: 8px; width: 100%">
            <div
              style="
                margin-top: 8px;
                overflow-y: auto;
                height: calc(100% - 90px);
              "
            >
              <div
                v-for="(node, index) in search === '' ? curNodes : searchUsers"
                :key="index"
                class="line flex "
                :style="
                  node.type === 'user' && type === 'dept' ? 'display: none' : ''
                "
                @click="selectChange(node)"
              >
                <el-checkbox
                  v-model="node.selected"
                  :disabled="disableDept(node)"
                />
                <div class="flex align-center justify-between" style="margin-left: 10px; width: 100%;">
                  <div class="flex align-center">
                    <i
                      v-if="node.type === 'dept'"
                      class="el-icon-folder-opened"
                    />
                    <div
                      v-else-if="node.attr1 === undefined || node.attr1 === ''"
                      class="avt"
                      :style="'background: ' + getAvatarColor()"
                    >
                      {{
                        node.name.length > 2
                          ? node.name.substring(1, 3)
                          : node.name
                      }}
                    </div>
                    <img
                      v-else
                      :src="chImg(node.attr1).url"
                      style="border-radius: 50%; display: inline-block"
                      width="35"
                      height="35"
                    >
                    <span style="margin-left: 10px">{{ node.name }}</span>
                  </div>
                  <span
                    v-if="node.type === 'dept'"
                    :class="{
                      'next-dept-disable': node.selected,
                      'next-dept': !node.selected,
                    }"
                    @click.stop="nextNode(node)"
                  >
                    <i class="el-icon-coin" />下级
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style="float: right">
        <p>已选</p>
        <div class="box">
          <div style="overflow-x: hidden; overflow-y: auto; height: 100%">
            <div v-for="(node, index) in select" :key="index" class="line">
              <span style="margin-left: 10px">
                <i
                  v-if="node.type === 'dept'"
                  class="el-icon-folder-opened"
                />
                <div
                  v-else-if="node.attr1 === undefined || node.attr1 === ''"
                  class="avt"
                  :style="'background: ' + getAvatarColor()"
                >
                  {{
                    node.name.length > 2 ? node.name.substring(1, 3) : node.name
                  }}
                </div>
                <img v-else :src="chImg(node.attr1).url" width="35" height="35">
                <span style="margin-left: 10px">{{ node.name }}</span>
                <span style="float: right; color: #a9a9a9; cursor: pointer">
                  <i class="el-icon-close" @click="noSelected(index)" />
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">取 消</el-button>
      <el-button type="primary" size="small" @click="selectOk">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
// import { getOrgTree, getUserByName } from '@/api/common'
import * as netData from '../../../api/organize'
import { chImg } from '@/api/index'

export default {
  name: 'OrganizationPicker',
  props: {
    // 是否展示
    show: {
      default: false,
      type: Boolean
    },
    // 标题
    title: {
      default: '请选择',
      type: String
    },
    // 选择哪种类型  user=人和部门  dept=只能选部门
    type: {
      default: 'user',
      type: String
    },
    // 是否单选
    single: {
      default: false,
      type: Boolean
    },
    // 已经选中的
    selected: {
      default: () => [],
      type: Array
    },
    onlyUser: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      checkAll: false,
      isIndeterminate: false,
      navNodes: [],
      navTitles: [],
      searchUsers: [],
      nodes: [],
      curNodes: [],
      curIndex: 0,
      select: [],
      search: '',
      avatarColor: [
        '#1e90ff',
        '#ff4500',
        '#ffc10a',
        '#d2b100',
        '#76c376',
        '#00ced1',
        '#c71585',
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        'hsl(181, 100%, 37%)'
      ]
    }
  },
  computed: {},
  watch: {
    show() {
      if (this.show) {
        this.init()
        this.getOrgList()
      }
    }
  },
  mounted() {},
  methods: {
    chImg,
    disableDept(node) {
      return this.onlyUser && node.type === 'dept'
    },
    getOrgList() {
      netData.organizeTree('uUdTluWpcZzkf4Yyog0FPuXXvoue0saO', '', 'user').then((resolve) => {
        if (resolve && Array.isArray(resolve.rows) && resolve.rows.length > 0) {
          this.nodes = resolve.rows[0]
          this.dealNode(this.nodes)
        }
      })
    },
    dealNode(nodes) {
      const select = this.select
      const dept = nodes.users.map(t => {
        t.type = 'user'
        t.selected = false
        select.forEach(sc => {
          if (sc.id === t.id) {
            t.selected = true
          }
        })

        return t
      })
      const users = nodes.children.map(d => {
        d.name = d.orgName
        d.type = 'dept'
        d.selected = false
        select.forEach(sc => {
          if (sc.id === d.id) {
            d.selected = true
          }
        })
        return d
      })
      this.curNodes = [...users, ...dept]
    },
    searchUser() {
      // const userName = this.search.trim()
      this.searchUsers = []
      // getUserByName({ userName })
      //   .then((rsp) => {
      //     this.searchUsers = rsp.data
      //   })
      //   .catch(() => this.$message.error('接口异常'))
    },
    selectChange(node) {
      if (node.selected) {
        this.checkAll = false
        for (let i = 0; i < this.select.length; i += 1) {
          if (this.select[i].id === node.id) {
            this.select.splice(i, 1)
            break
          }
        }
        node.selected = false
      } else if (!this.disableDept(node)) {
        node.selected = true
        const nodes = this.search.trim() === '' ? this.nodes : this.searchUsers
        if (this.single) {
          nodes.forEach((nd) => {
            if (node.id !== nd.id) {
              nd.selected = false
            }
          })
        }
        if (node.type === 'dept') {
          if (this.single) {
            this.select = [node]
          } else {
            this.select.unshift(node)
          }
        } else if (this.single) {
          this.select = [node]
        } else {
          this.select.push(node)
        }
      }
    },
    noSelected(index) {
      const cid = this.select[index].id

      for (let i = 0; i < this.navNodes.length; i += 1) {
        const node = this.navNodes[i]
        for (let j = 0; j < node.length; j += 1) {
          if (cid === node[j].id) {
            node[j].selected = false
          }
        }
        this.$set(this.navNodes, i, node)
      }

      const curNode = this.curNodes
      for (let i = 0; i < curNode.length; i += 1) {
        const n = this.curNodes[i]
        if (cid === curNode[i].id) {
          n.selected = false
          this.$set(this.curNodes, i, n)
        }
      }
      this.curNodes = curNode
      this.select.splice(index, 1)
    },
    handleCheckAllChange() {
      this.nodes.forEach((node) => {
        if (this.checkAll) {
          if (!node.selected && !this.disableDept(node)) {
            node.selected = true
            this.select.push(node)
          }
        } else {
          node.selected = false
          for (let i = 0; i < this.select.length; i += 1) {
            if (this.select[i].id === node.id) {
              this.select.splice(i, 1)
              break
            }
          }
        }
      })
    },
    getAvatarColor() {
      Math.floor(Math.random() * 10)
      return this.avatarColor[0]
    },
    nextNode(node) {
      this.navTitles.push(node.name)
      this.navNodes.push(this.curNodes)
      this.dealNode(node)
    },
    beforeNode() {
      if (this.navNodes.length === 0) {
        this.$message.warning('已经是最上一级喽')
        return
      }

      this.curNodes = this.navNodes[this.navNodes.length - 1]
      this.navNodes.pop()
      this.navTitles.pop()
    },
    recover() {
      this.select = []
      this.getOrgList()
    },
    selectOk() {
      this.$emit('selectOver', Object.assign([], this.select))
      this.recover()
    },
    close() {
      this.$emit('close')
      this.recover()
    },
    init() {
      this.checkAll = false
      this.navNodes = []
      this.select = Object.assign([], this.selected)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  z-index: 99999;
  border-radius: 13px;
  overflow: hidden;

  .el-dialog__header {
    background: #f7f7f7;
  }

  .el-dialog__body {
    padding-top: 0;
  }

  .el-dialog__footer {
    margin-top: 400px;
  }
}

.line {
  width: 260px;
  height: 40px;
  line-height: 40px;

  &:hover {
    background: #e9e9ea;
  }

  .avt {
    width: 33px;
    height: 33px;
    line-height: 33px;
    text-align: center;
    display: inline-block;
    font-size: 5px;
    border-radius: 50%;
    color: #ffffff;
  }

  i:first-child {
    font-size: large;
  }

  .next-dept {
    cursor: pointer;
    float: right;
    color: #38adff;
  }

  .next-dept-disable {
    //pointer-events: none;
    cursor: not-allowed;
    float: right;
    color: #cccccd;
  }
}

.picker {
  p {
    font-size: larger;
  }

  ::v-deep .box {
    overflow-y: auto;
    overflow-x: hidden;
    padding: 10px;
    height: 350px;
    width: 290px;
    border-radius: 5px;
    border: 1px solid #d4d4d5;
    background: #f7f7f7;

    .el-breadcrumb {
      margin: 10px 0;
    }
  }
}

::-webkit-scrollbar {
  float: right;
  width: 4px;
  height: 4px;
  background-color: #f8f8f8;
}

::-webkit-scrollbar-thumb {
  border-radius: 16px;
  background-color: #e8e8e8;
}
</style>
