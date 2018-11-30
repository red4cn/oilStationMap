var network = require('../../../../utils/network.js');
var util = require('../../../../utils/util.js');
var requestUrl = require('../../../../config.js');
var app = getApp();

Page({
  data: {
    materialList: [{
      thumb_url: "http://mmbiz.qpic.cn/mmbiz/EtQBibotz0RbdiayWFEJjuEECibYRG8EzXXM9Bph5ZUXZrlWDV0rKaCngbbur4cIqnGJM2acISVrhXAwQibuebVG2g/0?wx_fmt=jpeg",
      title:"个体工商户注册流程（本人亲测）",
      digest: "很多人都不知道怎么办理营业执照的过程和所需要什么材料，再加上当地政府办事效率又差的要死同时每次你问他",
      url: "http://mp.weixin.qq.com/s?__biz=MzI1ODMwMzAxMw==&mid=100000102&idx=1&sn=75a869e9c06ca9f9572314bfdd7757c0&chksm=6a0b742c5d7cfd3a538384e594258c5877fa4bcc0d725514e4ede3ff2cfb9a6b056b50f5eeaf#rd"
    }, {
        thumb_url: "http://mmbiz.qpic.cn/mmbiz/EtQBibotz0RbGd2jUiamNJgsuudXSuLjDLuBsI9wUAZojgnZSIlTGo1m4icITmKQ3FDWR2Zu9EG7sPib307nQKqLLw/0?wx_fmt=jpeg",
        title: "便利店黑科技标配-自动售货机",
        digest: "一定要放硬币吗？放一个重量形状都一致的圆片行不行？售货机是如何识别硬币的？你买的商品没货了，售货机怎么知道要",
        url: "http://mp.weixin.qq.com/s?__biz=MzI1ODMwMzAxMw==&mid=100000041&idx=1&sn=768057ac05dbd2737ad54fd90ec1f6e7&chksm=6a0b74635d7cfd759bcca5ca7d46a0697eb487788168cc1dc1a4813ef4f40f13a4bf7c768e18#rd"
      }, {
        thumb_url: "http://mmbiz.qpic.cn/mmbiz/EtQBibotz0RbVib9v44HVmQtFicAhH8I8AV20icdUQjibSmGKuJUic57jKXml8q0icGRqa29YADiadhM3Zj0WsPC6gaXPA/0?wx_fmt=png",
        title: "扫描二维码获取WiFi密码，即可免费连WiFi",
        digest: "扫描二维码获取WiFi密码，即可免费连WiFi",
        url: "http://mp.weixin.qq.com/s?__biz=MzI1ODMwMzAxMw==&mid=100000027&idx=1&sn=773fe0246bf1fa5c7f5b261253d8f856&chksm=6a0b74515d7cfd47084983b1a6343501db1eeb735a5f070ca992a0fc90b49ecfd2294f67d896#rd"
      }]
  },
  onLoad: function (options) {
    
  },
  onShow: function(res) {
    this.batchGetMaterial();
  },
  onHide: function () {

  },
  onReady: function() {

  },
  //下拉刷新获取最新数据
  onPullDownRefresh: function () {
    console.log("开始下拉刷新");
    this.batchGetMaterial();
  },
  /**
   * 批量获取 微信公众号图文文章
   */
  batchGetMaterial: function(e) {
    var that = this;
    var params = {};
    params.mediaType = "NEWS";
    network.POST({
      params: params,
      requestUrl: requestUrl.batchGetMaterial,
      success: function(res) {
        wx.hideLoading(); //关闭进度条
        if (res.data.code != 0) {
          util.toast(res.data.message);
          return;
        }
        var materialList = JSON.parse(res.data.data.materialList);
        console.log(materialList);
        that.setData({
          materialList: materialList
        });
      },
      fail: function() {
        wx.hideLoading();
        util.toast("不好意思，您的网络出了一会小差...");
      }
    });
  },
  /**
   * 跳转到素材详情
   */
  showMaterialDetail: function(e){
    console.log(e);
    var materialDetailUrl = e.currentTarget.dataset.url;
    wx.setStorageSync("materialDetailUrl", materialDetailUrl);
    wx.navigateTo({
      url: "../../../other/information/wxPublicNumberInformation/informationDetails/index"
    });
  }
});