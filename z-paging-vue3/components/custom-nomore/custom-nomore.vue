<!-- z-paging自定义的没有更多数据view -->
<template>
	<view class="nomore">
		<!-- 这里的图片请换成自己项目的图片 -->
		<image class="nomore-image" mode="aspectFit" src="@/static/no_more.png"></image>
		<text class="nomore-text">已经到达宇宙尽头啦~</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
	
</script>

<style scoped>
	.nomore{
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		padding: 20rpx 0px;
	}
	.nomore-image{
		width: 200rpx;
		height: 130rpx;
	}
	.nomore-text{
		margin-top: 10rpx;
		font-size: 24rpx;
		color: #222963;
	}
</style>
