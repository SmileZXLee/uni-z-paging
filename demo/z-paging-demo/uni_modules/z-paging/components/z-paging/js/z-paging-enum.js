// [z-paging]枚举

export default {
	// 当前加载类型 0.下拉刷新 1.上拉加载更多
	LoadingType: {
		Refresher: 0,
		LoadingMore: 1
	},
	// 下拉刷新状态 0.默认状态 1.松手立即刷新 2.刷新中 3.刷新结束
	Refresher: {
		Default: 0,
		ReleaseToRefresh: 1,
		Loading: 2,
		Complete: 3
	},
	// 底部加载更多状态 0.默认状态 1.加载中 2.没有更多数据 3.加载失败
	More: {
		Default: 0,
		Loading: 1,
		NoMore: 2,
		Fail: 3
	},
	// @query触发来源 0.用户主动下拉刷新 1.通过reload触发 2.通过refresh触发 3.通过滚动到底部加载更多或点击底部加载更多触发
	QueryFrom: {
		UserPullDown: 0,
		Reload: 1,
		Refresh: 2,
		LoadingMore: 3
	},
	// 虚拟列表cell高度模式
	CellHeightMode: {
		// 固定高度
		Fixed: 'fixed',
		// 动态高度
		Dynamic: 'dynamic'
	},
	// 列表缓存模式
	CacheMode: {
		// 默认模式，只会缓存一次
		Default: 'default',
		// 总是缓存，每次列表刷新(下拉刷新、调用reload等)都会更新缓存
		Always: 'always'
	}
}