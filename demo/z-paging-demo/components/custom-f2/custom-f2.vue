<template>
	<view class="custom-f2">
		<view class="custom-f2-main">
			<!-- #ifndef APP-NVUE -->
			<u-navbar title="我的小程序" title-color="white" title-bold :is-back="false" :background="{background: 'rgba(0,0,0,0)'}"></u-navbar>
			<!-- #endif -->
			<view class="custom-f2-list">
				<view class="custom-f2-item" v-for="index of 16" :key="index">
					<image class="custom-f2-item-img" src="/static/duola.jpg" mode=""></image>
					<text class="custom-f2-item-title">小程序{{index}}</text>
				</view>
			</view>
		</view>
		<view class="custom-f2-bottom" @click="onCloseF2Click">
			<text class="custom-f2-bottom-text">回到首页</text>
		</view>
	</view>
</template>

<script>
	export default {
		name:"custom-f2",
		data() {
			return {
				
			};
		},
		methods: {
			onCloseF2Click() {
				this.$emit('closeF2');
			}
		}
	}
</script>

<style scoped>
	.custom-f2 {
		height: 100%;
		background-color: #1b1b2a;
		display: flex;
		flex-direction: column;
		
		/* #ifdef APP-NVUE */
		flex: 1;
		/* #endif */
	}
	.custom-f2-main {
		flex: 1;
	}
	.custom-f2-bottom {
		background-color: #35364f;
		padding: 40rpx;
		text-align: center;
		border-top-left-radius: 30rpx;
		border-top-right-radius: 30rpx;
		
		/* #ifdef APP-NVUE */
		align-items: center;
		/* #endif */
	}
	.custom-f2-bottom-text {
		color: white;
		font-weight: bold;
		font-size: 28rpx;
	}
	.custom-f2-list {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		padding: 80rpx 86rpx;
		/* #ifndef APP-NVUE */
		gap: 70rpx;
		/* #endif */
	}
	.custom-f2-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		/* #ifdef APP-NVUE */
		margin-left: 40rpx;
		margin-top: 40rpx;
		/* #endif */
	}
	.custom-f2-item-img {
		width: 90rpx;
		height: 90rpx;
		border-radius: 50%;
	}
	.custom-f2-item-title {
		margin-top: 20rpx;
		color: white;
		font-size: 22rpx;
	}
</style>