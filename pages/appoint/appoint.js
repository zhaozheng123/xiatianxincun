var app = getApp();
var util = require("../../utils/request.js");
const date = new Date()
const years = []
const months = []
const days = []
const hours = []
const minutes = []
for (let i = 2020; i <= 2020; i++) {
  years.push(i)
}
for (let i = 1; i <= 12; i++) {
  months.push(i)
}
for (let i = 1; i <= 31; i++) {
  days.push(i)
}
for (let i = 1; i <=24; i++) {
  // if(i<=9){
  //   i='0'+i
  //   hours.push(i)
  // }else{
    hours.push(i)
  // }
}
// console.log(hours)
for (let i = 0; i <= 59; i++) {
  // if(i<=9){
  //   i='0'+i
  //   minutes.push(i)
  // }else{
    minutes.push(i)
  // }
}
// console.log(minutes)
Page({

  /** 
   * 页面的初始数据
   */
  data: {
    showChoosePlace:'下田心村篮球场',
    activity_id:'1615736797xt',
    LocationList:[
      {"location_name":"左半场","location_id":"left"},
      {"location_name":"右半场","location_id":"right"},
      {"location_name":"全场","location_id":"all"},
      {"location_name":"跟随","location_id":"follow"}
    ],
    choose_location_name:'左半场',
    choose_location_id:'left',
    title:'',   //预约直播的直播名称


    years,
    months,
    days,
    hours,
    minutes,
    value: [0, months.indexOf(date.getMonth())+1, days.indexOf(date.getDate()), hours.indexOf(date.getHours()),minutes.indexOf(date.getMinutes())],
    choose_time:false,
    showChooseStartTime:'',
    showChooseEndTime:'',
    current_choose_start_time:true,   //true:表示当前选择开始时间;false:表示当前选择结束时间
    reserveAPI:'https://ft.wisewing.cn/activity/plan_live'
  },
 
  /**   
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  choose_location:function(res){
    var temp_cur_item = res.currentTarget.dataset.item;
    console.log("列表点击事件", temp_cur_item);
    this.setData({
      choose_location_name:temp_cur_item.location_name,
      choose_location_id:temp_cur_item.location_id
    })
  },

  bindChange(e) {
    const val = e.detail.value
    // console.log(this.data.years[val[0]],this.data.months[val[1]],this.data.days[val[2]],this.data.hours[val[3]],this.data.minutes[val[4]])
    // console.log(val)
    this.setData({
      value:val
    })
  },
  choose_time_cancel:function(){
    this.setData({
      choose_time:false
    })
  },
  choose_time_ok:function(){
    let val=this.data.value
    let month,day,hour,minute
    // console.log(val)
    this.setData({
      choose_time:false,
    })
    if(this.data.months[val[1]]<10){
      month='0'+this.data.months[val[1]]
    }else{
      month=this.data.months[val[1]]
    }
    if(this.data.days[val[2]]<9){
      day='0'+this.data.days[val[2]]
    }else{
      day=this.data.days[val[2]]
    }
    if(this.data.hours[val[3]]<10){
      hour='0'+this.data.hours[val[3]]
    }else{
      hour=this.data.hours[val[3]]
    }
    if(this.data.minutes[val[4]]<10){
      minute='0'+this.data.minutes[val[4]]
    }else{
      minute=this.data.minutes[val[4]]
    }
    var CurrentDate=this.getCurrentDate();
    if(this.data.current_choose_start_time){
      var showChooseStartTime1=this.data.years[val[0]]+"-"+month+"-"+day+" "+hour+":"+minute+":00"
      if(showChooseStartTime1<CurrentDate){
        wx.showToast({
          icon:'none',
          title: '开始时间小于当前时间',
          duration:4000
        })
      }else{
        if(this.data.showChooseEndTime!=""){
          // console.log(showChooseStartTime1 +"======="+this.data.showChooseEndTime)
          // var timestamp_start=new Date(showChooseStartTime1)
          // var timestamp_end=new Date(this.data.showChooseEndTime)
          var format1 = showChooseStartTime1.replace(/-/g, '/')
          var timestamp_start = Date.parse(new Date(format1))
          var format2 = this.data.showChooseEndTime.replace(/-/g, '/')
          var timestamp_end = Date.parse(new Date(format2))
          if(timestamp_end-timestamp_start<=0){
            wx.showToast({
              icon:'none',
              title: '结束时间小于开始时间',
              duration:4000
            })
          }else{
            var h=(timestamp_end-timestamp_start)/(1000*60*60)
            if(h<=2){
              // console.log('时间长度合法')
              this.setData({
                showChooseStartTime:showChooseStartTime1
              })
            }else{
              wx.showToast({
                icon:'none',
                title: '直播时长大于2小时',
                duration:4000
              })
            }
          }
        }else{
          this.setData({
            showChooseStartTime:showChooseStartTime1
          })
        }
      }
    }else{
      //准备设置结束时间
      var showChooseEndTime1=this.data.years[val[0]]+"-"+month+"-"+day+" "+hour+":"+minute+":00"
      var format1 = showChooseEndTime1.replace(/-/g, '/')
      var timestamp_end = Date.parse(new Date(format1))
      if(showChooseEndTime1<CurrentDate){
        wx.showToast({
          icon:'none',
          title: '结束时间小于当前时间',
          duration:4000
        })
      }else{
        if(this.data.showChooseStartTime!=""){
          // console.log(showChooseEndTime1 +"======="+this.data.showChooseStartTime)
          // var timestamp_start=new Date(this.data.showChooseStartTime)
          var format = this.data.showChooseStartTime.replace(/-/g, '/')
          var timestamp_start = Date.parse(new Date(format))
          console.log(timestamp_end+'==============='+timestamp_start)
          if(timestamp_end-timestamp_start<=0){
            wx.showToast({
              icon:'none',
              title: '结束时间小于开始时间',
              duration:4000
            })
          }else{
            var h=(timestamp_end-timestamp_start)/(1000*60*60)
            console.log('hhhhhhhhhhhhhhhh:'+h)
            if(h<=2){
              this.setData({
                showChooseEndTime:showChooseEndTime1
              })
            }else{
              wx.showToast({
                icon:'none',
                title: '直播时长大于2小时',
                duration:4000
              })
            }
          }
        }else{
          this.setData({
            showChooseEndTime:showChooseEndTime1
          })
        }
      }
    }
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

  
  bindKeyInput:function(e){
    var value = e.detail.value
    this.setData({
      title:value
    })
  },
  open_choose_time:function(e){
    // console.log(e.currentTarget.dataset.gid)
    if(e.currentTarget.dataset.gid==0){
      this.setData({
        current_choose_start_time:true,
        choose_time:true
      })
    }else{
      this.setData({
        current_choose_start_time:false,
        choose_time:true
      })
    }
  },

  reserve:function(){
    var data={
      activity_id:this.data.activity_id,
      start:this.data.showChooseStartTime,
      end:this.data.showChooseEndTime,
      live_type:this.data.choose_location_id,
      title:this.data.title
    }
    // console.log(data)
    util.request_get_over_time(this.data.reserveAPI, data, this.reserveBack)
  },
  reserveBack:function(res){
    if(res.data.code==0){
      wx.showToast({
        icon:'success',
        title: '预约完成',
        duration:2000
      })
      setTimeout(()=>{
        wx.navigateTo({
          url: '../court/court',
        })
      },2000)
    }else{
      wx.showToast({
        icon:'none',
        duration:3000,
        title: '预约失败',
      })
    }
  }

  


})