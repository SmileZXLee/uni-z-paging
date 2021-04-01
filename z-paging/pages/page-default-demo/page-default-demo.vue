<!-- 这个示例演示了使用页面自带的下拉刷新和onReachBottom事件结合使用的情况（使用页面滚动） -->
<template>
	<view class="content">
		<tabs-view @change="tabChange" :items="['测试1','测试2','测试3','测试4']"></tabs-view>
		<!-- 在这种情况下，需要关闭z-paging自带的下拉刷新，同时在pages.json中开启此页面的下拉刷新，因此页面中z-paging没有确定的高度，此时使用了页面的滚动，因此use-page-scroll需要设置为true -->
		<!-- 如果需要使用页面的滚动并且使用自定义的下拉刷新，refresher-enabled需要设置为true(或者不设置，因为默认为true)；use-page-scroll需要设置为true；use-custom-refresher需要设置为true；同时在page.json中关闭此页面自带的下拉刷新；-->
		<z-paging ref="paging" @query="queryList" :refresher-enabled="false" :list.sync="dataList" :use-page-scroll="true">
			<!-- 如果希望其他view跟着页面滚动，可以放在z-paging标签内 -->
			<!-- list数据，建议像下方这样在item外层套一个view，而非直接for循环item，因为slot插入有数量限制 -->
			<view>
				<view class="item" v-for="(item,index) in dataList" :key="index" @click="itemClick(item)">
					<view class="item-title">{{item.title}}</view>
					<view class="item-detail">{{item.detail}}</view>
					<view class="item-line"></view>
				</view>
			</view>
		</z-paging>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataList: [],
				tabIndex: 0,
				refresherStatus: 0
			}
		},
		// 当下拉刷新触发时，手动触发reload方法
		onPullDownRefresh() {
			this.$refs.paging.reload();
		},
		// 当页面滚动到底部时，手动触发doLoadMore方法
		onReachBottom() {
			this.$refs.paging.doLoadMore();
		},
		//如果需要使用页面滚动并且使用自定义下拉刷新，则需要监听页面滚动并将滚动的scrollTop告知z-paging，因为z-paging需要知道当前滚动到什么地方以确认下拉时是否要触发下拉刷新
		/*
		onPageScroll(e) {
			this.$refs.paging.updatePageScrollTop(e.scrollTop)
		},
		*/
		methods: {
			tabChange(index){
				this.tabIndex = index;
				//当切换tab或搜索时请调用组件的reload方法，请勿直接调用：queryList方法！！
				this.$refs.paging.reload();
			},
			queryList(pageNo, pageSize) {
				//组件加载时会自动触发此方法，因此默认页面加载时会自动触发，无需手动调用
				//这里的pageNo和pageSize会自动计算好，直接传给服务器即可
				//模拟请求服务器获取分页数据，请替换成自己的网络请求
				this.$request.queryList(pageNo, pageSize, this.tabIndex + 1, (data) => {
					this.$refs.paging.complete(data);
					//需要手动关闭页面的下拉刷新
					uni.stopPullDownRefresh();
				})
			},
			itemClick(item) {
				console.log('点击了', item.title);
			}
		}
	}
</script>

<style>
	/* 这种情况无需确定z-paging的高度，内部元素会自动将其撑高，当滚动到页面底部时，
	需手动调用doLoadMore方法，因为z-paging未固定高度时，其内部的scroll-view的scrolltolower事件无法被触发 */
	.item {
		position: relative;
		height: 150rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0rpx 30rpx;
	}

	.item-detail {
		padding: 5rpx 15rpx;
		border-radius: 10rpx;
		font-size: 28rpx;
		color: white;
		background-color: #007AFF;
	}

	.item-line {
		position: absolute;
		bottom: 0rpx;
		left: 0rpx;
		height: 1px;
		width: 100%;
		background-color: #eeeeee;
	}
</style>
