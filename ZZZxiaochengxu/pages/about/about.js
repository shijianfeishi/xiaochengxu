Page({
  data: {
    logs: []
  },
  onLoad: function () {
    
  },
  previewImage: function (e) {
    wx.previewImage({
      current: 'http://www.xishengwei.xyz/images/weixin.png', // 当前显示图片的http链接   
      urls: ['http://www.xishengwei.xyz/images/weixin.png'] // 需要预览的图片http链接列表   
    })
  },  
})