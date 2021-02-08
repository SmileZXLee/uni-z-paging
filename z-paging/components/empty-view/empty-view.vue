<!-- 自定义的空数据占位view -->
<template>
	<view class="container">
		<view class="main">
			<image class="main-image" src="/static/nodata.png"></image>
			<view class="mian-title">{{emptyText}}</view>
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
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
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
