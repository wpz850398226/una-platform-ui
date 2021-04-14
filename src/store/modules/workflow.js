import {
  nodeType, approvalMode, timeoutEvent,
  timeLimitType, userEmpty, endCondition
} from '@/views/WorkFLow/config/workflow-enum.js'

const process = {
  type: nodeType.ROOT,
  name: '发起人',
  id: '10000',
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
        role: [],
        self: ''
      }
    }
  }
}

const getDefaultState = () => {
  return {
    selectedNode: {},
    template: {
      baseSetup: {
        icon: 'el-icon-s-custom',
        background: '#718dff',
        name: '新的审批',
        group: '',
        code: '',
        remark: '',
        sign: false,
        callback: 1,
        topic: '',
        tag: '',
        notify: {
          types: [],
          title: ''
        }
      },
      // 流程设计
      process
    }
  }
}

const state = getDefaultState()

const mutations = {
  setTemplate(state, val) {
    state.template = val
  },
  clearTemplate(state) {
    state.template = {}
  },
  selectedNode: (state, val) => {
    state.selectedNode = val
  },
  selectedApprover(state, val) {
    state.selectedNode.props.approval.user.users = val
  },
  selectedRoler(state, val) {
    state.selectedNode.props.approval.user.role = val
  },
  setCondition(state, val) {
    state.selectedNode.condition = val
  },
  setConditionRootUser(state, val) {
    state.selectedNode.condition = val
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
