// [z-paging]枚举

const Enum = {
	//当前加载类型 0.下拉刷新 1.上拉加载更多
	LoadingType: {
		Refresher: 0,
		LoadingMore: 1
	},
	//下拉刷新状态 0.默认状态 1.松手立即刷新 2.刷新中 3.刷新结束
	Refresher: {
		Default: 0,
		ReleaseToRefresh: 1,
		Loading: 2,
		Complete: 3
	},
	//底部加载更多状态 0.默认状态 1.加载中 2.没有更多数据 3.加载失败
	More: {
		Default: 0,
		Loading: 1,
		NoMore: 2,
		Fail: 3
	},
	//@query触发来源 0.用户主动下拉刷新 1.通过reload触发 2.通过refresh触发 3.通过滚动到底部加载更多或点击底部加载更多触发
	QueryFrom: {
		UserPullDown: 0,
		Reload: 1,
		Refresh: 2,
		LoadingMore: 3
	}
}

export default Enum;
