<!-- 页面基础容器布局演示 -->
<template>
	<!-- 使用z-paging-layout为根节点可以免计算高度，用于页面基础容器布局 -->
	<z-paging-layout>
		<!-- 顶部固定部分 -->
		<template #top>
			<view class="layout-top">
				<text>这是固定在顶部的view</text>
			</view>
		</template>
		<!-- 底部固定部分 -->
		<template #bottom>
			<view class="layout-bottom">
				<text>这是固定在底部的view</text>
			</view>
		</template>
		<!-- 左侧固定部分 -->
		<template #left>
			<view class="layout-left">
				<text>左侧</text>
			</view>
		</template>
		<!-- 右侧固定部分 -->
		<template #right>
			<view class="layout-right">
				<text>右侧</text>
			</view>
		</template>
		<!-- 中间的普通滚动列表(z-paging-layout默认会在外层包裹scroll-view) -->
		<view class="item" v-for="(item,index) in dataList" :key="index" @click="itemClick(item,index)">
			<view class="item-title">{{item.title}}</view>
			<view class="item-detail">{{item.detail}}</view>
			<view class="item-line"></view>
		</view>
	</z-paging-layout>
</template>

<script>
	export default {
		data() {
			return {
				dataList: []
			}
		},
		mounted() {
			// 模拟普通的列表数据
			let list = [];
			for (let i = 0; i < 20; i++) {
				list.push({
					title: '普通列表数据 ' + (i + 1),
					detail: '详细内容'
				});
			}
			this.dataList = list;
		},
		methods: {
			itemClick(item, index) {
				console.log('点击了', item.title);
			}
		}
	}
</script>

<style scoped>
	.layout-top, .layout-bottom {
		height: 80rpx;
		background-color: #007AFF;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
	}
	.layout-left, .layout-right {
		width: 80rpx;
		height: 100%;
		background-color: #fc8302;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
	}
	.scroll-view-content {
		height: 100%;
	}
	.item {
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
