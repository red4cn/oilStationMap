//logs.js
var network = require('../../../utils/network.js')
const requestUrl = require('../../../config')
const util = require('../../../utils/util.js')

var app = getApp();
Page({
  data: {
    oilStationName: "大路田坝加油站",
    oilStationPriceList: [
      { oilModelLabel: '0', oilNameLabel: '柴油', oilPriceLabel: '5.46' },
      { oilModelLabel: '92', oilNameLabel: '汽油', oilPriceLabel: '6.36' },
      { oilModelLabel: '95', oilNameLabel: '汽油', oilPriceLabel: '7.09' }
    ]
  },
  
  onLoad:function(options) {
    this.getOilStation();
  },
  onShow: function (res) {
    //只要进入当前页面就对获取最新的油价信息，注：油价信息基本一天一换，更新
    // getOilStation();
  },
  onHide:function(){
    
  },
  onReady: function () {

  },
  getOilStation: function (e) {
    var that = this;
    wx.getLocation({   //原则上这边应该是直接走到fail的。但是为了防止刚开始没有昵称和头像权限，所有这里做了请求判断
      success: function (userLocaltion) {
        var params = new Object();
        params.uid = app.globalData.uid;
        params.lon = userLocaltion.longitude;
        params.lat = userLocaltion.latitude;
        params.dis = 2;
        wx.showLoading({
          title: "客官请稍后...",
          mask: true
        });
        network.POST({
          params: params,
          requestUrl: requestUrl.getOneOilStationByCondition,
          success: function (res) {
            wx.hideLoading();         //关闭进度条
            if (res.data.code != 0) {
              util.toast(res.data.message);
              return;
            }
            var oilStationList = JSON.parse(res.data.data.oilStationList);
            var oilStationPriceList = JSON.parse(oilStationList[0].oilStationPrice);
            that.data.oilStationPriceList = [];
            that.data.oilStationPriceList.length = 0;
            for (var item in oilStationPriceList) {
              that.data.oilStationPriceList.push(oilStationPriceList[item]);
            }
            console.log(that.data.oilStationPriceList);
            that.setData({
              oilStationName: res.data.data.oilStationName,
              oilStationPriceList: that.data.oilStationPriceList
            });
          },
          fail: function () {
            wx.hideLoading();
            util.toast("不好意思，您的网络出了一会小差...");
          }
        });
      }
    });
  },
  //在地图中寻找加油站
  findOilStationInMap: function () {
    console.log("开始准备跳转地图...");
    wx.navigateTo({
      url: "../../todayOilPrice/oilStationMap/index?paramNum=123456789"
    });
  },
  //下拉刷新获取最新数据
  onPullDownRefresh: function () {
    console.log("开始下拉刷新");
    this.getOilStation(true);
  }

})