var app = getApp();
var util = require("../../utils/request.js");
Page({

  /**
   * 页面的初始数据   
   */
  data: {
    //显示未购买（0）或者已购买（1）
    is_pay:0,
    limit: 50,
    Tid_list: "https://iva.siiva.com/me_photo/task/bind_openid_list",
    //显示当前选择类别的图片(已购买和原图)
    show_img_arr: [],
    nopaycum:0,   //未购买数量
    paycum:0,   //已购买数量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      is_pay:app.globalData.is_pay
    })
    var data = {
      openid: app.globalData.openId,
      company_id:'1577738609',    //下田心村公司ID
      limit:this.data.limit,
      is_pay:this.data.is_pay,
      mix:"1",
    }
    util.request_get_over_time(this.data.Tid_list, data, this.getTidList)
  },


  show_Already_buy: function () {
    var that = this;
    //如果已经处于已购买按钮下，不再访问获取
    if (that.data.is_pay == 1) {
      return;
    }
    app.globalData.is_pay=1;
    this.setData({
      is_pay: 1
    })
    var data = {
      openid: app.globalData.openId,
      company_id:'1577738609',
      limit: that.data.limit,
      is_pay: that.data.is_pay,
      mix:"1",
    }
    // console.log("已购买数据：", data)
    util.request_get_over_time(this.data.Tid_list, data, this.getTidList)
  },


  show_not_buy: function () {
    var that = this;
    //如果已经处于未购买按钮下，不再访问获取
    if (this.data.is_pay == 0) {
      return;
    }
    app.globalData.is_pay=0
    // console.log("显示原图")
    this.setData({
      is_pay: 0
    })
    var data = {
      openid: app.globalData.openId,
      company_id:'1577738609',
      limit: that.data.limit,
      is_pay:that.data.is_pay,
      mix:"1",
    }
    // console.log("未购买数据：", data)
    util.request_get_over_time(this.data.Tid_list, data, this.getTidList)
  },


  getTidList: function (res) {
    // console.log('===========进来获取task列表===========')
    // console.log("getTidList", res);
    this.setData({
      nopaycum: res.data.no_pay_count,
      paycum: res.data.pay_count,
      show_img_arr:[]
    })
    if (res.data && res.data.list && res.data.list[0]) {
        this.setData({
          show_img_arr: res.data.list,
        })
      console.log('改变后的数组：', this.data.show_img_arr)
    }
  },

  //图片点击事件
  show_img_choose_type: function (res) {
    var temp_cur_item = res.currentTarget.dataset.item;
    console.log("列表点击事件", temp_cur_item);
    if (this.data.is_pay == 0) {
        wx.navigateTo({
          url: '../imagedetail/imagedetail?taskId=' + temp_cur_item.taskId + '&activity_id=' + temp_cur_item.activity_id+ '&mode=' + temp_cur_item.mode,
        })
    } else {
      wx.navigateTo({
        url: '../myMedia/myMedia?taskId=' + temp_cur_item.taskId + '&activity_id=' + temp_cur_item.activity_id,
      })
    }
  },

  onPullDownRefresh: function () {
    // console.log('用户下拉刷新了')
    var data = {
      openid: app.globalData.openId,
      company_id:'1577738609',
      limit:this.data.limit,
      is_pay:this.data.is_pay,
      mix:"1",
    }
    util.request_get_over_time(this.data.Tid_list, data, this.getTidList)
    wx.stopPullDownRefresh();
  },


})