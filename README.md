# H5-RAPP
基于hbuilderIDE的5+runtime Hybrid App再次进行封装，方便快速开发混合APP应用，H5+API网址为：http://www.html5plus.org/doc/

###全局变量：rap

####初始化摄像头
rap.init()
默认能够识别的条码/二维码有：二维码，128商品条码，因为次参数不常改变，不作为参数传递，如需修改可直接更改init函数里面的filter数组，*声明：数组值越多，识别速度降低*

>识别类型常量：如：plus.barcode.CODE128
常量包含：QR,EAN13,EAN8,AZTEC,DATAMATRIX,UPCA,UPCE,CODABAR,CODE39,CODE93,CODE128,ITF,MAXICODE,RDF417,RSS14,RSSEXPANDED

####获取当前窗口
rap.currenWebview()
>获取当前窗口并返回该窗口对象

####根据窗口ID获取窗口对象
rap.getWebview(id)
>id: String类型

####打开窗口
rap.openWebview(url,id)
>url :要打开页面的url,String类型
id：窗口的ID，String类型

####打开扫描页面
rap.plus_barcode(callback,consecutive,time,deviceStyle)
>callback[res]：回调函数，回调函数应该包括res,即扫描结果
consecutive: boolean类型，是否开启连续扫描，默认值为false
time:int类型，开启连续扫描时候的扫描间隔时间
deviceStyle：JSON类型，扫描时候设备的属性和行为，conserve(boolean类型)，是否保存成功扫描到的条码数据时的截图，默认值为false

filename：String类型，保存成功扫描到条码数据时的图片路径

vibrate: Boolean类型，扫描成功时是否震动提醒，默认为FALSE

sound ：String 类型，扫描成功时的声音，默认为default 播放提示音，none -不播放:

