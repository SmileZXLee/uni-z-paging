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
	/**
	 * z-paging-swiper-item 组件
	 * @description swiper+list极简写法中使用到，实际上就是对普通的swiper+list中swiper-item的包装封装，用以简化写法，但个性化配置局限较多
	 * @tutorial https://z-paging.zxlee.cn/api/sub-components/main.html#z-paging-swiper-item配置
	 * @notice 以下为 z-paging-swiper-item 的配置项
	 * @property {Number} tabIndex 当前组件的 index，也就是当前组件是 swiper 中的第几个，默认为 0
	 * @property {Number} currentIndex 当前 swiper 切换到第几个 index，默认为 0
	 * @property {Boolean} useVirtualList 是否使用虚拟列表，默认为 false
	 * @property {Boolean} useInnerList 是否在 z-paging 内部循环渲染列表（内置列表），默认为 false。若 useVirtualList 为 true，则此项恒为 true
	 * @property {String} cellKeyName 内置列表 cell 的 key 名称，仅 nvue 有效，在 nvue 中开启 useInnerList 时必须填此项，默认为 ''
	 * @property {Object} innerListStyle innerList 样式，默认为 {}
	 * @property {Number|String} preloadPage 预加载的列表可视范围（列表高度）页数，默认为 12。此数值越大，则虚拟列表中加载的 dom 越多，内存消耗越大（会维持在一个稳定值），但增加预加载页面数量可缓解快速滚动短暂白屏问题
	 * @property {String} cellHeightMode 虚拟列表 cell 高度模式，默认为 'fixed'，也就是每个 cell 高度完全相同，将以第一个 cell 高度为准进行计算。可选值【dynamic】，即代表高度是动态非固定的，【dynamic】性能低于【fixed】
	 * @property {Number|String} virtualListCol 虚拟列表列数，默认为 1。常用于每行有多列的情况，例如每行有 2 列数据，需要将此值设置为 2
	 * @property {Number|String} virtualScrollFps 虚拟列表 scroll 取样帧率，默认为 60，过高可能出现卡顿等问题
	 * @example <z-paging-swiper-item ref="swiperItem" :tabIndex="index" :currentIndex="current" @query="queryList" @updateList="updateList"></z-paging-swiper-item>
	 */
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
