//index.js
//获取应用实例
const tool = require('./tool.js').tool
const app = getApp();
let ctx;

Page({
    data: {
        img: '',
        showImg: '',
        imgInfo: {},
        loading: false,

        openModeSetting: false,
        modeIndex: 2,
        modeConfig: {},
        mode: [{
            value: 'anti',
            name: '反色效果',
            configKey: ['r'],
            config: {
                r: {
                    name: '亮度因子',
                    value: 1,
                    max: 1.7,
                    min: .3,
                    step: .05
                }
            }
        }, {
            value: 'grayscale',
            name: '灰度效果',
            configKey: ['k', 'g', 'w'],
            config: {
                k: {
                    name: '阀值',
                    value: 128,
                    max: 255,
                    min: 0,
                    step: 1
                },
                g: {
                    name: '灰度因子',
                    value: 1,
                    max: 1.7,
                    min: .3,
                    step: 0.05
                },
                w: {
                    name: '亮度因子',
                    value: 1,
                    max: 1.7,
                    min: .3,
                    step: 0.05
                }
            }
        },{
            value: 'statue',
            name: '浮雕效果',
            configKey: ['k', 'g', 'w'],
            config: {
                k: {
                    name: '阀值',
                    value: 128,
                    max: 255,
                    min: 0,
                    step: 1
                },
                g: {
                    name: '灰度因子',
                    value: 1,
                    max: 1.7,
                    min: .3,
                    step: 0.05
                }, 
                w: {
                    name: '亮度因子',
                    value: 1,
                    max: 1.7,
                    min: .3,
                    step: 0.05
                }
            }
        },{
            value: 'pixel',
            name: '像素化',
            configKey: ['r'],
            config: {
                r: {
                    name: '像素化半径',
                    value: 19,
                    max: 51,
                    min: 9,
                    step: 2
                }
            }
        },{
            value: 'vague',
            name: '模糊效果',
            configKey: ['r'],
            config: {
                r: {
                    name: '模糊半径',
                    value: 21,
                    max: 51,
                    min: 9,
                    step: 2
                }
            }
        }]
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
        ctx.drawImage(this.data.img, 0, 0)
        ctx.draw(true, this.transImage)
    },
    // 转换图片
    transImage(){
        const imgInfo = this.data.imgInfo
        const width = imgInfo.width
        const height = imgInfo.height
        const modeConfig = this.data.mode[this.data.modeIndex]

        var failFun = ()=>{
            wx.hideLoading()
            this.setData({
                loading: false
            })
        }
        var drawImg = () => {
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
        wx.canvasGetImageData({
            canvasId:'myCanvas', 
            x: 0, 
            y: 0, 
            width: width, 
            height: height,
            success: res=>{
                var data = tool(res.data, modeConfig, imgInfo)

                wx.canvasPutImageData({
                    canvasId: 'myCanvas',
                    data: data,
                    x: 0,
                    y: 0,
                    width: width,
                    height: height,
                    success: res => {
                        drawImg()
                    },
                    fail: failFun
                })
                console.log(2)

            },
            fail: failFun
        })
    },
    // 选择模式
    choseMode(e){
        const index = e.currentTarget.dataset.index
        this.setData({
            modeIndex: index
        })
        wx.nextTick(() => {
            this.imgLoad()
        })
    },
    // 打开设置参数
    openModeConfig() {
        const index = this.data.modeIndex
        const modeConfig = JSON.parse(JSON.stringify(this.data.mode[index]))
        this.setData({
            modeConfig: modeConfig,
            openModeSetting: true
        })
    },
    // 取消设置参数
    cancelConfig() {
        this.setData({
            openModeSetting: false
        })
    },
    // 滑块变动
    sliderChange(e) {
        const key = e.currentTarget.dataset.key
        const modeConfig = this.data.modeConfig
        modeConfig.config[key].value = e.detail.value
        this.setData({
            modeConfig: modeConfig
        })
    },
    // 确定设置参数
    confirmConfig() {
        const index = this.data.modeIndex
        const modeConfig = JSON.parse(JSON.stringify(this.data.modeConfig))
        this.setData({
            [`mode[${index}]`]: modeConfig,
            openModeSetting: false
        })
        wx.nextTick(() => {
            this.imgLoad()
        })
    },
    openIndex1(){
        wx.navigateTo({
            url: '/pages/index1/index',
        })
    },
    onLoad: function () {
        ctx = wx.createCanvasContext('myCanvas')
    }
})
