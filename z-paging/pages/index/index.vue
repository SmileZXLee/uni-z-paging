<template>
	<view class="content" style="height: 100%;">
		<z-paging style="width: 100%;height: 100%;" ref="paging" @query="queryList" :refresher-threshold="60"
			:hide-empty-view="true" :mounted-auto-call-reload="false" :use-page-scroll="true">
			<view slot="refresher" style="height: 100%;display: flex;justify-content: center;align-items: center;">
				<image style="width: 300rpx;height: 60rpx;" src="../../static/logo_loading.gif"></image>
			</view>
			<view class="demo-list">
				<view class="demo-item" v-for="(item,index) in list" :key="index" @click="itemClick(item)">
					<view class="demo-item-main">
						<view class="demo-item-title">{{item.title}}</view>
						<view class="demo-item-subtitle" v-if="item.subTitle.length">({{item.subTitle}})</view>
						<view class="demo-item-file">
							<text>{{item.file + '.vue'}}</text>
						</view>
					</view>
					<image class="demo-item-more-img" src="../../static/more_icon.png"></image>
				</view>
			</view>
		</z-paging>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
						title: '普通模式演示',
						file: 'common-demo',
						subTitle: ''
					},
					{
						title: '自定义下拉刷新与上拉加载演示',
						file: 'custom-demo',
						subTitle: ''
					},
					{
						title: '滑动切换选项卡演示',
						file: 'scroll-tab-swiper-demo',
						subTitle: '使用了uView的tabsSwiper组件'
					},
					{
						title: '使用页面滚动示例',
						file: 'page-default-demo',
						subTitle: ''
					},
					{
						title: '滚动吸附效果演示',
						file: 'sticky-demo',
						subTitle: ''
					},
					{
						title: '自定义导航栏演示',
						file: 'custom-nav-demo',
						subTitle: '使用了uView的自定义导航栏组件'
					},
					{
						title: '聊天记录模式演示',
						file: 'chat-history-demo',
						subTitle: ''
					},
					{
						title: 'nvue演示',
						file: 'nvue-demo',
						subTitle: ''
					}
				]
			}
		},
		methods: {
			queryList() {
				// 注意，即使只使用下拉刷新，不使用上拉加载更多，即使下拉不进行网络请求，也要在queryList中调用this.$refs.paging.complete();
				// 以告知z-paging下拉刷新结束，这样才可以开始下一次的下拉刷新
				setTimeout(() => {
					this.$refs.paging.complete();
				}, 1500)
			},
			itemClick(item) {
				uni.navigateTo({
					url: `../${item.file}/${item.file}`
				})
			}
		}
	}
</script>

<style scoped>
	.demo-item {
		display: flex;
		align-items: center;
		border-bottom: #eeeeee solid 1px;
		padding: 20rpx 30rpx;
	}

	.demo-item-main {
		flex: 1;
	}

	.demo-item-main>view:not(:last-child) {
		margin-bottom: 10rpx;
	}

	.demo-item-more-img {
		width: 24rpx;
		height: 24rpx;
	}

	.demo-item-title {
		font-size: 32rpx;
		font-weight: bold;
	}

	.demo-item-subtitle {
		font-size: 26rpx;
		color: #666666;
	}

	.demo-item-file>text {
		background-color: #007AFF;
		color: white;
		font-size: 24rpx;
		padding: 5rpx 10rpx;
		border-radius: 8rpx;

	}
</style>
