// pages/howFind/index.js
var network = require('../../../utils/network.js');
var util = require('../../../utils/util.js');
var requestUrl = require('../../../config.js');

var app = getApp();
Page({
    data: {
        //我使用的
        currentLongitude: 0,                    //当前位置的经度
        currentLatitude: 0,                     //当前位置的纬度
        oilStationMapAdress: "",
        oilStation: {
            oilStationPrice: {}
        },
        oilStationName: '请输入当前加油站【名称】',               //textarea输入框默认的placeholder
        oilStationAdress: '请输入当前加油站【地址】',             //textarea输入框默认的placeholder
        modelOil_0: "请输入今日【 0 #柴油】油价",                //textarea输入框默认的placeholder
        modelOil_92: "请输入今日【92#汽油】油价",              //textarea输入框默认的placeholder
        modelOil_95: "请输入今日【95#汽油】油价",              //textarea输入框默认的placeholder
        modelOil_97: "请输入今日【97#汽油】油价",              //textarea输入框默认的placeholder
        more: [
            {isChecked: false, name: 'E0#柴油', palce: '请输入您的0#乙醇柴油'},
            {isChecked: false, name: 'E92#汽油油', palce: '请输入您的92#乙醇汽油'},
            {isChecked: false, name: 'E95#汽油油', palce: '请输入您的95#乙醇汽油'},
            {isChecked: false, name: 'E97#汽油油', palce: '请输入您的97#乙醇汽油'}
        ],
        eidtOilModelTags: [],
        addOilModelTags: [],


        inputToast: '', //头部错误提示存放的信息
        time: '',

        formId: '',     // 提交表单生成的id
        canSave: false,
        canClick: false, //保存按钮是否可以点击

        cardCustomMessage: [],
        // 定时器
        time: '',
        beforeEditData: false,//判断之前是否有已经输入的信息
        // 发送模板消息的data
        "data": {
            "keyword1": {},
            "keyword2": {},
            "keyword3": {},
            "keyword4": {},
            "keyword5": {}
        }
    },
    onReady: function () {

    },
    onLoad: function (options) {

    },
    onShow: function () {
        var that = this;
        wx.getLocation({   //原则上这边应该是直接走到fail的。但是为了防止刚开始没有昵称和头像权限，所有这里做了请求判断
            success: function (userLocaltion) {
                that.data.currentLongitude = userLocaltion.longitude;
                that.data.currentLatitude = userLocaltion.latitude;
                that.setData({
                    currentLongitude: that.data.currentLongitude,
                    currentLatitude: that.data.currentLatitude
                });
            }
        });
        //对在更多信息中的油品标签进行初始化
        if (app.globalData.addMoreMes) {
            this.setData({
                addOilModelTags: app.globalData.addMoreMes
            });
        }
    },
    showToast: function (value) { //提示添加错误信息
        var that = this;
        wx.getSystemInfo({
            success: function (res) {
                let model = res.model.indexOf('iPhone');
                console.log(model);
                if (model == -1) {
                    that.setData({
                        inputToast: value,
                    });
                    setTimeout(function () {
                        that.setData({
                            inputToast: '',
                        });
                    }, 3000);
                    return;
                } else {
                    clearTimeout(that.data.time);
                    var animation = wx.createAnimation({
                        duration: 400,  //动画时长
                        timingFunction: "linear", //线性
                        delay: 0  //0则不延迟
                    });
                    that.animation = animation;
                    animation.translateY(-60).step();
                    that.setData({
                        animationData: animation.export(),
                        inputToast: value,
                    });
                    setTimeout(function () {
                        animation.translateY(0).step();
                        that.setData({
                            animationData: animation.export()
                        });
                    }.bind(that), 400);
                    that.data.time = setTimeout(function () {
                        var animation = wx.createAnimation({
                            duration: 400,
                            timingFunction: "linear",
                            delay: 0
                        });
                        that.animation = animation;
                        animation.translateY(-60).step();
                        that.setData({
                            animationData: animation.export(),
                        });
                        setTimeout(function () {
                            animation.translateY(0).step()
                            that.setData({
                                animationData: animation.export(),
                                inputToast: ''
                            });
                        }.bind(that), 400)
                        that.setData({
                            inputToast: ''
                        });
                    }, 3000);
                }
            }
        });
    },    //================================================对加油站的各项参数进行校验================================================
    //加油站名称-输入框
    oilStationNameInput: function (e) {   //获取加油站名称
        this.setData({
            oilStationName: "请输入当前加油站【名称】"
        });
        var that = this;
        if (e.detail.value != "" && e.detail.value != null) {
            that.data.oilStation.oilStationName = e.detail.value;
            that.setData({
                oilStation: that.data.oilStation
            });
        } else {
            that.showToast("请输入当前加油站【名称】");
            delete that.data.oilStation.oilStationName;
        }
        that.isShowCanSave(that);
    },
    oilStationNameInput1: function (e) {   //获取加油站名称
        this.setData({
            oilStationName: ""
        });
    },
    //加油站地址-输入框
    oilStationAdressInput: function (e) {  //加油站地址
        this.setData({
            oilStationAdress: "请输入当前加油站【地址】"
        });
        var that = this;
        if (e.detail.value != "" && e.detail.value != null) {
            that.data.oilStation.oilStationAdress = e.detail.value;
            that.setData({
                oilStation: that.data.oilStation
            });
        } else {
            that.showToast("请输入当前加油站【地址】");
            delete that.data.oilStation.oilStationAdress;
        }
        that.isShowCanSave(that);
    },
    oilStationAdressInput1: function () {
        this.setData({
            oilStationAdress: ''
        });
        //打开腾讯地图开始选择坐标
        var that = this;
        wx.chooseLocation({   //原则上这边应该是直接走到fail的。但是为了防止刚开始没有昵称和头像权限，所有这里做了请求判断
            success: function (mapLocaltion) {
                that.data.oilStation.longitude = mapLocaltion.longitude;
                that.data.oilStation.latitude = mapLocaltion.latitude;
                that.data.oilStation.oilStationAdress = mapLocaltion.address;
                that.data.oilStationMapAdress = mapLocaltion.address;
                that.setData({
                    oilStation: that.data.oilStation,
                    oilStationMapAdress: that.data.oilStationMapAdress
                });
                console.log(mapLocaltion);
                console.log(that.data.oilStation);
            }
        });
    },
    //加油站0#柴油-输入框
    modelOil_0_input: function (e) {          //0#柴油
        var that = this;
        this.setData({
            modelOil_0: "请输入今日【 0 #柴油】油价"
        });
        var oilStationPrice = {};
        oilStationPrice.oilModelLabel = "0";
        oilStationPrice.oilNameLabel = "柴油";
        oilStationPrice.oilPriceLabel = e.detail.value;
        if (oilStationPrice.oilPriceLabel != "" && oilStationPrice.oilPriceLabel != null) {
            that.data.oilStation.oilStationPrice.modelOil_0 = oilStationPrice;
            that.setData({
                oilStation: that.data.oilStation
            });
        } else {
            delete that.data.oilStation.oilStationPrice.modelOil_0;
        }
        that.isShowCanSave(that);
    },
    modelOil_0_input1: function () {
        this.data.modelOil_0 = "";
        this.setData({
            modelOil_0: this.data.modelOil_0
        });
    },
    //加油站92#汽油-输入框
    modelOil_92_input: function (e) {          //92#汽油
        var that = this;
        this.setData({
            modelOil_92: "请输入今日【92#汽油】油价"
        });
        var oilStationPrice = {};
        oilStationPrice.oilModelLabel = "92";
        oilStationPrice.oilNameLabel = "汽油";
        oilStationPrice.oilPriceLabel = e.detail.value;
        if (oilStationPrice.oilPriceLabel != "" && oilStationPrice.oilPriceLabel != null) {
            that.data.oilStation.oilStationPrice.modelOil_92 = oilStationPrice;
            that.setData({
                oilStation: that.data.oilStation
            });
        } else {
            delete that.data.oilStation.oilStationPrice.modelOil_92;
        }
        that.isShowCanSave(that);
    },
    modelOil_92_input1: function (e) {
        var that = this;
        that.data.modelOil_92 = "";
        this.setData({
            modelOil_92: that.data.modelOil_92
        });
    },
    //加油站95#汽油-输入框
    modelOil_95_input: function (e) {          //95#汽油
        var that = this;
        this.setData({
            modelOil_95: "请输入今日【95#汽油】油价"
        });
        var oilStationPrice = {};
        oilStationPrice.oilModelLabel = "95";
        oilStationPrice.oilNameLabel = "汽油";
        oilStationPrice.oilPriceLabel = e.detail.value;
        if (oilStationPrice.oilPriceLabel != "" && oilStationPrice.oilPriceLabel != null) {
            that.data.oilStation.oilStationPrice.modelOil_95 = oilStationPrice;
            that.setData({
                oilStation: that.data.oilStation
            });
        } else {
            delete that.data.oilStation.oilStationPrice.modelOil_95;
        }
        that.isShowCanSave(that);
    },
    modelOil_95_input1: function (e) {
        var that = this;
        that.data.modelOil_95 = "";
        this.setData({
            modelOil_95: that.data.modelOil_95
        });
    },
    //加油站97#汽油-输入框
    modelOil_97_input: function (e) {          //97#汽油
        var that = this;
        this.setData({
            modelOil_97: "请输入今日【97#汽油】油价"
        });
        var oilStationPrice = {};
        oilStationPrice.oilModelLabel = "97";
        oilStationPrice.oilNameLabel = "汽油";
        oilStationPrice.oilPriceLabel = e.detail.value;
        if (oilStationPrice.oilPriceLabel != "" && oilStationPrice.oilPriceLabel != null) {
            that.data.oilStation.oilStationPrice.modelOil_97 = oilStationPrice;
            that.setData({
                oilStation: that.data.oilStation
            });
        } else {
            delete that.data.oilStation.oilStationPrice.modelOil_97;
        }
        that.isShowCanSave(that);
    },
    modelOil_97_input1: function (e) {
        var that = this;
        that.data.modelOil_97 = "";
        this.setData({
            modelOil_97: that.data.modelOil_97
        });
    },
    //展示的更多信息中增加校验
    haveMessage: function (e) {
        var index = e.currentTarget.dataset.index;
        this.data.editData.cardCustomMessage[index].value = e.detail.value.replace(/\s+/g, '');
        this.setData({
            editData: this.data.editData
        });
    },
    haveMessage1: function (e) {
        var index = e.currentTarget.dataset.index;
        this.data.editData.cardCustomMessage[index].value = e.detail.value
        this.setData({
            editData: this.data.editData
        })
    },
    //新添加的更多油品标签 增加校验
    addMoreBlur: function (e) {
        var that = this;
        var oilStationPrice = {};
        var index = e.currentTarget.dataset.index;
        console.log(this.data.addOilModelTags);
        var oilModelTag = this.data.addOilModelTags[index].dicName;
        if (this.data.addOilModelTags[index].oilModelCode) {
            oilStationPrice.oilModelLabel = this.data.addOilModelTags[index].oilModelLabel;
            oilStationPrice.oilNameLabel = this.data.addOilModelTags[index].oilNameLabel;
        } else {
            var oilModelTagArr = oilModelTag.split("#");
            if (oilModelTagArr.length >= 2) {
                oilStationPrice.oilModelLabel = oilModelTagArr[0];
                oilStationPrice.oilNameLabel = oilModelTagArr[1];
            } else {
                oilStationPrice.oilModelLabel = oilModelTagArr[0];
                oilStationPrice.oilNameLabel = "商品";
            }
        }
        oilStationPrice.oilPriceLabel = e.detail.value;
        if (oilStationPrice.oilPriceLabel != "" && oilStationPrice.oilPriceLabel != null) {
            var key = oilModelTag + "_" + index;
            that.data.oilStation.oilStationPrice[key] = oilStationPrice;
            that.setData({
                oilStation: that.data.oilStation
            });
        } else {
            delete that.data.oilStation.oilStationPrice[key];
        }
    },
    //添加更多油品型号标签
    addMoreOilModel: function () {
        if (this.data.eidtOilModelTags && this.data.eidtOilModelTags != undefined) {
            this.setData({
                eidtOilModelTags: this.data.eidtOilModelTags
            });
        }
        var eidtOilModelTags = JSON.stringify(this.data.eidtOilModelTags);
        wx.navigateTo({
            url: '/pages/my/moreOilModelTag/index?eidtOilModelTags=' + eidtOilModelTags
        });
    },
    isShowCanSave: function (that) {                        //是否设置保存按钮是否可点击
        if (that.data.oilStation.oilStationName && that.data.oilStation.oilStationName.length != 0 &&
            that.data.oilStation.oilStationAdress && that.data.oilStation.oilStationAdress.length != 0) {
            that.setData({
                canSave: true
            });
        } else {
            that.setData({
                canSave: false
            });
        }
    },
    // 点击保存的时候
    formSubmit: function (e) {
        var that = this;
        //整理参数
        this.setData({
            formId: e.detail.formId
        });
        if (that.data.oilStation.oilStationName.length == 0 || that.data.oilStation.oilStationName.length == 1) {
            that.showToast('请输入您的加油站名称');
        } else if (that.data.oilStation.oilStationAdress.length == 0 || that.data.oilStation.oilStationAdress.length == 1) {
            that.showToast('请输入您的加油站地址');
        } else if (JSON.stringify(that.data.oilStation.oilStationPrice) == "{}") {
            that.showToast('请输入您的油价');
        } else {
            let params = new Object();
            var oilStationPriceArr = [];
            params.uid = app.globalData.uid;
            params.formId = that.data.formId;
            params.oilStationLon = that.data.oilStation.longitude;
            params.oilStationLat = that.data.oilStation.latitude;
            params.oilStationName = that.data.oilStation.oilStationName;
            params.oilStationAdress = that.data.oilStation.oilStationAdress;
            params.currentLongitude = that.data.currentLongitude;
            params.currentLatitude = that.data.currentLatitude;
            //整理油价或者商品的价格
            for (var key in that.data.oilStation.oilStationPrice) {
                oilStationPriceArr.push(that.data.oilStation.oilStationPrice[key]);
            }
            params.oilStationPrice = JSON.stringify(oilStationPriceArr);

            console.log("===================params=======================");
            console.log(params);
            wx.showLoading({
                mask: true
            });
            network.POST({
                params: params,
                requestUrl: requestUrl.addOrUpdateOilStation,
                success: function (res) {
                    wx.hideLoading();
                    console.log("=============res================");
                    console.log(res);
                    console.log("res.data.code = " + res.data.code);
                    console.log("res.data.code == 0");
                    console.log(res.data.code == 0);
                    //发送模板消息
                    if (res.data.code == 0) {
                        // if (that.data.editData.isOwnCard == 0) {  //自己创建别人的名片成功提醒
                        //     let params1 = new Object()
                        //     params1.form_id = that.data.formId;
                        //     params1.page = 'pages/tabBar/todayOilPrice/todayOilPrice';
                        //     params1.template_id = 'hnQie-Q7q1jnR6f-ELSiUTwvO_naG9lsPqz9MKWJ2nk';
                        //     params1.receiveUid = app.globalData.uid;   //接收人的uid
                        //
                        //     that.data.data.keyword1.value = that.data.editData.cardName;
                        //     that.data.data.keyword1.color = "#000000";
                        //
                        //     that.data.data.keyword2.value = that.data.editData.cardCompany;
                        //     that.data.data.keyword2.color = "#000000";
                        //
                        //     that.data.data.keyword3.value = that.data.editData.cardJob;
                        //     that.data.data.keyword3.color = "#000000";
                        //
                        //     that.data.data.keyword4.value = util.getNowFormatDate();
                        //     that.data.data.keyword4.color = "#000000";
                        //
                        //     that.data.data.keyword5.value = "微信昵称" + '（先生/女士），您已成功为' + that.data.editData.cardName + '创建了一张名片。点击进入名片夹中查看。'
                        //     that.data.data.keyword5.color = "#000000";
                        //     that.setData({
                        //         data: that.data.data
                        //     });
                        //     params1.data = JSON.stringify(that.data.data);
                        //     //发送模板消息，如果失败了也不给用户提示
                        //     network.POST(
                        //         {
                        //             params: params1,
                        //             requestUrl: requestUrl.sendTemplateMessageUrl,
                        //             success: function (res) {
                        //                 console.log(res);
                        //                 console.log(params1);
                        //
                        //             },
                        //             fail: function (res) {
                        //                 console.log(res);
                        //
                        //             }
                        //         })
                        //     app.globalData.isRefreshTagForCardFile = true;
                        // }
                        wx.switchTab({   //不管是否发送模板消息成功，都不能影响正常操作
                            url: "/pages/tabBar/my/my"
                        });
                    } else {
                        util.toast(res.data.message);
                    }
                },
                fail: function (res) {
                    wx.hideLoading();
                    util.toast("不好意思，您的网络出了一会小差...");
                }
            });
        }
    }
})