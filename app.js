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
              if (self.globalData.JwtToken == "" || parseInt(new Date().getTime()) - self.globalData.TokenDate >3600){
                self.tgLogin(res.userInfo.nickName)
              }
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
  tgLogin: function(nickName) {
    self = this
    wx.login({
      success: resp => {
        wx.request({
          url: "https://wx.gifhelper.club/wx/login?jscode=" + resp.code + "&nickName=" + nickName,
          method: "GET",
          success: function (res) {
            if (res.statusCode == 200) {
              self.globalData.JwtToken = res.data.token
              self.globalData.tgID = res.data.tgID
              self.globalData.userID = res.data.userID
              self.globalData.TokenDate = parseInt(new Date().getTime())
              console.log("wx_data:", res.data)
            }
          }
        })
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