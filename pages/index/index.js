//index.js
//获取应用实例
const app = getApp()
const { $Toast } = require('../../ui/iview/dist/base/index');
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    gifs:[],
    windowHeight:456,
    lodingOk:false,
    firstLoad:true
  },
  onPullDownRefresh(){
    console.log("-----")
    this.getGifs()
    wx.stopPullDownRefresh();
  },
//事件处理函数
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
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
    this.getGifs()
    this.setData({
      windowHeight:app.globalData.windowHeight
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getGifs:function(){
    self = this
    self.setData({
      lodingOk:false,
    })
    $Toast({
      content: '加载中',
      type: 'loading'
  });
    wx.request(
      {
        url:"https://tg.onemoresec.com/wx/rand",
        method:"GET",
        success :function(res){
          if (res.statusCode == 200){
              let images = res.data.gifs.map(function(i){return "http://tg-gif.oss-cn-hangzhou.aliyuncs.com/"+i+"?x-oss-process=image/format,jpg" })
              self.setData({
                gifs:images,
                lodingOk:true
              })
          }
        }
      }
    )
  },
  previewImg:function(e){
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var imgArr = this.data.gifs;
    wx.previewImage({
      current: imgArr[index],     //当前图片地址
      urls: imgArr,               //所有要预览的图片的地址集合 数组形式
      success: function(res) {},
      fail: function(res) {
        console.log(res)
      },
      complete: function(res) {},
    })
  }

})
