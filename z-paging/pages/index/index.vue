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
		<view class="demo-view item-green" @click="scrollTabSwiperDemoClick">
			<view>滑动切换选项卡演示</view>
			<view>（使用了uView的tabsSwiper组件）</view>
			<view>scroll-tab-swiper-demo.vue</view>
		</view>
		<view class="demo-view item-purple" @click="pageDefaultDemoClick">
			<view>页面自带下拉刷新和</view>
			<view>onReachBottom事件结合使用示例</view>
			<view>page-default-demo.vue</view>
		</view>
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
				scrollTabSwiperDemoClick(){
					uni.navigateTo({
						url: '../scroll-tab-swiper-demo/scroll-tab-swiper-demo'
					})
				},
				pageDefaultDemoClick(){
					uni.navigateTo({
						url: '../page-default-demo/page-default-demo'
					})
				}
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
		margin-top: 40rpx;
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
	.item-green{
		color: #3f9a03;
		background: linear-gradient(to right, #ffffff 0%, #d5f7be 100%);
		box-shadow: 0 0  20rpx #deebfd;
	}
	.item-purple{
		color: #c306fa;
		background: linear-gradient(to right, #ffffff 0%, #ebbbf9 100%);
		box-shadow: 0 0  20rpx #deebfd;
	}
</style>
