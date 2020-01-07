//app.js
//App() 函数用来注册一个小程序。接受一个 Object 参数，其指定小程序的生命周期回调等。
//App() 必须在 app.js 中调用，必须调用且只能调用一次。不然会出现无法预期的后果。

var comm = require('comm/js/comm.js')
App({

  //1. 小程序初始化完成时触发，全局只触发一次。
  onLaunch: function () {
    // 展示本地存储能力
    //var logs = wx.getStorageSync('logs') || []
    //logs.unshift(Date.now())
    //wx.setStorageSync('logs', logs)
    try {
      var logs = wx.getStorageSync('logs') || []
      console.log(logs)
      logs.unshift(Date.now()) //加入数组1569206815958
      wx.setStorageSync('logs', logs)
    } catch (e) {
      // Do something when catch error
      console.log("error")
    }

    //2. work异步处理
    //一些异步处理的任务，可以放置于 Worker 中运行，待运行结束后，再把结果返回到小程序主线程。Worker 运行于一个单独的全局上下文与线程中，不能直接调用主线程的方法。
    //Worker 与主线程之间的数据传输，双方使用 Worker.postMessage() 来发送数据，Worker.onMessage() 来接收数据，传输的数据并不是直接共享，而是被复制的。
    //在主线程的代码 app.js 中初始化 Worker
    //创建一个 Worker 线程。目前限制最多只能创建一个 Worker，创建下一个 Worker 前请先调用 Worker.terminate
    var worker = wx.createWorker('workers/request/index.js') 
    // 文件名指定 worker 的入口文件路径，绝对路径
    worker.postMessage({
      msg: 'hello worker'
    })
    //workers/request/index.js
    //worker.onMessage(function(res){console.log("异步任务返回：" + res)})
    //结束当前 Worker 线程。仅限在主线程 worker 对象上调用。
    //worker.terminate()

    var that = this;
    //延时测试
    wx.request({
      url: comm.url + 'miniprogram/delay',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(111, res.data)
        that.globalData.delays = 1;
        if (that.userInfoReadyCallbacks) {
          //子页面写
          console.log('111_111')
          that.userInfoReadyCallbacks(res.data)
        }
      }
    })


    //3. 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        //用户登录凭证（有效期五分钟）。开发者需要在开发者服务器后台调用 auth.code2Session，使用 code 换取 openid 和 session_key 等信息
        console.log('wx.login返回信息')
        console.log(res) //{errMsg: "login:ok", code: "061ENHOk0tUgGs1vvhPk03koOk0ENHOb"}

        comm.requests('miniprogram/code', { code: res.code }, function (ress) {
          console.log('code返回信息')
          console.log(ress)
        })
      }
    })
    //检查登录态是否过期。
    wx.checkSession({
      success() {
        //session_key 未过期，并且在本生命周期一直有效
        console.log('已登录')
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        //wx.login()
      }
    })


    //4. 获取用户信息
    //获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限。
    wx.getSetting({
      //success(res) {}
      success: res => {
        console.log('授权结果')
        console.log(res.authSetting)  //用户授权结果
        // 属性
        // boolean scope.userInfo
        // 是否授权用户信息，对应接口 wx.getUserInfo

        // boolean scope.userLocation
        // 是否授权地理位置，对应接口 wx.getLocation, wx.chooseLocation

        // boolean scope.address
        // 是否授权通讯地址，对应接口 wx.chooseAddress

        // boolean scope.invoiceTitle
        // 是否授权发票抬头，对应接口 wx.chooseInvoiceTitle

        // boolean scope.invoice
        // 是否授权获取发票，对应接口 wx.chooseInvoice

        // boolean scope.werun
        // 是否授权微信运动步数，对应接口 wx.getWeRunData

        // boolean scope.record
        // 是否授权录音功能，对应接口 wx.startRecord

        // boolean scope.writePhotosAlbum
        // 是否授权保存到相册 wx.saveImageToPhotosAlbum, wx.saveVideoToPhotosAlbum

        // boolean scope.camera
        // 是否授权摄像头，对应[camera]((camera)) 组件

        //authSetting	AuthSetting	用户授权结果
        //scope.userInfo 是否授权用户信息，对应接口 wx.getUserInfo
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          //调用前需要 用户授权 scope.userInfo
          //wx.authorize 在调用需授权 API 之前，提前向用户发起授权请求
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              //用户信息对象，不包含 openid 等敏感信息
              this.globalData.userInfo = res.userInfo
              
              var userInfo = res.userInfo
              var nickName = userInfo.nickName
              var avatarUrl = userInfo.avatarUrl
              var gender = userInfo.gender //性别 0：未知、1：男、2：女
              var province = userInfo.province
              var city = userInfo.city
              var country = userInfo.country
              console.log(res)


              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                //子页面写
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
        if (!res.authSetting['scope.userInfo']) {
          //提前向用户发起授权请求。调用后会立刻弹窗询问用户是否同意授权小程序使用某项功能或获取用户的某些数据，但不会实际调用对应接口。如果用户之前已经同意授权，则不会出现弹窗，直接返回成功。
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              //wx.getUserInfo()
            },
            fail() {
              console.log('授权失败')
            }
          })
        }
      }
    })
  },


  onShow: function (options) {
    // 小程序启动，或从后台进入前台显示时
  },
  onHide: function () {
    // 小程序从前台进入后台时
  },
  onError: function (msg) {
    console.log(msg);//小程序发生脚本错误，或者 api 调用失败时触发，会带上错误信息
  },
  onPageNotFound: function (res){
    //小程序要打开的页面不存在时触发，会带上页面信息回调该函数
    wx.redirectTo({
      url: 'pages/index/index'
    }) // 如果是 tabbar 页面，请使用 wx.switchTab
  },
  globalData: {
    userInfo: null,
    delays: 0
  }
})