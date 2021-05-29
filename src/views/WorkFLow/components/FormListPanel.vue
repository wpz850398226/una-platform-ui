<template>
  <div ref="panel" class="from-panel">
    <div class="from-title">
      <span>流程面板</span>
      <div>
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="newProcess"
        >新建流程</el-button>
        <el-button
          icon="el-icon-plus"
          size="mini"
          @click="addGroup"
        >新建分组</el-button>
      </div>
    </div>

    <div
      v-for="(group, gidx) in groups"
      v-show="group.id > 1 || group.processDefList.length > 0"
      :key="gidx"
      :class="{
        'form-group': true,
      }"
    >
      <div class="form-group-title">
        <span>{{ group.groupName }}</span>
        <span>({{ group.processDefList?group.processDefList.length: 0 }})</span>

        <div>
          <el-dropdown>
            <el-button type="text" icon="el-icon-setting">编辑分组</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                icon="el-icon-edit-outline"
                @click.native="editGroup(group)"
              >修改名称</el-dropdown-item>
              <el-dropdown-item
                icon="el-icon-delete"
                @click.native="deleteGroup(group)"
              >删除分组</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>

      <div
        v-for="(item, index) in group.processDefList"
        :key="index"
        class="form-group-item"
      >
        <div class="flex justify-between align-center" style="width: 100%;">
          <div class="flex align-center">
            <i
              :class="item.icon"
              :style="'background: ' + item.background"
            />
            <div>
              <div class="title">{{ item.templateName }}</div>
              <div class="desc">最后更新时间：{{ item.updTime }}</div>
              <div class="desc">备注：{{ item.remark }}</div>
            </div>
          </div>
          <div>
            <el-button
              type="text"
              icon="el-icon-s-promotion"
              size="medium"
              @click="publishForm(item, group)"
            >发布</el-button>
            <el-button
              type="text"
              icon="el-icon-edit-outline"
              size="medium"
              @click="editFrom(item, group)"
            >编辑</el-button>

            <el-button
              type="text"
              icon="el-icon-delete"
              size="medium"
              @click="deleteFrom(item, group)"
            >删除</el-button>

            <el-button
              type="text"
              icon="el-icon-s-order"
              size="medium"
              @click="historyForm(item, group)"
            >历史版本</el-button>

            <el-button
              v-if="item.isStop"
              type="text"
              icon="el-icon-delete"
              size="mini"
              @click="moveFrom(item)"
            >删除
            </el-button>
            <el-popover
              v-else
              placement="left"
              trigger="click"
              width="400"
              style="margin-left: 10px"
              @show="moveSelect === null"
            >
              <el-radio-group v-model="moveSelect" size="mini">
                <el-radio
                  v-for="g in groups"
                  v-show="g.id > 1"
                  :key="g.id"
                  :label="g.id"
                  border
                  :disabled="g.id === group.id"
                  style="margin: 10px"
                >{{ g.groupName }}</el-radio>
              </el-radio-group>
              <div style="text-align: right; margin: 0">
                <el-button
                  type="primary"
                  size="mini"
                  @click="moveFrom(item)"
                >提交</el-button>
              </div>
              <el-button
                slot="reference"
                type="text"
                icon="el-icon-s-promotion"
                size="medium"
              >移动</el-button>
            </el-popover>
          </div>
        </div>
      </div>
      <div
        v-if="!group.processDefList || group.processDefList.length === 0"
        class="flex justify-center"
        style="width: 100%"
      >
        <el-button type="text">暂无数据</el-button>
      </div>
    </div>

    <el-dialog
      title="历史版本"
      :visible.sync="historyDialogVisible"
      width="800px"
    >
      <el-table :data="historyTableData" style="width: 100%;height:70vh;" height="70vh">
        <el-table-column prop="templateName" label="流程名称" width="150" />
        <el-table-column prop="versions" label="版本号" width="150" />
        <el-table-column prop="crtTime" label="创建时间" width="170" />
        <el-table-column prop="updTime" label="更新时间" width="170" />
        <el-table-column prop="remark" label="备注" />
      </el-table>
      <div class="margin-top flex justify-center">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="historyPageTotal"
          @current-change="switchHistoryPage"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>

import * as netData from '../../../api/workflow'
import getDefault from '@/utils/getDefault'

export default {
  name: 'FormListPanel',
  data() {
    return {
      moveSelect: '',
      historyDialogVisible: false,
      groups: [],
      selProcessId: '',
      historyTableData: [],
      historyPageTotal: 0
    }
  },
  mounted() {
    this.getGroups()
  },
  methods: {
    getGroups() {
      netData.gruopAllList().then((resolve) => {
        this.groups = resolve.rows
      })
    },
    newProcess() {
      this.$store.commit('workflow/setTemplate', this.getTemplateData())
      this.$emit('newProcess')
    },
    addGroup() {
      this.$prompt('请输入要添加的组名', '新的分组名', {
        confirmButtonText: '提交',
        cancelButtonText: '取消',
        inputPattern: /^[\u4E00-\u9FA5A-Za-z0-9\\-]{1,30}$/,
        inputErrorMessage: '分组名不能为空且长度小于30',
        inputPlaceholder: '请输入分组名'
      }).then(({ value }) => {
        netData.addGruop({ groupName: value, sortNum: this.groups.length }).then((resolve) => {
          this.$message.success('添加分组成功')
          this.getGroups()
        })
      })
    },
    editGroup(group) {
      this.$prompt('请输入新的组名', '修改分组名', {
        confirmButtonText: '提交',
        cancelButtonText: '取消',
        inputPattern: /^[\u4E00-\u9FA5A-Za-z0-9\\-]{1,30}$/,
        inputErrorMessage: '分组名不能为空且长度小于30',
        inputPlaceholder: '请输入分组名',
        inputValue: group.name
      }).then(({ value }) => {
        netData.editGruop({ id: group.id, groupName: value }).then((resolve) => {
          this.$message.success('修改成功')
          this.getGroups()
        })
      })
    },
    deleteGroup(group) {
      this.$confirm('此操作将永久删除该流程组及该组下所有流程, 是否继续?', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        netData.deleteGruop(group.id).then((resolve) => {
          this.$message.success('删除成功')
          this.getGroups()
        })
      })
    },
    getTemplateData(data, group) {
      return {
        id: getDefault(data, 'id', ''),
        baseSetup: {
          icon: getDefault(data, 'icon', 'el-icon-s-custom'),
          background: getDefault(data, 'background', '#FF7800'),
          name: getDefault(data, 'templateName', '未命名的流程'),
          group: getDefault(group, 'id', ''),
          code: getDefault(data, 'code', ''),
          sign: getDefault(data, 'sign', false),
          callback: getDefault(data, 'callback', 1),
          topic: getDefault(data, 'topic', ''),
          tag: getDefault(data, 'tag', ''),
          remark: getDefault(data, 'remark', ''),
          notify: JSON.parse(
            getDefault(
              data,
              'notify',
              JSON.stringify({ types: [], title: '' })
            )
          )
        },
        form: JSON.parse(getDefault(data, 'formItems', '[]')),
        process: JSON.parse(
          getDefault(
            data,
            'process',
            JSON.stringify({
              type: 'ROOT',
              name: '发起人',
              id: '10000',
              props: {
                approval: {
                  // 审批人选项类型
                  type: '1',
                  // 审批模式 会签/或签/依次
                  mode: 'AND',
                  userEmpty: 'toAdmin',
                  timeLimitType: 'HOUR',
                  timeLimitVal: 0,
                  timeoutEvent: {
                    event: 'pass',
                    loop: false,
                    loopTime: 0
                  },
                  sign: false,
                  user: {
                    users: [],
                    select: 'one',
                    moreLeader: '',
                    leader: 1,
                    role: '',
                    self: ''
                  }
                }
              }
            })
          )
        )
      }
    },
    editFrom(item, group) {
      this.$store.commit('workflow/setTemplate', this.getTemplateData(item, group))
      this.$emit('editProcess')
    },
    getProcessHistoryList() {
      netData.workflowHistoryList(1, '', this.selProcessId).then((resolve) => {
        this.historyPageTotal = resolve.total
        this.historyTableData = resolve.rows
      })
    },
    switchHistoryPage(e) {
      netData.workflowHistoryList(e, '', this.selProcessId).then((resolve) => {
        this.historyPageTotal = resolve.total
        this.historyTableData = resolve.rows
      })
    },
    historyForm(item, gruop) {
      this.selProcessId = item.id
      this.getProcessHistoryList()
      this.historyDialogVisible = true
    },
    publishForm(item, gruop) {
      netData.publishWorkflow(item.id).then((resolve) => {
        this.$message.success('发布成功')
        this.getGroups()
      })
    },
    deleteFrom(item, group) {
      this.$confirm('此操作将永久删除该流程, 是否继续?', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        netData.deleteWorkflow(item.id).then((resolve) => {
          this.$message.success('删除成功')
          this.getGroups()
        })
      })
    },
    moveFrom(item) {
      if (item.isStop) {
        this.$confirm(
          `您确定要删除表单 ${item.name} 吗，删除后无法恢复，是否继续？`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          this.updateForm(item, 'delete')
        })
      } else {
        if (this.moveSelect === null || this.moveSelect === '') {
          this.$message.error('请选择分组')
          return
        }

        netData.moveWorkflow({ defId: item.id, groupId: this.moveSelect }).then((resolve) => {
          this.$message.success('移动成功')
          this.getGroups()
          this.moveSelect = null
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.from-panel {
  padding: 25px 80px;
  min-width: 500px;

  ::v-deep .from-title {
    div {
      float: right;

      .el-button {
        border-radius: 15px;
      }
    }
  }
}

.choose {
  background: #e9ebee;
}

.form-group {
  margin: 20px 0;
  padding: 5px 0px;
  border-radius: 10px;
  background-color: #FFFFFF;

  .form-group-title {
    padding: 5px 20px;
    height: 40px;
    line-height: 40px;

    div {
      display: inline-block;
      float: right;
    }

    span:first-child {
      margin-right: 5px;
      font-size: 15px;
      font-weight: bold;
    }

    span:nth-child(2) {
      color: #656565;
      font-size: small;
      margin-right: 10px;
    }

    ::v-deep .el-button {
      color: #404040;
      margin-left: 20px;

      &:hover {
        color: #2b2b2b;
      }
    }
  }

  .form-group-item:nth-child(1) {
    border-top: none !important;
  }

  .form-group-item {
    color: #3e3e3e;
    font-size: small;
    padding: 10px 0;
    margin: 0 20px;
    height: 90px;
    position: relative;
    line-height: 20px;
    border-top: 1px solid #d3d3d3;

    i {
      height: 50px;
      width: 50px;
      border-radius: 10px;
      padding: 7px;
      font-size: 30px;
      color: #ffffff;
      margin-right: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .title {
      font-size: 16px;
      margin-bottom: 5px;
    }
    .desc {
      color: #7a7a7a;
    }
  }
}

@media screen and (max-width: 1000px) {
  .desp {
    display: none !important;
  }
}

@media screen and (max-width: 800px) {
  .from-panel {
    padding: 50px 10px;
  }
}
</style>
