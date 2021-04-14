<template>
  <div class="app-container">
    <ClientArea>
      <div slot="content" style="height:100%">
        <el-table :data="tableData" style="width: 100%;" height="85%">
          <el-table-column prop="nodeName" label="节点名称" width="150" />
          <el-table-column prop="jobName" label="任务名称" width="150" />
          <el-table-column prop="name" label="发起人" width="150" />
          <el-table-column prop="executeName" label="当前审批人" width="150" />
          <el-table-column prop="urgent" label="是否加急" width="150">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.urgent === 0" type="success">正常</el-tag>
              <el-tag v-else type="danger">加急</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="urgentDesc" label="加急原因" width="150" />
          <el-table-column label="操作" width="100" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="handleReassignment(scope.row)">流程改派</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="margin-top flex justify-center">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="pageTotal"
            @current-change="switchPage"
          />
        </div>

      </div>
    </ClientArea>

    <el-dialog title="流程改派" :visible.sync="showTransferDialogVisible" width="550px" :append-to-body="true">
      <el-form
        ref="transferForm"
        :model="transferForm"
        status-icon
        :rules="transferFormRules"
        label-width="120px"
      >
        <el-form-item label="改派审批类型" prop="executeType">
          <el-select v-model="transferForm.executeType" filterable placeholder="请选择改派审批类型" style="width: 100%;">
            <el-option label="用户" value="user" />
            <el-option label="角色" value="role" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="transferForm.executeType=='user'"
          label="用户"
          prop="userId"
        >
          <el-select
            v-model="transferForm.userId"
            filterable
            placeholder="请选择"
            style="width: 100%;"
            @change="updateUserName($event, 1)"
          >
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>

        </el-form-item>
        <el-form-item
          v-if="transferForm.executeType=='role'"
          label="角色"
          prop="userId"
        >
          <el-select
            v-model="transferForm.userId"
            filterable
            placeholder="请选择"
            style="width: 100%;"
            @change="updateUserName($event, 2)"
          >
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>

        </el-form-item>
        <el-form-item v-show="false" label="用户名" prop="userName">
          <el-input v-model="transferForm.userName" />
        </el-form-item>
        <el-form-item label="改派备注" prop="comment">
          <el-input v-model="transferForm.comment" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showTransferDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitTransfer('transferForm')">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import ClientArea from '../../layout/components/ClientArea'
import * as netData from '../../api/workflow'
import * as roleData from '../../api/role'
import * as userData from '../../api/user'

const transferFormDefault = {
  userId: '',
  userName: '',
  executeType: '',
  comment: ''
}

export default {
  name: 'WorkFlowReassignment',
  components: {
    ClientArea
  },
  data() {
    return {
      tableData: [],
      roleList: [],
      userList: [],
      pageTotal: 0,
      loading: false,
      showTransferDialogVisible: false,
      transferForm: transferFormDefault,
      transferFormRules: {
        userId: [{ required: true, message: '请输入用户', trigger: 'change' }],
        userName: [{ required: true, message: '请输入用户名', trigger: 'change' }],
        executeType: [{ required: true, message: '请选择改派类型', trigger: 'change' }],
        comment: [{ required: true, message: '请输入改派备注', trigger: 'change' }]
      }

    }
  },
  mounted() {
    roleData.roleList().then(resolve => {
      console.log('角色列表', resolve)
      if (resolve) {
        this.roleList = resolve.rows
      }
    })
    userData.userListAll().then(resolve => {
      console.log('用户列表', resolve)
      if (resolve) {
        this.userList = resolve.rows
      }
    })
    this.getTaskList()
  },
  methods: {
    getTaskList() {
      netData.workflowJobList().then((resolve) => {
        this.pageTotal = resolve.total
        this.tableData = resolve.rows
      })
    },
    switchPage(e) {
      netData.workflowJobList(e).then((resolve) => {
        this.pageTotal = resolve.total
        this.tableData = resolve.rows
      })
    },
    handleReassignment(e) {
      console.log(e)
      this.showTransferDialogVisible = true
      this.transferForm.taskId = e.id
    },
    updateUserName(e, t) {
      console.log(e)
      if (t === 1) {
        const userName = this.userList.filter(u => u.id === e)
        this.transferForm.userName = userName[0].name
      } else {
        const userName = this.roleList.filter(u => u.id === e)
        this.transferForm.userName = userName[0].name
      }
    },
    submitTransfer(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          netData.transferAssignee(this.transferForm).then((resolve) => {
            this.showTransferDialogVisible = false
            this.$message.success('改派成功')
            this.getTaskList()
            this.loading = false
          }, (e) => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style>

</style>
