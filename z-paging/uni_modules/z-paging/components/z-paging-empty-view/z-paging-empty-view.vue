<!-- z-paging V1.5.3 -->
<!-- github地址:https://github.com/SmileZXLee/uni-z-paging -->
<!-- dcloud地址:https://ext.dcloud.net.cn/plugin?id=3935 -->
<!-- 反馈QQ群：790460711 -->

<!-- 空数据占位view，此组件支持easycom规范，可以在项目中直接引用 -->
<template>
	<view class="zp-container">
		<view class="zp-main">
			<image v-if="!emptyViewImg.length" class="zp-main-image" :src="base64Empty"></image>
			<image v-else class="zp-main-image" :src="emptyViewImg"></image>
			<!-- #ifdef APP-NVUE -->
			<text class="zp-mian-title">{{emptyViewText}}</text>
			<!-- #endif -->
			<!-- #ifndef APP-NVUE -->
			<view class="zp-mian-title">{{emptyViewText}}</view>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
	import zStatic from '../z-paging/js/z-paging-static'
	export default {
		data() {
			return {
				base64Empty: zStatic.base64Empty
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
					return ''
				}
			},
		}
	}
</script>

<style scoped>
	.zp-container {
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

	.zp-main {
		z-index: 1000;
		/* #ifndef APP-NVUE */
		display: flex;
		margin-top: -150rpx;
		/* #endif */
		/* #ifdef APP-NVUE */
		margin-top: -100rpx;
		/* #endif */
		flex-direction: column;
		align-items: center;
	}

	.zp-main-image {
		width: 200rpx;
		height: 200rpx;
		z-index: 1000;
	}

	.zp-mian-title {
		font-size: 26rpx;
		color: #aaaaaa;
		text-align: center;
		z-index: 1000;
	}
</style>
