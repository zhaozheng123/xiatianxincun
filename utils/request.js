var app = getApp();
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// get请求
function request_put(Api_type, Api_data, do_fuction) {
  wx.request({
    url: Api_type,
    data: Api_data,
    method: "put",
    success: function (res) {
      if (typeof (do_fuction) == "function") {
        do_fuction(res);
      }
    },
    fail: function (res) {
      console.log("get请求失败")
    }
  })
}


// get请求
function request_get(Api_type , Api_data,do_fuction){
  wx.request({
    url: Api_type,
    data: Api_data,
    method: "get",
    success: function(res){
      if (typeof (do_fuction) == "function") {
        do_fuction(res);
      } 
    },
    fail: function(res){
      console.log("get请求失败")
    },
    complete:function(){
    }
  })
}

// get请求超时
function request_get_over_time(Api_type, Api_data, do_fuction) {
  wx.showLoading({
    title: '拉取数据中',
  })
  wx.request({
    url: Api_type,
    data: Api_data,
    method: "get",
    success: function (res) {
      if (typeof (do_fuction) == "function") {
        do_fuction(res);
      }
    },
    fail: function (res) {
      console.log("get请求失败")
      wx.showToast({
        title: '获取数据失败，请重试',
        icon: "none",
        duration: 1500,
      })
    },
    complete: function(){
      wx.hideLoading();
    }
  })
}

// post请求
function request_post(Api_type, Api_data, do_fuction) {
  wx.request({
    url: Api_type,
    data: Api_data,
    method: "post",
    success: function (res) {
      if (typeof (do_fuction) == "function") {
        do_fuction(res);
      }
    },
    fail: function (res) {
      console.log("post请求失败")
    }
  })
}


module.exports = {
  formatTime: formatTime,
  request_get: request_get,
  request_put: request_put,
  request_get_over_time: request_get_over_time,
  request_post: request_post,
}