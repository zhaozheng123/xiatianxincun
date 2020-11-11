var app = getApp();
var util = require("../../utils/request.js");
Page({
  /**
   * 初始化数据
   */
  data: {
    windowWidth:'',
    windowHeight:'',
    videoSrc:'',  
    posterSrc:'',  
    taskId:'',
    activity_id:'',
    showBackIcon:false,   //当扫带taskid参数码进来需显示返回icon
  },


  onLoad: function (options) {
    console.log(options)
    // console.log('======onload=====');
    const res = wx.getSystemInfoSync();  
    let windowWidth = 750;   //手机端标准宽度rpx单位
    let windowHeight = (res.windowHeight * (750 / res.windowWidth));
      var taskId=options.taskId;
      var activity_id=options.activity_id;
      if(options.state && options.state=='single'){
        this.setData({
          showBackIcon:true
        })
      }
      this.setData({
        windowHeight: windowHeight,
        windowWidth: windowWidth,
        taskId:taskId,
        activity_id:activity_id,
        posterSrc: 'https://siiva-video-public.oss-cn-hangzhou.aliyuncs.com/'+ taskId + '_min.jpg',
        videoSrc: 'https://siiva-video-public.oss-cn-hangzhou.aliyuncs.com/'+activity_id+'/'+taskId+'_min.mp4',
      });
  },


 



  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    // console.log('=====show=====')



  },
  onHide: function () { 
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭
  },

  backheadpage:function(){
    wx.navigateTo({
      url: '../search/search',
    }) 
  },

  bindMyVideo:function(){
      // console.log('绑定该taskId与openid')
      // 访问后台绑定openid和taskid
      var Bind_Url = "https://iva.siiva.com/me_photo/task/bind_openid";
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
  }

})