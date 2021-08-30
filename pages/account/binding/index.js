// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    uid:'',
    binding: false
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad(query) {
    this.setData({
      uid: decodeURIComponent(query.uid) || ''
    })
  },
  bindUid(e) {
    let page = this
    wx.login({
      success (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            method: 'POST',
            url: app.globalData.request.baseUrl + '/social/wx-mini/connect',
            data: {
              weiChatCode: res.code,
              serverToken: page.data.uid
            },
            success (res) {
              console.log(res.data)
              if(0 !== res.data.code){
                wx.showModal({
                  title: '提示',
                  content: res.data.code + ' - ' + res.data.msg
                })
              }else{
                wx.showModal({
                  title: '账号绑定成功',
                  content: `${res.data.data.name}(${res.data.data.username})`,
                  complete() {
                    wx.redirectTo({url: '../login/index'})
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
  }
})
