<template>
  <section class="product">
    <p>
      <el-input
        v-model="query"
        size="mini"
        placeholder="请输入商品名称"
        style="width: 200px;margin-right: 10px;"
        clearable></el-input>
      <el-button size="mini" type="primary" @click="handleGetProducts">查询</el-button>
    </p>
    <section style="max-height: 600px;overflow: hidden;margin-bottom: 10px;">
      <el-table :data="allProducts" max-height="600">
        <el-table-column
          v-for="(item, index) in productCloumn"
          :key="item.id + '_' + index"
          :prop="item.key"
          :label="item.label">
          <template slot-scope="scope">
            <span v-if="item.key === 'price'">{{scope.row[item.key].toFixed(2)}}</span>
            <span v-else>{{scope.row[item.key]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleBuy(scope.row)">购买</el-button>
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
      title="商品详情"
      :visible.sync="showDetail"
      direction="rtl"
      :before-close="handleCloseDetail"
      :size="600">
      <section style="padding: 0 10px;">
        <el-descriptions class="margin-top" :column="1" border>
          <el-descriptions-item>
            <template slot="label">
              商品名称
            </template>
            {{productDetail.name}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              单价
            </template>
            {{productDetail.price ? productDetail.price.toFixed(2) : 0}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              库存数量
            </template>
            {{productDetail.stock}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              商品详情
            </template>
            {{productDetail.detail}}
          </el-descriptions-item>
        </el-descriptions>
      </section>
      <section class="detailFoot">
        <p style="padding-left: 10px;">
          购买数量：<el-input-number v-model="buyParams.quantity" :min="1" :max="getBuyMaxQuantity" label="描述文字" size="mini"></el-input-number>
          &nbsp;&nbsp;
          总价：{{getTotalPrice.toFixed(2)}}
        </p>
        <p class="detailButton" @click="handleOpenReceiveDialog">购 买</p>
      </section>
    </el-drawer>

    <el-dialog
      title="填写收货人信息"
      :visible.sync="showReceiver"
      width="30%"
      :before-close="handleCloseReceiver">
      <section>
        <el-form
          ref="receiverForm"
          :model="buyParams"
          :rules="receiverRules"
          label-width="80px"
          @submit.native.prevent>
          <el-form-item
            v-for="item in receiverForm"
            :key="item.key"
            :label="item.label"
            :prop="item.key"
            :required="item.isRequired">
            <el-input v-model="buyParams[item.key]" size="mini" :placeholder="item.placeholder"></el-input>
          </el-form-item>
        </el-form>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showReceiver = false">取 消</el-button>
        <el-button type="primary" @click="handlePlaceOrder">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import { getProducts, buyProduct } from '@/apis/product'
export default {
  name: 'product',
  data () {
    const checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入收货人手机号码'))
      }

      const phoneReg = /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/

      setTimeout(() => {
        phoneReg.test(value) ? callback() : callback(new Error('手机号码格式不正确'))
      })
    }
    return {
      productCloumn: [
        { key: 'name', label: '商品' },
        { key: 'price', label: '单价(元)' },
        { key: 'stock', label: '剩余数量' }
      ],
      allProducts: [],
      query: '',
      page: {
        current_page: 1,
        pageSize: 5,
        pageSizes: [5, 15, 30, 50, 100],
        total: 0
      },

      showDetail: false,
      productDetail: '',

      showReceiver: false,
      receiverForm: [
        { key: 'recipient', label: '姓名', type: 'input', isRequired: true, placeholder: '请输入收货人名字' },
        { key: 'phone', label: '手机', type: 'input', isRequired: true, placeholder: '请输入收货人手机号' },
        { key: 'address', label: '地址', type: 'textarea', isRequired: false, placeholder: '请输入收货地址' }
      ],
      receiverRules: {
        recipient: [
          { required: true, message: '请输入收货人信息', trigger: 'blur' }
        ],
        phone: [
          { validator: checkPhone, trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入收货人地址', trigger: 'blur' }
        ]
      },

      buyParams: {
        quantity: 1,
        recipient: '',
        phone: '',
        address: '',
        payment: 0,
        paymenttype: 1
      }

    }
  },
  computed: {
    getTotalPrice () {
      if (!this.productDetail) {
        return 0
      }
      return this.productDetail.price * this.buyParams.quantity
    },
    getBuyMaxQuantity () {
      if (!this.productDetail) {
        return 0
      }

      return this.productDetail.stock
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.handleGetProducts()
    })
  },
  watch: {
    showDetail (val) {
      !val && this.resetProduct()
    },
    showReceiver (val) {
      !val && this.resetBuy()
    }
  },
  methods: {
    async handleGetProducts () {
      try {
        const { data, meta } = await getProducts({
          query: this.query,
          per_page: this.page.pageSize,
          current_page: this.page.current_page
        })
        const { total } = meta

        this.allProducts = data
        this.page.total = total
      } catch (error) {
        console.log(error)
      }
    },
    handleBuy (product) {
      this.showDetail = true

      this.$nextTick(_ => {
        setTimeout(() => {
          this.productDetail = product
        }, 200)
      })
    },
    handleCloseDetail (done) {
      done()

      this.$nextTick(_ => {
        this.showDetail = false
      })
    },
    resetProduct () {
      this.productDetail = ''
      this.buyParams.quantity = 1
    },
    resetBuy () {
      this.buyParams = {
        quantity: 1,
        recipient: '',
        phone: '',
        address: '',
        payment: 0,
        paymenttype: 1
      }
    },
    handleCurrentPageChange (val) {
      this.page.current_page = val
      this.handleGetProducts()
    },
    handleSizeChange (val) {
      this.page.pageSize = val
      this.handleGetProducts()
    },
    handleOpenReceiveDialog () {
      this.showReceiver = true
      console.log(this.productDetail)
      this.buyParams.proid = this.productDetail.proid
      this.buyParams.payment = this.productDetail.price * this.buyParams.quantity
    },
    handleCloseReceiver (done) {
      done()

      this.$nextTick(() => {
        this.showReceiver = false
      })
    },
    handlePlaceOrder () {
      this.$refs.receiverForm.validate(async isPass => {
        if (isPass) {
          const loading = this.$loading({
            lock: true,
            text: '支付中，请稍等。。。。。。',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })

          // 等候2s，模拟支付过程
          setTimeout(async () => {
            loading.close()
            try {
              const { code, msg } = await buyProduct(this.buyParams)

              switch (code) {
                case 0:
                  this.$message.success('购买成功！')
                  this.showReceiver = false
                  this.showDetail = false
                  this.handleGetProducts()
                  break

                default:
                  this.$message.warning(msg)
                  break
              }
            } catch (error) {
              console.log(error)
              this.$message.error(error)
            }
          }, 2000)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.product {
  width: 100%;
  height: 100%;

  .detailFoot {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding-top: 10px;
    border-top: 1px solid #e5e5e5;
  }

  .detailButton {
    padding: 10px 0;
    margin-top: 10px;
    width: 100%;
    background-color: #409EFF;
    color: #fff;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    cursor: pointer;
  }
}
</style>

<style>
.el-descriptions-item__label.is-bordered-label {
  width: 150px;
}
</style>
