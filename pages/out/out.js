Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskId:'',
    url: '',
    title:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var taskId=options.taskId
    // console.log('taskId:'+taskId)
    this.setData({
      url: `https://ft.wisewing.cn/file_server/live_page/?taskId=`+options.taskId,
      title:options.title,
      taskId:options.taskId
    });
  },

  onShareAppMessage(options) {
    var that=this;
    console.log(options.webViewUrl)
    console.log(that.data.title)
    var title="正在直播："+that.data.title
    　　// 设置菜单中的转发按钮触发转发事件时的转发内容
　　  var shareObj = {
　　　title: title,        
      path: '/pages/out/out?taskId='+that.data.taskId+'&title='+that.data.title,        
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