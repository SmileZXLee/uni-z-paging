// [z-paging]处理main.js中的配置信息工具

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
