//index.js
//获取应用实例
const app = getApp()
const {
  $Toast
} = require('../../ui/iview/dist/base/index');
Page({
  data: {
    gifs:[],
    lodingOk:false
  },
  onPullDownRefresh: function() {
    this.getFiles()
    wx.stopPullDownRefresh();
  },
  onLoad:function(){
    if (app.globalData.userInfo) {
      if (app.globalData.JwtToken == "" || parseInt(new Date().getTime()) - app.globalData.TokenDate >3600){
        this.tgLogin(app.globalData.userInfo.nickName)
      }
      this.getFiles()
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
  getFiles:function(){
    self = this
    self.setData({
      lodingOk:false
    })
    $Toast({
      content: '加载中',
      type: 'loading'
    });
    wx.request({
      url: "https://wx.gifhelper.club/wx/GetMyGifs?ask="+app.globalData.userID,
      method: "GET",
      header: {
        Authorization: app.globalData.JwtToken
      },
      success:res=>{
        if (res.statusCode == 200) {
          let images = res.data.gifs.map(function(i) {
            return "http://tg-gif.oss-cn-hangzhou.aliyuncs.com/" + i
          })
          // console.log(images)
          self.setData({
            gifs: images,
            lodingOk: true,
          })
        }else if(res.statusCode ==401){
          self.tgLogin(app.globalData.userInfo.nickName)
          self.getFiles()
        }
      }
    })
  },
  previewImg: function(e) {
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var imgArr = this.data.gifs;
    wx.previewImage({
      current: imgArr[index], //当前图片地址
      urls: imgArr, //所有要预览的图片的地址集合 数组形式
      success: function(res) {},
      fail: function(res) {
        console.log(res)
      },
      complete: function(res) {},
    })
  },
})