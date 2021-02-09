<template>
	<view class="nomore">
		<image class="nomore-image" src="http://www.zxlee.cn/github/uni-z-paging/no_more.png"></image>
		<view class="nomore-text">已经到达宇宙尽头啦~</view>
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
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 10px 0px;
	}
	.nomore-image{
		height: 100px;
		width: 100px;
	}
	.nomore-text{
		margin-top: 10rpx;
		font-size: 24rpx;
		color: #222963;
	}
</style>
