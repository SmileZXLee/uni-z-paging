// [z-paging]loading相关模块
import u from '.././z-paging-utils'
import Enum from '.././z-paging-enum'

export default {
	props: {
		// 第一次加载后自动隐藏loading slot，默认为是
		autoHideLoadingAfterFirstLoaded: {
			type: Boolean,
			default: u.gc('autoHideLoadingAfterFirstLoaded', true)
		},
		// loading slot是否铺满屏幕并固定，默认为否
		loadingFullFixed: {
			type: Boolean,
			default: u.gc('loadingFullFixed', false)
		},
		// 是否自动显示系统Loading：即uni.showLoading，若开启则将在刷新列表时(调用reload、refresh时)显示，下拉刷新和滚动到底部加载更多不会显示，默认为false。
		autoShowSystemLoading: {
			type: Boolean,
			default: u.gc('autoShowSystemLoading', false)
		},
		// 显示系统Loading时是否显示透明蒙层，防止触摸穿透，默认为是(H5、App、微信小程序、百度小程序有效)
		systemLoadingMask: {
			type: Boolean,
			default: u.gc('systemLoadingMask', true)
		},
		// 显示系统Loading时显示的文字，默认为"加载中"
		systemLoadingText: {
			type: [String, Object],
			default: u.gc('systemLoadingText', null)
		},
	},
	data() {
		return {
			loading: false,
			loadingForNow: false,
		}
	},
	watch: {
		// loading状态
		loadingStatus(newVal) {
			this.$emit('loadingStatusChange', newVal);
			this.$nextTick(() => {
				this.loadingStatusAfterRender = newVal;
			})
			if (this.useChatRecordMode) {
				if (this.isFirstPage && newVal === Enum.More.NoMore) {
					this.isFirstPageAndNoMore = true;
					return;
				}
			}
			this.isFirstPageAndNoMore = false;
		},
		loading(newVal){
			if (newVal) {
				this.loadingForNow = newVal;
			}
		},
	},
	computed: {
		// 是否显示loading
		showLoading() {
			if (this.firstPageLoaded || !this.loading || !this.loadingForNow) return false;
			if (this.finalShowSystemLoading) {
				// 显示系统loading
				uni.showLoading({
					title: this.finalSystemLoadingText,
					mask: this.systemLoadingMask
				})
			}
			return this.autoHideLoadingAfterFirstLoaded ? (this.fromEmptyViewReload ? true : !this.pagingLoaded) : this.loadingType === Enum.LoadingType.Refresher;
		},
		// 最终的是否显示系统loading
		finalShowSystemLoading() {
			return this.autoShowSystemLoading && this.loadingType === Enum.LoadingType.Refresher;
		}
	},
	methods: {
		// 处理开始加载更多状态
		_startLoading(isReload = false) {
			if ((this.showLoadingMoreWhenReload && !this.isUserPullDown) || !isReload) {
				this.loadingStatus = Enum.More.Loading;
			}
			this.loading = true;
		},
		// 停止系统loading和refresh
		_endSystemLoadingAndRefresh(){
			this.finalShowSystemLoading && uni.hideLoading();
			!this.useCustomRefresher && uni.stopPullDownRefresh();
			// #ifdef APP-NVUE
			this.usePageScroll && uni.stopPullDownRefresh();
			// #endif
		}
	}
}
