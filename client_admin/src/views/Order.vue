<template>
  <section class="Order">
    <p>
      <el-input v-model="query" size="mini" placeholder="请输入订单编号" style="width: 200px;margin-right: 10px;"></el-input>
      <el-button size="mini" type="primary" @click="handleGetOrders">查询</el-button>
    </p>
    <section style="max-height: 600px;overflow: hidden;margin-bottom: 10px;">
      <el-table :data="allOrders" max-height="600">
        <el-table-column
          v-for="(item, index) in orderCloumn"
          :key="item.id + '_' + index"
          :prop="item.key"
          :label="item.label">
          <template slot-scope="scope">
            <span v-if="item.key === 'status'">
              {{orderStatus[scope.row.status]}}
            </span>
            <span v-else>{{scope.row[item.key]}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" width="100px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleDetail(scope.row)">查看详情</el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </section>
    <section v-if="allOrders.length > 10" style="text-align:right;">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next"
        :current-page="page.currentPage"
        :page-size="page.pageSize"
        :page-sizes="page.pageSizes"
        :total="page.total"
        @current-change="handleCurrentPageChange"
        @size-change="handleSizeChange">
      </el-pagination>
    </section>
  </section>
</template>

<script>
import { getAllOrders } from '@/apis/order'
export default {
  name: 'Order',
  data () {
    return {
      orderCloumn: [
        { key: 'orderid', label: '订单编号' },
        { key: 'email', label: '用户' },
        { key: 'created_time', label: '购买日期' },
        { key: 'proName', label: '商品' },
        { key: 'quantity', label: '数量' },
        { key: 'paymenttype', label: '实付金额' },
        { key: 'status', label: '订单状态' }
      ],
      orderStatus: {
        0: '已取消',
        10: '未付款',
        20: '已付款',
        40: '已发货',
        50: '交易成功',
        60: '交易关闭'
      },
      allOrders: [],
      query: '',
      page: {
        current_page: 1,
        pageSize: 5,
        pageSizes: [5, 15, 30, 50, 100],
        total: 0
      },

      showDetail: false,
      orderDetail: ''
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.handleGetOrders()
    })
  },
  methods: {
    async handleGetOrders () {
      try {
        const { data, meta } = await getAllOrders({
          query: this.query,
          per_page: this.page.pageSize,
          current_page: this.page.current_page
        })
        const { total } = meta

        this.allOrders = data
        this.page.total = total
      } catch (error) {
        console.log(error)
      }
    },
    handleDetail (order) {
      console.log(order)
      this.showDetail = true

      this.$nextTick(() => {
        setTimeout(() => {
          this.orderDetail = order
        }, 200)
      })
    },
    handleCloseDetail (done) {
      done()

      this.$nextTick(() => {
        this.orderDetail = ''
      })
    },
    handleCurrentPageChange (val) {
      this.page.current_page = val
      this.handleGetOrders()
    },
    handleSizeChange (val) {
      this.page.pageSize = val
      this.handleGetOrders()
    }
  }
}
</script>

<style lang="scss" scoped>
.Order {
  width: 100%;
  height: 100%;
}
</style>
