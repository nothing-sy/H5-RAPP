/*
 * 二次封装了H5+的接口，尽可能让开发者专注于业务逻辑而不是功能调用，因为5+API的接口本身也是在完善当中，所以这里作用是尽可能处理官方问题。
 * 作者：陈思远
 * 时间:2017/8/12
 * 
 * 
 * */

(function() {
	//摄像头的全局参数，方便如扫描接口，拍摄接口等需要用到摄像头的接口调用
	var scan, filter, barcode_styles, camera; //分别是：条码扫描控件对象，条码识别对象的识别类型（包括二维码和各种类型条码），条码扫描控件对象的样式（无效），摄像头对象
	
	//H5-(rap)P,为了方便简写，使用rap 作为全局变量,本身我也挺喜欢说唱的
	rap = {
		//
		/**
		 * 摄像头初始化
		 */
		init: function() {
			scan = null; //条码识别对象
			filter = [plus.barcode.CODE128, plus.barcode.QR]; 
//根据个人需求初始化相关类型，类型过多，控件识别时间会明细增加，识别率降低，建议只初始化自己需要的几种参数
/*条码识别对象的识别类型,
常量：
QR: 条码类型常量，QR二维码，数值为0
EAN13: 条码类型常量，EAN一维条形码码标准版，数值为1
EAN8: 条码类型常量，ENA一维条形码简版，数值为2
AZTEC: 条码类型常量，Aztec二维码，数值为3
DATAMATRIX: 条码类型常量，Data Matrix二维码，数值为4
UPCA: 条码类型常量，UPC码标准版，数值为5
UPCE: 条码类型常量，UPC码缩短版，数值为6
CODABAR: 条码类型常量，Codabar码，数值为7
CODE39: 条码类型常量，Code39一维条形码，数值为8
CODE93: 条码类型常量，Code93码，数值为9
CODE128: 条码类型常量，Code128码，数值为10
ITF: 条码类型常量，ITF码，数值为11
MAXICODE: 条码类型常量，MaxiCode二维码，数值为12
PDF417: 条码类型常量，PDF 417码，数值为13
RSS14: 条码类型常量，RSS 14组合码，数值为14
RSSEXPANDED: 条码类型常量，扩展式RSS组合码，数值为15*/
			barcode_styles = {
				"frameColor": 'blue',
				"scanbarColor": 'blue',
				"background": "blue"
			}; //扫描框的样式

		},

		/**
		 * 连续扫描二维码、条码
		 * @param {Object} _callback 回调函数function(result) 
		 * @param {Object} consecutive 是否连续扫描 默认false
		 * @param {Object} time 连续扫描间隔 默认1300毫秒
		 */
		plus_barcode: function(_callback, consecutive ,time) {
			consecutive=arguments[1]? consecutive : false;//是否连续扫描,默认只扫描一次
			time = arguments[2] ? time : 1300; //默认间隔1300毫秒
			scan = new plus.barcode.Barcode('bcid', filter, barcode_styles);
			/*
			 注明：该参数在真机调试的时候无效，需要打包生成APP后才有效
			 属性：
conserve: (Boolean 类型 )是否保存成功扫描到的条码数据时的截图
如果设置为true则在成功扫描到条码数据时将图片保存，并通过onmarked回调函数的file参数返回保存文件的路径。默认值为false，不保存图片。

filename: (String 类型 )保存成功扫描到的条码数据时的图片路径
可通过此参数设置保存截图的路径或名称，如果设置图片文件名称则必须指定文件的后缀名（必须是.png），否则认为是指定目录，文件名称则自动生成。

vibrate: (Boolean 类型 )成功扫描到条码数据时是否需要震动提醒
如果设置为true则在成功扫描到条码数据时震动设备，false则不震动。默认值为true。

sound: (String 类型 )成功扫描到条码数据时播放的提示音类型
可取值： "none" - 不播放提示音； "default" - 播放默认提示音（5+引擎内置）。 默认值为"default"。
			 * */
			scan.start({
				conserve: false,
				vibrate: false,
				sound: "default"
			});
			scan.onmarked = function(type, result) {
				//console.log(type);
				_callback(result);
if(consecutive)
{
	
	setTimeout(function() {
					scan.start();
				}, time);
	
}
				

			};
		},
		
		//拍照并保存到系统相册
		plus_camera_save: function(_callback, _index) {
			//index:1 主摄像头，2前置摄像头
			var _index = arguments[1] ? _index : '1';
			camera = plus.camera.getCamera();
			var res_arr = camera.supportedImageResolutions;
			var res = res_arr[0];
			//plus.nativeUI.alert('拍照像素'+res);
			var fmt = camera.supportedImageFormats[0];

			camera.captureImage(function(path) {

				plus.gallery.save(path); //拍照成功后保存到系统相册

				return _callback(path); //压缩后的图像
			}, {
				filename: '_doc/',
				format: fmt,
				resolution: res,
				index: _index
			});

		},
		//显示图片 ,配合拍照使用
		plus_show_picture: function(_callback, path) {
			plus.io.resolveLocalFileSystemURL(path, function(entry) { //传入_doc这种路径，返回绝对路径

				var img_path = entry.toLocalURL(); //获得图片路径
				return _callback(img_path);
			})

		},

		//文件上传
		plus_upload_files: function(files_array, _callback, upload_path, key, yid) {
			//参数：文件数组，回调函数，files_array：文件路径数组
			var files = [];
			$.each(files_array, function(i) {
				console.log(files_array[i]);
				files.push({
					name: key + i,
					base64: files_array[i]
				});

			});

			//创建任务管理对象
			var task = plus.uploader.createUpload(upload_path, {
					method: 'POST'
				},
				function(t, status) {
					// 上传完成
					if(status == 200) {

						plus.nativeUI.toast('图片上传成功');
						plus.nativeUI.closeWaiting();
						plus.nativeUI.showWaiting('签收中...');
						var cur_user = JSON.parse(localStorage.getItem('user_login')).user;
						//console.log(cur_user);
						ks.jsonp(conf.Fcheck_waybill, 'update_statu', {
							cact: 'update',
							yd_no: vm.yd_no,
							user_account: cur_user,
							npic: files.length + ''

						});

					} else {
						//mui.alert( "上传失败");
						plus.nativeUI.closeWaiting();
						plus.nativeUI.alert('图片上传失败');
					}

				}

			);

			var file_number = task.addData('file_number', files_array.length + ''); //必须是字符串
			var yd_no = task.addData('key', key); //运单号作为后台获取file的key
			//console.log(typeof yid);
			var yid = task.addData('yd_id', yid + ''); //运单号作为后台获取file的yid 该字符需要字符串
			//console.log(yid);
			var Uid = task.addData('Uid', this.getUid()); //随机数，为了让添加的数据不重复，否则会添加数据失败
			var cur_user = JSON.parse(localStorage.getItem('user_login')).user;
			var creatname = task.addData('creatname', cur_user);
			console.log('addDATA参数：' + file_number + '&&' + Uid + '&&' + yd_no + '&&' + yid);

			if(file_number && Uid && yd_no && yid) {

				for(var i = 0; i < files_array.length; i++) { //添加上传文件,key是后台获取数据的关键词,这里统一为：uploadkey0   uploadkey1.....通过上面的addData filenumber区分
					/*task_areally = task.addFile(files[i].path, {
						key: files[i].name
					});*/ //原本是上传图片，但是无法压缩，现在改为上传base64数据
					//console.log('添加数据前' + files[i].base64);
					//console.log('添加数据前的KEY' + key + i);
					task.addData(key + i, files[i].base64);

				}
				//if(task_areally) { //如果添加成功，开始上传
				plus.nativeUI.showWaiting('图片上传中...');
				task.start();
				return _callback();
				//}

			} else {
				plus.nativeUI.alert('上传失败');

			}

		},
		plus_upload_exception_files: function(files_array, _callback, upload_path, key, yid) {
			//参数：文件数组，回调函数，files_array：文件路径数组
			var files = [];
			$.each(files_array, function(i) {
				console.log(files_array[i]);
				files.push({
					name: key + i,
					base64: files_array[i]
				});

			});

			//创建任务管理对象
			var task = plus.uploader.createUpload(upload_path, {
					method: 'POST'
				},
				function(t, status) {
					// 上传完成
					if(status == 200) {

						plus.nativeUI.toast('图片上传成功');
						plus.nativeUI.closeWaiting();
						plus.nativeUI.showWaiting('登记中...');
						var cur_user = JSON.parse(localStorage.getItem('user_login')).user;
						//console.log(cur_user);
						ks.jsonp(conf.Fexception_register, 'insert_exception', {
							cact: 'insert',
							yid: vm.yid,
							dp_qty: vm.exception_qty,
							ab_remark: vm.exception_desc,
							npic: files.length + ''
						});
						//异常登记接口

					} else {
						//mui.alert( "上传失败");
						plus.nativeUI.closeWaiting();
						plus.nativeUI.alert('图片上传失败');
					}

				}

			);

			var file_number = task.addData('file_number', files_array.length + ''); //必须是字符串
			var yd_no = task.addData('key', key); //运单号作为后台获取file的key
			//console.log(typeof yid);
			var yid = task.addData('yd_id', yid + ''); //运单号作为后台获取file的yid 该字符需要字符串
			//console.log(yid);
			var Uid = task.addData('Uid', this.getUid()); //随机数，为了让添加的数据不重复，否则会添加数据失败
			var cur_user = JSON.parse(localStorage.getItem('user_login')).user;
			var creatname = task.addData('creatname', cur_user);
			console.log('addDATA参数：' + file_number + '&&' + Uid + '&&' + yd_no + '&&' + yid);

			if(file_number && Uid && yd_no && yid) {

				for(var i = 0; i < files_array.length; i++) { //添加上传文件,key是后台获取数据的关键词,这里统一为：uploadkey0   uploadkey1.....通过上面的addData filenumber区分
					/*task_areally = task.addFile(files[i].path, {
						key: files[i].name
					});*/ //原本是上传图片，但是无法压缩，现在改为上传base64数据
					//console.log('添加数据前' + files[i].base64);
					//console.log('添加数据前的KEY' + key + i);
					task.addData(key + i, files[i].base64);

				}
				//if(task_areally) { //如果添加成功，开始上传
				plus.nativeUI.showWaiting('图片上传中...');
				task.start();
				return _callback();
				//}

			} else {
				plus.nativeUI.alert('上传失败');

			}

		},

		getUid: function() { //获取随机数
			return Math.floor(Math.random() * 100000000 + 10000000).toString();
		},

		/**
		 * 监听函数
		 * @param {Object} eventType 自定义事件类型
		 * @param {Function} callback webviewid和JSON数据
		 */
		receive: function(eventType, callback) {
			eval(eventType + '=' + callback + ';');

		},

		/**
		 *像窗口发送数据
		 * @param {Object} webview 目标窗口
		 * @param {Object} eventType 自定义事件名
		 * @param {Object} data JSON数据
		 */
		fire: function(webview, eventType, data) {
			var data = JSON.stringify(data || {});
			webview.evalJS(eventType + '("' + webview.id + '",' + data + ')');
		},
		jsonp: function(url, callbackFunc, data, type) //跨域请求
		{

			var data = arguments[2] ? arguments[2] : ''; //默认参数为空
			var type = arguments[3] ? arguments[3] : 'get'; //默认类型为GET

			if(url != '' && callbackFunc != '') {
				$.ajax({
					type: type,
					dataType: 'jsonp',
					url: url,
					jsonp: "callback",
					jsonpCallback: callbackFunc,
					data: data,
					async: true,
					success: function(data) {
						console.log('跨域请求成功');
						//mui.alert('跨域请求成功');

					},
					error: function() {

						console.log('跨域请求失败');

						//mui.alert('跨域请求失败')

					}
				});

			} else
				alert('URL，回调函数不能为空');

		},
		update_ksd: function(url, app_name) {
			console.log(url);
			var dtask = plus.downloader.createDownload(url, {}, function(d, status) {
				// 下载完成
				if(status == 200) {
					plus.nativeUI.toast("下载成功，准备安装" + d.filename);
					//安装程序,因为无法主动删除安装包，所以先判断程序是否存在
					//var install_name='_downloads/ksd.apk';//如果程序存在，下载后的安装名后面会加上(i)的字样,默认为这个

					plus.runtime.install('_downloads/' + app_name + '.apk', {}, function() {
						plus.nativeUI.toast('安装成功');
					}, function() {
						plus.nativeUI.toast('安装失败');
					});

					plus.nativeUI.closeWaiting();
				} else {
					alert("下载失败 " + status);

				}
			});
			//dtask.addEventListener( "statechanged", onStateChanged, false );
			dtask.start();
		}

		// window.ks结束		
	}

})()