<!-- 这个文件是虚拟列表中的实际cell -->
<template>
	<view class="item">
		<image class="item-image" mode="aspectFit" src="@/static/boji1.png"></image>
		<view class="item-content">
			<text class="item-title">第{{index + 1}}行</text>
			<text style="color: red;margin-left: 10rpx;" @click.stop="titleClick(`第${index + 1}行 虚拟列表展示`)">虚拟列表展示</text>
			<view class="item-detail">{{item.detail}}</view>
		</view>
		<view class="item-line"></view>
	</view>
</template>

<script>
	export default {
		name:"virtual-list-test-cell",
		props: {
			item: null,
			index: 0,
			extraData: null
		},
		data() {
			return {
				
			};
		},
		methods: {
			titleClick(title){
				//如果要把点击事件传给页面，可以通过给extraData中添加对应的函数，然后在当前组件中触发这个函数，在页面中监听即可
				if(this.extraData.titleClickedCallback){
					this.extraData.titleClickedCallback(title);
				}
			}
		}
	}
</script>

<style scoped>
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
</style>