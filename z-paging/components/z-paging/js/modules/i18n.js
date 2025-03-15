// [z-paging]i18n模块
import { initVueI18n } from '@dcloudio/uni-i18n'
import messages from '../../i18n/index.js'
const { t } = initVueI18n(messages)

import u from '.././z-paging-utils'
import c from '.././z-paging-constant'
import interceptor from '../z-paging-interceptor'

export default {
	computed: {
		finalLanguage() {
			try {
				const local = uni.getLocale();
				const language = this.systemInfo.appLanguage;
				return local === 'auto' ? interceptor._handleLanguage2Local(language, this._language2Local(language)) : local;
			} catch (e) {
				// 如果获取系统本地语言异常，则默认返回中文，uni.getLocale在部分低版本HX或者cli中可能报找不到的问题
				return 'zh-Hans';
			}
		},
		// 最终的下拉刷新默认状态的文字
		finalRefresherDefaultText() {
			return this._getI18nText('zp.refresher.default', this.refresherDefaultText);
		},
		// 最终的下拉刷新下拉中的文字
		finalRefresherPullingText() {
			return this._getI18nText('zp.refresher.pulling', this.refresherPullingText);
		},
		// 最终的下拉刷新中文字
		finalRefresherRefreshingText() {
			return this._getI18nText('zp.refresher.refreshing', this.refresherRefreshingText);
		},
		// 最终的下拉刷新完成文字
		finalRefresherCompleteText() {
			return this._getI18nText('zp.refresher.complete', this.refresherCompleteText);
		},
		// 最终的下拉刷新上次更新时间文字
		finalRefresherUpdateTimeTextMap() {
			return {
				title: t('zp.refresherUpdateTime.title'),
				none: t('zp.refresherUpdateTime.none'),
				today: t('zp.refresherUpdateTime.today'),
				yesterday: t('zp.refresherUpdateTime.yesterday')
			};
		},
		// 最终的继续下拉进入二楼文字
		finalRefresherGoF2Text() {
			return this._getI18nText('zp.refresher.f2', this.refresherGoF2Text);
		},
		// 最终的底部加载更多默认状态文字
		finalLoadingMoreDefaultText() {
			return this._getI18nText('zp.loadingMore.default', this.loadingMoreDefaultText);
		},
		// 最终的底部加载更多加载中文字
		finalLoadingMoreLoadingText() {
			return this._getI18nText('zp.loadingMore.loading', this.loadingMoreLoadingText);
		},
		// 最终的底部加载更多没有更多数据文字
		finalLoadingMoreNoMoreText() {
			return this._getI18nText('zp.loadingMore.noMore', this.loadingMoreNoMoreText);
		},
		// 最终的底部加载更多加载失败文字
		finalLoadingMoreFailText() {
			return this._getI18nText('zp.loadingMore.fail', this.loadingMoreFailText);
		},
		// 最终的空数据图title
		finalEmptyViewText() {
			return this.isLoadFailed ? this.finalEmptyViewErrorText : this._getI18nText('zp.emptyView.title', this.emptyViewText);
		},
		// 最终的空数据图reload title
		finalEmptyViewReloadText() {
			return this._getI18nText('zp.emptyView.reload', this.emptyViewReloadText);
		},
		// 最终的空数据图加载失败文字
		finalEmptyViewErrorText() {
			return this.customerEmptyViewErrorText || this._getI18nText('zp.emptyView.error', this.emptyViewErrorText);
		},
		// 最终的系统loading title
		finalSystemLoadingText() {
			return this._getI18nText('zp.systemLoading.title', this.systemLoadingText);
		},
	},
	methods: {
		// 获取当前z-paging的语言
		getLanguage() {
			return this.finalLanguage;
		},
		// 获取国际化转换后的文本
		_getI18nText(key, value) {
			const dataType = Object.prototype.toString.call(value);
			if (dataType === '[object Object]') {
				const nextValue = value[this.finalLanguage];
				if (nextValue) return nextValue;
			} else if (dataType === '[object String]') {
				return value;
			}
			return t(key);
		},
		// 系统language转i18n local
		_language2Local(language) {
			const formatedLanguage = language.toLowerCase().replace(new RegExp('_', ''), '-');
			if (formatedLanguage.indexOf('zh') !== -1) {
				if (formatedLanguage === 'zh' || formatedLanguage === 'zh-cn' || formatedLanguage.indexOf('zh-hans') !== -1) {
					return 'zh-Hans';
				}
				return 'zh-Hant';
			}
			if (formatedLanguage.indexOf('en') !== -1) return 'en';
			return language;
		}
	}
}
