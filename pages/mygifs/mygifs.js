//index.js
//获取应用实例
const app = getApp()
const {$Toast} = require('../../ui/iview/dist/base/index');
const { $Message } = require('../../ui/iview/dist/base/index');
Page({
  data: {
    gifs:[],
    lodingOk:false,
    actions: [
      {
        name: '确定删除了',
        color: '#ed3f14'
      }
    ],
    delete_file:{
      id:"",
      index:""
    }
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
          url: "https://wy.kar98k.club/wx/login?jscode=" + resp.code + "&nickName=" + nickName,
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
      url: "https://wy.kar98k.club/wx/GetMyGifs?ask="+app.globalData.userID,
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
  handleCancel:function(){
    this.setData({
      visible: false
    });
  },
  Prdelete:function(e){
    var index = e.currentTarget.dataset.index;
    var imgArr = this.data.gifs;
    console.log(imgArr[index])
    this.setData({
      visible: true,
      delete_file:{id:imgArr[index].split(".com/")[1],
        index:index}
    });
  },
  handleClickItem:function(e){
    self = this
    let delete_ok = "https://tg-gif.oss-cn-hangzhou.aliyuncs.com/delete_ok.jpg"
    var imgArr = this.data.gifs;
    wx.request({
      url:"https://wy.kar98k.club/wx/DeleteUserFile?id="+self.data.delete_file.id+"&ask="+app.globalData.userID,
      header: {
        Authorization: app.globalData.JwtToken
      },
      success:res=>{
        if (res.statusCode == 200){
          imgArr[self.data.delete_file.index] = delete_ok
          this.setData({
            visible: false,
            gifs:imgArr
        });
        $Message({
            content: '删除成功',
            type: 'success'
        });
        }
      },
      fail:res=>{
        $Message({
          content: '失败',
          type: 'error'
      });
      }
    })
  }

})