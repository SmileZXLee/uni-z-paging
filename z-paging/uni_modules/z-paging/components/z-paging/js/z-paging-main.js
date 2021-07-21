// z-paging
// github地址:https://github.com/SmileZXLee/uni-z-paging
// dcloud地址:https://ext.dcloud.net.cn/plugin?id=3935
// 反馈QQ群：790460711

import zStatic from './z-paging-static'
import zConfig from './z-paging-config'
import zUtils from './z-paging-utils'
import zI18n from './z-paging-i18n'
import zPagingRefresh from '../components/z-paging-refresh'
import zPagingLoadMore from '../components/z-paging-load-more'
import zPagingEmptyView from '../../z-paging-empty-view/z-paging-empty-view'

const currentVersion = 'V1.9.4';
const systemInfo = uni.getSystemInfoSync();
const commonDelayTime = 100;
const i18nUpdateKey = 'z-paging-i18n-update';
const errorUpdateKey = 'z-paging-error-emit';
let config = null;
// #ifdef APP-NVUE
const weexDom = weex.requireModule('dom');
const weexAnimation = weex.requireModule('animation');
// #endif
try {
	const contextKeys = require.context('@/uni_modules/z-paging', false, /\z-paging-config$/).keys();
	if (contextKeys.length) {
		const suffix = '.js';
		config = require('@/uni_modules/z-paging/z-paging-config' + suffix);
	}
} catch {}

//获取默认配置信息
function _getConfig(key, defaultValue) {
	if (!config) {
		const temConfig = zConfig.getConfig();
		if (zConfig && temConfig) {
			config = temConfig;
		}
	}
	if (!config) {
		return defaultValue;
	}
	let value = config[toKebab(key)];
	if (value === undefined) {
		value = config[key];
	}
	if (value !== undefined) {
		return value;
	}
	return defaultValue;
}
//驼峰转短横线
function toKebab(value) {
	return value.replace(/([A-Z])/g, "-$1").toLowerCase();
}

/**
 * z-paging 分页组件
 * @description 【uni-app自动分页器】超简单，低耦合！仅需两步轻松完成完整分页逻辑(下拉刷新、上拉加载更多)，分页全自动处理。支持自定义加载更多的文字或整个view，自定义下拉刷新样式，自动管理空数据view等。
 * @tutorial https://github.com/SmileZXLee/uni-z-paging
 * @property {Number|String} default-page-no 自定义pageNo，默认为1
 * @property {Number|String} default-page-size 自定义pageSize，默认为10
 * @property {Number|Object} data-key 为保证数据一致，设置当前tab切换时的标识key，并在complete中传递相同key，若二者不一致，则complete将不会生效
 * @property {String} language i18n国际化设置语言，支持简体中文(zh-cn)、繁体中文(zh-hant-cn)和英文(en)
 * @property {Boolean} follow-system-language i18n国际化默认是否跟随系统语言，默认为是
 * @property {Object} paging-style 设置z-paging的style，部分平台可能无法直接修改组件的style，可使用此属性代替
 * @property {Object} paging-content-style 设置z-paging的容器(插槽的父view)的style
 * @property {Boolean} auto-height z-paging是否自动高度，若自动高度则会自动铺满屏幕，默认为否
 * @property {Number|String} auto-height-addition z-paging是否自动高度时，附加的高度，注意添加单位px或rpx，默认为px，若需要减少高度，请传负数
 * @property {String} default-theme-style loading(下拉刷新、上拉加载更多)的主题样式，支持black，white，默认black
 * @property {String} refresher-theme-style 下拉刷新的主题样式，支持black，white，默认black
 * @property {String} loading-more-theme-style 底部加载更多的主题样式，支持black，white，默认black
 * @property {Boolean} refresher-only 是否只使用下拉刷新，设置为true后将关闭mounted自动请求数据、关闭滚动到底部加载更多，强制隐藏空数据图。默认为否
 * @property {Boolean} use-page-scroll 使用页面滚动，默认为否，当设置为是时则使用页面的滚动而非此组件内部的scroll-view的滚动，使用页面滚动时z-paging无需设置确定的高度且对于长列表展示性能更高，但配置会略微繁琐
 * @property {Boolean} fixed z-paging是否使用fixed布局，若使用fixed布局，则z-paging的父view无需固定高度，z-paging高度默认为100%，默认为否(当使用内置scroll-view滚动时有效)
 * @property {Boolean} mounted-auto-call-reload z-paging mounted后自动调用reload方法(mounted后自动调用接口)，默认为是
 * @property {Boolean} auto-scroll-to-top-when-reload reload时自动滚动到顶部，默认为是
 * @property {Boolean} auto-clean-list-when-reload reload时立即自动清空原list，默认为是，若立即自动清空，则在reload之后、请求回调之前页面是空白的
 * @property {Boolean} show-refresher-when-reload 调用reload方法时是否自动显示下拉刷新view，默认为否
 * @property {Boolean} refresher-update-time-key 如果需要区别不同页面的最后更新时间，请为不同页面的z-paging的`refresher-update-time-key`设置不同的字符串
 * @property {Boolean} use-custom-refresher 是否使用自定义的下拉刷新，默认为是，即使用z-paging的下拉刷新。设置为false即代表使用uni scroll-view自带的下拉刷新，h5、App、微信小程序以外的平台不支持uni scroll-view自带的下拉刷新
 * @property {Number|String} refresher-fps 自定义下拉刷新下拉帧率，默认为40，过高可能会出现抖动问题(use-custom-refresher为true时生效)
 * @property {Number|String} refresher-max-angle 自定义下拉刷新允许触发的最大下拉角度，默认为40度，当下拉角度小于设定值时，自定义下拉刷新动画不会被触发
 * @property {Boolean} refresher-angle-enable-change-continued 自定义下拉刷新的角度由未达到最大角度变到达到最大角度时，是否继续下拉刷新手势，默认为否
 * @property {String|Object} refresher-default-text 自定义下拉刷新默认状态下的文字(use-custom-refresher为true时生效)
 * @property {String|Object} refresher-pulling-text 自定义下拉刷新松手立即刷新状态下的文字(use-custom-refresher为true时生效)
 * @property {String|Object} refresher-refreshing-text 自定义下拉刷新刷新中状态下的文字(use-custom-refresher为true时生效)
 * @property {Boolean} refresher-end-bounce-enabled 是否开启自定义下拉刷新刷新结束回弹效果，默认为是(use-custom-refresher为true时生效)
 * @property {Object} loading-more-custom-style 自定义底部加载更多样式
 * @property {Object} loading-more-loading-icon-custom-style 自定义底部加载更多加载中动画样式
 * @property {String} loading-more-loading-icon-type 自定义底部加载更多加载中动画图标类型，可选circle或flower，默认为circle
 * @property {String} loading-more-loading-icon-custom-image 自定义底部加载更多加载中动画图标图片
 * @property {Boolean} loading-more-enabled 是否启用加载更多数据(含滑动到底部加载更多数据和点击加载更多数据)，默认为是
 * @property {Boolean} to-bottom-loading-more-enabled 是否启用滑动到底部加载更多数据
 * @property {String|Object} loading-more-default-text 滑动到底部"默认"文字，默认为【点击加载更多】
 * @property {String|Object} loading-more-loading-text 滑动到底部"加载中"文字，默认为【正在加载...】
 * @property {String|Object} loading-more-no-more-text 滑动到底部"没有更多"文字，默认为【没有更多了】
 * @property {String|Object} loading-more-fail-text 滑动到底部"加载失败"文字，默认为【加载失败，点击重新加载】
 * @property {Boolean} hide-loading-more-when-no-more-and-inside-of-paging 当没有更多数据且分页内容未超出z-paging时是否隐藏没有更多数据的view，默认为是
 * @property {Boolean} show-loading-more-no-more-view 是否显示没有更多数据的view，默认为是
 * @property {Boolean} show-default-loading-more-text 是否显示默认的加载更多text，默认为是
 * @property {Boolean} show-loading-more-no-more-line 是否显示没有更多数据的分割线，默认为是
 * @property {Object} loading-more-no-more-line-custom-style 自定义底部没有更多数据的分割线样式
 * @property {Boolean} hide-empty-view 是否强制隐藏空数据图，默认为否
 * @property {String|Object} empty-view-text 空数据图描述文字，默认为“没有数据哦~”
 * @property {String} empty-view-img 空数据图图片，默认使用z-paging内置的图片
 * @property {Boolean} auto-hide-empty-view-when-loading 加载中时是否自动隐藏空数据图，默认为是
 * @property {Boolean} auto-hide-loading-after-first-loaded 第一次加载后自动隐藏loading slot，默认为是
 * @property {Boolean} auto-show-back-to-top 自动显示点击返回顶部按钮，默认为否
 * @property {Number|String} back-to-top-threshold 点击返回顶部按钮显示/隐藏的阈值(滚动距离)，单位为px，默认为400rpx
 * @property {String} back-to-top-img 点击返回顶部按钮的自定义图片地址，默认使用z-paging内置的图片
 * @property {Boolean} back-to-top-with-animate 点击返回顶部按钮返回到顶部时是否展示过渡动画，默认为是
 * @property {Number|String} back-to-top-bottom 点击返回顶部按钮与底部的距离，注意添加单位px或rpx，默认为160rpx
 * @property {Object} back-to-top-style 点击返回顶部按钮的自定义样式
 * @property {Boolean} show-scrollbar 在设置滚动条位置时使用动画过渡，默认为否
 * @property {Boolean} scroll-to-top-bounce-enabled iOS设备上滚动到顶部时是否允许回弹效果，默认为否。关闭回弹效果后可使滚动到顶部与下拉刷新更连贯，但是有吸顶view时滚动到顶部时可能出现抖动。
 * @property {Boolean} scroll-with-animation 控制是否出现滚动条，默认为否
 * @property {String} scroll-into-view 值应为某子元素id（id不能以数字开头）。设置哪个方向可滚动，则在哪个方向滚动到该元素
 * @property {Number|String} lower-threshold 距底部/右边多远时（单位px），触发 scrolltolower 事件，默认为100rpx
 * @property {Boolean} enable-back-to-top iOS点击顶部状态栏、安卓双击标题栏时，滚动条返回顶部，只支持竖向，默认为是
 * @property {Boolean} refresher-enabled 是否开启自定义下拉刷新，默认为是
 * @property {Number|String} refresher-threshold 设置自定义下拉刷新阈值，默认为80rpx
 * @property {String} refresher-default-style 设置自定义下拉刷新默认样式，支持设置 black，white，none，none 表示不使用默认样式，默认为black
 * @property {String} refresher-background 设置自定义下拉刷新区域背景颜色
 * @property {Boolean} show-refresher-update-time 是否显示上次下拉刷新更新时间，默认为否
 * @property {String} refresher-update-time-key 上次下拉刷新更新时间的key，用于区别不同的上次更新时间
 * @property {Number|String} local-paging-loading-time 本地分页时上拉加载更多延迟时间，单位为毫秒，默认200毫秒
 * @property {Boolean} use-chat-record-mode 使用聊天记录模式，默认为否
 * @property {String} nvue-list-is nvue中修改列表类型，可选值有list、waterfall和scroller，默认为list
 * @property {Object} nvue-waterfall-config nvue waterfall配置，仅在nvue中且nvueListIs=waterfall时有效，配置参数详情参见：https://uniapp.dcloud.io/component/waterfall
 * @event {Function} addData 请求结束(成功或者失败)调用此方法，将请求的结果传递给z-paging处理，第一个参数为请求结果数组，第二个参数为是否成功(默认为是)
 * @event {Function} setLocalPaging 设置本地分页，请求结束(成功或者失败)调用此方法，将请求的结果传递给z-paging作分页处理（若调用了此方法，则上拉加载更多时内部会自动分页，不会触发@query所绑定的事件）
 * @event {Function} reload 重新加载分页数据，pageNo恢复为默认值，相当于下拉刷新的效果(animate为true时会展示下拉刷新动画，默认为false)
 * @event {Function} endRefresh 手动停止下拉刷新加载
 * @event {Function} loadingStatusChange 分页加载状态改变(0-默认状态 1.加载中 2.没有更多数据 3.加载失败)
 * @event {Function} refresherStatusChange 自定义下拉刷新状态改变(use-custom-refresher为true时生效)(0-默认状态 1.松手立即刷新 2.刷新中)
 * @event {Function} refresherTouchstart 自定义下拉刷新下拉开始(use-custom-refresher为true时生效)【注：当需要更细致定制自定义下拉刷新时使用，如果只需监听下拉刷新各个状态改变，使用`refresherStatusChange`即可】
 * @event {Function} refresherTouchmove 自定义下拉刷新下拉中(use-custom-refresher为true时生效)【注：当需要更细致定制自定义下拉刷新时使用，如果只需监听下拉刷新各个状态改变，使用`refresherStatusChange`即可】
 * @event {Function} refresherTouchend 自定义下拉刷新下拉结束(use-custom-refresher为true时生效)【注：当需要更细致定制自定义下拉刷新时使用，如果只需监听下拉刷新各个状态改变，使用`refresherStatusChange`即可】
 * @event {Function} onRefresh 自定义下拉刷新被触发
 * @event {Function} onRestore 自定义下拉刷新被复位
 * @event {Function} scroll 滚动时触发，event.detail = {scrollLeft, scrollTop, scrollHeight, scrollWidth, deltaX, deltaY}
 * @example <z-paging ref="paging" v-model="dataList" @query="queryList"></z-paging>
 */
export default {
	name: "z-paging",
	components: {
		zPagingRefresh,
		zPagingLoadMore,
		zPagingEmptyView
	},
	data() {
		return {
			base64Arrow: zStatic.base64Arrow,
			base64Flower: zStatic.base64Flower,
			base64BackToTop: zStatic.base64BackToTop,
			systemInfo: null,
			currentData: [],
			totalData: [],
			pageNo: 1,
			showLoadingMore: false,
			refresherTriggered: false,
			loading: false,
			firstPageLoaded: false,
			pagingLoaded: false,
			loaded: false,
			isUserReload: true,
			scrollEnable: true,
			scrollTop: 0,
			oldScrollTop: 0,
			refresherTouchstartY: 0,
			lastRefresherTouchmove: null,
			refresherReachMaxAngle: true,
			refresherTransform: 'translateY(0px)',
			refresherTransition: '0s',
			finalRefresherDefaultStyle: 'black',
			//当前加载类型 0-下拉刷新 1-上拉加载更多
			loadingType: 0,
			//底部加载更多状态 0-默认状态 1.加载中 2.没有更多数据 3.加载失败
			loadingStatus: 0,
			//下拉刷新状态 0-默认状态 1.松手立即刷新 2.刷新中
			refresherStatus: 0,
			scrollViewStyle: {},
			pullDownTimeStamp: 0,
			pageScrollTop: -1,
			isTouchmoving: false,
			isLocalPaging: false,
			totalLocalPagingList: [],
			realTotalData: [],
			isAddedData: false,
			isTotalChangeFromAddData: false,
			isTouchEnded: false,
			isUserPullDown: false,
			privateRefresherEnabled: -1,
			privateScrollWithAnimation: -1,
			myParentQuery: -1,
			chatRecordLoadingMoreText: '',
			moveDistance: 0,
			loadingMoreDefaultSlot: null,
			backToTopClass: 'zp-back-to-top zp-back-to-top-hide',
			showBackToTopClass: false,
			tempLanguageUpdateKey: 0,
			isLoadFailed: false,
			isIos: systemInfo.platform === 'ios',
			privateShowRefresherWhenReload: false,
			nRefresherLoading: true,
			nListIsDragging: false,
			nShowBottom: true,
			nFixFreezing: false,
			nShowRefresherReveal: false,
			nShowRefresherRevealHeight: 0,
			nIsFirstPageAndNoMore: false,
			nFirstPageAndNoMoreChecked: false,
			nLoadingMoreFixedHeight: false,
			wxsPropType: '',
			refresherRevealStackCount: 0,
			renderPropScrollTop: 0,
			renderUsePageScroll: false,
			wxsIsScrollTopInTopRange: true,
			wxsScrollTop: 0,
			wxsPageScrollTop: 0,
			wxsOnPullingDown: false,
			disabledBounce: false,
			cacheScrollNodeHeight: -1,
			customNoMore: -1
		};
	},
	props: {
		//自定义pageNo，默认为1
		defaultPageNo: {
			type: [Number, String],
			default: _getConfig('defaultPageNo', 1),
			observer: function(newVal, oldVal) {
				this.pageNo = newVal;
			},
		},
		//自定义pageSize，默认为10
		defaultPageSize: {
			type: [Number, String],
			default: _getConfig('defaultPageSize', 10),
		},
		//为保证数据一致，设置当前tab切换时的标识key，并在complete中传递相同key，若二者不一致，则complete将不会生效
		dataKey: {
			type: [Number, Object],
			default: function() {
				return _getConfig('dataKey', null);
			},
		},
		//自动注入的list名，可自动修改父view(包含ref="paging")中对应name的list值
		autowireListName: {
			type: String,
			default: function() {
				return _getConfig('autowireListName', '');
			},
		},
		//自动注入的query名，可自动调用父view(包含ref="paging")中的query方法
		autowireQueryName: {
			type: String,
			default: function() {
				return _getConfig('autowireQueryName', '');
			},
		},
		//i18n国际化设置语言，支持简体中文(zh-cn)、繁体中文(zh-hant-cn)和英文(en)
		language: {
			type: String,
			default: _getConfig('language', '')
		},
		//i18n国际化默认是否跟随系统语言，默认为是
		followSystemLanguage: {
			type: Boolean,
			default: _getConfig('followSystemLanguage', true)
		},
		//设置z-paging的style，部分平台可能无法直接修改组件的style，可使用此属性代替
		pagingStyle: {
			type: Object,
			default: function() {
				return _getConfig('pagingStyle', {});
			},
		},
		//设置z-paging的容器(插槽的父view)的style
		pagingContentStyle: {
			type: Object,
			default: function() {
				return _getConfig('pagingContentStyle', {});
			},
		},
		//z-paging是否自动高度，若自动高度则会自动铺满屏幕
		autoHeight: {
			type: Boolean,
			default: _getConfig('autoHeight', false)
		},
		//z-paging是否自动高度时，附加的高度，注意添加单位px或rpx，若需要减少高度，则传负数
		autoHeightAddition: {
			type: [Number, String],
			default: _getConfig('autoHeightAddition', '0px')
		},
		//loading(下拉刷新、上拉加载更多)的主题样式，支持black，white，默认black
		defaultThemeStyle: {
			type: String,
			default: function() {
				return _getConfig('defaultThemeStyle', 'black');
			}
		},
		//下拉刷新的主题样式，支持black，white，默认black
		refresherThemeStyle: {
			type: String,
			default: function() {
				return _getConfig('refresherThemeStyle', '');
			}
		},
		//底部加载更多的主题样式，支持black，white，默认black
		loadingMoreThemeStyle: {
			type: String,
			default: function() {
				return _getConfig('loadingMoreThemeStyle', '');
			}
		},
		//是否只使用下拉刷新，设置为true后将关闭mounted自动请求数据、关闭滚动到底部加载更多，强制隐藏空数据图。默认为否
		refresherOnly: {
			type: Boolean,
			default: _getConfig('refresherOnly', false)
		},
		//使用页面滚动，默认为否，当设置为是时则使用页面的滚动而非此组件内部的scroll-view的滚动，使用页面滚动时z-paging无需设置确定的高度且对于长列表展示性能更高，但配置会略微繁琐
		usePageScroll: {
			type: Boolean,
			default: _getConfig('usePageScroll', false)
		},
		//z-paging是否使用fixed布局，若使用fixed布局，则z-paging的父view无需固定高度，z-paging高度默认为100%，默认为否(当使用内置scroll-view滚动时有效)
		fixed: {
			type: Boolean,
			default: _getConfig('fixed', true)
		},
		//是否开启底部安全区域适配
		safeAreaInsetBottom: {
			type: Boolean,
			default: _getConfig('safeAreaInsetBottom', false)
		},
		//是否可以滚动，使用内置scroll-view和nvue时有效，默认为是
		scrollable: {
			type: Boolean,
			default: _getConfig('scrollable', true)
		},
		//z-paging mounted后自动调用reload方法(mounted后自动调用接口)，默认为是。请使用简便写法：auto
		mountedAutoCallReload: {
			type: Boolean,
			default: _getConfig('mountedAutoCallReload', true)
		},
		//z-paging mounted后自动调用reload方法(mounted后自动调用接口)，默认为是
		auto: {
			type: Boolean,
			default: _getConfig('auto', true)
		},
		//reload时自动滚动到顶部，默认为是
		autoScrollToTopWhenReload: {
			type: Boolean,
			default: _getConfig('autoScrollToTopWhenReload', true)
		},
		//reload时立即自动清空原list，默认为是，若立即自动清空，则在reload之后、请求回调之前页面是空白的
		autoCleanListWhenReload: {
			type: Boolean,
			default: _getConfig('autoCleanListWhenReload', true)
		},
		//调用reload方法时自动显示下拉刷新view，默认为否
		showRefresherWhenReload: {
			type: Boolean,
			default: _getConfig('showRefresherWhenReload', false)
		},
		//调用reload方法时自动显示加载更多view，且为加载中状态，默认为否
		showLoadingMoreWhenReload: {
			type: Boolean,
			default: _getConfig('showLoadingMoreWhenReload', false)
		},
		//是否使用自定义的下拉刷新，默认为是，即使用z-paging的下拉刷新。设置为false即代表使用uni scroll-view自带的下拉刷新，h5、App、微信小程序以外的平台不支持uni scroll-view自带的下拉刷新
		useCustomRefresher: {
			type: Boolean,
			default: _getConfig('useCustomRefresher', true)
		},
		//自定义下拉刷新下拉帧率，默认为40，过高可能会出现抖动问题(use-custom-refresher为true时生效)
		refresherFps: {
			type: [Number, String],
			default: _getConfig('refresherFps', 40)
		},
		//自定义下拉刷新允许触发的最大下拉角度，默认为40度，当下拉角度小于设定值时，自定义下拉刷新动画不会被触发
		refresherMaxAngle: {
			type: [Number, String],
			default: _getConfig('refresherMaxAngle', 40)
		},
		//自定义下拉刷新的角度由未达到最大角度变到达到最大角度时，是否继续下拉刷新手势，默认为否
		refresherAngleEnableChangeContinued: {
			type: Boolean,
			default: _getConfig('refresherAngleEnableChangeContinued', false)
		},
		//自定义下拉刷新默认状态下的文字(use-custom-refresher为true时生效)
		refresherDefaultText: {
			type: [String, Object],
			default: _getConfig('refresherDefaultText', null)
		},
		//自定义下拉刷新松手立即刷新状态下的文字(use-custom-refresher为true时生效)
		refresherPullingText: {
			type: [String, Object],
			default: _getConfig('refresherPullingText', null)
		},
		//自定义下拉刷新刷新中状态下的文字(use-custom-refresher为true时生效)
		refresherRefreshingText: {
			type: [String, Object],
			default: _getConfig('refresherRefreshingText', null)
		},
		//是否开启自定义下拉刷新刷新结束回弹效果，默认为是(use-custom-refresher为true时生效)
		refresherEndBounceEnabled: {
			type: Boolean,
			default: _getConfig('refresherEndBounceEnabled', true)
		},
		//自定义底部加载更多样式
		loadingMoreCustomStyle: {
			type: Object,
			default: function() {
				return _getConfig('loadingMoreCustomStyle', {});
			}
		},
		//自定义底部加载更多加载中动画样式
		loadingMoreLoadingIconCustomStyle: {
			type: Object,
			default: function() {
				return _getConfig('loadingMoreLoadingIconCustomStyle', {});
			}
		},
		//自定义底部加载更多加载中动画图标类型，可选flower或circle，默认为flower
		loadingMoreLoadingIconType: {
			type: String,
			default: _getConfig('loadingMoreLoadingIconType', 'flower')
		},
		//自定义底部加载更多加载中动画图标图片
		loadingMoreLoadingIconCustomImage: {
			type: String,
			default: _getConfig('loadingMoreLoadingIconCustomImage', '')
		},
		//底部加载更多加载中view是否展示旋转动画，默认为是
		loadingMoreLoadingAnimated: {
			type: Boolean,
			default: _getConfig('loadingMoreLoadingAnimated', true)
		},
		//是否启用加载更多数据(含滑动到底部加载更多数据和点击加载更多数据)，默认为是
		loadingMoreEnabled: {
			type: Boolean,
			default: _getConfig('loadingMoreEnabled', true)
		},
		//是否启用滑动到底部加载更多数据，默认为是
		toBottomLoadingMoreEnabled: {
			type: Boolean,
			default: _getConfig('toBottomLoadingMoreEnabled', true)
		},
		//滑动到底部"默认"文字，默认为【点击加载更多】
		loadingMoreDefaultText: {
			type: [String, Object],
			default: _getConfig('loadingMoreDefaultText', null)
		},
		//滑动到底部"加载中"文字，默认为【正在加载...】
		loadingMoreLoadingText: {
			type: [String, Object],
			default: _getConfig('loadingMoreLoadingText', null)
		},
		//滑动到底部"没有更多"文字，默认为【没有更多了】
		loadingMoreNoMoreText: {
			type: [String, Object],
			default: _getConfig('loadingMoreNoMoreText', null)
		},
		//滑动到底部"加载失败"文字，默认为【加载失败，点击重新加载】
		loadingMoreFailText: {
			type: [String, Object],
			default: _getConfig('loadingMoreFailText', null)
		},
		//当没有更多数据且分页内容未超出z-paging时是否隐藏没有更多数据的view，默认为否
		hideLoadingMoreWhenNoMoreAndInsideOfPaging: {
			type: Boolean,
			default: _getConfig('hideLoadingMoreWhenNoMoreAndInsideOfPaging', false)
		},
		//当没有更多数据且分页数组长度少于这个值时，隐藏没有更多数据的view，默认为0，代表不限制。
		hideLoadingMoreWhenNoMoreByLimit: {
			type: Number,
			default: _getConfig('hideLoadingMoreWhenNoMoreByLimit', 0)
		},
		//是否显示默认的加载更多text，默认为是
		showDefaultLoadingMoreText: {
			type: Boolean,
			default: _getConfig('showDefaultLoadingMoreText', true)
		},
		//是否显示没有更多数据的view
		showLoadingMoreNoMoreView: {
			type: Boolean,
			default: _getConfig('showLoadingMoreNoMoreView', true)
		},
		//是否显示没有更多数据的分割线，默认为是
		showLoadingMoreNoMoreLine: {
			type: Boolean,
			default: _getConfig('showLoadingMoreNoMoreLine', true)
		},
		//自定义底部没有更多数据的分割线样式
		loadingMoreNoMoreLineCustomStyle: {
			type: Object,
			default: function() {
				return _getConfig('loadingMoreNoMoreLineCustomStyle', {});
			},
		},
		//是否强制隐藏空数据图，默认为否
		hideEmptyView: {
			type: Boolean,
			default: _getConfig('hideEmptyView', false)
		},
		//空数据图描述文字，默认为“没有数据哦~”
		emptyViewText: {
			type: [String, Object],
			default: _getConfig('emptyViewText', null)
		},
		//是否显示空数据图重新加载按钮(无数据时)，默认为否
		showEmptyViewReload: {
			type: Boolean,
			default: _getConfig('showEmptyViewReload', false)
		},
		//加载失败时是否显示空数据图重新加载按钮，默认为是
		showEmptyViewReloadWhenError: {
			type: Boolean,
			default: _getConfig('showEmptyViewReloadWhenError', true)
		},
		//空数据图点击重新加载文字，默认为“重新加载”
		emptyViewReloadText: {
			type: [String, Object],
			default: _getConfig('emptyViewReloadText', null)
		},
		//空数据图图片，默认使用z-paging内置的图片
		emptyViewImg: {
			type: String,
			default: _getConfig('emptyViewImg', '')
		},
		//空数据图“加载失败”描述文字，默认为“很抱歉，加载失败”
		emptyViewErrorText: {
			type: [String, Object],
			default: _getConfig('emptyViewErrorText', null)
		},
		//空数据图“加载失败”图片，默认使用z-paging内置的图片
		emptyViewErrorImg: {
			type: String,
			default: _getConfig('emptyViewErrorImg', '')
		},
		//空数据图样式
		emptyViewStyle: {
			type: Object,
			default: function() {
				return _getConfig('emptyViewStyle', {});
			}
		},
		//空数据图img样式
		emptyViewImgStyle: {
			type: Object,
			default: function() {
				return _getConfig('emptyViewImgStyle', {});
			}
		},
		//空数据图描述文字样式
		emptyViewTitleStyle: {
			type: Object,
			default: function() {
				return _getConfig('emptyViewTitleStyle', {});
			}
		},
		//空数据图重新加载按钮样式
		emptyViewReloadStyle: {
			type: Object,
			default: function() {
				return _getConfig('emptyViewReloadStyle', {});
			}
		},
		//加载中时是否自动隐藏空数据图，默认为是
		autoHideEmptyViewWhenLoading: {
			type: Boolean,
			default: _getConfig('autoHideEmptyViewWhenLoading', true)
		},
		//第一次加载后自动隐藏loading slot，默认为是
		autoHideLoadingAfterFirstLoaded: {
			type: Boolean,
			default: _getConfig('autoHideLoadingAfterFirstLoaded', true)
		},
		//自动显示点击返回顶部按钮，默认为否
		autoShowBackToTop: {
			type: Boolean,
			default: _getConfig('autoShowBackToTop', false)
		},
		//点击返回顶部按钮显示/隐藏的阈值(滚动距离)，单位为px，默认为400rpx
		backToTopThreshold: {
			type: [Number, String],
			default: _getConfig('backToTopThreshold', '400rpx')
		},
		//点击返回顶部按钮的自定义图片地址，默认使用z-paging内置的图片
		backToTopImg: {
			type: String,
			default: _getConfig('backToTopImg', '')
		},
		//点击返回顶部按钮返回到顶部时是否展示过渡动画，默认为是
		backToTopWithAnimate: {
			type: Boolean,
			default: _getConfig('backToTopWithAnimate', true)
		},
		//点击返回顶部按钮与底部的距离，注意添加单位px或rpx，默认为160rpx
		backToTopBottom: {
			type: [Number, String],
			default: _getConfig('backToTopBottom', '160rpx')
		},
		//点击返回顶部按钮的自定义样式
		backToTopStyle: {
			type: Object,
			default: function() {
				return _getConfig('backToTopStyle', {});
			},
		},
		//控制是否出现滚动条，默认为否
		showScrollbar: {
			type: Boolean,
			default: _getConfig('showScrollbar', false)
		},
		//iOS设备上滚动到顶部时是否允许回弹效果，默认为否。关闭回弹效果后可使滚动到顶部与下拉刷新更连贯，但是有吸顶view时滚动到顶部时可能出现抖动。
		scrollToTopBounceEnabled: {
			type: Boolean,
			default: _getConfig('scrollToTopBounceEnabled', false)
		},
		//iOS设备上滚动到底部时是否允许回弹效果，默认为是。
		scrollToBottomBounceEnabled: {
			type: Boolean,
			default: _getConfig('scrollToBottomBounceEnabled', true)
		},
		//在设置滚动条位置时使用动画过渡，默认为否
		scrollWithAnimation: {
			type: Boolean,
			default: _getConfig('scrollWithAnimation', false)
		},
		//值应为某子元素id（id不能以数字开头）。设置哪个方向可滚动，则在哪个方向滚动到该元素
		scrollIntoView: {
			type: String,
			default: _getConfig('scrollIntoView', '')
		},
		//距底部/右边多远时（单位px），触发 scrolltolower 事件，默认为100rpx
		lowerThreshold: {
			type: [Number, String],
			default: _getConfig('lowerThreshold', '100rpx')
		},
		//iOS点击顶部状态栏、安卓双击标题栏时，滚动条返回顶部，只支持竖向，默认为是
		enableBackToTop: {
			type: Boolean,
			default: _getConfig('enableBackToTop', true)
		},
		//是否开启自定义下拉刷新，默认为是
		refresherEnabled: {
			type: Boolean,
			default: _getConfig('refresherEnabled', true)
		},
		//设置自定义下拉刷新阈值，默认为80rpx
		refresherThreshold: {
			type: [Number, String],
			default: _getConfig('refresherThreshold', '80rpx')
		},
		//设置系统下拉刷新默认样式，支持设置 black，white，none，none 表示不使用默认样式，默认为black
		refresherDefaultStyle: {
			type: String,
			default: _getConfig('refresherDefaultStyle', 'black')
		},
		//设置自定义下拉刷新区域背景颜色
		refresherBackground: {
			type: String,
			default: _getConfig('refresherBackground', '#ffffff00')
		},
		//设置固定的自定义下拉刷新区域背景颜色
		refresherFixedBackground: {
			type: String,
			default: _getConfig('refresherFixedBackground', '#ffffff00')
		},
		//设置固定的自定义下拉刷新区域高度，默认为0
		refresherFixedBacHeight: {
			type: [Number, String],
			default: _getConfig('refresherFixedBacHeight', 0)
		},
		//设置自定义下拉刷新下拉超出阈值后继续下拉位移衰减的比例，范围0-1，值越大代表衰减越多。默认为0.7(nvue无效)
		refresherOutRate: {
			type: Number,
			default: _getConfig('refresherOutRate', 0.7)
		},
		//是否显示最后更新时间，默认为否
		showRefresherUpdateTime: {
			type: Boolean,
			default: _getConfig('showRefresherUpdateTime', false)
		},
		//如果需要区别不同页面的最后更新时间，请为不同页面的z-paging的`refresher-update-time-key`设置不同的字符串
		refresherUpdateTimeKey: {
			type: String,
			default: _getConfig('refresherUpdateTimeKey', 'default')
		},
		//本地分页时上拉加载更多延迟时间，单位为毫秒，默认200毫秒
		localPagingLoadingTime: {
			type: [Number, String],
			default: _getConfig('localPagingLoadingTime', 200)
		},
		//使用聊天记录模式，默认为否
		useChatRecordMode: {
			type: Boolean,
			default: _getConfig('useChatRecordMode', false)
		},
		//slot="top"的view的z-index，默认为99，仅使用页面滚动时有效
		topZIndex: {
			type: Number,
			default: _getConfig('topZIndex', 99)
		},
		//z-paging内容容器父view的z-index，默认为1
		superContentZIndex: {
			type: Number,
			default: _getConfig('superContentZIndex', 1)
		},
		//z-paging内容容器部分的z-index，默认为10
		contentZIndex: {
			type: Number,
			default: _getConfig('contentZIndex', 10)
		},
		//空数据view的z-index，默认为9
		emptyViewZIndex: {
			type: Number,
			default: _getConfig('emptyViewZIndex', 9)
		},
		//自动拼接complete中传过来的数组(使用聊天记录模式时无效)
		concat: {
			type: Boolean,
			default: _getConfig('concat', true)
		},
		//nvue中修改列表类型，可选值有list、waterfall和scroller，默认为list
		nvueListIs: {
			type: String,
			default: _getConfig('nvueListIs', 'list')
		},
		//nvue waterfall配置，仅在nvue中且nvueListIs=waterfall时有效，配置参数详情参见：https://uniapp.dcloud.io/component/waterfall
		nvueWaterfallConfig: {
			type: Object,
			default: function() {
				return _getConfig('nvueWaterfallConfig', {});
			}
		},
		//nvue 控制是否回弹效果，iOS不支持动态修改
		nvueBounce: {
			type: Boolean,
			default: function() {
				return _getConfig('nvueBounce', true);
			}
		},
		//nvue中通过代码滚动到顶部/底部时，是否加快动画效果(无滚动动画时无效)，默认为否
		nvueFastScroll: {
			type: Boolean,
			default: function() {
				return _getConfig('nvueFastScroll', false);
			}
		},
		//是否将错误信息打印至控制台，默认为是
		showConsoleError: {
			type: Boolean,
			default: function() {
				return _getConfig('showConsoleError', true);
			}
		},
		//父组件v-model所绑定的list的值
		value: {
			type: Array,
			default: function() {
				return [];
			}
		}
	},
	mounted() {
		this.wxsPropType = (new Date()).getTime().toString();
		this.renderJsIgnore;
		if (!this.refresherOnly && (this.mountedAutoCallReload && this.auto)) {
			this.$nextTick(() => {
				this._preReload();
			})
		}
		this.$nextTick(() => {
			this.systemInfo = uni.getSystemInfoSync();
			if (!this.usePageScroll && this.autoHeight) {
				this._setAutoHeight();
			}
			this.loaded = true;
		})
		this.updatePageScrollTopHeight();
		this.updatePageScrollBottomHeight();
		uni.$on(i18nUpdateKey, () => {
			this.tempLanguageUpdateKey = (new Date()).getTime();
		})
		uni.$on(errorUpdateKey, () => {
			if (this.loading) {
				this.complete(false);
			}
		})
		// #ifdef APP-NVUE
		if (!this.isIos && !this.useChatRecordMode) {
			this.nLoadingMoreFixedHeight = true;
		}
		// #endif
	},
	destroyed() {
		uni.$off(i18nUpdateKey);
		uni.$off(errorUpdateKey);
	},
	watch: {
		value(newVal, oldVal) {
			let dataType = Object.prototype.toString.call(newVal);
			if (dataType === '[object Undefined]') {
				zUtils.consoleErr('v-model所绑定的值不存在！');
				return;
			}
			if (dataType !== '[object Array]') {
				zUtils.consoleErr('v-model所绑定的值必须为Array类型！');
				return;
			}
			if (!zUtils.arrayIsEqual(newVal, this.totalData)) {
				this.totalData = newVal;
			}
		},
		totalData(newVal, oldVal) {
			if ((!this.isUserReload || !this.autoCleanListWhenReload) && this.firstPageLoaded && !newVal.length &&
				oldVal.length) {
				return;
			}
			newVal = [...newVal];
			if (this.loadingStatus === 2 && this.hideLoadingMoreWhenNoMoreByLimit > 0 &&
				newVal.length) {
				this.showLoadingMore = newVal.length > this.hideLoadingMoreWhenNoMoreByLimit;
			} else if (this.loadingStatus === 2 && this.hideLoadingMoreWhenNoMoreAndInsideOfPaging &&
				newVal.length) {
				this.$nextTick(() => {
					this._checkShowLoadingMoreWhenNoMoreAndInsideOfPaging(newVal);
				})
			} else {
				this.showLoadingMore = newVal.length;
			}
			if (this.usePageScroll && this.isTotalChangeFromAddData) {
				this.$nextTick(() => {
					this._checkScrollViewShouldFullHeight();
				})
			}
			if (!this.usePageScroll && (this.pageNo === this.defaultPageNo || this.defaultPageNo + 1)) {
				setTimeout(() => {
					this._checkScrollViewOutOfPage();
				}, commonDelayTime)
			}
			this.realTotalData = newVal;
			this.$emit('input', newVal);
			this.$emit('update:list', newVal);
			this.$emit('listChange', newVal);
			this._callMyParentList(newVal);
			this.firstPageLoaded = false;
			this.isTotalChangeFromAddData = false;
			this.$nextTick(() => {
				this._getNodeClientRect('.zp-paging-container-content').then((res) => {
					if (res) {
						this.$emit('pagingContentHeightChanged', res[0].height);
					}
				});
				// #ifdef APP-NVUE
				if (this.useChatRecordMode && this.nIsFirstPageAndNoMore && this.pageNo === this
					.defaultPageNo && !this.nFirstPageAndNoMoreChecked) {
					this.nFirstPageAndNoMoreChecked = true;
					this._scrollToBottom(false);
				}
				// #endif
			})
		},
		currentData(newVal, oldVal) {
			this._currentDataChange(newVal, oldVal);
		},
		loadingStatus(newVal, oldVal) {
			this.$emit('loadingStatusChange', newVal);
			// #ifdef APP-NVUE
			if (this.useChatRecordMode) {
				if (this.pageNo === this.defaultPageNo && newVal === 2) {
					this.nIsFirstPageAndNoMore = true;
					return;
				}
			}
			this.nIsFirstPageAndNoMore = false;
			//  #endif
		},
		oldScrollTop(newVal, oldVal) {
			if (!this.usePageScroll) {
				this.$emit('scrollTopChange', newVal);
				this.$emit('update:scrollTop', newVal);
				this._checkShouldShowBackToTop(newVal, oldVal);
				if (this.isIos) {
					if (newVal > 5) {
						this.wxsScrollTop = 6;
					} else {
						this.wxsScrollTop = 0;
					}
				} else {
					this.wxsScrollTop = newVal;
				}
			}
		},
		pageScrollTop(newVal, oldVal) {
			if (this.usePageScroll) {
				this.$emit('scrollTopChange', newVal);
				this.$emit('update:scrollTop', newVal);
				this._checkShouldShowBackToTop(newVal, oldVal);
				if (this.isIos) {
					if (newVal > 5) {
						this.wxsPageScrollTop = 6;
					} else {
						this.wxsPageScrollTop = 0;
					}
				} else {
					this.wxsPageScrollTop = newVal;
				}
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
		usePageScroll: {
			handler(newVal) {
				this.$nextTick(() => {
					this.renderUsePageScroll = newVal;
				})
				if (this.loaded && this.autoHeight) {
					this._setAutoHeight(!newVal);
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
		refresherDefaultStyle: {
			handler(newVal) {
				if (newVal.length) {
					this.finalRefresherDefaultStyle = newVal;
				}
			},
			immediate: true
		},
		refresherStatus(newVal, oldVal) {
			if (newVal !== oldVal) {
				this.$emit('refresherStatusChange', newVal);
				this.$emit('update:refresherStatus', newVal);
			}
		},
		useChatRecordMode(newVal, oldVal) {
			if (newVal) {
				this.nLoadingMoreFixedHeight = false;
			}
		},
		finalScrollTop(newVal, oldVal) {
			if (!this.useChatRecordMode) {
				if (newVal < 6) {
					this.renderPropScrollTop = 0;
				} else {
					this.renderPropScrollTop = 10;
				}
			}
		},
		nIsFirstPageAndNoMore: {
			handler(newVal) {
				const cellStyle = !this.useChatRecordMode || newVal ? {} : {
					transform: 'rotate(180deg)'
				};
				this.$emit('update:cellStyle', cellStyle);
			},
			immediate: true
		}
	},
	computed: {
		pullDownDisTimeStamp() {
			return 1000 / this.refresherFps;
		},
		finalRefresherEnabled() {
			if (this.useChatRecordMode) {
				return false;
			}
			if (this.privateRefresherEnabled === -1) {
				return this.refresherEnabled;
			}
			return this.privateRefresherEnabled === 1;
		},
		finalScrollWithAnimation() {
			if (this.privateScrollWithAnimation !== -1) {
				const scrollWithAnimation = this.privateScrollWithAnimation === 1;
				this.privateScrollWithAnimation = -1;
				return scrollWithAnimation;
			}
			return this.scrollWithAnimation;
		},
		zPagingLoadMoreConfig() {
			return {
				loadingStatus: this.loadingStatus,
				defaultThemeStyle: this.finalLoadingMoreThemeStyle,
				loadingMoreCustomStyle: this.loadingMoreCustomStyle,
				loadingMoreLoadingIconCustomStyle: this.loadingMoreLoadingIconCustomStyle,
				loadingMoreLoadingIconType: this.loadingMoreLoadingIconType,
				loadingMoreLoadingIconCustomImage: this.loadingMoreLoadingIconCustomImage,
				loadingMoreLoadingAnimated: this.loadingMoreLoadingAnimated,
				showLoadingMoreNoMoreLine: this.showLoadingMoreNoMoreLine,
				loadingMoreNoMoreLineCustomStyle: this.loadingMoreNoMoreLineCustomStyle,
				loadingMoreDefaultText: this.finalLoadingMoreDefaultText,
				loadingMoreLoadingText: this.finalLoadingMoreLoadingText,
				loadingMoreNoMoreText: this.finalLoadingMoreNoMoreText,
				loadingMoreFailText: this.finalLoadingMoreFailText
			};
		},
		zScopedSlots() {
			return this.$scopedSlots;
		},
		finalNvueListIs() {
			if (this.usePageScroll) {
				return 'view';
			}
			const nvueListIsLowerCase = this.nvueListIs.toLowerCase();
			if (nvueListIsLowerCase === 'list' || nvueListIsLowerCase === 'waterfall' || nvueListIsLowerCase ===
				'scroller') {
				return nvueListIsLowerCase;
			}
			return 'list';
		},
		finalNvueSuperListIs() {
			if (this.usePageScroll) {
				return 'view';
			}
			return 'scroller';
		},
		finalPagingStyle() {
			let pagingStyle = this.pagingStyle;
			if (!this.systemInfo) {
				return pagingStyle;
			}
			const windowTop = this.systemInfo.windowTop;
			const windowBottom = this.systemInfo.windowBottom;
			if (!this.usePageScroll && this.fixed) {
				if (windowTop && windowTop !== undefined) {
					pagingStyle.top = windowTop + 'px';
				}
				let bottom = 0;
				if (windowBottom && windowBottom !== undefined) {
					bottom = windowBottom;
				}
				if (this.safeAreaInsetBottom) {
					bottom += this.safeAreaBottom;
				}
				pagingStyle.bottom = bottom + 'px';
			}
			return pagingStyle;
		},
		finalEnableBackToTop() {
			if (this.usePageScroll) {
				return false;
			}
			return this.enableBackToTop;
		},
		finalBackToTopThreshold() {
			return this._convertTextToPx(this.backToTopThreshold);
		},
		finalLowerThreshold() {
			return this._convertTextToPx(this.lowerThreshold);
		},
		finalRefresherThreshold() {
			let refresherThreshold = this.refresherThreshold;
			if (this.showRefresherUpdateTime) {
				if (refresherThreshold === '80rpx') {
					refresherThreshold = '120rpx';
				}
			}
			return this._convertTextToPx(refresherThreshold);
		},
		finalRefresherFixedBacHeight() {
			return this._convertTextToPx(this.refresherFixedBacHeight);
		},
		finalScrollTop() {
			if (this.usePageScroll) {
				return this.pageScrollTop;
			}
			return this.oldScrollTop;
		},
		finalBackToTopStyle() {
			let tempBackToTopStyle = this.backToTopStyle;
			if (!tempBackToTopStyle.bottom) {
				tempBackToTopStyle.bottom = this.windowBottom + this._convertTextToPx(this.backToTopBottom) + 'px';
			}
			return tempBackToTopStyle;
		},
		finalTempLanguage() {
			if (this.language.length) {
				return this.language;
			}
			return this.tempLanguage;
		},
		finalLanguage() {
			let language = this.finalTempLanguage.toLowerCase();
			return zI18n.getPrivateLanguage(language, this.followSystemLanguage);
		},
		finalRefresherDefaultText() {
			return this._getI18nText('refresherDefaultText', this.refresherDefaultText);
		},
		finalRefresherPullingText() {
			return this._getI18nText('refresherPullingText', this.refresherPullingText);
		},
		finalRefresherRefreshingText() {
			return this._getI18nText('refresherRefreshingText', this.refresherRefreshingText);
		},
		finalLoadingMoreDefaultText() {
			return this._getI18nText('loadingMoreDefaultText', this.loadingMoreDefaultText);
		},
		finalLoadingMoreLoadingText() {
			return this._getI18nText('loadingMoreLoadingText', this.loadingMoreLoadingText);
		},
		finalLoadingMoreNoMoreText() {
			return this._getI18nText('loadingMoreNoMoreText', this.loadingMoreNoMoreText);
		},
		finalLoadingMoreFailText() {
			return this._getI18nText('loadingMoreFailText', this.loadingMoreFailText);
		},
		finalEmptyViewText() {
			if (this.isLoadFailed) {
				return this.finalEmptyViewErrorText;
			} else {
				return this._getI18nText('emptyViewText', this.emptyViewText);
			}
		},
		finalEmptyViewReloadText() {
			return this._getI18nText('emptyViewReloadText', this.emptyViewReloadText);
		},
		finalEmptyViewErrorText() {
			return this._getI18nText('emptyViewErrorText', this.emptyViewErrorText);
		},
		finalEmptyViewImg() {
			if (this.isLoadFailed) {
				return this.emptyViewErrorImg;
			} else {
				return this.emptyViewImg;
			}
		},
		finalShowEmptyViewReload() {
			if (this.isLoadFailed) {
				return this.showEmptyViewReloadWhenError;
			} else {
				return this.showEmptyViewReload;
			}
		},
		finalRefresherThemeStyle() {
			if (this.refresherThemeStyle.length) {
				return this.refresherThemeStyle;
			}
			return this.defaultThemeStyle;
		},
		finalLoadingMoreThemeStyle() {
			if (this.loadingMoreThemeStyle.length) {
				return this.loadingMoreThemeStyle;
			}
			return this.defaultThemeStyle;
		},
		finalPagingContentStyle() {
			if (this.contentZIndex != 1) {
				this.pagingContentStyle['z-index'] = this.contentZIndex;
				this.pagingContentStyle['position'] = 'relative';
			}
			return this.pagingContentStyle;
		},
		finalScrollViewStyle() {
			if (this.superContentZIndex != 1) {
				this.scrollViewStyle['z-index'] = this.superContentZIndex;
				this.scrollViewStyle['position'] = 'relative';
			}
			return this.scrollViewStyle;
		},
		finalRefresherOutRate() {
			if (this.refresherOutRate < 0) {
				return 0;
			}
			if (this.refresherOutRate > 1) {
				return 1;
			}
			return this.refresherOutRate;
		},
		finalRefresherTransform() {
			if (this.refresherTransform === 'translateY(0px)') {
				return 'none';
			}
			return this.refresherTransform;
		},
		showEmpty() {
			const showEmpty = !this.refresherOnly && !this.totalData.length && (this.autoHideEmptyViewWhenLoading ? this
				.isAddedData : true) && !this.hideEmptyView && (this.autoHideEmptyViewWhenLoading ? (!this
				.firstPageLoaded && !this.loading) : true);
			return showEmpty;
		},
		tempLanguage() {
			let systemLanguage = false;
			const temp = this.tempLanguageUpdateKey;
			if (this.followSystemLanguage) {
				systemLanguage = systemInfo.language;
			}
			return uni.getStorageSync(i18nUpdateKey) || systemLanguage || 'zh-cn';
		},
		safeAreaBottom() {
			if (!this.systemInfo) {
				return 0;
			}
			let safeAreaBottom = 0;
			// #ifdef APP-PLUS || H5 || MP-WEIXIN
			safeAreaBottom = this.systemInfo.safeAreaInsets.bottom || 0;
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
		windowTop() {
			if (!this.systemInfo) {
				return 0;
			}
			const windowTop = this.systemInfo.windowTop;
			return windowTop || 0;
		},
		windowBottom() {
			if (!this.systemInfo) {
				return 0;
			}
			let windowBottom = this.systemInfo.windowBottom || 0;
			if (this.safeAreaInsetBottom) {
				windowBottom += this.safeAreaBottom;
			}
			return windowBottom;
		},
		nWaterfallColumnCount() {
			if (this.finalNvueListIs !== 'waterfall') {
				return 0;
			}
			return this._getNvueWaterfallSingleConfig('column-count', 2);
		},
		nWaterfallColumnWidth() {
			return this._getNvueWaterfallSingleConfig('column-width', 'auto');
		},
		nWaterfallColumnGap() {
			return this._getNvueWaterfallSingleConfig('column-gap', 'normal');
		},
		nWaterfallLeftGap() {
			return this._getNvueWaterfallSingleConfig('left-gap', 0);
		},
		nWaterfallRightGap() {
			return this._getNvueWaterfallSingleConfig('right-gap', 0);
		},
		nViewIs() {
			const finalNvueListIs = this.finalNvueListIs;
			return finalNvueListIs === 'scroller' || finalNvueListIs === 'view' ? 'view' : finalNvueListIs ===
				'waterfall' ? 'header' : 'cell';
		},
		nSafeAreaBottomHeight() {
			return this.safeAreaInsetBottom ? this.safeAreaBottom : 0;
		}
	},
	methods: {
		//请求结束(成功或者失败)调用此方法，将请求的结果传递给z-paging处理，第一个参数为请求结果数组，第二个参数为是否成功(默认是是）
		complete(data, success = true) {
			this.customNoMore = -1;
			this.addData(data, success);
		},
		//【保证数据一致】请求结束(成功或者失败)调用此方法，将请求的结果传递给z-paging处理，第一个参数为请求结果数组，第二个参数为dataKey，需与:data-key绑定的一致，第三个参数为是否成功(默认是是）
		completeByKey(data, dataKey = null, success = true) {
			if (dataKey !== null && this.dataKey !== null && dataKey !== this.dataKey) {
				return;
			}
			this.customNoMore = -1;
			this.addData(data, success);
		},
		//【自行判断是否有更多数据】请求结束(成功或者失败)调用此方法，将请求的结果传递给z-paging处理，第一个参数为请求结果数组，第二个参数为是否有更多数据，第三个参数为是否成功(默认是是）
		completeByNoMore(data, nomore, success = true) {
			if (nomore != 'undefined') {
				this.customNoMore = nomore == true ? 1 : 0;
			}
			this.addData(data, success);
		},
		//与上方complete方法功能一致，新版本中设置服务端回调数组请使用complete方法
		addData(data, success = true) {
			this.$nextTick(() => {
				this._addData(data, success, false);
			})
		},
		//设置i18n国际化语言
		setI18n(language) {
			zI18n.setLanguage(language);
		},
		//获取当前z-paging的语言
		getLanguage() {
			return this.finalLanguage;
		},
		//当前版本号
		getVersion() {
			return `z-paging ${currentVersion}`;
		},
		//添加聊天记录
		addChatRecordData(data, toBottom = true, toBottomWithAnimate = true) {
			let dataType = Object.prototype.toString.call(data);
			if (dataType !== '[object Array]') {
				data = [data];
			}
			if (!this.useChatRecordMode) {
				return;
			}
			this.isTotalChangeFromAddData = true;
			//#ifndef APP-NVUE
			this.totalData = [...this.totalData, ...data];
			//#endif
			//#ifdef APP-NVUE
			if (this.nIsFirstPageAndNoMore) {
				this.totalData = [...this.totalData, ...data];
			} else {
				this.totalData = [...data, ...this.totalData];
			}
			//#endif
			if (toBottom) {
				setTimeout(() => {
					//#ifndef APP-NVUE
					this._scrollToBottom(toBottomWithAnimate);
					//#endif
					//#ifdef APP-NVUE
					if (this.nIsFirstPageAndNoMore) {
						this._scrollToBottom(toBottomWithAnimate);
					} else {
						this._scrollToTop(toBottomWithAnimate);
					}
					//#endif
				}, commonDelayTime)
			}
		},
		//从顶部添加数据，不会影响分页的pageNo和pageSize
		addDataFromTop(data, toTop = true, toTopWithAnimate = true) {
			let dataType = Object.prototype.toString.call(data);
			if (dataType !== '[object Array]') {
				data = [data];
			}
			this.totalData = [...data, ...this.totalData];
			if (toTop) {
				setTimeout(() => {
					this._scrollToTop(toTopWithAnimate);
				}, commonDelayTime)
			}
		},
		//重新设置列表数据，调用此方法不会影响pageNo和pageSize，也不会触发请求。适用场景：当需要删除列表中某一项时，将删除对应项后的数组通过此方法传递给z-paging。(当出现类似的需要修改列表数组的场景时，请使用此方法，请勿直接修改page中:list.sync绑定的数组)
		resetTotalData(data) {
			if (data == undefined) {
				if (this.showConsoleError) {
					zUtils.consoleErr('方法resetTotalData参数缺失！');
				}
				return;
			}
			this.isTotalChangeFromAddData = true;
			let dataType = Object.prototype.toString.call(data);
			if (dataType !== '[object Array]') {
				data = [data];
			}
			this.totalData = data;
		},
		//设置本地分页数据，请求结束(成功或者失败)调用此方法，将请求的结果传递给z-paging作分页处理（若调用了此方法，则上拉加载更多时内部会自动分页，不会触发@query所绑定的事件）
		setLocalPaging(data, success = true) {
			this.isLocalPaging = true;
			this.$nextTick(() => {
				this._addData(data, success, true);
			})
		},
		//重新加载分页数据，pageNo会恢复为默认值，相当于下拉刷新的效果(animate为true时会展示下拉刷新动画，默认为false)
		reload(animate = this.showRefresherWhenReload) {
			if (animate) {
				this.privateShowRefresherWhenReload = animate;
				this.isUserPullDown = true;
			}
			this._preReload(animate, false);
		},
		//清空分页数据
		clean() {
			this._reload(true);
			this._addData([], true, false);
		},
		//手动触发滚动到顶部加载更多，聊天记录模式时有效
		doChatRecordLoadMore() {
			if (this.useChatRecordMode) {
				this._onLoadingMore('click');
			}
		},
		//手动触发上拉加载更多(非必须，可依据具体需求使用)
		doLoadMore() {
			this._onLoadingMore('toBottom');
		},
		//手动停止下拉刷新加载
		endRefresh() {
			this.refresherTriggered = false;
		},
		//滚动到顶部，animate为是否展示滚动动画，默认为是
		scrollToTop(animate) {
			this.$nextTick(() => {
				this._scrollToTop(animate, false);
				// #ifdef APP-NVUE
				if (this.nvueFastScroll && animate) {
					setTimeout(() => {
						this._scrollToTop(false, false);
					}, 150);
				}
				// #endif
			})
		},
		//滚动到底部，animate为是否展示滚动动画，默认为是
		scrollToBottom(animate) {
			this.$nextTick(() => {
				this._scrollToBottom(animate);
				// #ifdef APP-NVUE
				if (this.nvueFastScroll && animate) {
					setTimeout(() => {
						this._scrollToBottom(false);
					}, 150);
				}
				// #endif
			})
		},
		//滚动到指定view(vue中有效)。sel为需要滚动的view的id值，不包含"#"；offset为偏移量，单位为px；animate为是否展示滚动动画，默认为否
		scrollIntoViewById(sel, offset, animate) {
			this._scrollIntoView(sel, offset, animate);
		},
		//滚动到指定view(vue中有效)。nodeTop为需要滚动的view的top值(通过uni.createSelectorQuery()获取)；offset为偏移量，单位为px；animate为是否展示滚动动画，默认为否
		scrollIntoViewByNodeTop(nodeTop, offset, animate) {
			this.scrollTop = this.oldScrollTop;
			this.$nextTick(() => {
				this._scrollIntoViewByNodeTop(nodeTop, offset, animate);
			})
		},
		//滚动到指定view(nvue中有效)。index为需要滚动的view的index(第几个)；offset为偏移量，单位为px；animate为是否展示滚动动画，默认为否
		scrollIntoViewByIndex(index, offset, animate) {
			this._scrollIntoView(index, offset, animate);
		},
		//滚动到指定view(nvue中有效)。view为需要滚动的view(通过`this.$refs.xxx`获取)，不包含"#"；offset为偏移量，单位为px；animate为是否展示滚动动画，默认为否
		scrollIntoViewByView(view, offset, animate) {
			this._scrollIntoView(view, offset, animate);
		},
		//当使用页面滚动并且自定义下拉刷新时，请在页面的onPageScroll中调用此方法，告知z-paging当前的pageScrollTop，否则会导致在任意位置都可以下拉刷新
		updatePageScrollTop(value) {
			if (value == undefined) {
				//zUtils.consoleErr('updatePageScrollTop方法缺少参数，请将页面onPageScroll事件中的scrollTop传递给此方法');
				return;
			}
			this.pageScrollTop = value;
		},
		//当使用页面滚动并且设置了slot="top"时，默认初次加载会自动获取其高度，并使内部容器下移，当slot="top"的view高度动态改变时，在其高度需要更新时调用此方法
		updatePageScrollTopHeight() {
			this._updatePageScrollTopOrBottomHeight('top');
		},
		//当使用页面滚动并且设置了slot="bottom"时，默认初次加载会自动获取其高度，并使内部容器下移，当slot="bottom"的view高度动态改变时，在其高度需要更新时调用此方法
		updatePageScrollBottomHeight() {
			this._updatePageScrollTopOrBottomHeight('bottom');
		},
		//更新z-paging内置scroll-view的scrollTop
		updateScrollViewScrollTop(scrollTop, animate = true) {
			this.privateScrollWithAnimation = animate ? 1 : 0;
			this.scrollTop = this.oldScrollTop;
			this.$nextTick(() => {
				this.scrollTop = scrollTop;
				this.oldScrollTop = this.scrollTop;
			});
		},
		//设置nvue List的specialEffects
		setListSpecialEffects(args) {
			this.nFixFreezing = args !== {};
			if (!this.usePageScroll) {
				this.$refs['n-list'].setSpecialEffects(args);
			}
		},
		handleRefresherStatusChanged(func) {
			this.refresherStatusChangedFunc = func;
		},
		//------------------ 私有方法 ------------------------
		//reload之前的一些处理
		_preReload(animate = this.showRefresherWhenReload, isFromMounted = true) {
			this.isUserReload = true;
			if (animate) {
				this.privateShowRefresherWhenReload = animate;
				// #ifndef APP-NVUE
				if (this.useCustomRefresher) {
					this._doRefresherRefreshAnimate();
				} else {
					this.refresherTriggered = true;
				}
				// #endif
				// #ifdef APP-NVUE
				this.refresherStatus = 2;
				this.refresherRevealStackCount++;
				setTimeout(() => {
					this._getNodeClientRect('zp-n-refresh-container', false).then((node) => {
						if (node) {
							let nodeHeight = node[0].height;
							this.nShowRefresherReveal = true;
							this.nShowRefresherRevealHeight = nodeHeight;
							setTimeout(() => {
								this._nDoRefresherEndAnimation(0, -nodeHeight, false, false);
								setTimeout(() => {
									this._nDoRefresherEndAnimation(nodeHeight, 0);
								}, 10)
							}, 10)
							this._reload(false, isFromMounted);
						} else {
							this._reload(false, isFromMounted);
						}
					});
				}, 10)
				return;
				// #endif
			} else {
				this._refresherEnd(false, false);
			}
			this._reload(false, isFromMounted);
		},
		//重新加载分页数据
		_reload(isClean = false, isFromMounted = false) {
			this.isAddedData = false;
			this.cacheScrollNodeHeight = -1;
			this.pageNo = this.defaultPageNo;
			if (!isClean) {
				this._startLoading(true);
			}
			this.firstPageLoaded = true;
			this.isTotalChangeFromAddData = false;
			this.totalData = [];
			if (!isClean) {
				this.$emit('query', this.pageNo, this.defaultPageSize);
				let delay = 0;
				// #ifdef MP-TOUTIAO
				delay = 5;
				// #endif
				setTimeout(() => {
					this._callMyParentQuery();
				}, delay)
				if (!isFromMounted && this.autoScrollToTopWhenReload) {
					let checkedNRefresherLoading = true;
					// #ifdef APP-NVUE
					checkedNRefresherLoading = !this.nRefresherLoading;
					// #endif
					if (checkedNRefresherLoading) {
						this._scrollToTop(false);
					}
				}
				// #ifndef APP-NVUE
				if (!this.usePageScroll && this.useChatRecordMode) {
					if (this.showConsoleError) {
						zUtils.consoleWarn('[z-paging]使用聊天记录模式时，建议使用页面滚动，可将usePageScroll设置为true以启用页面滚动！！');
					}
				}
				// #endif
			}
			this.$nextTick(() => {
				if (!this.realTotalData.length) {
					// #ifdef APP-NVUE
					this.nShowBottom = false;
					// #endif
				}
			})
		},
		//处理服务端返回的数组
		_addData(data, success, isLocal) {
			this.isAddedData = true;
			this.isTotalChangeFromAddData = true;
			if (!this.useCustomRefresher) {
				uni.stopPullDownRefresh();
			}
			// #ifdef APP-NVUE
			if (this.usePageScroll) {
				uni.stopPullDownRefresh();
			}
			// #endif
			if (this.isUserPullDown && this.showRefresherUpdateTime && this.pageNo === this.defaultPageNo) {
				zUtils.setRefesrherTime((new Date()).getTime(), this.refresherUpdateTimeKey);
				this.tempLanguageUpdateKey = (new Date()).getTime();
				if (this.$refs.refresh) {
					this.$refs.refresh.updateTime();
				}
			}
			if (this.isUserPullDown && this.pageNo === this.defaultPageNo) {
				this.isUserPullDown = false;
			}
			const dataType = Object.prototype.toString.call(data);
			if (dataType === '[object Boolean]') {
				success = data;
				data = [];
			} else if (dataType !== '[object Array]') {
				data = [];
				let methodStr = isLocal ? 'setLocalPaging' : 'complete';
				if (dataType !== '[object Undefined]') {
					if (this.showConsoleError) {
						zUtils.consoleErr(`${methodStr}参数类型不正确，第一个参数类型必须为Array!`);
					}
				}
			}
			if (this.refresherTriggered) {
				this.refresherTriggered = false;
			}
			let delayTime = commonDelayTime;
			// #ifdef APP-NVUE
			if (this.useChatRecordMode) {
				delayTime = 0
			}
			// #endif
			setTimeout(() => {
				this._refresherEnd(true, true);
				this.pagingLoaded = true;
			}, delayTime)
			if (this.pageNo === this.defaultPageNo) {
				this.isLoadFailed = !success;
			}
			if (success) {
				this.loadingStatus = 0;
				if (isLocal) {
					this.totalLocalPagingList = data;
					this._localPagingQueryList(this.defaultPageNo, this.defaultPageSize, 0, (res) => {
						this.complete(res);
					})
				} else {
					this._currentDataChange(data, this.currentData);
				}
			} else {
				this._currentDataChange(data, this.currentData);
				this.loadingStatus = 3;
				if (this.loadingType === 1) {
					this.pageNo--;
				}
			}
		},
		//当前数据改变时调用
		_currentDataChange(newVal, oldVal) {
			newVal = [...newVal];
			// #ifndef APP-NVUE
			if (this.useChatRecordMode) {
				newVal.reverse();
			}
			// #endif
			if (this.pageNo === this.defaultPageNo && this.concat) {
				this.totalData = [];
			}
			if (this.customNoMore !== -1) {
				if (this.customNoMore === 0 || !newVal.length) {
					this.loadingStatus = 2;
				}
			} else {
				if (!newVal.length ||
					(newVal.length && newVal.length < this.defaultPageSize)) {
					this.loadingStatus = 2;
				}
			}
			if (!this.totalData.length) {
				if (this.concat) {
					this.totalData = newVal;
				}
				if (this.useChatRecordMode) {
					// #ifndef APP-NVUE
					this.$nextTick(() => {
						this._scrollToBottom(false);
					})
					// #endif
				}
			} else {
				if (this.useChatRecordMode) {
					// #ifdef APP-NVUE
					this.totalData = [...this.totalData, ...newVal];
					// #endif
					//#ifndef APP-NVUE
					const idIndex = newVal.length;
					let idIndexStr = `z-paging-${idIndex}`;
					this.totalData = [...newVal, ...this.totalData];
					if (this.pageNo !== this.defaultPageNo) {
						this.privateScrollWithAnimation = 0;
						let delayTime = 200;
						//#ifdef H5
						delayTime = 0;
						//#endif
						this.$emit('update:chatIndex', idIndex);
						if (this.usePageScroll) {
							this._scrollIntoView(idIndexStr, 30, false, () => {
								this.$emit('update:chatIndex', 0);
							});
						} else {
							setTimeout(() => {
								this._scrollIntoView(idIndexStr, 30, false, () => {
									this.$emit('update:chatIndex', 0);
								});
							}, delayTime)
						}
					} else {
						this.$nextTick(() => {
							this._scrollToBottom(false);
						})
					}
					//#endif

				} else {
					if (this.concat) {
						this.totalData = [...this.totalData, ...newVal];
					}
				}
			}
		},
		//通过@scroll事件检测是否滚动到了底部
		_checkScrolledToBottom(scrollDiff) {
			if (this.cacheScrollNodeHeight === -1) {
				this._getNodeClientRect('.zp-scroll-view').then((res) => {
					if (res) {
						let pageScrollNodeHeight = res[0].height;
						this.cacheScrollNodeHeight = pageScrollNodeHeight;
						if (scrollDiff - pageScrollNodeHeight <= this.finalLowerThreshold) {
							this._onLoadingMore('toBottom');
						}
					}
				});
			} else {
				if (scrollDiff - this.cacheScrollNodeHeight <= this.finalLowerThreshold) {
					this._onLoadingMore('toBottom');
				}
			}
		},
		//触发加载更多时调用,from:0-滑动到底部触发；1-点击加载更多触发
		_onLoadingMore(from = 'click') {
			if (from === 'toBottom') {
				if (!this.scrollToBottomBounceEnabled) {
					if (this.scrollEnable) {
						this.scrollEnable = false;
						this.$nextTick(() => {
							this.scrollEnable = true;
						})
					}
				}
			}
			this.$emit('scrolltolower', from);
			if (from === 'toBottom' && (!this.toBottomLoadingMoreEnabled || this.useChatRecordMode)) {
				return;
			}
			if (this.refresherOnly || !this.loadingMoreEnabled || !(this.loadingStatus === 0 || 3) || this.loading)
				return;
			this._doLoadingMore();
		},
		//当滚动到顶部时
		_scrollToUpper() {
			this.$emit('scrolltoupper');
			this.$emit('scrollTopChange', 0);
			this.$nextTick(() => {
				this.oldScrollTop = 0;
			})
			if (!this.useChatRecordMode) {
				return;
			}
			if (this.loadingStatus === 2) {
				return;
			}

			this._onLoadingMore('click');
		},
		//点击返回顶部
		_backToTopClick() {
			if (!this.backToTopWithAnimate) {
				this._checkShouldShowBackToTop(1, 0);
			}
			this.scrollToTop(this.backToTopWithAnimate);
		},
		//滚动到顶部
		_scrollToTop(animate, isPrivate = true) {
			// #ifdef APP-NVUE
			const el = this.$refs['zp-n-list-top-tag'];
			if (this.usePageScroll) {
				this._getNodeClientRect('zp-page-scroll-top', false).then((node) => {
					if (node) {
						let nodeHeight = node[0].height;
						weexDom.scrollToElement(el, {
							offset: -nodeHeight,
							animated: animate
						});
					}
				});
			} else {
				weexDom.scrollToElement(el, {
					offset: 0,
					animated: animate
				});
			}
			return;
			// #endif
			if (this.usePageScroll) {
				this.$nextTick(() => {
					uni.pageScrollTo({
						scrollTop: 0,
						duration: animate ? 100 : 0,
					});
				});
				return;
			}
			this.privateScrollWithAnimation = animate ? 1 : 0;
			this.scrollTop = this.oldScrollTop;
			this.$nextTick(() => {
				this.scrollTop = 0;
				this.oldScrollTop = this.scrollTop;
			});
		},
		//滚动到底部
		async _scrollToBottom(animate = true) {
			// #ifdef APP-NVUE
			const el = this.$refs['zp-n-list-bottom-tag'];
			weexDom.scrollToElement(el, {
				offset: 0,
				animated: animate
			});
			return;
			// #endif
			if (this.usePageScroll) {
				this.$nextTick(() => {
					uni.pageScrollTo({
						scrollTop: Number.MAX_VALUE,
						duration: animate ? 100 : 0,
					});
				});
				return;
			}
			try {
				this.privateScrollWithAnimation = animate ? 1 : 0;
				let pagingContainerH = 0;
				let scrollViewH = 0;
				const pagingContainerNode = await this._getNodeClientRect('.zp-paging-container');
				const scrollViewNode = await this._getNodeClientRect('.zp-scroll-view');
				if (pagingContainerNode) {
					pagingContainerH = pagingContainerNode[0].height;
				}
				if (scrollViewNode) {
					scrollViewH = scrollViewNode[0].height;
				}
				if (pagingContainerH > scrollViewH) {
					this.scrollTop = this.oldScrollTop;
					this.$nextTick(() => {
						this.scrollTop = pagingContainerH - scrollViewH;
						this.oldScrollTop = this.scrollTop;
					});
				}
			} catch (e) {

			}
		},
		//滚动到指定view
		_scrollIntoView(sel, offset = 0, animate = false, finishCallback) {
			try {
				this.scrollTop = this.oldScrollTop;
				this.$nextTick(() => {
					// #ifdef APP-NVUE
					const refs = this.$parent.$refs;
					if (!refs) {
						return;
					}
					const dataType = Object.prototype.toString.call(sel);
					let el = null;
					if (dataType === '[object Number]') {
						const els = refs[`z-paging-${sel}`];
						el = els ? els[0] : null;
					} else {
						el = sel;
					}
					if (el) {
						weexDom.scrollToElement(el, {
							offset: -offset,
							animated: animate
						});
					} else {
						zUtils.consoleErr('在nvue中滚动到指定位置，cell必须设置 :ref="`z-paging-${index}`"');
					}
					return;
					// #endif
					if (sel.indexOf('#') != -1) {
						sel = sel.replace('#', '');
					}
					this._getNodeClientRect('#' + sel, false).then((node) => {
						if (node) {
							let nodeTop = node[0].top;
							this._scrollIntoViewByNodeTop(nodeTop, offset, animate);
							if (finishCallback) {
								finishCallback();
							}
						}
					});
				});
			} catch (e) {

			}
		},
		//通过nodeTop滚动到指定view
		_scrollIntoViewByNodeTop(nodeTop, offset = 0, animate = false) {
			this.privateScrollWithAnimation = animate ? 1 : 0;
			if (this.usePageScroll) {
				uni.pageScrollTo({
					scrollTop: nodeTop - offset,
					duration: animate ? 100 : 0
				});
			} else {
				nodeTop = nodeTop + this.oldScrollTop;
				this.scrollTop = nodeTop - offset;
				this.oldScrollTop = this.scrollTop;
			}
		},
		//是否要展示上拉加载更多view
		_shouldShowLoading(type) {
			if (!(this.loadingStatus === 0 ? this.nShowBottom : true)) {
				return false;
			}
			if (((!this.showLoadingMoreWhenReload || this.isUserPullDown || this.loadingStatus !== 1) && !this
					.showLoadingMore) || (!this.loadingMoreEnabled && (!this.showLoadingMoreWhenReload || this
					.isUserPullDown || this.loadingStatus !== 1)) || this
				.refresherOnly) {
				return false;
			}
			if (this.useChatRecordMode && type !== 'loadingMoreLoading') {
				return false;
			}
			if (!this.$slots) {
				return false;
			}
			if (type === 'loadingMoreDefault') {
				const res = this.loadingStatus === 0 && this.$slots.loadingMoreDefault;
				if (res) {
					// #ifdef APP-NVUE
					if (!this.isIos) {
						this.nLoadingMoreFixedHeight = false;
					}
					//  #endif
				}
				return res;
			} else if (type === 'loadingMoreLoading') {
				const res = this.loadingStatus === 1 && this.$slots.loadingMoreLoading;
				if (res) {
					// #ifdef APP-NVUE
					if (!this.isIos) {
						this.nLoadingMoreFixedHeight = false;
					}
					//  #endif
				}
				return res;
			} else if (type === 'loadingMoreNoMore') {
				const res = this.loadingStatus === 2 && this.$slots.loadingMoreNoMore && this.showLoadingMoreNoMoreView;
				if (res) {
					// #ifdef APP-NVUE
					if (!this.isIos) {
						this.nLoadingMoreFixedHeight = false;
					}
					//  #endif
				}
				return res;
			} else if (type === 'loadingMoreFail') {
				const res = this.loadingStatus === 3 && this.$slots.loadingMoreFail;
				if (res) {
					// #ifdef APP-NVUE
					if (!this.isIos) {
						this.nLoadingMoreFixedHeight = false;
					}
					//  #endif
				}
				return res;
			} else if (type === 'loadingMoreCustom') {
				const res = this.showDefaultLoadingMoreText && !(this.loadingStatus === 2 && !this
					.showLoadingMoreNoMoreView);
				return res;
			}
			return false;
		},
		//处理开始加载更多状态
		_startLoading(isReload = false) {
			if ((this.showLoadingMoreWhenReload && !this.isUserPullDown) || !isReload) {
				this.loadingStatus = 1;
			}
			this.loading = true;
		},
		//处理开始加载更多
		_doLoadingMore() {
			if (this.pageNo >= this.defaultPageNo && this.loadingStatus !== 2) {
				this.pageNo++;
				this._startLoading(false);
				if (this.isLocalPaging) {
					this._localPagingQueryList(this.pageNo, this.defaultPageSize, this.localPagingLoadingTime, (
						res) => {
						this.addData(res);
					})
				} else {
					this.$emit('query', this.pageNo, this.defaultPageSize);
					this._callMyParentQuery();
				}
				this.loadingType = 1;
			}
		},
		_scroll(e) {
			this.$emit('scroll', e);
			this.oldScrollTop = e.detail.scrollTop;
			const scrollDiff = e.detail.scrollHeight - this.oldScrollTop;
			if (!this.isIos) {
				this._checkScrolledToBottom(scrollDiff);
			}
		},
		//自定义下拉刷新被触发
		_onRefresh() {
			if (this.loading || this.nShowRefresherReveal) {
				return;
			}
			this.isUserPullDown = true;
			this.isUserReload = false;
			this._startLoading(true);
			this.refresherTriggered = true;
			if (this.useChatRecordMode) {
				this._onLoadingMore('click')
			} else {
				this._reload();
			}
			this.$emit('onRefresh');
			this.loadingType = 0;
		},
		//自定义下拉刷新被复位
		_onRestore() {
			this.refresherTriggered = 'restore';
			this.$emit('onRestore');
		},
		//拖拽开始
		_refresherTouchstart(e) {
			if (this._getRefresherTouchDisabled()) {
				return;
			}
			const touch = zUtils.getCommonTouch(e);
			this._handleRefresherTouchstart(touch);
		},
		//进一步处理拖拽开始结果
		_handleRefresherTouchstart(touch) {
			if (!this.loading && this.isTouchEnded) {
				this.isTouchmoving = false;
			}
			this.isTouchEnded = false;
			this.refresherTransition = 'transform .1s linear';
			this.refresherTouchstartY = touch.touchY;
			this.$emit('refresherTouchstart', this.refresherTouchstartY);
			this.lastRefresherTouchmove = touch;
		},
		//拖拽中
		_refresherTouchmove(e) {
			const currentTimeStamp = (new Date()).getTime();
			if (this.pullDownTimeStamp && currentTimeStamp - this.pullDownTimeStamp <= this.pullDownDisTimeStamp) {
				return;
			}
			if (this._getRefresherTouchDisabled()) {
				return;
			}
			this.pullDownTimeStamp = Number(currentTimeStamp);
			const touch = zUtils.getCommonTouch(e);
			let refresherTouchmoveY = touch.touchY;
			let moveDistance = refresherTouchmoveY - this.refresherTouchstartY;
			if (moveDistance < 0) {
				return;
			}
			if (this.refresherMaxAngle >= 0 && this.refresherMaxAngle <= 90 && this.lastRefresherTouchmove && this
				.lastRefresherTouchmove.touchY <= refresherTouchmoveY) {
				if (!moveDistance && !this.refresherAngleEnableChangeContinued && this.moveDistance < 1 && !this
					.refresherReachMaxAngle) {
					return;
				}
				const x = Math.abs(touch.touchX - this.lastRefresherTouchmove.touchX);
				const y = Math.abs(refresherTouchmoveY - this.lastRefresherTouchmove.touchY);
				const z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
				if ((x || y) && x > 1) {
					const angle = Math.asin(y / z) / Math.PI * 180;
					if (angle < this.refresherMaxAngle) {
						this.lastRefresherTouchmove = touch;
						this.refresherReachMaxAngle = false;
						return;
					}
				}
			}
			moveDistance = this._getFinalRefresherMoveDistance(moveDistance);
			this._handleRefresherTouchmove(moveDistance, touch);
			if (!this.disabledBounce) {
				this._handleScrollViewDisableBounce({
					bounce: false
				});
				this.disabledBounce = true;
			}
		},
		//进一步处理拖拽中结果
		_handleRefresherTouchmove(moveDistance, touch) {
			this.refresherReachMaxAngle = true;
			if (!this.isTouchmoving) {
				this.isTouchmoving = true;
			}
			this.isTouchEnded = false;
			if (moveDistance >= this.finalRefresherThreshold) {
				this.refresherStatus = 1;
			} else {
				this.refresherStatus = 0;
			}
			// #ifndef APP-VUE || MP-WEIXIN || MP-QQ  || H5
			// this.scrollEnable = false;
			this.refresherTransform = `translateY(${moveDistance}px)`;
			this.lastRefresherTouchmove = touch;
			// #endif
			this.moveDistance = moveDistance;
			this.$emit('refresherTouchmove', moveDistance);
		},
		//拖拽结束
		_refresherTouchend(e) {
			if (this._getRefresherTouchDisabled() || !this.isTouchmoving) {
				return;
			}
			const touch = zUtils.getCommonTouch(e);
			let refresherTouchendY = touch.touchY;
			let moveDistance = refresherTouchendY - this.refresherTouchstartY;
			moveDistance = this._getFinalRefresherMoveDistance(moveDistance);
			this._handleRefresherTouchend(moveDistance);
			this._handleScrollViewDisableBounce({
				bounce: true
			});
			this.disabledBounce = false;
		},
		//进一步处理拖拽结束结果
		_handleRefresherTouchend(moveDistance) {
			// #ifndef APP-PLUS || H5 || MP-WEIXIN
			if (!this.isTouchmoving) {
				return;
			}
			// #endif
			this.refresherReachMaxAngle = true;
			if (moveDistance < 0 && this.usePageScroll && this.loadingMoreEnabled && this.useCustomRefresher && this
				.pageScrollTop === -1) {
				if (this.showConsoleError) {
					zUtils.consoleErr(
						'usePageScroll为true并且自定义下拉刷新时必须引入mixin或在page滚动时通过调用z-paging组件的updatePageScrollTop方法设置当前的scrollTop'
					)
				}
			}
			this.isTouchEnded = true;
			if (moveDistance >= this.finalRefresherThreshold && this.refresherStatus === 1) {
				// #ifndef APP-VUE || MP-WEIXIN || MP-QQ  || H5
				this.refresherTransform = `translateY(${this.finalRefresherThreshold}px)`;
				// #endif
				this.moveDistance = this.finalRefresherThreshold;
				this.refresherStatus = 2;
				this._doRefresherLoad();
			} else {
				this._refresherEnd(true, false);
				setTimeout(() => {
					this.isTouchmoving = false;
				}, commonDelayTime);
			}
			this.scrollEnable = true;
			this.$emit('refresherTouchend', moveDistance);
		},
		//处理scroll-view bounce是否生效
		_handleScrollViewDisableBounce(e) {
			if (!this.usePageScroll && this.isIos && !this.scrollToTopBounceEnabled) {
				if (!e.bounce) {
					if (this.scrollEnable) {
						this.scrollEnable = false;
					}
				} else {
					this.scrollEnable = true;
				}
			}
		},
		//wxs正在下拉处理
		_handleWxsOnPullingDown(onPullingDown) {
			this.wxsOnPullingDown = onPullingDown;
			if (onPullingDown) {
				if (!this.useChatRecordMode) {
					this.renderPropScrollTop = 0;
				}
			}
		},
		//下拉刷新结束
		_refresherEnd(shouldEndLoadingDelay = true, fromAddData = false) {
			// #ifndef APP-NVUE
			if (this.showRefresherWhenReload || this.privateShowRefresherWhenReload) {
				const stackCount = this.refresherRevealStackCount;
				this.refresherRevealStackCount--;
				if (stackCount > 1) {
					return;
				}
				this.refresherStatus = 0;
			} else {
				setTimeout(() => {
					this.refresherStatus = 0;
				}, commonDelayTime);
			}
			// #endif
			// #ifndef APP-VUE || MP-WEIXIN || MP-QQ  || H5
			this.refresherTransform = 'translateY(0px)';
			// #endif
			// #ifdef APP-VUE || MP-WEIXIN || MP-QQ || H5
			this.wxsPropType = 'end' + (new Date()).getTime();
			// #endif
			this.moveDistance = 0;
			if (this.refresherEndBounceEnabled && fromAddData) {
				this.refresherTransition = 'transform 0.3s cubic-bezier(0.19,1.64,0.42,0.72)';
			}
			if (shouldEndLoadingDelay) {
				setTimeout(() => {
					this.loading = false;
				}, commonDelayTime);
			} else {
				this.loading = false;
			}
			this.$emit('onRestore');
			// #ifdef APP-NVUE
			this._nRefresherEnd();
			// #endif
		},
		//模拟用户手动触发下拉刷新
		_doRefresherRefreshAnimate() {
			this.refresherRevealStackCount++;
			this.refresherTransform = `translateY(${this.finalRefresherThreshold}px)`;
			// #ifdef APP-VUE || MP-WEIXIN || MP-QQ || H5
			this.wxsPropType = 'begin' + (new Date()).getTime();
			// #endif
			this.moveDistance = this.finalRefresherThreshold;
			this.refresherStatus = 2;
			this.isTouchmoving = true;
		},
		//触发下拉刷新
		_doRefresherLoad() {
			this._onRefresh();
			this.loading = true;
		},
		//获取处理后的moveDistance
		_getFinalRefresherMoveDistance(moveDistance) {
			moveDistance = moveDistance * 0.85;
			if (moveDistance >= this.finalRefresherThreshold) {
				moveDistance = this.finalRefresherThreshold + (moveDistance - this.finalRefresherThreshold) * (1 - this
					.finalRefresherOutRate);
			}
			return moveDistance;
		},
		//判断当没有更多数据且分页内容未超出z-paging时是否显示没有更多数据的view
		async _checkShowLoadingMoreWhenNoMoreAndInsideOfPaging(totalData) {
			try {
				const scrollViewNode = await this._getNodeClientRect('.zp-scroll-view');
				if (this.usePageScroll) {
					if (scrollViewNode) {
						const scrollViewTotalH = scrollViewNode[0].top + scrollViewNode[0].height;
						this.showLoadingMore = scrollViewTotalH >= this.systemInfo.windowHeight;
					}
				} else {
					let pagingContainerH = 0;
					let scrollViewH = 0;
					const pagingContainerNode = await this._getNodeClientRect('.zp-paging-container-content');
					if (pagingContainerNode) {
						pagingContainerH = pagingContainerNode[0].height;
					}
					if (scrollViewNode) {
						scrollViewH = scrollViewNode[0].height;
					}
					this.showLoadingMore = pagingContainerH >= scrollViewH;
				}
			} catch (e) {
				this.showLoadingMore = totalData.length;
			}
		},
		//检测z-paging是否超出了页面高度
		async _checkScrollViewOutOfPage() {
			try {
				const scrollViewNode = await this._getNodeClientRect('.zp-scroll-view');
				if (scrollViewNode) {
					const scrollViewTotalH = scrollViewNode[0].top + scrollViewNode[0].height;
					if (scrollViewTotalH > this.systemInfo.windowHeight + 100) {
						if (this.showConsoleError) {
							zUtils.consoleWarn(
								'检测到z-paging的高度超出页面高度，这将导致滚动或展示出现异常，请设置【:fixed="true"】或【确保z-paging有确定的高度(如果通过百分比设置z-paging的高度，请保证z-paging的所有父view已设置高度，同时确保page也设置了height:100%，如：page{height:100%}】，此时z-paging的百分比高度才能生效。详情参考demo或访问：https://ext.dcloud.net.cn/plugin?id=3935)'
							);
						}
					}
				}
			} catch (e) {

			}
		},
		//检测z-paging是否要全屏覆盖(当使用页面滚动并且不满全屏时，默认z-paging需要铺满全屏，避免数据过少时内部的empty-view无法正确展示)
		async _checkScrollViewShouldFullHeight() {
			try {
				const scrollViewNode = await this._getNodeClientRect('.zp-scroll-view');
				const pagingContainerNode = await this._getNodeClientRect('.zp-paging-container-content');
				if (!scrollViewNode || !pagingContainerNode) {
					return;
				}
				const scrollViewHeight = pagingContainerNode[0].height;
				const scrollViewTop = scrollViewNode[0].top;
				if (this.isAddedData && scrollViewHeight + scrollViewTop <= this.systemInfo.windowHeight + 10) {
					this._setAutoHeight(true, scrollViewNode);
				} else {
					this._setAutoHeight(false);
				}
			} catch (e) {

			}
		},
		//设置z-paging高度
		async _setAutoHeight(shouldFullHeight = true, scrollViewNode = null) {
			try {
				if (shouldFullHeight) {
					let finalScrollViewNode = scrollViewNode ? scrollViewNode : await this._getNodeClientRect(
						'.scroll-view');
					if (finalScrollViewNode) {
						const scrollViewTop = finalScrollViewNode[0].top;
						const scrollViewHeight = this.systemInfo.windowHeight - scrollViewTop;
						let additionHeight = this._convertTextToPx(this.autoHeightAddition);
						this.$set(this.scrollViewStyle, 'height', scrollViewHeight + additionHeight + 'px');
					}
				} else {
					this.$delete(this.scrollViewStyle, 'height');
				}
			} catch (e) {

			}
		},
		//获取节点尺寸
		_getNodeClientRect(select, inThis = true) {
			// #ifdef APP-NVUE
			select = select.replace('.', '').replace('#', '');
			const ref = this.$refs[select];
			if (ref) {
				return new Promise((resolve, reject) => {
					weexDom.getComponentRect(ref, option => {
						if (option && option.result && option.result) {
							resolve([option.size]);
						} else {
							resolve(false);
						}
					})
				});
			} else {
				return new Promise((resolve, reject) => {
					resolve(false);
				});
			}
			return;
			// #endif
			let res = null;
			if (inThis) {
				res = uni.createSelectorQuery().in(this);
			} else {
				res = uni.createSelectorQuery();
			}
			//#ifdef MP-ALIPAY
			res = uni.createSelectorQuery();
			//#endif
			res.select(select).boundingClientRect();
			return new Promise((resolve, reject) => {
				res.exec(data => {
					if (data && data != '' && data != undefined && data.length) {
						resolve(data);
					} else {
						resolve(false);
					}
				});
			});
		},
		//判断touch手势是否要触发
		_getRefresherTouchDisabled() {
			let checkOldScrollTop = this.oldScrollTop > 5;
			const res = this.loading || this.useChatRecordMode || !this.refresherEnabled || !this.useCustomRefresher ||
				(
					this.usePageScroll && this
					.useCustomRefresher && this
					.pageScrollTop > 10) || (!(this.usePageScroll && this.useCustomRefresher) && checkOldScrollTop);
			return res;
		},
		//本地分页请求
		_localPagingQueryList(pageNo, pageSize, localPagingLoadingTime, callback) {
			pageNo = parseInt(pageNo);
			pageSize = parseInt(pageSize);
			if (pageNo < 0 || pageSize <= 0) {
				callQueryResult(callback, []);
				return;
			}
			if (pageNo == 0) {
				pageNo = 1;
			}
			let totalPagingList = [...this.totalLocalPagingList];
			let pageNoIndex = (pageNo - 1) * pageSize;
			if (pageNoIndex + pageSize <= totalPagingList.length) {
				this._localPagingQueryResult(callback, totalPagingList.splice(pageNoIndex, pageSize),
					localPagingLoadingTime);
			} else if (pageNoIndex < totalPagingList.length) {
				this._localPagingQueryResult(callback, totalPagingList.splice(pageNoIndex, totalPagingList.length -
						pageNoIndex),
					localPagingLoadingTime);
			} else {
				this._localPagingQueryResult(callback, [], localPagingLoadingTime);
			}
		},
		//本地分页请求回调
		_localPagingQueryResult(callback, arg, localPagingLoadingTime) {
			setTimeout(() => {
				callback(arg);
			}, localPagingLoadingTime)
		},
		//将文本的px或者rpx转为px的值
		_convertTextToPx(text) {
			const dataType = Object.prototype.toString.call(text);
			if (dataType === '[object Number]') {
				return text;
			}
			let isRpx = false;
			if (text.indexOf('rpx') !== -1 || text.indexOf('upx') !== -1) {
				text = text.replace('rpx', '').replace('upx', '');
				isRpx = true;
			} else if (text.indexOf('px') !== -1) {
				text = text.replace('px', '');
			}
			if (!isNaN(text)) {
				if (isRpx) {
					return Number(uni.upx2px(text));
				}
				return Number(text);
			}
			return 0;
		},

		//判断是否要显示返回顶部按钮
		_checkShouldShowBackToTop(newVal, oldVal) {
			if (!this.autoShowBackToTop) {
				if (this.showBackToTopClass) {
					this.showBackToTopClass = false;
				}
				return;
			}
			if (newVal !== oldVal) {
				if (newVal > this.finalBackToTopThreshold) {
					if (!this.showBackToTopClass) {
						this.showBackToTopClass = true;
						setTimeout(() => {
							this.backToTopClass = 'zp-back-to-top zp-back-to-top-show';
						}, 300)
					}
				} else {
					if (this.showBackToTopClass) {
						this.backToTopClass = 'zp-back-to-top zp-back-to-top-hide';
						setTimeout(() => {
							this.showBackToTopClass = false;
						}, 300)
					}
				}
			}
		},
		_updatePageScrollTopOrBottomHeight(type) {
			// #ifdef APP-VUE
			if (!this.usePageScroll) {
				return;
			}
			// #endif
			const node = `.zp-page-scroll-${type}`;
			const marginText = `margin${type.slice(0,1).toUpperCase() + type.slice(1)}`;
			this.$nextTick(() => {
				let delayTime = 0;
				// #ifdef MP-BAIDU
				delayTime = 10;
				// #endif
				setTimeout(() => {
					this._getNodeClientRect(node).then((res) => {
						if (res) {
							let pageScrollNodeHeight = res[0].height;
							if (type === 'bottom') {
								if (this.safeAreaInsetBottom) {
									pageScrollNodeHeight += this.safeAreaBottom;
								}
							}
							this.$set(this.scrollViewStyle, marginText,
								`${pageScrollNodeHeight}px`);
						} else if (this.safeAreaInsetBottom) {
							this.$set(this.scrollViewStyle, marginText,
								`${this.safeAreaBottom}px`);
						}
					});
				}, delayTime)
			})
		},
		//点击了空数据view重新加载按钮
		_emptyViewReload() {
			let callbacked = false;
			this.$emit('emptyViewReload', (reload) => {
				if (reload === undefined || reload === true) {
					this.reload();
				}
				callbacked = true;
			});
			this.$nextTick(() => {
				if (!callbacked) {
					this.reload();
				}
			})
		},
		//获取国际化转换后的文本
		_getI18nText(key, value) {
			const dataType = Object.prototype.toString.call(value);
			if (dataType === '[object Object]') {
				const nextValue = value[this.finalLanguage];
				if (nextValue) {
					return nextValue;
				}
			} else if (dataType === '[object String]') {
				return value;
			}
			return zI18n[key][this.finalLanguage];
		},
		//修改父view的list
		_callMyParentList(newVal) {
			if (this.autowireListName.length) {
				const myParent = zUtils.getParent(this.$parent);
				if (myParent && myParent[this.autowireListName]) {
					myParent[this.autowireListName] = newVal;
				}
			}
		},
		//调用父view的query
		_callMyParentQuery() {
			if (this.autowireQueryName) {
				if (this.myParentQuery === -1) {
					const myParent = zUtils.getParent(this.$parent);
					if (myParent && myParent[this.autowireQueryName]) {
						this.myParentQuery = myParent[this.autowireQueryName];
					}
				}
				if (this.myParentQuery !== -1) {
					this.myParentQuery(this.pageNo, this.defaultPageSize);
				}
			}
		},
		// ------------nvue独有的方法----------------
		//列表滚动时触发
		_nOnScroll(e) {
			const contentOffsetY = e.contentOffset.y;
			this.$emit('scroll', e);
			this.nListIsDragging = e.isDragging;
			this._checkShouldShowBackToTop(-e.contentOffset.y, -e.contentOffset.y - 1);
		},
		//下拉刷新刷新中
		_nOnRrefresh() {
			if (this.nShowRefresherReveal) {
				return;
			}
			this.nRefresherLoading = true;
			this.refresherStatus = 2;
			this._doRefresherLoad();
		},
		//下拉刷新下拉中
		_nOnPullingdown(e) {
			if (this.refresherStatus === 2 || (this.isIos && !this.nListIsDragging)) {
				return;
			}
			const viewHeight = e.viewHeight;
			const pullingDistance = e.pullingDistance;
			if (pullingDistance >= viewHeight) {
				this.refresherStatus = 1;
			} else {
				this.refresherStatus = 0;
			}
		},
		//下拉刷新结束
		_nRefresherEnd() {
			this._nDoRefresherEndAnimation(0, -this.nShowRefresherRevealHeight);
			if (!this.nShowBottom) {
				setTimeout(() => {
					this.$nextTick(() => {
						this.nShowBottom = true;
					})
				}, 1000);
			}
			if (!this.usePageScroll) {
				this.$refs["n-list"].resetLoadmore();
			}
			this.nRefresherLoading = false;
		},
		//执行主动触发下拉刷新动画
		_nDoRefresherEndAnimation(height, translateY, animate = true, checkStack = true) {
			if (!this.showRefresherWhenReload && !this.privateShowRefresherWhenReload) {
				setTimeout(() => {
					this.refresherStatus = 0;
				}, commonDelayTime);
				return;
			}
			const stackCount = this.refresherRevealStackCount;
			if (height === 0 && checkStack) {
				this.refresherRevealStackCount--;
				if (stackCount > 1) {
					return;
				}
				this.refresherStatus = 0;
			}
			if (stackCount > 1) {
				this.refresherStatus = 2;
			}
			const duration = animate ? 120 : 0;
			weexAnimation.transition(this.$refs['zp-n-list-refresher-reveal'], {
				styles: {
					height: `${height}px`,
					transform: `translateY(${translateY}px)`,
				},
				duration: duration,
				timingFunction: 'linear',
				needLayout: true,
				delay: 0
			})
			setTimeout(() => {
				if (animate) {
					this.nShowRefresherReveal = height > 0;
				}
			}, duration > 0 ? duration - 100 : 0);
		},
		//滚动到底部加载更多
		_nOnLoadmore() {
			if (this.nShowRefresherReveal || !this.totalData.length) {
				return;
			}
			if (this.useChatRecordMode) {
				this.doChatRecordLoadMore();
			} else {
				this._onLoadingMore('toBottom');
			}
		},
		//获取nvue waterfall单项配置
		_getNvueWaterfallSingleConfig(key, defaultValue) {
			const value = this.nvueWaterfallConfig[key];
			if (value) {
				return value;
			}
			return defaultValue;
		}
	},
};
