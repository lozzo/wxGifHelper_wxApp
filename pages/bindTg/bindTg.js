//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    canGetInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    islogin: false,
    tgID: 0,
    vinputTgID: "",
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        canGetInfo: true
      })
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  if (this.data.canGetInfo){
    this.tgLogin(app.globalData.userInfo.nickName)
  }
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
              app.globalData.JwtToken = res.data.token
              app.globalData.tgID = res.data.tgID
              app.globalData.userID = res.data.userID
              app.globalData.TokenDate = parseInt(new Date().getTime())
              console.log("wx_data:", res.data)
              self.setData({
                islogin: true,
                tgID: res.data.tgID,
                canGetInfo: true
              })
            }
          }
        })
      }
    })
  },
  bindTg: function () {
    console.log("bingtg :", this.data.vinputTgID)
    self = this
    wx.request({
      url: "https://wx.gifhelper.club/wx/bingtg?tgID=" + self.data.vinputTgID,
      method: "GET",
      header: {
        Authorization: app.globalData.JwtToken
      },
      success: res => {
        console.log("bingtg :", res.statusCode)
        if (res.statusCode == 200){
            self.setData({
              tgID:parseInt(self.data.vinputTgID)
            })
        }
      }
    })
  },
  unBindTg: function () {
    wx.request({
      url: "https://wx.gifhelper.club/wx/UnBindTg",
      method: "GET",
      header: {
        Authorization: app.globalData.JwtToken
      },
      success: res => {
        app.globalData.tgID = 0
        this.setData({
          tgID:0
        })

      }
    })
  },
  bindGetUserInfo:function(e){
    console.log(e.detail.userInfo)
    var nickname = e.detail.userInfo.nickName
    this.tgLogin(nickname)
    this.setData({
      userInfo:e.detail.userInfo
    })
  },
  Binput:function(e){
    console.log(e.detail.detail.value)
    this.setData({
      vinputTgID:e.detail.detail.value
    })
  },
  xx:e=>{
    console.log(e)
  }

})
