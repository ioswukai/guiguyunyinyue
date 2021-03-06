// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null,
    // 初始化自定义的app实例数据
    isMusicPlay: false, // 是否有音乐在播放
    musicId: '' // 音乐id
  }
})

Object.assign(global, {
  Array : Array,
  Date : Date,
  Error : Error,
  Function : Function,
  Math : Math,
  Object : Object,
  RegExp : RegExp,
  String : String,
  TypeError : TypeError,
  setTimeout : setTimeout,
  clearTimeout : clearTimeout,
  setInterval : setInterval,
  clearInterval : clearInterval
});
