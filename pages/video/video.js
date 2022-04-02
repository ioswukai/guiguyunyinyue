// pages/video/video.js

import request from "../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [], // 导航的标签数据
    navId: 0, // 选中导航的标识
    videoList: [], // 导航对应的视频列表
    vid: null, // 前一个视频的id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取导航的标签数据
    this.getVideoGroupData();
  },

  /* 获取导航的标签数据 */
  async getVideoGroupData() {
    const videoGroupListData = await request('/video/group/list')
    this.setData({
      videoGroupList: videoGroupListData.data.slice(0, 14),
      navId: videoGroupListData.data[0].id
    })
    // 获取导航对应视频列表数据
    this.getVideoListData(videoGroupListData.data[0].id);
  },

  /* 获取导航对应视频列表数据 */
  async getVideoListData(navId) {
    if (!navId) return;
    
    // 显示加载框
    wx.showLoading({
      title: '正在加载',
    })
    const data = {id: navId}
    const videoListData = await request('/video/group',{data})
    // 隐藏加载框
    wx.hideLoading()
    const videoList = videoListData.datas.map((item, index) => {
      item.id = index
      return item;
    })
    this.setData({videoList})
  },

  /* 切换导航的回调 */
  changeNav(event) {
    // 通过`id`向`event`传参的时候如果传的是`number`**会自动转换成**`string`
    // const navId = event.currentTarget.id;
    // this.setData({
    //   navId: navId*1
    // })
    // 通过`data-key=value`向`event`传参的时候如果传的是`number`**它并不会自动转换成**`string`
    const navId = event.currentTarget.dataset.id;
    this.setData({
      navId,
      // 切换tab时，清空之前tab的显示
      videoList: [] 
    })
    // 获取导航对应视频列表数据
    this.getVideoListData(navId);
  },

  /* 开始/继续播放 */
  handlePlay(event) {
      /*
      问题： 多个视频同时播放的问题
    * 需求：
    *   1. 在点击播放的事件中需要找到上一个播放的视频
    *   2. 在播放新的视频之前关闭上一个正在播放的视频
    * 关键：
    *   1. 如何找到上一个视频的实例对象
    *   2. 如何确认点击播放的视频和正在播放的视频不是同一个视频
    * 单例模式：
    *   1. 需要创建多个对象的场景下，通过一个变量接收，始终保持只有一个对象，
    *   2. 节省内存空间
    * */

    let vid = event.currentTarget.id;
    if (this.data.vid) {
    // 存在之前的vid
    if (this.data.vid !== vid) {
      // 点击不同的视频，则关闭之前的视频
      this.videoContext.stop();
    } else {
      // 点击相同的视频，则是继续播放，下面逻辑无需处理
      return;
    }
  }
    // 创建 新的控制video标签的实例对象
    this.videoContext = wx.createVideoContext(vid);
    this.setData({
      vid
    })
    console.log(vid, videoContext, this.videoContext)
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
    // 获取导航对应视频列表数据
    this.getVideoListData(this.data.navId);
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

  }
})