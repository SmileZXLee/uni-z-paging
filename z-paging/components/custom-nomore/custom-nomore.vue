<template>
	<view class="nomore">
		<!-- 这里的图片请换成自己项目的图片 -->
		<image class="nomore-image" mode="widthFix" src="@/static/no_more.png"></image>
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
		height: 150rpx;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		padding: 10px 0px;
	}
	.nomore-image{
		width: 100px;
	}
	.nomore-text{
		margin-top: 10rpx;
		font-size: 24rpx;
		color: #222963;
	}
</style>
