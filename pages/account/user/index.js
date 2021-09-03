// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: null
  },
  getApiToken() {
    let data = wx.getStorageSync('apiToken')
    return data ? data.token : null
  },
  getUid() {
    let data = wx.getStorageSync('apiToken')
    return data ? data.uuid : null
  },
  loadUserInfo(){
    // 为了演示showLoading,加上1S 延迟
    wx.showLoading({title:'正在获取个人信息...',mask:true})
    setTimeout(() => this.doLoadUserInfo_(),1000);
  },
  doLoadUserInfo_(){
    const page = this
    const token = page.getApiToken()
    const uid = page.getUid()
    console.log(`token = ${token}`)
    wx.request({
      timeout: 2000,
      method: 'GET',
      header: {
        'x-api-token': token
      },
      url: app.globalData.request.baseUrl+`/sys/users/${uid}`,
      success (res) {
        console.log(res)
        if(res.statusCode === 200 && res.data.code === 0){
          page.setData({userInfo: JSON.stringify(res.data.data)})
        }else if(res.statusCode === 401 || res.statusCode === 403){
          wx.showModal({
            title: '登录会话已过期,请重新登录',
            content: res.statusCode + '  ' + res.data.msg,
            success (res) {
              if (res.confirm) {
                wx.redirectTo({url: '../login/index'})
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }else{
          wx.showModal({
            title: '请求出错',
            content: res.statusCode + '  ' + res.data.msg
          })
        }
      },
      complete() {
        wx.hideLoading()
      }
    })
  },
  // 事件处理函数
  onShow(query) {
    if(this.getApiToken()){
      this.loadUserInfo()
    }else{
      wx.navigateTo({
        url: '../login/index'
      })
    }
  },
  onLogout(query) {
    const token = this.getApiToken()
    wx.showModal({
      title: '退出登录',
      success (res) {
        if (res.confirm) {
          console.log('delete api token')
          wx.request({
            timeout: 2000,
            method: 'POST',
            header: {
              'x-api-token': token
            },
            url: `${app.globalData.request.baseUrl}/logout`,
            success (res) {
              console.log(res)
              wx.setStorageSync('apiToken', null)
              wx.redirectTo({url: '../login/index'})
            }
          })
        }
      }
    })
  }
})
