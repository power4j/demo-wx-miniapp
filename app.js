// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  globalData: {
    userInfo: null,
    request: {
      // TODO: 换成你自己的服务器IP
      //baseUrl: 'http://127.0.0.1:18081/api'
      baseUrl: 'http://ji-boot-demo.etcd.ltd/api'
    },
    accessToken: null
  }
})
