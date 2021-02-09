<template>
	<view class="content">
		<view class="demo-view item-blue" @click="commonDemoClick">
			<view>普通模式演示</view>
			<view>common-demo.vue</view>
		</view>
		<view class="demo-view item-red" @click="customDemoClick">
			<view>自定义下拉刷新与上拉加载演示</view>
			<view>custom-demo.vue</view>
		</view>
		
		<view class="bottom">https://ext.dcloud.net.cn/plugin?id=3935</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				commonDemoClick(){
					uni.navigateTo({
						url: '../common-demo/common-demo'
					})
				},
				customDemoClick(){
					uni.navigateTo({
						url: '../custom-demo/custom-demo'
					})
				},
			}
		},
		methods: {
			
		}
	}
</script>

<style>
	page{
		height: 100%;
	}
	.content {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.demo-view{
		height: 120px;
		width: 90%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-radius: 20rpx;
		font-size: 40rpx;
		margin-top: 30rpx;
	}
	.item-red{
		background: linear-gradient(to right, #ffffff 0%, #f9d8ce 100%);
		color: #ed9272;
		box-shadow: 0 0  20rpx #f9d8ce;
	}
	.item-blue{
		color: #89b6f7;
		background: linear-gradient(to right, #ffffff 0%, #deebfd 100%);
		box-shadow: 0 0  20rpx #deebfd;
	}
	
	.bottom{
		width: 100%;
		position: fixed;
		bottom: 0;
		left: 0;
		height: 50rpx;
		line-height: 50rpx;
		text-align: center;
		font-size: 24rpx;
		
	}
</style>
