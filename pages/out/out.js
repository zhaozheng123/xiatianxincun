Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var taskId=options.taskId
    console.log('taskId:'+taskId)
    this.setData({
      url: `https://ui.siiva.com/siiva_live?taskId=`+taskId
    });
  },



})