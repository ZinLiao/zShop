<template>
  <div id="app">
    <el-container style="height: 100%;">
      <el-header>欢 迎 使 用 X X 商 城 管 理 系 统</el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
            :default-active="currentNav"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            router>
            <el-menu-item index="/product">商品管理</el-menu-item>
            <el-menu-item index="/order">订单管理</el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      currentNav: '/'
    }
  },
  mounted () {
    this.$nextTick(() => {
      setTimeout(() => {
        this.currentNav = this.$route.path
      }, 100)
    })
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
}

p,
h1 {
  margin: 0;
}

.el-dialog__body {
  padding: 10px;
}

.el-header {
  background-color: #545c64;
  color: #fff;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #545c64;
  text-align: center;
  line-height: 200px;
}
</style>
