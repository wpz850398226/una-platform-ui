<template>
  <section class="todoapp">

    <el-dialog
      v-if="entity"
      :title="entity.name"
      :visible.sync="defaultFormDialogVisible"
      width="550px"
      :append-to-body="true"
    >
      <una-form ref="formController" :entity="entity" @saveSuccess="saveSuccess" />
    </el-dialog>

    <el-dialog
      title="审批任务"
      :visible.sync="approvalDialogVisible"
      width="550px"
      :append-to-body="true"
      fullscreen
    >

      <div style="pointer-events: none;">
        <una-form
          v-for="(item,index) in approvalDataList"
          :key="index"
          :entity="item.entity"
          :default-data="item.data"
          :action-bar="false"
        />
      </div>

      <el-form :model="approvalForm">
        <el-form-item label="审批意见" prop="isAgree">
          <el-radio-group v-model="approvalForm.isAgree">
            <el-radio :label="1">同意</el-radio>
            <el-radio :label="0">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="opinion">
          <el-input v-model="approvalForm.opinion" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitApproval">提交</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
    <!-- header -->
    <header class="header">
      <div class="flex align-center justify-between">
        <h3 class="margin-left">Todo List</h3>
        <div class="margin-right-xs">
          <el-dropdown>
            <el-button type="primary" size="mini">
              发起流程<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <!-- <div >
                <el-button type="primary" @click="startAct(item)">{{ item.name }}</el-button>
              </div> -->
              <el-dropdown-item
                v-for="item in workflowList"
                :key="item.id"
                @click.native="startAct(item)"
              >{{ item.name }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </header>
    <!-- main section -->
    <section v-show="taskList.length" class="main">
      <label for="toggle-all" />
      <ul class="todo-list">
        <todo
          v-for="(todo, index) in taskList"
          :key="index"
          :todo="todo"
          @toggleTodo="handleTask"
        />
      </ul>
    </section>
    <!-- footer -->
    <!-- <footer v-show="todos.length" class="footer">
      <span class="todo-count">
        <strong>{{ remaining }}</strong>
        {{ remaining | pluralize('item') }} left
      </span>
      <ul class="filters">
        <li v-for="(val, key) in filters" :key="key">
          <a :class="{ selected: visibility === key }" @click.prevent="visibility = key">{{ key | capitalize }}</a>
        </li>
      </ul>
    </footer> -->
  </section>
</template>

<script>
import { workflowList, creatInstance, taskList, finishTask } from '@/api/una/sys_workflow'
import { entityById } from '@/api/una/sys_entity'
import UnaForm from '@/views/Base/components/UnaForm.vue'
import { chGet } from '@/api/index'
import Todo from './Todo.vue'

export default {
  components: { Todo, UnaForm },
  data() {
    return {
      userInfo: '',
      entity: '',
      workInfo: '',
      workflowList: [],
      taskList: [],
      defaultFormDialogVisible: false,
      approvalDialogVisible: false,
      approvalDataList: [],
      approvalForm: {
        id: '',
        recordId: '',
        isAgree: '',
        opinion: ''
      }
    }
  },
  mounted() {
    this.userInfo = this.$store.getters.userinfo
    console.log(this.userInfo)
    this.getWorkflowList()
    this.getTaskList()
  },
  methods: {
    getWorkflowList() {
      workflowList().then(res => {
        console.log(res)
        this.workflowList = res
      })
    },
    startAct(e) {
      creatInstance(e.id).then(res => {
        console.log(res)
        this.$message.success(`发起工作流 - ${e.name} 成功`)
        this.getTaskList()
      })
    },
    getTaskList() {
      taskList(this.userInfo.id).then(res => {
        console.log('待办', res)
        this.taskList = res.data
        console.log('ssss', this.taskList)
      })
    },
    handleTask(e) {
      console.log(e)
      this.workInfo = e
      this.approvalForm.id = e.id
      if (e.nodeTypeDcode === 'flow_nudeType_submit') {
        entityById(e.nodeEntityId).then((res) => {
          this.entity = res.data
          console.log('反查实体', this.entity)
          this.defaultFormDialogVisible = true
        })
      }
      if (e.nodeTypeDcode === 'flow_nudeType_audit') {
        //
        this.approvalDataList = []
        e.submitTaskList.forEach(task => {
          entityById(task.nodeEntityId).then((res) => {
            const entity = res.data
            chGet(`${entity.path}/page`, {
              id: task.recordId
            }).then(entityData => {
              if (entityData.data.length > 0) {
                this.approvalDataList.push({
                  entity: entity,
                  data: entityData.data[0]
                })
                this.approvalForm.recordId = task.recordId
              }
              console.log(entityData, '反查实体数据')
            })
            console.log('反查实体', this.entity)
          })
        })
        this.approvalDialogVisible = true
      }
    },
    saveSuccess(e) {
      finishTask({
        id: this.workInfo.id,
        recordId: e.data
      }).then(res => {
        console.log(res, '完成任务')
        this.$message.success('处理任务完成')
        this.getTaskList()
        this.defaultFormDialogVisible = false
      })
    },
    submitApproval() {
      finishTask(this.approvalForm).then(res => {
        this.$message.success('处理任务完成')
        this.getTaskList()
        this.approvalDialogVisible = false
      })
    }
  }
}
</script>

<style lang="scss">
  @import './index.scss';
</style>
