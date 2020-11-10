var app = getApp();
var util = require("../../utils/request.js");

Page({
  /** 
   * 页面的初始数据
   */
  data: {
  },
 
  /**   
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取openid并设定全局openId值
      wx.login({
        success(res) {
          if (res.code) {
            wx.request({
              url: "https://iva.siiva.com/me_photo/user/openid?code=" + res.code + "&appid=" + app.globalData.appid,
              data: {
                code: res.code,
              },
              success: function (res) {
                console.log('openid：'+res.data.openid)
                app.globalData.openId =  res.data.openid;
              }
            })
          }
        }
      })
  },
  Toseemoment: function(){
    wx.navigateTo({
      url: '../search/search',
    })
  },
  Toseelive:function(){
    wx.navigateTo({
      url: '../court/court',
    })
  },
  Toseemine:function(){
    wx.navigateTo({
      url: '../mine/mine',
    })
  }
})