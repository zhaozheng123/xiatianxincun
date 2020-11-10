var app = getApp();
var util = require("../../utils/request.js");
Page({
  /**
   * 初始化数据
   */
  data: {
    gettaskInfoApi:'https://live.siiva.com/record/play/list',
    windowWidth:'',
    windowHeight:'', 
   
    taskId:'',

    posterSrc:'',
    videoSrc:'',
    videolist:[],
    index:0 ,//视频路径索引值
    live_url:'',
  },


  onReady:function(res){
    this.videoContext = wx.createVideoContext('myVideo')
  },

  onLoad: function (options) {
  // 页面初始化 options为页面跳转所带来的参数  
    if(options.mode!=undefined){
      this.setData({
        mode:options.mode,
        taskId:options.taskId,
        live_url:options.live_url
      })
      if(this.data.mode=='playback'){
        var data={
          taskId:options.taskId
        }
        util.request_get_over_time(this.data.gettaskInfoApi, data, this.gettaskInfoBack)
      }
    }
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
  }


})