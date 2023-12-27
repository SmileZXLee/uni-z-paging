// [z-paging]工具类

import zLocalConfig from '../config/index'
import c from './z-paging-constant'

const storageKey = 'Z-PAGING-REFRESHER-TIME-STORAGE-KEY';
let config = null;
let configLoaded = false;
const timeoutMap = {};

//获取默认配置信息
function gc(key, defaultValue) {
	return () => {
		_handleDefaultConfig();
		if (!config) return defaultValue;
		const value = config[key];
		return value === undefined ? defaultValue : value;
	}
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
		return {touchX: 0, touchY: 0}
	}
	return {
		touchX: touch.clientX,
		touchY: touch.clientY
	};
}

//判断当前手势是否在z-paging内触发
function getTouchFromZPaging(target) {
	if (target && target.tagName && target.tagName !== 'BODY' && target.tagName !== 'UNI-PAGE-BODY') {
		const classList = target.classList;
		if (classList && classList.contains('z-paging-content')) {
			return {
				isFromZp: true,
				isPageScroll: classList.contains('z-paging-content-page'),
				isReachedTop: classList.contains('z-paging-reached-top')
			};
		} else {
			return getTouchFromZPaging(target.parentNode);
		}
	} else {
		return { isFromZp: false };
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

//延时操作，如果key存在，调用时根据key停止之前的延时操作
function delay(callback, ms = c.delayTime, key) {
	const timeout = setTimeout(callback, ms);;
	if (!!key) {
		timeoutMap[key] && clearTimeout(timeoutMap[key]);
		timeoutMap[key] = timeout;
	}
	return timeout;
}

//设置下拉刷新时间
function setRefesrherTime(time, key) {
	const datas = getRefesrherTime() || {};
	datas[key] = time;
	uni.setStorageSync(storageKey, datas);
}

//获取下拉刷新时间
function getRefesrherTime() {
	return uni.getStorageSync(storageKey);
}

//通过下拉刷新标识key获取下拉刷新时间
function getRefesrherTimeByKey(key) {
	const datas = getRefesrherTime();
	return datas && datas[key] ? datas[key] : null;
}

//通过下拉刷新标识key获取下拉刷新时间(格式化之后)
function getRefesrherFormatTimeByKey(key, textMap) {
	const time = getRefesrherTimeByKey(key);
	const timeText = time ? _timeFormat(time, textMap) : textMap.none;
	return `${textMap.title}${timeText}`;
}

//将文本的px或者rpx转为px的值
function convertToPx(text) {
	const dataType = Object.prototype.toString.call(text);
	if (dataType === '[object Number]') return text;
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

//获取z-paging实例id
function getInstanceId() {
    const s = [];
    const hexDigits = "0123456789abcdef";
    for (let i = 0; i < 10; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    return s.join('') + getTime();
}

// 等待一段时间
function wait(ms) {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	});
}

// 添加单位
function addUnit(value, unit) {
	if (Object.prototype.toString.call(value) === '[object String]') {
		let tempValue = value;
		tempValue = tempValue.replace('rpx', '').replace('upx', '').replace('px', '');
		if (value.indexOf('rpx') === -1 && value.indexOf('upx') === -1 && text.indexOf('px') !== -1) {
			tempValue = parseFloat(tempValue) * 2;
		}
		value = tempValue;
	}
	return unit === 'rpx' ? value + 'rpx' : (value / 2) + 'px';
}

//------------------ 私有方法 ------------------------
//处理全局配置
function _handleDefaultConfig() {
	if (configLoaded) return;
	if (zLocalConfig && Object.keys(zLocalConfig).length) {
		config = zLocalConfig;
	}
	if (!config && uni.$zp) {
		config = uni.$zp.config;
	}
	config = config ? Object.keys(config).reduce((result, key) => {
	    result[_toCamelCase(key)] = config[key];
	    return result;
	}, {}) : null;
	configLoaded = true;
}

//时间格式化
function _timeFormat(time, textMap) {
	const date = new Date(time);
	const currentDate = new Date();
	const dateDay = new Date(time).setHours(0, 0, 0, 0);
	const currentDateDay = new Date().setHours(0, 0, 0, 0);
	const disTime = dateDay - currentDateDay;
	let dayStr = '';
	const timeStr = _dateTimeFormat(date);
	if (disTime === 0) {
		dayStr = textMap.today;
	} else if (disTime === -86400000) {
		dayStr = textMap.yesterday;
	} else {
		dayStr = _dateDayFormat(date, date.getFullYear() !== currentDate.getFullYear());
	}
	return `${dayStr} ${timeStr}`;
}

//date格式化为年月日
function _dateDayFormat(date, showYear = true) {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	return showYear ? `${year}-${_fullZeroToTwo(month)}-${_fullZeroToTwo(day)}` : `${_fullZeroToTwo(month)}-${_fullZeroToTwo(day)}`;
}

//data格式化为时分
function _dateTimeFormat(date) {
	const hour = date.getHours();
	const minute = date.getMinutes();
	return `${_fullZeroToTwo(hour)}:${_fullZeroToTwo(minute)}`;
}

//不满2位在前面填充0
function _fullZeroToTwo(str) {
	str = str.toString();
	return str.length === 1 ? '0' + str : str;
}

//驼峰转短横线
function _toKebab(value) {
	return value.replace(/([A-Z])/g, "-$1").toLowerCase();
}

//短横线转驼峰
function _toCamelCase(value) {
    return value.replace(/-([a-z])/g, (_, group1) => group1.toUpperCase());
}


export default {
	gc,
	setRefesrherTime,
	getRefesrherFormatTimeByKey,
	getTouch,
	getTouchFromZPaging,
	getParent,
	convertToPx,
	getTime,
	getInstanceId,
	consoleErr,
	delay,
	wait,
	addUnit
};
