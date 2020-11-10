//app.js
App({
  data:{
  }, 
  onLaunch: function () {
    //console.log("程序启动我会被调用")
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },

  globalData: {
    appid: "wxd2eea8ece9bf11df",   //下田心村小程序appid
    openId: '',
    scopeType: ["scope.userLocation", "scope.writePhotosAlbum","scope.camera"],
    is_pay:0,
  },
  /**
   * 当程序启动完成展示给用户之后，从后台切换到前台会再次调用
   */
  onShow: function () {
    // console.log("程序启动完成我会被调用");
    
  },
  /**
   * 监听页面渲染完成
   * 完成之后不会在执行
   */
  onReady: function () {
    // console.log('index---------onReaday()');
  },
  /**
   *当程序进入后台调用 
   */
  onHide: function () {
    //// console.log("程序进入后台我会被调用");
  },
  /**
   * 当页面销毁时调用
   */
  onUnload: function () {
    // console.log('index---------onUnload')
  }

})