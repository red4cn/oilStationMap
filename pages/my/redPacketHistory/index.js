var network = require('../../../utils/network.js');
var util = require('../../../utils/util.js');
var requestUrl = require('../../../config.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    size: 15,        //每页加载的条数，默认加载15条
    page: 1,        //当前加载的页数，默认加载第一页
    isShowMore: false,
    loading: false,
    isNoShowMore: true,
    allRedPacketMoneyTotal: 12.03,
    redPacketHistoryList: [{
      operator: "addOilStation",
      operatorName: "添加油站",
      redPacketTotal: "1",
      statusName: "已领取",
      status: "1",
      updateTime: "2018-10-30 10:30:59",
    }, {
        operator: "",
        operatorName: "添加油站",
        redPacketTotal: "1.51",
        statusName: "已领取",
        status: "1",
        updateTime: "2018-10-30 10:30:59",
      }, {
        operator: "updateOilStation",
        operatorName: "更新油站",
        redPacketTotal: "1.5",
        statusName: "待领取",
        status: "0",
        updateTime: "2018-10-30 10:30:59",
      }, {
        operator: "addOilStation",
        operatorName: "添加油站",
        redPacketTotal: "1",
        statusName: "已领取",
        status: "1",
        updateTime: "2018-10-30 10:30:59",
      }, {
        operator: "",
        operatorName: "添加油站",
        redPacketTotal: "1.51",
        statusName: "已领取",
        status: "1",
        updateTime: "2018-10-30 10:30:59",
      }, {
        operator: "updateOilStation",
        operatorName: "更新油站",
        redPacketTotal: "1.5",
        statusName: "待领取",
        status: "0",
        updateTime: "2018-10-30 10:30:59",
      }, {
        operator: "addOilStation",
        operatorName: "添加油站",
        redPacketTotal: "1",
        statusName: "已领取",
        status: "1",
        updateTime: "2018-10-30 10:30:59",
      }, {
        operator: "",
        operatorName: "添加油站",
        redPacketTotal: "1.51",
        statusName: "已领取",
        status: "1",
        updateTime: "2018-10-30 10:30:59",
      }, {
        operator: "updateOilStation",
        operatorName: "更新油站",
        redPacketTotal: "1.5",
        statusName: "待领取",
        status: "0",
        updateTime: "2018-10-30 10:30:59",
      }]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getRedPacketHistoryList();
  },
  /**
   * 获取历史红包列表
   */
  getRedPacketHistoryList: function () { 
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    //1.准备参数
    var that = this;
    var params = new Object();
    params.size = that.data.size;
    params.page = that.data.page;
    //2.发起请求
    network.POST({
        params: params,
        requestUrl: requestUrl.getRedPacketHistoryList,
        success: function (res) {
          wx.hideLoading();
          if (res.data.code == 0) {
            that.setData({
              allRedPacketMoneyTotal: res.data.allRedPacketMoneyTotal,
              redPacketHistoryList: res.data.data
            });
          } else {
            util.toast(res.data.message);
          }
        },
        fail: function (res) {
          wx.hideLoading();
          util.toast("网络异常, 请稍后再试");
        }
      });
  },
  /**
   * 领取或者提现加油站操作红包
   */
  cashOilStationOperatorRedPacket: function (e) {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    console.log("领取或者提现加油站操作红包");
    console.log(e);
    //1.准备参数
    var that = this;
    var params = new Object();
    params.id = e.currentTarget.dataset.id;
    params.operator = e.currentTarget.dataset.operator;
    //2.发起请求
    network.POST({
      params: params,
      requestUrl: requestUrl.cashOilStationOperatorRedPacket,
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 0) {
          that.getRedPacketHistoryList();      //刷新红包列表
        } else {
          util.toast(res.data.message);
        }
      },
      fail: function (res) {
        wx.hideLoading();
        util.toast("网络异常, 请稍后再试");
      }
    });
  }
})