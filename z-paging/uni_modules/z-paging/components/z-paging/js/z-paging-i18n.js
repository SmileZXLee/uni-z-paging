// z-paging
// github地址:https://github.com/SmileZXLee/uni-z-paging
// dcloud地址:https://ext.dcloud.net.cn/plugin?id=3935
// 反馈QQ群：790460711
// z-paging国际化(支持中文、中文繁体和英文)

const i18nUpdateKey = 'z-paging-i18n-update';

const refresherDefaultText = {
	'en': 'Pull down to refresh',
	'zh-cn': '继续下拉刷新',
	'zh-hant-cn': '繼續下拉重繪',
}
const refresherPullingText = {
	'en': 'Release to refresh',
	'zh-cn': '松开立即刷新',
	'zh-hant-cn': '鬆開立即重繪',
}
const refresherRefreshingText = {
	'en': 'Refreshing...',
	'zh-cn': '正在刷新...',
	'zh-hant-cn': '正在重繪...',
}

const loadingMoreDefaultText = {
	'en': 'Click to load more',
	'zh-cn': '点击加载更多',
	'zh-hant-cn': '點擊加載更多',
}
const loadingMoreLoadingText = {
	'en': 'Loading...',
	'zh-cn': '正在加载...',
	'zh-hant-cn': '正在加載...',
}
const loadingMoreNoMoreText = {
	'en': 'No more data',
	'zh-cn': '没有更多了',
	'zh-hant-cn': '沒有更多了',
}
const loadingMoreFailText = {
	'en': 'Load failed,click to reload',
	'zh-cn': '加载失败，点击重新加载',
	'zh-hant-cn': '加載失敗，點擊重新加載',
}

const emptyViewText = {
	'en': 'No data',
	'zh-cn': '没有数据哦~',
	'zh-hant-cn': '沒有數據哦~',
}

const emptyViewReloadText = {
	'en': 'Reload',
	'zh-cn': '重新加载',
	'zh-hant-cn': '重新加載',
}

const emptyViewErrorText = {
	'en': 'Sorry,load failed',
	'zh-cn': '很抱歉，加载失败',
	'zh-hant-cn': '很抱歉，加載失敗',
}

const refresherUpdateTimeText = {
	'en': 'Last update: ',
	'zh-cn': '最后更新：',
	'zh-hant-cn': '最後更新：',
}

const refresherUpdateTimeNoneText = {
	'en': 'None',
	'zh-cn': '无',
	'zh-hant-cn': '無',
}

const refresherUpdateTimeTodayText = {
	'en': 'Today',
	'zh-cn': '今天',
	'zh-hant-cn': '今天',
}

const refresherUpdateTimeYesterdayText = {
	'en': 'Yesterday',
	'zh-cn': '昨天',
	'zh-hant-cn': '昨天',
}

// 插件内部使用，请勿直接调用
function getPrivateLanguage(myLanguage, followSystemLanguage = true) {
	let systemLanguage = '';
	if (followSystemLanguage) {
		systemLanguage = uni.getSystemInfoSync().language;
	}
	let language = myLanguage || uni.getStorageSync(i18nUpdateKey) || systemLanguage;
	language = language.toLowerCase();
	var reg = new RegExp('_', '');
	language = language.replace(reg, '-');
	if (language.indexOf('zh') !== -1) {
		if (language === 'zh' || language === 'zh-cn' || language.indexOf('zh-hans') !== -1) {
			return 'zh-cn';
		}
		return 'zh-hant-cn';
	}
	if (language.indexOf('en') !== -1) {
		return 'en';
	}
	return 'zh-cn';
}

// 获取当前语言，格式为:zh-cn、zh-hant-cn、en。followSystemLanguage:获取的结果是否是在不跟随系统语言下获取到的
function getLanguage(followSystemLanguage = true) {
	return getPrivateLanguage(false, followSystemLanguage);
}

// 获取当前语言，格式为:简体中文、繁體中文、English。followSystemLanguage:获取的结果是否是在不跟随系统语言下获取到的
function getLanguageName(followSystemLanguage = true) {
	const language = getLanguage(followSystemLanguage);
	const languageNameMap = {
		'zh-cn': '简体中文',
		'zh-hant-cn': '繁體中文',
		'en': 'English'
	};
	return languageNameMap[language];
}

function setLanguage(myLanguage) {
	uni.setStorageSync(i18nUpdateKey, myLanguage);
	uni.$emit(i18nUpdateKey, myLanguage);
}

module.exports = {
	refresherDefaultText,
	refresherPullingText,
	refresherRefreshingText,
	loadingMoreDefaultText,
	loadingMoreLoadingText,
	loadingMoreNoMoreText,
	loadingMoreFailText,
	emptyViewText,
	emptyViewReloadText,
	emptyViewErrorText,
	getPrivateLanguage,
	getLanguage,
	getLanguageName,
	setLanguage,
	refresherUpdateTimeText,
	refresherUpdateTimeNoneText,
	refresherUpdateTimeTodayText,
	refresherUpdateTimeYesterdayText
}
