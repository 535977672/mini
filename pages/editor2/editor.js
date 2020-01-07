// pages/editor/editor.js

const app = getApp()

//引入公共文件
//require 暂时不支持绝对路径
var comm = require('../../comm/js/comm.js')
var that = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
      show: false,
      img1: ''
  },

  uploadimg: function (event) {
    wx.chooseImage({
      success(res) {
        const tempFilePaths = res.tempFilePaths

        const uploadTask = wx.uploadFile({
          url: comm.url + 'miniprogram/file',
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'id': 10
          },
          success(res) {
            var data = JSON.parse(res.data);
            console.log(data);
            that.setData({
              img1: data.url,
              show: true
            });

          }
        })

        uploadTask.onProgressUpdate((res) => {
          console.log('上传进度', res.progress)
          console.log('已经上传的数据长度', res.totalBytesSent)
          console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
        })

        //uploadTask.abort() // 取消上传任务
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      that = this;
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
    const query = wx.createSelectorQuery()
    var editors = query.select('#editors');
    console.log('editors');
    console.log(editors);
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