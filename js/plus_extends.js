(function() {
	var scan, filter, barcode_styles, camera;

	ks = {
		//
		/**
		 * 摄像头初始化
		 */
		init: function() {
			scan = null; //条码识别对象
			filter = [plus.barcode.CODE128, plus.barcode.QR]; //条码识别对象的识别类型
			barcode_styles = {
				"frameColor": 'blue',
				"scanbarColor": 'blue',
				"background": "blue"
			}; //扫描框的样式

		},

		//
		/**
		 * 连续扫描二维码、条码
		 * @param {Object} _callback 回调函数，参数为查询结果
		 * @param {Object} time  连续扫描间隔
		 */
		plus_barcode_continue: function(_callback, time) {
			time = arguments[1] ? time : 1300; //默认间隔1300秒
			//barcode_setTime=time;

			scan = new plus.barcode.Barcode('bcid', filter, barcode_styles);
			scan.start({
				conserve: false,
				vibrate: false,
				sound: "default"
			});
			scan.onmarked = function(type, result) {
				//console.log(type);
				_callback(result);

				setTimeout(function() {
					scan.start();
				}, time);

			};
		},

		//条码、二维码扫描一次
		plus_barcode_once: function(_callback) {
			scan = new plus.barcode.Barcode('bcid', filter, barcode_styles);
			scan.start({
				conserve: false,

				vibrate: false,
				sound: "default"
			});
			scan.onmarked = function(type, result) {

				_callback(result);

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
								user_account:cur_user,
								npic:files.length+''
								
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
			console.log('addDATA参数：'+file_number+ '&&'+ Uid +'&&'+ yd_no +'&&'+ yid);
			
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
								npic:files.length+''
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
			console.log('addDATA参数：'+file_number+ '&&'+ Uid +'&&'+ yd_no +'&&'+ yid);
			
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
		update_ksd:function(url,app_name){
			console.log(url);
			var dtask = plus.downloader.createDownload(url,{}, function ( d, status ) {
		// 下载完成
		if ( status == 200 ) { 
			plus.nativeUI.toast( "下载成功，准备安装" + d.filename );
			//安装程序,因为无法主动删除安装包，所以先判断程序是否存在
			//var install_name='_downloads/ksd.apk';//如果程序存在，下载后的安装名后面会加上(i)的字样,默认为这个
			
		
			
				plus.runtime.install('_downloads/'+app_name+'.apk',{},function(){
				plus.nativeUI.toast('安装成功');},function(){plus.nativeUI.toast('安装失败');});
				

			
				
			plus.nativeUI.closeWaiting();
		} else {
			 alert( "下载失败 " + status ); 
			
		}  
	});
	//dtask.addEventListener( "statechanged", onStateChanged, false );
	dtask.start(); 
}
			
			
			
		

		// window.ks结束		
	}

})()