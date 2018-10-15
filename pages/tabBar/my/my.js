// 可以参考别人写的 裁剪组件https://github.com/we-plugin/we-cropper

//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        tableData: [
            {
                "id": "1",
                "name": "添加油价",
                "page": "my/oilStationAdd/index"
            },
            //  {
            //     "id": "2",
            //     "name": "积分兑换",
            //     "page": "my/method/index"
            // },
             {
                "id": "3",
                "name": "使用方法",
                "page": "my/method/index"
            }, {
                "id": "4",
                "name": "如何找到",
                "page": "my/howFind/index"
            }, {
                "id": "5",
                "name": "意见反馈",
                "page": "my/feedback/index"
            }, {
                "id": "6",
                "name": "关于我们",
                "page": "my/aboutUs/index"
            }
        ],
        userInfo: {},
        noCard: false
    },
    onLoad: function () {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            });
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            // wx.getUserInfo({
            //   success: res => {
            //     app.globalData.userInfo = res.userInfo
            //     this.setData({
            //       userInfo: res.userInfo,
            //       hasUserInfo: true
            //     });
            //   }
            // });
        }
    },
    onShow: function () {
        wx.showTabBar();
    }
})