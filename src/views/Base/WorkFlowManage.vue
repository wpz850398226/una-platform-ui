<template>
  <div class="app-container">
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

    <ClientArea>
      <div slot="content" style="height:100%">
        <div class="margin-bottom">
          <div v-for="item in workflowList" :key="item.id">
            <el-button type="primary" @click="startAct(item)">{{ item.name }}</el-button>
          </div>
        </div>
        <el-table :data="taskList" style="width: 100%;" height="85%">
          <el-table-column prop="map.instanceName" label="所属流程" width="350" />
          <el-table-column prop="map.nodeName" label="节点" width="150" />
          <el-table-column prop="activateTime" label="开始时间" width="150" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="handleTask(scope.row)">处理</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </ClientArea>
    <!-- <div v-for="item in taskList" :key="item.id">
      <div>所属流程：{{ item.map.instanceName }}</div>
      <div>节点：{{ item.map.nodeName }}</div>
      <div>开始时间：{{ item.activateTime }}</div>
      <el-button @click="handleTask(item)">处理</el-button>
    </div> -->

  </div>
</template>

<script>
import ClientArea from '../../layout/components/ClientArea'
import { workflowList, creatInstance, taskList, finishTask } from '@/api/una/sys_workflow'
import { entityById } from '@/api/una/sys_entity'
import { chGet } from '@/api/index'

export default {
  name: 'WorkFlowManage',
  components: {
    ClientArea
  },
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

    this.getWorkflowList()
    this.getTaskList()
  },
  methods: {
    getWorkflowList() {
      workflowList().then(res => {

        this.workflowList = res
      })
    },
    startAct(e) {
      creatInstance(e.id).then(res => {

        this.$message.success(`发起工作流 - ${e.name} 成功`)
        this.getTaskList()
      })
    },
    getTaskList() {
      taskList(this.userInfo.id).then(res => {

        this.taskList = res.data

      })
    },
    handleTask(e) {

      this.workInfo = e
      this.approvalForm.id = e.id
      if (e.nodeTypeDcode === 'flow_nudeType_submit') {
        entityById(e.nodeEntityId).then((res) => {
          this.entity = res.data

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

            })

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

</style>
