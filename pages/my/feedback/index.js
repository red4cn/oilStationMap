// pages/feedback/index.js
var util = require('../../../utils/util.js');
var network = require('../../../utils/network.js')
const requestUrl = require('../../../config')
Page({
  updateCountRecord:function(e) {
    this.setData({
      numberCount:e.detail.cursor,
      buttonStatus:e.detail.cursor==0? true: false,
      textAreaValue:e.detail.value
    });
  },
  bindFormSubmit:function(e) {


    // wx.scanCode({
    //   success:function(res) {
    //     var obj = decodeURIComponent(res);
    //     var d = JSON.stringify(obj)
    //     console.log(e);
    //   },
    //   fail:function(res) {
    //     console.log(1111);
    //   }
    // })

    // return;
    if(!this.data.textAreaValue || this.data.textAreaValue == "") {
      return;
    }
    var that = this;
    wx.showLoading({
      mask:true
    })
    var params = new Object()
    params.comments = this.data.textAreaValue;
    network.POST(
      {
      params:params,
      requestUrl:requestUrl.feedBackUrl,
      success: function (res) {
        wx.hideLoading();
        if(res.data.code != 0) {
          util.toast(res.data.message);
          return;
        }
        util.toast("您的意见已经提交成功！非常感谢！");
        that.resetView();
      },
      fail:function(res) {
        wx.hideLoading();
        util.toast("不好意思，您的网络出了一会小差...");
      },
    })
  },
  resetView:function() {
    this.setData({
      textAreaValue:null,
      buttonStatus:true,
      numberCount:0
      
    })
  },
  // textBlur:function(e) {
  //   this.setData({
  //     textAreaValue:e.detail.value
  //   })
  // },
  /**
   * 页面的初始数据
   */
  data: {
    numberCount:0,
    buttonStatus:true,
    textAreaValue:null
  },
})