# 串接下田心村小程序
# 1.请将pages下除了homepage和qr之外 其他都拷贝到你们小程序对应的pages目录下
# 2.在你的小程序首页开两个button分别进入"pages/uav/uav"(无人机类)和"pages/sport/sport"(篮球类)
# 3.app.js里globalData全部加入
# 4.utils内court.wxs和request.js请拷贝到你的utils文件夹下
# 5.app.json里加入：  
"permission": {
    "scope.userLocation": {
      "desc": "你的位置信息将用于帮您找到最近的拍摄点"
    }
  },
  # 6.images文件和lib文件也需要拷贝