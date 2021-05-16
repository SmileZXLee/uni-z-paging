// z-paging
// github地址:https://github.com/SmileZXLee/uni-z-paging
// dcloud地址:https://ext.dcloud.net.cn/plugin?id=3935
// 反馈QQ群：790460711
// z-paging配置文件

let config = null;
let getedStorage = false;
const storageKey = 'Z-PAGING-CONFIG-STORAGE-KEY'

function setConfig(value) {
	try {
		uni.setStorageSync(storageKey, value);
	} catch {}
}

function getConfig() {
	try {
		if (getedStorage) {
			return config;
		}
		config = uni.getStorageSync(storageKey);
		getedStorage = true;
	} catch {
		return null;
	}
}

module.exports = {
	setConfig,
	getConfig
};
