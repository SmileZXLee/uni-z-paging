// z-paging
// github地址:https://github.com/SmileZXLee/uni-z-paging
// dcloud地址:https://ext.dcloud.net.cn/plugin?id=3935
// 反馈QQ群：790460711
// z-paging工具类

import zI18n from './z-paging-i18n'

const storageKey = 'Z-PAGING-REFRESHER-TIME-STORAGE-KEY'

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

function getRefesrherTime() {
	try {
		const datas = uni.getStorageSync(storageKey);
		return datas;
	} catch {
		return null;
	}
}

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

function getRefesrherFormatTimeByKey(key) {
	const time = getRefesrherTimeByKey(key);
	let timeText = zI18n['refresherUpdateTimeNoneText'][zI18n.getLanguage()];
	if (time) {
		timeText = timeFormat(time);
	}
	return `${zI18n['refresherUpdateTimeText'][zI18n.getLanguage()]}${timeText}`;
}

function timeFormat(time) {
	const date = new Date(time);
	const currentDate = new Date();
	const dateDay = new Date(time).setHours(0, 0, 0, 0);
	const currentDateDay = new Date().setHours(0, 0, 0, 0);
	const disTime = dateDay - currentDateDay;
	let dayStr = '';
	const timeStr = dateTimeFormat(date);
	if (disTime === 0) {
		dayStr = zI18n['refresherUpdateTimeTodayText'][zI18n.getLanguage()];
	} else if (disTime === -86400000) {
		dayStr = zI18n['refresherUpdateTimeYesterdayText'][zI18n.getLanguage()];
	} else {
		dayStr = dateDayFormat(date, date.getFullYear() !== currentDate.getFullYear());
	}
	return `${dayStr} ${timeStr}`;
}

function dateDayFormat(date, showYear = true) {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	if (showYear) {
		return `${year}-${fullZeroToTwo(month)}-${fullZeroToTwo(day)}`;
	} else {
		return `${fullZeroToTwo(month)}-${fullZeroToTwo(day)}`;
	}
}

function dateTimeFormat(date) {
	const hour = date.getHours();
	const minute = date.getMinutes();
	return `${fullZeroToTwo(hour)}:${fullZeroToTwo(minute)}`;
}

function fullZeroToTwo(str) {
	str = str.toString();
	if (str.length === 1) {
		return '0' + str;
	}
	return str;
}

module.exports = {
	setRefesrherTime,
	getRefesrherFormatTimeByKey
};
