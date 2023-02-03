<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="操作内容" prop="name" min-width="200" />
    <el-table-column label="操作人" prop="creatorName" min-width="200" />
    <el-table-column label="时间" prop="createTime" min-width="200" />
  </el-table>
</template>

<script>
// import { transactionList } from '@/api/remote-search'
import { logList } from '@/api/extend/log'

export default {
  name: 'Order',
  data() {
    return {
      list: null
    }
  },
  created() {
    this.getLogList()
  },
  methods: {
    getLogList() {
      logList({
        'pageNum': 1,
        'pageSize': 15,
        'orderByDesc': 'createTime'
      }).then(res => {
        this.list = res.data
      })
    }
    // fetchData() {
    //   transactionList().then(response => {
    //     this.list = response.data.items.slice(0, 8)
    //   })
    // }
  }
}
</script>
