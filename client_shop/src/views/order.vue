<template>
  <section class="order">
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
        <el-table-column label="操作" width="100px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleDetail(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <section style="text-align:right;">
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

    <el-drawer
      title="订单详情"
      :visible.sync="showDetail"
      direction="rtl"
      :before-close="handleCloseDetail">
      <section style="padding: 0 10px;">
        <el-descriptions class="margin-top" :column="1" border>
          <el-descriptions-item
            v-for="item in detailCloumn"
            :key="item.key">
            <template slot="label">
              {{item.label}}
            </template>
            <span v-if="item.key === 'status'">
              {{orderStatus[orderDetail[item.key]]}}
            </span>
            <span v-else>{{orderDetail[item.key]}}</span>
          </el-descriptions-item>
        </el-descriptions>
      </section>
    </el-drawer>
  </section>
</template>

<script>
import { getMyOrders } from '@/apis/order'
export default {
  name: 'order',
  data () {
    return {
      orderCloumn: [
        { key: 'payment_time', label: '购买日期' },
        { key: 'orderid', label: '订单编号' },
        { key: 'proName', label: '购买商品' },
        { key: 'quantity', label: '数量' },
        { key: 'payment', label: '实付金额' },
        { key: 'status', label: '订单状态' }
      ],
      detailCloumn: [
        { key: 'payment_time', label: '购买日期' },
        { key: 'orderid', label: '订单编号' },
        { key: 'proName', label: '购买商品' },
        { key: 'quantity', label: '数量' },
        { key: 'payment', label: '实付金额' },
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
        const { data, meta } = await getMyOrders({
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
.order {
  width: 100%;
  height: 100%;
}
</style>
