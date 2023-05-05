// [z-paging]使用页面滚动时引入此mixin，用于监听和处理onPullDownRefresh等页面生命周期方法

export default {
	onPullDownRefresh() {
		if (this.isPagingRefNotFound()) return;
		this.$refs.paging.reload();
	},
	onPageScroll(e) {
		if (this.isPagingRefNotFound()) return;
		this.$refs.paging.updatePageScrollTop(e.scrollTop);
		e.scrollTop < 10 && this.$refs.paging.doChatRecordLoadMore();
	},
	onReachBottom() {
		if (this.isPagingRefNotFound()) return;
		this.$refs.paging.pageReachBottom();
	},
	methods: {
		isPagingRefNotFound() {
			return !this.$refs.paging;
		}
	}
}
