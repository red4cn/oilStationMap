/**
 * 油价地图
 */
var network = require('../../../utils/network.js')
const requestUrl = require('../../../config')
const util = require('../../../utils/util.js')
import NumberAnimate from '../../../utils/NumberAnimate.js'

var app = getApp();
Page({
  data: {
    redActivityFlag: false,
    oilStationName: "大路田坝加油站",
    oilStationPriceList: [{
        oilModelLabel: '0',
        oilNameLabel: '柴油',
        oilPriceLabel: '5.46'
      },
      {
        oilModelLabel: '92',
        oilNameLabel: '汽油',
        oilPriceLabel: '6.36'
      },
      {
        oilModelLabel: '95',
        oilNameLabel: '汽油',
        oilPriceLabel: '7.09'
      }
    ]
  },
  onLoad: function(options) {

  },
  onShow: function(res) {
    this.getOilStation();
  },
  onHide: function() {

  },
  onReady: function() {

  },
  getOilStation: function(e) {
    var that = this;
    wx.getLocation({ //原则上这边应该是直接走到fail的。但是为了防止刚开始没有昵称和头像权限，所有这里做了请求判断
      success: function(userLocaltion) {
        var params = new Object();
        params.uid = app.globalData.uid;
        params.lon = userLocaltion.longitude;
        params.lat = userLocaltion.latitude;
        params.dis = 2;
        wx.showLoading({
          title: "客官请稍后...",
          mask: true
        });
        //获取当前位置最近的一个加油站信息
        network.POST({
          params: params,
          requestUrl: requestUrl.getOneOilStationByCondition,
          success: function(res) {
            wx.hideLoading(); //关闭进度条
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
            wx.setStorageSync("showCurrentOilStation", oilStationList[0]);
          },
          fail: function() {
            wx.hideLoading();
            util.toast("不好意思，您的网络出了一会小差...");
          }
        });
      }
    });
    //获取活动相关信息
    var params = new Object();
    params.dicType = "redPacketActivity";
    params.dicCode = "gh_417c90af3488";
    network.POST({
      params: params,
      requestUrl: requestUrl.getRedActivityByCondition,
      success: function(res) {
        if (res.data.code == 0) {
          if (res.data.data) {
            var redActivityFlag = false;
            var currentTime = new Date();
            var startTime = new Date(res.data.data[0].startTime);
            var endTime = new Date(res.data.data[0].endTime);
            //本地存储,活动的开始时间和结束时间
            wx.setStorageSync("redActivityStartTime", startTime);
            wx.setStorageSync("redActivityEndTime", endTime);
            if (currentTime >= startTime && currentTime <= endTime) {
              redActivityFlag = true;
            } else {
              redActivityFlag = false;
            }
            that.setData({
              redActivityFlag: redActivityFlag
            });
            wx.setStorageSync("redActivityFlag", redActivityFlag);
          }
        }
      },
      fail: function() {
        wx.hideLoading();
        util.toast("不好意思，您的网络出了一会小差...");
      }
    });
  },
  //在地图中寻找加油站
  findOilStationInMap: function() {
    console.log("开始准备跳转地图...");
    wx.navigateTo({
      url: "../../other/oilStationMap/index"
    });
  },
  //下拉刷新获取最新数据
  onPullDownRefresh: function() {
    console.log("开始下拉刷新");
    this.getOilStation(true);
  },
  //纠正油价
  updateOilStation: function() {
    console.log("开始纠正油价");
    wx.navigateTo({
      url: "../../other/oilStationAdd/index?isShowCurrentOilStationFlag=true&title=纠正油价&returnPageUrl=/pages/tabBar/todayOilPrice/todayOilPrice"
    }); 
  },
  //查看红包活动
  checkRedActivity: function () {
    console.log("查看红包活动");
    wx.navigateTo({
      url: "../../other/activity/redActivity/index"
    });
  },
  //查看 资讯 页面
  checkInformationPage: function () {
    console.log("查看 资讯 页面");
    wx.navigateTo({
      url: "../../other/information/wxPublicNumberInformation/index"
    });
  },
  officialAccountLoadFuc: function (e) {
    console.log("加载公众号组件");
    console.log(e);
  }

})