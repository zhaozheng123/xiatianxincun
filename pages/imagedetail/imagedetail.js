var app = getApp();
var request = require("../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskId:'',
    activity_id:'',
    imgSrc:'',
    mode:'video',
    videoSrc:'',
    isbuying:false,    //购买按钮控制锁
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const res = wx.getSystemInfoSync();  
    let windowWidth = 750;   //手机端标准宽度rpx单位
    let windowHeight = (res.windowHeight * (750 / res.windowWidth));
    this.setData({
      taskId:options.taskId,
      activity_id:options.activity_id,
      windowHeight: windowHeight,
      windowWidth: windowWidth,
      videoSrc:'https://siiva-video-public.oss-cn-hangzhou.aliyuncs.com/'+options.activity_id+'/'+options.taskId+'.mp4',
      poster:'https://siiva-video-public.oss-cn-hangzhou.aliyuncs.com/'+options.activity_id+'/'+options.taskId+'_min.jpg',
    })
  },
  /** 
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
  },


  pay:function(){
    console.log('点击了购买');
    var that=this;
    if(!that.data.isbuying){
      wx.vibrateShort();
      that.setData({
        isbuying:true
      })
        wx.request({
          url: 'https://iva.siiva.com/me_photo/pay',
          data: {
            openid: app.globalData.openId,
            activity_id: that.data.activity_id,
            appid: app.globalData.appid,
            taskId: that.data.taskId,
            total_fee: '1',	//字符串
          },
          method: 'post',
          success: function (res) {
            console.log(res)
            wx.requestPayment({
              timeStamp: res.data.time_stamp,
              nonceStr: res.data.nonce_str,
              package: res.data.package,
              signType: res.data.sign_type,
              paySign: res.data.sign,
              success: function (res) {
                app.globalData.is_pay=1;
                wx.navigateTo({
                  url: '../mine/mine',
                })
              },
              fail: function (res) {
                //console.log(res);
              },
              complete: function () {
                that.setData({
                  isbuying:false
                })
              },
            })
          }
        })
    }
  }







})