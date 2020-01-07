// const util = require('../../../../util/util.js')

// const compareVersion = util.compareVersion

var comm = require('../../comm/js/comm.js')

Page({
  onShareAppMessage() {
    return {
      title: 'editor',
      path: 'pages/editor/editor'
    }
  },

  data: {
    formats: {},
    bottom: 0,
    readOnly: false,
    placeholder: '开始输入...',
  },
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  onLoad() {
    this.canUse = true
    //动态加载网络字体。文件地址需为下载类型。iOS 仅支持 https 格式文件地址。
    wx.loadFontFace({
      family: 'Pacifico',
      source: 'url("https://sungd.github.io/Pacifico.ttf")',
      success: console.log
    })
    //const {SDKVersion} = wx.getSystemInfoSync()

    // if (compareVersion(SDKVersion, '2.7.0') >= 0) {
    //   //
    // } else {
    //   this.canUse = false
    //   // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
    //   wx.showModal({
    //     title: '提示',
    //     content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
    //   })
    // }
  },

  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
    }).exec()
  },

  undo() {
    this.editorCtx.undo()
  },
  redo() {
    this.editorCtx.redo()
  },
  format(e) {
    if (!this.canUse) return
    const {name, value} = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)
  },

  onStatusChange(e) {
    const formats = e.detail
    this.setData({formats})
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success() {
        console.log('insert divider success')
      }
    })
  },
  clear() {
    this.editorCtx.clear({
      success() {
        console.log('clear success')
      }
    })
  },
  removeFormat() {
    this.editorCtx.removeFormat()
  },
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
  insertImage() {
    const that = this
    wx.chooseImage({
      count: 1,
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

            that.editorCtx.insertImage({
              src: data.url,
              //data 被序列化为 name=value;name1=value2 的格式挂在属性 data-custom 上
              //<img src="1976bd92.jpg" data-custom="id=abcd&amp;role=god">
              data: {
                id: 'abcd',
                role: 'god'
              },
              success() {
                console.log('insert image success')

                //获取内容
                that.editorCtx.getContents({
                  success(rees) {
                    console.log(rees)
                  }
                })
              }
            })
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
  }
})
