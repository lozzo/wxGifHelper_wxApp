//index.js
//获取应用实例
const app = getApp()
const { $Toast } = require('../../ui/iview/dist/base/index');
const { $Message } = require('../../ui/iview/dist/base/index');
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    gifs: [],
    windowHeight: 456,
    lodingOk: false,
    firstLoad: true,
    actions: [
      {
        name: '吃我一发举报吧',
        color: '#ed3f14'
      }
    ],
    reportID:{
      id:"",
      index:""
    },
    // 触摸开始时间
    touchStartTime: 0,
    // 触摸结束时间
    touchEndTime: 0,
    // 最后一次单击事件点击发生时间
    lastTapTime: 0,
    // 单击事件点击后要触发的函数
    lastTapTimeoutFunc: null, 
  },
  onPullDownRefresh: function () {
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
    } else if (this.data.canIUse) {
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
      windowHeight: app.globalData.windowHeight
    })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getGifs: function () {
    console.log("test", app.globalData)
    self = this
    self.setData({
      lodingOk: false,
    })
    $Toast({
      content: '加载中',
      type: 'loading'
    });
    wx.request({
      url: "https://wy2.kar98k.club:8888/wx/rand",
      method: "GET",
      success: function (res) {
        if (res.statusCode == 200) {
          let images = res.data.gifs.map(function (i) {
            return "https://tg-gif.oss-cn-hangzhou.aliyuncs.com/" + i
          })
          self.setData({
            gifs: images,
            lodingOk: true
          })
        }
      },
      fail: res => {
        $Message({
          content: '获取随机表情失败',
          type: 'error'
        });
        self.setData({
          lodingOk: true
        })
      }
    })
  },
  previewImg: function (e) {
    var index = e.currentTarget.dataset.index;
    var imgArr = this.data.gifs;
    wx.previewImage({
      current: imgArr[index], //当前图片地址
      urls: imgArr, //所有要预览的图片的地址集合 数组形式
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {
        console.log(res)
      },
      complete: function (res) { },
    })
  },
  /// 按钮触摸开始触发的事件
  touchStart: function (e) {
    this.touchStartTime = e.timeStamp
  },

  /// 按钮触摸结束触发的事件
  touchEnd: function (e) {
    this.touchEndTime = e.timeStamp
  },

  multipleTap: function (e) {
    var that = this
    // 控制点击事件在350ms内触发，加这层判断是为了防止长按时会触发点击事件
    if (that.touchEndTime - that.touchStartTime < 350) {
      // 当前点击的时间
      var currentTime = e.timeStamp
      var lastTapTime = that.lastTapTime
      // 更新最后一次点击时间
      that.lastTapTime = currentTime

      // 如果两次点击时间在300毫秒内，则认为是双击事件
      if (currentTime - lastTapTime < 300) {
        console.log("double tap")
        // 成功触发双击事件时，取消单击事件的执行
        clearTimeout(that.lastTapTimeoutFunc);
        var index = e.currentTarget.dataset.index;
        var imgArr = this.data.gifs;
        console.log(imgArr[index])
        that.like(e)
        // wx.showModal({
        //   title: '提示',
        //   content: '双击事件被触发',
        //   showCancel: false
        // })
      } else {
        // 单击事件延时300毫秒执行，这和最初的浏览器的点击300ms延时有点像。
        that.lastTapTimeoutFunc = setTimeout(function () {
          that.previewImg(e)
        }, 300);
      }
    }
  },

  onReady: function () {

  },
  Report: function (e) {
    
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var imgArr = this.data.gifs;
    console.log(imgArr[index])
    

    this.setData({
      visible: true,
      reportID:{id:imgArr[index].split(".com/")[1],
        index:index}
    });
  },
  handleCancel:function(){
    this.setData({
      visible: false
    });
  },
  handleClickItem:function(e){
    self = this
    let delete_thanks = "https://tg-gif.oss-cn-hangzhou.aliyuncs.com/delete_thanks.gif"
    var imgArr = this.data.gifs;
    console.log(this.data.report_index)
    wx.request({
      url:"https://wy2.kar98k.club:8888/wx/report?id="+self.data.reportID.id,
      success:res=>{
        if (res.statusCode == 200){
          imgArr[self.data.reportID.index] = delete_thanks
          this.setData({
            visible: false,
            gifs:imgArr
        });
        $Message({
            content: '成功举报',
            type: 'success'
        });
        }
      },
      fail:res=>{
        $Message({
          content: '不举',
          type: 'error'
      });
      }
    })
  },
  like: function (e) {
    var index = e.currentTarget.dataset.index;
    var imgArr = this.data.gifs;
    var gifID = imgArr[index].split("/")[3]
    wx.request({
      url: "https://wy2.kar98k.club:8888/wx/like?id=" + gifID + "&ask=" + app.globalData.userID,
      header: {
        Authorization: app.globalData.JwtToken
      },
      success: res => {
        if (res.statusCode == 200) {
          $Message({
            content: '收藏成功',
            type: 'success'
          });
        }else if (res.statusCode == 401){
          $Message({
            content: '收藏失败,你可能尚未登录',
            type: 'error'
          });
        }
      },
      fail: res => {
        $Message({
          content: '收藏失败',
          type: 'error'
        });
      }
    })
  }

})