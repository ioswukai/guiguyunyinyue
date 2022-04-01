// pages/index/index.js
import request from '../../utils/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [], // 轮播图数据
    recommentList: [], //推荐歌单
    topList: [], //排行榜
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取banner数据
    this.getBannerData();
    // 获取推荐列表数据
    this.getRecommentData();
    // 获取排行榜数据
    this.getRankData();
  },

  // 获取banner数据
  async getBannerData() {
    const data = {type: 2};
    let bannerListData = await request('/banner', {data})
    this.setData({
      bannerList: bannerListData.banners
    })
  },

  // 获取推荐列表数据
  async getRecommentData() {
    const data = {limit: 10};
    let recommentListData = await request('/personalized', {data})
    this.setData({
      recommentList: recommentListData.result
    })
  },

  // 获取排行榜数据
  async getRankData() {
    let index = 0;
    let resultArr = [];
    while (index < 5) {
      const data = {idx: index++};
      let topListData = await request('/top/list', {data})
      let topListItem = {
        name: topListData.playlist.name, 
        tracks: topListData.playlist.tracks.slice(0, 3)
      }
      resultArr.push(topListItem)
      // 更新topList的值 这里好处是不需要5次请求全部请求完，再更新数据，用户体验好
      // 但是渲染的次数会多些
      this.setData({
        topList: resultArr
      })
    }

    // 放在此处更新 由于等待网络数据返回 会导致页面长时间白屏
    // // 更新topList的值
    // this.setData({
    //   topList: resultArr
    // })
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

  }
})