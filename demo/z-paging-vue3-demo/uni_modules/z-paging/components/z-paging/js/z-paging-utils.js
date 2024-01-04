// [z-paging]工具类

import zLocalConfig from '../config/index'
import c from './z-paging-constant'

const storageKey = 'Z-PAGING-REFRESHER-TIME-STORAGE-KEY';
let config = null;
let configLoaded = false;
const timeoutMap = {};

// 获取默认配置信息
function gc(key, defaultValue) {
	// 这里return一个函数以解决在vue3+appvue中，props默认配置读取在main.js之前执行导致uni.$zp全局配置无效的问题。相当于props的default中传入一个带有返回值的函数
	return () => {
		// 处理z-paging全局配置
		_handleDefaultConfig();
		// 如果全局配置不存在，则返回默认值
		if (!config) return defaultValue;
		const value = config[key];
		// 如果全局配置存在但对应的配置项不存在，则返回默认值；反之返回配置项
		return value === undefined ? defaultValue : value;
	}
}

// 获取最终的touch位置
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

// 判断当前手势是否在z-paging内触发
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

// 递归获取z-paging所在的parent，如果查找不到则返回null
function getParent(parent) {
	if (!parent) return null;
	if (parent.$refs.paging) return parent;
	return getParent(parent.$parent);
}

// 打印错误信息
function consoleErr(err) {
	console.error(`[z-paging]${err}`);
}

// 延时操作，如果key存在，调用时清除对应key之前的延时操作
function delay(callback, ms = c.delayTime, key) {
	const timeout = setTimeout(callback, ms);;
	if (!!key) {
		timeoutMap[key] && clearTimeout(timeoutMap[key]);
		timeoutMap[key] = timeout;
	}
	return timeout;
}

// 设置下拉刷新时间
function setRefesrherTime(time, key) {
	const datas = getRefesrherTime() || {};
	datas[key] = time;
	uni.setStorageSync(storageKey, datas);
}

// 获取下拉刷新时间
function getRefesrherTime() {
	return uni.getStorageSync(storageKey);
}

// 通过下拉刷新标识key获取下拉刷新时间
function getRefesrherTimeByKey(key) {
	const datas = getRefesrherTime();
	return datas && datas[key] ? datas[key] : null;
}

// 通过下拉刷新标识key获取下拉刷新时间(格式化之后)
function getRefesrherFormatTimeByKey(key, textMap) {
	const time = getRefesrherTimeByKey(key);
	const timeText = time ? _timeFormat(time, textMap) : textMap.none;
	return `${textMap.title}${timeText}`;
}

// 将文本的px或者rpx转为px的值
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

// 获取当前时间
function getTime() {
	return (new Date()).getTime();
}

// 获取z-paging实例id，随机生成10位数字+字母
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
		if (value.indexOf('rpx') === -1 && value.indexOf('upx') === -1 && value.indexOf('px') !== -1) {
			tempValue = parseFloat(tempValue) * 2;
		}
		value = tempValue;
	}
	return unit === 'rpx' ? value + 'rpx' : (value / 2) + 'px';
}

// ------------------ 私有方法 ------------------------
// 处理全局配置
function _handleDefaultConfig() {
	// 确保只加载一次全局配置
	if (configLoaded) return;
	// 优先从config.js中读取
	if (zLocalConfig && Object.keys(zLocalConfig).length) {
		config = zLocalConfig;
	}
	// 如果在config.js中读取不到，则尝试到uni.$zp读取
	if (!config && uni.$zp) {
		config = uni.$zp.config;
	}
	// 将config中的短横线写法全部转为驼峰写法，使得读取配置时可以直接通过key去匹配，而非读取每个配置时候再去转，减少不必要的性能开支
	config = config ? Object.keys(config).reduce((result, key) => {
	    result[_toCamelCase(key)] = config[key];
	    return result;
	}, {}) : null;
	configLoaded = true;
}

// 时间格式化
function _timeFormat(time, textMap) {
	const date = new Date(time);
	const currentDate = new Date();
	// 设置time对应的天，去除时分秒，使得可以直接比较日期
	const dateDay = new Date(time).setHours(0, 0, 0, 0);
	// 设置当前的天，去除时分秒，使得可以直接比较日期
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

// date格式化为年月日
function _dateDayFormat(date, showYear = true) {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	return showYear ? `${year}-${_fullZeroToTwo(month)}-${_fullZeroToTwo(day)}` : `${_fullZeroToTwo(month)}-${_fullZeroToTwo(day)}`;
}

// data格式化为时分
function _dateTimeFormat(date) {
	const hour = date.getHours();
	const minute = date.getMinutes();
	return `${_fullZeroToTwo(hour)}:${_fullZeroToTwo(minute)}`;
}

// 不满2位在前面填充0
function _fullZeroToTwo(str) {
	str = str.toString();
	return str.length === 1 ? '0' + str : str;
}

// 驼峰转短横线
function _toKebab(value) {
	return value.replace(/([A-Z])/g, "-$1").toLowerCase();
}

// 短横线转驼峰
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
