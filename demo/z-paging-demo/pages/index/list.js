export default {
	list: [{
			title: '普通模式演示',
			file: 'common-demo',
			subTitle: ''
		},
		{
			title: '自定义下拉刷新与上拉加载演示',
			file: 'custom-demo',
			subTitle: ''
		},
		{
			title: '滑动切换选项卡演示(标准写法)',
			file: 'swiper-demo',
			subTitle: ''
		},
		{
			title: '滑动切换选项卡演示(简化写法,不推荐)',
			file: 'swiper-simplify-demo',
			subTitle: ''
		},
		{
			title: '使用页面滚动演示',
			file: 'page-default-demo',
			subTitle: ''
		},
		{
			title: '使用页面滚动且在子组件内使用z-paging演示',
			file: 'page-default-comp-demo',
			subTitle: ''
		},
		{
			title: '在弹窗内使用z-paging演示',
			file: 'popup-demo',
			subTitle: 'z-paging的局部滚动'
		},
		{
			title: '虚拟列表演示(一般写法)',
			file: 'virtual-list-demo',
			subTitle: '采用内部for循环slot实现，写法较为简单，在微信小程序中此写法有一些限制和问题'
		},
		{
			title: '虚拟列表演示(兼容写法)',
			file: 'virtual-list-compatibility-demo',
			subTitle: '为提升兼容性而提供的写法，微信小程序中建议使用兼容写法'
		},
		{
			title: '滚动吸附效果演示',
			file: 'sticky-demo',
			subTitle: ''
		},
		{
			title: '滑动切换选项卡+吸顶演示①',
			file: 'sticky-swiper-demo',
			subTitle: '上一个tab数据保留，滚动过渡效果不够流畅，具体可点击体验'
		},
		{
			title: '滑动切换选项卡+吸顶演示②',
			file: 'sticky-swiper-next-demo',
			subTitle: '上一个tab数据不保留，滚动过渡效果流畅'
		},
		{
			title: '下拉显示最后更新时间演示',
			file: 'show-update-time-demo',
			subTitle: ''
		},
		{
			title: '自定义导航栏演示',
			file: 'custom-nav-demo',
			subTitle: '使用了uView的自定义导航栏组件'
		},
		{
			title: '聊天记录模式演示',
			file: 'chat-history-demo',
			subTitle: '滚动到顶部加载更多无闪动'
		},
		{
			title: '聊天记录模式+虚拟列表演示',
			file: 'chat-history-virtual-demo',
			subTitle: '滚动到顶部加载更多无闪动+支持虚拟列表'
		},
		{
			title: 'i18n国际化演示',
			file: 'i18n-demo',
			subTitle: ''
		},
		{
			title: '自定义返回顶部按钮演示',
			file: 'custom-back-to-top-demo',
			subTitle: ''
		},
		{
			title: '基于z-paging封装个性化分页组件演示',
			file: 'my-paging-demo',
			subTitle: '可将重复的配置或者重复插入的slot封装在自定义的分页组件中'
		},
		{
			title: '保证数据一致性演示',
			file: 'consistency-demo',
			subTitle: '将request.js中的loadingTime修改为2000可更直观体验'
		},
		{
			title: '极简写法演示',
			file: 'minimalism-demo',
			subTitle: '此写法可省略重复的v-model和@query'
		},
		{
			title: '内置列表模式演示',
			file: 'inner-list-demo',
			subTitle: '使用内置for循环渲染list，无需书写v-for，也无需v-model绑定list(不支持字节跳动小程序)'
		}
	],
	listNvue: [{
			title: '普通模式演示(nvue)',
			file: 'common-demo-n',
			subTitle: ''
		},
		{
			title: '自定义下拉刷新与上拉加载演示(nvue)',
			file: 'custom-demo-n',
			subTitle: ''
		},
		{
			title: '滑动切换选项卡演示(标准写法)(nvue)',
			file: 'swiper-demo-n',
			subTitle: ''
		},
		{
			title: '滑动切换选项卡演示(简化写法,不推荐)(nvue)',
			file: 'swiper-simplify-demo-n',
			subTitle: ''
		},
		{
			title: '使用页面滚动演示(nvue)',
			file: 'page-default-demo-n',
			subTitle: ''
		},
		{
			title: '滚动吸附效果演示(nvue)',
			file: 'sticky-demo-n',
			subTitle: ''
		},
		{
			title: '聊天记录模式演示(nvue)',
			file: 'chat-history-demo-n',
			subTitle: ''
		}, {
			title: '滑动切换选项卡+吸顶演示(nvue)',
			file: 'sticky-swiper-demo-n',
			subTitle: ''
		}, {
			title: '内置列表模式演示(nvue)',
			file: 'inner-list-demo-n',
			subTitle: '使用内置for循环渲染list，无需书写v-for，也无需v-model绑定list'
		}
	]
}
