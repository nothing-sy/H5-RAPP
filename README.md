# H5-RAPP
基于hbuilderIDE的5+runtime Hybrid App再次进行封装，方便快速开发混合APP应用，H5+API网址为：http://www.html5plus.org/doc/

### 全局变量：rap

#### 初始化摄像头
`rap.init()`<br/>
默认能够识别的条码/二维码有：二维码，128商品条码，因为次参数不常改变，不作为参数传递，如需修改可直接更改init函数里面的filter数组，*声明：数组值越多，识别速度降低*

>识别类型常量：如：plus.barcode.CODE128
常量包含：QR,EAN13,EAN8,AZTEC,DATAMATRIX,UPCA,UPCE,CODABAR,CODE39,CODE93,CODE128,ITF,MAXICODE,RDF417,RSS14,RSSEXPANDED

#### 获取当前窗口
`rap.currenWebview()`
>获取当前窗口并返回该窗口对象

#### 根据窗口ID获取窗口对象
`rap.getWebview(id)`
>id: String类型<br/>

#### 打开窗口
`rap.openWebview(url,id)`<br/>
>url :要打开页面的url,String类型<br/>
id：窗口的ID，String类型<br/>

#### 打开扫描页面
`rap.plus_barcode(callback,consecutive,time,deviceStyle)`<br/>
>callback[res]：回调函数，回调函数应该包括res,即扫描结果<br/>
>consecutive: boolean类型，是否开启连续扫描，默认值为false<br/>
>time:int类型，开启连续扫描时候的扫描间隔时间<br/>


>deviceStyle JSON数据
 注明：该参数在真机调试的时候无效，需要打包生成APP后才有效<br/>
 属性：<br/>
>conserve:(Boolean 类型 )是否保存成功扫描到的条码数据时的截图
如果设置为true则在成功扫描到条码数据时将图片保存，并通过onmarked回调函数的file参数返回保存文件的路径。默认值为false，不保存图片。<br/>
<br/>filename: (String 类型 )保存成功扫描到的条码数据时的图片路径<br/><br/>
可通过此参数设置保存截图的路径或名称，如果设置图片文件名称则必须指定文件的后缀名（必须是.png），否则认为是指定目录，文件名称则自动生成。<br/>
<br/>vibrate: (Boolean 类型 )成功扫描到条码数据时是否需要震动提醒<br/><br/>
如果设置为true则在成功扫描到条码数据时震动设备，false则不震动。默认值为true。<br/>
<br/>sound: (String 类型 )成功扫描到条码数据时播放的提示音类型<br/><br/>
可取值： "none" - 不播放提示音； "default" - 播放默认提示音（5+引擎内置）。 默认值为"default"。<br/>


#### 跨域处理
`rap.jsonp(url,callbackFun,data);`<br/>
此跨域方式为JQ提供的JSONP跨域处理，并非CORS跨域处理方式，故而只能以GET的形式获取参数

>url 请求地址 <br/>
callbackFun 回调函数名<br/>
data 传递的数据<br/>
```
前端：rap.jsonp('xx','getlist',{});
function getlist(data){
//回调函数的处理操作,【注意】回调函数必须写在全局环境，不允许定义在某个函数内部，比如$(function(){})里面
}

后台返回内容： 先获取 参数名为callback的值再拼接起来返回给前端
$Fname=$_GET['callback'];
echo $Fname.'('.data.')';//data为返回给前端的JSON字符串

```
#### 获取8位随机数
`rap.getUid();`

#### 跨窗口传递参数

`rap.fire(sendWebview,receiveWebview, eventType, data);`
>sendWebview 发送源窗口对象<br/>
receiveWebview 接收窗口对象<br/>
eventType 自定义监听函数名<br/>
data 传递的JSON数据<br/>

#### 跨窗口接收数据
`rap.receive(eventType, callback)`
>eventType 自定义监听函数名，必须与rap.fire中的eventType保持一致。<br/>
callback[sendWebviewid,data] sendWebviewid 为发送源的窗口ID，data是传过来的JSON数据<br/>

```JS
//A窗口发送数据到B窗口,【伪代码】
//A窗口代码
rap.fire(A,B,'getData',{{name:'heartOfblack'}});
//B窗口代码
rap.receive('getData',function(wsid,data){

console.log(wsid+data.name);//输出A窗口的窗口对象ID和传递的JSON数据name
})

```


