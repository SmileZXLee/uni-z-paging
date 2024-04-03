// [z-paging]下拉刷新view模块
import u from '.././z-paging-utils'
import c from '.././z-paging-constant'
import Enum from '.././z-paging-enum'

// #ifdef APP-NVUE
const weexAnimation = weex.requireModule('animation');
// #endif
export default {
	props: {
		// 下拉刷新的主题样式，支持black，white，默认black
		refresherThemeStyle: {
			type: String,
			default: u.gc('refresherThemeStyle', '')
		},
		// 自定义下拉刷新中左侧图标的样式
		refresherImgStyle: {
			type: Object,
			default: u.gc('refresherImgStyle', {})
		},
		// 自定义下拉刷新中右侧状态描述文字的样式
		refresherTitleStyle: {
			type: Object,
			default: u.gc('refresherTitleStyle', {})
		},
		// 自定义下拉刷新中右侧最后更新时间文字的样式(show-refresher-update-time为true时有效)
		refresherUpdateTimeStyle: {
			type: Object,
			default: u.gc('refresherUpdateTimeStyle', {})
		},
		// 在微信小程序和QQ小程序中，是否实时监听下拉刷新中进度，默认为否
		watchRefresherTouchmove: {
			type: Boolean,
			default: u.gc('watchRefresherTouchmove', false)
		},
		// 底部加载更多的主题样式，支持black，white，默认black
		loadingMoreThemeStyle: {
			type: String,
			default: u.gc('loadingMoreThemeStyle', '')
		},
		// 是否只使用下拉刷新，设置为true后将关闭mounted自动请求数据、关闭滚动到底部加载更多，强制隐藏空数据图。默认为否
		refresherOnly: {
			type: Boolean,
			default: u.gc('refresherOnly', false)
		},
		// 自定义下拉刷新默认状态下回弹动画时间，单位为毫秒，默认为100毫秒，nvue无效
		refresherDefaultDuration: {
			type: [Number, String],
			default: u.gc('refresherDefaultDuration', 100)
		},
		// 自定义下拉刷新结束以后延迟回弹的时间，单位为毫秒，默认为0
		refresherCompleteDelay: {
			type: [Number, String],
			default: u.gc('refresherCompleteDelay', 0)
		},
		// 自定义下拉刷新结束回弹动画时间，单位为毫秒，默认为300毫秒(refresherEndBounceEnabled为false时，refresherCompleteDuration为设定值的1/3)，nvue无效
		refresherCompleteDuration: {
			type: [Number, String],
			default: u.gc('refresherCompleteDuration', 300)
		},
		// 自定义下拉刷新中是否允许列表滚动，默认为是
		refresherRefreshingScrollable: {
			type: Boolean,
			default: u.gc('refresherRefreshingScrollable', true)
		},
		// 自定义下拉刷新结束状态下是否允许列表滚动，默认为否
		refresherCompleteScrollable: {
			type: Boolean,
			default: u.gc('refresherCompleteScrollable', false)
		},
		// 是否使用自定义的下拉刷新，默认为是，即使用z-paging的下拉刷新。设置为false即代表使用uni scroll-view自带的下拉刷新，h5、App、微信小程序以外的平台不支持uni scroll-view自带的下拉刷新
		useCustomRefresher: {
			type: Boolean,
			default: u.gc('useCustomRefresher', true)
		},
		// 自定义下拉刷新下拉帧率，默认为40，过高可能会出现抖动问题
		refresherFps: {
			type: [Number, String],
			default: u.gc('refresherFps', 40)
		},
		// 自定义下拉刷新允许触发的最大下拉角度，默认为40度，当下拉角度小于设定值时，自定义下拉刷新动画不会被触发
		refresherMaxAngle: {
			type: [Number, String],
			default: u.gc('refresherMaxAngle', 40)
		},
		// 自定义下拉刷新的角度由未达到最大角度变到达到最大角度时，是否继续下拉刷新手势，默认为否
		refresherAngleEnableChangeContinued: {
			type: Boolean,
			default: u.gc('refresherAngleEnableChangeContinued', false)
		},
		// 自定义下拉刷新默认状态下的文字
		refresherDefaultText: {
			type: [String, Object],
			default: u.gc('refresherDefaultText', null)
		},
		// 自定义下拉刷新松手立即刷新状态下的文字
		refresherPullingText: {
			type: [String, Object],
			default: u.gc('refresherPullingText', null)
		},
		// 自定义下拉刷新刷新中状态下的文字
		refresherRefreshingText: {
			type: [String, Object],
			default: u.gc('refresherRefreshingText', null)
		},
		// 自定义下拉刷新刷新结束状态下的文字
		refresherCompleteText: {
			type: [String, Object],
			default: u.gc('refresherCompleteText', null)
		},
		// 自定义继续下拉进入二楼文字
		refresherGoF2Text: {
			type: [String, Object],
			default: u.gc('refresherGoF2Text', null)
		},
		// 自定义下拉刷新默认状态下的图片
		refresherDefaultImg: {
			type: String,
			default: u.gc('refresherDefaultImg', null)
		},
		// 自定义下拉刷新松手立即刷新状态下的图片，默认与refresherDefaultImg一致
		refresherPullingImg: {
			type: String,
			default: u.gc('refresherPullingImg', null)
		},
		// 自定义下拉刷新刷新中状态下的图片
		refresherRefreshingImg: {
			type: String,
			default: u.gc('refresherRefreshingImg', null)
		},
		// 自定义下拉刷新刷新结束状态下的图片
		refresherCompleteImg: {
			type: String,
			default: u.gc('refresherCompleteImg', null)
		},
		// 自定义下拉刷新刷新中状态下是否展示旋转动画
		refresherRefreshingAnimated: {
			type: Boolean,
			default: u.gc('refresherRefreshingAnimated', true)
		},
		// 是否开启自定义下拉刷新刷新结束回弹效果，默认为是
		refresherEndBounceEnabled: {
			type: Boolean,
			default: u.gc('refresherEndBounceEnabled', true)
		},
		// 是否开启自定义下拉刷新，默认为是
		refresherEnabled: {
			type: Boolean,
			default: u.gc('refresherEnabled', true)
		},
		// 设置自定义下拉刷新阈值，默认为80rpx
		refresherThreshold: {
			type: [Number, String],
			default: u.gc('refresherThreshold', '80rpx')
		},
		// 设置系统下拉刷新默认样式，支持设置 black，white，none，none 表示不使用默认样式，默认为black
		refresherDefaultStyle: {
			type: String,
			default: u.gc('refresherDefaultStyle', 'black')
		},
		// 设置自定义下拉刷新区域背景
		refresherBackground: {
			type: String,
			default: u.gc('refresherBackground', 'transparent')
		},
		// 设置固定的自定义下拉刷新区域背景
		refresherFixedBackground: {
			type: String,
			default: u.gc('refresherFixedBackground', 'transparent')
		},
		// 设置固定的自定义下拉刷新区域高度，默认为0
		refresherFixedBacHeight: {
			type: [Number, String],
			default: u.gc('refresherFixedBacHeight', 0)
		},
		// 设置自定义下拉刷新下拉超出阈值后继续下拉位移衰减的比例，范围0-1，值越大代表衰减越多。默认为0.65(nvue无效)
		refresherOutRate: {
			type: Number,
			default: u.gc('refresherOutRate', 0.65)
		},
		// 是否开启下拉进入二楼功能，默认为否
		refresherF2Enabled: {
			type: Boolean,
			default: u.gc('refresherF2Enabled', false)
		},
		// 下拉进入二楼阈值，默认为200rpx
		refresherF2Threshold: {
			type: [Number, String],
			default: u.gc('refresherF2Threshold', '200rpx')
		},
		// 下拉进入二楼动画时间，单位为毫秒，默认为200毫秒
		refresherF2Duration: {
			type: [Number, String],
			default: u.gc('refresherF2Duration', 200)
		},
		// 下拉进入二楼状态松手后是否弹出二楼，默认为是
		showRefresherF2: {
			type: Boolean,
			default: u.gc('showRefresherF2', true)
		},
		// 设置自定义下拉刷新下拉时实际下拉位移与用户下拉距离的比值，默认为0.75，即代表若用户下拉10px，则实际位移为7.5px(nvue无效)
		refresherPullRate: {
			type: Number,
			default: u.gc('refresherPullRate', 0.75)
		},
		// 是否显示最后更新时间，默认为否
		showRefresherUpdateTime: {
			type: Boolean,
			default: u.gc('showRefresherUpdateTime', false)
		},
		// 如果需要区别不同页面的最后更新时间，请为不同页面的z-paging的`refresher-update-time-key`设置不同的字符串
		refresherUpdateTimeKey: {
			type: String,
			default: u.gc('refresherUpdateTimeKey', 'default')
		},
		// 下拉刷新时下拉到“松手立即刷新”或“松手进入二楼”状态时是否使手机短振动，默认为否（h5无效）
		refresherVibrate: {
			type: Boolean,
			default: u.gc('refresherVibrate', false)
		},
		// 下拉刷新时是否禁止下拉刷新view跟随用户触摸竖直移动，默认为否。注意此属性只是禁止下拉刷新view移动，其他下拉刷新逻辑依然会正常触发
		refresherNoTransform: {
			type: Boolean,
			default: u.gc('refresherNoTransform', false)
		},
		// 是否开启下拉刷新状态栏占位，适用于隐藏导航栏时，下拉刷新需要避开状态栏高度的情况，默认为否
		useRefresherStatusBarPlaceholder: {
			type: Boolean,
			default: u.gc('useRefresherStatusBarPlaceholder', false)
		},
	},
	data() {
		return {
			R: Enum.Refresher,
			//下拉刷新状态
			refresherStatus: Enum.Refresher.Default,
			refresherTouchstartY: 0,
			lastRefresherTouchmove: null,
			refresherReachMaxAngle: true,
			refresherTransform: 'translateY(0px)',
			refresherTransition: '',
			finalRefresherDefaultStyle: 'black',
			refresherRevealStackCount: 0,
			refresherCompleteTimeout: null,
			refresherCompleteSubTimeout: null,
			refresherEndTimeout: null,
			isTouchmovingTimeout: null,
			refresherTriggered: false,
			isTouchmoving: false,
			isTouchEnded: false,
			isUserPullDown: false,
			privateRefresherEnabled: -1,
			privateShowRefresherWhenReload: false,
			customRefresherHeight: -1,
			showCustomRefresher: false,
			doRefreshAnimateAfter: false,
			isRefresherInComplete: false,
			showF2: false,
			f2Transform: '',
			pullDownTimeStamp: 0,
			moveDis: 0,
			oldMoveDis: 0,
			currentDis: 0,
			oldCurrentMoveDis: 0,
			oldRefresherTouchmoveY: 0,
			oldTouchDirection: '',
			oldEmitedTouchDirection: '',
			oldPullingDistance: -1,
			refresherThresholdUpdateTag: 0
		}
	},
	watch: {
		refresherDefaultStyle: {
			handler(newVal) {
				if (newVal.length) {
					this.finalRefresherDefaultStyle = newVal;
				}
			},
			immediate: true
		},
		refresherStatus(newVal) {
			newVal === Enum.Refresher.Loading && this._cleanRefresherEndTimeout();
			this.refresherVibrate && (newVal === Enum.Refresher.ReleaseToRefresh || newVal === Enum.Refresher.GoF2) && this._doVibrateShort();
			this.$emit('refresherStatusChange', newVal);
			this.$emit('update:refresherStatus', newVal);
		},
		// 监听当前下拉刷新启用/禁用状态
		refresherEnabled(newVal) {
			// 当禁用下拉刷新时，强制收回正在展示的下拉刷新view
			!newVal && this.endRefresh();
		}
	},
	computed: {
		pullDownDisTimeStamp() {
			return 1000 / this.refresherFps;
		},
		refresherThresholdUnitConverted() {
			return u.addUnit(this.refresherThreshold, this.unit);
		},
		finalRefresherEnabled() {
			if (this.useChatRecordMode) return false;
			if (this.privateRefresherEnabled === -1) return this.refresherEnabled;
			return this.privateRefresherEnabled === 1;
		},
		finalRefresherThreshold() {
			let refresherThreshold = this.refresherThresholdUnitConverted;
			let idDefault = false;
			if (refresherThreshold === u.addUnit(80, this.unit)) {
				idDefault = true;
				if (this.showRefresherUpdateTime) {
					refresherThreshold = u.addUnit(120, this.unit);
				}
			}
			if (idDefault && this.customRefresherHeight > 0) return this.customRefresherHeight + this.finalRefresherThresholdPlaceholder;
			return u.convertToPx(refresherThreshold) + this.finalRefresherThresholdPlaceholder;
		},
		finalRefresherF2Threshold() {
			return u.convertToPx(u.addUnit(this.refresherF2Threshold, this.unit));
		},
		finalRefresherThresholdPlaceholder() {
			return this.useRefresherStatusBarPlaceholder ? this.statusBarHeight : 0;
		},
		finalRefresherFixedBacHeight() {
			return u.convertToPx(this.refresherFixedBacHeight);
		},
		finalRefresherThemeStyle() {
			return this.refresherThemeStyle.length ? this.refresherThemeStyle : this.defaultThemeStyle;
		},
		finalRefresherOutRate() {
			let rate = this.refresherOutRate;
			rate = Math.max(0,rate);
			rate = Math.min(1,rate);
			return rate;
		},
		finalRefresherPullRate() {
			let rate = this.refresherPullRate;
			rate = Math.max(0,rate);
			return rate;
		},
		finalRefresherTransform() {
			if (this.refresherNoTransform || this.refresherTransform === 'translateY(0px)') return 'none';
			return this.refresherTransform;
		},
		finalShowRefresherWhenReload() {
			return this.showRefresherWhenReload || this.privateShowRefresherWhenReload;
		},
		finalRefresherTriggered() {
			if (!(this.finalRefresherEnabled && !this.useCustomRefresher)) return false;
			return this.refresherTriggered;
		},
		showRefresher() {
			const showRefresher = this.finalRefresherEnabled && this.useCustomRefresher;
			// #ifndef APP-NVUE
			this.active && this.customRefresherHeight === -1 && showRefresher && this.updateCustomRefresherHeight();
			// #endif
			return showRefresher;
		},
		hasTouchmove() {
			// #ifdef VUE2
			// #ifdef APP-VUE || H5
			if (this.$listeners && !this.$listeners.refresherTouchmove) return false;
			// #endif
			// #ifdef MP-WEIXIN || MP-QQ
			return this.watchRefresherTouchmove;
			// #endif
			return true;
			// #endif
			return this.watchRefresherTouchmove;
		},
	},
	methods: {
		// 终止下拉刷新状态
		endRefresh() {
			this.totalData = this.realTotalData;
			this._refresherEnd();
			this._endSystemLoadingAndRefresh();
			this._handleScrollViewBounce({ bounce: true });
			this.$nextTick(() => {
				this.refresherTriggered = false;
			})
		},
		// 手动更新自定义下拉刷新view高度
		updateCustomRefresherHeight() {
			u.delay(() => this.$nextTick(this._updateCustomRefresherHeight));
		},
		// 关闭二楼
		closeF2() {
			this._handleCloseF2();
		},
		// 自定义下拉刷新被触发
		_onRefresh(fromScrollView = false, isUserPullDown = true) {
			if (fromScrollView && !(this.finalRefresherEnabled && !this.useCustomRefresher)) return;
			this.$emit('onRefresh');
			this.$emit('Refresh');
			// #ifdef APP-NVUE
			if (this.loading) {
				u.delay(this._nRefresherEnd, 500)
				return;
			}
			// #endif
			if (this.loading || this.isRefresherInComplete) return;
			this.loadingType = Enum.LoadingType.Refresher;
			if (this.nShowRefresherReveal) return;
			this.isUserPullDown = isUserPullDown;
			this.isUserReload = !isUserPullDown;
			this._startLoading(true);
			this.refresherTriggered = true;
			if(this.reloadWhenRefresh && isUserPullDown){
				this.useChatRecordMode ? this._onLoadingMore('click') : this._reload(false, false, isUserPullDown);
			}
		},
		// 自定义下拉刷新被复位
		_onRestore() {
			this.refresherTriggered = 'restore';
			this.$emit('onRestore');
			this.$emit('Restore');
		},
		// #ifndef APP-VUE || MP-WEIXIN || MP-QQ || H5
		// touch开始
		_refresherTouchstart(e) {
			this._handleListTouchstart();
			if (this._touchDisabled()) return;
			this._handleRefresherTouchstart(u.getTouch(e));
		},
		// #endif
		// 进一步处理touch开始结果
		_handleRefresherTouchstart(touch) {
			if (!this.loading && this.isTouchEnded) {
				this.isTouchmoving = false;
			}
			this.loadingType = Enum.LoadingType.Refresher;
			this.isTouchmovingTimeout && clearTimeout(this.isTouchmovingTimeout);
			this.isTouchEnded = false;
			this.refresherTransition = '';
			this.refresherTouchstartY = touch.touchY;
			this.$emit('refresherTouchstart', this.refresherTouchstartY);
			this.lastRefresherTouchmove = touch;
			this._cleanRefresherCompleteTimeout();
			this._cleanRefresherEndTimeout();
		},
		
		// 非appvue或微信小程序或QQ小程序或h5平台，使用js控制下拉刷新
		// #ifndef APP-VUE || MP-WEIXIN || MP-QQ || H5
		// touch中
		_refresherTouchmove(e) {
			const currentTimeStamp = u.getTime();
			let touch = null;
			let refresherTouchmoveY = 0;
			if (this.watchTouchDirectionChange) {
				// 检测下拉刷新方向改变
				touch = u.getTouch(e);
				refresherTouchmoveY = touch.touchY;
				const direction  = refresherTouchmoveY > this.oldRefresherTouchmoveY ? 'top' : 'bottom';
				// 只有在方向改变的时候才emit相关事件
				if (direction === this.oldTouchDirection && direction !== this.oldEmitedTouchDirection) {
					this._handleTouchDirectionChange({ direction });
					this.oldEmitedTouchDirection = direction;
				}
				this.oldTouchDirection = direction;
				this.oldRefresherTouchmoveY = refresherTouchmoveY;
			}
			// 节流处理，在pullDownDisTimeStamp时间内的下拉刷新中事件不进行处理
			if (this.pullDownTimeStamp && currentTimeStamp - this.pullDownTimeStamp <= this.pullDownDisTimeStamp) return;
			// 如果不允许下拉，则return
			if (this._touchDisabled()) return;
			this.pullDownTimeStamp = Number(currentTimeStamp);
			touch = u.getTouch(e);
			refresherTouchmoveY = touch.touchY;
			// 获取当前touch的y - 初始touch的y，计算它们的差
			let moveDis = refresherTouchmoveY - this.refresherTouchstartY;
			if (moveDis < 0) return;
			// 对下拉刷新的角度进行限制
			if (this.refresherMaxAngle >= 0 && this.refresherMaxAngle <= 90 && this.lastRefresherTouchmove && this.lastRefresherTouchmove.touchY <= refresherTouchmoveY) {
				if (!moveDis && !this.refresherAngleEnableChangeContinued && this.moveDis < 1 && !this.refresherReachMaxAngle) return;
				const x = Math.abs(touch.touchX - this.lastRefresherTouchmove.touchX);
				const y = Math.abs(refresherTouchmoveY - this.lastRefresherTouchmove.touchY);
				const z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
				if ((x || y) && x > 1) {
					// 获取下拉刷新前后两次位移的角度
					const angle = Math.asin(y / z) / Math.PI * 180;
					// 如果角度小于配置要求，则return
					if (angle < this.refresherMaxAngle) {
						this.lastRefresherTouchmove = touch;
						this.refresherReachMaxAngle = false;
						return;
					}
				}
			}
			// 获取最终的moveDis
			moveDis = this._getFinalRefresherMoveDis(moveDis);
			// 处理下拉刷新位移
			this._handleRefresherTouchmove(moveDis, touch);
			// 下拉刷新时，禁止页面滚动以防止页面向下滚动和下拉刷新同时作用导致下拉刷新位置偏移超过预期
			if (!this.disabledBounce) {
				// #ifndef MP-LARK
				this._handleScrollViewBounce({ bounce: false });
				// #endif
				this.disabledBounce = true;
			}
			this._emitTouchmove({ pullingDistance: moveDis, dy: this.moveDis - this.oldMoveDis });
		},
		// #endif
		// 进一步处理touch中结果
		_handleRefresherTouchmove(moveDis, touch) {
			this.refresherReachMaxAngle = true;
			this.isTouchmovingTimeout && clearTimeout(this.isTouchmovingTimeout);
			this.isTouchmoving = true;
			this.isTouchEnded = false;
			// 更新下拉刷新状态
			// 下拉刷新距离超过阈值
			if (moveDis >= this.finalRefresherThreshold) {
				// 如果开启了下拉进入二楼并且下拉刷新距离超过进入二楼阈值，则当前下拉刷新状态为松手进入二楼，否则为松手立即刷新
				this.refresherStatus = this.refresherF2Enabled && moveDis >= this.finalRefresherF2Threshold ? Enum.Refresher.GoF2 : Enum.Refresher.ReleaseToRefresh;
			} else {
				// 下拉刷新距离未超过阈值，显示默认状态
				this.refresherStatus = Enum.Refresher.Default;
			}
			// #ifndef APP-VUE || MP-WEIXIN || MP-QQ  || H5
			// this.scrollEnable = false;
			// 通过transform控制下拉刷新view垂直偏移
			this.refresherTransform = `translateY(${moveDis}px)`;
			this.lastRefresherTouchmove = touch;
			// #endif
			this.moveDis = moveDis;
		},
		// #ifndef APP-VUE || MP-WEIXIN || MP-QQ || H5
		// touch结束
		_refresherTouchend(e) {
			// 下拉刷新用户手离开屏幕，允许列表滚动
			this._handleScrollViewBounce({bounce: true});
			if (this._touchDisabled() || !this.isTouchmoving) return;
			const touch = u.getTouch(e);
			let refresherTouchendY = touch.touchY;
			let moveDis = refresherTouchendY - this.refresherTouchstartY;
			moveDis = this._getFinalRefresherMoveDis(moveDis);
			this._handleRefresherTouchend(moveDis);
			this.disabledBounce = false;
		},
		// #endif
		// 进一步处理touch结束结果
		_handleRefresherTouchend(moveDis) {
			// #ifndef APP-PLUS || H5 || MP-WEIXIN
			if (!this.isTouchmoving) return;
			// #endif
			this.isTouchmovingTimeout && clearTimeout(this.isTouchmovingTimeout);
			this.refresherReachMaxAngle = true;
			this.isTouchEnded = true;
			const refresherThreshold = this.finalRefresherThreshold;
			if (moveDis >= refresherThreshold && (this.refresherStatus === Enum.Refresher.ReleaseToRefresh || this.refresherStatus === Enum.Refresher.GoF2)) {
				// 如果是松手进入二楼状态，则触发进入二楼
				if (this.refresherStatus === Enum.Refresher.GoF2) {
					this._handleGoF2();
					this._refresherEnd();
				} else {
					// 如果是松手立即刷新状态，则触发下拉刷新
					// #ifndef APP-VUE || MP-WEIXIN || MP-QQ || H5
					this.refresherTransform = `translateY(${refresherThreshold}px)`;
					this.refresherTransition = 'transform .1s linear';
					// #endif
					u.delay(() => {
						this._emitTouchmove({ pullingDistance: refresherThreshold, dy: this.moveDis - refresherThreshold });
					}, 0.1);
					this.moveDis = refresherThreshold;
					this.refresherStatus = Enum.Refresher.Loading;
					this._doRefresherLoad();
				}
			} else {
				this._refresherEnd();
				this.isTouchmovingTimeout = u.delay(() => {
					this.isTouchmoving = false;
				}, this.refresherDefaultDuration);
			}
			this.scrollEnable = true;
			this.$emit('refresherTouchend', moveDis);
		},
		// 处理列表触摸开始事件
		_handleListTouchstart() {
			if (this.useChatRecordMode && this.autoHideKeyboardWhenChat) {
				uni.hideKeyboard();
				this.$emit('hidedKeyboard');
			}
		},
		// 处理scroll-view bounce是否生效
		_handleScrollViewBounce({ bounce }) {
			if (!this.usePageScroll && !this.scrollToTopBounceEnabled) {
				if (this.wxsScrollTop <= 5) {
					// #ifdef APP-VUE || MP-WEIXIN || MP-QQ || H5
					this.refresherTransition = '';
					// #endif
					this.scrollEnable = bounce;
				} else if (bounce) {
					this.scrollEnable = bounce;
				}
			}
		},
		// wxs正在下拉状态改变处理
		_handleWxsPullingDownStatusChange(onPullingDown) {
			this.wxsOnPullingDown = onPullingDown;
			if (onPullingDown && !this.useChatRecordMode) {
				this.renderPropScrollTop = 0;
			}
		},
		// wxs正在下拉处理
		_handleWxsPullingDown({ moveDis, diffDis }){
			this._emitTouchmove({ pullingDistance: moveDis,dy: diffDis });
		},
		// wxs触摸方向改变
		_handleTouchDirectionChange({ direction }) {
			this.$emit('touchDirectionChange',direction);
		},
		// wxs通知更新其props
		_handlePropUpdate(){
			this.wxsPropType = u.getTime().toString();
		},
		// 下拉刷新结束
		_refresherEnd(shouldEndLoadingDelay = true, fromAddData = false, isUserPullDown = false, setLoading = true) {
			if (this.loadingType === Enum.LoadingType.Refresher) {
				const refresherCompleteDelay = (fromAddData && (isUserPullDown || this.showRefresherWhenReload)) ? this.refresherCompleteDelay : 0;
				const refresherStatus = refresherCompleteDelay > 0 ? Enum.Refresher.Complete : Enum.Refresher.Default;
				if (this.finalShowRefresherWhenReload) {
					const stackCount = this.refresherRevealStackCount;
					this.refresherRevealStackCount --;
					if (stackCount > 1) return;
				}
				this._cleanRefresherEndTimeout();
				this.refresherEndTimeout = u.delay(() => {
					this.refresherStatus = refresherStatus;
				}, this.refresherStatus !== Enum.Refresher.Default && refresherStatus === Enum.Refresher.Default ? this.refresherCompleteDuration : 0);
				
				// #ifndef APP-NVUE
				if (refresherCompleteDelay > 0) {
					this.isRefresherInComplete = true;
				}
				// #endif
				this._cleanRefresherCompleteTimeout();
				this.refresherCompleteTimeout = u.delay(() => {
					let animateDuration = 1;
					const animateType = this.refresherEndBounceEnabled && fromAddData ? 'cubic-bezier(0.19,1.64,0.42,0.72)' : 'linear';
					if (fromAddData) {
						animateDuration = this.refresherEndBounceEnabled ? this.refresherCompleteDuration / 1000 : this.refresherCompleteDuration / 3000;
					}
					this.refresherTransition = `transform ${fromAddData ? animateDuration : this.refresherDefaultDuration / 1000}s ${animateType}`;
					// #ifndef APP-VUE || MP-WEIXIN || MP-QQ  || H5
					this.refresherTransform = 'translateY(0px)';
					this.currentDis = 0;
					// #endif
					// #ifdef APP-VUE || MP-WEIXIN || MP-QQ || H5
					this.wxsPropType = this.refresherTransition + 'end' + u.getTime();
					// #endif
					// #ifdef APP-NVUE
					this._nRefresherEnd();
					// #endif
					this.moveDis = 0;
					// #ifndef APP-NVUE
					if (refresherStatus === Enum.Refresher.Complete) {
						if (this.refresherCompleteSubTimeout) {
							clearTimeout(this.refresherCompleteSubTimeout);
							this.refresherCompleteSubTimeout = null;
						}
						this.refresherCompleteSubTimeout = u.delay(() => {
							this.$nextTick(() => {
								this.refresherStatus = Enum.Refresher.Default;
								this.isRefresherInComplete = false;
							})
						}, animateDuration * 800);
					}
					// #endif
					this._emitTouchmove({ pullingDistance: 0, dy: this.moveDis });
				}, refresherCompleteDelay);
			}
			if (setLoading) {
				u.delay(() => this.loading = false, shouldEndLoadingDelay ? c.delayTime : 0);
				isUserPullDown && this._onRestore();
			}
		},
		// 处理进入二楼
		_handleGoF2() {
			if (this.showF2 || !this.refresherF2Enabled) return;
			this.$emit('refresherF2Change', 'go');
			
			if (!this.showRefresherF2) return;
			// #ifndef APP-NVUE
			this.f2Transform = `translateY(${-this.superContentHeight}px)`;
			this.showF2 = true;
			u.delay(() => {
				this.f2Transform = 'translateY(0px)';
			}, 100, 'f2ShowDelay')
			// #endif
			
			// #ifdef APP-NVUE
			this.showF2 = true;
			this.$nextTick(() => {
				weexAnimation.transition(this.$refs['zp-n-f2'], {
					styles: { transform: `translateY(${-this.superContentHeight}px)` },
					duration: 0,
					timingFunction: 'linear',
					needLayout: true,
					delay: 0
				})
				this.nF2Opacity = 1;
			})
			u.delay(() => {
				weexAnimation.transition(this.$refs['zp-n-f2'], {
					styles: { transform: 'translateY(0px)' },
					duration: this.refresherF2Duration,
					timingFunction: 'linear',
					needLayout: true,
					delay: 0
				})
			}, 10, 'f2GoDelay')
			// #endif
		},
		// 处理退出二楼
		_handleCloseF2() {
			if (!this.showF2 || !this.refresherF2Enabled) return;
			this.$emit('refresherF2Change', 'close');
			
			if (!this.showRefresherF2) return;
			// #ifndef APP-NVUE
			this.f2Transform = `translateY(${-this.superContentHeight}px)`;
			// #endif
			
			// #ifdef APP-NVUE
			weexAnimation.transition(this.$refs['zp-n-f2'], {
				styles: { transform: `translateY(${-this.superContentHeight}px)` },
				duration: this.refresherF2Duration,
				timingFunction: 'linear',
				needLayout: true,
				delay: 0
			})
			// #endif
			
			u.delay(() => {
				this.showF2 = false;
				this.nF2Opacity = 0;
			}, this.refresherF2Duration, 'f2CloseDelay')
		},
		// 模拟用户手动触发下拉刷新
		_doRefresherRefreshAnimate() {
			this._cleanRefresherCompleteTimeout();
			// 用户处理用户在短时间内多次调用reload的情况，此时下拉刷新view不需要重复显示，只需要保证最后一次reload对应的请求结束后收回下拉刷新view即可
			// #ifndef APP-NVUE
			const doRefreshAnimateAfter = !this.doRefreshAnimateAfter && (this.finalShowRefresherWhenReload) && this
				.customRefresherHeight === -1 && this.refresherThreshold === u.addUnit(80, this.unit);
			if (doRefreshAnimateAfter) {
				this.doRefreshAnimateAfter = true;
				return;
			}
			// #endif
			this.refresherRevealStackCount ++;
			// #ifndef APP-VUE || MP-WEIXIN || MP-QQ  || H5
			this.refresherTransform = `translateY(${this.finalRefresherThreshold}px)`;
			// #endif
			// #ifdef APP-VUE || MP-WEIXIN || MP-QQ || H5
			this.wxsPropType = 'begin' + u.getTime();
			// #endif
			this.moveDis = this.finalRefresherThreshold;
			this.refresherStatus = Enum.Refresher.Loading;
			this.isTouchmoving = true;
			this.isTouchmovingTimeout && clearTimeout(this.isTouchmovingTimeout);
			this._doRefresherLoad(false);
		},
		// 触发下拉刷新
		_doRefresherLoad(isUserPullDown = true) {
			this._onRefresh(false,isUserPullDown);
			this.loading = true;
		},
		// #ifndef APP-VUE || MP-WEIXIN || MP-QQ || H5
		// 获取处理后的moveDis
		_getFinalRefresherMoveDis(moveDis) {
			let diffDis = moveDis - this.oldCurrentMoveDis;
			this.oldCurrentMoveDis = moveDis;
			if (diffDis > 0) {
				// 根据配置的下拉刷新用户手势位移与实际需要的位移比率计算最终的diffDis
				diffDis = diffDis * this.finalRefresherPullRate;
				if (this.currentDis > this.finalRefresherThreshold) {
					diffDis = diffDis * (1 - this.finalRefresherOutRate);
				}
			}
			// 控制diffDis过大的情况，比如进入页面突然猛然下拉，此时diffDis不应进行太大的偏移
			diffDis = diffDis > 100 ? diffDis / 100 : diffDis;
			this.currentDis += diffDis;
			this.currentDis = Math.max(0, this.currentDis);
			return this.currentDis;
		},
		// 判断touch手势是否要触发
		_touchDisabled() {
			const checkOldScrollTop = this.oldScrollTop > 5;
			return this.loading || this.isRefresherInComplete || this.useChatRecordMode || !this.refresherEnabled || !this.useCustomRefresher ||(this.usePageScroll && this.useCustomRefresher && this.pageScrollTop > 10) || (!(this.usePageScroll && this.useCustomRefresher) && checkOldScrollTop);
		},
		// #endif
		// 更新自定义下拉刷新view高度
		_updateCustomRefresherHeight() {
			this._getNodeClientRect('.zp-custom-refresher-slot-view').then((res) => {
				this.customRefresherHeight = res ? res[0].height : 0;
				this.showCustomRefresher = this.customRefresherHeight > 0;
				if (this.doRefreshAnimateAfter) {
					this.doRefreshAnimateAfter = false;
					this._doRefresherRefreshAnimate();
				}
			});
		},
		// emit pullingDown事件
		_emitTouchmove(e) {
			// #ifndef APP-NVUE
			e.viewHeight = this.finalRefresherThreshold;
			// #endif
			e.rate = e.viewHeight > 0 ? e.pullingDistance / e.viewHeight : 0;
			this.hasTouchmove && this.oldPullingDistance !== e.pullingDistance && this.$emit('refresherTouchmove', e);
			this.oldPullingDistance = e.pullingDistance;
		},
		// 清除refresherCompleteTimeout
		_cleanRefresherCompleteTimeout() {
			this.refresherCompleteTimeout = this._cleanTimeout(this.refresherCompleteTimeout);
			// #ifdef APP-NVUE
			this._nRefresherEnd(false);
			// #endif
		},
		// 清除refresherEndTimeout
		_cleanRefresherEndTimeout() {
			this.refresherEndTimeout = this._cleanTimeout(this.refresherEndTimeout);
		},
	}
}
