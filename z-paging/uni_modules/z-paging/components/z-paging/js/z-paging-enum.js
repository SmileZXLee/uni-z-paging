// [z-paging]枚举

const Enum = {
	//当前加载类型 0-下拉刷新 1-上拉加载更多
	LoadingType: {
		Refresher: 0,
		LoadingMore: 1
	},
	//下拉刷新状态 0-默认状态 1.松手立即刷新 2.刷新中 3.刷新结束
	Refresher: {
		Default: 0,
		PullToRefresh: 1,
		Loading: 2,
		Complete: 3
	},
	//底部加载更多状态 0-默认状态 1.加载中 2.没有更多数据 3.加载失败
	More: {
		Default: 0,
		Loading: 1,
		NoMore: 2,
		Fail: 3
	}
}

module.exports = Enum;
