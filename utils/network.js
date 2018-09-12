/**
 * 网络请求的封装，以后所有的网络请求直接使用这里的方法进行请求
 */
const configUrl = require('../config');
var requestHandler = {
    requestUrl: '',
    params: {},
    success: function (res) {

    },
    fail: function (res) {

    }
};
//Get请求
function GET(requestHandler) {
    let header = {
        "content-type": 'application/json'
    }
    request('GET', requestHandler, header);
}
//POST请求
function POST(requestHandler) {
    let header = {
        "content-type": 'application/x-www-form-urlencoded'
    }
    request('POST', requestHandler, header);
}
//执行发送请求
function request(method, requestHandler, header) {
    var params = requestHandler.params;
    params.sessionKey = wx.getStorageSync("SESSIONKEY");
    params.uid = wx.getStorageSync("UIDKEY");
    var requestUrl = requestHandler.requestUrl;
    //这里还可以对公共参数做统一处理
    wx.request({
        url: requestUrl,
        data: params,
        method: method,
        header: header,
        success: function (res) {
            //这里还可以对3rd_session过期做处理
            console.log('发送接收的code（' + requestUrl + '）:' + res.data.code + "接收的message:" + res.data.message);
            if (res.data.code == 10002 || res.data.code == 10003) {    //session过期的处理，重新登录
              if (params.sessionCheck && params.sessionCheck == 1) {   //如果是请求session过期处理，就不在这里操作
                requestHandler.success(res);
                return;
              }
              // console.log("请求过程中Session过期");
              //这里会重新调用登录
              clearInfo();
              goLogin(request, method, requestHandler, header);
            } else {
              requestHandler.success(res);
            }
        },
        fail: function (res) {
            requestHandler.fail(res);
        },
        complete: function (res) {
            if (res.statusCode != 200) {
              console.log(res);
            }
        }
    });
}
function goLogin(Func, method, requestHandler, header) {    //私有的请求方法，不准在外部调用
    wx.login({
        success: function (res1) {
            //调用登录
            var params = new Object();
            params.code = res1.code;
            POST({
                params: params,
                requestUrl: configUrl.wxAppLoginUrl,
                success: function (res) {
                    if (res.data.code != 0) {  //登录错误
                        wx.showModal({
                            title: '提示',
                            content: res.data.message,
                            showCancel: false
                        });
                        return;
                    }
                    // console.log("登录成功");
                    //登录成功，将uid和session保存
                    saveInfo(res.data.data.sessionKey, res.data.data.uid);
                    console.log("【准备】开始执行后callback");
                    if (Func != null && Func != "" && method != null && method != "" &&
                      requestHandler != null && requestHandler != "" && header != null && header != ""){
                        console.log("开始执行后callback");
                        Func(method, requestHandler, header);
                    }
                }
            });
        }
    });
}
function saveInfo(session, uid) {    //私有方法，不准在外部调用。将重新登录的数据保存
    // console.log("开始保存用户信息");

    try {
        wx.setStorageSync("SESSIONKEY", session);
        wx.setStorageSync("UIDKEY", uid);
    } catch (e) {
        // console.log("存储session失败");
    }
    // console.log("保存用户信息成功：保存的session为：" + wx.getStorageSync('SESSIONKEY'));
}
function clearInfo() {   //私有的清除缓存方法，不准在外部调用将缓存的数据清空,包含uid，sessionkey，userinfo
    wx.removeStorageSync('SESSIONKEY');
    wx.removeStorageSync('UIDKEY');
}
// 上传文件

function upLoadFile(url, filePath, name, formData, success, fail) {

    wx.uploadFile({
        url: url,
        filePath: filePath,
        name: name,
        header: {
            'content-type': 'multipart/form-data',
            'sessionKey': wx.getStorageSync("SESSIONKEY")
        },
        formData: formData,    //请求额外的form data
        success: function (res) {
            console.log(res);
            if (res.statusCode == 200) {
                typeof success == "function" && success(res.data);
            } else {
                typeof fail == "function" && fail(res.data);
            }
        },
        fail: function (res) {
            console.log(res);
            typeof fail == "function" && fail(res.data);
        }
    })
}


// 方法导出
module.exports = {
    GET: GET,
    POST: POST,
    UPLOADFILE: upLoadFile
}