<!-- z-paging -->
<!-- github地址:https://github.com/SmileZXLee/uni-z-paging -->
<!-- dcloud地址:https://ext.dcloud.net.cn/plugin?id=3935 -->
<!-- 反馈QQ群：790460711 -->

<!-- z-paging-cell，用于在nvue中使用cell包裹，vue中使用view包裹 -->
<template>
	<!-- #ifdef APP-NVUE -->
	<cell :style="[cellStyle]" @touchstart="onTouchstart">
		<slot />
	</cell>
	<!-- #endif -->
	<!-- #ifndef APP-NVUE -->
	<view :style="[cellStyle]" @touchstart="onTouchstart">
		<slot />
	</view>
	<!-- #endif -->
</template>

<script>
	/**
	 * z-paging-cell 组件
	 * @description 用于兼容 nvue 和 vue 中的 cell 渲染。因为在 nvue 中 z-paging 内置的是 list，因此列表 item 必须使用 cell 包住；在 vue 中不能使用 cell，否则会报组件找不到的错误。此子组件为了兼容这两种情况，内部作了条件编译处理。
	 * @tutorial https://z-paging.zxlee.cn/api/sub-components/main.html#z-paging-cell配置
	 * @notice 以下为 z-paging-cell 的配置项
	 * @property {Object} cellStyle cell 样式，默认为 {}
	 * @example <z-paging-cell :cellStyle="{ backgroundColor: '#f0f0f0' }"></z-paging-cell>
	 */
	export default {
		name: "z-paging-cell",
		props: {
			//cellStyle
			cellStyle: {
				type: Object,
				default: function() {
                    return {}
                }
			}
		},
		methods: {
			onTouchstart(e) {
				this.$emit('touchstart', e);
			}
		}
	}
</script>

