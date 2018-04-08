// 获取商品
var goodlist = require('./../../utils/goods.js');
Page({
  data: {
    goodlist: '',
    gooddetail: '',
    id:''
  },

  onLoad: function (option) {
    var that = this;
    that.setData({
      goodlist: goodlist,
      id: option.id
    });
    console.log(that.data.id)
    var list = that.data.goodlist.list.list;
    for(var i = 0; i < list.length; i++){
      if (option.id == list[i].goodid){
        that.setData({
          gooddetail: list[i]
        });
      }
    }
  },

  onShow: function () {
  },
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: that.data.gooddetail.goodname,
      path: '/pages/goodsdetail/goodsdetail?id='+that.data.id,
      imageUrl: that.data.gooddetail.goodurl,
      success: function (res) {
        console.log(that.data.id)
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})