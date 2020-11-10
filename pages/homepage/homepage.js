var app = getApp();
var request = require("../../utils/request.js");

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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  touav: function(){
    wx.navigateTo({
      url: '../uav/uav',
    })  
  },
  toball:function(){
    wx.navigateTo({
      url: '../sport/sport',
    }) 
  },

})