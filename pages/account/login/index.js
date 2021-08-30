// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    uid:'',
    loginLoading: false
  },
  // 事件处理函数
  onLoad(query) {
  },
  login(e) {
    wx.login({
      success (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            method: 'POST',
            url: app.globalData.request.baseUrl + '/social/login',
            data: {
              type: 'wx-mini-app',
              code: res.code
            },
            success (res) {
              console.log(res.data)
              if(0 !== res.data.code){
                wx.showModal({
                  title: '提示',
                  content: res.data.code + ' - ' + res.data.msg
                })
              }else{
                wx.setStorageSync('apiToken', res.data.data)
                wx.showModal({
                  title: '登录成功',
                  content: `${res.data.data.name}(${res.data.data.username})`,
                  complete() {
                    wx.redirectTo({url: '../user/index'})
                  }
                })
              }
            },
            fail (err) {
              console.log(err)
              wx.showModal({
                title: '提示',
                content: '网络请求失败 ' + err
              })
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  onBindingQrCode(e){
    const uid = '1'
    wx.redirectTo({
      url: `../binding/index?uid=${uid}`
    })
  }
})
