// [z-paging]核心js

import zStatic from './z-paging-static'
import c from './z-paging-constant'
import u from './z-paging-utils'

import zPagingRefresh from '../components/z-paging-refresh'
import zPagingLoadMore from '../components/z-paging-load-more'
import zPagingEmptyView from '../../z-paging-empty-view/z-paging-empty-view'

// modules
import commonLayoutModule from './modules/common-layout'
import dataHandleModule from './modules/data-handle'
import i18nModule from './modules/i18n'
import nvueModule from './modules/nvue'
import emptyModule from './modules/empty'
import refresherModule from './modules/refresher'
import loadMoreModule from './modules/load-more'
import loadingModule from './modules/loading'
import chatRecordModerModule from './modules/chat-record-mode'
import scrollerModule from './modules/scroller'
import backToTopModule from './modules/back-to-top'
import virtualListModule from './modules/virtual-list'

import Enum from './z-paging-enum'

const systemInfo = u.getSystemInfoSync();
export default {
	name: "z-paging",
	components: {
		zPagingRefresh,
		zPagingLoadMore,
		zPagingEmptyView
	},
	mixins: [
		commonLayoutModule,
		dataHandleModule,
		i18nModule,
		nvueModule,
		emptyModule,
		refresherModule,
		loadMoreModule,
		loadingModule,
		chatRecordModerModule,
		scrollerModule,
		backToTopModule,
		virtualListModule
	],
	data() {
		return {
			// --------------静态资源---------------
			base64BackToTop: zStatic.base64BackToTop,

			// -------------全局数据相关--------------
			// 当前加载类型
			loadingType: Enum.LoadingType.Refresher,
			requestTimeStamp: 0,
			wxsPropType: '',
			renderPropScrollTop: -1,
			checkScrolledToBottomTimeOut: null,
			cacheTopHeight: -1,
			statusBarHeight: systemInfo.statusBarHeight,
			scrollViewHeight: 0,
			pagingOrgTop: -1,

			// --------------状态&判断---------------
			insideOfPaging: -1,
			isLoadFailed: false,
			isIos: systemInfo.platform === 'ios',
			disabledBounce: false,
			fromCompleteEmit: false,
			disabledCompleteEmit: false,
			pageLaunched: false,
			active: false,
			
			// ---------------wxs相关---------------
			wxsIsScrollTopInTopRange: true,
			wxsScrollTop: 0,
			wxsPageScrollTop: 0,
			wxsOnPullingDown: false,
		};
	},
	props: {
		// 调用complete后延迟处理的时间，单位为毫秒，默认0毫秒，优先级高于minDelay
		delay: {
			type: [Number, String],
			default: u.gc('delay', 0),
		},
		// 触发@query后最小延迟处理的时间，单位为毫秒，默认0毫秒，优先级低于delay（假设设置为300毫秒，若分页请求时间小于300毫秒，则在调用complete后延迟[300毫秒-请求时长]；若请求时长大于300毫秒，则不延迟），当show-refresher-when-reload为true或reload(true)时，其最小值为400
		minDelay: {
			type: [Number, String],
			default: u.gc('minDelay', 0),
		},
		// 设置z-paging的style，部分平台(如微信小程序)无法直接修改组件的style，可使用此属性代替
		pagingStyle: {
			type: Object,
			default: u.gc('pagingStyle', {}),
		},
		// 设置z-paging的class，优先级低于pagingStyle和height、width、maxWidth、bgColor
		pagingClass: {
			type: [String, Array, Object],
			default: u.gc('pagingClass', ''),
		},
		// z-paging的高度，优先级低于pagingStyle中设置的height；传字符串，如100px、100rpx、100%
		height: {
			type: String,
			default: u.gc('height', '')
		},
		// z-paging的宽度，优先级低于pagingStyle中设置的width；传字符串，如100px、100rpx、100%
		width: {
			type: String,
			default: u.gc('width', '')
		},
		// z-paging的最大宽度，优先级低于pagingStyle中设置的max-width；传字符串，如100px、100rpx、100%。默认为空，也就是铺满窗口宽度，若设置了特定值则会自动添加margin: 0 auto
		maxWidth: {
			type: String,
			default: u.gc('maxWidth', '')
		},
		// z-paging的背景色，优先级低于pagingStyle中设置的background。传字符串，如"#ffffff"
		bgColor: {
			type: String,
			default: u.gc('bgColor', '')
		},
		// 设置z-paging的容器(插槽的父view)的style
		pagingContentStyle: {
			type: Object,
			default: u.gc('pagingContentStyle', {}),
		},
		// z-paging是否自动高度，若自动高度则会自动铺满屏幕
		autoHeight: {
			type: Boolean,
			default: u.gc('autoHeight', false)
		},
		// z-paging是否自动高度时，附加的高度，注意添加单位px或rpx，若需要减少高度，则传负数
		autoHeightAddition: {
			type: [Number, String],
			default: u.gc('autoHeightAddition', '0px')
		},
		// loading(下拉刷新、上拉加载更多)的主题样式，支持black，white，默认black
		defaultThemeStyle: {
			type: String,
			default: u.gc('defaultThemeStyle', 'black')
		},
		// z-paging是否使用fixed布局，若使用fixed布局，则z-paging的父view无需固定高度，z-paging高度默认为100%，默认为是(当使用内置scroll-view滚动时有效)
		fixed: {
			type: Boolean,
			default: u.gc('fixed', true)
		},
		// 是否开启底部安全区域适配
		safeAreaInsetBottom: {
			type: Boolean,
			default: u.gc('safeAreaInsetBottom', false)
		},
		// 开启底部安全区域适配后，是否使用placeholder形式实现，默认为否。为否时滚动区域会自动避开底部安全区域，也就是所有滚动内容都不会挡住底部安全区域，若设置为是，则滚动时滚动内容会挡住底部安全区域，但是当滚动到底部时才会避开底部安全区域
		useSafeAreaPlaceholder: {
			type: Boolean,
			default: u.gc('useSafeAreaPlaceholder', false)
		},
		// z-paging bottom的背景色，默认透明，传字符串，如"#ffffff"
		bottomBgColor: {
			type: String,
			default: u.gc('bottomBgColor', '')
		},
		// slot="top"的view的z-index，默认为99，仅使用页面滚动时有效
		topZIndex: {
			type: Number,
			default: u.gc('topZIndex', 99)
		},
		// z-paging内容容器父view的z-index，默认为1
		superContentZIndex: {
			type: Number,
			default: u.gc('superContentZIndex', 1)
		},
		// z-paging内容容器部分的z-index，默认为1
		contentZIndex: {
			type: Number,
			default: u.gc('contentZIndex', 1)
		},
		// z-paging二楼的z-index，默认为100
		f2ZIndex: {
			type: Number,
			default: u.gc('f2ZIndex', 100)
		},
		// 使用页面滚动时，是否在不满屏时自动填充满屏幕，默认为是
		autoFullHeight: {
			type: Boolean,
			default: u.gc('autoFullHeight', true)
		},
		// 是否监听列表触摸方向改变，默认为否
		watchTouchDirectionChange: {
			type: Boolean,
			default: u.gc('watchTouchDirectionChange', false)
		},
		// 是否监听列表滚动方向改变，默认为否
		watchScrollDirectionChange: {
			type: Boolean,
			default: u.gc('watchScrollDirectionChange', false)
		},
		// 是否只使用基础布局，设置为true后将关闭mounted自动请求数据、关闭下拉刷新和滚动到底部加载更多，强制隐藏空数据图。默认为否
		layoutOnly: {
			type: Boolean,
			default: u.gc('layoutOnly', false)
		},
		// z-paging中布局的单位，默认为rpx
		unit: {
			type: String,
			default: u.gc('unit', 'rpx')
		}
	},
	created() {
		// 组件创建时，检测是否开始加载状态
		if (this.createdReload && !this.isOnly && this.auto) {
			this._startLoading();
			this.$nextTick(this._preReload);
		}
	},
	mounted() {
		this.active = true;
		this.wxsPropType = u.getTime().toString();
		this.renderJsIgnore;
		if (!this.createdReload && !this.isOnly && this.auto) {
			// 开始预加载
			u.delay(() => this.$nextTick(this._preReload), 0);
		}
		// 如果开启了列表缓存，在初始化的时候通过缓存数据填充列表数据
		this.finalUseCache && this._setListByLocalCache();
		let delay = 0;
		// #ifdef H5 || MP
		delay = c.delayTime;
		// #endif
		this.$nextTick(() => {
			// 初始化systemInfo
			this.systemInfo = u.getSystemInfoSync();
			// 初始化z-paging高度
			!this.usePageScroll && this.autoHeight  && this._setAutoHeight();
			this.loaded = true;
			u.delay(() => {
				// 更新fixed模式下z-paging的布局，主要是更新windowTop、windowBottom
				this.updateFixedLayout();
				// 更新缓存中z-paging整个内容容器高度
				this._updateCachedSuperContentHeight();
				// 更新z-paging中scroll-view高度
				this._updateScrollViewHeight();
			});
		})
		// 初始化页面滚动模式下slot="top"、slot="bottom"高度
		this.updatePageScrollTopHeight();
		this.updatePageScrollBottomHeight();
		// 初始化slot="left"、slot="right"宽度
		this.updateLeftAndRightWidth();
		if (this.finalRefresherEnabled && this.useCustomRefresher) {
			this.$nextTick(() => {
				this.isTouchmoving = true;
			})
		}
		if (!this.layoutOnly) {
			// 监听uni.$emit中全局emit的complete error等事件
			this._onEmit();
		}
		// #ifdef APP-NVUE
		if (!this.isIos && !this.useChatRecordMode) {
			this.nLoadingMoreFixedHeight = true;
		}
		// 在nvue中更新nvue下拉刷新view容器的宽度，而不是写死默认的750rpx，需要考虑列表宽度不是铺满屏幕的情况
		this._nUpdateRefresherWidth();
		// #endif
		// #ifndef APP-PLUS
		this.$nextTick(() => {
			// 非app平台中，在通过获取css设置的底部安全区域占位view高度设置bottom距离后，更新页面滚动底部高度
			setTimeout(() => {
				this._getCssSafeAreaInsetBottom(() => this.safeAreaInsetBottom && this.updatePageScrollBottomHeight());
			}, delay)
		})
		// #endif
	},
	destroyed() {
		this._handleUnmounted();
	},
	// #ifdef VUE3
	unmounted() {
		this._handleUnmounted();
	},
	// #endif
	watch: {
		defaultThemeStyle: {
			handler(newVal) {
				if (newVal.length) {
					this.finalRefresherDefaultStyle = newVal;
				}
			},
			immediate: true
		},
		autoHeight(newVal) {
			this.loaded && !this.usePageScroll && this._setAutoHeight(newVal);
		},
		autoHeightAddition(newVal) {
			this.loaded && !this.usePageScroll && this.autoHeight && this._setAutoHeight(newVal);
		},
	},
	computed: {
		// 当前z-paging的内置样式
		finalPagingStyle() {
			const pagingStyle = { ...this.pagingStyle };
			if (!this.systemInfo) return pagingStyle;
			const { windowTop, windowBottom } = this;
			if (!this.usePageScroll && this.fixed) {
				if (windowTop && !pagingStyle.top) {
					pagingStyle.top = windowTop + 'px';
				}
				if (windowBottom && !pagingStyle.bottom) {
					pagingStyle.bottom = windowBottom + 'px';
				}
			}
			if (this.bgColor.length && !pagingStyle['background']) {
				pagingStyle['background'] = this.bgColor;
			}
			if (this.height.length && !pagingStyle['height']) {
				pagingStyle['height'] = this.height;
			}
			if (this.width.length && !pagingStyle['width']) {
				pagingStyle['width'] = this.width;
			}
			if (this.maxWidth.length && !pagingStyle['max-width']) {
				pagingStyle['max-width'] = this.maxWidth;
				pagingStyle['margin'] = '0 auto';
			}
			return pagingStyle;
		},
		// 当前z-paging内容的样式
		finalPagingContentStyle() {
			if (this.contentZIndex != 1) {
				this.pagingContentStyle['z-index'] = this.contentZIndex;
				this.pagingContentStyle['position'] = 'relative';
			}
			return this.pagingContentStyle;
		},
		// 最终的当前开启安全区域适配后，是否使用placeholder形式实现。如果slot=bottom存在，则应当交由固定在底部的view处理，因此需排除此情况
		finalUseSafeAreaPlaceholder() {
			return this.useSafeAreaPlaceholder && !this.zSlots.bottom;
		},
		renderJsIgnore() {
			if ((this.usePageScroll && this.useChatRecordMode) || (!this.refresherEnabled && this.scrollable) || !this.useCustomRefresher) {
				this.$nextTick(() => {
					this.renderPropScrollTop = 10;
				})
			}
			return 0;
		},
		windowHeight() {
			if (!this.systemInfo) return 0;
			return this.systemInfo.windowHeight || 0;
		},
		windowBottom() {
			if (!this.systemInfo) return 0;
			return this.systemInfo.windowBottom || 0;
		},
		// 是否是ios+h5
		isIosAndH5() {
			// #ifndef H5
			return false;
			// #endif
			return this.isIos;
		},
		// 是否是只使用基础布局或者只使用下拉刷新
		isOnly() {
			return this.layoutOnly || this.refresherOnly;
		},
	},
	methods: {
		// 当前版本号
		getVersion() {
			return `z-paging v${c.version}`;
		},
		// 设置nvue List的specialEffects
		setSpecialEffects(args) {
			this.setListSpecialEffects(args);
		},
		// 与setSpecialEffects等效，兼容旧版本
		setListSpecialEffects(args) {
			this.nFixFreezing = args && Object.keys(args).length;
			if (this.isIos) {
				this.privateRefresherEnabled = 0;
			}
			!this.usePageScroll && this.$refs['zp-n-list'].setSpecialEffects(args);
		},
		// #ifdef APP-VUE
		// 当app长时间进入后台后进入前台，因系统内存管理导致app重新加载时，进行一些适配处理
		_handlePageLaunch() {
			// 首次触发不进行处理，只有进入后台后打开app重新加载时才处理
			if (this.pageLaunched) {
				// 解决在vue3+ios中，app ReLaunch时顶部下拉刷新展示位置向下偏移的问题
				// #ifdef VUE3
				this.refresherThresholdUpdateTag = 1;
				this.$nextTick(() => {
					this.refresherThresholdUpdateTag = 0;
				})
				// #endif
				// 解决使用虚拟列表时，app ReLaunch时白屏问题
				this._checkVirtualListScroll();
			}
			this.pageLaunched = true;
		},
		// #endif
		// 使手机发生较短时间的振动（15ms）
		_doVibrateShort() {
			// #ifndef H5
			
			// #ifdef APP-PLUS
			if (this.isIos) {
				const UISelectionFeedbackGenerator = plus.ios.importClass('UISelectionFeedbackGenerator');
				const feedbackGenerator = new UISelectionFeedbackGenerator();
				feedbackGenerator.init();
				setTimeout(() => {
					feedbackGenerator.selectionChanged();
				}, 0)
			} else {
				plus.device.vibrate(15);
			}
			// #endif
			// #ifndef APP-PLUS
			uni.vibrateShort();
			// #endif
			
			// #endif
		},
		// 设置z-paging高度
		async _setAutoHeight(shouldFullHeight = true, scrollViewNode = null) {
			const heightKey = 'min-height';
			try {
				if (shouldFullHeight) {
					// 如果需要铺满全屏，则计算当前全屏可是区域的高度
					let finalScrollViewNode = scrollViewNode || await this._getNodeClientRect('.zp-scroll-view');
					let finalScrollBottomNode = await this._getNodeClientRect('.zp-page-bottom');
					if (finalScrollViewNode) {
						const scrollViewTop = finalScrollViewNode[0].top;
						let scrollViewHeight = this.windowHeight - scrollViewTop;
						scrollViewHeight -= finalScrollBottomNode ? finalScrollBottomNode[0].height : 0;
						const additionHeight = u.convertToPx(this.autoHeightAddition);
						// 在支付宝小程序中，添加!important会导致min-height失效，因此在支付宝小程序中需要去掉
						let importantSuffix =  ' !important';
						// #ifdef MP-ALIPAY
						importantSuffix = '';
						// #endif
						const finalHeight = scrollViewHeight + additionHeight - (this.insideMore ? 1 : 0) + 'px' + importantSuffix;
						this.$set(this.scrollViewStyle, heightKey, finalHeight);
						this.$set(this.scrollViewInStyle, heightKey, finalHeight);
					}
				} else {
					this.$delete(this.scrollViewStyle, heightKey);
					this.$delete(this.scrollViewInStyle, heightKey);
				}
			} catch (e) {}
		},
		// 更新scroll-view高度
		async _updateScrollViewHeight() {
			const scrollViewNode = await this._getNodeClientRect('.zp-scroll-view');
			if (scrollViewNode) {
				const scrollViewNodeHeight = scrollViewNode[0].height;
				this.scrollViewHeight = scrollViewNodeHeight;
				this.pagingOrgTop =  scrollViewNode[0].top;
				// 设置scroll-view内容器的最小高度等于scroll-view的高度(为了解决在快手小程序中内容较少时scroll-view内容器高度无法铺满scroll-view的问题)
				// #ifdef MP-KUAISHOU
				this.$set(this.scrollViewInStyle, 'min-height', scrollViewNodeHeight + 'px');
				// #endif
			}
		},
		// 组件销毁后续处理
		_handleUnmounted() {
			this.active = false;
			if (!this.layoutOnly) {
				this._offEmit();
			}
			// 取消监听键盘高度变化事件（H5、百度小程序、抖音小程序、飞书小程序、QQ小程序、快手小程序不支持）
			// #ifndef H5 || MP-BAIDU || MP-TOUTIAO || MP-QQ || MP-KUAISHOU
			this.useChatRecordMode && uni.offKeyboardHeightChange(this._handleKeyboardHeightChange);
			// #endif
		},
		// 触发更新是否超出页面状态
		_updateInsideOfPaging() {
			this.insideMore && this.insideOfPaging === true && setTimeout(this.doLoadMore, 200)
		},
		// 清除timeout
		_cleanTimeout(timeout) {
			if (timeout) {
				clearTimeout(timeout);
				timeout = null;
			}
			return timeout;
		},
		// 添加全局emit监听
		_onEmit() {
			uni.$on(c.errorUpdateKey, (errorMsg) => {
				if (this.loading) {
					if (!!errorMsg) {
						this.customerEmptyViewErrorText = errorMsg;
					}
					this.complete(false).catch(() => {});
				}
			})
			uni.$on(c.completeUpdateKey, (data) => {
				setTimeout(() => {
					if (this.loading) {
						if (!this.disabledCompleteEmit) {
							const type = data.type || 'normal';
							const list = data.list || data;
							const rule = data.rule;
							this.fromCompleteEmit = true;
							switch (type){
								case 'normal':
									this.complete(list);
									break;
								case 'total':
									this.completeByTotal(list, rule);
									break;
								case 'nomore':
									this.completeByNoMore(list, rule);
									break;
								case 'key':
									this.completeByKey(list, rule);
									break;
								default:
									break;
							}
						} else {
							this.disabledCompleteEmit = false;
						}
					}
				}, 1);
			})
		},
		// 销毁全局emit和listener监听
		_offEmit(){
			uni.$off(c.errorUpdateKey);
			uni.$off(c.completeUpdateKey);
		},
	},
};
