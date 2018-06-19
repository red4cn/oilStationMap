//logs.js
var network = require('../../../utils/network.js')
const requestUrl = require('../../../config')
const util = require('../../../utils/util.js')

var app = getApp();
Page({
    data: {
      oilStationName: "大路田坝加油站",
        oilStationAdress: "贵州省铜仁市松桃苗族自治县孟溪镇大路乡田坝加油站",
        markerId: 0,
        scale: 14,
        longitude: 108.958280,
        latitude: 28.122990,
        title: "大路田坝加油站",
        markers: [
            {
                id: 0,
                longitude: 108.958280,
                latitude: 28.122990,
                iconPath: "/images/oilStation_black.png",
                title: "大路田坝加油站",
                address: "贵州省铜仁市松桃苗族自治县孟溪镇大路乡田坝加油站",
                width: 20,
                height: 20,
                callout: {
                  content: "大路田坝加油站",
                    color: "#2c2c2c",
                    fontSize: 15,
                    padding: 3,
                    borderRadius: 5,
                    display: "BYCLICK",
                    bgColor: "#c5f6bc",
                    textAlign: "center"
                }
            }
        ],
        includePoints: [
            {
                id: 0,
                longitude: 108.958280,
                latitude: 28.122990,
                iconPath: "/images/oilStation_black.png",
                title: "大路田坝加油站",
                address: "贵州省铜仁市松桃苗族自治县孟溪镇大路乡田坝加油站",
                width: 20,
                height: 20,
                callout: {
                  content: "大路田坝加油站",
                    color: "#2c2c2c",
                    fontSize: 15,
                    padding: 3,
                    borderRadius: 5,
                    display: "BYCLICK",
                    bgColor: "#c5f6bc",
                    textAlign: "center"
                }
            }
        ],
        circles: [{
            longitude: 108.958280,
            latitude: 28.122990,
            color: "#B2B2B230",
            fillColor: "#09BB0730",
            radius: 3000
        }],
        oilStationPriceList: [
          { oilModelLabel: '0', oilNameLabel: '柴油', oilPriceLabel: '5.46'},
          { oilModelLabel: '92', oilNameLabel: '汽油', oilPriceLabel: '6.36'},
          { oilModelLabel: '95', oilNameLabel: '汽油', oilPriceLabel: '7.09'}
        ]
    },
    onLoad: function (e) {
        //在线获取地图
        this.oilStationMap = this.loadOilStationMap();
    },
    onReady: function () {

    },
    onShow: function (res) {

    },
    onHide: function () {

    },
    loadOilStationMap: function (markerId) {         //  加载附近加油站地图
        //1.通过网络请求从服务器获取所有加油站数据
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
            // params.lon = 108.958280;
            // params.lat = 28.122990;
            // //桃映火车站
            // params.lon = 109.021220;
            // params.lat = 27.860020;
            params.r = 5000;
            wx.showLoading({
              title: "客官请稍后...",
              mask: true
            });
            network.POST({
              params: params,
              requestUrl: requestUrl.getOilStationList,
              success: function (res) {
                wx.hideLoading();         //关闭进度条
                if (res.data.code != 0) {
                  util.toast("您所处的位置不是加油站，请打赏一点开发小哥哥吧。");
                  return;
                }
                var oilStationList = res.data.data;
                that.data.oilStationName = "";
                that.data.circles = [];
                that.data.circles.length = 0;
                that.data.markers = [];
                that.data.markers.length = 0;
                that.data.includePoints = [];
                that.data.includePoints.length = 0;
                that.data.oilStationPriceList = [];
                that.data.oilStationPriceList.length = 0;
                for (var item in oilStationList) {
                  var oilStationPriceObj = {};
                  oilStationPriceObj.id = oilStationList[item].oilStationCode;
                  oilStationPriceObj.latitude = oilStationList[item].oilStationLat;
                  oilStationPriceObj.longitude = oilStationList[item].oilStationLon;
                  oilStationPriceObj.iconPath = "/images/oilStation_black.png";
                  oilStationPriceObj.title = oilStationList[item].oilStationName;
                  oilStationPriceObj.address = oilStationList[item].oilStationAdress;
                  oilStationPriceObj.width = 20;
                  oilStationPriceObj.height = 20;
                  oilStationPriceObj.callout = {
                    content: oilStationList[item].oilStationName,
                    color: "#2c2c2c",
                    fontSize: 15,
                    padding: 3,
                    borderRadius: 5,
                    display: "BYCLICK",
                    bgColor: "#c5f6bc",
                    display: "BYCLICK",
                    textAlign: "center"
                  };
                  oilStationPriceObj.oilStationPriceList = JSON.parse(oilStationList[item].oilStationPrice);
                  that.data.markers.push(oilStationPriceObj);
                  if (that.data.includePoints.length < 4) {
                    that.data.includePoints.push(oilStationPriceObj);
                  }
                }
                that.data.circles = [{
                  longitude: userLocaltion.longitude,
                  latitude: userLocaltion.latitude,
                  color: "#B2B2B230",
                  fillColor: "#09BB0730",
                  radius: 3000
                }];
                //2.根据markerId将加油站图标数据进行更换，标明已经选中当前加油站
                var oilStationName = that.data.markers[0].title;
                that.data.title = oilStationName;
                if (oilStationName.length > 10) {
                  that.data.oilStationName = oilStationName.substr(0, 10) + '...';
                } else {
                  that.data.oilStationName = oilStationName;
                }
                that.data.oilStationAdress = that.data.markers[0].address;
                that.data.markerId = that.data.markers[0].id;
                that.data.latitude = that.data.markers[0].latitude;
                that.data.longitude = that.data.markers[0].longitude;
                that.data.oilStationPriceList = that.data.markers[0].oilStationPriceList;
                that.setData({
                  title: that.data.title,
                  markerId: that.data.markerId,
                  oilStationName: that.data.oilStationName,
                  oilStationAdress: that.data.oilStationAdress,
                  latitude: that.data.latitude,
                  longitude: that.data.longitude,
                  markers: that.data.markers,
                  circles: that.data.circles,
                  includePoints: that.data.includePoints,
                  oilStationPriceList: that.data.oilStationPriceList
                });
                //3.根据加油站数据进行渲染地图
                that.oilStationMap = wx.createMapContext("oilStationMap");
                //4.如果markerId不为空，则将地图进行挪动到选中加油站地址
                var markerId = that.data.markers[0].id;
                var latitude = that.data.markers[0].latitude;
                var longitude = that.data.markers[0].longitude;
                that.oilStationMap.translateMarker({
                  markerId: markerId,
                  autoRotate: true,
                  duration: 1000,
                  destination: {
                    latitude: latitude,
                    longitude: longitude
                  },
                  animationEnd() {
                    console.log("已经平移到最新的加油站: " + that.data.markers[0].title);
                  }
                });
                return that.oilStationMap;
              },
              fail: function () {
                wx.hideLoading();
                util.toast("不好意思，您的网络出了一会小差...");
              },
              complete: function () {
              }
            });
          }
        });
    },
    bindMarkerTapFunc: function (e) {                 //当点击某个加油站是触发
        var that = this;
        //判断点击的是付款按钮还是打赏按钮，付款按钮可以弹出窗口输入金额，打赏按钮默认打赏一元给开发者
        wx.showLoading({
            title: "客官请稍后...",
            mask: true
        });
        //重新组装加油站的信息，将选中的加油站图标设置为已选中
        //1.根据点击的选中的加油站markerId 获取 在markers中的数组坐标
        var markersArrIndex = 0;
        for (var item in that.data.markers) {
            if (e.markerId === that.data.markers[item].id) {
                markersArrIndex = item;
                break;
            }
        }
        var oilStationName = that.data.markers[markersArrIndex].title;
        if (oilStationName.length > 10) {
            that.data.oilStationName = oilStationName.substr(0, 10) + '...';
        } else {
            that.data.oilStationName = oilStationName;
        }
        that.data.oilStationAdress = that.data.markers[markersArrIndex].address;
        that.data.markerId = that.data.markers[markersArrIndex].id;
        that.data.latitude = that.data.markers[markersArrIndex].latitude;
        that.data.longitude = that.data.markers[markersArrIndex].longitude;
        that.data.oilStationPriceList = that.data.markers[markersArrIndex].oilStationPriceList;
        this.setData({
            title: that.data.oilStationName,
            markerId: that.data.markerId,
            oilStationName: that.data.oilStationName,
            oilStationAdress: that.data.oilStationAdress,
            latitude: that.data.latitude,
            longitude: that.data.longitude,
            // markers: that.data.markers,
            oilStationPriceList: that.data.oilStationPriceList
        });
        //3.根据加油站数据进行渲染地图
        // that.oilStationMap = wx.createMapContext("oilStationMap");
        // 4.如果markerId不为空，则将地图进行挪动到选中加油站地址
        this.oilStationMap.translateMarker({
            markerId: that.data.markers[markersArrIndex].id,
            autoRotate: true,
            duration: 5000,
            destination: {
                latitude: that.data.markers[markersArrIndex].latitude,
                longitude: that.data.markers[markersArrIndex].longitude
            },
            animationEnd() {
                console.log("已经平移到最新的加油站: " + that.data.markers[markersArrIndex].title);
            }
        });
        wx.hideLoading();         //关闭进度条
        return that.oilStationMap;
    },
    navigationToMap: function () {                     //到这去，导航
        var that = this;
        this.data.hiddenPayModel = false;
        this.setData({
          hiddenPayModel: this.data.hiddenPayModel
        });
        var longitude = Number(that.data.longitude);
        var latitude = Number(that.data.latitude);
        var name = that.data.oilStationName;
        var address = that.data.oilStationAdress;
        console.log("that.data.longitude = " + that.data.longitude);
        console.log("that.data.latitude = " + that.data.latitude);
        console.log("that.data.oilStationName = " + that.data.oilStationName);
        console.log("that.data.oilStationAdress = " + that.data.oilStationAdress);
        wx.openLocation({
            latitude: latitude,
            longitude: longitude,
            scale: 13,
            name: name,
            address: address
        });
    },
    bindregionchangeFunc: function (e) {             //视野发生移动变化时触发
        // console.log("================bindregionchangeFunc===============");
        // console.log(e);
        // this.oilStationMap.getScale({
        //   success: function (e) {
        //     console.log(e);
        //   }
        // });
    },
    bindcontroltapFunc: function (e) {                //点击控件时触发
        // var that = this;
        // console.log("scale===" + this.data.scale)
        // if (e.controlId === 1) {
        //     that.setData({
        //         scale: --this.data.scale
        //     });
        // } else {
        //     that.setData({
        //         scale: ++this.data.scale
        //     });
        // }
    },
    bindtapFunc: function (e) {                       //点击地图时触发
        // console.log("===================bindtapFunc===================");
        // console.log(e);
    }
})
