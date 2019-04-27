//获取应用实例
const app = getApp()
const {
  $Toast
} = require('../../ui/iview/dist/base/index');

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
        canGetInfo: true,
        tgID:app.globalData.tgID
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
    if (app.globalData.JwtToken == "" || parseInt(new Date().getTime()) - app.globalData.TokenDate >3600){
    this.tgLogin(app.globalData.userInfo.nickName)
    }
  }
  },
  tgLogin: function(nickName) {
    self = this
    wx.login({
      success: resp => {
        wx.request({
          url: "https://wy2.kar98k.club:8888/wx/login?jscode=" + resp.code + "&nickName=" + nickName,
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
            }else{
              $Toast({
                content: '登录失败',
                type: 'error'
              });
            }
          }
        })
      }
    })
  },
  bindTg: function () {
    console.log("bingtg :", this.data.vinputTgID)
    self = this
    if (this.data.vinputTgID == ""){
      $Toast({
        content: '请输入Tg ID',
        type: 'error'
      });
      return
    }
    wx.request({
      url: "https://wy2.kar98k.club:8888/wx/bingtg?tgID=" + self.data.vinputTgID,
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
        }else{
          $Toast({
            content: '请求错误: '+res.statusCode,
            type: 'error'
          });
        }
      }
    })
  },
  unBindTg: function () {
    wx.request({
      url: "https://wy2.kar98k.club:8888/wx/UnBindTg",
      method: "GET",
      header: {
        Authorization: app.globalData.JwtToken
      },
      success: res => {
        app.globalData.tgID = 0
        this.setData({
          tgID:0
        })
      },
      fail: res => {
        $Message({
          content: '解绑失败，请重试',
          type: 'error'
        });
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
    console.log(e.detail.value)
    this.setData({
      vinputTgID:e.detail.value
    })
  },
  xx:e=>{
    console.log(e)
  }

})
