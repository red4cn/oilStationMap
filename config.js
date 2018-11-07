/**
 * 小程序配置文件,主要是网络请求地址配置,如有网络请求，请将url在这里配置,使用的时候在.js中引入：
 * const requestUrl = require('../../../../config').getSession
 */

// var host = "http://127.0.0.1:8080/oilStationMap";                //本地

// var host = "http://172.30.5.91:8080/oilStationMap";               //公司

// var host = "http://172.20.10.2:8080/oilStationMap";               //家里

// var host = "http://10.211.55.12:8080/oilStationMap";               //虚拟机

var host = "https://www.91caihongwang.com/oilStationMap";      //线上

var config = {
    host,
    //首页
    paymentHtml_bak: `${host}/payment.html`,
    paymentHtml: `https://www.91caihongwang.com/oilStationMap/wx_Pay/getToOauthUrl.do`,
    //通用
    checkSession: `${host}/user/checkSession.do`,                                            //检测session是否过期
    wxAppLoginUrl: `${host}/user/login.do`,                                                  //检测登录
    sendTemplateMessageUrl: `${host}/common/sendTemplateMessage.do`,                                //发送模板消息
    getOpenIdAndSessionKeyForWX: `${host}/common/getOpenIdAndSessionKeyForWX.do`,           //获取openId和sessionKey
    //付款
    requestWxPayUnifiedOrder: `${host}/order/requestWxPayUnifiedOrder.do`,                  //开始准备微信支付
    //今日油价
    addOrUpdateOilStation: `${host}/oilStation/addOrUpdateOilStation.do`,                   //添加加油站
    getOilStationByLonLat: `${host}/oilStation/getOilStationByLonLat.do`,                   //根据经纬度地址获取所处的加油站
    getOneOilStationByCondition: `${host}/oilStation/getOneOilStationByCondition.do`,       //根据条件获取指定加油站
    getOilStationList: `${host}/oilStation/getOilStationList.do`,                           //根据附近获取附近加油站列表
    //我的
    getMoreOilModelTagList: `${host}/dic/getSimpleDicByCondition.do`,                       //获取更多的油品标签信息
  feedBackUrl: `${host}/comments/addComments.do`,                                          //意见反馈
  getRedPacketHistoryList: `${host}/redPacketHistory/getRedPacketHistoryList.do`,                       //获取历史红包列表                             
  cashOilStationOperatorRedPacket: `${host}/oilStationOperator/cashOilStationOperatorRedPacket.do`               //领取或者提现加油站操作红包
};

module.exports = config;