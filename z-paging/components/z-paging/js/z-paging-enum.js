// [z-paging]枚举

export default {
	// 当前加载类型 refresher:下拉刷新 load-more:上拉加载更多
	LoadingType: {
		Refresher: 'refresher',
		LoadMore: 'load-more'
	},
	// 下拉刷新状态 default:默认状态 release-to-refresh:松手立即刷新 loading:刷新中 complete:刷新结束 go-f2:松手进入二楼
	Refresher: {
		Default: 'default',
		ReleaseToRefresh: 'release-to-refresh',
		Loading: 'loading',
		Complete: 'complete',
		GoF2: 'go-f2'
	},
	// 底部加载更多状态 default:默认状态 loading:加载中 no-more:没有更多数据 fail:加载失败
	More: {
		Default: 'default',
		Loading: 'loading',
		NoMore: 'no-more',
		Fail: 'fail'
	},
	// @query触发来源 user-pull-down:用户主动下拉刷新 reload:通过reload触发 refresh:通过refresh触发 load-more:通过滚动到底部加载更多或点击底部加载更多触发
	QueryFrom: {
		UserPullDown: 'user-pull-down',
		Reload: 'reload',
		Refresh: 'refresh',
		LoadMore: 'load-more'
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