<!-- 长列表演示(传统写法)(vue) -->
<!-- 用于和虚拟列表性能进行对比 -->
<template>
	<view class="content">
		<view class="top">
			<z-tabs @change="tabChange" :list="tabList"></z-tabs>
		</view>
		<view class="list">
			<view class="item" v-for="(item,index) in dataList" :key="index">
				<image class="item-image" mode="aspectFit" src="@/static/boji1.png"></image>
				<view class="item-content">
					<text class="item-title">第{{index + 1}}行</text>
					<text style="color: red;margin-left: 10rpx;">虚拟列表展示</text>
					<view class="item-detail">{{item.detail}}</view>
				</view>
				<view class="item-line"></view>
			</view>
			<view class="loading-more">
				加载中...
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pageNo: 1,
				tabList: ['cell高度固定','cell高度动态'],
				tabIndex: 0,
				dataList: []
			}
		},
		onLoad(){
			this.queryList();
		},
		onReachBottom() {
			this.pageNo++;
			this.queryList();
		},
		methods: {
			tabChange(index) {
				this.tabIndex = index;
				this.pageNo = 1;
				this.queryList();
			},
			queryList() {
				const params = {
					pageNo: this.pageNo,
					pageSize: 1000,
					random: this.tabIndex === 1
				}
				this.$request.queryListLong(params).then(res => {
					if(this.pageNo === 1){
						this.dataList = res.data.list;
					}else{
						this.dataList = [...this.dataList, ...res.data.list];
					}
				})
			},
		}
	}
</script>

<style>
	.top{
		position: fixed;
		top: 80rpx;
		background-color: white;
		z-index: 1000;
	}
	.list{
		margin-top: 80rpx;
	}
	.item {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 30rpx;
	}
	
	.item-content{
		flex: 1;
		margin-left: 20rpx;
	}
	
	.header{
		background-color: red;
		font-size: 24rpx;
		text-align: center;
		padding: 20rpx 0rpx;
		color: white;
	}
	
	.item-image{
		height: 150rpx;
		width: 150rpx;
		background-color: #eeeeee;
		border-radius: 10rpx;
	}
	
	.item-title{
		background-color: red;
		color: white;
		font-size: 26rpx;
		border-radius: 5rpx;
		padding: 5rpx 10rpx;
	}
	
	.item-detail {
		margin-top: 10rpx;
		border-radius: 10rpx;
		font-size: 28rpx;
		color: #aaaaaa;
		word-break: break-all;
	}

	.item-line {
		position: absolute;
		bottom: 0rpx;
		left: 0rpx;
		height: 1px;
		width: 100%;
		background-color: #eeeeee;
	}
	.loading-more{
		height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		color: #aaaaaa;
	}
</style>
