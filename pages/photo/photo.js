// pages/photo.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        defaultSize: 'mini',
        primarySize: 'default',
        warnSize: 'default',
        disabled: false,
        isLoading: false,
        plain: false,
        loading: false,
        image1Src: '',
        canvas: null,
        context: null,
        x: 0,
        y: 0,
        dw: 100,
        dh: 100,
        image1: null,
        mvTid: null,
        chgTid: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        const query = wx.createSelectorQuery().in(this)
        query.select('#canvas1').fields({
            node: true,
            size: true
        }).exec((res) => {
            const canvas = res[0].node
            const ctx = canvas.getContext('2d')
            canvas.width = this.data.dw
            canvas.height = this.data.dh
            this.setData({
                canvas: canvas,
                context: ctx
            })
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    choosePhoto: function (event) {
        let t = this
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                t.setData({
                    isLoading: true
                })
                // tempFilePath可以作为img标签的src属性显示图片
                const tempFilePaths = res.tempFilePaths
                wx.uploadFile({
                    url: 'http://localhost:8081/service/photo/getForeground',
                    filePath: tempFilePaths[0],
                    name: 'file',
                    success(res) {
                        let data = JSON.parse(res.data)
                        t.setData({
                            image1Src: 'data:image/png;base64,' + data.result,
                            isLoading: false
                        })
                        t.data.context.fillStyle = "white";
                        t.drawImage();
                    }
                })
            }
        })
    },
    bthClick: function (event) {
        let context = this.data.context;
        context.fillStyle = event.target.dataset.color;
        this.drawImage();
    },
    drawImage: function () {
        let data = this.data
        let canvas = data.canvas;
        let context = data.context;
        // 创建一个图片 
        const image = canvas.createImage()
        image.src = data.image1Src // 要加载的图片 url
        image.width = data.dw
        image.height = data.dh
        image.onload = function () {
            console.log("图片加载完成")
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.drawImage(image, data.x, data.y, data.dw, data.dh);
        }
        image.onerror = function () {
            console.log("图片加载失败")
        }
    },
    btnStartMovePhoto: function (event) {
        let dataThis = this
        let a = parseInt(event.target.dataset.a)
        let b = parseInt(event.target.dataset.b)
        let mvTid = setInterval(function () {
            let x = dataThis.data.x + a
            let y = dataThis.data.y + b
            dataThis.setData({
                x: x,
                y: y
            })
            dataThis.drawImage();
        }, 50)
        this.setData({
            mvTid: mvTid
        })
    },
    btnEndMovePhoto: function () {
        clearInterval(this.data.mvTid);
    },
    btnStartChangePhoto: function (event) {
        let dataThis = this
        let a = parseInt(event.target.dataset.a)
        let chgTid = setInterval(function () {
            let dw = dataThis.data.dw + a;
            let dh = dataThis.data.dh + a
            dataThis.setData({
                dw: dw,
                dh: dh
            })
            dataThis.drawImage();
        }, 50)
        this.setData({
            chgTid: chgTid
        })
    },
    BtnEndChangePhoto: function () {
        clearInterval(this.data.chgTid);
    }
})