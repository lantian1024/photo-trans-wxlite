//index.js
//获取应用实例
const app = getApp();
let ctx;

Page({
    data: {
        hasUserInfo: true,
        showImg: '',
        img: '/img/wechat.png',
        imgInfo: {},
        loading: false,
        modeIndex: 0,

        gq: [{
            path: '/img/guoqi1.png',
            width: 167,
            height: 128,
            scale: 1.92
        }, {
            path: '/img/guoqi2.png',
            width: 128,
            height: 128,
            scale: 2.5
        }, {
            path: '/img/guoqi3.png',
            width: 128,
            height: 128,
            scale: 2.5
        }, {
            path: '/img/guoqi4.png',
            width: 128,
            height: 128,
            scale: 2.5
        } ]
    },
    imgPreview(){
        wx.previewImage({
            urls: [this.data.showImg]
        })
    },
    saveImg(){
        wx.saveImageToPhotosAlbum({
            filePath: this.data.showImg,
            success: ()=>{
                wx.showToast({
                    title: '保存成功',
                    // image: '../../img/wn.png',
                    duration: 2000
                })
            }
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
                // imgInfo: res.detail,
                loading: true,
                showImg: ''
            })
        }
        wx.showLoading({
            title: '图像处理中...',
        })
        // const imgInfo = this.data.imgInfo
        // const width = imgInfo.width
        // const height = imgInfo.height

        const gq_info = this.data.gq[this.data.modeIndex]
        // const gq_width = 320
        // const gq_height = Math.floor( gq_width * gq_info.height / gq_info.width )

        // console.log(gq_width, gq_height)

        ctx.clearRect(0, 0, 1000, 1000)

        var failFun = () => {
            wx.hideLoading()
            this.setData({
                loading: false
            })
        }

        var draw = () => {
            wx.canvasToTempFilePath({
                x: 0,
                y: 0,
                width: 1000,
                height: 1000,
                destWidth: 500,
                destHeight: 500,
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

        if (/img\/wechat.png/.test(this.data.img)){
            ctx.drawImage(this.data.img, 0, 0, 1000, 1000)
            ctx.drawImage(gq_info.path, 0, 0, gq_info.width, gq_info.height, 1000 - gq_info.width * gq_info.scale, 1000 - gq_info.height * gq_info.scale, gq_info.width * gq_info.scale, gq_info.height * gq_info.scale)
            ctx.draw(true)

            setTimeout(draw, 100)
        }else{
            wx.getImageInfo({
                src: this.data.img,
                success: res => {
                    console.log(res)
                    //res.path 为getImageInfo预加载的缓存图片地址
                    ctx.drawImage(res.path, 0, 0, 1000, 1000)
                    ctx.drawImage(gq_info.path, 0, 0, gq_info.width, gq_info.height, 970 - gq_info.width * gq_info.scale, 970 - gq_info.height * gq_info.scale, gq_info.width * gq_info.scale, gq_info.height * gq_info.scale)
                    ctx.draw(true)

                    setTimeout(draw, 100)
                }
            });
        }

    },
    choseMode(e) {
        const index = e.currentTarget.dataset.index
        if (index == this.data.modeIndex) return

        this.setData({
            modeIndex: index
        })
        this.imgLoad()
    },
    openIndex(){
        wx.navigateTo({
            url: '/pages/index/index',
        })
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
                                loading: false,
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
        if (e.detail.userInfo){
            this.setData({
                loading: false,
                userInfo: e.detail.userInfo,
                img: e.detail.userInfo.avatarUrl,
                hasUserInfo: true
            })
        }else{
            // this.openIndex()
            // wx.showToast({
            //     title: '没图没真相啊',
            //     image: '../../img/wn.png',
            //     duration: 2000
            // })
        }
    }
})
