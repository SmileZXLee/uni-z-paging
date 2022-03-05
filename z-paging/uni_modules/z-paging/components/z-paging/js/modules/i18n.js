// [z-paging]i18n模块
import u from '.././z-paging-utils'
import c from '.././z-paging-constant'
import zI18n from '.././z-paging-i18n'

const systemInfo = uni.getSystemInfoSync();
const ZPI18n = {
	props: {
		//i18n国际化设置语言，支持简体中文(zh-cn)、繁体中文(zh-hant-cn)和英文(en)
		language: {
			type: String,
			default: u.gc('language', '')
		},
		//i18n国际化默认是否跟随系统语言，默认为是
		followSystemLanguage: {
			type: Boolean,
			default: u.gc('followSystemLanguage', true)
		},
	},
	data() {
		return {
			tempLanguageUpdateKey: 0,
		}
	},
	computed: {
		tempLanguage() {
			let systemLanguage = false;
			const temp = this.tempLanguageUpdateKey;
			if (this.followSystemLanguage) {
				systemLanguage = systemInfo.language;
			}
			return uni.getStorageSync(c.i18nUpdateKey) || systemLanguage || 'zh-cn';
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
	},
	methods: {
		//设置i18n国际化语言
		setI18n(language) {
			zI18n.setLanguage(language);
		},
		//获取当前z-paging的语言
		getLanguage() {
			return this.finalLanguage;
		},
		//获取国际化转换后的文本
		_getI18nText(key, value) {
			const dataType = Object.prototype.toString.call(value);
			if (dataType === '[object Object]') {
				const nextValue = value[this.finalLanguage];
				if (nextValue) return nextValue;
			} else if (dataType === '[object String]') {
				return value;
			}
			return zI18n.t[key][this.finalLanguage];
		},
	}
}

export default ZPI18n;
