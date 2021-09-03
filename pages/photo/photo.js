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
        plain: false,
        loading: false,
        image1Src: '',
        canvas: null,
        context: null,
        x: 0,
        y: 0,
        dw: 200,
        dh: 200
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
        const query = wx.createSelectorQuery()
        query.select('#canvas1')
            .fields({
                node: true,
                size: true
            })
            .exec((res) => {
                const canvas = res[0].node
                canvas.width = this.data.dw
                canvas.height = this.data.dh
                const ctx = canvas.getContext('2d')
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
                // tempFilePath可以作为img标签的src属性显示图片
                const tempFilePaths = res.tempFilePaths
                wx.uploadFile({
                    url: 'http://localhost:8081/service/photo/getForeground',
                    filePath: tempFilePaths[0],
                    name: 'file',
                    success(res) {
                        let data = JSON.parse(res.data)
                        t.setData({
                            image1Src: 'data:image/png;base64,' + data.result
                        })
                        t.data.context.fillStyle = 'white';
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
        let canvas = this.data.canvas;
        // 创建一个图片
        const image = canvas.createImage()
        image.src = this.data.image1Src // 要加载的图片 url
        let context = this.data.context;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, this.data.x, this.data.y, this.data.dw, this.data.dh);
    }
})