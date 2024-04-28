<!-- z-paging -->
<!-- github地址:https://github.com/SmileZXLee/uni-z-paging -->
<!-- dcloud地址:https://ext.dcloud.net.cn/plugin?id=3935 -->
<!-- 反馈QQ群：790460711 -->

<!-- 滑动切换选项卡swiper-item，此组件支持easycom规范，可以在项目中直接引用 -->
<template>
	<view class="zp-swiper-item-container">
		<z-paging ref="paging" :fixed="false" 
			:auto="false" :useVirtualList="useVirtualList" :useInnerList="useInnerList" :cellKeyName="cellKeyName" :innerListStyle="innerListStyle" 
			:preloadPage="preloadPage" :cellHeightMode="cellHeightMode" :virtualScrollFps="virtualScrollFps" :virtualListCol="virtualListCol"
			@query="_queryList" @listChange="_updateList">
			<slot />
			<template #header>
				<slot name="header"/>
			</template>
			<template #cell="{item,index}">
				<slot name="cell" :item="item" :index="index"/>
			</template>
			<template #footer>
				<slot name="footer"/>
			</template>
		</z-paging>
	</view>
</template>

<script>
	import zPaging from '../z-paging/z-paging'
	export default {
		name: "z-paging-swiper-item",
		components: { zPaging },
		data() {
			return {
				firstLoaded: false
			}
		},
		props: {
			// 当前组件的index，也就是当前组件是swiper中的第几个
			tabIndex: {
				type: Number,
				default: function() {
					return 0
				}
			},
			// 当前swiper切换到第几个index
			currentIndex: {
				type: Number,
				default: function() {
					return 0
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
			// 预加载的列表可视范围(列表高度)页数，默认为12，即预加载当前页及上下各12页的cell。此数值越大，则虚拟列表中加载的dom越多，内存消耗越大(会维持在一个稳定值)，但增加预加载页面数量可缓解快速滚动短暂白屏问题
			preloadPage: {
				type: [Number, String],
				default: 12
			},
			// 虚拟列表cell高度模式，默认为fixed，也就是每个cell高度完全相同，将以第一个cell高度为准进行计算。可选值【dynamic】，即代表高度是动态非固定的，【dynamic】性能低于【fixed】。
			cellHeightMode: {
				type: String,
				default: 'fixed'
			},
			// 虚拟列表列数，默认为1。常用于每行有多列的情况，例如每行有2列数据，需要将此值设置为2
			virtualListCol: {
				type: [Number, String],
				default: 1
			},
			// 虚拟列表scroll取样帧率，默认为60，过高可能出现卡顿等问题
			virtualScrollFps: {
				type: [Number, String],
				default: 60
			},
		},
		watch: {
			currentIndex: {
				handler(newVal, oldVal) {
					if (newVal === this.tabIndex) {
						// 懒加载，当滑动到当前的item时，才去加载
						if (!this.firstLoaded) {
							this.$nextTick(()=>{
								let delay = 5;
								// #ifdef MP-TOUTIAO
								delay = 100;
								// #endif
								setTimeout(() => {
									this.$refs.paging.reload().catch(() => {});
								}, delay);
							})
						}
					}
				},
				immediate: true
			}
		},
		methods: {
			reload(data) {
				return this.$refs.paging.reload(data);
			},
			complete(data) {
				this.firstLoaded = true;
				return this.$refs.paging.complete(data);
			},
			_queryList(pageNo, pageSize, from) {
				this.$emit('query', pageNo, pageSize, from);
			},
			_updateList(list) {
				this.$emit('updateList', list);
			}
		}
	}
</script>

<style scoped>
	.zp-swiper-item-container {
		/* #ifndef APP-NVUE */
		height: 100%;
		/* #endif */
		/* #ifdef APP-NVUE */
		flex: 1;
		/* #endif */
	}
</style>
