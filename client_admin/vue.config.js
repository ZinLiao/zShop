module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3333', // api接口基础路径
        changeOrigin: true // 是否支持跨域
      }
    }
  }
}
