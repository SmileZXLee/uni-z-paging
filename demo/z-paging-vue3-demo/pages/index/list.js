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
			title: '下拉进入二楼演示',
			file: 'f2-demo',
			subTitle: ''
		},
		{
			title: '虚拟列表演示(一般写法)',
			file: 'virtual-list-demo',
			subTitle: '写法简单，通过slot=cell插入所需cell，页面中无直接的for循环，在vue2中兼容性良好'
		},
		{
			title: '虚拟列表演示(非内置列表写法)',
			file: 'virtual-list-no-inner-demo',
			subTitle: '写法较简单，在页面中对当前需要渲染的虚拟列表数据进行for循环，在vue3中兼容性良好'
		},
		{
			title: '虚拟列表演示(兼容写法)',
			file: 'virtual-list-compatibility-demo',
			subTitle: '写法麻烦，而且需要手动修改`z-paging`源码，所有渲染cell写在相同组件内，不易维护，在vue2中兼容性很好，但非必须不建议使用'
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
			title: '极简写法演示①',
			file: 'minimalism-demo',
			subTitle: '全局设置v-model和@query的绑定对象名，减少重复代码'
		},
		{
			title: '极简写法演示②',
			file: 'minimalism-fetch-demo',
			subTitle: '使用fetch直接传入分页请求代替@query，减少重复代码'
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
			title: '下拉进入二楼演示(nvue)',
			file: 'f2-demo-n',
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
	],
	listVue3: [
		{
			title: '普通模式演示(vue3+setup)',
			file: 'common-demo-vue3',
			subTitle: ''
		},
		{
			title: '使用页面滚动演示(vue3+setup)',
			file: 'page-default-demo-vue3',
			subTitle: ''
		},
		{
			title: '使用页面滚动且在子组件内使用z-paging演示(vue3+setup)',
			file: 'page-default-comp-demo-vue3',
			subTitle: ''
		},
	]
}
