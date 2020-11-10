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
    reserveAPI:'https://iva.siiva.com/activity/plan_live'
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
    if(this.data.hours[val[3]]<9){
      hour='0'+this.data.hours[val[3]]
    }else{
      hour=this.data.hours[val[3]]
    }
    if(this.data.minutes[val[4]]<9){
      minute='0'+this.data.minutes[val[4]]
    }else{
      minute=this.data.minutes[val[4]]
    }

    if(this.data.current_choose_start_time){
      this.setData({
        showChooseStartTime:this.data.years[val[0]]+"-"+month+"-"+day+" "+hour+":"+minute+":00"
      })
    }else{
      this.setData({
        showChooseEndTime:this.data.years[val[0]]+"-"+month+"-"+day+" "+hour+":"+minute+":00"
      })
    }
  },
  open_choose_time:function(e){
    console.log(e.currentTarget.dataset.gid)
    if(e.currentTarget.dataset.gid==0){
      console.log('准备选择开始时间')
      this.setData({
        current_choose_start_time:true,
        choose_time:true
      })
    }else{
      console.log('准备选择结束时间')
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
      live_type:this.data.choose_location_id
    }
    console.log(data)
    util.request_get_over_time(this.data.reserveAPI, data, this.reserveBack)
  },
  reserveBack:function(res){
    console.log(res)
    if(res.data.code==0){
      wx.showToast({
        icon:'success',
        title: '预约完成',
      })
      setTimeout(()=>{
        wx.navigateTo({
          url: '../court/court',
        })
      },2000)
    }
  }

  


})