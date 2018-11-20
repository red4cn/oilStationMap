var network = require('../../../../utils/network.js');
var util = require('../../../../utils/util.js');
var requestUrl = require('../../../../config.js');
var app = getApp();
Page({
  data: {
    distanceStart: false, //距离结束和距离开始的时间的展示与隐藏 为true距离开始显示为false距离结束显示
    isStartActivity: true, //判断活动是否开始，true为活动已经开始
    isEndActivity: false, //判断活动是isAgainShowSingisAgainShowSing否结束，true为活动已经结束
    day: 1, //倒计时时间
    hour: 2,
    min: 3,
    ms: 4
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  onShow: function() {
    var that = this;
    that.getRedActivityInfo();
    that.setData({
      setTime: setInterval(function() {
        that.countTime();
      }, 1000)
    })
  },
  onHide: function() {

  },
  //计算倒数时间
  countTime: function() {
    var that = this;
    var day = 0;
    var hour = 0;
    var min = 0;
    var ms = 0;
    var redActivityFlag = false;
    var currentTime = new Date();
    var startTime = wx.getStorageSync("redActivityStartTime");
    var endTime = wx.getStorageSync("redActivityEndTime");
    // console.log("startTime = " + startTime + " , endTime = " + endTime);
    if (!util.isNull(startTime) && !util.isNull(endTime)) {
      startTime = new Date(startTime);
      endTime = new Date(endTime);
      if (currentTime >= startTime && currentTime <= endTime) {
        redActivityFlag = true;
        var leftTime = endTime.getTime() - currentTime.getTime();
        if (leftTime && leftTime >= 0) {
          day = Math.floor(leftTime / 1000 / 60 / 60 / 24);
          hour = Math.floor(leftTime / 1000 / 60 / 60 % 24);
          min = Math.floor(leftTime / 1000 / 60 % 60);
          ms = Math.floor(leftTime / 1000 % 60);
          if (day < 10) {
            day = "0" + day;
          }
          if (hour < 10) {
            hour = "0" + hour;
          }
          if (min < 10) {
            min = "0" + min;
          }
          if (ms < 10) {
            ms = "0" + ms;
          }
        }
        // console.log("day = " + day + 
        // " , hour = " + hour + 
        // " , min = " + min + 
        // " , ms = " + ms);
      } else {
        day = 0;
        hour = 0;
        min = 0;
        ms = 0;
        redActivityFlag = false;
      }
      that.setData({
        day: day,
        hour: hour,
        min: min,
        ms: ms,
        redActivityFlag: redActivityFlag
      });
      wx.setStorageSync("redActivityFlag", redActivityFlag);
    } else {
      this.getRedActivityInfo();
    }
  },
  //获取活动相关信息
  getRedActivityInfo: function() {
    var that = this;
    var params = new Object();
    params.dicType = "redPacketActivity";
    params.dicCode = "gh_417c90af3488";
    network.POST({
      params: params,
      requestUrl: requestUrl.getRedActivityByCondition,
      success: function(res) {
        if (res.data.code == 0) {
          if (res.data.data) {
            var day = 0;
            var hour = 0;
            var min = 0;
            var ms = 0;
            var redActivityFlag = false;
            var currentTime = new Date();
            var startTime = new Date(res.data.data[0].startTime);
            var endTime = new Date(res.data.data[0].endTime);
            //本地存储,活动的开始时间和结束时间
            wx.setStorageSync("redActivityStartTime", startTime);
            wx.setStorageSync("redActivityEndTime", endTime);
            if (currentTime >= startTime && startTime <= endTime) {
              redActivityFlag = true;
              var leftTime = endTime.getTime() - currentTime.getTime();
              if (leftTime && leftTime >= 0) {
                day = Math.floor(leftTime / 1000 / 60 / 60 / 24);
                hour = Math.floor(leftTime / 1000 / 60 / 60 % 24);
                min = Math.floor(leftTime / 1000 / 60 % 60);
                ms = Math.floor(leftTime / 1000 % 60);
                if (day < 10) {
                  day = "0" + day;
                }
                if (hour < 10) {
                  hour = "0" + hour;
                }
                if (min < 10) {
                  min = "0" + min;
                }
                if (ms < 10) {
                  ms = "0" + ms;
                }
              }
            } else {
              day = 0;
              hour = 0;
              min = 0;
              ms = 0;
              redActivityFlag = false;
            }
            that.setData({
              day: day,
              hour: hour,
              min: min,
              ms: ms,
              redActivityFlag: redActivityFlag
            });
            wx.setStorageSync("redActivityFlag", redActivityFlag);
          }
        } else {
          util.toast("不好意思，您的网络出了一会小差...");
        }
      },
      fail: function() {
        util.toast("不好意思，您的网络出了一会小差...");
      }
    });
  },
  //查看红包活动
  checkRedActivityRule: function () {
    console.log("查看红包活动");
    wx.navigateTo({
      url: "../../my/activity/redActivity/redActivityRule/index"
    });
  }
})