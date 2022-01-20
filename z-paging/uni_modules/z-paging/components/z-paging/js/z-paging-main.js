// [z-paging]核心js

import zStatic from './z-paging-static'
import zConfig from './z-paging-config'
import zLocalConfig from '../config/index'
import zUtils from './z-paging-utils'
import zI18n from './z-paging-i18n'
import zPagingRefresh from '../components/z-paging-refresh'
import zPagingLoadMore from '../components/z-paging-load-more'
import zPagingEmptyView from '../../z-paging-empty-view/z-paging-empty-view'

import Enum from './z-paging-enum'

const currentVersion = '2.1.3';
const systemInfo = uni.getSystemInfoSync();
const commonDelayTime = 100;
const i18nUpdateKey = 'z-paging-i18n-update';
const errorUpdateKey = 'z-paging-error-emit';
let config = null;
// #ifdef APP-NVUE
const weexDom = weex.requireModule('dom');
const weexAnimation = weex.requireModule('animation');
// #endif

/*
当z-paging未使用uni_modules管理时，控制台会有警告：WARNING: Module not found: Error: Can't resolve '@/uni_modules/z-paging'...
此时注释下方try中的代码即可
*/
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
		if (zLocalConfig && Object.keys(zLocalConfig).length) {
			config = zLocalConfig;
		} else {
			const temConfig = zConfig.getConfig();
			if (zConfig && temConfig) {
				config = temConfig;
			}
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

export default {
	name: "z-paging",
	components: {
		zPagingRefresh,
		zPagingLoadMore,
		zPagingEmptyView
	},
	data() {
		return {
			//--------------静态资源---------------
			base64Arrow: zStatic.base64Arrow,
			base64Flower: zStatic.base64Flower,
			base64BackToTop: zStatic.base64BackToTop,

			//-------------全局数据相关--------------
			currentData: [],
			totalData: [],
			realTotalData: [],
			totalLocalPagingList: [],
			pageNo: 1,
			scrollTop: 0,
			oldScrollTop: 0,
			refresherTouchstartY: 0,
			lastRefresherTouchmove: null,
			refresherReachMaxAngle: true,
			refresherTransform: 'translateY(0px)',
			refresherTransition: '',
			finalRefresherDefaultStyle: 'black',
			//当前加载类型 0-下拉刷新 1-上拉加载更多
			loadingType: Enum.LoadingType.Refresher,
			//底部加载更多状态 0-默认状态 1.加载中 2.没有更多数据 3.加载失败
			loadingStatus: Enum.More.Default,
			//下拉刷新状态 0-默认状态 1.松手立即刷新 2.刷新中
			refresherStatus: Enum.Refresher.Default,
			scrollViewStyle: {},
			scrollViewInStyle: {},
			pullDownTimeStamp: 0,
			requestTimeStamp: 0,
			loadingMoreTimeStamp: 0,
			pageScrollTop: -1,
			chatRecordLoadingMoreText: '',
			moveDistance: 0,
			oldMoveDistance: 0,
			loadingMoreDefaultSlot: null,
			backToTopClass: 'zp-back-to-top zp-back-to-top-hide',
			tempLanguageUpdateKey: 0,
			wxsPropType: '',
			refresherRevealStackCount: 0,
			renderPropScrollTop: -1,
			renderPropUsePageScroll: -1,
			checkScrolledToBottomTimeOut: null,
			refresherCompleteTimeout: null,
			refresherCompleteSubTimeout: null,
			lastBackToTopShowTime: 0,
			systemInfo: null,
			cssSafeAreaInsetBottom: -1,

			//--------------状态&判断---------------
			showLoadingMore: false,
			insideOfPaging: -1,
			refresherTriggered: false,
			loading: false,
			firstPageLoaded: false,
			pagingLoaded: false,
			loaded: false,
			isUserReload: true,
			valueLocked: false,
			scrollEnable: true,
			isTouchmoving: false,
			isLocalPaging: false,
			isAddedData: false,
			isTotalChangeFromAddData: false,
			isTouchEnded: false,
			isUserPullDown: false,
			privateRefresherEnabled: -1,
			privateScrollWithAnimation: -1,
			privateConcat: true,
			myParentQuery: -1,
			showBackToTopClass: false,
			isLoadFailed: false,
			isIos: systemInfo.platform === 'ios',
			privateShowRefresherWhenReload: false,
			disabledBounce: false,
			cacheScrollNodeHeight: -1,
			customNoMore: -1,
			customRefresherHeight: -1,
			showCustomRefresher: false,
			fromEmptyViewReload: false,
			doRefreshAnimateAfter: false,
			isRefresherInComplete: false,
			isIos13: systemInfo.system && systemInfo.system.length && systemInfo.system.indexOf('iOS 13') != -1,

			//--------------nvue相关---------------
			nRefresherLoading: false,
			nListIsDragging: false,
			nShowBottom: true,
			nFixFreezing: false,
			nShowRefresherReveal: false,
			nIsFirstPageAndNoMore: false,
			nFirstPageAndNoMoreChecked: false,
			nLoadingMoreFixedHeight: false,
			nShowRefresherRevealHeight: 0,

			//---------------wxs相关---------------
			wxsIsScrollTopInTopRange: true,
			wxsScrollTop: 0,
			wxsPageScrollTop: 0,
			wxsOnPullingDown: false,
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
			type: [Number, String, Object],
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
		//调用complete后延迟处理的时间，单位为毫秒，默认0毫秒，优先级高于minDelay
		delay: {
			type: [Number, String],
			default: _getConfig('delay', 0),
		},
		//触发@query后最小延迟处理的时间，单位为毫秒，默认0毫秒，优先级低于delay（假设设置为300毫秒，若分页请求时间小于300毫秒，则在调用complete后延迟[300毫秒-请求时长]；若请求时长大于300毫秒，则不延迟），当show-refresher-when-reload为true或reload(true)时，其最小值为400
		minDelay: {
			type: [Number, String],
			default: _getConfig('minDelay', 0),
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
		//设置z-paging的style，部分平台(如微信小程序)无法直接修改组件的style，可使用此属性代替
		pagingStyle: {
			type: Object,
			default: function() {
				return _getConfig('pagingStyle', {});
			},
		},
		//z-paging的高度，优先级低于pagingStyle中设置的height；传字符串，如100px、100rpx、100%
		height: {
			type: String,
			default: _getConfig('height', '')
		},
		//z-paging的宽度，优先级低于pagingStyle中设置的width；传字符串，如100px、100rpx、100%
		width: {
			type: String,
			default: _getConfig('width', '')
		},
		//z-paging的背景色，优先级低于pagingStyle中设置的background。传字符串，如"#ffffff"
		bgColor: {
			type: String,
			default: _getConfig('bgColor', '')
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
		//自定义下拉刷新中左侧图标的样式
		refresherImgStyle: {
			type: Object,
			default: function() {
				return _getConfig('refresherImgStyle', {});
			}
		},
		//自定义下拉刷新中右侧状态描述文字的样式
		refresherTitleStyle: {
			type: Object,
			default: function() {
				return _getConfig('refresherTitleStyle', {});
			}
		},
		//自定义下拉刷新中右侧最后更新时间文字的样式(show-refresher-update-time为true时有效)
		refresherUpdateTimeStyle: {
			type: Object,
			default: function() {
				return _getConfig('refresherUpdateTimeStyle', {});
			}
		},
		//在微信小程序和QQ小程序中，是否实时监听下拉刷新中进度，默认为否
		watchRefresherTouchmove: {
			type: Boolean,
			default: _getConfig('watchRefresherTouchmove', false)
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
		//自定义下拉刷新结束以后延迟回弹的时间，单位为毫秒，默认为0
		refresherCompleteDelay: {
			type: [Number, String],
			default: _getConfig('refresherCompleteDelay', 0)
		},
		//自定义下拉刷新结束回弹动画时间，单位为毫秒，默认为300毫秒(refresherEndBounceEnabled为false时，refresherCompleteDuration为设定值的1/3)，nvue无效
		refresherCompleteDuration: {
			type: [Number, String],
			default: _getConfig('refresherCompleteDuration', 300)
		},
		//自定义下拉刷新结束状态下是否允许列表滚动，默认为否
		refresherCompleteScrollable: {
			type: Boolean,
			default: _getConfig('refresherCompleteScrollable', false)
		},
		//使用页面滚动，默认为否，当设置为是时则使用页面的滚动而非此组件内部的scroll-view的滚动，使用页面滚动时z-paging无需设置确定的高度且对于长列表展示性能更高，但配置会略微繁琐
		usePageScroll: {
			type: Boolean,
			default: _getConfig('usePageScroll', false)
		},
		//是否使用虚拟列表，默认为否
		useVirtualList: {
			type: Boolean,
			default: _getConfig('useVirtualList', false)
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
		//用户下拉刷新时是否触发reload方法，默认为是
		reloadWhenRefresh: {
			type: Boolean,
			default: _getConfig('reloadWhenRefresh', true)
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
		//自定义下拉刷新下拉帧率，默认为40，过高可能会出现抖动问题
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
		//自定义下拉刷新默认状态下的文字
		refresherDefaultText: {
			type: [String, Object],
			default: _getConfig('refresherDefaultText', null)
		},
		//自定义下拉刷新松手立即刷新状态下的文字
		refresherPullingText: {
			type: [String, Object],
			default: _getConfig('refresherPullingText', null)
		},
		//自定义下拉刷新刷新中状态下的文字
		refresherRefreshingText: {
			type: [String, Object],
			default: _getConfig('refresherRefreshingText', null)
		},
		//自定义下拉刷新刷新结束状态下的文字
		refresherCompleteText: {
			type: [String, Object],
			default: _getConfig('refresherCompleteText', null)
		},
		//是否开启自定义下拉刷新刷新结束回弹效果，默认为是
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
		//当分页未满一屏时，是否自动加载更多，默认为否(nvue无效)
		insideMore: {
			type: Boolean,
			default: _getConfig('insideMore', false)
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
		//空数据图容器样式
		emptyViewSuperStyle: {
			type: Object,
			default: function() {
				return _getConfig('emptyViewSuperStyle', {});
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
		//空数据图片是否铺满z-paging，默认为是。若设置为否，则为填充满z-paging的剩余部分
		emptyViewFixed: {
			type: Boolean,
			default: function() {
				return _getConfig('emptyViewFixed', false)
			}
		},
		//空数据图片是否垂直居中，默认为是。emptyViewFixed为false时有效
		emptyViewCenter: {
			type: Boolean,
			default: function() {
				return _getConfig('emptyViewCenter', true)
			}
		},
		//加载中时是否自动隐藏空数据图，默认为是
		autoHideEmptyViewWhenLoading: {
			type: Boolean,
			default: _getConfig('autoHideEmptyViewWhenLoading', true)
		},
		//用户下拉列表触发下拉刷新加载中时是否自动隐藏空数据图，默认为是
		autoHideEmptyViewWhenPull: {
			type: Boolean,
			default: _getConfig('autoHideEmptyViewWhenPull', true)
		},
		//第一次加载后自动隐藏loading slot，默认为是
		autoHideLoadingAfterFirstLoaded: {
			type: Boolean,
			default: _getConfig('autoHideLoadingAfterFirstLoaded', true)
		},
		//loading slot是否铺满屏幕并固定，默认为否
		loadingFullFixed: {
			type: Boolean,
			default: _getConfig('loadingFullFixed', false)
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
		//控制是否出现滚动条，默认为是
		showScrollbar: {
			type: Boolean,
			default: _getConfig('showScrollbar', true)
		},
		//是否允许横向滚动，默认为否
		scrollX: {
			type: Boolean,
			default: _getConfig('scrollX', false)
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
		//设置自定义下拉刷新区域背景
		refresherBackground: {
			type: String,
			default: _getConfig('refresherBackground', 'transparent')
		},
		//设置固定的自定义下拉刷新区域背景
		refresherFixedBackground: {
			type: String,
			default: _getConfig('refresherFixedBackground', 'transparent')
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
		//使用页面滚动时，是否在不满屏时自动填充满屏幕，默认为是
		autoFullHeight: {
			type: Boolean,
			default: _getConfig('autoFullHeight', true)
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
			default: _getConfig('nvueBounce', true)
		},
		//nvue中通过代码滚动到顶部/底部时，是否加快动画效果(无滚动动画时无效)，默认为否
		nvueFastScroll: {
			type: Boolean,
			default: _getConfig('nvueFastScroll', false)
		},
		//nvue中list的id
		nvueListId: {
			type: String,
			default: _getConfig('nvueListId', '')
		},
		//nvue中refresh组件的样式
		nvueRefresherStyle: {
			type: Object,
			default: function() {
				return _getConfig('nvueRefresherStyle', {});
			}
		},
		//是否隐藏nvue列表底部的tagView，此view用于标识滚动到底部位置，若隐藏则滚动到底部功能将失效，在nvue中实现吸顶+swiper功能时需将最外层z-paging的此属性设置为true。默认为否
		hideNvueBottomTag: {
			type: Boolean,
			default: _getConfig('hideNvueBottomTag', false)
		},
		//是否将错误信息打印至控制台，默认为是
		showConsoleError: {
			type: Boolean,
			default: _getConfig('showConsoleError', true)
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
		this.wxsPropType = zUtils.getTime().toString();
		this.renderJsIgnore;
		if (!this.refresherOnly && (this.mountedAutoCallReload && this.auto)) {
			this.$nextTick(() => {
				this._preReload();
			})
		}
		let delay = 0;
		// #ifdef H5 || MP
		delay = 100;
		// #endif
		this.$nextTick(() => {
			setTimeout(()=>{
				this.systemInfo = uni.getSystemInfoSync();
			},delay)
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
		uni.$on(i18nUpdateKey, () => {
			this.tempLanguageUpdateKey = zUtils.getTime();
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
		// #ifndef APP-PLUS
		this.$nextTick(()=>{
			setTimeout(()=>{
				this._getCssSafeAreaInsetBottom();
			},delay)
		})
		// #endif
	},
	destroyed() {
		uni.$off(i18nUpdateKey);
		uni.$off(errorUpdateKey);
	},
	watch: {
		value(newVal, oldVal) {
			if(this.valueLocked){
				this.valueLocked = false;
				return;
			}
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
				this.isTotalChangeFromAddData = true;
				this.totalData = newVal;
			}
		},
		totalData(newVal, oldVal) {
			if ((!this.isUserReload || !this.autoCleanListWhenReload) && this.firstPageLoaded && !newVal.length && oldVal.length) {
				return;
			}
			this._doCheckScrollViewShouldFullHeight(newVal);
			this.realTotalData = newVal;
			this.$emit('input', newVal);
			this.$emit('update:list', newVal);
			this.$emit('listChange', newVal);
			this._callMyParentList(newVal);
			this.firstPageLoaded = false;
			this.isTotalChangeFromAddData = false;
			this.$nextTick(() => {
				setTimeout(()=>{
					this._getNodeClientRect('.zp-paging-container-content').then((res) => {
						if (res) {
							this.$emit('contentHeightChanged', res[0].height);
						}
					});
				},1)
				// #ifdef APP-NVUE
				if (this.useChatRecordMode && this.nIsFirstPageAndNoMore && this.pageNo === this.defaultPageNo && !this.nFirstPageAndNoMoreChecked) {
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
				if (this.pageNo === this.defaultPageNo && newVal === Enum.More.NoMore) {
					this.nIsFirstPageAndNoMore = true;
					return;
				}
			}
			this.nIsFirstPageAndNoMore = false;
			//  #endif
		},
		oldScrollTop(newVal, oldVal) {
			if (!this.usePageScroll) {
				this._scrollTopChange(newVal,oldVal,false);
			}
		},
		pageScrollTop(newVal, oldVal) {
			if (this.usePageScroll) {
				this._scrollTopChange(newVal,oldVal,true);
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
					this.renderPropUsePageScroll = newVal;
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
				this.renderPropScrollTop = newVal < 6 ? 0 : 10;
			}
		},
		moveDistance(newVal, oldVal){
			this.oldMoveDistance = oldVal;
		},
		nIsFirstPageAndNoMore: {
			handler(newVal) {
				const cellStyle = !this.useChatRecordMode || newVal ? {} : {transform: 'rotate(180deg)'};
				this.$emit('update:cellStyle', cellStyle);
			},
			immediate: true
		}
	},
	computed: {
		pageSize() {
			return this.defaultPageSize;
		},
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
				status: this.loadingStatus,
				defaultThemeStyle: this.finalLoadingMoreThemeStyle,
				customStyle: this.loadingMoreCustomStyle,
				iconCustomStyle: this.loadingMoreLoadingIconCustomStyle,
				loadingIconType: this.loadingMoreLoadingIconType,
				loadingIconCustomImage: this.loadingMoreLoadingIconCustomImage,
				loadingAnimated: this.loadingMoreLoadingAnimated,
				showNoMoreLine: this.showLoadingMoreNoMoreLine,
				noMoreLineCustomStyle: this.loadingMoreNoMoreLineCustomStyle,
				defaultText: this.finalLoadingMoreDefaultText,
				loadingText: this.finalLoadingMoreLoadingText,
				noMoreText: this.finalLoadingMoreNoMoreText,
				failText: this.finalLoadingMoreFailText
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
			if (['list','waterfall','scroller'].indexOf(nvueListIsLowerCase) !== -1) {
				return nvueListIsLowerCase;
			}
			return 'list';
		},
		finalNvueSuperListIs() {
			return this.usePageScroll ? 'view' : 'scroller';
		},
		finalNvueRefresherEnabled() {
			return this.finalNvueListIs !== 'view' && this.finalRefresherEnabled && !this.nShowRefresherReveal && !this.useChatRecordMode;
		},
		finalPagingStyle() {
			let pagingStyle = this.pagingStyle;
			if (!this.systemInfo) {
				return pagingStyle;
			}
			const windowTop = this.systemInfo.windowTop;
			const windowBottom = this.systemInfo.windowBottom;
			if (!this.usePageScroll && this.fixed) {
				if (windowTop && !pagingStyle.top) {
					pagingStyle.top = windowTop + 'px';
				}
				if (!pagingStyle.bottom) {
					let bottom = 0;
					if (windowBottom && windowBottom !== undefined) {
						bottom = windowBottom;
					}
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
		finalEnableBackToTop() {
			return this.usePageScroll ? false : this.enableBackToTop;
		},
		finalBackToTopThreshold() {
			return zUtils.convertTextToPx(this.backToTopThreshold);
		},
		finalLowerThreshold() {
			return zUtils.convertTextToPx(this.lowerThreshold);
		},
		finalRefresherThreshold() {
			let refresherThreshold = this.refresherThreshold;
			let idDefault = false;
			if (refresherThreshold === '80rpx') {
				idDefault = true;
				if (this.showRefresherUpdateTime) {
					refresherThreshold = '120rpx';
				}
			}
			if (idDefault && this.customRefresherHeight > 0) {
				return this.customRefresherHeight;
			}
			return zUtils.convertTextToPx(refresherThreshold);
		},
		finalRefresherFixedBacHeight() {
			return zUtils.convertTextToPx(this.refresherFixedBacHeight);
		},
		finalScrollTop() {
			return this.usePageScroll ? this.pageScrollTop : this.oldScrollTop;
		},
		finalBackToTopStyle() {
			let tempBackToTopStyle = this.backToTopStyle;
			if (!tempBackToTopStyle.bottom) {
				tempBackToTopStyle.bottom = this.windowBottom + zUtils.convertTextToPx(this.backToTopBottom) + 'px';
			}
			if(!tempBackToTopStyle.position){
				tempBackToTopStyle.position = this.usePageScroll ? 'fixed': 'absolute';
			}
			return tempBackToTopStyle;
		},
		finalTempLanguage() {
			return this.language.length ? this.language : this.tempLanguage;
		},
		finalLanguage() {
			let language = this.finalTempLanguage.toLowerCase();
			return zI18n._getPrivateLanguage(language, this.followSystemLanguage);
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
		finalRefresherCompleteText() {
			return this._getI18nText('refresherCompleteText', this.refresherCompleteText);
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
			return this.isLoadFailed ? this.finalEmptyViewErrorText : this._getI18nText('emptyViewText', this.emptyViewText);
		},
		finalEmptyViewReloadText() {
			return this._getI18nText('emptyViewReloadText', this.emptyViewReloadText);
		},
		finalEmptyViewErrorText() {
			return this._getI18nText('emptyViewErrorText', this.emptyViewErrorText);
		},
		finalEmptyViewImg() {
			return this.isLoadFailed ? this.emptyViewErrorImg : this.emptyViewImg;
		},
		finalShowEmptyViewReload() {
			return this.isLoadFailed ? this.showEmptyViewReloadWhenError : this.showEmptyViewReload;
		},
		finalRefresherThemeStyle() {
			return this.refresherThemeStyle.length ? this.refresherThemeStyle : this.defaultThemeStyle;
		},
		finalLoadingMoreThemeStyle() {
			return this.loadingMoreThemeStyle.length ? this.loadingMoreThemeStyle : this.defaultThemeStyle;
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
			let rate = this.refresherOutRate;
			rate = Math.max(0,rate);
			rate = Math.min(1,rate);
			return rate;
		},
		finalRefresherTransform() {
			if (this.refresherTransform === 'translateY(0px)') {
				return 'none';
			}
			return this.refresherTransform;
		},
		finalConcat() {
			return this.concat && this.privateConcat;
		},
		finalShowRefresherWhenReload() {
			return this.showRefresherWhenReload || this.privateShowRefresherWhenReload;
		},
		finalRefresherTriggered() {
			if(!(this.finalRefresherEnabled && !this.useCustomRefresher)){
				return false;
			}
			return this.refresherTriggered;
		},
		showEmpty() {
			if(this.refresherOnly || this.hideEmptyView || this.totalData.length){
				return false;
			}
			if(this.autoHideEmptyViewWhenLoading){
				if(this.isAddedData && !this.firstPageLoaded && !this.loading){
					return true;
				}
			}else{
				return true;
			}
			if(!this.autoHideEmptyViewWhenPull && !this.isUserReload){
				return true;
			}
			return false;
		},
		showLoading() {
			return !this.firstPageLoaded && (this.autoHideLoadingAfterFirstLoaded ? (this.fromEmptyViewReload ? true : !this.pagingLoaded) : true) && this.loading;
		},
		hasTouchmove(){
			// #ifdef APP-VUE || H5
			if(this.$listeners && !this.$listeners.refresherTouchmove){
				return false;
			}
			// #endif
			
			// #ifdef MP-WEIXIN || MP-QQ
			return this.watchRefresherTouchmove;
			// #endif
			
			return true;
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
			if(!this.systemInfo){
				return 0;
			}
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
			if (!this.systemInfo) {
				return 0;
			}
			let windowBottom = this.systemInfo.windowBottom || 0;
			if (this.safeAreaInsetBottom) {
				windowBottom += this.safeAreaBottom;
			}
			return windowBottom;
		},
		showRefresher() {
			const showRefresher = this.finalRefresherEnabled && this.useCustomRefresher && this.isTouchmoving;
			// #ifndef APP-NVUE
			if (this.customRefresherHeight === -1 && showRefresher) {
				setTimeout(() => {
					this.$nextTick(()=>{
						this._updateCustomRefresherHeight();
					})
				}, 100)
			}
			// #endif
			return showRefresher;
		},
		// #ifdef APP-NVUE
		nWaterfallColumnCount() {
			if (this.finalNvueListIs !== 'waterfall') {
				return 0;
			}
			return this._nGetWaterfallConfig('column-count', 2);
		},
		nWaterfallColumnWidth() {
			return this._nGetWaterfallConfig('column-width', 'auto');
		},
		nWaterfallColumnGap() {
			return this._nGetWaterfallConfig('column-gap', 'normal');
		},
		nWaterfallLeftGap() {
			return this._nGetWaterfallConfig('left-gap', 0);
		},
		nWaterfallRightGap() {
			return this._nGetWaterfallConfig('right-gap', 0);
		},
		nViewIs() {
			const is = this.finalNvueListIs;
			return is === 'scroller' || is === 'view' ? 'view' : is === 'waterfall' ? 'header' : 'cell';
		},
		nSafeAreaBottomHeight() {
			return this.safeAreaInsetBottom ? this.safeAreaBottom : 0;
		}
		// #endif
	},
	methods: {
		//请求结束(成功或者失败)调用此方法，将请求的结果传递给z-paging处理，第一个参数为请求结果数组，第二个参数为是否成功(默认是是）
		complete(data, success = true) {
			this.customNoMore = -1;
			this.addData(data, success);
		},
		//简写，与complete完全相同
		end(data, success = true) {
			this.complete(data, success);
		},
		//【保证数据一致】请求结束(成功或者失败)调用此方法，将请求的结果传递给z-paging处理，第一个参数为请求结果数组，第二个参数为dataKey，需与:data-key绑定的一致，第三个参数为是否成功(默认为是）
		completeByKey(data, dataKey = null, success = true) {
			if (dataKey !== null && this.dataKey !== null && dataKey !== this.dataKey) {
				return;
			}
			this.customNoMore = -1;
			this.addData(data, success);
		},
		//简写，与completeByKey完全相同
		endByKey(data, dataKey = null, success = true) {
			this.completeByKey(data, dataKey, success);
		},
		//【通过totalCount判断是否有更多数据】请求结束(成功或者失败)调用此方法，将请求的结果传递给z-paging处理，第一个参数为请求结果数组，第二个参数为totalCount(列表总数)，第三个参数为是否成功(默认为是）
		completeByTotalCount(data, totalCount, success = true) {
			if (totalCount == 'undefined') {
				this.customNoMore = -1;
			} else {
				let dataTypeRes = this._checkDataType(data, success, false);
				data = dataTypeRes.data;
				success = dataTypeRes.success;
				if (totalCount >= 0 && success) {
					this.$nextTick(() => {
						let nomore = true;
						let realTotalDataCount = this.realTotalData.length;
						if (this.pageNo == this.defaultPageNo) {
							realTotalDataCount = 0;
						}
						let exceedCount = realTotalDataCount + data.length - totalCount;
						if (exceedCount >= 0) {
							nomore = false;
							exceedCount = this.defaultPageSize - exceedCount;
							if (exceedCount > 0 && exceedCount < data.length) {
								data = data.splice(0, exceedCount);
							}
						}
						this.completeByNoMore(data, nomore, success);
					})
					return;
				}
			}
			this.addData(data, success);
		},
		//简写，与completeByTotalCount完全相同
		completeByTotal(data, totalCount, success = true) {
			this.completeByTotalCount(data, totalCount, success);
		},
		//简写，与completeByTotalCount完全相同
		endByTotalCount(data, totalCount, success = true) {
			this.completeByTotalCount(data, totalCount, success);
		},
		//简写，与completeByTotalCount完全相同
		endByTotal(data, totalCount, success = true) {
			this.completeByTotalCount(data, totalCount, success);
		},
		//【自行判断是否有更多数据】请求结束(成功或者失败)调用此方法，将请求的结果传递给z-paging处理，第一个参数为请求结果数组，第二个参数为是否有更多数据，第三个参数为是否成功(默认是是）
		completeByNoMore(data, nomore, success = true) {
			if (nomore != 'undefined') {
				this.customNoMore = nomore == true ? 1 : 0;
			}
			this.addData(data, success);
		},
		//简写，与completeByNoMore完全相同
		endByNoMore(data, nomore, success = true) {
			this.completeByNoMore(data, nomore, success);
		},
		//与上方complete方法功能一致，新版本中设置服务端回调数组请使用complete方法
		addData(data, success = true) {
			const currentTimeStamp = zUtils.getTime();
			let addDataDalay = 0;
			const disTime = currentTimeStamp - this.requestTimeStamp;
			let minDelay = this.minDelay;
			if(this.pageNo === this.defaultPageNo && this.finalShowRefresherWhenReload){
				minDelay = Math.max(400,minDelay);
			}
			if(this.requestTimeStamp > 0 && disTime < minDelay){
				addDataDalay = minDelay - disTime;
			}
			this.$nextTick(() => {
				let delay = this.delay > 0 ? this.delay : addDataDalay;
				setTimeout(() => {
					this._addData(data, success, false);
				}, 0)
			})
		},
		//终止下拉刷新状态
		endRefresh(){
		   this._refresherEnd();
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
			return `z-paging v${currentVersion}`;
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
		//刷新列表数据，pageNo和pageSize不会重置，列表数据会重新从服务端获取。必须保证@query绑定的方法中的pageNo和pageSize和传给服务端的一致
		refresh() {
			if(!this.realTotalData.length){
				this.reload();
				return;
			}
			const disPageNo = this.pageNo - this.defaultPageNo + 1;
			if (disPageNo >= 1) {
				this.loading = true;
				this.privateConcat = false;
				const totalPageSize = disPageNo * this.pageSize;
				this._emitQuery(this.defaultPageNo, totalPageSize);
				this._callMyParentQuery(this.defaultPageNo, totalPageSize);
			}
		},
		//清空分页数据
		clean() {
			this._reload(true);
			this._addData([], true, false);
		},
		//清空分页数据
		clear() {
			this.clean();
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
		//滚动到顶部，animate为是否展示滚动动画，默认为是
		scrollToTop(animate,checkReverse = true) {
			// #ifdef APP-NVUE
			if (checkReverse && this.useChatRecordMode) {
				if(!this.nIsFirstPageAndNoMore){
					this.scrollToBottom(animate, false);
					return;
				}
			}
			// #endif
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
		scrollToBottom(animate,checkReverse = true) {
			// #ifdef APP-NVUE
			if (checkReverse && this.useChatRecordMode) {
				if(!this.nIsFirstPageAndNoMore){
					this.scrollToTop(animate, false);
					return;
				}
			}
			// #endif
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
		//滚动到指定位置(vue中有效)。y为与顶部的距离，单位为px；offset为偏移量，单位为px；animate为是否展示滚动动画，默认为否
		scrollToY(y, offset, animate) {
			this.scrollTop = this.oldScrollTop;
			this.$nextTick(() => {
				this._scrollToY(y, offset, animate);
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
				zUtils.consoleErr('updatePageScrollTop方法缺少参数，请将页面onPageScroll事件中的scrollTop传递给此方法');
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
				this.$refs['n-list'].setSpecialEffects(args);
			}
		},
		handleRefresherStatusChanged(func) {
			this.refresherStatusChangedFunc = func;
		},
		//------------------ 私有方法 -------------------
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
				this.refresherStatus = Enum.Refresher.Loading;
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
			this.insideOfPaging = -1;
			this.pageNo = this.defaultPageNo;
			if (!isClean) {
				this._startLoading(true);
			}
			this.firstPageLoaded = true;
			this.isTotalChangeFromAddData = false;
			this.totalData = [];
			if (!isClean) {
				this._emitQuery(this.pageNo, this.defaultPageSize);
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
						zUtils.consoleWarn('使用聊天记录模式时，建议使用页面滚动，可将usePageScroll设置为true以启用页面滚动！！');
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
			this.fromEmptyViewReload = false;
			this.isTotalChangeFromAddData = true;
			if (!this.useCustomRefresher) {
				uni.stopPullDownRefresh();
			}
			// #ifdef APP-NVUE
			if (this.usePageScroll) {
				uni.stopPullDownRefresh();
			}
			// #endif
			const tempIsUserPullDown = this.isUserPullDown;
			if (this.showRefresherUpdateTime && this.pageNo === this.defaultPageNo) {
				zUtils.setRefesrherTime(zUtils.getTime(), this.refresherUpdateTimeKey);
				this.tempLanguageUpdateKey = zUtils.getTime();
				if (this.$refs.refresh) {
					this.$refs.refresh.updateTime();
				}
			}
			if (tempIsUserPullDown && this.pageNo === this.defaultPageNo) {
				this.isUserPullDown = false;
			}
			let dataTypeRes = this._checkDataType(data, success, true);
			data = dataTypeRes.data;
			success = dataTypeRes.success;
			if (this.refresherTriggered) {
				this.refresherTriggered = false;
			}
			let delayTime = commonDelayTime;
			let shouldEndLoadingDelay = true;
			// #ifdef APP-NVUE
			if (this.useChatRecordMode) {
				delayTime = 0
			}
			shouldEndLoadingDelay = false;
			// #endif
			setTimeout(() => {
				this._refresherEnd(shouldEndLoadingDelay, true, tempIsUserPullDown);
				this.pagingLoaded = true;
			}, delayTime)
			if (this.pageNo === this.defaultPageNo) {
				this.isLoadFailed = !success;
			}
			if (success) {
				if (!(this.privateConcat === false && this.loadingStatus === Enum.More.NoMore)) {
					this.loadingStatus = Enum.More.Default;
				}
				if (isLocal) {
					this.totalLocalPagingList = data;
					this._localPagingQueryList(this.defaultPageNo, this.defaultPageSize, 0, (res) => {
						this.complete(res);
					})
				} else {
					let dataChangeDelayTime = 0;
					// #ifdef APP-NVUE
					if (this.privateShowRefresherWhenReload && this.finalNvueListIs === 'waterfall') {
						dataChangeDelayTime = 150;
					}
					// #endif
					setTimeout(() => {
						this._currentDataChange(data, this.currentData);					
					}, dataChangeDelayTime)
				}
			} else {
				this._currentDataChange(data, this.currentData);
				this.loadingStatus = Enum.More.Fail;
				if (this.loadingType === Enum.LoadingType.LoadingMore) {
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
			if (this.pageNo === this.defaultPageNo && this.finalConcat) {
				this.totalData = [];
			}
			if (this.customNoMore !== -1) {
				if (this.customNoMore === 0 || !newVal.length) {
					this.loadingStatus = Enum.More.NoMore;
				}
			} else {
				if (!newVal.length ||
					(newVal.length && newVal.length < this.defaultPageSize)) {
					this.loadingStatus = Enum.More.NoMore;
				}
			}
			if (!this.totalData.length) {
				if (this.finalConcat) {
					// #ifdef APP-NVUE
					if(this.useChatRecordMode && this.pageNo === this.defaultPageNo && this.loadingStatus === Enum.More.NoMore){
						newVal.reverse();
					}
					// #endif
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
						setTimeout(() => {
							this._scrollIntoView(idIndexStr, 30, false, () => {
								this.$emit('update:chatIndex', 0);
							});
						}, this.usePageScroll ? 0 : delayTime)
					} else {
						this.$nextTick(() => {
							this._scrollToBottom(false);
						})
					}
					//#endif

				} else {
					if (this.finalConcat) {
						this.totalData = [...this.totalData, ...newVal];
						// #ifdef MP-WEIXIN
						if (!this.isIos && !this.refresherOnly && !this.usePageScroll && newVal.length) {
							this.loadingMoreTimeStamp = zUtils.getTime();
							const currentScrollTop = this.oldScrollTop;
							this.scrollToY(currentScrollTop);
						}
						// #endif
					} else {
						this.totalData = [...newVal];
					}
				}
			}
			this.privateConcat = true;
		},
		//通过@scroll事件检测是否滚动到了底部
		_checkScrolledToBottom(scrollDiff, checked = false) {
			if (this.checkScrolledToBottomTimeOut) {
				clearTimeout(this.checkScrolledToBottomTimeOut);
				this.checkScrolledToBottomTimeOut = null;
			}
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
				} else if (scrollDiff - this.cacheScrollNodeHeight <= 500 && !checked) {
					this.checkScrolledToBottomTimeOut = setTimeout(() => {
						this._getNodeClientRect('.zp-scroll-view', true, true).then((res) => {
							this.oldScrollTop = res[0].scrollTop;
							const newScrollDiff = res[0].scrollHeight - this.oldScrollTop;
							this._checkScrolledToBottom(newScrollDiff, true);
						})
					}, 150)
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
				//#ifdef APP-VUE || H5
				if (this.isIos) {
					this.renderPropUsePageScroll = -1;
					this.$nextTick(() => {
						this.renderPropUsePageScroll = this.usePageScroll;
					})
				}
				//#endif
			}
			this.$emit('scrolltolower', from);
			if (from === 'toBottom' && (!this.toBottomLoadingMoreEnabled || this.useChatRecordMode)) {
				return;
			}
			if (this.refresherOnly || !this.loadingMoreEnabled || !(this.loadingStatus === Enum.More.Default || this.loadingStatus === Enum.More.Fail) || this.loading){
				return;
			}
			
			// #ifdef MP-WEIXIN
			if (!this.isIos && !this.refresherOnly && !this.usePageScroll) {
				const currentTimestamp = zUtils.getTime();
				if(this.loadingMoreTimeStamp > 0 && currentTimestamp - this.loadingMoreTimeStamp < 100){
					this.loadingMoreTimeStamp = 0;
					return;
				}
			}
			// #endif
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
			if (this.loadingStatus === Enum.More.NoMore) {
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
					let nodeHeight = 0;
					if (node) {
						nodeHeight = node[0].height;
					}
					weexDom.scrollToElement(el, {
						offset: -nodeHeight,
						animated: animate
					});
				});
			} else {
				if(!this.isIos && this.nvueListIs === 'scroller'){
					this._getNodeClientRect('zp-n-refresh-container', false).then((node) => {
						let nodeHeight = 0;
						if (node) {
							nodeHeight = node[0].height;
						}
						weexDom.scrollToElement(el, {
							offset: -nodeHeight,
							animated: animate
						});
					});
				}else{
					weexDom.scrollToElement(el, {
						offset: 0,
						animated: animate
					});
				}
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
			if (el) {
				weexDom.scrollToElement(el, {
					offset: 0,
					animated: animate
				});
			} else {
				zUtils.consoleErr('滚动到底部失败，因为您设置了hideNvueBottomTag为true');
			}
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
					} else if (dataType === '[object Array]') {
						el = sel[0];
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
			this._scrollToY(nodeTop,offset,animate,true);
		},
		//滚动到指定位置
		_scrollToY(y, offset = 0, animate = false, addScrollTop = false) {
			this.privateScrollWithAnimation = animate ? 1 : 0;
			if (this.usePageScroll) {
				uni.pageScrollTo({
					scrollTop: y - offset,
					duration: animate ? 100 : 0
				});
			} else {
				if(addScrollTop){
				   y += this.oldScrollTop; 
				}
				this.scrollTop = y - offset;
				this.oldScrollTop = this.scrollTop;
			}
		},
		//是否要展示上拉加载更多view
		_shouldShowLoadingMore(type) {
			if (!(this.loadingStatus === Enum.More.Default ? this.nShowBottom : true)) {
				return false;
			}
			if (((!this.showLoadingMoreWhenReload || this.isUserPullDown || this.loadingStatus !== Enum.More.Loading) && !this.showLoadingMore) || (!this.loadingMoreEnabled && (!this.showLoadingMoreWhenReload || this
				.isUserPullDown || this.loadingStatus !== Enum.More.Loading)) || this.refresherOnly) {
				return false;
			}
			
			if (this.useChatRecordMode && type !== 'loadingMoreLoading') {
				return false;
			}
			if (!this.$slots) {
				return false;
			}
			if (type === 'loadingMoreDefault') {
				const res = this.loadingStatus === Enum.More.Default && this.$slots.loadingMoreDefault;
				if (res) {
					// #ifdef APP-NVUE
					if (!this.isIos) {
						this.nLoadingMoreFixedHeight = false;
					}
					//  #endif
				}
				return res;
			} else if (type === 'loadingMoreLoading') {
				const res = this.loadingStatus === Enum.More.Loading && this.$slots.loadingMoreLoading;
				if (res) {
					// #ifdef APP-NVUE
					if (!this.isIos) {
						this.nLoadingMoreFixedHeight = false;
					}
					//  #endif
				}
				return res;
			} else if (type === 'loadingMoreNoMore') {
				const res = this.loadingStatus === Enum.More.NoMore && this.$slots.loadingMoreNoMore && this.showLoadingMoreNoMoreView;
				if (res) {
					// #ifdef APP-NVUE
					if (!this.isIos) {
						this.nLoadingMoreFixedHeight = false;
					}
					//  #endif
				}
				return res;
			} else if (type === 'loadingMoreFail') {
				const res = this.loadingStatus === Enum.More.Fail && this.$slots.loadingMoreFail;
				if (res) {
					// #ifdef APP-NVUE
					if (!this.isIos) {
						this.nLoadingMoreFixedHeight = false;
					}
					//  #endif
				}
				return res;
			} else if (type === 'loadingMoreCustom') {
				return this.showDefaultLoadingMoreText && !(this.loadingStatus === Enum.More.NoMore && !this.showLoadingMoreNoMoreView);
			}
			return false;
		},
		//处理开始加载更多状态
		_startLoading(isReload = false) {
			if ((this.showLoadingMoreWhenReload && !this.isUserPullDown) || !isReload) {
				this.loadingStatus = Enum.More.Loading;
			}
			this.loading = true;
		},
		//处理开始加载更多
		_doLoadingMore() {
			if (this.pageNo >= this.defaultPageNo && this.loadingStatus !== Enum.More.NoMore) {
				this.pageNo++;
				this._startLoading(false);
				if (this.isLocalPaging) {
					this._localPagingQueryList(this.pageNo, this.defaultPageSize, this.localPagingLoadingTime, (res) => {
						this.addData(res);
					})
				} else {
					this._emitQuery(this.pageNo, this.defaultPageSize);
					this._callMyParentQuery();
				}
				this.loadingType = Enum.LoadingType.LoadingMore;
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
		
		_onRefresh(fromScrollView=false) {
			if (fromScrollView){
				if (!(this.finalRefresherEnabled && !this.useCustomRefresher)){
					return;
				}
			}
			this.$emit('onRefresh');
			this.$emit('Refresh');
			if (this.loading || this.isRefresherInComplete || this.nShowRefresherReveal) {
				return;
			}
			this.isUserPullDown = true;
			this.isUserReload = false;
			this._startLoading(true);
			this.refresherTriggered = true;
			if(this.reloadWhenRefresh){
				if (this.useChatRecordMode) {
					this._onLoadingMore('click')
				} else {
					this._reload();
				}
			}
			this.loadingType = Enum.LoadingType.Refresher;
		},
		//自定义下拉刷新被复位
		_onRestore() {
			this.refresherTriggered = 'restore';
			this.$emit('onRestore');
			this.$emit('Restore');
		},
		// #ifndef APP-VUE || MP-WEIXIN || MP-QQ || H5
		//拖拽开始
		_refresherTouchstart(e) {
			if (this._getRefresherTouchDisabled()) {
				return;
			}
			const touch = zUtils.getCommonTouch(e);
			this._handleRefresherTouchstart(touch);
		},
		// #endif
		//进一步处理拖拽开始结果
		_handleRefresherTouchstart(touch) {
			if (!this.loading && this.isTouchEnded) {
				this.isTouchmoving = false;
			}
			this.isTouchEnded = false;
			if (this.isIos13) {
				this.refresherTransition = '';
			} else {
				this.refresherTransition = 'transform .1s linear';
			}
			this.refresherTouchstartY = touch.touchY;
			this.$emit('refresherTouchstart', this.refresherTouchstartY);
			this.lastRefresherTouchmove = touch;
			this._cleanRefresherCompleteTimeout();
		},
		// #ifndef APP-VUE || MP-WEIXIN || MP-QQ || H5
		//拖拽中
		_refresherTouchmove(e) {
			const currentTimeStamp = zUtils.getTime();
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
			if (this.refresherMaxAngle >= 0 && this.refresherMaxAngle <= 90 && this.lastRefresherTouchmove && this.lastRefresherTouchmove.touchY <= refresherTouchmoveY) {
				if (!moveDistance && !this.refresherAngleEnableChangeContinued && this.moveDistance < 1 && !this.refresherReachMaxAngle) {
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
				if(this.isIos){
					// #ifndef MP-LARK
					this._handleScrollViewDisableBounce({bounce: false});
					// #endif
				}
				this.disabledBounce = true;
			}
			this._emitTouchmove({pullingDistance:moveDistance,dy:this.moveDistance - this.oldMoveDistance});
		},
		// #endif
		//进一步处理拖拽中结果
		_handleRefresherTouchmove(moveDistance, touch) {
			this.refresherReachMaxAngle = true;
			this.isTouchmoving = true;
			//this.refresherTransition = '';
			this.isTouchEnded = false;
			if (moveDistance >= this.finalRefresherThreshold) {
				this.refresherStatus = Enum.Refresher.PullToRefresh;
			} else {
				this.refresherStatus = Enum.Refresher.Default;
			}
			// #ifndef APP-VUE || MP-WEIXIN || MP-QQ  || H5
			// this.scrollEnable = false;
			this.refresherTransform = `translateY(${moveDistance}px)`;
			this.lastRefresherTouchmove = touch;
			// #endif
			this.moveDistance = moveDistance;
		},
		// #ifndef APP-VUE || MP-WEIXIN || MP-QQ || H5
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
			this._handleScrollViewDisableBounce({bounce: true});
			this.disabledBounce = false;
		},
		// #endif
		//进一步处理拖拽结束结果
		_handleRefresherTouchend(moveDistance) {
			// #ifndef APP-PLUS || H5 || MP-WEIXIN
			if (!this.isTouchmoving) {
				return;
			}
			// #endif
			this.refresherReachMaxAngle = true;
			if (moveDistance < 0 && this.usePageScroll && this.loadingMoreEnabled && this.useCustomRefresher && this.pageScrollTop === -1) {
				if (this.showConsoleError) {
					zUtils.consoleErr('usePageScroll为true并且自定义下拉刷新时必须引入mixin或在page滚动时通过调用z-paging组件的updatePageScrollTop方法设置当前的scrollTop');
				}
			}
			this.isTouchEnded = true;
			if (moveDistance >= this.finalRefresherThreshold && this.refresherStatus === Enum.Refresher.PullToRefresh) {
				// #ifndef APP-VUE || MP-WEIXIN || MP-QQ  || H5
				this.refresherTransform = `translateY(${this.finalRefresherThreshold}px)`;
				// #endif
				this.moveDistance = this.finalRefresherThreshold;
				this.refresherStatus = Enum.Refresher.Loading;
				this._doRefresherLoad();
			} else {
				this._refresherEnd(true, false);
				setTimeout(() => {
					this.isTouchmoving = false;
				}, commonDelayTime);
			}
			this.scrollEnable = true;
			this.refresherTransition = 'transform .1s linear';
			this.$emit('refresherTouchend', moveDistance);
		},
		//处理scroll-view bounce是否生效
		_handleScrollViewDisableBounce(e) {
			if (!this.usePageScroll && !this.scrollToTopBounceEnabled) {
				if (this.isIos13) {
					this.refresherTransition = '';
				}
				if (!e.bounce) {
					if (this.scrollEnable) {
						this.scrollEnable = false;
					}
				} else {
					this.scrollEnable = true;
				}
			}
		},
		//wxs正在下拉状态改变处理
		_handleWxsPullingDownStatusChange(onPullingDown) {
			this.wxsOnPullingDown = onPullingDown;
			if (onPullingDown) {
				if (!this.useChatRecordMode) {
					this.renderPropScrollTop = 0;
				}
			}
		},
		//wxs正在下拉处理
		_handleWxsPullingDown(e){
			this._emitTouchmove({pullingDistance:e.moveDistance,dy:e.diffDis});
		},
		//下拉刷新结束
		_refresherEnd(shouldEndLoadingDelay = true, fromAddData = false, isUserPullDown = false) {
			let refresherCompleteDelay = 0;
			if(fromAddData && (isUserPullDown || this.showRefresherWhenReload)){
				refresherCompleteDelay = this.refresherCompleteDelay;
				if(this.refresherCompleteDuration > 700){
					refresherCompleteDelay = 1;
				}
			}
			const refresherStatus = refresherCompleteDelay > 0 ? Enum.Refresher.Complete : Enum.Refresher.Default;
			// #ifndef APP-NVUE
			if (this.finalShowRefresherWhenReload) {
				const stackCount = this.refresherRevealStackCount;
				this.refresherRevealStackCount--;
				if (stackCount > 1) {
					return;
				}
				this.refresherStatus = refresherStatus;
			} else {
				setTimeout(() => {
					this.refresherStatus = refresherStatus;
				}, commonDelayTime);
			}
			if (refresherCompleteDelay > 0) {
				this.isRefresherInComplete = true;
			}
			// #endif
			// #ifdef APP-NVUE
			if (this.finalShowRefresherWhenReload) {
				const stackCount = this.refresherRevealStackCount;
				this.refresherRevealStackCount--;
				if (stackCount > 1) {
					return;
				}
				this.refresherStatus = refresherStatus;
			} else {
				setTimeout(() => {
					this.refresherStatus = refresherStatus;
				}, commonDelayTime);
			}
			// #endif
			if (shouldEndLoadingDelay) {
				setTimeout(() => {
					this.loading = false;
				}, commonDelayTime);
			} else {
				this.loading = false;
			}
			this._cleanRefresherCompleteTimeout();
			this.refresherCompleteTimeout = setTimeout(() => {
				let animateDuration = 1;
				if (fromAddData) {
					const animateType = this.refresherEndBounceEnabled ? 'cubic-bezier(0.19,1.64,0.42,0.72)' : 'linear';
					animateDuration = this.refresherEndBounceEnabled ? this.refresherCompleteDuration / 1000 : this.refresherCompleteDuration / 3000;
					this.refresherTransition = `transform ${animateDuration}s ${animateType}`;
				}
				// #ifndef APP-VUE || MP-WEIXIN || MP-QQ  || H5
				this.refresherTransform = 'translateY(0px)';
				// #endif
				// #ifdef APP-VUE || MP-WEIXIN || MP-QQ || H5
				this.wxsPropType = 'end' + zUtils.getTime();
				// #endif
				// #ifdef APP-NVUE
				this._nRefresherEnd();
				// #endif
				this.moveDistance = 0;
				// #ifndef APP-NVUE
				if (refresherStatus === Enum.Refresher.Complete) {
					if (this.refresherCompleteSubTimeout) {
						clearTimeout(this.refresherCompleteSubTimeout);
						this.refresherCompleteSubTimeout = null;
					}
					this.refresherCompleteSubTimeout = setTimeout(() => {
						this.$nextTick(() => {
							this.refresherStatus = Enum.Refresher.Default;
							this.isRefresherInComplete = false;
						})
					}, animateDuration * 800);
				}
				// #endif
			}, refresherCompleteDelay);
			this.$emit('onRestore');
			this.$emit('Restore');
		},
		//模拟用户手动触发下拉刷新
		_doRefresherRefreshAnimate() {
			this._cleanRefresherCompleteTimeout();
			// #ifndef APP-NVUE
			const doRefreshAnimateAfter = !this.doRefreshAnimateAfter && (this.finalShowRefresherWhenReload) && this
				.customRefresherHeight === -1 && this.refresherThreshold === '80rpx';
			if (doRefreshAnimateAfter) {
				this.doRefreshAnimateAfter = true;
				return;
			}
			// #endif
			this.refresherRevealStackCount++;
			this.refresherTransform = `translateY(${this.finalRefresherThreshold}px)`;
			// #ifdef APP-VUE || MP-WEIXIN || MP-QQ || H5
			this.wxsPropType = 'begin' + zUtils.getTime();
			// #endif
			this.moveDistance = this.finalRefresherThreshold;
			this.refresherStatus = Enum.Refresher.Loading;
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
				moveDistance = this.finalRefresherThreshold + (moveDistance - this.finalRefresherThreshold) * (1 - this.finalRefresherOutRate);
			}
			return moveDistance;
		},
		//(预处理)判断当没有更多数据且分页内容未超出z-paging时是否显示没有更多数据的view
		_preCheckShowLoadingMoreWhenNoMoreAndInsideOfPaging(newVal, scrollViewNode, pagingContainerNode) {
			if (this.loadingStatus === Enum.More.NoMore && this.hideLoadingMoreWhenNoMoreByLimit > 0 && newVal.length) {
				this.showLoadingMore = newVal.length > this.hideLoadingMoreWhenNoMoreByLimit;
			} else if ((this.loadingStatus === Enum.More.NoMore && this.hideLoadingMoreWhenNoMoreAndInsideOfPaging && newVal.length) || (this.insideMore && this.insideOfPaging !== false && newVal.length)) {
				this.$nextTick(() => {
					this._checkShowLoadingMoreWhenNoMoreAndInsideOfPaging(newVal, scrollViewNode, pagingContainerNode);
				})
				if (this.insideMore && this.insideOfPaging !== false && newVal.length) {
					this.showLoadingMore = newVal.length;
				}
			} else {
				this.showLoadingMore = newVal.length;
			}
		},
		//判断当没有更多数据且分页内容未超出z-paging时是否显示没有更多数据的view
		async _checkShowLoadingMoreWhenNoMoreAndInsideOfPaging(totalData, oldScrollViewNode, oldPagingContainerNode) {
			try {
				const scrollViewNode = oldScrollViewNode || await this._getNodeClientRect('.zp-scroll-view');
				if (this.usePageScroll) {
					if (scrollViewNode) {
						const scrollViewTotalH = scrollViewNode[0].top + scrollViewNode[0].height;
						this.insideOfPaging = scrollViewTotalH < this.windowHeight;
						if (this.hideLoadingMoreWhenNoMoreAndInsideOfPaging) {
							this.showLoadingMore = !this.insideOfPaging;
						}
						this._updateInsideOfPaging();
					}
				} else {
					let pagingContainerH = 0;
					let scrollViewH = 0;
					const pagingContainerNode = oldPagingContainerNode || await this._getNodeClientRect('.zp-paging-container-content');
					if (pagingContainerNode) {
						pagingContainerH = pagingContainerNode[0].height;
					}
					if (scrollViewNode) {
						scrollViewH = scrollViewNode[0].height;
					}
					this.insideOfPaging = pagingContainerH < scrollViewH;
					if (this.hideLoadingMoreWhenNoMoreAndInsideOfPaging) {
						this.showLoadingMore = !this.insideOfPaging;
					}
					this._updateInsideOfPaging();
				}
			} catch (e) {
				this.insideOfPaging = !totalData.length;
				if (this.hideLoadingMoreWhenNoMoreAndInsideOfPaging) {
					this.showLoadingMore = !this.insideOfPaging;
				}
				this._updateInsideOfPaging();
			}
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
				if (!scrollViewNode || !pagingContainerNode) {
					return;
				}
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
					let finalScrollBottomNode = await this._getNodeClientRect('.zp-page-scroll-bottom');
					if (finalScrollViewNode) {
						const scrollViewTop = finalScrollViewNode[0].top;
						let scrollViewHeight = this.windowHeight - scrollViewTop;
						if(finalScrollBottomNode){
							scrollViewHeight -= finalScrollBottomNode[0].height;
						}
						let additionHeight = zUtils.convertTextToPx(this.autoHeightAddition);
						this.$set(this.scrollViewStyle, heightKey, scrollViewHeight + additionHeight - (this.insideMore ? 1 : 0) + 'px');
						this.$set(this.scrollViewInStyle, heightKey, scrollViewHeight + additionHeight - (this.insideMore ? 1 : 0) + 'px');
					}
				} else {
					this.$delete(this.scrollViewStyle, heightKey);
					this.$delete(this.scrollViewInStyle, heightKey);
				}
			} catch (e) {

			}
		},
		//通过获取css设置的底部安全区域占位view高度设置bottom距离
		_getCssSafeAreaInsetBottom(){
			this._getNodeClientRect('.zp-safe-area-inset-bottom').then((res) => {
				if (res) {
					this.cssSafeAreaInsetBottom = res[0].height;
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
			let res = null;
			if (inThis) {
				res = uni.createSelectorQuery().in(this);
			} else {
				res = uni.createSelectorQuery();
			}
			//#ifdef MP-ALIPAY
			res = uni.createSelectorQuery();
			//#endif
			if (scrollOffset) {
				res.select(select).scrollOffset();
			} else {
				res.select(select).boundingClientRect();
			}
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
			return this.loading || this.isRefresherInComplete || this.useChatRecordMode || !this.refresherEnabled || !this.useCustomRefresher ||(this.usePageScroll && this.useCustomRefresher && this.pageScrollTop > 10) || (!(this.usePageScroll && this.useCustomRefresher) && checkOldScrollTop);
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
				this._localPagingQueryResult(callback, totalPagingList.splice(pageNoIndex, pageSize), localPagingLoadingTime);
			} else if (pageNoIndex < totalPagingList.length) {
				this._localPagingQueryResult(callback, totalPagingList.splice(pageNoIndex, totalPagingList.length - pageNoIndex), localPagingLoadingTime);
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
						this.lastBackToTopShowTime = new Date().getTime();
						setTimeout(() => {
							this.backToTopClass = 'zp-back-to-top zp-back-to-top-show';
						}, 300)
					}
				} else {
					if (this.showBackToTopClass) {
						const currentTime = new Date().getTime();
						let dalayTime = 300;
						if(currentTime - this.lastBackToTopShowTime < 500){
							dalayTime = 0;
						}
						this.backToTopClass = 'zp-back-to-top zp-back-to-top-hide';
						setTimeout(() => {
							this.showBackToTopClass = false;
						}, dalayTime)
					}
				}
			}
		},
		_updatePageScrollTopOrBottomHeight(type) {
			// #ifndef APP-NVUE
			if (!this.usePageScroll) {
				return;
			}
			// #endif
			this._doCheckScrollViewShouldFullHeight(this.realTotalData);
			const node = `.zp-page-scroll-${type}`;
			const marginText = `margin${type.slice(0,1).toUpperCase() + type.slice(1)}`;
			let safeAreaInsetBottomAdd = this.safeAreaInsetBottom;
			// #ifdef APP-NVUE
			if (!this.usePageScroll) {
				safeAreaInsetBottomAdd = false;
			}
			// #endif
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
								if (safeAreaInsetBottomAdd) {
									pageScrollNodeHeight += this.safeAreaBottom;
								}
							}
							this.$set(this.scrollViewStyle, marginText,
								`${pageScrollNodeHeight}px`);
						} else if (safeAreaInsetBottomAdd) {
							this.$set(this.scrollViewStyle, marginText, `${this.safeAreaBottom}px`);
						}
					});
				}, delayTime)
			})
		},
		_updateCustomRefresherHeight() {
			this._getNodeClientRect('.zp-custom-refresher-slot-view').then((res) => {
				if (res) {
					this.customRefresherHeight = res[0].height;
					if (this.customRefresherHeight > 0) {
						this.showCustomRefresher = true;
					}
				} else {
					this.customRefresherHeight = 0;
				}
				if (this.doRefreshAnimateAfter) {
					this.doRefreshAnimateAfter = false;
					this._doRefresherRefreshAnimate();
				}
			});
		},
		//点击了空数据view重新加载按钮
		_emptyViewReload() {
			let callbacked = false;
			this.$emit('emptyViewReload', (reload) => {
				if (reload === undefined || reload === true) {
					this.fromEmptyViewReload = true;
					this.reload();
				}
				callbacked = true;
			});
			this.$nextTick(() => {
				if (!callbacked) {
					this.fromEmptyViewReload = true;
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
		_callMyParentQuery(customPageNo = 0, customPageSize = 0) {
			if (this.autowireQueryName) {
				if (this.myParentQuery === -1) {
					const myParent = zUtils.getParent(this.$parent);
					if (myParent && myParent[this.autowireQueryName]) {
						this.myParentQuery = myParent[this.autowireQueryName];
					}
				}
				if (this.myParentQuery !== -1) {
					if (customPageSize > 0) {
						this.myParentQuery(customPageNo, customPageSize);
					} else {
						this.myParentQuery(this.pageNo, this.defaultPageSize);
					}
				}
			}
		},
		//scrollTop改变时触发
		_scrollTopChange(newVal,oldVal,isPageScrollTop){
			this.$emit('scrollTopChange', newVal);
			this.$emit('update:scrollTop', newVal);
			this._checkShouldShowBackToTop(newVal, oldVal);
			let scrollTop = 0;
			if (this.isIos) {
				scrollTop = newVal > 5 ? 6 : 0;
			} else {
				scrollTop = newVal;
			}
			if(isPageScrollTop){
				this.wxsPageScrollTop = scrollTop;
			}else{
				this.wxsScrollTop = scrollTop;
			}
		},
		//发射query事件
		_emitQuery(pageNo,pageSize){
			this.requestTimeStamp = zUtils.getTime();
			this.$emit('query',pageNo,pageSize);
		},
		//发射pullingDown事件
		_emitTouchmove(e){
			// #ifndef APP-NVUE
			e.viewHeight = this.finalRefresherThreshold;
			// #endif
			e.rate = e.pullingDistance / e.viewHeight;
			if(this.hasTouchmove){
				this.$emit('refresherTouchmove',e);
			}
		},
		//清除refresherCompleteTimeout
		_cleanRefresherCompleteTimeout() {
			if (this.refresherCompleteTimeout) {
				clearTimeout(this.refresherCompleteTimeout);
				this.refresherCompleteTimeout = null;
			}
		},
		//检查complete data的类型
		_checkDataType(data, success, isLocal) {
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
			return {data,success};
		},
		// ------------nvue独有的方法----------------
		// #ifdef APP-NVUE
		//列表滚动时触发
		_nOnScroll(e) {
			this.$emit('scroll', e);
			const contentOffsetY = e.contentOffset.y;
			this.nListIsDragging = e.isDragging;
			this._checkShouldShowBackToTop(-e.contentOffset.y, -e.contentOffset.y - 1);
		},
		//下拉刷新刷新中
		_nOnRrefresh() {
			if (this.nShowRefresherReveal) {
				return;
			}
			this.nRefresherLoading = true;
			this.refresherStatus = Enum.Refresher.Loading;
			this._doRefresherLoad();
		},
		//下拉刷新下拉中
		_nOnPullingdown(e) {
			if (this.refresherStatus === Enum.Refresher.Loading || (this.isIos && !this.nListIsDragging)) {
				return;
			}
			this._emitTouchmove(e);
			const viewHeight = e.viewHeight;
			const pullingDistance = e.pullingDistance;
			this.refresherStatus = pullingDistance >= viewHeight ? Enum.Refresher.PullToRefresh : Enum.Refresher.Default;
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
			this._cleanRefresherCompleteTimeout();
			if (!this.finalShowRefresherWhenReload) {
				setTimeout(() => {
					this.refresherStatus = Enum.Refresher.Default;
				}, commonDelayTime);
				return;
			}
			const stackCount = this.refresherRevealStackCount;
			if (height === 0 && checkStack) {
				this.refresherRevealStackCount--;
				if (stackCount > 1) {
					return;
				}
				this.refresherStatus = Enum.Refresher.Default;
			}
			if (stackCount > 1) {
				this.refresherStatus = Enum.Refresher.Loading;
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
		_nGetWaterfallConfig(key, defaultValue) {
			const value = this.nvueWaterfallConfig[key];
			return value || defaultValue;
		}
		// #endif
	},
};
