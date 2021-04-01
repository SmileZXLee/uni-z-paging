<!-- z-paging -->
<!-- github地址:https://github.com/SmileZXLee/uni-z-paging -->
<!-- dcloud地址:https://ext.dcloud.net.cn/plugin?id=3935 -->
<!-- 反馈QQ群：790460711 -->

<!-- 空数据占位view -->
<template>
	<view class="container">
		<view class="main">
			<image class="main-image" :src="emptyViewImg"></image>
			<!-- #ifdef APP-NVUE -->
			<text class="mian-title">{{emptyViewText}}</text>
			<!-- #endif -->
			<!-- #ifndef APP-NVUE -->
			<view class="mian-title">{{emptyViewText}}</view>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
	import zStatic from './z-paging-static'
	export default {
		data() {
			return {

			};
		},
		props: {
			//空数据描述文字
			emptyViewText: {
				type: String,
				default: function() {
					return '没有数据哦~'
				}
			},
			//空数据图片
			emptyViewImg: {
				type: String,
				default: function() {
					return zStatic.base64Empty
				}
			},
		}
	}
</script>

<style scoped>
	.container {
		/* #ifndef APP-NVUE */
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		/* #endif */
		/* #ifdef APP-NVUE */
		flex: 1;
		height: 1200rpx;
		/* #endif */
		align-items: center;
		justify-content: center;
	}

	.main {
		z-index: 1000;
	}

	.main-image {
		margin-top: -200rpx;
		width: 200rpx;
		height: 200rpx;
	}

	.mian-title {
		font-size: 26rpx;
		color: #aaaaaa;
		text-align: center;
	}
</style>
