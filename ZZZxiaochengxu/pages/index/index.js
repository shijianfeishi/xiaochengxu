//index.js
// 获取商品
var goodlist = require('./../../utils/goods.js');
//获取应用实例
const app = getApp();
var amapFile = require('./../../libs/amap-wx.js');
var markersData = {
  latitude: '',//纬度
  longitude: '',//经度
  key: "32fc9767d2cf2d6523d276fb1c5984d5"//申请的高德地图key
};

var ctx = null;
var timer1 = null;
var timer2 = null;
var factor = {
  speed: .02,  // 运动速度，值越小越慢
  t: 0    //  贝塞尔函数系数
};

var factor1 = {
  speed: .02,  // 运动速度，值越小越慢
  t: 0    //  贝塞尔函数系数
};

var texts = "666";

var colors = ['lightskyblue', 'lawngreen', 'greenyellow', 'orangered', 'turquoise', 'pink', 'plum']
var points = [{ x: 2, y: 4 }, { x: 20, y: 10 }, { x: 30, y: 40 }, { x: 30, y: 50 }, { x: 50, y: 70 }];
Page({
  data: {
    goodlist:[],
    cityname:'',
    motto: 'Hello World111',
    userInfo: {},
    //默认未获取地址
    hasLocation: false,
    isPopping: false,//是否已经弹出  
    animPlus: {},//旋转动画  
    animCollect: {},//item位移,透明度  
    animTranspond: {},//item位移,透明度  
    animInput: {},//item位移,透明度
    weather: [],
    navbar: ['热销', '精选', '干货'],
    currentTab: 0,
    section: [
      { name: '精选', id: '1001' }, { name: '黄金单身汉', id: '1032' },
      { name: '综艺', id: '1003' }, { name: '电视剧', id: '1004' },
      { name: '电影', id: '1005' }, { name: '少儿', id: '1021' }
    ],
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    count:1,
    arr:[1,2,3,4,5],
    imgUrls: [
      'http://www.xishengwei.xyz/images/banner1.png',
      'http://www.xishengwei.xyz/images/banner2s.png',
      'http://www.xishengwei.xyz/images/banner3.png',
      'http://www.xishengwei.xyz/images/banner4.png'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    circular:true,
    markers: [{
      iconPath: "/resources/others.png",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50
    }],
    polyline: [{
      points: [{
        longitude: 113.3245211,
        latitude: 23.10229
      }, {
        longitude: 113.324520,
        latitude: 23.21229
      }],
      color: "#FF0000DD",
      width: 2,
      dottedLine: true
    }],
    controls: [{
      id: 1,
      iconPath: '/resources/location.png',
      position: {
        left: 0,
        top: 300 - 50,
        width: 50,
        height: 50
      },
      clickable: true
    }]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: '', //仅为示例，并非真实的接口地址
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
      }
    })
    that.setData({
      goodlist: goodlist.list.list
    });
    // //调用应用实例的方法获取全局数据
    // app.getUserInfo(function (userInfo) {
    //   //更新数据
    //   that.setData({
    //     userInfo: userInfo
    //   })
    // })
    this.loadInfo();
    // 页面初始化 options为页面跳转所带来的参数
    wx.setNavigationBarTitle({
      title: options.title,
      success: function (res) {
        // success
      }
    })
    var that = this
    ctx = wx.createCanvasContext('canvas_ct')
    points.splice(0, points.length)
    factor1.t = 0;
    setTimeout(function () {
      timer1 = setInterval(function () {
        that.render([[{ x: 150, y: 140 }, { x: 30, y: 72 }, { x: 70, y: 20 }, { x: 150, y: 60 }]])
      }, 30)
    }, 1000)
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  render: function (data) {
    var that = this
    var p10 = data[0][0];   // 三阶贝塞尔曲线起点坐标值
    var p11 = data[0][1];   // 三阶贝塞尔曲线第一个控制点坐标值
    var p12 = data[0][2];   // 三阶贝塞尔曲线第二个控制点坐标值
    var p13 = data[0][3];   // 三阶贝塞尔曲线终点坐标值
    ctx.beginPath();
    points.splice(0, points.length)
    ctx.setLineWidth(1);
    ctx.setFillStyle(colors[Math.floor(Math.random() * 5)])
    var t = factor.t;
    ctx.setLineJoin('round')
    /*计算多项式系数 （下同）*/
    var cx1 = 3 * (p11.x - p10.x);
    var bx1 = 3 * (p12.x - p11.x) - cx1;
    var ax1 = p13.x - p10.x - cx1 - bx1;

    var cy1 = 3 * (p11.y - p10.y);
    var by1 = 3 * (p12.y - p11.y) - cy1;
    var ay1 = p13.y - p10.y - cy1 - by1;

    var xt1 = ax1 * (t * t * t) + bx1 * (t * t) + cx1 * t + p10.x;
    var yt1 = ay1 * (t * t * t) + by1 * (t * t) + cy1 * t + p10.y;
    points.push({ x: xt1, y: yt1 })
    factor.t += factor.speed;
    //  ctx.lineTo(xt1, yt1)

    for (var i = 0; i < points.length; i++) {

      ctx.arc(points[i].x, points[i].y, 2, 0, 2 * Math.PI)
    }


    // ctx.moveTo(150,60)
    // ctx.bezierCurveTo(230, 20, 270, 72, 150, 140)
    // ctx.moveTo(150,60)
    // ctx.bezierCurveTo(70, 20, 30, 72, 150, 140)
    ctx.fill();
    if (yt1 < 140) {
      ctx.draw(true)
    } else {
      ctx.draw()
    }


    if (factor.t > 1) {
      factor.t = 0
      timer2 = setInterval(function () {
        that.render2([[{ x: 150, y: 60 }, { x: 230, y: 20 }, { x: 270, y: 72 }, { x: 150, y: 140 }]])
      }, 30)
      clearInterval(timer1)
    }

  },


  render2: function (data) {
    var that = this
    var p20 = data[0][0];
    var p21 = data[0][1];
    var p22 = data[0][2];
    var p23 = data[0][3];
    points.splice(0, points.length)
    ctx.beginPath();
    ctx.setLineWidth(1);
    ctx.setLineJoin('red')
    ctx.setFillStyle(colors[Math.floor(Math.random() * 5)])
    var t = factor1.t;

    var cx2 = 3 * (p21.x - p20.x);
    var bx2 = 3 * (p22.x - p21.x) - cx2;
    var ax2 = p23.x - p20.x - cx2 - bx2;

    var cy2 = 3 * (p21.y - p20.y);
    var by2 = 3 * (p22.y - p21.y) - cy2;
    var ay2 = p23.y - p20.y - cy2 - by2;

    var xt2 = ax2 * (t * t * t) + bx2 * (t * t) + cx2 * t + p20.x;
    var yt2 = ay2 * (t * t * t) + by2 * (t * t) + cy2 * t + p20.y;

    points.push({ x: xt2, y: yt2 })
    factor1.t += factor1.speed;
    // ctx.lineTo(xt2, yt2)
    for (var i = 0; i < points.length; i++) {
      ctx.arc(points[i].x, points[i].y, 2, 0, 2 * Math.PI)

    }
    if (points[points.length - 1].y >= 140) {
      clearInterval(timer2)
      that.renderText()
      return;
    }


    // ctx.moveTo(150,60)
    // ctx.bezierCurveTo(230, 20, 270, 72, 150, 140)
    // ctx.moveTo(150,60)
    // ctx.bezierCurveTo(70, 20, 30, 72, 150, 140)
    ctx.fill();

    ctx.draw(true)

    if (factor1.t > 1) {
      // factor1.t = 0
      // clearInterval(timer2)
    }
  },

  renderText: function () {

    ctx.setFontSize(20)
    setTimeout(function () {
      ctx.setFillStyle(colors[Math.floor(Math.random() * 5)])
      ctx.fillText(texts.substring(0, 1), 120, 100)
      ctx.draw(true)
    }, 1000)

    setTimeout(function () {
      ctx.setFillStyle(colors[Math.floor(Math.random() * 5)])
      ctx.fillText(texts.substring(1, 2), 140, 100)
      ctx.draw(true)
    }, 2000)

    setTimeout(function () {
      ctx.setFillStyle(colors[Math.floor(Math.random() * 5)])
      ctx.fillText(texts.substring(2, 3), 160, 100)
      ctx.draw(true)
    }, 3000)

  },
  //点击弹出  
  plus: function () {
    if (this.data.isPopping) {
      //缩回动画  
      this.popp();
      this.setData({
        isPopping: false
      })
    } else if (!this.data.isPopping) {
      //弹出动画  
      this.takeback();
      this.setData({
        isPopping: true
      })
    }
  },
  input: function () {
    // console.log("input")
  },
  transpond: function () {
    // console.log("transpond")
  },
  collect: function () {
    // console.log("collect")
  },

  //弹出动画  
  popp: function () {
    //plus顺时针旋转  
    var animationPlus = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationcollect = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationTranspond = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationInput = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    animationPlus.rotateZ(180).step();
    animationcollect.translate(-50, -30).rotateZ(0).opacity(1).step();
    animationTranspond.translate(-80, 0).rotateZ(0).opacity(1).step();
    animationInput.translate(-50, 30).rotateZ(0).opacity(1).step();
    this.setData({
      animPlus: animationPlus.export(),
      animCollect: animationcollect.export(),
      animTranspond: animationTranspond.export(),
      animInput: animationInput.export(),
    })
  },
  //收回动画  
  takeback: function () {
    //plus逆时针旋转  
    var animationPlus = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationcollect = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationTranspond = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationInput = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    animationPlus.rotateZ(0).step();
    animationcollect.translate(0, 0).rotateZ(0).opacity(0).step();
    animationTranspond.translate(0, 0).rotateZ(0).opacity(0).step();
    animationInput.translate(0, 0).rotateZ(0).opacity(0).step();
    this.setData({
      animPlus: animationPlus.export(),
      animCollect: animationcollect.export(),
      animTranspond: animationTranspond.export(),
      animInput: animationInput.export(),
    })
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成  
  },
  onShow: function () {
    // 生命周期函数--监听页面显示  
  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏  
  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载  
  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作  
  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数  
  },
  onShareAppMessage: function () {
    // 用户点击右上角分享  
    return {
      title: 'title', // 分享标题  
      desc: 'desc', // 分享描述  
      path: 'path' // 分享路径  
    }
  },
  containerTap: function (res) {
    // console.log(res.touches[0]);
    var x = res.touches[0].pageX;
    var y = res.touches[0].pageY + 85;
    this.setData({
      rippleStyle: ''
    });
    this.setData({
      rippleStyle: 'top:' + y + 'px;left:' + x + 'px;-webkit-animation: ripple 0.4s linear;animation:ripple 0.4s linear;'
    });
  },
  //获取经纬度
  getLocation: function (e) {
    // console.log(e)
    var that = this
    wx.getLocation({
      success: function (res) {
        // success
        // console.log(res)
        that.loadInfo();
        that.setData({
          hasLocation: true,
          location: {
            longitude: res.longitude,
            latitude: res.latitude
          }
        })
      }
    })
  },
  //根据经纬度在地图上显示
  openLocation: function (e) {
    // console.log("openLocation" + e)
    var value = e.detail.value
    wx.openLocation({
      longitude: Number(value.longitude),
      latitude: Number(value.latitude)
    })
  },
  //选择位置位置
  chooseLocation: function (e) {
    // console.log(e)
    var that = this
    wx.chooseLocation({
      success: function (res) {
        // success
        // console.log(res)
        that.setData({
          hasLocation: true,
          location: {
            longitude: res.longitude,
            latitude: res.latitude
          }
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  //获取当前位置的经纬度
  loadInfo: function () {
    var that = this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude//维度
        var longitude = res.longitude//经度
        // console.log(res.address);
        that.loadCity(latitude, longitude);
      }
    })
  },
  //把当前位置的经纬度传给高德地图，调用高德API获取当前地理位置，天气情况等信息
  loadCity: function (latitude, longitude) {
    var that = this;
    var myAmapFun = new amapFile.AMapWX({ key: markersData.key });
    myAmapFun.getRegeo({
      location: '' + longitude + ',' + latitude + '',//location的格式为'经度,纬度'
      success: function (data) {
        var cityname = data[0].regeocodeData.addressComponent.city;
        that.setData({
          cityname: cityname
        })
        // console.log(that.data.cityname);
      },
      fail: function (info) { }
    });

    myAmapFun.getWeather({
      success: function (data) {
        that.setData({
          weather: data
        })
        // console.log(data);
        //成功回调
      },
      fail: function (info) {
        //失败回调
        // console.log(info)
      }
    })
  },
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
  tocity: function () {
    wx.navigateTo({
      url: './../city/index'//实际路径要写全
    })
  },
  takePhoto() {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath
        })
      }
    })
  },
  error(e) {
    // console.log(e.detail)
  },
  regionchange(e) {
    // console.log(e.type)
  },
  markertap(e) {
    // console.log(e.markerId)
  },
  controltap(e) {
    // console.log(e.controlId)
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  clickMe: function (e) {
    // console.log(new Date())
    // this.data.count = this.data.count + 1;
    // this.setData({ msg: this.data.count });
  },
  // onLoad: function () {
  //   if (app.globalData.userInfo) {
  //     this.setData({
  //       userInfo: app.globalData.userInfo,
  //       hasUserInfo: true
  //     })
  //   } else if (this.data.canIUse){
  //     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
  //     // 所以此处加入 callback 以防止这种情况
  //     app.userInfoReadyCallback = res => {
  //       this.setData({
  //         userInfo: res.userInfo,
  //         hasUserInfo: true
  //       })
  //     }
  //   } else {
  //     // 在没有 open-type=getUserInfo 版本的兼容处理
  //     wx.getUserInfo({
  //       success: res => {
  //         app.globalData.userInfo = res.userInfo
  //         this.setData({
  //           userInfo: res.userInfo,
  //           hasUserInfo: true
  //         })
  //       }
  //     })
  //   }
  // },
  getUserInfo: function(e) {
    // console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
    }
    return {
      title: '自定义转发标题',
      path: '/page/user?id=123',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },// 跳转到详情页
  todetail: function (e) {
    var id = e.currentTarget.dataset.idx;
    wx.navigateTo({
      url: './../goodsdetail/goodsdetail?id=' + id
    })
  },
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '广州禧晟味食品有限公司',
      path: '/pages/index/index',
      imageUrl: 'http://www.xishengwei.xyz/images/dian1.png',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})
