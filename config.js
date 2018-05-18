/**
 * 小程序配置文件,主要是网络请求地址配置,如有网络请求，请将url在这里配置,使用的时候在.js中引入：
 * const requestUrl = require('../../../../config').getSession
 */
// var host = "https://dymapi.xiaqiu.cn/card";

// var host = "http://192.168.0.144:8080/card";

// var host = "http://localhost:8080/card";

var host = "http://172.20.10.2:8080/card";
//这里用来配置所有请求地址
var config = {
  host,
  getSessionUrl:`${host}/card/getSession.do`,    //获取session
  getSimpleDicByConditionUrl: `${host}/dic/getSimpleDicByCondition.do`,    //获取添加更多信息的tag&&获取厂商
  getCardListUrl: `${host}/cardUserMapping/getCardUserMappingByCondition.do`,  //获取名片列表，这里是获取好友名片列表和待接收名片列表
  addUser: `${host}/user/addUser.do`, //用户信息
  getVerificationCodeUrl: `${host}/user/getVerificationCode.do`, //据手机号获取验证码
  getCheckVerificationCodeUrl: `${host}/user/getCheckVerificationCode.do`,//对手机验证码进行校验
  getTag: `${host}/card/getTag.do`, //更多信息时的标签
  checkSession:`${host}/user/checkSession.do`,   //检测session是否过期
  wxAppLoginUrl:`${host}/user/login.do`,   //检测登录
  getSimpleCardByConditionUrl: `${host}/card/getSimpleCardByCondition.do`,   //获取自己的名片列表
  addCardUrl: `${host}/card/addCard.do`, //添加名片列表
  updateCardUrl: `${host}/card/updateCard.do`, //修改名片列表
  deleteCardUrl: `${host}/card/deleteCard.do`, //删除自己名片列表
  checkIsSaveUrl: `${host}/cardUserMapping/checkIsSave.do`,//是否已经收藏
  addCardUserMappingUrl: `${host}/cardUserMapping/addCardUserMapping.do`,//收藏名片
  importCardUrl:`${host}/batchImport/batchImportDataForCC.do`,     //导入名片
  sendTemplateMessageUrl: `${host}/common/sendMessage.do`,      //发送模板消息
  feedBackUrl:`${host}/comments/addComments.do`,       //意见反馈
  getDecryptPhoneUrl: `${host}/common/getDecryptPhone.do`,      //获取解密后的手机号
  scanCardUrl: `${host}/card/scanCard.do`,       //名片识别
  receiveuserMappingUrl:`${host}/cardUserMapping/receviceCardUserMapping.do`,   //接受名片
  returnCardUserMappingUrl:`${host}/cardUserMapping/returnCardUserMapping.do`,  //回递名片
  getSimilarCardByPhoneUrl: `${host}/card/getSimilarCardByPhone.do`,   //获取手机号相同的类似名片
  deleteOthersCardUrl: `${host}/cardUserMapping/deleteCardUserMapping.do`,   //删除他人的名片
  searchCardUrl: `${host}/cardUserMapping/searchCardUserMappingByCondition.do`,   //在名片夹中搜索名片
  // saveFormIdUrl: `${host}/my/saveFormId.do`,  //保存formId
  cutCardUrl: `${host}/card/cutCard.do`,   //区域裁剪







  //common      通用
  getOpenIdAndSessionKeyForWX: `${host}/common/getOpenIdAndSessionKeyForWX.do`,           //获取openId和sessionKey
  //order       订单
  requestWxPayUnifiedOrder: `${host}/order/requestWxPayUnifiedOrder.do`,                  //开始准备微信支付
  //oilStation  加油站
  addOrUpdateOilStation: `${host}/oilStation/addOrUpdateOilStation.do`,                                          //添加加油站
  getOilStationByLonLat: `${host}/oilStation/getOilStationByLonLat.do`,                   //根据经纬度地址获取所处的加油站
  getOneOilStationByCondition: `${host}/oilStation/getOneOilStationByCondition.do`,       //根据条件获取指定加油站
  getOilStationList: `${host}/oilStation/getOilStationList.do`,                           //根据附近获取附近加油站列表
  //dic   标签
  getMoreOilModelTagList: `${host}/dic/getSimpleDicByCondition.do`,                       //获取更多的油品标签信息
  
}
module.exports = config