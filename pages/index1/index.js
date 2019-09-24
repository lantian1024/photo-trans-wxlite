//index.js
//获取应用实例
const tool = require('./tool.js').tool
const app = getApp();
let ctx;

Page({
    data: {
        hasUserInfo: true,
        showImg: '',
        img: '',
        imgInfo: {},
        loading: false,

        gq: [{
            path: '/img/guoqi1.jpg',
            width: 295,
            height: 221
        }, {
            path: '/img/guoqi1.jpg',
            width: 100,
            height: 100
        }, {
            path: '/img/guoqi1.jpg',
            width: 100,
            height: 100
        } ]
    },
    imgPreview(){
        wx.previewImage({
            urls: [this.data.showImg]
        })
    },
    saveImg(){
        wx.saveImageToPhotosAlbum({
            filePath: this.data.showImg
        })
    },
    choseImg() {
        if (this.data.loading) return
        wx.chooseImage({
            count: 1,
            success: res=>{
                this.setData({
                    img: res.tempFilePaths[0]
                })
            }
        })
    },
    imgLoad(res){
        if (this.data.loading || !this.data.img) return
        if(res){
            this.setData({
                imgInfo: res.detail,
                loading: true,
                showImg: ''
            })
        }
        wx.showLoading({
            title: '图像处理中...',
        })
        console.log(this.data.imgInfo)
        const imgInfo = this.data.imgInfo
        const width = imgInfo.width
        const height = imgInfo.height

        const gq_info = this.data.gq[0]
        const gq_width = Math.floor(width*.3)
        const gq_height = Math.floor( gq_width * gq_info.height / gq_info.width )

        console.log(gq_width, gq_height)

        ctx.drawImage(this.data.img, 0, 0)
        ctx.draw()
        // ctx.drawImage(gq_info.path, 0, 0, gq_info.width, gq_info.height, width - gq_width, height - gq_height, gq_width, gq_height)
        ctx.drawImage(gq_info.path, 0, 0 )
        const s = gq_width / gq_info.width
        ctx.scale(s,s)
        ctx.draw(true)

        var failFun = ()=>{
            wx.hideLoading()
            this.setData({
                loading: false
            })
        }

       var draw = ()=>{ 
            wx.canvasToTempFilePath({
                x: 0,
                y: 0,
                width: width,
                height: height,
                destWidth: width,
                destHeight: height,
                canvasId: 'myCanvas',
                quality: 1,
                success: res => {
                    this.setData({
                        showImg: res.tempFilePath
                    })
                },
                complete: failFun
            })
        } 

        setTimeout(draw, 1000)

    },


    onLoad: function () {
        ctx = wx.createCanvasContext('myCanvas')
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.setData({
                                userInfo: res.userInfo,
                                img: res.userInfo.avatarUrl
                            })
                        }
                    })
                }else{
                    this.setData({
                        hasUserInfo: false
                    })
                }
            }
        })
    },
    getUserInfo: function (e) {
        this.setData({
            userInfo: e.detail.userInfo,
            img: e.detail.userInfo.avatarUrl,
            hasUserInfo: true
        })
    }
})
