// [z-paging]工具类

import zI18n from './z-paging-i18n'
import zConfig from './z-paging-config'
import zLocalConfig from '../config/index'

const storageKey = 'Z-PAGING-REFRESHER-TIME-STORAGE-KEY'
let config = null;

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
} catch (e) {}

//获取默认配置信息
function gc(key, defaultValue) {
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
	let value = config[_toKebab(key)];
	if (value === undefined) {
		value = config[key];
	} else {
		return value;
	}
	return defaultValue;
}

//判断两个数组是否相等
function arrayIsEqual(arr1, arr2) {
	if (arr1 === arr2) return true;
	if (arr1.length !== arr2.length) return false;
	for (let i = 0; i < arr1.length; i++) {
		if (arr1[i] !== arr2[i]) return false;
	}
	return true;
}

//获取最终的touch位置
function getTouch(e) {
	let touch = null;
	if (e.touches && e.touches.length) {
		touch = e.touches[0];
	} else if (e.changedTouches && e.changedTouches.length) {
		touch = e.changedTouches[0];
	} else if (e.datail && e.datail != {}) {
		touch = e.datail;
	} else {
		return {
			touchX: 0,
			touchY: 0
		}
	}
	return {
		touchX: touch.clientX,
		touchY: touch.clientY
	};
}

//判断当前手势是否在z-paging内触发
function getTouchFromZPaging(target) {
	if (target && target.tagName && target.tagName !== 'BODY' && target.tagName !== 'UNI-PAGE-BODY') {
		var classList = target.classList;
		if (classList && classList.contains('zp-paging-touch-view')) {
			return true;
		} else {
			return getTouchFromZPaging(target.parentNode);
		}
	} else {
		return false;
	}
}

//获取z-paging所在的parent
function getParent(parent) {
	if (!parent) return null;
	if (parent.$refs.paging) return parent;
	return getParent(parent.$parent);
}

//打印错误信息
function consoleErr(err) {
	console.error(`[z-paging]${err}`);
}

//打印警告信息
function consoleWarn(warn) {
	console.warn(`[z-paging]${warn}`);
}

//设置下拉刷新时间
function setRefesrherTime(time, key) {
	try {
		let datas = getRefesrherTime();
		if (!datas) {
			datas = {};
		}
		datas[key] = time;
		uni.setStorageSync(storageKey, datas);
	} catch (e) {}
}

//获取下拉刷新时间
function getRefesrherTime() {
	try {
		const datas = uni.getStorageSync(storageKey);
		return datas;
	} catch (e) {
		return null;
	}
}

//通过下拉刷新标识key获取下拉刷新时间
function getRefesrherTimeByKey(key) {
	const datas = getRefesrherTime();
	if (datas) {
		const data = datas[key];
		if (data) return data;
	}
	return null;
}

//通过下拉刷新标识key获取下拉刷新时间(格式化之后)
function getRefesrherFormatTimeByKey(key) {
	const time = getRefesrherTimeByKey(key);
	let timeText = zI18n.t['refresherUpdateTimeNoneText'][zI18n.getLanguage()];
	if (time) {
		timeText = _timeFormat(time);
	}
	return `${zI18n.t['refresherUpdateTimeText'][zI18n.getLanguage()]}${timeText}`;
}

//将文本的px或者rpx转为px的值
function convertTextToPx(text) {
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
		if (isRpx) return Number(uni.upx2px(text));
		return Number(text);
	}
	return 0;
}

//获取当前时间
function getTime() {
	return (new Date()).getTime();
}

//------------------ 私有方法 ------------------------
function _timeFormat(time) {
	const date = new Date(time);
	const currentDate = new Date();
	const dateDay = new Date(time).setHours(0, 0, 0, 0);
	const currentDateDay = new Date().setHours(0, 0, 0, 0);
	const disTime = dateDay - currentDateDay;
	let dayStr = '';
	const timeStr = _dateTimeFormat(date);
	if (disTime === 0) {
		dayStr = zI18n.t['refresherUpdateTimeTodayText'][zI18n.getLanguage()];
	} else if (disTime === -86400000) {
		dayStr = zI18n.t['refresherUpdateTimeYesterdayText'][zI18n.getLanguage()];
	} else {
		dayStr = _dateDayFormat(date, date.getFullYear() !== currentDate.getFullYear());
	}
	return `${dayStr} ${timeStr}`;
}

function _dateDayFormat(date, showYear = true) {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	if (showYear) {
		return `${year}-${_fullZeroToTwo(month)}-${_fullZeroToTwo(day)}`;
	} else {
		return `${_fullZeroToTwo(month)}-${_fullZeroToTwo(day)}`;
	}
}

function _dateTimeFormat(date) {
	const hour = date.getHours();
	const minute = date.getMinutes();
	return `${_fullZeroToTwo(hour)}:${_fullZeroToTwo(minute)}`;
}

function _fullZeroToTwo(str) {
	str = str.toString();
	if (str.length === 1) return '0' + str;
	return str;
}

//驼峰转短横线
function _toKebab(value) {
	return value.replace(/([A-Z])/g, "-$1").toLowerCase();
}

export default {
	gc,
	setRefesrherTime,
	getRefesrherFormatTimeByKey,
	arrayIsEqual,
	getTouch,
	getTouchFromZPaging,
	getParent,
	convertTextToPx,
	getTime,
	consoleErr,
	consoleWarn
};
