<!-- 自定义的空数据占位view -->
<template>
	<view class="container">
		<view class="main">
			<image class="main-image" src="/static/nodata.png"></image>
			<!-- #ifdef APP-NVUE -->
			<text class="mian-title">{{emptyText}}</text>
			<!-- #endif -->
			<!-- #ifndef APP-NVUE -->
			<view class="mian-title">{{emptyText}}</view>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				
			};
		},
		props: {
			emptyText: {
				type: String,
				default: function() {
					return '没有数据哦~'
				}
			},
		}
	}
</script>

<style scoped>
	.container{
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
	.main{
		z-index: 10000;
	}
	.main-image{
		margin-top: -200rpx;
		width: 200rpx;
		height: 200rpx;
	}
	.mian-title{
		font-size: 26rpx;
		color: #aaaaaa;
		text-align: center;
	}
</style>
