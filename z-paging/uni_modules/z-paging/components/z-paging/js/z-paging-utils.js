// z-paging
// github地址:https://github.com/SmileZXLee/uni-z-paging
// dcloud地址:https://ext.dcloud.net.cn/plugin?id=3935
// 反馈QQ群：790460711
// z-paging工具类

import zI18n from './z-paging-i18n'

const storageKey = 'Z-PAGING-REFRESHER-TIME-STORAGE-KEY'

//判断两个数组是否相等
function arrayIsEqual(arr1, arr2) {
	if (arr1 === arr2) {
		return true;
	}
	if (arr1.length !== arr2.length) {
		return false;
	}
	for (let i = 0; i < arr1.length; i++) {
		if (arr1[i] !== arr2[i]) {
			return false;
		}
	}
	return true;
}

//获取最终的touch位置
function getCommonTouch(e) {
	let touch = null;
	if (e.touches && e.touches.length) {
		touch = e.touches[0];
	} else if (e.changedTouches && e.changedTouches.length) {
		touch = e.changedTouches[0];
	} else if (e.datail && e.datail !== {}) {
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
	if (!parent) {
		return null;
	}
	if (parent.$refs.paging) {
		return parent;
	}
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
	} catch {}
}

//获取下拉刷新时间
function getRefesrherTime() {
	try {
		const datas = uni.getStorageSync(storageKey);
		return datas;
	} catch {
		return null;
	}
}

//通过下拉刷新标识key获取下拉刷新时间
function getRefesrherTimeByKey(key) {
	const datas = getRefesrherTime();
	if (datas) {
		const data = datas[key];
		if (data) {
			return data;
		}
	}
	return null;
}

//通过下拉刷新标识key获取下拉刷新时间(格式化之后)
function getRefesrherFormatTimeByKey(key) {
	const time = getRefesrherTimeByKey(key);
	let timeText = zI18n['refresherUpdateTimeNoneText'][zI18n.getLanguage()];
	if (time) {
		timeText = _timeFormat(time);
	}
	return `${zI18n['refresherUpdateTimeText'][zI18n.getLanguage()]}${timeText}`;
}

function _timeFormat(time) {
	const date = new Date(time);
	const currentDate = new Date();
	const dateDay = new Date(time).setHours(0, 0, 0, 0);
	const currentDateDay = new Date().setHours(0, 0, 0, 0);
	const disTime = dateDay - currentDateDay;
	let dayStr = '';
	const timeStr = _dateTimeFormat(date);
	if (disTime === 0) {
		dayStr = zI18n['refresherUpdateTimeTodayText'][zI18n.getLanguage()];
	} else if (disTime === -86400000) {
		dayStr = zI18n['refresherUpdateTimeYesterdayText'][zI18n.getLanguage()];
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
	if (str.length === 1) {
		return '0' + str;
	}
	return str;
}

module.exports = {
	setRefesrherTime,
	getRefesrherFormatTimeByKey,
	arrayIsEqual,
	getCommonTouch,
	getTouchFromZPaging,
	getParent,
	consoleErr,
	consoleWarn
};
