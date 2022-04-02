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
    
    const data = {id: navId}
    const videoListData = await request('/video/group',{data})
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
    this.setData({navId})
    // 获取导航对应视频列表数据
    this.getVideoListData(navId);
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