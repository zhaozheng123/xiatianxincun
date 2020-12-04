var app = getApp();
var util = require("../../utils/request.js");

Page({
  /** 
   * 页面的初始数据
   */
  data: {
    latitude:'',
    longitude:'',
  },
 
  /**   
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取openid并设定全局openId值
      wx.login({
        success(res) {
          console.log('res.code:'+res.code)
          if (res.code) {
            wx.request({
              url: "https://ft.wisewing.cn/me_photo/user/openid?code=" + res.code + "&appid=" + app.globalData.appid,
              data: {
                code: res.code,
              },
              success: function (res) {
                console.log('openid：'+res.data.openid)
                app.globalData.openId =  res.data.openid;
              }
            })
          }
        }
      })
  },



  Toshoot: function(){
    this.position()
  },
  Toseemine:function(){
    wx.navigateTo({
      url: '../mine/mine',
    })
  },

  //定位判断,根据当前地点GPS活动对应活动
  position:function(){
    var _that = this
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 3000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      wx.getLocation({
                        type: 'wgs84',
                        success(res) {
                          _that.setData({
                            latitude:res.latitude,
                            longitude:res.longitude
                          })
                          _that.getActivityByGPS()
                        },
                        fail: function() {
                          wx.showToast({
                            title: '手机定位未打开',
                            icon: 'none',
                            duration: 2000 
                          })
                        },
                      })
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 3000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          wx.getLocation({
            type: 'wgs84',
            isHighAccuracy:true,
            success(res) {
              _that.setData({
                latitude:res.latitude,
                longitude:res.longitude
              })
              _that.getActivityByGPS()
            },
            fail: function() {
              wx.showToast({
                title: '手机定位未打开',
                icon: 'none',
                duration: 2000 
              })
            },
          })
        }
        else {
          //调用wx.getLocation的API
          wx.getLocation({
            type: 'wgs84',
            isHighAccuracy:true,
            success(res) {
              _that.setData({
                latitude:res.latitude,
                longitude:res.longitude
              })
              _that.getActivityByGPS()
            },
            fail: function() {
              wx.showToast({
                title: '手机定位未打开',
                icon: 'none',
                duration: 2000 
              })
            },
          })
        }
      }
    })
  },

  getActivityByGPS:function(){
    var url = "https://ft.wisewing.cn/me_photo/activity/info";
    var data = {
      lat: this.data.latitude,
      lon: this.data.longitude
    }
    // console.log(data)
    util.request_get(url, data, this.getActivityByGPSBack);
  },
  getActivityByGPSBack:function(res){
    // console.log(res)
    if(res.data.code==0){
      // console.log("已经为你匹配到对应活动")
      wx.navigateTo({
        url: '../startshoot/startshoot?activity_id='+res.data.activity_id+'&project_id='+res.data.project_id+'&activity_name='+res.data.activity_name,
      })
    }else{
      console.log("msg:"+res.data.info)
      wx.showToast({
        icon:'none',
        title: '当前无拍摄点',
        duration:4000
      })
    }
  },
  // ToTEST:function(){
  //   wx.navigateTo({
  //     url: '../startshoot/startshoot?activity_id=1606529289gf&project_id=pr_1623398777&activity_name=下田心村白亭拍摄点',
  //   })
  // },
  // ToTEST1:function(){
  //   wx.navigateTo({
  //     url: '../startshoot/startshoot?activity_id=1606533694zf&project_id=pr_1623398777&activity_name=下田心村水塔拍摄点',
  //   })
  // }





})