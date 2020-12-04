// pages/search/search.js
var app = getApp();
var util = require("../../utils/request.js");
var date=''; //当天日期YYYY-MM-DD
let rate=0;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    index_place: null,// 有用
    index_date: null, //有用
    curIndex: 0, 
    // 分割线
    time:"",
    choose_time: false, //底部弹起选择时间框
    curChooseTime: '',
    showChooseTime: '',
    tasklist:[],
    get_tasklist_url: "https://ft.wisewing.cn/me_photo/task/list",
    begin:'',
    end:'',
    findvideofail:false,  //搜索不到task显示
    tasklistHeight:'',
    project_id:'pr_1623398799',   //下田心村智慧篮球项目ID
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const res = wx.getSystemInfoSync();
    rate = 750 / res.windowWidth;
    console.log(res.windowWidth,res.windowHeight)
     // 篮球场开关机时间为：早9点到晚19点，活动时间为早12点到晚6点
     var tempArr = this.getTimeInType(9, 19);
    //  console.log("获得的时间数组：", tempArr);  
     this.setData({
       tasklistHeight:res.windowHeight*rate-120,
       picker_hours: tempArr,
       index_date: this.getOneDayDate(0),
       showChooseTime: tempArr[0],
       curChooseTime: tempArr[0],
     })  

     date = this.getOneDayDate(0);
     console.log('date:'+date);
     console.log('当前时间段是：'+this.data.showChooseTime)
     var data = {
      project_id: this.data.project_id,
      begin: date+" "+this.data.showChooseTime.split("~")[0],
      end:  date+" "+this.data.showChooseTime.split("~")[1],
      // has_preview_img: 1,
      // has_preview_video: 1,
    }
    console.log(data)
    util.request_get_over_time(this.data.get_tasklist_url, data, this.getTaskList);

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getOneDayDate: function(addDay){
    var dd = new Date();
    dd.setDate(dd.getDate() + addDay);
    var year = dd.getFullYear();
    var mon  =  (dd.getMonth()+1)<10?"0"+(dd.getMonth()+1):(dd.getMonth()+1);
    var day  = dd.getDate()<10?"0"+dd.getDate():dd.getDate();
    var hour = dd.getMinutes() < 10 ? "0" + dd.getMinutes() : dd.getMinutes();
    var second = dd.getSeconds() < 10 ? "0" + dd.getSeconds() : dd.getSeconds();
    return year + "-" + mon + "-" + day;
  },
  // 输入时间段返回固定格式的时间段(begin和end为整点,24小时制，如10，24, nowHours为现在的小时数,)
  // 三者关系（begin < end）
  getTimeInType: function (begin, end) {
    var dd = new Date();
    var nowHours = dd.getHours();
    // var nowHours = 8; 
    var nowMins = dd.getMinutes();
    var tempArr = [];
    var temp_index = 0;
    if (nowHours < end && nowHours >= begin) {
      for (var i = 0; i <= nowHours - begin; i++) {
        temp_index = nowHours - i;
        var temp_i = this.prefixzero(temp_index, 2);
        if (i == 0) {
          if (nowMins <= 30) {
            tempArr.push(temp_i + ":00~" + temp_i + ":30");
          } else {
            tempArr.push(temp_i + ":30~" + this.prefixzero((temp_index + 1), 2) + ":00");
            tempArr.push(temp_i + ":00~" + temp_i + ":30");
          }
        } else {
          tempArr.push(temp_i + ":30~" + this.prefixzero((temp_index + 1), 2) + ":00");
          tempArr.push(temp_i + ":00~" + temp_i + ":30");
        }
      }
    } else if (nowHours < begin) {
      this.setData({
        closeFind: true,
      }) 
    } else {
      for (var i = 0; i < end - begin; i++) {
        temp_index = end - i - 1;
        var temp_i = this.prefixzero(temp_index, 2);
        tempArr.push(temp_i + ":30~" + this.prefixzero((temp_index + 1), 2) + ":00");
        tempArr.push(temp_i + ":00~" + temp_i + ":30");
      }
    }
    return tempArr;
  },
  // 前置0函数：
  prefixzero: function (tempNum, length) {
    return (Array(length).join('0') + tempNum).slice(-length);
  },


// ---------------------------分割线______________
  open_choose_time: function(res){
    this.setData({
      choose_time: true,
    })
  },
  choose_ok: function(){
    var temp = this.data.curChooseTime
    this.setData({
      showChooseTime: temp,
      choose_time: false,
      tasklist:[],
    })  
    var data = {
      project_id: this.data.project_id,
      begin: date+" "+temp.split("~")[0],
      end:  date+" "+temp.split("~")[1],
      has_preview_img: 1,
      has_preview_video: 1,
    }
    util.request_get_over_time(this.data.get_tasklist_url, data, this.getTaskList);   
  },
  choose_cancel: function(res){
    this.setData({
      choose_time: false,
    })  
  },
  chenge_item: function(res){
    var index = res.detail.value;
    var time_arr = this.data.picker_hours;
    this.setData({
      curIndex: index,
      curChooseTime: time_arr[index],
    })
  },

  getTaskList:function(res){
    console.log(res)
    if(res.data && res.data.list && res.data.list.length!=0){
      this.setData({
        tasklist:res.data.list,
        findvideofail:false
      })
    }else{
      this.setData({
        findvideofail:true
      })
    }
  },

  gomyVideo:function(e){
    var click_item =e.currentTarget.dataset.item;
    console.log(click_item)
    wx.navigateTo({
      url: '../itemVideo/itemVideo?activity_id=' + click_item.activity_id+'&taskId='+click_item.task.taskId,
    })  
  }

})