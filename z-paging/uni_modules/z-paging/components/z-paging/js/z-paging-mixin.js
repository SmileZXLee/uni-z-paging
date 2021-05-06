
// z-paging
// github地址:https://github.com/SmileZXLee/uni-z-paging
// dcloud地址:https://ext.dcloud.net.cn/plugin?id=3935
// 反馈QQ群：790460711

// 使用页面滚动时引入此mixin，用于监听和处理onPullDownRefresh等页面生命周期方法

const ZPagingMixin = {
	onPullDownRefresh(){
		if(this.isPagingRefNotFound()){
			return;
		}
		this.$refs.paging.reload();
	},
	onPageScroll(e) {
		if(this.isPagingRefNotFound()){
			return;
		}
		this.$refs.paging.updatePageScrollTop(e.scrollTop);
	},
	onReachBottom() {
		if(this.isPagingRefNotFound()){
			return;
		}
		this.$refs.paging.doLoadMore();
	},
	methods: {
		isPagingRefNotFound(){
			return !this.$refs.paging || this.$refs.paging === undefined;
		}
	}
}

export default ZPagingMixin;
