var network = require('../../../../utils/network.js');
var util = require('../../../../utils/util.js');
var requestUrl = require('../../../../config.js');
var app = getApp();

Page({
  data: {
    materialList: [{
      thumb_url: "http://mmbiz.qpic.cn/mmbiz_png/EtQBibotz0RYS0wfXJEnd0ibJfsAaLIVawpBX8iaHuC0czLAV2IBEJI8IAFZUS4zbGWFd5f6EuicbF6eaaeaic6kySg/0?wx_fmt=png",
      title:"B_B截屏-标题B_B截屏-标题B_B截屏-标题",
      digest: "B_B截屏-内容B_B截屏-内容B_B截屏-内容B_B截屏-内容B_B截屏-内容B_B截屏-内容B_B截屏-内容",
      url: "https://mp.weixin.qq.com/s?__biz=MzI1ODMwMzAxMw==&mid=100000027&idx=1&sn=773fe0246bf1fa5c7f5b261253d8f856&chksm=6a0b74515d7cfd47084983b1a6343501db1eeb735a5f070ca992a0fc90b49ecfd2294f67d896#rd"
    }, {
        thumb_url: "http://mmbiz.qpic.cn/mmbiz_png/EtQBibotz0RYS0wfXJEnd0ibJfsAaLIVawpBX8iaHuC0czLAV2IBEJI8IAFZUS4zbGWFd5f6EuicbF6eaaeaic6kySg/0?wx_fmt=png",
        title: "B_B截屏-标题",
        digest: "一定要放硬币吗？放一个重量形状都一致的圆片行不行？售货机是如何识别硬币的？你买的商品没货了，售货机怎么知道要",
        url: "https://mp.weixin.qq.com/s?__biz=MzI1ODMwMzAxMw==&mid=100000182&idx=1&sn=d6c10661fa8954cd217006e40029974e&chksm=6a0b74fc5d7cfdead4c662c296aa1f4fea539af8d6ebaa7b4f4d87869b4793f74f4c10bdc7b2#rd"
      }, {
        thumb_url: "http://mmbiz.qpic.cn/mmbiz_png/EtQBibotz0RYS0wfXJEnd0ibJfsAaLIVawpBX8iaHuC0czLAV2IBEJI8IAFZUS4zbGWFd5f6EuicbF6eaaeaic6kySg/0?wx_fmt=png",
        title: "B_B截屏-标题",
        digest: "B_B截屏-内容",
        url: "https://mp.weixin.qq.com/s?__biz=MzI1ODMwMzAxMw==&mid=100000182&idx=1&sn=d6c10661fa8954cd217006e40029974e&chksm=6a0b74fc5d7cfdead4c662c296aa1f4fea539af8d6ebaa7b4f4d87869b4793f74f4c10bdc7b2#rd"
      }, {
        thumb_url: "http://mmbiz.qpic.cn/mmbiz_png/EtQBibotz0RYS0wfXJEnd0ibJfsAaLIVawpBX8iaHuC0czLAV2IBEJI8IAFZUS4zbGWFd5f6EuicbF6eaaeaic6kySg/0?wx_fmt=png",
        title: "B_B截屏-标题",
        digest: "B_B截屏-内容",
        url: "https://mp.weixin.qq.com/s?__biz=MzI1ODMwMzAxMw==&mid=100000182&idx=1&sn=d6c10661fa8954cd217006e40029974e&chksm=6a0b74fc5d7cfdead4c662c296aa1f4fea539af8d6ebaa7b4f4d87869b4793f74f4c10bdc7b2#rd"
      }, {
        thumb_url: "http://mmbiz.qpic.cn/mmbiz_png/EtQBibotz0RYS0wfXJEnd0ibJfsAaLIVawpBX8iaHuC0czLAV2IBEJI8IAFZUS4zbGWFd5f6EuicbF6eaaeaic6kySg/0?wx_fmt=png",
        title: "B_B截屏-标题",
        digest: "B_B截屏-内容",
        url: "https://mp.weixin.qq.com/s?__biz=MzI1ODMwMzAxMw==&mid=100000182&idx=1&sn=d6c10661fa8954cd217006e40029974e&chksm=6a0b74fc5d7cfdead4c662c296aa1f4fea539af8d6ebaa7b4f4d87869b4793f74f4c10bdc7b2#rd"
      }, {
        thumb_url: "http://mmbiz.qpic.cn/mmbiz_png/EtQBibotz0RYS0wfXJEnd0ibJfsAaLIVawpBX8iaHuC0czLAV2IBEJI8IAFZUS4zbGWFd5f6EuicbF6eaaeaic6kySg/0?wx_fmt=png",
        title: "B_B截屏-标题",
        digest: "B_B截屏-内容",
        url: "https://mp.weixin.qq.com/s?__biz=MzI1ODMwMzAxMw==&mid=100000182&idx=1&sn=d6c10661fa8954cd217006e40029974e&chksm=6a0b74fc5d7cfdead4c662c296aa1f4fea539af8d6ebaa7b4f4d87869b4793f74f4c10bdc7b2#rd"
      }, {
        thumb_url: "http://mmbiz.qpic.cn/mmbiz_png/EtQBibotz0RYS0wfXJEnd0ibJfsAaLIVawpBX8iaHuC0czLAV2IBEJI8IAFZUS4zbGWFd5f6EuicbF6eaaeaic6kySg/0?wx_fmt=png",
        title: "B_B截屏-标题",
        digest: "B_B截屏-内容",
        url: "https://mp.weixin.qq.com/s?__biz=MzI1ODMwMzAxMw==&mid=100000182&idx=1&sn=d6c10661fa8954cd217006e40029974e&chksm=6a0b74fc5d7cfdead4c662c296aa1f4fea539af8d6ebaa7b4f4d87869b4793f74f4c10bdc7b2#rd"
      }]
  },
  onLoad: function(options) {
    console.log("WASDWASDWASDWASD");
  },
  onShow: function(res) {
    // this.batchGetMaterial();
  },
  onHide: function() {

  },
  onReady: function() {

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
    wx.navigateTo({
      url: "../../../other/information/wxPublicNumberInformation/informationDetails/index?materialDetailUrl=" + materialDetailUrl
    });
  }
});