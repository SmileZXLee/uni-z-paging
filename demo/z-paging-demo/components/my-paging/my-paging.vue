<!-- 基于z-paging封装个性化分页组件演示，可减少大量重复代码 -->
<template>
	<!-- 这边统一设置z-paging，在页面中使用时就不用重复写 -->
	<!-- 如果要在这里设置极简写法，这里的ref不能设置为paging，设置为其他名即可，因为极简写法会修改/调用第一个包含了ref="paging"的付view中的list和query -->
	<!-- 极简写法在下方设置autowire-list-name="xxx" autowire-query-name="xxx"即可，与minimalism-demo.vue中的一致，并且不用再从这个组件转发到页面，只要遵循上一行的规则即可 -->
	<z-paging ref="paging" v-model="list" fixed auto-show-back-to-top refresher-threshold="160rpx" @query="queryList"
		:useVirtualList="useVirtualList" :useInnerList="useInnerList" :cellKeyName="cellKeyName" :innerListStyle="innerListStyle" :preloadPage="preloadPage" :cellHeightMode="cellHeightMode" :virtualScrollFps="virtualScrollFps"
		:loading-more-loading-text="{'en':'英文的加载中','zh-Hans':'中文的加载中','zh-Hant':'繁体的加载中'}">
		
		<!-- 这里插入一个view到z-paging中，并且这个view会被z-paging标记为top固定在顶部 -->
		<template #top>
			<!-- 这里接收页面传进来的slot，这样相当于将页面传进来的slot传给z-paging的slot="top"了 -->
			<slot name="top" />
		</template>
		
		<!-- 这里插入一个view到z-paging中，并且这个view会被z-paging标记为bottom固定在顶部 -->
		<!-- vue3中用v-slot:bottom -->
		<template #bottom>
			<!-- 这里接收页面传进来的slot，这样相当于将页面传进来的slot传给z-paging的slot="bottom"了 -->
			<slot name="bottom" />
		</template>
		
		<template #empty v-if="$slots.empty" >
			<!-- 这里接收页面传进来的slot，这样相当于将页面传进来的slot传给z-paging的slot="empty"了 -->
			<slot name="empty" />
		</template>
		
		<!-- 这个是插入虚拟列表/内置列表的cell -->
		<template #cell="{item,index}">
			<slot name="cell" :item="item" :index="index"/>
		</template>

		<!-- 这里通过slot统一自定义了下拉刷新view和没有更多数据view，页面那边就不用再写下面两行了 -->
		<!-- 自定义下拉刷新view(如果use-custom-refresher为true且不设置下面的slot="refresher"，此时不用获取refresherStatus，会自动使用z-paging自带的下拉刷新view) -->
		<template #refresher="{refresherStatus}">
			<custom-refresher :status="refresherStatus" />
		</template>
		<!-- 自定义没有更多数据view -->
		<template #loadingMoreNoMore>
			<custom-nomore></custom-nomore>
		</template>

		<!-- 这里接收页面传进来的普通slot，如列表数据等 -->
		<slot />
	</z-paging>
</template>

<script>
	export default {
		name: "my-paging",
		data() {
			return {
				list: []
			};
		},
		props: {
			// 用于接收父组件v-model所绑定的list的值
			value: {
				type: Array,
				default: function() {
					return [];
				}
			},
			// 是否使用虚拟列表，默认为否
			useVirtualList: {
				type: Boolean,
				default: false
			},
			// 是否在z-paging内部循环渲染列表(内置列表)，默认为否。若use-virtual-list为true，则此项恒为true
			useInnerList: {
				type: Boolean,
				default: false
			},
			// 内置列表cell的key名称，仅nvue有效，在nvue中开启use-inner-list时必须填此项
			cellKeyName: {
				type: String,
				default: ''
			},
			// innerList样式
			innerListStyle: {
				type: Object,
				default: function() {
					return {};
				}
			},
			// 预加载的列表可视范围(列表高度)页数，默认为12，即预加载当前页及上下各7页的cell。此数值越大，则虚拟列表中加载的dom越多，内存消耗越大(会维持在一个稳定值)，但增加预加载页面数量可缓解快速滚动短暂白屏问题
			preloadPage: {
				type: [Number, String],
				default: 12
			},
			// 虚拟列表cell高度模式，默认为fixed，也就是每个cell高度完全相同，将以第一个cell高度为准进行计算。可选值【dynamic】，即代表高度是动态非固定的，【dynamic】性能低于【fixed】。
			cellHeightMode: {
				type: String,
				default: 'fixed'
			},
			// 虚拟列表scroll取样帧率，默认为60，过高可能出现卡顿等问题
			virtualScrollFps: {
				type: [Number, String],
				default: 60
			},
		},
		watch: {
			// 监听页面v-mode传过来的值，同时传给z-paging
			value(newVal) {
				this.list = newVal;
			},
			// #ifdef VUE3
			modelValue(newVal) {
				this.list = newVal;
			},
			// #endif
			// 监听z-paging给当前组件的值，同时传给页面
			list(newVal) {
				//通过emit input修改页面中v-model绑定的值
				this.$emit('input', newVal);
				// #ifdef VUE3
				this.$emit('update:modelValue', newVal);
				// #endif
			}
		},
		methods: {
			// 监听z-paging的@query方法，通过emit传递给页面
			queryList(pageNo, pageSize) {
				this.$emit('query', pageNo, pageSize);
			},
			// 接收页面触发的reload方法，传给z-paging
			reload(data) {
				this.$refs.paging.reload(data);
			},
			// 接收页面触发的complete方法，传给z-paging
			complete(data) {
				this.$refs.paging.complete(data);
			},
			/*
			// 如果是使用页面滚动，则需要添加以下三行，注意页面那边要引入mixins，与使用页面滚动示例写法相同。
			// 接收页面触发的updatePageScrollTop方法，传给z-paging
			updatePageScrollTop(data){
				this.$refs.paging.updatePageScrollTop(data);
			},
			// 接收页面触发的pageReachBottom方法，传给z-paging
			pageReachBottom(){
				this.$refs.paging.pageReachBottom();
			},
			// 接收页面触发的doChatRecordLoadMore方法，传给z-paging
			doChatRecordLoadMore() {
				this.$refs.paging.doChatRecordLoadMore();
			}
			*/
		}
	}
</script>

<style>

</style>
