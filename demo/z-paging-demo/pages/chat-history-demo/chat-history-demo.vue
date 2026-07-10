<!-- 聊天记录模式演示(vue)，加载更多聊天记录无闪动 -->
<!-- nvue的聊天记录模式中需要写@cellStyleChange="cellStyleChange"，如果需要兼容nvue和vue，请以nvue中写法为准，会自动兼容vue -->
<!-- 注意，此写法由于将列表倒置了，在iOS15以下和部分较低版本安卓中可能出现列表无法滚动的问题，此时建议使用z-paging 2.7.0以下的版本及写法 -->
<template>
	<view class="content">
		<!-- use-chat-record-mode：开启聊天记录模式 -->
		<!-- safe-area-inset-bottom：开启底部安全区域适配 -->
		<!-- bottom-bg-color：设置slot="bottom"容器的背景色，这里设置为和chat-input-bar的背景色一致 -->
		<z-paging ref="paging" v-model="dataList" use-chat-record-mode safe-area-inset-bottom auto-to-bottom-when-chat bottom-bg-color="#f8f8f8"
		@query="queryList" @keyboardHeightChange="keyboardHeightChange" @hidedKeyboard="hidedKeyboard">
			<!-- 顶部提示文字 -->
			<!-- #ifdef H5 || MP-BAIDU || MP-TOUTIAO -->
			<template #top>
				<view class="header">由于在H5、百度小程序、抖音小程序、飞书小程序中无法监听键盘高度变化，底部输入框切换时可能会有些bug，请运行在其他平台体验最佳效果</view>
			</template>
			<!-- #endif -->
			
			<!-- for循环渲染聊天记录列表 -->
			<view v-for="(item,index) in dataList" :key="index" style="position: relative;">
				<!-- 如果要给聊天item添加长按的popup，请在popup标签上写style="transform: scaleY(-1);"，注意style="transform: scaleY(-1);"不要写在最外层，否则可能导致popup被其他聊天item盖住 -->
				<!-- <view class="popup" style="transform: scaleY(-1);">popUp</view> -->
				
				<!-- style="transform: scaleY(-1)"必须写，否则会导致列表倒置 -->
				<!-- 注意不要直接在chat-item组件标签上设置style，因为在微信小程序中是无效的，请包一层view -->
				<view style="transform: scaleY(-1);">
					<chat-item :item="item"></chat-item>
				</view>
			</view>
			<!-- 底部聊天输入框 -->
			<template #bottom>
				<chat-input-bar ref="inputBar" @send="doSend" @focus="onInputFocus" @blur="onInputBlur" />
			</template>
		</z-paging>
	</view>
</template>

<script>
	export default {
	data() {
		return {
			// v-model绑定的这个变量不要在分页请求结束中自己赋值！！！
			dataList: [],
			androidKeyboardCompat: null,
			lastUniKeyboardHeight: 0,
			inputFocused: false,
			focusViewportHeight: 0,
			baseWindowMetrics: null,
			adjustPositionInvalidLogged: false
		}
	},
	onShow() {
		this.initAndroidKeyboardCompat();
	},
	onHide() {
		this.disposeAndroidKeyboardCompat();
	},
	onUnload() {
		this.disposeAndroidKeyboardCompat();
	},
	methods: {
		getViewportHeight() {
			// #ifdef APP-PLUS || H5
			if (typeof window !== 'undefined' && window.innerHeight) {
				return Number(window.innerHeight) || 0;
			}
			// #endif
			return uni.getSystemInfoSync().windowHeight;
		},
		initAndroidKeyboardCompat() {
			// #ifdef APP-PLUS
			if (this.androidKeyboardCompat || plus.os.name !== 'Android') return;
			const activity = plus.android.runtimeMainActivity();
			const window = activity.getWindow();
			plus.android.importClass(window);
			const decorView = window.getDecorView();
			plus.android.importClass(decorView);
			const observer = decorView.getViewTreeObserver();
			plus.android.importClass(observer);
			const Rect = plus.android.importClass('android.graphics.Rect');
			const compatState = {
				observer,
				decorView,
				lastKeyboardHeight: 0,
				latestMetrics: null
			};
			compatState.listener = plus.android.implements('android.view.ViewTreeObserver$OnGlobalLayoutListener', {
				onGlobalLayout: () => {
					const metrics = this.getAndroidWindowMetrics(Rect, decorView);
					compatState.latestMetrics = metrics;
					if (metrics && metrics.keyboardHeight < 150) {
						this.baseWindowMetrics = { ...metrics, keyboardHeight: 0 };
					}
					let keyboardHeight = metrics.keyboardHeight;
					if (keyboardHeight < 150) {
						keyboardHeight = 0;
					}
					if (keyboardHeight === compatState.lastKeyboardHeight) return;
					compatState.lastKeyboardHeight = keyboardHeight;
					this.detectAdjustPositionFailureByWindow(keyboardHeight, metrics);
				}
			});
			observer.addOnGlobalLayoutListener(compatState.listener);
			this.androidKeyboardCompat = compatState;
			// #endif
		},
		onInputFocus() {
			this.inputFocused = true;
			this.adjustPositionInvalidLogged = false;
			this.lastUniKeyboardHeight = 0;
			this.focusViewportHeight = this.getViewportHeight();
			console.log('[chat-history-demo] focus窗口数据', {
				focusViewportHeight: this.focusViewportHeight,
				baseWindowMetrics: this.baseWindowMetrics,
				currentWindowMetrics: this.getCurrentAndroidWindowMetrics()
			});
		},
		onInputBlur() {
			this.inputFocused = false;
			this.adjustPositionInvalidLogged = false;
			this.focusViewportHeight = 0;
			this.lastUniKeyboardHeight = 0;
		},
		getAndroidWindowMetrics(RectClass, decorView) {
			// #ifdef APP-PLUS
			const RectCtor = RectClass || plus.android.importClass('android.graphics.Rect');
			const targetDecorView = decorView || this.androidKeyboardCompat && this.androidKeyboardCompat.decorView;
			if (!targetDecorView) return null;
			const rect = new RectCtor();
			targetDecorView.getWindowVisibleDisplayFrame(rect);
			const rootView = targetDecorView.getRootView();
			plus.android.importClass(rootView);
			const rootHeight = Number(rootView.getHeight()) || 0;
			const top = Number(plus.android.getAttribute(rect, 'top')) || 0;
			const bottom = Number(plus.android.getAttribute(rect, 'bottom')) || 0;
			const visibleHeight = Math.max(0, bottom - top);
			return {
				top,
				bottom,
				visibleHeight,
				rootHeight,
				keyboardHeight: Math.max(0, rootHeight - bottom)
			};
			// #endif
			return null;
		},
		getCurrentAndroidWindowMetrics() {
			// #ifdef APP-PLUS
			if (plus.os.name !== 'Android') return null;
			if (this.androidKeyboardCompat && this.androidKeyboardCompat.latestMetrics) {
				return { ...this.androidKeyboardCompat.latestMetrics };
			}
			// #endif
			return null;
		},
		detectAdjustPositionFailureByWindow(keyboardHeight, metrics) {
			if (!this.inputFocused || !keyboardHeight || this.adjustPositionInvalidLogged) return;
			const baseMetrics = this.baseWindowMetrics;
			if (!baseMetrics || !metrics) return;
			const visibleHeightOffset = baseMetrics.visibleHeight - metrics.visibleHeight;
			const topOffset = metrics.top - baseMetrics.top;
			const viewportHeight = this.getViewportHeight();
			console.log('[chat-history-demo] 窗口失效检测数据', {
				keyboardHeight,
				uniKeyboardHeight: this.lastUniKeyboardHeight,
				viewportHeight,
				baseTop: baseMetrics.top,
				currentTop: metrics.top,
				baseVisibleHeight: baseMetrics.visibleHeight,
				currentVisibleHeight: metrics.visibleHeight,
				visibleHeightOffset,
				topOffset
			});
			const windowResizedBySystem = visibleHeightOffset > Math.max(60, keyboardHeight * 0.2);
			const windowMovedBySystem = topOffset > Math.max(20, keyboardHeight * 0.08);
			if (windowResizedBySystem || windowMovedBySystem) {
				this.adjustPositionInvalidLogged = true;
				console.warn('[chat-history-demo] 检测到adjust-position=false失效', {
					keyboardHeight,
					uniKeyboardHeight: this.lastUniKeyboardHeight,
					viewportHeight,
					baseTop: baseMetrics.top,
					currentTop: metrics.top,
					baseVisibleHeight: baseMetrics.visibleHeight,
					currentVisibleHeight: metrics.visibleHeight,
					visibleHeightOffset,
					topOffset,
					source: 'android-window-metrics'
				});
			}
		},
		disposeAndroidKeyboardCompat() {
			// #ifdef APP-PLUS
			const compatState = this.androidKeyboardCompat;
			if (!compatState || plus.os.name !== 'Android') return;
			compatState.observer.removeOnGlobalLayoutListener(compatState.listener);
			this.androidKeyboardCompat = null;
			// #endif
		},
		queryList(pageNo, pageSize) {
				// 组件加载时会自动触发此方法，因此默认页面加载时会自动触发，无需手动调用
				// 这里的pageNo和pageSize会自动计算好，直接传给服务器即可
				// 模拟请求服务器获取分页数据，请替换成自己的网络请求
				const params = {
					pageNo: pageNo,
					pageSize: pageSize,
				}
				this.$request.queryChatList(params).then(res => {
					// 将请求的结果数组传递给z-paging
					this.$refs.paging.complete(res.data.list);
				}).catch(res => {
					// 如果请求失败写this.$refs.paging.complete(false);
					// 注意，每次都需要在catch中写这句话很麻烦，z-paging提供了方案可以全局统一处理
					// 在底层的网络请求抛出异常时，写uni.$emit('z-paging-error-emit');即可
					this.$refs.paging.complete(false);
				})
		},
		// 监听键盘高度改变，请不要直接通过uni.onKeyboardHeightChange监听，否则可能导致z-paging内置的键盘高度改变监听失效（如果不需要切换表情面板则不用写）
		keyboardHeightChange(res) {
			this.lastUniKeyboardHeight = res.height || 0;
			console.log('[chat-history-demo] uni键盘高度变化', {
				height: this.lastUniKeyboardHeight,
				viewportHeight: this.getViewportHeight()
			});
			this.detectAdjustPositionFailureByWindow(this.lastUniKeyboardHeight, this.getCurrentAndroidWindowMetrics());
			this.$refs.inputBar.updateKeyboardHeightChange(res);
		}, 
			// 用户尝试隐藏键盘，此时如果表情面板在展示中，应当通知chatInputBar隐藏表情面板（如果不需要切换表情面板则不用写）
			hidedKeyboard() {
				this.$refs.inputBar.hidedKeyboard();
			},
			// 发送新消息
			doSend(msg) {
				uni.showLoading({
					title: '发送中...'
				})
				setTimeout(()=>{
					uni.hideLoading();
					this.$refs.paging.addChatRecordData({
						time: '',
						icon: '/static/daxiong.jpg',
						name: '大雄',
						content: msg,
						isMe: true
					});
				},500)
			}
		}
	}
</script>

<style>
  page{ height:100%; overflow:hidden; }
	.header{
		background-color: red;
		font-size: 20rpx;
		padding: 20rpx;
		color: white;
	}
	.popup {
		position: absolute;
		top: -20px;
		height: 200rpx;
		width: 400rpx;
		background-color: red;
		z-index: 1000;
	}
</style>
