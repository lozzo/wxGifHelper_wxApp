//app.js
App({
  onLaunch: function () {
    self = this
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              self.globalData.userInfo = res.userInfo
            }
          })
        }
      }
    })

    // 获取屏幕信息
    wx.getSystemInfo({
      success: function (res) {
        self.globalData.windowHeight = res.windowHeight
      }
    })
  },
  globalData: {
    userInfo: null,
    windowHeight: 456,
    JwtToken: "",
    tgID: 0,
    userID: 0,
    TokenDate:0
  }
})