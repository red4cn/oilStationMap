//app.js test
var network = require('utils/network.js')
const requestUrl = require('config')
const util = require('utils/util.js')
/*
 * 整个小程序的初始化方法：.png .gift .jpeg
 *   1.对打开的设备是否是iphone X做一个校验
 *   2.登录，获取微信的基本信息的权限，同时将session和uid等信息存储
 */
App({
    data: {
        code: null,
        editCard: []
    },
    onLaunch: function () {           //小程序初始化完成时，会触发 onLaunch（全局只触发一次）
        //判断当前用户是否已经授权~控制按钮是否可以点击
        if (wx.getStorageSync('isAuthorization')) {
        } else {
            wx.setStorageSync('isAuthorization', false);
        }
        //1.处理系统信息，因为iphonX是一个特殊的手机型号，设计有风险啊
        this.handlSystemInfo();
        //2.检测并登录：检测会话是否过期，过期则重登陆，否则正常使用
        this.checkAndLogin();
    },
    onShow: function (options) {      //当小程序启动，或从后台进入前台显示，会触发 onShow
        // 前台、后台定义： 当用户点击左上角关闭，或者按了设备 Home 键离开微信，小程序并没有直接销毁，而是进入了后台；当再次进入微信或再次打开小程序，又会从后台进入前台。需要注意的是：只有当小程序进入后台一定时间，或者系统资源占用过高，才会被真正的销毁。
        var that = this;
        that.globalData.isRefreshTagForCardFile = true;   //每次不管小程序从哪里进入到前台，都会设置今日油价页刷新
    },
    handlSystemInfo: function () {
        let that = this;                //使用严格模式
        wx.getSystemInfo({
            success: function (res) {
                let model = res.model.substring(0, res.model.indexOf("X")) + "X";
                if (model == 'iPhone X') {      //判断是否是iphonX型号
                    that.globalData.isIpx = true;  //判断是否为iPhone X 默认为值false，iPhone X 值为true
                } else {
                    that.globalData.isIpx = false;
                }
            }
        });
    },
    checkAndLogin: function () {              //预登录：检测是否登录
        var that = this;
        var isLogin = false;
        var session = wx.getStorageSync('SESSIONKEY');
        var uid = wx.getStorageSync('UIDKEY');
        console.log("开始准备预登陆....");
        console.log("uid = " + uid + " , seesion = " + session);
        //判断是否有session，如果有session，判断此session是否过期，如果没有session，则登录
        if (session && uid) {             //已经登录过
            that.getUserLocationAuthorization("scope.userLocation");   //获取位置，如果用户已经登录，万一将授权取消了，所以还要获取授权
            // that.getPhotosAuthorization("scope.writePhotosAlbum");   //获取位置，如果用户已经登录，万一将授权取消了，所以还要获取授权
            var params = new Object();
            params.sessionKey = session;
            params.sessionCheck = 1;
            network.POST({
                params: params,
                requestUrl: requestUrl.checkSession,
                success: function (res) {
                    console.log("检测 res.data.code = " + res.data.code);
                    if (res.data.code == 10002) {   //session过期
                        that.clearInfo();
                        that.login();
                        return;
                    }
                    that.initGlobalData(session, uid);    //如果session没有过期，则初始化 数据
                    if (res.data.code != 0) {   //session检测异常
                        util.toast(res.data.message);
                        return;
                    }
                },
                fail: function (res) {
                    util.toast(res.data.message);
                    isLogin = true;           //需要重新登录
                }
            });
        } else {
            that.login();
        }
    },
    login: function () {                         //第一次登录或者重新登录
        var that = this;
        //1.判断是否获取到位置信息
        that.getUserLocationAuthorization("scope.userLocation");   //获取位置，如果用户已经登录，还要进一步判断位置权限
        // that.getPhotosAuthorization("scope.writePhotosAlbum");   //获取位置，如果用户已经登录，还要进一步判断位置权限
        console.log("1234567890");
        //2.开始登录
        wx.login({
            success: function (res) {
                //调用登录
                var params = new Object();
                params.code = res.code;
                network.POST({
                    params: params,
                    requestUrl: requestUrl.wxAppLoginUrl,
                    success: function (res) {
                        if (res.data.code != 0) {  //登录错误
                            console.log("res.data.message = " + res.data.message);
                            wx.showModal({
                                title: '提示',
                                content: res.data.message,
                                showCancel: false
                            });
                            return;
                        }
                        //登录成功，将uid和session保存
                        that.saveInfo(res.data.data.sessionKey, res.data.data.uid);
                        console.log("sessionKey = " + res.data.data.sessionKey + ", uid = " + res.data.data.uid);
                    }
                });
            },
            fail: function (res) {
                util.toast(res.data.message);
            }
        });
    },
    //获取微信的位置权限
    getUserLocationAuthorization: function (authorize) {         //第一次打开小程序，获取userInfo权限
        var that = this;
        wx.getLocation({   //原则上这边应该是直接走到fail的。但是为了防止刚开始没有昵称和头像权限，所有这里做了请求判断
            success: function (userLocaltion) {
                console.log("获取用户位置信息成功....");
                wx.setStorageSync("USERLACTION", userLocaltion);
                that.globalData.userLocaltion = userLocaltion;
            },
            fail: function (res) {
                console.log("获取用户位置信息失败....");
                that.showUserLocationForceToast(authorize);
            }
        });
    },
    //获取微信的位置权限失败，弹出强制强制授权弹框
    showUserLocationForceToast: function (authorize) {
        var that = this;
        wx.showModal({
            title: '温馨提示',
            content: '油价地图需要获取您的微信权限，点击确认前往设置或者退出程序？',
            showCancel: false,
            success: function () {
                wx.openSetting({
                    success: function (res) {
                        if (res.authSetting[authorize]) {   //用户打开了用户信息授权
                            wx.getLocation({   //原则上这边应该是直接走到fail的。但是为了防止刚开始没有昵称和头像权限，所有这里做了请求判断
                                success: function (userLocaltion) {
                                    console.log("【通过强制的弹窗方式】获取用户位置信息成功....");
                                    wx.setStorageSync("USERLACTION", userLocaltion);
                                    that.globalData.userLocaltion = userLocaltion;
                                }
                            });
                        } else {    //用户没有打开用户信息授权
                            that.showUserLocationForceToast(authorize);
                        }
                    }
                });
            }
        });
    },
    saveInfo: function (session, uid) {   //将登录获取的数据保存
        try {
            wx.setStorageSync("SESSIONKEY", session);
            wx.setStorageSync("UIDKEY", uid);
        } catch (e) {
            console.log("存储session和uid失败,有可能是存储本地的权限不足或者存储空间不足。");
        }
        this.globalData.session = session;
        this.globalData.uid = uid;
        if (this.userInfoReadyCallBack) {
            this.userInfoReadyCallBack(uid, session);
        }
    },
    clearInfo: function () {   //将缓存的数据清空,包含uid，sessionkey，userinfo
        this.globalData.session = null;
        this.globalData.uid = null;
        wx.removeStorageSync('SESSIONKEY');
        wx.removeStorageSync('UIDKEY');
        console.log("清空用户信息成功");
    },
    initGlobalData(session, uid) {    //初始化全局数据
        this.globalData.session = session;
        this.globalData.uid = uid;
        if (this.userInfoReadyCallBack) {
            this.userInfoReadyCallBack(uid, session);
        }
    },
    globalData: {
        userInfo: null,
        userLocaltion: null,
        writePhotosAlbum: null,
        paymentImageUrl: null,
        uid: null,
        session: null,
        isIpx: false,
        code: null,
        arr2: [],
        isChoosetoforgroundTag: 0,    // 如果为4，则不刷新名片夹数据，如果不为4则刷新名片夹数据
        addMoreMes: [],
        myCardCount: -1,  //       全局记录我的个人名片个数，如果为-1说明首页没有进入
        isRefreshTagForCardFile: true,      //全局记录刷新标记 主要在名片夹中使用
        isRefreshTagForIndex: true,       //全局记录刷新标记 主要在我的名片夹中使用
        swiperCurrent: 0,//分享人打开之后小圆点停留的位置
        cardCustomMessage2: [],//选择标签后新增的
        saveCardId: '' //被分享分打开的cardId
    }
})