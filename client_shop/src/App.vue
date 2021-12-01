<template>
  <div id="app">
    <el-container>
      <el-header>
        <el-row :gutter="24">
          <el-col :span="20" :offset="2">
            <el-menu :default-active="currentNav" class="el-menu-demo" mode="horizontal" router>
              <el-menu-item index="/">首页</el-menu-item>
              <el-menu-item index="/order">订单管理</el-menu-item>
              <h1 class="title">X X 商 城</h1>
              <p style="float: right;margin-top: 16px;">
                <span v-if="email">{{email}}</span>
                <el-button v-else size="mini" type="primary" @click="handleShowLogin(true)">登录 / 注册</el-button>
              </p>
            </el-menu>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-col :gutter="24">
          <el-col :span="20" :offset="2">
            <router-view></router-view>
          </el-col>
        </el-col>
      </el-main>
    </el-container>

    <el-drawer
      :title="isLogin ? '登 录' : '注 册'"
      :visible.sync="showLogin"
      direction="rtl"
      :before-close="handleCloseLogin">
      <section style="padding: 0 20px 0 0">
        <el-form
          ref="loginForm"
          :model="loginParams"
          :rules="rules"
          label-width="80px"
          @submit.native.prevent>
          <el-form-item
            v-for="item in loginFormItem"
            :key="item.key"
            :label="item.label"
            :prop="item.key">
            <template>
              <el-input
                v-model="loginParams[item.key]"
                size="mini"
                :placeholder="item.placeholder"
                :type="item.type"
                required></el-input>
            </template>
          </el-form-item>
          <el-form-item label="">
            <template>
              <el-button
                size="mini"
                type="primary"
                @click="handleLogin">{{isLogin ? '登 录' : '注 册'}}</el-button>
              <el-button type="text" @click="handleChangeLoginType">
                {{isLogin ? '注册账号' : '已有账号，现在登录'}}
              </el-button>
            </template>
          </el-form-item>
        </el-form>
      </section>
    </el-drawer>
  </div>
</template>

<script>
import { login, register } from '@/apis/user'
export default {
  name: 'App',
  data () {
    const checkEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
      if (!value) {
        return callback(new Error('邮箱不能为空'))
      }
      setTimeout(() => {
        mailReg.test(value) ? callback() : callback(new Error('请输入正确的邮箱格式'))
      }, 100)
    }

    const checkPwd = (rule, value, callback) => {
      const pwdReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
      if (!value) {
        return callback(new Error('密码不能为空'))
      }

      setTimeout(() => {
        pwdReg.test(value) ? callback() : callback(new Error('密码必须包含数字与字母，长度6-20位'))
      }, 100)
    }

    return {
      currentNav: '/',
      showLogin: false,
      isLogin: true,
      email: '',
      loginFormItem: [
        { key: 'email', label: '邮箱', type: 'text', placeholder: '请输入邮箱' },
        { key: 'password', label: '密码', type: 'password', placeholder: '请输入密码' }
      ],
      rules: {
        email: [
          { validator: checkEmail, trigger: 'blur' }
        ],
        password: [
          { validator: checkPwd, trigger: 'blur' }
        ]
      },
      loginParams: {
        email: '',
        password: ''
      }
    }
  },
  created () {
    this.email = localStorage.getItem('email')
  },
  mounted () {
    this.$nextTick(() => {
      setTimeout(() => {
        this.currentNav = this.$route.path
      }, 100)
    })
  },
  methods: {
    handleShowLogin (isOpen = true) {
      this.showLogin = isOpen
    },
    handleCloseLogin (done) {
      done()
    },
    handleChangeLoginType () {
      this.isLogin = !this.isLogin
    },
    handleLogin () {
      this.$refs.loginForm.validate(async (isPass) => {
        if (isPass) {
          try {
            if (this.isLogin) {
              this.loginFunc(() => {
                this.$message.success('登录成功')
                this.handleShowLogin(false)
              })
            } else {
              this.registerFunc(() => {
                this.$message.success('注册成功')
                this.loginFunc()
                this.handleShowLogin(false)
              })
            }
          } catch (error) {
            console.log(error)
            this.$message.error((this.isLogin ? '登录' : '注册') + '失败，请稍后再试')
          }
        }
      })
    },
    async loginFunc (cb) {
      try {
        const { code, msg, data } = await login(this.loginParams)

        switch (code) {
          case 0:
            localStorage.setItem('token', data.type + ' ' + data.token)
            localStorage.setItem('email', this.loginParams.email)
            this.email = this.loginParams.email
            cb && cb()
            break

          default:
            this.$message.warning(msg)
            break
        }
      } catch (error) {
        console.log(error)
        this.$message.error('登录失败，请稍后再试')
      }
    },
    async registerFunc (cb) {
      try {
        const { code, msg } = await register(this.loginParams)

        switch (code) {
          case 0:
            localStorage.setItem('email', this.loginParams.email)
            cb && cb()
            break

          default:
            this.$message.warning(msg)
            break
        }
      } catch (error) {
        console.log(error)
        this.$message.error('注册失败，请稍后再试')
      }
    }
  }
}
</script>

<style lang="scss">
html,
body {
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
#app {
  height: 100%;

  .el-menu-demo {
    position: relative;
  }

  .title {
    position: absolute;
    left: 50%;
    width: 200px;
    font-size: 24px;
    margin: 0 0 0 -100px;
    text-align: center;
    line-height: 60px;
  }
}

p,
h1 {
  margin: 0;
}

.el-dialog__body {
  padding: 10px;
}
</style>
