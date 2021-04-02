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
		<view class="demo-view item-blue" @click="scrollTabSwiperDemoClick">
			<view>滑动切换选项卡演示</view>
			<view>（使用了uView的tabsSwiper组件）</view>
			<view>scroll-tab-swiper-demo.vue</view>
		</view>
		<view class="demo-view item-red" @click="pageDefaultDemoClick">
			<view>使用页面滚动示例</view>
			<view>page-default-demo.vue</view>
		</view>
		<view class="demo-view item-blue" @click="stickyDemoClick">
			<view>滚动吸附效果演示</view>
			<view>sticky-demo.vue</view>
		</view>
		<view class="demo-view item-red" @click="chatHistoryDemoClick">
			<view>聊天记录模式演示</view>
			<view>chat-history-demo.vue</view>
		</view>
		<view class="demo-view item-blue" @click="nvueDemoClick">
			<view>nvue演示</view>
			<view>nvue-demo.vue</view>
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
				},
				stickyDemoClick(){
					uni.navigateTo({
						url: '../sticky-and-scroll-tab-demo/sticky-and-scroll-tab-demo'
					})
				},
				chatHistoryDemoClick(){
					uni.navigateTo({
						url: '../chat-history-demo/chat-history-demo'
					})
				},
				nvueDemoClick(){
					uni.navigateTo({
						url: '../nvue-demo/nvue-demo'
					})
				}
			}
		},
		methods: {
			
		}
	}
</script>

<style scoped>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-bottom: 30rpx;
	}
	.demo-view{
		height: 200rpx;
		width: 90%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-radius: 20rpx;
		font-size: 30rpx;
		margin-top: 30rpx;
	}
	.item-blue{
		color: #89b6f7;
		background: linear-gradient(to right, #ffffff 0%, #deebfd 100%);
		box-shadow: 0 0  20rpx #deebfd;
	}
	.item-red{
		background: linear-gradient(to right, #ffffff 0%, #f9d8ce 100%);
		color: #ed9272;
		box-shadow: 0 0  20rpx #f9d8ce;
	}
</style>
