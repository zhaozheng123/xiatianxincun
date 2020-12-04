var app = getApp();
var util = require("../../utils/request.js");

Page({

  /** 
   * 页面的初始数据
   */
  data: {
    getTaskListAPI:'https://ft.wisewing.cn/me_photo/task/list',
    reserveList:[],
    isbroadcast:false,  //是否正在直播
    nobegin:true,//球赛还未开始标记
    activity_id:'1615736797xt',//下田心村预约直播的活动ID
  },
 
  /**   
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      //获取预约记录
      var data={
        activity_id:this.data.activity_id
      }
      util.request_get_over_time(this.data.getTaskListAPI, data, this.getTaskListBack)
  },

  getTaskListBack:function(res){
      // console.log(res.data.list[0])
      console.log(res)
      var CurrentDate=this.getCurrentDate();
      var tempreservelist=[]
      for(let i=0;i<=res.data.list.length-1;i++){
        if(CurrentDate<res.data.list[i].task.live_start){
          // console.log('当前时间小于live_start')
          // console.log(CurrentDate)
        // console.log(res.data.list[i].task.live_start)
          res.data.list[i].task.nobegin=true;
          res.data.list[i].task.isbroadcast=false;
          tempreservelist.push(res.data.list[i]);
        }else{
          if(CurrentDate<res.data.list[i].task.live_end){
            // console.log('正在直播')
            res.data.list[i].task.nobegin=false;
            res.data.list[i].task.isbroadcast=true;
            tempreservelist.push(res.data.list[i]);
          }else{
            // console.log('直播结束，看回放')
            res.data.list[i].task.nobegin=false;
            res.data.list[i].task.isbroadcast=false;
            tempreservelist.push(res.data.list[i]);
          }
        }
      }
      this.setData({
        reserveList:tempreservelist
      })
      // console.log(this.data.reserveList)
  },
  getCurrentDate:function(){
    //获取当前时间戳  
   var timestamp = Date.parse(new Date());  
  //  console.log("当前时间戳为：" + timestamp);  
    var date = new Date(parseInt(timestamp));
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    // console.log(date.getMonth()+"============================")
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    // console.log(y + '-' + m + '-' + d + ' ' + h + ':' + minute+':' + second)
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute+':' + second;
  },

  click_reserve:function(){
    // console.log('用户点击了预约')
    wx.vibrateShort();
    wx.navigateTo({
      url: '../appoint/appoint',
    })
  },

  goSeeReserve:function(res){
    var temp_cur_item = res.currentTarget.dataset.item;
    // console.log("列表点击事件", temp_cur_item);
    var title=temp_cur_item.task.title;
    var date=temp_cur_item.task.live_start.split(" ")[0];
    var time=temp_cur_item.task.live_start.split(" ")[1]+"--"+temp_cur_item.task.live_end.split(" ")[1];
      wx.navigateTo({
        url: '../live/live?taskId=' + temp_cur_item.task.taskId+'&mode=reserve&time='+time+'&date='+date+'&title='+title
      })
  },
  goSeePlayback:function(res){
    var temp_cur_item = res.currentTarget.dataset.item;
    // console.log("列表点击事件", temp_cur_item);
    var title=temp_cur_item.task.title;
    var date=temp_cur_item.task.live_start.split(" ")[0];
    var time=temp_cur_item.task.live_start.split(" ")[1]+"--"+temp_cur_item.task.live_end.split(" ")[1];
      wx.navigateTo({
        url: '../live/live?taskId=' + temp_cur_item.task.taskId+'&mode=playback&time='+time+'&date='+date+'&title='+title
      })
  },
  goShowBroadCast:function(res){
    var temp_cur_item = res.currentTarget.dataset.item;
    console.log("列表点击事件", temp_cur_item);
    // wx.navigateTo({
    //   url: '../live/live?taskId='+temp_cur_item.task.taskId+'&mode=broadcast'
    // })

    // 测试直接播放
    wx.navigateTo({
      url: '../out/out?taskId='+temp_cur_item.task.taskId+'&title='+temp_cur_item.task.title
    })
  }


})