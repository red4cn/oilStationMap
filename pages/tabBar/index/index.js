//获取应用实例
var network = require('../../../utils/network.js');
var util = require('../../../utils/util.js');
var requestUrl = require('../../../config.js');
const app = getApp();
Page({
  //【付款】页面中的基本数据
  data: {
    oilStationName: "",
    oilStationName_Temp: "",
    isShowPaying: false,
    isShowPaymentCodeImglist: false,
    paymentCodeImglist: ["http://www.91caihongwang.com/images/da_lu_tian_ba_jia_you_zhan/wx_payment.jpeg"],
    appreciateCodeImglist: ["http://www.91caihongwang.com/images/da_lu_tian_ba_jia_you_zhan/wx_appreciate.jpeg"],
    orText: "或",
    paymentBtn: "点击付款",
    paymentText: "查看您的付款记录",
    paymentCodeText: "点击码图，长按识别图中二维码进行付款",
    appreciateBtn: "点击打赏",
    appreciateText: "查看您的打赏记录",
    appreciateCodeText: "点击码图，长按识别图中二维码进行打赏",
    isIpx: app.globalData.isIpx,
    autoplay: false, //轮播是否自动播放
    canGetphone: false,
    swiperCurrent: 0, //当前轮播小圆点所在位置
    numbers: 60, //倒计时60秒
    isShowCode: true,
    isAgineShowCode: false,
    isNowShowCode: false,
    phoneNumber: '', //保存电话号码
    code: '',
    time: null,
    isHaveSpit: false,    //是否有小圆点
    isShowCreat: false,    // 是否展示创建
    isHavePhone: false,    //获取手机号验证码所有页面
    input1: '',  //获取手机号的input值
    input2: '',  //获取验证码的input值
    isCanSure: false,
    isDisable: true,
    isDisableCode: true,
    userPhone: '',     //需要带到手写页面的userPhone
    isCanGetPhone: true,//是否展示出获取手机号授权弹窗
    imageNoLoad: true,//二维码没有加载时的图片
    clickName: '-1',//要点击复制的文字
    hiddenPayModel: true,
    payMoney: "",
    payMoneyBtn: "appreciateBtn"
  },
  onLoad: function (options) {
    this.getOilStationByLonLat();
  },
  onShow: function () {

  },
  onPullDownRefresh: function () {    //下拉刷新,获取最新的付款码
    this.getOilStationByLonLat();
  },
  getOilStationByLonLat: function(){
    var that = this;
    wx.getLocation({   //原则上这边应该是直接走到fail的。但是为了防止刚开始没有昵称和头像权限，所有这里做了请求判断
      success: function (userLocaltion) {
        var params = new Object();
        params.uid = app.globalData.uid;
        params.lon = userLocaltion.longitude;
        params.lat = userLocaltion.latitude;
        // //融科资讯中心
        // params.lon = 116.322416;
        // params.lat = 39.973057;
        // //大路田坝加油站
        params.lon = 108.958280;
        params.lat = 28.122990;
        // //桃映火车站
        // params.lon = 109.021220;
        // params.lat = 27.860020;
        params.dis = 1;
        wx.showLoading({
          title: "客官请稍后...",
          mask: true
        });
        network.POST({
          params: params,
          requestUrl: requestUrl.getOilStationByLonLat,
          success: function (res) {
            wx.hideLoading();         //关闭进度条
            if (res.data.code != 0) {
              util.toast(res.data.message);
              return;
            }
            var isShowPaymentCodeImglist = false;
            var oilStationList = res.data.data;
            console.log(oilStationList);
            console.log("oilStationWxPaymentCodeImgUrl = " + oilStationList[0].oilStationWxPaymentCodeImgUrl);
            that.data.paymentCodeImglist = [];
            that.data.paymentCodeImglist.length = 0;
            that.data.paymentCodeImglist.push(oilStationList[0].oilStationWxPaymentCodeImgUrl);
            that.data.oilStationName = oilStationList[0].oilStationName;
            if (that.data.paymentCodeImglist.length > 0){
              isShowPaymentCodeImglist = true;
            }
            console.log("that.data.isShowPaymentCodeImglist = " + that.data.isShowPaymentCodeImglist);
            that.data.isShowPaymentCodeImglist = isShowPaymentCodeImglist;
            that.setData({
              isShowPaymentCodeImglist: that.data.isShowPaymentCodeImglist,
              paymentCodeImglist: that.data.paymentCodeImglist,
              oilStationName: that.data.oilStationName
            });
          },
          fail: function () {
            wx.hideLoading();
            console.log("that.data.isShowPaymentCodeImglist = " + that.data.isShowPaymentCodeImglist);
            util.toast("不好意思，您的网络出了一会小差...");
          }
        });
      },
      fail: function () {
        util.toast('获取位置信息失败...');
        this.getOilStationByLonLat();
      }
    });
  },
  //JS中响应事件的方法
  previewPaymentImage: function (e) {        //长按收款码图，对码图中的内容进行识别
    wx.previewImage({
      current: this.data.paymentCodeImglist, // 当前显示图片的http链接     
      urls: this.data.paymentCodeImglist, // 需要预览的图片http链接列表 
      success: function () {
        console.log("查看收款码图片成功...");
      },
      fail: function () {
        console.log("查看收款码图片失败...");
      }
    });
  },
  previewAppreciateImage: function (e) {        //长按打赏码图，对码图中的内容进行识别
    wx.previewImage({
      current: this.data.appreciateCodeImglist, // 当前显示图片的http链接     
      urls: this.data.appreciateCodeImglist, // 需要预览的图片http链接列表 
      success: function(){
        console.log("查看打赏码图片成功...");
      }, 
      fail: function () {
        console.log("查看打赏码图片失败...");
      }
    });
  },
  requestWxPayUnifiedOrder: function (e) {        //点击付款/打赏,想自己的服务器获取必要的参数
    //点击按钮痰喘指定的hiddenmodalput弹出框  
    var that = this;
    this.data.payMoney = "";
    this.data.payMoneyBtn = e.currentTarget.id;
    console.log("====================之前=====================");
    console.log("this.data.payMoneyBtn = " + this.data.payMoneyBtn);
    console.log("this.data.oilStationName = " + this.data.oilStationName);
    console.log("this.data.oilStationName_Temp = " + this.data.oilStationName_Temp);
    console.log(this.data.payMoneyBtn == "paymentBtn" && that.data.oilStationName == "");
    if (this.data.payMoneyBtn == "appreciateBtn") {
      that.data.oilStationName_Temp = that.data.oilStationName;
      that.data.oilStationName = "";
    } else if (this.data.payMoneyBtn == "paymentBtn" && that.data.oilStationName == "") {
      that.data.oilStationName = that.data.oilStationName_Temp;
      that.data.oilStationName_Temp = "";
    }
    console.log("====================之后=====================");
    console.log("this.data.payMoneyBtn = " + this.data.payMoneyBtn);
    console.log("this.data.oilStationName = " + this.data.oilStationName);
    console.log("this.data.oilStationName_Temp = " + this.data.oilStationName_Temp);
    console.log(this.data.payMoneyBtn == "paymentBtn" && that.data.oilStationName == "");
    this.setData({
      hiddenPayModel: !this.data.hiddenPayModel,
      payMoney: this.data.payMoney,
      payMoneyBtn: this.data.payMoneyBtn,
      oilStationName: that.data.oilStationName,
      oilStationName_Temp: that.data.oilStationName_Temp
    });
  },
  payMoneyInputFunc: function(e) {    // 获取金额
    this.data.payMoney = e.detail.value;
    this.setData({
      payMoney: this.data.payMoney
    });
  },
  //取消按钮  
  cancelPay: function () {
    this.setData({
      hiddenPayModel: true
    });
  },
  //确认  
  confirmPay: function () {
    var that = this;
    var reg = /^[0-9]+([.]{1}[0-9]{1,2})?$/;
    console.log("this.data.payMoney = " + this.data.payMoney + " , reg.test(this.data.payMoney) = " + reg.test(this.data.payMoney));
    if (this.data.payMoney.endsWith(".")){
      util.toast("支付金额不能以小数点结尾，请输入正确支付金额.");
    } else {
      if (!reg.test(this.data.payMoney)) {           //使用正则表达式进行校验
        util.toast("支付金额只能细化到【分】.");
      } else {
        if (this.data.payMoney == null && this.data.payMoney == undefined && this.data.payMoney == '') {
          if (this.data.payMoneyBtn == "appreciateBtn") {
            util.toast("客官，您还未输入打赏金额.");
          } else if (this.data.payMoneyBtn == "paymentBtn") {
            util.toast("客官，您还未输入油款金额.");
          } else {
            util.toast("客官，您还未输入打赏金额.");
          }
        } else {
          this.setData({
            hiddenPayModel: true
          });
          // return;
          console.log("使用统一订单的方式进行下订单，发起微信支付....");
          //注：付款码，固定为加油站的微信收款码
          var paymentCode = "wxp://f2f0807djYvTta5CR9rhvvGRw2rz0YWaSr1S";
          //显示付款中的遮罩
          that.data.isShowPaying = true;
          that.setData({
            isShowPaying: that.data.isShowPaying
          });
          // 开始获取获取openId和sessionKey  ||  可以使用用户登录系统进行获取openId
          wx.login({
            success: function (res) {
              var params = new Object();
              params.code = res.code;
              network.POST({
                params: params,
                requestUrl: requestUrl.getOpenIdAndSessionKeyForWX,
                success: function (res) {
                  if (res.data.code == 0) {  //登录成功，获取openId
                    var openId = res.data.data.openid;
                    params.openId = openId;
                    params.payMoney = that.data.payMoney;           //传输金额
                    params.payMoneyBtn = that.data.payMoneyBtn;           //按钮来源
                    console.log("在点击付款或者打赏中发起支付，先登录中获取： openId = " + res.data.data.openid + ", sessionKey = " + res.data.data.session_key);
                    //使用统一订单的方式进行下订单，发起微信支付
                    network.POST({
                      params: params,
                      requestUrl: requestUrl.requestWxPayUnifiedOrder,
                      success: function (res) {
                        //关闭付款中的遮罩
                        that.data.isShowPaying = false;
                        that.setData({
                          isShowPaying: that.data.isShowPaying
                        });
                        if (res.data.code == 0) {  //登录成功，获取openId
                          that.wxPayUnifiedOrder(res.data);
                        } else {                   //登录失败
                          wx.showModal({
                            title: '提示',
                            content: res.data.message,
                            showCancel: false
                          });
                        }
                      },
                      fail: function (res) {
                        that.data.isShowPaying = false;
                        that.setData({
                          isShowPaying: that.data.isShowPaying
                        });
                        util.toast("不好意思，您的网络出了一会小差...");
                      },
                      complete: function () {
                        that.data.isShowPaying = false;
                        that.setData({
                          isShowPaying: that.data.isShowPaying
                        });
                      }
                    });
                  } else {                   //登录失败
                    wx.showModal({
                      title: '提示',
                      content: res.data.message,
                      showCancel: false
                    });
                  }
                },
                fail: function (res) {
                  //关闭付款中的遮罩
                  that.data.isShowPaying = false;
                  that.setData({
                    isShowPaying: that.data.isShowPaying
                  });
                  util.toast("不好意思，您的网络出了一会小差...");
                },
                complete: function () {
                  //关闭付款中的遮罩
                  that.data.isShowPaying = false;
                  that.setData({
                    isShowPaying: that.data.isShowPaying
                  });
                }
              });
            }
          });
        }
      }
    }
  },
  wxPayUnifiedOrder: function (param) {        //点击付款/打赏，向微信服务器进行付款
    //使用小程序发起微信支付  
    wx.requestPayment({
      timeStamp: param.data.timeStamp,//记住，这边的timeStamp一定要是字符串类型的，不然会报错，我这边在java后端包装成了字符串类型了  
      nonceStr: param.data.nonceStr,
      package: param.data.package,
      signType: 'MD5',      //小程序发起微信支付，暂时只支持“MD5”
      paySign: param.data.paySign,
      success: function (event) {
        wx.showToast({              //支付成功
          title: '支付成功',
          icon: 'success',
          duration: 2000
        });
      },
      fail: function (error) {      //支付失败
        console.log("支付失败");
        console.log(error);
        wx.showModal({
          title: '提示',
          content: '支付失败.',
          showCancel: false
        });
      },
      complete: function () {       //不管支付成功或者失败之后都要处理的方法，类似与final
        console.log("pay complete");
      }
    });
  },
  swiperChange: function (e) {          // 获取当前轮播图片的下标
    this.setData({
      clickName: '',
      copyValue: '',
      swiperCurrent: e.detail.current
    })
  },
  scrollAction: function (e) {
  },
  onPageScroll: function (e) {
  },
  onHide: function () {
    this.dialog.hideDialog();
  }
})
