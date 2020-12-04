var app = getApp();
var util = require("../../utils/request.js");
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
    price:'',
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
      // poster: 'https://ft.wisewing.cn/file_server?file_name='+ taskId + '_min.jpg',
      // videoSrc: 'https://ft.wisewing.cn/file_server?file_name='+taskId+'.mp4',
      poster: 'https://siiva-video-public.oss-cn-hangzhou.aliyuncs.com/'+options.activity_id+'/'+options.taskId+'_min.jpg',
      videoSrc: 'https://siiva-video-public.oss-cn-hangzhou.aliyuncs.com/'+options.activity_id+'/'+options.taskId+'.mp4',
    })

    //动态获取当前活动视频的定价
    this.getTemplets(options.activity_id)
  },
  /** 
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
  },

  /* 目前免费支付调用该方法*/
  free:function(){
    var Bind_Url = "https://ft.wisewing.cn/me_photo/task/bind_openid";
    var data = {
      openid: app.globalData.openId,
      taskId: this.data.taskId,
      is_pay:'1'    //篮球活动，免费取得 直接绑定已购买
    }
    // 绑定
    util.request_get(Bind_Url, data, this.getBindBack);
  },
  getBindBack:function(res){
    // console.log(res)
    if(res.data && res.data.code == 0){
      // console.log('绑定成功')
      app.globalData.is_pay=1
      wx.navigateTo({
        url: '../mine/mine',
      })
    }
  },


  /*正式支付调用*/
  // pay:function(){
  //   console.log('点击了购买');
  //   var that=this;
  //   if(!that.data.isbuying){
  //     wx.vibrateShort();
  //     that.setData({
  //       isbuying:true
  //     })
  //       wx.request({
  //         url: 'https://ft.wisewing.cn/me_photo/pay',
  //         data: {
  //           openid: app.globalData.openId,
  //           activity_id: that.data.activity_id,
  //           appid: app.globalData.appid,
  //           taskId: that.data.taskId,
  //           total_fee: String(that.data.price*100),	//字符串
  //         },
  //         method: 'post',
  //         success: function (res) {
  //           console.log(res)
  //           wx.requestPayment({
  //             timeStamp: res.data.time_stamp,
  //             nonceStr: res.data.nonce_str,
  //             package: res.data.package,
  //             signType: res.data.sign_type,
  //             paySign: res.data.sign,
  //             success: function (res) {
  //               app.globalData.is_pay=1;
  //               wx.navigateTo({
  //                 url: '../mine/mine',
  //               })
  //             },
  //             fail: function (res) {
  //               //console.log(res);
  //             },
  //             complete: function () {
  //               that.setData({
  //                 isbuying:false
  //               })
  //             },
  //           })
  //         }
  //       })
  //   }
  // },


  getTemplets: function (activity_id) {
    var data = {
      activity_id: activity_id,
      template_type:"02"
    }
    console.log(data)
    util.request_get('https://ft.wisewing.cn/me_photo/activity/templates', data, this.getTemplatesBack)
  },
  getTemplatesBack: function (res) {
    // 获得模板列表
    // console.log(res)
    var that = this;
    if(res.data.templates && res.data.templates[0].video_total){
      that.setData({
        price:res.data.templates[0].video_total/100
      })
    }else{
      that.setData({
        price:'0.01'
      })
    }
  },







})