var app = getApp();
var util = require("../../utils/request.js");
Page({
  /**
   * 初始化数据
   */
  data: {
    gettaskInfoApi:'https://ft.wisewing.cn/file_server/play/list',
    windowWidth:'',
    windowHeight:'', 
   
    taskId:'',

    posterSrc:'',
    videoSrc:'',
    videolist:[],
    index:0 ,//视频路径索引值
    date:'',
    time:'',
    title:''
  },


  onReady:function(res){
    this.videoContext = wx.createVideoContext('myVideo')
  },

  onLoad: function (options) {
  // 页面初始化 options为页面跳转所带来的参数  
    if(options.isShare){
      // console.log('分享页面而来')
      if(options.mode=='playback'){
        this.setData({
          mode:options.mode,
          taskId:options.taskId,
          title:options.title,
          date:options.date,
          time:options.time
        })
        var data={
          taskId:options.taskId
        }
        util.request_get_over_time(this.data.gettaskInfoApi, data, this.gettaskInfoBack)
      }else{
        var CurrentDate=this.getCurrentDate();
        var reserveDate=options.date+" "+options.time.split("--")[0]
        if(CurrentDate<reserveDate){
          // console.log('直播还未开始')
          this.setData({
            mode:options.mode,
            taskId:options.taskId,
            title:options.title,
            date:options.date,
            time:options.time
          })
        }else{
          // console.log('直播已经开始')
          wx.navigateTo({
            url: '../out/out?taskId='+options.taskId+'&title='+options.title
          })
        }
      }
    }else{
      if(options.mode=='playback'){
        this.setData({
          mode:options.mode,
          taskId:options.taskId,
          title:options.title,
          date:options.date,
          time:options.time
        })
        var data={
          taskId:options.taskId
        }
        util.request_get_over_time(this.data.gettaskInfoApi, data, this.gettaskInfoBack)
      }else{
        this.setData({
          mode:options.mode,
          taskId:options.taskId,
          title:options.title,
          date:options.date,
          time:options.time
        })
      }
    }
  },

  getCurrentDate:function(){
    //获取当前时间戳  
   var timestamp = Date.parse(new Date());  
    var date = new Date(parseInt(timestamp));
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute+':' + second;
  },

  gettaskInfoBack:function(res){
    console.log(res)
    if(res.data.code==0 && res.data.list.length!=0){
      console.log('获取info成功')
      this.setData({
        videolist:res.data.list,
        videoSrc: res.data.list[0]
      })
    }else{
      wx.showToast({
        icon:'none',
        title: '获取失败',
      })
    }
  },

  bindended:function(res){
    console.log('视频播放结束')
    if(this.data.index==this.data.videolist.length-1){
      console.log('最后一个视频了，请恢复从0开始')
      this.setData({
        index:0
      })
    }else{
      this.setData({
        index:this.data.index+1
      })
    }
    this.setData({
      videoSrc: this.data.videolist[this.data.index],
    })
    console.log('此时播放url:'+this.data.videoSrc)
    this.videoContext.play()
  },

  bindloadedmetadata:function(res){
    console.log('视频元数据加载完成')
  },
  binderror:function(res){
    console.log('视频播放错误：'+res);
  },
  bindwaiting:function(res){
    console.log('视频正在缓冲...')
  },

  copyText:function(e){
    console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },


  onShareAppMessage(options) {
    var that=this;
    var title=that.data.title
    　　// 设置菜单中的转发按钮触发转发事件时的转发内容
　　  var shareObj = {
  　　　title: title,        
        path: '/pages/live/live?taskId='+that.data.taskId+'&title='+that.data.title+'&date='+that.data.date+'&time='+that.data.time+'&mode='+that.data.mode+'&isShare=true',        
      　imageUrl: "../../images/top_area.jpg",     
　　　　success: function (res) {
　　　　　　// 转发成功之后的回调
　　　　　　if (res.errMsg == 'shareAppMessage:ok') {
　　　　　　}
　　　　},
　　　　fail: function () {
　　　　　　// 转发失败之后的回调
　　　　　　if (res.errMsg == 'shareAppMessage:fail cancel') {
　　　　　　　　// 用户取消转发
　　　　　　} else if (res.errMsg == 'shareAppMessage:fail') {
　　　　　　　　// 转发失败，其中 detail message 为详细失败信息
　　　　　　}
　　　　},
　　　　complete: function(){
　　　　　　// 转发结束之后的回调（转发成不成功都会执行）
　　　　}
　　};
    return shareObj;
  }



})