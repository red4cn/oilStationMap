/**
 * 小程序配置文件,主要是网络请求地址配置,如有网络请求，请将url在这里配置,使用的时候在.js中引入：
 * const requestUrl = require('../../../../config').getSession
 */
// var host = "https://dymapi.xiaqiu.cn/oilStationMap";

// var host = "http://192.168.0.144:8080/oilStationMap";

// var host = "http://localhost:8080/oilStationMap";

var host = "http://172.20.10.2:8080/oilStationMap";

var config = {
  host,
  //通用
  checkSession:`${host}/user/checkSession.do`,                                            //检测session是否过期
  wxAppLoginUrl:`${host}/user/login.do`,                                                  //检测登录
  sendTemplateMessageUrl: `${host}/common/sendMessage.do`,                                //发送模板消息
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
  feedBackUrl:`${host}/comments/addComments.do`                                          //意见反馈
};

module.exports = config;