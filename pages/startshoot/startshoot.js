var app = getApp();
var util = require("../../utils/request.js");
// socket 连接插件
const io = require('../../lib/weapp.socket.io.js')
// socket 连接地址
var socketUrl = 'wss://iva.siiva.com'
// socket 状态更新
var socketMessage = ''
// 上下文对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    state:'',  //预约状态
    activity_id:'',
    activity_name:'',
    project_id:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.activity_id!=undefined){
      this.setData({
        activity_id:options.activity_id,
        activity_name:options.activity_name,
        project_id:options.project_id
      })
    }
    // console.log('activity_id/activity_name/project_id:'+this.data.activity_id+'/'+this.data.activity_name+'/'+this.data.project_id)
  },

  startshoot:function(){
    var that=this
    console.log('点击了“开始拍摄”按钮')
    wx.vibrateShort();
    var ban_fly_url = "https://iva.siiva.com/me_photo/ban_fly/info";
    var ban_fly_data = {
      project_id: that.data.project_id
    }
    // console.log(ban_fly_data)
    util.request_get(ban_fly_url, ban_fly_data, that.banflyBack);
  },
  banflyBack:function(res){
    var that=this
    console.log(res)
    if(res.data.info=='0'){
      that.socketStart()
    }else{
      that.setData({
        state:'busy'
      })
    }
  },
  startshootBack:function(res){
    console.log(res)
  },

  /**
  * 启动socket
  */
  socketStart: function () {
    console.log("start socket")
    // 设置socket连接地址 socketUrl
    const socket = (this.socket = io(
      socketUrl,
    ))
    var that = this
    var cmd_register_data={
      deviceId:app.globalData.openId
    }
    that.socketSendMessage("cmd_register",cmd_register_data);
    var cmd_inform_startshoot_data={
      deviceId:that.data.project_id,
      from:app.globalData.openId,
      param:{
        action:"inform_startshoot"
      },
      activity_id:that.data.activity_id,
      activityplace:that.data.activity_name,
      openid:app.globalData.openId
    }
    that.socketSendMessage("cmd",cmd_inform_startshoot_data);
    socket.on('cmd', function (data) {
      switch(data.param.action){
        case 'connect':
          console.log('socket connect')
          break;
        case 'cmd_register_success':
          console.log('socket cmd_register_success')
          break;
        case 'post_fly_responds':
          console.log('socket post_fly_responds')
          that.setData({
            state:"wait"
          })
          break;
        case 'startshoot':
          console.log('socket startshoot')
          that.setData({
            state:"start"
          })
          setTimeout(()=>{
            wx.navigateTo({
              url: '../mine/mine',
            })
          },5000)
          break;
        default:
          console.log('无此类别',data)
          break;
      }
    })
  },
  /**
  * 发送消息
  */
  socketSendMessage: function (command,data) {
    this.socket.emit(command, data);
  },
  /**
  * 断开socket
  */
  socketStop: function () {
    console.log("stop socket")
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
  }

})