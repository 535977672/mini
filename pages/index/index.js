//index.js
//获取应用实例 
//getApp(Object)全局的 getApp() 函数可以用来获取到小程序 App 实例。
const app = getApp()

//引入公共文件
//require 暂时不支持绝对路径
var comm = require('../../comm/js/comm.js')

//html 在使用的View中引入WxParse模块
var WxParse = require('../../pulgs/wxParse/wxParse.js');


//Page(Object) 函数用来注册一个页面。接受一个 Object 类型参数，
//其指定页面的初始数据、生命周期回调、事件处理函数等。
//Object 内容在页面加载时会进行一次深拷贝，需考虑数据大小对页面加载的开销
Page({
  data: {
    show: false,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'), //判断小程序的API，回调，参数，组件等是否在当前版本可用
    delays: app.globalData.delays,
    html: '<p style="color:red;">html</p><p>html</p><img src="https://gw.alicdn.com/imgextra/i3/636866/O1CN011dD4Xa20afwodONSn_!!636866-0-lubanu.jpg" width="100%">',
    addcomponent_show: false
  },
  
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  addcomponent: function () {
    this.setData({
      addcomponent_show: !this.data.addcomponent_show
    })
  },

  //1. 生命周期回调—监听页面加载
  //页面加载时触发。一个页面只会调用一次，可以在 onLoad 的参数中获取打开当前页面路径中的参数。
  onLoad: function (query) {
    console.log(query)//打开当前页面路径中的参数
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    var that = this;
    console.log(222);
    if (!app.globalData.delays){
      app.userInfoReadyCallbacks = res => {
        console.log('222_222', res);
        console.log(app.globalData.delays);
        console.log(that.data.delays);
        that.setData({
          delays: 1
        })
        console.log(that.data.delays);
        app.globalData.delays = 1;
      }
    }

    /**
      * WxParse.wxParse(bindName , type, data, target,imagePadding)
      * 1.bindName绑定的数据名(必填)
      * 2.type可以为html或者md(必填)
      * 3.data为传入的具体数据(必填)
      * 4.target为Page对象,一般为this(必填)
      * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
      */
    WxParse.wxParse('mytext', 'html', that.data.html, that, 5);

    //showLoading不能阻止页面渲染
    wx.showLoading({
      title: '加载中',
      mask:true //是否显示透明蒙层，防止触摸穿透
    });
    wx.request({
      url: comm.url + 'miniprogram/delay2',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          motto: res.data.msg,
          show: true //显示页面
        })

        wx.hideLoading();
      }
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  
  //3. 页面初次渲染完成时触发
  onReady: function () {
    // Do something when page ready.
    console.log("页面初次渲染完成")

    //setData 函数用于将数据从逻辑层发送到视图层（异步），同时改变对应的 this.data 的值（同步）。
    this.setData({
      motto: '你好'
    })
  },

  //2. 页面显示/切入前台时触发。
  onShow: function () {
    // Do something when page show.
    console.log("页面显示/切入前台")

    console.log(this.route) //到当前页面的路径

    //函数用于获取当前页面栈的实例，以数组形式按栈的顺序给出，第一个元素为首页，最后一个元素为当前页面。
    var p = getCurrentPages()
    console.log(p)

    //模块js
    comm.show1("模块1");
    comm.show1("模块2");
  },

  //4. 页面隐藏/切入后台时触发。 如 wx.navigateTo 或底部 tab 切换到其他页面，小程序切入后台等
  onHide: function () {
    // Do something when page hide.
    console.log("页面隐藏/切入后台")
  },
  
  //5. 页面卸载时触发。如wx.redirectTo或wx.navigateBack到其他页面时。
  onUnload: function () {
    // Do something when page close.
    console.log("页面卸载")
  },

  //6. 监听用户下拉刷新事件
  onPullDownRefresh: function () {
    // Do something when pull down.
    //当处理完数据刷新后，wx.stopPullDownRefresh可以停止当前页面的下拉刷新。
    console.log("下拉刷新")
    wx.stopPullDownRefresh();
  },

  //7. 监听用户上拉触底事件
  onReachBottom: function () {
    // Do something when page reach bottom.
    console.log("到底了！")
  },

  //8. 监听用户点击页面内转发按钮（button 组件 open-type="share"）或右上角菜单“转发”按钮的行为，并自定义转发内容。
  onShareAppMessage: function () {
    // return custom share data when user share.
    console.log("点击页面内转发")
  },

  //监听用户滑动页面事件
  onPageScroll: function (res) {
    // Do something when page scroll
    console.log("滑动页面")
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '转发了',
      path: '/pages/index/index'
    }
  },

  //点击 tab 时触发
  onTabItemTap(item) {
    console.log("点击 tab")
    console.log(item.index) //被点击tabItem的序号，从0开始
    console.log(item.pagePath) //被点击tabItem的页面路径
    console.log(item.text) //被点击tabItem的按钮文字
  },

  //组件事件处理函数
  //Page 中还可以定义组件事件处理函数。在渲染层的组件中加入事件绑定，当事件被触发时，就会执行 Page 中定义的事件处理函数。
  //bindtap="viewTap"
  viewTap:function(e){
    console.log('点了我')
    console.log(e)
    wx.request({
      url: comm.url + 'miniprogram/index',
      data: {
        page: 1,
        limit: 30
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
      }
    })
  },

  //组件绑定事件
  mycomponentclick:function(e){
      console.log(e.detail);
  }
  
})
