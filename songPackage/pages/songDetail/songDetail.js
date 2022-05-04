import PubSub from 'pubsub-js';
import dayjs from 'dayjs';
import request from '../../../utils/request'
// 获取全局实例
const appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, // 标识音乐是否播放
    song: {}, // 歌曲详情对象
    musicLink: '', // 音乐的链接
    currentTime: '00:00', // 当前播放时长
    durationTime: '00:00', // 总时长
    currentWidth: 0, // 实时进度条的宽度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options: 用于接收路由跳转的query参数
    // 原生小程序中路由传参，对参数的长度有限制，如果参数长度过长会自动截取掉
    // console.log(JSON.parse(options.songPackage));
    
    let musicId = options.musicId;
    // 获取音乐详情信息 并自动播放当前的音乐
    this.getMusicInfo(musicId);

     /*
    * 问题： 如果用户操作系统的控制音乐播放/暂停的按钮，页面不知道，导致页面显示是否播放的状态和真实的音乐播放状态不一致
    * 解决方案：
    *   1. 通过控制音频的实例 backgroundAudioManager 去监视音乐播放/暂停
    *
    * */
    // 判断当前页面音乐是否在播放
    if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId){
      // 修改当前页面音乐播放状态为true
      this.setData({
        isPlay: true
      })
    }
    
    this.backgroundAudioManager = wx.getBackgroundAudioManager();
    // 监视音乐播放/暂停/停止（退出播放）/进度更新/自然播放结束
    this.backgroundAudioManager.onPlay(() => {
      this.changePlayState(true);
      // 修改全局音乐播放的id
      appInstance.globalData.musicId = musicId;
    });
    this.backgroundAudioManager.onPause(() => {
      this.changePlayState(false);
    });
    this.backgroundAudioManager.onStop(() => {
      this.changePlayState(false);
    });
    this.backgroundAudioManager.onTimeUpdate(() => {
      // console.log('当前音乐的总时间长' + this.backgroundAudioManager.duration);
      // console.log('当前音乐的播放时间' + this.backgroundAudioManager.currentTime);
      let currentTime = dayjs(this.backgroundAudioManager.currentTime * 1000).format('mm:ss')
      let currentWidth = 450 * (this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration)
      this.setData({
        currentTime,
        currentWidth,
      });
    });
    this.backgroundAudioManager.onEnded(() => {
      // 自动切换至下一首音乐，且自动播放
      this.handleSwitch({currentTarget: {id: 'next'}});
       
      // 将实时进度条长度、时间都置0
      this.setData({
        currentWidth: 0,
        currentTime: '00:00',
      });
    });
  },

  // 修改播放状态的功能函数
  changePlayState(isPlay){
    // 修改音乐是否的状态
    this.setData({
      isPlay
    })
    // 修改全局音乐播放的状态
    appInstance.globalData.isMusicPlay = isPlay;
  },

  // 获取音乐详情信息 并自动播放当前的音乐 的功能函数，    
  async getMusicInfo(musicId){
    let data = {ids: musicId} 
    let songData = await request('/song/detail', {data});
    let song = songData.songs[0];
    // dt 单位是毫秒
    let durationTime = dayjs(song.dt).format('mm:ss')
    this.setData({
      song,
      durationTime,
    })
    
    // 动态修改窗口标题
    wx.setNavigationBarTitle({
      title: this.data.song.name
    })
    
    // 自动播放
    this.musicControl(true, true);
  },    

  /** 点击播放/暂停的回调 */
  handleMusicPlay() {
    let isPlay = !this.data.isPlay;
    // 修改播放状态
    this.setData({
      isPlay
    })
    this.musicControl(isPlay) 
  },
  
  /* 控制音乐播放、暂停的功能函数 */
  async musicControl(isPlay, isSwitch) {
    if (isPlay) {
      // 音乐播放
      if (!this.data.musicLink || isSwitch) {
        // 无播放链接或切换 获取音乐播放的链接
        let data = {id: this.data.song.id}
        let musicLinkData = await request('/song/url', {data})
        let musicLink = musicLinkData.data[0].url;
        this.setData({
          musicLink
        })
      } 
      
      // 创建控制音乐播放的实例
      this.backgroundAudioManager.src = this.data.musicLink;
      this.backgroundAudioManager.title = this.data.song.name;
    } else {
      // 暂停音乐
      this.backgroundAudioManager.pause();
    }
  },

    // 点击切歌的回调
    handleSwitch(event){
      // 获取切歌的类型
      let type = event.currentTarget.id;
      
      // 关闭当前播放的音乐
      this.backgroundAudioManager.stop();
      // 订阅来自recommendSong页面发布的musicId消息
      PubSub.subscribe('musicId', (msg, musicId) => {
        // console.log(musicId);
        
        // 获取音乐详情信息 并自动播放当前的音乐
        this.getMusicInfo(musicId);
        // 取消订阅 否则会出现反复订阅
        PubSub.unsubscribe('musicId');
      })
      // 发布消息数据给recommendSong页面
      PubSub.publish('switchType', type)
    },
    handleTouchStart(event){
      // 获取手指起始坐标
      let moveX = event.touches[0].pageX;
      // console.log(moveX)
      if (moveX < 0) {
        moveX = 0;
      } else if (moveX > 450) {
        moveX = 450
      }
      // 跳转到指定位置
      this.backgroundAudioManager.seek(this.backgroundAudioManager.duration * (moveX/ 450));
    },
    handleTouchMove(event){
      let moveX = event.touches[0].pageX;
      // console.log(moveX)
      if (moveX < 0) {
        moveX = 0;
      } else if (moveX > 450) {
        moveX = 450
      }
      // 跳转到指定位置
      this.backgroundAudioManager.seek(this.backgroundAudioManager.duration * (moveX/ 450));
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
    PubSub.unsubscribe('musicId')
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