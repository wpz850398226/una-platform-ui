<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="订单编号" prop="code" min-width="200" />
    <el-table-column label="金额" prop="orderAmount" min-width="200" />
    <el-table-column label="状态" prop="map.statusDname" min-width="200" />
  </el-table>
</template>

<script>
// import { transactionList } from '@/api/remote-search'
import { orderList } from '@/api/extend/order'

export default {
  name: 'Order',
  data() {
    return {
      list: null
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    getOrderList() {
      orderList({
        'pageNum': 1,
        'pageSize': 15
      }).then(res => {

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
