function show1(msg){
  console.log("show1" + msg)
}

function show2(msg) {
  console.log("show2" + msg)
}

var url = 'http://test.pcnfc.com/index/'

function requests(path, data = {}, callback = null, method = 'POST') {
  wx.request({
    url: url + path,
    data: data,
    method: method,
    header: {
      'content-type': 'application/json' // 默认值
    },
    success(res) {
      if (callback)
        callback(res.data)
    }
  })
}

module.exports.show1 = show1
module.exports.show1 = show2
module.exports.url = url
module.exports.requests = requests