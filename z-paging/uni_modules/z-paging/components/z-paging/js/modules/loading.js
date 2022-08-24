// [z-paging]loading相关模块
import u from '.././z-paging-utils'
import Enum from '.././z-paging-enum'

const ZPLoading = {
	props: {
		//第一次加载后自动隐藏loading slot，默认为是
		autoHideLoadingAfterFirstLoaded: {
			type: Boolean,
			default: u.gc('autoHideLoadingAfterFirstLoaded', true)
		},
		//loading slot是否铺满屏幕并固定，默认为否
		loadingFullFixed: {
			type: Boolean,
			default: u.gc('loadingFullFixed', false)
		},
		//是否自动显示系统Loading：即uni.showLoading，若开启则将在刷新列表时(调用reload、refresh时)显示，下拉刷新和滚动到底部加载更多不会显示，默认为false。
		autoShowSystemLoading: {
			type: Boolean,
			default: u.gc('autoShowSystemLoading', false)
		},
		//显示系统Loading时显示的文字，默认为"加载中"
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
		loadingStatus(newVal, oldVal) {
			this.$emit('loadingStatusChange', newVal);
			this.$nextTick(()=>{
				this.loadingStatusAfterRender = newVal;
			})
			// #ifdef APP-NVUE
			if (this.useChatRecordMode) {
				if (this.pageNo === this.defaultPageNo && newVal === Enum.More.NoMore) {
					this.nIsFirstPageAndNoMore = true;
					return;
				}
			}
			this.nIsFirstPageAndNoMore = false;
			//  #endif
		},
		loading(newVal){
			if(newVal){
				this.loadingForNow = newVal;
			}
		},
	},
	computed: {
		showLoading() {
			let res = false;
			if (this.firstPageLoaded || !this.loading || !this.loadingForNow) return false;
			if (this.autoHideLoadingAfterFirstLoaded) {
				res = this.fromEmptyViewReload ? true : !this.pagingLoaded;
			} else{
				res =  this.loadingType === Enum.LoadingType.Refresher;
			}
			if (this.autoShowSystemLoading && this.loadingType === Enum.LoadingType.Refresher){
				uni.showLoading({
					title: this.finalSystemLoadingText
				})
			}
			return res;
		},
	},
	methods: {
		//处理开始加载更多状态
		_startLoading(isReload = false) {
			if ((this.showLoadingMoreWhenReload && !this.isUserPullDown) || !isReload) {
				this.loadingStatus = Enum.More.Loading;
			}
			this.loading = true;
		},
	}
}

export default ZPLoading;
