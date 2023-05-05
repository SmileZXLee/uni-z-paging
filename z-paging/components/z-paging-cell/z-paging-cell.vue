<!-- z-paging -->
<!-- github地址:https://github.com/SmileZXLee/uni-z-paging -->
<!-- dcloud地址:https://ext.dcloud.net.cn/plugin?id=3935 -->
<!-- 反馈QQ群：790460711 -->

<!-- z-paging-cell，用于在nvue中使用cell包裹，vue中使用view包裹 -->
<template>
	<!-- #ifdef APP-NVUE -->
	<cell :style="[cellStyle]">
		<slot />
	</cell>
	<!-- #endif -->
	<!-- #ifndef APP-NVUE -->
	<view :style="[cellStyle]">
		<slot />
	</view>
	<!-- #endif -->
</template>

<script>
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
		}
	}
</script>

