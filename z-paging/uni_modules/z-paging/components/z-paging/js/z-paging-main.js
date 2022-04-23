// [z-paging]核心js

import zStatic from './z-paging-static'
import c from './z-paging-constant'
import u from './z-paging-utils'

import zPagingRefresh from '../components/z-paging-refresh'
import zPagingLoadMore from '../components/z-paging-load-more'
import zPagingEmptyView from '../../z-paging-empty-view/z-paging-empty-view'

// modules
import dataHandleModule from './modules/data-handle'
import i18nModule from './modules/i18n'
import nvueModule from './modules/nvue'
import emptyModule from './modules/empty'
import refresherModule from './modules/refresher'
import loadMoreModule from './modules/load-more'
import scrollerModule from './modules/scroller'
import backToTopModule from './modules/back-to-top'
import virtualListModule from './modules/virtual-list'

import Enum from './z-paging-enum'

const systemInfo = uni.getSystemInfoSync();

// #ifdef APP-NVUE
const weexDom = weex.requireModule('dom');
// #endif

export default {
	name: "z-paging",
	components: {
		zPagingRefresh,
		zPagingLoadMore,
		zPagingEmptyView
	},
	mixins: [
		dataHandleModule,
		i18nModule,
		nvueModule,
		emptyModule,
		refresherModule,
		loadMoreModule,
		scrollerModule,
		backToTopModule,
		virtualListModule
	],
	data() {
		return {
			//--------------静态资源---------------
			base64Arrow: zStatic.base64Arrow,
			base64Flower: zStatic.base64Flower,
			base64BackToTop: zStatic.base64BackToTop,

			//-------------全局数据相关--------------
			//当前加载类型
			loadingType: Enum.LoadingType.Refresher,
			requestTimeStamp: 0,
			chatRecordLoadingMoreText: '',
			wxsPropType: '',
			renderPropScrollTop: -1,
			renderPropUsePageScroll: -1,
			checkScrolledToBottomTimeOut: null,
			systemInfo: null,
			cssSafeAreaInsetBottom: -1,
			cacheTopHeight: 0,

			//--------------状态&判断---------------
			insideOfPaging: -1,
			loading: false,
			loadingForNow: false,
			isLoadFailed: false,
			isIos: systemInfo.platform === 'ios',
			disabledBounce: false,
			fromCompleteEmit: false,
			disabledCompleteEmit: false,
			
			//---------------wxs相关---------------
			wxsIsScrollTopInTopRange: true,
			wxsScrollTop: 0,
			wxsPageScrollTop: 0,
			wxsOnPullingDown: false,
		};
	},
	props: {
		//调用complete后延迟处理的时间，单位为毫秒，默认0毫秒，优先级高于minDelay
		delay: {
			type: [Number, String],
			default: u.gc('delay', 0),
		},
		//触发@query后最小延迟处理的时间，单位为毫秒，默认0毫秒，优先级低于delay（假设设置为300毫秒，若分页请求时间小于300毫秒，则在调用complete后延迟[300毫秒-请求时长]；若请求时长大于300毫秒，则不延迟），当show-refresher-when-reload为true或reload(true)时，其最小值为400
		minDelay: {
			type: [Number, String],
			default: u.gc('minDelay', 0),
		},
		//设置z-paging的style，部分平台(如微信小程序)无法直接修改组件的style，可使用此属性代替
		pagingStyle: {
			type: Object,
			default: function() {
				return u.gc('pagingStyle', {});
			},
		},
		//z-paging的高度，优先级低于pagingStyle中设置的height；传字符串，如100px、100rpx、100%
		height: {
			type: String,
			default: u.gc('height', '')
		},
		//z-paging的宽度，优先级低于pagingStyle中设置的width；传字符串，如100px、100rpx、100%
		width: {
			type: String,
			default: u.gc('width', '')
		},
		//z-paging的背景色，优先级低于pagingStyle中设置的background。传字符串，如"#ffffff"
		bgColor: {
			type: String,
			default: u.gc('bgColor', '')
		},
		//设置z-paging的容器(插槽的父view)的style
		pagingContentStyle: {
			type: Object,
			default: function() {
				return u.gc('pagingContentStyle', {});
			},
		},
		//z-paging是否自动高度，若自动高度则会自动铺满屏幕
		autoHeight: {
			type: Boolean,
			default: u.gc('autoHeight', false)
		},
		//z-paging是否自动高度时，附加的高度，注意添加单位px或rpx，若需要减少高度，则传负数
		autoHeightAddition: {
			type: [Number, String],
			default: u.gc('autoHeightAddition', '0px')
		},
		//loading(下拉刷新、上拉加载更多)的主题样式，支持black，white，默认black
		defaultThemeStyle: {
			type: String,
			default: function() {
				return u.gc('defaultThemeStyle', 'black');
			}
		},
		//是否使用虚拟列表，默认为否
		useVirtualList: {
			type: Boolean,
			default: u.gc('useVirtualList', false)
		},
		//z-paging是否使用fixed布局，若使用fixed布局，则z-paging的父view无需固定高度，z-paging高度默认为100%，默认为是(当使用内置scroll-view滚动时有效)
		fixed: {
			type: Boolean,
			default: u.gc('fixed', true)
		},
		//是否开启底部安全区域适配
		safeAreaInsetBottom: {
			type: Boolean,
			default: u.gc('safeAreaInsetBottom', false)
		},
		//第一次加载后自动隐藏loading slot，默认为是
		autoHideLoadingAfterFirstLoaded: {
			type: Boolean,
			default: u.gc('autoHideLoadingAfterFirstLoaded', true)
		},
		//loading slot是否铺满屏幕并固定，默认为否
		loadingFullFixed: {
			type: Boolean,
			default: u.gc('loadingFullFixed', false)
		},
		//slot="top"的view的z-index，默认为99，仅使用页面滚动时有效
		topZIndex: {
			type: Number,
			default: u.gc('topZIndex', 99)
		},
		//z-paging内容容器父view的z-index，默认为1
		superContentZIndex: {
			type: Number,
			default: u.gc('superContentZIndex', 1)
		},
		//z-paging内容容器部分的z-index，默认为10
		contentZIndex: {
			type: Number,
			default: u.gc('contentZIndex', 10)
		},
		//使用页面滚动时，是否在不满屏时自动填充满屏幕，默认为是
		autoFullHeight: {
			type: Boolean,
			default: u.gc('autoFullHeight', true)
		},
		//是否将错误信息打印至控制台，默认为是
		showConsoleError: {
			type: Boolean,
			default: u.gc('showConsoleError', true)
		},
	},
	created(){
		if (this.createdReload && !this.refresherOnly && (this.mountedAutoCallReload && this.auto)) {
			this._startLoading();
			this._preReload();
		}
	},
	mounted() {
		this.wxsPropType = u.getTime().toString();
		this.renderJsIgnore;
		if (!this.createdReload && !this.refresherOnly && (this.mountedAutoCallReload && this.auto)) {
			this.$nextTick(() => {
				this._preReload();
			})
		}
		let delay = 0;
		// #ifdef H5 || MP
		delay = 100;
		// #endif
		this.$nextTick(() => {
			this.systemInfo = uni.getSystemInfoSync();
			if (!this.usePageScroll && this.autoHeight) {
				this._setAutoHeight();
			}
			this.loaded = true;
		})
		this.updatePageScrollTopHeight();
		this.updatePageScrollBottomHeight();
		if (this.finalRefresherEnabled && this.useCustomRefresher) {
			this.$nextTick(() => {
				this.isTouchmoving = true;
			})
		}
		this._onEmit();
		// #ifdef APP-NVUE
		if (!this.isIos && !this.useChatRecordMode) {
			this.nLoadingMoreFixedHeight = true;
		}
		this._nUpdateRefresherWidth();
		// #endif
		// #ifndef APP-PLUS
		this.$nextTick(()=>{
			setTimeout(()=>{
				this._getCssSafeAreaInsetBottom();
			},delay)
		})
		// #endif
	},
	destroyed() {
		this._offEmit();
	},
	// #ifdef VUE3
	unmounted() {
		this._offEmit();
	},
	// #endif
	watch: {
		loadingStatus(newVal, oldVal) {
			this.$emit('loadingStatusChange', newVal);
			this.$nextTick(()=>{
				this.loadingStatusAfterRender = newVal;
			})
			// #ifdef APP-NVUE
			if (this.useChatRecordMode) {
				if (this.pageNo === this.defaultPageNo && newVal === Enum.More.NoMore) {
					this.nIsFirstPageAndNoMore = true;
					return;
				}
			}
			this.nIsFirstPageAndNoMore = false;
			//  #endif
		},
		loading(newVal){
			if(newVal){
				this.loadingForNow = newVal;
			}
		},
		defaultThemeStyle: {
			handler(newVal) {
				if (newVal.length) {
					this.finalRefresherDefaultStyle = newVal;
				}
			},
			immediate: true
		},
		autoHeight(newVal, oldVal) {
			if (this.loaded && !this.usePageScroll) {
				this._setAutoHeight(newVal);
			}
		},
		autoHeightAddition(newVal, oldVal) {
			if (this.loaded && !this.usePageScroll && this.autoHeight) {
				this._setAutoHeight(newVal);
			}
		},
	},
	computed: {
		zScopedSlots() {
			return this.$scopedSlots;
		},
		finalPagingStyle() {
			let pagingStyle = this.pagingStyle;
			if (!this.systemInfo) return pagingStyle;
			const windowTop = this.systemInfo.windowTop;
			const windowBottom = this.systemInfo.windowBottom;
			if (!this.usePageScroll && this.fixed) {
				if (windowTop && !pagingStyle.top) {
					pagingStyle.top = windowTop + 'px';
				}
				if (!pagingStyle.bottom) {
					let bottom = windowBottom || 0;
					if (this.safeAreaInsetBottom) {
						bottom += this.safeAreaBottom;
					}
					if(bottom > 0){
						pagingStyle.bottom = bottom + 'px';
					}
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
			return pagingStyle;
		},
		finalLowerThreshold() {
			return u.convertTextToPx(this.lowerThreshold);
		},
		finalPagingContentStyle() {
			if (this.contentZIndex != 1) {
				this.pagingContentStyle['z-index'] = this.contentZIndex;
				this.pagingContentStyle['position'] = 'relative';
			}
			return this.pagingContentStyle;
		},
		showLoading() {
			if (this.firstPageLoaded || !this.loading || !this.loadingForNow) return false;
			if (this.autoHideLoadingAfterFirstLoaded) {
				return this.fromEmptyViewReload ? true : !this.pagingLoaded;
			} else{
				return this.loadingType === Enum.LoadingType.Refresher;
			}
		},
		safeAreaBottom() {
			if (!this.systemInfo) return 0;
			let safeAreaBottom = 0;
			// #ifdef APP-PLUS
			safeAreaBottom = this.systemInfo.safeAreaInsets.bottom || 0;
			// #endif
			// #ifndef APP-PLUS
			safeAreaBottom = this.cssSafeAreaInsetBottom === -1 ? 0 : this.cssSafeAreaInsetBottom;
			// #endif
			return safeAreaBottom;
		},
		renderJsIgnore() {
			if ((this.usePageScroll && this.useChatRecordMode) || !this.refresherEnabled || !this.useCustomRefresher) {
				this.$nextTick(() => {
					this.renderPropScrollTop = 10;
				})
			}
			return 0;
		},
		windowHeight() {
			return !this.systemInfo ? 0 : this.systemInfo.windowHeight || 0;
		},
		windowTop() {
			return !this.systemInfo ? 0 : this.systemInfo.windowTop || 0;
		},
		windowBottom() {
			if (!this.systemInfo) return 0;
			let windowBottom = this.systemInfo.windowBottom || 0;
			if (this.safeAreaInsetBottom) {
				windowBottom += this.safeAreaBottom;
			}
			return windowBottom;
		},
	},
	methods: {
		//当前版本号
		getVersion() {
			return `z-paging v${zConstant.version}`;
		},
		//设置nvue List的specialEffects
		setSpecialEffects(args) {
			this.setListSpecialEffects(args);
		},
		//与setSpecialEffects等效，兼容旧版本
		setListSpecialEffects(args) {
			this.nFixFreezing = args !== {};
			if (this.isIos) {
				this.privateRefresherEnabled = 0;
			}
			if (!this.usePageScroll) {
				this.$refs['zp-n-list'].setSpecialEffects(args);
			}
		},
		//处理开始加载更多状态
		_startLoading(isReload = false) {
			if ((this.showLoadingMoreWhenReload && !this.isUserPullDown) || !isReload) {
				this.loadingStatus = Enum.More.Loading;
			}
			this.loading = true;
		},
		//检测scrollView是否要铺满屏幕
		_doCheckScrollViewShouldFullHeight(totalData){
			if (this.autoFullHeight && this.usePageScroll && this.isTotalChangeFromAddData) {
				// #ifndef APP-NVUE
				this.$nextTick(() => {
					this._checkScrollViewShouldFullHeight((scrollViewNode, pagingContainerNode) => {
						this._preCheckShowLoadingMoreWhenNoMoreAndInsideOfPaging(totalData, scrollViewNode, pagingContainerNode)
					});
				})
				// #endif
				// #ifdef APP-NVUE
				this._preCheckShowLoadingMoreWhenNoMoreAndInsideOfPaging(totalData)
				// #endif
			} else {
				this._preCheckShowLoadingMoreWhenNoMoreAndInsideOfPaging(totalData)
			} 
		},
		//检测z-paging是否要全屏覆盖(当使用页面滚动并且不满全屏时，默认z-paging需要铺满全屏，避免数据过少时内部的empty-view无法正确展示)
		async _checkScrollViewShouldFullHeight(callback) {
			try {
				const scrollViewNode = await this._getNodeClientRect('.zp-scroll-view');
				const pagingContainerNode = await this._getNodeClientRect('.zp-paging-container-content');
				if (!scrollViewNode || !pagingContainerNode) return;
				const scrollViewHeight = pagingContainerNode[0].height;
				const scrollViewTop = scrollViewNode[0].top;
				if (this.isAddedData && scrollViewHeight + scrollViewTop <= this.windowHeight) {
					this._setAutoHeight(true, scrollViewNode);
					callback(scrollViewNode, pagingContainerNode);
				} else {
					this._setAutoHeight(false);
					callback(null, null);
				}
			} catch (e) {
				callback(null, null);
			}
		},
		//设置z-paging高度
		async _setAutoHeight(shouldFullHeight = true, scrollViewNode = null) {
			let heightKey = 'height';
			// #ifndef APP-NVUE
			if (this.usePageScroll) {
				heightKey = 'min-height';
			}
			// #endif
			try {
				if (shouldFullHeight) {
					let finalScrollViewNode = scrollViewNode ? scrollViewNode : await this._getNodeClientRect('.scroll-view');
					let finalScrollBottomNode = await this._getNodeClientRect('.zp-page-bottom');
					if (finalScrollViewNode) {
						const scrollViewTop = finalScrollViewNode[0].top;
						let scrollViewHeight = this.windowHeight - scrollViewTop;
						if(finalScrollBottomNode){
							scrollViewHeight -= finalScrollBottomNode[0].height;
						}
						let additionHeight = u.convertTextToPx(this.autoHeightAddition);
						this.$set(this.scrollViewStyle, heightKey, scrollViewHeight + additionHeight - (this.insideMore ? 1 : 0) + 'px');
						this.$set(this.scrollViewInStyle, heightKey, scrollViewHeight + additionHeight - (this.insideMore ? 1 : 0) + 'px');
					}
				} else {
					this.$delete(this.scrollViewStyle, heightKey);
					this.$delete(this.scrollViewInStyle, heightKey);
				}
			} catch (e) {}
		},
		//通过获取css设置的底部安全区域占位view高度设置bottom距离
		_getCssSafeAreaInsetBottom(){
			this._getNodeClientRect('.zp-safe-area-inset-bottom').then((res) => {
				if (res) {
					this.cssSafeAreaInsetBottom = res[0].height;
					if (this.safeAreaInsetBottom) {
						this.updatePageScrollBottomHeight();
					}
				}
			});
		},
		//触发更新是否超出页面状态
		_updateInsideOfPaging() {
			if (this.insideMore && this.insideOfPaging === true) {
				setTimeout(() => {
					this.doLoadMore();
				}, 200)
			}
		},
		//获取节点尺寸
		_getNodeClientRect(select, inThis = true, scrollOffset = false) {
			// #ifdef APP-NVUE
			select = select.replace('.', '').replace('#', '');
			const ref = this.$refs[select];
			return new Promise((resolve, reject) => {
				if (ref) {
					weexDom.getComponentRect(ref, option => {
						if (option && option.result) {
							resolve([option.size]);
						} else {
							resolve(false);
						}
					})
				} else {
					resolve(false);
				}
			});
			return;
			// #endif
			//#ifdef MP-ALIPAY
			inThis = false;
			//#endif
			let res = inThis ? uni.createSelectorQuery().in(this) : uni.createSelectorQuery();
			if (scrollOffset) {
				res.select(select).scrollOffset();
			} else {
				res.select(select).boundingClientRect();
			}
			return new Promise((resolve, reject) => {
				res.exec(data => {
					resolve((data && data != '' && data != undefined && data.length) ? data : false);
				});
			});
		},
		//清除timeout
		_cleanTimeout(timeout) {
			if (timeout) {
				clearTimeout(timeout);
				timeout = null;
			}
			return timeout;
		},
		//添加全局emit监听
		_onEmit() {
			uni.$on(c.i18nUpdateKey, () => {
				this.tempLanguageUpdateKey = u.getTime();
			})
			uni.$on(c.errorUpdateKey, () => {
				if (this.loading) {
					this.complete(false);
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
		//销毁全局emit监听
		_offEmit(){
			uni.$off(c.i18nUpdateKey);
			uni.$off(c.errorUpdateKey);
			uni.$off(c.completeUpdateKey);
		}
	},
};
