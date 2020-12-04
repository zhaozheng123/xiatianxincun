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
              url: "https://ft.wisewing.cn/me_photo/user/openid?code=" + res.code + "&appid=" + app.globalData.appid,
              data: {
                code: res.code,
              },
              success: function (res) {
                console.log('openid：'+res.data.openid)
                app.globalData.openId =  res.data.openid;

                if (options.scene == undefined) {
                  console.log('扫的小程序公共码进来的')
                } else {
                  console.log('扫描的单独绑定taskId的二维码进来的')
                  var taskId = options.scene;
                  var activity_id = taskId.split('_')[0];
                  wx.navigateTo({
                    url: '../itemVideo/itemVideo?state=single&activity_id=' + activity_id+'&taskId='+taskId,
                  })            
                }
                
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