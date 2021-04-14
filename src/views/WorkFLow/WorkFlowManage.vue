<template>
  <div class="app-container">
    <ClientArea>
      <div slot="content" style="height:100%">
        <el-table :data="tableData" style="width: 100%;" height="85%">
          <el-table-column prop="jobName" label="任务名" width="150" />
          <el-table-column prop="name" label="发起人名称" width="150" />
          <el-table-column prop="urgent" label="是否加急" width="150">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.urgent === 0" type="success">正常</el-tag>
              <el-tag v-else type="danger">加急</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="urgentDesc" label="加急完成时间" width="150" />
          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="handleSway(scope.row)">流程转向</el-button>
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

    <el-dialog title="流程转向" :visible.sync="showNodeDialogVisible" width="550px" :append-to-body="true">
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in nodeList"
          :key="index"
        >
          <div class="margin-bottom-xs">{{ item.name }}</div>
          <el-button size="mini" type="primary" @click="jumpNode(item)">跳到此步</el-button>
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import ClientArea from '../../layout/components/ClientArea'
import * as netData from '../../api/workflow'

export default {
  name: 'WorkFlowManage',
  components: {
    ClientArea
  },
  data() {
    return {
      tableData: [],
      pageTotal: 0,
      nodeList: [],
      showNodeDialogVisible: false,
      jobId: ''
    }
  },
  mounted() {
    this.getJobList()
  },
  methods: {
    getJobList() {
      netData.workflowTaskList().then((resolve) => {
        this.pageTotal = resolve.total
        this.tableData = resolve.rows
      })
    },
    switchPage(e) {
      netData.workflowTaskList(e).then((resolve) => {
        this.pageTotal = resolve.total
        this.tableData = resolve.rows
      })
    },
    handleSway(e) {
      console.log(e)
      this.jobId = e.id
      netData.getWorkNode(e.publishId).then((resolve) => {
        this.nodeList = resolve.rows
        this.showNodeDialogVisible = true
      })
    },
    jumpNode(e) {
      this.$prompt('请输入转向原因', '流程跳转', {
        confirmButtonText: '提交',
        cancelButtonText: '取消',
        inputPattern: /^[\u4E00-\u9FA5A-Za-z0-9\\-]{1,30}$/,
        inputErrorMessage: '转向原因不能为空且长度小于30',
        inputPlaceholder: '请输入转向原因'
      }).then(({ value }) => {
        netData.jumpNode(this.jobId, e.nodeId, value).then((resolve) => {
          this.$message.success('流程跳转成功')
        })
      })
    }
  }
}
</script>

<style>

</style>
