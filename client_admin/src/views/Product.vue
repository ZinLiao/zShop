<template>
  <section class="Product">
    <p>
      <el-input v-model="query" size="mini" placeholder="请输入商品名称" style="width: 200px;margin-right: 10px;"></el-input>
      <el-button size="mini" type="primary" @click="handleGetProducts">查询</el-button>
      <el-button size="mini" type="primary" @click="handleOpenDrawer('create')">添加商品</el-button>
    </p>
    <section style="max-height: 600px;overflow: hidden;margin-bottom: 10px;">
      <el-table :data="allProducts" max-height="600">
        <el-table-column
          v-for="(item, index) in productCloumn"
          :key="item.id + '_' + index"
          :prop="item.key"
          :label="item.label">
          <template slot-scope="scope">
            <span v-if="item.key === 'status'">
              {{scope.row.status === 1 ? '在售' : '下架'}}
            </span>
            <span v-else>{{scope.row[item.key]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleOpenDrawer('modify', scope.row)">修改</el-button>
            <el-button
              size="mini"
              :type="scope.row.status === 1 ? 'warning' : 'primary'"
              @click="handleChangeStatus(scope.row)">
              {{scope.row.status === 1 ? '下架' : '上架'}}
            </el-button>
            <el-button size="mini" type="danger" @click="handleRemoveProduct(scope.row)">删除</el-button>
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
      :title="isCreate ? '添加商品' : '修改商品'"
      :visible.sync="showDrawer"
      direction="rtl"
      :before-close="handleCloseDrawer"
      :size="600">
      <section style="padding: 0 10px;">
        <el-form
          ref="productForm"
          :model="productParams"
          :rules="productRules"
          label-width="80px"
          @submit.native.prevent>
          <el-form-item
            v-for="item in detailFormItem"
            :key="item.key"
            :label="item.label"
            :prop="item.key">
            <el-input
              v-if="item.type === 'input'"
              v-model="productParams[item.key]"
              size="mini"
              :placeholder="item.placeholder"></el-input>

             <el-radio-group
              v-if="item.type === 'radio'"
              v-model="productParams[item.key]">
              <el-radio :label="1">在售</el-radio>
              <el-radio :label="2">下架</el-radio>
            </el-radio-group>

            <el-input-number
              v-if="item.type === 'number'"
              v-model="productParams[item.key]"
              :min="1"
              label="描述文字"
              size="mini"></el-input-number>

            <el-input
              v-if="item.type === 'textarea'"
              v-model="productParams[item.key]"
              type="textarea"
              :rows="5"
              :placeholder="item.placeholder"></el-input>
          </el-form-item>
        </el-form>
      </section>
      <section class="drawerFoot">
        <p class="drawerButton" @click="handleSubmit">保 存</p>
      </section>
    </el-drawer>
  </section>
</template>

<script>
import { getProducts, createProducts, modifyProducts, deleteProducts } from '@/apis/product'
export default {
  name: 'Product',
  data () {
    return {
      productCloumn: [
        { key: 'name', label: '商品' },
        { key: 'price', label: '单价' },
        { key: 'status', label: '售卖状态' },
        { key: 'stock', label: '剩余数量' }
      ],
      detailFormItem: [
        { key: 'name', label: '商品', type: 'input', placeholder: '请输入商品名称' },
        { key: 'price', label: '单价', type: 'number', placeholder: '请输入单价' },
        { key: 'status', label: '售卖状态', type: 'radio' },
        { key: 'stock', label: '数量', type: 'number', placeholder: '请输入数量' },
        { key: 'detail', label: '描述', type: 'textarea', placeholder: '请输入商品详情' }
      ],
      allProducts: [],
      query: '',
      page: {
        current_page: 1,
        pageSize: 5,
        pageSizes: [5, 15, 30, 50, 100],
        total: 0
      },

      showDrawer: false,
      isCreate: true,
      drawerTitle: '添加商品',

      productRules: {
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入单价', trigger: 'blur' }
        ],
        stock: [
          { required: true, message: '请输入数量', trigger: 'blur' }
        ],
        detail: [
          { required: true, message: '请输入商品描述', trigger: 'blur' }
        ]
      },

      productParams: {
        name: '',
        price: '',
        status: 1,
        stock: '',
        detail: ''
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.handleGetProducts()
    })
  },
  watch: {
    showDrawer (val) {
      this.$nextTick(() => {
        !val && this.reset()
      })
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
    handleCurrentPageChange (val) {
      this.page.current_page = val
      this.handleGetProducts()
    },
    handleSizeChange (val) {
      this.page.pageSize = val
      this.handleGetProducts()
    },
    handleOpenDrawer (type) {
      this.showDrawer = true

      this.$nextTick(() => {
        switch (type) {
          case 'create':
            console.log('创建')
            break

          case 'modify':
            console.log('修改')
            console.log(arguments[1])
            this.isCreate = false
            this.productParams = JSON.parse(JSON.stringify(arguments[1]))
            break

          default:
            break
        }
      })
    },
    handleCloseDrawer (done) {
      done()
    },
    reset () {
      this.isCreate = true
      this.productParams = {
        name: '',
        price: '',
        status: 1,
        stock: '',
        detail: ''
      }
    },
    handleSubmit () {
      this.$refs.productForm.validate(async isPass => {
        if (isPass) {
          try {
            await this.submit()
          } catch (error) {
            console.log(error)
            this.$message.error(error)
          }
        }
      })
    },
    async submit () {
      const func = this.isCreate ? createProducts : modifyProducts
      const { code, msg } = await func(this.productParams)

      try {
        switch (code) {
          case 0:
            this.$message.success('商品' + (this.isCreate ? '添加' : '修改') + '成功')
            this.showDrawer = false
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
    },
    handleChangeStatus (product) {
      console.log(product)
      const p = JSON.parse(JSON.stringify(product))

      p.status = p.status === 1 ? 2 : 1
      this.isCreate = false
      this.productParams = p

      try {
        this.submit()

        setTimeout(() => {
          this.reset()
        }, 100)
      } catch (error) {
        console.log(error)
        this.$message.error(error)
      }
    },
    handleRemoveProduct (product) {
      this.$confirm(`确定删除商品：${product.name}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { code, msg } = await deleteProducts(product.proid)

        switch (code) {
          case 0:
            this.$message.success('删除成功')
            this.handleGetProducts()
            break

          default:
            this.$message.warning(msg)
            break
        }
      }).catch((error) => {
        console.log(error)
        this.$message.error(error)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.Product {
  width: 100%;
  height: 100%;

  .drawerFoot {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .drawerButton {
    padding: 10px 0;
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
