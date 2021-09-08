<!-- 自定义的下拉刷新view -->
<template>
	<view class="refresher-container">
		<!-- 这里的图片请换成自己项目的图片 -->
		<image class="refresher-image" mode="aspectFit" src="@/static/refresher_loading.gif"></image>
		<text class="refresher-text">{{statusText}}</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		computed: {
			statusText() {
				// 这里可以做i18n国际化相关操作，可以通过zI18n.getLanguag()获取当前语言(需要import z-paging-i18n.js，具体操作见i18n-demo.vue);
				// 获取到当前语言之后，就可以自定义不同语言下的展示内容了
				const statusTextArr = ['哎呀，用点力继续下拉！', '拉疼我啦，松手刷新~~', '正在努力刷新中...', '刷新成功啦~'];
				return statusTextArr[this.status];
			}
		},
		props: {
			status: {
				type: Number,
				default: function() {
					return 0;
				},
			},
		}
	}
</script>

<style scoped>
	.refresher-container {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		height: 150rpx;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.refresher-image {
		margin-top: 10rpx;
		height: 45px;
		width: 45px;
	}

	.refresher-text {
		margin-top: 10rpx;
		font-size: 24rpx;
		color: #666666;
	}
</style>
