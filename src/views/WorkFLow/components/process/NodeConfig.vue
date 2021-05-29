<template>
  <div class="node-config">
    <el-form label-position="top" label-width="80px">
      <!-- 发起人 -->
      <div
        v-if="
          selectedNode.type === enumConst.nodeType.ROOT
        "
      >

        <el-form-item
          label="
            谁可以发起此审批
          "
          prop="text"
        >
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            style="margin-bottom: 15px"
            round
            @click="
              (showUserSelect = true), (select = props.approval.user.users)
            "
          >选择人员/部门
          </el-button>
          <div
            v-show="props.approval.user.users.length === 0"
            style="color: #38adff; font-size: x-small"
          >
            不指定则默认所有人都可发起此审批
          </div>
          <div>
            <el-tag
              v-for="(user, index) in props.approval.user.users"
              :key="index"
              :type="'dept' === user.type ? 'info' : 'primary'"
              size="mini"
              style="margin: 5px 10px 5px 0"
              closable
              @close="props.approval.user.users.splice(index, 1)"
            >{{ user.name }}
            </el-tag>
          </div>
        </el-form-item>
      </div>

      <!-- 抄送人 -->
      <div
        v-if="

          selectedNode.type === enumConst.nodeType.CS
        "
      >
        <el-form-item label="选择抄送对象" prop="text" class="select-user-type">
          <el-radio-group v-model="props.approval.type">
            <el-radio label="1">指定人员</el-radio>
            <el-radio label="2">角色</el-radio>
            <el-radio label="3">发起人自己</el-radio>
            <el-radio label="4">直接上级</el-radio>
          </el-radio-group>
        </el-form-item>

        <div v-if="props.approval.type === '1'">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            style="margin-bottom: 15px"
            round
            @click="
              (showUserSelect = true), (select = props.approval.user.users)
            "
          >选择人员
          </el-button>
          <div>
            <el-tag
              v-for="(user, index) in props.approval.user.users"
              :key="index"
              :type="'dept' === user.type ? 'info' : 'primary'"
              size="mini"
              style="margin: 5px 10px 5px 0"
              closable
              @close="props.approval.user.users.splice(index, 1)"
            >{{ user.name }}
            </el-tag>
          </div>
        </div>

        <div v-if="props.approval.type === '2'">
          <el-button
            slot="reference"
            type="primary"
            size="mini"
            icon="el-icon-plus"
            round
            @click="showRoleSelect = true"
          >选择角色</el-button>
          <el-tag
            v-for="(r,rid) in props.approval.user.role"
            :key="'r'+rid"
            type="primary"
            size="mini"
            style="margin: 5px 10px 5px 20px"
          >
            {{ r.name }}
          </el-tag>
        </div>
        <!-- 3 发起人 -->
        <!-- 4 直接上级 -->
      </div>

      <div v-if="selectedNode.type === enumConst.nodeType.TJ">
        <el-form-item label="设置审批条件" prop="text">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            round
            @click="newCondition"
          >新建条件</el-button>
        </el-form-item>
        <div v-for="(item,index) in userConditions" :key="index">
          <div class="flex justify-between margin-bottom-sm">
            <div>
              <el-select
                v-model="userConditions[index].id"
                placeholder="条件名称"
                @change="selectCondition($event, index)"
              >
                <el-option
                  v-for="(k, kid) in conditionList"
                  :key="'k'+kid"
                  :label="k.name"
                  :value="k.id"
                />
              </el-select>
            </div>
            <div>
              <el-select v-model="userConditions[index].symbol" placeholder="比较符号">
                <el-option
                  v-for="(s, sid) in conditionDefine"
                  :key="'s'+sid"
                  :label="s"
                  :value="s"
                />
              </el-select>
            </div>
            <div>
              <el-select
                v-if="userConditions[index].optionType == 'select'"
                v-model="userConditions[index].val"
                placeholder="选择值"
              >
                <el-option
                  v-for="(s, sid) in userConditions[index].options?JSON.parse(userConditions[index].options): []"
                  :key="'s'+sid"
                  :label="s.label"
                  :value="s.value"
                />
              </el-select>
              <el-input v-else v-model="userConditions[index].val" />
            </div>
            <el-button type="danger" icon="el-icon-delete" @click="deleteCondition(index)" />
          </div>
        </div>
        <div class="margin-top flex justify-end">
          <el-button
            type="primary"
            size="medium"
            icon="el-icon-save"
            @click="saveConditions"
          >保存条件配置</el-button>
        </div>

      </div>

      <div v-if="selectedNode.type === enumConst.nodeType.SP">
        <el-form-item label="选择审批人" prop="text" class="select-user-type">
          <el-radio-group v-model="props.approval.type">
            <el-radio label="1">指定人员</el-radio>
            <el-radio label="2">角色</el-radio>
            <el-radio label="3">发起人自己</el-radio>
            <el-radio label="4">直接上级</el-radio>
          </el-radio-group>
        </el-form-item>
        <div>
          <div v-if="props.approval.type === '1'">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-plus"
              style="margin-bottom: 15px"
              round
              @click="
                (showUserSelect = true), (select = props.approval.user.users)
              "
            >选择人员
            </el-button>
            <div>
              <el-tag
                v-for="(user, index) in props.approval.user.users"
                :key="index"
                :type="'dept' === user.type ? 'info' : 'primary'"
                size="mini"
                style="margin: 5px 10px 5px 0"
                closable
                @close="props.approval.user.users.splice(index, 1)"
              >{{ user.name }}
              </el-tag>
            </div>
          </div>

          <div v-if="props.approval.type === '2'">
            <el-button
              slot="reference"
              type="primary"
              size="mini"
              icon="el-icon-plus"
              round
              @click="showRoleSelect = true"
            >选择角色</el-button>
            <el-tag
              v-for="(r,rid) in props.approval.user.role"
              :key="'r'+rid"
              type="primary"
              size="mini"
              style="margin: 5px 10px 5px 20px"
            >
              {{ r.name }}
            </el-tag>
          </div>
          <!-- 3 发起人 -->
        </div>

        <el-divider />

        <el-form-item label="审批期限（为 0 则不生效）" prop="timeLimit">
          <el-select
            v-model="props.approval.timeLimitType"
            size="mini"
            placeholder="维度 天 / 小时"
            style="width: 100px"
          >
            <el-option
              :value="enumConst.timeLimitType.HOUR"
              label="小时"
            />
            <el-option
              :value="enumConst.timeLimitType.DAY"
              label="天"
            />
          </el-select>
          <span style="margin: 0 10px">时长:</span>
          <el-input-number
            v-model="props.approval.timeLimitVal"
            :min="0"
            :max="100"
            :step="1"
            size="mini"
          />
          <span>
            {{
              props.approval.timeLimitType === enumConst.timeLimitType.HOUR
                ? "小时"
                : "天"
            }}</span>
        </el-form-item>

        <el-form-item
          v-if="props.approval.timeLimitVal > 0"
          label="审批期限超时后执行"
          prop="level"
        >
          <el-radio-group v-model="props.approval.timeoutEvent.event">
            <el-radio
              v-for="ev in timeoutEvents"
              :key="ev.event"
              :label="ev.event"
            >{{ ev.name }}</el-radio>
          </el-radio-group>

          <div
            v-if="
              props.approval.timeoutEvent.event ===
                enumConst.timeoutEvent.NOTIFY
            "
          >
            <div style="color: #409eef; font-size: small">
              默认提醒当前审批人
            </div>
            <el-switch
              v-model="props.approval.timeoutEvent.loop"
              inactive-text="一次"
              active-text="循环"
            />
            <span
              v-if="props.approval.timeoutEvent.loop"
              style="margin-left: 20px"
            >
              每隔
              <el-input-number
                v-model="props.approval.timeoutEvent.loopTime"
                :min="0"
                :max="10000"
                :step="1"
                size="mini"
              />
              天
            </span>
          </div>
        </el-form-item>
      </div>

      <div v-if="showModel">
        <el-divider />
        <el-form-item
          label="多人审批时审批方式"
          prop="text"
          class="approve-mode"
        >
          <el-radio-group v-model="props.approval.mode">
            <el-radio
              :label="enumConst.approvalMode.NEXT"
            >按选择顺序依次审批</el-radio>
            <el-radio
              :label="enumConst.approvalMode.AND"
            >会签（可同时审批，每个人必须同意）</el-radio>
            <el-radio
              :label="enumConst.approvalMode.OR"
            >或签（有一人同意即可）</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>

    </el-form>

    <org-picker
      :show="showUserSelect"
      :only-user="onlySelectUser"
      :selected="select"
      @close="showUserSelect = false"
      @selectOver="selected"
    />
    <RoleBox
      :show="showRoleSelect"
      :role-list="roleList"
      :selected="slectedRole"
      @close="showRoleSelect = false"
      @selectOver="saveRole"
    />
  </div>
</template>

<script>
import * as netData from '../../../../api/condition'
import * as roleData from '../../../../api/role'
import orgPicker from '../organizationPicker.vue'
import RoleBox from './RoleBox.vue'
import enumConst from '../../config/workflow-enum.js'

export default {
  name: 'NodeConfig',
  components: {
    orgPicker, RoleBox
  },
  props: {
    node: {
      default: () => {
        return {}
      },
      type: Object
    }
  },
  data() {
    return {
      enumConst,
      showUserSelect: false,
      showRoleSelect: false,
      roleList: [],
      select: [],
      approval: [],
      slectedRole: [],
      conditionList: [],
      conditionDefine: ['>', '<', '==', '>=', '<=', '!='],
      userConditions: [],
      timeoutEvents: [
        {
          event: 'pass',
          name: '自动通过'
        },
        {
          event: 'refuse',
          name: '自动拒绝'
        },
        {
          event: 'NOTIFY',
          name: '发送提醒'
        }
      ]
    }
  },
  computed: {
    template() {
      return this.$store.state.workflow.template
    },
    selectedNode() {
      return this.$store.state.workflow.selectedNode
    },
    onlySelectUser() {
      return (
        this.selectedNode.type === this.enumConst.nodeType.CS ||
        this.selectedNode.type === this.enumConst.nodeType.SP ||
        this.props.type === '1'
      )
    },
    props() {
      return this.$store.state.workflow.selectedNode.props
    },
    showModel() {
      return (
        (this.props.approval.user.users.length > 1 &&
          this.props.approval.type === '1') ||
        (this.props.approval.type === '2' &&
          this.props.approval.user.role.length > 1) ||

        (this.props.approval.type === '5' &&
          this.props.approval.user.role !== '')
      )
    }
  },
  watch: {
    selectedNode(newVal, oldVal) {
      this.userConditions = newVal.condition || []
      this.slectedRole = newVal.props.approval.user.role || []
    }
  },
  mounted() {
    roleData.roleList(this.template.id).then(resolve => {
      if (resolve) {
        this.roleList = resolve.rows
      }
    })

    netData.conditionsListByDefId(this.template.id).then(resolve => {
      if (resolve) {
        this.conditionList = resolve.rows
        this.userConditions = this.selectedNode.condition || []
      }
    })
  },
  methods: {
    saveRole(roles) {
      const t = []
      roles.forEach(v => {
        const r = this.roleList.filter(m => m.id === v)
        t.push(r[0])
      })

      this.$store.commit('workflow/selectedRoler', t)
      this.showRoleSelect = false
    },
    selected(select) {
      this.$store.commit(
        'workflow/selectedApprover',
        select.map((s) => ({
          id: s.id,
          type: s.type,
          name: s.name,
          attr1: s.attr1 ? s.attr1 : ''
        }))
      )
      this.showUserSelect = false
    },
    selectCondition(e, i) {
      const u = this.userConditions[i]
      let p = this.conditionList.filter(w => w.id === e)
      p = p[0]

      u.fields = p.fields
      u.optionType = p.optionType
      u.options = p.options
      u.name = p.name
      this.$set(this.userConditions, i, u)
    },
    newCondition() {
      this.userConditions.push(
        {
          id: '',
          name: '',
          fields: '',
          options: '',
          selectType: '',
          symbol: '',
          val: ''
        }
      )
    },
    deleteCondition(e) {
      this.userConditions.splice(e, 1)
    },
    saveConditions() {
      this.$store.commit('workflow/setCondition', this.userConditions)
      this.$message.success('保存成功')
    }
  }
}
</script>

<style lang="scss" scoped>
.node-config {
  padding: 0 20px;
  overflow-y: auto;

  ::v-deep .el-form {
    .el-form-item__label {
      padding: 0;
    }

    .el-form-item__label {
      font-size: 14px;
      color: #000;
    }

    .el-form-item {
      margin-bottom: 5px;
    }
  }
}

.select-user-type {
  ::v-deep .el-radio {
    width: 80px;
    margin-top: 10px;
    margin-bottom: 20px;
  }
}

::v-deep .approve-mode {
  .el-radio {
    float: left;
    width: 100%;
    display: block;
    margin-top: 15px;
  }
}

::v-deep .approve-end {
  position: relative;

  .el-radio-group {
    width: 160px;
  }

  .el-radio {
    margin-top: 15px;
    width: 100%;
  }

  .el-radio:last-child {
    margin-top: 15px;
    width: 50px;
  }

  .approve-end-leave {
    position: absolute;
    bottom: -10px;
    right: 20px;
  }
}

.select-u {
  width: 100%;
}
</style>
