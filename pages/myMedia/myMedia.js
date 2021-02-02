var app = getApp();
var request = require("../../utils/request.js");
Page({
  /**
   * 初始化数据
   */
  data: {
    windowWidth:'',
    windowHeight:'', 
    is_download:false,
    taskId:'',
    activity_id:'',
    imgSrc:'',
    posterSrc:'',
    videoSrc:'',
    isShare:false,   //监听是否分享进来，若是：需新增“我也要玩”按钮

  },


  onLoad: function (options) {
  // 页面初始化 options为页面跳转所带来的参数
    const res = wx.getSystemInfoSync();  
    let windowWidth = 750;   //手机端标准宽度rpx单位
    let windowHeight = (res.windowHeight * (750 / res.windowWidth));
    if (options.isShare == "true") {
      //分享页面进来
        this.setData({
          windowHeight: windowHeight,
          windowWidth: windowWidth,
          posterSrc: options.posterSrc,
          isShare:false,
          videoSrc:options.videoSrc
        });
    }else{
      //非分享页面进来
      var taskId=options.taskId;
      var activity_id=options.activity_id;
      if(activity_id=='1643736397xz'|| activity_id=='1643736397xy'){
        this.setData({
          windowHeight: windowHeight,
          windowWidth: windowWidth,
          taskId:taskId,
          activity_id:activity_id,
          posterSrc: 'https://ft.wisewing.cn/file_server?file_name='+ taskId + '_min.jpg',
          videoSrc: 'https://ft.wisewing.cn/file_server?file_name='+taskId+'.mp4',
        });  
      }else{
        this.setData({
          windowHeight: windowHeight,
          windowWidth: windowWidth,
          taskId:taskId,
          activity_id:activity_id,
          posterSrc: 'https://siiva-video-public.oss-cn-hangzhou.aliyuncs.com/'+activity_id+'/'+taskId+'_min.jpg',
          videoSrc: 'https://siiva-video-public.oss-cn-hangzhou.aliyuncs.com/'+activity_id+'/'+taskId+'.mp4',
        });  
      }
    }
  },

  download_click: function (e) {
    wx.vibrateShort();
    var that = this;
    if(!that.data.is_download){
      that.setData({
        is_download:true
      })
          // 获取权限
          wx.getSetting({
            success: function (res) {
              if (res.authSetting["scope.writePhotosAlbum"] != true) {
                // 未授权
                wx.authorize({
                  scope: 'scope.writePhotosAlbum',
                  success: function (res) {
                    that.download()
                  },
                  fail: function (res) {
                    wx.showToast({
                      title: '请开启下载权限',
                      icon: "failed",
                    })
                  }
                })
              } else {
                // 已授权
                that.download()
              }
            }
          })
    }
  },

  download: function (){
      var that=this;
      var downloadFile = that.data.videoSrc;
      const downloadTask = wx.downloadFile({
        url: downloadFile,
        timeout:60000,
        success: function (res) {
          // console.log('获取本地缓存文件成功==================')
          console.log(res);
            wx.saveVideoToPhotosAlbum({
              filePath: res.tempFilePath,
              success: function (res) {
                console.log(res)
                // console.log(res.tempFilePath)
                wx.showToast({
                  icon:'success',
                  title: '保存成功',
                })
              },
              fail: function (res) {
                console.log(res);
              }
            })    
        },
        fail:function(res){
          console.log('获取本地缓存失败=======')
          console.log(res)
          downloadTask.abort((res)=>{
            console.log('中断下载任务')
          });
          downloadTask.offProgressUpdate((res)=>{
            console.log('取消监听')
          })
          setTimeout((res)=>{
            wx.showModal({
              title: '下载失败',
              content: '当前网络环境较差',
              showCancel:false,
              success (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  wx.hideLoading({})
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          },3000)
        }
      });
      downloadTask.onProgressUpdate((res) => {
        if (res.progress == 100) {
          wx.hideLoading({})
          that.setData({
            is_download: false,
          })
        } else {
          wx.showLoading({
            title: String(res.progress) + "%",
          })
        }
      })
  }, 





  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    var that = this;
    var title = "上田村智能航拍"
　　// 设置菜单中的转发按钮触发转发事件时的转发内容
　　var shareObj = {
      title: title,        
      path: '/pages/myMedia/myMedia',        
    　imageUrl: that.data.imgSrc,     
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
    // 来自页面内的按钮的转发
　　if (options.from == 'button') {
      shareObj.imageUrl = that.data.posterSrc,
      shareObj.path = '/pages/myMedia/myMedia?isShare=true&videoSrc='+that.data.videoSrc+'&posterSrc='+that.data.posterSrc+'&activity_id='+that.data.activity_id
　　}
　　// 返回shareObj
　　return shareObj;
  },




})